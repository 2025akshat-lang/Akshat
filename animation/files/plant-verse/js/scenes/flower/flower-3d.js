
SC['flower-3d']=()=>{const S=new Sc();S.title='Flower: inner parts (front petal removed)';S.sub='Petals and sepals outside, stamens inside, pistil in the middle.';S.cam=5.2;S.view=[.5,-.35];
  S.part('petal','Petals (corolla)','Attract insects with colour and scent.',[1.2,1.3,.2]);
  S.part('sepal','Sepals (calyx)','Leaf-like and green: cover and protect the bud.',[-1.1,-.15,.2]);
  S.part('stamen','Stamens','Filament + anther. Pollen is made in the anther (male part).',[.8,1.15,.1]);
  S.part('pistil','Pistil','Stigma, style and ovary: the female part, with ovules inside.',[0,1.7,0]);
  const pm=M(0xf06292,{roughness:.82}),sm=M(0x66bb6a),am=M(0xffbd36,{roughness:.48}),
    fm=M(0xe0e0a0),om=M(0x7cb342),veinM=M(0xffc2d6,{transparent:true,opacity:.78}),
    grainM=M(0xffdf74,{roughness:.42}),styleM=M(0x9aca7a,{transparent:true,opacity:.62,roughness:.3}),
    tubeM=M(0xf6a623,{transparent:true,opacity:.82,roughness:.4});
  const detail=(id,points,mat,parent,r)=>{const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(p[0],p[1],p[2])));
    return S.add(id,new T.Mesh(new T.TubeGeometry(curve,16,r,5,false),mat),parent)};
  const front=a=>{a=((a+Math.PI)%TAU+TAU)%TAU-Math.PI;return Math.abs(a)<.7};
  for(let k=0;k<5;k++){const a=k*TAU/5;if(front(a))continue;
    const g=new T.Group();g.rotation.y=a;const pv=new T.Group();pv.rotation.x=.75;g.add(pv);
    const surface=new T.Group();surface.position.z=.95;surface.scale.set(.5,.07,1);pv.add(surface);
    S.add('petal',mesh(new T.SphereGeometry(1,32,20),pm),surface);
    detail('petal',[[0,.18,-.9],[0,.2,-.25],[0,.16,.35],[0,.06,.92]],veinM,surface,.012);
    [-1,1].forEach(side=>[-.45,-.08,.28,.58].forEach(z=>{
      detail('petal',[[0,.12,z],[side*.12,.16,z+.12],[side*.28,.1,z+.34],[side*.39,.04,z+.52]],veinM,surface,.006)}));
    S.group.add(g)}
  for(let k=0;k<5;k++){const a=k*TAU/5+TAU/10;if(front(a))continue;
    const g=new T.Group();g.rotation.y=a;const p=mesh(new T.SphereGeometry(1,16,10),sm,0,0,.6);p.scale.set(.2,.05,.6);const pv=new T.Group();pv.rotation.x=-.25;pv.position.y=-.1;pv.add(p);g.add(pv);S.add('sepal',p,pv);S.group.add(g)}
  for(let k=0;k<7;k++){const a=k*TAU/7+.2;if(front(a))continue;
    const g=new T.Group();g.rotation.y=a;const pv=new T.Group();pv.position.z=.35;pv.rotation.x=.18;g.add(pv);
    S.add('stamen',mesh(new T.CylinderGeometry(.017,.017,1.3,10),fm,0,.65,0),pv);
    const an=mesh(new T.SphereGeometry(1,20,14),am,0,1.32,0);an.scale.set(.095,.135,.075);S.add('stamen',an,pv);
    const pollenBody=mesh(new T.SphereGeometry(1,16,12),M(0xffd35b),0,1.32,.006);pollenBody.scale.set(.062,.095,.052);S.add('stamen',pollenBody,pv);
    for(let j=0;j<7;j++){const a=j*TAU/7,grain=mesh(new T.SphereGeometry(.018,8,6),grainM,Math.cos(a)*.072,1.32+Math.sin(a)*.105,.045);
      S.add('stamen',grain,pv)}
    S.group.add(g)}
  S.add('pistil',mesh(new T.SphereGeometry(.3,18,14),om,0,.28,0));
  S.add('pistil',mesh(new T.SphereGeometry(.25,24,16),M(0x9ac77b,{roughness:.84}),0,.28,.045));
  const style=mesh(new T.CylinderGeometry(.043,.058,1.25,16),styleM,0,.92,0);S.add('pistil',style);
  const pollenTube=mesh(new T.CylinderGeometry(.012,.018,1.12,8),tubeM,0,.94,.045);S.add('pistil',pollenTube);
  S.add('pistil',mesh(new T.SphereGeometry(.105,16,12),M(0x8dbb69,{transparent:true,opacity:.8}),0,1.55,0));
  [-1,0,1].forEach((side,i)=>{const lobe=mesh(new T.SphereGeometry(.065,12,10),M(0x9acb74,{transparent:true,opacity:.72}),side*.09,1.56,side===0?.025:0);
    lobe.scale.set(.78,1.25,.78);S.add('pistil',lobe)});
  S.add('sepal',mesh(new T.ConeGeometry(.22,.3,14),M(0x558b2f),0,-.1,0));
  S.group.position.y=-.5;return S};
