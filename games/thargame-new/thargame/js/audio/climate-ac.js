/* thargame/js/audio/climate-ac.js
   A/C, fan, windshield scrub sound, USB/HDMI ports */
// Roughness multiplier per terrain (Gaon kacchi road & Hills bounce more!)
const zoneRough = [0.8, 0.6, 0.25, 2.2, 1.8, 2.0];
const acBtn = document.getElementById('ac-btn');
const fanBtn = document.getElementById('fan-btn');
const vents = document.querySelectorAll('.ac-vent');
const FAN_LABELS = ['OFF', '1', '2', '3'];
const FAN_GAIN = [0, 0.04, 0.08, 0.14];
const FAN_FREQ = [0, 600, 900, 1400];
let acOn = false, fanLevel = 0;
let airSource = null, airGain = null, airFilter = null, airBuffer = null;

function getNoiseBuffer() {
    if (!airBuffer) {
        const size = audioCtx.sampleRate * 2;
        airBuffer = audioCtx.createBuffer(1, size, audioCtx.sampleRate);
        const d = airBuffer.getChannelData(0);
        for (let i = 0; i < size; i++) d[i] = Math.random() * 2 - 1;
    }
    return airBuffer;
}

let scrubSource = null, scrubGain = null, lastSteerAngle = 0;
function updateScrubSound() {
    const vel = Math.abs(steeringAngle - lastSteerAngle);
    lastSteerAngle = steeringAngle;
    if (!audioCtx || audioCtx.state !== 'running') return;
    const level = (gameActive && speed < 0.05) ? Math.min(0.07, vel * 0.04) : 0;
    if (!scrubSource) {
        if (level < 0.004) return;
        scrubSource = audioCtx.createBufferSource();
        scrubSource.buffer = getNoiseBuffer();
        scrubSource.loop = true;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass'; filter.frequency.value = 420;
        scrubGain = audioCtx.createGain();
        scrubGain.gain.value = 0;
        scrubSource.connect(filter); filter.connect(scrubGain); scrubGain.connect(audioCtx.destination);
        scrubSource.start();
    }
    scrubGain.gain.setTargetAtTime(level, audioCtx.currentTime, 0.05);
}

function setFanSound(level) {
    if (level === 0) {
        if (airSource) {
            const src = airSource;
            airGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.05);
            setTimeout(() => { try { src.stop(); } catch (e) {} }, 400);
            airSource = null;
        }
        return;
    }
    ensureAudio();
    if (!airSource) {
        getNoiseBuffer();
        airSource = audioCtx.createBufferSource();
        airSource.buffer = airBuffer;
        airSource.loop = true;
        airFilter = audioCtx.createBiquadFilter();
        airFilter.type = 'bandpass'; airFilter.Q.value = 0.4;
        airGain = audioCtx.createGain();
        airGain.gain.value = 0;
        airSource.connect(airFilter); airFilter.connect(airGain); airGain.connect(audioCtx.destination);
        airSource.start();
    }
    const t = audioCtx.currentTime;
    airFilter.frequency.setTargetAtTime(FAN_FREQ[level], t, 0.08);
    airGain.gain.setTargetAtTime(FAN_GAIN[level], t, 0.1);
}

function refreshClimateUI() {
    acBtn.classList.toggle('on', acOn);
    fanBtn.classList.toggle('on', fanLevel > 0);
    document.getElementById('ac-state').textContent = acOn ? 'ON' : 'OFF';
    document.getElementById('fan-state').textContent = FAN_LABELS[fanLevel];
    document.getElementById('temp-state').textContent = acOn ? '22°C' : '--';
    document.getElementById('climate-strip').classList.toggle('ac-on', acOn);
    vents.forEach(v => v.classList.toggle('air-on', fanLevel > 0));
}

acBtn.addEventListener('click', () => {
    acOn = !acOn;
    refreshClimateUI();
    showToast(acOn ? '❄️ A/C ON' : 'A/C OFF', 'rgba(0, 90, 190, 0.92)');
});
fanBtn.addEventListener('click', () => {
    fanLevel = (fanLevel + 1) % 4;
    refreshClimateUI();
    setFanSound(fanLevel);
});

const portNames = { 'HDMI': 'HDMI display', 'AUX': 'Headphones', 'USB-A': 'USB phone charger', 'USB-C': 'USB-C fast charger' };
document.querySelectorAll('.port').forEach(port => port.addEventListener('click', () => {
    const on = port.classList.toggle('active');
    showToast(`${portNames[port.dataset.port]} ${on ? 'connected' : 'disconnected'}`, 'rgba(0, 105, 120, 0.92)');
}));
