/* thargame/js/world/world-init.js
   initWorldObjects(): traffic, carts, potholes, bumps, signals ko scene mein rakhta hai */
function initWorldObjects() {
    for (let i = 0; i < (Q_LOW ? 4 : 6); i++) {
        const type = i % 2 === 0 ? 'auto' : 'car';
        const v = buildDetailedVehicle(type, false);
        const lane = forwardLanes[i % 2];
        v.group.position.set(lane, 0, -i * 55 - 40);
        scene.add(v.group);
        trafficList.push({ mesh: v.group, width: v.width, length: v.length, speed: v.speed, isOncoming: false, laneOffset: lane, wheels: v.wheels, curSpeed: v.speed });
    }

    for (let i = 0; i < (Q_LOW ? 3 : 5); i++) {
        const v = buildDetailedVehicle('car', true);
        const lane = oncomingLanes[i % 2];
        v.group.position.set(lane, 0, -i * 60 - 50);
        scene.add(v.group);
        trafficList.push({ mesh: v.group, width: v.width, length: v.length, speed: v.speed, isOncoming: true, laneOffset: lane, wheels: v.wheels, curSpeed: v.speed });
    }

    for (let i = 0; i < 12; i++) {
        const phGroup = new THREE.Group();
        const rim = new THREE.Mesh(pitRimGeo, pitRimMat);
        rim.rotation.x = -Math.PI / 2; rim.position.y = 0.005;
        const innerPit = new THREE.Mesh(pitGeo, pitMat);
        innerPit.rotation.x = -Math.PI / 2; innerPit.position.y = 0.01;
        phGroup.add(rim, innerPit);
        const depth = 0.7 + Math.random() * 0.9;
        phGroup.scale.set(depth, 1, depth);
        const laneOff = [-6.5, -2.5, 2.5, 6.5][i % 4];
        phGroup.position.set(laneOff, 0.02, -i * 26 - 40);
        scene.add(phGroup);
        potholeList.push({ mesh: phGroup, laneOffset: laneOff, hitCooldown: 0, depth });
    }

    for (let i = 0; i < 6; i++) {
        const bump = new THREE.Mesh(bumpGeo, bumpMat);
        bump.position.set(0, 0.06, -i * 70 - 60);
        scene.add(bump);
        bumpList.push({ mesh: bump, hitCooldown: 0 });
    }

    for (let i = 0; i < 4; i++) {
        const group = new THREE.Group();
        const redMat = new THREE.MeshBasicMaterial({ color: 0xff1a1a });
        const yellowMat = new THREE.MeshBasicMaterial({ color: 0x332a00 });
        const greenMat = new THREE.MeshBasicMaterial({ color: 0x07300f });
        const canvas = document.createElement('canvas');
        canvas.width = 64; canvas.height = 40;
        const tex = new THREE.CanvasTexture(canvas);
        const timerMat = new THREE.MeshBasicMaterial({ map: tex });
        [-1, 1].forEach(side => {
            const pole = new THREE.Mesh(sigPoleGeo, poleMat);
            pole.position.set(side * 9.6, 2.5, 0);
            const arm = new THREE.Mesh(sigArmGeo, poleMat);
            arm.position.set(side * 6.85, 4.95, 0);
            const head = new THREE.Mesh(sigHeadGeo, sigDarkMat);
            head.position.set(side * 6.0, 4.4, 0);
            const lampRed = new THREE.Mesh(sigLampGeo, redMat);
            lampRed.position.set(side * 6.0, 4.75, 0.22);
            const lampYellow = new THREE.Mesh(sigLampGeo, yellowMat);
            lampYellow.position.set(side * 6.0, 4.4, 0.22);
            const lampGreen = new THREE.Mesh(sigLampGeo, greenMat);
            lampGreen.position.set(side * 6.0, 4.05, 0.22);
            const timer = new THREE.Mesh(sigTimerGeo, timerMat);
            timer.position.set(side * 4.9, 4.4, 0.05);
            group.add(pole, arm, head, lampRed, lampYellow, lampGreen, timer);
        });
        [4.5, -4.5].forEach((lx, k) => {
            const stopLine = new THREE.Mesh(sigLineGeo, sigLineMat);
            stopLine.rotation.x = -Math.PI / 2;
            stopLine.position.set(lx, 0.03, k === 0 ? 2.5 : -2.5);
            group.add(stopLine);
        });
        group.position.z = -i * 110 - 50;
        scene.add(group);
        const state = i % 2;
        const s = { group, state, t: SIGNAL_TIMES[state] * (0.4 + Math.random() * 0.6), redMat, yellowMat, greenMat, ctx: canvas.getContext('2d'), tex, drawn: -1 };
        applySignalState(s);
        drawSignalTimer(s);
        signalList.push(s);
    }

    for (let i = 0; i < 3; i++) {
        const cart = new THREE.Group();
        const cartBed = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.35, 2.2), mkMat({ color: 0x6d4c41 }));
        cartBed.position.y = 0.85;
        cart.add(cartBed);
        cart.visible = false;
        const laneOff = i % 2 === 0 ? 6.6 : -6.6;
        cart.position.set(laneOff, 0, -i * 70 - 50);
        scene.add(cart);
        cartList.push({ mesh: cart, laneOffset: laneOff, speed: 0.05 });
    }
}
initWorldObjects();
