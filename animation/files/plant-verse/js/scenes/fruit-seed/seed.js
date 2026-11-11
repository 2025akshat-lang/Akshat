
SC['seed']=()=>{const S=new Sc();S.title='Seed: a whole plant in a sealed box';S.sub='With the right water and warmth, the radicle becomes the root and the plumule the stem.';S.cam=5.6;S.view=[.3,.5];
  const A=(x,y,z)=>[x*1.25,y*.8,z*.8];
  S.part('coat','Seed coat (testa)','Hard layer: protects the embryo from drying, insects and injury.',A(-.2,.95,.3));
  S.part('endo','Endosperm','Packed food. Gives energy until the sprout emerges.',A(.45,-.3,.3));
  S.part('cot','Cotyledon','Seed leaf: stores food or becomes the first leaf.',A(-.2,.0,.3));
  S.part('rad','Radicle','The future root. It emerges first.',A(-.9,-.1,.2));
  S.part('plu','Plumule','The future stem and first leaves.',A(-.25,.5,.2));
  const G=new T.Group();G.scale.set(1.25,.8,.8);S.group.add(G);
  cutSphere(S,'coat',1,M(0x8d5a2b),G);cutSphere(S,'endo',.95,M(0xfff3d6),G);faces(S,'endo',.95,M(0xfff3d6),0,G);
  S.add('cot',mesh(new T.SphereGeometry(1,24,16),M(0xaed581),-.25,0,0),G).scale.set(.55,.34,.28);
  const r=S.add('rad',mesh(new T.ConeGeometry(.12,.4,12).rotateZ(Math.PI/2),M(0xffcc80),-.72,-.04,0),G);
  S.add('plu',mesh(new T.ConeGeometry(.07,.3,10),M(0x66bb6a),-.2,.38,0),G);
  return S};
