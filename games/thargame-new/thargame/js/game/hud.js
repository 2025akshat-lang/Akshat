/* thargame/js/game/hud.js
   HUD element references + updateHUD() (speedometer, fuel, indicators, drift HUD) */
const wheelEl = document.getElementById('steering-wheel');
const charmEl = document.getElementById('hanging-charm');
const speedEl = document.getElementById('speed-display');
const accelEl = document.getElementById('accel-display');
const rpmEl = document.getElementById('rpm-display');
const gearEl = document.getElementById('gear-display');
const distEl = document.getElementById('dist-val');
const fuelFillEl = document.getElementById('fuel-fill');
const fuelPctTxt = document.getElementById('fuel-pct-txt');
const topFuelWidget = document.getElementById('top-fuel-widget');
const fillGasPopup = document.getElementById('fill-gas-popup');
const indLeftEl = document.getElementById('ind-left');
const indRightEl = document.getElementById('ind-right');
const wiperLeftEl = document.getElementById('wiper-left');
const wiperRightEl = document.getElementById('wiper-right');
const driftScoreHud = document.getElementById('drift-score-hud');
const driftPtsEl = document.getElementById('drift-pts');
let lastBlinkState = false;

function updateHUD() {
    updateScrubSound();
    if (lightStates.wiper) {
        wiperPhase += 0.12;
        const angle = (-Math.abs(Math.sin(wiperPhase)) * 100).toFixed(1);
        wiperLeftEl.style.transform = wiperRightEl.style.transform = `rotate(${angle}deg)`;
        hudCache.wiperRest = false;
    } else if (!hudCache.wiperRest) {
        wiperLeftEl.style.transform = wiperRightEl.style.transform = 'rotate(0deg)';
        hudCache.wiperRest = true;
    }

    if (driftScore > 0 && driftTimer > 0) {
        driftScoreHud.style.display = 'block';
        driftPtsEl.textContent = driftScore + " PTS";
    } else {
        driftScoreHud.style.display = 'none';
    }

    const fuelPct = fuel.toFixed(0) + "%";
    if (changed('fuelW', fuelPct)) fuelFillEl.style.width = fuelPct;
    if (changed('fuelT', Math.ceil(fuel))) fuelPctTxt.textContent = Math.ceil(fuel) + "%";

    const lowState = fuel <= 0 ? 2 : (fuel <= 18 ? 1 : 0);
    if (changed('fuelLow', lowState)) {
        const low = lowState > 0;
        fuelFillEl.style.background = low ? "#ff3b30" : "#32d74b";
        topFuelWidget.classList.toggle('fuel-low-blink', low);
        fillGasPopup.style.display = low ? 'block' : 'none';
        if (low) fillGasPopup.textContent = lowState === 2 ? "⛽ TANK EMPTY! TAP TO FILL GAS" : "⛽ LOW FUEL! TAP TO FILL GAS";
    }

    const gForce = (speed - prevSpeed) * 140;
    const gText = (gForce >= 0 ? "+" : "") + gForce.toFixed(2) + " G";
    if (changed('g', gText)) {
        accelEl.textContent = gText;
        accelEl.style.color = gForce > 0.03 ? "#32d74b" : (gForce < -0.04 ? "#ff453a" : "#00e5ff");
    }

    const activeDir = manualIndicator !== 0 ? manualIndicator : (steeringAngle < -18 ? -1 : (steeringAngle > 18 ? 1 : 0));
    const blinkPulse = Math.floor(Date.now() / 320) % 2 === 0;
    if (activeDir !== 0 && blinkPulse !== lastBlinkState) {
        playIndicatorTick(blinkPulse);
        lastBlinkState = blinkPulse;
    }
    const leftOn = activeDir === -1 && blinkPulse;
    const rightOn = activeDir === 1 && blinkPulse;
    if (changed('indL', leftOn)) indLeftEl.classList.toggle('blink-on', leftOn);
    if (changed('indR', rightOn)) indRightEl.classList.toggle('blink-on', rightOn);

    const wheelDeg = steeringAngle.toFixed(1);
    if (changed('wheel', wheelDeg)) wheelEl.style.transform = `rotate(${wheelDeg}deg)`;
    const swing = ((-steeringAngle / 140) * 22 + Math.sin(distance * 35) * (speed * 5)).toFixed(2);
    charmEl.style.transform = `rotate(${swing}deg) translateY(${(suspensionY * 35).toFixed(2)}px)`;

    const kmh = Math.min(130, Math.round(speed * 100));
    if (changed('kmh', kmh)) {
        speedEl.textContent = kmh;
        gearEl.textContent = !engineRunning ? "OFF" : (kmh === 0 ? "N" : (kmh < 25 ? "D1" : (kmh < 50 ? "D2" : (kmh < 80 ? "D3" : (kmh < 105 ? "D4" : "D5")))));
    }
    const distText = distance.toFixed(2) + " km";
    if (changed('dist', distText)) distEl.textContent = distText;
    const rpmText = !engineRunning ? "0.0" : (0.8 + (speed / maxSpeed) * 4.5 + (keys.gas ? 0.45 : 0)).toFixed(1);
    if (changed('rpm', rpmText)) rpmEl.textContent = rpmText;
}
