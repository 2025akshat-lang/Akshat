/* thargame/js/input/controls.js
   Steering wheel drag, horn pad, pedals, keyboard, left/right buttons */
let targetSteeringAngle = 0, steeringAngle = 0, isDraggingWheel = false, lastPointerAngle = 0;

function getAngleFromCenter(clientX, clientY) {
    const rect = wheelWrapper.getBoundingClientRect();
    return Math.atan2(clientY - (rect.top + rect.height / 2), clientX - (rect.left + rect.width / 2)) * (180 / Math.PI);
}

wheelWrapper.addEventListener('pointerdown', (e) => {
    if (e.target.closest('#horn-pad')) return;
    isDraggingWheel = true;
    lastPointerAngle = getAngleFromCenter(e.clientX, e.clientY);
    wheelWrapper.setPointerCapture(e.pointerId);
});

wheelWrapper.addEventListener('pointermove', (e) => {
    if (!isDraggingWheel) return;
    const currentAngle = getAngleFromCenter(e.clientX, e.clientY);
    let delta = currentAngle - lastPointerAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    targetSteeringAngle = Math.max(-140, Math.min(140, targetSteeringAngle + delta * 1.1));
    lastPointerAngle = currentAngle;
});

const releaseWheel = () => { isDraggingWheel = false; };
wheelWrapper.addEventListener('pointerup', releaseWheel);
wheelWrapper.addEventListener('pointercancel', releaseWheel);

const hornPad = document.getElementById('horn-pad');
hornPad.addEventListener('pointerdown', (e) => { e.stopPropagation(); startContinuousHorn(); });
hornPad.addEventListener('pointerup', stopContinuousHorn);
hornPad.addEventListener('pointerleave', stopContinuousHorn);
hornPad.addEventListener('pointercancel', stopContinuousHorn);

const keys = { left: false, right: false, gas: false, brake: false };
const accelPedal = document.getElementById('accel-pedal');
const brakePedal = document.getElementById('brake-pedal');

accelPedal.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    if (!engineRunning) {
        showToast("⚠️ .", "rgba(255, 140, 0, 0.95)");
        return;
    }
    keys.gas = true;
    accelPedal.classList.add('pressed');
});
const releaseAccel = () => { if (keys.gas) coastHoldTimer = 115; keys.gas = false; accelPedal.classList.remove('pressed'); };
accelPedal.addEventListener('pointerup', releaseAccel);
accelPedal.addEventListener('pointerleave', releaseAccel);
accelPedal.addEventListener('pointercancel', releaseAccel);

brakePedal.addEventListener('pointerdown', (e) => { e.preventDefault(); keys.brake = true; coastHoldTimer = 0; brakePedal.classList.add('pressed'); });
const releaseBrake = () => { if (keys.brake) coastHoldTimer = 130; keys.brake = false; brakePedal.classList.remove('pressed'); };
brakePedal.addEventListener('pointerup', releaseBrake);
brakePedal.addEventListener('pointerleave', releaseBrake);
brakePedal.addEventListener('pointercancel', releaseBrake);

window.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        if (!engineRunning) {
            showToast("⚠️ Press ENGINE START button first!", "rgba(255, 140, 0, 0.95)");
            return;
        }
        keys.gas = true; accelPedal.classList.add('pressed');
    }
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') { keys.brake = true; coastHoldTimer = 0; brakePedal.classList.add('pressed'); }
    if (e.key === 'h' || e.key === 'H') startContinuousHorn();
});
window.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') releaseAccel();
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') releaseBrake();
    if (e.key === 'h' || e.key === 'H') stopContinuousHorn();
});

const bindHoldBtn = (id, key) => {
    const el = document.getElementById(id);
    el.addEventListener('pointerdown', (e) => { e.preventDefault(); keys[key] = true; });
    el.addEventListener('pointerup', () => keys[key] = false);
    el.addEventListener('pointerleave', () => keys[key] = false);
};
bindHoldBtn('left-btn', 'left'); bindHoldBtn('right-btn', 'right');
