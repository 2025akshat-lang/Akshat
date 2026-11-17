/* thargame/js/main.js
   Resize, visibility pause, matrix freeze, START of the loop (hamesha LAST file) */
let resizePending = false;
window.addEventListener('resize', () => {
    if (resizePending) return;
    resizePending = true;
    requestAnimationFrame(() => {
        resizePending = false;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderBudget = 3;
    });
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopMusicLoop();
        stopContinuousHorn();
        stopEngineIdleLoop();
        setFanSound(0);
    } else {
        lastTime = performance.now();
        accumulator = 0;
        if (musicPlaying) startMusicLoop();
        if (engineRunning) startEngineIdleLoop();
        if (fanLevel > 0) setFanSound(fanLevel);
    }
});
document.addEventListener('contextmenu', e => e.preventDefault());

[...roadSegments.map(s => s.group), ...streetLightList.map(s => s.group), ...sceneryList.map(s => s.prop),
 ...potholeList.map(p => p.mesh), ...signalList.map(s => s.group), ...cartList.map(t => t.mesh), roundaboutGroup, tharGroup
].forEach(group => {
    group.children.forEach(child => child.traverse(o => { o.updateMatrix(); o.matrixAutoUpdate = false; }));
});

lastTime = performance.now();
updateView();
requestAnimationFrame(animate);
