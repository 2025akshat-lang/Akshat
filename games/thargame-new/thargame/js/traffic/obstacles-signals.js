/* thargame/js/traffic/obstacles-signals.js
   Potholes, speed bumps, traffic signals, traffic AI target speed */
const pitGeo = new THREE.CircleGeometry(0.85, 10);
const pitMat = new THREE.MeshBasicMaterial({ color: 0x2a1d11 });
const pitRimGeo = new THREE.RingGeometry(0.85, 1.25, 14);
const pitRimMat = new THREE.MeshBasicMaterial({ color: 0x4e3722 });
const bumpCanvas = document.createElement('canvas');
bumpCanvas.width = 128; bumpCanvas.height = 8;
const bumpCtx = bumpCanvas.getContext('2d');
for (let i = 0; i < 8; i++) { bumpCtx.fillStyle = i % 2 ? '#1c1c1e' : '#fbc02d'; bumpCtx.fillRect(i * 16, 0, 16, 8); }
const bumpTex = new THREE.CanvasTexture(bumpCanvas);
bumpTex.wrapS = THREE.RepeatWrapping;
bumpTex.repeat.set(3, 1);
const bumpGeo = new THREE.BoxGeometry(18, 0.16, 1.6);
const bumpMat = mkMat({ map: bumpTex, roughness: 0.8 });
const sigPoleGeo = new THREE.CylinderGeometry(0.1, 0.12, 5, 6);
const sigArmGeo = new THREE.BoxGeometry(5.5, 0.1, 0.1);
const sigTimerGeo = new THREE.PlaneGeometry(0.8, 0.5);
const SIGNAL_TIMES = [15, 12, 3];
const sigHeadGeo = new THREE.BoxGeometry(0.5, 1.2, 0.4);
const sigLampGeo = new THREE.SphereGeometry(0.19, 8, 6);
const sigLineGeo = new THREE.PlaneGeometry(9, 0.5);
const sigDarkMat = mkMat({ color: 0x18181b, roughness: 0.6 });
const sigLineMat = new THREE.MeshBasicMaterial({ color: 0xe8e8e8 });

function applySignalState(s) {
    s.redMat.color.setHex(s.state === 0 ? 0xff1a1a : 0x330808);
    s.yellowMat.color.setHex(s.state === 2 ? 0xffc400 : 0x332a00);
    s.greenMat.color.setHex(s.state === 1 ? 0x22ff55 : 0x07300f);
}

function drawSignalTimer(s) {
    const secs = Math.max(0, Math.ceil(s.t));
    const key = s.state * 100 + secs;
    if (s.drawn === key) return;
    s.drawn = key;
    const c = s.ctx;
    c.fillStyle = '#050505'; c.fillRect(0, 0, 64, 40);
    c.strokeStyle = '#444'; c.strokeRect(1, 1, 62, 38);
    c.fillStyle = ['#ff3b30', '#32d74b', '#ffd60a'][s.state];
    c.font = 'bold 30px monospace'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(String(secs).padStart(2, '0'), 32, 22);
    s.tex.needsUpdate = true;
}

function stepSignals() {
    for (let i = 0; i < signalList.length; i++) {
        const s = signalList[i];
        s.t -= 1 / 60;
        if (s.t <= 0) {
            s.state = s.state === 0 ? 1 : (s.state === 1 ? 2 : 0);
            s.t = SIGNAL_TIMES[s.state];
            applySignalState(s);
        }
        drawSignalTimer(s);
    }
}

function trafficTarget(v) {
    let target = v.speed;
    const dir = v.isOncoming ? 1 : -1;
    const vz = v.mesh.position.z;
    for (let i = 0; i < signalList.length; i++) {
        const s = signalList[i];
        if (!s.group.visible || s.state === 1) continue;
        const lineZ = s.group.position.z + (v.isOncoming ? -2.5 : 2.5);
        const gap = (lineZ - vz) * dir - v.length / 2;
        if (gap > -0.3 && gap < 16 && !(s.state === 2 && gap < 6)) {
            target = Math.min(target, gap < 1 ? 0 : v.speed * Math.min(1, (gap - 1) / 12));
        }
    }
    for (let j = 0; j < trafficList.length; j++) {
        const w = trafficList[j];
        if (w === v || w.isOncoming !== v.isOncoming || Math.abs(w.laneOffset - v.laneOffset) > 0.5) continue;
        const gap = (w.mesh.position.z - vz) * dir - (v.length + w.length) / 2;
        if (gap > -0.5 && gap < 6) {
            target = Math.min(target, gap < 1.5 ? 0 : Math.min(v.speed, w.curSpeed + (gap - 1.5) * 0.03));
        }
    }
    return target;
}
