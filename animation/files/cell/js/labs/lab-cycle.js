/* Cell-cycle timeline: G1 / S / G2 / M, checkpoints, cyclin-CDK (conceptual), aur chromosome vs chromatid vs DNA content vs ploidy ALAG ginti.
   Timing: typical fast-dividing human cell in culture ~24 h (G1 11, S 8, G2 4, M 1). Alag cells mein bahut farak hota hai (G0 mein koi cycle nahi).
   Cyclin curves conceptual hain (a.u.), measured data nahi. Human diploid cell: 2n = 46. */
'use strict';
(() => {
if (!window.CVLabs) throw new Error('labs-core.js pehle load karo');
const SEG = [['G1', 0, 11, '#6fb4ff'], ['S', 11, 19, '#f2c35a'], ['G2', 19, 23, '#7fd6c2'], ['M', 23, 24, '#e0527a']];
const MSUB = [['Prophase', 0, .3], ['Prometaphase', .3, .5], ['Metaphase', .5, .65], ['Anaphase', .65, .78], ['Telophase', .78, .9], ['Cytokinesis', .9, 1]];
const smooth = x => x * x * (3 - 2 * x), bump = (t, c, w) => Math.exp(-Math.pow((t - c) / w, 2));


function state(t) {
  let seg = SEG.find(s => t >= s[1] && t < s[2]) || SEG[3], name = seg[0], sub = null, f = (t - seg[1]) / (seg[2] - seg[1]);
  const o = { name, f, sub: null, sf: 0, chrom: 46, chat: 46, dna: '2C', dnaV: 2, text: '' };
  if (name === 'G1') { o.text = 'Cell grow karta hai, organelles aur proteins banata hai. Har chromosome mein 1 DNA molecule (1 chromatid). Restriction point (G1/S checkpoint) par cell decide karta hai: divide karo, ruko ya G0 mein jao.'; }
  else if (name === 'S') { o.dnaV = 2 + 2 * smooth(f); o.dna = (o.dnaV).toFixed(1) + 'C (badh raha)'; o.chat = Math.round(46 + 46 * f); o.text = 'DNA replication: har chromosome ka DNA copy hota hai. DNA content 2C se 4C tak, par chromosome ginti 46 hi rehti hai. Naye bane chromatids sister chromatids hain.'; }
  else if (name === 'G2') { o.dna = '4C'; o.dnaV = 4; o.chat = 92; o.text = 'Cell mitosis ke liye tayaar hota hai. 46 chromosomes, har ek mein 2 sister chromatids = 92 chromatids. G2/M checkpoint: DNA poora copy hua? koi damage to nahi?'; }
  else {
    o.dna = '4C'; o.dnaV = 4; o.chat = 92; const m = MSUB.find(x => f >= x[1] && f < x[2]) || MSUB[5]; o.sub = m[0]; o.sf = (f - m[1]) / (m[2] - m[1]); o.name = 'M | ' + m[0];
    const tx = {
      Prophase: 'Chromatin condense hoke chromosomes banta hai (X-shape: 2 sister chromatids centromere par jude). Centrosomes alag hote hain, spindle banna shuru.',
      Prometaphase: 'Nuclear envelope tootta hai. Spindle microtubules kinetochores se jud jate hain.',
      Metaphase: 'Saare 46 chromosomes metaphase plate par line mein. Spindle assembly checkpoint: har kinetochore sahi attach na ho to anaphase ruka rehta hai.',
      Anaphase: 'Cohesin kat-ta hai (separase): sister chromatids alag hote hain. Ab har ek apne aap mein chromosome kehlata hai: ek cell mein 92 chromosomes (2 sets x 46). DNA content abhi bhi 4C.',
      Telophase: 'Do poles par 46 + 46 chromosomes, nuclear envelope dobara banta hai, chromosomes decondense hote hain.',
      Cytokinesis: 'Cleavage furrow (actin-myosin ring) cell ko do daughter cells mein todta hai. Har daughter: 46 chromosomes, 2C, 2n.'
    };
    o.text = tx[m[0]];
    if (m[0] === 'Anaphase' || m[0] === 'Telophase') o.chrom = 92;
    if (m[0] === 'Anaphase' || m[0] === 'Telophase') o.chat = 92;
    if (m[0] === 'Cytokinesis' && o.sf > .6) { o.chrom = 46; o.chat = 46; o.dna = '2C (har daughter mein)'; o.dnaV = 2; }
    else if (m[0] === 'Cytokinesis') { o.chrom = 92; o.chat = 92; }
  }
  if (name === 'G1' || name === 'S' || name === 'G2') { o.chrom = 46; }
  return o;
}

const cyc = {
  D: t => (.25 + .75 * smooth(Math.min(1, t / 6))) * (t > 23.5 ? Math.max(0, 1 - (t - 23.5) * 2) : 1),
  E: t => bump(t, 10.5, 1.8), A: t => (t > 10 && t < 23.7 ? smooth(Math.min(1, (t - 10) / 6)) * (t > 23.4 ? 0 : 1) : 0),
  B: t => (t > 17 ? smooth(Math.min(1, (t - 17) / 6.2)) : 0) * (t > 23.65 ? 0 : 1)
};

CVLabs.register({ id: 'cycle', name: 'Cell cycle', desc: 'G1 S G2 M, interphase, mitosis, checkpoints, cyclin CDK, chromatid, chromosome, DNA content, ploidy', build(root, H) {
  const { ctl, btn, canvas, graph, el, COL } = H;
  let t = 3, playing = false, raf = 0, alive = true, last = 0;
  root.append(el('p', 'lbd', 'Cell cycle ek chakra hai: G1, S, G2, M. Slider se (ya Play se) ghoomo aur dekho ki chromosomes, chromatids aur DNA content alag-alag kaise badalte hain.'));
  const cvT = canvas(root, .17, 62), cvC = canvas(root, .6, 190);
  const bp = el('div', 'lbchips'); root.append(bp);
  const bPlay = btn(bp, 'Play', () => { playing = !playing; bPlay.textContent = playing ? 'Pause' : 'Play'; bPlay.classList.toggle('on', playing); });
  SEG.forEach(s => btn(bp, s[0], () => { t = s[1] + (s[2] - s[1]) * .5; playing = false; bPlay.textContent = 'Play'; bPlay.classList.remove('on'); sl.set(t); draw(); }));
  const sl = ctl(root, 'Time in cycle', 0, 23.99, .01, t, v => v.toFixed(1) + ' h', v => { t = v; draw(); });
  const info = el('div', 'lbinfo'); root.append(info);
  const cvG = canvas(root, .5, 170);
  root.append(el('p', 'lbnote', 'Timings (G1 11 h, S 8 h, G2 4 h, M 1 h) typical fast-dividing human cultured cell ke hain; sach mein bahut alag hote hain (embryo mein minutes, neuron G0 mein). M ke sub-phases ka time approximate hai. Cyclin curves conceptual hain (a.u.), measured nahi. Cyclin D-CDK4/6, E-CDK2, A-CDK2/1, B-CDK1.'));

  function drawTimeline() {
    cvT.fit(); const c = cvT.ctx, w = cvT.w, h = cvT.h, pad = 8, bw = w - pad * 2, y = 14, bh = 22;
    c.clearRect(0, 0, w, h); c.font = '11px "IBM Plex Mono",monospace'; c.textBaseline = 'middle'; c.textAlign = 'center';
    SEG.forEach(s => { const x0 = pad + s[1] / 24 * bw, x1 = pad + s[2] / 24 * bw; c.fillStyle = s[3]; c.globalAlpha = state(t).name.startsWith(s[0]) ? 1 : .45; c.fillRect(x0, y, x1 - x0 - 1, bh); c.globalAlpha = 1; c.fillStyle = '#06141f'; c.fillText(s[0], (x0 + x1) / 2, y + bh / 2); });
    const cx = pad + t / 24 * bw; c.fillStyle = COL.fg; c.beginPath(); c.moveTo(cx, y + bh + 2); c.lineTo(cx - 5, y + bh + 9); c.lineTo(cx + 5, y + bh + 9); c.fill();
    
    [[11, 'G1/S'], [23, 'G2/M'], [23.62, 'SAC']].forEach((k, i) => { const x = pad + k[0] / 24 * bw; c.fillStyle = COL.hl; c.fillRect(x - 1, 4, 2, 8); c.font = '9px "IBM Plex Mono",monospace'; c.textAlign = i === 0 ? 'center' : i === 1 ? 'right' : 'left'; c.fillStyle = COL.hl; c.fillText(k[1], x + (i === 1 ? -3 : i === 2 ? 3 : 0), 7); });
    c.fillStyle = COL.mu; c.textAlign = 'left'; c.fillText('0 h', pad, h - 6); c.textAlign = 'right'; c.fillText('24 h', w - pad, h - 6);
  }
  function chromo(c, x, y, ang, kind, sep, col) {   
    c.save(); c.translate(x, y); c.rotate(ang); c.strokeStyle = col; c.lineWidth = 4.2; c.lineCap = 'round';
    if (kind === 'x') { c.beginPath(); c.moveTo(-3 - sep, -12); c.lineTo(0, 0); c.lineTo(3 + sep, 12); c.moveTo(3 + sep, -12); c.lineTo(0, 0); c.lineTo(-3 - sep, 12); c.stroke(); }
    else { c.beginPath(); c.moveTo(0, -12); c.lineTo(0, 12); c.stroke(); }
    c.restore();
  }
  const SLOT = [[-.45, -.5, .3], [.35, -.55, -.4], [-.5, .1, -.2], [.45, .2, .5], [-.1, .55, .1], [.05, -.1, .9]];   
  function drawCell() {
    cvC.fit(); const c = cvC.ctx, w = cvC.w, h = cvC.h, cx = w / 2, cy = h / 2, st = state(t), R0 = Math.min(w * .3, h * .38);
    c.clearRect(0, 0, w, h); c.font = '10px "IBM Plex Mono",monospace'; c.textAlign = 'center';
    const sub = st.sub, sf = st.sf, ph = st.name[0], inM = ph === 'M', COLc = '#ff7ab0', COLs = '#ffb3d1';
    const cell = (x, y, rx, ry) => { c.fillStyle = 'rgba(224,82,122,.10)'; c.strokeStyle = COL.ac; c.lineWidth = 2.5; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, 7); c.fill(); c.stroke(); };
    const nuc = (x, y, r, a, dash) => { c.strokeStyle = 'rgba(181,140,255,' + a + ')'; c.lineWidth = 2; c.setLineDash(dash ? [5, 4] : []); c.beginPath(); c.arc(x, y, r, 0, 7); c.stroke(); c.setLineDash([]); };
    const cent = (x, y) => { c.fillStyle = COL.hl; c.fillRect(x - 3, y - 3, 6, 6); };
    if (!inM) {
      cell(cx, cy, R0, R0 * .92); nuc(cx, cy, R0 * .62, 1);
      SLOT.forEach(s => { const x = cx + s[0] * R0 * .55, y = cy + s[1] * R0 * .5;
        if (ph === 'G1') chromo(c, x, y, s[2], 'rod', 0, COLc);
        else if (ph === 'S') { chromo(c, x, y, s[2], 'rod', 0, COLc); c.globalAlpha = st.f; chromo(c, x + 5, y, s[2], 'rod', 0, COLs); c.globalAlpha = 1; }
        else chromo(c, x, y, s[2], 'x', 0, COLc); });
      cent(cx + R0 * .8, cy - R0 * .1); if (ph !== 'G1') cent(cx + R0 * .85, cy - R0 * .1 + 7);
    } else if (sub === 'Cytokinesis') {
      const sepd = R0 * 1.05, pinch = .35 + .65 * (1 - Math.min(1, sf / .6)), cl = sf > .6;
      [-1, 1].forEach(sd => { const x = cx + sd * sepd * .55; cell(x, cy, R0 * .66, R0 * .66 * (cl ? .95 : pinch + .35)); nuc(x, cy, R0 * .36, 1);
        SLOT.forEach((s, i) => chromo(c, x + s[0] * R0 * .3, cy + s[1] * R0 * .28, s[2], 'rod', 0, COLc)); });
      if (!cl) { c.strokeStyle = COL.ac2; c.lineWidth = 3; c.beginPath(); c.moveTo(cx, cy - R0 * pinch); c.lineTo(cx, cy + R0 * pinch); c.stroke(); }
    } else {
      const el2 = sub === 'Telophase' ? 1.25 : sub === 'Anaphase' ? 1.1 + .15 * sf : 1, pole = R0 * (sub === 'Anaphase' ? .35 + .55 * sf : sub === 'Telophase' ? .9 : .9);
      c.fillStyle = 'rgba(224,82,122,.10)'; c.strokeStyle = COL.ac; c.lineWidth = 2.5; c.beginPath(); c.ellipse(cx, cy, R0 * (sub === 'Telophase' ? 1.2 : el2), R0 * (sub === 'Telophase' ? .82 : .92), 0, 0, 7); c.fill(); c.stroke();
      const spindle = sub !== 'Prophase'; const px = R0 * .95;
      if (sub === 'Prophase') { nuc(cx, cy, R0 * .62, 1 - sf, true); cent(cx - R0 * (.8 + .1 * sf), cy - R0 * .1); cent(cx + R0 * (.8 + .1 * sf), cy - R0 * .1); }
      SLOT.forEach((s, i) => {
        const hx = cx + s[0] * R0 * .55, hy = cy + s[1] * R0 * .5, py = cy + (i - 2.5) * 22;
        if (sub === 'Prophase') chromo(c, hx, hy, s[2], 'x', 0, COLc);
        else if (sub === 'Prometaphase') { const k = smooth(sf); chromo(c, hx + (cx - hx) * k, hy + (py - hy) * k, s[2] * (1 - k) + 0 * k, 'x', 0, COLc); }
        else if (sub === 'Metaphase') chromo(c, cx, py, 0, 'x', 0, COLc);
        else if (sub === 'Anaphase') { const d = 3 + (pole - 3) * sf; chromo(c, cx - d, py, 0, 'rod', 0, COLc); chromo(c, cx + d, py, 0, 'rod', 0, COLs); }
        else { chromo(c, cx - pole, py * .8 + cy * .2, 0, 'rod', 0, COLc); chromo(c, cx + pole, py * .8 + cy * .2, 0, 'rod', 0, COLs); } });
      if (spindle && sub !== 'Telophase') { c.strokeStyle = 'rgba(127,214,194,.5)'; c.lineWidth = 1; const lp = sub === 'Anaphase' ? 1 - .3 * sf : 1; [-1, 1].forEach(sd => { cent(cx + sd * px * lp, cy); for (let k = -3; k <= 3; k++) { c.beginPath(); c.moveTo(cx + sd * px * lp, cy); c.lineTo(sub === 'Prometaphase' ? cx + sd * 12 : cx + sd * (sub === 'Anaphase' ? 4 + 70 * sf : 8), cy + k * 12 * (sub === 'Prometaphase' ? sf : 1)); c.stroke(); } }); }
      if (sub === 'Telophase') { [-1, 1].forEach(sd => nuc(cx + sd * pole, cy, R0 * .3, sf, true)); cent(cx - R0 * 1.15, cy); cent(cx + R0 * 1.15, cy); }
    }
    c.fillStyle = COL.mu; c.textAlign = 'left'; c.fillText('schematic: 6 chromosomes dikhaye gaye hain (insaan mein 46)', 6, h - 6);
  }
  function drawInfo() {
    const s = state(t), chk = t > 10.6 && t < 11.4 ? 'G1/S checkpoint' : t > 22.6 && t < 23.1 ? 'G2/M checkpoint' : (s.sub === 'Metaphase' ? 'Spindle assembly checkpoint (metaphase se anaphase)' : '');
    info.innerHTML = '<div class="lbstate"><b>' + s.name + '</b> ' + (chk ? '<span class="lbtag">' + chk + '</span>' : '') + '</div>' +
      '<div class="lbgrid"><div><small>Chromosomes</small><b>' + s.chrom + '</b></div><div><small>Chromatids</small><b>' + s.chat + '</b></div><div><small>DNA content</small><b>' + s.dna + '</b></div><div><small>Ploidy</small><b>2n</b></div></div>' +
      '<p class="lbd">' + s.text + '</p><p class="lbnote">Ploidy (2n) hamesha same rehti hai jab tak cell haploid gamete nahi banta. Chromosome ginti, chromatid ginti aur DNA content teen alag cheezein hain.</p>';
  }
  function drawGraphs() {
    cvG.fit(); const c = cvG.ctx; c.clearRect(0, 0, cvG.w, cvG.h);
    const dna = [], N = 240; for (let i = 0; i <= N; i++) { const x = i / N * 24; dna.push([x, x >= 23.9 ? 2 : state(Math.min(x, 23.99)).dnaV]); }
    const cs = k => { const a = []; for (let i = 0; i <= N; i++) { const x = i / N * 24; a.push([x, cyc[k](x) * 2 + (k === 'D' ? 0 : 0)]); } return a; };
    const G = graph(c, 0, 0, cvG.w, cvG.h, { x0: 0, x1: 24, y0: 0, y1: 4.5, xl: 'time (h)', yl: 'DNA (C) | cyclin (a.u. x2)', xt: 6, yt: 3, yd: 1, cursor: t, hl: [{ y: 2, lab: '2C', col: COL.mu }, { y: 4, lab: '4C', col: COL.mu }],
      series: [{ pts: dna, col: '#ffffff', lab: 'DNA', w: 2.5 }, { pts: cs('D'), col: '#6fb4ff', lab: 'cyc D', w: 1.4 }, { pts: cs('E'), col: '#f2c35a', lab: 'E', w: 1.4 }, { pts: cs('A'), col: '#7fd6c2', lab: 'A', w: 1.4 }, { pts: cs('B'), col: '#e0527a', lab: 'B', w: 1.4 }] });
  }
  function draw() { drawTimeline(); drawCell(); drawInfo(); drawGraphs(); }
  function loop(ts) { if (!alive) return; raf = requestAnimationFrame(loop); if (!last) last = ts; const dt = Math.min(.05, (ts - last) / 1000); last = ts;
    if (playing) { t += dt * (t >= 22.9 ? .08 : t >= 18.9 && t < 19 ? 1 : 1.6); if (t >= 24) t = 0; sl.set(t); draw(); } }
  draw(); raf = requestAnimationFrame(loop);
  return { stop() { alive = false; cancelAnimationFrame(raf); } };
} });
})();
