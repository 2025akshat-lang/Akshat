/* thargame/js/game/physics.js
   Loop constants + stepGame(): car physics, drift, collisions, world movement */
const STEP_MS = 1000 / 60;
const MOVE = 1.35;
const portraitQuery = window.matchMedia('(orientation: portrait)');
const hudCache = {};
let mirrorFrame = 0;
let lastTime = 0, accumulator = 0, mirrorTick = 0, renderBudget = 6, viewX = 0, viewY = 0;
let frameAvg = 16.7, frameCount = 0;
let pixelRatio = renderer.getPixelRatio();
const MIN_PIXEL_RATIO = Q_LOW ? 0.5 : 0.75;

function changed(key, value) {
    if (hudCache[key] === value) return false;
    hudCache[key] = value;
    return true;
}

function stepGame() {
    if (invulnerableTimer > 0) invulnerableTimer--;
    prevSpeed = speed;

    if (!engineRunning || fuel <= 0) {
        speed = Math.max(0, speed - (keys.brake ? 0.0055 + speed * 0.004 : 0.0018));
    } else if (keys.gas) {
        const accelRate = 0.0024 * (1.15 - (speed / maxSpeed) * 0.55);
        speed = Math.min(maxSpeed, speed + accelRate);
        coastHoldTimer = 115;
        fuel = Math.max(0, fuel - 0.022);
    } else if (keys.brake) {
        speed = Math.max(0, speed - (0.0048 + speed * 0.0038));
    } else {
        if (coastHoldTimer > 0) coastHoldTimer--;
        else speed = Math.max(0, speed - 0.0006);
        if (speed > 0.01) fuel = Math.max(0, fuel - 0.0025);
    }

    // Update Engine Sound Pitch dynamically with speed
    if (engineOsc && audioCtx) {
        engineOsc.frequency.setTargetAtTime(42 + speed * 75 + (keys.gas ? 18 : 0), audioCtx.currentTime, 0.08);
    }

    if (fuel <= 18 && --lowFuelChimeTimer <= 0) {
        playLowFuelTinTin();
        lowFuelChimeTimer = 200;
    }

    const turnSpeed = 2.6 + steeringSmoothness * 4.6;
    if (keys.left) targetSteeringAngle = Math.max(-140, targetSteeringAngle - turnSpeed);
    else if (keys.right) targetSteeringAngle = Math.min(140, targetSteeringAngle + turnSpeed);
    else if (!isDraggingWheel) targetSteeringAngle *= (0.95 - steeringSmoothness * 0.10);
    steeringAngle += (targetSteeringAngle - steeringAngle) * (0.10 + (1.0 - steeringSmoothness) * 0.25);

    const prevCurveX = getRoadCurveX(0);
    roadPhase += speed * MOVE * roadCurveFreq;
    const newCurveX = getRoadCurveX(0);
    // Road bends laterally! If player doesn't steer into the turn, car drifts relative to road center!
    const roadLateralShift = newCurveX - prevCurveX;
    tharLocalX -= roadLateralShift * 0.88;

    const steerNorm = steeringAngle / 140;

    // Drift & Dirt Off-Road Slip Physics
    const isDirtOrHill = zones[currentZoneIdx].roadType !== 'asphalt';
    const slipThreshold = isDirtOrHill ? 0.42 : 0.55;
    const slipFactor = Math.abs(steerNorm);
    const targetDriftX = steerNorm * (isDirtOrHill ? 0.15 : 0.12) * (0.5 + speed * 0.85);

    if (slipFactor > slipThreshold && speed > 0.26) {
        driftVelocityX += (targetDriftX - driftVelocityX) * 0.13;
        driftScore += Math.round(speed * slipFactor * 20);
        driftTimer = 45;
        smokeMat.color.setHex(isDirtOrHill ? 0xa68256 : 0xd0d0d0);
        smokeMat.opacity = 0.6;
        const pArr = smokeParticles.geometry.attributes.position.array;
        pArr[smokeIdx * 3] = viewX + (Math.random() - 0.5) * 1.3;
        pArr[smokeIdx * 3 + 1] = viewY + 0.25;
        pArr[smokeIdx * 3 + 2] = 0.5;
        smokeParticles.geometry.attributes.position.needsUpdate = true;
        smokeIdx = (smokeIdx + 1) % smokePartCount;
    } else {
        driftVelocityX *= 0.82;
        if (driftTimer > 0) driftTimer--;
        else smokeMat.opacity = Math.max(0, smokeMat.opacity - 0.05);
    }

    tharLocalX += (steerNorm * 0.115 * (0.45 + speed * 0.70) * Math.min(1, speed / 0.14)) + driftVelocityX;

    // Edge Guardrail / Cliff Impact Check
    const xLimit = 8.4;
    if (Math.abs(tharLocalX) > xLimit) {
        tharLocalX = Math.sign(tharLocalX) * xLimit;
        if (speed > 0.35) {
            suspensionVel = 0.07;
            speed *= 0.92;
        }
    }

    suspensionVel = (suspensionVel - 0.18 * suspensionY) * 0.80;
    suspensionY += suspensionVel;
    distance += speed * 0.014;

    const move = speed * MOVE;
    for (let i = 0; i < roadSegments.length; i++) {
        const seg = roadSegments[i];
        seg.group.position.z += move;
        if (seg.group.position.z > 50) seg.group.position.z -= actualSegCount * segLen;
        seg.group.position.x = getRoadCurveX(seg.group.position.z);
        seg.group.position.y = getRoadElevationY(seg.group.position.z);
        // Tilt road segment with slope
        const nextY = getRoadElevationY(seg.group.position.z - segLen);
        seg.group.rotation.x = Math.atan2(nextY - seg.group.position.y, segLen);
    }

    if (roundaboutGroup.visible) {
        roundaboutGroup.position.z += move;
        if (roundaboutGroup.position.z > 40) {
            if (zones[currentZoneIdx].roundabout) roundaboutGroup.position.z = -320 - Math.random() * 180;
            else roundaboutGroup.visible = false;
        }
        roundaboutGroup.position.x = getRoadCurveX(roundaboutGroup.position.z);
        roundaboutGroup.position.y = getRoadElevationY(roundaboutGroup.position.z);
        const carX = getRoadCurveX(0) + tharLocalX;
        if (Math.hypot(roundaboutGroup.position.x - carX, roundaboutGroup.position.z + 1.8) < 4.5) {
            handleHit("Crashed into the roundabout!");
        }
    }

    for (let i = 0; i < sceneryList.length; i++) {
        const s = sceneryList[i];
        s.prop.position.z += move;
        if (s.prop.position.z > 30) s.prop.position.z -= SC_N * SC_SP;
        s.prop.position.x = getRoadCurveX(s.prop.position.z);
        s.prop.position.y = getRoadElevationY(s.prop.position.z);
    }

    for (let i = 0; i < streetLightList.length; i++) {
        const sl = streetLightList[i];
        if (!sl.group.visible) continue;
        sl.group.position.z += move;
        if (sl.group.position.z > 45) sl.group.position.z -= 280;
        sl.group.position.x = getRoadCurveX(sl.group.position.z);
        sl.group.position.y = getRoadElevationY(sl.group.position.z);
    }

    if (smogParticles.visible) {
        const pArr = smogParticles.geometry.attributes.position.array;
        const dz = speed * 1.15 + 0.04;
        for (let i = 2; i < pArr.length; i += 3) {
            pArr[i] += dz;
            if (pArr[i] > 20) pArr[i] = -100;
        }
    }

    for (let i = 0; i < potholeList.length; i++) {
        const ph = potholeList[i];
        ph.mesh.position.z += move;
        if (ph.hitCooldown > 0) ph.hitCooldown--;
        if (ph.mesh.position.z > 25) {
            ph.mesh.position.z = -280 - Math.random() * 40;
            ph.laneOffset = [-6.5, -2.5, 2.5, 6.5][Math.floor(Math.random() * 4)];
            ph.depth = 0.7 + Math.random() * 0.9;
            ph.mesh.scale.set(ph.depth, 1, ph.depth);
        }
        ph.mesh.position.x = getRoadCurveX(ph.mesh.position.z) + ph.laneOffset;
        ph.mesh.position.y = getRoadElevationY(ph.mesh.position.z) + 0.02;

        if (Math.abs(ph.mesh.position.z + 1.6) < 1.15 * ph.depth && Math.abs(ph.laneOffset - tharLocalX) < 1.3 * ph.depth && speed > 0.08 && ph.hitCooldown === 0) {
            ph.hitCooldown = 40;
            suspensionVel = -0.16 * ph.depth * (0.5 + speed * 0.75);
            playPotholeThud();
        }
    }

    stepSignals();

    for (let i = 0; i < bumpList.length; i++) {
        const b = bumpList[i];
        b.mesh.position.z += move;
        if (b.hitCooldown > 0) b.hitCooldown--;
        if (b.mesh.position.z > 25) b.mesh.position.z = -300 - Math.random() * 80;
        b.mesh.position.x = getRoadCurveX(b.mesh.position.z);
        b.mesh.position.y = getRoadElevationY(b.mesh.position.z) + 0.06;
        if (Math.abs(b.mesh.position.z + 1.6) < 0.9 && b.hitCooldown === 0 && speed > 0.03) {
            b.hitCooldown = 40;
            suspensionVel = 0.11 * (0.4 + speed * 0.9);
            playPotholeThud();
        }
    }

    for (let i = 0; i < signalList.length; i++) {
        const g = signalList[i].group;
        if (!g.visible) continue;
        g.position.z += move;
        if (g.position.z > 45) g.position.z -= 440;
        g.position.x = getRoadCurveX(g.position.z);
        g.position.y = getRoadElevationY(g.position.z);
    }

    for (let i = 0; i < cartList.length; i++) {
        const t = cartList[i];
        if (!t.mesh.visible) continue;
        t.mesh.position.z += move - t.speed;
        if (t.mesh.position.z > 30) t.mesh.position.z = -220 - Math.random() * 40;
        t.mesh.position.x = getRoadCurveX(t.mesh.position.z) + t.laneOffset;
        t.mesh.position.y = getRoadElevationY(t.mesh.position.z);

        if (Math.abs(t.mesh.position.z + 1.8) < 1.4 && Math.abs(t.laneOffset - tharLocalX) < 1.35) {
            handleHit("Hit a vegetable cart!");
        }
    }

    const zGap = zones[currentZoneIdx].trafficGap;
    for (let i = 0; i < trafficList.length; i++) {
        const v = trafficList[i];
        v.curSpeed += Math.max(-0.015, Math.min(0.004, trafficTarget(v) - v.curSpeed));
        for (let w = 0; w < v.wheels.length; w++) v.wheels[w].rotation.x -= v.curSpeed * 0.45;

        if (v.isOncoming) {
            v.mesh.position.z += speed * MOVE + v.curSpeed * 0.95;
            if (v.mesh.position.z > 60) {
                v.mesh.position.z = -260 - Math.random() * zGap;
                v.curSpeed = v.speed;
            }
            v.mesh.position.x = getRoadCurveX(v.mesh.position.z) + v.laneOffset;
            v.mesh.position.y = getRoadElevationY(v.mesh.position.z);

            if (Math.abs(v.mesh.position.z + 1.8) < (v.length / 2 + 0.72) && Math.abs(v.laneOffset - tharLocalX) < (v.width / 2 + 0.62) && tharLocalX < -0.6) {
                handleHit("Collided with oncoming traffic!");
            }
        } else {
            v.mesh.position.z += speed * MOVE - v.curSpeed;
            const dzFromPlayer = v.mesh.position.z + 1.8;
            v.mesh.position.x = getRoadCurveX(v.mesh.position.z) + v.laneOffset;
            v.mesh.position.y = getRoadElevationY(v.mesh.position.z);

            const minSafeZ = (v.length / 2) + 1.65;
            if (Math.abs(v.laneOffset - tharLocalX) < (v.width / 2 + 0.75) && dzFromPlayer < 0 && dzFromPlayer > -minSafeZ) {
                v.mesh.position.z = -1.8 - minSafeZ;
                speed = Math.min(speed, v.curSpeed * 0.72);
            }

            if (v.mesh.position.z > 65) {
                v.mesh.position.z = -260 - Math.random() * zGap;
                v.curSpeed = v.speed;
                v.laneOffset = forwardLanes[Math.floor(Math.random() * 2)];
            } else if (v.mesh.position.z < -340) {
                v.mesh.position.z = 48 + Math.random() * 20;
                v.laneOffset = tharLocalX < 4.5 ? 6.5 : 2.5;
            }
        }
        if (!gameActive) return;
    }
}
