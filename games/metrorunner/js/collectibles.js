/* ===== collectibles.js : coins, power-ups (shield / magnet / x2) aur sparkle effects ===== */
(function () {
  const C = MR.CONFIG;
  let scene;
  const coins = [], powerups = [], sparkles = [];
  const MAGNET_RADIUS = 7;

  function sparkle(pos, color) {
    const n = 12;
    const arr = new Float32Array(n * 3), vel = [];
    for (let i = 0; i < n; i++) {
      arr[i * 3] = pos.x; arr[i * 3 + 1] = pos.y; arr[i * 3 + 2] = pos.z;
      vel.push({ x: (Math.random() - 0.5) * 0.2, y: Math.random() * 0.22, z: (Math.random() - 0.5) * 0.2 });
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    const ps = new THREE.Points(geo, new THREE.PointsMaterial({ color: color || 0xffd166, size: 0.24, transparent: true, opacity: 1 }));
    ps.frustumCulled = false;
    ps.userData = { vel, life: 1 };
    scene.add(ps); sparkles.push(ps);
  }

  const Collectibles = {
    init(sc) { scene = sc; },

    clear() {
      coins.forEach(c => scene.remove(c));
      powerups.forEach(p => scene.remove(p));
      sparkles.forEach(s => { scene.remove(s); s.geometry.dispose(); s.material.dispose(); });
      coins.length = powerups.length = sparkles.length = 0;
    },

    spawnCoinRow(laneIdx, z, count, arc) {
      for (let i = 0; i < count; i++) {
        const c = MR.Models.coin();
        let y = 0.9;
        if (arc && count > 1) y = 0.9 + Math.sin((i / (count - 1)) * Math.PI) * 2.0;
        c.position.set(C.LANES[laneIdx], y, z + i * 2.2);
        scene.add(c); coins.push(c);
      }
    },

    spawnPowerup(kind, laneIdx, z) {
      const p = MR.Models.powerup(kind);
      p.position.set(C.LANES[laneIdx], 1.2, z);
      scene.add(p); powerups.push(p);
    },

    burst(pos, color) { sparkle(pos, color); },

    /* Return { coins: n, powerups: [kind,...] } */
    update(k, speed, time, magnetOn) {
      const out = { coins: 0, powerups: [] };
      const pc = MR.Player.center;

      for (let i = coins.length - 1; i >= 0; i--) {
        const c = coins[i];
        c.position.z -= speed * k;
        c.rotation.y += 0.06 * k;

        if (magnetOn && c.position.distanceTo(pc) < MAGNET_RADIUS) {
          c.position.lerp(pc, Math.min(1, 0.22 * k));
        }
        if (c.position.distanceTo(pc) < 1.1) {
          out.coins++;
          sparkle(c.position, 0xffd166);
          scene.remove(c); coins.splice(i, 1);
        } else if (c.position.z < C.DESPAWN_Z) {
          scene.remove(c); coins.splice(i, 1);
        }
      }

      for (let i = powerups.length - 1; i >= 0; i--) {
        const p = powerups[i];
        p.position.z -= speed * k;
        p.userData.core.rotation.y += 0.05 * k;
        p.userData.ring.rotation.z += 0.04 * k;
        p.position.y = 1.2 + Math.sin(time * 3 + p.position.z) * 0.18;
        if (p.position.distanceTo(pc) < 1.5) {
          out.powerups.push(p.userData.kind);
          sparkle(p.position, C.POWERUPS[p.userData.kind].color);
          scene.remove(p); powerups.splice(i, 1);
        } else if (p.position.z < C.DESPAWN_Z) {
          scene.remove(p); powerups.splice(i, 1);
        }
      }

      for (let i = sparkles.length - 1; i >= 0; i--) {
        const ps = sparkles[i], u = ps.userData;
        u.life -= 0.05 * k;
        ps.material.opacity = Math.max(0, u.life);
        const a = ps.geometry.attributes.position.array;
        for (let j = 0; j < u.vel.length; j++) {
          a[j * 3] += u.vel[j].x * k; a[j * 3 + 1] += u.vel[j].y * k; a[j * 3 + 2] += u.vel[j].z * k;
        }
        ps.geometry.attributes.position.needsUpdate = true;
        if (u.life <= 0) {
          scene.remove(ps); ps.geometry.dispose(); ps.material.dispose(); sparkles.splice(i, 1);
        }
      }
      return out;
    }
  };

  MR.Collectibles = Collectibles;
})();
