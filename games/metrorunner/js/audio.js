/* ===== audio.js : saari awaazein (WebAudio, koi file nahi chahiye) ===== */
(function () {
  let ctx = null;
  let muted = false;
  let siren = null;
  let musicTimer = null, musicStep = 0;

  function getCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(f1, f2, dur, type, vol, delay) {
    if (muted) return;
    const c = getCtx(); if (!c) return;
    const t0 = c.currentTime + (delay || 0);
    const osc = c.createOscillator(), g = c.createGain();
    osc.type = type || 'square';
    osc.frequency.setValueAtTime(f1, t0);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, f2), t0 + dur);
    g.gain.setValueAtTime(vol || 0.1, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(g); g.connect(c.destination);
    osc.start(t0); osc.stop(t0 + dur + 0.02);
  }

  function noise(dur, vol) {
    if (muted) return;
    const c = getCtx(); if (!c) return;
    const size = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, size, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < size; i++) d[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource(); src.buffer = buf;
    const g = c.createGain();
    g.gain.setValueAtTime(vol, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    src.connect(g); g.connect(c.destination); src.start();
  }

  const NOTES = [262, 294, 330, 392, 440, 392, 330, 294];
  function startMusic() {
    stopMusic();
    musicStep = 0;
    musicTimer = setInterval(() => {
      if (muted) return;
      const f = NOTES[musicStep % NOTES.length];
      tone(f / 2, f / 2, 0.22, 'triangle', 0.05);
      if (musicStep % 2 === 0) tone(f, f, 0.1, 'sine', 0.025);
      musicStep++;
    }, 240);
  }
  function stopMusic() { if (musicTimer) { clearInterval(musicTimer); musicTimer = null; } }

  function startSiren() {
    if (siren || muted) return;
    const c = getCtx(); if (!c) return;
    const osc = c.createOscillator(), g = c.createGain();
    osc.type = 'sawtooth';
    g.gain.value = 0.04;
    osc.connect(g); g.connect(c.destination);
    osc.frequency.setValueAtTime(800, c.currentTime);
    let up = true;
    const sweep = () => {
      const t = c.currentTime;
      osc.frequency.cancelScheduledValues(t);
      osc.frequency.setValueAtTime(up ? 800 : 1400, t);
      osc.frequency.linearRampToValueAtTime(up ? 1400 : 800, t + 0.5);
      up = !up;
    };
    sweep();
    const timer = setInterval(sweep, 500);
    osc.start();
    siren = { osc, g, timer };
  }
  function stopSiren() {
    if (!siren) return;
    clearInterval(siren.timer);
    try { siren.osc.stop(); siren.osc.disconnect(); siren.g.disconnect(); } catch (e) {}
    siren = null;
  }

  // Machhali wala: "das ke chaar" - browser ki Hindi awaaz (speechSynthesis), halki volume mein
  function vendorCry() {
    if (muted || !('speechSynthesis' in window)) return;
    try {
      if (speechSynthesis.speaking) return;
      const u = new SpeechSynthesisUtterance('दस के चार! दस के चार! मछली ले लो, मछली!');
      u.lang = 'hi-IN'; u.rate = 1.05; u.pitch = 0.75; u.volume = 0.45;
      speechSynthesis.speak(u);
    } catch (e) {}
  }
  function stopVoice() { try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) {} }

  MR.Audio = {
    unlock: getCtx,
    jump:   () => tone(300, 600, 0.15, 'sine', 0.2),
    roll:   () => tone(500, 180, 0.18, 'triangle', 0.15),
    coin:   () => { tone(987, 987, 0.1, 'sine', 0.15); tone(1318, 1318, 0.12, 'sine', 0.15, 0.09); },
    power:  () => { tone(440, 880, 0.12, 'square', 0.1); tone(660, 1320, 0.16, 'square', 0.1, 0.1); },
    stumble:() => { noise(0.15, 0.2); tone(200, 80, 0.2, 'sawtooth', 0.12); },
    shieldBreak: () => { tone(900, 200, 0.3, 'sawtooth', 0.15); noise(0.2, 0.12); },
    levelUp:() => { [523, 659, 784, 1046].forEach((f, i) => tone(f, f, 0.15, 'square', 0.1, i * 0.1)); },
    crash:  () => { noise(0.45, 0.3); tone(160, 40, 0.5, 'sawtooth', 0.2); },
    startSiren, stopSiren, startMusic, stopMusic, vendorCry, stopVoice,
    tick:   () => tone(700, 700, 0.09, 'square', 0.08),
    release:() => { tone(523, 523, 0.12, 'square', 0.1); tone(784, 784, 0.2, 'square', 0.1, 0.12); },
    setMuted(m) {
      muted = !!m;
      if (muted) { stopSiren(); stopVoice(); }
      return muted;
    },
    isMuted: () => muted
  };
})();
