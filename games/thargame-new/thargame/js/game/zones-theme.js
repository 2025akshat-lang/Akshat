/* thargame/js/game/zones-theme.js
   Zones (Delhi/Farms/Hills...), applyZone(), Day/Night theme */
// ZONES WITH DISTINCT TERRAINS, ELEVATION & CURVATURE
const zones = [
    { id: 'DELHI', title: 'DELHI NCR ASPHALT', sub: 'City Traffic & Moderate Turns', aqi: 485, fogDensity: 0.017, skyHex: 0x8e8675, smogOpacity: 0.65, trafficGap: 55, curveAmp: 3.5, curveFreq: 0.018, elevAmp: 0.0, roadType: 'asphalt', scenery: 'none', hasCart: false, roundabout: false },
    { id: 'GHAZIABAD', title: 'GHAZIABAD BYPASS', sub: 'Winding Curves & Roundabout', aqi: 112, fogDensity: 0.0025, skyHex: 0x87ceeb, smogOpacity: 0.05, trafficGap: 80, curveAmp: 6.5, curveFreq: 0.020, elevAmp: 0.3, roadType: 'asphalt', scenery: 'farm', hasCart: false, roundabout: true },
    { id: 'HIGHWAY', title: 'NH-9 EXPRESS HIGHWAY', sub: 'High-Speed Sweeping Bends!', aqi: 88, fogDensity: 0.0018, skyHex: 0x64b5f6, smogOpacity: 0.0, trafficGap: 120, curveAmp: 5.0, curveFreq: 0.014, elevAmp: 0.2, roadType: 'asphalt', scenery: 'farm', hasCart: false, roundabout: false },
    { id: 'FARMS', title: 'GAON KI KACCHI ROAD', sub: 'Muddy Dirt Track • Ubhar-Khabar Off-Road!', aqi: 62, fogDensity: 0.002, skyHex: 0x81d4fa, smogOpacity: 0.0, trafficGap: 95, curveAmp: 8.5, curveFreq: 0.024, elevAmp: 0.65, roadType: 'dirt', scenery: 'farm', hasCart: false, roundabout: false },
    { id: 'HILLS', title: 'HIMALAYAN MOUNTAIN PASS', sub: 'Pahad ke Charo Taraf Hairpin Turns!', aqi: 45, fogDensity: 0.0035, skyHex: 0x90caf9, smogOpacity: 0.08, trafficGap: 105, curveAmp: 12.5, curveFreq: 0.028, elevAmp: 1.6, roadType: 'hill', scenery: 'hill', hasCart: false, roundabout: false },
    { id: 'LANE', title: 'OLD BAZAAR DIRT LANE', sub: 'Kacchi Pathrili Gali • Vegetable Carts!', aqi: 165, fogDensity: 0.004, skyHex: 0xb0bec5, smogOpacity: 0.12, trafficGap: 85, curveAmp: 5.8, curveFreq: 0.022, elevAmp: 0.4, roadType: 'dirt', scenery: 'lane', hasCart: true, roundabout: false }
];

let currentZoneIdx = 0;
let bannerTimer = 0;

function showZoneBanner(title, sub) {
    const banner = document.getElementById('zone-banner');
    banner.innerHTML = `${title}<span id="zone-sub">${sub}</span>`;
    banner.style.display = 'block';
    clearTimeout(bannerTimer);
    bannerTimer = setTimeout(() => { banner.style.display = 'none'; }, 3400);
}

function applyZone(zIdx) {
    currentZoneIdx = zIdx;
    const z = zones[zIdx];
    document.getElementById('zone-hud').innerText = z.id;
    document.getElementById('aqi-val').innerText = z.aqi;
    document.getElementById('aqi-val').style.color = z.aqi > 300 ? '#ff453a' : (z.aqi > 150 ? '#ff9f0a' : '#32d74b');

    roadCurveAmp = z.curveAmp;
    roadCurveFreq = z.curveFreq;
    roadElevationAmp = z.elevAmp;
    smogMat.opacity = z.smogOpacity;
    smogParticles.visible = z.smogOpacity > 0;

    // Change Road Material & Design per Terrain
    const isDirt = z.roadType === 'dirt';
    const isHill = z.roadType === 'hill';
    const targetSurfaceMat = isDirt ? dirtMat : (isHill ? hillRoadMat : asphaltMat);

    roadSegments.forEach(seg => {
        seg.surface.material = targetSurfaceMat;
        // Hide city divider & white dashes on Gaon Kacchi Road
        seg.divBlock.visible = !isDirt;
        seg.dashes.forEach(d => { d.visible = !isDirt; });
        seg.lKerb.material = isDirt ? dirtEdgeMat : (isHill ? hillGuardMat : kerbMat);
        seg.rKerb.material = isDirt ? dirtEdgeMat : (isHill ? hillGuardMat : kerbMat);
        // Show rocky mountain cliffs hugging the road on Hills
        seg.cliffRock.visible = isHill;
    });

    // Hide city traffic lights & street poles in deep village dirt/hills for realism
    signalList.forEach(s => { s.group.visible = !isDirt && !isHill; });
    streetLightList.forEach(sl => { sl.group.visible = !isDirt; });

    if (!isNightMode) {
        scene.background.setHex(z.skyHex);
        fog.color.setHex(z.skyHex);
        fog.density = z.fogDensity;
        document.getElementById('smog-vignette').style.opacity = z.smogOpacity > 0.2 ? 0.85 : 0.12;
    }

    sceneryList.forEach(s => {
        s.farmGroup.visible = (z.scenery === 'farm');
        s.hillGroup.visible = (z.scenery === 'hill');
        s.laneGroup.visible = (z.scenery === 'lane');
    });

    cartList.forEach(t => { t.mesh.visible = z.hasCart; });

    if (z.roundabout) {
        roundaboutGroup.visible = true;
        roundaboutGroup.position.z = -240;
    } else {
        roundaboutGroup.visible = false;
    }

    let fCount = 0, oCount = 0;
    trafficList.forEach(v => {
        v.curSpeed = v.speed;
        if (!v.isOncoming) {
            v.mesh.position.z = -40 - fCount * z.trafficGap;
            fCount++;
        } else {
            v.mesh.position.z = -55 - oCount * (z.trafficGap * 1.15);
            oCount++;
        }
    });

    showZoneBanner(z.title, z.sub);
}

document.querySelectorAll('.zone-pick').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.zone-pick').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const zIdx = parseInt(e.currentTarget.getAttribute('data-z'));
        applyZone(zIdx);
    });
});

let isNightMode = false;
const modeDayBtn = document.getElementById('mode-day-btn');
const modeNightBtn = document.getElementById('mode-night-btn');

function applyDayNightTheme(night) {
    isNightMode = night;
    const z = zones[currentZoneIdx];
    if (night) {
        modeNightBtn.classList.add('active'); modeDayBtn.classList.remove('active');
        scene.background = nightColor.clone();
        fog.color.copy(nightColor);
        ambientLight.color.setHex(0x283552); ambientLight.intensity = 0.35;
        sunLight.intensity = 0.08;
        document.getElementById('smog-vignette').style.background =
            "radial-gradient(circle, rgba(10,14,25,0.15) 35%, rgba(0,0,0,0.78) 100%)";
        document.getElementById('smog-vignette').style.opacity = 1;
        streetLightList.forEach(sl => { sl.bulb.material = bulbOnMat; sl.pool.visible = true; });
        groundGlowMat.opacity = 0.24;
        lightStates.head = true; lightStates.tail = true; lightStates.dash = true;
    } else {
        modeDayBtn.classList.add('active'); modeNightBtn.classList.remove('active');
        scene.background.setHex(z.skyHex);
        fog.color.setHex(z.skyHex);
        fog.density = z.fogDensity;
        ambientLight.color.setHex(0xd8cfc0); ambientLight.intensity = 0.92;
        sunLight.intensity = 0.75;
        document.getElementById('smog-vignette').style.background =
            "radial-gradient(circle, rgba(168,155,130,0.04) 45%, rgba(75,70,60,0.5) 100%)";
        document.getElementById('smog-vignette').style.opacity = z.smogOpacity > 0.2 ? 0.85 : 0.12;
        streetLightList.forEach(sl => { sl.bulb.material = bulbOffMat; sl.pool.visible = false; });
        groundGlowMat.opacity = 0.0;
    }
    syncLightButtons();
}

modeDayBtn.addEventListener('click', () => applyDayNightTheme(false));
modeNightBtn.addEventListener('click', () => applyDayNightTheme(true));
