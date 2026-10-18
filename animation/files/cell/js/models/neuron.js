/* NEURON - detailed model (CellVerse, Three.js r128)
   Parts (rang):
   Soma (opt.color) | Nucleus + nucleolus + chromatin (dark violet) | Mitochondria (red-orange)
   Nissl bodies = rough ER (blue) | Golgi (orange) | Lysosomes (green) | Free ribosomes (yellow)
   Dendrites + dendritic spines (opt.color) | Axon hillock (pink) | Axon + neurofilaments (pale violet / white)
   Myelin sheath (cream) | Schwann cell nuclei (brown) | Nodes of Ranvier + Na+ channels (orange / mint)
   Axon terminals + synaptic boutons (pink) + synaptic vesicles (cyan) | Postsynaptic membrane + receptors (teal / gold)
   Animation: action potential -> node flash -> neurotransmitter release -> receptors glow (7 sec loop) */
registerCellModel('neuron', (THREE, group, opt) => {
  const T3 = THREE;
  const root = new T3.Group();            // sab kuch root mein; portrait mein root ghoomta hai
  group.add(root);

  /* ---------- parts registry: har mesh ek part se jud jata hai (tap -> detail view) ---------- */
  const PARTS = {};
  let ctx = null;
  const setPart = (key, name, info, det, grp) => { ctx = key ? (PARTS[key] = PARTS[key] || { key, name, info, det, grp, objs: [] }) : null; };
  const reg = o => { if (ctx) ctx.objs.push(o); return o; };

  /* ---------- helpers (sirf is file ke andar) ---------- */
  let seed = 11;
  const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const V = (x, y, z) => new T3.Vector3(x, y, z);
  const mat = (c, op, em, emI) => {
    const p = { color: c, roughness: 0.5, side: T3.DoubleSide };
    if (op != null && op < 1) { p.transparent = true; p.opacity = op; p.depthWrite = false; }
    if (em != null) { p.emissive = em; p.emissiveIntensity = emI == null ? 0 : emI; }
    return new T3.MeshStandardMaterial(p);
  };
  const sph = (r, w, h) => new T3.SphereGeometry(r, w || 16, h || 12);
  const add = (geo, m, x, y, z, parent) => {
    const o = new T3.Mesh(geo, m);
    o.position.set(x, y, z);
    (parent || root).add(o);
    return reg(o);
  };
  const capsule = (len, r) => {           // CapsuleGeometry r128 mein nahi hai, isliye Lathe
    const n = 8, hc = Math.max(0, len / 2 - r), P = [];
    for (let i = 0; i <= n; i++) { const a = -Math.PI / 2 + Math.PI / 2 * i / n; P.push(new T3.Vector2(Math.max(0.0001, r * Math.cos(a)), -hc + r * Math.sin(a))); }
    for (let i = 0; i <= n; i++) { const a = Math.PI / 2 * i / n; P.push(new T3.Vector2(Math.max(0.0001, r * Math.cos(a)), hc + r * Math.sin(a))); }
    return new T3.LatheGeometry(P, 16);
  };
  const tubeMesh = (pts, r, seg, m) => {
    const c = new T3.CatmullRomCurve3(pts);
    const tm = new T3.Mesh(new T3.TubeGeometry(c, seg || 20, r, 6, false), m);
    root.add(tm); reg(tm);
    return c;
  };
  const inst = (geo, m, list) => {        // list = [{p:Vector3, s:number}]
    const im = new T3.InstancedMesh(geo, m, list.length), d = new T3.Object3D();
    list.forEach((o, i) => { d.position.copy(o.p); d.scale.set(o.s || 1, o.s || 1, o.s || 1); d.updateMatrix(); im.setMatrixAt(i, d.matrix); });
    im.instanceMatrix.needsUpdate = true;
    im.frustumCulled = false;
    root.add(im);
    return reg(im);
  };

  const COL = opt && opt.color ? opt.color : '#b58cff';
  const AXC = 0xc9b2ff;                   // axon ka rang

  /* ---------- 1. SOMA (cell body) ---------- */
  setPart('soma','Soma (cell body)','Neuron ka cell body: nucleus aur sab organelles yahin hain. Protein aur neurotransmitter yahin ban kar axon/dendrite mein jate hain.','n_soma','soma');
  const C = V(-1.9, 0, 0);                // soma ka center
  const SR = 0.75;                        // soma radius
  add(sph(SR, 32, 24), mat(COL, 0.28), C.x, C.y, C.z).userData.out = true;                 // plasma membrane (bahari: tap par last)
  add(sph(SR - 0.03, 24, 18), mat(0xe4d8ff, 0.1), C.x, C.y, C.z).userData.out = true;      // cytoplasm

  // Nucleus: envelope + nucleoplasm + nucleolus + chromatin
  setPart('nuc','Nucleus','DNA yahan hota hai; neuron mein bada, halka (euchromatic) nucleus aur prominent nucleolus.','nuc','soma');
  const NC = V(C.x - 0.05, 0, 0);
  add(sph(0.36, 24, 18), mat(0x8a6cf5, 0.32), NC.x, NC.y, NC.z);                  // nuclear envelope
  add(sph(0.33, 24, 18), mat(0x5b3fc9, 0.5), NC.x, NC.y, NC.z);                   // nucleoplasm
  add(sph(0.095, 16, 12), mat(0x2a1580), NC.x + 0.08, NC.y + 0.05, NC.z + 0.04);  // nucleolus
  const chrom = [];
  for (let i = 0; i < 20; i++) {
    const v = V(rand() - 0.5, rand() - 0.5, rand() - 0.5);
    if (v.length() < 0.05) v.set(0.3, 0.1, 0.1);
    v.normalize().multiplyScalar(0.12 + rand() * 0.15).add(NC);
    chrom.push({ p: v, s: 0.8 + rand() * 0.6 });
  }
  inst(sph(0.025, 8, 6), mat(0xffc8ff), chrom);                                    // chromatin

  const inSoma = (rmin, rmax) => {        // soma ke andar random jagah (nucleus se bahar)
    const v = V(rand() - 0.5, rand() - 0.5, rand() - 0.5);
    if (v.length() < 0.05) v.set(0.3, 0.3, 0.1);
    return v.normalize().multiplyScalar(rmin + (rmax - rmin) * rand()).add(C);
  };

  // Mitochondria (6) - tick mein halka hilte hain
  setPart('mito','Mitochondria','ATP banate hain; neuron ko bahut energy chahiye (Na+/K+ pump).','mit','soma');
  const mitos = [];
  for (let i = 0; i < 6; i++) {
    const p = inSoma(0.42, 0.62), g = new T3.Group();
    g.position.copy(p);
    g.rotation.set(rand() * 3, rand() * 3, rand() * 3);
    g.add(new T3.Mesh(capsule(0.24, 0.05), mat(0xf0735f, 0.88)));    // outer membrane
    g.add(new T3.Mesh(capsule(0.2, 0.025), mat(0x9c3328)));          // cristae / matrix
    root.add(g); reg(g);
    mitos.push({ g: g, y: p.y, ph: rand() * 6 });
  }

  // Nissl bodies (rough ER, 5 clusters)
  setPart('nissl','Nissl bodies (Rough ER)','Ribosome-wale ER ke dher: neuron ki protein factory. Dyed karne par neel-baingani dikhte hain.','er','soma');
  for (let i = 0; i < 5; i++) {
    const p = inSoma(0.42, 0.6), g = new T3.Group();
    g.position.copy(p);
    g.rotation.set(rand() * 3, rand() * 3, rand() * 3);
    for (let k = 0; k < 3; k++) {
      const s = new T3.Mesh(sph(0.1, 12, 8), mat(0x4aa3e8, 0.9));
      s.scale.set(1, 0.22, 1);
      s.position.y = (k - 1) * 0.055;
      g.add(s);
    }
    root.add(g); reg(g);
  }

  // Golgi apparatus (4 curved cisternae)
  setPart('golgi','Golgi apparatus','Protein ko modify, sort aur pack karta hai; synaptic vesicle ke membrane bhi yahin se.','golgi','soma');
  const gg = new T3.Group();
  gg.position.set(C.x + 0.1, 0.42, 0.2);
  gg.rotation.z = 0.4;
  for (let k = 0; k < 4; k++) {
    const a = new T3.Mesh(new T3.TorusGeometry(0.14 - k * 0.012, 0.016, 6, 14, Math.PI), mat(0xf0a050));
    a.position.z = (k - 1.5) * 0.05;
    gg.add(a);
  }
  root.add(gg); reg(gg);

  // Lysosomes (3) + free ribosomes
  setPart('lyso','Lysosomes','Purane protein aur organelles ko todte hain (neuron divide nahi hota, isliye recycling zaroori).','lyso','soma');
  for (let i = 0; i < 3; i++) { const p = inSoma(0.45, 0.65); add(sph(0.045, 10, 8), mat(0x66c27a), p.x, p.y, p.z); }
  setPart('rib','Free ribosomes','Cytoplasm ke ribosome: neuron ke apne protein banate hain.','rib','soma');
  const rib = [];
  for (let i = 0; i < 70; i++) rib.push({ p: inSoma(0.4, 0.7) });
  inst(sph(0.013, 6, 5), mat(0xffe28a), rib);

  /* ---------- 2. DENDRITES + SPINES ---------- */
  setPart('dend','Dendrites','Branch jaise reshe: doosre neurons ka signal receive karte hain aur soma ki taraf bhejte hain.','n_dend','dend');
  const dmat = mat(COL, 0.95), spines = [];
  const branch = (p0, dir, len, r, depth) => {
    const d = dir.clone().normalize();
    const p3 = p0.clone().add(d.clone().multiplyScalar(len));
    const side = V(rand() - 0.5, rand() - 0.5, rand() - 0.5).multiplyScalar(len * 0.5);
    const p1 = p0.clone().lerp(p3, 0.33).add(side);
    const p2 = p0.clone().lerp(p3, 0.66).sub(side.clone().multiplyScalar(0.6));
    const c = tubeMesh([p0, p1, p2, p3], r, 14, dmat);
    add(sph(r * 1.05, 8, 6), dmat, p3.x, p3.y, p3.z);          // joint ka seam chhupane ke liye
    const ns = depth === 0 ? 4 : 3;
    for (let i = 0; i < ns; i++) {
      const pt = c.getPoint(0.2 + 0.7 * rand());
      const n = V(rand() - 0.5, rand() - 0.5, rand() - 0.5);
      if (n.length() < 0.05) n.set(0, 1, 0);
      spines.push({ p: pt, n: n.normalize(), r: r });
    }
    if (depth > 0) {
      for (let k = 0; k < 2; k++) {
        const nd = d.clone().add(V(rand() - 0.5, rand() - 0.5, rand() - 0.5).multiplyScalar(1.2));
        branch(p3, nd, len * 0.82, r * 0.72, depth - 1);
      }
    }
  };
  [[-1, 0.9, 0.2], [-1, 0.3, -0.6], [-1, -0.5, 0.5], [-0.7, -1, -0.2], [-0.3, 1, -0.5]].forEach(a => {
    const d = V(a[0], a[1], a[2]).normalize();
    branch(C.clone().add(d.clone().multiplyScalar(SR - 0.05)), d, 0.5, 0.07, 2);
  });
  // Dendritic spines (stalk + head), instanced
  setPart('spine','Dendritic spines','Dendrite par chhote kante jaise ubhaar: har spine par ek excitatory synapse. Seekhne par spine ka size badalta hai.','n_spine','dend');
  const stalkI = new T3.InstancedMesh(new T3.CylinderGeometry(0.007, 0.007, 0.06, 5), mat(COL), spines.length);
  const headI = new T3.InstancedMesh(sph(0.022, 8, 6), mat(0xd9c6ff), spines.length);
  const dum = new T3.Object3D(), Y = V(0, 1, 0);
  spines.forEach((s, i) => {
    dum.scale.set(1, 1, 1);
    dum.quaternion.setFromUnitVectors(Y, s.n);
    dum.position.copy(s.p).addScaledVector(s.n, s.r + 0.03);
    dum.updateMatrix(); stalkI.setMatrixAt(i, dum.matrix);
    dum.quaternion.set(0, 0, 0, 1);
    dum.position.copy(s.p).addScaledVector(s.n, s.r + 0.07);
    dum.updateMatrix(); headI.setMatrixAt(i, dum.matrix);
  });
  stalkI.instanceMatrix.needsUpdate = true; headI.instanceMatrix.needsUpdate = true;
  stalkI.frustumCulled = false; headI.frustumCulled = false;
  root.add(stalkI); root.add(headI); reg(stalkI); reg(headI);

  /* ---------- 3. AXON HILLOCK + AXON ---------- */
  setPart('hill','Axon hillock','Soma aur axon ka jod: yahin action potential shuru hota hai (sabse zyada Na+ channels, threshold ~ -55 mV).','n_hill','axon');
  const X0 = C.x + SR;                    // soma ka right edge (-1.15)
  const hill = add(new T3.CylinderGeometry(0.06, 0.26, 0.5, 16), mat(0xff8fb0, 0.95), X0 - 0.05 + 0.25, 0, 0);
  hill.rotation.z = -Math.PI / 2;         // chaudi taraf soma, patli taraf axon
  setPart('axon','Axon','Lamba tar jaisa hissa jo signal soma se terminals tak le jata hai. Andar microtubules + neurofilaments.','n_axon','axon');
  const AX_END = 2.3;
  tubeMesh([V(X0 + 0.2, 0, 0), V(0.6, 0, 0), V(AX_END, 0, 0)], 0.055, 40, mat(AXC));       // axon

  // Neurofilaments / microtubules (axon ke andar patli safed lines)
  [[0, 0.025, 0], [0.02, -0.015, 0.02], [-0.02, -0.015, -0.02]].forEach(o => {
    tubeMesh([V(C.x + 0.4, o[1], o[2]), V(0.6, o[1], o[2]), V(AX_END, o[1], o[2])], 0.01, 40, mat(0xffffff, 0.85));
  });

  /* ---------- 4. MYELIN + NODES OF RANVIER ---------- */
  setPart('myelin','Myelin sheath + Schwann cell','Schwann cell ki lipid layers axon par lipta hua insulator: signal ko tez banata hai (saltatory conduction).','n_myelin','myelin');
  const segs = [[-0.75, -0.25], [-0.15, 0.35], [0.45, 0.95], [1.05, 1.55], [1.65, 2.15]];
  segs.forEach((s, i) => {
    const len = s[1] - s[0], cx = (s[0] + s[1]) / 2;
    const outer = add(capsule(len, 0.15), mat(0xf2e6a0, 0.5), cx, 0, 0); outer.rotation.z = Math.PI / 2;     // myelin
    const inner = add(capsule(len - 0.04, 0.115), mat(0xe0c070, 0.55), cx, 0, 0); inner.rotation.z = Math.PI / 2; // andar ki layer
    if (i === 1 || i === 3) {             // Schwann cell nucleus
      const sn = add(sph(0.1, 12, 8), mat(0xb88a5c), cx, 0.15, 0.02);
      sn.scale.set(1.3, 0.5, 0.8);
    }
  });
  setPart('node','Nodes of Ranvier','Myelin ke beech ki khuli jagah: yahan Na+ channels ka jhund hai, action potential yahin dobara tez hota hai.','n_node','node');
  const nodeRings = [], nodeXs = [];
  for (let i = 0; i < segs.length - 1; i++) {
    const nx = (segs[i][1] + segs[i + 1][0]) / 2;
    nodeXs.push(nx);
    const rm = mat(0xff9a3c, null, 0xff7a00, 0.25);
    const ring = add(new T3.TorusGeometry(0.075, 0.02, 8, 20), rm, nx, 0, 0);
    ring.rotation.y = Math.PI / 2;
    nodeRings.push(rm);
    for (let k = 0; k < 8; k++) {         // Na+ channels
      const a = k * Math.PI / 4;
      add(sph(0.016, 6, 5), mat(0x66ffcc), nx, Math.cos(a) * 0.07, Math.sin(a) * 0.07);
    }
  }

  /* ---------- 5. AXON TERMINALS + SYNAPSE ---------- */
  setPart('term','Axon terminals (synaptic boutons)','Axon ke ant mein branches: har bouton mein neurotransmitter ke vesicles hote hain.','n_syn','term');
  const BP = [V(3.15, 0.38, 0.05), V(3.25, 0.1, -0.12), V(3.2, -0.2, 0.15), V(2.95, -0.55, -0.05)];
  const boutonMats = [], vesList = [];
  BP.forEach((b, i) => {
    const mid = V(AX_END, 0, 0).lerp(b, 0.5).add(V(0, (i < 2 ? 0.08 : -0.08), (i % 2 ? 0.06 : -0.06)));
    tubeMesh([V(AX_END, 0, 0), mid, b.clone().add(V(-0.1, 0, 0))], 0.028, 16, mat(AXC));      // telodendria
    const bm = mat(0xff7aa8, 0.75, 0xff3d7a, 0);
    add(sph(0.13, 18, 14), bm, b.x, b.y, b.z);                                                 // synaptic bouton
    boutonMats.push(bm);
    for (let k = 0; k < 7; k++) {                                                              // synaptic vesicles
      const v = V(rand() - 0.5, rand() - 0.5, rand() - 0.5);
      if (v.length() < 0.05) v.set(0.2, 0.1, 0);
      vesList.push({ p: v.normalize().multiplyScalar(0.03 + rand() * 0.06).add(b) });
    }
  });
  inst(sph(0.02, 8, 6), mat(0x7fe8ff, null, 0x2a8aa8, 0.4), vesList);

  // Postsynaptic membrane (dome) + receptors
  setPart('post','Postsynaptic membrane + receptors','Agle cell ki membrane jahan receptors neurotransmitter pakadte hain.','n_syn','term');
  const PC = V(3.73, -0.05, 0);
  const dome = add(new T3.SphereGeometry(0.6, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat(0x4fc3b8, 0.55), PC.x, PC.y, PC.z);
  dome.scale.set(1, 0.4667, 1);           // depth ~0.28
  dome.rotation.z = Math.PI / 2;          // dome ka ubhaar presynaptic taraf (-x)
  const recMat = mat(0xffd36a, null, 0xffb300, 0), recPos = [];
  for (let i = 0; i < 8; i++) {
    const th = 0.15 + rand() * 0.6, ph = rand() * Math.PI * 2;
    const p = V(PC.x - 0.28 * Math.cos(th), PC.y + 0.6 * Math.sin(th) * Math.cos(ph), PC.z + 0.6 * Math.sin(th) * Math.sin(ph));
    recPos.push(p);
    add(sph(0.026, 8, 6), recMat, p.x, p.y, p.z);
  }
  // Neurotransmitter particles (sirf release ke time dikhte hain)
  const ntMat = mat(0xffe14d, null, 0xffd200, 1);
  const nts = recPos.map((rp, i) => {
    const b = BP[1 + (i % 2)];
    const st = V(b.x + 0.1, b.y + (rand() - 0.5) * 0.1, b.z + (rand() - 0.5) * 0.1);
    const m = add(sph(0.02, 8, 6), ntMat, st.x, st.y, st.z);
    m.visible = false;
    return { m: m, a: st, b: rp.clone().add(V(-0.02, 0, 0)) };
  });

  /* ---------- 6. ACTION POTENTIAL + AXONAL TRANSPORT ---------- */
  setPart(null);
  const pulseMat = mat(0xfff27a, null, 0xffe14d, 1.2);
  const pulse = add(sph(0.075, 14, 10), pulseMat, X0, 0, 0);
  const halo = add(sph(0.14, 14, 10), mat(0xffee66, 0.3), X0, 0, 0);
  pulse.visible = false; halo.visible = false;
  const cargo = [0, 1, 2].map(i => add(sph(0.03, 8, 6), mat(0x4de0d0, null, 0x1a9a8c, 0.4), 0, 0, 0));

  /* ---------- 7. TICK (animation) ---------- */
  const clamp01 = v => Math.max(0, Math.min(1, v));
  const P = 7;                            // loop 7 second ka
  return {
    parts: Object.keys(PARTS).map(k => PARTS[k]),
    tick: (dt, t) => {
      // portrait phone par neuron seedha khada ho jaye (soma upar, synapse neeche)
      const portrait = innerWidth / innerHeight < 0.8;
      const tr = portrait ? -Math.PI / 2 : 0, ts = portrait ? 0.85 : 1, k = Math.min(1, dt * 6);
      root.rotation.z += (tr - root.rotation.z) * k;
      const sc = root.scale.x + (ts - root.scale.x) * k;
      root.scale.set(sc, sc, sc);

      mitos.forEach(o => { o.g.position.y = o.y + 0.012 * Math.sin(t * 1.2 + o.ph); });
      cargo.forEach((c, i) => {           // anterograde axonal transport
        const u = (t * 0.12 + i / 3) % 1;
        c.position.set(-1.3 + u * 3.5, (i - 1) * 0.02, (i === 1 ? 0.02 : -0.015));
      });

      const u = (t % P) / P;
      let glow = 0, rel = -1;
      if (u < 0.55) {                     // 1) pulse axon par
        const e = u / 0.55, x = X0 + (AX_END - X0) * e;
        pulse.visible = halo.visible = true;
        pulse.position.x = halo.position.x = x;
        const hs = 1 + 0.2 * Math.sin(t * 20);
        halo.scale.set(hs, hs, hs);
      } else {
        pulse.visible = halo.visible = false;
        if (u < 0.62) glow = (u - 0.55) / 0.07;                         // 2) bouton chamakta hai
        else if (u < 0.9) { glow = 1 - (u - 0.62) / 0.28; rel = (u - 0.62) / 0.28; } // 3) release
      }
      nodeRings.forEach((m, i) => {
        const near = u < 0.55 ? clamp01(1 - Math.abs(X0 + (AX_END - X0) * (u / 0.55) - nodeXs[i]) / 0.25) : 0;
        m.emissiveIntensity = 0.25 + 1.4 * near;
      });
      boutonMats.forEach(m => { m.emissiveIntensity = 0.9 * glow; });
      nts.forEach((n, i) => {
        if (rel < 0) { n.m.visible = false; return; }
        const q = clamp01((rel - i * 0.03) / 0.5);
        n.m.visible = q > 0 && q < 1;
        n.m.position.lerpVectors(n.a, n.b, q);
      });
      recMat.emissiveIntensity += ((rel >= 0.45 && rel < 1 ? 1 : 0) - recMat.emissiveIntensity) * Math.min(1, dt * 8);
    }
  };
});
