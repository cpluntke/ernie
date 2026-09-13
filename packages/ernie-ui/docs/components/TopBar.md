# TopBar

Bar at the top of a screen with a large "Go back" button on the left and "Start" on the right, in the same place on every screen. `Screen` renders it for you; use it directly only for custom layouts.

```tsx
<TopBar onBack={back} onHome={home} />
<TopBar onBack={back} backLabel="Back to people" />
```
