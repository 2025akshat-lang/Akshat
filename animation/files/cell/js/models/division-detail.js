/* DIVISION detail views: dv_chromo, dv_kineto, dv_ring, dv_cross */
(() => {
if (typeof registerDetail === 'undefined') throw new Error('04-detail-viewer.js purana hai (registerDetail nahi mila): naya 04-detail-viewer.js upload karo');
const PI = Math.PI, K = CVKit, rr = K.rr;

/* ============ CHROMOSOME: DNA -> nucleosome -> fibre -> chromatid ============ */
registerDetail('dv_chromo', A => {
  A.ttl('Chromosome structure'); A.cam([0, 0, 0, 10, 14, .2, .1]);
  const PD = A.part('DNA double helix', 'Do antiparallel strands, 2 nm chaudi, 10.5 base pair per turn. Ek insaan cell ke 46 chromosome mein ~ 2 m DNA hota hai, jo ~ 10 um ke nucleus mein samata hai.');
  [0, PI].forEach(o => A.tube([...Array(30)].map((_, i) => { const y = -2 + i * .14; return [-4.2 + .28 * Math.cos(y * 4.2 + o), y, .28 * Math.sin(y * 4.2 + o)]; }), .045, o ? 0x4ad0f0 : 0xff7a9a, PD, .95));
  for (let i = 0; i < 14; i++) { const y = -1.9 + i * .28; A.bar([-4.2 + .28 * Math.cos(y * 4.2), y, .28 * Math.sin(y * 4.2)], [-4.2 + .28 * Math.cos(y * 4.2 + PI), y, .28 * Math.sin(y * 4.2 + PI)], .018, 0xffe08a, PD, .8); }
  const PN = A.part('Nucleosome (histone octamer + DNA)', '8 histone proteins (H2A, H2B, H3, H4 x2) ke gird DNA ~ 1.65 baar lipta hai (147 bp). "Beads on a string": 11 nm fibre. Histone tail ke acetylation/methylation se gene on/off hote hain.');
  A.tube([[-2.6, 2, 0], [-2.6, 1.3, 0], [-2.6, 0, 0], [-2.6, -1.3, 0], [-2.6, -2, 0]], .035, 0xff7a9a, PN, .9);
  [1.0, 0, -1.0].forEach(y => { A.add(new T.CylinderGeometry(.34, .34, .3, 18), 0x9b6bd8, -2.6, y + .15 * 0, 0, { op: .95, r: [PI / 2, 0, 0] }, PN); A.add(tor(.36, .05), 0xff7a9a, -2.6, y, 0, { op: .95 }, PN); A.add(tor(.36, .05), 0xff7a9a, -2.6, y, .08, { op: .95 }, PN); });
  const PF = A.part('30 nm chromatin fibre + loops', 'Nucleosomes ek solenoid ki tarah kundli banate hain (30 nm), phir 300 nm ke loop domains scaffold (condensin, topoisomerase II) se bandhe. Condensation ~ 10,000 guna tak.');
  A.tube([...Array(60)].map((_, i) => { const y = -2 + i * .068; return [-1.0 + .35 * Math.cos(i * .9), y, .35 * Math.sin(i * .9)]; }), .12, 0xa88ae0, PF, .85);
  for (let i = 0; i < 5; i++) A.tube([[-1.0, -1.5 + i * .75, 0], [-.3, -1.2 + i * .75, .5], [.0, -1.5 + i * .75, -.2], [-.4, -1.8 + i * .75, -.4]], .05, 0xc8b0ff, PF, .8);
  const PA = A.part('Sister chromatids', 'Metaphase chromosome: DNA copy ke baad do identical chromatid, centromere par juda hua. Short arm "p", long arm "q". Mitosis mein ye alag hote hain.');
  const PC = A.part('Centromere + cohesin', 'Do chromatid ko jodne wali sankri jagah: cohesin protein ke ring dono ko pakadte hain. Centromere par kinetochore banta hai. Anaphase mein separase cohesin ko kaat deta hai.');
  const PK = A.part('Kinetochore', 'Centromere par protein ka disc (~ 100+ protein): spindle microtubule ka plus-end pakadta hai aur spindle checkpoint (Mad2) ko batata hai ki attach hua ya nahi.');
  const PT = A.part('Telomeres', 'Chromosome ke sire par TTAGGG ki dohrati sequence + shelterin: sira ko "toot gaya DNA" samajhne se bachati hai. Har division mein chhoti hoti jaati hai (telomerase se bharti).');
  [-1, 1].forEach(sd => { A.tube([[2.8 + sd * .22, 2.0, 0], [2.8 + sd * .28, .8, 0], [2.8 + sd * .1, 0, 0]], .17, sd < 0 ? 0xe0504a : 0xff7a6a, PA, .95); A.tube([[2.8 + sd * .1, 0, 0], [2.8 + sd * .3, -1.0, 0], [2.8 + sd * .38, -2.4, 0]], .17, sd < 0 ? 0xe0504a : 0xff7a6a, PA, .95);
    A.add(sp(.2, 10, 8), 0xffe04a, 2.8 + sd * .1, 0, .22, { op: 1 }, PK); A.add(sp(.12, 8, 6), 0xffffff, 2.8 + sd * .35, 2.05, 0, { op: 1 }, PT); A.add(sp(.12, 8, 6), 0xffffff, 2.8 + sd * .42, -2.5, 0, { op: 1 }, PT); });
  A.add(tor(.3, .04), 0x6ad0a0, 2.8, 0, 0, { op: .95, r: [PI / 2, 0, 0] }, PC); A.add(sp(.11, 8, 6), 0x6ad0a0, 2.8, 0, 0, { op: 1 }, PC);
  A.flow([[-4.2, 2.3, 0], [-2.6, 2.3, 0], [-1.0, 2.3, 0], [2.8, 2.5, 0]], 0xffee44, 6, .08, .06);
  A.lab('DNA double helix', [-4.2, 2.4, 0], '#ff7a9a'); A.lab('Nucleosome', [-2.6, 2.4, 0], '#9b6bd8'); A.lab('30 nm fibre', [-1.0, 2.4, 0], '#a88ae0'); A.lab('Sister chromatids', [2.8, 2.8, 0], '#e0504a'); A.lab('Centromere + cohesin', [3.9, .5, 0], '#6ad0a0'); A.lab('Kinetochore', [3.7, -.35, 0], '#ffe04a'); A.lab('Telomere', [3.9, -2.4, 0], '#ffffff'); A.lab('~ 10,000x condense', [-.3, -2.5, 0], '#ffee44');
  A.go('Kinetochore + spindle ▸', 'dv_kineto');
});

/* ============ KINETOCHORE + MICROTUBULE ============ */
registerDetail('dv_kineto', A => {
  A.ttl('Kinetochore + spindle'); A.cam([0, 0, 0, 8.5, 12, .2, .1]);
  const PM = A.part('Spindle microtubules (k-fibres)', '13 protofilament ki khokhli nali (25 nm). Plus-end kinetochore par: tubulin judne/hatne se kheenchne ka bal banta hai (depolymerization-coupled pulling). Har k-fibre mein ~ 20 microtubule.', 1, 'cen');
  const PS = A.part('Centrosome (pole)', 'Spindle pole: microtubule ke minus-end yahan gamma-tubulin ring (gamma-TuRC) se bandhe hain.', 1, 'cen');
  [-1, 1].forEach(sd => { for (let i = 0; i < 3; i++) A.tube([[sd * 0.2 + (i - 1) * .08, sd * 4.0, 0], [sd * .12 + (i - 1) * .1, sd * 2.4, 0], [sd * .0 + (i - 1) * .1, sd * .85, 0]], .06, 0xffe08a, PM, .95);
    A.add(sp(.22, 12, 10), 0xffc84a, sd * .1, sd * 4.2, 0, { op: .95 }, PS); for (let j = 0; j < 8; j++) A.add(sp(.075, 8, 6), 0xffe08a, sd * (.15 + (j % 3 - 1) * .08), sd * (1.05 + j * .08 * 0 + (j % 4) * .06), (j % 3 - 1) * .06, { op: .95 }, PM); });
  const PK = A.part('Kinetochore (inner + outer plate)', 'Inner plate centromeric chromatin (CENP-A) se, outer plate Ndc80/Ska complex se jo microtubule ko pakadta hai. Har sister ka apna kinetochore, opposite direction mein.', 1, 'dv_chromo');
  [-1, 1].forEach(sd => { A.add(new T.CylinderGeometry(.62, .62, .08, 24), 0xffe04a, 0, sd * .45, .0, { op: .95 }, PK); A.add(new T.CylinderGeometry(.62, .62, .07, 24), 0xffa030, 0, sd * .6, 0, { op: .95 }, PK); });
  const PC = A.part('Sister chromatids + cohesin', 'Do chromatid (laal) jinhe cohesin ring (hara) centromere par pakadte hain; shugoshin (SGO1) mitosis mein centromeric cohesin ko bachata hai jab tak sab chromosome attach na ho jaayein.');
  [-1, 1].forEach(sd => A.add(new T.CylinderGeometry(.34, .34, 1.1, 18), 0xe0504a, sd * 0.0, sd * .0 + 0, -.0, { op: .0 }, PC));
  A.add(new T.CylinderGeometry(.32, .32, 1.0, 18), 0xe0504a, -.0, 0, 0, { op: .9, s: [1, 1, 1] }, PC);
  A.add(tor(.36, .05), 0x6ad0a0, 0, 0, 0, { op: .95, r: [PI / 2, 0, 0] }, PC);
  A.add(tor(.36, .05), 0x6ad0a0, 0, .1, 0, { op: .95, r: [PI / 2, 0, 0] }, PC);
  const PX = A.part('Spindle checkpoint (Mad2, BubR1)', 'Agar koi kinetochore unattached ya tension-rahit ho to Mad2 + BubR1 APC/C ko rok dete hain: anaphase tab tak nahi hota jab tak SAB chromosome sahi bi-orient na ho jaayein. Isse aneuploidy rukti hai.');
  A.add(sp(.12, 8, 6), 0xff4a4a, .45, .75, .3, { op: 1 }, PX); A.add(sp(.12, 8, 6), 0xff4a4a, -.5, -.75, .3, { op: 1 }, PX);
  const PA = A.part('Aurora B (error correction)', 'Galat attachment (dono kinetochore ek hi pole se) ko tension kam hone par phosphorylate karke kholta hai: sahi tension aane tak dobara koshish.');
  A.add(sp(.14, 8, 6), 0x4ad0ff, -.7, 0, .15, { op: 1 }, PA);
  A.add(sp(.14, 8, 6), 0x4ad0ff, .7, 0, .15, { op: 1 }, PA);
  const PP = A.part('APC/C + separase (anaphase trigger)', 'Sab attach hone par APC/C securin ko hatata hai: separase azad hokar cohesin ko kaatta hai aur sister chromatids ek-saath alag ho jaate hain.');
  A.add(new T.OctahedronGeometry(.17), 0xff9a3c, 1.6, 0, .0, { op: 1 }, PP);
  A.flow([[0, 1.0, .1], [0, 2.4, .1], [0, 3.8, .1]], 0xffee44, 4, .08, .06); A.flow([[0, -1.0, .1], [0, -2.4, .1], [0, -3.8, .1]], 0xffee44, 4, .08, .06);
  A.lab('Centrosome (pole)', [1.3, 4.2, 0], '#ffc84a'); A.lab('k-fibre (microtubule)', [.9, 2.4, 0], '#ffe08a'); A.lab('Kinetochore', [-1.1, .65, 0], '#ffe04a'); A.lab('Cohesin ring', [1.0, .0, 0], '#6ad0a0'); A.lab('Sister chromatids', [-1.5, .0, 0], '#e0504a'); A.lab('Mad2 checkpoint', [1.4, .85, 0], '#ff4a4a'); A.lab('Aurora B', [-1.2, -.35, 0], '#4ad0ff'); A.lab('Separase', [2.2, .0, 0], '#ff9a3c'); A.lab('Kheench', [.0, -3.4, 0], '#ffee44');
  A.go('Chromosome ▸', 'dv_chromo');
});

/* ============ CONTRACTILE RING ============ */
registerDetail('dv_ring', A => {
  A.ttl('Contractile ring'); A.cam([0, 0, 0, 9, 13, .3, .12]);
  const PM = A.part('Plasma membrane (cleavage furrow)', 'Equator par membrane andar ki taraf khinchti hai; extra membrane Golgi/endosome vesicles se judti hai taaki daughters ko poori membrane mile.', 1, 'memb');
  A.add(sp(1, 28, 20), 0xe0527a, -2.3, 0, 0, { op: .2, s: [2.4, 1.9, 1.9], cut: 1 }, PM); A.add(sp(1, 28, 20), 0xe0527a, 2.3, 0, 0, { op: .2, s: [2.4, 1.9, 1.9], cut: 1 }, PM);
  const PR = A.part('Actin filaments (ring)', 'F-actin ka gol ring (~ 100-150 filament): formin se banta (mDia), cofilin se toota. Cell ke equator ke neeche membrane se chipka rehta hai.');
  const PY = A.part('Myosin II (motor)', 'Do sirwala (bipolar) myosin II filament actin filaments ko ek-doosre par phisalata hai (muscle sarcomere jaisa): ring sikudta hai. ATP lagta hai. Blebbistatin dawa ise rokti hai.');
  for (let i = 0; i < 14; i++) { const a = i * PI * 2 / 14, r = 1.25; A.tube([[0, r * Math.cos(a), r * Math.sin(a) * .0 - 1.0 * Math.abs(Math.sin(a)) * 0], [0, r * Math.cos(a + .35), -r * Math.abs(Math.sin(a + .35))]], .045, 0x4ad0f0, PR, .95, { cut: 1 }); }
  A.add(tor(1.25, .07), 0x4ad0f0, 0, 0, 0, { op: .75, r: [0, PI / 2, 0], cut: 1 }, PR);
  for (let i = 0; i < 10; i++) { const a = i * PI * 2 / 10 + .2; A.add(new T.CylinderGeometry(.045, .045, .36, 8), 0xff9a3c, 0, 1.25 * Math.cos(a), -Math.abs(1.25 * Math.sin(a)), { op: 1, r: [0, 0, 0], cut: 1 }, PY); A.add(sp(.075, 8, 6), 0xff7a2a, 0, 1.25 * Math.cos(a) + .2, -Math.abs(1.25 * Math.sin(a)), { op: 1, cut: 1 }, PY); }
  const PH = A.part('RhoA + Ect2 (signal)', 'Central spindle (centralspindlin) equator par Ect2 laata hai: RhoA-GTP active hota hai aur formin + ROCK (myosin ko on karte hain) shuru karta hai. Isse furrow ki jagah tay hoti hai.');
  A.add(sp(.18, 10, 8), 0xff4a8a, 0, 0, -.2, { op: 1 }, PH); A.add(tor(1.4, .03), 0xff4a8a, 0, 0, 0, { op: .5, r: [0, PI / 2, 0], cut: 1 }, PH);
  const PA = A.part('Anillin + septin (scaffold)', 'Anillin actin, myosin aur membrane ko jodta hai; septin ring ko sthir rakhte hain.');
  for (let i = 0; i < 6; i++) { const a = i * PI / 3 + .1; A.add(sp(.1, 8, 6), 0xc87ae0, 0, 1.45 * Math.cos(a), -Math.abs(1.45 * Math.sin(a)), { op: 1, cut: 1 }, PA); }
  const PS = A.part('Central spindle / midbody', 'Anaphase ke overlapping microtubule midzone mein ek ghana midbody banate hain: cytokinesis ke aakhir mein ESCRT-III isse kaat kar dono cells ko alag kar deta hai (abscission).', 1, 'dv_kineto');
  A.tube([[-3.0, 0, -.3], [-1.0, 0, -.3], [1.0, 0, -.3], [3.0, 0, -.3]], .05, 0xffe08a, PS, .95, { cut: 1 }); A.add(new T.CylinderGeometry(.14, .14, .5, 12), 0xffffff, 0, 0, -.3, { op: .95, r: [0, 0, PI / 2], cut: 1 }, PS);
  const PN = A.part('Daughter nuclei', 'Dono daughters mein chromosomes ke gird nuclear envelope dobara.', 1, 'nuc');
  A.add(sp(1, 20, 14), 0x9b6bd8, -2.5, 0, -.6, { op: .6, s: [.8, .8, .8], cut: 1 }, PN); A.add(sp(1, 20, 14), 0x9b6bd8, 2.5, 0, -.6, { op: .6, s: [.8, .8, .8], cut: 1 }, PN);
  A.flow([[0, 1.5, -.1], [0, .8, -.1], [0, .2, -.1]], 0xff9a3c, 5, .1, .08);
  A.lab('Cleavage furrow', [0, 2.1, 0], '#e0527a'); A.lab('Actin ring', [-.2, -1.6, 0], '#4ad0f0'); A.lab('Myosin II', [.9, 1.0, 0], '#ff9a3c'); A.lab('RhoA signal', [.8, -.3, 0], '#ff4a8a'); A.lab('Anillin', [0, -2.0, 0], '#c87ae0'); A.lab('Midbody', [0, .5, 0], '#ffe08a'); A.lab('Daughter nucleus', [-2.5, 1.2, 0], '#9b6bd8'); A.lab('Daughter nucleus', [2.5, 1.2, 0], '#9b6bd8'); A.lab('Sikudta ring', [0, 1.55, 0], '#ff9a3c');
  A.go('Spindle ▸', 'dv_kineto');
});

/* ============ CROSSING OVER ============ */
registerDetail('dv_cross', A => {
  A.ttl('Crossing over (synapsis)'); A.cam([0, 0, 0, 9.5, 13, .2, .08]);
  const PH = A.part('Homologous chromosomes (maa + pita)', 'Maa se aaya (laal) aur pita se aaya (neela) chromosome, dono ek hi gene ke alag versions (alleles) rakhte hain. Prophase I (zygotene) mein ye paas aate hain: synapsis.', 1, 'dv_chromo');
  const PS = A.part('Synaptonemal complex', 'Homologs ke beech ki zip jaisi protein seedhi: 2 lateral elements (SYCP2/3), beech mein transverse filaments (SYCP1) aur central element. Homologs ko ~ 100 nm par kheench kar crossing-over ke liye pakadta hai (pachytene).');
  const PRN = A.part('Recombination nodule', 'Seedhi par bane protein ke dabbe (SPO11 se bani DNA todan ki marammat): MLH1 wale nodules jahan crossover pakka hota hai. Har chromosome arm par kam se kam 1 crossover zaroori hai.');
  const PX = A.part('Chiasma (crossover ka nishan)', 'Do homologs ke non-sister chromatids jahan jude (X jaisa dikhta hai). Diplotene mein dikhte hain aur anaphase I tak homologs ko saath pakde rehte hain taaki sahi alag ho sakein. Maa-pita ke genes mil jaate hain.');
  const PHJ = A.part('Holliday junction', 'DNA ke 4 strands ka chauraha jahan tukde badalte hain (strand invasion se bana): resolve hone par ya to crossover ya non-crossover.');
  const RAD = .1, ys = [1.5, 1.2, -1.2, -1.5];
  [[1.5, 0xe0504a], [1.2, 0xe0504a]].forEach(a => A.tube([[-4.2, a[0], 0], [-1.0, a[0], 0], [4.2, a[0], 0]], RAD, a[1], PH, .95));
  [[-1.2, 0x4a7ae0], [-1.5, 0x4a7ae0]].forEach(a => A.tube([[-4.2, a[0], 0], [-1.0, a[0], 0], [4.2, a[0], 0]], RAD, a[1], PH, .95));
  /* crossover: inner red chromatid and inner blue chromatid exchange (right side) */
  A.tube([[1.2, 1.2, .0], [2.0, .6, .1], [2.8, -.9, .1], [4.2, -1.2, 0]], RAD, 0xe0504a, PX, .95);
  A.tube([[1.2, -1.2, 0], [2.0, -.6, -.1], [2.8, .9, -.1], [4.2, 1.2, 0]], RAD, 0x4a7ae0, PX, .95);
  A.add(sp(.16, 10, 8), 0xffffff, 2.4, 0, 0, { op: 1 }, PRN); A.add(sp(.2, 10, 8), 0x6ad0a0, 2.4, 0, .05, { op: .7 }, PRN);
  A.add(sp(.18, 10, 8), 0xffee44, 2.4, .02, .22, { op: 1 }, PHJ);
  for (let i = 0; i < 13; i++) { const x = -4 + i * .5; A.bar([x, .75, 0], [x, -.75, 0], .025, 0xdddddd, PS, .85); }
  A.tube([[-4.2, .75, 0], [0, .75, 0], [1.2, .75, 0]], .06, 0xaaaaaa, PS, .95); A.tube([[-4.2, -.75, 0], [0, -.75, 0], [1.2, -.75, 0]], .06, 0xaaaaaa, PS, .95); A.tube([[-4.2, 0, 0], [0, 0, 0], [1.2, 0, 0]], .045, 0xffffff, PS, .95);
  for (let i = 0; i < 3; i++) A.add(sp(.12, 8, 6), 0x6ad0a0, -3.0 + i * 1.6, 0, .08, { op: 1 }, PRN);
  A.flow([[-4.2, 0, .3], [0, 0, .3], [2.4, 0, .3]], 0xffee44, 4, .06, .05);
  A.lab('Maa ka homolog', [-3.4, 2.0, 0], '#e0504a'); A.lab('Pita ka homolog', [-3.4, -2.0, 0], '#4a7ae0'); A.lab('Synaptonemal complex', [-1.6, .0, 0], '#ffffff'); A.lab('Recombination nodule', [-3.1, .55, 0], '#6ad0a0'); A.lab('Chiasma (crossover)', [2.4, 1.1, 0], '#ffffff'); A.lab('Holliday junction', [2.4, -.55, 0], '#ffee44'); A.lab('Adla-badli ke baad', [3.7, 1.9, 0], '#e0504a'); A.lab('Sister chromatids', [-4.2, 1.35, 0], '#e0504a');
  A.go('Chromosome ▸', 'dv_chromo');
});
})();
/* END OF FILE division-detail.js */
