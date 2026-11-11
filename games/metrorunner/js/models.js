/* ===== models.js : saare REAL 3D models (emoji sprites hata diye gaye hain) =====
   Geometry aur materials cache hote hain taaki memory leak na ho. */
(function () {
  const geoCache = {}, matCache = {};

  function geo(key, make) { return geoCache[key] || (geoCache[key] = make()); }
  function mat(key, make) { return matCache[key] || (matCache[key] = make()); }

  const box = (w, h, d) => geo(`b${w},${h},${d}`, () => new THREE.BoxGeometry(w, h, d));
  const cyl = (rt, rb, h, s) => geo(`c${rt},${rb},${h},${s}`, () => new THREE.CylinderGeometry(rt, rb, h, s));
  const wheelGeo = (r, w) => geo(`w${r},${w}`, () => { const g = new THREE.CylinderGeometry(r, r, w, 14); g.rotateZ(Math.PI / 2); return g; });

  const std = (color, extra) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.55 }, extra || {}));
  const M = {
    std: (key, color, extra) => mat(key, () => std(color, extra)),
    basic: (key, color) => mat(key, () => new THREE.MeshBasicMaterial({ color }))
  };

  function mesh(g, m, x, y, z, shadow) {
    const o = new THREE.Mesh(g, m);
    o.position.set(x || 0, y || 0, z || 0);
    if (shadow) o.castShadow = true;
    return o;
  }

  function wheel(x, y, z, r) {
    return mesh(wheelGeo(r, 0.16), M.std('tire', 0x505050, { roughness: 0.9 }), x, y, z);
  }

  /* ---------- Obstacles ---------- */
  const Models = {};
  Models.geo = geo; Models.mat = M;

  Models.jumpBarrier = function () {
    const g = new THREE.Group();
    g.add(mesh(box(2.1, 0.7, 0.35), M.std('barOrange', 0xff8a00, { emissive: 0x7a3000, emissiveIntensity: 0.7, roughness: 0.25 }), 0, 0.35, 0, true));
    g.add(mesh(box(2.1, 0.12, 0.38), M.std('barWhite', 0xffffff, { emissive: 0x555555, emissiveIntensity: 0.3 }), 0, 0.45, 0));
    g.add(mesh(box(0.1, 0.35, 0.1), M.std('gray', 0x666666), -0.95, 0.9, 0));
    g.add(mesh(box(0.1, 0.35, 0.1), M.std('gray', 0x666666), 0.95, 0.9, 0));
    const sign = new THREE.Mesh(geo('p.8', () => new THREE.PlaneGeometry(0.8, 0.8)), new THREE.MeshBasicMaterial({ map: MR.Tex.up }));
    sign.position.set(0, 0.95, -0.2); sign.rotation.y = Math.PI;
    g.add(sign);
    g.userData = { type: 'jump_barrier', kind: 'soft', halfZ: 0.45, halfX: 0.95, height: 0.7 };
    return g;
  };

  Models.rollTunnel = function () {
    const g = new THREE.Group();
    g.add(mesh(box(2.2, 1.45, 0.42), M.std('purple', 0xa855f7, { emissive: 0x41115f, emissiveIntensity: 0.58 }), 0, 2.15, 0, true));
    g.add(mesh(box(0.2, 1.4, 0.3), M.std('darkgray', 0x464646, { roughness: 0.6 }), -0.95, 0.7, 0));
    g.add(mesh(box(0.2, 1.4, 0.3), M.std('darkgray', 0x464646, { roughness: 0.6 }), 0.95, 0.7, 0));
    const sign = new THREE.Mesh(geo('p.9', () => new THREE.PlaneGeometry(0.9, 0.9)), new THREE.MeshBasicMaterial({ map: MR.Tex.down }));
    sign.position.set(0, 2.15, -0.23); sign.rotation.y = Math.PI;
    g.add(sign);
    g.userData = { type: 'roll_tunnel', kind: 'soft', halfZ: 0.5, halfX: 1.0 };
    return g;
  };

  Models.sideBlockade = function () {
    const g = new THREE.Group();
    g.add(mesh(box(2.2, 2.35, 0.42), M.std('red', 0xef4444, { emissive: 0x5a0f1e, emissiveIntensity: 0.58, roughness: 0.35 }), 0, 1.18, 0, true));
    g.add(mesh(box(2.3, 0.15, 0.5), M.std('white2', 0xf5f5f5), 0, 2.4, 0));
    const sign = new THREE.Mesh(geo('p1.2', () => new THREE.PlaneGeometry(1.2, 0.8)), new THREE.MeshBasicMaterial({ map: MR.Tex.side }));
    sign.position.set(0, 1.42, -0.23); sign.rotation.y = Math.PI;
    g.add(sign);
    g.userData = { type: 'full_block', kind: 'hard', halfZ: 0.5, halfX: 1.0 };
    return g;
  };

  Models.spinner = function () {
    const g = new THREE.Group();
    g.add(mesh(cyl(0.11, 0.12, 2.4, 10), M.std('pole', 0x969696), 0, 1.2, 0));
    const arm = new THREE.Group();
    const armMat = M.std('green', 0x00b36b, { emissive: 0x063b25, emissiveIntensity: 0.5 });
    arm.add(mesh(box(2.0, 0.17, 0.2), armMat, 0, 0, 0));
    arm.add(mesh(box(0.25, 0.25, 0.25), M.std('gold', 0xffd166, { emissive: 0x553300 }), 0, 0, 0));
    arm.position.y = 1.02;
    g.add(arm);
    g.userData = { type: 'spinner', kind: 'soft', arm, rotSpeed: 0.10 + Math.random() * 0.05, halfZ: 0.5, halfX: 1.0 };
    return g;
  };

  // Asli 3D auto-rickshaw (front = -Z, kyunki wo player ki taraf aata hai)
  Models.autoRickshaw = function () {
    const g = new THREE.Group();
    const yellow = M.std('autoYellow', 0xf7c600, { roughness: 0.4 });
    const green = M.std('autoGreen', 0x1c8f3a, { roughness: 0.45 });
    const black = M.std('autoBlack', 0x5a5a5a, { roughness: 0.6 });
    g.add(mesh(box(1.3, 0.5, 2.0), green, 0, 0.55, 0.1, true));            // niche ka body
    g.add(mesh(box(1.3, 0.25, 1.3), yellow, 0, 0.92, 0.35));               // seat/side
    g.add(mesh(box(1.4, 0.08, 1.7), black, 0, 1.78, 0.2, true));           // chhat
    g.add(mesh(box(1.34, 0.12, 0.6), yellow, 0, 1.68, -0.5));              // chhat ka aage ka hissa
    [[-0.62, -0.5], [0.62, -0.5], [-0.62, 0.9], [0.62, 0.9]].forEach(p =>
      g.add(mesh(box(0.07, 0.9, 0.07), black, p[0], 1.3, p[1])));           // pillars
    g.add(mesh(box(1.1, 0.7, 0.05), M.std('glass', 0x6fb7ff, { transparent: true, opacity: 0.45, roughness: 0.1 }), 0, 1.25, -0.72)); // windshield
    g.add(mesh(box(0.34, 0.34, 0.3), green, 0, 0.5, -1.05));               // front mudguard
    g.add(mesh(new THREE.SphereGeometry(0.1, 8, 8), M.basic('headlight', 0xffffcc), 0, 0.85, -1.2));
    g.add(wheel(0, 0.26, -0.95, 0.26));
    g.add(wheel(-0.7, 0.26, 0.85, 0.26));
    g.add(wheel(0.7, 0.26, 0.85, 0.26));
    g.userData = { type: 'auto', kind: 'hard', halfZ: 1.1, halfX: 0.85, rush: 0.12 };
    return g;
  };

  // Metro train (2 dabbe)
  Models.train = function () {
    const g = new THREE.Group();
    const white = M.std('trainWhite', 0xeeeeee, { roughness: 0.3, metalness: 0.2 });
    const blue = M.std('trainBlue', 0x1e6fe0, { emissive: 0x0a2a66, emissiveIntensity: 0.4 });
    const dark = M.std('trainGlass', 0x607a92, { roughness: 0.1 });
    const len = 6.2;
    g.add(mesh(box(2.3, 2.5, len), white, 0, 1.55, 0, true));
    g.add(mesh(box(2.34, 0.4, len + 0.02), blue, 0, 0.9, 0));
    g.add(mesh(box(2.0, 0.15, len - 0.3), M.std('trainRoof', 0x888888), 0, 2.88, 0));
    // khidkiyan
    for (let i = -2; i <= 2; i++) {
      g.add(mesh(box(2.36, 0.7, 0.8), dark, 0, 1.9, i * 1.1));
    }
    // aage ka windshield + lights (player ki taraf = -Z)
    g.add(mesh(box(1.7, 0.9, 0.06), dark, 0, 2.0, -len / 2 - 0.02));
    g.add(mesh(box(0.35, 0.2, 0.08), M.basic('trainLight', 0xfff4c2), -0.8, 0.9, -len / 2 - 0.03));
    g.add(mesh(box(0.35, 0.2, 0.08), M.basic('trainLight', 0xfff4c2), 0.8, 0.9, -len / 2 - 0.03));
    g.add(mesh(box(0.5, 0.18, 0.08), M.basic('trainRed', 0xff3b3b), 0, 2.65, -len / 2 - 0.03));
    // bogies
    [-2.2, 2.2].forEach(z => {
      g.add(mesh(box(2.0, 0.3, 1.2), M.std('bogie', 0x626262), 0, 0.2, z));
      g.add(wheel(-0.9, 0.18, z - 0.35, 0.18)); g.add(wheel(0.9, 0.18, z - 0.35, 0.18));
      g.add(wheel(-0.9, 0.18, z + 0.35, 0.18)); g.add(wheel(0.9, 0.18, z + 0.35, 0.18));
    });
    g.userData = { type: 'train', kind: 'hard', halfZ: len / 2 + 0.2, halfX: 1.15, rush: 0.15 };
    return g;
  };

  // Awara gaay :)
  Models.cow = function () {
    const g = new THREE.Group();
    const white = M.std('cowWhite', 0xf2ece0, { roughness: 0.8 });
    const brown = M.std('cowBrown', 0x7a4a26, { roughness: 0.8 });
    g.add(mesh(box(0.9, 0.8, 1.6), white, 0, 1.0, 0, true));
    g.add(mesh(box(0.5, 0.4, 0.5), brown, 0.2, 1.1, 0.2));                 // dhabba
    g.add(mesh(box(0.55, 0.55, 0.6), white, 0, 1.3, -1.0));                // sir
    g.add(mesh(box(0.4, 0.25, 0.25), M.std('cowNose', 0xe7b9a7), 0, 1.15, -1.35));
    g.add(mesh(box(0.1, 0.25, 0.1), M.std('horn', 0xeeeeee), -0.28, 1.65, -1.0));
    g.add(mesh(box(0.1, 0.25, 0.1), M.std('horn', 0xeeeeee), 0.28, 1.65, -1.0));
    [[-0.3, -0.6], [0.3, -0.6], [-0.3, 0.6], [0.3, 0.6]].forEach(p =>
      g.add(mesh(box(0.16, 0.7, 0.16), white, p[0], 0.35, p[1])));
    const tail = mesh(box(0.06, 0.6, 0.06), brown, 0, 0.9, 0.85); g.add(tail);
    g.userData = { type: 'cow', kind: 'hard', halfZ: 1.0, halfX: 0.75, tail };
    return g;
  };

  /* ---------- Player (chhota humanoid, haath-pair hilte hain) ---------- */
  Models.player = function () {
    const body = new THREE.Group();
    const shirt = M.std('shirt', 0x00c2ff, { roughness: 0.3, metalness: 0.3, emissive: 0x004355, emissiveIntensity: 0.35 });
    const skin = M.std('skin', 0xffd6b1);
    const pants = M.std('pants', 0x24324a);
    const shoe = M.std('shoe', 0xffffff);

    const torso = mesh(box(0.74, 0.8, 0.45), shirt, 0, 1.15, 0, true);
    body.add(torso);
    const head = mesh(new THREE.SphereGeometry(0.3, 16, 16), skin, 0, 1.82, 0, true);
    body.add(head);
    const cap = mesh(new THREE.ConeGeometry(0.36, 0.28, 16), M.std('cap', 0xff8a00, { roughness: 0.25 }), 0, 2.12, 0.02);
    cap.rotation.x = -0.2; body.add(cap);

    function limb(x, y, w, h, m) {
      const piv = new THREE.Group(); piv.position.set(x, y, 0);
      piv.add(mesh(box(w, h, w), m, 0, -h / 2, 0, true));
      body.add(piv); return piv;
    }
    const armL = limb(-0.5, 1.5, 0.2, 0.7, skin);
    const armR = limb(0.5, 1.5, 0.2, 0.7, skin);
    const legL = limb(-0.2, 0.75, 0.26, 0.75, pants);
    const legR = limb(0.2, 0.75, 0.26, 0.75, pants);
    legL.add(mesh(box(0.28, 0.12, 0.38), shoe, 0, -0.72, -0.06));
    legR.add(mesh(box(0.28, 0.12, 0.38), shoe, 0, -0.72, -0.06));

    body.userData = { armL, armR, legL, legR, torso };
    return body;
  };

  Models.policeJeep = function () {
    const g = new THREE.Group();
    const white = M.std('jeepWhite', 0xffffff, { roughness: 0.3 });
    const glass = M.std('jeepGlass', 0x56626e, { roughness: 0.1 });
    g.add(mesh(box(1.6, 0.7, 2.6), white, 0, 0.55, 0, true));
    g.add(mesh(box(1.3, 0.6, 1.4), white, 0, 1.2, 0.1));
    g.add(mesh(box(1.1, 0.4, 0.1), glass, 0, 1.2, -0.62));
    g.add(mesh(box(1.35, 0.4, 1.2), glass, 0, 1.2, 0.1));
    g.add(mesh(box(1.65, 0.2, 0.2), M.std('bumper', 0x666666, { roughness: 0.8 }), 0, 0.3, -1.3));
    g.add(mesh(box(1.62, 0.12, 2.0), M.std('jeepBlue', 0x1e3a8a), 0, 0.5, 0.1));
    g.add(mesh(box(0.3, 0.15, 0.1), M.basic('tail', 0xff0000), -0.6, 0.6, -1.32));
    g.add(mesh(box(0.3, 0.15, 0.1), M.basic('tail', 0xff0000), 0.6, 0.6, -1.32));
    [[-0.8, 0.8], [0.8, 0.8], [-0.8, -0.8], [0.8, -0.8]].forEach(p => g.add(wheel(p[0], 0.28, p[1], 0.28)));
    const bar = new THREE.Mesh(box(0.8, 0.15, 0.25),
      new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2.5 }));
    bar.position.set(0, 1.58, 0.1); g.add(bar);
    g.userData = { lightBar: bar };
    return g;
  };

  /* ---------- Collectibles ---------- */
  Models.coin = function () {
    const c = new THREE.Group();
    const disc = new THREE.Mesh(geo('coinDisc', () => new THREE.CylinderGeometry(0.34, 0.34, 0.075, 18)),
      M.std('coinA', 0xffd34d, { metalness: 0.9, roughness: 0.2, emissive: 0xa15a00, emissiveIntensity: 0.4 }));
    disc.rotation.x = Math.PI / 2; c.add(disc);
    const rim = new THREE.Mesh(geo('coinRim', () => new THREE.TorusGeometry(0.3, 0.03, 8, 18)),
      M.std('coinB', 0xeab308, { metalness: 0.92, roughness: 0.25, emissive: 0x663f00, emissiveIntensity: 0.25 }));
    c.add(rim);
    return c;
  };

  Models.powerup = function (kind) {
    const cfg = MR.CONFIG.POWERUPS[kind];
    const g = new THREE.Group();
    const m = M.std('pu_' + kind, cfg.color, { emissive: cfg.color, emissiveIntensity: 0.7, metalness: 0.3, roughness: 0.25 });
    let core;
    if (kind === 'shield') core = new THREE.Mesh(geo('puShield', () => new THREE.OctahedronGeometry(0.42)), m);
    else if (kind === 'magnet') {
      core = new THREE.Mesh(geo('puMagnet', () => new THREE.TorusGeometry(0.3, 0.11, 10, 18, Math.PI)), m);
      core.rotation.z = 0;
    } else core = new THREE.Mesh(geo('puDouble', () => new THREE.DodecahedronGeometry(0.4)), m);
    g.add(core);
    const ring = new THREE.Mesh(geo('puRing', () => new THREE.TorusGeometry(0.62, 0.025, 6, 28)),
      M.basic('pu_ring_' + kind, cfg.color));
    ring.rotation.x = Math.PI / 2; g.add(ring);
    if (kind === 'double') {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: MR.Tex.x2, transparent: true, depthTest: false }));
      s.scale.set(0.9, 0.45, 1); s.position.y = 0.95; g.add(s);
    }
    g.userData = { kind, core, ring };
    return g;
  };


  /* ---------- Roadside thela / machhali wala (footpath par) ----------
     kind: 'fruit' | 'chai' | 'sabzi' | 'fish' ; front = road ki taraf (+X ya -X, world.js rotate karta hai) */
  Models.thela = function (kind) {
    const g = new THREE.Group();
    const wood = M.std('thelaWood', 0xa8743a, { roughness: 0.8 });
    const tyre = M.std('thelaTyre', 0x707070, { roughness: 0.9 });
    // cart ka platform + 2 pahiye
    g.add(mesh(box(1.5, 0.12, 2.0), wood, 0, 0.75, 0, true));
    g.add(mesh(box(1.5, 0.28, 0.08), wood, 0, 0.9, 1.0));
    g.add(mesh(box(1.5, 0.28, 0.08), wood, 0, 0.9, -1.0));
    g.add(mesh(box(0.08, 0.28, 2.0), wood, -0.75, 0.9, 0));
    g.add(mesh(box(0.08, 0.28, 2.0), wood, 0.75, 0.9, 0));
    [-0.82, 0.82].forEach(x => g.add(mesh(wheelGeo(0.38, 0.1), tyre, x, 0.38, 0.2)));
    g.add(mesh(box(1.2, 0.06, 0.06), wood, 0, 0.6, -1.4));

    const umbCols = [0xe8503a, 0x2f8fd6, 0xf2b01e, 0x3fae5a];
    const umb = new THREE.Mesh(geo('umbrella', () => new THREE.ConeGeometry(1.35, 0.5, 10)),
      M.std('umb' + kind, kind === 'fish' ? 0x2f8fd6 : umbCols[Math.floor(Math.random() * 4)], { roughness: 0.6, side: THREE.DoubleSide }));
    umb.position.set(0, 2.55, 0); g.add(umb);
    g.add(mesh(cyl(0.03, 0.03, 1.7, 6), M.std('umbPole', 0x8a8a8a), 0, 1.65, 0.7));

    const goods = (n, colA, colB, r, spreadX, spreadZ, y) => {
      for (let i = 0; i < n; i++) {
        const m = mesh(geo('fruit' + r, () => new THREE.SphereGeometry(r, 8, 8)),
          M.std('good' + (i % 2 ? colA : colB), i % 2 ? colA : colB, { roughness: 0.6 }),
          (Math.random() - 0.5) * spreadX, y + Math.random() * 0.12, (Math.random() - 0.5) * spreadZ - 0.1);
        g.add(m);
      }
    };
    if (kind === 'fruit') goods(26, 0xf7d11e, 0xe8503a, 0.12, 1.2, 1.5, 0.92);
    else if (kind === 'sabzi') goods(26, 0x3fae5a, 0xe8503a, 0.11, 1.2, 1.5, 0.92);
    else if (kind === 'chai') {
      g.add(mesh(cyl(0.22, 0.26, 0.45, 10), M.std('kettle', 0xb8b8b8, { metalness: 0.7, roughness: 0.3 }), 0.25, 1.05, -0.2));
      g.add(mesh(cyl(0.16, 0.16, 0.3, 10), M.std('stove', 0xc0562a), -0.35, 0.98, -0.2));
      for (let i = 0; i < 4; i++) g.add(mesh(cyl(0.06, 0.05, 0.12, 8), M.std('glassCup', 0xf5f5f5), -0.5 + i * 0.28, 0.95, 0.5));
    } else if (kind === 'fish') {
      // tokri mein machhliyan (chhoti fish: body + tail)
      g.add(mesh(cyl(0.55, 0.45, 0.25, 12), M.std('tokri', 0xc9a45a, { roughness: 0.9 }), 0, 0.95, -0.1));
      const fishMat = M.std('fishSilver', 0xc8d6e0, { metalness: 0.5, roughness: 0.3 });
      const fishMat2 = M.std('fishPink', 0xf0b0a0, { metalness: 0.3, roughness: 0.4 });
      for (let i = 0; i < 7; i++) {
        const f = new THREE.Group();
        f.add(mesh(geo('fishBody', () => new THREE.SphereGeometry(0.14, 8, 6)), i % 2 ? fishMat : fishMat2, 0, 0, 0));
        f.children[0].scale.set(1.9, 0.7, 0.8);
        f.add(mesh(box(0.1, 0.12, 0.04), fishMat, 0.3, 0, 0));
        f.position.set((Math.random() - 0.5) * 0.7, 1.1 + Math.random() * 0.06, (Math.random() - 0.5) * 0.7 - 0.1);
        f.rotation.y = Math.random() * Math.PI;
        g.add(f);
      }
      const sign = new THREE.Mesh(geo('p1.4x.7', () => new THREE.PlaneGeometry(1.4, 0.7)),
        new THREE.MeshBasicMaterial({ map: MR.Tex.fishSign, side: THREE.DoubleSide }));
      sign.position.set(0, 1.5, 1.02); g.add(sign);
    }

    // thele wala (chhota insaan): kurta, sir, pagdi/gamcha, aur khada hua
    const vend = new THREE.Group();
    const kurtas = [0xe8e0c8, 0x6fa8dc, 0xd97b7b, 0x8bc98b];
    vend.add(mesh(box(0.42, 0.62, 0.3), M.std('kurta' + kind, kurtas[Math.floor(Math.random() * 4)]), 0, 1.0, 0, true));
    vend.add(mesh(box(0.3, 0.55, 0.22), M.std('lungi', 0x9c6bd0), 0, 0.45, 0));
    vend.add(mesh(new THREE.SphereGeometry(0.19, 10, 10), M.std('skinV', 0xc98e60), 0, 1.5, 0, true));
    vend.add(mesh(new THREE.SphereGeometry(0.2, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2), M.std('pagdi' + kind, kind === 'fish' ? 0xffffff : 0xf2a33a), 0, 1.55, 0));
    vend.position.set(0, 0, -1.55); g.add(vend);
    g.userData = { kind };
    return g;
  };

  /* ---------- Decor ---------- */
  Models.palm = function (leafMat) {
    const t = new THREE.Group();
    t.add(mesh(cyl(0.08, 0.12, 2.0, 7), M.std('trunk', 0x5c3b1e), 0, 1.0, 0));
    for (let i = 0; i < 5; i++) {
      const leaf = mesh(box(0.14, 0.04, 1.1), leafMat, 0, 2.05, 0);
      leaf.rotation.y = i * (Math.PI * 2 / 5); leaf.rotation.x = 0.5;
      leaf.position.x = Math.sin(leaf.rotation.y) * 0.4; leaf.position.z = Math.cos(leaf.rotation.y) * 0.4;
      t.add(leaf);
    }
    return t;
  };

  MR.Models = Models;
})();
