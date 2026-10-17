/* Renderer, scene, helper functions, cell roots (EU/PR) */
'use strict';
const T=THREE,$=s=>document.querySelector(s),el=$('#c');
const R=new T.WebGLRenderer({canvas:el,antialias:true,alpha:true});R.setPixelRatio(Math.min(devicePixelRatio||1,2));
const CUT=new T.Plane(new T.Vector3(0,0,-1),99);R.clippingPlanes=[CUT];
const S=new T.Scene(),C=new T.PerspectiveCamera(40,1,.05,300);
S.add(new T.HemisphereLight(0xffffff,0x556677,.95));
const dl=new T.DirectionalLight(0xffffff,.85);dl.position.set(4,8,8);S.add(dl);
const rimL=new T.DirectionalLight(0x9fd0ff,.4);rimL.position.set(-5,2,-6);S.add(rimL);
let sd=11;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647;
const V3=a=>new T.Vector3(a[0],a[1],a[2]);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
const sp=(r,w,h)=>new T.SphereGeometry(r,w||20,h||14),cy=(r,h,s)=>new T.CylinderGeometry(r,r,h,s||12),tor=(a,b,arc)=>new T.TorusGeometry(a,b,8,24,arc||Math.PI*2);
const capGeo=(len,r,n)=>{n=n||10;const hc=Math.max(0,len/2-r),P=[];for(let i=0;i<=n;i++){const a=-Math.PI/2+Math.PI/2*i/n;P.push(new T.Vector2(Math.max(.0001,r*Math.cos(a)),-hc+r*Math.sin(a)))}for(let i=0;i<=n;i++){const a=Math.PI/2*i/n;P.push(new T.Vector2(Math.max(.0001,r*Math.cos(a)),hc+r*Math.sin(a)))}return new T.LatheGeometry(P,28)};
const bump=(g,a,f)=>{const p=g.attributes.position,v=new T.Vector3();for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);const n=1+a*Math.sin(f*v.x+1)*Math.sin(f*v.y+2)*Math.sin(f*v.z+3);p.setXYZ(i,v.x*n,v.y*n,v.z*n)}g.computeVertexNormals();return g};
/* ---- cells: two roots, four layers each ---- */
const mkCell=()=>{const g={root:new T.Group()};S.add(g.root);['out','org','cyto','dna'].forEach(k=>{g[k]=new T.Group();g.root.add(g[k])});return g};
const EU=mkCell(),PR=mkCell(),pick=[];
const MAT=(c,op)=>new T.MeshStandardMaterial({color:c,roughness:.5,transparent:true,opacity:op,side:T.DoubleSide,depthWrite:op>.9});
function mk(p,geo,col,x,y,z,k,name,info,o){o=o||{};const op=o.op==null?1:o.op,m=new T.Mesh(geo,MAT(col,op));m.position.set(x,y,z);if(o.s)m.scale.set(o.s[0],o.s[1],o.s[2]);if(o.r)m.rotation.set(o.r[0],o.r[1],o.r[2]);m.userData={k,name,info,det:o.det,out:o.out,op,bs:m.scale.clone(),top:o.top};p.add(m);pick.push(m);return m}
const tb=(p,pts,col,r,k,n,i,o)=>{o=o||{};const cv=new T.CatmullRomCurve3(pts.map(V3));if(o.cl)cv.closed=true;const m=mk(p,new T.TubeGeometry(cv,Math.max(10,pts.length*(o.sg||8)),r,o.rd||6,!!o.cl),col,0,0,0,k,n,i,o);m.userData.cv=cv;return m};
const walk=(p0,n,st,lim)=>{const P=[p0.slice()];let q=p0.slice();for(let i=0;i<n;i++){q=[q[0]+(rnd()-.5)*st*2,q[1]+(rnd()-.5)*st*2,q[2]+(rnd()-.5)*st*2];const d=Math.hypot(q[0],q[1]/.92,q[2]/.92);if(d>lim){const f=lim/d;q=[q[0]*f,q[1]*f,q[2]*f]}P.push(q.slice())}return P};
const ANI={mito:[],free:[],ves:[],pr70:[],pili:null,fla:null,nu:null};
