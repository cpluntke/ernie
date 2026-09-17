import json, random
FONT="system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
INK='#111827'; SOFT='#374151'; PAPER='#ffffff'; SURF='#f3f4f6'; BORDER='#4b5563'; PRIMARY='#1e40af'; SEL='#dbeafe'

SCENE = '''<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ec5ff"/><stop offset="1" stop-color="#dff1ff"/></linearGradient>
<linearGradient id="lake" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5aa9e6"/><stop offset="1" stop-color="#2f6fb5"/></linearGradient>
<symbol id="scene" viewBox="0 0 1200 900">
<rect width="1200" height="900" fill="url(#sky)"/>
<circle cx="1010" cy="150" r="90" fill="#ffd166"/>
<circle cx="1010" cy="150" r="115" fill="#ffd166" opacity="0.25"/>
<g fill="#ffffff"><ellipse cx="260" cy="170" rx="120" ry="48"/><ellipse cx="330" cy="140" rx="90" ry="55"/><ellipse cx="190" cy="150" rx="70" ry="40"/>
<ellipse cx="700" cy="120" rx="100" ry="38"/><ellipse cx="760" cy="95" rx="70" ry="42"/></g>
<g stroke="#334155" stroke-width="6" fill="none" stroke-linecap="round"><path d="M560 250 q20 -25 40 0 q20 -25 40 0"/><path d="M640 300 q15 -20 30 0 q15 -20 30 0"/></g>
<path d="M0 470 Q200 330 420 440 T900 420 T1200 470 V620 H0Z" fill="#a3c98d"/>
<path d="M300 500 Q520 380 760 480 T1200 460 V640 H0 V560 Q150 470 300 500Z" fill="#6f9f5a"/>
<path d="M0 640 Q400 600 1200 650 V900 H0Z" fill="#4f8a3f"/>
<path d="M620 600 Q820 560 1200 610 V690 Q820 720 620 690Z" fill="url(#lake)"/>
<g><path d="M840 655 l20 25 h110 l20 -25Z" fill="#8b4513"/><rect x="908" y="590" width="6" height="65" fill="#333"/><path d="M914 592 l60 55 h-60Z" fill="#f8fafc"/></g>
<g><rect x="80" y="520" width="34" height="200" fill="#6b4423"/><circle cx="97" cy="470" r="120" fill="#2f7a3d"/><circle cx="40" cy="520" r="80" fill="#3d8f4a"/><circle cx="170" cy="510" r="85" fill="#3d8f4a"/><circle cx="110" cy="400" r="70" fill="#4aa356"/></g>
<g><rect x="420" y="480" width="260" height="190" fill="#c8402f"/><path d="M400 480 L550 370 L700 480Z" fill="#7a2e1f"/><rect x="620" y="390" width="34" height="70" fill="#7a2e1f"/>
<rect x="525" y="580" width="60" height="90" fill="#f4e4c1"/><circle cx="574" cy="628" r="5" fill="#333"/>
<rect x="445" y="510" width="55" height="55" fill="#e0f2fe" stroke="#f4e4c1" stroke-width="6"/><rect x="600" y="510" width="55" height="55" fill="#e0f2fe" stroke="#f4e4c1" stroke-width="6"/>
<path d="M445 537 h55 M472 510 v55 M600 537 h55 M627 510 v55" stroke="#f4e4c1" stroke-width="5"/></g>
<path d="M560 670 Q520 780 380 900 H700 Q640 780 590 670Z" fill="#e6d3a3"/>
<g stroke="#f8fafc" stroke-width="10" stroke-linecap="round"><path d="M760 700 V760 M810 700 V760 M860 700 V760 M910 700 V760 M960 700 V760 M1010 700 V760"/><path d="M740 720 H1030 M740 745 H1030" stroke-width="8"/></g>
<g><g fill="#ffd166"><circle cx="120" cy="790" r="22"/><circle cx="200" cy="830" r="22"/><circle cx="60" cy="860" r="22"/><circle cx="260" cy="780" r="22"/></g>
<g fill="#7a3e12"><circle cx="120" cy="790" r="8"/><circle cx="200" cy="830" r="8"/><circle cx="60" cy="860" r="8"/><circle cx="260" cy="780" r="8"/></g>
<g stroke="#2f7a3d" stroke-width="8" stroke-linecap="round"><path d="M120 812 v70 M200 852 v48 M60 882 v18 M260 802 v80"/></g>
<g fill="#e05780"><circle cx="1060" cy="820" r="18"/><circle cx="1130" cy="860" r="18"/><circle cx="980" cy="870" r="18"/><circle cx="1180" cy="800" r="18"/></g>
<g stroke="#2f7a3d" stroke-width="7" stroke-linecap="round"><path d="M1060 838 v50 M1130 878 v22 M980 888 v12 M1180 818 v70"/></g></g>
</symbol></defs></svg>'''

def tile(col,row,cols,rows,w,h,extra_style='',extra_attr=''):
    tw, th = 1200/cols, 900/rows
    return (f'<div style="width:{w}px;height:{h}px;border-radius:6px;overflow:hidden;border:2px solid {BORDER};{extra_style}"{extra_attr}>'
            f'<svg viewBox="{col*tw:.0f} {row*th:.0f} {tw:.0f} {th:.0f}" width="{w}" height="{h}" style="display:block"><use href="#scene" width="1200" height="900"></use></svg></div>')

def slot(w,h,extra=''):
    return f'<div style="width:{w}px;height:{h}px;border-radius:6px;background:{SURF};border:2px dashed {BORDER};{extra}"></div>'

def button(label, variant='primary', huge=False, full=False, icon=None):
    bg = PRIMARY if variant=='primary' else PAPER
    color = PAPER if variant=='primary' else PRIMARY
    fs = '32px' if huge else '24px'
    mh = '80px' if huge else '56px'
    pad = '24px 32px' if huge else '16px 24px'
    width = 'display:flex;width:100%;' if full else 'display:inline-flex;'
    ic = f'<span aria-hidden="true" style="font-size:1.25em;line-height:1">{icon}</span>' if icon else ''
    return (f'<button style="{width}align-items:center;justify-content:center;gap:8px;min-height:{mh};min-width:56px;padding:{pad};font-family:{FONT};font-size:{fs};font-weight:700;line-height:1.25;border-radius:12px;border:3px solid {PRIMARY};background:{bg};color:{color};text-align:center;cursor:pointer">{ic}<span>{label}</span></button>')

def topbar():
    return (f'<header style="display:flex;align-items:center;gap:16px;padding:16px;border-bottom:2px solid {BORDER};background:{PAPER}">'
            + button('Go back','secondary',icon='←').replace('padding:16px 24px','padding:16px 16px')
            + '<span style="flex:1"></span>'
            + button('Start','secondary',icon='⌂').replace('padding:16px 24px','padding:16px 16px') + '</header>')

def screen(title, body, actions, width, height):
    return f'''<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <style>
    body {{ margin: 0; font-family: {FONT}; font-size: 20px; line-height: 1.5; color: {INK}; background: {PAPER}; }}
    * {{ box-sizing: border-box; }}
    a {{ color: {PRIMARY}; }} a:hover {{ color: #1e3a8a; }}
  </style>
</helmet>
{SCENE}
<div style="width:{width}px;min-height:{height}px;display:flex;flex-direction:column;background:{PAPER}">
{topbar()}
<main style="flex:1;width:100%;max-width:640px;margin:0 auto;padding:24px 16px">
<h1 style="font-size:32px;line-height:1.25;font-weight:700;margin:0 0 24px">{title}</h1>
{body}
</main>
<footer style="position:sticky;bottom:0;background:{PAPER};border-top:2px solid {BORDER};padding:16px">
<div style="max-width:640px;margin:0 auto;display:flex;flex-direction:column;gap:16px">{actions}</div>
</footer>
</div>
</x-dc>
</body>
</html>
'''

def text(s, large=False):
    return f'<p style="margin:0 0 16px;max-width:640px;font-size:{"24px" if large else "20px"}">{s}</p>'

def board_and_tray(cols, rows, cell_w, cell_h, placed, selected, order, gap=8, hint_slot=None):
    # board
    cells=[]
    for r in range(rows):
        for c in range(cols):
            if (c,r) in placed: cells.append(tile(c,r,cols,rows,cell_w,cell_h))
            elif hint_slot==(c,r): cells.append(slot(cell_w,cell_h,f'outline:4px solid {PRIMARY};outline-offset:2px;background:{SEL};'))
            else: cells.append(slot(cell_w,cell_h))
    board=f'<div style="display:grid;grid-template-columns:repeat({cols}, minmax(0, 1fr));gap:{gap}px;margin:0 0 24px">{"".join(cells)}</div>'
    tray_cells=[]
    for (c,r) in order:
        if (c,r) in placed: continue
        st = f'outline:4px solid {PRIMARY};outline-offset:2px;' if (c,r)==selected else ''
        tray_cells.append(tile(c,r,cols,rows,cell_w,cell_h,st))
    tray=f'<div style="display:grid;grid-template-columns:repeat({cols}, minmax(0, 1fr));gap:{gap}px">{"".join(tray_cells)}</div>'
    return board, tray

random.seed(8)
# ---- phone: 4x3, 12 pieces. content width 358; cell = (358-24)/4 = 83
W,H=390,960; cw=83; ch=83
order=[(c,r) for r in range(3) for c in range(4)]; random.shuffle(order)
placed={(0,0),(1,0),(2,0),(0,1),(0,2)}
sel=(1,1)
board,tray=board_and_tray(4,3,cw,ch,placed,sel,order)

open('Invite.dc.html','w').write(screen(
  'Shall we put a picture back together?',
  f'<div style="border:3px solid {BORDER};border-radius:12px;overflow:hidden;margin:0 0 24px"><svg viewBox="0 0 1200 900" width="352" height="264" style="display:block"><use href="#scene" width="1200" height="900"></use></svg></div>'
  + text('It is in 12 pieces. There is no hurry.', large=True),
  button("Yes, let's do it", huge=True, full=True), W, 900))

open('Main.dc.html','w').write(screen(
  'Put the picture together',
  text('Now tap where it goes.', large=True) + board
  + f'<p style="margin:0 0 8px;font-weight:700">Pieces left: 7</p>' + tray,
  button('Show me where this goes','secondary', full=True), W, H))

open('Done.dc.html','w').write(screen(
  'You did it!',
  f'<div style="border:3px solid {BORDER};border-radius:12px;overflow:hidden;margin:0 0 24px"><svg viewBox="0 0 1200 900" width="352" height="264" style="display:block"><use href="#scene" width="1200" height="900"></use></svg></div>'
  + text('All 12 pieces are in place.', large=True),
  button('Carry on', huge=True, full=True), W, 900))

# ---- tablet: 5x4, 20 pieces. width 768; body max 640 -> content 608; cell w = (608-32)/5 = 115, h = 115*225/240 = 108
TW,TH=768,1180; cw=115; ch=108
order=[(c,r) for r in range(4) for c in range(5)]; random.shuffle(order)
placed={(0,0),(1,0),(2,0),(3,0),(4,0),(0,1),(4,1),(0,2)}
sel=(2,2)
board,tray=board_and_tray(5,4,cw,ch,placed,sel,order,hint_slot=(2,2))
open('Tablet.dc.html','w').write(screen(
  'Put the picture together',
  text('This piece goes in the outlined spot.', large=True) + board
  + f'<p style="margin:0 0 8px;font-weight:700">Pieces left: 12</p>' + tray,
  button('Show me where this goes','secondary', full=True), TW, TH))

json.dump({
 "artboards":[
  {"file":"Invite.dc.html","x":0,"y":0,"w":390,"h":900,"title":"1 · Invite (phone)"},
  {"file":"Main.dc.html","x":480,"y":0,"w":390,"h":960,"title":"2 · Puzzle, 12 pieces (phone)"},
  {"file":"Done.dc.html","x":960,"y":0,"w":390,"h":900,"title":"3 · Done (phone)"},
  {"file":"Tablet.dc.html","x":1440,"y":0,"w":768,"h":1180,"title":"Puzzle, 20 pieces (tablet), hint shown"}
 ],
 "annotations":[
  {"id":"brief","x":0,"y":-170,"w":420,"text":"0008 Piece together the photo — sketch\nBuilt from ernie-ui tokens: 20/24/32px type, 56px targets, 3px borders, 16px gaps.\nTap a piece, then tap its slot. No drag needed. No timer, no score.\nAny photo for now; this scene stands in for one."}
 ],
 "launch":{"view":"canvas"}
}, open('canvas.json','w'), indent=1)
print('written')
