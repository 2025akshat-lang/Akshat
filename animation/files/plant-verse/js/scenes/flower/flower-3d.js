
SC['flower-3d']=()=>{const S=new Sc();S.title='Flower: inner parts (front petal removed)';S.sub='Petals and sepals outside, stamens inside, pistil in the middle.';S.cam=6.4;S.view=[.5,-.35];
  S.part('petal','Petals (corolla)','Attract insects with colour and scent.',[1.2,1.3,.2]);
  S.part('sepal','Sepals (calyx)','Leaf-like and green: cover and protect the bud.',[-1.1,-.15,.2]);
  S.part('stamen','Stamens','Filament + anther. Pollen is made in the anther (male part).',[.8,1.15,.1]);
  S.part('pistil','Pistil','Stigma, style and ovary: the female part, with ovules inside.',[0,1.7,0]);
  const pm=M(0xf06292),sm=M(0x66bb6a),am=M(0xffca28),fm=M(0xe0e0a0),om=M(0x7cb342);
  const front=a=>{a=((a+Math.PI)%TAU+TAU)%TAU-Math.PI;return Math.abs(a)<.7};
  for(let k=0;k<5;k++){const a=k*TAU/5;if(front(a))continue;
    const g=new T.Group();g.rotation.y=a;const p=mesh(new T.SphereGeometry(1,20,14),pm,0,0,.95);p.scale.set(.5,.07,1);const pv=new T.Group();pv.rotation.x=.75;pv.add(p);g.add(pv);S.add('petal',p,pv);S.group.add(g)}
  for(let k=0;k<5;k++){const a=k*TAU/5+TAU/10;if(front(a))continue;
    const g=new T.Group();g.rotation.y=a;const p=mesh(new T.SphereGeometry(1,16,10),sm,0,0,.6);p.scale.set(.2,.05,.6);const pv=new T.Group();pv.rotation.x=-.25;pv.position.y=-.1;pv.add(p);g.add(pv);S.add('sepal',p,pv);S.group.add(g)}
  for(let k=0;k<7;k++){const a=k*TAU/7+.2;if(front(a))continue;
    const g=new T.Group();g.rotation.y=a;const pv=new T.Group();pv.position.z=.35;pv.rotation.x=.18;g.add(pv);
    S.add('stamen',mesh(new T.CylinderGeometry(.017,.017,1.3,8),fm,0,.65,0),pv);S.add('stamen',mesh(new T.SphereGeometry(.09,12,10),am,0,1.32,0),pv);S.group.add(g)}
  S.add('pistil',mesh(new T.SphereGeometry(.3,18,14),om,0,.28,0));
  S.add('pistil',mesh(new T.CylinderGeometry(.04,.05,1.2,10),om,0,.9,0));
  S.add('pistil',mesh(new T.SphereGeometry(.1,12,10),M(0xffb74d),0,1.55,0));
  S.add('sepal',mesh(new T.ConeGeometry(.22,.3,14),M(0x558b2f),0,-.1,0));
  S.group.position.y=-.5;return S};
