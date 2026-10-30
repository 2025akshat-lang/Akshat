
registerCellModel('yeast', (THREE, group, opt) => {
  const k = CVKit.make(THREE, group, opt), T3 = k.T3, PI = Math.PI;
  const { mat, sph, add, setPart, inst, tube, out } = k, R = (a, b) => a + (b - a) * k.rand();
  const ell = (s, m, x, y, z) => { const o = add(sph(1, 28, 20), m, x, y, z); o.scale.set(s[0], s[1], s[2]); return o; };

  setPart('wall', 'Cell wall (glucan + mannoprotein)', 'Bahar mannoprotein, andar beta-glucan aur thoda chitin (bud scar par). Cell ko aakar aur osmotic suraksha. Fungus ki pehchan; antifungal dawa (echinocandin) isi ko nishana banati hai.', 'y_wall', 'wall');
  out(ell([2.5, 2.1, 2.1], mat(0xc89a5a, 0.22), 0, 0, 0));
  setPart('memb', 'Plasma membrane', 'Wall ke neeche lipid bilayer: ergosterol (animal mein cholesterol). Antifungal azole ergosterol banana rokti hai.', 'memb', 'wall');
  out(ell([2.38, 1.98, 1.98], mat(0xf0c070, 0.16), 0, 0, 0));
  setPart('cyto', 'Cytoplasm', 'Ghola cytosol jisme organelles aur glycolysis/fermentation ke enzyme: yeast bina oxygen ke sugar se alcohol + CO2 banata hai.', 'memb', 'cyto');
  out(ell([2.25, 1.85, 1.85], mat(0xf5e0b0, 0.1), 0, 0, 0));

  setPart('vac', 'Vacuole', 'Bada acidic bubble: lysosome jaisa kaam (hydrolase), ion/amino acid ka storage, pH aur paani ka santulan. Bud ko bhi bhaga milta hai.', 'y_vac', 'vac');
  ell([1.0, .85, .85], mat(0x5ab0e8, 0.4), 1.0, -.2, .1);
  setPart('nuc', 'Nucleus', 'Gol nucleus jisme 16 chromosome. Mitosis mein nuclear envelope tootti nahi (closed mitosis); nucleus bud ke neck se khinchkar baant jata hai.', 'nuc', 'nuc');
  ell([.8, .8, .8], mat(0x9b6bd8, 0.8), -.9, .4, -.1);
  ell([.28, .28, .28], mat(0x5a2a98, 1), -1.05, .5, -.1);
  setPart('spb', 'Spindle pole body (SPB)', 'Yeast ka centrosome jaisa: nuclear envelope mein ghusa layered disc. Spindle microtubule yahan se nikalte hain aur chromosome baantte hain.', 'y_spb', 'nuc');
  add(new T3.CylinderGeometry(.2, .2, .1, 14), mat(0xff7a4a, 1), -.2, .75, -.1).rotation.z = PI / 2 - .6;
  add(new T3.CylinderGeometry(.14, .14, .08, 14), mat(0xffa070, 1), -.3, .8, -.1).rotation.z = PI / 2 - .6;
  tube([[-.25, .8, -.1], [.5, 1.2, -.1], [1.3, 1.5, 0]], .025, 12, mat(0xffe08a, 0.9));

  setPart('mit', 'Mitochondria', 'Branching network (tubule jaal): oxygen hone par respiration se ATP. Bina oxygen ke yeast fermentation karta hai (petite mutants mein mtDNA nahi).', 'mit', 'mit');
  const mg = new T3.SphereGeometry(.17, 12, 10); mg.scale(2, .8, .8);
  inst(mg, mat(0xe0504a, 0.95), [[-1.7, -.8, .4], [-.4, -1.35, .6], [.4, 1.3, .6], [1.5, .9, -.5], [-1.5, 1.1, .9], [.1, -.6, -1.3]]);
  setPart('er', 'Endoplasmic reticulum', 'Nuclear envelope se judi jaali (cortical ER wall ke neeche): protein folding aur lipid synthesis.', 'er', 'er');
  tube([[-1.5, .1, .7], [-1.7, -.5, 1.1], [-1.2, -1.1, 1.2], [-.4, -1.3, 1.1]], .06, 20, mat(0x8a6ab8, 0.9));
  setPart('golgi', 'Golgi', 'Yeast mein cisternae alag-alag bikhre hote hain (stack nahi): mannoprotein ko modify karke wall ke liye bhejta hai.', 'golgi', 'golgi');
  [[-.1, -1.4, -.9], [-1.9, 0, -.8]].forEach(P => { for (let i = 0; i < 3; i++) add(new T3.CylinderGeometry(.3, .3, .05, 14), mat(0xf2d24a, 0.9), P[0], P[1] + i * .1, P[2]); });

  setPart('bud', 'Bud (nayi beti cell)', 'Mother cell se nikalta chhota ubhar: mitosis ke baad ek nucleus, mitochondria aur vacuole bud mein jaate hain; baad mein neck par septum banta aur bud alag ho jata hai. Mother par bud scar rah jata hai.', 'y_bud', 'bud');
  const bud = ell([1.05, .95, .95], mat(0xc89a5a, 0.28), 3.05, 0, 0);
  ell([.95, .86, .86], mat(0xf5e0b0, 0.14), 3.05, 0, 0);
  ell([.35, .35, .35], mat(0x9b6bd8, 0.85), 3.2, .15, 0);
  ell([.3, .22, .22], mat(0x5ab0e8, 0.45), 2.8, -.3, .25);
  tube([[1.9, 0, 0], [2.2, 0, 0], [2.4, 0, 0]], .22, 8, mat(0xffe08a, 0.6));
  setPart('scar', 'Bud scar (chitin ring)', 'Jahan se purani bud alag hui wahan chitin ka ubhra ring: har bud ek scar chhodti hai, isse yeast ki umr (replicative age) gini jati hai.', 'y_wall', 'wall');
  const sc = add(new T3.TorusGeometry(.2, .05, 8, 20), mat(0xffffff, 1), -1.4, 1.65, 1.0); sc.lookAt(-2.4, 3.3, 2.0);
  add(new T3.TorusGeometry(.2, .05, 8, 20), mat(0xffffff, 1), -.4, -1.9, 1.0).lookAt(-.4, -3.8, 2.0);

  return k.result((dt, t) => { bud.scale.set(1.05 * (1 + .02 * Math.sin(t * 1.2)), .95 * (1 + .02 * Math.sin(t * 1.2)), .95); }, { rot: PI / 2, scale: .85 });
});

