# ernie

A daily visit from Ernie: sign his book, answer a few things, do a puzzle if you
fancy one. Underneath, the same few minutes are a delirium screen.

Delirium after a hospital stay is common, it is missed most of the time, and the
kind that gets missed most — hypoactive — looks like someone going quiet rather
than someone in distress. The thing that makes it detectable is that it is a
*change from a person's own baseline*, and nothing at home measures that
baseline. This prototype tries to: a handful of ordinary, pleasant things a
person aged 80+ would do anyway, each of which leaves a trace you can compare to
their own last fortnight.

It is a prototype built for a job application, in a short sitting. It is not a
medical device and makes no diagnosis.

## See it

**https://ernie-o2g3.onrender.com** — password `bert`.

Open it on a phone if you can; on a laptop it renders inside a phone-shaped
frame, because that is what it is. The dark strip along the top is demo
scaffolding, not part of the app: **Backend view** opens a panel showing exactly
what the visit collected and what a server would derive from it.

## The visit

1. **Sign the guest book.** Signing your name is the most practised motor act
   most people have. The pad records the whole stroke path, not the picture:
   time to first stroke, total time, time in the air between strokes, stroke
   count, mean speed, smoothness (log dimensionless jerk), size, and a shape
   distance against your own earlier signatures.
2. **A short chat.** Ernie asks what the clinician's runbook says to ask today.
   Answers are in your own words — Claude reads them, so "sunday saterday" still
   counts and a typo is not scored as an error. What is measured is the language
   itself: coherence, tangentiality, word-finding, and typing rhythm.
3. **A puzzle.** A jigsaw — twelve pieces, or six large ones where the screen is
   too small for twelve to stay comfortably tappable. Placement times, wrong-piece attempts,
   how long before the first move, whether pieces are tried at random or
   searched for.
4. **Goodbye.** Anything the runbook flagged is told to the person plainly, in
   the clinician's own words, and the day is recorded.

The **Backend view** panel shows the derived numbers as you go, including how a
flag would be raised: robust z-scores against a personal median, not a
population norm, with a floor so a very consistent person is not flagged for
ordinary variation.

## Running it locally

Node 22 or newer.

```bash
cd packages/app
npm install
ANTHROPIC_API_KEY=sk-ant-... npm start     # http://localhost:10000
```

The key is optional. Without it the site still serves and the chat falls back to
tap-only widgets, so a first deploy never fails on a missing key — but the
conversational reading is the point of the chat, so set it if you can. There is
more in [`packages/app/README.md`](packages/app/README.md), including the
password on the way in and two deployment traps that cost us time.

## The repository

| Path | What it is |
|---|---|
| [`docs/`](docs/README.md) | One design doc per feature, product and engineering together |
| [`docs/research/`](docs/research/design-criteria-80-plus.md) | The 80+ design criteria everything is held to |
| [`packages/app/`](packages/app/README.md) | The runnable prototype: one Node process, a no-build browser app |
| `packages/ernie-ui/` | The React component kit the design criteria are baked into |
| `tools/ux-audit/` | Playwright + axe-core audit used before every UI change |
| `Dockerfile` | What Render builds |

## Designing for 80+

Every screen is held to
[`docs/research/design-criteria-80-plus.md`](docs/research/design-criteria-80-plus.md):
56px targets, 20px text, 7:1 contrast, one task per screen, tap-only — no
gesture is ever the only way to do something — no timers, no motion, never
colour alone, a way back from every screen, and plain language throughout.

There is a real tension in the middle of this project: the criteria say no
timers and no pressure, while the detection wants reaction times and tremor. The
resolution is that the app never shows a clock and never tells anyone they were
wrong. Everything is measured; nothing is a test you can fail.

## How it was built

Two phases, and the docs carry both. **Sketch phase**: many cheap explorations,
one doc each, most of which will not be built ([`docs/README.md`](docs/README.md)
has the index and the verdicts). **Prototype phase**: the ones that worked get
stitched into the runnable app.

Before a UI change ships, a `ux-critic` subagent drives the running app with
Playwright and axe-core, audits it against the 80+ criteria at five viewport
sizes, and returns a ranked verdict; the rule is that blockers are fixed and it
is re-run until it clears. It is worth reading the pull requests for what it
caught — a seventh weekday option off the
bottom of the screen, so on a Saturday the one correct answer to a scored
question could not be seen; a keypad missing its `0` and its delete key below the
fold; a chat that scrolled the question away above the answers you were meant to
give it.

## What is real and what is staged

Being explicit, since this is a prototype:

- **No server-side store.** Records live in the browser's `localStorage`.
  [`docs/0007`](docs/0007-data-capture-and-analysis.md) designs the real one.
- **The chat reading is real.** Replies go to Claude and come back as structured
  data. The server composes the prompt; the browser only ever sends the question
  and the reply.
- **The signature analysis is real**, and computed in the browser.
- **The baseline is not.** It needs five days of signatures before it can compare
  anything; a fresh visitor sees "building the baseline" instead of a comparison.
- **Anna is mocked.** The jigsaw's "do it with someone" mode plays her moves on
  the same phone rather than over a network.
- **The jigsaw picture is a drawn scene**, not a family photo. Doc 0008 assumes
  real photos arrive from the family.
- **Sketches 0003, 0004 and 0005** — the doodle, the family faces, the
  personalised crossword — are designed but not built.
- **The clinician runbook is editable** in the backend view and two ready-made
  scripts ship with it, but it is a demo panel, not an admin portal.

## Credit

Built with [Claude Code](https://claude.com/claude-code). The clinical framing
comes from the owner's
[Senior Care Penalty Map](https://claude.ai/code/artifact/d43759e2-23b2-4ea1-beed-57452bcc28b2);
the evidence behind the design criteria is sourced at the bottom of
[that document](docs/research/design-criteria-80-plus.md).
