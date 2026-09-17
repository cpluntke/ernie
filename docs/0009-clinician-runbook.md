# 0009 — Clinician runbook

| | |
|---|---|
| **Phase** | Sketch |
| **Status** | Draft |
| **Owner** | @cpluntke |
| **Last updated** | 2026-09-17 |
| **Links** | delivered by [0006](0006-coherence-chat.md); stored and analysed per [0007](0007-data-capture-and-analysis.md); concept research: [Senior Care Penalty Map](https://claude.ai/code/artifact/d43759e2-23b2-4ea1-beed-57452bcc28b2) |

> The backend where a nurse or doctor writes down what should be asked at home: each item in plain words, how it is answered, whether it is daily or one-off, what counts as a problem, and who hears about it. Two ready-made scripts ship with it, one for delirium after a hospital stay and one for heart failure.

> **Sketch phase:** fill sections 1–5 and 8–9; leave 6 as a rough note and 7 as
> N/A. **Prototype phase:** fill everything, and record in the Decision log
> what the sketch taught us and what changed.

## 1. Problem

Everything the games measure, we chose. But the questions that matter after a
discharge are the clinic's, they change per person, and they change again
after every medication change. Today a nurse handles this with a phone call
they do not have time to make daily, or a paper sheet on the fridge that
nobody reads back. There is nowhere to write down "ask her every morning what
the scale says, and tell me if it goes up two kilos" and have it happen.

Without this, the product only measures what we shipped. With it, the daily
visit carries whatever the clinic needs this week, and the answers arrive
somewhere a clinician can see, on the day.

## 2. Users and jobs to be done

- **Who:** a nurse (most often), a doctor, or a discharge coordinator. They
  are not the person using Ernie and may never meet them at home.
- **Job:** "When I discharge someone, I want to write down the few things I
  would have rung to ask, so they get asked every morning and I hear about a
  bad answer the same day."
- **Job (starting out):** "When I set someone up, I want to pick a
  ready-made list for their condition and change a couple of lines, rather
  than write ten questions from scratch."
- **Context:** a desktop browser at a ward station or a clinic desk, a minute
  or two per patient, usually at discharge or after a medication change.

## 3. Goals and non-goals

**Goals**
- Two ready-made scripts a clinician can load and then edit: **Delirium
  watch** and **Heart failure watch** (section 5.5).
- An item is small and complete: the question in the person's own language,
  how it is answered, when it is asked, what counts as a problem, and who is
  told.
- Cadence covers the three real cases: **daily**, **once** (ask tomorrow and
  then stop), and **for N days** (the post-discharge or post-change window).
- Rules compare against the person's own baseline or yesterday, not only
  against a fixed number, because that is how most of these signs work.
- A clinician can see, per person, what was asked, what was answered, and
  what tripped, without leaving the runbook.
- Plain-language enforcement: an item cannot go live carrying clinical
  wording the person would not use.

**Non-goals** (explicitly out of scope for this iteration)
- An EHR integration, an order set, or anything that writes to a medical
  record. The runbook is a prompt list, not a chart.
- Prescribing, dosing, or anything that changes treatment.
- Multi-clinician review, approval workflow, audit trail, roles. One
  clinician, one person, in this iteration.
- Free-text items authored by a model. A human writes the question.
- Scheduling the games (0004, 0008). Later this becomes the natural home for
  "give her the jigsaw twice this week", but not now.

## 4. Success criteria

- A nurse loads a script, edits one question, adds one of their own, and is
  done in under three minutes.
- Every item in both shipped scripts renders correctly in the chat (0006)
  and records an answer.
- A tripping answer appears in the clinician's view on the same session,
  with the item, the answer, the rule that tripped, and what the person was
  told.
- An item written in clinical language is refused with a message naming the
  words to change.
- The chat stays inside its cap: a script that would ask more than six
  things in a day is refused at save time, not discovered by the person.

### 4.1 Sketch verdict

Filled in at the mid-way review. What we tried, what we learned, and whether
it goes forward.

| Tried | Learned | Verdict (Selected / Parked / Folded into NNNN) |
|-------|---------|-------------------------------------------------|
| | | |

## 5. Product design

### 5.1 User flow

1. Clinician opens the runbook for a person. Empty: "Start from a ready-made
   list" with the two scripts, or "Write your own".
2. Loading a script shows its items as a list: question, answer type,
   cadence, rule. Each can be edited, switched off, or removed.
3. "Add an item" is one short form: the question in plain words, how it is
   answered, how often, and what counts as a problem.
4. Save. The items are live from the next morning, never mid-chat.
5. Later, the same page shows the week: what was asked, what came back, what
   tripped and when the clinic was told.

### 5.2 Screens and states

| Screen | Purpose | Primary action | States (empty / loading / error / success) |
|--------|---------|----------------|--------------------------------------------|
| Runbook | see and change what is asked | Save | empty (offers the two scripts); script loaded; edited; over the six-a-day cap (refused, says which day) |
| Add or edit item | write one question | Add this item | blank; valid; clinical wording refused with the words named; rule needs a number |
| Answers | what came back | none | nothing yet; a week of answers; a trip highlighted with what the person was told |

Mockups: the backend view of the [chat prototype](https://claude.ai/artifact/NNNK28Yoo8oqFfpSJeZbwP), which carries the
runbook editor, the answers and what tripped.

### 5.3 Copy and tone

Two audiences, two registers. The runbook screens are for a clinician and may
say "cadence", "baseline", "escalation". Everything that reaches the person
is theirs: the `question` and the `saySomething` sentence are written in
plain words by the clinician and shown back to them as the person will hear
it, before saving.

The refusal is specific, not a scold: "Two words here are ones the person is
unlikely to use: *dyspnoea*, *oedema*. Try: 'Is it harder to breathe today?'"

### 5.4 The item

One item is:

| Field | What it is |
|---|---|
| `question` | Ernie's exact words. Plain, one idea, ends in a question mark. |
| `kind` | `choice`, `yesno`, `number`, `scale`, or `text` |
| `options` / `unit` / `range` | the answers, the unit and a plausible range |
| `cadence` | `daily`, `once`, or `forDays: N` from a start date |
| `window` | `morning` or `any` |
| `rule` | what counts as a problem: a value, a change from yesterday, or a change from the person's baseline |
| `saySomething` | what the person is told when it trips, in plain words |
| `notify` | `family`, `clinic`, or `both` |
| `addedBy`, `addedAt`, `note` | who asked for it and why, for the next clinician |

A rule is deliberately small. Three shapes cover every item in both scripts:
`value` (is / is not / above / below a number), `changeFromYesterday` (up or
down by more than X), and `changeFromBaseline` (differs from the person's own
usual by more than X, using the robust method in 0002).

### 5.5 The two shipped scripts

**A. Delirium watch** — after a hospital stay. Items follow the four CAM
features and the 4AT's orientation and attention items, reworded. The first
four run daily for as long as the watch lasts; the fifth is the window after
discharge.

| # | Question | Kind | Cadence | Rule | If it trips |
|---|---|---|---|---|---|
| 1 | "What day of the week is it today?" | choice (7 days) | daily | wrong answer | logged; two days running notifies family |
| 2 | "Where are you right now?" | choice (at home / in hospital / somewhere else) | daily | wrong answer | logged; notifies family |
| 3 | "Can you say the days of the week backwards, starting with Saturday?" | text | daily | fewer than 5 correct in sequence, read tolerantly (see 0006) | logged; with item 1 or 2, notifies clinic |
| 4 | "Will a stone float on water?" (rotates with two other plain logic questions) | yesno | daily | wrong answer | logged; notifies clinic with any other trip |
| 5 | "Did you sleep through the night?" | yesno | forDays: 7 | no, three nights running | notifies family |
| 6 | "What have you been up to today?" | text | daily | coherence rating below baseline | logged; the language signal, never shown to the person |

Escalation follows the CAM: a flag goes to the clinic when an acute change
(worse than this person's own baseline) is present **and** attention is
impaired (item 3), **plus** either disorganised thinking (item 4 or the
rating on item 6) or the arousal signal from 0007 (missed or very slow
sessions). Any single wrong answer on its own is logged, never escalated —
one bad morning is not delirium.

**B. Heart failure watch** — after a decompensation admission or a diuretic
change. The daily weight and the symptom questions are the standard self-care
zones, reworded.

| # | Question | Kind | Cadence | Rule | If it trips |
|---|---|---|---|---|---|
| 1 | "What does the scale say this morning?" | number (kg, 30–250) | daily, morning | up more than 1.5 kg since yesterday | notifies clinic; "Thank you. I will let the clinic know your weight today." |
| 2 | "Is it harder to breathe today than yesterday?" | yesno | daily | yes | notifies clinic |
| 3 | "How many pillows did you sleep on?" | choice (one / two / three or more) | daily | more than usual for this person | notifies clinic |
| 4 | "Are your ankles or feet more swollen than usual?" | yesno | daily | yes | notifies clinic |
| 5 | "Did you take your water tablet today?" | yesno | daily | no | notifies family |
| 6 | "How have you been feeling today?" | text | daily | coherence rating below baseline | logged; carries the language signal |

The script is deliberately full: six items is the daily cap. The two a nurse
most often wants to add — "Could you do your usual walk today?" and "Have you
felt dizzy when you stand up?" for the week after a diuretic change — do not
fit until something is switched off. That is the cap doing its job at the
desk rather than on the person's screen, and the prototype demonstrates it.

Both scripts leave the language measurement untouched: whatever is being
asked, the free-text answers are still rated and the typing still measured,
so the delirium signal runs underneath the heart-failure script as well.
That is the argument for the chat existing at all.

### 5.6 Safety rails

These are the rules that make a clinician-authored question safe to put in
front of someone at home. They belong to this doc because this is where the
question is written.

- **Ernie never interprets.** An item that trips produces the clinician's
  `saySomething` sentence and nothing else. No "that could mean", no advice.
- **No item may instruct.** Questions only. An item that tells the person to
  do something clinical (take a dose, stop a tablet, go somewhere) is
  refused; that is a phone call from a human.
- **Nothing urgent is left to the app.** Anything a clinician would want
  acted on within the hour is not a runbook item; the runbook says so when
  the wording suggests it, and the item still saves with a reminder that
  someone has to ring.
- **Plain language is enforced,** because a question the person does not
  understand produces an answer nobody should act on.
- **Six items a day, five minutes.** Refused at save time.
- **The person is told the clinic is watching.** Setup, not a surprise.

## 6. Engineering design

### 6.1 Approach

Built: the runbook lives in the backend view of the [chat prototype](https://claude.ai/artifact/NNNK28Yoo8oqFfpSJeZbwP),
where a clinician switches scripts, switches items on and off, adds one, and
sees the answers and what tripped. Source:
`docs/assets/0006/chat-prototype.html`.

A runbook is a list of items on the household (0007). Today's chat asks
`itemsDueToday(runbook, date, startedAt)`: everything `daily`, everything
`once` not yet asked, and everything `forDays: N` still inside its window.
Rules are evaluated after each answer against the person's stored history,
reusing the robust baseline from 0002 for `changeFromBaseline`. The
plain-language check is a word list plus a sentence-length and question-mark
check — deliberately dumb, easy for a clinician to understand and argue with.

**Learned while building.** The five-of-seven threshold on the days-backwards
item is my choice, not a validated cut-point: the 4AT bands months-backwards
at nought, one, and two-or-more errors, and five of seven sits a little more
lenient than its worst band. It also remains an absolute floor, while this
doc's own rule table offers `changeFromBaseline` — the person who has always
managed four is flagged daily and the person who drops from seven to five is
not flagged at all. Reading the answer with a model (0006) removed the
spelling problem but not this one.

The plain-language check earns its place
immediately: "Assess dyspnoea and peripheral oedema" is refused on three
counts at once (three clinical words, no question mark, reads as a task), and
"Take an extra water tablet today?" is refused as an instruction even though
it is perfectly plain English. The instruction check turned out to matter more
than the vocabulary check, because a clinician writing quickly slips into
imperatives without noticing.

**Riskiest unknown:** whether the rule shapes are enough. Three shapes cover
both shipped scripts, but the first real nurse will want something they do
not cover, and the answer must be a fourth shape rather than free-form code.

### 6.2 Data model

```
runbook: { householdId, script, items: [Item], updatedBy, updatedAt }

Item: { id, question, kind, options?, unit?, range?,
        cadence: "daily" | "once" | { forDays: N, from: date },
        window: "morning" | "any",
        rule?: { type: "value" | "changeFromYesterday" | "changeFromBaseline",
                 op, amount },
        saySomething?, notify: "family" | "clinic" | "both",
        enabled, addedBy, addedAt, note? }
```

### 6.3 API / interfaces

| Route | Role | Body / response |
|---|---|---|
| `GET /api/runbook` | clinician | the runbook and the shipped scripts |
| `PUT /api/runbook` | clinician | the item list; refused with reasons if it fails the checks |
| `GET /api/runbook/answers?days=7` | clinician | what was asked, answered and tripped |

`itemsDueToday`, `checkPlainLanguage` and `evaluateRule` are pure functions
in `packages/signal` alongside the 0002 features, so the chat and the server
agree.

### 6.4 Key decisions and alternatives

| Decision | Chosen | Alternatives considered | Why |
|----------|--------|-------------------------|-----|
| Scripts | two ready-made lists, freely editable | a blank runbook; a library of dozens | a blank page is not a minute's work; two is enough to prove the shape without pretending to clinical coverage |
| Conditions chosen | delirium and heart failure | falls, depression, medication adherence | delirium is the product's own signal; heart failure is the top-ranked condition in the concept research and is a genuinely different shape (numbers and thresholds, not cognition) |
| Rules | three fixed shapes | free-form expressions; a rules language | a nurse must be able to read it back; free-form invites errors nobody would catch |
| Who writes the question | the clinician, in plain words | generated from a clinical term | wording is the whole safety story; a human owns it |
| Enforcement | refuse at save with the words named | warn only | a warning that can be clicked past is not a rail |
| Live from | the next morning | immediately | never change a chat someone is in the middle of |

### 6.5 Dependencies and risks

Depends on 0006 to deliver items and 0007 to store them. Risks: a clinician
writes a question the person misreads (plain-language check, and the preview
showing exactly what the person hears); someone treats the runbook as
monitoring that is watched in real time (it is not, and the copy must say so);
rule shapes too narrow (above).

### 6.6 Testing and rollout

Unit tests on `itemsDueToday` (a `once` item asked exactly once; a `forDays`
item stopping on the right day), `evaluateRule` (each shape, and a baseline
rule with too little history), and `checkPlainLanguage` (each shipped item
must pass its own check). Manual: load each script, run the chat end to end,
confirm every trip appears in the clinician view with what the person was told.

## 7. Plan

N/A at sketch depth.

## 8. Open questions

| Question | Owner | Needed by |
|----------|-------|-----------|
| Who may write a runbook item in a real deployment, and does anything need a second pair of eyes before it goes live? | @cpluntke | before any real use |
| Is "notifies the clinic" honest if nobody is on the other end out of hours? What does the person get told then? | @cpluntke | before any real use |
| Should a clinician be able to see the person's free-text answers, or only the ratings? | @cpluntke | mid-way review |
| Do the two shipped scripts need review by an actual nurse before the submission, or are they clearly marked as illustrative? | @cpluntke | before submission |

## 9. Decision log

Newest first. Record what changed and why, so the doc stays a living record.

| Date | Change | Reason |
|------|--------|--------|
| 2026-09-17 | Built into the chat prototype's backend view. Heart-failure script trimmed to six items so it sits exactly on the cap, with the walk and dizziness items as the ones a nurse must make room for | Testing the prototype |
| 2026-09-17 | Created with two shipped scripts, the item shape, three rule shapes and the safety rails | Owner asked for a backend runbook where a nurse or doctor enters one-off or daily items for the chat, with two scripts for two conditions |
