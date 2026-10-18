/* NEURON detail views (andar ka cross-section + microscopic part), Compare, Tracker, Layers
   Har part par tap -> neuron.js ke part ka 'det' key yahan se khulta hai (registerDetail, 04-detail-viewer.js).
   Keys: n_soma n_dend n_spine n_hill n_axon n_myelin n_node n_syn  (+ nuc, er, golgi, mit, lyso, rib jo core viewer mein hain)
   Cut button (oopar-right) ON = aadha kata hua dikhta hai, OFF = poora. */
(() => {
const PI = Math.PI, COL = 0xb58cff, AXC = 0xc9b2ff, MY = 0xf2e6a0;
const rr = (a, b) => a + (b - a) * rnd();
const dots = (A, P, n, fn, col, r, op, cut) => { const pts = []; for (let i = 0; i < n; i++) pts.push(fn(i)); return A.inst(sp(r, 6, 5), col, pts, P, op == null ? .95 : op, null, cut); };
const inSph = (R, zmax) => { let p; do { p = [rr(-R, R), rr(-R, R), rr(-R, R)]; } while (Math.hypot(p[0], p[1], p[2]) > R || p[2] > (zmax == null ? 0 : zmax)); return p; };

/* ============ SOMA ============ */
registerDetail('n_soma', A => {
  A.ttl('Soma (cell body)'); A.cam([.3, 0, 0, 8.5, 12, .25, .15]);
  const PM = A.part('Plasma membrane (soma)', 'Lipid bilayer jo soma ko gherti hai. Isme Na+/K+ pump aur ion channels hote hain; resting potential ~ -70 mV yahin banta hai. Dendrite se aane wale chhote signal soma par jama (summation) hote hain.');
  A.add(sp(2.2, 40, 30), COL, 0, 0, 0, { op: .2, cut: 1 }, PM);
  A.add(sp(2.15, 30, 22), 0xe4d8ff, 0, 0, 0, { op: .06, cut: 1 }, A.part('Cytoplasm (perikaryon)', 'Soma ka cytoplasm. Neuron ke bade soma mein protein factory (Nissl bodies) bahut zyada hoti hai kyunki axon ko lagatar protein chahiye.'));
  const PN = A.part('Nucleus', 'Bada, gol, halka (euchromatin zyada) nucleus with ek bada nucleolus: neuron ki gene expression bahut active hoti hai. Neuron divide nahi karta (G0).', 1, 'nuc');
  A.add(sp(.95, 32, 24), 0x8a6cf5, -.1, .1, -.2, { op: .3, cut: 1 }, PN); A.add(sp(.9, 28, 20), 0x5b3fc9, -.1, .1, -.2, { op: .45, cut: 1 }, PN);
  A.add(sp(.26, 18, 14), 0x2a1580, .05, .1, -.45, { op: .98, cut: 1 }, PN);
  dots(A, PN, 40, () => { const p = inSph(.8, -.05); return [p[0] - .1, p[1] + .1, p[2] - .2]; }, 0xffc8ff, .035, .95, 1);
  const PE = A.part('Nissl bodies (Rough ER + ribosomes)', 'Rough ER ke dher jin par ribosome lage hain. Neuron mein itne zyada hote hain ki dye karne par neel-baingani dhabbe dikhte hain. Yahin neurotransmitter synthesis wale enzyme aur membrane protein bante hain.', 1, 'er');
  [[-1.3, 1.0, -.6, .6], [-1.5, -.9, -.5, -.4], [.6, 1.45, -.55, .2], [.5, -1.5, -.6, -.3], [1.5, .1, -.9, .1]].forEach(a => { for (let k = 0; k < 4; k++) A.add(sp(1, 16, 10), 0x4aa3e8, a[0], a[1] + k * .1, a[2], { op: .85, s: [.46, .06, .3], r: [0, 0, a[3]], cut: 1 }, PE); });
  dots(A, PE, 50, i => { const c = [[-1.3, 1.0, -.6], [-1.5, -.9, -.5], [.6, 1.45, -.55], [.5, -1.5, -.6], [1.5, .1, -.9]][i % 5]; return [c[0] + rr(-.4, .4), c[1] + rr(-.1, .4), c[2] + rr(-.25, .1)]; }, 0xffe28a, .028, .95, 1);
  const PG = A.part('Golgi apparatus', 'Cisternae ka stack: protein modify, sort aur vesicle mein pack karta hai. Synaptic vesicle ke membrane protein aur dendrite/axon ko jane wale cargo yahin se chalte hain.', 1, 'golgi');
  for (let k = 0; k < 4; k++) A.add(tor(.38 - k * .03, .045, PI), 0xf0a050, 1.0, .85, -.5 - k * .12, { op: .95, r: [0, 0, .5], cut: 1 }, PG);
  const PMI = A.part('Mitochondria', 'Soma aur terminals mein bahut: Na+/K+ ATPase pump neuron ki ~50-70% energy kharch karta hai. Mitochondria axon mein microtubule par chalte rehte hain.', 1, 'mit');
  [[-.9, -.1, -1.4, 1.0], [1.0, -.7, -1.1, -.5], [-.5, -1.45, -.8, .3], [.2, 1.6, -.9, 2]].forEach(a => { A.add(capGeo(.8, .19), 0xf0735f, a[0], a[1], a[2], { op: .7, r: [0, 0, a[3]], cut: 1 }, PMI); A.add(capGeo(.62, .1), 0x9c3328, a[0], a[1], a[2], { op: .95, r: [0, 0, a[3]], cut: 1 }, PMI); });
  const PL = A.part('Lysosomes', 'Purane protein aur organelles ka recycling. Neuron divide nahi karta, isliye kachra jama hone se bimari (jaise Tay-Sachs) ho sakti hai.', 1, 'lyso');
  [[-.4, -.5, -1.7], [1.9, -.5, -.8], [-1.8, .2, -.9]].forEach(a => A.add(sp(.11, 12, 8), 0x66c27a, a[0], a[1], a[2], { op: .95, cut: 1 }, PL));
  dots(A, A.part('Free ribosomes', 'Cytoplasm mein bikhre ribosome: soma ke apne (cytosolic) protein banate hain.', 1, 'rib'), 70, () => inSph(2.0, -.05), 0xffe28a, .03, .95, 1);
  const PC = A.part('Cytoskeleton (microtubules + neurofilaments)', 'Soma se dendrite aur axon tak jati patri patri tracks. Microtubule par kinesin/dynein cargo dhote hain; neurofilament axon ko mazboot rakhte hain.');
  [[-.6, -.7], [-.3, -.3], [0, .2], [.3, .6], [.6, -.5], [.2, -.1]].forEach(a => A.tube([[-1.9, a[0] * 1.5, a[1] * .5 - .3], [-.2, a[0], -.9 + a[1] * .3], [2.1, a[0] * .1, -.1 + a[1] * .05], [3.2, 0, -.05]], .03, a[0] < 0 ? 0x4de0d0 : 0xffffff, PC, .85, { cut: 1 }));
  const PH = A.part('Axon hillock', 'Soma ka patla hota hua nikas jahan se axon shuru hota hai. Sabse zyada voltage-gated Na+ channels yahin hote hain, isliye action potential yahin trigger hota hai.', 1, 'n_hill');
  A.add(new T.CylinderGeometry(.14, .75, 1.1, 20, 1, true), 0xff8fb0, 2.55, 0, 0, { op: .55, r: [0, 0, -PI / 2], cut: 1 }, PH);
  A.tube([[3.0, 0, 0], [3.6, 0, 0], [4.2, 0, 0]], .13, AXC, PH, .9, { cut: 1 });
  const PD = A.part('Dendrite ki jadein', 'Soma se nikalte dendrites ka shuruaati hissa. Dendrite ka cytoplasm soma se continuous hai, ribosome aur ER bhi andar tak jate hain.', 1, 'n_dend');
  [[[-2.0, .9, -.1], [-2.7, 1.4, -.1], [-3.4, 2.1, -.1]], [[-2.1, -.5, -.1], [-2.9, -.7, -.1], [-3.7, -1.3, -.1]], [[-1.5, 1.6, -.1], [-1.8, 2.4, -.1], [-2.4, 3.1, -.1]]].forEach(p => A.tube(p, .24, COL, PD, .9));
  A.flow([[-1.5, 1.2, -.4], [-.6, .4, -.5], [.6, .1, -.5], [2.0, 0, -.1], [3.6, 0, 0]], 0xffe04a, 6, .09, .05);
  A.lab('Nucleus', [-.1, 1.2, -.2]); A.lab('Nucleolus', [.05, -.35, -.45], '#6a5ab8'); A.lab('Nissl bodies (RER)', [-1.5, 1.7, -.6], '#4aa3e8'); A.lab('Golgi', [1.0, 1.55, -.5], '#f0a050'); A.lab('Mitochondrion', [-.9, -.75, -1.4], '#f0735f'); A.lab('Axon hillock', [2.6, .95, 0], '#ff8fb0'); A.lab('Dendrite', [-3.2, 2.5, 0], '#b58cff'); A.lab('Signal soma se axon', [1.6, -1.0, -.1], '#ffe04a');
  A.go('Nucleus tak zoom ▸', 'nuc');
});

/* ============ DENDRITE ============ */
registerDetail('n_dend', A => {
  A.ttl('Dendrite'); A.cam([.4, .5, 0, 9, 13, .2, .12]);
  const PM = A.part('Dendritic membrane', 'Dendrite ki membrane par neurotransmitter-gated receptors aur kuch voltage-gated channels. Yahan chhote graded potentials (EPSP/IPSP) bante hain jo soma tak decay hokar pahunchte hain.');
  A.add(new T.CylinderGeometry(.75, .75, 5.2, 28, 1, true), COL, .8, 0, 0, { op: .25, r: [0, 0, PI / 2], cut: 1 }, PM);
  A.tube([[3.4, 0, 0], [4.0, .5, 0], [4.7, 1.2, 0]], .45, COL, PM, .4, { cut: 1 });
  const PT = A.part('Microtubules', 'Hollow tubulin nalis (25 nm). Dendrite mein unki polarity mixed hoti hai (axon mein sab plus-end bahar). Yahin se mitochondria aur receptor vesicles dhote hain.');
  for (let j = 0; j < 7; j++) { const y = rr(-.5, .5), z = -rr(.05, .55); A.tube([[-1.8, y, z], [.8, y + .03, z], [3.4, y, z]], .035, 0x4de0d0, PT, .9, { cut: 1 }); }
  const PF = A.part('Neurofilaments', 'Intermediate filaments (10 nm): dendrite ko mazboot rakhte hain. Dendrite mein axon se kam hote hain.');
  for (let j = 0; j < 8; j++) { const y = rr(-.55, .55), z = -rr(.05, .6); A.tube([[-1.8, y, z], [.8, y - .02, z], [3.4, y, z]], .016, 0xffffff, PF, .9, { cut: 1 }); }
  const PMi = A.part('Mitochondrion', 'Lambi mitochondria dendrite mein ATP dete hain, khaaskar synapse ke paas.', 1, 'mit');
  A.add(capGeo(1.1, .2), 0xf0735f, .2, -.15, -.25, { op: .8, r: [0, 0, PI / 2], cut: 1 }, PMi); A.add(capGeo(.9, .1), 0x9c3328, .2, -.15, -.25, { op: .95, r: [0, 0, PI / 2], cut: 1 }, PMi);
  A.add(capGeo(.8, .17), 0xf0735f, 2.3, .2, -.3, { op: .8, r: [0, 0, PI / 2], cut: 1 }, PMi);
  const PE = A.part('Smooth ER + polyribosomes', 'Dendrite mein smooth ER (Ca2+ store) aur polyribosome hote hain: yahin local protein synthesis hoti hai jab synapse active hota hai (synaptic plasticity).', 1, 'er');
  A.tube([[-1.6, -.4, -.3], [-.4, -.1, -.4], [.8, -.4, -.35], [2.0, .0, -.4], [3.2, -.3, -.3]], .06, 0xe0b060, PE, .85, { cut: 1 });
  dots(A, PE, 24, i => [rr(1.0, 3.2), rr(-.5, .1), -rr(.2, .5)], 0xffe28a, .03, .95, 1);
  const PS = A.part('Dendritic spines', 'Chhote kante jaise ubhaar (head + neck). Har spine par ek excitatory synapse. Seekhne par spines ka aakar aur sankhya badalti hai. Tap karke aur andar dekho.', 1, 'n_spine');
  [-.8, .4, 1.6, 2.8].forEach((x, i) => { A.add(new T.CylinderGeometry(.06, .09, .55, 8), 0xd9c6ff, x, .95, 0, { op: .95 }, PS); A.add(sp(.2 + (i % 2) * .05, 14, 10), 0xd9c6ff, x, 1.35, 0, { op: .95 }, PS); A.add(new T.CylinderGeometry(.14, .14, .04, 12), 0x7a1a3a, x, 1.54 + (i % 2) * .05, 0, { op: .95 }, PS); });
  A.flow([[3.2, .3, -.1], [.8, .1, -.15], [-1.6, 0, -.1]], 0xffe04a, 6, .1, .05);
  // cross-section disc (kata hua tukda, seedha saamne se)
  const PX = A.part('Cross-section (kata hua tukda)', 'Dendrite ko lambai mein kaatkar seedha dekhne par: bahari membrane, andar microtubules (cyan), neurofilaments (safed), mitochondrion aur ER.');
  A.add(new T.CircleGeometry(.8, 40), 0xe4d8ff, -3.6, 0, 0, { op: .35 }, PX);
  A.add(new T.RingGeometry(.76, .85, 40), COL, -3.6, 0, .01, { op: .95 }, PX);
  dots(A, PX, 14, () => { const a = rr(0, 6.28), r = Math.sqrt(rnd()) * .6; return [-3.6 + Math.cos(a) * r, Math.sin(a) * r, .03]; }, 0x4de0d0, .05, .95);
  dots(A, PX, 22, () => { const a = rr(0, 6.28), r = Math.sqrt(rnd()) * .68; return [-3.6 + Math.cos(a) * r, Math.sin(a) * r, .03]; }, 0xffffff, .025, .95);
  A.add(sp(.16, 14, 10), 0xf0735f, -3.4, -.25, .04, { op: .95, s: [1.3, .8, .3] }, PX);
  A.lab('Cross-section', [-3.6, 1.15, 0], '#e4d8ff'); A.lab('Microtubules', [-.3, -.95, 0], '#4de0d0'); A.lab('Neurofilaments', [1.5, -.95, 0], '#ffffff'); A.lab('Spine', [1.6, 2.0, 0], '#d9c6ff'); A.lab('Mitochondrion', [.2, .55, 0], '#f0735f'); A.lab('Branch point', [4.5, 1.9, 0]); A.lab('Signal soma ki taraf', [-1.2, .75, 0], '#ffe04a');
  A.go('Spine tak zoom ▸', 'n_spine');
});

/* ============ DENDRITIC SPINE + POSTSYNAPTIC SIDE ============ */
registerDetail('n_spine', A => {
  A.ttl('Dendritic spine + synapse'); A.cam([0, .6, 0, 9.5, 13, .25, .1]);
  const PD = A.part('Dendrite shaft', 'Neeche dendrite ka mota hissa jisse spine nikalta hai.', 1, 'n_dend');
  A.add(new T.CylinderGeometry(1.3, 1.3, 6, 28, 1, true), COL, 0, -2.8, 0, { op: .25, r: [0, 0, PI / 2], cut: 1 }, PD);
  const PN = A.part('Spine neck', 'Patli gardan (~0.1-0.2 um). Ye Ca2+ aur signalling molecules ko spine head mein hi rokta hai, taaki har synapse alag-alag seekh sake (compartmentalisation).');
  A.add(new T.CylinderGeometry(.24, .3, 1.5, 14, 1, true), COL, 0, -1.15, 0, { op: .3, cut: 1 }, PN);
  const PH = A.part('Spine head', 'Gol sira (~0.5-1 um) jisme postsynaptic density hoti hai. Mushroom spines purane aur mazboot synapse hain; thin spines naye aur lachile.');
  A.add(sp(1, 28, 20), COL, 0, .55, 0, { op: .28, s: [1.2, .95, 1], cut: 1 }, PH);
  const PP = A.part('Postsynaptic density (PSD)', 'Head ke upar ka ghana protein jaal: PSD-95, Homer, Shank scaffold + CaMKII. Receptors ko sahi jagah par pakad kar rakhta hai aur signal andar bhejta hai.');
  A.add(new T.CylinderGeometry(.8, .8, .14, 28), 0x7a1a3a, 0, 1.35, 0, { op: .95, cut: 1 }, PP);
  dots(A, PP, 12, () => [rr(-.7, .7), 1.2, -rr(0, .6)], 0xb04060, .07, .95, 1);
  const PR = A.part('Glutamate receptors (AMPA, NMDA)', 'AMPA (sunehri): glutamate aate hi Na+ andar, tez EPSP. NMDA (neela): Mg2+ se blocked; sirf glutamate + depolarisation par khulta hai, Ca2+ andar: LTP (seekhne) ka trigger. Lekin sabse zyada receptor PSD par hi hote hain.');
  A.inst(new T.CylinderGeometry(.06, .06, .22, 8), 0xffc030, [...Array(9)].map((_, i) => [-.7 + i * .17, 1.52, -rr(0, .5)]), PR, .95, null, 1);
  A.inst(new T.CylinderGeometry(.09, .09, .28, 8), 0x4a90ff, [...Array(4)].map((_, i) => [-.45 + i * .3, 1.55, -rr(0, .5)]), PR, .95, null, 1);
  const PA = A.part('Actin filaments (cytoskeleton)', 'Spine ke andar actin ki jaal: spine ka aakar badalti hai (LTP mein bada, LTD mein sikud jata hai). Spine mein microtubule nahi, actin hota hai.');
  for (let k = 0; k < 6; k++) A.tube([[rr(-.5, .5), .1, -rr(.1, .5)], [rr(-.5, .5), .6, -rr(.1, .5)], [rr(-.6, .6), 1.1, -rr(.1, .5)]], .022, 0xffffff, PA, .9, { cut: 1 });
  const PS = A.part('Spine apparatus (ER)', 'Smooth ER ke chapte sacs: Ca2+ store karta hai aur local protein/lipid processing karta hai. Sabhi spines mein nahi, sirf bade spines mein.', 1, 'er');
  for (let k = 0; k < 3; k++) A.add(sp(1, 14, 8), 0x4aa3e8, 0, -.25 + k * .13, -.2, { op: .9, s: [.28, .05, .2], cut: 1 }, PS);
  const PRB = A.part('Polyribosome', 'Spine ke paas mRNA par ribosome ka jhund: activity hone par yahin turant naye protein bante hain.', 1, 'rib');
  dots(A, PRB, 7, i => [-.35 + (i % 4) * .1, -.75 + Math.floor(i / 4) * .08, -.15], 0xffe28a, .045, .95, 1);
  const PCA = A.part('Ca2+ (calcium) aana', 'NMDA receptor se Ca2+ andar aane par CaMKII chalu hota hai: naye AMPA receptor jodna aur spine bada karna = Long-Term Potentiation (yaaddasht ka cellular aadhar).');
  A.flow([[0, 1.5, -.2], [0, 1.0, -.25], [0, .4, -.25], [0, -.2, -.2]], 0xffee00, 5, .1, .05);
  const PB = A.part('Presynaptic terminal (upar)', 'Upar wale neuron ka axon terminal: vesicles mein glutamate. Aur andar ke liye tap karo.', 1, 'n_syn');
  A.add(sp(1.6, 28, 20), 0xff7aa8, 0, 3.4, 0, { op: .3, s: [1.25, 1, 1], cut: 1 }, PB);
  A.inst(sp(.11, 10, 8), 0x7fe8ff, [...Array(16)].map(() => { const p = inSph(1.1, -.05); return [p[0] * 1.2, 3.4 + p[1] * .8 + .3, p[2]]; }), PB, .95, null, 1);
  const PCL = A.part('Synaptic cleft (~20 nm)', 'Dono neurons ke beech ki patli khaai (20-30 nm). Glutamate isse diffuse hokar ~0.1 ms mein receptors tak pahunchta hai. Adhesion proteins (neurexin-neuroligin) dono taraf ko jodte hain.');
  A.add(new T.CylinderGeometry(.8, .8, .16, 28, 1, true), 0xffe14d, 0, 1.62, 0, { op: .12, cut: 1 }, PCL);
  A.flow([[.2, 2.5, -.2], [.2, 2.0, -.2], [.2, 1.62, -.2], [.2, 1.55, -.2]], 0xffe14d, 5, .12, .05);
  A.lab('Presynaptic terminal', [-2.3, 3.5, 0], '#ff7aa8'); A.lab('Vesicles (glutamate)', [2.5, 3.9, 0], '#7fe8ff'); A.lab('Synaptic cleft', [2.3, 1.7, 0], '#ffe14d'); A.lab('PSD', [-1.6, 1.3, 0], '#b04060'); A.lab('AMPA / NMDA', [1.9, 1.35, 0], '#ffc030'); A.lab('Spine head', [-1.7, .2, 0]); A.lab('Spine neck', [1.0, -1.2, 0]); A.lab('Actin', [1.5, .5, 0], '#ffffff'); A.lab('Spine apparatus', [-1.6, -.4, 0], '#4aa3e8'); A.lab('Ca2+ andar', [.9, .7, 0], '#ffee00');
  A.go('Presynaptic side dekho ▸', 'n_syn');
});

/* ============ AXON HILLOCK ============ */
registerDetail('n_hill', A => {
  A.ttl('Axon hillock'); A.cam([.3, 0, 0, 8, 11, .2, .12]);
  const PM = A.part('Hillock membrane', 'Soma se axon tak patla hota cone. Is membrane par voltage-gated Na+ channels ki ghanata soma se ~50 guna zyada hoti hai, isliye threshold (~ -55 mV) yahin sabse pehle cross hota hai.');
  A.add(new T.CylinderGeometry(.2, 1.5, 3.2, 28, 1, true), 0xff8fb0, 0, 0, 0, { op: .3, r: [0, 0, -PI / 2], cut: 1 }, PM);
  const PS = A.part('Axon initial segment (AIS)', 'Hillock ke turant baad ka ~20-60 um hissa. Ankyrin-G aur spectrin ka jaal Na+ channels ko yahin jakda rakhta hai aur ek "sorting filter" ki tarah axon aur soma ke protein alag rakhta hai. Action potential yahin paida hota hai.', 1, 'n_axon');
  A.tube([[1.7, 0, 0], [2.6, 0, 0], [3.8, 0, 0]], .22, AXC, PS, .5, { cut: 1 });
  const PN = A.part('Voltage-gated Na+ channels', 'Threshold par ek saath khulte hain: Na+ andar bhagta hai, voltage aur badhta hai (positive feedback) = action potential ka upstroke. Fir inactivate ho jate hain, K+ channels repolarize karte hain.');
  A.inst(sp(.06, 8, 6), 0x66ffcc, [...Array(60)].map(() => { const x = rr(-.2, 2.5), R = x < 1.6 ? 1.5 - (x + 1.6) / 3.2 * 1.3 : .22; const a = rr(PI, 2 * PI); return [x, Math.sin(a) * R * .95, -Math.abs(Math.cos(a)) * R * .95]; }), PN, .95, null, 1);
  const PI2 = A.part('Dendrite + soma ka signal jama hona', 'Saare EPSP/IPSP soma par jama (spatial + temporal summation). Agar net depolarisation threshold tak pahunche, hillock par spike banta hai: "all-or-none".');
  A.flow([[-1.5, .6, -.2], [-.6, .3, -.2], [.3, .1, -.15], [1.5, 0, -.1]], 0xffe04a, 6, .09, .05);
  const PT = A.part('Microtubule bundles', 'Hillock par microtubules ek taraf (plus-end axon ki taraf) sync ho jate hain: axonal transport ke highway ki shuruaat.');
  [-.4, -.1, .2].forEach(y => A.tube([[-1.4, y * 3, -.2], [0, y, -.2], [2.2, y * .3, -.1], [3.6, 0, -.05]], .03, 0x4de0d0, PT, .9, { cut: 1 }));
  A.lab('Axon hillock', [-.2, 1.7, 0], '#ff8fb0'); A.lab('Initial segment', [2.8, .6, 0], '#c9b2ff'); A.lab('Na+ channels', [.9, -1.0, 0], '#66ffcc'); A.lab('Soma', [-1.4, 1.1, 0]); A.lab('Spike yahin shuru', [.6, .1, 0], '#ffe04a');
  A.go('Axon mein andar ▸', 'n_axon');
});

/* ============ AXON ============ */
registerDetail('n_axon', A => {
  A.ttl('Axon'); A.cam([.4, 0, 0, 9, 13, .22, .12]);
  const PM = A.part('Axolemma (axon ki membrane)', 'Axon ki plasma membrane. Na+/K+ channels yahan nodes of Ranvier par jama hote hain; baaki jagah myelin dhaka rehta hai. Resting potential Na+/K+ ATPase pump se bana rehta hai.');
  A.add(new T.CylinderGeometry(.75, .75, 5.4, 28, 1, true), AXC, .7, 0, 0, { op: .28, r: [0, 0, PI / 2], cut: 1 }, PM);
  const PT = A.part('Microtubules', 'Axon mein sab microtubules ki polarity ek jaisi: plus-end terminal ki taraf. Kinesin plus-end ki taraf (anterograde) aur dynein minus-end ki taraf (retrograde) cargo dhote hain.');
  for (let j = 0; j < 7; j++) { const y = rr(-.5, .5), z = -rr(.05, .55); A.tube([[-2.0, y, z], [.7, y + .02, z], [3.4, y, z]], .04, 0x4de0d0, PT, .9, { cut: 1 }); }
  const PF = A.part('Neurofilaments', 'Intermediate filaments (NF-L/M/H): axon ka diameter aur strength tay karte hain. Axon mein bahut zyada hote hain, ye hi axon ko "mota" banate hain.');
  for (let j = 0; j < 14; j++) { const y = rr(-.6, .6), z = -rr(.05, .6); A.tube([[-2.0, y, z], [.7, y - .02, z], [3.4, y, z]], .017, 0xffffff, PF, .9, { cut: 1 }); }
  const PV = A.part('Vesicle: kinesin ke saath (anterograde)', 'Kinesin motor microtubule par "chalta" hai (ATP se, ~1 um/s fast transport): synaptic vesicle precursors, mitochondria aur membrane protein terminal ki taraf jate hain.');
  A.add(sp(.15, 12, 8), 0x7fe8ff, 0, 0, -.2, { op: .95 }, PV); A.add(sp(.15, 12, 8), 0xffb300, 1.6, .1, -.3, { op: .95 }, PV);
  A.flow([[-1.9, -.1, -.25], [.8, 0, -.3], [3.3, -.1, -.25]], 0x7fe8ff, 5, .07, .09);
  const PR = A.part('Retrograde transport (dynein)', 'Dynein motor purane protein, signals (jaise NGF) aur kachra terminal se soma ki taraf lata hai. Rabies aur polio virus is route se hi neuron mein chadhte hain.');
  A.flow([[3.3, .2, -.35], [.8, .25, -.4], [-1.9, .2, -.35]], 0xff9a6a, 4, .05, .08);
  const PMi = A.part('Mitochondria', 'Axon mein jagah-jagah ATP ke liye mitochondria, khaaskar nodes aur terminals ke paas.', 1, 'mit');
  A.add(capGeo(.9, .17), 0xf0735f, 2.2, -.3, -.35, { op: .8, r: [0, 0, PI / 2], cut: 1 }, PMi); A.add(capGeo(.7, .09), 0x9c3328, 2.2, -.3, -.35, { op: .95, r: [0, 0, PI / 2], cut: 1 }, PMi);
  const PX = A.part('Cross-section (kata hua tukda)', 'Axon ko kaatkar saamne se: bahar axolemma, andar microtubules (cyan, kam), neurofilaments (safed, bahut zyada) aur ek mitochondrion.');
  A.add(new T.CircleGeometry(.85, 40), 0xe4d8ff, -3.7, 0, 0, { op: .35 }, PX); A.add(new T.RingGeometry(.8, .9, 40), AXC, -3.7, 0, .01, { op: .95 }, PX);
  dots(A, PX, 8, () => { const a = rr(0, 6.28), r = Math.sqrt(rnd()) * .6; return [-3.7 + Math.cos(a) * r, Math.sin(a) * r, .03]; }, 0x4de0d0, .06, .95);
  dots(A, PX, 40, () => { const a = rr(0, 6.28), r = Math.sqrt(rnd()) * .72; return [-3.7 + Math.cos(a) * r, Math.sin(a) * r, .03]; }, 0xffffff, .03, .95);
  A.add(sp(.17, 14, 10), 0xf0735f, -3.5, -.3, .04, { op: .95, s: [1.3, .8, .3] }, PX);
  A.lab('Cross-section', [-3.7, 1.25, 0], '#e4d8ff'); A.lab('Axolemma', [-3.7, -1.2, 0], '#c9b2ff'); A.lab('Microtubules', [-.6, .95, 0], '#4de0d0'); A.lab('Neurofilaments', [1.8, .95, 0], '#ffffff'); A.lab('Kinesin cargo ▸', [1.6, -.75, 0], '#7fe8ff'); A.lab('Dynein cargo ◂', [.2, 1.45, 0], '#ff9a6a'); A.lab('Mitochondrion', [2.2, -1.0, 0], '#f0735f');
  A.go('Myelin sheath ▸', 'n_myelin');
});

/* ============ MYELIN SHEATH ============ */
registerDetail('n_myelin', A => {
  A.ttl('Myelin sheath + Schwann cell'); A.cam([0, 0, 0, 8.5, 12, .25, .12]);
  const PAX = A.part('Axon (andar)', 'Andar ka axon: myelin ke andar sab kuch pehle jaisa (microtubules, neurofilaments).', 1, 'n_axon');
  A.add(new T.CylinderGeometry(.42, .42, 6, 24, 1, true), AXC, 0, 0, 0, { op: .55, r: [0, 0, PI / 2], cut: 1 }, PAX);
  const PM = A.part('Myelin lamellae (lipid layers)', 'Schwann cell ki membrane axon par 50-100 baar lipti hui: ~80% lipid, ~20% protein (MBP, PLP/P0). Ek achha electrical insulator: membrane capacitance kam, ion leak nahi, isliye signal tez aur kam energy mein chalta hai.');
  [.55, .68, .8, .92, 1.04].forEach((R, i) => A.add(new T.CylinderGeometry(R, R, 4.6, 32, 1, true), i % 2 ? 0xe0c070 : MY, -.2, 0, 0, { op: .38, r: [0, 0, PI / 2], cut: 1 }, PM));
  const PS = A.part('Schwann cell nucleus + cytoplasm', 'PNS mein ek Schwann cell axon ke ek segment (internode, ~0.2-1.5 mm) ko dhakti hai. Nucleus aur cytoplasm bahar ki taraf dhakel diye jate hain. (CNS mein ye kaam oligodendrocyte karta hai: ek cell kai axons.)');
  A.add(sp(.3, 14, 10), 0xb88a5c, -.2, 1.15, -.1, { op: .95, s: [1.8, .6, 1] }, PS);
  A.add(new T.CylinderGeometry(1.12, 1.12, 4.6, 32, 1, true), 0xb88a5c, -.2, 0, 0, { op: .14, r: [0, 0, PI / 2], cut: 1 }, PS);
  const PN = A.part('Paranodal loops', 'Internode ke dono sire par myelin ki layers khulkar loops banti hain jo axon se jud jati hain (septate-like junction): Na+ aur K+ channels ko alag-alag rakhne wali "seal".');
  [-2.6, 2.2].forEach(x => { for (let k = 0; k < 4; k++) A.add(tor(.55 + k * .12, .04, PI * 2), 0xe0c070, x + (x < 0 ? .3 : -.3) * (k * .3), 0, 0, { op: .8, r: [0, PI / 2, 0], cut: 1 }, PN); });
  const PX = A.part('Cross-section: concentric layers', 'Electron microscope mein myelin gol-gol lapete hue ring jaisa dikhta hai: ghani (major dense line) aur halki (intraperiod) lines baari-baari. Axon bilkul beech mein.');
  A.add(new T.CircleGeometry(.4, 32), AXC, -4.2, 0, 0, { op: .9 }, PX);
  for (let k = 0; k < 9; k++) A.add(new T.RingGeometry(.45 + k * .1, .45 + k * .1 + .05, 40), k % 2 ? 0xe0c070 : MY, -4.2, 0, .01, { op: .95 }, PX);
  A.add(new T.RingGeometry(1.35, 1.45, 40), 0xb88a5c, -4.2, 0, .02, { op: .8 }, PX); A.add(sp(.17, 12, 8), 0xb88a5c, -4.2, 1.3, .03, { op: .95, s: [1.3, .7, .3] }, PX);
  A.flow([[-2.4, 0, -.2], [-1.4, 0, -.2], [-.4, 0, -.2], [1.2, 0, -.2], [2.8, 0, -.2]], 0xffe04a, 4, .25, .05);
  A.lab('Axon', [-.2, -.2, 0], '#c9b2ff'); A.lab('Myelin layers', [-.2, -1.45, 0], '#e0c070'); A.lab('Schwann cell nucleus', [-.2, 1.65, 0], '#b88a5c'); A.lab('Paranodal loops', [2.5, 1.0, 0], '#e0c070'); A.lab('Cross-section', [-4.2, 1.9, 0], '#e4d8ff'); A.lab('Signal ek node se doosre par kudta hai', [.4, .5, 0], '#ffe04a');
  A.go('Node of Ranvier ▸', 'n_node');
});

/* ============ NODE OF RANVIER ============ */
registerDetail('n_node', A => {
  A.ttl('Node of Ranvier'); A.cam([0, 0, 0, 8, 11, .2, .12]);
  const PA = A.part('Axon (node par khula)', 'Node par axolemma seedhe bahar ke fluid ke sampark mein hai (myelin ke bina, ~1 um gap).');
  A.add(new T.CylinderGeometry(.5, .5, 7.5, 24, 1, true), AXC, 0, 0, 0, { op: .3, r: [0, 0, PI / 2], cut: 1 }, PA);
  const PM = A.part('Myelin (do internodes)', 'Dono taraf ka myelin insulator. Beech ka ~1 um khula hissa node hai.');
  [-2.3, 2.3].forEach(x => A.add(new T.CylinderGeometry(.9, .9, 3.0, 28, 1, true), MY, x, 0, 0, { op: .4, r: [0, 0, PI / 2], cut: 1 }, PM));
  const PN = A.part('Na+ channels (node par ghane)', 'Node par ~1000-2000 Na+ channels per um2 (internode par lagbhag koi nahi). Signal yahan "recharge" hota hai: AP dobara poori amplitude tak. Isi se saltatory conduction: 1 node se agle par kudna, 100+ m/s.');
  A.inst(sp(.07, 8, 6), 0x66ffcc, [...Array(40)].map(() => { const a = rr(PI, 2 * PI); return [rr(-.35, .35), Math.sin(a) * .5, -Math.abs(Math.cos(a)) * .5]; }), PN, .95, null, 1);
  const PK = A.part('K+ channels (juxtaparanode)', 'Node ke dono taraf myelin ke neeche ke K+ channels (Kv1.1/1.2) AP ko khatam karne mein madad karte hain aur "slow" conduction rokte hain. Myelin kharab hone par ye khul jate hain aur signal ruk jata hai.');
  A.inst(sp(.07, 8, 6), 0xff6a8a, [...Array(24)].map(() => { const a = rr(PI, 2 * PI), s = rnd() < .5 ? -1 : 1; return [s * rr(.8, 1.4), Math.sin(a) * .5, -Math.abs(Math.cos(a)) * .5]; }), PK, .95, null, 1);
  const PR = A.part('Node ring (Nav + ankyrin-G)', 'Node par ankyrin-G aur spectrin ka ring jaal Na+ channels ko pakad ke rakhta hai. Schwann cell ki microvilli node ko dhakti hain.');
  A.add(tor(.52, .07, PI * 2), 0xff9a3c, 0, 0, 0, { op: .95, r: [0, PI / 2, 0], cut: 1 }, PR);
  const PS = A.part('Action potential (saltatory)', 'Voltage change ek node se agle node par ~1-2 mm kud kar pahunchta hai: myelin ke neeche current passive (electrotonic) bahta hai, sirf nodes par regenerate hota hai.');
  A.flow([[-3.2, 0, -.2], [-1.6, 0, -.2], [0, 0, -.2], [1.6, 0, -.2], [3.2, 0, -.2]], 0xffe04a, 3, .3, .08);
  const PP = A.part('Paranodal loops', 'Myelin ke sire ke loops axon se jude hue: Na+ aur K+ ko alag rakhne wali seal.');
  [-.95, .95].forEach(x => { for (let k = 0; k < 3; k++) A.add(tor(.55 + k * .08, .035, PI * 2), 0xe0c070, x + (x < 0 ? -.1 : .1) * k, 0, 0, { op: .8, r: [0, PI / 2, 0], cut: 1 }, PP); });
  A.lab('Node of Ranvier', [0, 1.25, 0], '#ff9a3c'); A.lab('Na+ channels', [0, -.95, 0], '#66ffcc'); A.lab('K+ channels', [-1.7, -.95, 0], '#ff6a8a'); A.lab('Myelin', [-2.6, 1.3, 0], '#f2e6a0'); A.lab('Myelin', [2.6, 1.3, 0], '#f2e6a0'); A.lab('Saltatory conduction', [0, .6, 0], '#ffe04a'); A.lab('Paranode', [1.3, 1.0, 0], '#e0c070');
  A.go('Axon terminal / synapse ▸', 'n_syn');
});

/* ============ AXON TERMINAL / PRESYNAPTIC ============ */
registerDetail('n_syn', A => {
  A.ttl('Axon terminal + synapse'); A.cam([0, .3, 0, 9, 12.5, .25, .1]);
  const PB = A.part('Synaptic bouton (presynaptic membrane)', 'Axon ka phoola hua sira. Active zone par vesicles docked hote hain aur voltage-gated Ca2+ channels ghane hote hain.');
  A.add(sp(1.7, 32, 24), 0xff7aa8, 0, 1.75, 0, { op: .27, s: [1.4, 1, 1], cut: 1 }, PB);
  A.tube([[-3.4, 2.7, 0], [-2.6, 2.2, 0], [-1.9, 1.9, 0]], .35, AXC, PB, .5);
  const PV = A.part('Synaptic vesicles (~40 nm)', 'Har vesicle mein hazaron neurotransmitter molecules. Teen pools: docked (release ke liye tayyar), readily releasable aur reserve (synapsin se actin se bandha). Sabse bhare bouton mein 100-200 vesicles.');
  A.inst(sp(.12, 10, 8), 0x7fe8ff, [...Array(30)].map(() => { const p = inSph(1.4, -.05); return [p[0] * 1.2, 1.9 + p[1] * .9, p[2]]; }), PV, .95, null, 1);
  const PD = A.part('Docked vesicles + SNARE proteins', 'Active zone par: vesicle ka synaptobrevin (v-SNARE) + membrane ka syntaxin/SNAP-25 (t-SNARE) coil banakar vesicle ko membrane se milate hain; synaptotagmin Ca2+ sense karta hai. Botulinum toxin SNAREs ko kaat deta hai: lakwa.');
  A.inst(sp(.14, 10, 8), 0x7fe8ff, [-.9, -.5, -.1, .3, .7].map((x, i) => [x, .5 + (i % 2) * .05, -.05 - i * .04]), PD, .95, null, 1);
  A.inst(new T.CylinderGeometry(.02, .02, .22, 5), 0xffffff, [-.9, -.5, -.1, .3, .7].map((x, i) => [x, .32, -.05 - i * .04]), PD, .95, null, 1);
  const PCa = A.part('Voltage-gated Ca2+ channels (Cav2)', 'Action potential pahunchte hi khulte hain: Ca2+ andar bhagta hai (~100 um se pehle 100 nM tha, ab 10-100 uM) jisse vesicle fusion trigger hota hai (~0.2 ms mein). Release Ca2+ par bahut steeply depend karta hai.');
  A.inst(new T.CylinderGeometry(.07, .07, .2, 8), 0xffd36a, [-1.1, -.7, -.3, .1, .5, .9].map((x, i) => [x, .46, -.05 - (i % 3) * .1]), PCa, .95, null, 1);
  A.flow([[-.5, .15, -.2], [-.5, .75, -.2], [-.5, 1.3, -.2]], 0xffee00, 4, .12, .05);
  const PM = A.part('Mitochondria (terminal)', 'Terminal ko ATP (vesicle refill, pumps) aur Ca2+ buffering ke liye mitochondria. Kam hone par synaptic transmission thak jata hai.', 1, 'mit');
  A.add(capGeo(.9, .2), 0xf0735f, 1.0, 2.2, -.4, { op: .75, r: [0, 0, .5], cut: 1 }, PM); A.add(capGeo(.7, .1), 0x9c3328, 1.0, 2.2, -.4, { op: .95, r: [0, 0, .5], cut: 1 }, PM);
  const PE = A.part('Endocytosis (clathrin) + reuptake', 'Fusion ke baad vesicle membrane clathrin-coated pit se wapas andar kheench li jati hai aur vesicle dobara bharta hai (~30-60 s). Neurotransmitter reuptake transporters (DAT, SERT, GAT) se bhi wapas aata hai; SSRIs yahin kaam karti hain.');
  A.add(new T.SphereGeometry(.22, 14, 10, 0, 6.28, 0, 2.2), 0xb0b0ff, 1.7, .55, -.1, { op: .85, r: [PI, 0, 0], cut: 1 }, PE);
  const PC = A.part('Synaptic cleft + neurotransmitter', 'Release hua neurotransmitter (glutamate, GABA, ACh, dopamine...) ~20 nm cleft ko pareto hai aur receptors par bandh jata hai; phir enzyme (AChE) tod dete hain ya reuptake ho jata hai. Signal ek-tarfa: pre se post.');
  A.add(new T.CylinderGeometry(1.25, 1.25, .2, 28, 1, true), 0xffe14d, 0, -.2, 0, { op: .1, cut: 1 }, PC);
  A.flow([[-.3, .3, -.25], [-.25, -.05, -.25], [-.25, -.4, -.25], [-.25, -.65, -.25]], 0xffe14d, 6, .14, .05);
  A.flow([[.35, .3, -.15], [.4, -.05, -.15], [.4, -.4, -.15], [.4, -.65, -.15]], 0xffe14d, 6, .13, .05);
  const PP = A.part('Postsynaptic membrane + receptors', 'Doosre neuron ki membrane: ligand-gated ion channels (ionotropic) aur GPCR (metabotropic). Receptor khulne par Na+/Ca2+ andar (EPSP) ya Cl- andar (IPSP). PSD scaffold unhe pakadta hai.', 1, 'n_spine');
  A.add(new T.SphereGeometry(1.6, 28, 12, 0, 6.28, 0, PI / 2), 0x4fc3b8, 0, -1.2, 0, { op: .5, s: [1.0, .55, 1], r: [PI, 0, 0], cut: 1 }, PP);
  A.inst(new T.CylinderGeometry(.07, .07, .25, 8), 0xffd36a, [...Array(9)].map((_, i) => [-1.1 + i * .27, -.62 - Math.abs(i - 4) * .02, -rr(.05, .45)]), PP, .95, null, 1);
  A.lab('Axon terminal', [-2.6, 3.1, 0], '#ff7aa8'); A.lab('Synaptic vesicles', [-.1, 2.9, 0], '#7fe8ff'); A.lab('Docked + SNARE', [-1.9, .75, 0], '#7fe8ff'); A.lab('Ca2+ channels', [1.5, .1, 0], '#ffd36a'); A.lab('Ca2+ andar', [-1.2, 1.05, 0], '#ffee00'); A.lab('Synaptic cleft', [2.3, -.25, 0], '#ffe14d'); A.lab('Neurotransmitter', [-2.0, -.25, 0], '#ffe14d'); A.lab('Receptors', [-.1, -1.5, 0], '#ffd36a'); A.lab('Postsynaptic', [2.2, -1.5, 0], '#4fc3b8'); A.lab('Mitochondrion', [1.4, 2.9, 0], '#f0735f'); A.lab('Endocytosis', [2.3, .55, 0], '#b0b0ff');
  A.go('Postsynaptic spine ▸', 'n_spine');
});

/* ============ COMPARE + TRACKER + LAYERS ============ */
const TB = (h, rows) => '<table><tr>' + h.map((x, i) => '<th class="' + (i === 1 ? 'pk' : i === 2 ? 'ek' : '') + '">' + x + '</th>').join('') + '</tr>' + rows.map(r => '<tr>' + r.map(c => '<td>' + c + '</td>').join('') + '</tr>').join('') + '</table>';
registerCellInfo('neuron', {
  name: 'Neuron',
  fit: { r: [11.5, 9.5], t: [[0, -.25, 0], [.1, 0, 0]] },
  compare: { title: 'Neuron: tulna', html:
    '<h3 style="margin:4px 0;color:#f2c35a">1. Neuron vs normal animal cell</h3>' +
    TB(['Feature', 'Neuron', 'Typical animal cell'], [
      ['Shape', 'Lamba, shakhadar: dendrites + axon (1 m tak lamba ho sakta hai)', 'Gol / polygon, chhota'],
      ['Kaam', 'Electrical + chemical signal bhejna', 'Alag-alag (metabolism, structure...)'],
      ['Division', 'Mature neuron (G0), zyadatar divide nahi karta', 'Mitosis se divide karta hai'],
      ['Nissl bodies', 'Bahut: bade soma mein rough ER + ribosome ke dher', 'Rough ER kam, alag dhabbe nahi'],
      ['Centrioles', 'Mature neuron mein nahi (axon microtubule ko alag tarah organise karta hai)', 'Centrosome, 2 centrioles'],
      ['Mitochondria', 'Bahut, soma + terminals + axon par; Na+/K+ pump ke liye', 'Normal sankhya'],
      ['Membrane', 'Excitable: Na+/K+ voltage-gated channels, resting -70 mV', 'Resting potential hota hai par excitable nahi'],
      ['Special structure', 'Myelin, nodes, synapse, dendritic spines', 'Aise koi nahi'],
      ['Cytoskeleton', 'Neurofilaments + microtubules axon ko mota/mazboot rakhte hain', 'Intermediate filaments (keratin etc.)'],
      ['Regeneration', 'CNS mein bahut kam, PNS mein thodi', 'Zyadatar tissue theek ho jata hai']]) +
    '<h3 style="margin:18px 0 4px;color:#f2c35a">2. Dendrite vs Axon</h3>' +
    TB(['Feature', 'Dendrite', 'Axon'], [
      ['Number', 'Kai, patle branches', 'Ek (aage chal kar terminals mein branch)'],
      ['Direction', 'Signal soma ki taraf', 'Signal soma se door'],
      ['Surface', 'Dendritic spines', 'Smooth; nodes of Ranvier'],
      ['Myelin', 'Nahi', 'Aksar myelinated'],
      ['Ribosomes / Nissl', 'Hote hain (base par)', 'Nahi (soma mein bante hain)'],
      ['Microtubule polarity', 'Mixed', 'Sab plus-end terminal ki taraf'],
      ['Signal type', 'Graded potentials (EPSP/IPSP)', 'Action potential (all-or-none)'],
      ['Molecular marker', 'MAP2', 'Tau']]) +
    '<h3 style="margin:18px 0 4px;color:#f2c35a">3. Myelinated vs unmyelinated axon</h3>' +
    TB(['Feature', 'Myelinated', 'Unmyelinated'], [
      ['Speed', '~ 5-120 m/s (saltatory)', '~ 0.5-2 m/s (continuous)'],
      ['Energy', 'Kam (sirf nodes par pump)', 'Zyada (poori lambai par)'],
      ['Insulation', 'Schwann cell / oligodendrocyte myelin', 'Sirf Remak bundle mein Schwann cell'],
      ['Example', 'Motor neuron, touch fibres', 'Pain (C-fibre), autonomic']]) +
    '<h3 style="margin:18px 0 4px;color:#f2c35a">4. Neuron ke prakar</h3>' +
    TB(['Type', 'Kaam', 'Shape'], [
      ['Sensory (afferent)', 'Receptor se CNS tak', 'Pseudounipolar'],
      ['Motor (efferent)', 'CNS se muscle/gland tak', 'Multipolar'],
      ['Interneuron', 'CNS ke andar jodna', 'Multipolar, chhota axon']]) },
  tracker: [
    ['Soma', 'Cell body: nucleus aur organelles'], ['Nucleus + nucleolus', 'DNA; rRNA/ribosome assembly'], ['Nissl bodies', 'Rough ER + ribosome ke dher'],
    ['Golgi apparatus', 'Protein modify + pack'], ['Mitochondria', 'ATP; Na+/K+ pump ke liye'], ['Dendrites', 'Signal receive karte hain'], ['Dendritic spines', 'Excitatory synapse ki jagah'],
    ['Axon hillock', 'Spike yahin trigger hota hai'], ['Axon initial segment', 'Na+ channels + ankyrin-G'], ['Microtubules', 'Transport highway'], ['Neurofilaments', 'Axon ki strength'],
    ['Kinesin / dynein', 'Anterograde / retrograde transport'], ['Myelin sheath', 'Schwann cell ke lipid layers: insulation'], ['Schwann cell', 'PNS ka myelin banane wala cell'],
    ['Node of Ranvier', 'Na+ channels ka jhund'], ['Saltatory conduction', 'Node se node kudna'], ['Axon terminal', 'Bouton mein vesicles'], ['Synaptic vesicle', 'Neurotransmitter bhare'],
    ['SNARE proteins', 'Vesicle fusion machinery'], ['Ca2+ channel', 'AP aane par khulta hai'], ['Synaptic cleft', '~20 nm ki khaai'], ['AMPA / NMDA receptor', 'Glutamate receptors; LTP'],
    ['PSD', 'Postsynaptic density scaffold'], ['Resting potential', '~ -70 mV (Na+/K+ pump)'], ['Action potential', 'All-or-none spike']
  ],
  layers: [
    { id: 'soma', name: 'Soma + organelles', color: '#b58cff', parts: ['soma', 'nuc', 'mito', 'nissl', 'golgi', 'lyso', 'rib'] },
    { id: 'dend', name: 'Dendrites + spines', color: '#d9c6ff', parts: ['dend', 'spine'] },
    { id: 'axon', name: 'Axon hillock + axon', color: '#c9b2ff', parts: ['hill', 'axon'] },
    { id: 'myelin', name: 'Myelin sheath', color: '#f2e6a0', parts: ['myelin'] },
    { id: 'node', name: 'Nodes of Ranvier', color: '#ff9a3c', parts: ['node'] },
    { id: 'term', name: 'Terminals + synapse', color: '#ff7aa8', parts: ['term', 'post'] }
  ]
});
})();
