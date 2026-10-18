/* SPERM: Compare / 4D steps / Tracker / Layers */
(() => {
const TB = CVKit.table, H = CVKit.h3;
registerCellInfo('sperm', {
  name: 'Sperm',
  fit: { r: [11, 9], t: [[0, 0, 0], [0, 0, 0]] },
  compare: { title: 'Sperm: tulna', html:
    H('1. Sperm vs Egg') + TB(['Feature', 'Sperm', 'Egg (ovum)'], [
      ['Size', '~ 50-60 um (head 5 um)', '~ 120 um, sabse bada human cell'],
      ['Motility', 'Tail (flagellum) se tairta hai', 'Nahi: fallopian tube ke cilia se bahta hai'],
      ['Cytoplasm', 'Bahut kam', 'Bahut, yolk + nutrients'],
      ['Organelles', 'Mitochondria sirf midpiece mein; Golgi acrosome mein', 'Sab organelles, cortical granules'],
      ['Number', 'Karodon (~ 100 million/mL)', 'Ek mahine mein 1 (kul ~ 400 jeevan mein)'],
      ['Chromosome', '23 (X ya Y)', '23 (hamesha X)'],
      ['Mitochondrial DNA', 'Fertilisation ke baad kharab hota hai', 'Bachhe ko milta hai (maternal inheritance)']]) +
    H('2. Sperm ke 3 hisse') + TB(['Part', 'Andar kya', 'Kaam'], [
      ['Head', 'Nucleus + acrosome', 'DNA le jana, zona todna'],
      ['Midpiece', 'Mitochondrial helix + axoneme', 'ATP banana'],
      ['Tail (principal + end)', 'Axoneme 9+2 + fibrous sheath', 'Wave se aage badhna']]) +
    H('3. Sperm vs Cilia / Flagellum of other cells') + TB(['Feature', 'Sperm tail', 'Respiratory cilium'], [
      ['Axoneme', '9+2', '9+2'],
      ['Length', '~ 50 um', '~ 6 um'],
      ['Motion', 'Poori lambai par wave', 'Aage-peeche stroke'],
      ['Extra', 'Dense fibres + mitochondria', 'Nahi']]) },
  steps: [
    { k: ['mid', 'main', 'end'], t: '1. Mitochondria ka ATP dynein arms ko chalata hai: tail mein wave banti hai aur sperm aage tairta hai (~ 3 mm/min)' },
    { k: ['head'], t: '2. Female tract mein capacitation (~ 6-8 ghante): cholesterol hata, membrane tayyar, tail ki hyperactivation' },
    { k: ['head'], t: '3. Cumulus cells se guzar kar zona pellucida (ZP3) se bandhta hai' },
    { k: ['head'], t: '4. Acrosome reaction: Ca2+ aaya, enzymes nikle, zona mein raasta bana' },
    { k: ['head', 'neck'], t: '5. Equatorial segment egg ki membrane se fuse (IZUMO1-JUNO): nucleus egg mein' },
    { k: ['neck'], t: '6. Egg ka Ca2+ wave + cortical reaction: aur sperm nahi ghus sakta (polyspermy block)' }
  ],
  tracker: [
    ['Head', 'Nucleus + acrosome ka ghar'], ['Haploid nucleus', '23 chromosome'], ['Protamine', 'Histone ki jagah DNA ko kas kar pack karta hai'], ['Acrosome', 'Golgi se bana enzyme cap'],
    ['Hyaluronidase', 'Cumulus ke hyaluronan ko todta hai'], ['Acrosin', 'Zona ko todne wala protease'], ['Equatorial segment', 'Egg se pehle fuse hone wala hissa'], ['IZUMO1', 'Sperm ka fusion protein'], ['JUNO', 'Egg ka receptor jo IZUMO1 se judta hai'],
    ['Neck', 'Head aur tail ke beech ka joda'], ['Centriole', 'Zygote ke pehle division ke liye'], ['Midpiece', 'ATP factory'], ['Mitochondrial helix', '50-75 mitochondria'], ['Annulus', 'Midpiece aur principal piece ki seema'],
    ['Outer dense fibres', 'Tail ko mazbooti'], ['Fibrous sheath', 'Principal piece ka kavach'], ['Axoneme 9+2', 'Tail ka engine'], ['Dynein arm', 'ATP se doublet phislata hai'], ['Radial spoke', 'Bend ka niyantran'], ['Nexin', 'Doublets ko jodta hai'],
    ['CatSper', 'Ca2+ channel: hyperactivation'], ['Capacitation', 'Female tract mein taiyari'], ['Acrosome reaction', 'Zona par enzyme release'], ['Hyperactivation', 'Tez, chaabuk jaisi wave'], ['Polyspermy block', 'Sirf ek sperm ghusta hai']
  ],
  layers: [
    { id: 'head', name: 'Head (nucleus + acrosome)', color: '#3a56c8', parts: ['head'] },
    { id: 'neck', name: 'Neck + centrioles', color: '#f0c040', parts: ['neck'] },
    { id: 'mid', name: 'Midpiece (mitochondria)', color: '#c84a4a', parts: ['mid'] },
    { id: 'main', name: 'Principal piece', color: '#7fd6c2', parts: ['main'] },
    { id: 'end', name: 'End piece', color: '#a8e8dc', parts: ['end'] }
  ]
});
})();
/* END OF FILE sperm-info.js */
