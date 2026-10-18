/* YEAST: Compare / 4D steps / Tracker / Layers */
(() => {
const TB = CVKit.table, H = CVKit.h3;
registerCellInfo('yeast', {
  name: 'Yeast',
  fit: { r: [12, 9.5], t: [[.5, 0, 0], [.5, 0, 0]] },
  compare: { title: 'Yeast: tulna', html:
    H('1. Yeast vs Animal cell') + TB(['Feature', 'Yeast', 'Animal cell'], [
      ['Wall', 'Glucan + mannan + chitin', 'Nahi'],
      ['Division', 'Budding (asymmetric)', 'Binary / mitosis (symmetric)'],
      ['Sterol', 'Ergosterol', 'Cholesterol'],
      ['Mitosis', 'Closed (envelope nahi tootta)', 'Open'],
      ['Centrosome', 'SPB', 'Centrosome + centrioles'],
      ['Vacuole', 'Bada, lysosome jaisa', 'Lysosome'],
      ['Anaerobic', 'Fermentation (alcohol + CO2)', 'Lactic acid'],
      ['Genome', '~ 12 Mb, 16 chromosome', '~ 3000 Mb']]) +
    H('2. Yeast vs Bacteria') + TB(['Feature', 'Yeast (eukaryote)', 'Bacteria (prokaryote)'], [
      ['Nucleus', 'Hai', 'Nahi'],
      ['Size', '~ 5-10 um', '~ 1-5 um'],
      ['Wall', 'Glucan/chitin', 'Peptidoglycan'],
      ['Organelle', 'Mitochondria, ER, Golgi', 'Nahi'],
      ['Ribosome', '80S', '70S'],
      ['Antibiotic', 'Penicillin asar nahi karti', 'Penicillin kaam karti hai']]) +
    H('3. Budding vs Fission') + TB(['Feature', 'Budding (S. cerevisiae)', 'Fission (S. pombe)'], [
      ['Shape', 'Ovoid', 'Chhad jaisa (rod)'],
      ['Division', 'Bud nikalta hai', 'Beech se cheer ke do'],
      ['Mitosis', 'Closed', 'Closed'],
      ['Use', 'Bread, beer, cell biology model', 'Cell-cycle research']]) },
  steps: [
    { k: ['cyto'], t: '1. G1: cell sugar se ATP banata hai aur size badhta hai (START par nirnay)' },
    { k: ['spb'], t: '2. SPB duplicate hota hai (half-bridge par), bud ki jagah tay hoti hai' },
    { k: ['bud', 'wall'], t: '3. Bud nikalta hai: actin cables vesicles laate hain, wall banti hai' },
    { k: ['nuc', 'spb'], t: '4. Spindle banta hai: nucleus neck se khinchta hai (closed mitosis)' },
    { k: ['mit', 'vac', 'bud'], t: '5. Mitochondria aur vacuole ka hissa bud mein jaata hai' },
    { k: ['bud', 'scar', 'wall'], t: '6. Septum banta hai: bud alag, mother par bud scar reh jata hai' }
  ],
  tracker: [
    ['Cell wall', 'Glucan + mannoprotein + chitin'], ['Beta-glucan', 'Wall ki taakat'], ['Mannoprotein', 'Bahari parat'], ['Chitin', 'Bud scar aur septum'], ['Plasma membrane', 'Ergosterol wali'],
    ['Ergosterol', 'Fungal sterol: azole ka target'], ['Nucleus', '16 chromosome'], ['Nucleolus', 'rRNA / ribosome'], ['SPB', 'Yeast ka centrosome'], ['Spindle', 'Chromosome baantne wali microtubules'],
    ['Closed mitosis', 'Nuclear envelope nahi tootta'], ['Bud', 'Nayi beti cell'], ['Bud neck', 'Septin ring ka joda'], ['Septin', 'Neck ka diffusion barrier'], ['Bud scar', 'Chitin ring: umr ginta hai'], ['Actin cable', 'Vesicle ka highway'],
    ['Vacuole', 'Lysosome jaisa bhandar'], ['V-ATPase', 'Proton pump'], ['Autophagy', 'Khud ko recycle karna'], ['Mitochondria', 'Respiration'], ['Fermentation', 'Sugar se alcohol + CO2'], ['ER', 'Protein + lipid'],
    ['Golgi', 'Mannoprotein modify'], ['Cdc42', 'Bud ki jagah tay karta hai'], ['Replicative aging', 'Mother ki bud ki ginti']
  ],
  layers: [
    { id: 'wall', name: 'Wall + membrane + scars', color: '#c89a5a', parts: ['wall', 'memb', 'scar'] },
    { id: 'bud', name: 'Bud', color: '#e8c88a', parts: ['bud'] },
    { id: 'nuc', name: 'Nucleus + SPB', color: '#9b6bd8', parts: ['nuc', 'spb'] },
    { id: 'vac', name: 'Vacuole', color: '#5ab0e8', parts: ['vac'] },
    { id: 'mit', name: 'Mitochondria', color: '#e0504a', parts: ['mit'] },
    { id: 'er', name: 'ER + Golgi', color: '#8a6ab8', parts: ['er', 'golgi'] },
    { id: 'cyto', name: 'Cytoplasm', color: '#f5e0b0', parts: ['cyto'] }
  ]
});
})();
/* END OF FILE yeast-info.js */
