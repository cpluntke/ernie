# 0006 — Coherence chat

| | |
|---|---|
| **Phase** | Sketch |
| **Status** | Draft |
| **Owner** | @cpluntke |
| **Last updated** | 2026-09-17 |
| **Links** | concept research: [Senior Care Penalty Map](https://claude.ai/code/artifact/d43759e2-23b2-4ea1-beed-57452bcc28b2); items come from [0009](0009-clinician-runbook.md); capture via [0007](0007-data-capture-and-analysis.md) |

> A short daily conversation with Ernie. It carries whatever a nurse or doctor has put in the runbook, and while the person answers it measures the things no game can reach: coherence, word-finding, response latency and typing rhythm.

> **Sketch phase:** fill sections 1–5 and 8–9; leave 6 as a rough note and 7 as
> N/A. **Prototype phase:** fill everything, and record in the Decision log
> what the sketch taught us and what changed.

## 1. Problem

Disorganised thinking is one of the four delirium features and the only one no
game reaches: at the bedside it is a clinician judging rambling or illogical
answers in a short conversation. A daily chat can do that job at home, and a
phone adds what a clinician cannot — response latency, typing rhythm, and
vocabulary compared with the person's own earlier days.

The chat is also the only sketch that can carry someone else's questions. The
games are fixed; a conversation can ask whatever the clinic needs this week.
That makes it the glue: one place where the runbook (0009) is delivered, and
one measurement that runs underneath whatever is being asked.

## 2. Users and jobs to be done

- **Who:** the person (80+), daily. A nurse or doctor who puts items in the
  runbook (0009). A family member or caregiver who reads the result.
- **Job (person):** "When Ernie asks how I am, I want to answer in my own
  words and be done in a few minutes, so it feels like being asked after
  rather than being tested."
- **Job (clinician):** "When I discharge someone or change their medication,
  I want the questions I would have phoned about asked every day, so I hear
  about a problem on the day it starts."
- **Context:** phone or tablet, once a day, usually morning. Often inside
  Ernie's daily visit alongside a game.

## 3. Goals and non-goals

**Goals**
- Run today's runbook items one question at a time, in Ernie's voice, as a
  real conversation: the person answers in their own words and a model reads
  what they meant. Quick answers stay as tappable shortcuts, never the only
  way through.
- Ernie's question is always the clinician's verbatim text and a tripped rule
  always speaks the clinician's verbatim sentence. The model interprets the
  answer and writes the short acknowledgement; it never writes a question and
  never writes anything medical.
- Measure, from every answer: response latency, words per minute, pauses,
  corrections, vocabulary spread, and word-finding markers.
- Rate each free answer for coherence, tangentiality and word-finding, and
  compare with the person's own earlier days, not with a population.
- Carry a few fixed cognitive probes of our own (orientation, one logic
  question) so the chat measures delirium even when the runbook is about
  something else.
- Never tell the person what a score means. An answer that trips a rule says
  what will happen next in plain words, nothing more.

**Non-goals** (explicitly out of scope for this iteration)
- Voice input or output. Requested by this audience and the obvious next
  step, but it is a slice of its own.
- Open-ended conversation. Ernie asks; it does not chat back beyond
  acknowledging. No advice, no diagnosis, no small talk that invites typing.
- Long chats. Six items, about five minutes, hard cap.
- Free text as a requirement. Every open question can be skipped, and a skip
  is recorded rather than chased.

## 4. Success criteria

- A tester completes a six-item chat in under five minutes with no typing
  beyond two open answers.
- Every item type in 0009 renders and records: choice, yes/no, number,
  scale, open text.
- Five sessions give a per-day series for latency, typing rhythm, vocabulary
  and the coherence rating, comparable with the baseline method in 0002.
- A rule that trips produces a plain sentence to the person and a flag in
  the backend on the same session.
- The chat works with the language rating unavailable: the heuristic
  measures still produce a series and the session still completes.

### 4.1 Sketch verdict

Filled in at the mid-way review. What we tried, what we learned, and whether
it goes forward.

| Tried | Learned | Verdict (Selected / Parked / Folded into NNNN) |
|-------|---------|-------------------------------------------------|
| | | |

## 5. Product design

### 5.1 User flow

1. Ernie: "Good morning, Margaret. May I ask you a few things?" Primary:
   "Yes, go ahead".
2. One item per screen, in runbook order, with the transcript of what has
   been asked and answered above it. The answer area matches the item:
   big choice buttons, Yes / No, a number pad, or a large text box with
   "Done" and "Skip this one".
3. An answer that trips a rule is acknowledged plainly and the session
   carries on: "Thank you. I will let the clinic know about that today."
4. After the last item: "That is everything. Thank you, Margaret." Primary:
   "Carry on".

### 5.2 Screens and states

| Screen | Purpose | Primary action | States (empty / loading / error / success) |
|--------|---------|----------------|--------------------------------------------|
| Invite | open the conversation | Yes, go ahead | items due today; nothing due ("Nothing to ask today"); already done today |
| Item (conversation) | one question | Send | empty; typing; quick answers offered; Ernie reading; not understood (one gentle re-ask, at most twice); answered; skipped |
| Item (no model) | one question | tap an answer, or Done | the tap-only widgets: choice buttons, Yes/No, a number pad, a text box |
| Trip acknowledgement | say what happens next | Carry on | clinic notified; family notified; logged only |
| Done | close the visit | Carry on | completed; stopped early (the rest keep for tomorrow) |

Mockups: [chat prototype](https://claude.ai/artifact/NNNK28Yoo8oqFfpSJeZbwP) (open on a phone; source
`docs/assets/0006/chat-prototype.html`, one page, no build step). The
"Backend view" button carries the runbook (0009), the answers, the language
statistics and the event stream.

### 5.3 Copy and tone

- Ernie asks, then waits. "May I ask you a few things?" / "Thank you." /
  "That is everything."
- Every clinician item is rewritten into plain words by the person who enters
  it (0009 enforces this): "Is it harder to breathe today than yesterday?",
  never "Assess dyspnoea".
- A trip never alarms and never diagnoses: "Thank you. I will let the clinic
  know about that today." For anything urgent the runbook supplies the
  sentence, and it says what to do, not what is wrong.
- "Skip this one" is always offered on open questions and never scolded.
- Never "Submit", "Complete assessment", "score", "test".

### 5.4 Accessibility and edge cases

Checklist from `docs/research/design-criteria-80-plus.md` section 3:

- [x] One primary action per screen; ≤ 5 tappable things (one item per screen)
- [x] Every target ≥ 48 px with visible gaps
- [ ] Tap-only; no gesture is the sole path. **Known deviation:** the
  conversation invites typing. Mitigations: quick answers are offered for
  every item that has obvious ones, every question can be skipped, and the
  model accepts typos, abbreviations and roundabout answers so a rough reply
  is never wasted. Voice is the real answer and is a non-goal here.
- [ ] Number pad is 12 targets, in the no-model fallback. **Known
  deviation:** familiar phone-keypad layout, 56 px keys, one task on the
  screen. In conversation mode the field asks for a decimal keypad and the
  model parses "eighty two and a half" as readily as "82,4 kg".
- [x] Body text ≥ 18 px, works at 200% zoom
- [x] Text contrast ≥ 7:1; nothing conveyed by colour alone
- [x] Every icon has a text label
- [x] No web jargon; the runbook forbids clinical wording in questions
- [x] Undo or back from every screen; an answer can be changed before moving on
- [x] Errors are plain, local, and say how to fix
- [x] Nothing moves, times out, or disappears on its own; the reply appears
  when the person answers, never on a timer, and no typing animation
- [x] Anything audible has a visual equivalent (no sound)
- [x] A helper/caregiver can sit with the person; a clinician sets the items

Edge cases: a person who types nothing all week (skips are the signal, not
missing data); an answer far outside a plausible range (asked once more, then
accepted and flagged); a runbook item added mid-day (appears tomorrow, never
mid-chat); the language rating unavailable or declined (heuristics only, and
the session is marked as such).

## 6. Engineering design

### 6.1 Approach

Built: [chat prototype](https://claude.ai/artifact/NNNK28Yoo8oqFfpSJeZbwP), one page, no build step,
ernie-ui tokens inline as in 0002 and 0008.

Today's items come from the runbook (0009), filtered by cadence. The chat
renders one item at a time and records an event per item. Two layers of
measurement run underneath:

**Heuristics, always computed on the device**

| Statistic | What it captures | Compute |
|---|---|---|
| Response latency | processing speed | question shown to first key or tap |
| Words per minute | psychomotor and language slowing | words over typing time |
| Inter-key intervals | typing rhythm | median and variability of gaps between keys |
| Long pauses | word-finding | gaps over 2 s while typing, count and total |
| Corrections | uncertainty, motor error | backspaces per 100 characters |
| Type-token ratio | vocabulary spread | unique words over total, per answer and per week |
| Mean word length | vocabulary drift | characters per word |
| Word-finding markers | anomia | "um", "er", "you know", "the thing", "whatsit", repeated words |
| Answer length | engagement, poverty of speech | words per open answer |
| Skips | engagement, arousal | open questions skipped |

**Interpretation and rating, in one call per reply.** The reply goes to the
model with the item's definition and comes back as one structured record:
whether it was understood, the normalised value, a score where the item has
one, a short acknowledgement in Ernie's voice, a gentle re-ask when it was
not understood, a flag when the person volunteered something urgent, and the
language ratings for open answers. Effort is set to the lowest tier: these
are short, tightly specified reads. The runtime exposes effort tiers rather
than model names, so the page requests a tier and the platform picks the
model.

Rules that hold the shape:

- The reply is delimited data, never instructions, and the delimiter appears
  exactly once as a tag and never in the surrounding prose.
- The model may not guess. If it cannot tell what was meant it says so and
  Ernie re-asks, at most twice, then the item is recorded as answered with
  whatever was said.
- `concern` is a flag only. The model is told to set it and say nothing about
  it; the sentence the person sees is ours, not the model's.
- Where the model cannot be reached at all, the words are taken as given, the
  sequence items are scored locally, and the record is marked
  `ratingSource: "heuristic"`. Where the capability is absent or declined
  from the start, the chat falls back to the tap-only widgets and completes
  the same way.

**Across days**, every statistic gets the robust z treatment from 0002
(median and MAD over the baseline window, with the same floor on the scale),
and the family sentence is generated the same way.

**Learned while building (conversation).**

- **Interpretation beats validation.** The days-backwards item was the whole
  argument: matching day names exactly meant "Saterday Fryday Thurdsay" scored
  zero, so it measured spelling rather than attention. Read by a model the
  same answer scores seven. Every other item gained the same tolerance for
  free.
- **A delimiter must not appear in the prose.** The first prompt wrote the
  reply tag inside its own instruction sentence as well as around the reply.
  A test harness parsing the prompt picked the wrong one and fed the
  instruction text back as the person's answer. A model would probably cope;
  the shape was still wrong and is now one tag, used once.
- **Show what the person actually said.** The backend list showed the model's
  normalised value alone, which hides any misreading. It now shows the
  person's words and the normalised value beside them, so a wrong reading is
  visible rather than laundered.

**Learned while building.**

- **The fallback rating had to be recalibrated.** The first heuristic scored
  an ordinarily disfluent answer ("I um sat in the the garden…") at 0.6 out
  of 4, which is "severely impaired". A fallback that cries wolf is worse
  than none; it now lands near 2. The model rating is the real measure and
  the heuristic only has to be *not wrong*.
- **The delirium items tell the person nothing.** Every item in script A has
  an empty `saySomething`, so a wrong day or a failed attention item passes
  in silence. That is deliberate and it falls out of the design rather than
  being added: telling someone they got the day wrong is exactly the failure
  feedback the research warns about. Only the heart-failure items speak,
  because those are about something the person did rather than something
  they got wrong.
- **The coherence rule cannot be judged on the device.** It needs several
  days of ratings, so `changeFromBaseline` on coherence is evaluated on the
  server and the runbook says so in the item.

**Riskiest unknown:** whether an 80+ person will type enough, often enough,
for a language series to mean anything. If the answer is no, the chat still
earns its place as the runbook's delivery vehicle, and voice becomes the
next slice rather than a nice-to-have.

### 6.2 Data model

One record per chat:

```
{ at, script, items: [ { itemId, kind, question, answer, skipped,
                         latencyMs, typing: { chars, ms, keys, medianGapMs,
                         pauses, backspaces }, tripped } ],
  language: { ratingSource, perAnswer: [ { coherence, tangentiality,
              wordFinding, note } ], ttr, meanWordLength, markers, words },
  durationMs, completed }
```

### 6.3 API / interfaces

Events in 0007's stream: `chat.started`, `chat.itemShown`, `chat.keystroke`
(batched: counts and gap statistics, never the text), `chat.itemAnswered`,
`chat.itemSkipped`, `chat.ruleTripped`, `chat.rated`, `chat.completed`.

Free text itself is stored on the record, not on every event, and is health
information: it is the most sensitive thing this product holds and needs the
retention decision in 0007's open questions answered before any real use.

### 6.4 Key decisions and alternatives

| Decision | Chosen | Alternatives considered | Why |
|----------|--------|-------------------------|-----|
| Input | a conversation: own words, with tappable shortcuts | fixed widgets per item type; voice first | widgets made the chat brittle (an exact-match scorer measured spelling) and made it feel like a form; voice is a slice of its own |
| Interpreting the reply | one model call per reply, returning a structured record | client-side parsing; a call only for open answers | one call gives normalisation, scoring, the acknowledgement, the re-ask and the rating together, and typo tolerance everywhere |
| Effort | the lowest tier | the default tier | the reads are short and tightly specified, and the viewer pays for them |
| Who writes what | questions and trip sentences verbatim from the clinician; only the acknowledgement and the re-ask from the model | let the model phrase the questions | wording is the safety story in 0009; a generated question is an unreviewed question |
| An answer it cannot read | re-ask twice, then accept what was said | keep asking; guess | nobody may be trapped on one question, and a guessed answer is worse than a rough one |
| What the person sees | acknowledgement only | a score, a streak, a summary | fear of failure is the biggest barrier in the research |
| Conversation shape | Ernie asks, one item per screen | open-ended chat | an open chat invites typing this audience cannot sustain and makes sessions incomparable |
| Fixed probes | orientation and one logic question every day | runbook items only | the delirium signal must not depend on what a clinician happened to enter |

### 6.5 Dependencies and risks

Depends on 0009 for items and 0007 for capture. Risks: typing burden (above);
a clinician entering an item that reads as a medical instruction (0009's
review rules are the mitigation); model rating unavailable or declined
(handled); free text is the most sensitive data in the product.

### 6.6 Testing and rollout

Synthetic answers with known properties: a fluent answer, the same answer
with filler and repeats, and a short flat one, must move the markers,
type-token ratio and rating in the expected direction. Manual: a full
six-item chat on a phone at 200% zoom, and a chat with the rating declined.

## 7. Plan

N/A at sketch depth. The prototype covers the chat, the measures and both
scripts; the server side is 0007's M1 and M2.

## 8. Open questions

| Question | Owner | Needed by |
|----------|-------|-----------|
| Is typed input acceptable at all for this audience, or should voice be brought forward into this sketch? | @cpluntke | mid-way review |
| How long is free text kept, and who can read it? It is the most sensitive thing we store. | @cpluntke | before any real use |
| Should the person ever see their own answers from earlier days, as a diary? | @cpluntke | mid-way review |
| Two open questions a day, or one? | @cpluntke | mid-way review |
| The viewer pays for each reply read. Who pays in a real deployment, and does that change the item cap? | @cpluntke | before any real use |
| A volunteered concern ("my chest felt tight") is flagged and acknowledged, but nothing actually reaches anyone in the prototype. What is the real path, and what is the person told out of hours? | @cpluntke | before any real use |

## 9. Decision log

Newest first. Record what changed and why, so the doc stays a living record.

| Date | Change | Reason |
|------|--------|--------|
| 2026-09-17 | Answers are now a conversation read by a model rather than precanned widgets: own words with tappable shortcuts, typo tolerance, one gentle re-ask when unclear, a volunteered-concern flag, and the tap-only widgets kept as the no-model fallback. Lowest effort tier | Owner: the precanned answers were doing the wrong job, and exact matching measured spelling |
| 2026-09-17 | Fixed: the Answers and Language tabs went blank once the person tapped Carry on, because leaving the chat screen cleared the session the backend read from. The backend now keeps today's chat, and restores it after a reload | Owner found it while trying the prototype |
| 2026-09-17 | Built and linked. Fallback rating recalibrated after it scored ordinary disfluency as severe; delirium items deliberately say nothing back to the person | Testing the prototype |
| 2026-09-17 | Filled in properly: runbook delivery, ten heuristics, model rating with a heuristic fallback, fixed cognitive probes | Owner asked for the coherence chat as the glue, carrying clinician-entered items |
| 2026-09-13 | Created as a placeholder | Owner asked to add it to the list without details yet |
