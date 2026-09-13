---
name: design-doc
description: Create, update, or review a combined product + engineering design doc in docs/ using the repo's TEMPLATE.md. Use this whenever the user wants to plan, spec, scope, or write up a feature, flow, screen, or technical change for the ernie prototype, even if they don't say "design doc" — phrases like "let's spec out", "write up the plan for", "how should we build", "document the approach", "update the doc for", or "mark X as shipped" all belong here. Also use it when adding a decision or open question to an existing doc.
---

# Design doc

One doc per feature or slice, covering product design and engineering design
together, so the two stay in sync while we iterate fast. The format lives in
`docs/TEMPLATE.md` and the conventions in `docs/README.md`. Read both before
writing anything so the new doc matches its siblings.

## Creating a new doc

1. Check `docs/` for an existing doc on the same topic. If one exists, update
   it instead of creating a second one; forking docs is how they drift.
2. Scaffold with the helper, which picks the next number, copies the
   template, fills the header, and adds a row to the index in `docs/README.md`:

   ```bash
   python3 .claude/skills/design-doc/scripts/new_doc.py "Short title" --owner "@name"
   ```

3. Fill in the sections from what the user has told you and what the codebase
   shows. Draft-quality is the goal at this stage: a doc that exists today
   and gets refined beats a polished one next week.
4. Show the user the path and the parts you were unsure about, so they can
   correct before anyone builds against it.

## Filling in sections well

The template is deliberately short. Some guidance on the parts people tend
to get wrong:

- **Summary line and Problem** should make sense to someone who has never
  seen the app. Say what the user can't do today, not what we plan to build.
- **Non-goals** are the most useful section for a prototype. Be concrete
  about what we are *not* doing this iteration, because that is what keeps
  scope small enough to ship for the application deadline.
- **Success criteria** should be observable: "a first-time user reaches X in
  under two minutes", not "the onboarding is good".
- **Screens and states**: every screen needs its empty, loading, error, and
  success states thought through. These are the states that get forgotten
  and look unfinished in a demo.
- **Engineering approach**: describe the shape, not every function. Include
  a data model and interface sketch when there is one; skip diagrams unless
  the interaction between parts is non-obvious.
- **Key decisions**: record alternatives you considered and rejected. This
  is what makes the doc worth reading later, and it shows reasoning to
  anyone assessing the work.
- **Sections that don't apply** get "N/A", not deletion. Every doc keeps the
  same shape so it can be skimmed by position.

Mirror the user's own words for product intent; don't invent goals they
didn't state. When you fill a gap by inference, mark it in Open questions
with them as owner rather than presenting it as settled.

## Updating an existing doc

Edit in place. The doc is a living record, so:

- **Status changes** (Draft → In review → Building → Shipped → Superseded by
  NNNN): update the header table and the index row in `docs/README.md`.
- **Meaningful design changes**: make the edit, bump `Last updated`, and add
  a row at the top of the Decision log saying what changed and why. Don't
  rewrite history in the body; the log is what carries it.
- **Resolving an open question**: remove it from Open questions and record
  the answer in the Decision log (or Key decisions if it's an engineering
  choice).
- **Superseding**: set the old doc's status to `Superseded by NNNN` and link
  the new one; don't delete it.

## Reviewing a doc

When asked to review, check for the things that cause rework later:

- Goals and non-goals contradict each other or the summary line.
- Success criteria that can't be observed.
- Screens with no error or empty state.
- Engineering approach that doesn't cover something the user flow requires.
- Open questions with no owner.
- Decisions made in the body that aren't in the decision log.

Report findings briefly, ordered by how much rework each would cause, and
offer to apply the fixes.
