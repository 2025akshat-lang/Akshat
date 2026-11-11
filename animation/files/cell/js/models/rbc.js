
registerCellModel('rbc', (THREE, group, opt) => {
  const k = CVKit.make(THREE, group, opt), T3 = k.T3, PI = Math.PI;
  const { mat, sph, add, setPart, inst, tube, out } = k, R = (a, b) => a + (b - a) * k.rand();
  const disc = (Rd, mul) => { const P = [], n = 24, f = r => { const q = r / Rd; return .5 * Rd * Math.sqrt(Math.max(0, 1 - q * q)) * (.2072 + 2.0026 * q * q - 1.1228 * q * q * q * q) * mul; };
    for (let i = 0; i <= n; i++) { const r = Rd * (i / n); P.push(new T3.Vector2(Math.max(.0001, r), f(r))); }
    for (let i = n - 1; i >= 0; i--) { const r = Rd * (i / n); P.push(new T3.Vector2(Math.max(.0001, r), -f(r))); }
    return new T3.LatheGeometry(P, 40); };
  const hero = new T3.Group(); hero.position.set(-.9, 0, 0); hero.rotation.set(1.05, 0, .25); k.root.add(hero);
  const addH = (geo, m, x, y, z) => { const o = new T3.Mesh(geo, m); o.position.set(x || 0, y || 0, z || 0); hero.add(o); return k.reg(o); };

  setPart('memb', 'Plasma membrane', 'Lipid bilayer jisme band 3 (Cl-/HCO3- exchanger), glycophorin, aquaporin-1, GLUT1 aur blood group antigens (ABO, Rh). Bahut lachili: capillary se ghus jati hai.', 'r_mem', 'cell');
  out(addH(disc(2.3, 1), mat(0xe05a5a, 0.34), 0, 0, 0));
  setPart('skel', 'Spectrin cytoskeleton', 'Membrane ke neeche spectrin-actin ka shatkon jaal (ankyrin, band 4.1): isse cell lachili aur chikni bani rehti hai aur biconcave aakar kayam rehta hai. Kharabi se spherocytosis.', 'r_shape', 'cell');
  const sg = new T3.TorusGeometry(2.0, .02, 6, 60); const g1 = addH(sg, mat(0xffe08a, 0.9), 0, .5, 0); g1.rotation.x = PI / 2; g1.scale.set(1, 1, 1);
  const sp0 = []; for (let i = 0; i < 40; i++) { const a = R(0, PI * 2), r = Math.sqrt(R(0, 1)) * 1.8, q = r / 2.3, th = .5 * 2.3 * Math.sqrt(1 - q * q) * (.2072 + 2.0026 * q * q - 1.1228 * q * q * q * q); sp0.push([r * Math.cos(a), th * .97 * (i % 2 ? 1 : -1), r * Math.sin(a)]); }
  const spg = new T3.SphereGeometry(.07, 8, 6); const im = new T3.InstancedMesh(spg, mat(0xffe08a), sp0.length), dm = new T3.Object3D(); sp0.forEach((p, i) => { dm.position.set(p[0], p[1], p[2]); dm.updateMatrix(); im.setMatrixAt(i, dm.matrix); }); im.frustumCulled = false; hero.add(im); k.reg(im);
  setPart('hb', 'Hemoglobin (~ 270 million/cell)', 'Cell ka ~ 97% dry protein: har molecule mein 4 globin chain + 4 heme (Fe2+). Phephdon mein O2 pakadta, tissue mein chhodta; CO2 bhi thoda le jata hai. Laal rang iska hi hai.', 'r_hb', 'hb');
  const hb = []; for (let i = 0; i < 70; i++) { const a = R(0, PI * 2), r = Math.sqrt(R(0, 1)) * 1.9, q = r / 2.3, th = .5 * 2.3 * Math.sqrt(Math.max(0, 1 - q * q)) * (.2072 + 2.0026 * q * q - 1.1228 * q * q * q * q) * .8; hb.push([r * Math.cos(a), R(-th, th), r * Math.sin(a)]); }
  const hbm = new T3.InstancedMesh(new T3.SphereGeometry(.11, 8, 6), mat(0xa01818), hb.length); hb.forEach((p, i) => { dm.position.set(p[0], p[1], p[2]); dm.updateMatrix(); hbm.setMatrixAt(i, dm.matrix); }); hbm.frustumCulled = false; hero.add(hbm); k.reg(hbm);
  setPart('o2', 'Oxygen (O2)', 'Lungs mein Hb ke heme se bandhta hai (oxyHb, chamkila laal) aur tissue mein chhodta hai (deoxyHb, gehra). 1 Hb = 4 O2.', 'r_hb', 'hb');
  const o2 = new T3.InstancedMesh(new T3.SphereGeometry(.09, 8, 6), mat(0x4ad0ff, 1, 0x1a80c0, .6), 8); const o2p = []; for (let i = 0; i < 8; i++) o2p.push([R(-3, -1), R(-.5, .5), R(-1, 1)]); k.root.add(o2); o2.frustumCulled = false; k.reg(o2);
  setPart('dimple', 'Central pallor (patla beech)', 'Biconcave disc ke beech ka patla hissa (~ 1 um moti vs kinaare ~ 2.5 um): zyada surface area, O2 ko kam doori tay karni padti hai; aur cell mudkar capillary mein ghus jata hai.', 'r_shape', 'cell');
  const dimp = addH(new T3.TorusGeometry(.7, .03, 6, 30), mat(0xffffff, .9), 0, .27, 0); dimp.rotation.x = PI / 2;
  setPart('sickle', 'Sickle cell (tulna ke liye)', 'HbS (glutamate ki jagah valine, beta-6) deoxygenated hone par lambe fibres bana deta hai: cell hansiye (sickle) jaisa kadak ho kar capillary mein atak jata hai. Dard + anaemia.', 'r_hb', 'sickle');
  const sk = new T3.TorusGeometry(.9, .3, 10, 24, 4.4); const s1 = add(sk, mat(0xa83030, 0.85), 3.0, -1.2, 0); s1.rotation.z = .6;
  const s2 = add(new T3.TorusGeometry(.7, .25, 10, 24, 4.0), mat(0xa83030, 0.85), 3.0, 1.4, 0); s2.rotation.z = 2.5;
  return k.result((dt, t) => { hero.rotation.z = .25 + .35 * Math.sin(t * .6); hero.rotation.x = 1.05 + .15 * Math.sin(t * .8);
    for (let i = 0; i < 8; i++) { const u = (t * .25 + i / 8) % 1; dm.position.set(-3.2 + u * 3.0, o2p[i][1], o2p[i][2]); dm.updateMatrix(); o2.setMatrixAt(i, dm.matrix); } o2.instanceMatrix.needsUpdate = true; }, { rot: PI / 2, scale: .75 });
});

