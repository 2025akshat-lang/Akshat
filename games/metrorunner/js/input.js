/* ===== input.js : keyboard + touch swipe controls ===== */
(function () {
  // Lane 0 ab screen ka LEFT hai (config.js mein fix kiya), isliye swipe ko ulta karne ki zaroorat nahi.
  const SWIPE_MIN = 26, AXIS_RATIO = 1.08;

  MR.Input = {
    init(h) {
      addEventListener('keydown', (e) => {
        const k = e.key;
        if (k === 'Escape' || k === 'p' || k === 'P') { h.pause(); return; }
        if (k === 'm' || k === 'M') { h.mute(); return; }
        if (k === 'Enter') { h.confirm && h.confirm(); return; }
        if (k === 'ArrowLeft' || k === 'a' || k === 'A') h.left();
        else if (k === 'ArrowRight' || k === 'd' || k === 'D') h.right();
        else if (k === 'ArrowUp' || k === 'w' || k === 'W' || k === ' ') { h.jump(); e.preventDefault(); }
        else if (k === 'ArrowDown' || k === 's' || k === 'S') { h.roll(); e.preventDefault(); }
      });

      let sx = 0, sy = 0, ex = 0, ey = 0, tracking = false;
      addEventListener('touchstart', (e) => {
        if (!e.touches.length) return;
        const t = e.touches[0];
        sx = ex = t.clientX; sy = ey = t.clientY; tracking = true;
      }, { passive: true });
      addEventListener('touchmove', (e) => {
        if (!tracking || !e.touches.length) return;
        ex = e.touches[0].clientX; ey = e.touches[0].clientY;
      }, { passive: true });
      addEventListener('touchend', () => {
        if (!tracking) return;
        tracking = false;
        const dx = ex - sx, dy = ey - sy;
        const ax = Math.abs(dx), ay = Math.abs(dy);
        if (ax > SWIPE_MIN && ax > ay * AXIS_RATIO) { dx > 0 ? h.right() : h.left(); }
        else if (ay > SWIPE_MIN && ay > ax * AXIS_RATIO) { dy < 0 ? h.jump() : h.roll(); }
      }, { passive: true });
      addEventListener('touchcancel', () => { tracking = false; }, { passive: true });
    }
  };
})();
