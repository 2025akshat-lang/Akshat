/* PLANT detail views: p_chloro, p_wall, p_vac, p_pd  (Cut ON = aadha kata hua; OFF = poora) */
(() => {
if (typeof registerDetail === 'undefined') throw new Error('04-detail-viewer.js purana hai (registerDetail nahi mila): naya 04-detail-viewer.js upload karo');
const PI = Math.PI, K = CVKit, rr = K.rr, dots = K.dots;

/* ============ CHLOROPLAST ============ */
registerDetail('p_chloro', A => {
  A.ttl('Chloroplast'); A.cam([0, 0, 0, 9, 13, .3, .15]);
  const PO = A.part('Outer membrane', 'Chloroplast ki bahari parat: chhote molecules ke liye porin se khuli. Plant cell mein double membrane (endosymbiosis: cyanobacteria se bana).');
  A.add(sp(1, 36, 24), 0x7fd68a, 0, 0, 0, { op: .13, s: [3.3, 1.9, 1.9], cut: 1 }, PO);
  const PIM = A.part('Inner membrane', 'Andar ki parat: transporters se tay karti hai kya stroma mein jaye. Beech mein intermembrane space.');
  A.add(sp(1, 36, 24), 0x4ab860, 0, 0, 0, { op: .13, s: [3.1, 1.75, 1.75], cut: 1 }, PIM);
  const PS = A.part('Stroma', 'Thylakoid ke bahar ka gada ghol: Calvin cycle (RuBisCO CO2 pakadta hai) yahin hota hai; apna DNA, 70S ribosome aur enzymes bhi.');
  A.add(sp(1, 28, 20), 0xbfeec4, 0, 0, 0, { op: .1, s: [2.95, 1.6, 1.6], cut: 1 }, PS);
  const PG = A.part('Grana (thylakoid ke dher)', 'Sikke jaise chapte thylakoid sacs ke stack (10-100 granum). Membrane mein photosystem II + I, cytochrome b6f aur ATP synthase: light reactions yahin.', 1, 'mit');
  const PT = A.part('Thylakoid lumen aur stroma lamellae', 'Grana ko jodne wali lambi chapti nali (stroma lamellae). Lumen mein H+ jama hota hai: pH ~ 4 vs stroma ~ 8 (proton gradient).');
  [[-1.5, .3, -.3], [-.4, -.4, -.4], [.8, .35, -.3], [1.7, -.25, -.4], [.1, .6, -.8]].forEach((p, gi) => { for (let i = 0; i < 7; i++) A.add(new T.CylinderGeometry(.42, .42, .07, 20), 0x1f9a3c, p[0], p[1] + (i - 3) * .12, p[2], { op: .95, cut: 1 }, PG); });
  for (let i = 0; i < 4; i++) A.tube([[-1.5, .3 + (i - 1.5) * .12, -.3], [-.9, .1, -.35], [-.4, -.4 + (i - 1.5) * .12, -.4]], .045, 0x6adf8a, PT, .85, { cut: 1 });
  A.tube([[-.4, -.4, -.4], [.2, -.1, -.35], [.8, .35, -.3]], .05, 0x6adf8a, PT, .85, { cut: 1 }); A.tube([[.8, .35, -.3], [1.3, .1, -.35], [1.7, -.25, -.4]], .05, 0x6adf8a, PT, .85, { cut: 1 });
  A.tube([[-.4, -.4, -.4], [-.15, .1, -.6], [.1, .6, -.8]], .05, 0x6adf8a, PT, .85, { cut: 1 });
  const PA = A.part('Starch granule', 'Calvin cycle ka bacha sugar G3P stroma mein starch ke dane ki tarah jama hota hai (din mein); raat ko wapas sugar bankar bahar nikalta hai.');
  A.add(sp(.42, 16, 12), 0xf5f0d8, 2.0, .65, -.5, { op: .9, s: [1.1, .8, .8], cut: 1 }, PA);
  const PD = A.part('Chloroplast DNA + 70S ribosomes', 'Gol (circular) DNA aur chhote ribosome: cyanobacteria ki yaad. Kuch proteins yahin banate hain, baki nucleus ke gene se import hote hain.', 1, 'rib');
  A.tube([[-2.2, -.9, -.2], [-2.0, -1.1, -.4], [-1.7, -1.0, -.3], [-1.8, -.7, -.2], [-2.2, -.9, -.2]], .035, 0xffe66a, PD, .95, { cl: true, cut: 1 });
  dots(A, PD, 14, () => K.inSph(1.0, -.1).map((v, i) => i === 0 ? v * 1.5 - 1.0 : i === 1 ? v * .6 - .8 : v), 0xd8a050, .06, .95, 1);
  const PP = A.part('Plastoglobuli (lipid boondein)', 'Thylakoid se jude lipid ke golden dane: vitamin E, plastoquinone aur carotenoid jama rakhte hain.');
  dots(A, PP, 7, () => [rr(-2.2, 2.2), rr(-1.2, 1.2) * .6, -rr(.5, 1.0)], 0xff9a3c, .09, .95, 1);
  const PH = A.part('ATP synthase (thylakoid par)', 'Thylakoid lumen se stroma ki taraf H+ bahte hain, F0-F1 ghoomta hai aur ATP banta hai (photophosphorylation). F1 ka knob stroma mein dikhta hai.');
  dots(A, PH, 12, i => [-1.5 + (i % 6) * .6, (i < 6 ? .55 : -.45), -.2 - (i % 3) * .1], 0xf2d27a, .075, .95, 1);
  A.flow([[-2.8, 2.0, -.1], [-1.4, .9, -.2], [-1.0, .5, -.3]], 0xffee44, 5, .12, .07);
  A.flow([[-.4, -.5, -.4], [.4, -.9, -.4], [1.2, -.9, -.4]], 0x9fe8ff, 5, .1, .045);
  A.lab('Outer membrane', [-2.3, 1.6, 0], '#7fd68a'); A.lab('Inner membrane', [2.7, 1.2, 0], '#4ab860'); A.lab('Granum (thylakoid stack)', [-1.5, 1.05, 0], '#1f9a3c'); A.lab('Stroma lamella', [.8, .95, 0], '#6adf8a'); A.lab('Starch', [2.3, 1.15, 0], '#f5f0d8'); A.lab('Chloroplast DNA', [-2.4, -1.5, 0], '#ffe66a'); A.lab('Plastoglobuli', [.3, -1.55, 0], '#ff9a3c'); A.lab('ATP synthase', [1.6, .15, 0], '#f2d27a'); A.lab('Sunlight', [-2.9, 2.2, 0], '#ffee44'); A.lab('Stroma (Calvin cycle)', [.1, -1.15, 0], '#9fe8ff');
  A.go('Mitochondria (respiration) ▸', 'mit');
});

/* ============ CELL WALL ============ */
registerDetail('p_wall', A => {
  A.ttl('Cell wall'); A.cam([0, 0, 0, 8, 12, .35, .2]);
  const PM = A.part('Middle lamella', 'Do padosi cells ke beech ki "gond" parat: pectin (calcium pectate) se bani; cells ko chipkati hai. Pakte phal mein pectin tootne se phal naram hota hai.');
  A.add(new T.BoxGeometry(.5, 4.0, 3.6), 0xd8b84a, 0, 0, 0, { op: .7, cut: 1 }, PM);
  const PW = A.part('Primary wall', 'Badhte cell ki patli lachili deewar: cellulose microfibrils sab disha mein, hemicellulose (xyloglucan) se jude, pectin ki jel mein. Cell ko phoolne deti hai.');
  [-1, 1].forEach(sd => { A.add(new T.BoxGeometry(.7, 4.0, 3.6), 0xa8c070, sd * .6, 0, 0, { op: .45, cut: 1 }, PW);
    for (let i = 0; i < 14; i++) { const y = -1.8 + i * .28; A.bar([sd * .6 - .3, y, -1.7 + (i % 3) * .1], [sd * .6 + .3, y + (i % 2 ? .3 : -.1), -.1], .035, 0xffffff, PW, .95, { cut: 1 }); } });
  const PS = A.part('Secondary wall (S1, S2, S3)', 'Cell ke badhna band hone par bani mazboot moti parat: 3 layers, har mein cellulose ka alag kon (angle). Lignin se aur sakht (lakdi, xylem). S2 sabse moti.');
  [[1.45, .55, 0x8a6a3c], [1.95, .85, 0x6a4a28], [2.3, .25, 0x8a6a3c]].forEach(L => [-1, 1].forEach(sd => { A.add(new T.BoxGeometry(L[1], 4.0, 3.6), L[2], sd * L[0] + sd * .15, 0, 0, { op: .8, cut: 1 }, PS);
    for (let i = 0; i < 9; i++) { const y = -1.7 + i * .42; A.bar([sd * (L[0] + .15) - .2, y, -1.7], [sd * (L[0] + .15) + .2, y + .3 * (L[1] > .6 ? .4 : 1.5), -.4], .04, 0xf5eac0, PS, .95, { cut: 1 }); } }));
  const PC = A.part('Cellulose microfibrils', 'Har microfibril ~ 36 glucose chains (beta-1,4) ka bundle: steel jitni tensile strength. Plasma membrane ki cellulose synthase rosettes se bante hain.');
  const PH = A.part('Hemicellulose + pectin cross-links', 'Xyloglucan microfibrils ke beech pul banata hai; pectin ka nam gel paani bandhta hai aur calcium se juda rehta hai.');
  for (let i = 0; i < 8; i++) A.bar([-.8, -1.5 + i * .4, -1.2], [-.35, -1.4 + i * .4, -1.2], .02, 0xff9ab8, PH, .95, { cut: 1 });
  const PR = A.part('Cellulose synthase rosette', 'Plasma membrane mein 6-hissa rosette complex: ek saath 18-36 glucan chains banata aur wall mein dhakelta hai. Cortical microtubules iska raasta tay karte hain.');
  for (let i = 0; i < 4; i++) { for (let j = 0; j < 6; j++) A.add(sp(.07, 8, 6), 0xffa040, -2.55 + .0, -1.2 + i * .75 + .13 * Math.cos(j * PI / 3), -.9 + .13 * Math.sin(j * PI / 3) - 0, { op: 1, cut: 1 }, PR); }
  const PN = A.part('Plasma membrane', 'Wall se lagi lipid bilayer: rosettes yahin se wall ko cellulose deti hain.', 1, 'memb');
  A.add(new T.BoxGeometry(.08, 4.0, 3.6), 0x6ab04c, -2.7, 0, 0, { op: .6, cut: 1 }, PN);
  A.add(new T.BoxGeometry(.08, 4.0, 3.6), 0x6ab04c, 2.7, 0, 0, { op: .6, cut: 1 }, PN);
  A.flow([[-3.8, 1.2, -.3], [-3.0, 1.0, -.3], [-2.6, .9, -.3]], 0xffa040, 5, .1, .06);
  A.lab('Middle lamella (pectin)', [0, 2.2, 0], '#d8b84a'); A.lab('Primary wall', [-.6, 1.55, 0], '#a8c070'); A.lab('Secondary wall S1-S3', [-1.9, 2.1, 0], '#8a6a3c'); A.lab('Cellulose microfibril', [.55, -.9, 0], '#ffffff'); A.lab('Hemicellulose link', [-.55, -1.95, 0], '#ff9ab8'); A.lab('Cellulose synthase', [-3.2, .1, 0], '#ffa040'); A.lab('Plasma membrane', [2.7, 2.2, 0], '#6ab04c'); A.lab('Cell A', [-3.9, -2.0, 0], '#cfe8b0'); A.lab('Cell B', [3.9, -2.0, 0], '#cfe8b0');
  A.go('Plasmodesmata (wall mein nali) ▸', 'p_pd');
});

/* ============ VACUOLE ============ */
registerDetail('p_vac', A => {
  A.ttl('Central vacuole'); A.cam([0, 0, 0, 8.5, 12, .3, .15]);
  const PT = A.part('Tonoplast (vacuole membrane)', 'Vacuole ko gherti single membrane: V-ATPase aur H+/ion transporters se vacuole ka pH ~ 5.5 rakhti hai. Selective: paani aquaporin (TIP) se.');
  A.add(sp(1, 36, 24), 0x7ac8f5, 0, 0, 0, { op: .16, s: [2.9, 1.8, 1.8], cut: 1 }, PT);
  const PS = A.part('Cell sap', 'Vacuole ke andar ka paani: ion (K+, Cl-, NO3-), sugar, amino acid, organic acids aur pigments ka ghol. Isi se osmosis aur turgor banta hai.');
  A.add(sp(1, 28, 20), 0xb8e4ff, 0, 0, 0, { op: .1, s: [2.75, 1.65, 1.65], cut: 1 }, PS);
  const PP = A.part('Proton pump (V-ATPase)', 'ATP tod kar H+ vacuole mein bharta hai: ye proton gradient baki transporters ko ion/sugar andar khichne ki shakti deta hai.');
  dots(A, PP, 9, i => [-2.0 + i * .5, 1.45 * Math.sqrt(Math.max(.05, 1 - ((-2.0 + i * .5) / 2.9) ** 2)) * (i % 2 ? -1 : 1), 0], 0xff7a4a, .1, .95, 0);
  const PA = A.part('Aquaporin (TIP)', 'Paani ka nali jaisa channel: osmosis se paani tezi se vacuole mein aata-jata hai. Turgor isi se badalta hai.');
  dots(A, PA, 8, i => [-1.8 + i * .5, 1.35 * Math.sqrt(Math.max(.05, 1 - ((-1.8 + i * .5) / 2.9) ** 2)) * (i % 2 ? 1 : -1), 0], 0x4ad0f0, .09, .95, 0);
  const PY = A.part('Anthocyanin pigment', 'Phool/phal ko laal, nila, baingani rang dene wale paani mein ghulne wale pigments. Parag-karak (pollinators) ko akarshit karte hain; pH se rang badalta hai.');
  dots(A, PY, 14, () => K.inSph(1.4, -.1).map((v, i) => i === 0 ? v * 1.6 : i === 1 ? v * .8 : v), 0xd02a7a, .1, .9, 1);
  const PC = A.part('Calcium oxalate crystal (raphide)', 'Sui jaisi kaante nuki crystal: calcium ko jama rakhte aur janwaron se bachate hain (arbi/jimikand mein khujli ka karan).');
  [[-1.2, -.6], [1.2, .6]].forEach(p => A.add(new T.OctahedronGeometry(.32), 0xfff6c0, p[0], p[1], -.5, { op: .95, s: [.7, 1.8, .7], r: [0, 0, rr(-.4, .4)], cut: 1 }, PC));
  const PR = A.part('Storage proteins aur toxins', 'Seed mein protein storage vacuole; kai paudhon mein alkaloid (nicotine), tannin jaisi cheezein jo shakahari janwaron se bachati hain.');
  dots(A, PR, 10, () => K.inSph(1.3, -.3).map((v, i) => i === 0 ? v * 1.7 : v), 0xc89a4a, .12, .95, 1);
  const PW = A.part('Turgor pressure', 'Vacuole paani se phulta hai aur cytoplasm + membrane ko wall par dabata hai (~ 5-10 atm). Isi se patte, tane sakht rehte hain; paani kam hone par plasmolysis, paudha murjha jata hai.');
  [[0, 2.15, 0], [0, -2.15, 0], [3.35, 0, 0], [-3.35, 0, 0]].forEach((p, i) => A.flow([[p[0] * .75, p[1] * .75, 0], [p[0], p[1], 0], [p[0] * 1.15, p[1] * 1.15, 0]], 0xff5a5a, 3, .1, .07));
  const PWL = A.part('Cell wall (bahar)', 'Pressure ko rokta hai: bina wall ke cell phat jata (jaise animal cell hypotonic ghol mein).', 1, 'p_wall');
  A.add(new T.RingGeometry(3.7, 3.8, 60), 0xa8c070, 0, 0, 0, { op: .9 }, PWL);
  A.lab('Tonoplast', [-2.3, 1.8, 0], '#7ac8f5'); A.lab('Cell sap', [0, 0, 0], '#b8e4ff'); A.lab('V-ATPase', [-1.5, -1.55, 0], '#ff7a4a'); A.lab('Aquaporin', [1.6, 1.55, 0], '#4ad0f0'); A.lab('Anthocyanin', [-.9, .75, 0], '#d02a7a'); A.lab('Raphide crystal', [1.3, -.75, 0], '#fff6c0'); A.lab('Storage protein', [.2, -.95, 0], '#c89a4a'); A.lab('Turgor pressure', [3.4, .55, 0], '#ff5a5a'); A.lab('Cell wall', [-3.5, 2.2, 0], '#a8c070');
  A.go('Cell wall ▸', 'p_wall');
});

/* ============ PLASMODESMATA ============ */
registerDetail('p_pd', A => {
  A.ttl('Plasmodesma'); A.cam([0, 0, 0, 7.5, 11, .3, .15]);
  const PW = A.part('Cell wall + middle lamella', 'Do cells ke beech ki moti deewar: plasmodesma iske aar-paar jati ek chhoti sooksham nali hai (~ 50 nm chaudi).', 1, 'p_wall');
  A.add(new T.BoxGeometry(2.4, 4.4, 3.6), 0xa8c070, 0, 0, 0, { op: .38, cut: 1 }, PW);
  const PC = A.part('Callose collar', 'Nali ke muh par beta-1,3-glucan (callose) ka kasa hua kola: ye kholkar ya band karke (size exclusion limit) tay karta hai kya guzre. Virus ya ghav par callose jama hokar band kar deta hai.');
  [-1.2, 1.2].forEach(x => A.add(tor(.55, .17), 0xffd070, x, 0, 0, { op: .95, r: [0, PI / 2, 0], cut: 1 }, PC));
  const PM = A.part('Plasma membrane (nali ki astar)', 'Dono cells ki plasma membrane nali ke andar ek hi lagatar parat bana leti hai: isliye cytoplasm seedha judta hai.', 1, 'memb');
  A.add(new T.CylinderGeometry(.5, .5, 2.4, 24, 1, true), 0x6ab04c, 0, 0, 0, { op: .4, r: [0, 0, PI / 2], cut: 1 }, PM);
  A.add(new T.BoxGeometry(.08, 4.4, 3.6), 0x6ab04c, -1.25, 0, 0, { op: .35, cut: 1 }, PM); A.add(new T.BoxGeometry(.08, 4.4, 3.6), 0x6ab04c, 1.25, 0, 0, { op: .35, cut: 1 }, PM);
  const PD = A.part('Desmotubule (ER ka patla tube)', 'Nali ke beech mein dabi hui ER membrane ki tight nali: dono cells ke ER ko jodti hai. Iske aur plasma membrane ke beech ka gap hi molecules ka raasta hai.', 1, 'er');
  A.add(new T.CylinderGeometry(.14, .14, 3.6, 16), 0x8a6ab8, 0, 0, 0, { op: .95, r: [0, 0, PI / 2], cut: 1 }, PD);
  const PS = A.part('Cytoplasmic sleeve', 'Desmotubule aur plasma membrane ke beech ka patla cytosol: paani, sugar, amino acid, hormone, chhote RNA (aur ~ 1 kDa se bade protein regulated) isi mein se paas hote hain. Aksar protein ke spokes dikhte hain.');
  for (let i = 0; i < 8; i++) { const a = i * PI / 4; for (let x = -.9; x <= .9; x += .6) A.bar([x, .17 * Math.cos(a), .17 * Math.sin(a)], [x, .45 * Math.cos(a), .45 * Math.sin(a)], .015, 0xffffff, PS, .8); }
  A.flow([[-2.6, 0, 0], [-1.2, .3, 0], [0, .3, 0], [1.2, .3, 0], [2.6, 0, 0]], 0xffee44, 6, .1, .06);
  A.flow([[2.6, -.15, .1], [1.2, -.3, .1], [-1.2, -.3, .1], [-2.6, -.1, .1]], 0x9fe8ff, 4, .08, .05);
  const PV = A.part('Virus + mobile signals', 'Plant virus (TMV) apna movement protein bhejkar nali khol leta hai aur cell se cell fail jata hai; FT protein (phool banane ka signal) bhi isi raste jata hai.');
  dots(A, PV, 4, i => [-2.4 + i * .3, .85, .3], 0xff4a4a, .1, .95, 0);
  A.lab('Cell A cytoplasm', [-2.8, 1.8, 0], '#cfe8b0'); A.lab('Cell B cytoplasm', [2.8, 1.8, 0], '#cfe8b0'); A.lab('Cell wall', [0, 2.4, 0], '#a8c070'); A.lab('Callose collar', [-1.2, -.95, 0], '#ffd070'); A.lab('Desmotubule (ER)', [0, -.5, 0], '#8a6ab8'); A.lab('Cytoplasmic sleeve', [.2, .75, 0], '#ffffff'); A.lab('Sugar/hormone flow', [0, 1.1, 0], '#ffee44'); A.lab('Plasma membrane', [1.25, -1.9, 0], '#6ab04c'); A.lab('Virus (movement)', [-1.8, 1.15, 0], '#ff4a4a');
  A.go('Cell wall ▸', 'p_wall');
});
})();
/* END OF FILE plant-detail.js */
