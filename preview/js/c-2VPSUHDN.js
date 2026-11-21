import{c as y}from"./c-YYGV3A7A.js";import*as s from"three";import{RoomEnvironment as E}from"three/addons/environments/RoomEnvironment.js";var a={plastic:{alb:.45,r:.35,m:0,env:1.2,sc:60,bump:35e-5,tint:.2,rv:.34,rim:.3,pat:7,far:12,clip:.7},fabric:{alb:.35,r:.86,m:0,env:.22,sc:0,bump:0,tint:0,rv:0,rim:.4,pat:0,far:0,clip:.7},steel:{r:.28,m:.92,env:1.2,sc:300,bump:4e-4,tint:.1,rv:.2,rim:.1,pat:2,far:14},concrete:{r:.9,m:0,env:.18,sc:1,bump:.012,tint:.3,rv:.08,rim:0,pat:3,far:40},paint:{r:.42,m:.05,env:.5,sc:120,bump:3e-4,tint:.06,rv:.1,rim:.14,pat:0,far:18},paving:{r:.88,m:0,env:.2,sc:1,bump:.008,tint:.2,rv:.08,rim:0,pat:3,far:40},vinyl:{r:.35,sc:900,tint:.07,rim:0,pat:5,far:14,basic:1},led:{r:.2,sc:0,tint:.18,rim:0,pat:6,far:10,basic:1},cloth:{r:.82,m:0,env:.15,sc:650,bump:18e-5,tint:.08,rv:.06,rim:.18,pat:1,far:10},roofsteel:{r:.45,m:.6,env:.8,sc:0,bump:0,tint:0,rv:0,rim:.06,pat:0,far:0},turf:{r:.92,m:0,env:.1,sc:0,bump:0,tint:0,rv:0,rim:0,pat:0,far:0},glass:{r:.04,m:0,env:1.3,sc:0,bump:0,tint:0,rv:0,rim:.35,pat:4,far:0}};a.plastic.tex={name:"plastic",tile:2.5,amp:1.75,ramp:1,ns:.55,tf:22,lb:2,nb:1.5,mot:.07,rel:.35};a.fabric.tex={name:"fabric",tile:.4,amp:1,ramp:.5,ns:.35,tf:16,lb:1,nb:1,mot:.04,rel:.3};a.concrete.tex={name:"concrete",tile:3,amp:1.3,ramp:.6,ns:.8,tf:30,lb:1,nb:1,mot:.1,rel:.5};a.steel.tex={name:"steel",tile:1.2,amp:.8,ramp:1,ns:.5,tf:14,lb:1,nb:1,mot:.05,rel:.4};a.roofsteel.tex={...a.steel.tex,tile:2.5,tf:30};a.turf.tex={name:"turf",tile:.8,amp:.7,ramp:.5,ns:.9,tf:25,lb:.5,nb:.5,mot:.06,rel:.6};a.paint.tex={name:"membrane",tile:.8,amp:1,ramp:.6,ns:.6,tf:20,lb:.5,nb:.5,mot:.08,rel:.4};a.paving.tex={name:"paving",tile:2.5,amp:1,ramp:.6,ns:.8,tf:30,lb:1,nb:1,mot:.1,rel:.5};a.glass.tex={name:"concrete",tile:2,amp:.05,ramp:2.5,ns:.03,tf:12,lb:2,nb:2,mot:0,rel:0};var f=new URLSearchParams(location.search),h=f.get("texdbg"),x=f.get("mat")!=="0",v=new Map,F=x&&f.get("tex")!=="off"&&(f.get("hq")==="1"||window.__gfx===!0),u={},q=y(),S=f.get("tex")||(q?q.tex>=1024?"max":"lite":matchMedia("(pointer: coarse)").matches||innerWidth<820?"lite":"max"),d=S==="lite",g=d&&!q,T=e=>{let t=new s.DataTexture(new Uint8Array(e),1,1);return t.needsUpdate=!0,t},z=T([128,128,128,255]),C=T([128,128,255,255]);function L(e,t){if(u[t])return u[t];let r=Math.min(g?4:8,e.capabilities.getMaxAnisotropy()),o={l:{value:z},n:{value:C},r:{value:z}},m=t==="plastic"||t==="fabric"?`./assets/tex/seats/seat-${t}-`:`./assets/tex/${t}/${t}-`,n=(l,c)=>new s.TextureLoader().load(new URL(m+l+".jpg",import.meta.url).href,i=>{i.wrapS=i.wrapT=s.RepeatWrapping,i.anisotropy=r,c.value=i});return requestAnimationFrame(()=>requestAnimationFrame(()=>{n(d?"lum-512":"lum",o.l),n(d?"nor-512":"nor",o.n),g||n("rough",o.r)})),u[t]=o}var b=null,p=null,$=!1;function B(e){if(!x||p)return;b=e;let t=new s.PMREMGenerator(e),r=new E;p=t.fromScene(r,.04).texture,t.dispose(),r.dispose()}var G=(e,t)=>(x&&e&&a[t]&&($&&p?queueMicrotask(()=>_(e,t)):v.set(e,t)),e),w=`
float hqHs(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float hqN(vec3 x) { vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hqHs(i), hqHs(i + vec3(1, 0, 0)), f.x), mix(hqHs(i + vec3(0, 1, 0)), hqHs(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(hqHs(i + vec3(0, 0, 1)), hqHs(i + vec3(1, 0, 1)), f.x), mix(hqHs(i + vec3(0, 1, 1)), hqHs(i + vec3(1, 1, 1)), f.x), f.y), f.z); }
vec3 hqBump(vec3 pos, vec3 N, float h) { vec3 sx = dFdx(pos), sy = dFdy(pos), r1 = cross(sy, N), r2 = cross(N, sx); float det = dot(sx, r1);
  vec3 g = sign(det) * (dFdx(h) * r1 + dFdy(h) * r2); return normalize(abs(det) * N - g); }
`;function N(e){let t="vec2 uv = abs(wn.y) > 0.6 ? p.xz : (abs(wn.x) > abs(wn.z) ? p.zy : p.xy);";return e.pat===1?`${t} uv *= ${e.sc.toFixed(1)}; float aa = 1.0 - smoothstep(0.6, 2.2, max(fwidth(uv.x), fwidth(uv.y))); float wa = abs(sin(uv.x)), wb = abs(sin(uv.y)); float cel = step(0.0, sin(uv.x * 0.5) * sin(uv.y * 0.5));
    h = mix(0.5, mix(wa, wb, cel), aa) * 0.55 + 0.45 * (hqN(p * 35.0) * 0.6 + hqN(p * 140.0) * 0.4);`:e.pat===5?`${t} uv *= ${e.sc.toFixed(1)}; float aa = 1.0 - smoothstep(0.6, 2.2, max(fwidth(uv.x), fwidth(uv.y))); h = mix(0.5, 0.5 + 0.5 * sin(uv.x) * sin(uv.y), aa) * 0.6 + 0.4 * hqN(p * 220.0);`:e.pat===6?`vec2 lu = vMapUv * vec2(textureSize(map, 0)); vec2 cf = abs(fract(lu) - 0.5); float aa = 1.0 - smoothstep(0.25, 0.7, max(fwidth(lu.x), fwidth(lu.y)));
    h = mix(0.75, 1.0 - smoothstep(0.30, 0.48, max(cf.x, cf.y)) * 0.9 - 0.1 * step(0.36, cf.y), aa);`:e.pat===2?`${t} h = hqN(vec3(uv.x * ${(e.sc*.012).toFixed(2)}, uv.y * ${e.sc.toFixed(1)}, 0.0)) * 0.7 + 0.3 * hqN(p * 60.0);`:e.pat===3?"h = hqN(p * 1.7) * 0.4 + hqN(p * 9.0) * 0.3 + hqN(p * 45.0) * 0.2 + hqN(p * 160.0) * 0.1; h -= 0.55 * smoothstep(0.86, 0.95, hqN(p * 70.0 + 3.1));":e.pat===7?`h = hqN(p * ${e.sc.toFixed(1)}) * 0.45 + hqN(p * ${(e.sc*2.9).toFixed(1)}) * 0.25 + 0.3 * smoothstep(0.55, 0.9, hqN(vec3(p.x * 9.0, p.y * 140.0, p.z * 9.0) + 7.3)) * smoothstep(0.35, 0.7, hqN(p * 4.0));`:`h = hqN(p * ${e.sc.toFixed(1)}) * 0.65 + hqN(p * ${(e.sc*2.9).toFixed(1)}) * 0.35;`}function K(e){let t=(1/e.tile).toFixed(3);return e=g?{...e,tf:e.tf*.5,ns:e.ns*.6}:e,`float hqTF = 1.0; { float hqD = length(vViewPosition), hqK = 1.0 - smoothstep(${(e.tf*.5).toFixed(1)}, ${e.tf.toFixed(1)}, hqD);
  if (hqK > 0.001) { vec3 p = vHqW * ${t}, wn = normalize((vec4(normal, 0.0) * viewMatrix).xyz), bw = pow(abs(wn), vec3(4.0)); bw /= bw.x + bw.y + bw.z;
    vec2 ux = p.zy, uy = p.xz, uz = p.xy;
    float lum = dot(vec3(texture2D(hqTL, ux, ${e.lb.toFixed(1)}).r, texture2D(hqTL, uy, ${e.lb.toFixed(1)}).r, texture2D(hqTL, uz, ${e.lb.toFixed(1)}).r), bw) * 2.0, rg = dot(vec3(texture2D(hqTR, ux, 1.0).r, texture2D(hqTR, uy, 1.0).r, texture2D(hqTR, uz, 1.0).r), bw) * 2.0;
    vec3 nx = texture2D(hqTN, ux, ${e.nb.toFixed(1)}).xyz * 2.0 - 1.0, ny = texture2D(hqTN, uy, ${e.nb.toFixed(1)}).xyz * 2.0 - 1.0, nz = texture2D(hqTN, uz, ${e.nb.toFixed(1)}).xyz * 2.0 - 1.0; float ns = ${e.ns.toFixed(2)} * hqK;
    nx = vec3(nx.xy * ns + wn.zy, abs(nx.z) * wn.x); ny = vec3(ny.xy * ns + wn.xz, abs(ny.z) * wn.y); nz = vec3(nz.xy * ns + wn.xy, abs(nz.z) * wn.z);
    vec3 tw = normalize(nx.zyx * bw.x + ny.xzy * bw.y + nz.xyz * bw.z);
    vec3 hqV = normalize(vViewPosition), hqNv = normalize((viewMatrix * vec4(tw, 0.0)).xyz); float hqC = clamp(dot(hqNv, hqV) / max(abs(dot(normal, hqV)), 0.25), 0.55, 1.35);
    float hqMo = hqN(vHqW * 1.6) * 0.6 + hqN(vHqW * 5.3) * 0.4;   // broad moulding mottle: 10-60 cm blotches
    hqTF = max(0.0, 1.0 + (${e.amp.toFixed(2)} * (lum - 1.0) + ${e.mot.toFixed(3)} * (hqMo - 0.5) * 2.0) * hqK) * mix(1.0, hqC, hqK * ${e.rel.toFixed(2)}); roughnessFactor = clamp(roughnessFactor * (1.0 + ${e.ramp.toFixed(2)} * (rg - 1.0) * hqK), 0.03, 1.0);
    normal = hqNv; } }`}function _(e,t){if(a[t].basic)return W(e,t);if(!e.isMeshStandardMaterial)return;let r=a[t],o=e.onBeforeCompile,m=e.customProgramCacheKey();e.userData.hqKind=t,e.roughness=r.r,e.metalness=r.m,e.envMap=p,e.envMapIntensity=r.env,e.onBeforeCompile=function(n,l){if(o&&o.call(this,n,l),!n.vertexShader.includes("#include <project_vertex>")||!n.fragmentShader.includes("#include <normal_fragment_maps>")||n.vertexShader.includes("varying vec3 vHqW;"))return;n.vertexShader=`varying vec3 vHqW;
`+n.vertexShader.replace("#include <project_vertex>",`#include <project_vertex>
{ vec4 hqw = vec4(transformed, 1.0);
#ifdef USE_INSTANCING
hqw = instanceMatrix * hqw;
#endif
vHqW = (modelMatrix * hqw).xyz; }`);let c=F&&r.tex,i=c&&L(b,r.tex.name);c&&(n.uniforms.hqTL=i.l,n.uniforms.hqTN=i.n,n.uniforms.hqTR=i.r,n.uniforms.hqExp={get value(){return(l||b).toneMappingExposure}});let H=c?K(r.tex):r.far>0?`{ float hqD = length(vViewPosition), hqK = 1.0 - smoothstep(${(r.far*.4).toFixed(1)}, ${r.far.toFixed(1)}, hqD);
      if (hqK > 0.001) { vec3 p = vHqW, wn = normalize((vec4(normal, 0.0) * viewMatrix).xyz); float h = 0.0; ${N(r)}
        diffuseColor.rgb *= 1.0 + ${r.tint.toFixed(3)} * (h - 0.5) * 2.0 * hqK; roughnessFactor = clamp(roughnessFactor + ${r.rv.toFixed(3)} * (h - 0.5) * hqK, 0.03, 1.0);
        normal = hqBump(-vViewPosition, normal, h * ${r.bump.toFixed(5)} * hqK); } }`:"",M=r.rim>0?`{ float hqF = pow(1.0 - clamp(abs(dot(normal, normalize(vViewPosition))), 0.0, 1.0), 3.0); totalEmissiveRadiance += (diffuseColor.rgb * 0.6 + 0.12) * ${r.rim.toFixed(3)} * hqF;`+(r.pat===4?" diffuseColor.a = mix(diffuseColor.a, min(1.0, diffuseColor.a * 2.5 + 0.2), hqF);":"")+" }":"";n.fragmentShader=`varying vec3 vHqW;
`+(c?`uniform sampler2D hqTL, hqTN, hqTR;
uniform float hqExp;
`:"")+w+n.fragmentShader.replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
`+(r.alb?`diffuseColor.rgb *= ${r.alb.toFixed(2)};
`:"")+H).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
`+M),r.clip&&(n.fragmentShader=n.fragmentShader.replace("#include <opaque_fragment>",`${R(r.clip)}
#include <opaque_fragment>`)),c&&(n.fragmentShader=n.fragmentShader.replace("#include <tonemapping_fragment>",`#include <tonemapping_fragment>
`+D+(h==="1"?`
gl_FragColor.rgb = fract(vHqW * 3.0);`:h==="2"?`
gl_FragColor.rgb = vec3(0.5 + (hqTF - 1.0) * 2.0);`:h==="3"?`
gl_FragColor.rgb = texture2D(hqTL, vHqW.xy * ${(1/r.tex.tile).toFixed(3)}).rgb;`:"")))},e.customProgramCacheKey=()=>m+"|hq-"+t+(F&&r.tex?"-tex":""),e.needsUpdate=!0}var D=`#ifdef TONE_MAPPING
gl_FragColor.rgb *= hqTF;
#else
{ vec3 hqX = max(gl_FragColor.rgb * hqExp, 0.0), hqY = min(clamp(hqX * (2.51 * hqX + 0.03) / (hqX * (2.43 * hqX + 0.59) + 0.14), 0.0, 1.0) * hqTF, 0.985);
  vec3 hqA = hqY * 2.43 - 2.51, hqB = hqY * 0.59 - 0.03; gl_FragColor.rgb = (-hqB - sqrt(max(hqB * hqB - 0.56 * hqA * hqY, 0.0))) / (2.0 * hqA) / hqExp; }
#endif
`,R=(e=1)=>{let t=(1.3*e).toFixed(3);return`{ float hqM = max(max(outgoingLight.r, outgoingLight.g), outgoingLight.b); outgoingLight *= ${t} * (1.0 - exp(-hqM / ${t})) / max(hqM, 1e-4); }`},P=`#include <project_vertex>
{ vec4 hqw = vec4(transformed, 1.0);
#ifdef USE_INSTANCING
hqw = instanceMatrix * hqw;
#endif
vHqW = (modelMatrix * hqw).xyz; }`;function W(e,t){if(!e.isMeshBasicMaterial||!e.map)return;let r=a[t],o=e.onBeforeCompile,m=e.customProgramCacheKey();e.onBeforeCompile=function(n,l){o&&o.call(this,n,l),!(!n.vertexShader.includes("#include <project_vertex>")||!n.fragmentShader.includes("#include <map_fragment>"))&&(n.vertexShader=`varying vec3 vHqW;
`+n.vertexShader.replace("#include <project_vertex>",P),n.fragmentShader=`varying vec3 vHqW;
`+w+n.fragmentShader.replace("#include <map_fragment>",`#include <map_fragment>
{ vec3 p = vHqW, V = cameraPosition - p; float hqD = length(V), hqK = 1.0 - smoothstep(${(r.far*.4).toFixed(1)}, ${r.far.toFixed(1)}, hqD);
  if (hqK > 0.001) { vec3 wn = normalize(cross(dFdx(p), dFdy(p))); float h = 0.0; ${N(r)}
    V /= hqD; wn *= sign(dot(wn, V)); vec3 Hh = normalize(V + normalize(vec3(-p.x, 60.0 - p.y, -p.z)));
    float sp = pow(max(dot(wn, Hh), 0.0), ${(2/(r.r*r.r)).toFixed(1)}) * ${(.5*(1-r.r)).toFixed(2)};
    diffuseColor.rgb = diffuseColor.rgb * (1.0 + ${r.tint.toFixed(3)} * (h - 0.5) * 2.0 * hqK) * mix(1.0, h, ${r.pat===6?"0.55":"0.0"} * hqK) + sp * h * hqK * 0.6; } }`))},e.customProgramCacheKey=()=>m+"|hq-"+t,e.needsUpdate=!0}var U=()=>p,I=w;function X(){if(!x||!p)return 0;let e=0;for(let[t,r]of v)_(t,r),e++;return v.clear(),$=!0,e}var j=x;export{B as a,G as b,U as c,I as d,X as e,j as f};
