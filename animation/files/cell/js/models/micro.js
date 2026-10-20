/* MICRO scenes (live, cross-section animations): glia, demyelination, O2->ATP, touch->brain, plant water flow. division.js ke baad, division-ui.js se pehle load karo. */
(() => {
const D = window.CVDiv;
if (!D) throw new Error('division.js pehle load hona chahiye (micro.js usse baad)');
const PI = Math.PI, clamp = (x, a, b) => Math.max(a, Math.min(b, x)), lerp = (a, b, t) => a + (b - a) * t, ease = t => t * t * (3 - 2 * t);

/* scene engine: build(H) -> step(ph, p, t, e). H = helpers (part, mesh, tube, flow, fx) */
const scene = S => {
  D.PH[S.kind] = S.phases.map(x => ({ n: x[0], s: x[1], d: x[2] || 3.4 }));
  D.META[S.kind] = { id: S.id, label: S.label, short: S.short };
  if (window.CELLTYPES && !window.CELLTYPES.some(c => c.id === S.id)) window.CELLTYPES.push({ id: S.id, name: S.name, color: S.color });
  registerCellModel(S.id, (THREE, group, opt) => {
    D.kind = S.kind; D.ph = 0; D.p = 0; D.playing = true; D.hold = false; D.fire();
    const k = CVKit.make(THREE, group, opt), T3 = k.T3, FOC = {}, FL = [], cur = {};
    let ck = null;
    const H = {
      k, T3,
      part(key, name, info, det) { ck = key; k.setPart(key, name, info, det || 'mit', 'cell'); if (!FOC[key]) FOC[key] = []; },
      mat(col, op, em) { const m = k.mat(col, op == null ? 1 : op, em == null ? col : em, 0); m.transparent = true; m.opacity = op == null ? 1 : op; m.userData = { bo: m.opacity }; if (ck) FOC[ck].push(m); return m; },
      add(geo, col, x, y, z, op, par, em) { const o = k.add(geo, H.mat(col, op, em), x, y, z, par); return o; },
      sph(r, col, x, y, z, op, par) { return H.add(k.sph(r, 14, 10), col, x, y, z, op, par); },
      tube(pts, r, col, op) { return k.tube(pts, r, 14, H.mat(col, op)); },
      /* fl: n chhote kan, fn(u,i)->[x,y,z], speed */
      flow(n, r, col, fn, speed, op) { const a = []; for (let i = 0; i < n; i++) a.push(H.sph(r, col, 0, 0, 0, op == null ? .95 : op)); const f = { a, fn, speed, vis: 1, upd(t) { a.forEach((m, i) => { const u = ((i / n) + t * speed) % 1, q = fn(u, i); m.position.set(q[0], q[1], q[2] || 0); const s = f.vis; m.scale.set(s, s, s); }); } }; FL.push(f); return f; },
      cyl(r, len, col, x, y, z, rz, op) { const o = H.add(new T3.CylinderGeometry(r, r, len, 14), col, x, y, z, op); o.rotation.z = rz || 0; return o; },
      lerp, ease, clamp, PI
    };
    const step = S.build(H);
    const tick = (t) => {
      const ph = D.ph, e = ease(clamp(D.p * 1.7, 0, 1)), foc = S.focus ? S.focus[ph] : null;
      FL.forEach(f => f.vis = 1);
      step(ph, D.p, t, e);
      FL.forEach(f => f.upd(t));
      Object.keys(FOC).forEach(key => { const on = !foc || !foc.length || foc.indexOf(key) >= 0, tg = on ? 1 : 0, c = cur[key] = lerp(cur[key] == null ? 1 : cur[key], tg, .12);
        FOC[key].forEach(m => { m.opacity = m.userData.bo * (.22 + .78 * c); if (m.emissive) m.emissiveIntensity = foc && foc.length && on ? .35 + .25 * Math.sin(t * 4) : 0; }); });
    };
    tick(0);
    return k.result((dt, t) => {
      const L = D.list();
      if (D.playing) { D.p += dt * D.speed / L[D.ph].d;
        if (D.p >= 1) { if (D.hold) { D.p = 1; D.playing = false; } else { D.p = 0; D.ph++; if (D.ph >= L.length) D.ph = 0; D.fire(); } } }
      tick(t); if (D.onTick) D.onTick();
    }, { rot: PI / 2, scale: S.scale || .62 });
  });
};
const seg = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2] || 0, b[2] || 0, u)];
const path = (pts, u) => { const n = pts.length - 1, f = clamp(u, 0, .9999) * n, i = Math.floor(f); return seg(pts[i], pts[i + 1], f - i); };

/* =============== 1. NEUROGLIA =============== */
scene({
  kind: 'glia', id: 'glia', label: 'Glia', name: 'Neuroglia (live)', color: '#e8a24a', short: ['O', 'A', 'M', 'G', 'E'],
  phases: [['Neuron + glia', 'Sab ek saath'], ['Astrocyte', 'Blood-brain barrier'], ['Oligodendrocyte', 'Myelin banata'], ['Microglia', 'Safai + immunity'], ['Ependymal', 'CSF + cilia']],
  focus: [[], ['ast', 'ves', 'neu'], ['oli', 'myl', 'neu'], ['mic', 'deb'], ['epe']],
  build(H) {
    const T3 = H.T3, OR = 0xe8a24a, TEAL = 0x4ab8b0;
    H.part('ves', 'Blood vessel (capillary)', 'Dimaag ki capillary: endothelial cells tight junction se jude, isliye khoon se sab kuch dimaag mein nahi ghus sakta. Yahi blood-brain barrier (BBB) hai.', 'mit');
    H.tube([[-6, -2.6, 0], [0, -2.6, 0], [6, -2.6, 0]], .55, 0xc02a2a, .5);
    const rbc = H.flow(7, .2, 0xe03a3a, u => [-6 + 12 * u, -2.6 + .12 * Math.sin(u * 20), 0], .06);
    H.part('neu', 'Neuron', 'Neuron: dimaag ka signalling cell. Glial cells uska poshan, suraksha aur insulation karte hain; glia neurons se kaafi zyada (~ barabar) hote hain.', 'n_soma');
    H.sph(.5, OR, 1.8, .4, 0, .95); H.sph(.2, 0x8a2a2a, 1.8, .4, .1, .95);
    for (let i = 0; i < 5; i++) { const a = PI * .55 + i * .5 - 1; H.tube([[1.8, .4, 0], [1.8 + .8 * Math.cos(a) * -1, .4 + .8 * Math.sin(a), 0], [1.8 - 1.5 * Math.cos(a), .4 + 1.4 * Math.sin(a), 0]], .05, OR, .95); }
    H.tube([[2.3, .4, 0], [4, .4, 0], [6, .4, 0]], .08, OR, .95);
    H.part('ast', 'Astrocyte', 'Tara jaisa glial cell. Uske endfeet capillary ko lapete rehte hain: BBB banane mein madad, neuron ko glucose/lactate pahunchana, K+ aur glutamate saaf karna, synapse ko sambhalna, aur chot par glial scar.', 'n_syn');
    H.sph(.45, 0xe8c07a, -1, -.8, 0, .95);
    [[-1, -2.1], [-1.9, -2.15], [-.2, -2.1]].forEach(p => { H.tube([[-1, -.8, 0], [(p[0] - 1) / 2, -1.4, 0], [p[0], p[1], 0]], .09, 0xe8c07a, .9); H.sph(.22, 0xf2d79a, p[0], p[1], 0, .95); });
    [[-2.3, .1], [-2.2, -1.6], [-.5, .3]].forEach(p => H.tube([[-1, -.8, 0], [(p[0] - 1) / 2, (p[1] - .8) / 2, 0], [p[0], p[1], 0]], .07, 0xe8c07a, .85));
    H.tube([[-1, -.8, 0], [0, -.3, 0], [1.4, .1, 0]], .07, 0xe8c07a, .9);
    H.part('oli', 'Oligodendrocyte', 'CNS ka myelin banane wala glial cell: ek cell ke kai arms alag-alag axons (ya ek axon ke kai tukdon) ko lapet kar myelin sheath banate hain. (PNS mein ye kaam Schwann cell karta hai.)', 'n_myelin');
    H.sph(.4, 0xc88a9a, 3.6, 2.0, 0, .95);
    [3.4, 4.4, 5.4].forEach(x => H.tube([[3.6, 2.0, 0], [(3.6 + x) / 2, 1.2, 0], [x, .62, 0]], .05, 0xc88a9a, .9));
    H.part('myl', 'Myelin sheath', 'Axon par fat-rich insulation (~ 70% lipid): signal ko saltatory conduction se 50-100 guna tez banata hai. Beech ke khaali nodes (Ranvier) par signal kood-kood kar chalta hai.', 'n_myelin');
    const sh = [3.4, 4.4, 5.4].map(x => H.cyl(.3, .85, 0xf2e6b8, x, .4, 0, PI / 2, .9));
    H.part('mic', 'Microglia', 'Dimaag ke chhote immune cells: patrol (surveillance), mare hue cells aur kachra khaate (phagocytosis), infection par activate hokar amoeboid ho jaate hain. Synapse pruning bhi karte hain.', 'n_syn');
    const MG = [[-3.6, 1.4], [.5, 2.4], [-3.2, -.4]].map(p => { const g = new T3.Group(); H.k.root.add(g); g.position.set(p[0], p[1], 0); H.sph(.2, TEAL, 0, 0, 0, .95, g); for (let i = 0; i < 6; i++) { const a = i * PI / 3, c = H.add(new T3.CylinderGeometry(.03, .03, .45, 6), TEAL, .22 * Math.cos(a), .22 * Math.sin(a), 0, .9, g); c.rotation.z = a - PI / 2; } return { g, b: p }; });
    H.part('deb', 'Debris (mare cells / kachra)', 'Mare hue neuron ke tukde aur kachra: microglia inhe nigal kar (phagocytosis) saaf karte hain, warna dimaag mein sujan badhti hai.', 'n_syn');
    const DB = H.sph(.16, 0x8a8a8a, -2.4, 2.2, 0, .95);
    H.part('epe', 'Ependymal cells (ciliated)', 'Dimaag ke ventricles ki andar ki parat: cilia ki dhadkan se cerebrospinal fluid (CSF) behta hai. CSF dimaag ko cushion deta aur kachra hatata hai.', 'mit');
    const EP = [];
    for (let i = 0; i < 9; i++) { const x = -4 + i; H.add(new T3.BoxGeometry(.8, .8, .8), 0xf0b8a0, x, 3.05, 0, .9); H.sph(.17, 0x8a2a2a, x, 3.05, .45, .95); const cs = []; for (let j = 0; j < 3; j++) { const c = H.cyl(.025, .5, 0xf5d0c0, x - .22 + j * .22, 3.7, 0, 0, .9); cs.push(c); } EP.push(cs); }
    const CSF = H.flow(10, .07, 0xbfe9ff, u => [-4.5 + 9.5 * u, 4.1 + .1 * Math.sin(u * 30), 0], .08);
    const AX = H.flow(5, .09, 0xffee44, u => [2.4 + 3.6 * u, .4, .1], .25);
    return (ph, p, t, e) => {
      rbc.vis = 1; AX.vis = ph === 2 ? 1 : 0;
      sh.forEach((s, i) => { const g = ph === 2 ? clamp(e * 1.6 - i * .35, 0, 1) : ph < 2 ? 0 : 1; s.scale.set(Math.max(.01, g), Math.max(.01, g), Math.max(.01, g)); });
      MG.forEach((m, i) => { let x = m.b[0] + .25 * Math.sin(t * .8 + i * 2), y = m.b[1] + .2 * Math.cos(t * .7 + i); if (ph === 3 && i === 0) { x = lerp(m.b[0], -2.55, e); y = lerp(m.b[1], 2.1, e); } m.g.position.set(x, y, 0); const s = 1 + (ph === 3 ? .25 * Math.sin(t * 5 + i) : 0); m.g.scale.set(s, s, s); });
      const d = ph === 3 && p > .75 ? clamp(1 - (p - .75) * 4, 0, 1) : (ph === 3 || ph < 3 ? 1 : 0); DB.scale.set(Math.max(.01, d), Math.max(.01, d), Math.max(.01, d));
      EP.forEach((cs, i) => cs.forEach((c, j) => { c.rotation.z = (ph === 4 ? .5 : .12) * Math.sin(t * 6 - i * .6 + j); }));
      CSF.vis = ph === 4 ? 1 : .15;
    };
  }
});

/* =============== 2. DEMYELINATION =============== */
scene({
  kind: 'dem', id: 'demyelin', label: 'Demyelin', name: 'Demyelination (live)', color: '#b9c7e8', short: ['H', 'I', 'B', 'C'],
  phases: [['Healthy axon', 'Signal tez'], ['Immune attack', 'Autoimmune hamla'], ['Myelin toota', 'Sheath ke tukde'], ['Safai + slow signal', 'Microglia + MS']],
  focus: [['hl', 'hax'], ['imm', 'dm'], ['dm', 'frg'], ['mic', 'frg', 'dax']],
  build(H) {
    const T3 = H.T3, X = [-4.4, -2.2, 0, 2.2, 4.4];
    H.part('hl', 'Healthy myelin sheath', 'Sehat myelin: axon par lipid ki kai parat, beech mein Ranvier ke nodes. Signal node-se-node kood kar chalta hai (saltatory), ~ 100 m/s tak.', 'n_myelin');
    X.forEach(x => H.cyl(.36, 1.8, 0x9fb4e8, x, -1.9, 0, PI / 2, .88));
    H.part('hax', 'Healthy axon', 'Insulated axon: signal tez aur bina leak ke jaata hai.', 'n_axon');
    H.tube([[-6, -1.9, 0], [0, -1.9, 0], [6, -1.9, 0]], .13, 0xe8b88a, .95);
    const SG = H.flow(3, .12, 0xffee44, u => [-6 + 12 * u, -1.9, .3], .3);
    H.part('dm', 'Demyelinated myelin', 'Multiple sclerosis (MS) mein immune system (T cells) apne hi myelin par hamla karta hai: sheath patli, taki, aur tukde-tukde ho jaati hai.', 'n_myelin');
    const DM = X.map(x => H.cyl(.36, 1.8, 0x9fb4e8, x, 1.9, 0, PI / 2, .88));
    H.part('dax', 'Demyelinated axon', 'Nanga axon: signal leak hota, slow padta ya ruk jaata hai; lamba time rahe to axon khud mar sakta hai. Lakshan: kamzori, sunn hona, nazar dhundhli.', 'n_axon');
    H.tube([[-6, 1.9, 0], [0, 1.9, 0], [6, 1.9, 0]], .13, 0xe8b88a, .95);
    const SD = H.flow(3, .12, 0xffee44, u => [-6 + 12 * u, 1.9 + .25 * Math.sin(u * 40) * (1 - u), .3], .09);
    H.part('imm', 'Immune cells (T cell)', 'Autoreactive T cells aur B cells myelin protein (MBP, MOG) ko "dushman" samajh kar hamla karte hain.', 'n_syn');
    const TC = [0, 1, 2].map(i => { const g = H.sph(.28, 0xe8584a, -3 + i * 3, 4.4, 0, .95); return g; });
    H.part('frg', 'Myelin ke tukde', 'Toota hua myelin ka kachra: microglia/macrophage ise saaf karte hain.', 'n_myelin');
    const FR = [...Array(10)].map((_, i) => H.cyl(.09, .5, 0xdfe6f5, -5 + i * 1.1, 1.9, 0, rrr(i), .9));
    H.part('mic', 'Microglia (safai)', 'Kachra khaate hain. Kuch myelin dobara banta hai (remyelination) par adhoora; baar-baar hamle se scar (sclerosis) ban jaata hai.', 'n_syn');
    const MC = [0, 1].map(i => H.sph(.3, 0x4ab8b0, 0, 3.6, 0, .95));
    function rrr(i) { return ((i * 2654435761) % 1000) / 1000 * PI; }
    return (ph, p, t, e) => {
      SG.vis = ph === 0 || ph === 3 ? 1 : .6; SD.vis = ph === 0 ? 1 : ph >= 1 ? 1 : 1;
      SD.speed = ph === 0 ? .3 : ph === 3 ? .07 : ph === 2 ? .15 : .25;
      const w = ph < 2 ? 0 : ph === 2 ? e : 1;
      DM.forEach((m, i) => { const s = 1 - w * (.45 + .1 * ((i * 7) % 3) * .3); m.scale.set(1 - .5 * w * (i % 2 ? .6 : 1), s, s); m.rotation.z = PI / 2 + w * (.18 * (i - 2)); m.position.y = 1.9 + w * (i % 2 ? -.12 : .1); });
      TC.forEach((c, i) => { const a = ph === 1 ? e : ph === 0 ? 0 : 1; c.position.set(-3 + i * 3 + (ph >= 1 ? 0 : 0), lerp(4.4, 2.55, ph === 0 ? 0 : a), 0); const s = ph >= 1 ? 1 : 0; c.scale.set(Math.max(.01, s) * (1 + .15 * Math.sin(t * 6 + i)), Math.max(.01, s), Math.max(.01, s)); });
      FR.forEach((f, i) => { const g = ph === 2 ? e : ph === 3 ? 1 - e : 0; f.scale.set(Math.max(.01, g), Math.max(.01, g), Math.max(.01, g)); f.position.set(-5 + i * 1.1 + .3 * Math.sin(t + i), 1.9 + (i % 2 ? 1 : -1) * (.5 + .8 * (ph === 2 ? e : 1 - e * .4)), 0); f.rotation.z += .02; });
      MC.forEach((m, i) => { const g = ph === 3 ? 1 : 0; m.scale.set(Math.max(.01, g), Math.max(.01, g), Math.max(.01, g)); m.position.set(lerp(-3 + i * 5, -1.5 + i * 3, e), lerp(3.6, 2.8, e) + .12 * Math.sin(t * 3 + i), 0); });
    };
  }
});

/* =============== 3. OXYGEN -> ATP =============== */
scene({
  kind: 'o2', id: 'o2atp', label: 'O₂→ATP', name: 'Oxygen to ATP (live)', color: '#4ab8f0', short: ['R', 'D', 'M', 'A', 'U'],
  phases: [['RBC: O₂ chhodta', 'Hemoglobin'], ['O₂ cell mein', 'Diffusion'], ['Mitochondrion', 'Krebs + ETC'], ['ATP burst', 'ATP synthase'], ['ATP use + CO₂', 'Kaam, kachra']],
  focus: [['rbc', 'cap', 'o2'], ['o2', 'cap', 'cel'], ['mit', 'gl', 'o2'], ['mit', 'atp'], ['atp', 'co2', 'cel']],
  build(H) {
    const T3 = H.T3;
    H.part('cap', 'Capillary wall', 'Capillary ki diwar ek cell moti: gas, glucose aur kachra yahin se guzarte hain. Dimaag mein BBB hone se ye selective hai.', 'mit');
    H.tube([[-6, -2.4, 0], [0, -2.4, 0], [6, -2.4, 0]], .8, 0xf2b8b0, .35);
    H.part('rbc', 'Red blood cell (hemoglobin)', 'RBC mein hemoglobin: har molecule 4 O2 pakadta hai. Tisue ke paas (kam O2, zyada CO2, kam pH) O2 chhod deta hai (Bohr effect).', 'r_hb');
    const RB = H.flow(6, .34, 0xd83a3a, u => [-6 + 12 * u, -2.4 + .15 * Math.sin(u * 17), 0], .05);
    H.part('cel', 'Tissue cell', 'Koi bhi cell (neuron, muscle...): O2 + glucose se mitochondria mein ATP banata hai.', 'mit');
    const CEL = H.sph(2.7, 0xe8c8a0, 1.2, 1.6, -.4, .22); CEL.userData.out = true;
    H.part('o2', 'Oxygen (O₂)', 'O2 diffusion se capillary se cell ke andar jaata hai (concentration gradient). Ye ETC ka aakhri electron acceptor hai: O2 + 4e- + 4H+ -> 2 H2O.', 'mit');
    const O2 = H.flow(16, .09, 0x4ab8f0, (u, i) => { const j = i % 4, a = -2.4 + j * .1; return [-4 + 9 * u + (j - 1.5) * .3, lerp(-2.4, 1.2, ease(clamp(u * 1.5 - .15, 0, 1))) + Math.sin(i) * .3, .3]; }, .12);
    H.part('gl', 'Glucose', 'Glucose glycolysis se pyruvate banta, jo mitochondrion mein jaakar Krebs cycle mein jalta hai (kul ~ 30-32 ATP per glucose).', 'mit');
    const GL = H.flow(6, .12, 0x6ad07a, (u, i) => [lerp(-1, 1.2, u) + Math.sin(i) * .5, lerp(-.5, 1.6, u), .4], .1);
    H.part('mit', 'Mitochondrion', 'Powerhouse: andar ki jhilli (cristae) par electron transport chain (Complex I-IV) protons ko bahar pump karti hai; ATP synthase unke wapas aane se ATP banata hai.', 'mit');
    const M = new T3.Group(); H.k.root.add(M); M.position.set(1.2, 1.6, 0); M.rotation.z = PI / 2 - .3;
    const MO = H.add(new T3.SphereGeometry(1, 20, 14), 0xc8742a, 0, 0, 0, .55, M); MO.scale.set(1.9, .95, .95);
    for (let i = 0; i < 7; i++) { const c = H.add(new T3.TorusGeometry(.62, .09, 8, 18), 0xe8924a, -1.3 + i * .43, 0, 0, .9, M); c.rotation.y = PI / 2; c.scale.set(1, 1 - Math.abs(-1.3 + i * .43) * .25, 1); }
    H.part('etc', 'Electron transport chain', 'Complex I-IV par NADH/FADH2 ke electron O2 tak jaate hain; beech mein protons (H+) intermembrane space mein pump hote hain: proton gradient.', 'mit');
    const EL = H.flow(14, .06, 0xffe04a, (u, i) => { const x = -1.2 + 2.4 * u; return [1.2 + Math.cos(M.rotation.z) * 0 + (i % 2 ? .0 : 0), 1.6, .3].map((v, q) => q === 0 ? M.position.x + (-1.2 + 2.4 * u) * Math.cos(M.rotation.z) : q === 1 ? M.position.y + (-1.2 + 2.4 * u) * Math.sin(M.rotation.z) + .25 * Math.sin(u * 9 + i) : v); }, .3);
    H.part('atp', 'ATP', 'Cell ki energy currency. ATP -> ADP + Pi se ~ 30 kJ/mol milta hai: muscle contraction, ion pumps (Na/K), synthesis sab ATP se. Insaan roz apne wazan jitna ATP banata aur use karta hai!', 'mit');
    const AT = H.flow(46, .075, 0xffe84a, (u, i) => { const a = i * 2.399963, r = u * 2.4; return [M.position.x + r * Math.cos(a), M.position.y + r * Math.sin(a) * .9, .4]; }, .22);
    H.part('co2', 'CO₂ (kachra)', 'Krebs cycle mein carbon CO2 banta hai, jo wapas capillary mein jaakar phephdon se bahar nikalta hai.', 'mit');
    const CO = H.flow(10, .1, 0x9a9a9a, (u, i) => [lerp(1.2, 5, u) + Math.sin(i) * .4, lerp(1.6, -2.4, ease(u)), .3], .1);
    return (ph, p, t, e) => {
      RB.vis = 1; O2.vis = ph <= 2 ? (ph === 0 ? .6 : 1) : .3; GL.vis = ph === 2 ? 1 : ph < 2 ? .35 : 0; EL.vis = ph === 2 || ph === 3 ? 1 : 0; AT.vis = ph === 3 ? Math.min(1, e * 1.5) : ph === 4 ? 1 : 0; CO.vis = ph === 4 ? 1 : 0;
      AT.speed = ph === 4 ? .08 : .22; M.scale.set(1 + (ph === 3 ? .04 * Math.sin(t * 9) : 0), 1, 1); { const q_ = 1 + .01 * Math.sin(t); CEL.scale.set(q_, q_, q_); }
    };
  }
});

/* =============== 4. TOUCH -> BRAIN -> MUSCLE =============== */
scene({
  kind: 'tch', id: 'touch', label: 'Touch', name: 'Touch signal (live)', color: '#f2c35a', short: ['T', 'N', 'S', 'B', 'M'],
  phases: [['Touch + receptor', 'Skin par dabav'], ['Na⁺ channels', 'Action potential'], ['Spinal cord', 'Relay + synapse'], ['Thalamus → cortex', 'Mehsoos hona'], ['Motor response', 'Muscle sikudta']],
  focus: [['skin', 'rec'], ['sen', 'rec'], ['cord', 'sen'], ['brn', 'cord'], ['mot', 'mus', 'cord']],
  build(H) {
    const T3 = H.T3, YEL = 0xffee44;
    H.part('skin', 'Skin (finger ka dabav)', 'Skin mein touch ke receptors: Meissner (halka touch), Merkel (dabav, texture), Pacinian (vibration). Dabne par receptor ka membrane khichta hai.', 'n_dend');
    const SK = H.add(new T3.BoxGeometry(.7, 4.8, 1.2), 0xf2c8a8, -5.4, 0, 0, .8); SK.scale.set(1, 1, 1); const FG = H.sph(.7, 0xe8a888, -7, 0, 0, .9);
    H.part('rec', 'Mechanoreceptor', 'Dabav se mechanically-gated ion channel (Piezo2) khulte hain: Na+ andar aata hai (receptor potential). Threshold paar hone par action potential shuru.', 'n_dend');
    const RC = H.sph(.3, 0x4ad0f0, -4.6, 0, .1, .95);
    const NA = H.flow(6, .06, 0xffe04a, (u, i) => [-4.9 + .3 * Math.sin(i * 2), (i - 2.5) * .12 - .7 + u * .5, .35], .5);
    H.part('sen', 'Sensory neuron (afferent)', 'Pseudounipolar neuron: receptor se axon, DRG (cell body) ke raste spinal cord tak. Myelinated A-beta fibres ~ 50-70 m/s se signal bhejte hain.', 'n_axon');
    const PA = [[-4.6, 0, 0], [-3, -.4, 0], [-1.5, -.9, 0], [-.5, -.5, 0]];
    H.tube(PA, .09, 0xf2c35a, .95); H.sph(.3, 0xe8a24a, -1.5, -.95, 0, .95);
    H.part('cord', 'Spinal cord (relay)', 'Spinal cord ke dorsal horn mein sensory neuron synapse banata: neurotransmitter (glutamate) se agla neuron activate. Wahin se reflex ka motor neuron bhi jud jaata hai.', 'n_syn');
    const CD = H.add(new T3.CylinderGeometry(.9, .9, 4.2, 16), 0xe8dcc0, 1.6, 0, 0, .55); CD.rotation.z = PI / 2; CD.userData.out = true;
    H.add(new T3.SphereGeometry(.3, 12, 10), 0xe8a24a, 0, -.3, 0, .95);
    const UP = [[0, -.3, 0], [1.6, -.2, .2], [3.2, 0, 0], [4.2, .1, 0]];
    H.tube(UP, .09, 0xf2c35a, .9);
    H.part('brn', 'Brain: thalamus + somatosensory cortex', 'Signal thalamus se hota hua somatosensory cortex (postcentral gyrus) tak: wahan "touch mehsoos" hota hai. Brain ka map (homunculus): ungliyon ka hissa bada.', 'n_syn');
    const BR = H.sph(1.5, 0xe8b8b0, 6, 0, 0, .55); BR.scale.set(.9, 1.1, 1.1); BR.userData.out = true; H.sph(.35, 0xc878a0, 5.1, 0, .2, .95);
    const BC = H.sph(.4, 0xffd88a, 6.3, .3, .3, .95);
    H.part('mot', 'Motor neuron (efferent)', 'Spinal cord (anterior horn) ka motor neuron: axon muscle tak jaakar NMJ par ACh chhodta hai. Reflex mein dimaag ka intezaar kiye bina muscle sikud jaata hai.', 'n_axon');
    const MT = [[.2, .2, 0], [-1.2, 1.1, 0], [-3, 1.5, 0], [-4.4, 1.7, 0]];
    H.tube(MT, .09, 0xf2a24a, .95);
    H.part('mus', 'Skeletal muscle (reflex)', 'Muscle fibre ko ACh milte hi Ca2+ nikalta hai aur sarcomere chhota hota hai: haath peeche kheench jaata hai.', 'm_sarc');
    const MS = H.sph(.7, 0xc8584a, -5.4, 1.9, 0, .9); MS.scale.set(.8, 1, 1.1);
    const SP = H.flow(1, .16, YEL, u => path([[-4.6, 0, .3], ...PA.slice(1), [1.6, -.2, .3], [3.2, 0, .2], [4.5, .1, .2], [6, .2, .3]], u), .13);
    const PS = H.flow(1, .16, YEL, u => path(MT.map(q => [q[0], q[1], .3]), u), .2);
    return (ph, p, t, e) => {
      const press = ph === 0 ? e : ph === 1 ? 1 : lerp(1, 0, ph === 2 ? e : 1);
      FG.position.x = -7 + 1.55 * press; SK.position.x = -5.4 + .15 * press;
      { const q_ = 1 + .5 * press * (.6 + .4 * Math.sin(t * 8)); RC.scale.set(q_, q_, q_); }
      NA.vis = ph <= 1 ? press : 0;
      SP.speed = .13; PS.speed = .25;
      SP.vis = ph === 1 ? 1 : ph === 2 ? 1 : ph === 3 ? 1 : 0; PS.vis = ph === 4 ? 1 : 0;
      if (ph !== 4) PS.a.forEach(m => m.scale.set(0, 0, 0));
      { const q_ = ph === 3 ? 1 + .5 * Math.sin(t * 6) : ph === 4 ? 1 : .4; BC.scale.set(q_, q_, q_); }
      MS.scale.set(ph === 4 ? .8 - .25 * e : .8, ph === 4 ? 1 + .3 * e : 1, 1.1);
      const f = ph === 1 ? clamp(p * 1.4, 0, 1) : ph === 2 ? 1 : ph === 3 ? 1 : 0; void f;
    };
  }
});

/* =============== 5. PLANT: water + minerals + sugar =============== */
scene({
  kind: 'pln', id: 'plantflow', label: 'Plant flow', name: 'Plant water flow (live)', color: '#5ac86a', short: ['R', 'C', 'X', 'L', 'P'],
  phases: [['Root hair', 'Pani + minerals'], ['Cortex', 'Apoplast / symplast'], ['Xylem', 'Pani upar'], ['Leaf cell', 'Photosynthesis'], ['Phloem', 'Sugar neeche']],
  focus: [['rh', 'soil', 'wat'], ['cor', 'wat', 'min'], ['xyl', 'wat', 'min'], ['leaf', 'stm', 'xyl'], ['phl', 'leaf']],
  build(H) {
    const T3 = H.T3;
    H.part('soil', 'Soil (mitti)', 'Mitti mein pani aur mineral ion (nitrate, phosphate, K+, Mg2+). Pani kam concentration wali mitti se zyada concentration wale root cell mein osmosis se jaata hai.', 'p_pd');
    const SO = H.add(new T3.BoxGeometry(2.4, .3, 5.6), 0x8a5a3a, -6, 0, 0, .5); SO.rotation.z = 0;
    H.part('wat', 'Pani (H₂O)', 'Pani root hair se osmosis ke zariye aur xylem mein transpiration pull + cohesion-adhesion se upar: kuch ped 100 m se bhi upar tak.', 'p_pd');
    const W1 = H.flow(18, .08, 0x4ab8f0, (u, i) => [-6.2 + 3.4 * u, Math.sin(i * 3.1) * 1.8, .3], .12);
    H.part('min', 'Mineral ions', 'Active transport (ATP + pump) se ions root cell mein, concentration gradient ke virudh: nitrate, K+, phosphate. Ye xylem se patton tak jaate hain.', 'p_pd');
    const MN = H.flow(12, .1, 0xe8d84a, (u, i) => [-6.2 + 3.2 * u, Math.sin(i * 2.3 + 1) * 1.7, .35], .1);
    H.part('rh', 'Root hair cell', 'Lambi patli root hair surface area badhati hai. Cell sap zyada concentrated: pani andar. Mitochondria bahut: ion absorption ke liye ATP.', 'p_vac');
    for (let i = 0; i < 5; i++) { const y = -1.8 + i * .9; H.tube([[-4.2, y, 0], [-4.9, y, 0], [-5.4, y + .1, 0]], .1, 0xa8e8a0, .9); H.add(new T3.CylinderGeometry(.2, .2, .9, 12), 0xc8e8b8, -3.8, y, 0, .8).rotation.z = PI / 2; }
    H.part('cor', 'Cortex cells (apoplast + symplast)', 'Pani 2 raston se cortex paar karta hai: apoplast (cell wall ke raste) aur symplast (plasmodesmata se cytoplasm ke raste). Endodermis ki Casparian strip ise symplast mein mod deti hai.', 'p_pd');
    for (let r = 0; r < 3; r++) for (let i = 0; i < 4; i++) { const y = -1.5 + i; H.add(new T3.BoxGeometry(.95, .9, .8), 0xb8e0a0, -2.4 + r * 1.1, y, 0, .7); }
    const AP = H.flow(8, .06, 0x4ab8f0, (u, i) => [-3 + 3 * u, -1.5 + (i % 4) + .45, .5], .1);
    H.part('xyl', 'Xylem (pani ki nali)', 'Mare hue, lignin se bhare hollow vessel: pani + mineral ek-tarfa root se patton ki taraf. Transpiration (stomata se vaporization) se tension banta hai jo pani ko kheenchta hai.', 'p_pd');
    const XY = H.tube([[-1, -.6, 0], [2, -.6, 0], [6.5, -.6, 0]], .42, 0x5a9ae8, .55);
    for (let i = 0; i < 10; i++) { const r = H.add(new T3.TorusGeometry(.43, .035, 6, 14), 0x8a5a2a, -.8 + i * .75, -.6, 0, .9); r.rotation.y = PI / 2; }
    const XW = H.flow(14, .1, 0x4ab8f0, u => [-1 + 7.5 * u, -.6 + .15 * Math.sin(u * 40), .2], .15);
    const XM = H.flow(8, .09, 0xe8d84a, u => [-1 + 7.5 * u, -.6 + .15 * Math.cos(u * 30), .25], .12);
    H.part('phl', 'Phloem (sieve tube)', 'Jeevit sieve-tube cells: patton mein bani sugar (sucrose) ko jahan zaroorat ho (root, fal) wahan pahunchati hai: pressure-flow (source se sink). Companion cell ATP deti hai.', 'p_pd');
    H.tube([[-1, .7, 0], [2, .7, 0], [6.5, .7, 0]], .32, 0xe8b84a, .5);
    const SU = H.flow(10, .09, 0xffd84a, u => [6.5 - 7.5 * u, .7, .2], .1);
    H.part('leaf', 'Leaf cell + chloroplast', 'Mesophyll cell ke chloroplast mein photosynthesis: CO2 + H2O + light -> glucose + O2. Pani xylem se aata, sugar phloem se jaata.', 'p_chloro');
    for (let i = 0; i < 3; i++) H.add(new T3.BoxGeometry(1.4, 1.1, 1.2), 0x6ad07a, 5.9, -1.6 + i * 1.15 + 1.5, 0, .5).rotation.z = 0;
    const CP = [[5.6, .2], [6.3, 1.4], [5.5, 1.9], [6.4, 2.3], [5.7, 3.1], [6.1, 3.5]].map(p => H.sph(.22, 0x1a8a3a, p[0] - .7, p[1] - .2, .3, .95));
    H.part('stm', 'Stomata (vaporization)', 'Patte ke chhote ched: guard cells se khulte-band hote hain. Yahan se pani bhaap banta hai (transpiration) jo xylem mein pani ko kheenchta hai, aur CO2 andar aata hai.', 'p_pd');
    const ST = H.sph(.22, 0x2a9a4a, 7.5, 2, 0, .95); const VP = H.flow(8, .09, 0xcfeaff, (u, i) => [7.2 + u * 1.5, 2 + (i - 4) * .3 + Math.sin(u * 6) * .2, .3], .1);
    return (ph, p, t, e) => {
      W1.vis = ph <= 1 ? 1 : .3; MN.vis = ph <= 1 ? 1 : .3; AP.vis = ph === 1 ? 1 : ph === 0 ? .3 : 0;
      XW.vis = ph >= 2 ? 1 : .15; XM.vis = ph >= 2 ? 1 : .15; SU.vis = ph === 4 ? 1 : ph === 3 ? .6 : 0; VP.vis = ph >= 3 ? 1 : 0;
      SU.speed = ph === 4 ? .12 : .06; XW.speed = ph === 2 ? .18 : .1;
      CP.forEach((c, i) => { const q_ = ph === 3 ? 1 + .35 * Math.sin(t * 5 + i) : 1; c.scale.set(q_, q_, q_); });
    };
  }
});
})();
/* END OF FILE micro.js */
