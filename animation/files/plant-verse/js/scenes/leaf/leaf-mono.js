
SC['leaf-mono']=()=>{const S=new Sc();S.title='Monocot leaf (grass-type): parallel veins';S.sub='';S.cam=6.6;
  const W=3.4,D=2,pr=(id,n,a)=>S.part(id,n,'',a);
  pr('cuticle','Cuticle',[-1.45,.76,1]);pr('uepi','Upper epidermis',[-1.45,.63,1]);pr('bull','Bulliform cells',[-.6,.6,1]);pr('meso','Mesophyll (not differentiated)',[1.2,.05,1]);
  pr('isp','Intercellular spaces',[.5,-.25,1]);pr('vb','Vascular bundle',[0,-.05,1]);pr('bsheath','Bundle sheath',[-1.2,.15,1]);pr('xylem','Xylem',[0,.02,1]);pr('phloem','Phloem',[0,-.12,1]);
  pr('scl','Sclerenchyma',[1.2,.45,1]);pr('lepi','Lower epidermis',[-1.45,-.72,1]);pr('stomata','Stomata + guard cells',[.9,.7,1]);
  let y=.8;const L=[['cuticle',.04,0xdce775,{transparent:true,opacity:.9}],['uepi',.18,0xaed581],['meso',.9,0xa5d6a7],['lepi',.18,0x9ccc65],['cuticle',.04,0xdce775,{transparent:true,opacity:.9}]],ys={};
  L.forEach((l,i)=>{ys[l[0]+(i===4?'2':'')]=y-l[1]/2;S.add(l[0],mesh(new T.BoxGeometry(W,l[1],D),M(l[2],l[3]),0,y-l[1]/2,0));y-=l[1]});
  const ym=ys.meso;
  const cm=M(0x66bb6a),am=M(0xe3f2fd,{transparent:true,opacity:.85});
  for(let i=0;i<22;i++)S.add('meso',mesh(new T.SphereGeometry(.12,12,8),cm,-1.5+rnd()*3,ym+(rnd()-.5)*.55,.15+rnd()*.8));
  for(let i=0;i<16;i++)S.add('isp',mesh(new T.SphereGeometry(.05,8,6),am,-1.5+rnd()*3,ym+(rnd()-.5)*.6,.1+rnd()*.85));
  [-1.2,0,1.2].forEach(x=>{
    S.add('bsheath',mesh(new T.CylinderGeometry(.26,.26,D+.02,24).rotateX(Math.PI/2),M(0x2e7d32),x,ym,0));
    S.add('vb',mesh(new T.CylinderGeometry(.19,.19,D+.04,24).rotateX(Math.PI/2),M(0xdce775),x,ym,0));
    S.add('xylem',mesh(new T.CylinderGeometry(.065,.065,D+.06,18).rotateX(Math.PI/2),M(0xe65100),x,ym+.07,0));
    S.add('phloem',mesh(new T.CylinderGeometry(.06,.06,D+.06,18).rotateX(Math.PI/2),M(0x9575cd),x,ym-.08,0));
    S.add('scl',mesh(new T.BoxGeometry(.3,.17,D+.02),M(0xa1887f),x,ym+.46,0));S.add('scl',mesh(new T.BoxGeometry(.3,.17,D+.02),M(0xa1887f),x,ym-.46,0))});
  [-.6,.6].forEach(x=>{const b=mesh(new T.SphereGeometry(1,16,12),M(0xe1f5fe,{transparent:true,opacity:.85}),x,ys.uepi-.02,0);b.scale.set(.2,.13,.9);S.add('bull',b)});
  const gm=M(0x2e7d32);
  [[.9,.8+.0],[-.4,ys.cuticle2-.1]].forEach(([x,yy],k)=>[-1,1].forEach(s=>{const g=mesh(new T.SphereGeometry(1,16,12),gm,x+s*.17,k?ys.lepi:ys.uepi+.02,0);g.scale.set(.09,.1,.9);S.add('stomata',g)}));
  return S};
