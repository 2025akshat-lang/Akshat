/* ===== game.js : main game loop, state machine, scoring, levels ===== */
(function () {
  const C = MR.CONFIG;

  let renderer, scene, camera;
  let state = 'menu';             // menu | playing | paused | detained | crashing | over
  let lastT = 0, time = 0;

  let speed, distance, scoreF, score, coins, levelIdx, nextSpawn;
  let best = 0;
  const power = { shield: 0, magnet: 0, double: 0 };
  let invuln = 0, shake = 0, crashT = 0, crashReason = '';
  let bustCount = 0, detainT = 0, detainShown = 0;
  const cam = { y: 3.9, z: -8.4, look: 1.0, fov: 60 };   // camera ki abhi ki settings (ilaake ke saath dheere badalti hain)
  let frameCount = 0, shaderChecked = false;   // police ne kitni baar pakda + countdown

  /* ---------- storage (try/catch: private mode mein bhi crash na ho) ---------- */
  function loadBest() {
    try { const d = JSON.parse(localStorage.getItem(C.STORAGE_KEY) || '{}'); return d.best || 0; } catch (e) { return 0; }
  }
  function saveBest(v) {
    try { localStorage.setItem(C.STORAGE_KEY, JSON.stringify({ best: v })); } catch (e) {}
  }

  /* ---------- setup ---------- */
  function init() {
    if (!window.THREE) {
      document.body.insertAdjacentHTML('beforeend',
        '<div style="position:fixed;inset:0;display:flex;align-items:center;justify-content:center;color:#fff;z-index:99;background:#5a5a5a;text-align:center;padding:20px">Three.js load nahi hua. Internet check karein aur page refresh karein.</div>');
      return;
    }
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 1100);
    camera.position.set(0, C.CAM.y, C.CAM.z);
    camera.lookAt(0, C.CAM.look, 14);

    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    MR.World.init(scene);
    MR.Player.init(scene);
    MR.Obstacles.init(scene);
    MR.Collectibles.init(scene);
    MR.Police.init(scene);

    best = loadBest();
    MR.UI.init({ start: startGame, menu: toMenu, pause: togglePause, mute: toggleMute, settings: openSettings });
    MR.Settings.bindUI();
    MR.Settings.onChange(() => MR.World.refresh());
    MR.UI.showStart(best);
    MR.UI.setMuteIcon(false);

    MR.Input.init({
      left:  () => { if (state === 'playing') MR.Player.moveLeft(); },
      right: () => { if (state === 'playing') MR.Player.moveRight(); },
      jump:  () => { if (state === 'playing') MR.Player.jump(); },
      roll:  () => { if (state === 'playing') MR.Player.roll(); },
      pause: togglePause,
      mute: toggleMute,
      confirm: () => { if (MR.Settings.isOpen()) return; if (state === 'menu' || state === 'over') startGame(); }
    });

    addEventListener('resize', () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden && state === 'playing') togglePause(); });

    lastT = performance.now();
    requestAnimationFrame(loop);        // sirf EK loop, hamesha chalta hai
  }

  /* ---------- state changes ---------- */
  function resetRun() {
    speed = MR.LEVELS[0].minSpeed;
    distance = 0; scoreF = 0; score = 0; coins = 0; levelIdx = 0;
    nextSpawn = 8;
    power.shield = power.magnet = power.double = 0;
    invuln = 0; shake = 0; crashT = 0; bustCount = 0;
    MR.UI.hideDetain();
    MR.Obstacles.clear(); MR.Collectibles.clear();
    MR.World.reset(); MR.Player.reset(); MR.Police.reset();
    MR.Player.setShield(false);
    MR.UI.resetHud(); MR.UI.setPowerups({}); MR.UI.showChase(false);
    Object.assign(cam, C.CAM);
    camera.position.set(0, cam.y, cam.z); camera.lookAt(0, cam.look, 14);
    camera.fov = cam.fov; camera.updateProjectionMatrix();
  }

  function startGame() {
    MR.Audio.unlock();
    resetRun();
    MR.UI.hideStart(); MR.UI.hideGameOver(); MR.UI.showPause(false);
    state = 'playing';
    MR.Audio.startMusic();
    MR.World.voiceOn = true;
    MR.UI.banner('LEVEL 1 • ' + MR.LEVELS[0].name);
  }

  function toMenu() {
    MR.Audio.stopMusic(); MR.Audio.stopSiren(); MR.Audio.stopVoice();
    MR.World.voiceOn = false;
    resetRun();
    state = 'menu';
    MR.UI.showStart(best);
  }

  function openSettings() {
    if (state === 'playing') togglePause();      // gameplay ke dauran settings khulne par pehle pause
    MR.Settings.open();
  }

  function togglePause() {
    if (MR.Settings.isOpen()) return;
    if (state === 'playing') {
      state = 'paused';
      MR.Audio.stopSiren(); MR.Audio.stopMusic();
      MR.UI.showPause(true);
    } else if (state === 'paused') {
      state = 'playing';
      MR.UI.showPause(false);
      MR.Audio.startMusic();
      if (MR.Police.active) MR.Audio.startSiren();
      lastT = performance.now();
    }
  }

  function toggleMute() {
    const m = MR.Audio.setMuted(!MR.Audio.isMuted());
    MR.UI.setMuteIcon(m);
    if (!m && state === 'playing' && MR.Police.active) MR.Audio.startSiren();
  }

  /* Police ne pakda: pehli aur doosri baar -> DETAIN + 5-4-3-2-1 countdown, phir chhod do aur dobara bhaago.
     Teesri baar pakde gaye -> BUSTED, Try Again. */
  function startDetain() {
    state = 'detained'; detainT = C.DETAIN_SECONDS; detainShown = 0;
    MR.Audio.stopMusic(); MR.Audio.stopSiren(); MR.Audio.stopVoice(); MR.Audio.crash();
    MR.UI.flash('rgba(70,120,255,0.4)'); shake = 0.6;
    MR.Player.stand();
    MR.UI.showDetain(bustCount, C.MAX_BUSTS);
  }

  function resumeFromDetain() {
    MR.UI.hideDetain();
    MR.Obstacles.clear(); MR.Collectibles.clear();      // saamne ka raasta saaf
    MR.Player.reset();
    if (power.shield > 0) MR.Player.setShield(true);
    MR.Police.pushBack();
    invuln = 2.5; nextSpawn = distance + 12;
    state = 'playing';
    MR.Audio.release(); MR.Audio.startMusic();
    if (MR.Police.active) MR.Audio.startSiren();
    MR.UI.toast('CHHOD DIYA! BHAAGO! 🏃');
  }

  function endGame(reason) {
    if (state !== 'playing') return;
    if (reason === 'busted') {
      bustCount++;
      if (bustCount < C.MAX_BUSTS) { startDetain(); return; }
    }
    state = 'crashing'; crashT = 0; crashReason = reason;
    MR.Audio.stopMusic(); MR.Audio.stopSiren(); MR.Audio.crash();
    MR.UI.flash('rgba(255,0,0,0.45)');
    shake = 1;
  }

  function finishCrash() {
    const newBest = score > best;
    if (newBest) { best = score; saveBest(best); }
    state = 'over';
    MR.World.voiceOn = false;
    MR.UI.showGameOver({ score, coins, level: levelIdx + 1, best, newBest, busted: crashReason === 'busted', busts: bustCount, max: C.MAX_BUSTS });
  }

  /* ---------- gameplay ---------- */
  function activatePower(kind) {
    power[kind] = C.POWERUPS[kind].duration;
    MR.Audio.power();
    MR.UI.toast(C.POWERUPS[kind].label + '!');
    if (kind === 'shield') MR.Player.setShield(true);
  }

  function handleHit(res) {
    const hardHit = res.kind === 'hard';
    if (power.shield > 0) {
      power.shield = 0;
      MR.Player.setShield(false);
      MR.Audio.shieldBreak();
      MR.Collectibles.burst(res.obstacle.position.clone().setY(1.2), 0x2bb5ff);
      MR.Obstacles.remove(res.obstacle);
      MR.UI.toast('SHIELD BREAK!');
      invuln = 0.6; shake = 0.5;
      return;
    }
    if (!hardHit && invuln > 0) return;            // stumble ke turant baad ka soft obstacle maaf
    if (!hardHit && MR.Police.active) {
      MR.Audio.stumble(); shake = 0.6; invuln = 1.3;
      MR.UI.flash('rgba(255,160,0,0.35)'); MR.UI.toast('STUMBLE! POLICE CLOSE!');
      if (MR.Police.stumble()) endGame('busted');
      return;
    }
    endGame('crash');
  }

  function updatePlaying(dt, k) {
    const lvl = MR.LEVELS[levelIdx];

    // speed ramp
    if (speed < lvl.maxSpeed) speed = Math.min(lvl.maxSpeed, speed + 0.00006 * k);

    const mult = power.double > 0 ? 2 : 1;
    distance += speed * k;
    scoreF += speed * k * C.SCORE_FACTOR * mult;
    score = Math.floor(scoreF);

    // level up
    let idx = levelIdx;
    while (idx + 1 < MR.LEVELS.length && score >= MR.LEVELS[idx + 1].from) idx++;
    if (idx !== levelIdx) {
      levelIdx = idx;
      const nl = MR.LEVELS[idx];
      speed = Math.max(speed, nl.minSpeed);
      MR.World.setTheme(idx);
      MR.Audio.levelUp();
      MR.UI.banner(`LEVEL ${idx + 1} • ${nl.name}`);
    }

    // power timers
    for (const kd in power) {
      if (power[kd] > 0) {
        power[kd] = Math.max(0, power[kd] - dt);
        if (kd === 'shield' && power[kd] === 0) MR.Player.setShield(false);
      }
    }
    if (invuln > 0) invuln -= dt;

    MR.Player.update(k, speed, time);
    MR.World.update(k, speed, MR.Player.x);

    // spawn
    if (distance > nextSpawn) {
      MR.Obstacles.spawnGroup(C.SPAWN_Z, MR.LEVELS[levelIdx]);
      nextSpawn += (16 + speed * 18 + Math.random() * 8) * MR.LEVELS[levelIdx].gap;
    }

    // police chase window
    const ch = MR.LEVELS[levelIdx].chase;
    const chase = !!ch && score >= ch.from && score < ch.to;
    MR.Police.setActive(chase);
    MR.UI.showChase(chase);
    if (MR.Police.update(k, speed, time, MR.Player.x)) { endGame('busted'); return; }

    // obstacles
    const hit = MR.Obstacles.update(k, speed, time);
    if (hit) { handleHit(hit); if (state !== 'playing') return; }

    // collectibles
    const got = MR.Collectibles.update(k, speed, time, power.magnet > 0);
    if (got.coins) {
      coins += got.coins * mult;
      scoreF += got.coins * C.COIN_SCORE * mult;
      MR.Audio.coin();
    }
    got.powerups.forEach(activatePower);

    // camera
    camera.position.x += (MR.Player.x * 0.34 - camera.position.x) * 0.08 * k;
    // camera: ilaake ke hisaab se height / doori / fov dheere dheere badalte hain (slum / jungle mein camera neecha)
    const ct = MR.World.camTarget();
    cam.y += (ct.y - cam.y) * 0.03 * k; cam.z += (ct.z - cam.z) * 0.03 * k;
    cam.look += (ct.look - cam.look) * 0.03 * k; cam.fov += (ct.fov - cam.fov) * 0.03 * k;
    camera.position.y += ((cam.y + Math.sin(distance * 0.03) * 0.08) - camera.position.y) * 0.05 * k;
    camera.position.z = cam.z;
    const fov = cam.fov + (speed - 0.28) * 14;
    camera.fov += (fov - camera.fov) * 0.05; camera.updateProjectionMatrix();
    camera.lookAt(camera.position.x * 0.5, cam.look, 14);

    MR.UI.setHud(score, coins, Math.max(best, score));
    MR.UI.setPowerups(power);
  }

  function applyShake(dt) {
    if (shake > 0) {
      camera.position.x += (Math.random() - 0.5) * shake * 0.4;
      camera.position.y += (Math.random() - 0.5) * shake * 0.3;
      shake = Math.max(0, shake - dt * 1.6);
    }
  }

  function loop(now) {
    requestAnimationFrame(loop);
    const dt = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;
    const k = Math.min(2, dt * 60);
    time += dt;

    if (state === 'playing') {
      updatePlaying(dt, k);
    } else if (state === 'menu') {
      MR.World.update(k, 0, 0);                 // menu mein world ruka hua (scroll nahi)
      MR.Player.idle(time);
    } else if (state === 'detained') {
      detainT -= dt;
      const c = Math.max(1, Math.ceil(detainT));
      if (c !== detainShown) { detainShown = c; MR.UI.setDetainCount(c); MR.Audio.tick(); }
      MR.World.update(k, 0, 0);
      MR.Police.flash(time); MR.Player.stand();
      if (detainT <= 0) resumeFromDetain();
    } else if (state === 'crashing') {
      crashT += dt;
      MR.Player.crashAnim(Math.min(1, crashT / 0.9));
      MR.World.update(k, 0, 0);
      if (crashT > 1.1) finishCrash();
    }
    if (state !== 'paused') applyShake(dt);
    renderer.render(scene, camera);
    if (!shaderChecked && ++frameCount > 20) { shaderChecked = true; MR.World.verify(renderer); }   // curved road shader theek chala?
  }

  window.addEventListener('load', init);
})();
