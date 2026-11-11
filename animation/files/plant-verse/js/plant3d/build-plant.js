
function buildPlant(){
  const group=new T.Group(),shoot=new T.Group(),roots=new T.Group(),parts={},hits=[],soilHits=[],reg=[],Y=new T.Vector3(0,1,0),V3=(x,y,z)=>new T.Vector3(x,y,z);
  group.add(roots);group.add(shoot);
  let sd0=11;const rng=()=>{sd0=(sd0*16807)%2147483647;return(sd0-1)/2147483646};
  const mat=(v,o)=>{const m=new T.MeshStandardMaterial(Object.assign({color:new T.Color(cssv(v)||'#888888'),roughness:.72,metalness:0,side:T.DoubleSide},o||{}));reg.push([m,v]);return m};
  const flat=c=>new T.MeshStandardMaterial({color:c,roughness:.7,side:T.DoubleSide});
  const part=id=>parts[id]||(parts[id]={id,mats:[],meshes:[]});
  const put=(id,m,parent)=>{const p=part(id);m.userData.pid=id;p.meshes.push(m);[].concat(m.material).forEach(x=>{if(p.mats.indexOf(x)<0)p.mats.push(x)});(parent||group).add(m);return m};
  const sph=(r,a,b)=>new T.SphereGeometry(r,a||24,b||16);
  const dirQ=v=>new T.Quaternion().setFromUnitVectors(Y,v.clone().normalize());
  const merge=list=>{const pos=[],nor=[];list.forEach(g=>{const p=g.attributes.position,n=g.attributes.normal,ix=g.index,cnt=ix?ix.count:p.count;
    for(let i=0;i<cnt;i++){const j=ix?ix.getX(i):i;pos.push(p.getX(j),p.getY(j),p.getZ(j));nor.push(n.getX(j),n.getY(j),n.getZ(j))}});
    const m=new T.BufferGeometry();m.setAttribute('position',new T.Float32BufferAttribute(pos,3));m.setAttribute('normal',new T.Float32BufferAttribute(nor,3));return m};

  
  const stemM=mat('--stem'),sp=cubic([[180,318],[184,260],[176,190],[180,112]],28);
  put('internode',new T.Mesh(tube(sp,.112,.1,14),stemM),shoot);
  put('internode',mesh(sph(.112),stemM,sp[0].x,sp[0].y,0),shoot);put('internode',mesh(sph(.1),stemM,sp[28].x,sp[28].y,0),shoot);
  const sh=mesh(new T.CylinderGeometry(.2,.2,5.15,12),stemM,0,2.575,0);sh.visible=false;sh.userData.pid='internode';hits.push(sh);shoot.add(sh);
  const stemAt=y=>{let b=sp[0];sp.forEach(q=>{if(Math.abs(q.y-y)<Math.abs(b.y-y))b=q});return b.clone()};
  const nodeM=flat(0x4e7d35);
  [.75,1.4,2.3,3.55].forEach(y=>{const c=stemAt(y),m=put('node',mesh(sph(1,16,10),nodeM,c.x,y,0),shoot);m.scale.set(.17,.1,.17)});
  {const hs=[];for(let i=0;i<90;i++){const y=.15+rng()*4.9,c=stemAt(y),a=rng()*TAU,d=new T.Vector3(Math.cos(a),.9,Math.sin(a)).normalize();
     const g=new T.ConeGeometry(.011,.14,4).translate(0,.07,0);g.applyMatrix4(new T.Matrix4().makeRotationFromQuaternion(dirQ(d)));g.translate(c.x+Math.cos(a)*.105,y,c.z+Math.sin(a)*.105);hs.push(g)}
   put('trich',new T.Mesh(merge(hs),flat(0xeaf6e4)),shoot)}

  
  {const bp=[V3(0,.75,0),V3(-.45,1.0,.1),V3(-.9,1.45,.12),V3(-1.2,1.95,.12)],tg=bp[3].clone().sub(bp[2]).normalize();
   put('branch',new T.Mesh(tube(bp,.075,.05,10),mat('--stem')),shoot);
   const ab=put('abud',mesh(sph(1,12,10),flat(0x9ccc65),bp[3].x+tg.x*.12,bp[3].y+tg.y*.12,bp[3].z),shoot);ab.scale.set(.09,.17,.09);ab.quaternion.copy(dirQ(tg));
   const bl=mat('--leaf');
   [[bp[2],-.22,.05,.3],[bp[1],.22,.12,-.3]].forEach(([p,dx,dy,rz])=>{const m=put('blade',mesh(sph(1,12,8),bl,p.x+dx,p.y+dy,p.z),shoot);m.scale.set(.28,.05,.14);m.rotation.z=rz});
   [[-.09,2.52,.05,.4],[.09,3.77,.05,-.4]].forEach(([x,y,z,rz])=>{const m=put('axbud',mesh(sph(1,10,8),flat(0x8bc34a),x,y,z),shoot);m.scale.set(.065,.12,.065);m.rotation.z=rz});
   const s0=stemAt(4.35);
   put('fbud',new T.Mesh(tube([V3(s0.x,4.35,0),V3(-.3,4.55,.05),V3(-.55,4.85,.1)],.035,.03,8),flat(0x6aa04a)),shoot);
   const fb=put('fbud',mesh(sph(1,16,12),mat('--petal'),-.58,4.98,.1),shoot);fb.scale.set(.14,.22,.14);
   [0,1,2].forEach(k=>{const c=put('fbud',mesh(new T.ConeGeometry(.07,.18,6),flat(0x4caf50),-.58+Math.cos(k*2.1)*.09,4.84,.1+Math.sin(k*2.1)*.09),shoot);c.rotation.z=Math.cos(k*2.1)*.4})}

  
  const rootM=mat('--root'),capM=new T.MeshStandardMaterial({color:0xd9bf94,roughness:.7});
  const tp=cubic([[180,318],[176,360],[184,410],[178,474]],30);
  put('taproot',new T.Mesh(tube(tp,.0875,.05,12),rootM),roots);put('rcap',mesh(sph(.06,12,8),capM,tp[30].x,tp[30].y,0),roots);
  const hairP=[];
  const hairs=(pts,from,step,n,rad,len)=>{for(let i=from;i<pts.length-1;i+=step){const q=pts[i],t=pts[i+1].clone().sub(pts[Math.max(i-1,0)]).normalize();
    for(let k=0;k<n;k++){const r=new T.Vector3(rng()-.5,rng()-.5,rng()-.5).normalize(),d=r.sub(t.clone().multiplyScalar(r.dot(t))).normalize(),l=len*(.6+rng()*.8);
      hairP.push(q.x+d.x*rad,q.y+d.y*rad,q.z+d.z*rad,q.x+d.x*(rad+l),q.y+d.y*(rad+l)-.03*rng(),q.z+d.z*(rad+l))}}};
  hairs(tp,5,2,3,.07,.2);
  const LAT={a:[[180,346],[152,354],[130,374],[112,410]],b:[[180,376],[210,386],[232,400],[248,436]],c:[[179,410],[158,420],[146,440],[140,466]],d:[[180,334],[204,340],[226,352],[246,350]]};
  [['a',0],['a',Math.PI/2],['b',0],['b',-Math.PI/2],['c',0],['c',-Math.PI/2],['d',0],['d',Math.PI/2]].forEach(([k,phi])=>{
    const pts=cubic(LAT[k],18).map(v=>v.applyAxisAngle(Y,phi)),e=pts[18];
    put('lateral',new T.Mesh(tube(pts,.044,.022,8),rootM),roots);put('rcap',mesh(sph(.03,10,8),capM,e.x,e.y,e.z),roots);
    hairs(pts,3,1,2,.035,.12);
    [8,13].forEach(ix=>{const s=pts[ix],t=pts[ix+1].clone().sub(pts[ix-1]).normalize(),side=new T.Vector3(rng()-.5,-.1+(rng()-.5)*.4,rng()-.5);
      side.sub(t.clone().multiplyScalar(side.dot(t))).normalize();
      const dir=t.clone().multiplyScalar(.7).add(side).normalize(),len=.5+rng()*.25,bp=[];
      for(let j=0;j<=6;j++){const u=j/6;bp.push(new T.Vector3(s.x+dir.x*len*u,s.y+dir.y*len*u-.18*u*u,s.z+dir.z*len*u))}
      put('lateral',new T.Mesh(tube(bp,.02,.007,6),rootM),roots);put('rcap',mesh(sph(.014,6,5),capM,bp[6].x,bp[6].y,bp[6].z),roots);hairs(bp,2,1,2,.015,.07)})});
  const hg=new T.BufferGeometry();hg.setAttribute('position',new T.Float32BufferAttribute(hairP,3));
  const hairM=new T.LineBasicMaterial({color:0xe9dcc3,transparent:true,opacity:.8});put('rhair',new T.LineSegments(hg,hairM),roots);
  const rh=mesh(new T.CylinderGeometry(.5,.5,4,12),rootM,0,-2,0);rh.visible=false;rh.userData.pid='taproot';hits.push(rh);roots.add(rh);

  
  const leafM=mat('--leaf'),edgeM=mat('--leaf2'),veinM=mat('--leaf2'),petM=flat(0x6aa04a),lbM=flat(0x4a8f3c),stipM=flat(0xa5d66b);
  function leaf(base,c1,c2,rotY,pet){
    const NU=22,NV=8,bw=W3(base[0],base[1]),A=cubic(c1,NU).map(v=>v.sub(bw)),B=cubic(c2,NU).map(v=>v.sub(bw));
    const pp=(i,j,off)=>{const t=j/NV,x=B[i].x+(A[i].x-B[i].x)*t,y=B[i].y+(A[i].y-B[i].y)*t,w=Math.hypot(A[i].x-B[i].x,A[i].y-B[i].y),u=i/NU;
      return [x,y,.28*Math.abs(2*t-1)*w+.16*u*u+off]};
    const grid=off=>{const q=[],ix=[];for(let i=0;i<=NU;i++)for(let j=0;j<=NV;j++)q.push(...pp(i,j,off));
      for(let i=0;i<NU;i++)for(let j=0;j<NV;j++){const a=i*(NV+1)+j;ix.push(a,a+1,a+NV+1,a+1,a+NV+2,a+NV+1)}
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(q,3));g.setIndex(ix);g.computeVertexNormals();return g};
    const strip=j=>{const q=[],ix=[];for(let i=0;i<=NU;i++){q.push(...pp(i,j,.02),...pp(i,j,-.02))}
      for(let i=0;i<NU;i++){const a=i*2;ix.push(a,a+1,a+2,a+1,a+3,a+2)}
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(q,3));g.setIndex(ix);g.computeVertexNormals();return g};
    const lg=new T.Group();lg.position.copy(bw);shoot.add(lg);
    const g=new T.Group();g.position.copy(pet);g.rotation.y=rotY;lg.add(g);
    put('blade',new T.Mesh(grid(.02),leafM),g);put('blade',new T.Mesh(grid(-.02),leafM),g);
    put('blade',new T.Mesh(strip(0),edgeM),g);put('blade',new T.Mesh(strip(NV),edgeM),g);
    const mid=[];for(let i=0;i<=NU-1;i++){const q=pp(i,NV/2,0);mid.push(new T.Vector3(q[0],q[1],q[2]))}
    put('vein',new T.Mesh(tube(mid,.035,.012,8),veinM),g);
    const pd=pet.clone().normalize();
    put('petiole',new T.Mesh(tube([V3(0,0,0),pet.clone().multiplyScalar(.5).add(V3(0,.05,0)),pet.clone()],.055,.042,8),petM),lg);
    const lb=put('lbase',new T.Mesh(new T.CylinderGeometry(.045,.12,.22,12),lbM),lg);lb.position.copy(pd.clone().multiplyScalar(.1));lb.quaternion.copy(dirQ(pd));
    [-1,1].forEach(s=>{const m=put('stipule',mesh(sph(1,8,6),stipM),lg);m.position.set(pd.x*.1,.15,s*.14);m.scale.set(.04,.18,.02);m.rotation.set(s*.5,0,-pd.x*.4)});
    return lg}
  const leaf1=leaf([180,226],[[180,226],[160,192],[124,174],[84,172]],[[180,226],[138,226],[100,204],[84,172]],.35,V3(-.5,.15,.02));
  const leaf2=leaf([180,176],[[180,176],[204,148],[238,130],[276,128]],[[180,176],[224,184],[262,162],[276,128]],-.35,V3(.5,.15,.02));

  
  const stemM2=mat('--stem'),cal=mat('--leaf2'),fr=new T.MeshStandardMaterial({color:0xd63a26,roughness:.45,side:T.DoubleSide});
  const ap=W3(181,262),fruitG=new T.Group();fruitG.position.copy(ap);shoot.add(fruitG);
  const fp=quad([[181,262],[214,252],[232,268]],14).map(v=>v.sub(ap));
  const stalk=put('pedicel',new T.Mesh(tube(fp,.044,.044,8),stemM2),fruitG);
  const fcL=W3(240,284).sub(ap),R=.525,n0=new T.Vector3(.35,-.15,.92).normalize();
  {const wall=sph(R,36,24),ix=wall.index.array,ps=wall.attributes.position,keep=[];
   for(let i=0;i<ix.length;i+=3){let cx=0,cy=0,cz=0;for(let k=0;k<3;k++){cx+=ps.getX(ix[i+k]);cy+=ps.getY(ix[i+k]);cz+=ps.getZ(ix[i+k])}
     const l=Math.hypot(cx,cy,cz)||1;if((cx*n0.x+cy*n0.y+cz*n0.z)/l<.86)keep.push(ix[i],ix[i+1],ix[i+2])}
   wall.setIndex(keep);put('pericarp',mesh(wall,fr,fcL.x,fcL.y,0),fruitG)}
  {const win=new T.Group();win.position.copy(fcL.clone().add(n0.clone().multiplyScalar(.447)));win.quaternion.setFromUnitVectors(V3(0,0,1),n0);fruitG.add(win);
   put('flesh',mesh(new T.CircleGeometry(.29,28),flat(0xe8685a)),win);put('flesh',mesh(new T.CircleGeometry(.13,20),flat(0xf3a58f),0,0,.004),win);
   const fs=flat(0xf7ecb5);for(let k=0;k<6;k++){const a=k*TAU/6+.3,m=put('fseed',mesh(sph(1,8,6),fs,Math.cos(a)*.09,Math.sin(a)*.09,.012),win);m.scale.set(.03,.045,.016);m.rotation.z=a}}
  for(let k=0;k<5;k++){const psi=k*TAU/5,al=.3,n=new T.Vector3(Math.sin(al)*Math.cos(psi),Math.cos(al),Math.sin(al)*Math.sin(psi)),
      t=new T.Vector3(Math.cos(al)*Math.cos(psi),-Math.sin(al),Math.cos(al)*Math.sin(psi));
    const c=put('calyx',new T.Mesh(new T.ConeGeometry(.085,.32,8),cal),fruitG);
    c.position.set(fcL.x+n.x*R*.99+t.x*.1,fcL.y+n.y*R*.99+t.y*.1,n.z*R*.99+t.z*.1);c.quaternion.setFromUnitVectors(Y,t)}
  put('calyx',mesh(sph(.085,12,8),cal,fcL.x,fcL.y+R*.995,0),fruitG);

  
  const fg=new T.Group();fg.position.set(0,W3(0,96).y,0);shoot.add(fg);
  const pm=mat('--petal'),sepM=mat('--leaf'),tilts=[];
  for(let k=0;k<5;k++){const piv=new T.Group();piv.rotation.z=-(k*TAU/5+TAU/10);const s2=put('sepal',new T.Mesh(sph(1,14,10),sepM),piv);s2.scale.set(.14,.42,.04);s2.position.set(0,.72,-.07);s2.rotation.x=-.25;fg.add(piv)}
  for(let k=0;k<5;k++){const piv=new T.Group(),tilt=new T.Group();piv.rotation.z=-k*TAU/5;tilt.rotation.x=.22;piv.add(tilt);tilts.push(tilt);
    const q=new T.Mesh(sph(1,28,18),pm);q.scale.set(.35,.675,.07);q.position.set(0,.7,.012*k);put('petal',q,tilt);fg.add(piv)}
  const filM=flat(0xf0e08a),antM=flat(0xf5a31a);
  for(let k=0;k<8;k++){const a=k*TAU/8+.2,b=V3(Math.cos(a)*.16,Math.sin(a)*.16,.1),tv=V3(Math.cos(a)*.3,Math.sin(a)*.3,.72),d=tv.clone().sub(b);
    const fl=put('stamen',new T.Mesh(new T.CylinderGeometry(.012,.012,d.length(),6),filM),fg);fl.position.copy(b.clone().add(tv).multiplyScalar(.5));fl.quaternion.copy(dirQ(d));
    const an=put('stamen',mesh(sph(1,10,8),antM),fg);an.position.copy(tv);an.scale.set(.045,.08,.045);an.quaternion.copy(dirQ(d))}
  const pc=mesh(sph(.3,28,18),mat('--pollen'),0,0,.05);pc.scale.z=.75;put('carpel',pc,fg);
  put('carpel',mesh(new T.CylinderGeometry(.03,.03,.85,8).rotateX(Math.PI/2),flat(0xb7d66b),0,0,.52),fg);put('carpel',mesh(sph(.075,12,10),flat(0x9ccc65),0,0,.95),fg);

  
  const seedM=mat('--seedc');
  const seed=put('seed',mesh(sph(1,16,12),seedM,0,-.3,0),group);
  const SEEDT=[[1.3,.07,.9],[2.9,.07,.8],[3.5,.07,-.6],[1.7,.07,-1.2],[2.5,.07,1.4]];
  const scat=SEEDT.map(()=>put('seed',mesh(sph(1,10,8),seedM),group));
  const sMat=mat('--stem'),lMat=mat('--leaf');
  const mkSprout=(x,z)=>{const g=new T.Group();g.position.set(x,0,z);
    put('sprout',new T.Mesh(tube(cubic([[180,318],[182,300],[178,280],[180,262]],12),.06,.045,8),sMat),g);
    [-1,1].forEach(s=>{const m=new T.Mesh(sph(1,12,8),lMat);m.scale.set(.38,.07,.2);m.position.set(s*.32,1.38,0);m.rotation.z=s*.35;put('sprout',m,g)});
    group.add(g);return g};
  const spA=mkSprout(SEEDT[1][0],SEEDT[1][2]),spB=mkSprout(SEEDT[3][0],SEEDT[3][2]);

  
  const bee=new T.Group(),bodyM=new T.MeshStandardMaterial({color:0xffc107,roughness:.6}),darkM=new T.MeshStandardMaterial({color:0x1b1b1b,roughness:.7}),wingM=new T.MeshStandardMaterial({color:0xffffff,transparent:true,opacity:.6,side:T.DoubleSide});
  const body=put('bee',mesh(sph(1,16,12),bodyM),bee);body.scale.set(.5,.32,.32);
  [-.12,.16].forEach(x=>{bee.add(mesh(new T.TorusGeometry(.31,.045,6,18).rotateY(Math.PI/2),darkM,x,0,0))});
  bee.add(mesh(sph(.2,12,10),darkM,.55,0,0));
  const wingL=mesh(sph(1,10,8),wingM,0,.3,.2),wingR=mesh(sph(1,10,8),wingM,0,.3,-.2);wingL.scale.set(.3,.04,.2);wingR.scale.set(.3,.04,.2);bee.add(wingL,wingR);
  group.add(bee);
  const PN=14,pa=new Float32Array(PN*3),pg=new T.BufferGeometry();pg.setAttribute('position',new T.BufferAttribute(pa,3));
  const pollenPts=new T.Points(pg,new T.PointsMaterial({color:0xf5b942,size:.11,sizeAttenuation:true}));group.add(pollenPts);
  const fy=W3(0,96).y;

  
  const sw=9,sd=4.4;
  const mkTex=(w,h,base,dots,cnt,o)=>{const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');
    x.fillStyle=base;x.fillRect(0,0,w,h);
    for(let i=0;i<cnt;i++){x.fillStyle=dots[Math.floor(rng()*dots.length)];x.globalAlpha=.35+rng()*.5;const r=o.min+rng()*(o.max-o.min),px=rng()*w,py=rng()*h;x.beginPath();
      if(o.chips){x.moveTo(px,py);for(let k=1;k<6;k++)x.lineTo(px+Math.cos(k*1.26+rng())*r*1.5,py+Math.sin(k*1.26+rng())*r);x.closePath()}else x.arc(px,py,r,0,TAU);x.fill()}
    x.globalAlpha=1;
    if(o.cracks){x.strokeStyle='rgba(25,25,30,.55)';x.lineWidth=2;for(let i=0;i<10;i++){let px=rng()*w,py=rng()*h;x.beginPath();x.moveTo(px,py);for(let k=0;k<5;k++){px+=(rng()-.5)*120;py+=(rng()-.5)*30;x.lineTo(px,py)}x.stroke()}}
    const gr=x.createLinearGradient(0,0,0,h);gr.addColorStop(0,'rgba(0,0,0,.16)');gr.addColorStop(.1,'rgba(0,0,0,0)');gr.addColorStop(.88,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,.3)');x.fillStyle=gr;x.fillRect(0,0,w,h);
    return new T.CanvasTexture(c)};
  const LAY=[['Topsoil',0,-1.3,'#4a3326',['#2c1d14','#6a4a33','#5a3f2c','#7b5a43'],1400,{min:1,max:3}],
    ['Subsoil',-1.3,-3,'#8c5b36',['#a8704a','#70472a','#c28a5c','#5e3b22'],1100,{min:1.5,max:4.5,chips:1}],
    ['Weathered rock',-3,-4.3,'#a39a86',['#cfc6b0','#7e7765','#b8ae96','#6b6554'],800,{min:3,max:9,chips:1}],
    ['Bedrock',-4.3,-5.1,'#6b6f75',['#868a90','#55585d','#7a7e84'],400,{min:4,max:12,chips:1,cracks:1}]];
  LAY.forEach(([name,top,bot,base,dots,cnt,o])=>{
    const tex=mkTex(1024,160,base,dots,cnt,o),back=new T.MeshBasicMaterial({map:tex,side:T.BackSide}),side=new T.MeshBasicMaterial({map:tex,side:T.BackSide,color:0xa8a8a8});
    const m=new T.Mesh(new T.BoxGeometry(sw,top-bot,sd).translate(0,(top+bot)/2,0),[side,side,side,side,back,back]);
    m.userData.pid='soil';m.userData.layer=name;group.add(m);soilHits.push(m)});
  {const tex=mkTex(512,256,'#4f6f2c',['#3e5a22','#6d8f3a','#2f4a1a','#7aa043'],900,{min:1,max:3});
   const top=mesh(new T.PlaneGeometry(sw,sd).rotateX(-Math.PI/2),new T.MeshBasicMaterial({map:tex,side:T.DoubleSide}));top.userData.pid='soil';top.userData.layer='Grass';group.add(top);soilHits.push(top)}

  
  {const NB=320,im=new T.InstancedMesh(new T.ConeGeometry(.04,1,3,1).translate(0,.5,0),new T.MeshStandardMaterial({color:0xffffff,roughness:.8}),NB),du=new T.Object3D(),gc=[0x4caf50,0x66bb6a,0x2e7d32,0x7cb342,0x388e3c],cl=new T.Color();
   let i=0;while(i<NB){const cx=(rng()*2-1)*4.2,cz=(rng()*2-1)*2,n=5+Math.floor(rng()*5);
     for(let k=0;k<n&&i<NB;k++,i++){const x=cx+(rng()-.5)*.35,z=cz+(rng()-.5)*.35;
       du.position.set(Math.abs(x)<.3&&Math.abs(z)<.3?x+.6:x,0,z);du.rotation.set((rng()-.5)*.6,rng()*TAU,(rng()-.5)*.6);du.scale.set(1,.22+rng()*.38,1);du.updateMatrix();
       im.setMatrixAt(i,du.matrix);im.setColorAt(i,cl.setHex(gc[Math.floor(rng()*gc.length)]))}}
   im.instanceMatrix.needsUpdate=true;im.frustumCulled=false;group.add(im)}

  
  let ripeCol=new T.Color(cssv('--fruit')||'#d63a26');
  const sc=(o,s)=>{o.visible=s>.004;o.scale.setScalar(Math.max(s,.001))};
  const dropX=.7,dropY=1.075;
  const apply=(V,t)=>{
    sc(roots,V.root);sc(shoot,V.shoot);sc(leaf1,V.l1);sc(leaf2,V.l2);sc(fg,V.flower);sc(fruitG,V.fruit);
    seed.visible=V.seed>.01;seed.scale.set(.2,.3,.2).multiplyScalar(Math.max(V.seed,.001));
    tilts.forEach(q=>q.rotation.x=.22+(1-V.bloom)*1.05);
    const d=V.drop;fruitG.position.set(ap.x+(dropX-ap.x)*d,ap.y+(dropY-ap.y)*d*d,0);fruitG.rotation.z=d*.35;stalk.visible=d<.02;
    fr.color.set(0x8bc34a).lerp(ripeCol,V.ripe);
    const so=V.seedsOut,cx=fruitG.position.x+fcL.x,cy=fruitG.position.y+fcL.y;
    scat.forEach((m,i)=>{const g=SEEDT[i],k=(i===1||i===3)?1-V.sprout:1;m.visible=so>.01&&k>.01;m.scale.set(.1,.14,.1).multiplyScalar(Math.max(k,.001));
      m.position.set(cx+(g[0]-cx)*so,cy+(g[1]-cy)*so+Math.sin(so*Math.PI)*.8,g[2]*so)});
    sc(spA,V.sprout);sc(spB,V.sprout*.85);
    bee.visible=V.bee>.02;if(bee.visible){const a=t*1.6;bee.scale.setScalar(Math.max(V.bee,.001)*.5);
      bee.position.set(.15+Math.cos(a)*.95,fy+.45+Math.sin(t*2.7)*.14,.3+Math.sin(a)*.7);bee.rotation.y=-a;
      const f=Math.sin(t*45)*.4;wingL.rotation.x=.5+f;wingR.rotation.x=-.5-f}
    pollenPts.visible=V.bee>.3;if(pollenPts.visible){for(let i=0;i<PN;i++){const a=i*2.4+t*.9;pa[i*3]=Math.cos(a)*(.12+.1*((i*7)%5)/5);pa[i*3+1]=fy+.1+Math.abs(Math.sin(a*1.3+i))*.55;pa[i*3+2]=.25+Math.sin(a)*.2}
      pg.attributes.position.needsUpdate=true}};
  const fruitAt=v=>fruitG.position.clone().add(v);
  return {group,parts,hits,soilHits,reg,anchors:{tap:tp[22].clone(),lat:cubic(LAT.a,18)[9],hair:tp[14].clone().add(V3(.18,0,0)),cap:tp[30].clone()},apply,hair:hairM,
    fruitAt,fcL,n0,R,beePt:()=>bee.position.clone(),sproutPt:()=>spA.position.clone().add(V3(0,.9,0)),refresh:()=>ripeCol.set(cssv('--fruit')||'#d63a26')}}
