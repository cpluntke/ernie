# 0005 — Clues from the family

| | |
|---|---|
| **Phase** | Sketch |
| **Status** | Draft |
| **Owner** | @cpluntke |
| **Last updated** | 2026-09-13 |
| **Links** | concept research: [Senior Care Penalty Map](https://claude.ai/code/artifact/d43759e2-23b2-4ea1-beed-57452bcc28b2) |

> A tiny crossword of three or four words where every clue was written by the family member it is about and is shown with their photo. Answers are built from a bank of big letter tiles, never a keyboard.

> **Sketch phase:** fill sections 1–5 and 8–9; leave 6 as a rough note and 7 as
> N/A. **Prototype phase:** fill everything, and record in the Decision log
> what the sketch taught us and what changed.

## 1. Problem

Crosswords are loved by this generation, but generic clues are impersonal,
often hard, and need a keyboard. A clue written by a grandchild ("What did
you call me when I was small?") is a message from a person, and answering it
is retrieval from long-term memory plus the attention and word-finding effort
the delirium tools watch for. How long each clue takes, how many letters get
taken back, and which clues get abandoned are the signals; a solved clue is
also a small conversation with the person who wrote it.

## 2. Users and jobs to be done

- **Who:** the person (80+). Family members write clue and answer pairs
  (three to eight, over time). A caregiver may write the first few.
- **Job (person):** "When I open the puzzle, I want the clues to come from my
  family, so solving it feels like talking to them."
- **Job (family):** "When I think of a memory we share, I want to turn it
  into a clue in a minute, so Grandma has something from me tomorrow."
- **Context:** tablet or phone, one puzzle a day inside Ernie's visit.

## 3. Goals and non-goals

**Goals**
- One clue per screen, with the author's photo and name, the answer slots,
  and a bank of the answer's letters plus two extras as 56 px tiles.
- Tap a tile to place it in the next slot; "Take back a letter" removes the
  last one. No keyboard.
- The small grid is shown as progress, filling in as clues are solved.
- Hints that never dead-end: "Show me the first letter", then "Show me
  Anna's answer".
- Log time per clue, letters taken back, hints used, clues skipped.

**Non-goals** (explicitly out of scope for this iteration)
- Generating a valid crossing grid from arbitrary words. The prototype uses a
  few hand-laid grid shapes for three or four words.
- Across/down numbering. Clues are named by their author, not by number.
- Telling the author when their clue was solved (nice, but a later slice).
- Answers longer than seven letters or with spaces.

## 4. Success criteria

- A tester solves three clues in under four minutes with no spoken help.
- Every clue can be finished with hints; nobody gets stuck.
- Five sessions give a per-clue time series and a taken-back-letters count.
- A family tester writes a clue and answer in under a minute.

### 4.1 Sketch verdict

Filled in at the mid-way review. What we tried, what we learned, and whether
it goes forward.

| Tried | Learned | Verdict (Selected / Parked / Folded into NNNN) |
|-------|---------|-------------------------------------------------|
| | | |

## 5. Product design

### 5.1 User flow

1. Ernie: "Anna, Ben and Ruth wrote you clues today." Primary: "Show me the first clue".
2. Clue page: Anna's photo and name, the clue in large text, the empty slots,
   the letter bank. Tap tiles to fill. Secondary: "Take back a letter",
   "Give me a hint". When the slots are full, primary becomes "Check my answer".
3. Right: "Yes! It's Nana." The grid fills in. Primary: "Next clue".
   Wrong: "Not quite. Take back a letter and try again." Tiles return.
4. After the last clue: "You solved them all!" with the finished grid and
   the three photos. Primary: "Carry on".

Family:
1. "Write a clue for Margaret": a clue field, an answer field, a check that
   the answer fits (letters only, up to seven). Primary: "Send this clue".

### 5.2 Screens and states

| Screen | Purpose | Primary action | States (empty / loading / error / success) |
|--------|---------|----------------|--------------------------------------------|
| Invite | say who wrote clues | Show me the first clue | no clues yet ("Ask Anna to write one"); already solved today |
| Clue | solve one clue | Check my answer | empty slots; partly filled; full; wrong (message, tiles returned); first-letter hint shown; answer shown |
| Solved clue | reward and progress | Next clue | middle clue; last clue leads to Done |
| Done | finished grid | Carry on | all solved; stopped early via Go back ("The rest will be here tomorrow") |
| Family: write | make a clue | Send this clue | empty; answer too long or has a space (plain message) |

Mockups: `docs/assets/0005/` (none yet).

### 5.3 Copy and tone

- Clues are shown as speech: "Anna asks: What did you call me when I was small?"
- "Take back a letter", "Give me a hint", "Show me Anna's answer", "Check my answer".
- Wrong answer copy never says "wrong": "Not quite. Take back a letter and try again."
- Never "Submit", "Enter", "Across", "Down".

### 5.4 Accessibility and edge cases

Checklist from `docs/research/design-criteria-80-plus.md` section 3:

- [ ] One primary action per screen; ≤ 5 tappable things. **Known
  deviation:** the letter bank has up to nine tiles. They are one control,
  each a 56 px target with gaps, and the instruction says what to do.
- [x] Every target ≥ 48 px with visible gaps
- [x] Tap-only; no gesture is the sole path
- [x] Body text ≥ 18 px; clue text 24 px; tiles 24 px bold
- [x] Text contrast ≥ 7:1; a placed tile is filled and also removed from the bank
- [x] Every icon has a text label
- [x] No web jargon; labels say what happens
- [x] Undo or back from every screen; "Take back a letter" is the undo
- [x] Errors are plain, local, and say how to fix
- [x] Nothing moves, times out, or disappears on its own
- [x] Anything audible has a visual equivalent (no sound)
- [x] A helper/caregiver writes the clues; the person never types

Edge cases: two identical letters in an answer (bank has both); a clue the
person cannot recall at all (hint path ends with the answer shown, logged as
"shown"); accented letters (normalised at setup); a very short answer of two
letters still gets two extras.

## 6. Engineering design

### 6.1 Approach

Rough note. Data is a list of `{author, photo, clue, answer}`. The grid is
one of a few hand-laid shapes for 3 or 4 words chosen by answer lengths and
shared letters; if no shape fits, the clues are still played one by one and
the grid is shown as a simple list of solved words. The bank is the answer's
letters plus two random extras, shuffled. Timing and taps are logged as in
0004. **Riskiest unknown:** finding grid shapes that fit real family answers
often enough for the crossword to look like a crossword; the fallback list
keeps the sketch testable either way.

### 6.2 Data model

N/A at sketch depth. Sketch: `{ day, clues: [{author, clue, answer, solvedAt, takenBack, hints}], gridShape }`.

### 6.3 API / interfaces

N/A.

### 6.4 Key decisions and alternatives

| Decision | Chosen | Alternatives considered | Why |
|----------|--------|-------------------------|-----|
| Input | letter bank of tiles | on-screen keyboard, voice | a keyboard is 26 small targets; the bank is a handful of big ones |
| Structure | one clue per screen, grid as progress | whole grid with all clues | one task per screen; the grid is a reward, not the workspace |
| Grid | hand-laid shapes, list fallback | crossword generator | buildable in the hour; the sketch tests the clue experience, not the layout |

### 6.5 Dependencies and risks

N/A.

### 6.6 Testing and rollout

N/A.

## 7. Plan

N/A.

## 8. Open questions

| Question | Owner | Needed by |
|----------|-------|-----------|
| Should authors be told when their clue was solved, and what the person answered? | @cpluntke | mid-way review |
| How many clues per day: three fixed, or all new ones since yesterday? | @cpluntke | mid-way review |
| Is the crossword grid worth keeping, or is "three clues from the family" enough without it? | @cpluntke | mid-way review |

## 9. Decision log

Newest first. Record what changed and why, so the doc stays a living record.

| Date | Change | Reason |
|------|--------|--------|
| 2026-09-13 | Created | Brainstorm pick: the most personal word game; retrieval and word-finding signals |
