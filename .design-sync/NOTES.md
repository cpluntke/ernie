# design-sync notes for ernie-ui

- Package lives at `packages/ernie-ui` (npm workspace at repo root). Build: `npm run build` from the root. Entry for the converter: `./packages/ernie-ui/dist/index.js`, node_modules: `./node_modules` (hoisted).
- Shape: package. No Storybook. Docs per component in `packages/ernie-ui/docs/components/`, guideline in `docs/guides/`.
- Browser for validate/capture: the remote Claude Code environment preinstalls Chromium build 1194 at `/opt/pw-browsers`, which pins `playwright@1.56.0` (installed in `.ds-sync/`). `DS_CHROMIUM_PATH=/opt/pw-browsers/chromium` also works. Do not run `playwright install`.
- All 11 non-trivial components use `cardMode: column` (full-width cards); Heading and Text stay in the grid.
- Base typography is applied on `body` and on every component root class in `styles.css`, so standalone cards and designs render styled without a wrapper. Keep that rule when editing the stylesheet.
- No fonts shipped by design (system font stack); no `[FONT_MISSING]` expected.

## Known render warns
- none at last sync.

## Re-sync risks
- Adding a component: add its doc under `docs/components/`, a preview under `.design-sync/previews/`, and a `cardMode` override if it is wider than a grid cell.
- The conventions header enumerates token and class names; re-validate them against `_ds_bundle.css` after any stylesheet rename.
- Playwright version is pinned to the environment's Chromium; a different machine may need a different `playwright` version in `.ds-sync/`.
