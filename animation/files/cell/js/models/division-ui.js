/* Division (mitosis/meiosis) UI: top button, panel (Mitosis|Meiosis, play, speed, phase chips, cycle ring). division.js ke baad load karo. */
(() => {
const D = window.CVDiv;
if (!D) throw new Error('division.js load nahi hua (division-ui.js usse baad mein load hona chahiye)');
const q = s => document.querySelector(s);
const panel = q('#dvp'), chips = q('#dvph'), nm = q('#dvnm'), pl = q('#dvplay'), sp = q('#dvsp'), mark = q('#dvmark'), ctr = q('#dvct'), btn = q('#dvb'), t1 = q('#dvr1'), t2 = q('#dvr2');
if (!panel || !btn) throw new Error('index.html mein #dvp / #dvb markup nahi mila');
const SHORT0 = { mit: ['I', 'P', 'PM', 'M', 'A', 'T', 'C'], mei: ['I', 'P1', 'M1', 'A1', 'T1', 'P2', 'M2', 'A2', 'T2'], can: ['N', 'C', 'R', 'S', 'I'] };
const ID = { mit: 'mitosis', mei: 'meiosis', can: 'cancer' }, SHORT = SHORT0, LAB = { mit: 'Mitosis', mei: 'Meiosis', can: 'Cancer' };
Object.keys(D.META).forEach(k => { const m = D.META[k]; ID[k] = m.id; SHORT[k] = m.short; LAB[k] = m.label; });
q('#dvk').innerHTML = Object.keys(ID).map(k => '<button data-k="' + k + '">' + LAB[k] + '</button>').join('');
const CIRC = 2 * Math.PI * 26, SPEEDS = [.5, 1, 2];
let drawn = '';
const inDiv = () => document.body.classList.contains('dv');

function draw() {
  const L = D.list(), key = D.kind + L.length;
  if (drawn !== key) {
    drawn = key;
    chips.innerHTML = L.map((x, i) => '<button data-i="' + i + '"><b>' + (i + 1) + '</b>' + x.n + '</button>').join('');
    const tot = L.reduce((a, x) => a + x.d, 0), fi = L[0].d / tot;
    t1.setAttribute('stroke-dasharray', (fi * CIRC) + ' ' + CIRC);
    t2.setAttribute('stroke-dasharray', ((1 - fi) * CIRC) + ' ' + CIRC); t2.setAttribute('stroke-dashoffset', -fi * CIRC);
  }
  [...chips.children].forEach((b, i) => b.classList.toggle('on', i === D.ph));
  const a = chips.children[D.ph]; if (a && a.scrollIntoView) { try { chips.scrollTo({ left: a.offsetLeft - chips.clientWidth / 2 + a.offsetWidth / 2, behavior: 'smooth' }); } catch (e) {} }
  nm.innerHTML = '<b>' + L[D.ph].n + '</b><small>' + L[D.ph].s + '</small>';
  ctr.textContent = SHORT[D.kind][D.ph];
  [...q('#dvk').children].forEach(b => b.classList.toggle('on', b.dataset.k === D.kind));
  pl.textContent = D.playing && !D.hold ? '⏸' : '▶'; sp.textContent = D.speed + '×';
}
D.onChange = draw;
D.onTick = () => { const f = D.frac(), a = f * Math.PI * 2 - Math.PI / 2; mark.setAttribute('cx', 32 + 26 * Math.cos(a)); mark.setAttribute('cy', 32 + 26 * Math.sin(a)); };

chips.onclick = e => { const b = e.target.closest('button'); if (!b) return; D.go(+b.dataset.i, false); };
q('#dvk').onclick = e => { const b = e.target.closest('button'); if (!b || b.dataset.k === D.kind) return; showCT(ID[b.dataset.k]); };
pl.onclick = () => {
  if (D.playing && !D.hold) { D.playing = false; }
  else { D.hold = false; if (D.p >= .999) { D.p = 0; D.ph = (D.ph + 1) % D.list().length; } D.playing = true; }
  draw();
};
sp.onclick = () => { D.speed = SPEEDS[(SPEEDS.indexOf(D.speed) + 1) % SPEEDS.length]; draw(); };
btn.onclick = () => { if (inDiv()) showCT('default'); else showCT(ID[D.kind]); };
window.dvSync = () => { btn.classList.toggle('on', inDiv()); if (inDiv()) draw(); };
draw();
})();
/* END OF FILE division-ui.js */
