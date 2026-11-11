/* Membrane transport lab: CONCEPTUAL particle simulation (calibrated numbers nahi, relative units). Particle counts sach mein gine jaate hain.
   Modes: simple diffusion | facilitated (channel) | active (pump, ATP) | osmosis (cell volume). */
'use strict';
(() => {
if (!window.CVLabs) throw new Error('labs-core.js pehle load karo');
CVLabs.register({ id: 'transport', name: 'Membrane transport', desc: 'diffusion, osmosis, facilitated, active transport, pump, channel, ATP, tonicity, hypotonic, hypertonic, gradient', build(root, H) {
  const { ctl, btn, toggles, canvas, graph, el, COL } = H;
  let mode = 'simple', outN = 60, inN = 10, temp = 37, nCh = 4, atp = true, tonic = 'hypo', raf = 0, alive = true, last = 0, time = 0;
  root.append(el('p', 'lbd', 'Conceptual simulation: har dot ek particle hai. Concentration gradient, temperature, channel/pump aur ATP badal kar dekho ki transport kaise badalta hai.'));
  toggles(root, [['simple', 'Simple diffusion'], ['facil', 'Channel (facilitated)'], ['active', 'Active pump'], ['osmo', 'Osmosis']], mode, v => { mode = v; init(); });
  const ctrl = el('div', 'lbctl'); root.append(ctrl);
  const sOut = ctl(ctrl, 'Outside particles', 0, 120, 1, outN, v => v, v => { outN = v; init(); });
  const sIn = ctl(ctrl, 'Inside particles', 0, 120, 1, inN, v => v, v => { inN = v; init(); });
  const sT = ctl(ctrl, 'Temperature', 0, 45, 1, temp, v => v + ' °C', v => { temp = v; });
  const sCh = ctl(ctrl, 'Channels / pumps', 1, 8, 1, nCh, v => v, v => { nCh = v; init(); });
  const chips = el('div', 'lbchips'); ctrl.append(chips);
  const bA = btn(chips, 'ATP: ON', b => { atp = !atp; b.classList.toggle('on', atp); b.textContent = 'ATP: ' + (atp ? 'ON' : 'OFF'); }, true);
  const bR = btn(chips, 'Reset', () => init());
  const tonicRow = toggles(ctrl, [['hypo', 'Hypotonic'], ['iso', 'Isotonic'], ['hyper', 'Hypertonic']], tonic, v => { tonic = v; init(); });
  const cv = canvas(root, .72, 230), gv = canvas(root, .42, 130);
  const info = el('div', 'lbinfo'); root.append(info);
  const note = el('p', 'lbnote'); root.append(note);
  const NOTES = {
    simple: 'Simple diffusion: chhote non-polar molecules (O₂, CO₂) lipid bilayer se seedhe, concentration gradient ke neeche (high to low). Energy nahi lagti. Garam temperature = tez movement. Equilibrium par net flow 0 ho jata hai, par particles ruk nahi jaate (dynamic equilibrium).',
    facil: 'Facilitated diffusion: charged/polar molecules sirf channel/carrier protein se, phir bhi gradient ke neeche, bina ATP. Channels kam hon ya saare busy hon to rate saturate ho jata hai (graph ka slope flat).',
    active: 'Active transport: pump ATP kharch karke particles ko gradient ke KHILAF (low se high) dhakelta hai (jaise Na⁺/K⁺-ATPase). ATP OFF karo: pump ruk jata hai aur leak se gradient dheere dheere khatam hota hai.',
    osmo: 'Osmosis: sirf water semi-permeable membrane se, low solute se high solute ki taraf. Hypotonic bahar (solute kam) = cell phoolta hai (animal cell phat sakta hai, lysis; plant cell turgid). Hypertonic = cell sikudta hai (crenation; plant mein plasmolysis). Isotonic = net change nahi.'
  };

  const W = () => cv.w, Hh = () => cv.h, MY = () => Math.round(Hh() * .5), MT = 14;   
  let P = [], chX = [], chBusy = [], hist = [], cross = [], vol = 1, volHist = [], pumps = [];
  const R = Math.random;
  function init() {
    cv.fit(); gv.fit(); time = 0; hist = []; volHist = []; cross = []; vol = 1; P = []; pumps = [];
    const osmo = mode === 'osmo';
    tonicRow.style.display = osmo ? '' : 'none'; sOut.row.style.display = sIn.row.style.display = osmo ? 'none' : ''; sT.row.style.display = osmo ? 'none' : '';
    sCh.row.style.display = (mode === 'facil' || mode === 'active') ? '' : 'none'; bA.style.display = mode === 'active' ? '' : 'none';
    note.textContent = NOTES[mode]; if (osmo) return;
    const w = W(), my = MY();
    chX = []; chBusy = [];
    for (let i = 0; i < nCh; i++) { chX.push(w * (i + 1) / (nCh + 1)); chBusy.push(0); }
    for (let i = 0; i < outN; i++) P.push({ x: R() * w, y: 8 + R() * (my - MT - 12), s: 0, k: 0, cd: 0 });
    for (let i = 0; i < inN; i++) P.push({ x: R() * w, y: my + MT + 4 + R() * (Hh() - my - MT - 12), s: 0, k: 0, cd: 0 });
  }
  const side = p => p.y < MY() ? 'out' : 'in';
  const sideN = s => P.filter(p => side(p) === s && !p.pump).length + P.filter(p => p.pump && p.to === s).length;
  function step(dt) {
    time += dt;
    const w = W(), h = Hh(), my = MY(), top = my - MT / 2, bot = my + MT / 2, sp = 55 * Math.sqrt((temp + 273) / 310);   
    const leak = mode === 'simple' ? .35 : mode === 'active' ? .03 : 0;
    P.forEach(p => {
      if (p.pump) { p.t += dt; p.y = p.pump.from === 'out' ? top - 6 + (bot - top + 12) * Math.min(1, p.t / .9) : bot + 6 - (bot - top + 12) * Math.min(1, p.t / .9); p.x += (p.pump.x - p.x) * .2;
        if (p.t >= .9) { p.y = p.to === 'in' ? bot + 6 : top - 6; p.pump = null; } return; }
      const ang = R() * 6.283, ny = p.y + Math.sin(ang) * sp * dt * 7, nx = p.x + Math.cos(ang) * sp * dt * 7;
      p.x = nx < 4 ? 4 : nx > w - 4 ? w - 4 : nx;
      const s0 = side(p), inBand = ny > top && ny < bot;
      if (inBand) {   
        let ok = false;
        if (mode === 'simple') ok = R() < leak;
        else if (mode === 'facil') { const c = chX.findIndex((x, i) => Math.abs(p.x - x) < 9 && chBusy[i] <= 0); if (c >= 0 && R() < .7) { ok = true; chBusy[c] = .35; } }
        else if (mode === 'active') ok = R() < leak;
        if (ok) { p.y = s0 === 'out' ? bot + 1 : top - 1; cross.push({ t: time, d: s0 === 'out' ? 1 : -1 }); }
        else p.y = s0 === 'out' ? top - 1 : bot + 1;
      } else p.y = ny < 6 ? 6 : ny > h - 6 ? h - 6 : ny;
    });
    chBusy = chBusy.map(b => b - dt);
    if (mode === 'active' && atp) {   
      for (let i = 0; i < nCh; i++) { const x = chX[i]; pumps[i] = pumps[i] || { cd: R() };
        pumps[i].cd -= dt; if (pumps[i].cd > 0) continue;
        const nOut = sideN('out'), nIn = sideN('in'), from = nOut <= nIn ? 'out' : 'in', to = from === 'out' ? 'in' : 'out';
        const c = P.filter(p => !p.pump && side(p) === from).sort((a, b) => Math.abs(a.x - x) - Math.abs(b.x - x))[0];
        if (c && Math.abs(c.x - x) < 80) { c.pump = { x, from }; c.to = to; c.t = 0; cross.push({ t: time, d: to === 'in' ? 1 : -1 }); pumps[i].cd = .9; } else pumps[i].cd = .15; }
    }
    if (hist.length === 0 || time - hist[hist.length - 1][0] > .25) hist.push([time, sideN('out'), sideN('in')]);
    if (hist.length > 160) hist.shift();
  }
  function stepOsmo(dt) {
    time += dt;
    const sol = { hypo: .15, iso: .3, hyper: .6 }[tonic], cin = .3 / vol, dv = .12 * (cin - sol) * dt;   
    vol = Math.max(.55, Math.min(1.5, vol + dv));
    if (volHist.length === 0 || time - volHist[volHist.length - 1][0] > .2) volHist.push([time, vol]);
    if (volHist.length > 160) volHist.shift();
  }
  function drawSim() {
    const c = cv.ctx, w = W(), h = Hh(), my = MY();
    c.clearRect(0, 0, w, h);
    c.font = '11px "IBM Plex Mono",monospace'; c.textBaseline = 'top';
    if (mode === 'osmo') {
      const sol = { hypo: .15, iso: .3, hyper: .6 }[tonic], r0 = Math.min(w, h) * .28, r = r0 * Math.sqrt(vol);
      c.fillStyle = 'rgba(111,180,255,' + (.1 + sol * .45) + ')'; c.fillRect(0, 0, w, h);
      c.fillStyle = COL.mu; c.textAlign = 'left'; c.fillText('Bahar (outside): solute ' + sol.toFixed(2) + ' (relative)', 8, 6);
      const cx = w / 2, cy = h / 2;
      c.fillStyle = 'rgba(224,82,122,' + (.18 + .3 / vol * .5) + ')'; c.strokeStyle = COL.ac; c.lineWidth = 3; c.beginPath(); c.arc(cx, cy, r, 0, 7); c.fill(); c.stroke();
      c.fillStyle = COL.fg; c.textAlign = 'center'; c.fillText('cell  volume x' + vol.toFixed(2), cx, cy - 14); c.fillStyle = COL.mu; c.fillText('andar solute ' + (.3 / vol).toFixed(2), cx, cy + 2);
      c.strokeStyle = COL.ac2; c.fillStyle = COL.ac2; c.lineWidth = 2;
      const dir = (.3 / vol) > sol + .01 ? -1 : (.3 / vol) < sol - .01 ? 1 : 0;   
      for (let i = 0; i < 8 && dir; i++) { const a = i * Math.PI / 4 + time * .3, rr = r + 22 + 6 * Math.sin(time * 3 + i), x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr, d = dir < 0 ? -1 : 1;
        c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * 14 * d, y + Math.sin(a) * 14 * d); c.stroke(); c.beginPath(); c.arc(x + Math.cos(a) * 14 * d, y + Math.sin(a) * 14 * d, 3, 0, 7); c.fill(); }
      c.fillStyle = COL.mu; c.textAlign = 'center'; c.fillText(dir < 0 ? 'water andar (low solute -> high solute)' : dir > 0 ? 'water bahar' : 'net water flow = 0', cx, h - 18);
      return;
    }
    c.fillStyle = 'rgba(111,180,255,.07)'; c.fillRect(0, 0, w, my - MT / 2); c.fillStyle = 'rgba(224,82,122,.07)'; c.fillRect(0, my + MT / 2, w, h);
    c.fillStyle = COL.mu; c.textAlign = 'left'; c.fillText('BAHAR (outside)', 6, 3); c.fillText('ANDAR (inside / cytosol)', 6, h - 15);
    
    c.fillStyle = '#7a5d1c'; c.fillRect(0, my - MT / 2, w, MT); c.fillStyle = COL.hl;
    for (let x = 4; x < w; x += 9) { c.beginPath(); c.arc(x, my - MT / 2, 3, 0, 7); c.fill(); c.beginPath(); c.arc(x, my + MT / 2, 3, 0, 7); c.fill(); }
    if (mode === 'facil' || mode === 'active') chX.forEach((x, i) => { c.fillStyle = mode === 'facil' ? (chBusy[i] > 0 ? COL.ac : COL.violet) : (atp ? COL.ac : '#6b4a58'); c.fillRect(x - 9, my - MT / 2 - 3, 18, MT + 6); c.fillStyle = '#0a1424'; if (mode === 'facil') c.fillRect(x - 3, my - MT / 2 - 3, 6, MT + 6); });
    if (mode === 'active') { c.fillStyle = atp ? COL.hl : COL.mu; c.textAlign = 'right'; c.fillText(atp ? 'ATP -> ADP + Pi' : 'ATP nahi: pump ruka', w - 6, my + MT / 2 + 8); }
    P.forEach(p => { c.fillStyle = p.pump ? COL.hl : COL.blue; c.beginPath(); c.arc(p.x, p.y, 3.4, 0, 7); c.fill(); });
  }
  function drawGraph() {
    gv.fit(); const c = gv.ctx; c.clearRect(0, 0, gv.w, gv.h);
    if (mode === 'osmo') { graph(c, 0, 0, gv.w, gv.h, { x0: Math.max(0, time - 30), x1: Math.max(30, time), y0: .5, y1: 1.5, xl: 'time (s)', yl: 'cell volume (x initial)', xt: 5, yt: 5, yd: 1, hl: [{ y: 1, lab: 'initial volume', col: COL.mu }], series: [{ pts: volHist, col: COL.ac2, lab: 'volume' }] }); return; }
    const mx = Math.max(60, outN + inN);
    graph(c, 0, 0, gv.w, gv.h, { x0: Math.max(0, time - 40), x1: Math.max(40, time), y0: 0, y1: Math.ceil(mx * .9 / 20) * 20, xl: 'time (s)', yl: 'particles (count)', xt: 5, yt: 4, series: [{ pts: hist.map(r => [r[0], r[1]]), col: COL.blue, lab: 'outside' }, { pts: hist.map(r => [r[0], r[2]]), col: COL.ac, lab: 'inside' }] });
  }
  function readout() {
    if (mode === 'osmo') { info.innerHTML = '<div class="lbstate"><b>' + { hypo: 'Hypotonic bahar', iso: 'Isotonic', hyper: 'Hypertonic bahar' }[tonic] + '</b></div><div class="lbmini">Cell volume <b>x' + vol.toFixed(2) + '</b>' + (vol >= 1.49 ? ' | <b>animal cell mein lysis ka khatra</b>' : vol <= .56 ? ' | <b>crenation (sikudna)</b>' : '') + '</div>'; return; }
    const recent = cross.filter(x => x.t > time - 5); cross = cross.filter(x => x.t > time - 6);
    const net = recent.reduce((a, x) => a + x.d, 0) / 5, no = sideN('out'), ni = sideN('in');
    info.innerHTML = '<div class="lbmini">Outside <b>' + no + '</b> | Inside <b>' + ni + '</b> | Net flow (pichhle 5 s): <b>' + (net >= 0 ? '+' : '') + net.toFixed(1) + ' particles/s</b> (+ = andar)<br>' +
      (Math.abs(no - ni) <= Math.max(3, (no + ni) * .06) ? 'Lagbhag <b>dynamic equilibrium</b>: dono taraf barabar, par particles ab bhi aate-jaate hain.' : (no > ni ? 'Gradient: bahar zyada' : 'Gradient: andar zyada')) + '</div>';
  }
  let rt = 0;
  function loop(ts) { if (!alive) return; raf = requestAnimationFrame(loop); if (!last) last = ts; const dt = Math.min(.05, (ts - last) / 1000); last = ts;
    if (mode === 'osmo') stepOsmo(dt); else step(dt);
    drawSim(); rt += dt; if (rt > .25) { rt = 0; drawGraph(); readout(); } }
  init(); raf = requestAnimationFrame(loop);
  return { stop() { alive = false; cancelAnimationFrame(raf); } };
} });
})();
