# ernie

Prototype web app built for a job application submission.

## Project shape

- **Deliverable:** a runnable **web** prototype. Concept is still being
  decided; do not invent product goals until the owner provides them.
- **Users are adults 80+.** Design criteria and a per-sketch checklist are in
  `docs/research/design-criteria-80-plus.md`; apply them to every screen.
- **Two phases.** Sketch phase first (many cheap explorations), a mid-way
  review picks the ones that worked, then a prototype phase builds those into
  the submission. See `docs/README.md`.
- **Design docs** live in `docs/`, one per feature or slice, combining product
  and engineering design. Use the `design-doc` skill (or
  `.claude/skills/design-doc/scripts/new_doc.py`) to create and update them
  so numbering, phase, and the index stay consistent.

## Before every PR that touches UI

Run the `ux-critic` subagent (via `/ux-critique <url>` or the Agent tool)
on every page the branch changed. It audits the running page with
Playwright and axe-core against the 80+ criteria and returns a ranked list.

- Fix every **Blocker** and **High** item, re-run until the verdict is
  `OK TO SUBMIT`, then open the PR.
- Paste the final critique (verdict, remaining Medium/Low items, and
  "What works") into the PR description.
- Never open a PR with a `BLOCK` or `FIX BEFORE PR` verdict.

The script alone can be run with `node tools/ux-audit/audit.mjs <url>`; see
`tools/ux-audit/README.md`.

## Working style

- Small, shippable slices over breadth; the prototype must be finishable by
  the submission date.
- Docs are living records: edit in place, log changes in the decision log.
