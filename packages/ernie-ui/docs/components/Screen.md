# Screen

Page layout for one task. Renders a `TopBar` (Back and Start), a 32px title, a body capped at about 65 characters wide, and a sticky footer for the primary action. Every screen in the app is a `Screen`.

## Rules
- `title` is the one question or job of the screen, as a sentence: "Who do you want to call?"
- Pass `onBack` on every screen except the first, and `onHome` everywhere. Users who fear dead ends will not explore without them.
- `actions` holds the primary `Button`, optionally with one secondary. Never more than two.
- Keep fewer than five tappable things in the body.

## Example
```tsx
<Screen title="Who do you want to call?" onBack={back} onHome={home}
  actions={<Button size="huge" fullWidth onClick={next}>Call Anna</Button>}>
  <Text size="large">Tap the person you want to call.</Text>
  <PersonTile name="Anna" relation="Your daughter" actionLabel="Call Anna" />
</Screen>
```
