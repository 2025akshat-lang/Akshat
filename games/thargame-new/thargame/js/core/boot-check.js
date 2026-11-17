/* thargame/js/core/boot-check.js
   THREE load check: agar three.js CDN se load na ho to message dikhata hai */
if (typeof THREE === 'undefined') {
    document.querySelector('#overlay-screen p').textContent = 'Could not load the 3D engine (three.js). Check your internet connection and reload.';
    document.getElementById('start-btn').style.display = 'none';
    throw new Error('three.js failed to load');
}
