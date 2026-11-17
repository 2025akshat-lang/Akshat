/* thargame/js/game/state.js
   Game variables (speed, fuel, lives, drift score), refuel, toast, resetGame(), handleHit() */
let gameActive = false;
let lives = 3, invulnerableTimer = 0;
let tharLocalX = 2.5;
let driftVelocityX = 0;
let speed = 0, prevSpeed = 0, coastHoldTimer = 0;
const maxSpeed = 1.25;
let distance = 0;
let fuel = 85, lowFuelChimeTimer = 0;
let driftScore = 0, driftTimer = 0;

function refillGas() {
    if (!gameActive) return;
    fuel = 100;
    document.getElementById('fill-gas-popup').style.display = 'none';
    document.getElementById('top-fuel-widget').classList.remove('fuel-low-blink');
    showToast("⛽ Diesel Tank Full (100%)!", "rgba(46, 125, 50, 0.92)");
}
document.getElementById('top-fuel-widget').addEventListener('click', refillGas);
document.getElementById('fill-gas-popup').addEventListener('click', refillGas);

let suspensionY = 0, suspensionVel = 0;

let toastTimer = 0;
function showToast(text, bg = "rgba(211, 47, 47, 0.92)") {
    const toast = document.getElementById('toast-msg');
    toast.textContent = text;
    toast.style.background = bg;
    toast.style.display = 'block';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.style.display = 'none'; }, 2000);
}

function updateLivesUI() {
    document.getElementById('lives-val').textContent = '❤️'.repeat(Math.max(0, lives)) + '🖤'.repeat(Math.max(0, 3 - lives));
}

function resetGame() {
    lives = 3; updateLivesUI();
    invulnerableTimer = 60;
    tharLocalX = 2.5;
    driftVelocityX = 0;
    speed = 0; prevSpeed = 0; coastHoldTimer = 0;
    distance = 0; fuel = 85; lowFuelChimeTimer = 0;
    targetSteeringAngle = 0; steeringAngle = 0;
    suspensionY = 0; suspensionVel = 0;
    roadPhase = 0;
    driftScore = 0;
    engineRunning = false;
    engineBtn.classList.remove('running');
    engineBtn.innerHTML = 'ENGINE<br>START';
    stopEngineIdleLoop();

    applyZone(currentZoneIdx);

    document.getElementById('fill-gas-popup').style.display = 'none';
    document.getElementById('overlay-screen').style.display = 'none';
    gameActive = true;
    syncLightButtons();
    showToast("👉 Tap 'ENGINE START' near steering to ignite!", "rgba(0, 110, 200, 0.95)");
}
document.getElementById('start-btn').addEventListener('click', () => { ensureAudio(); resetGame(); });

function handleHit(reason) {
    if (invulnerableTimer > 0) return;
    lives--;
    updateLivesUI();
    invulnerableTimer = 95;
    speed *= 0.45; coastHoldTimer = 90;
    suspensionVel = 0.09;
    playPotholeThud();

    const vig = document.getElementById('smog-vignette');
    vig.classList.add('hit');
    setTimeout(() => vig.classList.remove('hit'), 250);

    if (lives > 0) {
        showToast(`⚠️ ${reason} (${lives} ${lives === 1 ? 'life' : 'lives'} left!)`);
    } else {
        gameActive = false; speed = 0; stopContinuousHorn(); stopEngineIdleLoop();
        const ov = document.getElementById('overlay-screen');
        ov.querySelector('h1').innerText = "GAME OVER!";
        ov.querySelector('p').innerHTML = `${reason}<br>Total Distance: <b>${distance.toFixed(2)} km</b> | Drift Score: <b>${driftScore} PTS</b>`;
        document.getElementById('start-btn').innerText = "TRY AGAIN";
        ov.style.display = 'flex';
    }
}
