# ernie — the daily visit

One web service: the app, and a small endpoint that reads the person's chat
replies with Claude. Stitches together the three sketches:

| Step | Sketch |
|---|---|
| Sign the guest book to come in | [0002](../../docs/0002-sign-the-guest-book.md) |
| A short chat from the clinician's runbook | [0006](../../docs/0006-coherence-chat.md), [0009](../../docs/0009-clinician-runbook.md) |
| A puzzle, alone or with Anna | [0008](../../docs/0008-piece-together-the-photo.md) |

The **Backend view** button in the demo strip shows everything the visit
collected: the signature features and the robust-z comparison, the chat
answers and the language underneath, the puzzle statistics, the runbook
editor, and the event stream. The person never sees any of it.

## Running it

```bash
cd packages/app
npm install
ANTHROPIC_API_KEY=sk-ant-... npm start     # http://localhost:10000
```

Without a key the site still serves and the chat falls back to its tap-only
widgets, so a first deploy never fails on a missing key.

| Variable | Default | What it does |
|---|---|---|
| `PORT` | `10000` | what Render sets |
| `ANTHROPIC_API_KEY` | unset | enables reading chat replies |
| `ERNIE_MODEL` | `claude-sonnet-5` | the model that reads replies |
| `ERNIE_EFFORT` | `low` | effort level; the reads are short and tightly specified |
| `ERNIE_PASSWORD` | `bert` | the shared password on the way in |

## The password on the way in

Everything but `GET /healthz` sits behind one shared password. It is a door,
not a lock: it keeps the prototype off the open web while it is being
reviewed, and it stops a passer-by spending the API key on `/api/interpret`.
It is not protecting anything secret, and everyone who is meant to see it has
the same password.

It is checked on the server, not in the browser, because a password checked in
the browser is written in the page for anyone who looks — and because a client
check leaves the API route open anyway. A correct password sets an `HttpOnly`,
`SameSite=Lax` cookie holding a hash of it, for a week; the comparison is
constant time and shares the per-address rate limit with `/api/interpret`, so
it cannot be guessed a character at a time or hammered.

Change it by setting `ERNIE_PASSWORD` on the service. Everyone's cookie stops
working when you do, which is how you revoke it.

## Deploying on Render

The service is Docker, building `./Dockerfile` from the repository root.
Two things the build needs, both of which have already caught us out:

- **The branch.** Render deploys the branch configured on the service. A
  branch without `Dockerfile` at the root fails with
  `failed to read dockerfile: open Dockerfile: no such file or directory`.
- **`zod`.** It is an optional peer dependency of `@anthropic-ai/sdk`, but
  the SDK's ESM entry re-exports its zod helper, so the bare import throws
  under `npm install --omit=dev` unless `zod` is a real dependency. It is
  pinned in `package.json` for exactly that reason. Without it the site
  still serves and the chat quietly falls back to buttons, which is the
  worst kind of failure: green deploy, missing feature.

## Routes

| Route | What it is |
|---|---|
| `GET /` | the app, or the password page when not signed in |
| `GET /healthz` | liveness — the one route outside the password |
| `POST /api/login` | `password=…` → the cookie |
| `GET /api/config` | whether a reader is configured, and which model |
| `POST /api/interpret` | `{question, spec, reply}` → the structured reading |

The client never sends a prompt, only the item and the reply; the server
composes the prompt. That keeps the key from being spent on arbitrary text
and keeps the wording in one place.
