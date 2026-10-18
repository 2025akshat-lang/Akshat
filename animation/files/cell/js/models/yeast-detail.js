/* YEAST detail views: y_wall, y_bud, y_vac, y_spb */
(() => {
if (typeof registerDetail === 'undefined') throw new Error('04-detail-viewer.js purana hai (registerDetail nahi mila): naya 04-detail-viewer.js upload karo');
const PI = Math.PI, K = CVKit, rr = K.rr, dots = K.dots;

registerDetail('y_wall', A => {
  A.ttl('Yeast cell wall'); A.cam([0, 0, 0, 8, 12, .3, .15]);
  const PM = A.part('Mannoprotein (bahari parat)', 'Bahar ki fuzzy parat: ~ 40% wall, bahut ghani sugar (mannan) wale proteins. Paani rokti hai, pores ko tay karti hai aur immune system pehchanta hai (antigen).');
  A.add(new T.BoxGeometry(.7, 4, 3.4), 0xe0a050, 1.4, 0, 0, { op: .5, cut: 1 }, PM);
  for (let i = 0; i < 14; i++) { const y = -1.8 + i * .28, z = -1.5 + (i % 4) * .4; A.bar([1.75, y, z], [2.3, y + .1, z], .02, 0xffd090, PM, .95, { cut: 1 }); A.add(sp(.06, 8, 6), 0xffd090, 2.32, y + .1, z, { op: 1, cut: 1 }, PM); }
  const PG = A.part('Beta-1,3 / 1,6-glucan (mazboot jaal)', 'Wall ki asli taakat (~ 50-60%): glucan chains ka jaal. Echinocandin (caspofungin) glucan synthase rokkar fungus ko marti hai: insaan mein ye wall nahi, isliye surakshit.');
  A.add(new T.BoxGeometry(.9, 4, 3.4), 0xa87a3c, .5, 0, 0, { op: .8, cut: 1 }, PG);
  for (let i = 0; i < 10; i++) A.tube([[.1, -1.8 + i * .4, -1.5], [.5, -1.5 + i * .4, -.5], [.9, -1.8 + i * .4, -1.2]], .035, 0xf5e0b0, PG, .95, { cut: 1 });
  const PC = A.part('Chitin', 'Glucan se jude N-acetylglucosamine ke lambi chains: bahut kam par bud scar aur septum par bahut. Insect shell aur crab jaisa polymer.');
  for (let i = 0; i < 5; i++) A.bar([-.1, -1.6 + i * .8, -.9], [-.1, -1.6 + i * .8, .9], .06, 0xffffff, PC, .95, { cut: 1 });
  const PS = A.part('Periplasmic space', 'Wall aur plasma membrane ke beech ka patla gap: invertase jaise enzyme yahin sucrose todte hain.');
  A.add(new T.BoxGeometry(.25, 4, 3.4), 0xf5e8c0, -.2, 0, 0, { op: .3, cut: 1 }, PS);
  const PB = A.part('Plasma membrane (ergosterol)', 'Lipid bilayer jisme ergosterol hota hai. Azole dawa (fluconazole) ergosterol banana rokti hai; amphotericin B ergosterol se bandhkar chhed kar deti hai.', 1, 'memb');
  A.add(new T.BoxGeometry(.12, 4, 3.4), 0xf0c070, -.5, 0, 0, { op: .7, cut: 1 }, PB);
  dots(A, PB, 16, () => [-.5, rr(-1.8, 1.8), -rr(0, 1.6)], 0xff7a4a, .07, .95, 1);
  const PY = A.part('Glucan synthase + pumps', 'Membrane ke andar ke enzyme complex jo glucan banakar wall mein dhakelte hain; H+-ATPase (Pma1) cell ka pH tay karta hai.');
  dots(A, PY, 6, i => [-.5, -1.4 + i * .55, -.4], 0x4ad0f0, .1, .95, 1);
  A.lab('Mannoprotein', [2.4, 2.2, 0], '#ffd090'); A.lab('Beta-glucan jaal', [.5, 2.2, 0], '#f5e0b0'); A.lab('Chitin', [-.1, -2.2, 0], '#ffffff'); A.lab('Periplasm', [-.2, 2.35, 0], '#f5e8c0'); A.lab('Membrane + ergosterol', [-1.5, 1.4, 0], '#ff7a4a'); A.lab('Glucan synthase', [-1.5, -1.3, 0], '#4ad0f0'); A.lab('Bahar', [3.0, -2.2, 0], '#e8d8b0'); A.lab('Andar (cytoplasm)', [-2.4, -2.2, 0], '#e8d8b0');
  A.go('Budding ▸', 'y_bud');
});

registerDetail('y_bud', A => {
  A.ttl('Budding'); A.cam([.8, 0, 0, 9, 13, .3, .1]);
  const PM = A.part('Mother cell', 'Bada cell: bud ke liye wall aur membrane yahin se aate hain. Har mother ~ 25 bud bana sakti hai phir budhi ho jati hai (replicative aging).', 1, 'y_wall');
  A.add(sp(1, 32, 22), 0xc89a5a, -1.4, 0, 0, { op: .2, s: [2.4, 2.0, 2.0], cut: 1 }, PM);
  const PB = A.part('Bud (beti cell)', 'Polarized growth: actin cables Golgi vesicles ko bud ke siray tak laate hain jahan Cdc42 protein bud ka jagah tay karta hai. Bud badhta hai aur ek poora cell ban jata hai.');
  A.add(sp(1, 28, 20), 0xc89a5a, 3.0, 0, 0, { op: .22, s: [1.4, 1.2, 1.2], cut: 1 }, PB);
  const PN = A.part('Bud neck + septin ring', 'Mother aur bud ke beech ka patla joda: septin proteins ka ring (diffusion barrier). Cytokinesis mein yahan chitin septum banta aur dono alag hoti hain.');
  A.add(tor(.5, .09), 0xffffff, 1.55, 0, 0, { op: .95, r: [0, PI / 2, 0], cut: 1 }, PN); A.add(tor(.55, .09), 0xffffff, 1.35, 0, 0, { op: .95, r: [0, PI / 2, 0], cut: 1 }, PN);
  const PNC = A.part('Nucleus (khinchta hua)', 'Anaphase mein nucleus neck se pichakkar do hissa hota hai: ek mother mein, ek bud mein (closed mitosis).', 1, 'nuc');
  A.add(sp(1, 24, 18), 0x9b6bd8, -.2, 0, -.2, { op: .8, s: [1.2, .6, .6], cut: 1 }, PNC); A.add(sp(1, 24, 18), 0x9b6bd8, 3.0, 0, -.2, { op: .8, s: [.7, .6, .6], cut: 1 }, PNC);
  A.tube([[.5, 0, -.2], [1.4, 0, -.2], [2.4, 0, -.2]], .09, 0x9b6bd8, PNC, .8, { cut: 1 });
  const PS = A.part('Spindle microtubules', 'SPB se nikalkar chromosome ko dono taraf khinchte hain. Kinetochore se judkar sister chromatids ko alag karte hain.', 1, 'y_spb');
  A.tube([[-.8, 0, -.2], [.5, .05, -.2], [1.7, 0, -.2], [2.6, 0, -.2]], .03, 0xffe08a, PS, .95, { cut: 1 });
  A.tube([[-.8, .1, -.2], [.5, .2, -.2], [1.7, .12, -.2], [2.6, .05, -.2]], .03, 0xffe08a, PS, .95, { cut: 1 });
  const PA = A.part('Actin cables + vesicles', 'Actin ki patli reyl bud ki taraf: myosin V Golgi vesicles ko isi par kheench kar bud ke tip tak pahunchata hai: nayi membrane aur wall wahin judti hai.', 1, 'golgi');
  A.tube([[-2.5, .8, .3], [-.5, .9, .3], [1.5, .6, .3], [3.4, .5, .3]], .04, 0x4ad0a0, PA, .95, { cut: 1 });
  A.flow([[-2.4, .85, .3], [-.5, .95, .3], [1.5, .65, .3], [3.5, .55, .3]], 0xffee44, 7, .12, .09);
  const PMT = A.part('Mitochondria + vacuole ka batwara', 'Mother se mitochondria aur vacuole ka hissa bud mein jaata hai (inheritance): bina iske beti cell jee nahi sakti.', 1, 'mit');
  A.add(sp(1, 14, 10), 0xe0504a, 2.4, -.5, .2, { op: .9, s: [.45, .2, .2], cut: 1 }, PMT); A.add(sp(1, 14, 10), 0xe0504a, -1.9, -.9, .2, { op: .9, s: [.45, .2, .2], cut: 1 }, PMT);
  const PV = A.part('Vacuole', 'Mother se bud mein vacuole ke tubule/vesicle jaate hain; baad mein wahan naya bada vacuole banta hai.', 1, 'y_vac');
  A.add(sp(1, 20, 14), 0x5ab0e8, -1.8, -.6, .1, { op: .5, s: [.9, .7, .7], cut: 1 }, PV); A.add(sp(1, 20, 14), 0x5ab0e8, 3.3, -.4, .15, { op: .5, s: [.4, .3, .3], cut: 1 }, PV);
  A.lab('Mother cell', [-2.5, 2.2, 0], '#c89a5a'); A.lab('Bud', [3.0, 1.6, 0], '#c89a5a'); A.lab('Septin ring (neck)', [1.4, 1.1, 0], '#ffffff'); A.lab('Nucleus baant raha', [.4, -.85, 0], '#9b6bd8'); A.lab('Spindle', [1.4, .3, 0], '#ffe08a'); A.lab('Actin cable + vesicle', [.2, 1.35, 0], '#4ad0a0'); A.lab('Mitochondria jaate', [2.4, -1.0, 0], '#e0504a'); A.lab('Vacuole', [-1.8, -1.45, 0], '#5ab0e8');
  A.go('Spindle pole body ▸', 'y_spb');
});

registerDetail('y_vac', A => {
  A.ttl('Yeast vacuole'); A.cam([0, 0, 0, 8, 12, .3, .15]);
  const PT = A.part('Tonoplast', 'Vacuole ki single membrane: V-ATPase se andar ka pH ~ 5-6 (cytosol 7). Isse bana H+ gradient amino acid ko andar kheenchta hai.');
  A.add(sp(1, 34, 24), 0x7ac8f5, 0, 0, 0, { op: .17, s: [2.8, 2.2, 2.2], cut: 1 }, PT);
  const PL = A.part('Hydrolases (protease A, B, CPY)', 'Acidic pH par chalne wale enzyme (lysosome jaise): protein, RNA, lipid todte hain aur recycle karte hain.');
  dots(A, PL, 14, () => K.inSph(1.8, -.1).map((v, i) => i === 0 ? v * 1.5 : v), 0xffee66, .09, .95, 1);
  const PA = A.part('V-ATPase (proton pump)', 'ATP tod kar H+ vacuole mein bharta hai. Bina iske vacuole aur cell mar jate hain (vma mutants).');
  dots(A, PA, 10, i => { const a = i * PI * 2 / 10; return [2.8 * Math.cos(a), 2.2 * Math.sin(a), 0]; }, 0xff7a4a, .12, .95, 0);
  const PP = A.part('Polyphosphate + amino acid store', 'Vacuole mein poly-phosphate (phosphorus ka bhandar), arginine, lysine jaise amino acid aur ion (Ca2+, Zn2+) jama rehte hain.');
  dots(A, PP, 12, () => K.inSph(1.9, -.4).map((v, i) => i === 0 ? v * 1.4 : v), 0xff9ab8, .1, .9, 1);
  const PAU = A.part('Autophagosome (kachra delivery)', 'Purane organelle double membrane mein ghir kar vacuole se milte hain (autophagy): bhookh lagne par yeast khud ko recycle karke jeeta hai. Ohsumi ne yeast mein ye khoja.');
  A.add(sp(1, 16, 12), 0xaaffaa, -2.2, 1.7, 0, { op: .35, s: [.5, .5, .5] }, PAU); A.add(sp(1, 12, 10), 0xe0504a, -2.2, 1.7, 0, { op: .9, s: [.2, .12, .12] }, PAU);
  A.flow([[-2.4, 2.5, 0], [-2.0, 1.9, 0], [-1.6, 1.3, 0]], 0xaaffaa, 4, .1, .07);
  const PF = A.part('Fusion (HOPS + SNAREs)', 'Vacuole ke tukde milne ke liye Rab Ypt7 + HOPS complex + SNARE: bud banne par vacuole ke chhote tukde ek bade vacuole mein mil jaate hain.');
  A.add(tor(.35, .07), 0xffffff, 2.3, -1.4, 0, { op: .9, r: [0, 0, 0] }, PF);
  A.lab('Tonoplast', [2.4, 1.9, 0], '#7ac8f5'); A.lab('Hydrolases', [-.5, .8, 0], '#ffee66'); A.lab('V-ATPase', [2.8, .3, 0], '#ff7a4a'); A.lab('Polyphosphate', [.7, -.9, 0], '#ff9ab8'); A.lab('Autophagosome', [-2.2, 2.2, 0], '#aaffaa'); A.lab('Fusion', [2.3, -1.9, 0], '#ffffff');
  A.go('Budding ▸', 'y_bud');
});

registerDetail('y_spb', A => {
  A.ttl('Spindle pole body'); A.cam([0, 0, 0, 7, 10, .3, .1]);
  const PE = A.part('Nuclear envelope', 'Do membrane ka nuclear parda: SPB isme ghusa rehta hai. Closed mitosis mein envelope poore mitosis mein tootta nahi.', 1, 'nuc');
  A.add(new T.BoxGeometry(5.5, .12, 3.6), 0x9b6bd8, 0, 0, 0, { op: .45, cut: 1 }, PE); A.add(new T.BoxGeometry(5.5, .12, 3.6), 0x9b6bd8, 0, -.32, 0, { op: .45, cut: 1 }, PE);
  const PO = A.part('Outer plaque (cytoplasmic)', 'Cytoplasm ki taraf ka layer: cytoplasmic (astral) microtubules ko bandhta hai jo spindle ko bud ki taraf ghumane mein madad karte hain.');
  A.add(new T.CylinderGeometry(.9, .9, .18, 24), 0xff7a4a, 0, 1.0, 0, { op: .95, cut: 1 }, PO);
  const PC = A.part('Central plaque', 'Beech ka layer jo nuclear envelope mein dhansa hai; Spc42 protein ka lattice isse kayam rakhta hai.');
  A.add(new T.CylinderGeometry(.9, .9, .22, 24), 0xff9a4a, 0, .55, 0, { op: .95, cut: 1 }, PC);
  A.add(new T.CylinderGeometry(.9, .9, .18, 24), 0xff7a4a, 0, .25, 0, { op: .95, cut: 1 }, PC);
  const PI2 = A.part('Inner plaque (nuclear)', 'Nucleus ki taraf: spindle (nuclear) microtubules ke gamma-tubulin complex (Spc97/98/110) isi se microtubules ugate hain.');
  A.add(new T.CylinderGeometry(.9, .9, .16, 24), 0xff7a4a, 0, -.7, 0, { op: .95, cut: 1 }, PI2);
  A.add(new T.CylinderGeometry(.45, .45, .08, 20), 0xffd36a, -.9, 1.0, 0, { op: .95, r: [0, 0, 0], cut: 1 }, PO);
  const PS = A.part('Half-bridge (duplication ka sthaan)', 'SPB ke baju ka patla bridge: yahan nayi SPB banti hai (G1 mein) aur S phase mein dono alag hoti hain. SPB sirf ek baar duplicate hota hai.');
  A.add(new T.BoxGeometry(.5, .14, .5), 0xffe08a, 1.2, .1, 0, { op: .95, cut: 1 }, PS);
  A.add(new T.CylinderGeometry(.5, .5, .3, 20), 0xffb870, 1.9, -.05, 0, { op: .7, cut: 1 }, PS);
  const PM = A.part('Microtubules', 'Nuclear microtubule (spindle ke) chromosome ke kinetochore se judte hain; cytoplasmic microtubule bud ki taraf spindle ko khinchte hain.');
  for (let i = 0; i < 6; i++) A.tube([[(i - 2.5) * .25, -.7, 0], [(i - 2.5) * .5, -1.5, (i % 2 ? .1 : -.1)], [(i - 2.5) * .8, -2.5, 0]], .035, 0xffe08a, PM, .95, { cut: 1 });
  for (let i = 0; i < 3; i++) A.tube([[(i - 1) * .3, 1.1, 0], [(i - 1) * .7, 1.9, 0], [(i - 1) * 1.1, 2.7, 0]], .035, 0xaae8ff, PM, .95, { cut: 1 });
  A.flow([[0, -1.0, 0], [0, -1.8, 0], [.3, -2.6, 0]], 0xffee44, 4, .1, .06);
  A.lab('Outer plaque', [1.1, 1.25, 0], '#ff7a4a'); A.lab('Central plaque', [1.1, .55, 0], '#ff9a4a'); A.lab('Inner plaque', [1.1, -.7, 0], '#ff7a4a'); A.lab('Nuclear envelope', [-2.5, 0, 0], '#9b6bd8'); A.lab('Half-bridge', [1.9, .55, 0], '#ffe08a'); A.lab('Spindle microtubules', [-1.1, -2.1, 0], '#ffe08a'); A.lab('Astral microtubules', [-1.2, 2.3, 0], '#aae8ff'); A.lab('Cytoplasm', [-2.6, 1.6, 0], '#f5e0b0'); A.lab('Nucleoplasm', [-2.6, -1.2, 0], '#b89ae0');
  A.go('Budding ▸', 'y_bud');
});
})();
/* END OF FILE yeast-detail.js */
