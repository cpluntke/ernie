# Docs

Design docs for the ernie prototype. Each doc covers **both** product design and
engineering design for one feature or slice, in one file, so we can iterate on
the two together instead of keeping them in sync.

## Constraints

- The submission is a **web** prototype.
- Product concept: _TBD, owner is working on it._
- Target users are adults **80 and older**. Every sketch must pass the
  checklist in [research/design-criteria-80-plus.md](research/design-criteria-80-plus.md).

## Two phases

1. **Sketch phase.** Many small, cheap explorations. Each sketch gets its own
   doc, kept light: problem, users, goals, product design, and a rough note on
   engineering feasibility. Sketches may be paper, static mockups, or throwaway
   code; the point is to learn what works.
2. **Mid-way review.** Every sketch doc gets a verdict in section 4.1:
   `Selected`, `Parked`, or `Folded into NNNN`.
3. **Prototype phase.** Selected sketches move to `Phase: Prototype` in place.
   The engineering sections get filled in properly and the doc drives the
   runnable build submitted with the application. Parked docs stay in the
   index as a record of what was considered.

## Quick start

In Claude Code, run `/design-doc` (or just ask to spec a feature) and the
skill scaffolds a numbered doc from the template and adds it to the index.
To do it by hand:

```bash
python3 .claude/skills/design-doc/scripts/new_doc.py "Short title" --owner @you
```

## Conventions

- **One file per feature or slice.** Copy `TEMPLATE.md` to
  `NNNN-short-title.md` (e.g. `0001-onboarding-flow.md`). Numbers are
  sequential and never reused.
- **Keep it short.** A doc should take under 10 minutes to read. If a section
  doesn't apply, write "N/A" and move on rather than deleting it, so every doc
  has the same shape.
- **Iterate in place.** Update the doc as the design changes; log meaningful
  changes in the Decision log rather than rewriting history. Don't fork a new
  doc for a revision.
- **Phase** is `Sketch` or `Prototype`. A doc changes phase in place when its
  sketch is selected; don't start a second doc for the same idea.
- **Status lifecycle.** Sketch phase: `Draft` → `Sketched` → `Selected` |
  `Parked` | `Folded into NNNN`. Prototype phase: `Building` → `Shipped`.
  `Superseded by NNNN` applies to either. Update the header and the index row
  when it changes.
- **Sketches and mockups** live in `docs/assets/NNNN/` and are linked from the
  doc. Low-fidelity is fine; a photo of a whiteboard counts.
- **Open questions are first-class.** Anything unresolved goes in Open
  questions with an owner. Resolving one moves it to the Decision log.

## Index

| # | Doc | Phase | Status |
|---|-----|-------|--------|
| — | _none yet_ | | |
