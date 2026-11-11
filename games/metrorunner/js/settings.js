/* ===== settings.js : brightness, color shade aur mausam (Automatic / Manual) =====
   Settings localStorage mein save hoti hain. Brightness + shade canvas par CSS filter se lagte hain. */
(function () {
  const KEY = 'metroRunnerIndia.settings.v1';

  const SHADES = {
    normal:   { label: 'Normal',     css: '' },
    warm:     { label: 'Garam',      css: 'sepia(0.22) saturate(1.2)' },
    cool:     { label: 'Thanda',     css: 'hue-rotate(12deg) saturate(1.05)' },
    vivid:    { label: 'Rangeen',    css: 'saturate(1.55) contrast(1.1)' },
    contrast: { label: 'Saaf (High Contrast)', css: 'contrast(1.28) saturate(1.15)' },
    soft:     { label: 'Soft',       css: 'saturate(0.8) contrast(0.95)' }
  };

  let S = { mode: 'auto', weather: 'sunny', brightness: 100, shade: 'normal' };
  try {
    const d = JSON.parse(localStorage.getItem(KEY) || '{}');
    if (d.mode === 'auto' || d.mode === 'manual') S.mode = d.mode;
    if (MR.WEATHERS[d.weather]) S.weather = d.weather;
    if (typeof d.brightness === 'number') S.brightness = Math.max(60, Math.min(150, d.brightness));
    if (SHADES[d.shade]) S.shade = d.shade;
  } catch (e) {}

  const listeners = [];
  let open = false;
  const $ = (id) => document.getElementById(id);

  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

  function applyCss() {
    const el = $('canvas-container'); if (!el) return;
    const f = [];
    if (S.brightness !== 100) f.push('brightness(' + (S.brightness / 100) + ')');
    if (SHADES[S.shade].css) f.push(SHADES[S.shade].css);
    el.style.filter = f.length ? f.join(' ') : 'none';
  }

  function set(patch) {
    Object.assign(S, patch);
    save(); applyCss(); render();
    listeners.forEach(fn => fn(S));
  }

  function chip(parent, label, active, onClick) {
    const b = document.createElement('button');
    b.className = 'chip-btn' + (active ? ' on' : '');
    b.textContent = label;
    b.addEventListener('click', (e) => { e.stopPropagation(); onClick(); });
    parent.appendChild(b);
  }

  function render() {
    if (!$('settings-screen')) return;
    $('mode-auto').classList.toggle('on', S.mode === 'auto');
    $('mode-manual').classList.toggle('on', S.mode === 'manual');
    $('mode-note').textContent = S.mode === 'auto'
      ? 'Automatic: jis state mein daudoge wahan ka mausam (Rajasthan mein dhoop, Kerala mein barish, Kashmir mein barf...).'
      : 'Manual: neeche se mausam chuno. Raasta/ilaaka level ke hisaab se hi badlega.';
    $('weather-box').style.display = S.mode === 'manual' ? 'block' : 'none';
    $('bright-range').value = S.brightness;
    $('bright-val').textContent = S.brightness + '%';
    const wc = $('weather-chips'); wc.innerHTML = '';
    Object.keys(MR.WEATHERS).forEach(k => chip(wc, MR.WEATHERS[k].icon + ' ' + MR.WEATHERS[k].label, S.weather === k, () => set({ weather: k })));
    const sc = $('shade-chips'); sc.innerHTML = '';
    Object.keys(SHADES).forEach(k => chip(sc, SHADES[k].label, S.shade === k, () => set({ shade: k })));
  }

  MR.Settings = {
    SHADES,
    get: () => S,
    set,
    onChange(fn) { listeners.push(fn); },
    isOpen: () => open,
    open() { open = true; render(); $('settings-screen').style.display = 'flex'; },
    close() { open = false; $('settings-screen').style.display = 'none'; },
    bindUI() {
      applyCss(); render();
      $('mode-auto').addEventListener('click', () => set({ mode: 'auto' }));
      $('mode-manual').addEventListener('click', () => set({ mode: 'manual' }));
      $('bright-range').addEventListener('input', (e) => set({ brightness: +e.target.value }));
      $('settings-done').addEventListener('click', () => MR.Settings.close());
    }
  };
})();
