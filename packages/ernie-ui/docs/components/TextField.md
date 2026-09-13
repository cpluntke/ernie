# TextField

Single-line input with an always-visible label, an optional hint, and an inline error that says how to fix the problem. 56px tall, 24px text.

## Rules
- `label` is required and stays visible. Placeholders are not labels.
- Set `inputMode` (`tel`, `numeric`, `email`) so the right keyboard appears.
- Accept input flexibly (spaces and dashes in phone numbers, any date order) and validate gently.
- `error` is a plain sentence with the fix: "Please add the area code, so the number has 10 digits." Never a code, never just "Invalid".
- Prefer `ChoiceList` or `Switch` over typing whenever the answer is one of a few options.

```tsx
<TextField label="Anna's phone number" hint="Just the numbers. Spaces are fine."
  inputMode="tel" value={phone} onChange={e => setPhone(e.target.value)}
  error={tooShort ? 'Please add the area code, so the number has 10 digits.' : undefined} />
```
