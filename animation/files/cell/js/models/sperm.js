/* SPERM CELL (CellVerse, r128) - head: nucleus (neela) + acrosome (halka neela) | neck: centrioles (peela)
   midpiece: mitochondrial helix (laal) | principal piece: axoneme 9+2 (hara + safed) | end piece (halka hara)
   Animation: poori tail par lehrati hui flagellar wave */
registerCellModel('sperm', (THREE, group, opt) => {
  const k = CVKit.make(THREE, group, opt), T3 = k.T3, PI = Math.PI;
  const { mat, sph, add, setPart } = k;

  
  setPart('head', 'Head (nucleus + acrosome)', 'Sir: andar ghana haploid nucleus (23 chromosome, protamine se pack) aur aage acrosome cap jisme enzyme (hyaluronidase, acrosin) bhare hain.', 's_head', 'head');
  add(sph(1, 24, 18), mat(0x3a56c8, 0.92), 3.55, 0, 0).scale.set(0.8, 0.5, 0.34);                 
  const ch = []; for (let i = 0; i < 40; i++) { const v = k.V(k.rand() - .5, k.rand() - .5, k.rand() - .5).multiplyScalar(1.5); ch.push({ p: [3.5 + v.x * .8 * .8, v.y * .5 * .8, v.z * .34 * .8] }); }
  k.inst(sph(0.03, 6, 5), mat(0x9fb4ff), ch);                                                     
  add(sph(1, 24, 18), mat(0x7fc8ff, 0.5), 3.98, 0, 0).scale.set(0.5, 0.56, 0.4);                  

  
  setPart('neck', 'Neck + centrioles', 'Gardan: proximal centriole (zygote ke pehle cell division ke liye) aur distal centriole jisse tail ka axoneme nikalta hai.', 'cen', 'neck');
  const nk = add(new T3.CylinderGeometry(0.12, 0.1, 0.34, 12), mat(0xf0c040, 0.9), 2.62, 0, 0); nk.rotation.z = PI / 2;
  const c1 = add(new T3.CylinderGeometry(0.045, 0.045, 0.2, 8), mat(0xffe08a), 2.66, 0.03, 0); c1.rotation.z = PI / 2;
  const c2 = add(new T3.CylinderGeometry(0.045, 0.045, 0.2, 8), mat(0xffe08a), 2.58, -0.03, 0.03);

  
  const N = 34, S0 = 2.45, LEN = 6.2, links = [];
  const zone = i => i < 8 ? 'mid' : i < 30 ? 'main' : 'end';
  for (let i = 0; i < N; i++) {
    const z = zone(i);
    if (z === 'mid') setPart('mid', 'Midpiece (mitochondrial helix)', 'Beech ka hissa: 50-75 mitochondria spiral mein lipte hain, tail ke liye ATP dete hain. Axoneme ke bahar 9 outer dense fibres.', 's_mid', 'tail');
    else if (z === 'main') setPart('main', 'Principal piece (axoneme 9+2)', 'Sabse lamba hissa: andar 9+2 axoneme, bahar fibrous sheath. Dynein ATP se tootkar tail ko lehraata hai.', 's_axo', 'tail');
    else setPart('end', 'End piece', 'Tail ka patla sira: sirf axoneme, fibrous sheath nahi.', 's_axo', 'tail');
    const r = z === 'mid' ? 0.16 : z === 'main' ? 0.1 - 0.04 * (i - 8) / 22 : 0.045;
    const col = z === 'mid' ? (i % 2 ? 0xc84a4a : 0x8a2a2a) : z === 'main' ? 0x7fd6c2 : 0xa8e8dc;
    links.push({ i, m: add(new T3.CylinderGeometry(r, r, 1, 10), mat(col, z === 'main' ? 0.6 : 1), 0, 0, 0) });
    if (z === 'main') links.push({ i, m: add(new T3.CylinderGeometry(0.03, 0.03, 1, 6), mat(0xffffff), 0, 0, 0) });
  }
  const path = (s, t) => [S0 - LEN * s, (0.02 + 0.4 * s * s) * Math.sin(2 * PI * 1.3 * s - 4 * t)];
  const place = t => links.forEach(o => {
    const a = path(o.i / N, t), b = path((o.i + 1) / N, t), dx = b[0] - a[0], dy = b[1] - a[1];
    o.m.position.set((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0); o.m.rotation.z = Math.atan2(dy, dx) - PI / 2; o.m.scale.set(1, Math.hypot(dx, dy) * 1.05, 1);
  });
  place(0);
  return k.result((dt, t) => place(t), { rot: PI / 2, scale: 0.8 });
});

