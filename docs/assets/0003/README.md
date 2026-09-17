# 0003 assets

`starts/` holds the three doodles Anna has started, in the exact record shape
the prototype stores (`docs/0003-finish-the-doodle.md` section 6.2):

| File | Title | Anna's invite |
|------|-------|---------------|
| `half-a-house.json` | Half a house | "I drew the roof. Can you finish the house, Grandma?" |
| `cat-with-no-face.json` | A cat with no face | "My cat has no face yet. Can you give her one?" |
| `flower-with-no-petals.json` | A flower with no petals | "This flower needs petals. Will you draw them?" |

Each `.json` has `strokes: [{ author: "family", points: [{x, y, t}] }]` with
x and y normalised to a square pad (0..1) and t in ms from the first touch.
The `.svg` next to each is a render for docs and mockups; the prototype draws
from the JSON, not the SVG.

Regenerate or tweak with `python3 docs/assets/0003/make_starts.py` (the
shapes are hand-placed polylines and arcs with a gentle hand wobble).
