/* PLANT: Compare / 4D steps / Tracker / Layers */
(() => {
const TB = CVKit.table, H = CVKit.h3;
registerCellInfo('plant', {
  name: 'Plant cell',
  fit: { r: [12, 10], t: [[0, 0, 0], [0, 0, 0]] },
  compare: { title: 'Plant cell: tulna', html:
    H('1. Plant vs Animal cell') + TB(['Feature', 'Plant cell', 'Animal cell'], [
      ['Cell wall', 'Hai (cellulose)', 'Nahi'],
      ['Shape', 'Fixed, aksar rectangular', 'Gol / badalta hua'],
      ['Chloroplast', 'Hote hain (photosynthesis)', 'Nahi'],
      ['Vacuole', 'Ek bada central (80-90%)', 'Chhote, kai'],
      ['Centriole', 'Nahi (higher plants)', 'Hota hai'],
      ['Lysosome', 'Kam / vacuole kaam karta hai', 'Bahut'],
      ['Reserve food', 'Starch', 'Glycogen'],
      ['Cell junction', 'Plasmodesmata', 'Gap / tight junction'],
      ['Cytokinesis', 'Cell plate banti hai', 'Cleavage furrow']]) +
    H('2. Plant vs Fungus (yeast)') + TB(['Feature', 'Plant', 'Fungus'], [
      ['Wall', 'Cellulose', 'Chitin + glucan'],
      ['Food', 'Autotroph (khud banata)', 'Heterotroph (absorb karta)'],
      ['Chloroplast', 'Hai', 'Nahi'],
      ['Reserve', 'Starch', 'Glycogen']]) +
    H('3. Chloroplast vs Mitochondria') + TB(['Feature', 'Chloroplast', 'Mitochondria'], [
      ['Kaam', 'Light se sugar banana', 'Sugar se ATP banana'],
      ['Membrane', 'Double + thylakoid', 'Double + cristae'],
      ['Andar', 'Stroma, grana', 'Matrix, cristae'],
      ['Pigment', 'Chlorophyll', 'Nahi'],
      ['DNA', 'Circular, apna', 'Circular, apna'],
      ['Origin', 'Cyanobacteria (endosymbiosis)', 'Alpha-proteobacteria']]) },
  steps: [
    { k: ['wall', 'memb', 'chloro'], t: '1. Sunlight chloroplast ke thylakoid par girti hai: chlorophyll paani todta hai (O2 nikalta hai), ATP + NADPH bante hain' },
    { k: ['chloro'], t: '2. Stroma mein Calvin cycle: RuBisCO CO2 pakadta hai aur G3P (sugar) banta hai' },
    { k: ['vac'], t: '3. Sugar sucrose bankar vacuole mein jama / cell sap mein ghulta hai; paani aane se turgor badhta hai' },
    { k: ['pd', 'wall'], t: '4. Sucrose plasmodesmata se padosi cells tak jata hai (phloem ki taraf)' },
    { k: ['mit', 'golgi'], t: '5. Mitochondria sugar se ATP banate hain; Golgi wall ka pectin/hemicellulose banata hai' },
    { k: ['wall', 'cyto'], t: '6. Cellulose synthase naya cellulose wall mein jodta hai: cell lamba hokar badhta hai' }
  ],
  tracker: [
    ['Cell wall', 'Cellulose ki mazboot deewar'], ['Middle lamella', 'Pectin: cells ko chipkati hai'], ['Primary wall', 'Badhne wali lachili parat'], ['Secondary wall', 'Lignin wali moti parat'],
    ['Cellulose microfibril', 'Beta-1,4 glucan ke bundle'], ['Plasma membrane', 'Wall ke neeche lipid bilayer'], ['Central vacuole', 'Paani aur ion ka bhandar'], ['Tonoplast', 'Vacuole ki membrane'],
    ['Turgor pressure', 'Paani se bana andar ka dabav'], ['Chloroplast', 'Photosynthesis ka cell organelle'], ['Thylakoid', 'Light reactions ki membrane'], ['Granum', 'Thylakoid ka stack'], ['Stroma', 'Calvin cycle ki jagah'],
    ['Chlorophyll', 'Hara pigment: light pakadta hai'], ['RuBisCO', 'CO2 fix karne wala enzyme'], ['Starch granule', 'Jama sugar'], ['Nucleus', 'DNA aur nucleolus'], ['Mitochondria', 'Respiration'], ['Golgi', 'Wall polysaccharide'],
    ['ER', 'Protein + lipid'], ['Peroxisome', 'Photorespiration'], ['Plasmodesmata', 'Cell se cell nali'], ['Desmotubule', 'Nali ke andar ER'], ['Callose', 'Plasmodesma ka niyantran'], ['Anthocyanin', 'Vacuole ka rang']
  ],
  layers: [
    { id: 'wall', name: 'Cell wall + membrane + PD', color: '#a8c070', parts: ['wall', 'memb', 'pd'] },
    { id: 'vac', name: 'Central vacuole', color: '#5ab0e8', parts: ['vac'] },
    { id: 'chloro', name: 'Chloroplasts', color: '#2ea84a', parts: ['chloro'] },
    { id: 'nuc', name: 'Nucleus + ER + Golgi', color: '#9b6bd8', parts: ['nuc', 'er', 'golgi'] },
    { id: 'mit', name: 'Mitochondria + peroxisome', color: '#e0504a', parts: ['mit', 'perox'] },
    { id: 'cyto', name: 'Cytoplasm', color: '#cfe8b0', parts: ['cyto'] }
  ]
});
})();
/* END OF FILE plant-info.js */
