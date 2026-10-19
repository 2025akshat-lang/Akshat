/* CANCER progression (live): normal epithelium -> checkpoint failure -> repeated mitosis -> carcinoma in situ -> invasive. division.js ke baad load karo. */
(() => {
const D = window.CVDiv;
if (!D) throw new Error('division.js pehle load hona chahiye (cancer.js usse baad)');
const PI = Math.PI;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x)), lerp = (a, b, t) => a + (b - a) * t, ease = t => t * t * (3 - 2 * t);
D.PH.can = [
  { n: 'Normal epithelium', s: 'Ek parat, BM saabut', d: 3.2 },
  { n: 'Checkpoint fail', s: 'TP53 / RB gaye', d: 3.4 },
  { n: 'Baar-baar mitosis', s: 'Cells jama hote', d: 3.6 },
  { n: 'Carcinoma in situ', s: 'BM ke upar', d: 3.4 },
  { n: 'Invasive carcinoma', s: 'BM toota, fail gaya', d: 4.2 }];
const GREEN = [.43, .75, .48], ORANGE = [.94, .63, .25], RED = [.82, .2, .2];
const col3 = c => c < 1 ? GREEN.map((v, i) => lerp(v, ORANGE[i], c)) : ORANGE.map((v, i) => lerp(v, RED[i], clamp(c - 1, 0, 1)));

/* target table: har cell ke liye har phase mein {x,y,s,c,v} */
const N_BASE = 11, EX = [], INV = [];
for (let l = 1; l <= 3; l++) for (let x = -3; x <= 3; x++) EX.push({ x, y: .55 + .7 * l });
const IP = [[-.2, -.55], [.35, -.9], [-.5, -1.3], [.2, -1.6], [.7, -1.95], [-.1, -2.2], [-.7, -1.9], [.9, -2.35], [.1, -2.4], [-.4, -2.5], [1.4, -2.3], [-1.2, -2.35]];
IP.forEach(p => INV.push({ x: p[0], y: p[1] }));
const N = N_BASE + EX.length + INV.length;
const tgt = (ph, i) => {
  if (i < N_BASE) { const x = i - 5, mut = Math.abs(x) <= 1;
    return { x, y: .55, s: 1, c: ph === 0 ? 0 : ph === 1 ? (mut ? 1 : 0) : ph === 2 ? (mut ? 1.2 : 0) : ph >= 3 ? (Math.abs(x) <= 3 ? 2 : 0) : 0, v: 1 }; }
  if (i < N_BASE + EX.length) { const e = EX[i - N_BASE], j = i - N_BASE;
    if (ph < 2) return { x: e.x, y: e.y, s: 0, c: 1, v: 0 };
    if (ph === 2) return { x: e.x, y: e.y, s: .9, c: 1.3, v: (Math.abs(e.x) <= 1 && e.y < 2.3) ? 1 : 0 };
    return { x: e.x, y: e.y + (ph === 4 ? .08 : 0), s: .95, c: 2, v: 1 }; }
  const j = i - N_BASE - EX.length;
  return { x: INV[j].x, y: INV[j].y, s: .8, c: 2, v: ph === 4 ? 1 : 0 };
};

registerCellModel('cancer', (THREE, group, opt) => {
  D.kind = 'can'; D.ph = 0; D.p = 0; D.playing = true; D.hold = false; D.fire();
  const k = CVKit.make(THREE, group, opt), T3 = k.T3, mat = k.mat;
  /* stroma */
  k.setPart('str', 'Stroma (connective tissue)', 'Basement membrane ke neeche ka tissue: collagen fibres, fibroblast, khoon ki nalis. Invasive cancer yahin phailta hai aur nali tak pahunchkar metastasis shuru karta hai.', 'cn_bm', 'cell');
  k.out(k.add(new T3.BoxGeometry(11.4, 2.9, 1.2), mat(0xe0a0a8, .22), 0, -1.65, 0));
  for (let i = 0; i < 9; i++) { const y = -.5 - i * .24; k.tube([[-5.6, y, -.3 + .1 * (i % 3)], [-2, y - .12, .1], [2, y + .1, -.1], [5.6, y - .05, .2]], .025, 16, mat(0xf2d6b0, .75)); }
  k.setPart('ves', 'Blood vessel', 'Khoon ki nali: invasive cancer cells yahan ghuskar (intravasation) khoon ke saath doosre ango tak jaate hain: yahi metastasis hai.', 'cn_bm', 'cell');
  k.tube([[-5.6, -2.4, 0], [-2, -2.45, 0], [2, -2.35, 0], [5.6, -2.4, 0]], .36, 30, mat(0xc02a2a, .55));
  /* basement membrane: 2 halves */
  k.setPart('bm', 'Basement membrane', 'Epithelium ke neeche ki patli chadar (collagen IV + laminin). Normal/in situ mein ye saabut rehti hai. Invasive cancer MMP enzymes se ise todta hai: yahi cancer ka "invasive" hone ka nishan hai.', 'cn_bm', 'cell');
  const BL = k.add(new T3.BoxGeometry(1, .14, 1.3), mat(0xf2e6a0, .95), -2.9, 0, 0), BR = k.add(new T3.BoxGeometry(1, .14, 1.3), mat(0xf2e6a0, .95), 2.9, 0, 0);
  const bm = g => { const W = 5.6; const wl = Math.max(.01, W - g / 2); BL.scale.x = wl; BL.position.x = -(g / 2 + wl / 2); BR.scale.x = wl; BR.position.x = g / 2 + wl / 2; };
  bm(0);
  /* cells */
  const CELL = [], geo = k.sph(.46, 18, 14), ngeo = k.sph(.2, 12, 10);
  for (let i = 0; i < N; i++) {
    const tum = i >= N_BASE, key = tum ? 'tum' : 'epi';
    k.setPart('epi', 'Normal epithelial cell', 'Normal epithelium: ek parat ke cells, basement membrane par tike, apni jagah par. Cell cycle checkpoints (TP53, RB) hone se kharab DNA wale cell ruk jaate ya apoptosis karte hain.', 'cn_cycle', 'cell');
    if (tum) k.setPart('tum', 'Cancer cell', 'Mutation se (TP53, RB, RAS ...) ye cell checkpoint ignore karke baar-baar baantta hai, apoptosis se bachta hai, aur doosre cells ko dabakar jama hota hai. Baad mein BM todkar phailta hai.', 'cn_cycle', 'cell');
    const c = k.add(geo, mat(0x6ec07a, .85, 0x000000, 0), 0, 0, 0); c.scale.set(0, 0, 0);
    k.setPart('nuc', 'Nucleus', 'Cancer cell ka nucleus bada aur aniyamit (pleomorphism), DNA zyada (aneuploidy) aur gehra rang: pathologist yahi dekhkar cancer pehchante hain.', 'cn_bm', 'cell');
    const n = k.add(ngeo, mat(0x6a4ab8, .95), 0, .02, .05, c);
    CELL.push({ m: c, n, mt: c.material });
  }
  /* TP53 / RB guards */
  k.setPart('chk', 'Checkpoint guards (TP53, RB)', 'TP53 ("genome ka guardian") kharab DNA par cell cycle rokta ya apoptosis karata hai; RB G1/S gate band rakhta hai. Dono kharab (mutate) hone par cell bina roke baantta hai. ~ 50% cancers mein TP53 mutated hai.', 'cn_cycle', 'cell');
  const GD = [-1, 0, 1].map(x => { const m = k.add(k.sph(.17, 10, 8), mat(0x4ad0f0, .95, 0x4ad0f0, .6), x, 1.35, .3); m.scale.set(0, 0, 0); return { m, x }; });
  const cur = {}, S = i => tgt(D.ph, i), P = i => D.ph === 0 ? tgt(0, i) : tgt(D.ph - 1, i);
  const pose = (t) => {
    const e = ease(clamp(D.p * 1.7, 0, 1));
    CELL.forEach((c, i) => {
      const a = P(i), b = S(i), emerged = a.v === 0 && b.v === 1;
      const ax = emerged ? (i >= N_BASE + EX.length ? 0 : b.x) : a.x, ay = emerged ? (i >= N_BASE + EX.length ? .1 : b.y - .4) : a.y;
      const x = lerp(ax, b.x, e), y = lerp(ay, b.y, e), cc = lerp(a.c, b.c, e), vis = lerp(a.v, b.v, e);
      const grow = D.ph === 2 && b.c > 1 ? 1 + .1 * Math.sin(t * 4 + i * 1.7) : 1;
      const sz = vis * lerp(a.s, b.s, e) * grow * (cc > 1 ? 1 + (cc - 1) * .22 : 1);
      c.m.position.set(x + (cc > 1 ? .04 * Math.sin(t * 3 + i) : 0), y, 0);
      c.m.scale.set(sz, sz * (cc > 1 ? 1 : 1.25), sz);
      const rgb = col3(cc); if (c.mt.color && c.mt.color.setRGB) c.mt.color.setRGB(rgb[0], rgb[1], rgb[2]); if (c.mt.emissive && c.mt.emissive.setRGB) { c.mt.emissive.setRGB(rgb[0], rgb[1], rgb[2]); c.mt.emissiveIntensity = cc > 1 ? .18 + .1 * Math.sin(t * 3 + i) : 0; }
      const ns = .8 + .8 * clamp(cc / 2, 0, 1); c.n.scale.set(ns, ns * (cc > 1 ? 1.1 : 1), ns);
    });
    const gv = D.ph === 0 ? 1 : D.ph === 1 ? 1 - e : 0;
    GD.forEach((g, i) => { const s = gv * (1 + .15 * Math.sin(t * 4 + i)); g.m.scale.set(s, s, s); g.m.position.set(g.x, 1.35 + (D.ph === 1 ? .15 * e : 0), .3); });
    bm(D.ph === 4 ? 2.4 * e : (D.ph > 4 ? 2.4 : 0));
  };
  pose(0);
  return k.result((dt, t) => {
    const L = D.list();
    if (D.playing) { D.p += dt * D.speed / L[D.ph].d;
      if (D.p >= 1) { if (D.hold) { D.p = 1; D.playing = false; } else { D.p = 0; D.ph++; if (D.ph >= L.length) D.ph = 0; D.fire(); } } }
    pose(t); if (D.onTick) D.onTick();
  }, { rot: PI / 2, scale: .62 });
});
if (window.CELLTYPES && !window.CELLTYPES.some(c => c.id === 'cancer')) window.CELLTYPES.push({ id: 'cancer', name: 'Cancer progression (live)', color: '#e04a4a' });
})();
/* END OF FILE cancer.js */
