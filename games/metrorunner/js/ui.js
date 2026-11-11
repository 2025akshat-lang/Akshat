/* ===== ui.js : HUD, overlays aur banners ===== */
(function () {
  const $ = (id) => document.getElementById(id);
  let el = {};
  let bannerTimer = null, toastTimer = null;
  const last = { score: -1, coins: -1, best: -1 };

  MR.UI = {
    init(h) {
      ['score-val', 'coin-val', 'best-val', 'level-indicator', 'boss-indicator', 'powerup-bar', 'toast',
        'start-screen', 'pause-screen', 'game-over-screen', 'start-best',
        'detain-screen', 'detain-sub', 'detain-count', 'detain-note',
        'final-score', 'final-coins', 'final-level', 'final-best', 'go-title', 'new-best',
        'start-btn', 'restart-btn', 'resume-btn', 'menu-btn', 'pause-btn', 'mute-btn', 'flash'
      ].forEach(id => el[id] = $(id));

      el['start-btn'].addEventListener('click', h.start);
      el['restart-btn'].addEventListener('click', h.start);
      el['resume-btn'].addEventListener('click', h.pause);
      el['menu-btn'].addEventListener('click', h.menu);
      el['pause-btn'].addEventListener('click', (e) => { e.stopPropagation(); h.pause(); });
      el['mute-btn'].addEventListener('click', (e) => { e.stopPropagation(); h.mute(); });

      // Power-up chips (ek baar bana ke rakhte hain)
      for (const kind in MR.CONFIG.POWERUPS) {
        const p = MR.CONFIG.POWERUPS[kind];
        const chip = document.createElement('div');
        chip.className = 'chip'; chip.id = 'chip-' + kind; chip.style.display = 'none';
        chip.innerHTML = `<span class="chip-ico">${p.icon}</span><span class="chip-name">${p.label}</span><div class="chip-bar"><i></i></div>`;
        el['powerup-bar'].appendChild(chip);
      }
    },

    setHud(score, coins, best) {
      if (score !== last.score) { el['score-val'].textContent = score; last.score = score; }
      if (coins !== last.coins) { el['coin-val'].textContent = coins; last.coins = coins; }
      if (best !== last.best) { el['best-val'].textContent = best; last.best = best; }
    },

    resetHud() { last.score = last.coins = last.best = -1; },

    setPowerups(timers) {
      for (const kind in MR.CONFIG.POWERUPS) {
        const chip = $('chip-' + kind), t = timers[kind] || 0;
        if (t > 0) {
          chip.style.display = 'flex';
          chip.querySelector('i').style.width = Math.min(100, (t / MR.CONFIG.POWERUPS[kind].duration) * 100) + '%';
        } else chip.style.display = 'none';
      }
    },

    banner(text) {
      const b = el['level-indicator'];
      b.textContent = text; b.style.display = 'block';
      clearTimeout(bannerTimer);
      bannerTimer = setTimeout(() => b.style.display = 'none', 2400);
    },

    toast(text) {
      const t = el['toast'];
      t.textContent = text; t.style.opacity = 1;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => t.style.opacity = 0, 900);
    },

    showChase(on) { el['boss-indicator'].style.display = on ? 'block' : 'none'; },

    flash(color) {
      const f = el['flash'];
      f.style.background = color || 'rgba(255,0,0,0.45)';
      f.style.transition = 'none'; f.style.opacity = 1;
      requestAnimationFrame(() => { f.style.transition = 'opacity .6s'; f.style.opacity = 0; });
    },

    showStart(best) {
      el['start-best'].textContent = best;
      el['start-screen'].style.display = 'flex';
      el['pause-screen'].style.display = 'none';
      el['game-over-screen'].style.display = 'none';
      el['detain-screen'].style.display = 'none';
      this.showChase(false); this.setPowerups({});
      el['pause-btn'].style.display = 'none';
    },
    hideStart() { el['start-screen'].style.display = 'none'; el['pause-btn'].style.display = 'flex'; },
    showPause(on) { el['pause-screen'].style.display = on ? 'flex' : 'none'; },
    hideGameOver() { el['game-over-screen'].style.display = 'none'; },
    showGameOver(d) {
      el['go-title'].textContent = d.busted ? 'BUSTED! ' + d.busts + '/' + d.max : 'GAME OVER';
      el['final-score'].textContent = d.score;
      el['final-coins'].textContent = d.coins;
      el['final-level'].textContent = d.level;
      el['final-best'].textContent = d.best;
      el['new-best'].style.display = d.newBest ? 'block' : 'none';
      el['game-over-screen'].style.display = 'flex';
      el['pause-btn'].style.display = 'none';
      this.showChase(false);
    },
    showDetain(n, max) {
      el['detain-sub'].textContent = 'Pakde gaye: ' + n + ' / ' + max;
      el['detain-note'].textContent = n >= max - 1
        ? 'Chetavani: agli baar pakde gaye to GAME OVER!'
        : 'Thodi der mein chhod diya jayega... fir se bhaago!';
      el['detain-count'].textContent = '';
      el['detain-screen'].style.display = 'flex';
      this.showChase(false);
    },
    setDetainCount(c) {
      const d = el['detain-count'];
      d.textContent = c;
      d.classList.remove('pulse'); void d.offsetWidth; d.classList.add('pulse');   // har number par animation dobara
    },
    hideDetain() { el['detain-screen'].style.display = 'none'; },
    setMuteIcon(m) { el['mute-btn'].textContent = m ? '🔇' : '🔊'; }
  };
})();
