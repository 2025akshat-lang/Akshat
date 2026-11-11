/* NAYE CELL KA TEMPLATE
   1. Is file ki copy banao, naam do jaise neuron.js
   2. 'neuron' ko apne cell ki id se badlo (06-cell-types.js ke CELLTYPES mein jo id hai wahi)
   3. index.html mein 07-start.js se pehle <script src="js/models/neuron.js"></script> jodo
   Agar id CELLTYPES mein nahi hai to wahan {id,name,color} ki ek line add karo. */
registerCellModel('neuron', (THREE, group, opt) => {
  
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 32, 24),
    new THREE.MeshStandardMaterial({ color: opt.color, roughness: 0.5, transparent: true, opacity: 0.8 })
  );
  group.add(body);            

  return { tick: (dt, t) => { group.rotation.y += dt * 0.3; } };   
});
