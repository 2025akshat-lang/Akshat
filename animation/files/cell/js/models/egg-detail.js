/* EGG detail views: e_zona, e_cort, e_spindle */
(() => {
if (typeof registerDetail === 'undefined') throw new Error('04-detail-viewer.js purana hai (registerDetail nahi mila): naya 04-detail-viewer.js upload karo');
const PI = Math.PI, K = CVKit, rr = K.rr, dots = K.dots;

registerDetail('e_zona', A => {
  A.ttl('Zona pellucida'); A.cam([0, 0, 0, 8.5, 12, .3, .15]);
  const PC = A.part('Cumulus cells + hyaluronan', 'Corona ki cells hyaluronic acid ke jel mein: sperm ko inhe hyaluronidase (acrosome se) tod kar guzarna padta hai. Cells progesterone chhodte hain jo sperm ko attract karta hai.');
  for (let i = 0; i < 5; i++) A.add(sp(1, 16, 12), 0xffb8d0, -3.3 + i * .0, 2.4 - i * 1.05, -.5, { op: .75, s: [.55, .5, .5], cut: 1 }, PC);
  A.add(new T.BoxGeometry(1.5, 5.4, 3.2), 0xffe4ee, -3.3, 0, 0, { op: .2, cut: 1 }, PC);
  const PZ = A.part('ZP filament mesh (ZP1, ZP2, ZP3)', 'ZP2 + ZP3 lambi filaments banate hain jo ZP1 se jude (cross-link) hote hain: 3D jaal. ZP3 ka sugar sperm ko pakadta hai (O-glycans); ZP2 ka N-terminal sperm ko tikaye rakhta hai.');
  A.add(new T.BoxGeometry(1.6, 5.4, 3.2), 0xf2c35a, -.9, 0, 0, { op: .32, cut: 1 }, PZ);
  for (let i = 0; i < 9; i++) A.tube([[-1.6, -2.4 + i * .6, -1.2], [-.9, -2.0 + i * .6, -.6], [-.2, -2.4 + i * .6, -1.2]], .045, 0xffe08a, PZ, .95, { cut: 1 });
  for (let i = 0; i < 6; i++) A.bar([-1.4, -2.1 + i * .85, -1.0], [-.4, -1.8 + i * .85, -1.4], .03, 0xffffff, PZ, .95, { cut: 1 });
  const PS = A.part('Sperm (zona se bandhta)', 'Sperm ka acrosome-reacted sir ZP2 se bandhta aur ZP3 se pehle pehchan hota hai; enzymes se raasta kholta hai.', 1, 's_acro');
  A.add(sp(1, 20, 14), 0x3a56c8, -3.1, -1.8, 0, { op: .85, s: [.55, .3, .25], r: [0, 0, -.5], cut: 1 }, PS); A.tube([[-3.4, -1.95, 0], [-4.0, -2.2, 0], [-4.7, -2.4, 0]], .04, 0x7fd6c2, PS, .9, { cut: 1 });
  A.flow([[-2.9, -1.7, -.1], [-1.9, -1.5, -.1], [-1.0, -1.2, -.1]], 0xffee44, 4, .1, .06);
  const PP = A.part('Perivitelline space', 'Zona aur egg ki membrane ke beech ki patli jagah: sperm yahin se guzar kar membrane tak aata hai; cortical granule ka maal bhi yahin aata hai.');
  A.add(new T.BoxGeometry(.6, 5.4, 3.2), 0xeae0c8, .55, 0, 0, { op: .22, cut: 1 }, PP);
  const PM = A.part('Oolemma + microvilli', 'Egg ki membrane ki ungliyan (microvilli): sperm se fusion yahin hota hai. CD9 + JUNO (IZUMO1 ka jodidar) fusion ke liye zaroori.', 1, 'memb');
  A.add(new T.BoxGeometry(.1, 5.4, 3.2), 0xf0c070, 1.4, 0, 0, { op: .55, cut: 1 }, PM);
  for (let i = 0; i < 11; i++) A.bar([1.4, -2.4 + i * .48, -.9], [.9, -2.3 + i * .48, -.9], .045, 0xf0c070, PM, .95, { cut: 1 });
  const PJ = A.part('JUNO / CD9', 'JUNO egg ka receptor (sperm ka IZUMO1 pakadta), CD9 microvilli par fusion ke liye. Inke bina ya antibody se fertilisation nahi hota.');
  dots(A, PJ, 7, i => [.85, -2.0 + i * .65, -.95], 0x4ad0ff, .09, 1, 1);
  const PO = A.part('Ooplasm', 'Zona ke andar ka cytoplasm: Ca2+ store, mRNA, mitochondria.', 1, 'memb');
  A.add(new T.BoxGeometry(2.0, 5.4, 3.2), 0xfff0d0, 2.5, 0, 0, { op: .14, cut: 1 }, PO);
  A.lab('Corona (cumulus)', [-3.3, 3.1, 0], '#ffb8d0'); A.lab('Zona pellucida', [-.9, 3.1, 0], '#f2c35a'); A.lab('Perivitelline space', [.55, 3.5, 0], '#eae0c8'); A.lab('Oolemma', [1.5, 2.8, 0], '#f0c070'); A.lab('Ooplasm', [2.6, 2.1, 0], '#fff0d0'); A.lab('Sperm', [-3.2, -2.8, 0], '#3a56c8'); A.lab('ZP filaments', [-.9, 1.6, 0], '#ffe08a'); A.lab('JUNO / CD9', [1.0, -2.55, 0], '#4ad0ff'); A.lab('Hyaluronan jel', [-3.3, 1.2, 0], '#ffe4ee');
  A.go('Cortical reaction ▸', 'e_cort');
});

registerDetail('e_cort', A => {
  A.ttl('Cortical reaction'); A.cam([0, 0, 0, 8.5, 12, .25, .1]);
  const PZ = A.part('Zona pellucida (hardening)', 'Cortical enzymes ZP2 ko katte (ovastacin) aur ZP3 ko badal dete hain: zona sakht ho jata hai aur sperm ko ab nahi pakadta: polyspermy ka slow block.', 1, 'e_zona');
  A.add(new T.BoxGeometry(.9, 5.4, 3.4), 0xf2c35a, -2.55, 0, 0, { op: .38, cut: 1 }, PZ);
  const PS = A.part('Fused sperm', 'Pehla sperm membrane se fuse ho gaya (IZUMO1-JUNO): iske baad egg ka Ca2+ badhna shuru.', 1, 's_head');
  A.add(sp(1, 18, 12), 0x3a56c8, -1.4, 1.5, 0, { op: .85, s: [.6, .3, .3], cut: 1 }, PS);
  const PM = A.part('Egg membrane', 'Cortical vesicle se fuse hone par nayi membrane judti hai: egg thodi choti bhi hoti hai aur zona se door hota hai.', 1, 'memb');
  A.add(new T.BoxGeometry(.12, 5.4, 3.4), 0xf0c070, -1.55, 0, 0, { op: .6, cut: 1 }, PM);
  A.add(new T.BoxGeometry(.12, 5.4, 3.4), 0xf0c070, -1.55, 0, 0, { op: .0, cut: 1 }, PM);
  const PG = A.part('Cortical granules (aate hue)', 'Membrane ke neeche ghani line mein pade ~ 4000 granules; Ca2+ lehar aane par ek ke baad ek fuse hote hain (exocytosis).');
  for (let i = 0; i < 12; i++) A.add(sp(.17, 10, 8), 0xffee44, -1.25 + (i % 2) * .08, -2.5 + i * .45, -rr(0, .9), { op: .95, cut: 1 }, PG);
  const PE = A.part('Ovastacin + peroxidase + glycosidase', 'Granule ke enzyme: ovastacin ZP2 ko kaat deta hai; peroxidase tyrosine ko jodkar zona ko sakht karta hai; glycosidase ZP3 ka sugar hata deta hai.');
  dots(A, PE, 18, () => [rr(-2.3, -1.65), rr(-2.2, 2.2), -rr(.1, 1.2)], 0xffee66, .06, .95, 1);
  A.flow([[-1.3, -1.2, -.2], [-1.8, -1.2, -.2], [-2.4, -1.2, -.2]], 0xffee44, 4, .1, .07);
  A.flow([[-1.3, .2, -.2], [-1.8, .2, -.2], [-2.4, .2, -.2]], 0xffee44, 4, .1, .07);
  const PC = A.part('Ca2+ wave', 'Sperm ka PLC-zeta IP3 banata hai: ER se Ca2+ lehar fertilisation point se poore egg mein ~ 20 um/s se faili: cortical reaction + meiosis II ka punarprarambh.', 1, 'er');
  A.tube([[2.9, 2.2, -.3], [1.9, 1.1, -.3], [.9, 0, -.3], [-.1, -1.1, -.3]], .08, 0xff6a6a, PC, .85, { cut: 1 });
  A.flow([[2.9, 2.2, -.2], [1.9, 1.1, -.2], [.9, 0, -.2], [-.1, -1.1, -.2], [-1.0, -1.6, -.2]], 0xff6a6a, 6, .1, .1);
  const PR = A.part('Egg ke andar (ooplasm)', 'Cortical reaction ke baad zygote ban gaya: do pronuclei jaldi dikhai dete hain.', 1, 'memb');
  A.add(new T.BoxGeometry(3.0, 5.4, 3.4), 0xfff0d0, .9, 0, 0, { op: .14, cut: 1 }, PR);
  const PP = A.part('Perivitelline space (bhar raha)', 'Cortical maal se chhoti jagah bharti hai (Ca2+ ke baad): egg aur zona ke beech nami badhne se zona sakht aur sperm door.');
  A.add(new T.BoxGeometry(.7, 5.4, 3.4), 0xeae0c8, -2.0, 0, 0, { op: .2, cut: 1 }, PP);
  A.lab('Zona (sakht)', [-2.55, 3.0, 0], '#f2c35a'); A.lab('Perivitelline space', [-2.0, -3.0, 0], '#eae0c8'); A.lab('Fused sperm', [-1.4, 2.2, 0], '#3a56c8'); A.lab('Cortical granules', [-1.0, -2.1, 0], '#ffee44'); A.lab('Enzymes nikle', [-2.2, .75, 0], '#ffee66'); A.lab('Ca2+ lehar', [1.7, 1.7, 0], '#ff6a6a'); A.lab('Egg ooplasm', [1.5, -1.0, 0], '#fff0d0'); A.lab('Membrane', [-1.55, -3.1, 0], '#f0c070');
  A.go('Zona pellucida ▸', 'e_zona');
});

registerDetail('e_spindle', A => {
  A.ttl('MII spindle + polar body'); A.cam([.3, 0, 0, 8, 11.5, .25, .1]);
  const PM = A.part('Egg cortex (membrane ke paas)', 'Spindle membrane ke pass hai (actin cap se): isse polar body bahut kam cytoplasm ke saath nikalta hai.', 1, 'memb');
  A.add(sp(1, 36, 24), 0xfff0d0, -.8, -.3, 0, { op: .18, s: [3.6, 2.9, 2.9], cut: 1 }, PM);
  A.add(new T.CylinderGeometry(.9, .9, .05, 24), 0xff9a7a, 2.15, 1.5, -.2, { op: .5, r: [PI / 2, 0, -.9], cut: 1 }, PM);
  const PS = A.part('Spindle microtubules (barrel)', 'Metaphase II ka barrel jaisa spindle: dono sire thode nukile, anchor ke liye centrosome nahi (acentriolar, asters nahi). Katanin aur kinetochore fibres se bana.');
  const cx = 1.3, cy = 1.0;
  for (let i = 0; i < 12; i++) { const a = i * PI * 2 / 12, rr2 = .5 * Math.sin(Math.PI * 0 + a); A.tube([[cx - 1.4, cy + 0, -.3], [cx, cy + .65 * Math.cos(a), -.3 - .55 * Math.sin(a)], [cx + 1.4, cy, -.3]], .03, 0x6ab0ff, PS, .85, { cut: 1 }); }
  const PC = A.part('Chromosomes (23 dyads)', 'Har chromosome do chromatid ka (dyad): metaphase plate par line se. Anaphase II sperm ke aane par: chromatids alag hote hain.', 1, 'dna');
  for (let i = 0; i < 12; i++) { const y = cy - .55 + (i % 4) * .36, z = -.3 - Math.floor(i / 4) * .35 + .3; A.add(new T.CylinderGeometry(.06, .06, .25, 8), 0x9b6bd8, cx, y, z, { op: 1, cut: 1 }, PC); A.add(new T.CylinderGeometry(.06, .06, .25, 8), 0xb88ae8, cx, y, z + .12, { op: 1, cut: 1 }, PC); }
  const PK = A.part('Kinetochores', 'Chromosome ke centromere par protein ki chakti jo spindle microtubule se judti hai; sister kinetochores ek hi taraf mudte hain (meiosis I jaisa nahi).');
  for (let i = 0; i < 8; i++) A.add(sp(.06, 8, 6), 0xffee44, cx - .12, cy - .5 + (i % 4) * .36, -.3 - Math.floor(i / 4) * .35 + .3, { op: 1, cut: 1 }, PK);
  const PP = A.part('Polar body 1', 'Meiosis I ka chhota cell: 23 chromosome ke saath. Zona ke andar atka rehta hai aur jald khatam ho jata hai. Sperm entry ke baad polar body 2 bhi nikalta hai.');
  A.add(sp(1, 20, 14), 0xffd8b0, 3.3, 2.0, -.2, { op: .5, s: [.5, .5, .5], cut: 1 }, PP); A.add(sp(1, 12, 10), 0x9b6bd8, 3.3, 2.0, -.25, { op: .95, s: [.2, .2, .15], cut: 1 }, PP);
  const PCS = A.part('CSF (cytostatic factor) + MPF', 'Egg MII par rukta hai kyunki cyclin B/CDK1 (MPF) aur Emi2 (CSF) APC ko rokte hain. Sperm ka Ca2+ lehar Emi2 ko tod deta hai: meiosis II poora.');
  dots(A, PCS, 8, () => [rr(-.2, 2.8), rr(.3, 1.8), -rr(.2, .8)], 0xff7a4a, .08, .95, 1);
  const PA = A.part('Cortical actin cap', 'Spindle ke upar membrane par actin ki moti topi aur microvilli-rahit kshetra: polar body ka sthaan tay karti hai.');
  A.tube([[2.1, .9, -.3], [2.5, 1.5, -.3], [2.9, 1.9, -.3]], .1, 0xff9a7a, PA, .9, { cut: 1 });
  A.flow([[1.3, 1.0, -.1], [2.0, 1.4, -.1], [3.0, 1.9, -.1]], 0xffee44, 3, .08, .06);
  A.lab('Egg cortex', [-2.8, 2.1, 0], '#fff0d0'); A.lab('MII spindle', [cx, 2.2, 0], '#6ab0ff'); A.lab('Chromosomes', [cx, -.1, 0], '#9b6bd8'); A.lab('Kinetochore', [cx - .6, .55, 0], '#ffee44'); A.lab('Polar body 1', [3.4, 2.6, 0], '#ffd8b0'); A.lab('Actin cap', [2.3, .25, 0], '#ff9a7a'); A.lab('MPF / CSF', [2.4, 1.1, 0], '#ff7a4a'); A.lab('Ooplasm', [-.9, -2.2, 0], '#fff0d0');
  A.go('Cortical reaction ▸', 'e_cort');
});
})();
/* END OF FILE egg-detail.js */
