
SC['habit']=()=>{const S=new Sc();S.title='Plant habit: herb, shrub, tree, climber, creeper';S.sub='';S.cam=13.5;
  const pr=(id,n,a)=>S.part(id,n,'',a);
  pr('herb','Herb',[-4.2,1.5,0]);pr('shrub','Shrub',[-2.1,1.9,0]);pr('tree','Tree',[0,3.9,0]);pr('climber','Climber',[2.3,2.8,0]);pr('creeper','Creeper',[4.5,.6,0]);
  S.group.position.set(-.4,-1.7,0);
  S.group.add(mesh(new T.BoxGeometry(11.2,.14,2.6),M(0x6d8f3a),.2,-.07,0));
  const V=(x,y,z)=>new T.Vector3(x,y,z),tb=(pts,r0,r1,c)=>new T.Mesh(tube(pts,r0,r1,8),M(c));
  const lf=(id,g,x,y,z,sx,sy,sz,c,rz)=>{const m=S.add(id,mesh(new T.SphereGeometry(1,10,8),M(c),x,y,z),g);m.scale.set(sx,sy,sz);m.rotation.z=rz||0;return m};
  const grp=x=>{const g=new T.Group();g.position.x=x;S.group.add(g);return g};
  {const g=grp(-4.2);S.add('herb',tb([V(0,0,0),V(.03,.4,0),V(-.02,.8,0),V(0,1.1,0)],.04,.03,0x7cb342),g);
   for(let i=0;i<6;i++)lf('herb',g,(i%2?1:-1)*.2,.2+i*.15,0,.2,.04,.1,0x4caf50,(i%2?1:-1)*.3);
   lf('herb',g,0,1.15,0,.1,.1,.1,0xf06292)}
  {const g=grp(-2.1);for(let k=0;k<6;k++){const a=k*1.05,c=Math.cos(a),s=Math.sin(a);
     S.add('shrub',tb([V(0,0,0),V(c*.25,.5,s*.25),V(c*.5,1,s*.5),V(c*.6,1.45,s*.6)],.05,.03,0x8d6e63),g);
     lf('shrub',g,c*.6,1.5,s*.6,.26,.2,.26,0x388e3c);lf('shrub',g,c*.45,.95,s*.45,.2,.16,.2,0x43a047)}}
  {const g=grp(.1);S.add('tree',tb([V(0,0,0),V(.03,.8,0),V(0,1.7,0)],.22,.14,0x6d4c41),g);
   [[-1,1.3],[1,1.5],[0,1.6]].forEach(([s,y])=>{const b=tb([V(0,y,0),V(s*.35,y+.35,s*.1),V(s*.6,y+.8,0)],.07,.04,0x6d4c41);S.add('tree',b,g)});
   [[0,3.2,.8],[-.7,2.6,.6],[.7,2.7,.65],[-.4,3.0,.55],[.5,3.3,.5]].forEach(([x,y,r],i)=>lf('tree',g,x,y,0,r,r*.85,r,[0x2e7d32,0x388e3c,0x43a047][i%3]))}
  {const g=grp(2.3);S.add('climber',mesh(new T.CylinderGeometry(.04,.04,2.6,10),M(0x9e9e9e),0,1.3,0),g);
   const hp=[];for(let i=0;i<=40;i++){const t=i/40,a=t*TAU*3.2;hp.push(V(Math.cos(a)*.12,t*2.4,Math.sin(a)*.12))}
   S.add('climber',tb(hp,.035,.03,0x66bb6a),g);
   for(let i=3;i<40;i+=5){const p=hp[i];lf('climber',g,p.x*2.4,p.y,p.z*2.4,.2,.05,.12,0x4caf50,p.x>0?.3:-.3)}
   const tc=[];for(let i=0;i<=16;i++){const a=i/16*TAU*1.5;tc.push(V(.12+Math.cos(a)*.1*(1-i/20),2.4+i*.01+Math.sin(a)*.1,Math.sin(a*.5)*.1))}S.add('climber',tb(tc,.015,.01,0x66bb6a),g)}
  {const g=grp(4.5),cp=[];for(let i=0;i<=20;i++){const x=-1+i*.1;cp.push(V(x,.05,Math.sin(x*3)*.3))}
   S.add('creeper',tb(cp,.04,.035,0x7cb342),g);
   for(let i=1;i<20;i+=2){const p=cp[i],s=(i%4===1?1:-1);lf('creeper',g,p.x,.09,p.z+s*.14,.15,.03,.1,0x4caf50);S.add('creeper',mesh(new T.ConeGeometry(.02,.14,5),M(0x8d6e63),p.x,-.03,p.z),g)}
   lf('creeper',g,.4,.2,cp[14].z+.1,.07,.07,.07,0xf06292);lf('creeper',g,-.5,.2,cp[5].z-.1,.07,.07,.07,0xfff176)}
  return S};
