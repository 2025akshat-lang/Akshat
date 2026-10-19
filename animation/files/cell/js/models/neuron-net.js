/* NEURON network view: n_net (ek neuron ke ~7,000 connections + brain ke 86 billion neurons). neuron-detail.js ke baad load karo. */
(() => {
if (typeof registerDetail === 'undefined') throw new Error('04-detail-viewer.js purana hai (registerDetail nahi mila): naya 04-detail-viewer.js upload karo');
const PI = Math.PI, K = CVKit, rr = K.rr;
registerDetail('n_net', A => {
  A.ttl('Neuron network'); A.cam([0, 0, 0, 11.5, 16, .2, .05]);
  const PB = A.part('Brain: ~86 billion neurons', 'Insaani dimaag mein ~ 86 arab neurons aur utne hi (~ 85 arab) glial cells. Har neuron ~ 7,000 synapses banata hai: kul ~ 10^14 (100 trillion) connections. Isi jaal (connectome) se yaad, sochna aur movement hota hai.');
  const outl = []; for (let i = 0; i <= 56; i++) { const a = i / 56 * PI * 2, r = 1 + .05 * Math.sin(a * 7) + .03 * Math.cos(a * 11); outl.push([4.7 * Math.cos(a) * r, 3.1 * Math.sin(a) * r + .3, -1.4]); }
  A.tube(outl, .04, 0xf2c35a, PB, .75, { cl: true });
  K.dots(A, PB, 220, () => { let p; do { p = [rr(-4.7, 4.7), rr(-3.1, 3.6), rr(-1.8, -.9)]; } while (Math.hypot(p[0] / 4.7, (p[1] - .3) / 3.1) > .96); return p; }, 0xffe9a0, .045, .8);
  for (let i = 0; i < 26; i++) { const a = [rr(-4, 4), rr(-2.6, 3), -1.3], b = [a[0] + rr(-1.4, 1.4), a[1] + rr(-1.2, 1.2), -1.3]; A.bar(a, b, .008, 0xf2c35a, PB, .35); }
  const PT = A.part('Axon + myelin (trunk)', 'Ek hi axon (~ 1 m tak lamba) jo myelin se dhaka hai: signal tez chalta hai. Aage chalkar bahut si shakhaon (collaterals) mein baantta hai.', 1, 'n_axon');
  A.tube([[0, -3.4, 0], [0, -2.4, 0], [.05, -1.4, 0]], .11, 0xf2c35a, PT, .95);
  [-3.0, -2.1].forEach(y => A.add(new T.CylinderGeometry(.19, .19, .7, 14), 0xf2e6a0, 0, y - .1, 0, { op: .7 }, PT));
  const PC = A.part('Axon collaterals (shakhayen)', 'Axon kai baar do-teen mein baantta hai: ek neuron sainkdon-hazaron dusre neurons tak ek saath signal pahunchata hai (divergence).');
  const PA = A.part('Terminal arbor + synapses (~ 7,000)', 'Shakhaon ke sire par chhote bouton (synaptic terminals): har ek dusre neuron ke dendrite/spine se synapse banata hai. Ek neuron ~ 7,000 synapses (1,000-10,000+). Cerebellum ke Purkinje cell par ~ 2 lakh tak!', 1, 'n_syn');
  const leaves = [];
  const grow = (x, y, z, ang, len, d) => {
    const ex = x + Math.sin(ang) * len, ey = y + Math.cos(ang) * len, ez = z + rr(-.45, .45);
    if (d <= 2) A.bar([x, y, z], [ex, ey, ez], .075 - d * .018, 0xf2c35a, PC, .95); else A.bar([x, y, z], [ex, ey, ez], .028, 0xffd88a, PA, .9);
    if (d >= 4) { leaves.push([ex, ey, ez]); return; }
    const n = d === 0 ? 4 : 3, spread = d === 0 ? 1.55 : d === 1 ? 1.1 : .95;
    for (let i = 0; i < n; i++) grow(ex, ey, ez, ang + (i - (n - 1) / 2) * (spread / (n - 1 || 1)) + rr(-.12, .12), len * (d === 0 ? .85 : .72), d + 1);
  };
  grow(.05, -1.4, 0, 0, 1.25, 0);
  const pts = []; leaves.forEach(l => { for (let j = 0; j < 3; j++) pts.push([l[0] + rr(-.12, .12), l[1] + rr(-.12, .12), l[2] + rr(-.12, .12)]); });
  const syn = A.inst(sp(.045, 8, 6), 0xffffff, pts, PA, .9);
  const PS = A.part('Synapse (20-30 nm cleft)', 'Har bouton aur agle neuron ke beech sirf ~ 20-30 nm ki khai: neurotransmitter vesicle se nikalkar yahin se guzarta hai. Zyadatar (~ 80-90%) excitatory glutamate synapse spines par.', 1, 'n_syn');
  A.add(sp(.16, 12, 10), 0xffffff, 3.6, 2.7, 0, { op: .95 }, PS); A.add(sp(.09, 10, 8), 0xff7aa8, 3.6, 2.45, 0, { op: .95 }, PS);
  A.flow([[.05, -3.4, 0], [.05, -2.3, 0], [.05, -1.4, 0]], 0xffee44, 6, .12, .07);
  A.flow([[.05, -1.4, 0], [-.6, -.3, 0], [-1.3, .8, 0]], 0xffee44, 5, .1, .05); A.flow([[.05, -1.4, 0], [.6, -.3, 0], [1.4, .9, 0]], 0xffee44, 5, .1, .05); A.flow([[.05, -1.4, 0], [.1, -.2, 0], [.1, 1.2, 0]], 0xffee44, 5, .1, .05);
  A.tick((dt, t) => { if (syn && syn.material) syn.material.opacity = .55 + .45 * Math.sin(t * 3); });
  A.lab('YOUR BRAIN: ~ 86 billion neurons', [0, 3.9, 0], '#f2c35a'); A.lab('1 neuron = ~ 7,000 connections', [0, 3.35, 0], '#ffe9a0');
  A.lab('Axon ~ 1 m', [-1.7, -2.6, 0], '#f2c35a'); A.lab('Collaterals ~ 1 mm', [-2.6, -.2, 0], '#f2c35a'); A.lab('Synapse ~ 1 um', [2.4, 2.2, 0], '#ffd88a'); A.lab('Cleft ~ 20-30 nm', [3.6, 2.1, 0], '#ff7aa8'); A.lab('Myelin', [1.0, -2.55, 0], '#f2e6a0'); A.lab('~ 10^14 synapses kul', [-3.4, 1.5, 0], '#ffe9a0');
  A.go('Synapse detail ▸', 'n_syn'); A.go('Axon ▸', 'n_axon');
});
})();
/* END OF FILE neuron-net.js */
