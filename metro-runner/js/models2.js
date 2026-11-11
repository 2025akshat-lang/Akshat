/* ===== models2.js : Indian gaadiyaan (Gypsy, Thar, Truck, Bus, Camel), slum / beach / jungle ke obstacles,
   log (insaan), kela aur nariyal ke ped, kapde / kabadi wale ke stalls =====
   Obstacle models wahi 'type' use karte hain jo obstacles.js pehle se jaanta hai:
   jump_barrier (kudo) | roll_tunnel (neeche se niklo) | auto / train / cow (hard: lane badlo). */
(function () {
  const Mo = MR.Models, S = Mo.mat.std, geo = Mo.geo;
  const B = (w, h, d) => geo(`b${w},${h},${d}`, () => new THREE.BoxGeometry(w, h, d));
  const CY = (rt, rb, h, n) => geo(`c${rt},${rb},${h},${n}`, () => new THREE.CylinderGeometry(rt, rb, h, n));
  const SP = (r) => geo(`s${r}`, () => new THREE.SphereGeometry(r, 10, 8));
  const WH = (r, w) => geo(`w${r},${w}`, () => { const g = new THREE.CylinderGeometry(r, r, w, 14); g.rotateZ(Math.PI / 2); return g; });
  const R = Math.random;
  const pick = (a) => a[Math.floor(R() * a.length)];

  function m(g, mat, x, y, z, shadow) {
    const o = new THREE.Mesh(g, mat);
    o.position.set(x || 0, y || 0, z || 0);
    if (shadow) o.castShadow = true;
    return o;
  }
  const tire = () => S('tire', 0x505050, { roughness: 0.9 });
  const glass = () => S('vGlass', 0x9ab8d0, { roughness: 0.2 });
  const chrome = () => S('chrome', 0xc4cacf, { roughness: 0.3 });
  const lampMat = () => S('lampY', 0xfff6c8, { emissive: 0xffe9a0, emissiveIntensity: 0.6 });
  const wheel = (g, x, y, z, r) => g.add(m(WH(r, 0.22), tire(), x, y, z));
  const planeMat = (tex) => new THREE.MeshBasicMaterial({ map: tex });
  const plane = (w, h) => geo(`p${w}x${h}`, () => new THREE.PlaneGeometry(w, h));

  /* ---------- insaan (chhota, cartoon style) ---------- */
  const SKINS = [0xc98e60, 0xb87a4c, 0xd9a073, 0x9a6a44];
  const SHIRTS = [0xe8503a, 0x2f8fd6, 0xf2b01e, 0x3fae5a, 0xd6567a, 0x9b59b6, 0xf4ecd8];
  // pose: 'stand' | 'sit' (origin = baithne ki jagah, pair neeche latakte hain) | 'squat'
  function person(o) {
    o = o || {};
    const g = new THREE.Group();
    const skin = S('sk' + (o.skin || 0), o.skin || SKINS[0]);
    const shirt = S('sh' + (o.shirt || 0), o.shirt || pick(SHIRTS));
    const pants = S('pn' + (o.pants || 0), o.pants || 0x4a5a7a);
    const pose = o.pose || 'stand';
    if (pose === 'stand') {
      g.add(m(B(0.2, 0.75, 0.2), pants, -0.12, 0.375, 0, true), m(B(0.2, 0.75, 0.2), pants, 0.12, 0.375, 0));
      g.add(m(B(0.5, 0.7, 0.3), shirt, 0, 1.1, 0, true));
      g.add(m(SP(0.22), skin, 0, 1.62, 0, true));
      g.add(m(B(0.14, 0.6, 0.14), skin, -0.34, 1.1, 0), m(B(0.14, 0.6, 0.14), skin, 0.34, 1.1, 0));
    } else if (pose === 'sit') {
      g.add(m(B(0.2, 0.2, 0.55), pants, -0.12, 0.1, -0.27, true), m(B(0.2, 0.2, 0.55), pants, 0.12, 0.1, -0.27));
      g.add(m(B(0.19, 0.55, 0.19), pants, -0.12, -0.2, -0.52), m(B(0.19, 0.55, 0.19), pants, 0.12, -0.2, -0.52));
      g.add(m(B(0.5, 0.7, 0.3), shirt, 0, 0.5, 0.05, true));
      g.add(m(SP(0.22), skin, 0, 1.0, 0.05, true));
      g.add(m(B(0.14, 0.5, 0.14), skin, -0.34, 0.45, -0.1), m(B(0.14, 0.5, 0.14), skin, 0.34, 0.45, -0.1));
    } else {  // squat (kapde dhote hue)
      g.add(m(B(0.2, 0.4, 0.2), pants, -0.13, 0.25, -0.12), m(B(0.2, 0.4, 0.2), pants, 0.13, 0.25, -0.12));
      g.add(m(B(0.5, 0.6, 0.3), shirt, 0, 0.75, 0.05, true));
      g.add(m(SP(0.22), skin, 0, 1.2, 0, true));
      g.add(m(B(0.14, 0.14, 0.6), skin, -0.3, 0.7, -0.3), m(B(0.14, 0.14, 0.6), skin, 0.3, 0.7, -0.3));
    }
    if (o.headCol) {
      const top = pose === 'stand' ? 1.78 : pose === 'sit' ? 1.16 : 1.36;
      g.add(m(SP(0.24), S('hd' + o.headCol, o.headCol), 0, top - 0.04, 0));
    }
    if (o.coconut) {
      const y = pose === 'sit' ? 0.85 : 1.35;
      g.add(m(SP(0.15), S('coco', 0x5fa84a), 0.2, y, -0.28));
      g.add(m(CY(0.015, 0.015, 0.3, 5), S('straw', 0xe8503a), 0.2, y + 0.2, -0.28));
    }
    return g;
  }
  Mo.person = person;

  /* ---------- Gaadiyaan ---------- */
  function jeep(cfg) {
    const g = new THREE.Group(), w = cfg.w, len = 3.3;
    const body = S('jp' + cfg.color, cfg.color, { roughness: 0.45 });
    g.add(m(B(w, 0.7, len), body, 0, 0.75, 0, true));
    g.add(m(B(w - 0.1, 0.34, 1.1), body, 0, 1.2, -1.1));
    g.add(m(B(w - 0.5, 0.32, 0.06), chrome(), 0, 0.95, -1.68));
    [-0.55, 0.55].forEach(x => g.add(m(SP(0.17), lampMat(), x, 1.0, -1.66)));
    g.add(m(B(w - 0.1, 0.72, 1.55), S('jt' + cfg.top, cfg.top, { roughness: 0.7 }), 0, 1.45, 0.45, true));
    g.add(m(B(w - 0.25, 0.5, 0.05), glass(), 0, 1.5, -0.36));
    g.add(m(B(w + 0.06, 0.22, 0.22), S('jb' + cfg.bump, cfg.bump), 0, 0.55, -1.72));
    if (cfg.rack) g.add(m(B(w - 0.3, 0.08, 1.3), S('rack', 0x888888), 0, 1.86, 0.45));
    if (cfg.flare) [-1, 1].forEach(sx => [-1, 1].forEach(sz => g.add(m(B(0.14, 0.18, 0.95), S('flare', 0x777777), sx * (w / 2 + 0.04), 0.88, sz * 1.0))));
    [-1, 1].forEach(sx => [-1, 1].forEach(sz => wheel(g, sx * (w / 2), 0.42, sz * 1.0, 0.42)));
    g.add(m(WH(0.38, 0.2), tire(), 0, 1.0, 1.72));                         // peeche ka spare tyre
    g.userData = { type: 'auto', kind: 'hard', halfZ: len / 2, halfX: w / 2, rush: 0.12 };
    return g;
  }
  Mo.gypsy = () => jeep({ w: 1.7, color: 0xf2f0e6, top: 0xc8b98a, bump: 0x888888 });
  Mo.thar  = () => jeep({ w: 1.85, color: 0xc43a2a, top: 0xf2f2f2, bump: 0x666666, rack: true, flare: true });

  Mo.truck = function () {
    const g = new THREE.Group(), len = 7.4;
    const cabCol = pick([0x2f7fd6, 0xe8a020, 0x3fae5a]);
    g.add(m(B(2.0, 1.9, 1.9), S('cab' + cabCol, cabCol, { roughness: 0.5 }), 0, 1.55, -2.7, true));
    g.add(m(B(1.7, 0.7, 0.05), glass(), 0, 2.0, -3.66));
    g.add(m(B(1.6, 0.55, 0.06), chrome(), 0, 1.0, -3.66));
    [-0.65, 0.65].forEach(x => g.add(m(SP(0.17), lampMat(), x, 1.05, -3.7)));
    g.add(m(B(2.1, 0.25, 0.22), S('stripeY', 0xf2c21e), 0, 0.55, -3.7));
    g.add(m(B(2.2, 0.35, 5.0), S('truckBed', 0x8a5a30, { roughness: 0.8 }), 0, 0.95, 1.2));
    g.add(m(B(2.2, 1.4, 4.9), S('truckBox', 0xe8a020, { roughness: 0.6 }), 0, 1.95, 1.2, true));
    [[0xd6402a, -0.4], [0x3fae5a, 0.25], [0x2f7fd6, 0.9]].forEach(p => g.add(m(B(2.24, 0.22, 4.9), S('ts' + p[0], p[0]), 0, 1.95 + p[1] * 0.5, 1.2)));
    const sign = new THREE.Mesh(plane(1.9, 0.48), planeMat(MR.Tex.truckSign));
    sign.position.set(0, 2.85, -3.66); sign.rotation.y = Math.PI; g.add(sign);
    [-2.6, 0.6, 1.9].forEach(z => [-1, 1].forEach(sx => wheel(g, sx * 1.0, 0.5, z, 0.5)));
    g.userData = { type: 'train', kind: 'hard', halfZ: len / 2, halfX: 1.15, rush: 0.1 };
    return g;
  };

  Mo.bus = function () {
    const g = new THREE.Group(), len = 7.6;
    g.add(m(B(2.3, 2.2, len), S('busRed', 0xd6402a, { roughness: 0.5 }), 0, 1.55, 0, true));
    g.add(m(B(2.32, 0.5, len), S('busStripe', 0xf4f0e6), 0, 0.75, 0));
    g.add(m(B(2.34, 0.7, len - 0.9), glass(), 0, 2.0, 0));
    g.add(m(B(2.1, 1.0, 0.05), glass(), 0, 1.95, -len / 2 - 0.01));
    [-0.8, 0.8].forEach(x => g.add(m(SP(0.17), lampMat(), x, 0.8, -len / 2 - 0.02)));
    g.add(m(B(1.9, 0.3, 3.6), S('luggage', 0xa08060), 0, 2.8, 0.4));
    [-1, 1].forEach(sx => [-2.4, 2.4].forEach(z => wheel(g, sx * 1.05, 0.5, z, 0.5)));
    const sign = new THREE.Mesh(plane(1.9, 0.48), planeMat(MR.Tex.busSign));
    sign.position.set(0, 2.68, -len / 2 - 0.02); sign.rotation.y = Math.PI; g.add(sign);
    g.userData = { type: 'train', kind: 'hard', halfZ: len / 2, halfX: 1.2, rush: 0.1 };
    return g;
  };

  Mo.camel = function () {
    const g = new THREE.Group();
    const tan = S('camel', 0xc9a064, { roughness: 0.9 }), dark = S('camelD', 0xa8834a, { roughness: 0.9 });
    g.add(m(B(0.8, 0.85, 1.9), tan, 0, 1.55, 0, true));
    const hump = m(SP(0.45), tan, 0, 2.1, 0.15); hump.scale.set(1, 0.9, 1.1); g.add(hump);
    const neck = m(B(0.28, 0.28, 1.1), tan, 0, 2.15, -1.1); neck.rotation.x = 0.85; g.add(neck);
    const head = m(B(0.3, 0.28, 0.55), tan, 0, 2.75, -1.55); head.rotation.x = -0.15; g.add(head);
    g.add(m(B(0.2, 0.18, 0.2), dark, 0, 2.7, -1.82));
    [-0.1, 0.1].forEach(x => g.add(m(B(0.06, 0.16, 0.06), dark, x, 2.95, -1.4)));
    [[-0.28, -0.7], [0.28, -0.7], [-0.28, 0.7], [0.28, 0.7]].forEach(p => g.add(m(B(0.14, 1.15, 0.14), dark, p[0], 0.58, p[1])));
    const tail = m(B(0.05, 0.5, 0.05), dark, 0, 1.4, 1.0); g.add(tail);
    g.add(m(B(0.9, 0.08, 1.0), S('camelBlanket', 0xd6402a), 0, 1.99, 0.15));
    g.add(m(B(0.92, 0.09, 0.18), S('camelStripe', 0xf2c21e), 0, 2.0, 0.15));
    g.userData = { type: 'cow', kind: 'hard', halfZ: 1.1, halfX: 0.7, tail };
    return g;
  };

  /* ---------- Slum ke obstacles ---------- */
  Mo.drain = function () {          // gandi nali: kud ke paar karo
    const g = new THREE.Group();
    const concrete = S('conc', 0x9a9488, { roughness: 0.9 });
    g.add(m(B(2.5, 0.28, 0.28), concrete, 0, 0.14, -0.62), m(B(2.5, 0.28, 0.28), concrete, 0, 0.14, 0.62));
    g.add(m(B(2.5, 0.05, 1.0), S('sludge', 0x56603a, { roughness: 0.3 }), 0, 0.08, 0));
    [[0.5, 0xe8e8e0], [-0.6, 0x3f8fd6], [0.1, 0xf2c21e], [-0.2, 0x6a5238], [0.8, 0x6a5238]].forEach(p => {
      const it = m(B(0.28, 0.07, 0.22), S('gb' + p[1], p[1]), p[0], 0.13, (R() - 0.5) * 0.6);
      it.rotation.y = R() * 3; g.add(it);
    });
    for (let i = 0; i < 5; i++) g.add(m(SP(0.09), S('bubble', 0x7a8a50), (R() - 0.5) * 2.0, 0.12, (R() - 0.5) * 0.7));
    g.userData = { type: 'jump_barrier', kind: 'soft', halfZ: 0.8, halfX: 1.2, height: 0.5 };
    return g;
  };

  Mo.washer = function () {         // kapde dhote log: upar se kudo
    const g = new THREE.Group();
    g.add(m(CY(0.62, 0.52, 0.4, 14), S('tubBlue', 0x3f8fd6), 0, 0.2, 0, true));
    g.add(m(CY(0.56, 0.56, 0.02, 14), S('foam', 0xe4eef4), 0, 0.4, 0));
    [0xe8503a, 0xf2c21e, 0x3fae5a, 0xf4ecd8].forEach((c, i) => g.add(m(SP(0.17), S('wc' + c, c), 0.95 + (i % 2) * 0.22, 0.17, -0.2 + i * 0.2)));
    g.add(m(CY(0.16, 0.13, 0.3, 8), S('bucket', 0xd6402a), -0.95, 0.15, 0.1));
    const p = person({ pose: 'squat', shirt: pick(SHIRTS), headCol: 0xe8503a });
    p.position.set(0, 0, 0.8); p.rotation.y = Math.PI; g.add(p);
    g.userData = { type: 'jump_barrier', kind: 'soft', halfZ: 0.9, halfX: 1.1, height: 0.8 };
    return g;
  };

  Mo.dog = function () {            // gandha kutta
    const g = new THREE.Group();
    const fur = S('dogFur', 0xa8926e, { roughness: 1 }), dirt = S('dogDirt', 0x6e5a3e, { roughness: 1 });
    g.add(m(B(0.5, 0.4, 0.95), fur, 0, 0.62, 0, true));
    g.add(m(B(0.34, 0.2, 0.4), dirt, 0.05, 0.84, 0.1));
    g.add(m(B(0.32, 0.3, 0.4), fur, 0, 0.8, -0.62));
    g.add(m(B(0.18, 0.15, 0.2), dirt, 0, 0.74, -0.9));
    [-0.12, 0.12].forEach(x => g.add(m(B(0.09, 0.2, 0.06), dirt, x, 1.0, -0.55)));
    [[-0.15, -0.3], [0.15, -0.3], [-0.15, 0.32], [0.15, 0.32]].forEach(p => g.add(m(B(0.1, 0.42, 0.1), fur, p[0], 0.21, p[1])));
    const tail = m(B(0.07, 0.07, 0.4), dirt, 0, 0.9, 0.62); tail.rotation.x = -0.6; g.add(tail);
    g.userData = { type: 'cow', kind: 'hard', halfZ: 0.6, halfX: 0.5, tail, rush: 0.2 };
    return g;
  };

  Mo.clothesline = function () {    // upar kapde sookh rahe hain: neeche se niklo (roll)
    const g = new THREE.Group();
    const bam = S('bamboo', 0xc8b060);
    [-1.2, 1.2].forEach(x => g.add(m(CY(0.05, 0.06, 3.2, 6), bam, x, 1.6, 0)));
    g.add(m(B(2.45, 0.03, 0.03), S('rope', 0xdddddd), 0, 2.95, 0));
    const cols = [0xe8503a, 0x2f8fd6, 0xf2b01e, 0x3fae5a, 0xd6567a, 0xf4ecd8, 0x9b59b6];
    for (let i = 0; i < 7; i++) {
      const h = 0.7 + R() * 0.6;
      g.add(m(B(0.32, h, 0.05), S('cl' + cols[i], cols[i]), -1.0 + i * 0.33, 2.95 - h / 2, 0));
    }
    g.userData = { type: 'roll_tunnel', kind: 'soft', halfZ: 0.5, halfX: 1.25 };
    return g;
  };

  /* ---------- Beach / jungle ke obstacles ---------- */
  Mo.sunbather = function (decor) { // dhoop sekte log: kud ke paar karo
    const g = new THREE.Group();
    const towel = pick([0xe8503a, 0x2f8fd6, 0xf2b01e, 0xd6567a]);
    g.add(m(B(2.1, 0.04, 0.95), S('towel' + towel, towel), 0, 0.03, 0));
    g.add(m(B(2.1, 0.045, 0.2), S('towelW', 0xffffff), 0, 0.035, 0.18));
    const skin = S('sk' + SKINS[0], SKINS[0]), sh = S('swim' + towel, 0x2f6fd6);
    g.add(m(B(0.72, 0.22, 0.42), skin, 0.1, 0.16, 0, true));
    g.add(m(B(0.4, 0.22, 0.43), sh, -0.3, 0.16, 0));
    g.add(m(B(0.5, 0.17, 0.3), skin, -0.78, 0.15, 0));
    g.add(m(SP(0.21), skin, 0.68, 0.2, 0, true));
    g.add(m(B(0.18, 0.06, 0.04), S('shades', 0x2a3a6a), 0.82, 0.24, 0));
    g.add(m(B(0.5, 0.1, 0.1), skin, 0.1, 0.34, -0.3));
    g.add(m(SP(0.15), S('coco', 0x5fa84a), 0.95, 0.15, -0.38));
    g.add(m(CY(0.015, 0.015, 0.3, 5), S('straw', 0xe8503a), 0.95, 0.35, -0.38));
    g.userData = decor ? {} : { type: 'jump_barrier', kind: 'soft', halfZ: 0.6, halfX: 1.1, height: 0.55 };
    return g;
  };

  Mo.sitters = function (style) {   // upar baithe log: neeche se niklo (roll)
    const g = new THREE.Group();
    const forest = style === 'forest';
    const post = S(forest ? 'bambooP' : 'woodP', forest ? 0xb4c85a : 0x8a5a30);
    const plank = S(forest ? 'bambooPl' : 'woodPl', forest ? 0xc8d878 : 0xb8864a);
    [[-1.15, -0.4], [1.15, -0.4], [-1.15, 0.4], [1.15, 0.4]].forEach(p => g.add(m(CY(0.07, 0.08, 3.4, 6), post, p[0], 1.7, p[1])));
    g.add(m(B(2.5, 0.16, 1.1), plank, 0, 2.05, 0, true));
    g.add(m(B(2.6, 0.1, 1.3), S(forest ? 'leafRoof' : 'thatch', forest ? 0x3f9a3a : 0xd8b060), 0, 3.4, 0));
    [-0.55, 0.55].forEach((x, i) => {
      const p = person({ pose: 'sit', shirt: pick(SHIRTS), coconut: !forest, headCol: forest ? 0x9a6a3a : null });
      p.position.set(x, 2.13, 0.1); g.add(p);
    });
    g.userData = { type: 'roll_tunnel', kind: 'soft', halfZ: 0.55, halfX: 1.3 };
    return g;
  };

  Mo.log = function () {            // giri hui lakdi (jungle): kud ke paar karo
    const g = new THREE.Group();
    const lg = m(CY(0.45, 0.45, 2.4, 10), S('logBark', 0x7a5230, { roughness: 1 }), 0, 0.45, 0, true);
    lg.rotation.z = Math.PI / 2; g.add(lg);
    [-1.2, 1.2].forEach(x => { const c = m(CY(0.38, 0.38, 0.04, 10), S('logCut', 0xd8b888), x, 0.45, 0); c.rotation.z = Math.PI / 2; g.add(c); });
    g.add(m(B(1.2, 0.08, 0.5), S('moss', 0x4f8a3a), -0.2, 0.9, 0));
    g.add(m(SP(0.12), S('mush', 0xe8503a), 0.6, 0.95, 0.1));
    g.userData = { type: 'jump_barrier', kind: 'soft', halfZ: 0.5, halfX: 1.3, height: 0.8 };
    return g;
  };

  /* ---------- Ped ---------- */
  Mo.bananaTree = function () {
    const g = new THREE.Group();
    g.add(m(CY(0.08, 0.13, 2.0, 8), S('bananaStem', 0x9bb44a), 0, 1.0, 0, true));
    for (let i = 0; i < 6; i++) {
      const piv = new THREE.Group(); piv.position.y = 2.0; piv.rotation.y = i * Math.PI / 3 + R() * 0.3;
      const leaf = m(B(0.55, 0.03, 2.1), S('bananaLeaf' + (i % 2), i % 2 ? 0x4fa84a : 0x6bbf4f), 0, 0, 1.0);
      leaf.rotation.x = 0.35 + R() * 0.2; piv.add(leaf); g.add(piv);
    }
    g.add(m(SP(0.13), S('bananaFlower', 0x8a2a5a), 0.18, 1.5, 0));
    for (let i = 0; i < 7; i++) {
      const b = m(SP(0.08), S('banana', 0xf2d21e), 0.18 + (R() - 0.5) * 0.22, 1.65 + (R() - 0.5) * 0.15, (R() - 0.5) * 0.22);
      b.scale.set(1, 1.9, 1); g.add(b);
    }
    return g;
  };

  Mo.coconutPalm = function (leafHex) {
    const g = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const seg = m(CY(0.1 - i * 0.008, 0.12 - i * 0.008, 1.2, 7), S('palmTrunk', 0x7a5a3a, { roughness: 1 }), i * 0.07, 0.6 + i * 1.17, 0, true);
      seg.rotation.z = -0.06; g.add(seg);
    }
    const crown = new THREE.Group(); crown.position.set(0.32, 5.8, 0);
    for (let i = 0; i < 8; i++) {
      const piv = new THREE.Group(); piv.rotation.y = i * Math.PI / 4;
      const leaf = m(B(0.28, 0.04, 2.2), S('palmLeaf' + leafHex + (i % 2), i % 2 ? leafHex : 0x3f9a3a), 0, 0, 1.1);
      leaf.rotation.x = 0.4 + (i % 2) * 0.15; piv.add(leaf); crown.add(piv);
    }
    [[0.14, 0], [-0.14, 0.1], [0, -0.15]].forEach(p => crown.add(m(SP(0.15), S('cocoNut', 0x6a8a3a), p[0], -0.15, p[1])));
    g.add(crown);
    return g;
  };

  /* ---------- Stalls: kapde wala (market) aur kabadi wala (basti) ---------- */
  Mo.stall = function (kind) {
    const g = new THREE.Group();
    const wood = S('thelaWood', 0xa8743a, { roughness: 0.8 });
    g.add(m(B(1.5, 0.12, 2.0), wood, 0, 0.75, 0, true));
    [-0.82, 0.82].forEach(x => g.add(m(WH(0.38, 0.1), S('thelaTyre', 0x707070, { roughness: 0.9 }), x, 0.38, 0.2)));
    g.add(m(B(1.2, 0.06, 0.06), wood, 0, 0.6, -1.4));
    if (kind === 'kapde') {
      [-0.85, 0.85].forEach(z => g.add(m(CY(0.04, 0.04, 1.6, 6), S('rackPole', 0x9a9a9a), 0, 1.55, z)));
      g.add(m(B(0.06, 0.06, 1.8), S('rackPole', 0x9a9a9a), 0, 2.35, 0));
      const cols = [0xe8503a, 0x2f8fd6, 0xf2b01e, 0x3fae5a, 0xd6567a, 0x9b59b6, 0xf4ecd8, 0xff8a00];
      for (let i = 0; i < 8; i++) {
        const h = 0.6 + R() * 0.45;
        g.add(m(B(0.3, h, 0.3), S('cl' + cols[i], cols[i]), 0, 2.35 - h / 2 - 0.04, -0.75 + i * 0.21));
      }
      [0, Math.PI / 2].forEach(r => {
        const s = new THREE.Mesh(plane(1.4, 0.7), planeMat(MR.Tex.kapdeSign));
        s.position.set(r ? 0.05 : 0, 2.95, r ? 0 : 1.05); s.rotation.y = r; g.add(s);
      });
      const v = person({ pose: 'stand', shirt: pick(SHIRTS), headCol: 0xf2f2f2 }); v.position.set(0, 0, -1.6); g.add(v);
      const c = person({ pose: 'stand', shirt: pick(SHIRTS) }); c.scale.setScalar(0.6); c.position.set(0.85, 0, -1.4); g.add(c);
    } else {  // kabadi
      [[0xc8b070, -0.4, -0.3], [0xb89c5a, 0.3, -0.3], [0xc8b070, 0, 0.5]].forEach(p => g.add(m(B(0.65, 0.7, 0.6), S('sack' + p[0], p[0], { roughness: 1 }), p[1], 1.15, p[2], true)));
      g.add(m(B(0.5, 0.35, 0.4), S('paper', 0xe8e4d4), 0.4, 1.0, 0.7));
      [0x3f8fd6, 0x3fae5a, 0xf2f2f2].forEach((c, i) => g.add(m(CY(0.07, 0.07, 0.35, 8), S('btl' + c, c), -0.45 + i * 0.2, 1.0, 0.7)));
      g.add(m(B(0.5, 0.08, 0.06), S('scrapMetal', 0x8a7a68), -0.1, 1.55, 0.2));
      const s = new THREE.Mesh(plane(1.4, 0.7), planeMat(MR.Tex.kabadiSign));
      s.position.set(0, 2.2, 1.05); g.add(s);
      const s2 = new THREE.Mesh(plane(1.4, 0.7), planeMat(MR.Tex.kabadiSign));
      s2.position.set(0.05, 2.2, 0); s2.rotation.y = Math.PI / 2; g.add(s2);
      const v = person({ pose: 'stand', shirt: 0x9a9a8a, headCol: 0xf2f2f2 }); v.position.set(0, 0, -1.6); g.add(v);
    }
    return g;
  };

  Mo.umbrella = function () {       // beach umbrella
    const g = new THREE.Group();
    g.add(m(CY(0.03, 0.03, 2.2, 6), S('umbPole2', 0xdddddd), 0, 1.1, 0));
    const c = pick([0xe8503a, 0x2f8fd6, 0xf2b01e, 0xd6567a]);
    g.add(m(geo('umbCone', () => new THREE.ConeGeometry(1.2, 0.5, 8)), S('umbC' + c, c, { side: THREE.DoubleSide }), 0, 2.3, 0));
    return g;
  };
})();
