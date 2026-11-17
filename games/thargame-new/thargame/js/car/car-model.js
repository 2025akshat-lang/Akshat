/* thargame/js/car/car-model.js
   TUMHARI THAR: hood + fenders (tharGroup) - car ka 3D look yahan badlo */
const tharGroup = new THREE.Group();
const hoodMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.75, 0.24, 2.2),
    mkMat({ color: 0x1b1c20, roughness: 0.35, metalness: 0.6 })
);
hoodMesh.position.set(0, 1.12, -1.8);
tharGroup.add(hoodMesh);

const fenderMat = mkMat({ color: 0x0d0d10, roughness: 0.8 });
const leftFender = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.22, 1.9), fenderMat);
leftFender.position.set(-0.98, 1.08, -1.8);
const rightFender = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.22, 1.9), fenderMat);
rightFender.position.set(0.98, 1.08, -1.8);
tharGroup.add(leftFender, rightFender);
scene.add(tharGroup);
