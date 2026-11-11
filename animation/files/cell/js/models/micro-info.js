
(() => {
const TB = CVKit.table, H = CVKit.h3;
const fit = { r: [12.5, 10.5], t: [[0, 0, 0], [0, 0, 0]] };
const L = (id, name, color, parts) => ({ id, name, color, parts });

registerCellInfo('glia', { name: 'Neuroglia', fit,
  compare: { title: 'Glia: tulna', html: H('1. Glial cells ke type') + TB(['Cell', 'Kaam', 'Khaas'], [
    ['Astrocyte', 'BBB, poshan, K+/glutamate saaf', 'Tara aakar, endfeet'],
    ['Oligodendrocyte', 'CNS myelin', 'Ek cell, kai axon'],
    ['Schwann cell', 'PNS myelin', 'Ek cell, ek axon-tukda'],
    ['Microglia', 'Immune: safai, pruning', 'Sabse chhote, mobile'],
    ['Ependymal', 'CSF banana + behana', 'Cilia wali parat'],
    ['Satellite cell', 'Ganglia ke neurons ko ghera', 'PNS']]) +
    H('2. Neuron vs Glia') + TB(['Feature', 'Neuron', 'Glia'], [
    ['Signal (AP)', 'Banate hain', 'Nahi (zyadatar)'], ['Sankhya', '~ 86 arab', '~ 85 arab (~ 1:1)'], ['Divide', 'Lagbhag nahi', 'Haan, zindagi bhar'], ['Kaam', 'Soch, signal', 'Madad, suraksha']]) },
  steps: [
    { ph: 0, k: ['neu', 'ast', 'oli', 'mic', 'epe'], t: '1. Neuron aur uske saath chaaron glia: sab milkar dimaag ka ecosystem' },
    { ph: 1, k: ['ast', 'ves', 'neu'], t: '2. Astrocyte: endfeet capillary ko lapete (BBB), glucose neuron tak, K+ aur glutamate saaf' },
    { ph: 2, k: ['oli', 'myl', 'neu'], t: '3. Oligodendrocyte: arms axon par myelin lapete, signal 50-100 guna tez' },
    { ph: 3, k: ['mic', 'deb'], t: '4. Microglia: patrol karke kachra nigalte hain (phagocytosis), infection par activate' },
    { ph: 4, k: ['epe'], t: '5. Ependymal cilia: CSF behate hain, dimaag ko cushion + kachra hatana' }],
  tracker: [['Neuroglia', 'Nervous system ke non-neuronal cells'], ['Astrocyte', 'Tara jaisa, BBB'], ['Endfeet', 'Astrocyte ke pair capillary par'], ['Blood-brain barrier', 'Dimaag ki selective diwar'], ['Tight junction', 'Endothelial cells ka seal'], ['Oligodendrocyte', 'CNS myelin cell'], ['Myelin', 'Axon ki lipid insulation'], ['Node of Ranvier', 'Myelin ke beech ka gap'], ['Microglia', 'Dimaag ke macrophage'], ['Phagocytosis', 'Kachra nigalna'], ['Synaptic pruning', 'Extra synapse hatana'], ['Ependymal cell', 'Ventricle ki cilia wali parat'], ['CSF', 'Cerebrospinal fluid'], ['Glial scar', 'Chot ke baad astrocyte scar'], ['Gliosis', 'Glia ka activate/badhna']],
  layers: [L('neu', 'Neuron', '#e8a24a', ['neu']), L('ast', 'Astrocyte', '#e8c07a', ['ast']), L('ves', 'Blood vessel', '#c02a2a', ['ves']), L('oli', 'Oligodendrocyte', '#c88a9a', ['oli']), L('myl', 'Myelin', '#f2e6b8', ['myl']), L('mic', 'Microglia', '#4ab8b0', ['mic', 'deb']), L('epe', 'Ependymal + CSF', '#f0b8a0', ['epe'])] });

registerCellInfo('demyelin', { name: 'Demyelination', fit,
  compare: { title: 'Demyelination: tulna', html: H('1. Healthy vs Demyelinated axon') + TB(['Feature', 'Healthy', 'Demyelinated'], [
    ['Myelin', 'Poori, saabut', 'Tuta, patla'], ['Signal speed', '~ 100 m/s', 'Slow ya ruka'], ['Leak', 'Nahi', 'Haan (ion leak)'], ['Axon', 'Surakshit', 'Mar sakta hai'], ['Kaam', 'Normal', 'Kamzori, sunn, nazar dhundhli']]) +
    H('2. Demyelinating diseases') + TB(['Disease', 'Kahan', 'Wajah'], [
    ['Multiple sclerosis (MS)', 'CNS', 'Autoimmune (T cell)'], ['Guillain-Barre', 'PNS', 'Immune hamla Schwann par'], ['Leukodystrophy', 'CNS', 'Genetic'], ['B12 kami', 'CNS', 'Myelin banne mein dikkat']]) },
  steps: [
    { ph: 0, k: ['hl', 'hax'], t: '1. Sehat axon: myelin saabut, signal node-se-node kood kar tez chalta hai' },
    { ph: 1, k: ['imm', 'dm'], t: '2. Immune attack: T cells myelin par hamla karte hain (autoimmune: MS)' },
    { ph: 2, k: ['dm', 'frg'], t: '3. Myelin toota: sheath patli, tukde-tukde, axon nanga' },
    { ph: 3, k: ['mic', 'frg', 'dax'], t: '4. Microglia safai karte; signal slow/leak: kamzori aur sunn hona' }],
  tracker: [['Demyelination', 'Myelin ka nasht'], ['Multiple sclerosis', 'CNS ki autoimmune bimari'], ['Autoimmunity', 'Apne hi tissue par hamla'], ['T cell', 'Immune cell'], ['Saltatory conduction', 'Node par kood kar signal'], ['Remyelination', 'Myelin ka dobara banna'], ['MBP / MOG', 'Myelin proteins'], ['Plaque (lesion)', 'Demyelinated jagah'], ['Axonal loss', 'Axon ka marna']],
  layers: [L('hl', 'Healthy myelin', '#9fb4e8', ['hl', 'hax']), L('dm', 'Demyelinated myelin', '#9fb4e8', ['dm', 'dax']), L('imm', 'Immune cells', '#e8584a', ['imm']), L('frg', 'Myelin tukde', '#dfe6f5', ['frg']), L('mic', 'Microglia', '#4ab8b0', ['mic'])] });

registerCellInfo('o2atp', { name: 'Oxygen to ATP', fit,
  compare: { title: 'O2 se ATP: tulna', html: H('1. O2 ka safar') + TB(['Step', 'Kahan', 'Kya hota hai'], [
    ['1', 'Phephde', 'O2 hemoglobin se bandhta'], ['2', 'Capillary', 'Tisue ke paas O2 chhodta (Bohr)'], ['3', 'Diffusion', 'Gradient se cell mein'], ['4', 'Mitochondrion', 'ETC ka aakhri acceptor, H2O banta'], ['5', 'ATP synthase', 'Proton gradient se ATP']]) +
    H('2. ATP kahan banta') + TB(['Stage', 'Jagah', 'ATP'], [
    ['Glycolysis', 'Cytoplasm', '2 (net)'], ['Krebs cycle', 'Matrix', '2 (GTP)'], ['ETC + ATP synthase', 'Cristae', '~ 26-28'], ['Kul', '-', '~ 30-32 per glucose']]) },
  steps: [
    { ph: 0, k: ['rbc', 'cap', 'o2'], t: '1. RBC ka hemoglobin tisue ke paas O2 chhodta hai (kam O2, zyada CO2)' },
    { ph: 1, k: ['o2', 'cap', 'cel'], t: '2. O2 diffusion se capillary ki diwar paar karke cell mein' },
    { ph: 2, k: ['mit', 'gl', 'o2', 'etc'], t: '3. Mitochondrion: glucose Krebs mein jalta, electron ETC par chalte, O2 aakhri acceptor' },
    { ph: 3, k: ['mit', 'atp'], t: '4. ATP synthase: proton gradient se ATP ka burst' },
    { ph: 4, k: ['atp', 'co2', 'cel'], t: '5. ATP cell ke kaam mein; CO2 wapas khoon mein, phephdon se bahar' }],
  tracker: [['ATP', 'Cell ki energy currency'], ['Hemoglobin', 'RBC ka O2 protein'], ['Bohr effect', 'Zyada CO2 par O2 chhodna'], ['Diffusion', 'Gradient se gas ka jaana'], ['Mitochondrion', 'Powerhouse'], ['Cristae', 'Andar ki jhilli ki tahen'], ['Krebs cycle', 'Matrix mein acetyl-CoA ka jalna'], ['Electron transport chain', 'Complex I-IV'], ['Proton gradient', 'H+ ka antar'], ['ATP synthase', 'Rotary enzyme, ATP banata'], ['Oxidative phosphorylation', 'ETC + ATP synthase'], ['Glycolysis', 'Glucose ka toot-na cytoplasm mein'], ['CO2', 'Krebs ka kachra'], ['NADH / FADH2', 'Electron carriers']],
  layers: [L('cap', 'Capillary', '#f2b8b0', ['cap']), L('rbc', 'RBC', '#d83a3a', ['rbc']), L('o2', 'Oxygen', '#4ab8f0', ['o2']), L('gl', 'Glucose', '#6ad07a', ['gl']), L('mit', 'Mitochondrion', '#c8742a', ['mit', 'etc']), L('atp', 'ATP', '#ffe84a', ['atp']), L('co2', 'CO2', '#9a9a9a', ['co2']), L('cel', 'Cell', '#e8c8a0', ['cel'])] });

registerCellInfo('touch', { name: 'Touch signal', fit,
  compare: { title: 'Touch: tulna', html: H('1. Signal ka rasta') + TB(['Step', 'Jagah', 'Kya'], [
    ['1', 'Skin receptor', 'Dabav se channel khulte, receptor potential'], ['2', 'Sensory axon', 'Action potential (Na+ in, K+ out)'], ['3', 'Spinal cord', 'Synapse, relay, reflex'], ['4', 'Thalamus', 'Signal ka station'], ['5', 'Cortex', 'Touch mehsoos hona'], ['6', 'Motor neuron', 'Muscle ko hukm']]) +
    H('2. Receptors') + TB(['Receptor', 'Mehsoos'], [['Meissner', 'Halka touch'], ['Merkel', 'Dabav, texture'], ['Pacinian', 'Vibration'], ['Ruffini', 'Khichav'], ['Nociceptor', 'Dard']]) },
  steps: [
    { ph: 0, k: ['skin', 'rec'], t: '1. Ungli dabti hai: receptor ka membrane khichta, mechanosensitive channel khulte' },
    { ph: 1, k: ['sen', 'rec'], t: '2. Na+ andar: threshold paar, action potential sensory axon par' },
    { ph: 2, k: ['cord', 'sen'], t: '3. Spinal cord: sensory neuron synapse par glutamate chhodta, agla neuron activate' },
    { ph: 3, k: ['brn', 'cord'], t: '4. Thalamus se somatosensory cortex: "touch" mehsoos hota hai' },
    { ph: 4, k: ['mot', 'mus', 'cord'], t: '5. Motor neuron muscle ko ACh bhejta hai: muscle sikudta (reflex/movement)' }],
  tracker: [['Mechanoreceptor', 'Dabav ka sensor'], ['Piezo2', 'Mechanosensitive channel'], ['Receptor potential', 'Graded signal'], ['Action potential', 'All-or-none spike'], ['Afferent (sensory)', 'Signal andar laata'], ['Efferent (motor)', 'Signal bahar bhejta'], ['Dorsal root ganglion', 'Sensory cell bodies'], ['Dorsal horn', 'Spinal cord ka sensory hissa'], ['Thalamus', 'Sensory relay station'], ['Somatosensory cortex', 'Touch ka map'], ['Homunculus', 'Body ka cortical map'], ['Reflex arc', 'Dimaag ke bina jaldi jawab'], ['Neuromuscular junction', 'Motor neuron-muscle jod'], ['Synapse', 'Neuron-neuron jod']],
  layers: [L('skin', 'Skin', '#f2c8a8', ['skin']), L('rec', 'Receptor', '#4ad0f0', ['rec']), L('sen', 'Sensory neuron', '#f2c35a', ['sen']), L('cord', 'Spinal cord', '#e8dcc0', ['cord']), L('brn', 'Brain', '#e8b8b0', ['brn']), L('mot', 'Motor neuron', '#f2a24a', ['mot']), L('mus', 'Muscle', '#c8584a', ['mus'])] });

registerCellInfo('plantflow', { name: 'Plant water flow', fit,
  compare: { title: 'Plant flow: tulna', html: H('1. Xylem vs Phloem') + TB(['Feature', 'Xylem', 'Phloem'], [
    ['Kya le jaata', 'Pani + mineral', 'Sugar (sucrose)'], ['Disha', 'Root se patta (upar)', 'Source se sink (dono)'], ['Cells', 'Mare hue (lignin)', 'Jeevit sieve tube'], ['Force', 'Transpiration pull', 'Pressure flow (ATP)']]) +
    H('2. Apoplast vs Symplast') + TB(['Feature', 'Apoplast', 'Symplast'], [['Raasta', 'Cell wall', 'Cytoplasm (plasmodesmata)'], ['Speed', 'Tez', 'Dheema, controlled'], ['Endodermis', 'Casparian strip rok deti', 'Yahin se guzarna padta']]) },
  steps: [
    { ph: 0, k: ['rh', 'soil', 'wat', 'min'], t: '1. Root hair: pani osmosis se, mineral active transport (ATP) se andar' },
    { ph: 1, k: ['cor', 'wat', 'min'], t: '2. Cortex: pani apoplast (wall) aur symplast (plasmodesmata) se, endodermis par symplast' },
    { ph: 2, k: ['xyl', 'wat', 'min'], t: '3. Xylem: pani + mineral upar, transpiration pull + cohesion' },
    { ph: 3, k: ['leaf', 'stm', 'xyl'], t: '4. Leaf cell: pani + CO2 + light se glucose; stomata se bhaap nikalti' },
    { ph: 4, k: ['phl', 'leaf'], t: '5. Phloem: sugar neeche root/fal tak (source se sink)' }],
  tracker: [['Osmosis', 'Kam se zyada concentration ki taraf pani'], ['Active transport', 'ATP se ion pumping'], ['Root hair', 'Surface area badhati'], ['Apoplast', 'Cell wall ka raasta'], ['Symplast', 'Cytoplasm ka raasta'], ['Casparian strip', 'Endodermis ki waterproof patti'], ['Xylem', 'Pani ki nali'], ['Phloem', 'Sugar ki nali'], ['Transpiration', 'Patte se bhaap'], ['Cohesion-tension', 'Pani ke molecules ka jura rehna'], ['Stomata', 'Patte ke ched'], ['Guard cell', 'Stomata kholne wala'], ['Translocation', 'Phloem mein sugar ka jaana'], ['Plasmodesmata', 'Cells ke beech cytoplasm channel']],
  layers: [L('soil', 'Soil', '#8a5a3a', ['soil']), L('wat', 'Pani', '#4ab8f0', ['wat']), L('min', 'Minerals', '#e8d84a', ['min']), L('rh', 'Root hair', '#c8e8b8', ['rh']), L('cor', 'Cortex', '#b8e0a0', ['cor']), L('xyl', 'Xylem', '#5a9ae8', ['xyl']), L('phl', 'Phloem', '#e8b84a', ['phl']), L('leaf', 'Leaf cell', '#6ad07a', ['leaf', 'stm'])] });

registerCellInfo('dnapack', { name: 'DNA packaging', fit,
  compare: { title: 'DNA packaging: tulna', html: H('1. Packaging ke levels') + TB(['Level', 'Chaudai', 'Kya'], [
    ['DNA double helix', '2 nm', '0.34 nm per base pair'], ['Nucleosome', '~ 11 nm', 'DNA + 8 histone, ~ 147 bp'], ['Beads-on-string', '11 nm', 'Nucleosome + linker DNA'], ['Chromatin fibre', '30 nm', 'Solenoid / zig-zag'], ['Loops + scaffold', '300 nm', 'Condensin, topo II'], ['Metaphase chromosome', '~ 1400 nm', 'Sabse compact']]) +
    H('2. Kitna DNA') + TB(['Cheez', 'Maap'], [['Ek cell ka DNA', '~ 2 m (6 arab bp)'], ['Nucleus', '~ 6 um'], ['Compaction', '~ 10,000 guna'], ['Chromosomes', '46 (23 jode)'], ['Sare cells ka DNA', 'Sooraj tak ~ 600 baar aana-jaana']]) +
    H('3. Euchromatin vs Heterochromatin') + TB(['Feature', 'Euchromatin', 'Heterochromatin'], [['Packing', 'Dhili', 'Kasi'], ['Gene', 'Active', 'Band'], ['Rang (EM)', 'Halka', 'Gehra']]) },
  steps: [
    { ph: 0, k: ['dna'], t: '1. DNA double helix: 2 nm chaudi, har base pair 0.34 nm: kul ~ 2 m lamba' },
    { ph: 1, k: ['nsm'], t: '2. Nucleosome: negative DNA positive histone octamer (8 histone) par ~ 1.65 baar lipta' },
    { ph: 2, k: ['bds'], t: '3. Beads-on-string: nucleosome dhaage par dohrate, ~ 6-7 guna chhota' },
    { ph: 3, k: ['fib'], t: '4. Chromatin fibre: moti kundli (30 nm), H1 histone se' },
    { ph: 4, k: ['chr'], t: '5. Chromosome: loops + scaffold se metaphase ka X, ~ 10,000 guna compact' },
    { ph: 5, k: ['nuc', 'chr'], t: '6. Nucleus: ~ 6 um mein 46 chromosomes: ~ 2 m DNA samaya hua' }],
  tracker: [['DNA double helix', 'Do strand ki kundli'], ['Base pair', 'A-T, G-C jodi'], ['Histone', 'DNA lapetne wale + protein'], ['Histone octamer', '8 histone ka gola'], ['Nucleosome', 'DNA + octamer (~ 147 bp)'], ['Linker DNA', 'Nucleosomes ke beech ka DNA'], ['H1 histone', 'Fibre ko kasne wala'], ['Chromatin', 'DNA + protein'], ['Euchromatin', 'Dhila, active'], ['Heterochromatin', 'Kasa, band'], ['Condensin', 'Chromosome condense kare'], ['Chromosome', 'Compact DNA ki ikai'], ['Centromere', 'Do chromatid ka jod'], ['Telomere', 'Chromosome ke sire'], ['Histone code', 'Acetyl/methyl se gene control'], ['Nuclear pore', 'Nucleus ka darwaza']],
  layers: [L('dna', 'DNA helix', '#f2a02a', ['dna']), L('nsm', 'Nucleosome', '#8a5ad8', ['nsm']), L('bds', 'Beads-on-string', '#e0508a', ['bds']), L('fib', 'Chromatin fibre', '#6a4ac8', ['fib']), L('chr', 'Chromosome', '#9a82f0', ['chr']), L('nuc', 'Nucleus', '#2a7a9a', ['nuc'])] });

registerCellInfo('virus', { name: 'Virus infection', fit,
  compare: { title: 'Virus: tulna', html: H('1. Virus ka lifecycle') + TB(['Step', 'Kya hota hai'], [
    ['Attachment', 'Spike receptor se judta'], ['Entry', 'Endocytosis ya membrane fusion'], ['Uncoating', 'Capsid khulta, genome chhootta'], ['Replication', 'Genome ki copies'], ['Translation', 'Host ribosome se viral protein'], ['Assembly', 'Naye virion jud te'], ['Release', 'Budding ya lysis']]) +
    H('2. Virus vs Bacteria') + TB(['Feature', 'Virus', 'Bacteria'], [['Size', '20-300 nm', '1-5 um'], ['Cell', 'Nahi (acellular)', 'Haan (prokaryote)'], ['Copy', 'Host cell mein hi', 'Khud'], ['Ilaaj', 'Antiviral, vaccine', 'Antibiotic']]) +
    H('3. Genome ke type') + TB(['Type', 'Example'], [['ssRNA (+)', 'SARS-CoV-2, polio'], ['ssRNA (-)', 'Influenza, rabies'], ['dsDNA', 'Herpes, smallpox'], ['Retrovirus (RNA->DNA)', 'HIV']]) },
  steps: [
    { ph: 0, k: ['vir', 'rec', 'cel'], t: '1. Attachment: virus ka spike cell ke receptor (jaise ACE2) se lock-and-key judta' },
    { ph: 1, k: ['vir', 'end', 'rec'], t: '2. Entry: cell virus ko endocytosis se nigal leti hai (endosome)' },
    { ph: 2, k: ['rna', 'end'], t: '3. Uncoating: capsid khulta, viral RNA cytoplasm mein' },
    { ph: 3, k: ['rna', 'rib', 'new', 'nuc'], t: '4. Replication + assembly: host ribosome viral protein banate, RNA copies, naye virions jud te' },
    { ph: 4, k: ['new', 'cel'], t: '5. Release: naye virus budding/lysis se bahar, agle cells ko infect' }],
  tracker: [['Virion', 'Poora virus particle'], ['Capsid', 'Genome ka protein khol'], ['Envelope', 'Lipid parat (kuch virus mein)'], ['Spike (S) protein', 'Receptor se judne wala'], ['ACE2', 'SARS-CoV-2 ka receptor'], ['Tropism', 'Kaunsa cell/ang infect'], ['Endocytosis', 'Cell ka nigalna'], ['Membrane fusion', 'Envelope-membrane milna'], ['Uncoating', 'Capsid hatna'], ['RdRp', 'RNA se RNA banane wala enzyme'], ['Reverse transcriptase', 'RNA se DNA (HIV)'], ['Budding', 'Membrane lekar bahar nikalna'], ['Lysis', 'Cell phatna'], ['Mutation', 'Genome mein badlav'], ['Vaccine', 'Immune ko pehle sikhana']],
  layers: [L('vir', 'Virus', '#e86a8a', ['vir']), L('rec', 'Receptors', '#4ad0f0', ['rec']), L('cel', 'Host cell', '#e8c8a0', ['cel']), L('end', 'Endosome', '#e8c8a0', ['end']), L('rna', 'Viral RNA', '#ffe04a', ['rna']), L('rib', 'Ribosomes', '#4ab8f0', ['rib']), L('new', 'Naye virus', '#e86a8a', ['new']), L('nuc', 'Nucleus', '#8a5ad8', ['nuc'])] });

registerCellInfo('immune', { name: 'Immune fight / CAR-T', fit,
  compare: { title: 'Immune: tulna', html: H('1. Immune ke do hisse') + TB(['Feature', 'Innate', 'Adaptive'], [['Speed', 'Minutes-ghante', 'Din (pehli baar)'], ['Specific', 'Nahi', 'Haan (antigen)'], ['Memory', 'Nahi', 'Haan'], ['Cells', 'Macrophage, NK, neutrophil', 'T cell, B cell']]) +
    H('2. T cell ke type') + TB(['Cell', 'Kaam'], [['Cytotoxic (CD8)', 'Infected/cancer cell ko maarta'], ['Helper (CD4)', 'Dusre immune cells ko sanket'], ['Regulatory', 'Immune ko shaant rakhta'], ['Memory', 'Dobara hamle par tez jawab']]) +
    H('3. CAR-T therapy') + TB(['Step', 'Kya'], [['1', 'Marij se T cells nikalte'], ['2', 'Lab mein CAR gene dalte'], ['3', 'Cells badhate'], ['4', 'Wapas khoon mein'], ['5', 'CAR cancer antigen se judkar maarta']]) },
  steps: [
    { ph: 0, k: ['tc', 'car'], t: '1. Scan: CAR-T cell cancer cell dhoondta aur surface par target (antigen) khojta' },
    { ph: 1, k: ['tc', 'car', 'syn', 'can'], t: '2. Lock-on: CAR antigen se judta, hara immune synapse ring banta' },
    { ph: 2, k: ['syn', 'gra', 'can'], t: '3. Kill signal: perforin chhed karta, granzyme andar jaakar caspase chalu karta' },
    { ph: 3, k: ['can', 'nuc', 'blb'], t: '4. Apoptosis: cancer cell sikudta, blebs, DNA tootta (lock ke ~ 9 min baad)' },
    { ph: 4, k: ['tc', 'blb'], t: '5. T cell agle target ki taraf; apoptotic bodies ko macrophage saaf karte' }],
  tracker: [['CAR-T cell', 'Engineered killer T cell'], ['CAR', 'Chimeric antigen receptor'], ['Antigen', 'Target pehchan (jaise CD19)'], ['TCR', 'T cell receptor'], ['Immune synapse', 'T cell-target ka jod'], ['Perforin', 'Membrane mein chhed'], ['Granzyme', 'Caspase chalane wala enzyme'], ['Caspase', 'Apoptosis ke enzymes'], ['Apoptosis', 'Programmed cell death'], ['Necrosis', 'Sujan wali maut'], ['Cytotoxic T cell (CD8)', 'Killer T cell'], ['MHC-I', 'Cell ka ID card'], ['Cytokine', 'Immune ke sanket'], ['Macrophage', 'Kachra khane wala'], ['Immunotherapy', 'Immune se ilaaj']],
  layers: [L('tc', 'T cell', '#2ab8e8', ['tc']), L('car', 'CAR receptors', '#ffe04a', ['car']), L('syn', 'Immune synapse', '#2ad050', ['syn']), L('gra', 'Granules', '#ffe04a', ['gra']), L('can', 'Cancer cell', '#8a5ad8', ['can']), L('nuc', 'Nucleus', '#5a3ab8', ['nuc']), L('blb', 'Blebs', '#8a5ad8', ['blb'])] });
})();

