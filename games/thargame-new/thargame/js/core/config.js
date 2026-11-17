/* thargame/js/core/config.js
   Graphics quality (Low/Med/High), Q_LOW/Q_HIGH flags, mkMat() material helper */
let QUALITY = null;
try { QUALITY = localStorage.getItem('tharQ'); } catch (e) {}
if (QUALITY !== 'low' && QUALITY !== 'med' && QUALITY !== 'high') {
    QUALITY = /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent) ? 'low' : 'high';
}
const Q_LOW = QUALITY === 'low', Q_HIGH = QUALITY === 'high';
if (Q_LOW) document.body.classList.add('lowfx');
const MatCls = Q_HIGH ? THREE.MeshStandardMaterial : THREE.MeshLambertMaterial;
function mkMat(p) {
    if (!Q_HIGH) { p = Object.assign({}, p); delete p.roughness; delete p.metalness; }
    return new MatCls(p);
}
const SC_N = Q_LOW ? 8 : 14, SC_SP = Q_LOW ? 40 : 22;
