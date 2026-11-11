/* CVLabs: interactive 2D science labs (canvas). Dock ke "Labs" button se khulta hai.
   Naya lab: CVLabs.register({id, name, desc, build(el, H){ ...; return {stop(){}} }})  (labs/lab-*.js dekho).
   H = helpers: ctl (slider), btn, canvas, graph, note.  Sab labs three.js ke bina chalte hain. */
'use strict';
(() => {
const LABS = [];
const $q = s => document.querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const COL = { fg: '#e8f0f8', mu: '#97adc6', bd: '#2c4565', hl: '#f2c35a', ac: '#e0527a', ac2: '#7fd6c2', blue: '#6fb4ff', violet: '#b58cff' };


function ctl(parent, label, min, max, step, val, fmt, onchange) {
  const row = el('label', 'lbrow'), name = el('span', 'lbn', label), inp = el('input'), out = el('b', 'lbv');
  inp.type = 'range'; inp.min = min; inp.max = max; inp.step = step; inp.value = val; inp.setAttribute('aria-label', label);
  const show = () => { out.textContent = fmt ? fmt(+inp.value) : inp.value; };
  inp.addEventListener('input', () => { show(); onchange && onchange(+inp.value); });
  row.append(name, inp, out); parent.append(row); show();
  return { row, input: inp, set(v) { inp.value = v; show(); } };
}
function btn(parent, label, onclick, on) { const b = el('button', on ? 'lbb on' : 'lbb', label); b.onclick = () => onclick(b); parent.append(b); return b; }
function toggles(parent, items, cur, onpick) { 
  const row = el('div', 'lbchips'); parent.append(row);
  const draw = () => [...row.children].forEach(b => b.classList.toggle('on', b.dataset.id === cur));
  items.forEach(([id, l]) => { const b = el('button', 'lbb', l); b.dataset.id = id; b.onclick = () => { cur = id; draw(); onpick(id); }; row.append(b); });
  draw(); return row;
}

function canvas(parent, hRatio, minH) {
  const c = el('canvas', 'lbc'), ctx = c.getContext('2d'); parent.append(c);
  const st = { c, ctx, w: 0, h: 0 };
  st.fit = () => { const w = Math.max(240, parent.clientWidth || 320), h = Math.max(minH || 120, Math.round(w * hRatio)), d = Math.min(window.devicePixelRatio || 1, 2);
    if (w === st.w && h === st.h) return; st.w = w; st.h = h; c.width = w * d; c.height = h * d; c.style.width = w + 'px'; c.style.height = h + 'px'; ctx.setTransform(d, 0, 0, d, 0, 0); };
  st.fit(); return st;
}

function graph(ctx, X, Y, W, Hh, s) {
  const L = 38, R = 8, T = 8, B = 28, px = x => X + L + (x - s.x0) / (s.x1 - s.x0) * (W - L - R), py = y => Y + T + (1 - (y - s.y0) / (s.y1 - s.y0)) * (Hh - T - B);
  ctx.save(); ctx.font = '10px "IBM Plex Mono",monospace'; ctx.lineWidth = 1;
  ctx.strokeStyle = COL.bd; ctx.fillStyle = COL.mu;
  ctx.strokeRect(X + L, Y + T, W - L - R, Hh - T - B);
  const ticks = (a, b, n) => { const out = [], st = (b - a) / n; for (let i = 0; i <= n; i++) out.push(a + st * i); return out; };
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ticks(s.x0, s.x1, s.xt || 5).forEach(v => { const x = px(v); ctx.beginPath(); ctx.moveTo(x, Y + Hh - B); ctx.lineTo(x, Y + Hh - B + 3); ctx.stroke(); ctx.fillText(+v.toFixed(1), x, Y + Hh - B + 4); });
  ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
  ticks(s.y0, s.y1, s.yt || 4).forEach(v => { const y = py(v); ctx.beginPath(); ctx.moveTo(X + L - 3, y); ctx.lineTo(X + L, y); ctx.stroke(); ctx.fillText(+v.toFixed(s.yd == null ? 0 : s.yd), X + L - 5, y); });
  ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'; ctx.fillText(s.xl || '', X + L + (W - L - R) / 2, Y + Hh);
  ctx.save(); ctx.translate(X + 9, Y + T + (Hh - T - B) / 2); ctx.rotate(-Math.PI / 2); ctx.textBaseline = 'middle'; ctx.fillText(s.yl || '', 0, 0); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(X + L, Y + T, W - L - R, Hh - T - B); ctx.clip();
  (s.hl || []).forEach(h => { const y = py(h.y); ctx.strokeStyle = h.col || COL.bd; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(X + L, y); ctx.lineTo(X + W - R, y); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = h.col || COL.mu; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom'; ctx.fillText(h.lab, X + L + 4, y - 2); });
  (s.series || []).forEach(se => { ctx.strokeStyle = se.col; ctx.lineWidth = se.w || 2; ctx.setLineDash(se.dash || []); ctx.beginPath(); se.pts.forEach((p, i) => { const x = px(p[0]), y = py(p[1]); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); ctx.setLineDash([]); });
  if (s.cursor != null) { const x = px(s.cursor); ctx.strokeStyle = COL.hl; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, Y + T); ctx.lineTo(x, Y + Hh - B); ctx.stroke(); }
  ctx.restore();
  
  let lx = X + L + 6; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  (s.series || []).forEach(se => { if (!se.lab) return; ctx.fillStyle = se.col; ctx.fillRect(lx, Y + T + 5, 9, 3); ctx.fillStyle = COL.fg; ctx.fillText(se.lab, lx + 12, Y + T + 1); lx += 18 + ctx.measureText(se.lab).width + 6; });
  ctx.restore();
  return { px, py };
}


const ov = el('div', 'ov labov', '<div class="oh"><span id="labt">Labs</span><button id="labx">Band karo</button></div><div class="lbtabs" id="labtabs" role="tablist"></div><div class="ob" id="labb"></div>');
ov.id = 'lab'; document.body.appendChild(ov);
const tabs = ov.querySelector('#labtabs'), body = ov.querySelector('#labb'), title = ov.querySelector('#labt');
let active = null, run = null;
function stop() { if (run && run.stop) { try { run.stop(); } catch (e) { console.error(e); } } run = null; body.textContent = ''; }
function show(id) {
  const lab = LABS.find(l => l.id === id) || LABS[0]; if (!lab) return;
  stop(); active = lab.id; title.textContent = lab.name;
  [...tabs.children].forEach(b => { b.classList.toggle('on', b.dataset.id === lab.id); b.setAttribute('aria-selected', b.dataset.id === lab.id); });
  const wrap = el('div', 'lbwrap'); body.append(wrap);
  try { run = lab.build(wrap, { ctl, btn, toggles, canvas, graph, el, COL }); }
  catch (e) { console.error('[CellVerse lab] ' + lab.id, e); wrap.append(el('p', 'mu', 'Lab load nahi hua: ' + e.message)); }
  body.scrollTop = 0;
}
function open(id) { if (typeof closeDock === 'function') closeDock(); ov.classList.add('open'); show(id || active || (LABS[0] && LABS[0].id)); }
function close() { ov.classList.remove('open'); stop(); }
ov.querySelector('#labx').onclick = close;
addEventListener('keydown', e => { if (e.key === 'Escape' && ov.classList.contains('open')) close(); });
tabs.onclick = e => { const b = e.target.closest('button'); if (b) show(b.dataset.id); };
let lw = innerWidth;
addEventListener('resize', () => { if (Math.abs(innerWidth - lw) > 40) { lw = innerWidth; if (ov.classList.contains('open') && active) show(active); } });

const API = {
  list: LABS,
  register(l) { LABS.push(l); const b = el('button', null, l.name); b.dataset.id = l.id; b.setAttribute('role', 'tab'); tabs.append(b); },
  open, close, isOpen: () => ov.classList.contains('open'),
  helpers: { ctl, btn, toggles, canvas, graph, el, COL }
};
window.CVLabs = API;


const dock = document.getElementById('dock'), b = el('button'); b.id = 'dkb'; b.setAttribute('aria-label', 'Labs');
b.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 3h6"/><path d="M10 3v6.2L5.2 18a2 2 0 0 0 1.8 3h10a2 2 0 0 0 1.8-3L14 9.2V3"/><path d="M8 14h8"/></svg>Labs';
b.onclick = () => open(); dock.appendChild(b);
})();
