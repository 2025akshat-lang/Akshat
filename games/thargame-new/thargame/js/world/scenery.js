/* thargame/js/world/scenery.js
   Side scenery: farms, trees, hills/mountains, shops */
const sceneryList = [];
const farmMat = mkMat({ color: 0x388e3c, roughness: 0.9 });
const cropMat = mkMat({ color: 0x7cb342 });
const mountainMat = mkMat({ color: 0x5d4037, roughness: 0.95 });
const snowMat = mkMat({ color: 0xeceff1 });
const fieldGeo = new THREE.PlaneGeometry(28, 24);
const trunkGeo = new THREE.CylinderGeometry(0.25, 0.35, 2.4, 5);
const crownGeo = new THREE.DodecahedronGeometry(1.7);
const peakGeo = new THREE.ConeGeometry(18, 28, 6);
const snowGeo = new THREE.ConeGeometry(6.0, 8.5, 6);
const shopGeo = new THREE.BoxGeometry(5, 4.5, 14);
const shopMat = mkMat({ color: 0xd84315 });

function createSceneryBatch() {
    for (let i = 0; i < SC_N; i++) {
        const z = -i * SC_SP - 20;
        [-1, 1].forEach(side => {
            const prop = new THREE.Group();
            const farmGroup = new THREE.Group();
            const field = new THREE.Mesh(fieldGeo, farmMat);
            field.rotation.x = -Math.PI / 2; field.position.set(side * 22, 0.05, 0);
            const treeTrunk = new THREE.Mesh(trunkGeo, mountainMat);
            treeTrunk.position.set(side * 13.5, 1.2, 0);
            const treeCrown = new THREE.Mesh(crownGeo, cropMat);
            treeCrown.position.set(side * 13.5, 3.0, 0);
            farmGroup.add(field, treeTrunk, treeCrown);
            farmGroup.visible = false;

            // Massive Mountains wrapping around the road bends
            const hillGroup = new THREE.Group();
            const peak = new THREE.Mesh(peakGeo, mountainMat);
            peak.position.set(side * 24, 12, 0);
            const snowCap = new THREE.Mesh(snowGeo, snowMat);
            snowCap.position.set(side * 24, 22, 0);
            hillGroup.add(peak, snowCap);
            hillGroup.visible = false;

            const laneGroup = new THREE.Group();
            const shop = new THREE.Mesh(shopGeo, shopMat);
            shop.position.set(side * 13, 2.25, 0);
            laneGroup.add(shop);
            laneGroup.visible = false;

            prop.add(farmGroup, hillGroup, laneGroup);
            prop.position.z = z;
            scene.add(prop);
            sceneryList.push({ prop, farmGroup, hillGroup, laneGroup });
        });
    }
}
createSceneryBatch();
