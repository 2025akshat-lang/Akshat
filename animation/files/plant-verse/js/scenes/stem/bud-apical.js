
SC['bud-apical']=()=>{const S=new Sc();S.title='Buds: apical, axillary and flower bud';S.sub='';S.cam=7;
  const pr=(id,n,a)=>S.part(id,n,'',a);
  pr('ameri','Apical meristem',[0,1.1,.2]);pr('prim','Leaf primordia',[.3,.85,.2]);pr('yleaf','Young leaves',[-.5,.9,.3]);pr('stem','Stem (nodes + internodes)',[-.25,-1.5,.2]);
  pr('leafp','Leaf at node',[1,.3,.1]);pr('axbud','Axillary bud',[.32,.05,.2]);pr('fbud','Flower bud',[-.8,-.45,.2]);
  const sm=M(0x7cb342);
  S.add('stem',mesh(new T.CylinderGeometry(.22,.22,3,24),sm,0,-.6,0));
  [-.1,-.95].forEach(y=>{const n=S.add('stem',mesh(new T.SphereGeometry(.3,18,12),sm,0,y,0));n.scale.y=.45});
  S.add('ameri',mesh(new T.SphereGeometry(.17,20,14),M(0xffd54f),0,.93,0));
  [[.22,.8,0],[-.2,.78,.12],[.05,.76,-.22],[.14,.9,.16]].forEach(p=>S.add('prim',mesh(new T.SphereGeometry(.1,12,10),M(0xaed581),p[0],p[1],p[2])));
  [[.6,0x66bb6a],[.46,0x81c784],[.33,0xa5d6a7]].forEach(([r,c])=>S.add('yleaf',mesh(new T.SphereGeometry(r,28,18,Math.PI/2,Math.PI*1.5,0,Math.PI/2),M(c),0,.8,0)));
  const lf=S.add('leafp',mesh(new T.SphereGeometry(1,18,12),M(0x43a047),1.05,.28,0));lf.scale.set(.75,.09,.34);lf.rotation.z=.35;
  S.add('leafp',mesh(new T.CylinderGeometry(.04,.05,.5,8),M(0x6aa04a),.45,-.02,0)).rotation.z=-1.2;
  const ab=S.add('axbud',mesh(new T.SphereGeometry(1,14,10),M(0x9ccc65),.3,.08,.05));ab.scale.set(.1,.2,.1);ab.rotation.z=-.45;
  const pd=S.add('fbud',mesh(new T.CylinderGeometry(.035,.04,.7,8),M(0x6aa04a),-.45,-.78,0));pd.rotation.z=1.1;
  S.add('fbud',mesh(new T.SphereGeometry(.2,18,14),M(0xf06292),-.82,-.55,0)).scale.y=1.25;
  [0,1,2].forEach(k=>{const c=S.add('fbud',mesh(new T.ConeGeometry(.07,.24,6),M(0x4caf50),-.82+Math.cos(k*2.1)*.12,-.78,Math.sin(k*2.1)*.12));c.rotation.z=Math.cos(k*2.1)*.5});
  return S};
