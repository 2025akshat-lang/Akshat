/* thargame/js/ui/cockpit-controls.js
   Light buttons, wiper, water spray, indicator buttons */
function syncLightButtons() {
    document.getElementById('btn-headlight').classList.toggle('on', lightStates.head);
    document.getElementById('btn-taillight').classList.toggle('on', lightStates.tail);
    document.getElementById('btn-deflector').classList.toggle('on', lightStates.defl);
    document.getElementById('btn-interior').classList.toggle('on', lightStates.int);
    document.getElementById('btn-dashlight').classList.toggle('on', lightStates.dash);
    document.getElementById('btn-wiper').classList.toggle('on', lightStates.wiper);

    const headIntensity = lightStates.head ? (isNightMode ? 3.8 : 1.8) : 0;
    headLightL.intensity = headIntensity;
    headLightR.intensity = headIntensity;
    deflectorLight.intensity = lightStates.defl ? (isNightMode ? 3.2 : 1.5) : 0;
    tailLightGlow.intensity = lightStates.tail ? (isNightMode ? 3.0 : 1.2) : 0;

    document.getElementById('interior-glow').classList.toggle('active', lightStates.int);
    document.getElementById('thar-dashboard').classList.toggle('dash-lit', lightStates.dash);
}

document.getElementById('btn-headlight').addEventListener('click', () => { lightStates.head = !lightStates.head; syncLightButtons(); });
document.getElementById('btn-taillight').addEventListener('click', () => { lightStates.tail = !lightStates.tail; syncLightButtons(); });
document.getElementById('btn-deflector').addEventListener('click', () => { lightStates.defl = !lightStates.defl; syncLightButtons(); });
document.getElementById('btn-interior').addEventListener('click', () => { lightStates.int = !lightStates.int; syncLightButtons(); });
document.getElementById('btn-dashlight').addEventListener('click', () => { lightStates.dash = !lightStates.dash; syncLightButtons(); });
document.getElementById('btn-wiper').addEventListener('click', () => { lightStates.wiper = !lightStates.wiper; syncLightButtons(); });

const windshieldFx = document.getElementById('windshield-fx');
document.getElementById('btn-spray').addEventListener('click', () => {
    playSpraySound();
    const dropCount = Math.min(20, Math.max(0, 60 - windshieldFx.childElementCount));
    for (let i = 0; i < dropCount; i++) {
        const drop = document.createElement('div');
        drop.className = 'water-drop';
        drop.style.left = (22 + Math.random() * 56) + '%';
        drop.style.top = (25 + Math.random() * 32) + '%';
        windshieldFx.appendChild(drop);
        setTimeout(() => drop.remove(), 1850);
    }
    if (!lightStates.wiper) {
        lightStates.wiper = true;
        syncLightButtons();
        setTimeout(() => { lightStates.wiper = false; syncLightButtons(); }, 2200);
    }
});

document.getElementById('ind-left').addEventListener('click', () => { manualIndicator = manualIndicator === -1 ? 0 : -1; });
document.getElementById('ind-right').addEventListener('click', () => { manualIndicator = manualIndicator === 1 ? 0 : 1; });
