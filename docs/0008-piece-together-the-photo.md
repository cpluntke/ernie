# 0008 — Piece together the photo

| | |
|---|---|
| **Phase** | Sketch |
| **Status** | Draft |
| **Owner** | @cpluntke |
| **Last updated** | 2026-09-13 |
| **Links** | concept research: [Senior Care Penalty Map](https://claude.ai/code/artifact/d43759e2-23b2-4ea1-beed-57452bcc28b2); baseline method shared with [0002](0002-sign-the-guest-book.md); capture via [0007](0007-data-capture-and-analysis.md) |

> A small jigsaw, up to 20 tiles, solved by tapping a piece and then the place it goes. Any photo will do for the sketch; family photos come later. The search for each piece is an attention task, the assembly is a visuospatial task, and the order and the wrong tries show how organised the person's thinking is today.

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

- **Who:** the person (80+). A caregiver sets the number of pieces. For the
  sketch the photo is any pleasant picture; later a family member supplies them.
- **Job:** "When I have ten quiet minutes, I want to put a picture of my
  family back together, so I have something calm to do that ends with a
  face I love."
- **Context:** tablet or phone, once a day inside Ernie's visit or on its
  own. Tablets are far better here; phones cap the piece count.

## 3. Goals and non-goals

**Goals**
- A photo cut into square tiles, from 4 up to 20 (2×2, 2×3, 3×3, 3×4, 4×4,
  4×5), each at least 56 px, laid out shuffled below an outlined board.
- Tap a piece, then tap the place it goes. No dragging required; drag is an
  optional extra for those who like it, and its path is logged if used.
- A wrong placement is never punished: "Not there. Try another spot", and
  the piece goes back.
- Fixed difficulty across days so the person's own baseline holds; the
  caregiver changes it deliberately, not the app.
- Log per piece: time to place, wrong tries, tap precision, and the order
  of placement; per session: time to first move, pauses, completion.

**Non-goals** (explicitly out of scope for this iteration)
- Interlocking piece shapes, rotation, or sliding puzzles.
- More than 20 pieces, interlocking shapes, rotation.
- Family photos and the "Who is in this photo?" recognition question. For
  the sketch any photo will do (a bundled landscape or a pet); the family
  photo and recognition item are a later slice once 0007's setup exists.
- A visible timer, score, or "best time".

## 4. Success criteria

- A tester completes a 12-piece puzzle unaided in under four minutes on a
  phone and a 20-piece one on a tablet.
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

1. Ernie: "Shall we put a picture back together?" Primary: "Yes, let's do it".
2. Puzzle page: an outlined board with empty slots above, the shuffled
   pieces below. Instruction line: "Tap a piece." After a tap the piece is
   outlined and the line says "Now tap where it goes." Correct: the piece
   snaps in and stays. Wrong: "Not there. Try another spot." and it returns.
   Secondary: "Show me where this goes" outlines the slot for the selected piece.
3. Complete: the whole photo appears without lines. "You did it!"
   Primary: "Carry on". "Go back" at any time ends the session;
   the pieces placed so far are kept for tomorrow.

### 5.2 Screens and states

| Screen | Purpose | Primary action | States (empty / loading / error / success) |
|--------|---------|----------------|--------------------------------------------|
| Invite | offer the puzzle | Yes, let's do it | already done today; puzzle half done from yesterday ("Carry on with yesterday's?") |
| Puzzle | assemble | tap piece, tap slot | nothing selected; piece selected; wrong spot (message, piece returns); piece placed; hint shown; complete |
| Thank you | close | Carry on | completed; stopped early ("We'll keep your pieces for tomorrow") |

Mockups: [design canvas](https://claude.ai/code/artifact/af136106-64b8-4f09-9c01-c72566a96102) with four screens (invite, puzzle at 12 pieces on a phone, done, puzzle at 20 pieces on a tablet with a hint shown). Sources in `docs/assets/0008/`; regenerate with `python3 docs/assets/0008/gen.py`.

### 5.3 Copy and tone

- "Tap a piece." / "Now tap where it goes." / "Not there. Try another spot."
- "Show me where this goes", not "Hint".
- "You did it!" and the photo, no time shown.

### 5.4 Accessibility and edge cases

Checklist from `docs/research/design-criteria-80-plus.md` section 3:

- [ ] One primary action per screen; ≤ 5 tappable things. **Known
  deviation:** up to 20 pieces plus 20 slots. The board and the tray are
  two controls, each cell a 56 px target with gaps, and the instruction
  line always says the one thing to do next. At most 4 columns on phones
  (4×3 or 4×4), so the board fits 400 px; the page scrolls vertically
  between board and tray, never sideways.
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
indistinguishable, so the bundled sketch photo is busy and evenly detailed; portrait vs landscape boards; a piece tapped onto an occupied
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

Search time and lapses map to the core attention feature; perseveration
and order coherence to disorganised thinking; wrong tries and precision to
the visuospatial severity item. Difficulty must stay fixed for the baseline
to hold; a change of piece count starts a new baseline. With 12 to 20
pieces there are enough placements per session for order coherence and
search-time variability to be meaningful. **Riskiest unknown:** whether
20 tiles from one photo stay distinguishable at 56 px on a phone, and how
long a session gets at that size for this audience.

### 6.2 Data model

N/A at sketch depth. Sketch: `{ day, photoId, pieces, taps: [{t, piece, slot, result}], dragPaths, placedOrder, features }`.

### 6.3 API / interfaces

N/A. Events `jigsaw.shown`, `jigsaw.tap`, `jigsaw.placed`, `jigsaw.hint`, `jigsaw.completed` in 0007's stream.

### 6.4 Key decisions and alternatives

| Decision | Chosen | Alternatives considered | Why |
|----------|--------|-------------------------|-----|
| Moving a piece | tap piece, tap slot; drag optional | drag only; sliding puzzle | drag is the highest-error gesture for this group; sliding puzzles need planning most people find frustrating |
| Piece shape | square tiles | interlocking shapes | shapes add nothing to the signal and a lot to the build; tiles keep targets large and rectangular |
| Picture | any bundled photo for the sketch; family photos later | family photo from day one | the sketch tests the mechanics and the signal, not the social payload; family photos need 0007's setup |
| Piece count | 4 to 20, caregiver-set | up to 9; unlimited | 20 gives enough placements per session for order and variability measures while staying under ten minutes |
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
| Default piece count for the sketch: 12 on phones, 20 on tablets? | @cpluntke | before build |
| Keep half-finished puzzles overnight, or reset each day so every session is comparable? | @cpluntke | mid-way review |

## 9. Decision log

Newest first. Record what changed and why, so the doc stays a living record.

| Date | Change | Reason |
|------|--------|--------|
| 2026-09-13 | Mockups drawn on the ernie-ui tokens; 20 tiles stay distinguishable on a tablet, plain-sky tiles are the weak spot | Owner asked to see it |
| 2026-09-13 | Any photo for the sketch; cap raised to 20 tiles; family photo and recognition question deferred | Owner review |
| 2026-09-13 | Created | Owner asked for a jigsaw idea; adds visuospatial and strategy signals no other sketch has |
