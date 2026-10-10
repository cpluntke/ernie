// ernie — retired.
//
// The prototype is no longer served. This process answers one page and a health
// check, and nothing else: there is no password to get past, no static file
// handler, no API, and no Anthropic client, so the key cannot be spent even if
// one is still set on the service.
//
// The app itself is still in this repository — the browser code in ./public and
// the server that served it in this file's history — because the point of
// retiring it is to take down the running site, not to delete the work.

import http from 'node:http';

const PORT = Number(process.env.PORT) || 10000;
const REPO = 'https://github.com/cpluntke/ernie';
const CLOSES = '31 October 2026';

const NOTICE = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ernie — discontinued</title>
<meta name="description" content="ernie was an experiment in detecting delirium at home. It has been discontinued.">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📖</text></svg>">
<style>
  :root { --ink:#111827; --soft:#374151; --line:#9ca3af; --primary:#1e40af; }
  * { box-sizing:border-box; }
  body { margin:0; min-height:100vh; background:#e5e7eb; color:var(--ink);
    font-family:system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
    font-size:1.25rem; line-height:1.6; }
  main { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:1.5rem; }
  article { width:100%; max-width:34rem; background:#fff; border:1px solid var(--line);
    border-radius:1.25rem; padding:2rem; box-shadow:0 12px 34px rgba(17,24,39,.22); }
  h1 { font-size:2rem; line-height:1.25; margin:0 0 1rem; }
  p { margin:0 0 1rem; }
  p.soft { color:var(--soft); }
  p:last-child { margin-bottom:0; }
  hr { border:0; border-top:2px solid #e5e7eb; margin:1.5rem 0; }
  a { color:var(--primary); font-weight:700; }
  a:focus-visible { outline:4px solid var(--ink); outline-offset:3px; }
  @media (max-width:420px) { article { padding:1.25rem; } h1 { font-size:1.5rem; } }
</style></head>
<body>
  <main>
    <article>
      <h1>ernie has been discontinued.</h1>
      <p>ernie was an experiment: a daily visit — sign a guest book, answer a few
         things, do a puzzle — that doubled as a check for delirium at home.</p>
      <p>It was a prototype, never a medical device, and it is no longer running.
         There is nothing to sign in to.</p>
      <hr>
      <p><strong>This website will disappear on ${CLOSES}.</strong></p>
      <p class="soft">The code, the design notes and the research behind it stay
         online at <a href="${REPO}">github.com/cpluntke/ernie</a>.</p>
    </article>
  </main>
</body></html>`;

const server = http.createServer((req, res) => {
  let pathname = '/';
  try {
    pathname = new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname;
  } catch { /* a malformed request line still gets the notice */ }

  if (pathname === '/healthz') {
    const body = JSON.stringify({ ok: true, retired: true });
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'content-length': Buffer.byteLength(body) });
    return res.end(body);
  }

  // Everything else is the notice. 410 rather than 404 on the old paths: they
  // did exist, they are gone on purpose, and that is what crawlers should hear.
  res.writeHead(pathname === '/' ? 200 : 410, {
    'content-type': 'text/html; charset=utf-8',
    'content-length': Buffer.byteLength(NOTICE),
    'cache-control': 'no-store'
  });
  res.end(req.method === 'HEAD' ? undefined : NOTICE);
});

server.listen(PORT, '0.0.0.0', () => console.log(`[ernie] retired; serving the notice on 0.0.0.0:${PORT}`));

for (const sig of ['SIGTERM', 'SIGINT']) {
  process.on(sig, () => { console.log(`[ernie] ${sig}, closing`); server.close(() => process.exit(0)); });
}
