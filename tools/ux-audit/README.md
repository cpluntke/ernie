# ux-audit

Playwright + axe-core audit of a running page against
`docs/research/design-criteria-80-plus.md`. Used by the `ux-critic` subagent;
can also be run by hand.

```bash
cd tools/ux-audit && npm install     # once
node audit.mjs http://localhost:5173/ http://localhost:5173/settings --out ../../ux-audit-out
```

Prints a ranked markdown list (blocker → low) with a fix for each item, writes
`report.json` and screenshots at desktop 1280px, desktop at 200% zoom, and
phone 400px into the out dir. Exit code 1 if any blocker was found.

The automated checks cover what can be measured: axe WCAG A/AA/AAA rules,
target size and spacing, visible labels, text size and line height, jargon,
motion and autoplay, zoom lock, reflow. Judgement calls (one task per screen,
label clarity, fear of dead ends, whether the flow makes sense) are the
subagent's job, using the screenshots.
