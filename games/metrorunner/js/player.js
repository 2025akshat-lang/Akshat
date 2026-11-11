/* ===== player.js : khiladi ka 3D character, jump / roll / lane change ===== */
(function () {
  const C = MR.CONFIG;

  let group, body, shadow, shield, torchFire, torchLight;
  let lane = 1, y = 0, vy = 0;
  let jumping = false, rolling = false, rollTimer = null;
  let runPhase = 0, dxLast = 0;

  const P = {
    init(scene) {
      group = new THREE.Group();
      body = MR.Models.player();
      group.add(body);

      shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshBasicMaterial({ color: 0x6a6a6a, transparent: true, opacity: 0.4 })
      );
      shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.02;
      group.add(shadow);

      // Shield bubble
      shield = new THREE.Mesh(
        new THREE.SphereGeometry(1.25, 20, 16),
        new THREE.MeshBasicMaterial({ color: 0x2bb5ff, transparent: true, opacity: 0.22, depthWrite: false })
      );
      shield.position.y = 1.1; shield.visible = false;
      group.add(shield);

      // Mashaal (torch) - dahine haath mein
      const torch = new THREE.Group();
      torch.add(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.03, 0.7, 8), new THREE.MeshStandardMaterial({ color: 0x4e2710 })));
      torchFire = new THREE.Group(); torchFire.position.y = 0.48;
      torchFire.add(new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.38, 6), new THREE.MeshBasicMaterial({ color: 0xff3300, transparent: true, opacity: 0.95 })));
      const inner = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.26, 6), new THREE.MeshBasicMaterial({ color: 0xffcc00, transparent: true, opacity: 0.95 }));
      inner.position.y = 0.04; torchFire.add(inner);
      torch.add(torchFire);
      torchLight = new THREE.PointLight(0xff5500, 1.6, 5);
      torchLight.position.y = 0.6; torch.add(torchLight);
      torch.position.set(0, -0.62, -0.1);
      body.userData.armR.add(torch);

      group.position.set(C.LANES[lane], y, 0);
      scene.add(group);
    },

    reset() {
      lane = 1; y = 0; vy = 0; jumping = false;
      cancelRoll();
      dxLast = 0;
      body.rotation.set(0, 0, 0); body.position.set(0, 0, 0);
      group.position.set(C.LANES[lane], 0, 0);
      shield.visible = false;
    },

    moveLeft()  { if (lane > 0) { lane--; return true; } return false; },
    moveRight() { if (lane < C.LANES.length - 1) { lane++; return true; } return false; },

    jump() {
      if (jumping) return false;
      if (rolling) cancelRoll();
      jumping = true; vy = C.JUMP_STRENGTH;
      MR.Audio.jump();
      return true;
    },

    roll() {
      if (rolling) return false;
      rolling = true;
      body.scale.set(1, 0.4, 1); body.rotation.x = 0.6;
      if (jumping) vy = -C.JUMP_STRENGTH * 1.25;     // hawa mein ho to jaldi neeche
      clearTimeout(rollTimer);
      rollTimer = setTimeout(cancelRoll, C.ROLL_TIME);
      MR.Audio.roll();
      return true;
    },

    update(k, speed, time) {
      const tx = C.LANES[lane];
      const dx = tx - group.position.x;
      group.position.x += dx * Math.min(1, C.LANE_SMOOTH * k);
      dxLast = dx;
      if (!rolling) body.rotation.z = -dx * 0.05;

      if (jumping) {
        y += vy * k; vy += C.GRAVITY * k;
        if (y <= 0) { y = 0; jumping = false; vy = 0; }
      }
      group.position.y = y;
      const sh = Math.max(0.4, 1.1 - y * 0.25);
      shadow.scale.set(sh, sh, sh);

      // Daudne ka animation
      const u = body.userData;
      if (jumping) {
        u.legL.rotation.x = -0.7; u.legR.rotation.x = 0.5;
        u.armL.rotation.x = -2.4; u.armR.rotation.x = -2.2;
      } else {
        runPhase += (0.18 + speed * 0.35) * k;
        const s = Math.sin(runPhase);
        u.legL.rotation.x = s * 0.9;  u.legR.rotation.x = -s * 0.9;
        u.armL.rotation.x = -s * 0.8; u.armR.rotation.x = s * 0.5 - 0.5;
      }

      torchFire.scale.set(1 + Math.sin(time * 25) * 0.12, 1 + Math.sin(time * 31 + 1) * 0.18, 1);
      torchLight.intensity = 1.5 + Math.sin(time * 40) * 0.3;
      if (shield.visible) {
        shield.rotation.y += 0.03 * k;
        shield.material.opacity = 0.2 + Math.sin(time * 6) * 0.06;
      }
    },

    // crash ke waqt peeche girne wala animation (t: 0..1)
    crashAnim(t) {
      body.rotation.x = -t * 1.5;
      body.position.y = Math.sin(Math.min(1, t * 1.6) * Math.PI) * 0.5;
      body.rotation.z = Math.sin(t * 9) * 0.1;
    },

    // Detain ke waqt: ruk kar haath upar
    stand() {
      const u = body.userData;
      u.legL.rotation.x = 0; u.legR.rotation.x = 0;
      u.armL.rotation.x = -2.9; u.armR.rotation.x = -2.9;
      body.rotation.z = 0;
    },

    setShield(on) { shield.visible = !!on; },
    flashShield() { shield.material.opacity = 0.7; },

    get x() { return group.position.x; },
    get y() { return y; },
    get lane() { return lane; },
    get isRolling() { return rolling; },
    get isJumping() { return jumping; },
    get center() { return new THREE.Vector3(group.position.x, y + 0.95, 0); },
    group: () => group
  };

  function cancelRoll() {
    rolling = false;
    clearTimeout(rollTimer);
    if (body) { body.scale.set(1, 1, 1); body.rotation.x = 0; }
  }

  MR.Player = P;
})();
