/* SKELETAL MUSCLE FIBER - sarcolemma (shell) | myofibrils: A band (laal), I band (halka gulabi), Z disc (safed) | T-tubule + SR | nuclei | mitochondria | NMJ
   Animation: sarcomere sikudta-failta hai (A band same, I band chhota-bada). */
registerCellModel('muscle', (THREE, group, opt) => {
  const k = CVKit.make(THREE, group, opt), T3 = k.T3, PI = Math.PI;
  const { mat, sph, add, setPart, tube, out } = k, R = (a, b) => a + (b - a) * k.rand();
  const LEN = 7.4, RAD = 1.55;

  setPart('sarco', 'Sarcolemma', 'Muscle fibre ki plasma membrane (basal lamina ke neeche). Isme Na+ channels aur nicotinic ACh receptors; action potential T-tubules ke raste andar jata hai.', 'm_triad', 'fiber');
  const sh = add(new T3.CylinderGeometry(RAD, RAD, LEN, 28, 1, true), mat(0xe08a7a, 0.2), 0, 0, 0); sh.rotation.z = PI / 2; out(sh);
  setPart('cyto', 'Sarcoplasm', 'Muscle ka cytoplasm: myoglobin (laal, O2 store), glycogen, ATP, creatine phosphate aur Ca2+ jo contraction chalaata hai.', 'm_triad', 'fiber');
  const cy = add(new T3.CylinderGeometry(RAD - .1, RAD - .1, LEN - .1, 28, 1, true), mat(0xf5b0a0, 0.1), 0, 0, 0); cy.rotation.z = PI / 2; out(cy);

  /* myofibrils: 7 sarcomere, 5 fibril */
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
  const rings = []; for (let i = 0; i <= NS; i++) for (const o of [-.38, .38]) { const r = add(new T3.TorusGeometry(1.15, .05, 6, 24), mat(0x4ad0ff, 0.9), 0, 0, 0); r.rotation.y = PI / 2; rings.push({ m: r, i, o }); }
  for (let i = 0; i <= NS; i++) { const r = add(new T3.TorusGeometry(1.2, .08, 6, 24), mat(0xffd04a, 0.9), 0, 0, 0); r.rotation.y = PI / 2; rings.push({ m: r, i, o: 0 }); }

  setPart('nuc', 'Nuclei (kinaare par)', 'Muscle fibre kai myoblast ke milne se bana multinucleate cell: kai nuclei sarcolemma ke theek neeche kinaare par (myofibrils ko jagah milti hai). Satellite cells ghav bharte hain.', 'nuc', 'nuc');
  [[-2.5, 1.35, .2], [.3, -1.35, .3], [2.4, 1.3, -.2]].forEach(P => { const n = add(sph(1, 18, 14), mat(0x9b6bd8, 0.85), P[0], P[1], P[2]); n.scale.set(.55, .24, .28); });
  setPart('mit', 'Mitochondria', 'Myofibrils ke beech aur sarcolemma ke neeche pankti mein: aerobic ATP (oxidative/slow fibres mein bahut zyada).', 'mit', 'mit');
  const mg = new T3.SphereGeometry(.17, 10, 8); mg.scale(1.7, .8, .8); const mm = new T3.InstancedMesh(mg, mat(0xe0b040, .95), 16), dm = new T3.Object3D();
  for (let i = 0; i < 16; i++) { dm.position.set(-3.1 + i * .4, i % 2 ? .35 : -.35, i % 2 ? -1.05 : -.9); dm.updateMatrix(); mm.setMatrixAt(i, dm.matrix); } mm.frustumCulled = false; k.root.add(mm); k.reg(mm);
  setPart('nmj', 'Neuromuscular junction', 'Motor neuron ka axon terminal fibre ke beech mein: ACh vesicle, synaptic cleft, junctional folds par ACh receptor. Ek action potential = ek muscle twitch.', 'm_nmj', 'nmj');
  tube([[1.8, 3.2, 0], [1.2, 2.4, 0], [.9, 1.9, 0]], .13, 16, mat(0xb58cff, 0.9));
  const bulb = add(sph(1, 16, 12), mat(0xc9b2ff, 0.9), .85, 1.75, 0); bulb.scale.set(.45, .3, .35);
  const f2 = add(sph(1, 14, 10), mat(0xff7aa8, 0.9), .85, 1.5, 0); f2.scale.set(.5, .08, .38);

  const place = (t) => { const L = .9 + .12 * Math.sin(t * 1.4), x0 = -NS * L / 2;
    A.forEach(o => { o.m.position.x = x0 + (o.i + .5) * L; });
    thick.forEach(o => { o.m.position.x = x0 + (o.i + .5) * L; });
    I.forEach(o => { o.m.position.x = x0 + (o.i + .5) * L; o.m.scale.set(1, L, 1); });
    Z.forEach(o => { o.m.position.x = x0 + o.i * L; });
    rings.forEach(o => { o.m.position.x = x0 + o.i * L + (o.o ? o.o * L / 1.0 * .55 : 0); }); };
  place(0);
  return k.result((dt, t) => place(t), { rot: PI / 2, scale: 0.72 });
});
/* END OF FILE muscle.js */
