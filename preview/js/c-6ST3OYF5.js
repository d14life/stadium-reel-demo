import*as c from"three";var m=window.__stadium,q=new URLSearchParams(location.search);window.__hqm={ready:!1};var b=a=>new Promise(n=>{let h=()=>a()?n():setTimeout(h,150);h()}),w=`
  float hqFab(vec3 r, float s) {
    float u = r.x + 0.7 * r.z, v = r.y;
    if (s == 1.0) { vec2 q = vec2(u, v) * 900.0; return 0.5 * sin(q.x) * sin(q.y) + 0.25 * sin(q.x * 0.5 + q.y * 0.5); }   // pique knit, ~7 mm cells
    if (s == 2.0) return 0.35 * sin((u * 0.4 + v) * 1400.0);   // satin twill diagonal
    if (s == 3.0) return 0.8 * sin(u * 1900.0);                 // ribbed sock (vertical ribs)
    if (s == 5.0) return 0.25 * sin(u * 1300.0) * sin(v * 1300.0);   // knit boot upper
    return 0.0; }`,y=`
  uniform vec3 uHqHair[32]; uniform float uHqSC;
  float hqN(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    float a = fract(sin(dot(i, vec2(127.1, 311.7))) * 43758.5), b = fract(sin(dot(i + vec2(1.0, 0.0), vec2(127.1, 311.7))) * 43758.5);
    float c = fract(sin(dot(i + vec2(0.0, 1.0), vec2(127.1, 311.7))) * 43758.5), d = fract(sin(dot(i + vec2(1.0), vec2(127.1, 311.7))) * 43758.5);
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y); }
  vec2 hqFlow(vec3 r) { vec3 q = r / uHqSC - vec3(0.0, 1.70, -0.01); float th = atan(q.x, q.z), ph = acos(clamp(q.y / max(length(q), 1e-4), -1.0, 1.0)); return vec2(th, ph); }   // around the crown: strands run along phi
  float hqHairH(vec3 r) { vec2 f = hqFlow(r); float n = hqN(vec2(f.x * 9.0, f.y * 3.0)); return 0.55 * sin(f.x * 260.0 + n * 6.0) + 0.45 * (hqN(vec2(f.x * 60.0, f.y * 14.0)) - 0.5); }`;async function x(){await b(()=>window.__rig&&m.scene.getObjectByName("rig-mesh"));let a=m.scene.getObjectByName("rig-mesh"),n=a.material,h=n.onBeforeCompile;a.castShadow=!0;let i=a.geometry,o=i.attributes.position.array,g=i.attributes.aRest.array,f=i.attributes.uv.array,d=1;for(let r=0;r<o.length/3;r++)if(Math.abs(o[r*3])>.2){d=g[r*3]/o[r*3];break}{let r=e=>Math.abs(f[e*2]-.5625)<.001&&o[e*3+1]>1.692&&o[e*3+1]<1.73&&o[e*3+2]>.055,l={};for(let e=0;e<o.length/3;e++)if(r(e)){let t=Math.floor(f[e*2+1]*32)*2+(o[e*3]>0?1:0);(l[t]||=[]).push(o[e*3+1])}for(let e in l){let t=l[e];l[e]=t.reduce((s,u)=>s+u,0)/t.length}for(let e=0;e<o.length/3;e++)if(r(e)){let t=Math.floor(f[e*2+1]*32)*2+(o[e*3]>0?1:0);o[e*3+1]=l[t]+(o[e*3+1]-l[t])*.65,o[e*3+2]-=.0025;for(let s=0;s<3;s++)g[e*3+s]=o[e*3+s]*d}i.attributes.position.needsUpdate=i.attributes.aRest.needsUpdate=!0}let v=Array.from({length:32},()=>new c.Vector3(.0045,.0036,.0032)),p=()=>{let r=n.map?.image?.data;if(!r)return;let l=0;for(let e=0;e<22;e++){let t=(e*8+4)*4,s=new c.Color().setRGB(r[t]/255,r[t+1]/255,r[t+2]/255,c.SRGBColorSpace);v[e].set(s.r,s.g,s.b)}};p(),setInterval(p,1e3),n.onBeforeCompile=(r,l)=>{h(r,l),Object.assign(r.uniforms,{uHqHair:{value:v},uHqSC:{value:d}});let e=r.fragmentShader,t=(s,u)=>{if(!e.includes(s))throw new Error("hq match: shader anchor missing: "+s.slice(0,40));e=e.replace(s,u)};t("void main() {",w+y+`
void main() {
  float hqS = -1.0, hqHr = 0.0;`),t("vec4 kc = texture2D(map, vec2((slot + 0.5) / 8.0, vMapUv.y));",`vec4 kc = texture2D(map, vec2((slot + 0.5) / 8.0, vMapUv.y));
    { vec3 sk = texture2D(map, vec2(0.5 / 8.0, vMapUv.y)).rgb, rr = vRest / uHqSC; float ax = abs(rr.x);
      vec3 hc = uHqHair[int(row)];   // dark skin -> black hair, always (decided in JS from the same palette skin colour)
      float sw = 0.0;   // round 3: a feathered mask (a few mm soft edge), not a hard boolean: the shells' stair-step edge melts into it instead of standing on a flat patch
      if (false) {   // fix143: off: the players.js hairline does the scalp in both modes (this mask ran below it: hair colour on the neck skin)
        float top = smoothstep(1.762, 1.778, rr.y);
        float back = smoothstep(-0.004, -0.018, rr.z) * smoothstep(1.652, 1.668, rr.y);
        float side = smoothstep(0.046, 0.056, ax) * (1.0 - smoothstep(0.072, 0.078, ax)) * smoothstep(1.688, 1.702, rr.y) * (1.0 - smoothstep(0.026, 0.040, rr.z));
        float burn = smoothstep(0.050, 0.059, ax) * (1.0 - smoothstep(0.074, 0.080, ax)) * smoothstep(1.668, 1.682, rr.y) * (1.0 - smoothstep(1.738, 1.75, rr.y)) * smoothstep(-0.018, -0.008, rr.z) * (1.0 - smoothstep(0.028, 0.040, rr.z));
        sw = max(max(top, back), max(side, burn)); }
      if (sw > 0.0) { kc.rgb = mix(kc.rgb, hc, sw); if (sw > 0.5) { slot = 4.0; hqHr = 1.0; } }   // same tone as the shell (round 2 painted it 8 % darker: a visible patch)
      else if (slot == 4.0) { bool brow = rr.y > 1.692 && rr.y < 1.73 && rr.z > 0.055, beard = rr.y < 1.69;
        float hl = dot(hc, vec3(0.2126, 0.7152, 0.0722));
        kc.rgb = brow ? mix(hc * (hl > 0.05 ? 0.55 : 1.0), sk, 0.18) : hc; hqHr = brow ? 0.3 : beard ? 0.45 : 1.0; } }   // beard + brows matte, no strand bump (round 1: lacquered white streaks)`),t("kc.rgb *= hemSh;",`kc.rgb *= hemSh; hqS = slot;
    if (hqHr > 0.5) { vec2 fl = hqFlow(vRest); kc.rgb *= 0.78 + 0.34 * hqN(vec2(fl.x * 22.0, fl.y * 6.0)); }   // strand clumps (no single flat helmet tone)`),t("kc.rgb *= hemSh;","kc.rgb *= hemSh; hqS = slot;"),t("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
  if (hqS == 1.0) roughnessFactor = 0.6; else if (hqS == 2.0) roughnessFactor = 0.42; else if (hqS == 3.0) roughnessFactor = 0.75; else if (hqS == 5.0) roughnessFactor = 0.3; else if (hqS == 0.0) roughnessFactor = 0.62;
  if (hqHr > 0.5) { float fe = 1.0 - abs(dot(normalize(vNormal), normalize(vViewPosition))); roughnessFactor = mix(0.6, 0.95, smoothstep(0.45, 0.85, fe)); }   // round 3: no sharp grazing highlights (the pale shards above the ear) else if (hqHr > 0.0 && hqHr < 0.5) roughnessFactor = 0.75;   // hair: a soft sheen (rich, not flat or plastic); brows matte`),t("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
  { float h = (hqHr > 0.5 ? hqHairH(vRest) * 0.4 : hqFab(vRest, hqS)) * 0.00035, fw = (abs(dFdx(vRest.x)) + abs(dFdy(vRest.x)) + fwidth(vRest.y)) * (hqS == 3.0 ? 1900.0 : hqS == 2.0 ? 1400.0 : hqS == 5.0 ? 1300.0 : 900.0) * 0.5; h *= 1.0 - smoothstep(0.35, 1.2, fw);   // three.js perturbNormalArb, on a procedural height
    vec3 sx = dFdx(-vViewPosition), sy = dFdy(-vViewPosition), r1 = cross(sy, normal), r2 = cross(normal, sx); float det = dot(sx, r1);
    vec3 g = sign(det) * (dFdx(h) * r1 + dFdy(h) * r2); normal = normalize(abs(det) * normal - g); }`),t("{ float jm = max(",`{ float fr = pow(1.0 - clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0), 3.0); outgoingLight += vec3(0.55, 0.62, 0.75) * fr * 0.18 * diffuseColor.rgb; }   // broadcast rim: the floodlights behind him outline the silhouette
  { float jm = max(`),r.fragmentShader=e},n.needsUpdate=!0}async function k(){await b(()=>m.mdBall&&window.__rig);let a=m.mdBall,n=a.material,h=n.onBeforeCompile;a.geometry.dispose(),a.geometry=new c.IcosahedronGeometry(.13,12),a.castShadow=!0,n.roughness=.28,n.onBeforeCompile=(i,o)=>{h(i,o),i.fragmentShader=i.fragmentShader.replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
  { const float P = 1.618034; vec3 a = abs(normalize(vBP)); float d1 = -1.0, d2 = -1.0;
    vec3 C[7]; C[0] = normalize(vec3(0.0, 1.0, P)); C[1] = normalize(vec3(1.0, P, 0.0)); C[2] = normalize(vec3(P, 0.0, 1.0)); C[3] = normalize(vec3(1.0));
    C[4] = normalize(vec3(0.0, 1.0 / P, P)); C[5] = normalize(vec3(1.0 / P, P, 0.0)); C[6] = normalize(vec3(P, 0.0, 1.0 / P));
    for (int k = 0; k < 7; k++) { float d = dot(a, C[k]); if (d > d1) { d2 = d1; d1 = d; } else if (d > d2) d2 = d; }
    float seam = 1.0 - smoothstep(0.0, 0.006, d1 - d2);
    diffuseColor.rgb *= 1.0 - 0.55 * seam; roughnessFactor = mix(roughnessFactor, 0.8, seam); }`)},n.needsUpdate=!0}function S(){let a=m.renderer?.domElement||document.querySelector("canvas");a&&(a.style.filter=q.get("grade")||"saturate(1.3) contrast(1.12)")}Promise.all([x(),k()]).then(()=>{S(),window.__hqm.ready=!0,console.log("reel-hq-match ready")}).catch(a=>{window.__hqm.error=String(a),window.__hqm.ready=!0,console.error("reel-hq-match",a)});
