#!/usr/bin/env python3
"""Generate the three doodle starts Anna sends in the prototype.

Each start is a list of strokes in the 0003 data-model format:
  { "author": "family", "points": [{"x", "y", "t"}] }
x and y are normalised to the pad (0..1, square); t is milliseconds since the
doodle's first pointerdown. Points are hand-jittered so the lines read as
finger-drawn rather than geometric. Writes <slug>.json and <slug>.svg.

Run:  python3 docs/assets/0003/make_starts.py
"""
import json, math, random, pathlib

OUT = pathlib.Path(__file__).parent / "starts"
SPEED = 0.0009   # pad-widths per ms, roughly a relaxed finger
random.seed(3)


def jitter(pts, amount=0.0025):
    """Smooth hand wobble: a damped random walk, not per-point noise, so the
    line drifts gently like a relaxed finger rather than shaking."""
    out, dx, dy = [], 0.0, 0.0
    for x, y in pts:
        dx = dx * 0.85 + random.uniform(-amount, amount)
        dy = dy * 0.85 + random.uniform(-amount, amount)
        out.append((x + dx, y + dy))
    return out


def densify(pts, step=0.01):
    out = []
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        d = math.hypot(x1 - x0, y1 - y0)
        n = max(1, int(d / step))
        for i in range(n):
            f = i / n
            out.append((x0 + (x1 - x0) * f, y0 + (y1 - y0) * f))
    out.append(pts[-1])
    return out


def arc(cx, cy, r, a0, a1, n=24, ry=None):
    ry = ry or r
    return [(cx + r * math.cos(math.radians(a0 + (a1 - a0) * i / n)),
             cy + ry * math.sin(math.radians(a0 + (a1 - a0) * i / n))) for i in range(n + 1)]


def stroke(pts, t0):
    pts = jitter(densify(pts))
    t, out = t0, []
    for i, (x, y) in enumerate(pts):
        if i:
            px, py = pts[i - 1]
            t += math.hypot(x - px, y - py) / SPEED
        out.append({"x": round(min(max(x, 0), 1), 4), "y": round(min(max(y, 0), 1), 4), "t": int(t)})
    return {"author": "family", "points": out}, t + random.uniform(250, 600)  # pen-up pause


def doodle(slug, title, invite, shapes):
    strokes, t = [], 0
    for pts in shapes:
        s, t = stroke(pts, t)
        strokes.append(s)
    data = {"startId": slug, "from": "Anna", "title": title, "invite": invite, "strokes": strokes}
    (OUT / f"{slug}.json").write_text(json.dumps(data, indent=1))
    def d(s):
        return "M " + " L ".join("%.0f %.0f" % (p["x"] * 1000, p["y"] * 1000) for p in s["points"])
    paths = "".join(
        '<path d="%s" fill="none" stroke="#374151" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>' % d(s)
        for s in strokes)
    (OUT / f"{slug}.svg").write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="500" height="500">'
        f'<rect width="1000" height="1000" fill="#ffffff"/><title>{title}, started by Anna</title>{paths}</svg>')
    print(slug, len(strokes), "strokes", int(t), "ms")


# 1. Half a house: roof and the left wall. Missing: right wall, door, window.
doodle("half-a-house", "Half a house", "I drew the roof. Can you finish the house, Grandma?", [
    [(0.18, 0.50), (0.50, 0.18), (0.82, 0.50)],           # roof
    [(0.22, 0.50), (0.22, 0.86)],                          # left wall
    [(0.22, 0.86), (0.48, 0.86)],                          # half the floor
    [(0.63, 0.31), (0.63, 0.21), (0.71, 0.21), (0.71, 0.39)],  # chimney on the right slope
])

# 2. A cat with no face: head, ears, body, tail. Missing: eyes, nose, whiskers.
doodle("cat-with-no-face", "A cat with no face", "My cat has no face yet. Can you give her one?", [
    arc(0.50, 0.36, 0.17, -40, 260, n=30),                 # head, open at the top for ears
    [(0.37, 0.25), (0.40, 0.10), (0.48, 0.21)],            # left ear
    [(0.52, 0.21), (0.60, 0.10), (0.63, 0.25)],            # right ear
    arc(0.50, 0.70, 0.24, 200, 340, n=26, ry=0.18),        # body top
    [(0.28, 0.66), (0.28, 0.88), (0.72, 0.88), (0.72, 0.66)],  # body sides and bottom
    arc(0.80, 0.78, 0.10, 100, -60, n=20),                 # tail
])

# 3. A flower with no petals: stem, two leaves, centre. Missing: petals.
doodle("flower-with-no-petals", "A flower with no petals", "This flower needs petals. Will you draw them?", [
    [(0.50, 0.92), (0.50, 0.45)],                          # stem
    arc(0.50, 0.36, 0.09, 0, 360, n=28),                   # centre
    [(0.50, 0.70), (0.36, 0.62), (0.30, 0.70), (0.44, 0.76), (0.50, 0.72)],  # left leaf
    [(0.50, 0.60), (0.64, 0.52), (0.70, 0.60), (0.56, 0.66), (0.50, 0.62)],  # right leaf
])
