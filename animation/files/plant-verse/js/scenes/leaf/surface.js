
SC['surface']=()=>{const S=new Sc();S.title='Leaf surface: epidermis, cuticle, trichomes';S.sub='';S.cam=6;
  const pr=(id,n,a)=>S.part(id,n,'',a);
  pr('cuticle','Cuticle',[-1.45,.0,1.15]);pr('epi','Epidermis',[-1.45,-.17,1.15]);pr('trich','Trichomes',[-1,.45,-.4]);pr('stomata','Stomata + guard cells',[.55,-.05,.2]);pr('meso','Mesophyll (below)',[-1.45,-.65,1.1]);
  S.add('meso',mesh(new T.BoxGeometry(3.2,.7,2.2),M(0xaed581),0,-.7,0));
  const em=M(0xc5e1a5);
  for(let i=0;i<7;i++)for(let j=0;j<5;j++){const x=-1.38+i*.46,z=-.92+j*.46;if(Math.abs(x-.55)<.3&&Math.abs(z-.15)<.3)continue;if(Math.abs(x+.5)<.3&&Math.abs(z+.3)<.3)continue;S.add('epi',mesh(new T.BoxGeometry(.43,.2,.43),em,x,-.15,z))}
  S.add('cuticle',mesh(new T.BoxGeometry(3.2,.05,2.2),M(0xfff59d,{transparent:true,opacity:.45,roughness:.15}),0,-.03,0));
  const gm=M(0x2e7d32);
  [[.55,.15],[-.5,-.3]].forEach(([x,z])=>[-1,1].forEach(s=>{const g=mesh(new T.SphereGeometry(1,16,12),gm,x+s*.1,-.1,z);g.scale.set(.075,.07,.19);S.add('stomata',g)}));
  const tm=M(0xf1f8e9),gl=M(0xffb300),by=-.05;
  [[-1,-.4,.9],[-.1,.6,.7]].forEach(([x,z,h])=>S.add('trich',mesh(new T.ConeGeometry(.05,h,8),tm,x,by+h/2,z)));
  S.add('trich',mesh(new T.CylinderGeometry(.03,.03,.55,8),tm,.9,by+.275,-.5));S.add('trich',mesh(new T.SphereGeometry(.1,12,10),gl,.9,by+.6,-.5));
  S.add('trich',mesh(new T.CylinderGeometry(.03,.03,.4,8),tm,1.2,by+.2,.5));
  [-1,1].forEach(s=>{const a=mesh(new T.CylinderGeometry(.025,.025,.4,6),tm,1.2+s*.12,by+.5,.5);a.rotation.z=-s*.5;S.add('trich',a)});
  return S};
