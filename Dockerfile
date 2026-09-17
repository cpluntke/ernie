# ernie — the daily visit, as one web service.
# Render builds this from the repository root (dockerContext ".").
FROM node:22-slim

ENV NODE_ENV=production
WORKDIR /app

# Dependencies first, so a change to the app does not reinstall them.
COPY packages/app/package.json ./package.json
RUN npm install --omit=dev --no-audit --no-fund

COPY packages/app/server.mjs ./server.mjs
COPY packages/app/public ./public

# Render provides PORT; 10000 is its default and what the service exposes.
ENV PORT=10000
EXPOSE 10000

# Run as the image's unprivileged user rather than root.
USER node

CMD ["node", "server.mjs"]
