
(() => {
if (typeof registerDetail === 'undefined') throw new Error('04-detail-viewer.js purana hai (registerDetail nahi mila): naya 04-detail-viewer.js upload karo');
const PI = Math.PI, K = CVKit, rr = K.rr, dots = K.dots;


registerDetail('s_head', A => {
  A.ttl('Sperm head'); A.cam([.3, 0, 0, 9, 13, .3, .12]);
  const PM = A.part('Plasma membrane', 'Head ko gherti membrane. Capacitation ke baad cholesterol hat jata hai aur membrane fusion ke liye taiyar hoti hai. Isme zona-binding receptors aur IZUMO1 (egg se fusion ka protein) hote hain.');
  A.add(sp(1, 32, 24), 0xaed8ff, 0, 0, 0, { op: .13, s: [2.65, 1.75, 1.15], cut: 1 }, PM);
  const PA = A.part('Acrosome (enzyme cap)', 'Golgi se bana vesicle jo nucleus ke agle ~40-70% hisse ko topi ki tarah dhakta hai. Andar hyaluronidase, acrosin (serine protease) aur anya hydrolytic enzymes. Egg ke zona pellucida ko khodne mein kaam aate hain.', 1, 's_acro');
  A.add(new T.SphereGeometry(1, 32, 20, 0, 6.283, 0, 1.15), 0x7fd6ff, .15, 0, 0, { op: .5, s: [1.8, 2.7, 1.2], r: [0, 0, -PI / 2], cut: 1 }, PA);
  dots(A, PA, 30, () => { let p; do { p = [rr(.5, 2.4), rr(-1.4, 1.4), -rr(0, .9)]; } while (Math.hypot(p[0] / 2.5, p[1] / 1.6, p[2] / 1.0) > .85); return p; }, 0xffee66, .06, .95, 1);
  const PN = A.part('Nucleus (haploid, ghana)', 'Sirf 23 chromosome. DNA histone ki jagah protamine se bandha hota hai aur ~50 kb ke chhote donut (toroid) mein pack hota hai: nucleus ek normal cell se ~10 guna chhota. Transcription band hai.', 1, 'nuc');
  A.add(sp(1, 32, 24), 0x3a56c8, -.5, 0, 0, { op: .78, s: [2.0, 1.35, .85], cut: 1 }, PN);
  A.inst(new T.TorusGeometry(.12, .045, 6, 12), 0x9fb4ff, [...Array(18)].map(() => { const p = K.inSph(1, -.03); return [p[0] * 1.8 - .5, p[1] * 1.2, p[2] * .75]; }), PN, .95, null, 1);
  const PE = A.part('Equatorial segment', 'Acrosome ke peeche ka patla band. Acrosome reaction ke baad yahi hissa egg ki membrane se sabse pehle fuse hota hai (IZUMO1 + egg ka JUNO receptor). Isi band par antibody lagne se fertilisation ruk jata hai.');
  A.tube([...Array(25)].map((_, i) => { const a = i / 24 * PI * 2; return [.85, 1.6 * Math.cos(a), 1.04 * Math.sin(a)]; }), .035, 0xffffff, PE, .95, { cl: true });
  const PP = A.part('Post-acrosomal sheath', 'Nucleus ke peeche ka cytoskeletal hissa. Isme PLC-zeta (PLCζ) hota hai jo egg ke andar Ca2+ ki lehrein shuru karke egg ko activate karta hai.');
  A.add(sp(1, 24, 16), 0xb8c8ff, -1.55, 0, 0, { op: .35, s: [.9, 1.0, .65], cut: 1 }, PP);
  const PB = A.part('Basal plate + implantation fossa', 'Nucleus ke peeche ka gaddha jisme neck ka proximal centriole baithta hai. Yahan se tail judti hai.', 1, 'cen');
  A.add(new T.CylinderGeometry(.4, .22, .45, 14), 0xf0c040, -2.7, 0, 0, { op: .9, r: [0, 0, PI / 2], cut: 1 }, PB);
  A.tube([[-2.9, 0, 0], [-3.5, 0, 0], [-4.2, 0, 0]], .1, 0x7fd6c2, PB, .85);
  A.flow([[1.5, 0, -.2], [2.2, 0, -.2], [3.2, 0, -.2]], 0xffee66, 5, .1, .05);
  A.lab('Acrosome', [1.5, 1.7, 0], '#7fd6ff'); A.lab('Nucleus (protamine DNA)', [-.5, -1.5, 0], '#3a56c8'); A.lab('Equatorial segment', [.9, -1.95, 0], '#ffffff'); A.lab('Post-acrosomal sheath', [-1.7, 1.45, 0], '#b8c8ff'); A.lab('Plasma membrane', [-2.0, -1.2, 0], '#aed8ff'); A.lab('Implantation fossa', [-2.9, .75, 0], '#f0c040'); A.lab('Enzyme release', [3.2, .5, 0], '#ffee66'); A.lab('DNA toroid', [-.2, .25, 0], '#9fb4ff');
  A.go('Acrosome reaction ▸', 's_acro');
});


registerDetail('s_mid', A => {
  A.ttl('Sperm midpiece'); A.cam([-.6, 0, 0, 10, 14, .25, .12]);
  const PM = A.part('Plasma membrane', 'Midpiece ko gherti membrane. Annulus tak ye mitochondrial sheath ko dhakti hai.');
  A.add(new T.CylinderGeometry(.9, .9, 6.4, 28, 1, true), 0xaed8ff, 0, 0, 0, { op: .15, r: [0, 0, PI / 2], cut: 1 }, PM);
  const PH = A.part('Mitochondrial helix (50-75 mitochondria)', 'Mitochondria end-to-end spiral mein axoneme ke upar lipte hote hain (~10-15 gyre). Oxidative phosphorylation se ATP banate hain; glycolysis principal piece mein bhi hota hai. Yahan kharabi se motility kam (asthenozoospermia).', 1, 'mit');
  [0, PI].forEach(off => A.tube([...Array(60)].map((_, i) => { const x = -3 + i * .1; return [x, .62 * Math.cos(x * 3.4 + off), .62 * Math.sin(x * 3.4 + off)]; }), .17, 0xc84a4a, PH, .9, { cut: 1 }));
  const PF = A.part('Outer dense fibres (9)', 'Axoneme ke 9 doublet ke bahar 9 moti keratin-jaisi fibres: tail ko mazbooti aur lachak dete hain. Fibre 3 aur 8 principal piece mein fibrous sheath ke columns se badal jati hain.');
  for (let i = 0; i < 9; i++) { const a = i * PI * 2 / 9; A.tube([[-3, .35 * Math.cos(a), .35 * Math.sin(a)], [3, .35 * Math.cos(a), .35 * Math.sin(a)]], .05, 0xffd36a, PF, .95, { cut: 1 }); }
  const PX = A.part('Axoneme (9+2) core', 'Beech mein 9 microtubule doublets + 2 central microtubules: tail ki wave ka engine. Dynein arms ATP tod kar doublets ko ek-doosre par phisalate hain (aage dekho).', 1, 's_axo');
  for (let i = 0; i < 9; i++) { const a = i * PI * 2 / 9; A.tube([[-3, .17 * Math.cos(a), .17 * Math.sin(a)], [3, .17 * Math.cos(a), .17 * Math.sin(a)]], .035, 0x7fd6c2, PX, .95, { cut: 1 }); }
  [-.05, .05].forEach(y => A.tube([[-3, y, -.02], [3, y, -.02]], .03, 0xffffff, PX, .95, { cut: 1 }));
  const PN = A.part('Annulus (septin ring)', 'Midpiece ke ant ka ring jo midpiece aur principal piece ki seema banata hai; mitochondria isse aage nahi jate. Septin protein ka bana hota hai (SEPT4 nahi to male infertility).');
  A.add(tor(.78, .08), 0xffffff, -3.3, 0, 0, { op: .95, r: [0, PI / 2, 0] }, PN);
  const PD = A.part('Cross-section (kata hua tukda)', 'Midpiece ko kaatne par: beech mein 9+2 axoneme, uske bahar 9 dense fibres, phir mitochondria ka ring aur bahar membrane.');
  A.add(new T.RingGeometry(.83, .92, 40), 0xaed8ff, -5.0, 0, 0, { op: .9 }, PD); A.add(new T.RingGeometry(.45, .78, 40), 0xc84a4a, -5.0, 0, .01, { op: .8 }, PD);
  for (let i = 0; i < 9; i++) { const a = i * PI * 2 / 9; A.add(sp(.07, 8, 6), 0xffd36a, -5.0 + .33 * Math.cos(a), .33 * Math.sin(a), .03, { op: 1 }, PD); A.add(sp(.045, 8, 6), 0x7fd6c2, -5.0 + .17 * Math.cos(a), .17 * Math.sin(a), .03, { op: 1 }, PD); }
  A.add(sp(.04, 8, 6), 0xffffff, -5.05, 0, .03, { op: 1 }, PD); A.add(sp(.04, 8, 6), 0xffffff, -4.95, 0, .03, { op: 1 }, PD);
  A.flow([[2.8, 0, -.1], [0, 0, -.1], [-3.6, 0, -.1]], 0xffe04a, 6, .1, .05);
  A.lab('Mitochondrial helix', [.2, 1.25, 0], '#c84a4a'); A.lab('9 dense fibres', [1.8, -1.3, 0], '#ffd36a'); A.lab('Axoneme 9+2', [-1.3, -1.3, 0], '#7fd6c2'); A.lab('Annulus', [-3.3, 1.2, 0], '#ffffff'); A.lab('Cross-section', [-5.0, 1.45, 0], '#e4d8ff'); A.lab('ATP tail ki taraf', [-1.6, .45, 0], '#ffe04a'); A.lab('Membrane', [2.6, 1.25, 0], '#aed8ff');
  A.go('Axoneme 9+2 ▸', 's_axo');
});


registerDetail('s_axo', A => {
  A.ttl('Axoneme (9+2)'); A.cam([0, 0, 0, 7.5, 11, 0, 0]);
  const R = 1.25, arms = [];
  const PM = A.part('Plasma membrane', 'Tail ko gherti membrane. Principal piece mein iske neeche fibrous sheath hota hai.');
  A.add(new T.RingGeometry(2.1, 2.18, 56), 0xaed8ff, 0, 0, 0, { op: .9 }, PM);
  const PFS = A.part('Fibrous sheath + dense fibres', 'Principal piece mein axoneme ke bahar ka kavach: 2 longitudinal columns + gol ribs. Mazbooti deta hai aur glycolysis ke enzyme (GAPDS) yahin jude hote hain. Bahar 9 outer dense fibres bhi.');
  A.add(new T.RingGeometry(1.85, 2.0, 56), 0xf0d060, 0, 0, .01, { op: .55 }, PFS);
  A.add(new T.BoxGeometry(.35, .2, .05), 0xf0d060, 1.92, 0, .02, { op: .95 }, PFS); A.add(new T.BoxGeometry(.35, .2, .05), 0xf0d060, -1.92, 0, .02, { op: .95 }, PFS);
  for (let i = 0; i < 9; i++) { const a = i * PI * 2 / 9 - PI / 2 + .35; A.add(sp(.09, 10, 8), 0xffd36a, 1.62 * Math.cos(a), 1.62 * Math.sin(a), .02, { op: 1 }, PFS); }
  const PD = A.part('Microtubule doublets (9)', 'Har doublet mein A tubule (poora, 13 protofilament) aur B tubule (adhura, 10 protofilament) jo A se jud kar bana hai. Tubulin alpha-beta dimer se bane hote hain; ye tail ka dhancha hain.');
  const PC = A.part('Central pair (2)', 'Beech ke 2 single microtubule + central sheath. Radial spokes se mil kar wave ke bend ka sahi direction tay karte hain.');
  const PS = A.part('Radial spokes', 'Har doublet se central sheath tak jati T-shaped baahein: dynein ki sliding ko bend mein badalti hain (bend ka niyantran).');
  const PN = A.part('Nexin links', 'Padosi doublets ko jodne wali lachili dori (nexin/DRC). Bina nexin ke dynein doublets ko bahar phisla deta; nexin sliding ko bend mein badal deta hai.');
  const PO = A.part('Outer dynein arms', 'Har doublet par A tubule se padosi B tubule tak: ATP tod kar padosi doublet ko "chalate" hain; wave ki frequency yahi tay karte hain. Kartagener syndrome mein ye missing hote hain: infertility + sinusitis.');
  const PI2 = A.part('Inner dynein arms', 'Wave ka shape aur bend ki kaaryakshamata (waveform) control karte hain; outer arms speed deti hain.');
  for (let i = 0; i < 9; i++) {
    const a = i * PI * 2 / 9 - PI / 2, c = Math.cos(a), s = Math.sin(a), cx = R * c, cy = R * s, tx = -s, ty = c;
    A.add(tor(.17, .05), 0x7fd6c2, cx, cy, 0, { op: .95 }, PD); A.add(tor(.13, .04), 0x4fb09c, cx + tx * .26 + c * .06, cy + ty * .26 + s * .06, 0, { op: .95 }, PD);
    A.bar([.5 * c, .5 * s, 0], [(R - .2) * c, (R - .2) * s, 0], .03, 0xffd36a, PS, .95);
    const a2 = a + PI * 2 / 9; A.bar([(R + .1) * Math.cos(a + .35), (R + .1) * Math.sin(a + .35), 0], [(R + .1) * Math.cos(a2 - .35), (R + .1) * Math.sin(a2 - .35), 0], .025, 0xc87ae0, PN, .95);
    const o = A.add(new T.ConeGeometry(.07, .22, 8), 0xe8504a, (R + .26) * c + tx * .16, (R + .26) * s + ty * .16, 0, { op: .95, r: [0, 0, Math.atan2(ty, tx) - PI / 2] }, PO);
    const n = A.add(new T.ConeGeometry(.05, .16, 8), 0xff9a4a, (R - .3) * c + tx * .14, (R - .3) * s + ty * .14, 0, { op: .95, r: [0, 0, Math.atan2(ty, tx) - PI / 2] }, PI2);
    arms.push(o, n);
  }
  A.add(tor(.13, .04), 0xffffff, -.15, 0, 0, { op: 1 }, PC); A.add(tor(.13, .04), 0xffffff, .15, 0, 0, { op: 1 }, PC); A.add(tor(.46, .025), 0xdddddd, 0, 0, 0, { op: .6 }, PC);
  A.tick((dt, t) => arms.forEach((m, i) => { const s = 1 + .3 * Math.sin(t * 6 + i * .7); m.scale.set(s, s, s); }));
  A.lab('9 doublets', [-1.5, 1.5, 0], '#7fd6c2'); A.lab('Central pair', [0, -.55, 0], '#ffffff'); A.lab('Radial spoke', [.55, .9, 0], '#ffd36a'); A.lab('Outer dynein arm', [1.9, 1.5, 0], '#e8504a'); A.lab('Inner dynein arm', [-1.15, -.95, 0], '#ff9a4a'); A.lab('Nexin link', [1.2, -1.45, 0], '#c87ae0'); A.lab('Fibrous sheath', [-2.2, 1.8, 0], '#f0d060'); A.lab('Membrane', [2.3, -2.2, 0], '#aed8ff');
  A.go('Midpiece (ATP ka source) ▸', 's_mid');
});


registerDetail('s_acro', A => {
  A.ttl('Acrosome reaction'); A.cam([.6, 0, 0, 9.5, 13.5, .25, .1]);
  const PZ = A.part('Zona pellucida (ZP1, ZP2, ZP3)', 'Egg ko gherti glycoprotein parat (~7-20 um). ZP3 par sperm bandhta hai aur acrosome reaction shuru hota hai; ZP2 par reaction ke baad sperm tikta hai; ZP1 jaal ko jodta hai. Fertilisation ke baad ZP2 kat jata hai (polyspermy block).');
  A.add(new T.BoxGeometry(.7, 1.3, 3), 0xf2c35a, 4.1, 1.35, 0, { op: .55, cut: 1 }, PZ); A.add(new T.BoxGeometry(.7, 1.3, 3), 0xf2c35a, 4.1, -1.35, 0, { op: .55, cut: 1 }, PZ);
  for (let i = 0; i < 8; i++) A.tube([[3.8, (i - 3.5) * .7, -.3], [4.1, (i - 3.5) * .7 + .2, -.2], [4.4, (i - 3.5) * .7, -.3]], .03, 0xffe08a, PZ, .9, { cut: 1 });
  const PN = A.part('Nucleus', 'Haploid nucleus: acrosome reaction ke baad bhi poora surakshit, sirf agla hissa khul jata hai.', 1, 's_head');
  A.add(sp(1, 28, 20), 0x3a56c8, -1.4, 0, 0, { op: .85, s: [2.0, 1.2, .8], cut: 1 }, PN);
  const PIM = A.part('Inner acrosomal membrane (khula)', 'Reaction ke baad bahar aaya andar wala parda: ZP2 se bandhta hai aur sperm ko zona mein dhakelta hai. Acrosin yahan se zona ko tod kar raasta banata hai.');
  A.add(new T.SphereGeometry(1, 28, 16, 0, 6.283, 0, 1.0), 0x7fd6ff, -.1, 0, 0, { op: .55, s: [1.25, 1.65, .85], r: [0, 0, -PI / 2], cut: 1 }, PIM);
  const PV = A.part('Fused vesicles (plasma + outer acrosomal membrane)', 'Ca2+ andar aane se plasma membrane aur outer acrosomal membrane kai jagah milkar chhote hybrid vesicles mein toot jaate hain (vesiculation): acrosome ka muh khul jata hai.');
  for (let i = 0; i < 9; i++) { const a = -1.1 + i * .27; A.add(sp(.17, 10, 8), 0xff9ab8, 1.15 + .2 * Math.cos(a * 2), 1.25 * Math.sin(a), -.15 - (i % 3) * .1, { op: .75, cut: 1 }, PV); }
  const PE = A.part('Acrosomal enzymes', 'Hyaluronidase (cumulus ke hyaluronan ko todta hai) aur acrosin (ZP ko). Ye exocytosis se bahar nikalte hain aur sperm ke liye raasta kholte hain.');
  dots(A, PE, 24, () => [rr(1.2, 3.4), rr(-.9, .9), -rr(.05, .6)], 0xffee66, .06, .95, 1);
  const PC = A.part('Ca2+ aur progesterone signal', 'ZP3 (aur cumulus ka progesterone) sperm ke CatSper channel khulwata hai: Ca2+ andar aata hai, acrosomal exocytosis shuru. Reaction sahi jagah (zona par) honi chahiye, pehle nahi.');
  A.flow([[1.0, 2.2, -.1], [.6, 1.4, -.1], [.2, .5, -.1]], 0xff6a6a, 5, .1, .06);
  A.flow([[1.7, 0, -.3], [2.8, .2, -.3], [3.7, .1, -.3], [4.5, 0, -.3]], 0xffee66, 6, .12, .05);
  A.lab('Nucleus', [-1.4, -1.45, 0], '#3a56c8'); A.lab('Inner acrosomal membrane', [-.1, 1.95, 0], '#7fd6ff'); A.lab('Hybrid vesicles', [1.9, 1.7, 0], '#ff9ab8'); A.lab('Enzymes zona tod rahe', [2.4, -1.1, 0], '#ffee66'); A.lab('Zona pellucida', [4.1, 2.45, 0], '#f2c35a'); A.lab('Ca2+ andar', [1.5, 2.4, 0], '#ff6a6a');
  A.go('Sperm head ▸', 's_head');
});
})();

