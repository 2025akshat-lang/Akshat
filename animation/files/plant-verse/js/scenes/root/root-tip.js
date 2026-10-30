
SC['root-tip']=()=>{const S=new Sc();S.title='Root tip: cap, meristem, elongation, hairs';S.sub='';S.cam=6.6;
  const pr=(id,n,a)=>S.part(id,n,'',a);
  pr('rcap','Root cap',[0,-1.95,.1]);pr('mer','Apical meristem',[0,-1.3,.1]);pr('elong','Zone of elongation',[.5,-.4,.1]);pr('matur','Zone of maturation',[.5,1.0,.1]);
  pr('epi','Epidermis',[-.48,.6,.1]);pr('cortex','Cortex',[-.36,1.3,.1]);pr('endo','Endodermis',[-.24,0,.1]);pr('peri','Pericycle',[.2,1.7,.1]);
  pr('xylem','Xylem',[0,1.2,.1]);pr('phloem','Phloem',[.14,.5,.1]);pr('hair','Root hairs',[.8,1.4,0]);
  const pl=(id,x0,x1,y0,y1,col,z,o)=>S.add(id,mesh(new T.PlaneGeometry(x1-x0,y1-y0),M(col,o),(x0+x1)/2,(y0+y1)/2,z));
  const dome=(rx,ry,cy,top)=>{const sh=new T.Shape();sh.moveTo(-rx,top);sh.lineTo(-rx,cy);for(let i=1;i<=24;i++){const t=Math.PI+i*Math.PI/24;sh.lineTo(rx*Math.cos(t),cy+ry*Math.sin(t))}sh.lineTo(rx,top);sh.closePath();return new T.ShapeGeometry(sh)};
  S.add('rcap',mesh(dome(.62,.65,-1.3,-1.3),M(0xd9bf94),0,0,0));
  S.add('mer',mesh(dome(.5,.45,-1.25,-.95),M(0xffd54f),0,0,.002));
  const y0=-.95,y1=2;
  [['epi',.46,.5,0xc8a165],['cortex',.26,.46,0xe6d2a6],['endo',.22,.26,0x8d6e63],['peri',.18,.22,0xffcc80],['phloem',.1,.18,0x9575cd]].forEach(([id,a,b,c])=>{pl(id,a,b,y0,y1,c,.004);pl(id,-b,-a,y0,y1,c,.004)});
  pl('xylem',-.1,.1,y0,y1,0xe65100,.004);
  pl('elong',-.52,.52,y0,.25,0x80cbc4,.008,{transparent:true,opacity:.16});pl('matur',-.52,.52,.25,y1,0xaed581,.008,{transparent:true,opacity:.14});
  const cg=new T.CircleGeometry(1,10),dm=M(0xf9a825),cp=M(0xf1dfb8),cl=M(0xfff8e1);
  for(let i=0;i<70;i++){const x=(rnd()*2-1)*.44,y=-1.62+rnd()*.64;if(y<-1.25&&Math.abs(x)>.5*Math.sqrt(Math.max(0,1-Math.pow((y+1.25)/.45,2))))continue;S.add('mer',mesh(cg,dm,x,y,.006)).scale.set(.022,.022,1)}
  for(let i=0;i<22;i++){const a=Math.PI+rnd()*Math.PI,r=.54+rnd()*.07,x=r*Math.cos(a),y=-1.3+r*1.05*Math.sin(a);S.add('rcap',mesh(cg,cp,x,y,.004)).scale.set(.045,.045,1)}
  for(let y=-.9;y<.2;y+=.22)[-1,1].forEach(s=>S.add('cortex',mesh(cg,cl,s*.36,y,.006)).scale.set(.05,.11,1));
  for(let y=.3;y<1.95;y+=.2)[-1,1].forEach(s=>S.add('cortex',mesh(cg,cl,s*.36,y,.006)).scale.set(.06,.07,1));
  const up=new T.Vector3(0,1,0),hm=M(0xf1e6cf);
  for(let y=.4;y<1.9;y+=.13)[-1,1].forEach(s=>{const ph=.35+rnd()*.5,l=.3+rnd()*.15,d=new T.Vector3(s*Math.cos(ph),Math.sin(ph),0),h=mesh(new T.CylinderGeometry(.008,.018,l,5).translate(0,l/2,0),hm,s*.5,y,.01);h.quaternion.setFromUnitVectors(up,d);S.add('hair',h)});
  const lp=[];for(let i=0;i<=12;i++){const f=i/12*Math.PI/2;lp.push(new T.Vector2(.62*Math.sin(f),-1.3-.65*Math.cos(f)))}lp.push(new T.Vector2(.5,-1.25),new T.Vector2(.5,y1));
  S.add('epi',mesh(new T.LatheGeometry(lp,40,Math.PI/2,Math.PI),M(0xc8a165)));
  return S};
