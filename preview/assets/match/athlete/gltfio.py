# tiny glTF/GLB reader: node world matrices, skins, mesh attributes (numpy)
import json, struct, os, numpy as np
CT = {5120: np.int8, 5121: np.uint8, 5122: np.int16, 5123: np.uint16, 5125: np.uint32, 5126: np.float32}
NC = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4, 'MAT4': 16}
def load(path):
    if path.endswith('.glb'):
        b = open(path, 'rb').read(); jl = struct.unpack('<I', b[12:16])[0]; g = json.loads(b[20:20 + jl]); bins = [b[28 + jl:]]
    else:
        g = json.load(open(path)); d = os.path.dirname(path); bins = [open(os.path.join(d, x['uri']), 'rb').read() for x in g['buffers']]
    g['_bins'] = bins; return g
def acc(g, i):
    a = g['accessors'][i]; bv = g['bufferViews'][a['bufferView']]; n = NC[a['type']]; dt = np.dtype(CT[a['componentType']])
    off = bv.get('byteOffset', 0) + a.get('byteOffset', 0); st = bv.get('byteStride', 0) or n * dt.itemsize
    raw = np.frombuffer(g['_bins'][bv['buffer']], dtype=np.uint8, count=st * (a['count'] - 1) + n * dt.itemsize, offset=off)
    out = np.lib.stride_tricks.as_strided(raw, shape=(a['count'], n * dt.itemsize), strides=(st, 1)).copy().view(dt).reshape(a['count'], n)
    if a.get('normalized'): out = out.astype(np.float32) / np.iinfo(dt).max
    return out
def q2m(q):
    x, y, z, w = q; return np.array([[1-2*(y*y+z*z), 2*(x*y-z*w), 2*(x*z+y*w)], [2*(x*y+z*w), 1-2*(x*x+z*z), 2*(y*z-x*w)], [2*(x*z-y*w), 2*(y*z+x*w), 1-2*(x*x+y*y)]])
def local(n):
    if 'matrix' in n: return np.array(n['matrix']).reshape(4, 4).T
    M = np.eye(4); M[:3, :3] = q2m(n.get('rotation', [0, 0, 0, 1])) * np.array(n.get('scale', [1, 1, 1])); M[:3, 3] = n.get('translation', [0, 0, 0]); return M
def worlds(g):
    par = {}; [par.__setitem__(c, i) for i, n in enumerate(g['nodes']) for c in n.get('children', [])]
    W = {}
    def w(i):
        if i not in W: W[i] = (w(par[i]) if i in par else np.eye(4)) @ local(g['nodes'][i])
        return W[i]
    for i in range(len(g['nodes'])): w(i)
    return W, par
