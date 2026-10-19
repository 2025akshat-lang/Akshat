/* LIVE MITOSIS + MEIOSIS (CellVerse, r128)
   Ek hi builder se do "cell": 'mitosis' (animal cell, 2n=4) aur 'meiosis' (2n=4 -> 4 haploid cells).
   Rang: laal chromosome = maa se, neela = pita se | peela dot = kinetochore | peela spindle | gulabi/narangi ring = cytokinesis
   Controller: window.CVDiv (phase, play/pause, speed) - UI division-ui.js se judta hai. */
(() => {
const PI = Math.PI, K = CVKit;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const ease = t => t * t * (3 - 2 * t);

const PH = {
  mit: [
    { n: 'Interphase', s: 'G1 - S - G2', d: 3.2 },
    { n: 'Prophase', s: 'Condense', d: 2.6 },
    { n: 'Prometaphase', s: 'Envelope tuta', d: 2.2 },
    { n: 'Metaphase', s: 'Plate par line', d: 2.6 },
    { n: 'Anaphase', s: 'Chromatid alag', d: 2.6 },
    { n: 'Telophase', s: 'Do nucleus', d: 2.4 },
    { n: 'Cytokinesis', s: 'Cell do hua', d: 2.8 }],
  mei: [
    { n: 'Interphase', s: 'S: DNA copy', d: 2.6 },
    { n: 'Prophase I', s: 'Crossing over', d: 3.8 },
    { n: 'Metaphase I', s: 'Tetrad line mein', d: 2.6 },
    { n: 'Anaphase I', s: 'Homolog alag', d: 2.6 },
    { n: 'Telophase I', s: '2 cells', d: 2.8 },
    { n: 'Prophase II', s: 'Dobara condense', d: 1.8 },
    { n: 'Metaphase II', s: 'Plate par line', d: 2.6 },
    { n: 'Anaphase II', s: 'Chromatid alag', d: 2.6 },
    { n: 'Telophase II', s: '4 haploid cells', d: 3.2 }]
};

const D = window.CVDiv = {
  kind: 'mit', ph: 0, p: 0, playing: true, hold: false, speed: 1,
  list() { return PH[this.kind]; },
  frac() { const L = this.list(); let t = 0, s = 0; L.forEach((x, i) => { t += x.d; if (i < this.ph) s += x.d; }); return (s + this.p * L[this.ph].d) / t; },
  go(i, hold) { this.ph = clamp(i | 0, 0, this.list().length - 1); this.p = 0; this.playing = true; this.hold = !!hold; this.fire(); },
  fire() { if (this.onChange) this.onChange(); }
};

const build = kind => (THREE, group, opt) => {
  const MEI = kind === 'mei';
  D.kind = kind; D.ph = 0; D.p = 0; D.playing = true; D.hold = false; D.fire();
  const k = CVKit.make(THREE, group, opt), T3 = k.T3, mat = k.mat;
  const R0 = 2.2, RED = 0xe0504a, BLUE = 0x4a7ae0, YEL = 0xffe04a;
  const UP = new T3.Vector3(0, 1, 0), DV = new T3.Vector3();

  /* ---------- cell membrane (deformable) ---------- */
  const NAME_MEM = 'Cell membrane';
  k.setPart('mem', NAME_MEM, MEI ? 'Meiosis mein cell do baar baantta hai (cytokinesis I aur II): 1 diploid cell se 4 haploid cell. Pehle x-axis par, phir dono cells y-axis par.' : 'Mitosis mein membrane beech se pinch hoti hai (cleavage furrow): ek cell se 2 identical diploid cell.', 'memb', 'cell');
  const mkCell = () => { const geo = new T3.SphereGeometry(1, 40, 28), pos = geo.attributes && geo.attributes.position;
    const base = pos && pos.array && pos.array.slice ? pos.array.slice() : [];
    const m = new T3.Mesh(geo, mat(0xe0527a, 0.2)); k.root.add(m); k.reg(m); k.out(m); return { m, geo, base, pos }; };
  const morph = (c, o) => { const v = o.vis === undefined ? 1 : o.vis; c.m.scale.set(v, v, v); if (!v || !c.pos) return;
    const a = c.pos.array, b = c.base, n = b.length, ax = o.axis === 'x', pr = 1 / Math.sqrt(o.s);
    for (let i = 0; i < n; i += 3) { const x = b[i], y = b[i + 1], z = b[i + 2], u = (ax ? x : y) * o.s, w = ax ? y : x,
        f = 1 - o.pinch * Math.exp(-(u / .38) * (u / .38)), pu = u * o.R, pw = w * pr * f * o.R, pz = z * pr * f * o.R;
      if (ax) { a[i] = pu + o.cx; a[i + 1] = pw + o.cy; } else { a[i] = pw + o.cx; a[i + 1] = pu + o.cy; } a[i + 2] = pz; }
    c.pos.needsUpdate = true; if (c.geo.computeVertexNormals) c.geo.computeVertexNormals(); };
  const M0 = mkCell(), M1 = MEI ? mkCell() : null, M2 = MEI ? mkCell() : null;

  /* ---------- nuclear envelopes ---------- */
  k.setPart('nuc', 'Nuclear envelope', 'Nucleus ka double parda: prophase/prometaphase mein tutta hai (nuclear lamina phosphorylate hoti hai) aur telophase mein har daughter ke chromosomes ke gird dobara banta hai.', 'nuc', 'nuc');
  const NE = MEI ? 7 : 3, ENV = [];
  for (let i = 0; i < NE; i++) { const m = new T3.Mesh(new T3.SphereGeometry(1, 24, 18), mat(0x9b6bd8, 0.3)); m.scale.set(0, 0, 0); k.root.add(m); k.reg(m); ENV.push(m); }
  const env = (i, x, y, r, a) => { const m = ENV[i]; if (!m) return; m.position.set(x, y, 0); const s = a > .02 ? r : 0; m.scale.set(s, s, s); if (m.material) m.material.opacity = .34 * a; };

  /* ---------- chromatids ---------- */
  k.setPart('chr', 'Chromosomes (chromatids)', MEI ? 'Laal = maa ka homolog, neela = pita ka. Meiosis I mein homologous chromosomes alag hote hain (ye reduction division hai), meiosis II mein sister chromatids. Peela dot = kinetochore.' : 'Har chromosome do sister chromatids ka (S phase mein DNA copy). Mitosis mein sister chromatids alag hote hain: har daughter ko poora set milta hai. Peela dot = kinetochore.', 'dv_chromo', 'chr');
  const defs = [{ len: 1.25, col: RED }, { len: 1.25, col: BLUE }, { len: .85, col: RED }, { len: .85, col: BLUE }];
  const CH = [];
  defs.forEach((d, h) => { for (let s = 0; s < 2; s++) {
    const g = new T3.Group(); k.root.add(g);
    const body = k.add(k.cap(.62, .09), mat(d.col, .95), 0, 0, 0, g), dot = k.add(new T3.SphereGeometry(.085, 10, 8), mat(YEL, 1, 0x806000, .4), 0, 0, 0, g);
    CH.push({ g, body, dot, h, s, len: d.len, col: d.col, seg: null }); } });
  let CHI = null;
  if (MEI) {
    k.setPart('chi', 'Crossing over (chiasma)', 'Prophase I mein homologous chromosomes ke non-sister chromatids tukde badalte hain (recombination): isse maa-pita ke genes mil jaate hain, bachhe genetically alag. Seedha DNA ke tukde ki adla-badli.', 'dv_cross', 'chi');
    CH.forEach(c => { if ((c.h % 2 === 0 && c.s === 1) || (c.h % 2 === 1 && c.s === 0)) c.seg = k.add(k.cap(.26, .098), mat(c.col === RED ? BLUE : RED, .98), 0, 0, 0, c.g); });
    CHI = [0, 1].map(() => k.add(new T3.SphereGeometry(.075, 10, 8), mat(0xffffff, 1, 0x888888, .5), 0, 0, 0));
  }
  const hp = [[-.45, .4, .25], [.2, .55, -.35], [-.15, -.5, -.3], [.45, -.3, .35]], hrz = [.4, -1.1, 1.3, .2], rzI = [.9, -.6, 1.4, -1.3, .2, 1.1, -.4, .7];
  const setC = (i, o) => { const c = CH[i], v = o.v === undefined ? 1 : o.v; c.g.position.set(o.x, o.y, o.z || 0); c.g.rotation.z = o.rz || 0; c.g.scale.set(v, v, v); c.body.scale.set(o.sx, o.sy, o.sx);
    if (c.seg) { const q = o.seg || 0; c.seg.scale.set(q, q, q); c.seg.position.y = .31 * o.sy - .08; } };

  /* ---------- spindle fibres + centrosomes ---------- */
  k.setPart('spi', 'Spindle fibres (microtubules)', 'Centrosome se nikalte microtubule: kinetochore se judkar chromosomes ko plate par laate (metaphase) aur phir khenchkar alag karte hain (anaphase). Plus-end par tubulin judta/hat-ta hai.', 'dv_kineto', 'spi');
  const FB = CH.map(() => { const m = k.add(new T3.CylinderGeometry(1, 1, 1, 6), mat(YEL, .6), 0, 0, 0); m.scale.set(0, 1, 0); return m; });
  const fiber = (m, a, b, th) => { if (th < .001) { m.scale.set(0, 1, 0); return; } const dx = b[0] - a[0], dy = b[1] - a[1], dz = (b[2] || 0) - (a[2] || 0), L = Math.hypot(dx, dy, dz) || .001;
    m.position.set((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, ((a[2] || 0) + (b[2] || 0)) / 2); DV.set(dx / L, dy / L, dz / L); m.quaternion.setFromUnitVectors(UP, DV); m.scale.set(th, L, th); };
  k.setPart('cen', 'Centrosomes', 'Har centrosome mein 2 centriole (L-shape mein, 9 triplet microtubule). S phase mein duplicate hote hain aur prophase mein cell ke dono poles par chale jaate hain: spindle ke dhruv.', 'cen', 'cen');
  const NC = MEI ? 4 : 2, CEN = [];
  for (let i = 0; i < NC; i++) { const g = new T3.Group(); g.scale.set(0, 0, 0); k.root.add(g);
    k.add(new T3.CylinderGeometry(.07, .07, .36, 8), mat(0xffc84a), 0, 0, 0, g);
    const b = k.add(new T3.CylinderGeometry(.07, .07, .36, 8), mat(0xffc84a), .0, .12, 0, g); b.rotation.z = PI / 2; b.position.set(.18, .18, 0);
    CEN.push(g); }
  const cen = (i, x, y, v) => { const g = CEN[i]; if (!g) return; g.position.set(x, y, 0); g.scale.set(v, v, v); };

  /* ---------- contractile rings ---------- */
  k.setPart('ring', 'Contractile ring (actin + myosin II)', 'Cytokinesis mein equator par actin aur myosin II ka ring: RhoA ke signal se banta hai aur ek purse-string ki tarah sikudkar cell ko do mein baant deta hai (cleavage furrow).', 'dv_ring', 'ring');
  const RG = []; for (let i = 0; i < (MEI ? 3 : 1); i++) { const m = k.add(new T3.TorusGeometry(1, .07, 8, 36), mat(0xff9a3c, .95), 0, 0, 0); m.scale.set(0, 0, 0); RG.push(m); }
  RG[0].rotation.y = PI / 2; if (RG[1]) { RG[1].rotation.x = PI / 2; RG[2].rotation.x = PI / 2; }
  const ring = (i, x, y, r, v) => { const m = RG[i]; if (!m) return; const s = v > .02 ? Math.max(.05, r) : 0; m.position.set(x, y, 0); m.scale.set(s, s, s); };

  const hide = () => { ENV.forEach((m, i) => env(i, 0, 0, 1, 0)); };

  /* ================= MITOSIS POSE ================= */
  const slot = [[0, .9, .3], [0, .25, -.5], [0, -.45, .4], [0, -1.1, -.3]];
  const poseMit = (ph, p) => {
    const e = ease(p); let st = 1, pinch = 0, pole = 1.95, cenV = 1, c1v = 1, cy0 = 0;
    CH.forEach((c, i) => { const so = c.s ? .07 : -.07, sl = slot[c.h], hm = hp[c.h]; let o = { x: 0, y: 0, z: 0, rz: 0, sx: 1, sy: c.len, v: 1, seg: 0 };
      if (ph === 0) { o = { x: hm[0], y: hm[1], z: hm[2], rz: hrz[c.h], sx: .3, sy: c.len * 2.4, v: c.s ? sm(.3, .6, p) : 1 }; }
      else if (ph === 1) { o = { x: hm[0] + so * e, y: hm[1], z: hm[2], rz: hrz[c.h] * (1 - e), sx: lerp(.3, 1, e), sy: c.len * lerp(2.4, 1, e), v: 1 }; }
      else if (ph === 2) { o = { x: lerp(hm[0], sl[0], e) + so, y: lerp(hm[1], sl[1], e), z: lerp(hm[2], sl[2], e), rz: 0, sx: 1, sy: c.len, v: 1 }; }
      else if (ph === 3) { o = { x: so + .02 * Math.sin(Date.now() / 300 + i), y: sl[1] + .02 * Math.sin(Date.now() / 260 + i * 2), z: sl[2], rz: 0, sx: 1, sy: c.len, v: 1 }; }
      else if (ph === 4) { const a = e * 1.98; o = { x: (c.s ? 1 : -1) * (.07 + a), y: sl[1] * lerp(1, .6, e), z: sl[2], rz: (c.s ? -1 : 1) * PI / 2 * e, sx: 1, sy: c.len, v: 1 }; }
      else { const t = ph === 5 ? e : 1; o = { x: (c.s ? 1 : -1) * lerp(2.05, 1.95, t), y: sl[1] * .55, z: sl[2] * .6, rz: lerp(PI / 2, hrz[c.h], t) * (c.s ? -1 : 1), sx: lerp(1, .3, t), sy: c.len * lerp(1, 2.2, t), v: 1 }; }
      setC(i, o); });
    if (ph <= 3) st = 1; else if (ph === 4) st = lerp(1, 1.3, e); else if (ph === 5) st = lerp(1.3, 1.5, e); else st = lerp(1.5, 1.75, e);
    if (ph === 5) pinch = .22 * e; else if (ph === 6) pinch = lerp(.22, 1, e);
    morph(M0, { cx: 0, cy: 0, axis: 'x', R: R0, s: st, pinch, vis: 1 });
    hide();
    if (ph === 0) env(0, 0, 0, 1.2, 1); else if (ph === 1) env(0, 0, 0, 1.2, 1 - sm(.65, 1, p));
    else if (ph === 5) { const r = .95 * lerp(.7, 1, e); env(1, -2.0, 0, r, sm(.15, .9, p)); env(2, 2.0, 0, r, sm(.15, .9, p)); } else if (ph === 6) { env(1, -2.0, 0, .95, 1); env(2, 2.0, 0, .95, 1); }
    /* centrosome */
    let x0, x1, y0 = 0;
    if (ph === 0) { x0 = x1 = .25; y0 = 1.5; c1v = sm(.45, .7, p); }
    else if (ph === 1) { x0 = lerp(.25, -pole, e); x1 = lerp(.25, pole, e); y0 = 1.5 * (1 - e); }
    else if (ph <= 3) { x0 = -pole; x1 = pole; }
    else if (ph === 4) { x0 = -(pole + .5 * e); x1 = pole + .5 * e; } else { x0 = -2.45; x1 = 2.45; }
    cen(0, x0, y0, 1); cen(1, x1 + (ph === 0 ? .2 : 0), y0, c1v);
    /* fibres */
    const th = ph < 2 ? 0 : ph === 2 ? .02 * e : ph <= 4 ? .02 : ph === 5 ? .02 * (1 - e) : 0;
    CH.forEach((c, i) => { const q = c.g.position, tgt = [q.x, q.y, q.z]; fiber(FB[i], [c.s ? x1 : x0, 0, 0], tgt, th); });
    /* ring */
    const rp = R0 / Math.sqrt(st) * (1 - pinch);
    ring(0, 0, 0, rp, ph >= 5 && pinch > .03 ? 1 : 0);
  };

  /* ================= MEIOSIS POSE ================= */
  const TA = [-.4, .35, .2], TB = [.35, -.35, -.2], plate = [[0, .75, .2], [0, -.75, -.2]];
  const poseMei = (ph, p) => {
    const e = ease(p); let s0 = 1, pinch0 = 0;
    CH.forEach((c, i) => {
      const pair = c.h >> 1, mom = c.h % 2 === 0, T = pair ? TB : TA, pl = plate[pair], dir = mom ? -1 : 1, so = c.s ? .045 : -.045;
      const cellX = mom ? -1.7 : 1.7; let o = { x: 0, y: 0, z: 0, rz: 0, sx: 1, sy: c.len, v: 1, seg: 0 };
      if (ph === 0) { const hm = hp[c.h]; o = { x: hm[0], y: hm[1], z: hm[2], rz: rzI[i], sx: .3, sy: c.len * 2.4, v: c.s ? sm(.25, .7, p) : 1 }; }
      else if (ph === 1) { const hm = hp[c.h], gap = lerp(.5, .13, sm(.1, .65, p)), cn = sm(0, .8, p);
        o = { x: lerp(hm[0], T[0], sm(0, .5, p)) + dir * gap + so, y: lerp(hm[1], T[1], sm(0, .5, p)), z: lerp(hm[2], T[2], sm(0, .5, p)), rz: lerp(rzI[i], 0, cn), sx: lerp(.3, 1, cn), sy: c.len * lerp(2.4, 1, cn), v: 1, seg: sm(.55, .85, p) }; }
      else if (ph === 2) { o = { x: lerp(T[0] + dir * .13, pl[0] + dir * .14, e) + so, y: lerp(T[1], pl[1], e), z: lerp(T[2], pl[2], e), rz: 0, sx: 1, sy: c.len, v: 1, seg: 1 }; }
      else if (ph === 3) { o = { x: dir * (.14 + e * 1.56) + so, y: pl[1] * lerp(1, .6, e), z: pl[2], rz: 0, sx: 1, sy: c.len, v: 1, seg: 1 }; }
      else if (ph === 4) { o = { x: dir * 1.7 + so, y: pl[1] * .6, z: pl[2] * .6, rz: 0, sx: lerp(1, .8, e), sy: c.len * lerp(1, 1.3, e), v: 1, seg: 1 }; }
      else if (ph === 5) { o = { x: lerp(dir * 1.7 + so, cellX + (pair ? .5 : -.5), e), y: lerp(pl[1] * .6, so, e), z: lerp(pl[2] * .6, pair ? -.2 : .2, e), rz: lerp(0, PI / 2, e), sx: lerp(.8, 1, e), sy: c.len * lerp(1.3, 1, e), v: 1, seg: 1 }; }
      else if (ph === 6) { o = { x: cellX + (pair ? .5 : -.5), y: so, z: pair ? -.2 : .2, rz: PI / 2, sx: 1, sy: c.len, v: 1, seg: 1 }; }
      else if (ph === 7) { const a = e * 1.1; o = { x: cellX + (pair ? .5 : -.5), y: (c.s ? -1 : 1) * (.045 + a) * -1, z: pair ? -.2 : .2, rz: PI / 2, sx: 1, sy: c.len, v: 1, seg: 1 }; }
      else { const t = ph === 8 ? e : 1; o = { x: cellX + (pair ? .4 : -.4), y: (c.s ? 1 : -1) * lerp(1.15, 1.2, t), z: pair ? -.15 : .15, rz: lerp(PI / 2, rzI[i], t), sx: lerp(1, .35, t), sy: c.len * lerp(1, 2, t), v: 1, seg: 1 }; }
      setC(i, o);
    });
    /* chiasma markers */
    if (CHI) { const a = ph === 1 ? sm(.55, .85, p) : ph === 2 ? 1 : ph === 3 ? 1 - e : 0;
      [0, 1].forEach(n => { const h0 = CH[n * 4 + 1].g.position, h1 = CH[n * 4 + 2].g.position, m = CHI[n];
        m.position.set((h0.x + h1.x) / 2, (h0.y + h1.y) / 2, (h0.z + h1.z) / 2 + .11); m.scale.set(a, a, a); }); }
    /* cells */
    let st = 1;
    if (ph <= 2) st = 1; else if (ph === 3) st = lerp(1, 1.45, e); else if (ph === 4) st = lerp(1.45, 1.55, e);
    pinch0 = ph === 4 ? lerp(0, 1, ease(clamp(p * 1.15, 0, 1))) : 0;
    const R1 = R0 / Math.sqrt(1.55);
    if (ph <= 4) { morph(M0, { cx: 0, cy: 0, axis: 'x', R: R0, s: st, pinch: pinch0, vis: 1 }); morph(M1, { vis: 0 }); morph(M2, { vis: 0 }); }
    else { const s2 = ph === 5 || ph === 6 ? 1 : ph === 7 ? lerp(1, 1.4, e) : lerp(1.4, 1.55, e), pn = ph === 8 ? lerp(0, 1, ease(clamp(p * 1.15, 0, 1))) : 0;
      morph(M0, { vis: 0 }); morph(M1, { cx: -1.7, cy: 0, axis: 'y', R: R1 * 1.0, s: s2, pinch: pn, vis: 1 }); morph(M2, { cx: 1.7, cy: 0, axis: 'y', R: R1 * 1.0, s: s2, pinch: pn, vis: 1 });
      if (ph === 8) { const rp = R1 / Math.sqrt(s2) * (1 - pn); ring(1, -1.7, 0, rp, pn > .03 ? 1 : 0); ring(2, 1.7, 0, rp, pn > .03 ? 1 : 0); } }
    if (ph <= 4) { const rp = R0 / Math.sqrt(st) * (1 - pinch0); ring(0, 0, 0, rp, ph === 4 && pinch0 > .03 ? 1 : 0); ring(1, 0, 0, 0, 0); ring(2, 0, 0, 0, 0); } else ring(0, 0, 0, 0, 0);
    /* envelopes */
    hide();
    if (ph === 0) env(0, 0, 0, 1.15, 1); else if (ph === 1) env(0, 0, 0, 1.15, 1 - sm(.7, 1, p));
    else if (ph === 4) { const r = .85 * lerp(.7, 1, e); env(1, -1.75, 0, r, sm(.2, .9, p)); env(2, 1.75, 0, r, sm(.2, .9, p)); }
    else if (ph === 5) { env(1, -1.7, 0, .85, 1 - sm(.1, .6, p)); env(2, 1.7, 0, .85, 1 - sm(.1, .6, p)); }
    else if (ph === 8) { const r = .62 * lerp(.7, 1, e), a = sm(.25, .95, p); env(3, -1.7, 1.35, r, a); env(4, -1.7, -1.35, r, a); env(5, 1.7, 1.35, r, a); env(6, 1.7, -1.35, r, a); }
    /* centrosomes */
    let cs = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]], cv = [1, 1, 0, 0], pole = 1.9;
    if (ph === 0) { cs[0] = [.25, 1.5]; cs[1] = [.25, 1.5]; cv = [1, sm(.45, .7, p), 0, 0]; }
    else if (ph === 1) { cs[0] = [lerp(.25, -pole, e), 1.5 * (1 - e)]; cs[1] = [lerp(.25, pole, e), 1.5 * (1 - e)]; }
    else if (ph <= 3) { cs[0] = [-pole - (ph === 3 ? .35 * e : 0), 0]; cs[1] = [pole + (ph === 3 ? .35 * e : 0), 0]; }
    else if (ph === 4) { cs[0] = [-2.3, 0]; cs[1] = [2.3, 0]; }
    else if (ph === 5) { cs[0] = [lerp(-2.3, -1.7, e), 1.35 * e]; cs[2] = [lerp(-2.3, -1.7, e), -1.35 * e]; cs[1] = [lerp(2.3, 1.7, e), 1.35 * e]; cs[3] = [lerp(2.3, 1.7, e), -1.35 * e]; cv = [1, 1, e, e]; if (ph === 5) { cs[0][0] = lerp(-2.3, -1.7, e); } }
    else { const yo = ph === 7 ? 1.35 + .5 * e : ph === 8 ? 1.85 : 1.35; cs[0] = [-1.7, yo]; cs[2] = [-1.7, -yo]; cs[1] = [1.7, yo]; cs[3] = [1.7, -yo]; cv = [1, 1, 1, 1]; }
    [0, 1, 2, 3].forEach(n => cen(n, cs[n][0] || 0, cs[n][1] || 0, cv[n]));
    /* fibres */
    let th = 0; if (ph === 2) th = .02 * e; else if (ph === 3) th = .02; else if (ph === 4) th = .02 * (1 - sm(.3, .9, p)); else if (ph === 6) th = .02; else if (ph === 7) th = .02; else if (ph === 8) th = .02 * (1 - sm(.1, .7, p)); else if (ph === 5) th = .02 * e;
    CH.forEach((c, i) => { const q = c.g.position, tgt = [q.x, q.y, q.z], mom = c.h % 2 === 0; let src;
      if (ph <= 4) src = mom ? cs[0] : cs[1];
      else { const left = mom, top = c.s === 1; src = left ? (top ? cs[0] : cs[2]) : (top ? cs[1] : cs[3]); }
      fiber(FB[i], [src[0] || 0, src[1] || 0, 0], tgt, th); });
  };

  const apply = () => (MEI ? poseMei : poseMit)(D.ph, D.p);
  apply();
  return k.result((dt, t) => {
    const L = D.list();
    if (D.playing) { D.p += dt * D.speed / L[D.ph].d;
      if (D.p >= 1) { if (D.hold) { D.p = 1; D.playing = false; } else { D.p = 0; D.ph++; if (D.ph >= L.length) D.ph = 0; D.fire(); } } }
    apply(); if (D.onTick) D.onTick();
  }, { rot: PI / 2, scale: .8 });
};

if (window.CELLTYPES && !window.CELLTYPES.some(c => c.id === 'mitosis')) window.CELLTYPES.push({ id: 'mitosis', name: 'Mitosis (live)', color: '#ff7ab0' }, { id: 'meiosis', name: 'Meiosis (live)', color: '#c28cff' });
registerCellModel('mitosis', build('mit'));
registerCellModel('meiosis', build('mei'));
})();
/* END OF FILE division.js */
