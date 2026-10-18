/* RBC detail views: r_hb, r_mem, r_shape */
(() => {
if (typeof registerDetail === 'undefined') throw new Error('04-detail-viewer.js purana hai (registerDetail nahi mila): naya 04-detail-viewer.js upload karo');
const PI = Math.PI, K = CVKit, rr = K.rr, dots = K.dots;

registerDetail('r_hb', A => {
  A.ttl('Hemoglobin'); A.cam([0, 0, 0, 7, 10, .3, .15]);
  const sub = [[-.8, .8, -.2, 0xe05a5a, 'Alpha globin (alpha 1)'], [.8, .8, .2, 0xe05a5a, 'Alpha globin (alpha 2)'], [-.8, -.8, .2, 0xe0a050, 'Beta globin (beta 1)'], [.8, -.8, -.2, 0xe0a050, 'Beta globin (beta 2)']];
  const PG = A.part('Globin chains (2 alpha + 2 beta)', 'Hb A = alpha2 beta2 (~ 64 kDa). Har chain ek heme pocket banati hai. Beta chain ke 6th amino acid par glutamate: valine ho jaye to HbS (sickle). Fetus mein gamma chain (HbF) jo O2 zyada pakadti hai.');
  sub.forEach(s => A.add(sp(1, 20, 14), s[3], s[0], s[1], s[2], { op: .55, s: [.85, .85, .85], cut: 1 }, PG));
  const PH = A.part('Heme group (Fe2+ + porphyrin)', 'Chapta porphyrin ring jiske beech mein Fe2+ hota hai: O2 yahin judta hai. Har Hb mein 4 heme. CO iske liye O2 se ~ 200 guna zyada pakad se judti hai: carbon monoxide zehar.');
  const PF = A.part('Iron (Fe2+) + O2', 'Iron ek O2 ko palat-ne wali bandh se pakadta hai. Ek O2 judne se globin ka aakar badalta hai aur agle O2 ko judna aasan ho jata hai (cooperativity: S-shaped curve).');
  sub.forEach(s => { A.add(new T.CylinderGeometry(.3, .3, .04, 16), 0xaa1010, s[0], s[1], s[2] + .55, { op: .95, r: [PI / 2, 0, 0], cut: 0 }, PH); A.add(sp(.09, 10, 8), 0xffc060, s[0], s[1], s[2] + .55, { op: 1 }, PF); A.add(sp(.12, 10, 8), 0x4ad0ff, s[0] + .1, s[1] + .1, s[2] + .95, { op: .95 }, PF); });
  const PT = A.part('T state aur R state (cooperativity)', 'Deoxy Hb "tense" (T): O2 se kam lagaav. O2 judne par "relaxed" (R) mein badal jata hai aur O2 ke liye lagaav ~ 300 guna badh jata hai. 2,3-BPG, H+, CO2 aur kam pH T state ko pasand karte hain (Bohr effect): tissue mein O2 chhodna aasan.');
  A.flow([[-2.6, 0, 1], [-1.6, .3, .9], [-.8, .6, .8]], 0x4ad0ff, 4, .1, .07);
  A.flow([[.8, -.7, .8], [1.6, -.3, .9], [2.6, 0, 1]], 0x4ad0ff, 4, .1, .07);
  const PB = A.part('2,3-BPG (central cavity)', 'Chaaron chains ke beech ke gaddhe mein baithta hai aur Hb ko T state mein rakhta hai: unchai (altitude) par isse jyada banta hai taaki tissue ko O2 mile.');
  A.add(sp(.18, 10, 8), 0xffee44, 0, 0, 0, { op: .95 }, PB);
  const PS = A.part('Sickle Hb fibre (HbS polymer)', 'HbS deoxy hone par ek-doosre se juda hokar lambe rope bana deta hai jo cell ko hansiye ke aakar mein kheench deta hai.');
  for (let i = 0; i < 4; i++) A.tube([[-2.8, -2.1 + i * .08, -.6 + i * .1], [-1.0, -2.1 + i * .08, -.6 + i * .1], [1.0, -2.0 + i * .08, -.6 + i * .1]], .06, 0xa83030, PS, .9);
  A.lab('Alpha chain', [-.8, 1.55, 0], '#e05a5a'); A.lab('Alpha chain', [.8, 1.55, 0], '#e05a5a'); A.lab('Beta chain', [-.8, -1.55, 0], '#e0a050'); A.lab('Beta chain', [.8, -1.55, 0], '#e0a050'); A.lab('Heme + Fe2+', [0, .55, 0], '#ffc060'); A.lab('2,3-BPG', [0, -.25, 0], '#ffee44'); A.lab('O2 andar', [-2.4, .6, 0], '#4ad0ff'); A.lab('O2 bahar (tissue)', [2.4, .6, 0], '#4ad0ff'); A.lab('HbS fibre (sickle)', [-1.4, -2.5, 0], '#a83030');
  A.go('Membrane ▸', 'r_mem');
});

registerDetail('r_mem', A => {
  A.ttl('RBC membrane'); A.cam([0, 0, 0, 7.5, 11, .35, .2]);
  const PL = A.part('Lipid bilayer', 'Phospholipid (PC, sphingomyelin bahar; PS, PE andar) + cholesterol. Asymmetry zaroori: PS bahar aa jaye to macrophage cell ko kha jata hai (eat-me signal).');
  [1, -1].forEach(sd => { A.add(new T.BoxGeometry(5.5, .2, 3.6), 0xf29a7a, 0, sd * .28, 0, { op: .55, cut: 1 }, PL);
    for (let i = 0; i < 14; i++) for (let j = 0; j < 5; j++) { const x = -2.6 + i * .4, z = -1.6 + j * .75; A.add(sp(.09, 8, 6), 0xffd0b8, x, sd * .45, -Math.abs(z), { op: .95, cut: 1 }, PL); } });
  const PB3 = A.part('Band 3 (anion exchanger)', 'Sabse zyada membrane protein: Cl- ko HCO3- se badalta hai (chloride shift) isse tissue ka CO2 plasma mein bicarbonate banke jata hai. Ankyrin aur Hb se bhi judta hai.');
  [-1.8, -.4, 1.0, 2.2].forEach(x => A.add(new T.CylinderGeometry(.2, .2, .9, 14), 0x5a8ae8, x, 0, -.7, { op: .9, cut: 1 }, PB3));
  const PGL = A.part('Glycophorin A + ABO/Rh antigens', 'Sialic acid se bharpoor sugar wali chain jo cell ko negative charge deti hai (RBC ek-doosre se door rehti hain). ABO sugar chains aur RhD protein yahin: blood group.');
  [-2.2, -1.0, .6, 1.8].forEach((x, i) => { A.add(new T.CylinderGeometry(.06, .06, .9, 8), 0xff6a9a, x, 0, -1.0, { op: .9, cut: 1 }, PGL); A.tube([[x, .45, -1.0], [x + .2, .9, -1.0], [x + .1, 1.3, -.95]], .03, 0xff6a9a, PGL, .9, { cut: 1 }); A.add(sp(.12, 8, 6), [0x4ad0ff, 0xffd04a, 0xff6a9a, 0x7ae87a][i], x + .1, 1.35, -.95, { op: 1, cut: 1 }, PGL); });
  const PQ = A.part('Aquaporin-1 + GLUT1', 'Aquaporin-1 paani turant andar-bahar bhejta hai (osmosis); GLUT1 glucose aate hain: RBC sirf glycolysis se ATP banati hai.');
  [-2.5, 0.3, 2.7].forEach(x => A.add(new T.CylinderGeometry(.12, .12, .85, 10), 0x4ad0a0, x, 0, .0, { op: .9, cut: 1 }, PQ));
  const PP = A.part('Na+/K+ pump', 'ATP lekar 3 Na+ bahar aur 2 K+ andar: cell ka volume aur ion santulan. Pump kharab ho to RBC phool kar phat jata hai.');
  A.add(new T.CylinderGeometry(.28, .28, .95, 14), 0xffa040, 1.5, 0, .6, { op: .9, cut: 1 }, PP);
  const PS = A.part('Spectrin tetramer (network)', 'Alpha + beta spectrin ek-doosre se lambi rassi bana kar actin node (junctional complex) tak jaati hain: 2D hexagonal jaal jo membrane ko mazbooti aur lachak deta hai. Isme kharabi: elliptocytosis.', 1, 'r_shape');
  for (let i = 0; i < 5; i++) A.tube([[-2.6 + i * 1.1, -.55, -1.2], [-2.1 + i * 1.1, -.9, -1.4], [-1.5 + i * 1.1, -.55, -1.2]], .045, 0xffe08a, PS, .95, { cut: 1 });
  const PA = A.part('Actin node + ankyrin', 'Short actin filament (~ 37 nm) spectrin ke 5-6 sire jodta hai (junctional complex). Ankyrin spectrin ko band 3 se jodta hai: membrane aur skeleton ko laga rakhta hai.');
  [-2.6, -1.5, -.4, .7, 1.8].forEach(x => A.add(sp(.12, 10, 8), 0x4ad0f0, x, -.55, -1.2, { op: 1, cut: 1 }, PA)); A.bar([-1.8, -.3, -.6], [-1.8, -.6, -1.2], .035, 0xc87ae0, PA, .95, { cut: 1 });
  A.lab('Bahar (plasma)', [-3.0, 1.8, 0], '#ffd0b8'); A.lab('Lipid bilayer', [-3.0, .35, 0], '#f29a7a'); A.lab('Band 3', [-1.8, 1.0, 0], '#5a8ae8'); A.lab('Glycophorin + antigen', [-1.0, 1.9, 0], '#ff6a9a'); A.lab('Aquaporin / GLUT1', [.3, 1.0, 0], '#4ad0a0'); A.lab('Na+/K+ pump', [1.7, 1.0, 0], '#ffa040'); A.lab('Spectrin jaal', [-.9, -1.55, 0], '#ffe08a'); A.lab('Actin node', [1.8, -1.2, 0], '#4ad0f0'); A.lab('Andar (cytoplasm: Hb)', [0, -2.3, 0], '#a01818'); A.lab('Ankyrin', [-2.3, -.7, 0], '#c87ae0');
  A.go('Biconcave shape ▸', 'r_shape');
});

registerDetail('r_shape', A => {
  A.ttl('Biconcave shape'); A.cam([0, .2, 0, 8, 11, .1, .05]);
  const prof = (Rd, mul, sg) => { const out = []; for (let i = 0; i <= 24; i++) { const r = -Rd + 2 * Rd * i / 24, q = Math.abs(r) / Rd, th = .5 * Rd * Math.sqrt(Math.max(0, 1 - q * q)) * (.2072 + 2.0026 * q * q - 1.1228 * q * q * q * q) * mul; out.push([r, sg * th]); } return out; };
  const PM = A.part('Biconcave disc (kata hua)', 'Diameter ~ 7.8 um, kinaara ~ 2.5 um moti, beech ~ 1 um. Surface area ~ 135 um2, volume ~ 90 fL: sphere ke mukable ~ 40% zyada surface: gas aadan-pradan ke liye behtareen.');
  const T1 = prof(2.6, 1, 1).map(p => [p[0] * .95, p[1] + .0, 0]), T2 = prof(2.6, 1, -1).map(p => [p[0] * .95, p[1], 0]);
  A.tube(T1, .06, 0xe05a5a, PM, .95); A.tube(T2, .06, 0xe05a5a, PM, .95);
  A.tube([[-2.47, .02, 0], [-2.5, 0, 0], [-2.47, -.02, 0]], .08, 0xe05a5a, PM, .95);
  for (let i = 0; i < 40; i++) A.add(sp(.1, 8, 6), 0xa01818, rr(-2.3, 2.3), rr(-.3, .3) * Math.sqrt(1 - Math.pow(rr(-2.3, 2.3) / 2.6, 2)), rr(-.1, .1), { op: .7 }, PM);
  const PH = A.part('Hb se bhara andar (nucleus nahi)', 'Parinat RBC ne nucleus, mitochondria, ribosome sab bahar nikaal diye: andar sirf Hb. Isliye ATP sirf glycolysis se; ~ 120 din jeevan aur protein bana nahi sakti.');
  A.add(sp(1, 24, 16), 0xc02020, 0, 0, -.3, { op: .22, s: [2.2, .5, .1] }, PH);
  const PD = A.part('Central pallor (patla hissa)', 'Mikroskop mein beech ka halka bhaag (cell ka ~ 1/3): zyada hone par hypochromic (iron-kami anaemia), na hone par spherocyte.');
  A.add(sp(.12, 10, 8), 0xffffff, 0, 0, .1, { op: 1 }, PD); A.tube([[-.9, .0, .1], [0, .15, .1], [.9, 0, .1]], .03, 0xffffff, PD, .9);
  const PS = A.part('Surface area / volume + diffusion', 'Moti sphere ki jagah patli disc: O2 ko andar kisi bhi Hb tak ~ 1 um se kam doori tay karni. Ek RBC lagbhag ek seconds mein O2 se bhar jata hai.');
  A.flow([[-3.3, 1.3, 0], [-2.0, .8, 0], [-.8, .35, 0]], 0x4ad0ff, 5, .1, .07);
  A.flow([[-3.3, -1.3, 0], [-2.0, -.8, 0], [-.8, -.35, 0]], 0x4ad0ff, 5, .1, .07);
  const PC = A.part('Capillary (squeeze)', 'Capillary RBC (7.8 um) se bhi patla (~ 5 um): RBC lachili hokar "parachute" ki tarah mud jati hai aur wapas disc ban jati hai. Spectrin jaal isse sambhav banata hai.');
  A.add(new T.CylinderGeometry(1.0, 1.0, 3.0, 24, 1, true), 0xd8a0a0, 0, -3.4, 0, { op: .2, r: [0, 0, PI / 2] }, PC);
  A.add(sp(1, 20, 14), 0xe05a5a, 0, -3.4, 0, { op: .8, s: [1.4, .7, .7] }, PC);
  A.lab('Kinaara ~ 2.5 um', [-2.5, .9, 0], '#e05a5a'); A.lab('Beech ~ 1 um', [0, .8, 0], '#ffffff'); A.lab('Diameter ~ 7.8 um', [0, -1.1, 0], '#e05a5a'); A.lab('Hb se bhara, nucleus nahi', [0, .0, 0], '#a01818'); A.lab('O2 andar', [-3.0, 1.7, 0], '#4ad0ff'); A.lab('Capillary mein squeeze', [0, -4.2, 0], '#d8a0a0');
  A.go('Hemoglobin ▸', 'r_hb');
});
})();
/* END OF FILE rbc-detail.js */
