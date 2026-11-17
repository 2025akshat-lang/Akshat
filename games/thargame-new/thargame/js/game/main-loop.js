/* thargame/js/game/main-loop.js
   animate(): fixed timestep game loop */
function animate(now) {
    requestAnimationFrame(animate);

    if (portraitQuery.matches || document.hidden) {
        lastTime = now;
        return;
    }

    const delta = Math.min(now - lastTime, 90);
    lastTime = now;
    let steps = 0;

    if (gameActive) {
        accumulator += delta;
        while (accumulator >= STEP_MS && steps < 5 && gameActive) {
            stepGame();
            accumulator -= STEP_MS;
            steps++;
        }
        if (accumulator > STEP_MS) accumulator = 0;

        frameAvg += (delta - frameAvg) * 0.05;
        if (++frameCount % 90 === 0) adaptQuality();
    }

    if (steps > 0) {
        updateHUD();
        renderBudget = 3;
    } else if (renderBudget <= 0) {
        return;
    } else {
        renderBudget--;
    }

    updateView();
    renderAll();
}
