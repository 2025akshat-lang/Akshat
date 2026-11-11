/* ===== world.js : track, deewarein, building, mausam, roshni, theme badalna ===== */
(function () {
  const C = MR.CONFIG;
  const LEN = C.TRACK_LEN;

  let scene, ambient, keyLight, fillLight, sunMesh, cloudGroup;
  const segments = [], chunks = [], speedLines = [];
  let weather, weatherVel = [];
  let weatherType = 'rain';

  // Shared materials (theme ke saath color badalte hain). Koi deep black nahi - sab light/grey/faded.
  const mats = {
    ground: new THREE.MeshStandardMaterial({ color: 0x9bb36a, roughness: 0.95 }),   // khula maidan
    wall:   new THREE.MeshStandardMaterial({ color: 0xcfc5b2, roughness: 0.9 }),    // footpath
    bldA:   new THREE.MeshStandardMaterial({ color: 0xe8a0b4, roughness: 0.85 }),
    bldB:   new THREE.MeshStandardMaterial({ color: 0xf2d27a, roughness: 0.85 }),
    leaf:   new THREE.MeshStandardMaterial({ color: 0x3fae5a, roughness: 0.7 })
  };
  // 3 alag raaste: left = eenton ka paver path, beech = sadak (tarmac), right = kachchi mitti ka raasta
  const laneMats = [
    new THREE.MeshStandardMaterial({ color: 0xc8704a, roughness: 0.9 }),
    new THREE.MeshStandardMaterial({ color: 0x7d7d80, roughness: 0.85 }),
    new THREE.MeshStandardMaterial({ color: 0xb89468, roughness: 1.0 })
  ];
  const kerbMat = new THREE.MeshStandardMaterial({ color: 0xe6e0d2, roughness: 0.8 });
  const paverLineMat = new THREE.MeshStandardMaterial({ color: 0xa65a38, roughness: 0.9 });
  const dashMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f0, roughness: 0.7 });
  const dirtPatchMat = new THREE.MeshStandardMaterial({ color: 0x9c7a50, roughness: 1.0 });
  const awnings = [0xe8503a, 0x2f8fd6, 0xf2b01e, 0x3fae5a, 0xd6567a].map(c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.7 }));

  const G = {
    lane: new THREE.BoxGeometry(2.8, 0.4, LEN),
    kerb: new THREE.BoxGeometry(0.25, 0.14, LEN),
    foot: new THREE.BoxGeometry(3.2, 0.5, LEN),
    field: new THREE.BoxGeometry(80, 0.4, LEN),
    paverLine: new THREE.BoxGeometry(2.6, 0.02, 0.06),
    dash: new THREE.BoxGeometry(0.1, 0.02, 1.6),
    patch: new THREE.BoxGeometry(1, 0.02, 1),
    unit: new THREE.BoxGeometry(1, 1, 1),
    posterPlane: new THREE.PlaneGeometry(1.4, 2.0),
    adPlane: new THREE.PlaneGeometry(4.0, 2.0),
    signPlane: new THREE.PlaneGeometry(2.6, 0.95),
    pole: new THREE.CylinderGeometry(0.06, 0.08, 2.7, 8),
    tallPole: new THREE.CylinderGeometry(0.09, 0.12, 6.4, 8),
    glow: new THREE.SphereGeometry(0.12, 10, 10),
    trunk: new THREE.CylinderGeometry(0.08, 0.1, 0.8, 7),
    leaves: new THREE.SphereGeometry(0.42, 10, 10),
    tank: new THREE.CylinderGeometry(0.8, 0.8, 1.1, 12),
    sun: new THREE.SphereGeometry(16, 20, 16),
    cloud: new THREE.SphereGeometry(1, 10, 8)
  };
  const M2 = {
    pole: new THREE.MeshStandardMaterial({ color: 0x9a9a9a, roughness: 0.5 }),
    elecPole: new THREE.MeshStandardMaterial({ color: 0xa8a39a, roughness: 0.9 }),
    glow: new THREE.MeshBasicMaterial({ color: 0xffd37a }),
    trunk: new THREE.MeshStandardMaterial({ color: 0x8a5a30 }),
    frame: new THREE.MeshStandardMaterial({ color: 0x777777 }),           // pehle 0x222222 (kaala) tha
    sun: new THREE.MeshBasicMaterial({ color: 0xfff2b0, fog: false }),
    cloud: new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false, transparent: true, opacity: 0.92 }),
    tank: new THREE.MeshStandardMaterial({ color: 0x4a8fc8, roughness: 0.6 })
  };
  const posterMats = MR.Tex.posters.map(t => new THREE.MeshBasicMaterial({ map: t }));
  const netaMats = MR.Tex.netas.map(t => new THREE.MeshBasicMaterial({ map: t, side: THREE.DoubleSide }));
  const adMats = MR.Tex.ads.map(t => new THREE.MeshBasicMaterial({ map: t }));
  const signMats = MR.Tex.shopSigns.map(t => new THREE.MeshBasicMaterial({ map: t }));

  // Theme ka current (lerp hota hua) state
  const cur = {
    bg: new THREE.Color(), ground: new THREE.Color(), wall: new THREE.Color(),
    bldA: new THREE.Color(), bldB: new THREE.Color(), leaf: new THREE.Color(), sun: new THREE.Color(),
    amb: new THREE.Color(), key: new THREE.Color(), fill: new THREE.Color(), wcol: new THREE.Color(),
    fog: 0.006, ambI: 0.9, keyI: 1.2, fillI: 0.55, wop: 0.0, wsize: 0.06, wfall: 1
  };
  let target = null;
  const tmp = new THREE.Color();
  const faceRoad = (s) => (s < 0 ? Math.PI / 2 : -Math.PI / 2);   // s = side (-1 ya +1)

  function createTrackSegment(i) {
    const seg = new THREE.Group();
    const dummy = new THREE.Object3D();

    // Khula maidan (sadak ke dono taraf door tak)
    const field = new THREE.Mesh(G.field, mats.ground);
    field.position.set(0, -0.25, LEN / 2); field.receiveShadow = true; seg.add(field);

    // 3 raaste, har ek ka alag surface
    C.LANES.forEach((x, li) => {
      const lane = new THREE.Mesh(G.lane, laneMats[li]);
      lane.position.set(x, -0.2, LEN / 2); lane.receiveShadow = true; seg.add(lane);
    });
    // Raaston ke beech aur bahar ke kerb
    [-4.3, -1.4, 1.4, 4.3].forEach(x => {
      const k = new THREE.Mesh(G.kerb, kerbMat); k.position.set(x, 0.05, LEN / 2); seg.add(k);
    });
    // Dono taraf footpath
    [-1, 1].forEach(sd => {
      const f = new THREE.Mesh(G.foot, mats.wall);
      f.position.set(sd * 6.0, -0.15, LEN / 2); f.receiveShadow = true; seg.add(f);
    });

    // Paver (eent) raaste ki lines
    const nLines = Math.floor(LEN / 1.0);
    const pl = new THREE.InstancedMesh(G.paverLine, paverLineMat, nLines);
    for (let n = 0; n < nLines; n++) { dummy.position.set(C.LANES[0], 0.011, n + 0.5); dummy.updateMatrix(); pl.setMatrixAt(n, dummy.matrix); }
    pl.instanceMatrix.needsUpdate = true; seg.add(pl);

    // Sadak ki safed dashed lines
    const nDash = Math.floor(LEN / 3);
    const dl = new THREE.InstancedMesh(G.dash, dashMat, nDash * 2);
    let d = 0;
    [-0.7, 0.7].forEach(ox => {
      for (let n = 0; n < nDash; n++) { dummy.position.set(C.LANES[1] + ox, 0.011, n * 3 + 1.5); dummy.updateMatrix(); dl.setMatrixAt(d++, dummy.matrix); }
    });
    dl.instanceMatrix.needsUpdate = true; seg.add(dl);

    // Kachchi mitti ke dhabbe
    const nPatch = 14;
    const dp = new THREE.InstancedMesh(G.patch, dirtPatchMat, nPatch);
    for (let n = 0; n < nPatch; n++) {
      dummy.position.set(C.LANES[2] + (Math.random() - 0.5) * 2.0, 0.011, Math.random() * LEN);
      dummy.scale.set(0.3 + Math.random() * 0.7, 1, 0.4 + Math.random() * 1.1);
      dummy.updateMatrix(); dp.setMatrixAt(n, dummy.matrix);
    }
    dummy.scale.set(1, 1, 1);
    dp.instanceMatrix.needsUpdate = true; seg.add(dp);

    seg.position.z = i * LEN;
    scene.add(seg); segments.push(seg);
  }

  function createChunk(i) {
    const ch = new THREE.Group();
    ch.position.z = i * LEN;
    const props = new THREE.Group();
    ch.add(props);
    ch.userData = { props, baseZ: i * LEN, fishZ: null, cried: false };
    buildProps(ch);
    scene.add(ch); chunks.push(ch);
  }

  function addTree(props, x, z, scale) {
    const t = new THREE.Group();
    const trunk = new THREE.Mesh(G.trunk, M2.trunk); trunk.position.y = 0.4;
    const leaves = new THREE.Mesh(G.leaves, mats.leaf); leaves.position.y = 1.0;
    t.add(trunk, leaves);
    t.scale.setScalar(scale || 1);
    t.position.set(x, 0.1, z);
    props.add(t);
  }

  function addShop(props, s, z) {
    const body = new THREE.Mesh(G.unit, s < 0 ? mats.bldB : mats.bldA);
    body.scale.set(3.2, 3.0, 4.6); body.position.set(s * 9.8, 1.5, z);
    props.add(body);
    const sign = new THREE.Mesh(G.signPlane, signMats[Math.floor(Math.random() * signMats.length)]);
    sign.position.set(s * 8.17, 2.55, z); sign.rotation.y = faceRoad(s); props.add(sign);
    const awn = new THREE.Mesh(G.unit, awnings[Math.floor(Math.random() * awnings.length)]);
    awn.scale.set(0.9, 0.07, 4.0); awn.position.set(s * 7.75, 2.1, z); awn.rotation.z = s * 0.18; props.add(awn);
    // Neta ka poster dukaan ki deewar par chipka hua
    const pst = new THREE.Mesh(G.posterPlane, netaMats[Math.floor(Math.random() * netaMats.length)]);
    pst.scale.setScalar(0.62); pst.position.set(s * 8.17, 1.05, z + 1.5 - Math.random() * 3);
    pst.rotation.y = faceRoad(s); props.add(pst);
  }

  function buildProps(ch) {
    const props = ch.userData.props;
    while (props.children.length) props.remove(props.children[0]); // geometry/material shared hain -> dispose ki zaroorat nahi
    ch.userData.fishZ = null; ch.userData.cried = false;
    const R = Math.random;
    let fishPlaced = false;

    [-1, 1].forEach(s => {
      // ---- Footpath: thele wale, machhali wala, lamp, bijli ka khamba, ped ----
      for (let z = 2 + R() * 3; z < 28; z += 6 + R() * 4) {
        const r = R();
        if (r < 0.5) {
          let kind = ['fruit', 'chai', 'sabzi'][Math.floor(R() * 3)];
          if (!fishPlaced && R() < 0.35) { kind = 'fish'; fishPlaced = true; }
          const t = MR.Models.thela(kind);
          t.position.set(s * 5.9, 0.1, z); t.rotation.y = faceRoad(s);
          props.add(t);
          if (kind === 'fish') ch.userData.fishZ = z;
        } else if (r < 0.68) {
          const lamp = new THREE.Group();
          const pole = new THREE.Mesh(G.pole, M2.pole); pole.position.y = 1.35;
          const glow = new THREE.Mesh(G.glow, M2.glow); glow.position.y = 2.72;
          lamp.add(pole, glow); lamp.position.set(s * 4.8, 0.1, z); props.add(lamp);
        } else if (r < 0.82) {
          const ep = new THREE.Mesh(G.tallPole, M2.elecPole); ep.position.set(s * 4.8, 3.3, z);
          const bar = new THREE.Mesh(G.unit, M2.elecPole); bar.scale.set(0.1, 0.1, 1.6); bar.position.set(s * 4.8, 6.1, z);
          props.add(ep, bar);
        } else {
          addTree(props, s * 6.8, z, 1.5);
        }
      }

      // ---- Politician ke bade hoarding (khambe par) ----
      if (R() < 0.7) {
        const z = 4 + R() * 22;
        const pole = new THREE.Mesh(G.tallPole, M2.pole); pole.position.set(s * 8.1, 3.2, z);
        const board = new THREE.Mesh(G.posterPlane, netaMats[Math.floor(R() * netaMats.length)]);
        board.scale.setScalar(1.9); board.position.set(s * 7.95, 4.9, z); board.rotation.y = faceRoad(s);
        const frame = new THREE.Mesh(G.unit, M2.frame);
        frame.scale.set(0.12, 3.9, 2.8); frame.position.set(s * 8.08, 4.9, z);
        props.add(pole, frame, board);
      }

      // ---- Dukaane (sign + awning + chipke hue posters) ----
      const shopMode = R();
      if (shopMode < 0.7) {
        addShop(props, s, 4 + R() * 4);
        if (R() < 0.6) addShop(props, s, 17 + R() * 6);
      }

      // ---- Peeche: khula maidan ya ghar / buildings ----
      if (R() < 0.35) {
        for (let i = 0; i < 4; i++) addTree(props, s * (10 + R() * 14), 2 + R() * 26, 2 + R() * 1.4);
      } else {
        for (let i = 0; i < 2; i++) {
          const h = 5 + R() * 7;
          const b = new THREE.Mesh(G.unit, R() < 0.5 ? mats.bldA : mats.bldB);
          b.scale.set(4.2, h, 4.2);
          const bz = 3 + R() * 24;
          b.position.set(s * (13 + R() * 5), h / 2 - 0.1, bz);
          props.add(b);
          if (R() < 0.5) {            // chhat par paani ki tanki
            const tk = new THREE.Mesh(G.tank, M2.tank);
            tk.position.set(b.position.x, h + 0.45, bz); props.add(tk);
          }
        }
        addTree(props, s * (10 + R() * 4), 3 + R() * 24, 2);
      }
    });
  }

  function createSky() {
    sunMesh = new THREE.Mesh(G.sun, M2.sun);
    sunMesh.position.set(-70, 60, 330);
    scene.add(sunMesh);
    cloudGroup = new THREE.Group();
    for (let i = 0; i < 9; i++) {
      const c = new THREE.Group();
      for (let j = 0; j < 4; j++) {
        const m = new THREE.Mesh(G.cloud, M2.cloud);
        m.scale.set(10 + Math.random() * 8, 4 + Math.random() * 3, 5);
        m.position.set(j * 9 - 14, Math.random() * 2, Math.random() * 3);
        c.add(m);
      }
      c.position.set(-260 + i * 65, 75 + Math.random() * 40, 300 + Math.random() * 80);
      cloudGroup.add(c);
    }
    scene.add(cloudGroup);
  }

  function createWeather() {
    const count = 700;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 24;
      arr[i * 3 + 1] = Math.random() * 12 + 2;
      arr[i * 3 + 2] = Math.random() * 180 - 30;
      weatherVel.push(0.28 + Math.random() * 0.25);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    weather = new THREE.Points(geo, new THREE.PointsMaterial({
      color: 0xaadfff, size: 0.06, transparent: true, opacity: 0.55, depthWrite: false
    }));
    weather.frustumCulled = false;
    scene.add(weather);
  }

  function createSpeedLines() {
    const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 2.3)]);
    const m = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 });
    for (let i = 0; i < 44; i++) {
      const l = new THREE.Line(geo, m);
      l.position.set((Math.random() - 0.5) * 14, 1 + Math.random() * 4.8, Math.random() * 190 - 20);
      l.userData.spd = 0.4 + Math.random() * 0.65;
      scene.add(l); speedLines.push({ obj: l });
    }
    speedLines.mat = m;
  }

  function setTheme(idx, instant) {
    const lv = MR.LEVELS[Math.min(idx, MR.LEVELS.length - 1)];
    target = lv.theme;
    weatherType = target.weather.type;
    if (instant) {
      cur.bg.set(target.bg); cur.ground.set(target.ground); cur.wall.set(target.wall);
      cur.bldA.set(target.bldA); cur.bldB.set(target.bldB); cur.leaf.set(target.leaf); cur.sun.set(target.sun);
      cur.amb.set(target.ambient[0]); cur.key.set(target.key[0]); cur.fill.set(target.fill[0]);
      cur.wcol.set(target.weather.color);
      cur.fog = target.fogDensity; cur.ambI = target.ambient[1]; cur.keyI = target.key[1]; cur.fillI = target.fill[1];
      cur.wop = target.weather.opacity; cur.wfall = target.weather.fall;
      cur.wsize = target.weather.type === 'dust' ? 0.14 : 0.06;
      apply();
    }
  }

  function approach(a, b, t) { return a + (b - a) * t; }

  function lerpTheme(k) {
    if (!target) return;
    const t = Math.min(1, 0.025 * k);
    const L = (c, hex) => c.lerp(tmp.set(hex), t);
    L(cur.bg, target.bg); L(cur.ground, target.ground); L(cur.wall, target.wall);
    L(cur.bldA, target.bldA); L(cur.bldB, target.bldB); L(cur.leaf, target.leaf); L(cur.sun, target.sun);
    L(cur.amb, target.ambient[0]); L(cur.key, target.key[0]); L(cur.fill, target.fill[0]);
    L(cur.wcol, target.weather.color);
    cur.fog = approach(cur.fog, target.fogDensity, t);
    cur.ambI = approach(cur.ambI, target.ambient[1], t);
    cur.keyI = approach(cur.keyI, target.key[1], t);
    cur.fillI = approach(cur.fillI, target.fill[1], t);
    cur.wop = approach(cur.wop, target.weather.opacity, t);
    cur.wfall = approach(cur.wfall, target.weather.fall, t);
    cur.wsize = approach(cur.wsize, target.weather.type === 'dust' ? 0.14 : 0.06, t);
    apply();
  }

  function apply() {
    scene.background.copy(cur.bg);
    scene.fog.color.copy(cur.bg); scene.fog.density = cur.fog;
    mats.ground.color.copy(cur.ground); mats.wall.color.copy(cur.wall);
    mats.bldA.color.copy(cur.bldA); mats.bldB.color.copy(cur.bldB); mats.leaf.color.copy(cur.leaf);
    M2.sun.color.copy(cur.sun);
    ambient.color.copy(cur.amb); ambient.intensity = cur.ambI;
    keyLight.color.copy(cur.key); keyLight.intensity = cur.keyI;
    fillLight.color.copy(cur.fill); fillLight.intensity = cur.fillI;
    weather.material.color.copy(cur.wcol);
    weather.material.opacity = cur.wop;
    weather.material.size = cur.wsize;
    weather.visible = cur.wop > 0.02;
  }

  const World = {
    voiceOn: false,
    init(sc) {
      scene = sc;
      scene.background = new THREE.Color(0x9fd3f2);
      scene.fog = new THREE.FogExp2(0x9fd3f2, 0.006);

      ambient = new THREE.AmbientLight(0xffffff, 0.9); scene.add(ambient);
      keyLight = new THREE.DirectionalLight(0xfff1d0, 1.25);
      keyLight.position.set(20, 35, -8);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      const sc2 = keyLight.shadow.camera;
      sc2.left = -14; sc2.right = 14; sc2.top = 14; sc2.bottom = -14; sc2.near = 1; sc2.far = 90;
      keyLight.target.position.set(0, 0, 4);
      scene.add(keyLight, keyLight.target);
      fillLight = new THREE.DirectionalLight(0xbfe0ff, 0.55);
      fillLight.position.set(-20, 22, 26); scene.add(fillLight);

      for (let i = 0; i < C.TRACK_SEGMENTS; i++) createTrackSegment(i);
      for (let i = 0; i < C.ENV_CHUNKS; i++) createChunk(i);
      createSky();
      createWeather();
      createSpeedLines();
      setTheme(0, true);
    },

    setTheme,

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
        if (s.position.z < -LEN) s.position.z += LEN * segments.length;
      });
      chunks.forEach(c => {
        c.position.z -= d;
        if (c.position.z < -LEN) { c.position.z += LEN * chunks.length; buildProps(c); }
      });

      // Baadal dheere dheere sarakte hain
      cloudGroup.children.forEach(c => { c.position.x += 0.02 * k; if (c.position.x > 300) c.position.x = -300; });

      // Machhali wala jab paas se guzre to 'das ke chaar' ki awaaz (sirf game chalte waqt)
      if (World.voiceOn && speed > 0) {
        chunks.forEach(c => {
          const u = c.userData;
          if (u.fishZ !== null && !u.cried) {
            const wz = c.position.z + u.fishZ;
            if (wz < 16 && wz > 0) { u.cried = true; MR.Audio.vendorCry(); }
          }
        });
      }

      // Mausam
      const p = weather.geometry.attributes.position.array;
      const drift = weatherType === 'dust';
      for (let i = 0; i < weatherVel.length; i++) {
        p[i * 3 + 1] -= weatherVel[i] * cur.wfall * k;
        p[i * 3 + 2] -= d * 1.4;
        if (drift) p[i * 3] += 0.03 * k;
        if (p[i * 3 + 1] < -0.2 || (drift && p[i * 3 + 1] < 0.2)) {
          p[i * 3 + 1] = 6 + Math.random() * 8;
          p[i * 3] = (Math.random() - 0.5) * 24 + playerX * 0.2;
        }
        if (p[i * 3 + 2] < -30) p[i * 3 + 2] = 180;
      }
      weather.geometry.attributes.position.needsUpdate = true;

      // Speed lines
      speedLines.mat.opacity = 0.06 + Math.min(0.2, speed * 0.2);
      speedLines.forEach(sl => {
        const l = sl.obj;
        l.position.z -= d * (1.5 + l.userData.spd);
        if (l.position.z < -20) {
          l.position.z = 180 + Math.random() * 40;
          l.position.x = (Math.random() - 0.5) * 14;
          l.position.y = 1 + Math.random() * 4.9;
        }
      });
    }
  };

  MR.World = World;
})();
