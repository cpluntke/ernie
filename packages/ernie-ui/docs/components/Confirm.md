# Confirm

Yes / No confirmation for anything hard to reverse. Both buttons are large, the safe option ("No, go back") comes first, and the copy says in plain words what will happen.

## Rules
- Use it before every destructive or costly action (delete, send, call, pay).
- `title` is the question: "Delete this message?"
- Body says the consequence and whether it can be undone.
- `confirmLabel` names the action: "Yes, delete it". Never "OK".
- `danger` for destructive actions.
- `inline` renders it in place (previews, embedded panels) instead of over the screen.

```tsx
<Confirm open={open} title="Delete this message?" confirmLabel="Yes, delete it" danger
  onCancel={() => setOpen(false)} onConfirm={del}>
  The message will be gone for good. You cannot undo this.
</Confirm>
```
