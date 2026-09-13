# Switch

A Yes / No question as two large labelled buttons, replacing the small toggle switch. The current answer is filled in and the labels say what each side means.

## Rules
- `label` is a full question: "Remind me every Sunday?"
- Keep the default labels "Yes" / "No" unless the answer is clearer as something else ("Loud" / "Quiet").

```tsx
<Switch label="Remind me to call every Sunday?" checked={remind} onChange={setRemind} />
```
