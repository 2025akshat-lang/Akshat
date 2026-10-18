/* MUSCLE detail views: m_sarc, m_xb, m_triad, m_nmj */
(() => {
if (typeof registerDetail === 'undefined') throw new Error('04-detail-viewer.js purana hai (registerDetail nahi mila): naya 04-detail-viewer.js upload karo');
const PI = Math.PI, K = CVKit, rr = K.rr, dots = K.dots;

registerDetail('m_sarc', A => {
  A.ttl('Sarcomere'); A.cam([0, 0, 0, 9, 13, .2, .1]);
  const g1 = new T.Group(), g2 = new T.Group(); A.root().add(g1); A.root().add(g2);
  const PZ = A.part('Z discs', 'Sarcomere ki seema: alpha-actinin se patli filaments (actin) ke sire yahin jude hote hain. Contraction mein dono Z discs paas aate hain.');
  const PA = A.part('Thin filaments (actin + tropomyosin + troponin)', 'F-actin ki double helix; uspar tropomyosin ki rassi aur troponin (C, I, T). Ca2+ troponin C se judta hai to tropomyosin hat kar myosin ke liye jagah kholti hai.', 1, 'm_xb');
  const PT = A.part('Thick filament (myosin)', 'Beech ka moti filament: ~ 300 myosin molecules ki poonch ek saath, sir (heads) bahar nikle hue. Dono taraf se sire ki taraf; beech mein M line jahan sirf poonch.', 1, 'm_xb');
  const PTI = A.part('Titin', 'Sabse bada protein (~ 3 MDa): Z disc se M line tak lachili spring jaisi rassi; thick filament ko beech mein rakhti hai aur stretch ke baad muscle ko wapas laati hai.');
  const PM = A.part('M line', 'Sarcomere ke beech ki line: myomesin + creatine kinase; thick filaments ko jodkar rakhti hai.');
  [-1, 1].forEach((sd, gi) => { const g = gi ? g2 : g1;
    A.add(new T.CylinderGeometry(.05, .05, 2.8, 8), 0xffffff, sd * 3.0, 0, 0, { op: .95, g, s: [1, 1, 1] }, PZ);
    A.add(new T.BoxGeometry(.18, 3.0, 2.6), 0xffffff, sd * 3.0, 0, 0, { op: .85, g, cut: 1 }, PZ);
    for (let i = 0; i < 6; i++) { const y = -1.0 + i * .4, z = -.3 - (i % 2) * .5; A.add(new T.CylinderGeometry(.06, .06, 2.4, 8), 0x7ac8f5, sd * 1.9, y, z, { op: .95, r: [0, 0, PI / 2], g, cut: 1 }, PA);
      for (let j = 0; j < 8; j++) A.add(sp(.06, 6, 5), 0xc8e4ff, sd * (.75 + j * .3), y, z, { op: .95, g, cut: 1 }, PA);
      A.tube([[sd * .7, y + .08, z], [sd * 1.6, y - .08, z], [sd * 2.6, y + .08, z]], .02, 0xffd04a, PA, .9, { g, cut: 1 }); A.add(sp(.09, 8, 6), 0xff7a4a, sd * 1.6, y - .1, z, { op: 1, g, cut: 1 }, PA); }
    A.tube([[sd * 3.0, .0, -1.15], [sd * 2.0, .12, -1.15], [sd * 1.0, 0, -1.15]], .03, 0x4ad0a0, PTI, .9, { g, cut: 1 }); });
  for (let i = 0; i < 5; i++) { const y = -.8 + i * .4, z = -.2 - (i % 2) * .6; A.add(new T.CylinderGeometry(.11, .11, 3.2, 10), 0xe04a4a, 0, y, z, { op: .95, r: [0, 0, PI / 2], cut: 1 }, PT);
    for (let j = 0; j < 7; j++) { const x = -1.3 + j * .4; if (Math.abs(x) > .25) A.bar([x, y, z], [x + (x > 0 ? .08 : -.08), y + .22, z], .035, 0xff9a9a, PT, .95, { cut: 1 }); } }
  A.add(new T.BoxGeometry(.1, 2.2, 2.0), 0xffd04a, 0, 0, -.7, { op: .7, cut: 1 }, PM);
  const PB = A.part('A band / I band / H zone', 'A band = poora thick filament (anisotropic, gehra); I band = sirf thin (isotropic, halka); H zone = A band ka beech jahan sirf thick. Contraction mein A same, I aur H chhote.');
  A.add(new T.BoxGeometry(3.2, .06, .06), 0xe04a4a, 0, -1.75, 0, { op: .95 }, PB); A.add(new T.BoxGeometry(2.0, .06, .06), 0xffd04a, 0, 1.85, 0, { op: .95 }, PB);
  A.add(new T.BoxGeometry(2.6, .06, .06), 0xf8c8d0, -2.3, -1.75, 0, { op: .95, s: [.55, 1, 1] }, PB); A.add(new T.BoxGeometry(2.6, .06, .06), 0xf8c8d0, 2.3, -1.75, 0, { op: .95, s: [.55, 1, 1] }, PB);
  A.tick((dt, t) => { const d = .45 * (.5 + .5 * Math.sin(t * 1.4)); g1.position.x = d; g2.position.x = -d; });
  A.lab('Z disc', [-3.0, 1.85, 0], '#ffffff'); A.lab('Z disc', [3.0, 1.85, 0], '#ffffff'); A.lab('Thin (actin)', [-1.9, -1.35, 0], '#7ac8f5'); A.lab('Thick (myosin)', [0, -1.25, 0], '#e04a4a'); A.lab('M line', [0, 1.35, 0], '#ffd04a'); A.lab('Titin', [-2.0, .25, 0], '#4ad0a0'); A.lab('Troponin', [1.6, .95, 0], '#ff7a4a'); A.lab('A band', [0, -2.1, 0], '#e04a4a'); A.lab('I band', [-2.3, -2.1, 0], '#f8c8d0'); A.lab('H zone', [0, 2.15, 0], '#ffd04a');
  A.go('Cross-bridge cycle ▸', 'm_xb');
});

registerDetail('m_xb', A => {
  A.ttl('Cross-bridge cycle'); A.cam([0, 0, 0, 8, 11.5, .05, .08]);
  const PA = A.part('Actin filament + tropomyosin', 'Actin ke beads ki double chain; tropomyosin rassi Ca2+ nahi to myosin-bandhne ke sthan dhak deti hai (relaxed). Ca2+ aane par hat jati hai.');
  A.tube([[-4, -.6, -.2], [-1, -.6, -.2], [2, -.6, -.2], [4, -.6, -.2]], .08, 0x7ac8f5, PA, .95, { cut: 1 });
  for (let i = 0; i < 20; i++) A.add(sp(.12, 8, 6), 0x7ac8f5, -3.8 + i * .4, -.6, -.2, { op: .95, cut: 1 }, PA);
  A.tube([[-4, -.45, -.3], [-2, -.75, -.3], [0, -.45, -.3], [2, -.75, -.3], [4, -.45, -.3]], .035, 0xffd04a, PA, .9, { cut: 1 });
  const PT = A.part('Troponin complex', 'Troponin C (Ca2+ ko pakadta), I (rokta), T (tropomyosin se jodta). Ca2+ judne par complex khulta aur tropomyosin hat jati hai.');
  [-3, 0, 3].forEach(x => A.add(sp(.18, 10, 8), 0xff7a4a, x, -.35, -.35, { op: 1, cut: 1 }, PT));
  const PC = A.part('Ca2+', 'SR se nikla Ca2+ cytosol mein 10 nM se ~ 10 uM tak: contraction ka switch. SERCA pump wapas SR mein dalte hain: relaxation.');
  dots(A, PC, 8, i => [-3.2 + i * .9, rr(-.1, .4), -.5], 0xffee44, .09, 1, 1);
  const PM = A.part('Myosin heads (5 avasthayen)', '1: Rigor: head actin se juda (ADP+Pi nahi). 2: ATP judta: head actin se chhoot gaya. 3: ATP -> ADP+Pi: head "cocked" (90 degree). 4: Head naye actin se judta, Pi nikalta. 5: Power stroke: head jhukta, actin ~ 10 nm kheencha, ADP nikalta: wapas 1.');
  const stages = [[-3.2, .5, 0xff6a6a], [-1.9, .8, 0xffb0a0], [-.6, .9, 0xff9a4a], [.7, .7, 0xffd04a], [2.0, .3, 0xff6a6a]];
  A.add(new T.CylinderGeometry(.14, .14, 9, 10), 0xe04a4a, 0, 1.55, -.1, { op: .95, r: [0, 0, PI / 2], cut: 1 }, PM);
  const heads = stages.map((s, i) => { A.bar([s[0], 1.55, -.1], [s[0] + (i === 2 ? .2 : i === 3 ? .1 : 0), 1.0, -.1], .035, 0xffa0a0, PM, .95, { cut: 1 }); return A.add(sp(.24, 12, 10), s[2], s[0] + (i === 2 ? .2 : i === 3 ? .1 : 0), s[1] + .25 - (i === 0 || i === 4 ? 0 : .05), -.1, { op: .98, s: [1, .8, .8], cut: 1 }, PM); });
  heads[0].position.y = -.2; heads[4].position.y = -.2; heads[0].position.x = -3.0; heads[4].position.x = 1.9;
  const PAT = A.part('ATP', 'Myosin ka ATPase: ATP judne se head actin se chhootta hai (rigor mortis mein ATP khatam, isliye muscle akad jati hai). Ek cycle ~ 1 ATP.');
  A.add(sp(.15, 10, 8), 0xffee44, -2.0, 2.0, -.1, { op: 1 }, PAT); A.add(sp(.13, 8, 6), 0xff5a5a, -.6, 2.0, -.1, { op: 1 }, PAT); A.add(sp(.08, 8, 6), 0xffffff, -.35, 2.0, -.1, { op: 1 }, PAT);
  A.flow([[-2.2, 2.4, 0], [-2.0, 2.1, 0], [-1.9, 1.3, 0]], 0xffee44, 3, .1, .07);
  A.flow([[2.0, .3, 0], [1.2, .3, 0], [-.4, .3, 0]], 0x4ad0ff, 4, .08, .05);
  A.tick((dt, t) => { const s = .5 + .5 * Math.sin(t * 2); heads[3].position.x = .1 + .7 - s * .6; });
  A.lab('1 Rigor', [-3.0, -1.2, 0], '#ff6a6a'); A.lab('2 ATP judta, detach', [-1.9, 1.95, 0], '#ffb0a0'); A.lab('3 Cocked (ADP+Pi)', [-.5, 2.35, 0], '#ff9a4a'); A.lab('4 Cross-bridge', [.8, -1.2, 0], '#ffd04a'); A.lab('5 Power stroke', [2.1, -1.2, 0], '#ff6a6a'); A.lab('Tropomyosin', [-1.6, -1.15, 0], '#ffd04a'); A.lab('Troponin', [3.0, -1.0, 0], '#ff7a4a'); A.lab('Ca2+ switch', [-3.2, .6, 0], '#ffee44'); A.lab('Thick filament', [-3.8, 1.9, 0], '#e04a4a'); A.lab('Actin', [3.5, -1.35, 0], '#7ac8f5');
  A.go('Sarcomere ▸', 'm_sarc');
});

registerDetail('m_triad', A => {
  A.ttl('Triad (T-tubule + SR)'); A.cam([0, 0, 0, 8, 11.5, .25, .15]);
  const PS = A.part('Sarcolemma', 'Fibre ki bahari membrane: action potential yahin se T-tubule mein jaata hai.', 1, 'memb');
  A.add(new T.BoxGeometry(7.0, .2, 3.6), 0xe08a7a, 0, 2.2, 0, { op: .6, cut: 1 }, PS);
  const PT = A.part('T-tubule (transverse tubule)', 'Sarcolemma ki andar ghusi nali jo fibre ke andar tak jaati hai: action potential ko poore fibre mein ek saath pahunchati hai taaki saari myofibrils ek saath sikudein. Isme extracellular fluid hota hai.');
  A.add(new T.CylinderGeometry(.35, .35, 4.4, 18), 0x4ad0ff, 0, 0, -.2, { op: .6, cut: 1 }, PT);
  const PC = A.part('Terminal cisternae (SR)', 'T-tubule ke dono taraf SR ke phule hue sire: Ca2+ ka bhandar (calsequestrin se bandha, ~ 1 mM). T-tubule + 2 cisternae = triad.');
  [-1.0, 1.0].forEach(x => { A.add(sp(1, 20, 14), 0xffd04a, x * 1.15, -.1, -.2, { op: .5, s: [.55, 1.5, 1.1], cut: 1 }, PC); dots(A, PC, 5, () => [x * 1.15 + rr(-.25, .25), rr(-1.0, 1.0), -rr(.05, .6)], 0xff9a3c, .06, .95, 1); });
  const PD = A.part('DHPR (voltage sensor) + RyR1 (Ca2+ channel)', 'T-tubule ki DHPR voltage badalte hi aakar badalti hai aur seedhe SR ke RyR1 channel ko khol deti hai (skeletal muscle mein physical coupling); Ca2+ SR se cytosol mein behta hai. Dil mein CICR hota hai.');
  [-.5, -.15, .2].forEach(y => { [-1, 1].forEach(sd => { A.add(new T.CylinderGeometry(.08, .08, .5, 8), 0xff5a5a, sd * .5, y * 1.8, -.2, { op: .95, r: [0, 0, PI / 2], cut: 1 }, PD); A.add(sp(.12, 10, 8), 0x8a4aff, sd * .7, y * 1.8, -.2, { op: 1, cut: 1 }, PD); }); });
  const PCA = A.part('Ca2+ release', 'RyR khulne par Ca2+ cytosol mein ~ 100 guna badh jata hai aur troponin C se judta hai: contraction shuru.');
  [-1, 1].forEach(sd => A.flow([[sd * 1.3, .7, -.1], [sd * 1.8, 1.2, -.1], [sd * 2.8, 1.5, -.1]], 0xffee44, 6, .1, .08));
  const PP = A.part('SERCA pump', 'SR ki ATPase pump: 2 Ca2+ per ATP wapas SR mein: relaxation. Dil aur muscle ke ATP ka bada hissa yahin lagta hai.');
  dots(A, PP, 8, i => [i < 4 ? -2.2 + i * .35 : 1.4 + (i - 4) * .35, -1.1, -.2], 0x4ad0a0, .1, .95, 1);
  const PAP = A.part('Action potential (voltage)', 'Sarcolemma par chalta hua depolarization (+30 mV tak) T-tubule mein bhi pahunchta hai: Na+ channels yahan hote hain.');
  A.flow([[-3.4, 2.1, -.1], [-1.5, 2.1, -.1], [-.2, 1.8, -.1], [0, .6, -.1], [0, -1.0, -.1]], 0xff4a4a, 8, .1, .09);
  A.lab('Sarcolemma', [-2.8, 2.5, 0], '#e08a7a'); A.lab('T-tubule', [.45, 1.5, 0], '#4ad0ff'); A.lab('Terminal cisterna (SR)', [-2.4, -.2, 0], '#ffd04a'); A.lab('Terminal cisterna (SR)', [2.4, -.2, 0], '#ffd04a'); A.lab('DHPR / RyR1', [.1, -.2, 0], '#ff5a5a'); A.lab('Ca2+ nikla', [2.8, 1.9, 0], '#ffee44'); A.lab('SERCA', [-1.8, -1.45, 0], '#4ad0a0'); A.lab('Action potential', [-3.3, 1.65, 0], '#ff4a4a');
  A.go('Sarcomere ▸', 'm_sarc');
});

registerDetail('m_nmj', A => {
  A.ttl('Neuromuscular junction'); A.cam([0, .3, 0, 8.5, 12, .25, .15]);
  const PN = A.part('Motor neuron terminal', 'Axon ka phoola hua sira: bahut mitochondria aur ~ 300,000 vesicle. Schwann cell ke cap se dhaka.', 1, 'n_syn');
  A.add(sp(1, 28, 20), 0xc9b2ff, 0, 2.0, 0, { op: .3, s: [2.8, 1.1, 1.5], cut: 1 }, PN);
  A.add(new T.CylinderGeometry(.5, .5, 2.2, 14), 0xc9b2ff, 0, 3.8, 0, { op: .35, cut: 1 }, PN);
  const PV = A.part('Synaptic vesicles (ACh)', 'Har vesicle mein ~ 10,000 acetylcholine. Ca2+ aane par SNARE se active zone par membrane se milkar ACh cleft mein chhoda jata hai (quantal release).', 1, 'n_syn');
  dots(A, PV, 24, () => { const p = K.inSph(1, -.1); return [p[0] * 2.3, 1.9 + p[1] * .8, p[2] * 1.2]; }, 0xffd04a, .1, .95, 1);
  const PCA = A.part('Voltage-gated Ca2+ channel', 'Action potential aane par khulta hai, Ca2+ andar aata hai (active zone par): ye vesicle fusion ka trigger hai.');
  dots(A, PCA, 6, i => [-1.4 + i * .55, 1.12, -.2], 0xff5a5a, .1, .95, 1);
  const PC = A.part('Synaptic cleft + basal lamina', 'Beech ki ~ 50 nm khai jisme basal lamina (collagen IV, laminin, agrin) hai aur AChE enzyme ACh ko ~ ms mein tod deta hai.');
  A.add(new T.BoxGeometry(5.0, .22, 3.0), 0xffe8a0, 0, .72, 0, { op: .45, cut: 1 }, PC);
  const PE = A.part('Acetylcholinesterase (AChE)', 'Cleft mein ACh ko acetate + choline mein todta hai taaki signal band ho: nerve gas (sarin) aur kuch dawai AChE rokte hain, muscle akad jati hai.');
  dots(A, PE, 8, i => [-1.9 + i * .55, .75, -.2], 0x4ad0a0, .09, .95, 1);
  const PR = A.part('Nicotinic ACh receptor (AChR)', 'Ligand-gated Na+ channel (5 subunits: alpha2 beta gamma/epsilon delta). 2 ACh judne par khulta hai: Na+ andar, endplate potential. Myasthenia gravis mein antibody inhe nasht karti hai.');
  [-1.9, -1.0, -.1, .8, 1.7].forEach(x => { A.add(new T.CylinderGeometry(.14, .14, .5, 10), 0x5a8ae8, x, .25, -.2, { op: .95, cut: 1 }, PR); A.add(new T.CylinderGeometry(.06, .06, .5, 8), 0x203a88, x, .25, -.2, { op: 1, cut: 1 }, PR); });
  const PF = A.part('Junctional folds', 'Muscle ki membrane ke gehre fold: AChR sire par jama, Na+ channel gehrai mein: surface badhta hai aur signal aasani se action potential bana deta hai.');
  for (let i = 0; i < 5; i++) { A.add(new T.BoxGeometry(.25, .8, 2.6), 0xe08a7a, -1.9 + i * .9, -.1, 0, { op: .55, cut: 1 }, PF); A.add(new T.BoxGeometry(.5, .16, 2.6), 0xe08a7a, -1.9 + i * .9 + .45, .3, 0, { op: .3, cut: 1 }, PF); }
  const PM = A.part('Muscle fibre (endplate)', 'Fibre ka motor endplate: yahan ka Na+ ka rukh andar action potential shuru karta hai jo T-tubule se poore fibre mein jata hai.', 1, 'm_triad');
  A.add(new T.BoxGeometry(5.6, 2.2, 3.4), 0xf5b0a0, 0, -1.3, 0, { op: .28, cut: 1 }, PM);
  A.flow([[-.2, 1.7, -.2], [-.2, 1.1, -.2], [-.1, .6, -.2], [-.1, .2, -.2]], 0xffd04a, 8, .12, .09);
  A.flow([[0, .6, 0], [0, -.2, 0], [0, -1.0, 0]], 0xff5a5a, 5, .1, .07);
  A.lab('Axon terminal', [-1.8, 3.1, 0], '#c9b2ff'); A.lab('ACh vesicles', [-2.3, 2.0, 0], '#ffd04a'); A.lab('Ca2+ channel', [-1.7, 1.45, 0], '#ff5a5a'); A.lab('Synaptic cleft', [2.7, .72, 0], '#ffe8a0'); A.lab('AChE', [-2.4, 1.0, 0], '#4ad0a0'); A.lab('ACh receptor', [2.4, .2, 0], '#5a8ae8'); A.lab('Junctional folds', [-1.9, -.8, 0], '#e08a7a'); A.lab('ACh cleft mein', [.6, 1.4, 0], '#ffd04a'); A.lab('Na+ andar', [.8, -.4, 0], '#ff5a5a'); A.lab('Muscle fibre', [0, -2.2, 0], '#f5b0a0');
  A.go('Triad ▸', 'm_triad');
});
})();
/* END OF FILE muscle-detail.js */
