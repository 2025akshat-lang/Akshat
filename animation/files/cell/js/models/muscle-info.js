/* MUSCLE: Compare / 4D steps / Tracker / Layers */
(() => {
const TB = CVKit.table, H = CVKit.h3;
registerCellInfo('muscle', {
  name: 'Muscle fibre',
  fit: { r: [11, 9.5], t: [[0, 0, 0], [0, 0, 0]] },
  compare: { title: 'Muscle: tulna', html:
    H('1. Skeletal vs Cardiac vs Smooth') + TB(['Feature', 'Skeletal', 'Cardiac', 'Smooth'], [
      ['Striations', 'Hain', 'Hain', 'Nahi'],
      ['Nuclei', 'Kai, kinaare par', '1-2, beech mein', '1, beech mein'],
      ['Control', 'Voluntary', 'Involuntary', 'Involuntary'],
      ['Shape', 'Lambe belan', 'Shakhadar, jude', 'Spindle (tipered)'],
      ['Intercalated disc', 'Nahi', 'Hai (gap junction)', 'Nahi'],
      ['T-tubule', 'Hai (A-I par)', 'Hai (Z par)', 'Nahi (caveolae)'],
      ['Ca2+ sensor', 'Troponin', 'Troponin', 'Calmodulin']]) +
    H('2. Fast vs Slow twitch fibre') + TB(['Feature', 'Type I (slow)', 'Type II (fast)'], [
      ['Colour', 'Laal (myoglobin)', 'Safed'],
      ['Mitochondria', 'Bahut', 'Kam'],
      ['ATP source', 'Aerobic', 'Glycolysis'],
      ['Fatigue', 'Der se', 'Jaldi'],
      ['Example', 'Posture, marathon', 'Sprint, jump']]) +
    H('3. Sarcomere: relax vs contract') + TB(['Band', 'Relaxed', 'Contracted'], [
      ['Sarcomere', '~ 2.5 um', '~ 2.0 um (chhota)'],
      ['A band', 'Same', 'Same'],
      ['I band', 'Lambi', 'Chhoti'],
      ['H zone', 'Hai', 'Gayab / bahut chhota'],
      ['Filament', 'Nahi badalte', 'Sirf phisalte hain']]) },
  steps: [
    { k: ['nmj'], t: '1. Motor neuron ka action potential NMJ par ACh chhodta hai; muscle ke AChR khulte hain' },
    { k: ['sarco', 'ttub'], t: '2. Endplate potential action potential banata hai jo sarcolemma + T-tubule mein tez fail jata hai' },
    { k: ['ttub'], t: '3. T-tubule ki DHPR RyR1 ko kholti hai: SR se Ca2+ cytosol mein' },
    { k: ['sarc', 'myosin'], t: '4. Ca2+ troponin C se judta hai: tropomyosin hatti, myosin actin se judta hai' },
    { k: ['myosin', 'sarc', 'mit'], t: '5. Cross-bridge cycle (ATP): power stroke se thin filaments beech ki taraf phisalte hain: sarcomere chhota' },
    { k: ['ttub'], t: '6. SERCA Ca2+ ko SR mein wapas dalta hai: tropomyosin dhakti hai, muscle relax' }
  ],
  tracker: [
    ['Muscle fibre', 'Ek lamba multinucleate cell'], ['Sarcolemma', 'Fibre ki membrane'], ['Sarcoplasm', 'Muscle ka cytoplasm'], ['Myofibril', 'Sarcomere ki laddi'], ['Sarcomere', 'Contraction ki ikaai'],
    ['Z disc', 'Sarcomere ki seema'], ['M line', 'Thick filaments ka madhya'], ['A band', 'Thick filament ki lambai'], ['I band', 'Sirf thin filament'], ['H zone', 'A band ka sirf thick wala hissa'],
    ['Actin', 'Thin filament'], ['Myosin', 'Thick filament, sir wala'], ['Titin', 'Spring jaisa bada protein'], ['Troponin', 'Ca2+ sensor'], ['Tropomyosin', 'Actin ka dhakkan'],
    ['T-tubule', 'Sarcolemma ki andar nali'], ['Sarcoplasmic reticulum', 'Ca2+ ka bhandar'], ['Triad', 'T-tubule + 2 SR cisternae'], ['DHPR / RyR1', 'Voltage-to-Ca2+ coupling'], ['SERCA', 'Ca2+ wapas SR mein'],
    ['Cross-bridge cycle', 'ATP se power stroke'], ['Neuromuscular junction', 'Nerve-muscle jodi'], ['ACh receptor', 'Na+ channel'], ['AChE', 'ACh ko todta hai'], ['Mitochondria', 'Aerobic ATP']
  ],
  layers: [
    { id: 'fiber', name: 'Sarcolemma + sarcoplasm', color: '#e08a7a', parts: ['sarco', 'cyto'] },
    { id: 'myo', name: 'Myofibrils (sarcomere + myosin)', color: '#d04040', parts: ['sarc', 'myosin'] },
    { id: 'triad', name: 'T-tubule + SR', color: '#4ad0ff', parts: ['ttub'] },
    { id: 'nuc', name: 'Nuclei', color: '#9b6bd8', parts: ['nuc'] },
    { id: 'mit', name: 'Mitochondria', color: '#e0b040', parts: ['mit'] },
    { id: 'nmj', name: 'Neuromuscular junction', color: '#c9b2ff', parts: ['nmj'] }
  ]
});
})();
/* END OF FILE muscle-info.js */
