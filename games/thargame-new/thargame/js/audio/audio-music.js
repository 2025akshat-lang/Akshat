/* thargame/js/audio/audio-music.js
   FM radio / music tracks + glovebox toggle */
const tracks = [
    { name: "FM 98.3 Mirchi Delhi", notes: [261.6, 329.6, 392.0, 493.9] },
    { name: "NH-9 Highway Beats", notes: [220.0, 261.6, 329.6, 392.0] },
    { name: "Hill Folk Lo-Fi", notes: [196.0, 246.9, 293.7, 392.0] }
];
let currentTrack = 0, musicPlaying = false, musicInterval = null, noteIdx = 0;

function playNote() {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    const freqs = tracks[currentTrack].notes;
    osc.frequency.setValueAtTime(freqs[noteIdx % freqs.length], audioCtx.currentTime);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.35);
    noteIdx++;
}
function startMusicLoop() { if (!musicInterval) musicInterval = setInterval(playNote, 420); }
function stopMusicLoop() { clearInterval(musicInterval); musicInterval = null; }

document.getElementById('music-toggle').addEventListener('click', () => {
    ensureAudio();
    musicPlaying = !musicPlaying;
    document.getElementById('music-toggle').textContent = musicPlaying ? "⏸" : "▶";
    document.getElementById('track-status').textContent = musicPlaying ? "Playing • Cabin Audio ON" : "Paused • Tap ▶ for Audio";
    if (musicPlaying) startMusicLoop(); else stopMusicLoop();
});
document.getElementById('music-next').addEventListener('click', () => {
    currentTrack = (currentTrack + 1) % tracks.length;
    document.getElementById('track-name').textContent = tracks[currentTrack].name;
});

const glovebox = document.getElementById('glovebox');
glovebox.addEventListener('click', () => {
    glovebox.classList.toggle('open');
    document.getElementById('glove-content').innerText = glovebox.classList.contains('open')
        ? "📄 RC, PUC & Fuel Card" : "SIDE DRAWER (TAP)";
});
