# 0003 — Finish the doodle

| | |
|---|---|
| **Phase** | Sketch |
| **Status** | Draft |
| **Owner** | @cpluntke |
| **Last updated** | 2026-09-13 |
| **Links** | concept research: [Senior Care Penalty Map](https://claude.ai/code/artifact/d43759e2-23b2-4ea1-beed-57452bcc28b2) |

> A grandchild starts a drawing and sends it; the person finishes it with a finger and sends it back. The exchange is the reason to open the app, and the strokes and the time to open are the signal.

> **Sketch phase:** fill sections 1–5 and 8–9; leave 6 as a rough note and 7 as
> N/A. **Prototype phase:** fill everything, and record in the Decision log
> what the sketch taught us and what changed.

## 1. Problem

Hypoactive delirium, the most common and most missed kind, looks like
withdrawal: the person simply does not open the app. A missed day only means
something if there was a real pull to open it. A half-finished drawing from a
grandchild is a pull, and finishing it leaves a motor trace we can compare
with earlier days. Today there is nothing at home that gives either.

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
- The loop works in both directions in the prototype: send a start, finish
  it, see the finished picture on both sides.
- Finishing takes under two minutes and never fails.
- Log time from "new doodle" to opening it, time drawing, and stroke metrics
  (shared with 0002).
- Empty state is still worth opening: with no doodle waiting, the person can
  start one for the family instead.
- The prototype ships with three started doodles, drawn by us in the
  grandchild's name (e.g. Anna), one per day for the demo: simple, inviting
  halves such as a house with no roof, a cat with no tail, a flower with no
  petals. Each has a one-line note from Anna ("Can you finish my cat?").

**Non-goals** (explicitly out of scope for this iteration)
- Real-time drawing together.
- Colours beyond one for each side; brushes; erasers beyond "Undo last line".
- Accounts, push notifications, or more than one family member in the demo.
- Scoring the picture.

## 4. Success criteria

- A tester finishes a doodle and sends it back in under two minutes with no
  spoken help.
- A family tester sends a start from a phone in under one minute.
- Three exchanges in three days produce a time-to-open series on the family side.

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
2. Drawing page: Anna's lines in grey, the person draws in blue. Secondary
   actions: "Undo last line", "Start my part again". Primary: "Send it back to Anna".
3. Confirm: "Send this to Anna?" with the picture. "Yes, send it" / "No, go back".
4. Done: "Sent. Anna will see it on her phone." Primary: "Carry on".

Family:
1. "Start a doodle for Margaret": pick a prompt ("a house", "a cat", "anything")
   or draw freely. Primary: "Send to Margaret".
2. Later: "Margaret finished your doodle" with the picture, and a small
   "opened after 2 hours, drew for 1 minute" line.

### 5.2 Screens and states

| Screen | Purpose | Primary action | States (empty / loading / error / success) |
|--------|---------|----------------|--------------------------------------------|
| Invite | announce the doodle | Show me Anna's drawing | nothing waiting ("Draw something for Anna?"); one waiting (with Anna's note); already finished today; all three seeded doodles finished ("Anna will send another soon") |
| Draw | finish the picture | Send it back to Anna | untouched (Send disabled); drawn; after Undo; after Start my part again |
| Confirm send | prevent accidental send | Yes, send it | default |
| Sent | close the loop | Carry on | sent; could not send (kept, "We'll send it when the phone is back online") |
| Family: start | make a start | Send to Margaret | blank; prompt chosen; drawn |
| Family: gallery | see finished doodles | none | empty; list with dates |

Mockups: `docs/assets/0003/` (none yet).

### 5.3 Copy and tone

- Buttons name the person: "Show me Anna's drawing", "Send it back to Anna".
- "Undo last line", not "Undo". "Start my part again", so Anna's lines are
  clearly kept.
- Never "Submit", "Upload", "Share".

### 5.4 Accessibility and edge cases

Checklist from `docs/research/design-criteria-80-plus.md` section 3:

- [x] One primary action per screen; ≤ 5 tappable things (Draw page: Undo, Start again, Send, Go back, Start)
- [x] Every target ≥ 48 px with visible gaps
- [ ] Tap-only; no gesture is the sole path. **Known deviation:** drawing is
  continuous touch, as in 0002. A single dot counts as a contribution.
- [x] Body text ≥ 18 px, works at 200% zoom
- [x] Text contrast ≥ 7:1; the two sides use grey vs blue and are also
  labelled ("Anna's lines", "Your lines") in the legend
- [x] Every icon has a text label
- [x] No web jargon; labels say what happens
- [x] Undo or back from every screen; send is confirmed
- [x] Errors are plain, local, and say how to fix
- [x] Nothing moves, times out, or disappears on its own
- [x] Anything audible has a visual equivalent (no sound)
- [x] A helper/caregiver can set it up (pairing) and family can assist

Edge cases: two doodles waiting (show the oldest, say "one more after this");
family sends while the person is drawing (queue, never interrupt); a
person who never draws but opens it (log the open; that is still signal).

## 6. Engineering design

### 6.1 Approach

Rough note. Same canvas and stroke recorder as 0002. A doodle is a list of
strokes tagged by author. The three seeded starts are stored as stroke
lists in `seed.json` (drawn once by us on the same pad, so they render
identically on any width) with the author set to the grandchild and a note. For the prototype, both roles live in one web app
under two routes, sharing a local store, so the demo can be run in one
browser with a role switch. A real transport is a later slice. **Riskiest
unknown:** demonstrating two sides convincingly without a backend; and
whether the family side can stay small enough to build in the hour.

### 6.2 Data model

N/A at sketch depth. Sketch: `{ id, from, to, prompt, strokes: [{author, points}], sentAt, openedAt, finishedAt }`.

### 6.3 API / interfaces

N/A.

### 6.4 Key decisions and alternatives

| Decision | Chosen | Alternatives considered | Why |
|----------|--------|-------------------------|-----|
| Start of the doodle | family draws or picks a prompt | photo to trace, blank page | a half-drawn thing invites completion; blank pages are hard to start |
| Two-side demo | one app, two routes, shared store | separate backend | buildable in the hour; transport is not what the sketch tests |
| Demo content | three starts drawn by us as the grandchild, with notes | random shapes, family draws live | the demo must show the pull without a family member present |

### 6.5 Dependencies and risks

N/A.

### 6.6 Testing and rollout

N/A.

## 7. Plan

N/A.

## 8. Open questions

| Question | Owner | Needed by |
|----------|-------|-----------|
| Can the family side send a photo to draw on, or only lines? | @cpluntke | mid-way review |
| Does the family see the engagement line ("opened after 2 hours") or only the caregiver? | @cpluntke | mid-way review |
| Is the family view part of this prototype, or a stub screen? | @cpluntke | mid-way review |

## 9. Decision log

Newest first. Record what changed and why, so the doc stays a living record.

| Date | Change | Reason |
|------|--------|--------|
| 2026-09-13 | Three started doodles seeded, drawn by us in the grandchild's name, one per demo day | Owner request |
| 2026-09-13 | Family side is a mock route with seeded starts; no real link or sending | Per 0007: family link mocked for now |
| 2026-09-13 | Created | Brainstorm pick: the social pull that makes a missed day meaningful |
