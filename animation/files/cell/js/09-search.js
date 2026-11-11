/* Universal search: cell types, default-cell parts, har cell ke tracker topics, aur abhi khule cell ke tap-able parts.
   Dock mein "Search" button + overlay khud banata hai. Shortcut: "/" kholta hai, Esc band karta hai.
   Sab models register hone ke BAAD, 07-start.js se pehle load karo. */
'use strict';
(() => {
const norm = s => String(s || '').toLowerCase();

const hit = (hay, tok) => hay.includes(tok) || (tok.length >= 6 && hay.includes(tok.slice(0, tok.length - 2)));

function buildIndex() {
  const out = [], seen = new Set();
  const add = it => { const k = it.cell + '|' + norm(it.name) + '|' + it.t; if (seen.has(k)) return; seen.add(k); it.n = norm(it.name); it.x = norm(it.text + ' ' + it.sub); out.push(it); };
  const cname = id => (CELLTYPES.find(c => c.id === id) || {}).name || id;
  CELLTYPES.forEach(c => add({ t: 'cell', name: c.name, sub: 'Cell type', text: '', cell: c.id }));
  if (window.CVLabs) CVLabs.list.forEach(l => add({ t: 'lab', name: l.name + ' (lab)', sub: 'Interactive lab', text: l.desc || '', cell: '__lab', lab: l.id }));
  if (typeof TR !== 'undefined') TR.forEach(g => add({ t: 'part', name: g[0], sub: cname('default') + ' | ' + g[2], text: g[1], cell: 'default' }));
  Object.keys(CTI).forEach(id => { const i = CTI[id]; (i.tracker || []).forEach(g => add({ t: 'topic', name: g[0], sub: cname(id), text: g[1], cell: id })); });
  if (CTid !== 'default') CTP.forEach(m => add({ t: 'part', name: m.userData.name, sub: cname(CTid), text: m.userData.info || '', cell: CTid }));
  return out;
}
function search(q, idx) {
  const toks = norm(q).split(/\s+/).filter(Boolean);
  if (!toks.length) return idx.filter(i => i.t === 'cell');
  const res = [];
  idx.forEach(i => {
    let sc = 0;
    for (const t of toks) {
      if (i.n.startsWith(t)) sc += 6; else if (hit(i.n, t)) sc += 4; else if (hit(i.x, t)) sc += 1; else return;
    }
    if (i.t === 'cell') sc += 2;
    res.push({ i, sc });
  });
  return res.sort((a, b) => b.sc - a.sc || a.i.n.localeCompare(b.i.n)).slice(0, 40).map(r => r.i);
}


const ov = document.createElement('div');
ov.className = 'ov'; ov.id = 'sr'; ov.setAttribute('role', 'search');
ov.innerHTML = '<div class="oh"><span>Search</span><button id="srx">Band karo</button></div><div class="srh"><input id="sri" type="search" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Organelle, cell ya term likho..." aria-label="Search organelles, cells and topics"></div><div class="ob" id="srl"></div>';
document.body.appendChild(ov);
const inp = ov.querySelector('#sri'), list = ov.querySelector('#srl');
let idx = [], cur = [];
const TAG = { cell: 'CELL', part: 'PART', topic: 'TOPIC', lab: 'LAB' };

function mark(text, toks) {
  const f = document.createDocumentFragment(), low = norm(text);
  let at = 0;
  const spans = [];
  toks.forEach(t => { let p = low.indexOf(t); if (p >= 0) spans.push([p, p + t.length]); });
  spans.sort((a, b) => a[0] - b[0]);
  spans.forEach(([a, b]) => { if (a < at) return; f.append(text.slice(at, a)); const m = document.createElement('mark'); m.textContent = text.slice(a, b); f.append(m); at = b; });
  f.append(text.slice(at)); return f;
}
function draw() {
  const q = inp.value, toks = norm(q).split(/\s+/).filter(Boolean);
  cur = search(q, idx); list.textContent = '';
  if (!cur.length) { const p = document.createElement('p'); p.className = 'mu'; p.textContent = 'Kuch nahi mila. Doosra shabd try karo (jaise "mito", "golgi", "myelin").'; list.append(p); return; }
  cur.forEach((it, k) => {
    const b = document.createElement('button'); b.className = 'sri'; b.dataset.k = k;
    const t = document.createElement('b'); t.append(mark(it.name, toks));
    const g = document.createElement('em'); g.textContent = TAG[it.t];
    const s = document.createElement('small'); s.textContent = it.sub + (it.text ? ' - ' + it.text.slice(0, 90) + (it.text.length > 90 ? '...' : '') : '');
    b.append(t, g, document.createElement('br'), s); list.append(b);
  });
}
function openS() { closeDock(); idx = buildIndex(); inp.value = ''; draw(); ov.classList.add('open'); setTimeout(() => inp.focus(), 50); }
function closeS() { ov.classList.remove('open'); inp.blur(); }
function go(it) {
  closeS();
  if (it.t === 'lab') { CVLabs.open(it.lab); return; }
  if (CTid !== it.cell) showCT(it.cell);
  if (it.t === 'cell') return;
  const nm = norm(it.name), pool = CTid === 'default' ? pick : CTP,
    m = pool.find(x => norm(x.userData.name) === nm && vis(x)) || pool.find(x => norm(x.userData.name).includes(nm) && vis(x));
  if (m) { sel(m); return; }
  openX(it.name, '<p>' + String(it.text || it.sub).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])) + '</p><p class="mu">' + it.sub + '</p>');
}
inp.addEventListener('input', draw);
inp.addEventListener('keydown', e => { if (e.key === 'Enter' && cur[0]) go(cur[0]); });
list.addEventListener('click', e => { const b = e.target.closest('.sri'); if (b) go(cur[+b.dataset.k]); });
ov.querySelector('#srx').onclick = closeS;
addEventListener('keydown', e => {
  if (e.key === 'Escape' && ov.classList.contains('open')) { closeS(); return; }
  if (e.key === '/' && !ov.classList.contains('open') && !/INPUT|TEXTAREA/.test((document.activeElement || {}).tagName || '')) { e.preventDefault(); openS(); }
});

const dock = document.getElementById('dock'), btn = document.createElement('button');
btn.id = 'dks'; btn.setAttribute('aria-label', 'Search');
btn.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/></svg>Search';
btn.onclick = openS; dock.appendChild(btn);
window.CVSearch = { open: openS, search: q => search(q, buildIndex()) };
})();
