# PersonTile

A person as a large card: photo or initials, name, relationship, and one big action button that names them. Social connection is the strongest motivation for this audience, so people should be the biggest things on the screen.

## Rules
- `actionLabel` names the person and the action: "Call Anna", "Message Ben".
- First names are enough. `relation` ("Your daughter") helps when memory is unreliable.
- Three or four tiles per screen at most; a longer list needs a search-free way to page.

```tsx
<PersonTile name="Anna" relation="Your daughter" photoUrl="/anna.jpg" actionLabel="Call Anna" actionIcon="☎" onAction={call} />
```
