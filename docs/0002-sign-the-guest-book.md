# 0002 — Sign the guest book

| | |
|---|---|
| **Phase** | Sketch |
| **Status** | Draft |
| **Owner** | @cpluntke |
| **Last updated** | 2026-09-13 |
| **Links** | concept research: [Senior Care Penalty Map](https://claude.ai/code/artifact/d43759e2-23b2-4ea1-beed-57452bcc28b2) |

> Each day the person signs Ernie's visitor book with a finger and picks today's date; the signature's shape and rhythm become a personal motor baseline, and the date is the orientation check.

> **Sketch phase:** fill sections 1–5 and 8–9; leave 6 as a rough note and 7 as
> N/A. **Prototype phase:** fill everything, and record in the Decision log
> what the sketch taught us and what changed.

## 1. Problem

Delirium is a change from a person's own baseline, and nothing measures that
baseline at home. Signing your name is the most practised motor act of a
lifetime, so it gives a strong, stable, personal reference in a few seconds a
day. A slower, smaller, shakier, or more hesitant signature than usual, or a
wrong date, is the kind of deviation the ward tools look for and the home
never records.

## 2. Users and jobs to be done

- **Who:** the person (80+), daily. A family member or caregiver sets it up
  (spelling of the name, who sees the trend).
- **Job:** "When Ernie visits, I want to sign in like I would in a real guest
  book, so I feel welcomed and it takes ten seconds."
- **Context:** phone or tablet, once a day, inside Ernie's daily visit
  (shell not yet specced). Often first thing in the morning, sometimes
  with a family member present.

## 3. Goals and non-goals

**Goals**
- Sign and pick the date in under 30 seconds, without help after the first day.
- The task never fails. Any signature is accepted with thanks.
- Record enough about each signature to compare days: strokes, speed,
  pauses, size, jitter, time to start.
- The date question doubles as the daily orientation item.

**Non-goals** (explicitly out of scope for this iteration)
- Recognising or verifying the signature.
- Reading a handwritten date. The date is picked from buttons.
- Showing a score or a "good day / bad day" verdict to the person.
- Clinical validation.

## 4. Success criteria

- Five consecutive days of signatures from one tester with no missed steps.
- A per-day series of stroke metrics that a family member can read as
  "today vs usual" on their side.
- A first-time tester completes the flow with no spoken help.

### 4.1 Sketch verdict

Filled in at the mid-way review. What we tried, what we learned, and whether
it goes forward.

| Tried | Learned | Verdict (Selected / Parked / Folded into NNNN) |
|-------|---------|-------------------------------------------------|
| | | |

## 5. Product design

### 5.1 User flow

1. Ernie: "Good morning, Margaret. Would you sign my book?" Primary: "Yes, I'll sign".
2. Signature page: a large white pad with a baseline. Draw with a finger.
   Primary: "Done signing". Secondary: "Start again".
3. "What is today?" Three or four large day buttons (today, yesterday,
   tomorrow, shuffled) plus "I'm not sure".
4. Thank you page shows today's page of the book: the signature and date.
   Primary: "Carry on" (back to the visit).

### 5.2 Screens and states

| Screen | Purpose | Primary action | States (empty / loading / error / success) |
|--------|---------|----------------|--------------------------------------------|
| Invite | ask to sign | Yes, I'll sign | already signed today ("You signed at 9 am. Sign again?"); skip via Go back |
| Signature pad | draw the signature | Done signing | empty pad (Done disabled until one stroke); drawn; "Start again" clears with no confirm |
| What is today | orientation item | tap a day | none picked yet; picked (no right/wrong shown); "I'm not sure" accepted |
| Thank you | close the loop, show the page | Carry on | first ever signature (no previous page to flip to); returning |

Mockups: `docs/assets/0002/` (none yet).

### 5.3 Copy and tone

- "Would you sign my book?" / "Yes, I'll sign" / "Done signing" / "Start again".
- Never "Submit", "Save", "Retry". The pad is a book, not a form.
- Thank you copy is warm and does not judge: "Thank you, Margaret. Lovely to see you."
- The date question is asked as a friend would: "What is today?"

### 5.4 Accessibility and edge cases

Checklist from `docs/research/design-criteria-80-plus.md` section 3:

- [x] One primary action per screen; ≤ 5 tappable things
- [x] Every target ≥ 48 px with visible gaps
- [ ] Tap-only; no gesture is the sole path. **Known deviation:** signing is
  continuous touch. Tremor and hesitation are the signal, so the task must
  never reject a stroke. "Go back" skips the signature entirely.
- [x] Body text ≥ 18 px, works at 200% zoom (pad scales with width)
- [x] Text contrast ≥ 7:1; nothing conveyed by colour alone
- [x] Every icon has a text label
- [x] No web jargon; labels say what happens
- [x] Undo or back from every screen; "Start again" is non-destructive
- [x] Errors are plain, local, and say how to fix (there are no errors)
- [x] Nothing moves, times out, or disappears on its own; timing is logged silently
- [x] Anything audible has a visual equivalent (no sound)
- [x] A helper/caregiver can set it up (name, date format) and read the trend

Edge cases: stylus vs finger (both accepted, logged as input type); page
scroll must be locked while drawing on the pad; a signature of one dot is
accepted; a mouse on desktop works the same.

## 6. Engineering design

### 6.1 Approach

A canvas pad records pointer events (x, y, timestamp) grouped into strokes,
using `getCoalescedEvents()` where available for the full sample rate. Each
stroke is resampled to uniform time before differentiating, so browser
sampling jitter does not dominate speed and smoothness. We do not judge
whether the signature is "good"; we extract a small set of kinematic
features, build a personal baseline from the first week, and report how far
today sits from that baseline. Writing disturbance is a classic bedside sign
of acute confusional states (Chedru and Geschwind, 1972), which is why a
signature is a reasonable probe.

**Features per signature**

| Feature | What it captures | Compute |
|---|---|---|
| Time to first stroke | initiation, arousal | first pointerdown minus pad shown |
| Total time | slowing | last pointerup minus first pointerdown |
| In-air time | hesitation | sum of gaps between strokes |
| Number of strokes | fragmentation | pen lifts |
| Mean speed | psychomotor slowing | path length over drawing time |
| Smoothness | tremor, wobble | log dimensionless jerk per stroke, averaged; fallback: velocity sign changes per cm |
| Size | expansion or shrinking | bounding box width and height, normalised by pad width |
| Shape distance | still looks like theirs | resample to N points, normalise position and scale, DTW (or mean point distance) against the baseline template |

**Baseline and deviation**

1. Baseline is days 2 to 7 (day 1 is skipped for the learning effect). Store
   the median and MAD per feature; robust to one odd day.
2. Each day, a robust z-score per feature: (today − median) / (1.4826 × MAD).
3. Composite deviation = mean of |z| across features, plus the count of
   features beyond 2. Two or more features beyond 2 is "different from
   usual"; three such days in a row is a trend, one is a blip.
4. Keep the sign: slower and shakier reads differently from faster and larger.
5. Rolling seven-day standard deviation per feature is itself a feature,
   because delirium fluctuates.

**What is shown**

The person sees only a thank you. The family view gets one plain sentence
("Margaret's signature was slower and shakier than usual today") over a
seven-day strip of the signatures themselves.

**Prototype scope.** Seven features and robust z-scores (about a hundred
lines), one record per day in local storage, and a demo mode that records
five signatures in a row as the baseline and a sixth as "today" so the
family view tells the story in one sitting. Shares the stroke recorder with
0003. **Riskiest unknown:** whether finger signatures are stable enough day
to day for a change to stand out, and whether `touch-action: none` behaves
on iPad Safari.

### 6.2 Data model

Sketch, one record per signing:

```
{ day, deviceId, inputType: "finger" | "stylus" | "mouse", padWidth,
  shownAt, strokes: [[{x, y, t}]],
  features: { timeToFirst, totalTime, inAirTime, strokeCount, meanSpeed,
              smoothness, width, height, shapeDistance },
  dateAnswer: { offered: [...], picked, correct } }
```

Baseline per device: `{ deviceId, days: [...], median: {...}, mad: {...}, template: [{x, y}] }`.
Baselines are never compared across devices; a phone and a tablet each get
their own.

### 6.3 API / interfaces

N/A.

### 6.4 Key decisions and alternatives

| Decision | Chosen | Alternatives considered | Why |
|----------|--------|-------------------------|-----|
| Date entry | tap one of 3–4 day buttons | write the date by hand | handwriting needs recognition; buttons are scoreable and fit the kit |
| Feedback | thank you only | show a score, show "shakier than usual" | fear of failure is the biggest barrier; the trend belongs to the family view |
| Signal | personal baseline, robust z per feature | absolute thresholds, signature verification | no population norm for finger signatures exists; delirium is a change from the person's own baseline |
| Pressure | not used | pressure as a feature | fingers on iPad report no pressure |

### 6.5 Dependencies and risks

N/A.

### 6.6 Testing and rollout

N/A.

## 7. Plan

N/A.

## 8. Open questions

| Question | Owner | Needed by |
|----------|-------|-----------|
| Should the person be able to flip back through previous pages of the book, or could seeing a shaky day upset them? | @cpluntke | mid-way review |
| Three date options or four, and should "I'm not sure" be one of them? | @cpluntke | mid-way review |
| Is this the first thing in Ernie's daily visit, or a standalone game? | @cpluntke | mid-way review |

## 9. Decision log

Newest first. Record what changed and why, so the doc stays a living record.

| Date | Change | Reason |
|------|--------|--------|
| 2026-09-13 | Metrics and baseline method written into 6.1 and 6.2 | Review with owner: seven kinematic features, robust z against a personal baseline, demo mode for the prototype |
| 2026-09-13 | Created | Brainstorm pick: drawing-based baseline with the strongest personal reference |
