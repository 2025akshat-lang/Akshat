/* ===== obstacles.js : obstacles spawn karna, hilana aur collision check ===== */
(function () {
  const C = MR.CONFIG;
  let scene;
  const list = [];

  const BUILDERS = {
    jump: () => MR.Models.jumpBarrier(),
    roll: () => MR.Models.rollTunnel(),
    block: () => MR.Models.sideBlockade(),
    spinner: () => MR.Models.spinner(),
    auto: () => MR.Models.autoRickshaw(),
    train: () => MR.Models.train(),
    cow: () => MR.Models.cow()
  };

  function pickType(weights, exclude) {
    let total = 0;
    for (const k in weights) if (k !== exclude) total += weights[k];
    let r = Math.random() * total;
    for (const k in weights) {
      if (k === exclude) continue;
      r -= weights[k];
      if (r <= 0) return k;
    }
    return 'jump';
  }

  function place(type, laneIdx, z) {
    const o = BUILDERS[type]();
    o.position.set(C.LANES[laneIdx], 0, z);
    o.userData.prevZ = z;
    o.userData.hit = false;
    o.userData.name = type;
    scene.add(o);
    list.push(o);
    return o;
  }

  const Obstacles = {
    init(sc) { scene = sc; },

    clear() {
      list.forEach(o => scene.remove(o));
      list.length = 0;
    },

    /* Ek "group" spawn karo: 1 ya 2 obstacles, hamesha kam se kam ek lane khali + coins/powerup */
    spawnGroup(z, level) {
      const lanes = [0, 1, 2];
      const laneA = lanes[Math.floor(Math.random() * 3)];
      const typeA = pickType(level.weights);
      place(typeA, laneA, z);
      const used = [laneA];

      if (Math.random() < level.doubleChance) {
        const others = lanes.filter(l => l !== laneA);
        const laneB = others[Math.floor(Math.random() * others.length)];
        place(pickType(level.weights, typeA), laneB, z);
        used.push(laneB);
      }

      const free = lanes.filter(l => !used.includes(l));
      const freeLane = free[Math.floor(Math.random() * free.length)];
      MR.Collectibles.spawnCoinRow(freeLane, z - 4, 4, false);
      if (typeA === 'jump' && Math.random() < 0.6) MR.Collectibles.spawnCoinRow(laneA, z - 4.4, 5, true);
      if (Math.random() < 0.10) {
        const kinds = ['shield', 'magnet', 'double'];
        MR.Collectibles.spawnPowerup(kinds[Math.floor(Math.random() * 3)], free[Math.floor(Math.random() * free.length)], z - 14);
      }
    },

    /* Return: null ya { kind:'hard'|'soft', obstacle } */
    update(k, speed, time) {
      const px = MR.Player.x, py = MR.Player.y;
      let result = null;

      for (let i = list.length - 1; i >= 0; i--) {
        const o = list[i], u = o.userData;
        u.prevZ = o.position.z;
        // train / auto aakhri 45 unit mein thoda tez aate hain
        const rush = (u.rush && o.position.z < 45) ? u.rush : 0;
        o.position.z -= speed * (1 + rush) * k;

        if (u.arm) u.arm.rotation.z += u.rotSpeed * k;
        if (u.tail) u.tail.rotation.z = Math.sin(time * 6) * 0.5;

        if (!u.hit && !result) {
          // swept check: pichhle frame se is frame tak ka z-range player (z=0) ko cover karta hai?
          const zMax = u.prevZ + u.halfZ + 0.3, zMin = o.position.z - u.halfZ - 0.3;
          if (zMin <= 0 && zMax >= 0 && Math.abs(px - o.position.x) < u.halfX * 0.8 + 0.3) {
            let hit = null;
            switch (u.type) {
              case 'train': case 'full_block': case 'auto': case 'cow': hit = 'hard'; break;
              case 'jump_barrier': if (py < u.height + 0.1) hit = 'soft'; break;
              case 'roll_tunnel': if (!MR.Player.isRolling) hit = 'soft'; break;
              case 'spinner': if (!(MR.Player.isRolling || py > 0.75)) hit = 'soft'; break;
            }
            if (hit) { u.hit = true; result = { kind: hit, obstacle: o }; }
          }
        }

        if (o.position.z < C.DESPAWN_Z) {
          scene.remove(o);
          list.splice(i, 1);
        }
      }
      return result;
    },

    // Shield / stumble ke baad us obstacle ko hata do (video-game style smash)
    remove(o) {
      const i = list.indexOf(o);
      if (i >= 0) { scene.remove(o); list.splice(i, 1); }
    }
  };

  MR.Obstacles = Obstacles;
})();
