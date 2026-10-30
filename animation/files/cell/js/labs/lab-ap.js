/* Action-potential explorer: asli Hodgkin-Huxley (1952) equations, squid giant axon (6.3 C), modern -65 mV convention.
   Units: V in mV, t in ms, current in uA/cm2, conductance in mS/cm2. Yeh numerical model validated hai, par neuron-specific numbers alag hote hain. */
'use strict';
(() => {
if (!window.CVLabs) throw new Error('labs-core.js pehle load karo');
const P = { Cm: 1, gNa: 120, gK: 36, gL: .3, ENa: 50, EK: -77, EL: -54.387 };
const vtrap = (x, y) => Math.abs(x / y) < 1e-6 ? y * (1 - x / y / 2) : x / (1 - Math.exp(-x / y));
const an = V => .01 * vtrap(V + 55, 10), bn = V => .125 * Math.exp(-(V + 65) / 80);
const am = V => .1 * vtrap(V + 40, 10), bm = V => 4 * Math.exp(-(V + 65) / 18);
const ah = V => .07 * Math.exp(-(V + 65) / 20), bh = V => 1 / (1 + Math.exp(-(V + 35) / 10));


function sim(I, T, ttx, tea) {
  const dt = .01, gNa = ttx ? 0 : P.gNa, gK = tea ? 0 : P.gK;
  let V = -65, m = am(V) / (am(V) + bm(V)), h = ah(V) / (ah(V) + bh(V)), n = an(V) / (an(V) + bn(V));
  const o = { t: [], V: [], gNa: [], gK: [], m: [], h: [], n: [], spikes: [] };
  let prev = V, steps = Math.round(T / dt);
  for (let i = 0; i <= steps; i++) {
    const t = i * dt, gn = gNa * m * m * m * h, gk = gK * n * n * n * n;
    if (i % 5 === 0) { o.t.push(t); o.V.push(V); o.gNa.push(gn); o.gK.push(gk); o.m.push(m); o.h.push(h); o.n.push(n); }
    const dV = (I(t) - gn * (V - P.ENa) - gk * (V - P.EK) - P.gL * (V - P.EL)) / P.Cm;
    m += dt * (am(V) * (1 - m) - bm(V) * m); h += dt * (ah(V) * (1 - h) - bh(V) * h); n += dt * (an(V) * (1 - n) - bn(V) * n);
    V += dt * dV;
    if (prev < 0 && V >= 0) o.spikes.push(t);   
    prev = V;
  }
  return o;
}
const pulse = (amp, dur, t0) => t => (t >= t0 && t < t0 + dur ? amp : 0);

CVLabs.register({ id: 'ap', name: 'Action potential', desc: 'Hodgkin-Huxley: voltage, Na+/K+ channels, threshold, TTX, TEA, firing rate, refractory period, depolarisation, repolarisation', build(root, H) {
  const { ctl, btn, toggles, canvas, graph, el, COL } = H;
  let mode = 'pulse', amp = 12, dur = 1, ttx = false, tea = false, cur = 6, data = null, frAmp = 12;
  root.append(el('p', 'lbd', 'Hodgkin-Huxley model: neuron ki membrane ka voltage (mV) time (ms) ke saath. Stimulus do, Na+ ya K+ channel block karo (TTX / TEA) aur dekho spike kaise badalta hai.'));
  toggles(root, [['pulse', 'Single pulse'], ['train', 'Continuous (firing rate)']], mode, v => { mode = v; recalc(); layout(); });
  const ctrl = el('div', 'lbctl'); root.append(ctrl);
  const sAmp = ctl(ctrl, 'Stimulus current', 0, 60, 1, amp, v => v + ' µA/cm²', v => { amp = v; recalc(); });
  const sDur = ctl(ctrl, 'Pulse duration', .1, 5, .1, dur, v => v.toFixed(1) + ' ms', v => { dur = v; recalc(); });
  const chips = el('div', 'lbchips'); ctrl.append(chips);
  const bT = btn(chips, 'TTX (Na+ block)', b => { ttx = !ttx; b.classList.toggle('on', ttx); recalc(); });
  const bE = btn(chips, 'TEA (K+ block)', b => { tea = !tea; b.classList.toggle('on', tea); recalc(); });
  const cv1 = canvas(root, .62, 200), cv2 = canvas(root, .42, 130);
  const sCur = ctl(root, 'Time cursor', 0, 30, .05, cur, v => v.toFixed(2) + ' ms', v => { cur = v; draw(); });
  const info = el('div', 'lbinfo'); root.append(info);
  root.append(el('p', 'lbnote', 'Model: squid giant axon, 6.3 °C, rest -65 mV. Threshold ~ -55 mV (model ke hisab se, asli neurons mein alag). Mammalian neurons zyada tez hote hain. TTX sirf voltage-gated Na+ ko, TEA K+ channels ko block karta hai.'));

  function layout() {
    const tr = mode === 'train';
    sDur.row.style.display = tr ? 'none' : ''; sAmp.input.max = tr ? 40 : 60;
    if (tr && amp > 40) { amp = 40; sAmp.set(40); }
    sCur.input.max = tr ? 250 : 30; sCur.input.step = tr ? .5 : .05; if (cur > +sCur.input.max) { cur = +sCur.input.max; sCur.set(cur); }
  }
  function recalc() {
    data = mode === 'pulse' ? sim(pulse(amp, dur, 2), 30, ttx, tea) : sim(t => (t >= 10 && t < 210 ? amp : 0), 250, ttx, tea);
    if (mode === 'train') { frAmp = amp; }
    draw();
  }
  
  const frCache = {};
  const frCurve = () => { const k = (ttx ? 1 : 0) + '' + (tea ? 1 : 0); if (frCache[k]) return frCache[k]; const pts = [];
    for (let a = 0; a <= 40; a += 2) { const s = sim(t => (t >= 10 && t < 210 ? a : 0), 220, ttx, tea).spikes.filter(x => x >= 10 && x < 210).length; pts.push([a, s / .2]); }
    return (frCache[k] = pts); };
  const idxAt = t => Math.min(data.t.length - 1, Math.max(0, Math.round(t / .05)));

  function phase(i) {
    const d = data, V = d.V[i], dv = (d.V[Math.min(i + 1, d.V.length - 1)] - d.V[Math.max(i - 1, 0)]), h = d.h[i];
    if (V < -64 && Math.abs(dv) < .05) return ['Resting', 'Na+/K+ pump + leak K+ channels membrane ko ~ -65 mV par rakhte hain. Voltage-gated channels band.'];
    if (dv > 0 && V > -64 && V < 0) return ['Depolarisation (upstroke)', 'Voltage-gated Na+ channels khulte hain (m badhta hai), Na+ andar bhagta hai, positive feedback se voltage tezi se badhta hai.'];
    if (dv > 0 && V >= 0) return ['Overshoot', 'Membrane potential 0 mV se upar, ENa (+50 mV) ke kareeb. Na+ channels inactivate hone lagte hain (h girta hai).'];
    if (dv <= 0 && V > -50) return ['Repolarisation', 'Na+ channels inactivated (h chhota), K+ channels khule (n badha): K+ bahar nikalta hai, voltage wapas girta hai.'];
    if (dv <= 0 && V <= -50 && V > -64 + 0) return ['Repolarisation (late)', 'K+ conductance abhi bhi zyada hai, voltage rest ki taraf ja raha hai.'];
    if (V < -65.5) return ['Hyperpolarisation (undershoot)', 'K+ channels dheere band ho rahe hain, isliye voltage EK (-77 mV) ki taraf rest se neeche chala jata hai. Na+ h abhi recover ho raha hai: refractory period.'];
    return ['Recovery', 'Na+ channels (h) wapas reset ho rahe hain, K+ channels band ho rahe hain.'];
  }
  function draw() {
    if (!data) return; cv1.fit(); cv2.fit();
    const d = data, tr = mode === 'train', T1 = tr ? 250 : 30, a = cv1.ctx;
    a.clearRect(0, 0, cv1.w, cv1.h);
    const pts = (arr) => d.t.map((t, i) => [t, arr[i]]);
    const hl = [{ y: -55, lab: 'threshold ~ -55 mV', col: COL.hl }, { y: -65, lab: 'rest -65 mV', col: COL.mu }];
    const stim = mode === 'pulse' ? pulse(amp, dur, 2) : t => (t >= 10 && t < 210 ? amp : 0);
    graph(a, 0, 0, cv1.w, cv1.h, { x0: 0, x1: T1, y0: -90, y1: 50, xl: 'time (ms)', yl: 'membrane potential (mV)', xt: tr ? 5 : 6, yt: 7, hl, cursor: cur,
      series: [{ pts: pts(d.V), col: COL.ac2, lab: 'Vm' }] });
    
    a.fillStyle = COL.hl; const sx = 38 + (mode === 'pulse' ? 2 : 10) / T1 * (cv1.w - 46), sw = (mode === 'pulse' ? dur : 200) / T1 * (cv1.w - 46);
    if (amp > 0) { a.fillRect(sx, cv1.h - 30, Math.max(2, sw), 3); a.font = '10px "IBM Plex Mono",monospace'; a.textAlign = 'right'; a.textBaseline = 'top'; a.fillStyle = COL.hl; a.fillText('stimulus ' + amp + ' \u00b5A/cm\u00b2' + (mode === 'pulse' ? ' x ' + dur.toFixed(1) + ' ms' : ''), cv1.w - 12, 14); }
    const b = cv2.ctx; b.clearRect(0, 0, cv2.w, cv2.h);
    graph(b, 0, 0, cv2.w, cv2.h, { x0: 0, x1: T1, y0: 0, y1: 40, xl: 'time (ms)', yl: 'g (mS/cm²)', xt: tr ? 5 : 6, yt: 4, cursor: cur,
      series: [{ pts: pts(d.gNa).map(p => [p[0], Math.min(40, p[1])]), col: COL.ac, lab: 'gNa' }, { pts: pts(d.gK), col: COL.blue, lab: 'gK' }] });
    const i = idxAt(cur), ph = phase(i), sp = d.spikes.length;
    let extra = '';
    if (tr) { const n = d.spikes.filter(x => x >= 10 && x < 210).length; extra = '<div class="lbstat"><b>' + n + ' spikes</b> in 200 ms = <b>' + (n / .2).toFixed(0) + ' Hz</b></div>'; }
    else { const pk = Math.max(...d.V); extra = '<div class="lbstat">' + (sp ? 'Spike <b>haan</b>: peak <b>' + pk.toFixed(0) + ' mV</b>' : 'Spike <b>nahi</b> (sub-threshold; peak ' + pk.toFixed(0) + ' mV). All-or-none: threshold ke neeche koi spike nahi.') + '</div>'; }
    info.innerHTML = '<div class="lbstate"><b>' + ph[0] + '</b> @ ' + cur.toFixed(2) + ' ms</div><div class="lbmini">Vm <b>' + d.V[i].toFixed(1) + ' mV</b> | gNa <b>' + d.gNa[i].toFixed(1) + '</b> | gK <b>' + d.gK[i].toFixed(1) + '</b> mS/cm²<br>gates (0 band - 1 khula): m(Na act.) <b>' + d.m[i].toFixed(2) + '</b> h(Na inact.) <b>' + d.h[i].toFixed(2) + '</b> n(K act.) <b>' + d.n[i].toFixed(2) + '</b></div><p class="lbd">' + ph[1] + '</p>' + extra;
    if (tr) { fr.style.display = ''; drawFr(); } else fr.style.display = 'none';
  }
  const fr = el('div', 'lbfr'); root.insertBefore(fr, info.nextSibling); const cv3 = canvas(fr, .5, 150);
  function drawFr() { cv3.fit(); const c = cv3.ctx; c.clearRect(0, 0, cv3.w, cv3.h); const pts = frCurve();
    const g = graph(c, 0, 0, cv3.w, cv3.h, { x0: 0, x1: 40, y0: 0, y1: Math.max(100, Math.ceil(Math.max(...pts.map(p => p[1])) / 20) * 20), xl: 'stimulus current (µA/cm²)', yl: 'firing rate (Hz)', xt: 4, yt: 5, series: [{ pts, col: COL.violet, lab: 'f-I curve' }] });
    const cur2 = pts.find(p => p[0] === Math.round(amp / 2) * 2) || [amp, 0]; c.fillStyle = COL.hl; c.beginPath(); c.arc(g.px(cur2[0]), g.py(cur2[1]), 4, 0, 7); c.fill(); }
  layout(); recalc();
  return { stop() {} };
} });
})();
