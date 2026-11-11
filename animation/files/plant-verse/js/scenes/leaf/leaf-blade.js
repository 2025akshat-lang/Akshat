
SC['leaf-blade']=()=>{const S=new Sc();S.title='Leaf: what it looks like inside';S.sub='A leaf is ~0.1–0.3 mm thick. Every layer has its own job.';S.cam=6.6;S.view=[.28,-.42];
  const W=3.4,D=2,pr=(id,n,d,a)=>S.part(id,n,d,a);
  pr('cuticle','Cuticle','Waxy layer: stops water from evaporating.',[-1.4,.88,1]);
  pr('uepi','Upper epidermis','Clear, pale green: lets sunlight pass through.',[-1.4,.7,1]);
  pr('pal','Palisade mesophyll','Tall cells packed with chloroplasts. Most photosynthesis happens here.',[-1.2,.25,1]);
  pr('spo','Spongy mesophyll','Loose cells with air gaps between them: gases move through.',[1.2,-.5,1]);
  pr('vein','Vein (xylem + phloem)','Xylem on top brings water, phloem below carries sugar away.',[-.4,-.15,1]);
  pr('lepi','Lower epidermis','The bottom layer. It contains the stomata.',[-1.2,-.85,1]);
  pr('stomata','Stomata + guard cells','A tiny gap between two guard cells: CO₂ in, water vapour out.',[.9,-1,1]);
  pr('sun','Sunlight','Light energy that chloroplasts turn into glucose.',[-1.2,1.7,0]);
  const layers=[['cuticle',.05,0xdce775,{transparent:true,opacity:.9}],['uepi',.2,0xaed581],['pal',.6,0x1b5e20],['spo',.78,0xc5e1a5],['lepi',.2,0x9ccc65]];
  let y=.95,ys={};
  layers.forEach(l=>{ys[l[0]]=[y-l[1]/2,l[1]];
    if(l[0]==='lepi'){const m=M(l[2]),gw=.2,gx=.9;
      const lw=(gx-gw/2)+W/2,rw=W/2-(gx+gw/2);
      S.add('lepi',mesh(new T.BoxGeometry(lw,l[1],D),m,-W/2+lw/2,y-l[1]/2,0));S.add('lepi',mesh(new T.BoxGeometry(rw,l[1],D),m,W/2-rw/2,y-l[1]/2,0))}
    else S.add(l[0],mesh(new T.BoxGeometry(W,l[1],D),M(l[2],l[3]),0,y-l[1]/2,0));
    y-=l[1]});
  const [py,ph]=ys.pal,cm=M(0x43a047),chm=M(0x0d3b12);
  for(let k=0;k<11;k++)for(let j=0;j<3;j++){const x=-1.5+k*.3,z=.8-j*.5;
    S.add('pal',mesh(new T.CylinderGeometry(.11,.11,ph-.06,14),cm,x,py,z));
    if(j===0)for(let c=0;c<3;c++)S.add('pal',mesh(new T.SphereGeometry(.035,8,6),chm,x+(c-1)*.04,py+(c-1)*.14,z+.1))}
  const [sy,sh]=ys.spo,sm=M(0x81c784);
  for(let i=0;i<20;i++){const r=.15+rnd()*.1;S.add('spo',mesh(new T.SphereGeometry(r,14,10),sm,-1.45+rnd()*2.9,sy+(rnd()-.5)*(sh-.3),.1+rnd()*.85)).scale.y=.8}
  const vy=py-ph/2;
  S.add('vein',mesh(new T.CylinderGeometry(.27,.27,D+.02,24).rotateX(Math.PI/2),M(0xdce775),-.4,vy,0));
  S.add('vein',mesh(new T.CylinderGeometry(.1,.1,D+.04,18).rotateX(Math.PI/2),M(0xe65100),-.4,vy+.08,0));
  S.add('vein',mesh(new T.CylinderGeometry(.09,.09,D+.04,18).rotateX(Math.PI/2),M(0x9575cd),-.4,vy-.1,0));
  const gm=M(0x2e7d32),[ly]=ys.lepi;
  [-1,1].forEach(s=>{const g=mesh(new T.SphereGeometry(1,16,12),gm,.9+s*.17,ly,0);g.scale.set(.09,.1,.9);S.add('stomata',g)});
  const sun=M(0xffd54f,{emissive:0xffb300,emissiveIntensity:.8}),ag=[];
  [-1.2,-.4,.4].forEach(x=>{const a=new T.Group();a.position.set(x,1.7,0);
    const sh=mesh(new T.CylinderGeometry(.03,.03,.5,8),sun),hd=mesh(new T.ConeGeometry(.09,.2,12),sun,0,-.32,0);
    [sh,hd].forEach(o=>{S.add('sun',o,a)});S.group.add(a);ag.push(a)});
  S.tick=t=>ag.forEach((a,i)=>a.position.y=1.7+Math.sin(t*2+i)*.08);
  return S};
