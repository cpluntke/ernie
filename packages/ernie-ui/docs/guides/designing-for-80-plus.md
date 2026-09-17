# Designing for users aged 80 and older

Every ernie-ui component already meets these; follow them for anything you build around the components.

- **One task per screen.** One title as a question, one primary action, fewer than five tappable things. Use `Screen` for every page.
- **A way back from every screen.** Pass `onBack` and `onHome` to `Screen`. Never a dead end.
- **Targets at least 56px, 16px apart. Tap only.** No double-tap, long-press, drag, swipe or pinch.
- **Text 20px minimum, 24px for buttons and the key sentence, 32px titles.** Left-aligned, line height 1.5, about 65 characters per line.
- **Contrast 7:1.** Use the token colours only; do not introduce greys lighter than `--ernie-ink-soft`.
- **Never colour alone.** `Notice` pairs an icon and a word with every state.
- **Plain words that say what happens.** "Call Anna", "Go back", "Yes, delete it". Never "OK", "Submit", "Cancel", "Continue", or web jargon (URL, browser, homepage, log in).
- **Every field has a visible label and an error that says how to fix it.** Prefer `ChoiceList` and `Switch` over typing.
- **Confirm anything hard to reverse, offer Undo for anything reversible.** `Confirm` and `Notice` with an action.
- **Nothing moves, times out, or disappears on its own.** No carousels, toasts, spinners that loop, or auto-advancing steps.
- **Sound is never the only channel.** Anything audible has a visible equivalent.
- **Design the helper path.** A family member should be able to set things up; keep setup separate from daily use.
