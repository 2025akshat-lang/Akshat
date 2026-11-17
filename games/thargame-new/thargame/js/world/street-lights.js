/* thargame/js/world/street-lights.js
   Street lights (poles, bulbs, night glow) */
const streetLightList = [];
const poleMat = mkMat({ color: 0x3b3d45, metalness: 0.7, roughness: 0.4 });
const bulbOffMat = new THREE.MeshBasicMaterial({ color: 0x888888 });
const bulbOnMat = new THREE.MeshBasicMaterial({ color: 0xffe082 });
const groundGlowMat = new THREE.MeshBasicMaterial({ color: 0xffb300, transparent: true, opacity: 0.0 });
const poleGeo = new THREE.CylinderGeometry(0.11, 0.14, 6.8, 6);
const armGeo = new THREE.BoxGeometry(2.4, 0.1, 0.1);
const lampGeo = new THREE.BoxGeometry(0.65, 0.14, 0.28);
const bulbGeo = new THREE.BoxGeometry(0.52, 0.06, 0.2);
const poolGeo = new THREE.CircleGeometry(3.4, 12);

for (let z = 40; z > -280; z -= 40) {
    [-1, 1].forEach(side => {
        const slGroup = new THREE.Group();
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.set(side * 9.5, 3.4, 0);
        const arm = new THREE.Mesh(armGeo, poleMat);
        arm.position.set(side * 8.3, 6.7, 0);
        const lampHead = new THREE.Mesh(lampGeo, poleMat);
        lampHead.position.set(side * 7.2, 6.65, 0);
        const bulb = new THREE.Mesh(bulbGeo, bulbOffMat);
        bulb.position.set(side * 7.2, 6.57, 0);
        const roadPool = new THREE.Mesh(poolGeo, groundGlowMat);
        roadPool.rotation.x = -Math.PI / 2;
        roadPool.position.set(side * 6.2, 0.015, 0);
        roadPool.visible = false;

        slGroup.add(pole, arm, lampHead, bulb, roadPool);
        slGroup.position.z = z;
        scene.add(slGroup);
        streetLightList.push({ group: slGroup, bulb, pool: roadPool });
    });
}
