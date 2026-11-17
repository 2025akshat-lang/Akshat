/* thargame/js/world/road-terrain.js
   Road segments, terrain textures (asphalt/dirt/hill), roundabout, road curve + elevation */
// DYNAMIC MULTI-SURFACE ROAD SEGMENTS (Asphalt, Gaon Kacchi Dirt Road, Hill Winding Road)
const roadSegments = [];
const actualSegCount = Q_LOW ? 36 : 64;
const segLen = 5;

// Procedural Textures for Different Terrains
function createTerrainTexture(type) {
    const c = document.createElement('canvas');
    c.width = 128; c.height = 128;
    const ctx = c.getContext('2d');
    if (type === 'dirt') {
        ctx.fillStyle = '#7c5836';
        ctx.fillRect(0, 0, 128, 128);
        for (let i = 0; i < 600; i++) {
            ctx.fillStyle = Math.random() > 0.5 ? '#614124' : '#966f49';
            ctx.fillRect(Math.random() * 128, Math.random() * 128, 3, 3);
        }
        // Tyre tracks in mud
        ctx.fillStyle = 'rgba(45, 30, 15, 0.35)';
        ctx.fillRect(24, 0, 18, 128);
        ctx.fillRect(86, 0, 18, 128);
    } else if (type === 'hill') {
        ctx.fillStyle = '#3d3f44';
        ctx.fillRect(0, 0, 128, 128);
        for (let i = 0; i < 400; i++) {
            ctx.fillStyle = Math.random() > 0.5 ? '#2b2c30' : '#555861';
            ctx.fillRect(Math.random() * 128, Math.random() * 128, 2, 2);
        }
    } else {
        ctx.fillStyle = '#252629';
        ctx.fillRect(0, 0, 128, 128);
        for (let i = 0; i < 300; i++) {
            ctx.fillStyle = '#1d1e21';
            ctx.fillRect(Math.random() * 128, Math.random() * 128, 2, 2);
        }
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
}

const asphaltMat = mkMat({ map: createTerrainTexture('asphalt'), roughness: 0.9 });
const dirtMat = mkMat({ map: createTerrainTexture('dirt'), roughness: 1.0 });
const hillRoadMat = mkMat({ map: createTerrainTexture('hill'), roughness: 0.85 });

const kerbMat = mkMat({ color: 0x524f4a });
const dirtEdgeMat = mkMat({ color: 0x4e6e2e });
const hillGuardMat = mkMat({ color: 0xd84315 });
const lineMat = new THREE.MeshBasicMaterial({ color: 0xd0d0d0 });

const asphaltGeo = new THREE.PlaneGeometry(18, segLen + 0.3);
const divGeo = new THREE.BoxGeometry(0.45, 0.45, segLen - 0.3);
const dashGeo = new THREE.PlaneGeometry(0.18, 3.0);
const kerbGeo = new THREE.BoxGeometry(1.1, 0.7, segLen + 0.3);
const cliffRockGeo = new THREE.DodecahedronGeometry(3.2, 0);
const cliffRockMat = mkMat({ color: 0x5d4037, roughness: 0.95 });
const divYellowMat = mkMat({ color: 0xfbc02d });
const divBlackMat = mkMat({ color: 0x1c1c1e });

for (let i = 0; i < actualSegCount; i++) {
    const segGroup = new THREE.Group();
    const surface = new THREE.Mesh(asphaltGeo, asphaltMat);
    surface.rotation.x = -Math.PI / 2;
    segGroup.add(surface);

    const divBlock = new THREE.Mesh(divGeo, i % 2 === 0 ? divYellowMat : divBlackMat);
    divBlock.position.set(0, 0.22, 0);
    segGroup.add(divBlock);

    const dashes = [];
    if (i % 2 === 0) {
        [-4.5, 4.5].forEach(lx => {
            const dash = new THREE.Mesh(dashGeo, lineMat);
            dash.rotation.x = -Math.PI / 2;
            dash.position.set(lx, 0.02, 0);
            segGroup.add(dash);
            dashes.push(dash);
        });
    }

    const lKerb = new THREE.Mesh(kerbGeo, kerbMat);
    lKerb.position.set(-9.4, 0.35, 0);
    const rKerb = new THREE.Mesh(kerbGeo, kerbMat);
    rKerb.position.set(9.4, 0.35, 0);
    segGroup.add(lKerb, rKerb);

    // Ubhar-Khabar Mountain Cliff Rocks on Left side for Hill Wrap-Around Feel
    const cliffRock = new THREE.Mesh(cliffRockGeo, cliffRockMat);
    cliffRock.position.set(-12.2, 2.2, 0);
    cliffRock.scale.set(1.2, 1.5 + (i % 3) * 0.4, 1.4);
    cliffRock.visible = false;
    segGroup.add(cliffRock);

    segGroup.position.z = 50 - i * segLen;
    scene.add(segGroup);
    roadSegments.push({ group: segGroup, surface, divBlock, dashes, lKerb, rKerb, cliffRock });
}

const roundaboutGroup = new THREE.Group();
const island = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 4.0, 0.65, 16), mkMat({ color: 0x2e7d32 }));
island.position.y = 0.32;
const islandRim = new THREE.Mesh(new THREE.TorusGeometry(3.8, 0.22, 6, 16), mkMat({ color: 0xfbc02d }));
islandRim.rotation.x = Math.PI / 2; islandRim.position.y = 0.3;
const monument = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.7, 3.2, 8), mkMat({ color: 0xd7ccc8 }));
monument.position.y = 1.9;
const ringRoad = new THREE.Mesh(new THREE.RingGeometry(4.4, 10.5, 28), asphaltMat);
ringRoad.rotation.x = -Math.PI / 2; ringRoad.position.y = 0.03;
const sideRoadGeo = new THREE.PlaneGeometry(32, 12);
const sideLineGeo = new THREE.PlaneGeometry(32, 0.18);
roundaboutGroup.add(island, islandRim, monument, ringRoad);
[-1, 1].forEach(side => {
    const sideRoad = new THREE.Mesh(sideRoadGeo, asphaltMat);
    sideRoad.rotation.x = -Math.PI / 2; sideRoad.position.set(side * 24, 0.025, 0);
    const sideLine = new THREE.Mesh(sideLineGeo, lineMat);
    sideLine.rotation.x = -Math.PI / 2; sideLine.position.set(side * 24, 0.04, 0);
    roundaboutGroup.add(sideRoad, sideLine);
});
roundaboutGroup.position.set(0, 0, -260);
roundaboutGroup.visible = false;
scene.add(roundaboutGroup);

// REAL WINDING CURVES & MOUNTAIN ELEVATION FUNCTION
let roadCurveAmp = 2.0;
let roadCurveFreq = 0.018;
let roadElevationAmp = 0.0;
let roadPhase = 0;

function getRoadCurveX(z) {
    // Multi-harmonic S-bends & hairpin turns so road genuinely turns left & right
    let baseCurve = Math.sin(z * roadCurveFreq + roadPhase) * roadCurveAmp
                  + Math.cos(z * roadCurveFreq * 0.45 + roadPhase * 0.7) * (roadCurveAmp * 0.65);
    if (roundaboutGroup.visible) {
        const dz = z - roundaboutGroup.position.z;
        if (Math.abs(dz) < 26) {
            const bulge = Math.cos((dz / 26) * (Math.PI / 2)) * 4.2;
            baseCurve += bulge;
        }
    }
    return baseCurve;
}

function getRoadElevationY(z) {
    if (roadElevationAmp <= 0) return 0;
    // Rolling hills up and down
    return (Math.sin(z * 0.022 + roadPhase * 0.8) + 1) * roadElevationAmp;
}
