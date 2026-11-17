/* thargame/js/ui/settings-panel.js
   Settings panel: steering smoothness, quality buttons, wheel/arrow mode */
let steeringSmoothness = 0.65;
document.getElementById('steer-smooth-slider').addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    document.getElementById('steer-smooth-txt').innerText = val + "%";
    steeringSmoothness = val / 100;
});

const settingsBtn = document.getElementById('settings-btn');
const settingsPanel = document.getElementById('settings-panel');
settingsBtn.addEventListener('click', () => {
    settingsPanel.style.display = settingsPanel.style.display === 'block' ? 'none' : 'block';
});
document.getElementById('close-settings').addEventListener('click', () => settingsPanel.style.display = 'none');
document.querySelectorAll('.q-pick').forEach(b => {
    b.classList.toggle('active', b.dataset.q === QUALITY);
    b.addEventListener('click', () => {
        if (b.dataset.q === QUALITY) return;
        try { localStorage.setItem('tharQ', b.dataset.q); } catch (e) {}
        location.reload();
    });
});

const wheelWrapper = document.getElementById('steering-wrapper');
const arrowControls = document.getElementById('arrow-steer-controls');
const modeWheelBtn = document.getElementById('mode-wheel-btn');
const modeArrowsBtn = document.getElementById('mode-arrows-btn');

modeWheelBtn.addEventListener('click', () => {
    modeWheelBtn.classList.add('active'); modeArrowsBtn.classList.remove('active');
    wheelWrapper.style.display = 'block'; arrowControls.style.display = 'none';
});
modeArrowsBtn.addEventListener('click', () => {
    modeArrowsBtn.classList.add('active'); modeWheelBtn.classList.remove('active');
    wheelWrapper.style.display = 'none'; arrowControls.style.display = 'flex';
});
