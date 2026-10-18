/* RBC: Compare / 4D steps / Tracker / Layers */
(() => {
const TB = CVKit.table, H = CVKit.h3;
registerCellInfo('rbc', {
  name: 'Red blood cell',
  fit: { r: [11, 9], t: [[.7, 0, 0], [.7, 0, 0]] },
  compare: { title: 'RBC: tulna', html:
    H('1. RBC vs Typical animal cell') + TB(['Feature', 'RBC (mature)', 'Typical animal cell'], [
      ['Nucleus', 'Nahi (nikal diya)', 'Hota hai'],
      ['Mitochondria', 'Nahi', 'Bahut'],
      ['Ribosome/ER', 'Nahi', 'Hote hain'],
      ['Shape', 'Biconcave disc', 'Gol / alag'],
      ['ATP source', 'Sirf glycolysis (anaerobic)', 'Glycolysis + OXPHOS'],
      ['Protein', '~ 97% hemoglobin', 'Alag-alag'],
      ['Life', '~ 120 din', 'Mahine-saal'],
      ['Division', 'Nahi kar sakta (marrow mein bante hain)', 'Mitosis']]) +
    H('2. Normal vs Sickle RBC') + TB(['Feature', 'Normal (HbA)', 'Sickle (HbS)'], [
      ['Mutation', 'Beta-6 Glu', 'Beta-6 Val (GAG>GTG)'],
      ['Shape', 'Biconcave', 'Hansiya (deoxy mein)'],
      ['Flexibility', 'Lachili', 'Kadak, atak jati hai'],
      ['Life', '~ 120 din', '~ 10-20 din'],
      ['Result', 'Normal', 'Anaemia + dard crisis'],
      ['Benefit', '-', 'Heterozygote mein malaria se raahat']]) +
    H('3. RBC vs WBC vs Platelet') + TB(['Feature', 'RBC', 'WBC', 'Platelet'], [
      ['Count / uL', '~ 5 million', '~ 7000', '~ 250000'],
      ['Nucleus', 'Nahi', 'Hai', 'Nahi (tukda)'],
      ['Kaam', 'O2 / CO2', 'Immunity', 'Clotting'],
      ['Size', '~ 7.8 um', '~ 10-20 um', '~ 2-3 um']]) },
  steps: [
    { k: ['o2', 'hb'], t: '1. Phephdon mein O2 hemoglobin ke heme (Fe2+) se juda: R state, chamkila laal' },
    { k: ['memb', 'skel'], t: '2. RBC dhamniyon se hote hue capillary tak: lachili hokar mud kar guzri' },
    { k: ['hb', 'dimple'], t: '3. Tissue mein kam pH, zyada CO2 aur 2,3-BPG: Hb T state mein, O2 chhoda (Bohr effect)' },
    { k: ['memb'], t: '4. CO2 plasma mein HCO3- ban kar band 3 se Cl- ke badle (chloride shift)' },
    { k: ['hb'], t: '5. Thoda CO2 seedha globin se judta hai (carbamino-Hb); vein se phephdon tak' },
    { k: ['sickle'], t: '6. Tulna: sickle Hb deoxy mein fibre banata hai: cell hansiya ban kar atak jata hai' }
  ],
  tracker: [
    ['RBC / erythrocyte', 'Laal rakt kosika'], ['Biconcave disc', 'Zyada surface area'], ['Hemoglobin', 'Alpha2 beta2'], ['Heme', 'Fe2+ wala porphyrin'], ['Globin', '4 protein chains'],
    ['Oxyhemoglobin', 'O2 se bhara'], ['Deoxyhemoglobin', 'O2 chhoda hua'], ['T / R state', 'Cooperativity'], ['Bohr effect', 'H+/CO2 se O2 chhodna'], ['2,3-BPG', 'Hb ko T state mein rakhta hai'],
    ['Plasma membrane', 'Lipid bilayer'], ['Band 3', 'Cl-/HCO3- exchanger'], ['Glycophorin', 'Sialic acid wali parat'], ['ABO / Rh', 'Blood group antigens'], ['Spectrin', 'Cytoskeleton ka jaal'], ['Ankyrin', 'Spectrin-band 3 pul'],
    ['Actin node', 'Junctional complex'], ['Aquaporin-1', 'Paani ka channel'], ['GLUT1', 'Glucose transporter'], ['Na+/K+ pump', 'Ion santulan'], ['Glycolysis', 'Ek matra ATP source'], ['Carbonic anhydrase', 'CO2 se HCO3-'],
    ['Chloride shift', 'Cl- ke badle HCO3-'], ['Sickle cell', 'HbS ke fibre'], ['Erythropoietin', 'Kidney ka hormone jo RBC banwata hai']
  ],
  layers: [
    { id: 'cell', name: 'Membrane + spectrin + dimple', color: '#e05a5a', parts: ['memb', 'skel', 'dimple'] },
    { id: 'hb', name: 'Hemoglobin + O2', color: '#a01818', parts: ['hb', 'o2'] },
    { id: 'sickle', name: 'Sickle cell (tulna)', color: '#a83030', parts: ['sickle'] }
  ]
});
})();
/* END OF FILE rbc-info.js */
