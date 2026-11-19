#!/usr/bin/env python3
"""Bake the Quaternius Universal Base Characters 'Superhero_Male' (CC0) into the match's footballer mesh.
The UBC skeleton IS the player.glb skeleton (same 23 core bones, same bind pose, checked: max diff < 1e-6), so no retarget:
finger / leaf bones fold into their hand / parent, the mesh keeps its bind pose, every existing clip plays on it unchanged.
Out: athlete.bin + athlete.json (parts: body, eyes, brows, hair styles, beard) and athlete-detail.webp (skin / hair / eye detail atlas).
Usage: python3 build.py <UBC '[Standard]' folder>"""
import sys, os, json, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gltfio as G
from PIL import Image

SRC = sys.argv[1]; OUT = os.path.dirname(os.path.abspath(__file__))
BODY = os.path.join(SRC, 'Base Characters', 'Godot - UE', 'Superhero_Male_FullBody.gltf')
HAIR = os.path.join(SRC, 'Hairstyles', 'Rigged to Head Bone', 'glTF (Godot -Unreal)')
old = G.load(os.path.join(OUT, '..', 'player.glb')); BONES = [old['nodes'][j]['name'] for j in old['skins'][0]['joints']]
BI = {n: i for i, n in enumerate(BONES)}
def fold(n):   # a UBC bone -> one of the 23
    if n in BI: return n
    if n.startswith('ball_leaf'): return 'ball' + n[-2:]
    for f in ('index', 'middle', 'pinky', 'ring', 'thumb'):
        if n.startswith(f): return 'hand' + n[-2:]
    raise KeyError(n)
# atlas: 2048 x 1024, regions (x, y, w, h) in pixels, image space (glTF uv: v down)
REG = {'body': (0, 0, 1024, 1024), 'hair1': (1024, 0, 512, 512), 'hair2': (1536, 0, 512, 512), 'eye': (1024, 512, 512, 512)}
AW, AH = 2048, 1024
atlas = Image.new('RGB', (AW, AH), (128, 128, 128)); refs = {}
def put(region, path):
    x, y, w, h = REG[region]; im = Image.open(path).convert('RGB').resize((w, h), Image.LANCZOS); atlas.paste(im, (x, y))
    a = np.asarray(im, dtype=np.float32) / 255; return a
def ruv(region, uv): x, y, w, h = REG[region]; return np.c_[(x + uv[:, 0] * w) / AW, (y + uv[:, 1] * h) / AH]

def prim(g, mn, region, texdir):
    W, _ = G.worlds(g); n = g['nodes'][mn]; p = g['meshes'][n['mesh']]['primitives'][0]; A = p['attributes']
    M = W[mn]; P = G.acc(g, A['POSITION']); P = (M[:3, :3] @ P.T).T + M[:3, 3]; N = G.acc(g, A['NORMAL']) @ np.linalg.inv(M[:3, :3])
    N /= np.linalg.norm(N, axis=1, keepdims=True)
    J = [g['nodes'][j]['name'] for j in g['skins'][n['skin']]['joints']]; ji = G.acc(g, A['JOINTS_0']); wi = G.acc(g, A['WEIGHTS_0']).astype(np.float64)
    S = np.zeros((len(P), len(BONES)))
    for c in range(4): np.add.at(S, (np.arange(len(P)), [BI[fold(J[k])] for k in ji[:, c]]), wi[:, c])
    top = np.argsort(-S, axis=1)[:, :4]; w = np.take_along_axis(S, top, 1); w /= w.sum(1, keepdims=True)
    dom = np.array([J[k] for k in ji[np.arange(len(P)), wi.argmax(1)]])
    uv = G.acc(g, A['TEXCOORD_0']); I = G.acc(g, p['indices']).reshape(-1, 3).astype(np.uint32)
    return dict(P=P, N=N, SI=top, SW=w, dom=dom, UV=ruv(region, uv), I=I)

body = G.load(BODY); nodes = {n['name']: i for i, n in enumerate(body['nodes']) if 'mesh' in n}
img = lambda g, k: os.path.join(os.path.dirname(BODY), g['images'][g['textures'][g['materials'][k]['pbrMetallicRoughness']['baseColorTexture']['index']]['source']]['uri'])
TEX = os.path.join(SRC, 'Base Characters', 'Textures')
bt = put('body', os.path.join(TEX, 'T_Superhero_Male_Ligh.png')); put('eye', os.path.join(TEX, 'T_Eye_Brown.png'))
h1 = put('hair1', os.path.join(SRC, 'Hairstyles', 'Textures', 'T_Hair_1_BaseColor.png')); put('hair2', os.path.join(SRC, 'Hairstyles', 'Textures', 'T_Hair_2_BaseColor.png'))

parts = {}
# ---- body: kit slots by bone + bind-pose position (metres x 1/1.0465; the shader still cuts the shorts hem, sock top and shirt hem per pixel)
b = prim(body, nodes['SuperHero_Male'], 'body', None)
# ---- leaner (a footballer, not a superhero): every vertex is pulled toward the bone segments it is skinned to (a baked shape, the bones untouched,
# so every clip still plays clean). Per bone: the factor on the distance off its segment. Chest / lats / traps / biceps / neck ~-15-20 % mass.
OW, _ = G.worlds(old); BP = {old['nodes'][j]['name']: OW[j][:3, 3] for j in old['skins'][0]['joints']}
CH = {'pelvis': 'spine_01', 'spine_01': 'spine_02', 'spine_02': 'spine_03', 'spine_03': 'neck_01', 'neck_01': 'Head', 'clavicle_l': 'upperarm_l', 'clavicle_r': 'upperarm_r',
      'upperarm_l': 'lowerarm_l', 'upperarm_r': 'lowerarm_r', 'lowerarm_l': 'hand_l', 'lowerarm_r': 'hand_r', 'thigh_l': 'calf_l', 'thigh_r': 'calf_r', 'calf_l': 'foot_l', 'calf_r': 'foot_r'}
LEAN = {'spine_03': 0.76, 'spine_02': 0.82, 'spine_01': 0.92, 'clavicle_l': 0.72, 'clavicle_r': 0.72, 'neck_01': 0.76, 'upperarm_l': 0.74, 'upperarm_r': 0.74,
        'lowerarm_l': 0.84, 'lowerarm_r': 0.84, 'thigh_l': 0.95, 'thigh_r': 0.95, 'calf_l': 0.97, 'calf_r': 0.97}
STOCK = bool(os.environ.get('STOCK'))   # STOCK=1: the stock UBC shape (no lean / cloth smoothing / loose fit), for comparisons
if STOCK: LEAN = {}
def lean(P, SI, SW):
    out = np.zeros_like(P)
    for k, nm in enumerate(BONES):
        f = LEAN.get(nm, 1.0); a = BP[nm]; bb = BP[CH[nm]] if nm in CH else a; d = bb - a; L = max(d @ d, 1e-9)
        t = np.clip(((P - a) @ d) / L, 0, 1); C = a + t[:, None] * d; w = (SW * (SI == k)).sum(1)
        out += w[:, None] * (C + f * (P - C))
    return out
b['P'] = lean(b['P'], b['SI'], b['SW']).astype(np.float32); P, dom = b['P'], b['dom']; x, y, z = P.T; ax = np.abs(x)
slot = np.zeros(len(P), np.uint8)
yc = 1.522 - 0.17 * z   # the crew neckline: lower at the front
torso = np.isin(dom, ['spine_01', 'spine_02', 'spine_03', 'clavicle_l', 'clavicle_r', 'pelvis', 'neck_01'])
slot[torso] = np.where(y[torso] > 1.08, 1, 2)
slot[torso & (y > yc)] = 0   # above the collar: neck skin
upa = np.isin(dom, ['upperarm_l', 'upperarm_r']); slot[upa] = np.where(ax[upa] - 0.212 < 0.16, 1, 0)   # short sleeves
slot[np.isin(dom, ['thigh_l', 'thigh_r', 'calf_l', 'calf_r'])] = 2   # the shader cuts shorts / skin / sock by height
slot[np.char.startswith(dom.astype(str), 'foot') | np.char.startswith(dom.astype(str), 'ball')] = 3
hand = np.array([fold(d).startswith('hand') for d in dom]); slot[hand] = 8   # 8 = hand skin (the keepers' gloves per copy)
det = b['UV']   # the shader applies the detail where the final slot is skin or hair
# cloth stands off the body: shirt 1.1 cm, shorts 1.4 cm (fading out down the thigh to the hem), nothing on skin
hem = 0.971 - 0.47 * (0.971 - 0.542)
R = 1.046633   # bind (source) -> vRest units, the shader's cut lines are in vRest
key = np.round(P / 1e-4).astype(np.int64); _, wid = np.unique(key, axis=0, return_inverse=True); wid = wid.ravel(); NW = wid.max() + 1   # weld UV seams
rep = np.zeros(NW, int); rep[wid] = np.arange(len(wid)); b['SI'] = b['SI'][rep[wid]]; b['SW'] = b['SW'][rep[wid]]   # seam copies skin bit-identically (no sub-pixel cracks in motion)
def normals(P):
    T = wid[b['I']]; Q = np.zeros((NW, 3)); np.add.at(Q, wid, P); Q /= np.bincount(wid, minlength=NW)[:, None]
    f = np.cross(Q[T[:, 1]] - Q[T[:, 0]], Q[T[:, 2]] - Q[T[:, 0]]); N = np.zeros((NW, 3))
    for c in range(3): np.add.at(N, T[:, c], f)
    N /= np.linalg.norm(N, axis=1, keepdims=True) + 1e-12; return N[wid]
ry, rx, rz = y * R, x * R, z * R; rax = np.abs(rx)
dz = rz + 0.043 + (ry - 1.591) * 0.3; dn = np.hypot(rx, dz)   # off the neck axis (the shader's crew collar: r 0.082)
body_dom = ~np.isin(dom, ['Head']) & ~hand & (ry < 1.64)
cloth = body_dom & (ry > hem * R - 0.03) & (rax < 0.389)   # shirt + shorts top, short sleeves
cloth &= ~((ry > 1.45) & (dn < 0.082))
# smooth the cloth (Taubin, no shrink): the abs / pecs / lats vanish under the fabric, the silhouette stays
T = wid[b['I']]; E = np.r_[T[:, [0, 1]], T[:, [1, 2]], T[:, [2, 0]]]; E = np.r_[E, E[:, ::-1]]
cw = np.zeros(NW, bool); cw[wid[cloth]] = True
Q = np.zeros((NW, 3)); np.add.at(Q, wid, P); cnt = np.bincount(wid, minlength=NW)[:, None]; Q /= cnt
deg = np.bincount(E[:, 0], minlength=NW)[:, None]
for it in range(0 if STOCK else 24):
    for lam in (0.5, -0.53):
        L = np.zeros((NW, 3)); np.add.at(L, E[:, 0], Q[E[:, 1]]); L = L / np.maximum(deg, 1) - Q
        Q[cw] += lam * L[cw]
P = Q[wid].astype(np.float32); N0 = normals(P)
# loose fit: shirt 1.8 cm off, shorts 1.4 cm; ramps to 0 at the collar and the sleeve hem (a smooth step, then the shader's per-pixel edge + hem band)
sh = np.clip((ry - (1.125 - 0.012)) / 0.024, 0, 1)
inf = (0.014 + 0.004 * sh) * cloth
inf *= np.clip((dn - 0.075) / 0.02, 0, 1) * (ry > 1.45) + (ry <= 1.45)
inf *= np.where(rax > 0.24, np.clip((0.389 - rax) / 0.012, 0, 1), 1.0)
P = P + N0 * (inf * (not STOCK) / R)[:, None]; b['N'] = normals(P).astype(np.float32)
# under the boot: the foot is dropped (the authored boot is the foot), the ankle stays to its collar
keep = ~np.all(y[b['I']] < 0.095, axis=1); b['I'] = b['I'][keep]
parts['body'] = dict(b, P=P, slot=slot, UV=det)
parts['eyes'] = dict(prim(body, nodes['Eyes'], 'eye', None)); parts['eyes']['slot'] = np.zeros(len(parts['eyes']['P']), np.uint8)
for name, f, reg in [('brows', 'Eyebrows_Regular.gltf', 'hair1'), ('hair_buzz', 'Hair_Buzzed.gltf', 'hair1'), ('hair_parted', 'Hair_SimpleParted.gltf', 'hair1'), ('beard', 'Hair_Beard.gltf', 'hair1')]:
    g = G.load(os.path.join(HAIR, f)); mn = [i for i, n in enumerate(g['nodes']) if 'mesh' in n][0]
    tex = g['images'][g['textures'][g['materials'][0]['pbrMetallicRoughness']['baseColorTexture']['index']]['source']]['uri']
    q = prim(g, mn, 'hair2' if 'Hair_2' in tex else 'hair1', None); q['slot'] = np.full(len(q['P']), 4, np.uint8); parts[name] = q; print(name, tex)

Hc = BP['Head'] + np.array([0, 0.09, 0.0]); q = parts['hair_parted']; d = q['P'] - Hc; r = np.linalg.norm(d, axis=1); r0 = np.percentile(r, 8)
side = np.clip(np.abs(d[:, 0]) / (r + 1e-9) * 1.6 - 0.4, 0, 1); k = 0.45 - 0.3 * side
parts['hair_crop'] = dict(q, P=(Hc + d / r[:, None] * (r0 + np.maximum(r - r0, 0) * k)[:, None]).astype(np.float32))
# reference luminances: the detail multiplies the palette colour by lum(texel) / ref
lum = lambda a: (a[..., 0] * 0.3 + a[..., 1] * 0.6 + a[..., 2] * 0.1)
def under(a, uv, reg):   # mean luminance of the texels at these atlas uvs (a = that region's image)
    x0, y0, w, h = REG[reg]; px = np.clip(((uv[:, 0] * AW - x0)).astype(int), 0, w - 1); py = np.clip(((uv[:, 1] * AH - y0)).astype(int), 0, h - 1); return float(lum(a[py, px]).mean())
refs['skin'] = under(bt, parts['body']['UV'][(parts['body']['slot'] == 0) | (parts['body']['slot'] == 8)], 'body'); refs['hair'] = under(h1, parts['hair_parted']['UV'], 'hair1')
# ---- write: per part P f32x3, N f32x3, UV f32x2, slot u8, SI u8x4, SW f32x4 -> one packed .bin, index u32
blob = bytearray(); meta = {'bones': BONES, 'refs': refs, 'atlas': [AW, AH], 'parts': {}}
def add(a, dt): global blob; a = np.ascontiguousarray(a, dtype=dt); o = len(blob); blob += a.tobytes(); blob += b'\0' * (-len(blob) % 4); return o
tris = {}
for k, q in parts.items():
    m = {'n': len(q['P']), 'ni': int(q['I'].size)}
    m['P'] = add(q['P'], np.float32); m['N'] = add(q['N'], np.float32); m['UV'] = add(q['UV'], np.float32); m['slot'] = add(q['slot'], np.uint8)
    m['SI'] = add(q['SI'], np.uint8); m['SW'] = add(q['SW'], np.float32); m['I'] = add(q['I'], np.uint32); meta['parts'][k] = m; tris[k] = int(q['I'].shape[0])
open(os.path.join(OUT, 'athlete.bin'), 'wb').write(blob); json.dump(meta, open(os.path.join(OUT, 'athlete.json'), 'w'))   # (STOCK writes the same files: re-run without it after)
atlas.save(os.path.join(OUT, 'athlete-detail.webp'), quality=88)
print('tris', tris, 'bin', len(blob) // 1024, 'kB', 'refs', refs)
