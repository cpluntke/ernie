# Button

Large, high-contrast button with a mandatory text label. Minimum 56px tall, 24px text, 3px border so it reads as tappable.

## When to use
- One `primary` button per screen, placed in `Screen`'s `actions` slot. It is the answer to the screen's title.
- `secondary` for everything else: alternatives, "Go back", "Change".
- `danger` only for destructive actions, and always behind a `Confirm`.
- `size="huge"` for the single most important action in the whole flow (e.g. "Call Anna" on the home screen).

## Rules
- The label says what will happen: "Call Anna", "Send message", "Go back". Never "OK", "Submit", "Continue", "Cancel".
- Never icon-only. `icon` is decorative and sits before the label.
- Use `fullWidth` for primary actions; on phones the sticky footer already stretches it.

## Examples
```tsx
<Button size="huge" fullWidth onClick={call}>Call Anna</Button>
<Button variant="secondary" icon="←" onClick={back}>Go back</Button>
<Button variant="danger" onClick={() => setConfirm(true)}>Delete this message</Button>
```
