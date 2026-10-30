
(() => {
const TB = CVKit.table, H = CVKit.h3;
const CMP = H('1. Normal vs Cancer cell') + TB(['Feature', 'Normal', 'Cancer'], [
  ['Growth signal', 'Zaroorat par hi', 'Khud-ba-khud, hamesha'],
  ['Checkpoint (p53/RB)', 'Kaam karte', 'Kharab / gayab'],
  ['Apoptosis', 'Kharab cell marta hai', 'Bach jaata hai'],
  ['Divisions', 'Seemit (Hayflick)', 'Lagbhag amar (telomerase)'],
  ['Shape / nucleus', 'Ekjaisa', 'Aniyamit, bada nucleus'],
  ['Jagah', 'Apni parat mein', 'Jama hota, phailta'],
  ['Mutation', 'Kam', 'Bahut (genome unstable)']]) +
  H('2. Cancer ke 5 stages (is model ke)') + TB(['Stage', 'Kya hota hai', 'BM'], [
  ['Normal', 'Ek parat, checkpoints theek', 'Saabut'],
  ['Checkpoint fail', 'TP53/RB mutation: brake khatam', 'Saabut'],
  ['Baar-baar mitosis', 'Mutated cells clone banate', 'Saabut'],
  ['Carcinoma in situ', 'Poori motai bhari, par BM ke upar', 'Saabut'],
  ['Invasive', 'BM toota, stroma + nali mein', 'Tuta']]) +
  H('3. Oncogene vs Tumor suppressor') + TB(['Type', 'Role', 'Example'], [
  ['Oncogene', 'Accelerator (ON = cancer)', 'RAS, MYC, HER2'],
  ['Tumor suppressor', 'Brake (OFF = cancer)', 'TP53, RB, BRCA1'],
  ['Mutation type', 'Gain-of-function', 'Loss-of-function']]) +
  H('4. In situ vs Invasive') + TB(['Feature', 'In situ', 'Invasive'], [
  ['Basement membrane', 'Saabut', 'Toota'],
  ['Metastasis', 'Nahi', 'Ho sakta hai'],
  ['Ilaaj', 'Aasan (surgery)', 'Mushkil, systemic']]);
const TRK = [
  ['Epithelium', 'Sataah dhakne wali cells ki parat'], ['Basement membrane', 'Collagen IV + laminin ki chadar'], ['Stroma', 'BM ke neeche ka tissue'], ['Cell cycle', 'G1-S-G2-M'],
  ['Checkpoint', 'Cell cycle ka quality-control gate'], ['TP53', 'Genome ka guardian: tumor suppressor'], ['RB', 'G1/S ka brake'], ['Oncogene', 'Stuck accelerator (RAS, MYC)'],
  ['Tumor suppressor', 'Brake (p53, RB, BRCA)'], ['Apoptosis', 'Programmed cell death'], ['Clonal expansion', 'Ek mutated cell se clone'], ['Hyperplasia', 'Cells ki sankhya badhna'],
  ['Dysplasia', 'Aniyamit shape wale cells'], ['Carcinoma in situ', 'Cancer par BM ke andar'], ['Invasive carcinoma', 'BM tod chuka cancer'], ['MMP', 'Collagen kaatne wale enzyme'],
  ['EMT', 'Epithelial se chalne wale cell mein badlav'], ['Metastasis', 'Doosre ang mein phailna'], ['Intravasation', 'Khoon ki nali mein ghusna'], ['Angiogenesis', 'Tumor ke liye nayi nalis'],
  ['Aneuploidy', 'Chromosome ginti galat'], ['Telomerase', 'Amar banane wala enzyme'], ['Carcinogen', 'Mutation karne wala (smoke, UV)']];
registerCellInfo('cancer', {
  name: 'Cancer progression',
  fit: { r: [12.5, 10.5], t: [[0, 0, 0], [0, 0, 0]] },
  compare: { title: 'Cancer: tulna', html: CMP },
  steps: [
    { ph: 0, k: ['epi', 'bm', 'chk'], t: '1. Normal epithelium: ek parat, BM saabut, TP53/RB guard kaam par' },
    { ph: 1, k: ['chk', 'epi', 'nuc'], t: '2. Checkpoint fail: TP53/RB mutate: brake khatam, kuch cells ab ruk nahi paate' },
    { ph: 2, k: ['tum', 'nuc'], t: '3. Baar-baar mitosis: mutated cells clone banate, upar jama hote (hyperplasia/dysplasia)' },
    { ph: 3, k: ['tum', 'bm'], t: '4. Carcinoma in situ: poori motai cancer cells se bhari par BM ke upar (abhi phailna nahi)' },
    { ph: 4, k: ['tum', 'bm', 'str', 'ves'], t: '5. Invasive: BM toota, cells stroma mein, nali tak: metastasis ka khatra' }
  ],
  tracker: TRK,
  layers: [
    { id: 'epi', name: 'Normal epithelium', color: '#6ec07a', parts: ['epi'] },
    { id: 'tum', name: 'Cancer cells', color: '#d03a3a', parts: ['tum'] },
    { id: 'nuc', name: 'Nuclei', color: '#6a4ab8', parts: ['nuc'] },
    { id: 'chk', name: 'p53 / RB guards', color: '#4ad0f0', parts: ['chk'] },
    { id: 'bm', name: 'Basement membrane', color: '#f2e6a0', parts: ['bm'] },
    { id: 'str', name: 'Stroma', color: '#e0a0a8', parts: ['str'] },
    { id: 'ves', name: 'Blood vessel', color: '#c02a2a', parts: ['ves'] }
  ]
});
})();

