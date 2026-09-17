# ChoiceList

Pick-one list rendered as large bordered buttons with a check mark, instead of small radio circles. Each option is a full-width target at least 56px tall.

## Rules
- Two to five options. More means the screen is doing too much; split it.
- `label` is the question: "How should we remind you?"
- Option labels are short; use `description` for a second line rather than a long label.
- `columns={2}` only for very short labels ("Morning" / "Evening"); it collapses to one column on phones.

```tsx
<ChoiceList label="How should we remind you?" value={v} onChange={setV} options={[
  { value: 'screen', label: 'A message on this screen' },
  { value: 'ring', label: 'A ring, like a phone call', description: 'Loud, with a flashing screen' },
]} />
```
