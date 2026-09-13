# 0006 — Coherence chat

| | |
|---|---|
| **Phase** | Sketch |
| **Status** | Draft |
| **Owner** | @cpluntke |
| **Last updated** | 2026-09-13 |
| **Links** | concept research: [Senior Care Penalty Map](https://claude.ai/code/artifact/d43759e2-23b2-4ea1-beed-57452bcc28b2) |

> A short daily conversation with Ernie, typed or spoken, rated for coherence and word-finding, with typing rhythm and vocabulary drift tracked over days. Covers the disorganised-thinking feature that no game covers. Placeholder: details deliberately not filled in yet.

> **Sketch phase:** fill sections 1–5 and 8–9; leave 6 as a rough note and 7 as
> N/A. **Prototype phase:** fill everything, and record in the Decision log
> what the sketch taught us and what changed.

## 1. Problem

Disorganised thinking is one of the four delirium features and the hardest
to turn into a game: at the bedside it is a clinician judging rambling or
illogical answers in a short conversation. A daily chat with Ernie could do
the same job at home, and a phone can add what a clinician cannot: typing
rhythm, pauses, and changes in vocabulary compared with the person's own
earlier days.

## 2. Users and jobs to be done

- **Who:** the person (80+); the model rating the conversation; family or
  caregiver reading the trend.
- **Job:** to be written.
- **Context:** to be written.

## 3. Goals and non-goals

**Goals**
- To be written. Candidate signals noted from the brainstorm: coherence and
  tangentiality rating, response latency, word rate, keystroke rhythm and
  pauses, vocabulary size and drift over days, a few embedded logic
  questions ("Will a stone float on water?").

**Non-goals** (explicitly out of scope for this iteration)
- To be written.

## 4. Success criteria

- To be written.

### 4.1 Sketch verdict

Filled in at the mid-way review. What we tried, what we learned, and whether
it goes forward.

| Tried | Learned | Verdict (Selected / Parked / Folded into NNNN) |
|-------|---------|-------------------------------------------------|
| | | |

## 5. Product design

### 5.1 User flow

To be written.

### 5.2 Screens and states

| Screen | Purpose | Primary action | States (empty / loading / error / success) |
|--------|---------|----------------|--------------------------------------------|
| | | | |

Mockups: `docs/assets/0006/` (none yet).

### 5.3 Copy and tone

To be written.

### 5.4 Accessibility and edge cases

To be written. Known tensions to resolve: typing is a burden at 80+ (voice
as an addition, never the only path); any rating must stay invisible to the
person; nothing may time out while they think.

## 6. Engineering design

### 6.1 Approach

Rough note only. Free-form chat rated by a language model for coherence,
plus keystroke timing captured client-side. **Riskiest unknown:** voice and
model rating are out of reach for the one-hour prototype; this sketch is
likely a later slice.

### 6.2 Data model

N/A.

### 6.3 API / interfaces

N/A.

### 6.4 Key decisions and alternatives

| Decision | Chosen | Alternatives considered | Why |
|----------|--------|-------------------------|-----|
| | | | |

### 6.5 Dependencies and risks

N/A.

### 6.6 Testing and rollout

N/A.

## 7. Plan

N/A.

## 8. Open questions

| Question | Owner | Needed by |
|----------|-------|-----------|
| Fill in sections 2–5 once the game sketches are reviewed | @cpluntke | mid-way review |
| Typed, spoken, or both? | @cpluntke | before sketching |

## 9. Decision log

Newest first. Record what changed and why, so the doc stays a living record.

| Date | Change | Reason |
|------|--------|--------|
| 2026-09-13 | Created as a placeholder | Owner asked to add it to the list without details yet |
