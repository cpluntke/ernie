# Steps

Progress for a short linear flow, in words ("Step 2 of 3: Write message") plus a segmented bar. Put it at the top of every screen in a multi-step flow so nothing has to be remembered from the previous screen.

## Rules
- Two to five steps. Longer flows should be split or simplified.
- Step names match the screen titles.

```tsx
<Steps steps={['Choose a person', 'Write message', 'Send']} current={1} />
```
