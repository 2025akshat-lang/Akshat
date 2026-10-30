

function radial(S,rings,len,cut){
  cut=cut||Math.PI/2;const span=TAU-cut;
  rings.forEach((r,i)=>{
    S.part(r.id,r.name,r.desc);const p=S.byId[r.id];
    if(r.virtual){p.vm=M(r.color);return}
    if(!p.anchor){const a=Math.PI*.85+i*.22,rm=(r.r0+r.r1)/2;p.anchor=[rm*Math.cos(a),rm*Math.sin(a),len/2]}
    const mat=M(r.color,r.mat);const add=g=>S.add(r.id,new T.Mesh(g,mat));
    add(new T.RingGeometry(r.r0,r.r1,64,1,cut,span).translate(0,0,len/2));
    add(new T.CylinderGeometry(r.r1,r.r1,len,64,1,true,cut+Math.PI/2,span).rotateX(Math.PI/2));
    if(r.r0>0)add(new T.CylinderGeometry(r.r0,r.r0,len,64,1,true,cut+Math.PI/2,span).rotateX(Math.PI/2));
    const w=r.r1-r.r0,c=(r.r0+r.r1)/2;
    add(new T.PlaneGeometry(w,len).rotateX(Math.PI/2).translate(c,0,0));
    add(new T.PlaneGeometry(w,len).rotateX(Math.PI/2).translate(c,0,0).rotateZ(cut));
  });
  S.inCut=(a,m)=>{a=((a%TAU)+TAU)%TAU;return a<cut+m||a>TAU-m};
  S.len=len;
}

function rod(S,id,r,rad,x,y,color){
  const p=S.byId[id];if(!p.vm)p.vm=M(color);
  return S.add(id,mesh(new T.CylinderGeometry(rad,rad,S.len+.03,24).rotateX(Math.PI/2),p.vm,x,y,0));
}
const pol=(r,a)=>[r*Math.cos(a),r*Math.sin(a)];


function cutSphere(S,id,r,mat,parent){S.add(id,mesh(new T.SphereGeometry(r,48,32,Math.PI/2,Math.PI*1.5),mat),parent)}
function faces(S,id,r,mat,off,parent){
  S.add(id,mesh(new T.CircleGeometry(r,48,Math.PI/2,Math.PI).translate(0,0,off),mat),parent);
  S.add(id,mesh(new T.CircleGeometry(r,48,-Math.PI/2,Math.PI).rotateY(-Math.PI/2).translate(-off,0,0),mat),parent)}


function rod2(S,id,rad,x,y,color,extra){return S.add(id,mesh(new T.CylinderGeometry(rad,rad,S.len+extra,20).rotateX(Math.PI/2),M(color),x,y,0))}
function hairsOn(S,id,n,color,zrange){const hm=M(color),up=new T.Vector3(0,1,0);
  for(let i=0;i<n;i++){const a=Math.PI/2+.25+rnd()*(TAU-Math.PI/2-.5),z=(rnd()-.5)*zrange,l=.25+rnd()*.25,d=new T.Vector3(Math.cos(a),Math.sin(a),(rnd()-.5)*.5).normalize();
    const h=mesh(new T.CylinderGeometry(.01,.02,l,5).translate(0,l/2,0),hm,Math.cos(a),Math.sin(a),z);h.quaternion.setFromUnitVectors(up,d);S.add(id,h)}}

const SC={};
