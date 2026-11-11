
SC['fruit-cross']=()=>{const S=new Sc();S.title='Fruit section: the seed’s safe carriage';S.sub='Skin, flesh and core, with the seeds in the middle.';S.cam=5.4;S.view=[.35,.55];
  S.part('skin','Skin (exocarp)','Outer peel: protects what is inside.',[.7,.85,.7]);
  S.part('flesh','Flesh (mesocarp)','Juicy flesh: animals eat it and the seeds get spread far away.',[-.3,-.7,.1]);
  S.part('core','Core (endocarp)','The chamber around the seeds.',[-.15,.25,.05]);
  S.part('seed','Seeds','Each seed holds a tiny plant (embryo).',[-.2,-.05,.05]);
  S.part('stalk','Pedicel (stalk)','The stalk that joins the fruit to the plant and feeds it.',[0,1.2,0]);
  const skin=M(0xd32f2f),fl=M(0xff7043),core=M(0xfff3c4),sd=M(0xfdd835);
  cutSphere(S,'skin',1,skin);cutSphere(S,'flesh',.985,fl);faces(S,'flesh',.985,fl,0);
  cutSphere(S,'core',.38,core);faces(S,'core',.38,core,.004);
  for(let i=0;i<7;i++){const a=1.75+i*.38,r=i%3?.22:.1;const s=S.add('seed',mesh(new T.SphereGeometry(1,12,10),sd,Math.cos(a)*r*1.1,Math.sin(a)*r*1.3,.008));s.scale.set(.06,.1,.03);s.rotation.z=a-Math.PI/2}
  S.add('stalk',mesh(new T.CylinderGeometry(.05,.06,.3,10),M(0x558b2f),0,1.1,0));
  for(let k=0;k<5;k++){const c=S.add('stalk',mesh(new T.ConeGeometry(.07,.22,8),M(0x2e7d32),Math.cos(k*TAU/5)*.14,.99,Math.sin(k*TAU/5)*.14));c.rotation.set(Math.sin(k*TAU/5)*.9,0,-Math.cos(k*TAU/5)*.9)}
  return S};
