# Notice

Persistent status message with an icon, a word, and plain text. Never colour alone: `success` says "Done", `error` says "Problem", `warning` says "Careful", `info` says "Note".

## Rules
- Notices never disappear on their own. No toasts, no timeouts.
- Errors say what happened and what to do next.
- Add `actionLabel` for anything reversible ("Undo") or retryable ("Try again").
- Place it next to the thing it is about, above the fold.

```tsx
<Notice kind="success">Done. Your message was sent to Anna.</Notice>
<Notice kind="error" actionLabel="Try again" onAction={retry}>
  The call did not connect. Check the phone is not on silent, then try again.
</Notice>
<Notice kind="info" actionLabel="Undo" onAction={undo}>Ben was removed from your people.</Notice>
```
