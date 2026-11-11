/* CVKit: models + detail views ke shared helpers (index.html mein sabse pehle, models/* se pehle load hota hai).
   Sirf ek global banata hai: window.CVKit. */
(() => {
const rr = (a, b) => a + (b - a) * rnd();
const inSph = (R, zmax) => { let p; do { p = [rr(-R, R), rr(-R, R), rr(-R, R)]; } while (Math.hypot(p[0], p[1], p[2]) > R || p[2] > (zmax == null ? 0 : zmax)); return p; };
const dots = (A, P, n, fn, col, r, op, cut) => { const pts = []; for (let i = 0; i < n; i++) pts.push(fn(i)); return A.inst(sp(r, 6, 5), col, pts, P, op == null ? .95 : op, null, cut); };
const table = (h, rows) => '<table><tr>' + h.map((x, i) => '<th class="' + (i === 1 ? 'pk' : i === 2 ? 'ek' : '') + '">' + x + '</th>').join('') + '</tr>' + rows.map(r => '<tr>' + r.map(c => '<td>' + c + '</td>').join('') + '</tr>').join('') + '</table>';
const h3 = t => '<h3 style="margin:16px 0 4px;color:#f2c35a">' + t + '</h3>';


const make = (THREE, group, opt) => {
  const T3 = THREE, root = new T3.Group(); group.add(root);
  let seed = 7; const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const PARTS = {}; let ctx = null;
  const setPart = (key, name, info, det, grp) => { ctx = key ? (PARTS[key] = PARTS[key] || { key, name, info, det, grp, objs: [] }) : null; };
  const reg = o => { if (ctx) ctx.objs.push(o); return o; };
  const V = (x, y, z) => new T3.Vector3(x, y, z);
  const mat = (c, op, em, emI) => {
    const p = { color: c, roughness: .5, side: T3.DoubleSide };
    if (op != null && op < 1) { p.transparent = true; p.opacity = op; p.depthWrite = false; }
    if (em != null) { p.emissive = em; p.emissiveIntensity = emI == null ? 0 : emI; }
    return new T3.MeshStandardMaterial(p);
  };
  const sph = (r, w, h) => new T3.SphereGeometry(r, w || 16, h || 12);
  const cap = (len, r) => { const n = 8, hc = Math.max(0, len / 2 - r), P = [];
    for (let i = 0; i <= n; i++) { const a = -Math.PI / 2 + Math.PI / 2 * i / n; P.push(new T3.Vector2(Math.max(.0001, r * Math.cos(a)), -hc + r * Math.sin(a))); }
    for (let i = 0; i <= n; i++) { const a = Math.PI / 2 * i / n; P.push(new T3.Vector2(Math.max(.0001, r * Math.cos(a)), hc + r * Math.sin(a))); }
    return new T3.LatheGeometry(P, 16); };
  const add = (geo, m, x, y, z, parent) => { const o = new T3.Mesh(geo, m); o.position.set(x || 0, y || 0, z || 0); (parent || root).add(o); return reg(o); };
  const grp = (x, y, z) => { const g = new T3.Group(); g.position.set(x || 0, y || 0, z || 0); root.add(g); reg(g); return g; };
  const tube = (pts, r, seg, m) => { const c = new T3.CatmullRomCurve3(pts.map(p => p.isVector3 ? p : V(p[0], p[1], p[2])));
    const tm = new T3.Mesh(new T3.TubeGeometry(c, seg || 20, r, 6, false), m); root.add(tm); reg(tm); tm.userData.curve = c; return tm; };
  const inst = (geo, m, list) => { const im = new T3.InstancedMesh(geo, m, list.length), d = new T3.Object3D();
    list.forEach((o, i) => { const p = o.p || o; d.position.set(p[0] != null ? p[0] : p.x, p[1] != null ? p[1] : p.y, p[2] != null ? p[2] : p.z); const s = o.s || 1; d.scale.set(s, s, s); d.updateMatrix(); im.setMatrixAt(i, d.matrix); });
    im.instanceMatrix.needsUpdate = true; im.frustumCulled = false; root.add(im); return reg(im); };
  const out = o => { o.userData.out = true; return o; };
  
  const result = (fn, orient) => ({
    parts: Object.keys(PARTS).map(k => PARTS[k]),
    tick: (dt, t) => {
      if (orient) { const portrait = innerWidth / innerHeight < .8, tr = portrait ? orient.rot : 0, ts = portrait ? orient.scale : 1, k = Math.min(1, dt * 6);
        root.rotation.z += (tr - root.rotation.z) * k; const sc = root.scale.x + (ts - root.scale.x) * k; root.scale.set(sc, sc, sc); }
      if (fn) fn(dt, t);
    } });
  return { T3, root, COL: opt && opt.color ? opt.color : '#ffffff', rand, V, mat, sph, cap, add, grp, tube, inst, out, setPart, reg, result };
};
window.CVKit = { make, rr, inSph, dots, table, h3 };
})();

