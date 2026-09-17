# Talk: five minutes on ernie

`ernie-talk.pptx` is the draft deck (eight slides, speaker notes with timings
on every slide); `ernie-talk.pdf` is a render of it.

Rebuild after changing the app or the wording:

```bash
cd docs/talk/build
# 1. capture real app screens (app must be running on :10000)
node shots.mjs                        # writes ../../../../scratchpad-style shots; copy the *-c.png into ./shots
# 2. build the deck
npm i pptxgenjs sharp && node build.cjs
```

The screenshots in `build/shots/` are real: five ordinary signatures to form
a baseline, then a slow, shaky sixth that the backend flags as "slower, more
hesitant and a different shape than usual".
