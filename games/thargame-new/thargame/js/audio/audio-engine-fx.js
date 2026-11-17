/* thargame/js/audio/audio-engine-fx.js
   AudioContext, engine start/idle, horn, indicator tick, spray, low-fuel, pothole sounds */
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
let hornOsc1 = null, hornOsc2 = null, hornGain = null;
let engineRunning = false;
let engineOsc = null, engineGain = null, engineFilter = null;

function ensureAudio() {
    if (!AudioCtx) return;
    if (!audioCtx) audioCtx = new AudioCtx();
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

// REALISTIC DIESEL ENGINE START SOUND & CONTINUOUS IDLE RUMBLE
function playEngineStartSound() {
    ensureAudio();
    const now = audioCtx.currentTime;

    // Starter motor cranking pulses
    for (let i = 0; i < 4; i++) {
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140 + i * 25, now + i * 0.14);
        osc.frequency.exponentialRampToValueAtTime(220 + i * 35, now + i * 0.14 + 0.11);
        g.gain.setValueAtTime(0.08, now + i * 0.14);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.14 + 0.12);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(now + i * 0.14);
        osc.stop(now + i * 0.14 + 0.13);
    }

    // Engine ignition rev roar
    const revOsc = audioCtx.createOscillator();
    const revGain = audioCtx.createGain();
    revOsc.type = 'sawtooth';
    revOsc.frequency.setValueAtTime(48, now + 0.52);
    revOsc.frequency.exponentialRampToValueAtTime(115, now + 0.78);
    revOsc.frequency.exponentialRampToValueAtTime(52, now + 1.25);
    revGain.gain.setValueAtTime(0.01, now + 0.52);
    revGain.gain.linearRampToValueAtTime(0.22, now + 0.72);
    revGain.gain.exponentialRampToValueAtTime(0.06, now + 1.25);

    const lpf = audioCtx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.value = 320;
    revOsc.connect(lpf); lpf.connect(revGain); revGain.connect(audioCtx.destination);
    revOsc.start(now + 0.52);
    revOsc.stop(now + 1.3);

    // Start continuous diesel idle loop
    setTimeout(() => {
        if (!engineRunning) return;
        startEngineIdleLoop();
    }, 1200);
}

function startEngineIdleLoop() {
    if (engineOsc || !audioCtx) return;
    engineOsc = audioCtx.createOscillator();
    engineFilter = audioCtx.createBiquadFilter();
    engineGain = audioCtx.createGain();

    engineOsc.type = 'sawtooth';
    engineOsc.frequency.setValueAtTime(42, audioCtx.currentTime);
    engineFilter.type = 'lowpass';
    engineFilter.frequency.setValueAtTime(180, audioCtx.currentTime);
    engineGain.gain.setValueAtTime(0.06, audioCtx.currentTime);

    engineOsc.connect(engineFilter);
    engineFilter.connect(engineGain);
    engineGain.connect(audioCtx.destination);
    engineOsc.start();
}

function stopEngineIdleLoop() {
    if (engineOsc) {
        try {
            engineGain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
            engineOsc.stop(audioCtx.currentTime + 0.16);
        } catch (e) {}
        engineOsc = null;
    }
}

const engineBtn = document.getElementById('engine-btn');
engineBtn.addEventListener('click', () => {
    ensureAudio();
    engineRunning = !engineRunning;
    if (engineRunning) {
        engineBtn.classList.add('running');
        engineBtn.innerHTML = 'ENGINE<br>ON';
        playEngineStartSound();
        lightStates.dash = true;
        syncLightButtons();
        showToast("🔑 Thar 4x4 Diesel Engine Started!", "rgba(46, 125, 50, 0.92)");
    } else {
        engineBtn.classList.remove('running');
        engineBtn.innerHTML = 'ENGINE<br>START';
        stopEngineIdleLoop();
        showToast("🛑 Engine Switched OFF", "rgba(180, 40, 40, 0.92)");
    }
});

function startContinuousHorn() {
    ensureAudio();
    if (hornOsc1) return;
    hornOsc1 = audioCtx.createOscillator();
    hornOsc2 = audioCtx.createOscillator();
    hornGain = audioCtx.createGain();
    hornOsc1.type = 'sawtooth'; hornOsc2.type = 'sawtooth';
    hornOsc1.frequency.setValueAtTime(410, audioCtx.currentTime);
    hornOsc2.frequency.setValueAtTime(510, audioCtx.currentTime);

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass'; filter.frequency.setValueAtTime(1400, audioCtx.currentTime);
    hornGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    hornGain.gain.linearRampToValueAtTime(0.16, audioCtx.currentTime + 0.04);

    hornOsc1.connect(filter); hornOsc2.connect(filter);
    filter.connect(hornGain); hornGain.connect(audioCtx.destination);
    hornOsc1.start(); hornOsc2.start();
    document.getElementById('horn-pad').classList.add('honking');
}

function stopContinuousHorn() {
    if (hornOsc1) {
        try {
            hornGain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
            hornOsc1.stop(audioCtx.currentTime + 0.06);
            hornOsc2.stop(audioCtx.currentTime + 0.06);
        } catch (e) {}
        hornOsc1 = null; hornOsc2 = null;
    }
    document.getElementById('horn-pad').classList.remove('honking');
}

function playIndicatorTick(high) {
    if (!audioCtx || audioCtx.state !== 'running') return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(high ? 920 : 680, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.035, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.03);
}

let sprayBuffer = null;
function playSpraySound() {
    ensureAudio();
    if (!sprayBuffer) {
        const size = Math.floor(audioCtx.sampleRate * 0.35);
        sprayBuffer = audioCtx.createBuffer(1, size, audioCtx.sampleRate);
        const data = sprayBuffer.getChannelData(0);
        for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = sprayBuffer;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass'; filter.frequency.value = 3200;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
    noise.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination);
    noise.start();
}

function playLowFuelTinTin() {
    ensureAudio();
    [0, 0.22].forEach(delay => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1320, audioCtx.currentTime + delay);
        gain.gain.setValueAtTime(0.11, audioCtx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + 0.16);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + delay);
        osc.stop(audioCtx.currentTime + delay + 0.16);
    });
}

function playPotholeThud() {
    ensureAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(32, audioCtx.currentTime + 0.22);
    gain.gain.setValueAtTime(0.28, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.22);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.22);
}
