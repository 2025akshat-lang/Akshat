/* thargame/js/render/view.js
   updateView() camera/suspension, renderAll(), adaptQuality() */
function updateView() {
    viewX = getRoadCurveX(0) + tharLocalX;
    viewY = getRoadElevationY(0);
    const steerNorm = steeringAngle / 140;

    tharGroup.position.x = viewX;
    tharGroup.position.y = viewY + suspensionY * 0.6;
    const roughY = (Math.sin(distance * 173) + Math.sin(distance * 311 + 1.7)) * 0.0038 * speed * zoneRough[currentZoneIdx];
    camera.position.set(viewX + 0.42, viewY + 1.78 + suspensionY + roughY + Math.sin(distance * 45) * (speed * 0.012), 0);

    // Camera genuinely turns into the winding curves & mountain slopes!
    const aheadRoadX = getRoadCurveX(-26) + tharLocalX * 0.85;
    const aheadRoadY = getRoadElevationY(-26);
    camera.lookAt(aheadRoadX + 0.42, aheadRoadY + 1.55, -26);
    camera.rotation.z = -steerNorm * 0.032;
    camera.rotation.x += suspensionY * 0.5 + suspensionVel * 0.6;

    headLightL.position.set(viewX - 0.68, viewY + 1.2, -1.8);
    headLightL.target.position.set(aheadRoadX - 0.68, aheadRoadY + 0.3, -30);
    headLightR.position.set(viewX + 0.68, viewY + 1.2, -1.8);
    headLightR.target.position.set(aheadRoadX + 0.68, aheadRoadY + 0.3, -30);
    deflectorLight.position.set(viewX, viewY + 2.05, -1.2);
    deflectorLight.target.position.set(aheadRoadX, aheadRoadY + 0.2, -22);
    tailLightGlow.position.set(viewX, viewY + 1.1, 1.5);

    if (lightStates.tail) {
        const baseTail = isNightMode ? 2.5 : 1.0;
        tailLightGlow.intensity = keys.brake ? baseTail * 2.4 : baseTail;
    } else {
        tailLightGlow.intensity = 0;
    }

    smogParticles.position.set(viewX, viewY, 0);
    if (smogParticles.visible) smogParticles.geometry.attributes.position.needsUpdate = true;
}

function renderAll() {
    scene.updateMatrixWorld();
    renderer.render(scene, camera);

    if (!mirrorRenderer || ++mirrorFrame % (Q_HIGH ? 1 : 3)) return;
    mirrorTick ^= 1;
    if (mirrorTick) {
        mirrorCamera.position.set(viewX + 1.05, viewY + 1.52 + suspensionY, -0.6);
        mirrorCamera.lookAt(getRoadCurveX(35) + tharLocalX + 1.2, getRoadElevationY(35) + 1.15, 35);
        mirrorRenderer.render(scene, mirrorCamera);
    } else {
        centerMirrorCamera.position.set(viewX, viewY + 1.85 + suspensionY, -0.5);
        centerMirrorCamera.lookAt(getRoadCurveX(40) + tharLocalX, getRoadElevationY(40) + 1.2, 40);
        centerMirrorRenderer.render(scene, centerMirrorCamera);
    }
}

function adaptQuality() {
    if (frameAvg > 24 && pixelRatio > MIN_PIXEL_RATIO) {
        pixelRatio = Math.max(MIN_PIXEL_RATIO, pixelRatio - 0.25);
        renderer.setPixelRatio(pixelRatio);
        frameAvg = 16.7;
    }
}
