/* EGG: Compare / 4D steps / Tracker / Layers */
(() => {
const TB = CVKit.table, H = CVKit.h3;
registerCellInfo('egg', {
  name: 'Egg (oocyte)',
  fit: { r: [12, 10], t: [[0, 0, 0], [0, 0, 0]] },
  compare: { title: 'Egg: tulna', html:
    H('1. Egg vs Sperm') + TB(['Feature', 'Egg', 'Sperm'], [
      ['Size', '~ 120 um (sabse bada)', '~ 55 um (sir 5 um)'],
      ['Motility', 'Nahi', 'Tail se tairta hai'],
      ['Cytoplasm', 'Bahut', 'Bahut kam'],
      ['Mitochondria', '~ 100,000', '50-75'],
      ['Chromosome', '23 (X)', '23 (X ya Y)'],
      ['Coverings', 'Zona + corona', 'Sirf membrane'],
      ['Number', '~ 1 mahine mein', 'Karodon']]) +
    H('2. Meiosis: egg vs sperm') + TB(['Feature', 'Oogenesis', 'Spermatogenesis'], [
      ['Result', '1 egg + 2-3 polar body', '4 sperm'],
      ['Cytokinesis', 'Asymmetric', 'Symmetric'],
      ['Arrest', 'Prophase I; MII par rukta', 'Nahi rukta'],
      ['Start', 'Bhrun mein', 'Pubert par'],
      ['Duration', 'Saalon', '~ 74 din']]) +
    H('3. Egg vs normal somatic cell') + TB(['Feature', 'Egg', 'Somatic cell'], [
      ['Ploidy', 'Haploid (23)', 'Diploid (46)'],
      ['Division', 'Meiosis', 'Mitosis'],
      ['Spindle', 'Centrosome-rahit', 'Centrosome wala'],
      ['Special', 'Cortical granule, zona', 'Nahi']]) },
  steps: [
    { k: ['corona', 'zona'], t: '1. Ovulation: egg cumulus-corona ke saath fallopian tube mein, MII par ruka hua' },
    { k: ['corona'], t: '2. Sperm hyaluronidase se corona tod kar zona tak pahunchta hai' },
    { k: ['zona'], t: '3. Sperm zona ZP3 se bandhta, acrosome reaction se zona mein raasta' },
    { k: ['memb'], t: '4. Sperm ka IZUMO1 egg ke JUNO se juda: fusion, sperm ka nucleus egg mein' },
    { k: ['er', 'cyto'], t: '5. Ca2+ lehar poore egg mein; meiosis II phir chalu, polar body 2 nikla' },
    { k: ['cort', 'zona'], t: '6. Cortical granules enzyme chhodte hain: zona sakht, doosra sperm nahi ghus sakta' }
  ],
  tracker: [
    ['Oocyte (egg)', 'Female gamete'], ['Corona radiata', 'Cumulus cells ki parat'], ['Hyaluronan', 'Corona ka jel'], ['Zona pellucida', 'ZP1-3 glycoprotein parat'], ['ZP3', 'Sperm receptor'],
    ['ZP2', 'Sperm anchor; cortical reaction mein kata'], ['Perivitelline space', 'Zona-membrane gap'], ['Oolemma', 'Egg ki plasma membrane'], ['Microvilli', 'Fusion ki jagah'], ['JUNO', 'IZUMO1 ka receptor'],
    ['CD9', 'Fusion partner'], ['Cortical granules', 'Zona hardening ke vesicle'], ['Ovastacin', 'ZP2 kaatne wala enzyme'], ['Polyspermy block', 'Fast (electrical) + slow (zona)'], ['MII arrest', 'Meiosis II par ruka'],
    ['Meiotic spindle', 'Centrosome-rahit barrel'], ['Chromosome (dyad)', '23 dyads'], ['Polar body', 'Chhota bacha cell'], ['MPF', 'Cyclin B/CDK1'], ['CSF / Emi2', 'APC ko rokta hai'],
    ['Ca2+ wave', 'Egg activation ka signal'], ['PLC-zeta', 'Sperm ka IP3 factory'], ['Mitochondria', 'Maternal ~ 100,000'], ['Ooplasm', 'Bada cytoplasm'], ['ER', 'Ca2+ bhandar']
  ],
  layers: [
    { id: 'zona', name: 'Corona + zona', color: '#f2c35a', parts: ['corona', 'zona'] },
    { id: 'cell', name: 'Membrane + ooplasm', color: '#f0e0b8', parts: ['memb', 'cyto'] },
    { id: 'cort', name: 'Cortical granules', color: '#ffee44', parts: ['cort'] },
    { id: 'spin', name: 'MII spindle + polar body', color: '#6ab0ff', parts: ['spindle', 'pb'] },
    { id: 'mit', name: 'Mitochondria', color: '#e0504a', parts: ['mit'] },
    { id: 'yolk', name: 'Yolk + ER', color: '#f2d27a', parts: ['yolk', 'er'] }
  ]
});
})();
/* END OF FILE egg-info.js */
