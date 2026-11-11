
(() => {
if (typeof registerDetail === 'undefined') throw new Error('04-detail-viewer.js purana hai (registerDetail nahi mila): naya 04-detail-viewer.js upload karo');
const PI = Math.PI, K = CVKit, rr = K.rr;

registerDetail('cn_cycle', A => {
  A.ttl('Cell cycle + checkpoints'); A.cam([0, 0, 0, 10, 14, .2, .1]);
  const R = 2.5, ph = [['G1', 0xf2c35a, 0, .36], ['S', 0x4ad0f0, .36, .62], ['G2', 0x6ad0a0, .62, .86], ['M', 0xe0504a, .86, 1]];
  const arc = (a, b, y) => { const o = []; for (let i = 0; i <= 14; i++) { const t = (a + (b - a) * i / 14) * PI * 2 - PI / 2; o.push([R * Math.cos(t), R * Math.sin(t) * 1 + (y || 0), 0]); } return o; };
  const PCY = A.part('Cell cycle (G1-S-G2-M)', 'G1: cell badhta; S: DNA copy; G2: taiyari; M: mitosis. Cyclin-CDK jodi ek phase se agle mein dhakelti hai. Cancer mein ye brake kharab ho jaate hain.');
  ph.forEach(p => A.tube(arc(p[2] + .005, p[3] - .005), .17, p[1], PCY, .95));
  const at = f => { const t = f * PI * 2 - PI / 2; return [R * Math.cos(t), R * Math.sin(t), 0]; };
  const PG1 = A.part('G1/S checkpoint (RB, p53)', 'RB ("brake") E2F ko pakadkar rakhta hai jab tak cell ko growth signal na mile. DNA kharab ho to p53 -> p21 -> CDK band: cell ruk jaata hai. RB/p53 mutate hone par gate hamesha khula.');
  const PG2 = A.part('G2/M checkpoint', 'Check hota hai ki DNA poora copy hua aur kharab to nahi (ATM/ATR, Chk1/2 -> Cdc25 band).');
  const PSP = A.part('Spindle checkpoint (M)', 'Metaphase mein sab chromosomes spindle se juda na ho to anaphase nahi hota (Mad2). Cancer mein ye dhila ho to chromosome ginti galat (aneuploidy).');
  [[.36, PG1, 0xf2c35a], [.86, PG2, 0x6ad0a0]].forEach(g => { const p = at(g[0]); A.bar([p[0] * .8, p[1] * .8, 0], [p[0] * 1.25, p[1] * 1.25, 0], .09, 0xe0504a, g[1], .95); A.add(sp(.2, 10, 8), 0xe0504a, p[0] * 1.3, p[1] * 1.3, 0, { op: 1 }, g[1]); });
  { const p = at(.95); A.add(sp(.2, 10, 8), 0xe0504a, p[0] * 1.3, p[1] * 1.3, 0, { op: 1 }, PSP); }
  const PP = A.part('p53 ("guardian of the genome")', 'Tumor suppressor: DNA damage par jama hota hai, cell cycle rokta, DNA repair karata, na ho paye to apoptosis. ~ 50% cancers mein TP53 mutated hai; Li-Fraumeni syndrome mein ek copy janm se kharab.');
  A.add(sp(.42, 14, 12), 0x4ad0f0, -4.2, 1.2, 0, { op: .95 }, PP); A.add(new T.CylinderGeometry(.08, .08, .5, 8), 0xffffff, -4.2, 1.2, .1, { op: .9 }, PP);
  const PR = A.part('RB (retinoblastoma protein)', 'G1 ka brake: E2F transcription factor ko pakadta hai. CDK4/6-cyclin D usko phosphorylate karke hata deta hai -> S phase. RB mutation se retinoblastoma (bachchon ka aankh ka cancer).');
  A.add(sp(.42, 14, 12), 0xf2c35a, -4.2, -.2, 0, { op: .95 }, PR);
  const PO = A.part('Oncogene (RAS, MYC) accelerator', 'Oncogene = "stuck accelerator": RAS/MYC mutate hokar growth signal hamesha ON rakhte hain. Tumor suppressor (p53/RB) = brake. Cancer = accelerator ON + brake OFF.');
  A.add(sp(.42, 14, 12), 0xff8a3c, -4.2, -1.6, 0, { op: .95 }, PO);
  A.flow(arc(0, 1), 0xffee44, 12, .07, .07);
  A.lab('G1', at(.18).map((v, i) => i < 2 ? v * 1.55 : 0), '#f2c35a'); A.lab('S', at(.49).map((v, i) => i < 2 ? v * 1.55 : 0), '#4ad0f0'); A.lab('G2', at(.74).map((v, i) => i < 2 ? v * 1.55 : 0), '#6ad0a0'); A.lab('M', at(.93).map((v, i) => i < 2 ? v * 1.55 : 0), '#e0504a');
  A.lab('G1/S gate', at(.36).map((v, i) => i < 2 ? v * 1.75 : 0), '#e0504a'); A.lab('p53', [-4.2, 1.95, 0], '#4ad0f0'); A.lab('RB', [-4.2, .5, 0], '#f2c35a'); A.lab('Oncogene', [-4.2, -1.0, 0], '#ff8a3c');
  A.lab('Cancer = gate khula + accelerator ON', [0, -3.4, 0], '#ffe9a0');
});

registerDetail('cn_bm', A => {
  A.ttl('Basement membrane breach'); A.cam([0, 0, 0, 10, 14, .2, .1]);
  const PB = A.part('Basement membrane (collagen IV + laminin)', 'Patli (~ 50-100 nm) chadar: collagen IV ka jaal + laminin + nidogen. Epithelium ko stroma se alag rakhti hai. Normal aur in situ cancer mein saabut.');
  for (let i = 0; i < 9; i++) { const x = -4.5 + i * 1.1; if (Math.abs(x) < .9) continue; A.tube([[x, -.2, -1], [x, -.2, 0], [x, -.2, 1]], .05, 0xf2e6a0, PB, .95); }
  for (let z = -1; z <= 1; z += .5) { A.tube([[-5, -.2, z], [-1.2, -.2, z], ], .05, 0xf2e6a0, PB, .9); A.tube([[1.2, -.2, z], [5, -.2, z]], .05, 0xf2e6a0, PB, .9); }
  const PC = A.part('Invasive cancer cell', 'Cancer cell actin ki ungli jaisi shaklen (invadopodia) banata hai jo BM ko chhedti hain, phir stroma mein ghus jaata hai. EMT (epithelial-mesenchymal transition) se cell chipakne wale gun kho kar chalne wala ban jaata hai.');
  A.add(sp(.9, 18, 14), 0xd03a3a, 0, .85, 0, { op: .9, s: [1, 1.1, 1] }, PC); A.add(sp(.36, 12, 10), 0x6a4ab8, 0, .9, .05, { op: .95 }, PC);
  [[-.4, -.2], [0, -.5], [.4, -.2]].forEach(p => A.tube([[p[0], .1, 0], [p[0] * .9, p[1] + .2, 0], [p[0] * .5, p[1] - .6, 0]], .06, 0xff7a6a, PC, .95));
  const PM = A.part('MMP enzymes', 'Matrix metalloproteinase (MMP-2, MMP-9): zinc wale enzymes jo collagen IV ko kaat dete hain. Cancer cell inhe zyada banata hai, isse BM mein ched hota hai.');
  K.dots(A, PM, 26, () => [rr(-1, 1), rr(-.9, .4), rr(-.4, .4)], 0xffe04a, .06, .95);
  const PS = A.part('Stroma + blood vessel', 'BM ke neeche collagen, fibroblast aur khoon ki nali. Cancer cell nali ki diwar todkar khoon mein jaata hai (intravasation) -> metastasis.');
  A.tube([[-5, -2.3, 0], [0, -2.3, 0], [5, -2.3, 0]], .4, 0xc02a2a, PS, .55);
  A.flow([[0, .1, 0], [0, -.8, 0], [.2, -1.6, 0], [.2, -2.3, 0]], 0xff7a6a, 5, .06, .1);
  A.lab('Cancer cell', [0, 2.2, 0], '#d03a3a'); A.lab('MMP enzymes', [1.6, .2, 0], '#ffe04a'); A.lab('Basement membrane', [-3.4, .3, 0], '#f2e6a0'); A.lab('Stroma', [-4, -1.2, 0], '#e0a0a8'); A.lab('Blood vessel: metastasis', [0, -3.1, 0], '#c02a2a');
  A.go('Cell cycle + checkpoints ▸', 'cn_cycle');
});
})();

