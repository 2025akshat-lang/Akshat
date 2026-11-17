/* thargame/js/render/scene-setup.js
   Scene, fog, camera, 3 renderers (main + 2 mirrors), sun/head/tail lights */
const container = document.getElementById('game-container');
const scene = new THREE.Scene();
const daySmogColor = new THREE.Color(0x8e8675);
const nightColor = new THREE.Color(0x090b12);
scene.background = daySmogColor.clone();
const fog = new THREE.FogExp2(0x8e8675, 0.016);
scene.fog = fog;
scene.autoUpdate = false;


const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, Q_LOW ? 160 : 200);
camera.position.set(2.5, 1.78, 0);

const mirrorCamera = new THREE.PerspectiveCamera(56, 124 / 72, 0.1, 100);
const mirrorCanvas = document.getElementById('mirror-canvas');
const rOpts = { antialias: false, alpha: false, stencil: false, powerPreference: "high-performance" };
const mirrorRenderer = Q_LOW ? null : new THREE.WebGLRenderer(Object.assign({ canvas: mirrorCanvas }, rOpts));
if (mirrorRenderer) mirrorRenderer.setSize(124, 72);

const centerMirrorCamera = new THREE.PerspectiveCamera(52, 150 / 42, 0.1, 100);
const centerMirrorCanvas = document.getElementById('center-mirror-canvas');
const centerMirrorRenderer = Q_LOW ? null : new THREE.WebGLRenderer(Object.assign({ canvas: centerMirrorCanvas }, rOpts));
if (centerMirrorRenderer) centerMirrorRenderer.setSize(150, 42);

const renderer = new THREE.WebGLRenderer(rOpts);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Q_LOW ? 0.75 : Math.min(window.devicePixelRatio, Q_HIGH ? 1.5 : 1));
container.insertBefore(renderer.domElement, container.firstChild);

const ambientLight = new THREE.AmbientLight(0xd8cfc0, 0.92);
scene.add(ambientLight);
const sunLight = new THREE.DirectionalLight(0xffe4b5, 0.75);
sunLight.position.set(12, 26, -20);
scene.add(sunLight);

const lightStates = { head: true, tail: true, defl: false, int: false, dash: true, wiper: false };
let manualIndicator = 0;
let wiperPhase = 0;

const headLightL = new THREE.SpotLight(0xfff8e7, 2.2, 65, Math.PI / 5, 0.45, 1);
headLightL.position.set(1.8, 1.2, -1.8);
headLightL.target.position.set(1.8, 0.3, -30);

const headLightR = new THREE.SpotLight(0xfff8e7, 2.2, 65, Math.PI / 5, 0.45, 1);
headLightR.position.set(3.2, 1.2, -1.8);
headLightR.target.position.set(3.2, 0.3, -30);
scene.add(headLightL, headLightL.target);
if (!Q_LOW) scene.add(headLightR, headLightR.target);

const deflectorLight = new THREE.SpotLight(0xffaa2b, 0, 52, Math.PI / 3.2, 0.65, 1);
deflectorLight.position.set(2.5, 2.05, -1.2);
deflectorLight.target.position.set(2.5, 0.2, -22);
if (!Q_LOW) scene.add(deflectorLight, deflectorLight.target);

const tailLightGlow = new THREE.PointLight(0xff1744, 1.8, 14);
tailLightGlow.position.set(2.5, 1.1, 1.5);
scene.add(tailLightGlow);
