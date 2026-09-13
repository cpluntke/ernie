# 0004 — Find the family

| | |
|---|---|
| **Phase** | Sketch |
| **Status** | Draft |
| **Owner** | @cpluntke |
| **Last updated** | 2026-09-13 |
| **Links** | concept research: [Senior Care Penalty Map](https://claude.ai/code/artifact/d43759e2-23b2-4ea1-beed-57452bcc28b2) |

> A word search where the hidden words are the people, pets and places in the person's own life. Finding them is a visual search task, which is the core attention feature of every delirium screen, dressed as a puzzle.

> **Sketch phase:** fill sections 1–5 and 8–9; leave 6 as a rough note and 7 as
> N/A. **Prototype phase:** fill everything, and record in the Decision log
> what the sketch taught us and what changed.

## 1. Problem

Inattention is the one feature every delirium instrument requires, and the
bedside version (squeeze on every "A") is dull and obviously a test. Visual
search measures the same thing. Word searches are a puzzle this generation
already does for pleasure, and when the words are the names of grandchildren
the puzzle is also a memory cue and a small daily reminder of who is out
there. No home tool measures attention day to day today.

## 2. Users and jobs to be done

- **Who:** the person (80+). A family member or caregiver enters the word
  list once: three to six short names of people, pets, streets.
- **Job:** "When I have a quiet moment, I want a puzzle that's about my own
  people, so it feels like mine and not like a test."
- **Context:** tablet or phone, once a day inside Ernie's visit or whenever
  they like. Sometimes at 200% zoom.

## 3. Goals and non-goals

**Goals**
- A 6×6 grid with three or four hidden words, big letters, big cells.
- Claim a word with two taps: first letter, then last letter. No dragging.
- The list of words to find shows each person's photo, so finding them is a
  small reward.
- Difficulty is a single lever (grid size, distractor letters, word
  direction) so day-to-day results stay comparable.
- Log time to find each word, taps that were not part of a word, taps
  between finds, hints used, and words given up on.

**Non-goals** (explicitly out of scope for this iteration)
- Diagonal or backwards words at the default difficulty.
- Competitive scores, streaks, or leaderboards.
- Typing of any kind.
- Names longer than the grid. Setup asks for first names or nicknames.

## 4. Success criteria

- A tester finds all words unaided in under three minutes at default difficulty.
- Five sessions give a per-word time series and a false-tap count per day.
- The grid stays fully visible with no horizontal scroll at phone width and
  at 200% zoom on desktop.

### 4.1 Sketch verdict

Filled in at the mid-way review. What we tried, what we learned, and whether
it goes forward.

| Tried | Learned | Verdict (Selected / Parked / Folded into NNNN) |
|-------|---------|-------------------------------------------------|
| | | |

## 5. Product design

### 5.1 User flow

1. Ernie: "Shall we find the family today? Anna, Ben and Ruth are hiding."
   Primary: "Yes, let's find them".
2. Puzzle page: the three names with photos across the top, the grid below.
   Tap the first letter (it is outlined and the page says "Now tap the last
   letter of the word"). Tap the last letter. If it is a word, the letters
   fill in and the photo lights up with "Found Anna!". If not, "That's not
   one of them. Try again." and the outline clears.
   Secondary: "Give me a hint" outlines the first letter of a word not yet found.
3. All found: "You found everyone!" with the three photos. Primary: "Carry on".
   "Go back" at any time ends the session early; that is recorded, not scolded.

### 5.2 Screens and states

| Screen | Purpose | Primary action | States (empty / loading / error / success) |
|--------|---------|----------------|--------------------------------------------|
| Invite | say who is hiding | Yes, let's find them | no words set up ("Ask Anna to add some names"); already played today |
| Puzzle | find the words | tap letters | nothing selected; first letter selected; wrong pair (plain message, clears); word found; hint shown; all found |
| Done | reward | Carry on | all found; stopped early (from Go back: "See you tomorrow") |
| Setup (helper) | enter words | Save these names | empty; 1–6 names; name too long ("Please use a shorter name or nickname, up to 6 letters") |

Mockups: `docs/assets/0004/` (none yet).

### 5.3 Copy and tone

- "Anna, Ben and Ruth are hiding" / "Found Anna!" / "You found everyone!"
- Instruction lives on the puzzle page and changes with state: "Tap the
  first letter of a name" then "Now tap the last letter".
- Wrong pair: "That's not one of them. Try again." Never "Incorrect", never red alone.
- "Give me a hint", not "Hint". "Go back" ends the game, no confirm needed
  because nothing is lost.

### 5.4 Accessibility and edge cases

Checklist from `docs/research/design-criteria-80-plus.md` section 3:

- [ ] One primary action per screen; ≤ 5 tappable things. **Known
  deviation:** the grid is 36 cells. It is one control, each cell is a 56 px
  target with an 8 px gap, and the instruction line says what to tap next.
  Grid capped at 6×6 on phones so it fits 400 px with gutters.
- [x] Every target ≥ 48 px with visible gaps
- [x] Tap-only; no gesture is the sole path (two taps replace the usual drag)
- [x] Body text ≥ 18 px; letters 24 px bold; at 200% zoom the grid scales to the width, never scrolls sideways
- [x] Text contrast ≥ 7:1; found words are filled and also listed as found with a check mark and word
- [x] Every icon has a text label
- [x] No web jargon; labels say what happens
- [x] Undo or back from every screen; a wrong first tap is cleared by tapping it again or by the next pair
- [x] Errors are plain, local, and say how to fix
- [x] Nothing moves, times out, or disappears on its own; timing is silent
- [x] Anything audible has a visual equivalent (no sound)
- [x] A helper/caregiver enters the names; the person never types

Edge cases: two names sharing letters that cross; a name that appears twice by
accident in filler letters (filler avoids forming any listed name); very
short names ("Bo") are still two taps; one name only is allowed.

## 6. Engineering design

### 6.1 Approach

Rough note. A generator places three or four words left-to-right or
top-to-bottom in an N×N grid without overlap, then fills the rest with
uppercase letters, rejecting any fill that spells a listed word. Claiming
is two taps compared against the placed words. All taps are logged with
timestamps. Difficulty 1–100 maps to grid size (5–8), number of words
(2–4), and, above 70, allowing overlaps and downward-only words. **Riskiest
unknown:** legibility and target size of the grid at 200% zoom on a phone;
may need a 5×5 default there.

### 6.2 Data model

N/A at sketch depth. Sketch: `{ day, difficulty, grid, words: [{word, photo, foundAt}], taps: [{cell, t, result}] }`.

### 6.3 API / interfaces

N/A.

### 6.4 Key decisions and alternatives

| Decision | Chosen | Alternatives considered | Why |
|----------|--------|-------------------------|-----|
| Claiming a word | tap first letter, then last | drag across letters, tap every letter | drag is the highest-error gesture for this group; two taps is enough to identify a word |
| Grid size | 6×6 default | 8×8, 10×10 | 56 px cells with gaps must fit 400 px |
| Reward | photo lights up | points, confetti | social payload, no motion |

### 6.5 Dependencies and risks

N/A.

### 6.6 Testing and rollout

N/A.

## 7. Plan

N/A.

## 8. Open questions

| Question | Owner | Needed by |
|----------|-------|-----------|
| Names up to 6 letters, or allow 7 with a 7×7 grid on tablets? | @cpluntke | mid-way review |
| Should the difficulty lever move on its own over days, or be set by the caregiver? | @cpluntke | mid-way review |
| Does giving up on a word show the answer, or leave it hidden for tomorrow? | @cpluntke | mid-way review |

## 9. Decision log

Newest first. Record what changed and why, so the doc stays a living record.

| Date | Change | Reason |
|------|--------|--------|
| 2026-09-13 | Created | Brainstorm pick: an attention task that is a real puzzle and personal |
