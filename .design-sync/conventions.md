## ernie-ui conventions (read before building anything)

ernie-ui is for users aged **80 and older**. Every screen you build must pass
`guidelines/docs/guides/designing-for-80-plus.md`. The components enforce
most of it; your composition decides the rest.

### Setup
No provider, no wrapper. Link `styles.css` once; tokens are on `:root` and
every component root is self-styling. Do not set a font-family, font-size or
colour on your own wrappers — inherit from the components and the `body` rule
in `_ds_bundle.css`.

### Build every page as a `Screen`
```jsx
const { Screen, Button, Text, PersonTile, Steps } = window.ErnieUI;
<Screen title="Who do you want to call?" onBack={goBack} onHome={goHome}
  actions={<Button size="huge" fullWidth onClick={callAnna}>Call Anna</Button>}>
  <Steps steps={['Choose a person', 'Check the number', 'Call']} current={0} />
  <Text size="large">Tap the person you want to call.</Text>
  <PersonTile name="Anna" relation="Your daughter" actionLabel="Call Anna" actionIcon="☎" onAction={callAnna} />
</Screen>
```
- `title` is the screen's one job, as a sentence. One primary `Button` in `actions`; at most one secondary beside it.
- Pass `onBack` on every screen but the first, and `onHome` everywhere. `Screen` renders the `TopBar` for you.
- Fewer than five tappable things in the body.

### Which component for which job
- Pick one of 2–5 options → `ChoiceList` (never radio inputs or a `<select>`).
- Yes/No → `Switch` (never a checkbox or toggle).
- Typing → `TextField` with a `label`, `inputMode`, and an `error` that says how to fix it.
- A person → `PersonTile` with `actionLabel` naming them ("Call Anna").
- Status, confirmation, undo → `Notice` (persistent; never a toast).
- Anything hard to reverse → `Confirm` before it, `confirmLabel` naming the action ("Yes, delete it").
- Multi-step flow → `Steps` at the top of each screen.
- Body copy → `Text`; section titles → `Heading level={2}`; grouping → `Card` (rarely).

### Copy rules
Labels say what will happen: "Call Anna", "Send message", "Go back", "Yes, delete it".
Never "OK", "Submit", "Cancel", "Continue", "Login", or web jargon (URL, browser, homepage).
Short sentences, one idea each. Errors say what happened and what to do.

### Styling idiom
Do not write CSS classes for components; they own their look. For your own layout
glue use inline styles with the tokens: `var(--ernie-space-2)` (16px gap),
`var(--ernie-space-3)` (24px), `var(--ernie-measure)` (max text width),
`var(--ernie-ink)`, `var(--ernie-ink-soft)`, `var(--ernie-paper)`, `var(--ernie-surface)`,
`var(--ernie-primary)`, `var(--ernie-danger)`, `var(--ernie-border)`, `var(--ernie-radius)`.
Text is 20px (`--ernie-text`), 24px (`--ernie-text-lg`), 32px (`--ernie-heading`); never smaller.
Every colour token is ≥ 7:1 on `--ernie-paper`; do not introduce lighter greys.
No animation, no auto-advancing content, no gestures other than tap.

### Where the truth lives
`styles.css` → `_ds_bundle.css` holds every token and class. Each
`components/general/<Name>/<Name>.prompt.md` has the usage rules and examples for that component.
