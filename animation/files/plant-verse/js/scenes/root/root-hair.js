
SC['root-hair']=()=>{const S=new Sc();S.title='Root hair: one long cell, huge surface';S.sub='A root hair can be ~1 mm long. Water is drawn in from the soil.';S.cam=6.4;S.view=[.25,-.35];
  S.part('root','Root (epidermis)','The root surface. Each root hair is a single epidermal cell.',[0,.5,0]);
  S.part('hair','Root hairs','Thin, long cells: they multiply the surface area, so more water is absorbed.',[.5,1.0,.4]);
  S.part('soil','Soil particles','A thin film of water sits between the soil particles.',[-1.4,-1.5,.6]);
  S.part('water','Water + minerals','Water moves into the root hair by osmosis.',[1.1,-1.1,1.0]);
  S.add('root',mesh(new T.CylinderGeometry(.45,.45,3.4,32).rotateZ(Math.PI/2),M(0xd7b98e)));
  const hm=M(0xf1e6cf),up=new T.Vector3(0,1,0),dirs=[];
  for(let i=0;i<110;i++){const x=-1.5+rnd()*3,a=rnd()*TAU,d=new T.Vector3(0,Math.cos(a),Math.sin(a)),len=.45+rnd()*.5;
    const g=new T.CylinderGeometry(.012,.022,len,5).translate(0,len/2,0);
    const h=mesh(g,hm,x,d.y*.45,d.z*.45);h.quaternion.setFromUnitVectors(up,d.clone().add(new T.Vector3((rnd()-.5)*.4,0,0)).normalize());S.add('hair',h)}
  const sm=[M(0x6d4c41),M(0x8d6e63)];
  for(let i=0;i<46;i++){const a=rnd()*TAU,r=1.05+rnd()*1.1,x=-1.7+rnd()*3.4;
    const o=S.add('soil',mesh(new T.DodecahedronGeometry(.1+rnd()*.12),sm[i%2],x,Math.cos(a)*r,Math.sin(a)*r));o.rotation.set(rnd()*3,rnd()*3,0)}
  const wm=M(0x4fc3f7,{emissive:0x0277bd,emissiveIntensity:.5}),drops=[];
  for(let i=0;i<26;i++){const d={a:rnd()*TAU,x:-1.4+rnd()*2.8,o:rnd()};d.m=S.add('water',mesh(new T.SphereGeometry(.055,10,8),wm));drops.push(d)}
  S.tick=t=>drops.forEach(d=>{const p=(t*.22+d.o)%1,r=2.1-p*1.55;d.m.position.set(d.x,Math.cos(d.a)*r,Math.sin(d.a)*r)});
  return S};
