# 0008 — Piece together the photo

| | |
|---|---|
| **Phase** | Sketch |
| **Status** | Draft |
| **Owner** | @cpluntke |
| **Last updated** | 2026-09-13 |
| **Links** | concept research: [Senior Care Penalty Map](https://claude.ai/code/artifact/d43759e2-23b2-4ea1-beed-57452bcc28b2); baseline method shared with [0002](0002-sign-the-guest-book.md); capture via [0007](0007-data-capture-and-analysis.md) |

> A small jigsaw made from a family photo, solved by tapping a piece and then the place it goes. The search for each piece is an attention task, the assembly is a visuospatial task, and the order and the wrong tries show how organised the person's thinking is today.

> **Sketch phase:** fill sections 1–5 and 8–9; leave 6 as a rough note and 7 as
> N/A. **Prototype phase:** fill everything, and record in the Decision log
> what the sketch taught us and what changed.

## 1. Problem

Jigsaws are a familiar, unhurried pleasure for this generation, and they
exercise several things at once: searching for the right piece (attention),
seeing where it fits (visuospatial construction, the figure-copy item on the
delirium severity scales), and working in a sensible order (organised
thinking). Jigsaw puzzling has been shown to draw on multiple visuospatial
abilities at once (Fissler et al., 2018). None of the other sketches gives
a visuospatial or a strategy signal, and no home tool measures either.

## 2. Users and jobs to be done

- **Who:** the person (80+). A family member supplies photos; a caregiver
  sets the number of pieces.
- **Job:** "When I have ten quiet minutes, I want to put a picture of my
  family back together, so I have something calm to do that ends with a
  face I love."
- **Context:** tablet or phone, once a day inside Ernie's visit or on its
  own. Tablets are far better here; phones cap the piece count.

## 3. Goals and non-goals

**Goals**
- A photo cut into square tiles (4, 6 or 9), each at least 56 px, laid out
  shuffled beside an outlined board.
- Tap a piece, then tap the place it goes. No dragging required; drag is an
  optional extra for those who like it, and its path is logged if used.
- A wrong placement is never punished: "Not there. Try another spot", and
  the piece goes back.
- Fixed difficulty across days so the person's own baseline holds; the
  caregiver changes it deliberately, not the app.
- After completion, one question: "Who is in this photo?" with three
  large name buttons, which is the picture-recognition item from CAM-ICU.
- Log per piece: time to place, wrong tries, tap precision, and the order
  of placement; per session: time to first move, pauses, completion.

**Non-goals** (explicitly out of scope for this iteration)
- Interlocking piece shapes, rotation, or sliding puzzles.
- More than nine pieces.
- Uploading photos from the person's device; photos come from the family
  setup in 0007.
- A visible timer, score, or "best time".

## 4. Success criteria

- A tester completes a 6-piece puzzle unaided in under three minutes on a
  phone and a 9-piece one on a tablet.
- Five sessions at fixed difficulty give a per-session series for search
  time, wrong tries, and placement order.
- Wrong tries never produce a dead end; the hint path always finishes the puzzle.

### 4.1 Sketch verdict

Filled in at the mid-way review. What we tried, what we learned, and whether
it goes forward.

| Tried | Learned | Verdict (Selected / Parked / Folded into NNNN) |
|-------|---------|-------------------------------------------------|
| | | |

## 5. Product design

### 5.1 User flow

1. Ernie: "Anna sent a photo. Shall we put it back together?" Primary:
   "Yes, let's do it".
2. Puzzle page: an outlined board with empty slots above, the shuffled
   pieces below. Instruction line: "Tap a piece." After a tap the piece is
   outlined and the line says "Now tap where it goes." Correct: the piece
   snaps in and stays. Wrong: "Not there. Try another spot." and it returns.
   Secondary: "Show me where this goes" outlines the slot for the selected piece.
3. Complete: the whole photo appears without lines. "You did it!" then
   "Who is in this photo?" with three name buttons and "I'm not sure".
4. Thank you. Primary: "Carry on". "Go back" at any time ends the session;
   the pieces placed so far are kept for tomorrow.

### 5.2 Screens and states

| Screen | Purpose | Primary action | States (empty / loading / error / success) |
|--------|---------|----------------|--------------------------------------------|
| Invite | name the photo's sender | Yes, let's do it | no photos set up ("Ask Anna to send a photo"); already done today; puzzle half done from yesterday ("Carry on with yesterday's?") |
| Puzzle | assemble | tap piece, tap slot | nothing selected; piece selected; wrong spot (message, piece returns); piece placed; hint shown; complete |
| Who is this | recognition item | tap a name | asked; answered (no right/wrong shown); "I'm not sure" |
| Thank you | close | Carry on | completed; stopped early ("We'll keep your pieces for tomorrow") |

Mockups: `docs/assets/0008/` (none yet).

### 5.3 Copy and tone

- "Tap a piece." / "Now tap where it goes." / "Not there. Try another spot."
- "Show me where this goes", not "Hint".
- "You did it!" and the photo, no time shown.
- "Who is in this photo?" asked as a friend would; never marked.

### 5.4 Accessibility and edge cases

Checklist from `docs/research/design-criteria-80-plus.md` section 3:

- [ ] One primary action per screen; ≤ 5 tappable things. **Known
  deviation:** up to nine pieces plus nine slots. The board and the tray
  are two controls, each cell a 56 px target with gaps, and the instruction
  line always says the one thing to do next. Six pieces on phones.
- [x] Every target ≥ 48 px with visible gaps
- [x] Tap-only; drag is optional and never the only path
- [x] Body text ≥ 18 px; at 200% zoom the board scales to the width, tray wraps below
- [x] Text contrast ≥ 7:1; a selected piece is outlined and the instruction names it
- [x] Every icon has a text label
- [x] No web jargon; labels say what happens
- [x] Undo or back from every screen; tapping a selected piece again deselects it
- [x] Errors are plain, local, and say how to fix
- [x] Nothing moves, times out, or disappears on its own; snapping is instant, not animated
- [x] Anything audible has a visual equivalent (no sound)
- [x] A helper/caregiver supplies photos and sets the piece count

Edge cases: photos with large plain areas (sky) make pieces
indistinguishable, so setup crops to faces or the family is told to pick
busy photos; portrait vs landscape boards; a piece tapped onto an occupied
slot (treated as a wrong try); low vision users may need 4 pieces.

## 6. Engineering design

### 6.1 Approach

Rough note. The photo is drawn to a canvas and sliced into an N×N grid of
tiles rendered as buttons with background offsets; no image processing
beyond a centre crop. Placement is tap-select then tap-slot, with an
optional pointer drag that logs its path in 0002's stroke format. Every tap
is an event in 0007's stream. Features per session, compared against the
person's baseline with the robust z method from 0002:

| Feature | What it captures | Compute |
|---|---|---|
| Time to first move | initiation, arousal | first piece tap minus board shown |
| Search time per piece | attention, visual search | slot tap minus previous placement; mean and variability |
| Wrong tries per piece | visuospatial judgement | count of wrong slot taps before the right one |
| Perseveration | disorganised thinking | same piece tried in the same wrong slot twice or more |
| Placement precision | motor control | distance from tap point to slot centre, in slot widths |
| Order coherence | strategy, organised thinking | share of placements adjacent to the previous piece; corners and edges first |
| Lapses | attention | pauses over 8 s with no tap, count and total |
| Hints and abandonment | difficulty, engagement | hints used; stopped early |
| Drag path (if dragged) | tremor, control | straightness (path length over straight line), speed, jitter |
| Recognition | memory | correct name, or "not sure" |

Search time and lapses map to the core attention feature; perseveration
and order coherence to disorganised thinking; wrong tries and precision to
the visuospatial severity item. Difficulty must stay fixed for the baseline
to hold; a change of piece count starts a new baseline. **Riskiest
unknown:** whether six or nine pieces is enough to produce stable per-session
numbers, and whether order coherence means anything with so few pieces.

### 6.2 Data model

N/A at sketch depth. Sketch: `{ day, photoId, pieces, taps: [{t, piece, slot, result}], dragPaths, placedOrder, recognition, features }`.

### 6.3 API / interfaces

N/A. Events `jigsaw.shown`, `jigsaw.tap`, `jigsaw.placed`, `jigsaw.hint`, `jigsaw.completed`, `jigsaw.recognition` in 0007's stream.

### 6.4 Key decisions and alternatives

| Decision | Chosen | Alternatives considered | Why |
|----------|--------|-------------------------|-----|
| Moving a piece | tap piece, tap slot; drag optional | drag only; sliding puzzle | drag is the highest-error gesture for this group; sliding puzzles need planning most people find frustrating |
| Piece shape | square tiles | interlocking shapes | shapes add nothing to the signal and a lot to the build; tiles keep targets large and rectangular |
| Picture | family photo | stock images, paintings | social payload and a recognition item for free; a painting has no one to recognise |
| Difficulty | fixed by the caregiver | adaptive | the signal is deviation at fixed difficulty; adaptivity would erase it |

### 6.5 Dependencies and risks

N/A.

### 6.6 Testing and rollout

N/A.

## 7. Plan

N/A.

## 8. Open questions

| Question | Owner | Needed by |
|----------|-------|-----------|
| Same photo for a week (memory helps, order coherence gets confounded) or a new photo every day (no memory effect, more photos needed)? | @cpluntke | mid-way review |
| Is the "Who is in this photo?" question welcome, or does it feel like a test after a game? | @cpluntke | mid-way review |
| Keep half-finished puzzles overnight, or reset each day so every session is comparable? | @cpluntke | mid-way review |

## 9. Decision log

Newest first. Record what changed and why, so the doc stays a living record.

| Date | Change | Reason |
|------|--------|--------|
| 2026-09-13 | Created | Owner asked for a jigsaw idea; adds visuospatial and strategy signals no other sketch has |
