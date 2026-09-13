# 0003 — Finish the doodle

| | |
|---|---|
| **Phase** | Sketch |
| **Status** | Draft |
| **Owner** | @cpluntke |
| **Last updated** | 2026-09-13 |
| **Links** | concept research: [Senior Care Penalty Map](https://claude.ai/code/artifact/d43759e2-23b2-4ea1-beed-57452bcc28b2); shares the pad with [0002](0002-sign-the-guest-book.md) |

> A grandchild starts a drawing and sends it; the person finishes it with a finger and sends it back. The exchange is the reason to open the app. Whether it gets opened, how soon, and whether anything gets drawn is the signal.

> **Sketch phase:** fill sections 1–5 and 8–9; leave 6 as a rough note and 7 as
> N/A. **Prototype phase:** fill everything, and record in the Decision log
> what the sketch taught us and what changed.

## 1. Problem

Hypoactive delirium, the most common and most missed kind, looks like
withdrawal: the person simply does not open the app. A missed day only means
something if there was a real pull to open it, and a plain daily check-in
(0002) is a weak pull. A half-finished drawing from a grandchild is a strong
one, and it asks for a small creative act rather than a test. Today there is
nothing at home that gives either.

**Load-bearing hypothesis.** One task that is both creative and socially
pulled gets opened more reliably, and sooner, than a check-in that is neither.
If that is true, the doodle is the daily engagement probe and the guest book
(0002) is the daily motor probe, and they are complementary rather than
competing. If it is false, this sketch is parked and 0002 carries the daily
visit alone. The sketch exists to test this, not to measure strokes.

## 2. Users and jobs to be done

- **Who:** the person (80+); a family member who starts doodles (any age,
  often a grandchild); a caregiver who set the pairing up.
- **Job (person):** "When Anna sends me half a picture, I want to finish it
  and send it back, so we have a little thing between us."
- **Job (family):** "When I have two minutes, I want to send Grandma something
  to do that isn't a phone call, so I know she's engaged today."
- **Context:** person on a tablet or phone inside Ernie's daily visit;
  family on their own phone, any time.

## 3. Goals and non-goals

**Goals**
- Test the hypothesis: log, per doodle, when it arrived, when it was opened,
  when the first line was drawn, and when it was sent back, so open rate and
  time-to-open can be compared with the guest book (0002) over the same days.
- The person's loop works end to end in the prototype: see Anna's start,
  finish it, send it back, see it finished.
- Finishing takes under two minutes and never fails. A single dot counts.
- Empty state is still worth opening: with no doodle waiting, the person can
  start one for the family instead.

**Non-goals** (explicitly out of scope for this iteration)
- Stroke kinematics as a signal. A different cat each day has no baseline to
  deviate from; that is 0002's job. Strokes are recorded in 0002's format so
  the question can be revisited later, but nothing is computed from them.
- A real family app. The family side is a stub: three pre-made starts and a
  "Margaret finished your doodle" screen. No gallery, no free drawing.
- Real-time drawing together, colours beyond one per side, brushes, erasers
  beyond "Undo last line".
- Transport, offline queueing, accounts, push notifications, more than one
  family member, more than one doodle waiting at a time.
- Scoring the picture.
- Anything that does not fit the one-hour sketch build.

## 4. Success criteria

- A tester finishes a doodle and sends it back in under two minutes with no
  spoken help.
- Over three days with both sketches installed, the doodle is opened on at
  least as many days as the guest book, and sooner after arriving on the days
  both are opened. (Three days is a smoke test, not evidence; it tells us
  whether the comparison is worth running for real.)
- The family stub shows, for each finished doodle, "opened after 2 hours,
  drew for 1 minute" computed from the logged times.

### 4.1 Sketch verdict

Filled in at the mid-way review. What we tried, what we learned, and whether
it goes forward.

| Tried | Learned | Verdict (Selected / Parked / Folded into NNNN) |
|-------|---------|-------------------------------------------------|
| | | |

## 5. Product design

### 5.1 User flow

Person:
1. Ernie: "Anna sent you a drawing to finish." Primary: "Show me Anna's drawing".
2. Drawing page: Anna's lines in dark grey, the person draws in blue; a
   legend says "Anna's lines" and "Your lines". Secondary actions: "Undo last
   line", "Start my part again". Primary: "Send it back to Anna".
3. Confirm: "Send this to Anna?" with the picture. "Yes, send it" / "No, go back".
4. Done: "Sent. Anna will see it on her phone." Primary: "Carry on".

Family (stub, one screen each):
1. "Start a doodle for Margaret": pick one of Anna's three started doodles,
   which ship with the prototype as stroke data (`docs/assets/0003/starts/`):
   "Half a house", "A cat with no face", "A flower with no petals". Each
   carries Anna's one-line invite, shown on the person's Invite screen
   ("I drew the roof. Can you finish the house, Grandma?"). Primary: "Send to Margaret".
2. Later: "Margaret finished your doodle" with the picture and one line:
   "Opened after 2 hours, drew for 1 minute."

### 5.2 Screens and states

| Screen | Purpose | Primary action | States (empty / loading / error / success) |
|--------|---------|----------------|--------------------------------------------|
| Invite | announce the doodle | Show me Anna's drawing | nothing waiting ("Draw something for Anna?"); one waiting; already finished today ("You sent Anna a picture at 10 am") |
| Draw | finish the picture | Send it back to Anna | untouched (Send disabled, hint "Draw anything, even a dot"); drawn; after Undo; after Start my part again (Anna's lines kept) |
| Confirm send | prevent accidental send | Yes, send it | default |
| Sent | close the loop | Carry on | sent; error N/A for the sketch (local store cannot fail to send) |
| Family: start | make a start | Send to Margaret | none picked (Send disabled); one picked |
| Family: finished | show the result and the engagement line | none (Go back) | nothing finished yet ("Margaret hasn't opened it yet"); finished |

Mockups: the three starts rendered in `docs/assets/0003/starts/*.svg`:

| Half a house | A cat with no face | A flower with no petals |
|---|---|---|
| ![Half a house](assets/0003/starts/half-a-house.svg) | ![A cat with no face](assets/0003/starts/cat-with-no-face.svg) | ![A flower with no petals](assets/0003/starts/flower-with-no-petals.svg) |

### 5.3 Copy and tone

- Buttons name the person: "Show me Anna's drawing", "Send it back to Anna".
- "Undo last line", not "Undo". "Start my part again", so Anna's lines are
  clearly kept.
- Never "Submit", "Upload", "Share".

### 5.4 Accessibility and edge cases

Checklist from `docs/research/design-criteria-80-plus.md` section 3:

- [x] One primary action per screen; ≤ 5 tappable things (Draw page: Undo, Start again, Send, Go back, Start)
- [x] Every target ≥ 48 px with visible gaps; the pad itself is the largest target
- [ ] Tap-only; no gesture is the sole path. **Known deviation, decided in
  6.4:** drawing is continuous touch, as in 0002. A single dot counts, and
  "Go back" skips the doodle entirely.
- [x] Body text ≥ 18 px, works at 200% zoom (pad scales with width)
- [x] Text contrast ≥ 7:1. Lines are non-text: Anna's lines use the soft ink
  token (`--ernie-ink-soft`, about 10:1 on white) and the person's use the
  primary blue (about 8.7:1), so both sides are visible to low contrast
  sensitivity, and the legend labels them so the difference is not colour alone
- [x] Every icon has a text label
- [x] No web jargon; labels say what happens
- [x] Undo or back from every screen; send is confirmed
- [x] Errors are plain, local, and say how to fix (the sketch has none)
- [x] Nothing moves, times out, or disappears on its own; timing is logged silently
- [x] Anything audible has a visual equivalent (no sound)
- [x] A helper/caregiver can set it up (pairing) and family can assist

Edge cases: page scroll must be locked while drawing on the pad (same
`touch-action: none` risk on iPad Safari as 0002); stylus, finger and mouse
all accepted; a person who opens the doodle but never draws is logged as
opened, which is still signal; one doodle at a time, a second start from the
family replaces nothing and waits until the first is finished.

## 6. Engineering design

### 6.1 Approach

Rough note. Same pad and stroke recorder as 0002, recording pointer events as
`{x, y, t}` per stroke, so the pad is one component with two users: 0002
computes features from it, 0003 only stores the strokes. A doodle is a list of
strokes tagged by author plus four timestamps. For the sketch, both roles live
in one web app under two routes sharing a local store, so the demo runs in one
browser with a role switch; the family route is a stub with three canned
starts. **Riskiest unknown:** whether a three-day, one-tester comparison with
0002 shows anything, and whether the two-route demo reads as two sides to
someone watching.

### 6.2 Data model

Sketch, one record per doodle:

```
{ id, from, to, startId,
  strokes: [{ author: "family" | "person", points: [{x, y, t}] }],
  sentAt, openedAt, firstStrokeAt, finishedAt }
```

`startId` names one of the three shipped starts; their `strokes` (author
`family`) are copied into the record when the doodle is sent, and the
person's strokes (author `person`) are appended as they draw.

Engagement line on the family side is derived: time-to-open = openedAt −
sentAt; drawing time = finishedAt − firstStrokeAt. The same four timestamps
are what the comparison with 0002 uses.

### 6.3 API / interfaces

N/A.

### 6.4 Key decisions and alternatives

| Decision | Chosen | Alternatives considered | Why |
|----------|--------|-------------------------|-----|
| What the sketch tests | engagement (open rate, time-to-open) vs 0002 | stroke kinematics shared with 0002 | a doodle has no stable template, so kinematics would restate 0002's claim with weaker evidence; the social pull is what 0003 uniquely tests |
| Start of the doodle | three pre-made starts | family draws freely, photo to trace, blank page | a half-drawn thing invites completion; canned starts keep the family stub to one screen and the build inside the hour |
| Family side | stub, two screens, no gallery | full family app | the sketch tests the person's pull, not the family's product |
| Two-side demo | one app, two routes, shared store | separate backend | buildable in the hour; transport is not what the sketch tests |
| Drawing input | continuous touch, deviation from tap-only | tap-to-place dots | a dot-only doodle is not creative; mitigated by "a dot counts" and Go back |
| Who sees the engagement line | the family, in the sketch | caregiver only | it is the demo of the signal; who sees it in the product stays open (8) |

### 6.5 Dependencies and risks

N/A.

### 6.6 Testing and rollout

N/A.

## 7. Plan

N/A.

## 8. Open questions

| Question | Owner | Needed by |
|----------|-------|-----------|
| Can the family side send a photo to draw on, or only lines? | @cpluntke | prototype phase |
| In the product, does the family see the engagement line or only the caregiver, and does the person know it is seen? | @cpluntke | mid-way review |
| Which day of the daily visit does the doodle arrive, and does it replace or follow the guest book on that day? | @cpluntke | before the three-day test |

## 9. Decision log

Newest first. Record what changed and why, so the doc stays a living record.

| Date | Change | Reason |
|------|--------|--------|
| 2026-09-13 | Added Anna's three started doodles as stroke data and SVG in `docs/assets/0003/starts/`, with her invite line per start | Owner: the prototype should ship three starts created in the grandchild's name, so the person's loop can be demoed without a family app |
| 2026-09-13 | Reframed around the load-bearing hypothesis (creative + social pull beats a plain check-in); stroke kinematics moved to non-goals; family side cut to a stub with three canned starts; queueing, offline and gallery removed; line colours specified; recorder format aligned with 0002; three decisions added to 6.4 | Review: the sketch was restating 0002's signal with weaker evidence, and the family side was undecided but load-bearing for the build |
| 2026-09-13 | Created | Brainstorm pick: the social pull that makes a missed day meaningful |
