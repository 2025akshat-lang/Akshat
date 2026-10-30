/* SKELETAL MUSCLE FIBER - sarcolemma (shell) | myofibrils: A band (laal), I band (halka gulabi), Z disc (safed) | T-tubule + SR | nuclei | mitochondria | NMJ
   Animation: sarcomere sikudta-failta hai (A band same, I band chhota-bada). */
registerCellModel('muscle', (THREE, group, opt) => {
  const k = CVKit.make(THREE, group, opt), T3 = k.T3, PI = Math.PI;
  const { mat, sph, add, setPart, tube, out } = k, R = (a, b) => a + (b - a) * k.rand();
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x)), lerp = (a, b, t) => a + (b - a) * t, sm = (a, b, x) => { const q = clamp((x - a) / (b - a), 0, 1); return q * q * (3 - 2 * q); };
  const LEN = 7.4, RAD = 1.55;

  setPart('sarco', 'Sarcolemma', 'Muscle fibre ki plasma membrane (basal lamina ke neeche). Isme Na+ channels aur nicotinic ACh receptors; action potential T-tubules ke raste andar jata hai.', 'm_triad', 'fiber');
  const sh = add(new T3.CylinderGeometry(RAD, RAD, LEN, 28, 1, true), mat(0xe08a7a, 0.2), 0, 0, 0); sh.rotation.z = PI / 2; out(sh);
  setPart('cyto', 'Sarcoplasm', 'Muscle ka cytoplasm: myoglobin (laal, O2 store), glycogen, ATP, creatine phosphate aur Ca2+ jo contraction chalaata hai.', 'm_triad', 'fiber');
  const cy = add(new T3.CylinderGeometry(RAD - .1, RAD - .1, LEN - .1, 28, 1, true), mat(0xf5b0a0, 0.1), 0, 0, 0); cy.rotation.z = PI / 2; out(cy);

  
  const fib = [[0, 0], [.7, .5], [-.7, .5], [.55, -.6], [-.55, -.6]], NS = 7;
  setPart('sarc', 'Sarcomere (Z disc se Z disc)', 'Contraction ki ikaai (~ 2.5 um). A band (gehra, moti myosin ki lambai) jo nahi badalta; I band (halka, sirf patli actin) chhota hota hai; Z disc sarcomere ki seema; H zone aur M line beech mein. Sliding filament theory.', 'm_sarc', 'myo');
  const aM = new T3.MeshStandardMaterial({ color: 0xd04040, roughness: .5 }), iM = new T3.MeshStandardMaterial({ color: 0xf8c8d0, roughness: .5 }), zM = new T3.MeshStandardMaterial({ color: 0xffffff, roughness: .4 });
  const A = [], I = [], Z = [];
  fib.forEach(f => { for (let i = 0; i < NS; i++) {
    const a = add(new T3.CylinderGeometry(.27, .27, .62, 14), aM, 0, f[0], f[1]); a.rotation.z = PI / 2; A.push({ m: a, i });
    const b = add(new T3.CylinderGeometry(.14, .14, 1, 10), iM, 0, f[0], f[1]); b.rotation.z = PI / 2; I.push({ m: b, i }); }
    for (let i = 0; i <= NS; i++) { const z = add(new T3.CylinderGeometry(.34, .34, .05, 16), zM, 0, f[0], f[1]); z.rotation.z = PI / 2; Z.push({ m: z, i }); } });
  setPart('myosin', 'Thick filaments (myosin)', 'Har thick filament ~ 300 myosin molecules ka bundle (A band). Myosin ke sir (heads) actin se judkar kheenchte hain: ATP lagta hai.', 'm_xb', 'myo');
  const thick = []; fib.forEach(f => { for (let i = 0; i < NS; i++) { const m = add(new T3.CylinderGeometry(.08, .08, .6, 8), mat(0xff6a6a), 0, f[0] + .0, f[1] + .0); m.rotation.z = PI / 2; m.visible = true; thick.push({ m, i }); } });

  setPart('ttub', 'T-tubule + SR (triad)', 'T-tubule sarcolemma ki andar dhansi nali hai jo A-I junction par jaati hai; dono taraf Sarcoplasmic Reticulum ke terminal cisternae (Ca2+ ka bhandar): milkar triad.', 'm_triad', 'triad');
  const rings = []; for (let i = 0; i <= NS; i++) for (const o of [-.38, .38]) { const r = add(new T3.TorusGeometry(1.15, .05, 6, 24), mat(0x4ad0ff, 0.9, 0x000000, 0), 0, 0, 0); r.rotation.y = PI / 2; rings.push({ m: r, i, o }); }
  for (let i = 0; i <= NS; i++) { const r = add(new T3.TorusGeometry(1.2, .08, 6, 24), mat(0xffd04a, 0.9), 0, 0, 0); r.rotation.y = PI / 2; rings.push({ m: r, i, o: 0 }); }

  setPart('nuc', 'Nuclei (kinaare par)', 'Muscle fibre kai myoblast ke milne se bana multinucleate cell: kai nuclei sarcolemma ke theek neeche kinaare par (myofibrils ko jagah milti hai). Satellite cells ghav bharte hain.', 'nuc', 'nuc');
  [[-2.5, 1.35, .2], [.3, -1.35, .3], [2.4, 1.3, -.2]].forEach(P => { const n = add(sph(1, 18, 14), mat(0x9b6bd8, 0.85), P[0], P[1], P[2]); n.scale.set(.55, .24, .28); });
  setPart('mit', 'Mitochondria', 'Myofibrils ke beech aur sarcolemma ke neeche pankti mein: aerobic ATP (oxidative/slow fibres mein bahut zyada).', 'mit', 'mit');
  const mg = new T3.SphereGeometry(.17, 10, 8); mg.scale(1.7, .8, .8); const mm = new T3.InstancedMesh(mg, mat(0xe0b040, .95), 16), dm = new T3.Object3D();
  for (let i = 0; i < 16; i++) { dm.position.set(-3.1 + i * .4, i % 2 ? .35 : -.35, i % 2 ? -1.05 : -.9); dm.updateMatrix(); mm.setMatrixAt(i, dm.matrix); } mm.frustumCulled = false; k.root.add(mm); k.reg(mm);
  setPart('nmj', 'Neuromuscular junction', 'Motor neuron ka axon terminal fibre ke beech mein: ACh vesicle, synaptic cleft, junctional folds par ACh receptor. Ek action potential = ek muscle twitch.', 'm_nmj', 'nmj');
  const axon = tube([[1.8, 3.2, 0], [1.2, 2.4, 0], [.9, 1.9, 0]], .13, 16, mat(0xb58cff, 0.9, 0x000000, 0));
  const bulb = add(sph(1, 16, 12), mat(0xc9b2ff, 0.9, 0x000000, 0), .85, 1.75, 0); bulb.scale.set(.45, .3, .35);
  const f2 = add(sph(1, 14, 10), mat(0xff7aa8, 0.9), .85, 1.5, 0); f2.scale.set(.5, .08, .38);

  
  const pulse = add(sph(.2, 12, 10), mat(0xffffff, 1, 0xaaccff, 1), 1.8, 3.2, 0);
  const ach = []; for (let i = 0; i < 6; i++) ach.push(add(sph(.06, 8, 6), mat(0xffd04a, 1, 0x806000, .6), .85, 1.7, 0));
  const NCA = 56, caG = new T3.SphereGeometry(.06, 8, 6), caM = new T3.InstancedMesh(caG, mat(0xffee44, 1, 0x806000, .7), NCA), dm2 = new T3.Object3D(), caS = [];
  for (let i = 0; i < NCA; i++) caS.push({ ring: i % (NS + 1), a: R(0, PI * 2), r: R(.25, 1.0), d: R(0, 1) });
  caM.frustumCulled = false; k.root.add(caM); k.reg(caM);
  const BND = [0, 1.6, 2.4, 3.8, 4.8, 6.4, 9]; const STG = window.CVStage = { id: 'muscle', t: 0, hold: false, end: 9, go(i) { this.t = BND[i]; this.end = BND[i + 1]; this.hold = true; }, free() { this.hold = false; } };
  const ax = axon && axon.userData && axon.userData.curve;
  const place = (t) => { const rel = .98, con = .84, L = rel - (rel - con) * (sm(4.4, 5.6, t) - sm(6.6, 8.2, t)), x0 = -NS * L / 2;
    A.forEach(o => { o.m.position.x = x0 + (o.i + .5) * L; });
    thick.forEach(o => { o.m.position.x = x0 + (o.i + .5) * L; });
    I.forEach(o => { o.m.position.x = x0 + (o.i + .5) * L; o.m.scale.set(1, L, 1); });
    Z.forEach(o => { o.m.position.x = x0 + o.i * L; });
    rings.forEach(o => { const x = x0 + o.i * L + (o.o ? o.o * L / 1.0 * .55 : 0); o.m.position.x = x;
      const front = (t - 2.4) / 1.4 * 4.6, g = (t > 2.4 && t < 6) ? Math.exp(-Math.pow((Math.abs(x - .85) - front) / .7, 2)) * (1 - sm(5, 6, t)) + .0 : 0; const mt = o.m.material; if (mt && mt.emissive) { mt.emissive.setHex(0x4ad0ff); mt.emissiveIntensity = g * 1.4; } });
    
    const u = clamp((t) / 1.6, 0, 1); if (ax && ax.getPoint) { const p = ax.getPoint(u); pulse.position.set(p.x, p.y, p.z); }
    const pv = t < 1.7 ? 1 : 0; pulse.scale.set(pv, pv, pv); axon.material && axon.material.emissive && (axon.material.emissive.setHex(0x6a8aff), axon.material.emissiveIntensity = (t < 2 ? sm(0, 1.6, t) * .8 : 0));
    const fl = sm(1.4, 1.9, t) * (1 - sm(2.2, 2.7, t)); bulb.material.emissive.setHex(0x8a8aff); bulb.material.emissiveIntensity = fl * 1.2; bulb.scale.set(.45 * (1 + .15 * fl), .3 * (1 + .15 * fl), .35);
    ach.forEach((m, i) => { const q = clamp((t - 1.7 - i * .05) / .6, 0, 1), vis = (t > 1.7 && t < 2.9) ? 1 : 0; m.position.set(.85 + (i - 2.5) * .08, lerp(1.7, 1.52, q), 0); m.scale.set(vis, vis, vis); });
    
    const ca = sm(3.8, 4.4, t) * (1 - sm(6.8, 8.2, t));
    caS.forEach((c, i) => { const rx = x0 + c.ring * L, rp = lerp(1.0, c.r, sm(3.8, 5.0, t)); dm2.position.set(rx + (c.d - .5) * .3, Math.cos(c.a) * rp, Math.sin(c.a) * rp * .6 - .0); const s2 = ca * (.7 + .5 * Math.sin(t * 6 + i)); dm2.scale.set(s2, s2, s2); dm2.updateMatrix(); caM.setMatrixAt(i, dm2.matrix); });
    caM.instanceMatrix.needsUpdate = true;
    aM.emissive.setHex(0x701010); aM.emissiveIntensity = .7 * sm(4.4, 5.6, t) * (1 - sm(6.6, 7.6, t)); };
  place(0);
  return k.result((dt, t) => { if (STG.hold) { STG.t = Math.min(STG.t + dt, STG.end); } else { STG.t = (STG.t + dt) % 9; } place(STG.t); }, { rot: PI / 2, scale: 0.72 });
});

