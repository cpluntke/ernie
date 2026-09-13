# 0008 — Piece together the photo

| | |
|---|---|
| **Phase** | Sketch |
| **Status** | Draft |
| **Owner** | @cpluntke |
| **Last updated** | 2026-09-13 |
| **Links** | concept research: [Senior Care Penalty Map](https://claude.ai/code/artifact/d43759e2-23b2-4ea1-beed-57452bcc28b2); baseline method shared with [0002](0002-sign-the-guest-book.md); capture via [0007](0007-data-capture-and-analysis.md) |

> A small jigsaw, up to 20 interlocking pieces, moved by finger. Pieces click into the board, and onto each other, when they are close. Any photo will do for the sketch; family photos come later. The search for each piece is an attention task, the assembly is a visuospatial task, and the order and the wrong tries show how organised the person's thinking is today.

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
- A photo cut into interlocking jigsaw pieces, 12 on a phone or 20 on a
  tablet (4×3 or 5×4), laid out shuffled below an outlined board with a
  faint ghost of the picture.
- Move a piece with a finger. A generous magnet (45% of a piece) clicks it
  into its slot on the board, or onto a correct neighbour, so precision is
  never required; joined pieces move as one. Snapping is instant, no animation.
- A wrong placement is never punished: a piece that does not click in simply
  stays where it was put. Nothing is said.
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
  phone and a 20-piece one on a tablet, using the touch prototype.
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
2. Puzzle page: the outlined board with a faint ghost of the picture above,
   the shuffled pieces below. Instruction: "Drag a piece onto the picture."
   Close enough and it clicks in and stays; joined neighbours travel
   together. Not close enough and it stays where it was left, nothing said.
   Secondary: "Show me where this goes" outlines the last touched piece and
   its slot until it is placed.
3. Complete: the whole photo appears without lines. "You did it!"
   Primary: "Carry on". "Go back" at any time ends the session;
   the pieces placed so far are kept for tomorrow.

### 5.2 Screens and states

| Screen | Purpose | Primary action | States (empty / loading / error / success) |
|--------|---------|----------------|--------------------------------------------|
| Invite | offer the puzzle | Yes, let's do it | already done today; puzzle half done from yesterday ("Carry on with yesterday's?") |
| Puzzle | assemble | drag a piece | untouched; piece lifted (blue outline, shadow); dropped loose; clicked into board; clicked onto a neighbour; hint shown; complete |
| Thank you | close | Carry on | completed; stopped early ("We'll keep your pieces for tomorrow") |

Mockups: [touch prototype](https://claude.ai/code/artifact/6cd7aafe-d024-47d2-b98c-9bbb43c65609) (open on a phone; source `docs/assets/0008/jigsaw-prototype.html`, a single page with no build step) and the earlier static [design canvas](https://claude.ai/code/artifact/af136106-64b8-4f09-9c01-c72566a96102) with square tiles, kept for the screen layout.

### 5.3 Copy and tone

- "Drag a piece onto the picture." / "The outlined piece goes in the outlined spot." / "3 pieces left"
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
- [ ] Tap-only; drag is optional and never the only path. **Known
  deviation:** the owner chose finger-drag with a magnet as the mechanic.
  The magnet radius (45% of a piece) is the mitigation for imprecise drops;
  a tap-to-place alternative is an open question.
- [x] Body text ≥ 18 px; at 200% zoom the board scales to the width, tray wraps below
- [x] Text contrast ≥ 7:1; a selected piece is outlined and the instruction names it
- [x] Every icon has a text label
- [x] No web jargon; labels say what happens
- [x] Undo or back from every screen; tapping a selected piece again deselects it
- [x] Errors are plain, local, and say how to fix
- [x] Nothing moves, times out, or disappears on its own; snapping is instant, not animated; the page never scrolls while a finger is on the board
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

**Per drag** (motor control; the drag mechanic's own material)

| Statistic | What it captures | Compute |
|---|---|---|
| Duration, path length, straight-line distance, straightness | movement efficiency | from the raw pointer path; straightness = straight line over path length |
| Mean and peak speed, speed variability | psychomotor slowing | resample to uniform time before differentiating |
| Submovements | corrective movements | count of speed peaks along the path |
| Tremor | tremor | lateral deviation from the smoothed path, or 4–12 Hz power; needs coalesced pointer events |
| Hovers | hesitation at the target | pauses over 300 ms with the finger down |
| Overshoot | aiming | path passes the target region and returns |
| Release distance | precision, before the magnet hides it | release point to snapped position, recorded at the moment of release |
| Grab point | mis-targeting | finger position relative to the piece centre |
| Touch without move | accidental touches, indecision | pointerdown with no meaningful move |

**Per piece** (visuospatial judgement, perseveration)

| Statistic | What it captures | Compute |
|---|---|---|
| Pick-ups before placed | recognition of where it goes | count |
| Loose drops and near-misses | spatial judgement | drops that did not click in; near-miss = within twice the magnet |
| Perseveration | disorganised thinking | same piece dropped loose in the same region twice or more |
| Placed via board or neighbour; cluster size | strategy | at the moment of the snap |
| Time from first pick-up to placement | per-item difficulty | timestamps |
| Hint used; hint to placement | responsiveness to cueing | timestamps |

**Per session** (attention and organisation)

| Statistic | What it captures | Compute |
|---|---|---|
| Time to first move | initiation, arousal | first pointerdown minus board shown |
| Total time; time per piece | overall slowing | normalised by piece count |
| Search time between moves; its variability | attention; variability is the phone-only signal | release to next pointerdown; mean and coefficient of variation |
| Lapses | attention | gaps over 8 s with no touch; count and longest |
| First half vs second half time per piece | fatigue, attention decline | split by placement order |
| Order coherence | organised vs random approach | share of placements adjacent to the previous one; edges and corners first; islands built in the tray |
| Wandering | organisation | total drag distance over the minimum needed |
| Hints, loose drops, completion or abandonment point | difficulty, engagement | counts |

**Across days**: every per-session statistic as a robust z against the
personal baseline from 0002, plus the rolling seven-day standard deviation,
at a fixed piece count. Session opened or not, and when, comes from 0007.

Mapping to the four delirium features: attention is search time, lapses and
variability; disorganised thinking is perseveration, order coherence and
wandering; psychomotor change is speed, submovements, straightness and
tremor; arousal is time to first move and whether the session was opened. Difficulty must stay fixed for the baseline
to hold; a change of piece count starts a new baseline. With 12 to 20
pieces there are enough placements per session for order coherence and
search-time variability to be meaningful. **Riskiest unknown:** whether
20 tiles from one photo stay distinguishable at 56 px on a phone, and how
long a session gets at that size for this audience.

### 6.2 Data model

N/A at sketch depth. Sketch: `{ day, photoId, pieces, taps: [{t, piece, slot, result}], dragPaths, placedOrder, features }`.

### 6.3 API / interfaces

N/A. Events in 0007's stream: `jigsaw.shown`, `jigsaw.pick` (piece, grab point), `jigsaw.path` (raw points with timestamps, coalesced), `jigsaw.release` (release point, snapped or not, near-miss), `jigsaw.snap` (board or neighbour, cluster size), `jigsaw.hint`, `jigsaw.completed`, `jigsaw.abandoned`. Raw points are kept so every per-drag statistic can be recomputed.

### 6.4 Key decisions and alternatives

| Decision | Chosen | Alternatives considered | Why |
|----------|--------|-------------------------|-----|
| Moving a piece | finger drag with a wide magnet; joined pieces move together | tap piece then tap slot; sliding puzzle | owner's call: the feel of a real jigsaw matters for the pull; the magnet absorbs imprecision, and the drag path is itself a motor signal |
| Piece shape | interlocking tabs, one bump per shared edge | square tiles | reads as a jigsaw at a glance; the hit area is the whole piece so tabs never have to be aimed at |
| Snapping to neighbours | yes, clusters merge | board only | lets the person build islands in the tray the way people really do; clusters within reach of the board lock as one |
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
| Offer tap-to-place as well, for people who cannot drag, or is the magnet enough? | @cpluntke | mid-way review |
| On a phone the whole puzzle fits one screen with pieces about 63 px wide and a 28 px magnet; is that big enough, or should phones scroll? | @cpluntke | mid-way review |
| Keep half-finished puzzles overnight, or reset each day so every session is comparable? | @cpluntke | mid-way review |

## 9. Decision log

Newest first. Record what changed and why, so the doc stays a living record.

| Date | Change | Reason |
|------|--------|--------|
| 2026-09-13 | Statistics written out per drag, per piece, per session, across days; event list updated | Owner asked what the drag mechanic lets us collect |
| 2026-09-13 | Mechanic changed to finger drag with a magnet; interlocking piece shapes; neighbour snapping; touch prototype built and linked; tap-only becomes a known deviation | Owner request after seeing the static mockups |
| 2026-09-13 | Mockups drawn on the ernie-ui tokens; 20 tiles stay distinguishable on a tablet, plain-sky tiles are the weak spot | Owner asked to see it |
| 2026-09-13 | Any photo for the sketch; cap raised to 20 tiles; family photo and recognition question deferred | Owner review |
| 2026-09-13 | Created | Owner asked for a jigsaw idea; adds visuospatial and strategy signals no other sketch has |
