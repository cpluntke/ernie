# Docs

Design docs for the ernie prototype. Each doc covers **both** product design and
engineering design for one feature or slice, in one file, so we can iterate on
the two together instead of keeping them in sync.

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
- **Status lifecycle:** `Draft` → `In review` → `Building` → `Shipped` →
  `Superseded by NNNN`. Update the status line in the header when it changes.
- **Sketches and mockups** live in `docs/assets/NNNN/` and are linked from the
  doc. Low-fidelity is fine; a photo of a whiteboard counts.
- **Open questions are first-class.** Anything unresolved goes in Open
  questions with an owner. Resolving one moves it to the Decision log.

## Index

| # | Doc | Status |
|---|-----|--------|
| — | _none yet_ | |
