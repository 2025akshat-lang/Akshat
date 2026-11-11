/* CVQ: model-registration validation, error guards, stale-touch cleanup.
   06-cell-types.js ke BAAD aur models/* se PEHLE load hota hai (registerCellModel / registerCellInfo ko yahi check karta hai).
   Debug: URL ke aage ?debug lagao = schema issues banner mein; ?audit = saare cells ek-ek kholkar report. */
'use strict';
(() => {
const Q = { debug: /[?&](debug|audit)\b/.test(location.search), issues: {} };
const note = (id, msg) => { (Q.issues[id] = Q.issues[id] || []).push(msg); console.warn('[CellVerse schema] ' + id + ': ' + msg); };
const isStr = v => typeof v === 'string' && v.trim().length > 0;


Q.checkInfoShape = (id, info) => {
  const bad = [], add = m => { bad.push(m); note(id, m); };
  if (!info || typeof info !== 'object') { add('info object nahi hai'); return bad; }
  if (!isStr(info.name)) add('info.name missing');
  if (info.fit) {
    const f = info.fit, okR = Array.isArray(f.r) && f.r.length === 2 && f.r.every(Number.isFinite),
      okT = Array.isArray(f.t) && f.t.length === 2 && f.t.every(a => Array.isArray(a) && a.length === 3 && a.every(Number.isFinite));
    if (!okR || !okT) add('fit = {r:[portrait,landscape], t:[[x,y,z],[x,y,z]]} format galat');
  }
  if (info.compare && !(isStr(info.compare.title) && isStr(info.compare.html))) add('compare = {title, html} chahiye');
  if (info.tracker && !(Array.isArray(info.tracker) && info.tracker.every(g => Array.isArray(g) && isStr(g[0]) && isStr(g[1])))) add('tracker = [[naam, detail], ...] chahiye');
  if (info.layers && !(Array.isArray(info.layers) && info.layers.every(l => l && isStr(l.id) && isStr(l.name) && Array.isArray(l.parts)))) add('layers = [{id,name,color,parts:[key]}] chahiye');
  return bad;
};
Q.onInfo = (id, info) => { try { Q.checkInfoShape(id, info); } catch (e) { console.warn(e); } };
const regd = [];
Q.onModel = id => { regd.push(id); };

addEventListener('load', () => regd.forEach(id => { if (window.CELLTYPES && !window.CELLTYPES.some(c => c.id === id)) note(id, 'model register hua par CELLTYPES mein id nahi hai, slider mein nahi dikhega'); }));


Q.checkModel = (id, out, info, tappable) => {
  const bad = [], add = m => { bad.push(m); note(id, m); };
  if (out && typeof out.tick !== 'undefined' && typeof out.tick !== 'function') add('tick function hona chahiye');
  const parts = out && out.parts;
  if (!Array.isArray(parts) || !parts.length) add('parts nahi hain: koi bhi hissa tap-able/searchable nahi');
  else {
    const keys = new Set();
    parts.forEach((p, i) => {
      const tag = 'part[' + i + ']' + (p && p.key ? ' "' + p.key + '"' : '');
      if (!p || !isStr(p.key)) return add(tag + ': key missing');
      if (keys.has(p.key)) add(tag + ': duplicate key');
      keys.add(p.key);
      if (!isStr(p.name)) add(tag + ': name missing');
      if (!isStr(p.info)) add(tag + ': info (explanation) missing');
      if (!Array.isArray(p.objs) || !p.objs.length) add(tag + ': objs khaali (3D object attach nahi)');
    });
    if (info && Array.isArray(info.layers)) info.layers.forEach(l => (l.parts || []).forEach(k => { if (!keys.has(k)) add('layer "' + l.id + '": part key "' + k + '" model mein nahi hai'); }));
  }
  if (tappable && !tappable.length && Array.isArray(parts) && parts.length) add('parts hain par koi Mesh nahi mila (objs ke andar Mesh chahiye)');
  return bad;
};


Q.audit = () => {
  const start = typeof CTid === 'string' ? CTid : 'default', rows = [], errs = [];
  const onErr = e => errs.push(e.message || String(e));
  addEventListener('error', onErr);
  (window.CELLTYPES || []).forEach(c => {
    errs.length = 0;
    const before = Object.assign({}, Q.issues[c.id] ? { n: Q.issues[c.id].length } : { n: 0 });
    try { showCT(c.id); } catch (e) { errs.push(e.message); }
    rows.push({ cell: c.id, registered: c.id === 'default' || !!CTB[c.id], parts: typeof CTP !== 'undefined' ? CTP.length : 0, errors: errs.join(' | ') || '-', schemaIssues: (Q.issues[c.id] || []).length - before.n });
  });
  removeEventListener('error', onErr);
  try { showCT(start); } catch (e) {  }
  console.table(rows);
  return rows;
};
if (/[?&]audit\b/.test(location.search)) addEventListener('load', () => setTimeout(() => { const r = Q.audit(), n = r.filter(x => x.errors !== '-' || x.schemaIssues).length; if (typeof ban === 'function') ban('AUDIT: ' + r.length + ' cells, ' + n + ' me issue (console.table dekho)'); }, 800));

window.CVQ = Q;


const reset = () => { try { if (typeof P !== 'undefined') P.clear(); pd = 0; } catch (e) {  } };
addEventListener('blur', reset);
document.addEventListener('visibilitychange', () => { if (document.hidden) reset(); });
addEventListener('pagehide', reset);

document.addEventListener('contextmenu', e => { if (e.target && e.target.tagName === 'CANVAS') e.preventDefault(); });


addEventListener('unhandledrejection', e => { console.error(e.reason); if (typeof ban === 'function') ban('Error: ' + ((e.reason && e.reason.message) || e.reason)); });
})();
