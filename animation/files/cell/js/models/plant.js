/* PLANT CELL (CellVerse, r128) - cell wall (halka hara-bhura) | membrane | bada central vacuole (neela) | nucleus (jamuni)
   chloroplast (gehra hara) | mitochondria (laal) | Golgi (peela) | ER (kasni) | peroxisome (narangi) | plasmodesmata */
registerCellModel('plant', (THREE, group, opt) => {
  const k = CVKit.make(THREE, group, opt), T3 = k.T3, PI = Math.PI;
  const { mat, sph, add, setPart, inst, tube, out } = k, R = (a, b) => a + (b - a) * k.rand();
  const W = 5.8, H = 4.2, D = 3.8;

  setPart('wall', 'Cell wall', 'Cellulose microfibrils + hemicellulose + pectin ki mazboot bahari deewar. Cell ko aakar aur turgor ke against suraksha deti hai. Animal cell mein nahi hoti.', 'p_wall', 'wall');
  out(add(new T3.BoxGeometry(W, H, D), mat(0xa8c070, 0.22), 0, 0, 0));
  setPart('memb', 'Plasma membrane', 'Wall ke andar ki lipid bilayer: kya andar-bahar jaye ye tay karti hai. Cellulose synthase yahin se wall ke liye cellulose banati hai.', 'memb', 'wall');
  out(add(new T3.BoxGeometry(W - .22, H - .22, D - .22), mat(0x6ab04c, 0.16), 0, 0, 0));
  setPart('cyto', 'Cytoplasm', 'Wall ke paas patli parat mein cytosol aur organelles (vacuole beech ki zyadatar jagah leta hai). Cytoplasmic streaming se chloroplast ghoomte hain.', 'memb', 'cyto');
  out(add(new T3.BoxGeometry(W - .5, H - .5, D - .5), mat(0xcfe8b0, 0.1), 0, 0, 0));

  setPart('vac', 'Central vacuole', 'Cell ka ~ 80-90% hissa: tonoplast se ghira paani, ion, sugar, pigment aur kachra bhara. Turgor pressure se cell ko sakht rakhta hai (murjhana = turgor ghatna).', 'p_vac', 'vac');
  const v = add(sph(1, 28, 20), mat(0x5ab0e8, 0.34), .35, 0, 0); v.scale.set(2.3, 1.45, 1.2);
  setPart('nuc', 'Nucleus', 'DNA (chromatin) aur nucleolus. Plant cell mein vacuole nucleus ko ek taraf dhakel deta hai. Nuclear pores se mRNA bahar jata hai.', 'nuc', 'nuc');
  add(sph(.7, 22, 16), mat(0x9b6bd8, 0.8), -2.0, 1.05, .3);
  add(sph(.24, 14, 10), mat(0x5a2a98), -2.0, 1.05, .3);

  setPart('chloro', 'Chloroplasts', 'Hare plastid: double membrane, andar thylakoid ke dher (grana) jahan chlorophyll light se ATP + NADPH banata hai, stroma mein Calvin cycle CO2 se sugar banata hai. Apna DNA aur 70S ribosome.', 'p_chloro', 'chloro');
  const cg = new T3.SphereGeometry(.4, 16, 12); cg.scale(1.45, .8, .8);
  const cp = []; for (let i = 0; i < 16; i++) { const side = i % 4; let x, y, z;
    if (side === 0) { x = R(-2.3, 2.3); y = 1.6; z = R(-1, 1); } else if (side === 1) { x = R(-2.3, 2.3); y = -1.6; z = R(-1, 1); } else if (side === 2) { x = R(-2.3, 2.3); y = R(-1.2, 1.2); z = 1.3; } else { x = R(-2.3, 2.3); y = R(-1.2, 1.2); z = -1.3; }
    cp.push([x, y, z]); }
  const chl = inst(cg, mat(0x2ea84a, 0.95, 0x0a3a14, .4), cp);

  setPart('mit', 'Mitochondria', 'Plant cell mein bhi hote hain: raat ko aur jin hisson mein light nahi, wahan respiration se ATP banate hain. Chloroplast ke sath milkar ATP/NADPH ka santulan banate hain.', 'mit', 'mit');
  const mg = new T3.SphereGeometry(.2, 12, 10); mg.scale(1.6, .8, .8);
  inst(mg, mat(0xe0504a, 0.95), [[-1.0, 1.55, -.9], [1.2, -1.55, .8], [2.4, 1.0, -.6], [-2.6, -.9, .9], [.2, 1.6, .9], [2.5, -1.0, .2], [-.6, -1.55, -.8]]);

  setPart('golgi', 'Golgi (dictyosome)', 'Chhote-chhote dher: cell wall ke hemicellulose + pectin banata aur vesicles se wall tak pahunchata hai. Plant cell mein kai alag-alag stacks hote hain.', 'golgi', 'golgi');
  [[-1.2, -1.0, -.7], [1.9, .3, -.9]].forEach(P => { for (let i = 0; i < 4; i++) add(new T3.CylinderGeometry(.42 - i * .03, .42 - i * .03, .06, 16), mat(0xf2d24a, 0.9), P[0], P[1] + i * .12, P[2]); });

  setPart('er', 'Endoplasmic reticulum', 'Nucleus se judi jaali: rough ER (ribosome ke sath) protein, smooth ER lipid banata hai. Plasmodesmata mein desmotubule bhi ER ka hissa hai.', 'er', 'er');
  tube([[-1.5, .5, .3], [-1.0, -.1, .8], [-.6, -.8, .5], [-1.3, -1.3, .9]], .07, 24, mat(0x8a6ab8, 0.9));
  tube([[-2.7, .2, -.4], [-2.2, -.5, -.8], [-1.6, -.8, -.9]], .07, 20, mat(0x8a6ab8, 0.9));

  setPart('perox', 'Peroxisome', 'Chhote gol bubble: photorespiration mein glycolate todte hain aur H2O2 ko catalase se paani banate hain.', 'lyso', 'perox');
  inst(sph(.17, 10, 8), mat(0xf29a3c, 0.95), [[-2.4, -1.4, 0], [2.7, .2, .9], [-.2, 1.7, -.9]]);

  setPart('pd', 'Plasmodesmata', 'Wall ko cheerti sooksham nali jo padosi plant cells ke cytoplasm ko jodti hai (~ 50 nm): paani, sugar, hormone, RNA aur virus bhi guzar sakte hain.', 'p_pd', 'wall');
  const pd = []; for (let i = 0; i < 6; i++) pd.push([W / 2 + .02, R(-1.3, 1.3), R(-1.2, 1.2)]);
  const pg = new T3.CylinderGeometry(.06, .06, .35, 8); pg.rotateZ(PI / 2);
  inst(pg, mat(0xffffff, 0.95), pd);

  return k.result((dt, t) => { v.scale.set(2.3 * (1 + .015 * Math.sin(t * 1.4)), 1.45 * (1 + .02 * Math.sin(t * 1.4)), 1.2); }, { rot: PI / 2, scale: .85 });
});

