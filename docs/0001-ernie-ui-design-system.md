# 0001 — ernie-ui design system

| | |
|---|---|
| **Phase** | Prototype |
| **Status** | Building |
| **Owner** | @cpluntke |
| **Last updated** | 2026-09-13 |
| **Links** | `packages/ernie-ui/`, `packages/ernie-ui/demo/`, Claude Design project (added after sync) |

> A small React component kit that bakes the 80+ design criteria into every part, so sketches and the prototype are built from pieces that are already right, and so Claude Design can generate screens from those same parts.


## 1. Problem

Every screen we sketch or build has to satisfy the same dozen constraints (56px targets, 20px text, 7:1 contrast, visible labels, a way back, plain-language buttons, no motion, no colour-only state). Enforcing that per screen means re-deciding it per screen and getting it wrong under time pressure. If the constraints live in the components instead, a screen assembled from them is correct by default and the ux-critic only has to catch composition mistakes. The kit is also what lets Claude Design produce on-brand sketches: without a synced design system it draws with generic parts that break the criteria.

## 2. Users and jobs to be done

- **Who:** us, building sketches and the prototype; Claude Design's agent, generating screens; indirectly the 80+ end users who receive the result.
- **Job:** "When I lay out a screen, I want to pick parts that already meet the 80+ criteria, so I can spend the time on the flow, not on button sizes."
- **Context:** fast iteration during the sketch phase, then a single runnable web prototype. Desktop and phone widths, browser zoom up to 200%.

## 3. Goals and non-goals

**Goals**
- Every component passes `docs/research/design-criteria-80-plus.md` section 3 by construction.
- Small enough to learn in ten minutes: 13 components, one stylesheet, no provider.
- Ships as a normal package (`ernie-ui`, ESM + types + CSS) so it can be synced to Claude Design and imported by the prototype.
- Component docs teach the design agent the copy rules, not just the API.

**Non-goals** (explicitly out of scope for this iteration)
- Theming, dark mode, or brand fonts. System font stack only.
- Icons library. Decorative glyphs are passed as text.
- Data tables, navigation menus, tabs, carousels, toasts. The criteria argue against most of these.
- Localisation. English copy defaults; all labels are props.

## 4. Success criteria

- The demo page (`packages/ernie-ui/demo`) audits with 0 blockers and 0 high items in `tools/ux-audit`.
- A screen composed only from `Screen`, `Button`, `Text`, `PersonTile`, `ChoiceList`, `TextField`, `Notice`, `Confirm` needs no extra CSS to pass the checklist.
- Claude Design, after sync, produces a screen using the real components with no generic buttons or inputs.

### 4.1 Sketch verdict

N/A. This doc started in the prototype phase; it is infrastructure for the sketches rather than a sketch.

## 5. Product design

### 5.1 User flow

N/A for a component kit. The reference composition is the demo: choose a person, check the number, call, with Back and Start on every screen.

### 5.2 Screens and states

| Component | Purpose | Primary action | States |
|-----------|---------|----------------|--------|
| Screen | one-task page: TopBar, title, body, sticky primary action | the `actions` slot | with/without back and home |
| TopBar | Back and Start in the same place every screen | Go back | back only, home only, both |
| Button | labelled 56px+ button | tap | primary, secondary, danger; large, huge; disabled |
| Text, Heading | 20/24/32px type | none | normal, large |
| TextField | labelled input with hint and inline error | type | empty, filled, error |
| ChoiceList | pick one of 2–5 as big buttons | tap | none selected, selected, 2-column |
| Switch | Yes/No as two labelled buttons | tap | yes, no |
| PersonTile | person card with named action | Call Anna | photo, initials, no relation |
| Notice | persistent icon + word + text | optional action | success, error, warning, info; with action |
| Steps | "Step 2 of 3: name" + bar | none | first, middle, last |
| Card | grouping container | none | with/without title |
| Confirm | plain-language yes/no before irreversible actions | Yes, delete it | primary, danger; inline |

Mockups: the demo page and the Claude Design project once synced.

### 5.3 Copy and tone

Default labels are baked in where the criteria demand them: "Go back", "Start", "Yes"/"No", "No, go back", "Done"/"Problem"/"Careful"/"Note". Everything else is a required prop with docs that say what the label must do (name the person, say what happens). No "OK", "Submit", "Cancel", "Continue".

### 5.4 Accessibility and edge cases

Checklist from the research doc, section 3, applied to the demo page:

- [x] One primary action per screen; ≤ 5 tappable things (Screen enforces the slot; the rest is composition)
- [x] Every target ≥ 48 px with visible gaps (56px min-height, 16px gaps)
- [x] Tap-only; no gesture is the sole path
- [x] Body text ≥ 18 px, works at 200% zoom (20px body, rem units, reflow verified)
- [x] Text contrast ≥ 7:1; nothing conveyed by colour alone (token palette, Notice icon+word)
- [x] Every icon has a text label (Button requires children)
- [x] No web jargon; labels say what happens (defaults + docs)
- [x] Undo or back from every screen; destructive actions confirmed (TopBar, Confirm, Notice action)
- [x] Errors are plain, local, and say how to fix (TextField error)
- [x] Nothing moves, times out, or disappears on its own (no animations; Notice is persistent)
- [x] Anything audible has a visual equivalent (no audio in the kit)
- [ ] A helper/caregiver can set it up or assist (app-level; not a component concern)

## 6. Engineering design

### 6.1 Approach

Plain React function components with a single hand-written stylesheet of CSS custom properties and BEM-style classes (`.ernie-button--primary`). No CSS-in-JS, no provider, no context: tokens are defined on `:root` so any page that imports `ernie-ui/styles.css` is styled. Built with tsup to ESM plus a `.d.ts` bundle; the stylesheet is copied to `dist/`. Root `package.json` is an npm workspace so the prototype app can depend on `ernie-ui` locally.

### 6.2 Data model

N/A. Components are stateless; the app owns state and passes `value`/`onChange`.

### 6.3 API / interfaces

Exports and prop types are in `packages/ernie-ui/src/index.ts`; per-component docs in `packages/ernie-ui/docs/components/`. `Button` requires `children`; `TextField` requires `label`; `Confirm` requires `title` and `confirmLabel`; `PersonTile` requires `name` and `actionLabel`. These required props are where the criteria are enforced by the type system.

### 6.4 Key decisions and alternatives

| Decision | Chosen | Alternatives considered | Why |
|----------|--------|-------------------------|-----|
| Styling | one CSS file with tokens | Tailwind, CSS-in-JS, CSS modules | No provider or build step for consumers; Claude Design's sync ships a static stylesheet cleanly; easy to audit contrast in one place |
| Yes/No control | two labelled buttons | native checkbox, toggle switch | Toggles convey state by position and colour; the research says label both sides |
| Pick-one control | large check-mark buttons | radio inputs | Radios are small targets; whole-row buttons are the WCAG label technique taken to its end |
| Way back | TopBar rendered by Screen | per-app nav | Makes the escape hatch impossible to forget |
| Fonts | system stack | a brand webfont | No font files to ship or licence; large system fonts are legible and familiar |
| Dialog | in-DOM Confirm with `inline` mode | native `confirm()`, portal | Portals complicate static previews; native dialogs are tiny and unstyled |

### 6.5 Dependencies and risks

Depends on React 18 as a peer. No runtime deps. Risks: the design agent may still compose screens badly (too many actions), which the ux-critic catches; the kit may need components we have not anticipated once concepts exist, which is expected and cheap to add.

### 6.6 Testing and rollout

Typecheck (`tsc --noEmit`) and the ux-audit on the demo page. After the Claude Design sync, a visual review of every preview card. No unit tests yet; add them when the prototype app depends on behaviour beyond rendering.

## 7. Plan

| Milestone | Scope | Target | Status |
|-----------|-------|--------|--------|
| M1 | 13 components, docs, demo, audit clean | today | done |
| M2 | Sync to Claude Design, previews verified | today | in progress |
| M3 | Add components the concept sketches need | sketch phase | not started |

## 8. Open questions

| Question | Owner | Needed by |
|----------|-------|-----------|
| Does the prototype need a list longer than five people, and if so how does it page without search? | @cpluntke | first sketch |
| Should Confirm trap focus and lock scroll (needs a small effect) once the app has real dialogs? | @cpluntke | prototype phase |

## 9. Decision log

Newest first. Record what changed and why, so the doc stays a living record.

| Date | Change | Reason |
|------|--------|--------|
| 2026-09-13 | Created; 13 components built, demo audits clean | Infrastructure for the sketch phase and for the Claude Design sync |
