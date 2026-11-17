/* thargame/js/world/particles.js
   Smog particles + tyre smoke / dust particles */
const pCount = Q_LOW ? 100 : 350;
const pGeo = new THREE.BufferGeometry();
const pPos = new Float32Array(pCount * 3);
for (let i = 0; i < pCount * 3; i += 3) {
    pPos[i] = (Math.random() - 0.5) * 26;
    pPos[i + 1] = Math.random() * 8;
    pPos[i + 2] = 20 - Math.random() * 120;
}
pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
const smogMat = new THREE.PointsMaterial({ color: 0xb8af9e, size: 0.09, transparent: true, opacity: 0.6 });
const smogParticles = new THREE.Points(pGeo, smogMat);
smogParticles.frustumCulled = false;
scene.add(smogParticles);

// Tire Smoke & Dust Particles for Drifting & Off-Roading
const smokePartCount = 45;
const smokeGeo = new THREE.BufferGeometry();
const smokePos = new Float32Array(smokePartCount * 3);
for(let i=0; i<smokePartCount*3; i+=3) { smokePos[i] = 0; smokePos[i+1] = -10; smokePos[i+2] = 0; }
smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePos, 3));
const smokeMat = new THREE.PointsMaterial({ color: 0xc2b280, size: 0.38, transparent: true, opacity: 0.0 });
const smokeParticles = new THREE.Points(smokeGeo, smokeMat);
scene.add(smokeParticles);
let smokeIdx = 0;
