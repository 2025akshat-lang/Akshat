/* ===== world.js : raaste (3 alag), ilaake ka scenery, mausam, roshni, sun/baadal =====
   Har level ka ek REGION hota hai (config.js). Naye tiles hamesha current region ke bante hain, isliye
   ilaaka door se dheere dheere badalta hua aata hai; mausam/roshni tab badalti hai jab naya ilaaka paas aa jaye. */
(function () {
  const C = MR.CONFIG;
  const LEN = C.TRACK_LEN;

  let scene, ambient, keyLight, fillLight, sunMesh, cloudGroup;
  const segments = [], chunks = [], speedLines = [];
  let weather, weatherVel = [];
  let weatherType = 'none';
  let curRegion = null;      // naye tiles isi ilaake ke bante hain
  let themeRegion = null;    // jis ilaake ka mausam abhi laga hua hai
  let pending = null;        // { region, boundaryZ } - ilaaka badal raha hai, mausam abhi purana
  let target = null;

  /* ---------- shared materials / geometry ---------- */
  const matCache = {};
  function sm(hex, flat) {
    const key = hex + (flat ? 'f' : '');
    return matCache[key] || (matCache[key] = new THREE.MeshStandardMaterial({ color: hex, roughness: 0.92, flatShading: !!flat }));
  }
  function bm(hex) {
    const key = 'b' + hex;
    return matCache[key] || (matCache[key] = new THREE.MeshBasicMaterial({ color: hex, side: THREE.DoubleSide }));
  }

  const kerbMat = new THREE.MeshStandardMaterial({ color: 0xe6e0d2, roughness: 0.8 });
  const railMat = new THREE.MeshStandardMaterial({ color: 0xa0a6ac, metalness: 0.3, roughness: 0.45 });
  const sleeperMat = new THREE.MeshStandardMaterial({ color: 0x7a5a3a, roughness: 0.8 });
  const awnings = [0xe8503a, 0x2f8fd6, 0xf2b01e, 0x3fae5a, 0xd6567a].map(c => sm(c));

  const G = {
    lane: new THREE.BoxGeometry(2.8, 0.4, LEN),
    kerb: new THREE.BoxGeometry(0.25, 0.14, LEN),
    foot: new THREE.BoxGeometry(3.2, 0.5, LEN),
    field: new THREE.BoxGeometry(260, 0.4, LEN),
    sea: new THREE.BoxGeometry(110, 0.1, LEN),
    crossLine: new THREE.BoxGeometry(2.6, 0.02, 0.06),
    dash: new THREE.BoxGeometry(0.1, 0.02, 1.6),
    patch: new THREE.BoxGeometry(1, 0.02, 1),
    rail: new THREE.BoxGeometry(0.1, 0.12, LEN),
    sleeper: new THREE.BoxGeometry(1.5, 0.06, 0.35),
    unit: new THREE.BoxGeometry(1, 1, 1),
    cyl: new THREE.CylinderGeometry(1, 1, 1, 8),
    mesa: new THREE.CylinderGeometry(0.6, 1, 1, 10),
    cone: new THREE.ConeGeometry(1, 1, 7),
    cone4: new THREE.ConeGeometry(1, 1, 4),
    sph: new THREE.SphereGeometry(1, 12, 8),
    rock: new THREE.DodecahedronGeometry(1, 0),
    posterPlane: new THREE.PlaneGeometry(1.4, 2.0),
    adPlane: new THREE.PlaneGeometry(4.0, 2.0),
    signPlane: new THREE.PlaneGeometry(2.6, 0.95),
    banner: new THREE.PlaneGeometry(8.8, 2.58),
    flag: new THREE.PlaneGeometry(0.55, 0.42),
    sail: new THREE.PlaneGeometry(1.3, 1.9),
    pole: new THREE.CylinderGeometry(0.06, 0.08, 2.7, 8),
    tallPole: new THREE.CylinderGeometry(0.09, 0.12, 6.4, 8),
    gPole: new THREE.CylinderGeometry(0.13, 0.16, 7.4, 8),
    glow: new THREE.SphereGeometry(0.12, 10, 10),
    tank: new THREE.CylinderGeometry(0.8, 0.8, 1.1, 12),
    sun: new THREE.SphereGeometry(16, 20, 16),
    cloud: new THREE.SphereGeometry(1, 10, 8)
  };
  const M2 = {
    pole: new THREE.MeshStandardMaterial({ color: 0x9a9a9a, roughness: 0.5 }),
    elecPole: new THREE.MeshStandardMaterial({ color: 0xa8a39a, roughness: 0.9 }),
    glow: new THREE.MeshBasicMaterial({ color: 0xffd37a }),
    trunk: new THREE.MeshStandardMaterial({ color: 0x8a5a30 }),
    frame: new THREE.MeshStandardMaterial({ color: 0x808080 }),
    sun: new THREE.MeshBasicMaterial({ color: 0xfff2b0, fog: false, transparent: true, opacity: 1 }),
    cloud: new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false, transparent: true, opacity: 0.92 }),
    tank: new THREE.MeshStandardMaterial({ color: 0x4a8fc8, roughness: 0.6 })
  };
  const netaMats = MR.Tex.netas.map(t => new THREE.MeshBasicMaterial({ map: t, side: THREE.DoubleSide }));
  const adMats = MR.Tex.ads.map(t => new THREE.MeshBasicMaterial({ map: t }));
  const signMats = MR.Tex.shopSigns.map(t => new THREE.MeshBasicMaterial({ map: t }));
  const bannerMats = MR.Tex.netaBanners.concat(MR.Tex.adBanners).map(t => new THREE.MeshBasicMaterial({ map: t, side: THREE.DoubleSide }));

  const faceRoad = (s) => (s < 0 ? Math.PI / 2 : -Math.PI / 2);   // s = side (-1 ya +1)
  const R = Math.random;
  const pick = (a) => a[Math.floor(R() * a.length)];

  function clearGroup(g) {
    while (g.children.length) {
      const c = g.children[0];
      g.remove(c);
      if (c.isInstancedMesh) c.dispose();
    }
  }

  /* ---------- theme state (sky / roshni / mausam) ---------- */
  const cur = {
    bg: new THREE.Color(), amb: new THREE.Color(), key: new THREE.Color(), fill: new THREE.Color(),
    sun: new THREE.Color(), cloud: new THREE.Color(), pcol: new THREE.Color(),
    fog: 0.006, ambI: 0.55, keyI: 0.9, fillI: 0.3, sunVis: 1, cloudOp: 0.9, cloudScale: 1,
    pop: 0, pfall: 0, psize: 0.06
  };
  const tmp = new THREE.Color();

  function regionFor(idx) {
    const lv = MR.LEVELS[Math.min(idx, MR.LEVELS.length - 1)];
    return MR.REGIONS[lv.region];
  }

  function computeTarget(rg) {
    const S = MR.Settings.get();
    const key = S.mode === 'manual' ? S.weather : rg.weather;
    const w = MR.WEATHERS[key] || MR.WEATHERS.sunny;
    return {
      bg: w.sky != null ? w.sky : rg.sky,
      fog: w.fog * (rg.fogMul || 1),
      amb: w.amb, key: w.key, fill: w.fill,
      sunCol: w.sunCol != null ? w.sunCol : rg.sun, sunVis: w.sun,
      cloudCol: w.cloud.color, cloudOp: w.cloud.opacity, cloudScale: w.cloud.scale,
      p: w.precip
    };
  }

  function snapTheme() {
    const t = target;
    cur.bg.set(t.bg); cur.amb.set(t.amb[0]); cur.key.set(t.key[0]); cur.fill.set(t.fill[0]);
    cur.sun.set(t.sunCol); cur.cloud.set(t.cloudCol); cur.pcol.set(t.p.color);
    cur.fog = t.fog; cur.ambI = t.amb[1]; cur.keyI = t.key[1]; cur.fillI = t.fill[1];
    cur.sunVis = t.sunVis; cur.cloudOp = t.cloudOp; cur.cloudScale = t.cloudScale;
    cur.pop = t.p.opacity; cur.pfall = t.p.fall; cur.psize = t.p.size;
    weatherType = t.p.type;
    apply();
  }

  function approach(a, b, t) { return a + (b - a) * t; }

  function lerpTheme(k) {
    if (!target) return;
    const t = Math.min(1, 0.03 * k), L = (c, hex) => c.lerp(tmp.set(hex), t);
    L(cur.bg, target.bg); L(cur.amb, target.amb[0]); L(cur.key, target.key[0]); L(cur.fill, target.fill[0]);
    L(cur.sun, target.sunCol); L(cur.cloud, target.cloudCol); L(cur.pcol, target.p.color);
    cur.fog = approach(cur.fog, target.fog, t);
    cur.ambI = approach(cur.ambI, target.amb[1], t);
    cur.keyI = approach(cur.keyI, target.key[1], t);
    cur.fillI = approach(cur.fillI, target.fill[1], t);
    cur.sunVis = approach(cur.sunVis, target.sunVis, t);
    cur.cloudOp = approach(cur.cloudOp, target.cloudOp, t);
    cur.cloudScale = approach(cur.cloudScale, target.cloudScale, t);
    cur.pop = approach(cur.pop, target.p.opacity, t);
    cur.pfall = approach(cur.pfall, target.p.fall, t);
    cur.psize = approach(cur.psize, target.p.size, t);
    weatherType = target.p.type === 'none' ? (cur.pop > 0.03 ? weatherType : 'none') : target.p.type;
    apply();
  }

  function apply() {
    scene.background.copy(cur.bg);
    scene.fog.color.copy(cur.bg); scene.fog.density = cur.fog;
    ambient.color.copy(cur.amb); ambient.intensity = cur.ambI;
    keyLight.color.copy(cur.key); keyLight.intensity = cur.keyI;
    fillLight.color.copy(cur.fill); fillLight.intensity = cur.fillI;
    M2.sun.color.copy(cur.sun); M2.sun.opacity = cur.sunVis; sunMesh.visible = cur.sunVis > 0.03;
    M2.cloud.color.copy(cur.cloud); M2.cloud.opacity = cur.cloudOp;
    cloudGroup.children.forEach(c => c.scale.setScalar(cur.cloudScale));
    weather.material.color.copy(cur.pcol);
    weather.material.opacity = cur.pop;
    weather.material.size = cur.psize;
    weather.visible = cur.pop > 0.02;
  }

  function applyRegionTheme(rg, instant) {
    themeRegion = rg;
    target = computeTarget(rg);
    if (instant) snapTheme();
  }

  /* ---------- raaste (lane surface + design) ---------- */
  function addLaneDetail(d, type, x, col) {
    const dummy = new THREE.Object3D();
    const mat = sm(col);
    if (type === 'paver' || type === 'slab') {
      const step = type === 'paver' ? 1.0 : 2.2;
      const n = Math.floor(LEN / step);
      const im = new THREE.InstancedMesh(G.crossLine, mat, n);
      for (let i = 0; i < n; i++) {
        dummy.position.set(x, 0.011, i * step + 0.5);
        dummy.scale.set(1, 1, type === 'slab' ? 1.6 : 1);
        dummy.updateMatrix(); im.setMatrixAt(i, dummy.matrix);
      }
      im.instanceMatrix.needsUpdate = true; d.add(im);
    } else if (type === 'tarmac') {
      const n = Math.floor(LEN / 3);
      const im = new THREE.InstancedMesh(G.dash, bm(0xf5f5f0), n * 2);
      let k = 0;
      [-0.7, 0.7].forEach(ox => {
        for (let i = 0; i < n; i++) { dummy.position.set(x + ox, 0.011, i * 3 + 1.5); dummy.updateMatrix(); im.setMatrixAt(k++, dummy.matrix); }
      });
      im.instanceMatrix.needsUpdate = true; d.add(im);
    } else if (type === 'patch' || type === 'ripple') {
      const n = type === 'patch' ? 16 : 22;
      const im = new THREE.InstancedMesh(G.patch, mat, n);
      for (let i = 0; i < n; i++) {
        dummy.position.set(x + (R() - 0.5) * 2.2, 0.011, R() * LEN);
        if (type === 'patch') dummy.scale.set(0.3 + R() * 0.8, 1, 0.4 + R() * 1.1);
        else dummy.scale.set(0.8 + R() * 1.6, 1, 0.1);
        dummy.updateMatrix(); im.setMatrixAt(i, dummy.matrix);
      }
      dummy.scale.set(1, 1, 1);
      im.instanceMatrix.needsUpdate = true; d.add(im);
    } else if (type === 'rail') {
      [-0.55, 0.55].forEach(ro => {
        const r = new THREE.Mesh(G.rail, railMat); r.position.set(x + ro, 0.07, LEN / 2); d.add(r);
      });
      const n = Math.ceil(LEN / 2.5);
      const im = new THREE.InstancedMesh(G.sleeper, sleeperMat, n);
      for (let i = 0; i < n; i++) { dummy.position.set(x, 0.03, i * 2.5 + 1); dummy.updateMatrix(); im.setMatrixAt(i, dummy.matrix); }
      im.instanceMatrix.needsUpdate = true; d.add(im);
    }
  }

  function buildSegment(seg, rg) {
    const u = seg.userData;
    u.field.material = sm(rg.field);
    u.lanes.forEach((m, i) => { m.material = sm(rg.lanes[i]); });
    u.foots.forEach(m => { m.material = sm(rg.foot); });
    clearGroup(u.detail);
    rg.detail.forEach((type, li) => addLaneDetail(u.detail, type, C.LANES[li], rg.detailCol[li]));
  }

  function createTrackSegment(i) {
    const seg = new THREE.Group();
    const field = new THREE.Mesh(G.field, sm(0x999999));
    field.position.set(0, -0.25, LEN / 2); field.receiveShadow = true; seg.add(field);
    const lanes = C.LANES.map(x => {
      const m = new THREE.Mesh(G.lane, sm(0x777777));
      m.position.set(x, -0.2, LEN / 2); m.receiveShadow = true; seg.add(m); return m;
    });
    [-4.3, -1.4, 1.4, 4.3].forEach(x => {
      const k = new THREE.Mesh(G.kerb, kerbMat); k.position.set(x, 0.05, LEN / 2); seg.add(k);
    });
    const foots = [-1, 1].map(sd => {
      const f = new THREE.Mesh(G.foot, sm(0xcccccc));
      f.position.set(sd * 6.0, -0.15, LEN / 2); f.receiveShadow = true; seg.add(f); return f;
    });
    const detail = new THREE.Group(); seg.add(detail);
    seg.userData = { field, lanes, foots, detail };
    seg.position.z = i * LEN;
    buildSegment(seg, curRegion);
    scene.add(seg); segments.push(seg);
  }

  /* ---------- scenery helper shapes ---------- */
  function shape(props, geo, mat, x, y, z, sx, sy, sz, ry) {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z); m.scale.set(sx, sy, sz);
    if (ry) m.rotation.y = ry;
    props.add(m); return m;
  }
  function tree(props, x, z, s, rg) {
    shape(props, G.cyl, M2.trunk, x, 0.1 + 0.4 * s, z, 0.09 * s, 0.8 * s, 0.09 * s);
    shape(props, G.sph, sm(rg.leaf), x, 0.1 + 1.0 * s, z, 0.42 * s, 0.42 * s, 0.42 * s);
  }
  function jungleTree(props, x, z, rg) {
    const h = 5 + R() * 5, w = 2.2 + R() * 1.4;
    shape(props, G.cyl, M2.trunk, x, h / 2, z, 0.3 + R() * 0.15, h, 0.3 + R() * 0.15);
    shape(props, G.sph, sm(R() < 0.5 ? rg.leaf : rg.leaf2), x, h + 0.4, z, w, w * 0.7, w);
    shape(props, G.sph, sm(rg.leaf2), x + (R() - 0.5) * 1.4, h - 0.7, z + (R() - 0.5) * 1.4, w * 0.75, w * 0.5, w * 0.75);
  }
  function pine(props, x, z, s, rg) {
    shape(props, G.cyl, M2.trunk, x, 0.4 * s, z, 0.14 * s, 0.8 * s, 0.14 * s);
    const green = sm(rg.leaf, true), white = sm(0xeef4fa, true);
    shape(props, G.cone, green, x, 1.4 * s, z, 1.3 * s, 1.7 * s, 1.3 * s);
    shape(props, G.cone, green, x, 2.3 * s, z, 1.05 * s, 1.5 * s, 1.05 * s);
    shape(props, G.cone, rg.snow ? white : green, x, 3.1 * s, z, 0.8 * s, 1.4 * s, 0.8 * s);
    if (rg.snow) shape(props, G.cone, white, x, 1.75 * s, z, 1.0 * s, 0.9 * s, 1.0 * s);
  }
  function acacia(props, x, z, rg) {
    shape(props, G.cyl, M2.trunk, x, 0.9, z, 0.07, 1.8, 0.07);
    shape(props, G.sph, sm(rg.leaf), x, 1.9, z, 1.3, 0.4, 1.3);
  }
  function palm(props, x, z, s, rg) {
    const p = MR.Models.palm(sm(rg.leaf));
    p.scale.setScalar(s); p.position.set(x, 0.1, z); p.rotation.y = R() * 6;
    props.add(p);
  }
  function boulder(props, x, z, a, hex) {
    const m = shape(props, G.rock, sm(hex, true), x, a * 0.35, z, a, a * 0.7, a * 0.9, R() * 6);
    m.rotation.x = R() * 0.4; return m;
  }
  function mountain(props, x, z, Rr, H, hex, capHex) {
    shape(props, G.cone, sm(hex, true), x, H / 2 - 0.5, z, Rr, H, Rr, R() * 6);
    if (capHex != null) shape(props, G.cone, sm(capHex, true), x, H - 0.5 - H * 0.18, z, Rr * 0.36, H * 0.36, Rr * 0.36, 0);
  }
  function house(props, x, z, w, h, d, wallHex, roofHex, s, snowRoof) {
    shape(props, G.unit, sm(wallHex), x, h / 2, z, w, h, d);
    shape(props, G.cone4, sm(snowRoof ? 0xf2f6fa : roofHex, true), x, h + 0.55, z, w * 0.78, 1.1, d * 0.78, Math.PI / 4);
  }
  function flagsString(props, y0, dip) {
    const cols = [0x2f7fd6, 0xffffff, 0xe03a3a, 0x3fae5a, 0xf2c21e];
    for (let i = 0; i < 18; i++) {
      const t = i / 17;
      const f = new THREE.Mesh(G.flag, bm(cols[i % 5]));
      f.position.set(-7.4 + 14.8 * t, y0 - dip * Math.sin(Math.PI * t), 0);
      f.rotation.y = Math.PI; props.add(f);
    }
  }

  function addShop(props, s, z, rg) {
    const body = new THREE.Mesh(G.unit, s < 0 ? sm(rg.bldB) : sm(rg.bldA));
    body.scale.set(3.2, 3.0, 4.6); body.position.set(s * 9.8, 1.5, z);
    props.add(body);
    const sign = new THREE.Mesh(G.signPlane, pick(signMats));
    sign.position.set(s * 8.17, 2.55, z); sign.rotation.y = faceRoad(s); props.add(sign);
    const awn = new THREE.Mesh(G.unit, pick(awnings));
    awn.scale.set(0.9, 0.07, 4.0); awn.position.set(s * 7.75, 2.1, z); awn.rotation.z = s * 0.18; props.add(awn);
    const pst = new THREE.Mesh(G.posterPlane, pick(netaMats));
    pst.scale.setScalar(0.62); pst.position.set(s * 8.17, 1.05, z + 1.5 - R() * 3);
    pst.rotation.y = faceRoad(s); props.add(pst);
  }

  /* ---------- gantry: raaste ke UPAR tangey neta / ad ke bade banners ---------- */
  function addGantry(props, z) {
    [-1, 1].forEach(s => {
      const p = new THREE.Mesh(G.gPole, M2.pole); p.position.set(s * 7.5, 3.7, z); props.add(p);
    });
    const beam = new THREE.Mesh(G.unit, M2.pole); beam.scale.set(15.4, 0.28, 0.28); beam.position.set(0, 7.2, z); props.add(beam);
    const frame = new THREE.Mesh(G.unit, M2.frame); frame.scale.set(9.0, 2.74, 0.08); frame.position.set(0, 5.7, z + 0.07); props.add(frame);
    const b = new THREE.Mesh(G.banner, pick(bannerMats)); b.position.set(0, 5.7, z); b.rotation.y = Math.PI; props.add(b);
    [-3.8, 3.8].forEach(x => {
      const rope = new THREE.Mesh(G.unit, M2.pole); rope.scale.set(0.06, 0.4, 0.06); rope.position.set(x, 7.0, z); props.add(rope);
    });
  }

  /* ---------- footpath: thele wale, machhali wala, lamp, bijli ka khamba, ped ---------- */
  function footpath(props, s, rg, ch, st) {
    const thelaP = { city: 0.5, coast: 0.45, rock: 0.3, sand: 0.22, jungle: 0.25, snow: 0.25, mountain: 0.2 }[rg.kind] || 0.3;
    const fishP = rg.kind === 'coast' ? 0.5 : 0.12;
    const cold = rg.kind === 'snow' || rg.kind === 'mountain';
    for (let z = 2 + R() * 3; z < 28; z += 6 + R() * 4) {
      const r = R();
      if (r < thelaP) {
        let kind = cold ? 'chai' : pick(['fruit', 'chai', 'sabzi']);
        if (!st.fish && R() < fishP) { kind = 'fish'; st.fish = true; }
        const t = MR.Models.thela(kind);
        t.position.set(s * 5.9, 0.1, z); t.rotation.y = faceRoad(s);
        props.add(t);
        if (kind === 'fish') ch.userData.fishZ = z;
      } else if (r < thelaP + 0.18) {
        const lamp = new THREE.Group();
        const pole = new THREE.Mesh(G.pole, M2.pole); pole.position.y = 1.35;
        const glow = new THREE.Mesh(G.glow, M2.glow); glow.position.y = 2.72;
        lamp.add(pole, glow); lamp.position.set(s * 4.8, 0.1, z); props.add(lamp);
      } else if (r < thelaP + 0.3) {
        const ep = new THREE.Mesh(G.tallPole, M2.elecPole); ep.position.set(s * 4.8, 3.3, z);
        const bar = new THREE.Mesh(G.unit, M2.elecPole); bar.scale.set(0.1, 0.1, 1.6); bar.position.set(s * 4.8, 6.1, z);
        props.add(ep, bar);
      } else {
        if (rg.kind === 'snow') pine(props, s * 6.8, z, 0.9, rg);
        else if (rg.kind === 'coast') palm(props, s * 6.8, z, 1.5, rg);
        else if (rg.kind === 'sand') acacia(props, s * 6.8, z, rg);
        else tree(props, s * 6.8, z, 1.5, rg);
      }
    }
  }

  /* ---------- ilaake ka scenery (footpath ke peeche) ---------- */
  function scenery(props, s, rg, ch) {
    const k = rg.kind;
    if (k === 'city') {
      if (R() < 0.7) { addShop(props, s, 4 + R() * 4, rg); if (R() < 0.6) addShop(props, s, 17 + R() * 6, rg); }
      if (R() < 0.35) {
        const z = 4 + R() * 22;
        const pole = new THREE.Mesh(G.tallPole, M2.pole); pole.position.set(s * 8.1, 3.2, z);
        const board = new THREE.Mesh(G.posterPlane, pick(netaMats));
        board.scale.setScalar(1.9); board.position.set(s * 7.95, 4.9, z); board.rotation.y = faceRoad(s);
        props.add(pole, board);
      }
      if (R() < 0.35) { for (let i = 0; i < 4; i++) tree(props, s * (10 + R() * 14), 2 + R() * 26, 2 + R() * 1.4, rg); }
      else {
        for (let i = 0; i < 2; i++) {
          const h = 5 + R() * 7, bz = 3 + R() * 24, bx = s * (13 + R() * 5);
          shape(props, G.unit, R() < 0.5 ? sm(rg.bldA) : sm(rg.bldB), bx, h / 2 - 0.1, bz, 4.2, h, 4.2);
          if (R() < 0.5) shape(props, G.tank, M2.tank, bx, h + 0.45, bz, 1, 1, 1);
        }
        tree(props, s * (10 + R() * 4), 3 + R() * 24, 2, rg);
      }
    } else if (k === 'rock') {
      for (let i = 0; i < 4; i++) boulder(props, s * (8.5 + R() * 10), 2 + R() * 26, 0.8 + R() * 2.2, rg.rock);
      mountain(props, s * (45 + R() * 25), 5 + R() * 20, 14 + R() * 8, 10 + R() * 8, 0x8f8878, null);
      shape(props, G.mesa, sm(0x9a8d78, true), s * (38 + R() * 20), 6, 8 + R() * 14, 16, 9 + R() * 6, 16);
      if (R() < 0.45) addShop(props, s, 5 + R() * 18, rg);
      for (let i = 0; i < 2; i++) tree(props, s * (10 + R() * 8), 2 + R() * 26, 1.8, rg);
    } else if (k === 'sand') {
      for (let i = 0; i < 2; i++) {
        const w = 6 + R() * 5;
        shape(props, G.sph, sm(rg.dune), s * (11 + R() * 18), 0, 3 + R() * 24, w, 1.6 + R() * 1.8, w);
      }
      for (let i = 0; i < 3; i++) acacia(props, s * (9 + R() * 14), 2 + R() * 26, rg);
      for (let i = 0; i < 4; i++) shape(props, G.sph, sm(0x9a9a5a), s * (8 + R() * 14), 0.2, 2 + R() * 26, 0.5, 0.35, 0.5);
      if (R() < 0.25) {                                   // kila / haveli
        const fx = s * (19 + R() * 8), fz = 6 + R() * 16;
        shape(props, G.unit, sm(0xd9a860), fx, 2.6, fz, 3, 5.2, 14);
        for (let i = 0; i < 7; i++) shape(props, G.unit, sm(0xd9a860), fx, 5.5, fz - 6 + i * 2, 3, 0.7, 1);
        shape(props, G.cyl, sm(0xd9a860), fx, 3.5, fz - 7.5, 1.6, 7, 1.6);
        shape(props, G.cyl, sm(0xd9a860), fx, 3.5, fz + 7.5, 1.6, 7, 1.6);
      }
      if (R() < 0.25) {                                   // hawa chakki (wind turbine)
        const wx = s * (22 + R() * 14), wz = 6 + R() * 18;
        shape(props, G.cyl, sm(0xf2f2f2), wx, 7, wz, 0.3, 14, 0.3);
        const hub = new THREE.Group(); hub.position.set(wx, 14, wz);
        for (let i = 0; i < 3; i++) {
          const bl = new THREE.Group(); bl.rotation.z = i * Math.PI * 2 / 3 + R();
          const m = new THREE.Mesh(G.unit, sm(0xf2f2f2)); m.scale.set(0.3, 6, 0.1); m.position.y = 3; bl.add(m); hub.add(bl);
        }
        props.add(hub);
      }
      if (R() < 0.3) addShop(props, s, 5 + R() * 18, rg);
    } else if (k === 'coast') {
      if (s === 1) {                                      // ek taraf samundar
        const sea = new THREE.Mesh(G.sea, sm(rg.sea)); sea.position.set(70, -0.02, LEN / 2); props.add(sea);
        for (let i = 0; i < 2; i++) {
          if (R() < 0.6) {
            const bx = 26 + R() * 26, bz = 4 + R() * 22, boat = new THREE.Group();
            const hull = new THREE.Mesh(G.unit, sm(0x9a6a3a)); hull.scale.set(3.4, 0.6, 1.3); hull.position.y = 0.3;
            const mast = new THREE.Mesh(G.cyl, M2.pole); mast.scale.set(0.06, 2.6, 0.06); mast.position.y = 1.6;
            const sail = new THREE.Mesh(G.sail, bm(pick([0xffffff, 0xf2c21e, 0xe8503a]))); sail.position.set(0, 1.8, 0.05);
            boat.add(hull, mast, sail); boat.position.set(bx, 0, bz); boat.rotation.y = R() * 0.6; props.add(boat);
          }
        }
        for (let i = 0; i < 3; i++) palm(props, 9 + R() * 4, 2 + R() * 26, 1.7, rg);
      } else {
        for (let i = 0; i < 5; i++) palm(props, -(8 + R() * 12), 2 + R() * 26, 1.5 + R() * 0.8, rg);
        if (R() < 0.6) addShop(props, s, 4 + R() * 6, rg);
        if (R() < 0.5) addShop(props, s, 16 + R() * 8, rg);
        if (R() < 0.4) house(props, s * (16 + R() * 4), 4 + R() * 22, 4, 3, 4, rg.bldA, 0xc0562a, 1, false);
      }
    } else if (k === 'jungle') {
      for (let i = 0; i < 6; i++) jungleTree(props, s * (8.5 + R() * 15), 1 + R() * 28, rg);
      for (let i = 0; i < 4; i++) shape(props, G.sph, sm(rg.leaf2), s * (6.2 + R() * 3), 0.3, 2 + R() * 26, 0.9, 0.6, 0.9);
      for (let i = 0; i < 2; i++) {                       // baans (bamboo) ke jhund
        const bx = s * (7.5 + R() * 6), bz = 2 + R() * 26;
        for (let j = 0; j < 5; j++) shape(props, G.cyl, sm(0x9ab04a), bx + (R() - 0.5) * 1.2, 3, bz + (R() - 0.5) * 1.2, 0.07, 6, 0.07);
      }
      mountain(props, s * (40 + R() * 25), 6 + R() * 18, 18 + R() * 8, 12 + R() * 8, 0x4f8f4a, null);
      if (R() < 0.3) house(props, s * (11 + R() * 3), 4 + R() * 22, 3.2, 2.2, 3.2, 0xc89a6a, 0x7a5a3a, 1, false);
    } else if (k === 'snow') {
      for (let i = 0; i < 7; i++) pine(props, s * (8 + R() * 15), 1 + R() * 28, 0.9 + R() * 0.9, rg);
      if (rg.snow) for (let i = 0; i < 3; i++) shape(props, G.sph, sm(0xf2f7fb), s * (8 + R() * 12), 0, 2 + R() * 26, 2 + R() * 2, 0.5 + R() * 0.5, 2 + R() * 2);
      mountain(props, s * (40 + R() * 25), 6 + R() * 18, 18 + R() * 10, 18 + R() * 12, rg.snow ? 0x8fa0b8 : 0x6f8f7a, rg.snow ? 0xffffff : 0xdfe8f0);
      if (R() < 0.4) house(props, s * (11 + R() * 4), 4 + R() * 22, 4, 2.6, 4, rg.bldA, rg.bldB, 1, rg.snow);
    } else if (k === 'mountain') {
      for (let i = 0; i < 4; i++) boulder(props, s * (8.5 + R() * 12), 2 + R() * 26, 0.8 + R() * 2.4, rg.rock);
      mountain(props, s * (30 + R() * 25), 5 + R() * 20, 20 + R() * 12, 16 + R() * 16, 0xb59a78, R() < 0.5 ? 0xf4f6f8 : null);
      mountain(props, s * (55 + R() * 20), 10 + R() * 18, 26 + R() * 10, 20 + R() * 14, 0x9a8468, 0xf4f6f8);
      if (R() < 0.25) {                                   // stupa (chorten)
        const sx = s * (8.8 + R() * 2), sz = 4 + R() * 22;
        shape(props, G.unit, sm(0xf4f0e8), sx, 0.3, sz, 2.0, 0.6, 2.0);
        shape(props, G.sph, sm(0xf4f0e8), sx, 1.2, sz, 0.9, 0.8, 0.9);
        shape(props, G.cone, sm(0xe8b830), sx, 2.4, sz, 0.28, 1.4, 0.28);
      }
      if (R() < 0.3) tree(props, s * (7.5 + R() * 4), 3 + R() * 24, 1.2, rg);
    }
  }

  function buildProps(ch, rg) {
    const props = ch.userData.props;
    clearGroup(props);
    ch.userData.fishZ = null; ch.userData.cried = false;
    const st = { fish: false };
    [-1, 1].forEach(s => { footpath(props, s, rg, ch, st); scenery(props, s, rg, ch); });
    if (R() < (rg.gantry != null ? rg.gantry : 0.6)) addGantry(props, 6 + R() * 18);        // neta / ad banner, sar ke upar
    if (rg.kind === 'mountain' && R() < 0.5) {                                                // Ladakh: prayer flags sar ke upar
      const g = new THREE.Group(); flagsString(g, 6.6, 1.3); g.position.z = 3 + R() * 24; props.add(g);
      [-1, 1].forEach(s => { const p = new THREE.Mesh(G.gPole, M2.pole); p.position.set(s * 7.5, 3.7, g.position.z); props.add(p); });
    }
    if (rg.kind === 'jungle' && R() < 0.35) {                                                 // jungle ki chhat (branches)
      [-1, 1].forEach(s => shape(props, G.sph, sm(rg.leaf), s * 4.6, 8.4, 4 + R() * 20, 3.2, 1.0, 4.2));
    }
  }

  function createChunk(i) {
    const ch = new THREE.Group();
    ch.position.z = i * LEN;
    const props = new THREE.Group(); ch.add(props);
    ch.userData = { props, baseZ: i * LEN, fishZ: null, cried: false };
    buildProps(ch, curRegion);
    scene.add(ch); chunks.push(ch);
  }

  /* ---------- aasmaan: sun + baadal ---------- */
  function createSky() {
    sunMesh = new THREE.Mesh(G.sun, M2.sun);
    sunMesh.position.set(-70, 60, 330);
    scene.add(sunMesh);
    cloudGroup = new THREE.Group();
    for (let i = 0; i < 9; i++) {
      const c = new THREE.Group();
      for (let j = 0; j < 4; j++) {
        const m = new THREE.Mesh(G.cloud, M2.cloud);
        m.scale.set(10 + R() * 8, 4 + R() * 3, 5);
        m.position.set(j * 9 - 14, R() * 2, R() * 3);
        c.add(m);
      }
      c.position.set(-260 + i * 65, 60 + R() * 35, 300 + R() * 80);
      cloudGroup.add(c);
    }
    scene.add(cloudGroup);
  }

  function createWeather() {
    const count = 700;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (R() - 0.5) * 24;
      arr[i * 3 + 1] = R() * 12 + 2;
      arr[i * 3 + 2] = R() * 180 - 30;
      weatherVel.push(0.28 + R() * 0.25);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    weather = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xaadfff, size: 0.06, transparent: true, opacity: 0.55, depthWrite: false }));
    weather.frustumCulled = false;
    scene.add(weather);
  }

  function createSpeedLines() {
    const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 2.3)]);
    const m = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12 });
    for (let i = 0; i < 44; i++) {
      const l = new THREE.Line(geo, m);
      l.position.set((R() - 0.5) * 14, 1 + R() * 4.8, R() * 190 - 20);
      l.userData.spd = 0.4 + R() * 0.65;
      scene.add(l); speedLines.push({ obj: l });
    }
    speedLines.mat = m;
  }

  /* ---------- level / ilaaka badalna ---------- */
  function setTheme(idx, instant) {
    const rg = regionFor(idx);
    if (instant || !curRegion) {
      curRegion = rg; pending = null;
      if (segments.length) {
        segments.forEach(sg => buildSegment(sg, rg));
        chunks.forEach(c => buildProps(c, rg));
      }
      applyRegionTheme(rg, true);
    } else if (rg !== curRegion) {
      curRegion = rg;
      pending = { region: rg, boundaryZ: null };
    }
  }

  const World = {
    voiceOn: false,

    init(sc) {
      scene = sc;
      scene.background = new THREE.Color(0x9fd0f0);
      scene.fog = new THREE.FogExp2(0x9fd0f0, 0.006);

      ambient = new THREE.AmbientLight(0xffffff, 0.55); scene.add(ambient);
      keyLight = new THREE.DirectionalLight(0xfff3d9, 0.9);
      keyLight.position.set(20, 35, -8);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      const sc2 = keyLight.shadow.camera;
      sc2.left = -14; sc2.right = 14; sc2.top = 14; sc2.bottom = -14; sc2.near = 1; sc2.far = 90;
      keyLight.target.position.set(0, 0, 4);
      scene.add(keyLight, keyLight.target);
      fillLight = new THREE.DirectionalLight(0xcfe4ff, 0.3);
      fillLight.position.set(-20, 22, 26); scene.add(fillLight);

      curRegion = regionFor(0); themeRegion = curRegion;
      createSky();
      createWeather();
      createSpeedLines();
      for (let i = 0; i < C.TRACK_SEGMENTS; i++) createTrackSegment(i);
      for (let i = 0; i < C.ENV_CHUNKS; i++) createChunk(i);
      applyRegionTheme(curRegion, true);
    },

    setTheme,

    // Settings badalne par (mausam / mode): abhi ke ilaake par turant laagu
    refresh() { if (themeRegion) applyRegionTheme(themeRegion, true); },

    reset() {
      segments.forEach((s, i) => s.position.z = i * LEN);
      chunks.forEach((c, i) => { c.position.z = i * LEN; });
      setTheme(0, true);
    },

    update(k, speed, playerX) {
      lerpTheme(k);
      const d = speed * k;

      segments.forEach(s => {
        s.position.z -= d;
        if (s.position.z < -LEN) {
          s.position.z += LEN * segments.length;
          buildSegment(s, curRegion);
          if (pending && pending.boundaryZ === null) pending.boundaryZ = s.position.z;
        }
      });
      chunks.forEach(c => {
        c.position.z -= d;
        if (c.position.z < -LEN) { c.position.z += LEN * chunks.length; buildProps(c, curRegion); }
      });
      if (pending && pending.boundaryZ !== null) {
        pending.boundaryZ -= d;
        if (pending.boundaryZ <= 4) { applyRegionTheme(pending.region, false); pending = null; }
      }

      cloudGroup.children.forEach(c => { c.position.x += 0.02 * k; if (c.position.x > 300) c.position.x = -300; });

      // Machhali wala jab paas se guzre to 'das ke chaar' ki awaaz
      if (World.voiceOn && speed > 0) {
        chunks.forEach(c => {
          const u = c.userData;
          if (u.fishZ !== null && !u.cried) {
            const wz = c.position.z + u.fishZ;
            if (wz < 16 && wz > 0) { u.cried = true; MR.Audio.vendorCry(); }
          }
        });
      }

      // Mausam (rain / dust / snow)
      const p = weather.geometry.attributes.position.array;
      const drift = weatherType === 'dust', snow = weatherType === 'snow';
      for (let i = 0; i < weatherVel.length; i++) {
        p[i * 3 + 1] -= weatherVel[i] * cur.pfall * k;
        p[i * 3 + 2] -= d * 1.4;
        if (drift) p[i * 3] += 0.03 * k;
        if (snow) p[i * 3] += Math.sin(p[i * 3 + 1] * 1.7 + i) * 0.012 * k;
        if (p[i * 3 + 1] < -0.2 || (drift && p[i * 3 + 1] < 0.2)) {
          p[i * 3 + 1] = 6 + R() * 8;
          p[i * 3] = (R() - 0.5) * 24 + playerX * 0.2;
        }
        if (p[i * 3 + 2] < -30) p[i * 3 + 2] = 180;
      }
      weather.geometry.attributes.position.needsUpdate = true;

      speedLines.mat.opacity = 0.05 + Math.min(0.18, speed * 0.18);
      speedLines.forEach(sl => {
        const l = sl.obj;
        l.position.z -= d * (1.5 + l.userData.spd);
        if (l.position.z < -20) {
          l.position.z = 180 + R() * 40;
          l.position.x = (R() - 0.5) * 14;
          l.position.y = 1 + R() * 4.9;
        }
      });
    }
  };

  MR.World = World;
})();
