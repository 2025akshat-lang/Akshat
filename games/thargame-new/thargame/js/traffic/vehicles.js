/* thargame/js/traffic/vehicles.js
   Traffic lanes + buildDetailedVehicle() (auto, car, truck etc. ka model) */
const oncomingLanes = [-6.5, -2.5];
const forwardLanes = [2.5, 6.5];
const trafficList = [];
const potholeList = [];
const bumpList = [];
const signalList = [];
const cartList = [];

const paintMatCache = {};
const sharedGlassMat = mkMat({ color: 0x88ccff, transparent: true, opacity: 0.42, roughness: 0.1 });
const sharedDarkMat = mkMat({ color: 0x16171a, roughness: 0.8 });
function getPaintMat(color) {
    return paintMatCache[color] || (paintMatCache[color] = mkMat({ color, roughness: 0.35, metalness: 0.3 }));
}

function buildDetailedVehicle(type, isOncoming) {
    const group = new THREE.Group();
    const wheels = [];
    let width, height, length, color, speed;

    if (type === 'dtc_bus') {
        width = 2.2; height = 2.7; length = 7.2; color = 0xd9381e; speed = 0.25;
    } else if (type === 'auto') {
        width = 1.32; height = 1.68; length = 2.55; color = 0x1b7a32; speed = 0.28;
    } else {
        width = 1.75; height = 1.35; length = 4.1;
        const colors = [0xe0e0e0, 0x2b2d42, 0x1976d2, 0xb71c1c];
        color = colors[Math.floor(Math.random() * colors.length)];
        speed = 0.36;
    }

    const paintMat = getPaintMat(color);
    const glassMat = sharedGlassMat;
    const darkMat = sharedDarkMat;

    if (type === 'car') {
        const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(width, 0.58, length), paintMat);
        lowerBody.position.y = 0.52;
        const cabin = new THREE.Mesh(new THREE.BoxGeometry(width - 0.18, 0.58, 2.0), glassMat);
        cabin.position.set(0, 1.08, 0.1);
        group.add(lowerBody, cabin);
    } else if (type === 'dtc_bus') {
        const lowerBus = new THREE.Mesh(new THREE.BoxGeometry(width, 1.3, length), paintMat);
        lowerBus.position.y = 0.9;
        group.add(lowerBus);
    } else {
        const autoBase = new THREE.Mesh(new THREE.BoxGeometry(width, 0.68, length), paintMat);
        autoBase.position.y = 0.56;
        const blackCanopy = new THREE.Mesh(new THREE.BoxGeometry(width + 0.02, 0.58, length - 0.45), darkMat);
        blackCanopy.position.set(0, 1.36, 0.2);
        group.add(autoBase, blackCanopy);
    }

    const wheelRadius = type === 'dtc_bus' ? 0.46 : (type === 'auto' ? 0.25 : 0.35);
    const wheelGeo = new THREE.CylinderGeometry(wheelRadius, wheelRadius, 0.22, 8);
    wheelGeo.rotateZ(Math.PI / 2);

    const addWheel = (wx, wz) => {
        const w = new THREE.Mesh(wheelGeo, darkMat);
        w.position.set(wx, wheelRadius, wz);
        group.add(w);
        wheels.push(w);
    };

    if (type === 'auto') {
        addWheel(0, -length / 2 + 0.35);
        addWheel(-width / 2 - 0.02, length / 2 - 0.55);
        addWheel(width / 2 + 0.02, length / 2 - 0.55);
    } else {
        [-length / 2 + 0.75, length / 2 - 0.75].forEach(wz => {
            [-width / 2 - 0.02, width / 2 + 0.02].forEach(wx => addWheel(wx, wz));
        });
    }

    if (isOncoming) group.rotation.y = Math.PI;
    return { group, width, length, speed, wheels };
}
