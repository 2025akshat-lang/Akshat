/* DIVISION: Compare / 4D steps (phase se judte) / Tracker / Layers - mitosis aur meiosis dono */
(() => {
const TB = CVKit.table, H = CVKit.h3;
const CMP = H('1. Mitosis vs Meiosis') + TB(['Feature', 'Mitosis', 'Meiosis'], [
  ['Kahan', 'Sab somatic (body) cells', 'Sirf germ cells (gonads)'],
  ['Divisions', '1', '2 (meiosis I + II)'],
  ['DNA copy (S)', '1 baar', '1 baar (II se pehle nahi)'],
  ['Daughter cells', '2', '4'],
  ['Chromosome number', 'Same (2n -> 2n)', 'Aadha (2n -> n)'],
  ['Genetically', 'Identical (clones)', 'Alag (crossing over + random assortment)'],
  ['Synapsis / crossing over', 'Nahi', 'Prophase I mein'],
  ['Kya alag hota hai', 'Sister chromatids', 'I: homologs, II: sister chromatids'],
  ['Kaam', 'Growth, repair, asexual', 'Gamete, genetic variation']]) +
  H('2. Meiosis I vs Meiosis II') + TB(['Feature', 'Meiosis I', 'Meiosis II'], [
  ['Naam', 'Reductional', 'Equational (mitosis jaisa)'],
  ['Metaphase par', 'Tetrad (homolog jode)', 'Single chromosome'],
  ['Anaphase mein', 'Homologs alag', 'Sister chromatids alag'],
  ['Result', '2 haploid cells (2 chromatid wale)', '4 haploid cells (1 chromatid wale)'],
  ['Crossing over', 'Hota hai', 'Nahi']]) +
  H('3. Mitosis ki phases') + TB(['Phase', 'Kya hota hai', 'Chromosome'], [
  ['Interphase', 'G1, S (DNA copy), G2', 'Chromatin, patla'],
  ['Prophase', 'Condense, spindle banta', 'Sikude, X-shape'],
  ['Prometaphase', 'Envelope tutta, kinetochore juda', 'Plate ki taraf'],
  ['Metaphase', 'Plate par line', 'Sabse condense'],
  ['Anaphase', 'Sisters alag, poles ki taraf', 'V-shape'],
  ['Telophase', 'Do nuclei bante', 'Khulte hain'],
  ['Cytokinesis', 'Cell do hua', '-']]);

const TRK = [
  ['Interphase', 'G1 + S + G2: cell badhta aur DNA copy'], ['S phase', 'DNA replication: har chromosome 2 chromatid'], ['Chromatid', 'Ek DNA molecule (copy ke baad 2)'], ['Centromere', 'Chromatid jodne wali sankri jagah'],
  ['Kinetochore', 'Spindle ka attach hone ka disc'], ['Cohesin', 'Sister chromatids ko jodta hai'], ['Centrosome', 'Spindle ke poles'], ['Spindle (microtubule)', 'Chromosome khenchne wale tantu'],
  ['Prophase', 'Chromosome condense, spindle banna'], ['Prometaphase', 'Nuclear envelope tuta'], ['Metaphase', 'Chromosome plate par'], ['Spindle checkpoint', 'Sab attach na ho to ruko'],
  ['Anaphase', 'Sister chromatids alag'], ['Separase', 'Cohesin kaatne wala enzyme'], ['Telophase', 'Nuclei dobara bante'], ['Cytokinesis', 'Cytoplasm baantna'],
  ['Contractile ring', 'Actin + myosin II ka ring'], ['Cleavage furrow', 'Membrane ka pinch'], ['Midbody', 'Daughters ke beech ka aakhri joda'], ['Cyclin-CDK (MPF)', 'Mitosis mein jaane ka switch'],
  ['APC/C', 'Anaphase trigger'], ['Haploid (n)', 'Chromosome ka ek set'], ['Diploid (2n)', 'Chromosome ke do set']];

const MEI_ONLY = [['Synapsis', 'Homologs ka paas aana'], ['Synaptonemal complex', 'Homologs ke beech ki zip'], ['Crossing over', 'Non-sister chromatid ka adla-badli'], ['Chiasma', 'Crossover ka X nishan'],
  ['Tetrad', '4 chromatid ka bundle (2 homolog)'], ['Independent assortment', 'Homologs random pole par'], ['Reduction division', 'Meiosis I: 2n se n'], ['Gamete', 'Sperm / egg: haploid']];

registerCellInfo('mitosis', {
  name: 'Mitosis',
  fit: { r: [12.5, 10.5], t: [[0, 0, 0], [0, 0, 0]] },
  compare: { title: 'Mitosis: tulna', html: CMP },
  steps: [
    { ph: 0, k: ['nuc', 'chr', 'cen'], t: '1. Interphase: cell badhta hai, S phase mein DNA copy (har chromosome 2 sister chromatids), centrosome duplicate' },
    { ph: 1, k: ['chr', 'cen'], t: '2. Prophase: chromatin condense hokar X-shape, centrosome dono poles ki taraf, spindle banna shuru' },
    { ph: 2, k: ['nuc', 'spi', 'chr'], t: '3. Prometaphase: nuclear envelope tuti, spindle microtubule kinetochore se jude' },
    { ph: 3, k: ['chr', 'spi'], t: '4. Metaphase: saare chromosome equator (metaphase plate) par line mein, checkpoint sahi attach dekhta hai' },
    { ph: 4, k: ['chr', 'spi', 'cen'], t: '5. Anaphase: separase cohesin kaatta hai, sister chromatids poles ki taraf khenche jaate hain' },
    { ph: 5, k: ['nuc', 'chr', 'ring'], t: '6. Telophase: do nuclear envelope, chromosome khulte hain, contractile ring bannna shuru' },
    { ph: 6, k: ['ring', 'mem'], t: '7. Cytokinesis: actin-myosin ring sikudta hai, cell do identical daughter cells mein baant jata hai' }
  ],
  tracker: TRK,
  layers: [
    { id: 'mem', name: 'Cell membrane', color: '#e0527a', parts: ['mem'] },
    { id: 'nuc', name: 'Nuclear envelope', color: '#9b6bd8', parts: ['nuc'] },
    { id: 'chr', name: 'Chromosomes', color: '#e0504a', parts: ['chr'] },
    { id: 'spi', name: 'Spindle fibres', color: '#ffe04a', parts: ['spi'] },
    { id: 'cen', name: 'Centrosomes', color: '#ffc84a', parts: ['cen'] },
    { id: 'ring', name: 'Contractile ring', color: '#ff9a3c', parts: ['ring'] }
  ]
});

registerCellInfo('meiosis', {
  name: 'Meiosis',
  fit: { r: [13, 11], t: [[0, 0, 0], [0, 0, 0]] },
  compare: { title: 'Meiosis: tulna', html: CMP },
  steps: [
    { ph: 0, k: ['nuc', 'chr'], t: '1. Interphase: S phase mein DNA copy: har chromosome ke 2 sister chromatids (sirf ek baar)' },
    { ph: 1, k: ['chr', 'chi', 'cen'], t: '2. Prophase I: homologs jode banate hain (synapsis), crossing over: maa-pita ke DNA tukde badalte hain' },
    { ph: 2, k: ['chr', 'spi'], t: '3. Metaphase I: tetrads (homolog jode) plate par; maa/pita ka rukh random (independent assortment)' },
    { ph: 3, k: ['chr', 'spi', 'cen'], t: '4. Anaphase I: HOMOLOGS alag hokar poles ki taraf (sister chromatids saath rehte hain)' },
    { ph: 4, k: ['ring', 'nuc', 'mem'], t: '5. Telophase I + cytokinesis: 2 haploid cells (har chromosome ab bhi 2 chromatid ka)' },
    { ph: 5, k: ['chr', 'cen'], t: '6. Prophase II: chromosome dobara condense, naye spindle (pehle wale ke 90 degree par), DNA copy nahi hoti' },
    { ph: 6, k: ['chr', 'spi'], t: '7. Metaphase II: har cell mein chromosome plate par akele line mein' },
    { ph: 7, k: ['chr', 'spi', 'cen'], t: '8. Anaphase II: SISTER CHROMATIDS alag hote hain (ab mitosis jaisa)' },
    { ph: 8, k: ['nuc', 'ring', 'mem'], t: '9. Telophase II + cytokinesis: 4 haploid, genetically alag cells (gamete)' }
  ],
  tracker: TRK.concat(MEI_ONLY),
  layers: [
    { id: 'mem', name: 'Cell membrane', color: '#c28cff', parts: ['mem'] },
    { id: 'nuc', name: 'Nuclear envelope', color: '#9b6bd8', parts: ['nuc'] },
    { id: 'chr', name: 'Chromosomes', color: '#e0504a', parts: ['chr'] },
    { id: 'chi', name: 'Crossing over (chiasma)', color: '#ffffff', parts: ['chi'] },
    { id: 'spi', name: 'Spindle fibres', color: '#ffe04a', parts: ['spi'] },
    { id: 'cen', name: 'Centrosomes', color: '#ffc84a', parts: ['cen'] },
    { id: 'ring', name: 'Contractile ring', color: '#ff9a3c', parts: ['ring'] }
  ]
});
})();
/* END OF FILE division-info.js */
