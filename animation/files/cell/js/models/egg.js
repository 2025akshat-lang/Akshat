
registerCellModel('egg', (THREE, group, opt) => {
  const k = CVKit.make(THREE, group, opt), T3 = k.T3, PI = Math.PI;
  const { mat, sph, add, setPart, inst, tube, out } = k, R = (a, b) => a + (b - a) * k.rand();
  const dir = () => { const a = R(0, PI * 2), b = Math.acos(R(-1, 1)); return [Math.sin(b) * Math.cos(a), Math.sin(b) * Math.sin(a), Math.cos(b)]; };

  setPart('corona', 'Corona radiata (cumulus cells)', 'Egg ko gherti follicular cells ki parat, hyaluronan jel mein: egg ko poshan aur ovulation ke baad sperm ke liye pehli badha (hyaluronidase se todi jati hai).', 'e_zona', 'zona');
  const cm = new T3.InstancedMesh(sph(.34, 10, 8), mat(0xffb8d0, 0.85), 60), dm = new T3.Object3D();
  for (let i = 0; i < 60; i++) { const d = dir(), r = 2.85 + R(-.05, .1); dm.position.set(d[0] * r, d[1] * r, d[2] * r); dm.updateMatrix(); cm.setMatrixAt(i, dm.matrix); }
  cm.frustumCulled = false; k.root.add(cm); k.reg(cm);
  setPart('zona', 'Zona pellucida', 'Egg ko gherti glycoprotein (ZP1-3) ki moti parat (~ 7-20 um): sperm ko species-specific tarah se pehchanti hai (ZP3), polyspermy rokti hai (ZP2 kat jata hai) aur shuruaati bhrun ko dhakti hai.', 'e_zona', 'zona');
  out(add(sph(2.45, 32, 24), mat(0xf2c35a, 0.28), 0, 0, 0));
  setPart('memb', 'Plasma membrane (oolemma)', 'Egg ki membrane microvilli se bhari: IZUMO1 ke liye JUNO receptor aur CD9 yahin. Perivitelline space zona aur membrane ke beech.', 'memb', 'cell');
  out(add(sph(2.05, 32, 24), mat(0xf0e0b8, 0.2), 0, 0, 0));
  setPart('cyto', 'Ooplasm (cytoplasm)', 'Bahut bada cytoplasm: mRNA aur protein ke bhandar, yolk/lipid, ~ 100,000 mitochondria. Bhrun ke pehle kai division isi se chalte hain.', 'memb', 'cell');
  out(add(sph(2.0, 28, 20), mat(0xfff0d0, 0.1), 0, 0, 0));

  setPart('cort', 'Cortical granules', 'Membrane ke neeche ke chhote enzyme-bhare vesicle (~ 4000): sperm fuse hote hi exocytosis se zona mein enzyme chhodte hain aur ZP2 ko katkar zona ko sakht kar dete hain (cortical reaction).', 'e_cort', 'cort');
  const cg = new T3.InstancedMesh(sph(.075, 8, 6), mat(0xffee44, 1, 0x806000, .4), 150); for (let i = 0; i < 150; i++) { const d = dir(), r = 1.88 + R(0, .08); dm.position.set(d[0] * r, d[1] * r, d[2] * r); dm.updateMatrix(); cg.setMatrixAt(i, dm.matrix); } cg.frustumCulled = false; k.root.add(cg); k.reg(cg);

  setPart('spindle', 'Meiotic spindle (MII) + chromosomes', 'Egg metaphase II par ruka hota hai: spindle membrane ke paas, 23 chromosomes (dyads) beech mein. Centrosome nahi: acentriolar spindle. Sperm ke aate hi Ca2+ lehar se meiosis II poori.', 'e_spindle', 'spin');
  const spx = new T3.Group(); spx.position.set(1.3, .75, 0); spx.rotation.z = -.5; k.root.add(spx); k.reg(spx);
  const sg = new T3.SphereGeometry(1, 14, 10); sg.scale(.75, .38, .38); const sp1 = new T3.Mesh(sg, mat(0x6ab0ff, 0.45)); spx.add(sp1);
  for (let i = 0; i < 10; i++) { const x = R(-.12, .12), y = R(-.15, .15); const c = new T3.Mesh(new T3.SphereGeometry(.05, 6, 5), mat(0x9b6bd8)); c.position.set(x, y, R(-.1, .1)); spx.add(c); }
  setPart('pb', 'First polar body', 'Meiosis I mein bacha chhota cell (kam cytoplasm): ek set chromosome le kar membrane ke paas atka rehta hai aur baad mein khatam ho jata hai. Egg ko cytoplasm bachane ka tarika.', 'e_spindle', 'spin');
  const pb = add(sph(1, 16, 12), mat(0xffd8b0, 0.7), 1.95, 1.1, 0); pb.scale.set(.38, .38, .38); pb.lookAt(0, 0, 0);

  setPart('mit', 'Mitochondria', 'Cell mein sabse zyada (~ 100,000): bhrun ko shuru ka ATP deti hain. Sirf maa se milti hain (maternal inheritance). Mitochondrial DNA ki sankhya (~ 200,000 copy) bhi sabse zyada.', 'mit', 'mit');
  const mg = new T3.SphereGeometry(.1, 8, 6); mg.scale(1.7, .8, .8); const mm = new T3.InstancedMesh(mg, mat(0xe0504a, .95), 80);
  for (let i = 0; i < 80; i++) { const d = dir(), r = 1.0 + R(0, .8); dm.position.set(d[0] * r, d[1] * r, d[2] * r); dm.rotation.set(R(0, 3), R(0, 3), 0); dm.updateMatrix(); mm.setMatrixAt(i, dm.matrix); } dm.rotation.set(0, 0, 0); mm.frustumCulled = false; k.root.add(mm); k.reg(mm);
  setPart('yolk', 'Yolk / lipid + glycogen', 'Insaan mein kam yolk (lipid droplets aur glycogen); machhli/pakshi mein bahut zyada. Shuruaati bhrun ka khaana.', 'lyso', 'yolk');
  const yg = new T3.InstancedMesh(sph(.12, 8, 6), mat(0xf2d27a, .9), 40); for (let i = 0; i < 40; i++) { const d = dir(), r = R(.3, 1.4); dm.position.set(d[0] * r, d[1] * r, d[2] * r); dm.updateMatrix(); yg.setMatrixAt(i, dm.matrix); } yg.frustumCulled = false; k.root.add(yg); k.reg(yg);
  setPart('er', 'ER + Golgi', 'Cortex ke paas ER ke ghere (Ca2+ store; sperm ke baad Ca2+ lehar yahin se). Golgi cortical granule banata hai.', 'er', 'er');
  tube([[-1.4, .2, .8], [-.9, -.5, 1.1], [-.2, -1.0, 1.0], [.5, -1.3, .6]], .06, 20, mat(0x8a6ab8, 0.9));
  tube([[-1.2, 1.0, -.5], [-.6, 1.2, -1.0], [.2, 1.1, -1.2]], .06, 20, mat(0x8a6ab8, 0.9));

  return k.result((dt, t) => { spx.rotation.z = -.5 + .06 * Math.sin(t * .8); });
});

