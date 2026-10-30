
SC['seed-mono']=()=>{const S=new Sc();S.title='Monocot grain (maize-type): one cotyledon';S.sub='';S.cam=5.6;
  const A=(x,y,z)=>[x*1.05,y*.9,z*.7];
  S.part('coat','Fruit wall + seed coat (fused)','',A(.9,.9,.3));S.part('aleu','Aleurone layer','',A(.95,.45,.3));
  S.part('endo','Stored food (endosperm)','',A(.4,-.2,.3));S.part('scut','Scutellum (single cotyledon)','',A(-.6,-.05,.3));
  S.part('plu','Plumule + coleoptile','',A(-.5,.7,.2));S.part('rad','Radicle + coleorhiza','',A(-.55,-.75,.2));
  const G=new T.Group();G.scale.set(1.05,.9,.7);S.group.add(G);
  cutSphere(S,'coat',1,M(0xf2c14e),G);cutSphere(S,'aleu',.97,M(0xb58a2c),G);faces(S,'aleu',.97,M(0xb58a2c),0,G);
  cutSphere(S,'endo',.93,M(0xfff3d6),G);faces(S,'endo',.93,M(0xfff3d6),.004,G);
  S.add('scut',mesh(new T.SphereGeometry(1,24,16),M(0xaed581),-.62,-.05,.06),G).scale.set(.3,.62,.2);
  S.add('plu',mesh(new T.ConeGeometry(.11,.5,12),M(0xe6ee9c),-.5,.55,.08),G);S.add('plu',mesh(new T.ConeGeometry(.05,.34,10),M(0x66bb6a),-.5,.5,.08),G);
  const r1=S.add('rad',mesh(new T.ConeGeometry(.1,.42,12).rotateX(Math.PI),M(0xd7ccc8),-.5,-.55,.08),G);
  S.add('rad',mesh(new T.ConeGeometry(.05,.34,10).rotateX(Math.PI),M(0xffcc80),-.5,-.57,.08),G);
  S.byId.embryo=null;S.part('embryo','Embryo','',A(-.7,.0,.3));S.byId.embryo.members=['scut','plu','rad'];
  return S};
