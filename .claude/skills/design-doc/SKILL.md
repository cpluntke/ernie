---
name: design-doc
description: Create, update, or review a combined product + engineering design doc in docs/ using the repo's TEMPLATE.md. Covers both project phases, sketch docs and prototype docs, and the mid-way review that selects sketches. Use this whenever the user wants to plan, spec, scope, or write up a feature, flow, screen, or technical change for the ernie prototype, even if they don't say "design doc" — phrases like "let's spec out", "write up the plan for", "how should we build", "document the approach", "update the doc for", "mark X as shipped", "add a sketch for", "which sketches go forward", or "promote X to the prototype" all belong here. Also use it when adding a decision or open question to an existing doc.
---

# Design doc

One doc per feature or slice, covering product design and engineering design
together, so the two stay in sync while we iterate fast. The format lives in
`docs/TEMPLATE.md` and the conventions in `docs/README.md`. Read both before
writing anything so the new doc matches its siblings.

## The two phases

The project runs as a **sketch phase** (many cheap explorations) followed by a
**prototype phase** (the best sketches built into a runnable app for the job
application). The same doc carries an idea through both, so treat the phase
in the header as the main signal for how much detail to write:

- **Sketch docs** are light. Problem, users, goals and non-goals, success
  criteria, and product design get real thought. Engineering (section 6) is
  a few sentences on feasibility and the riskiest unknown; the plan
  (section 7) is N/A. A sketch doc should take minutes to write, because
  its job is to make the sketch worth doing, not to specify a build.
- **Prototype docs** are full. When a sketch is selected, change `Phase` to
  `Prototype` and status to `Building`, fill in sections 6 and 7 properly,
  and log in the Decision log what the sketch taught us and what changed as
  a result. Don't start a new doc; the sketch history is part of the record.

### Mid-way review

When asked which sketches should go forward, or to run the review: read every
sketch doc, fill in section 4.1 (tried / learned / verdict) for each from
what the user reports and what's in `docs/assets/`, set status to `Selected`,
`Parked`, or `Folded into NNNN`, and update the index. Present the verdicts
as a short table with one line of reasoning each so the user can override
before anything is promoted. The prototype must be finishable by the
submission date, so favour fewer, more complete slices over breadth.

## Creating a new doc

1. Check `docs/` for an existing doc on the same topic. If one exists, update
   it instead of creating a second one; forking docs is how they drift.
2. Scaffold with the helper, which picks the next number, copies the
   template, fills the header, and adds a row to the index in `docs/README.md`:

   ```bash
   python3 .claude/skills/design-doc/scripts/new_doc.py "Short title" --owner "@name" --phase Sketch
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

- **Status and phase changes** (sketch: Draft → Sketched → Selected / Parked /
  Folded into NNNN; prototype: Building → Shipped): update the header table
  and the index row in `docs/README.md`.
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
