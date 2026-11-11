

const cssv=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const W3=(x,y)=>new T.Vector3((x-180)/40,(318-y)/40,0);
const cubic=(P,n)=>{const o=[];for(let i=0;i<=n;i++){const t=i/n,k=1-t,a=k*k*k,b=3*k*k*t,c=3*k*t*t,d=t*t*t;
  o.push(W3(a*P[0][0]+b*P[1][0]+c*P[2][0]+d*P[3][0],a*P[0][1]+b*P[1][1]+c*P[2][1]+d*P[3][1]))}return o};
const quad=(P,n)=>cubic([P[0],[(P[0][0]+2*P[1][0])/3,(P[0][1]+2*P[1][1])/3],[(P[2][0]+2*P[1][0])/3,(P[2][1]+2*P[1][1])/3],P[2]],n);
function tube(pts,r0,r1,rad){
  rad=rad||12;const c=new T.CatmullRomCurve3(pts),N=Math.max(24,pts.length*2);
  const g=new T.TubeGeometry(c,N,1,rad,false),pos=g.attributes.position,v=new T.Vector3(),ct=new T.Vector3(),row=rad+1;
  for(let i=0;i<=N;i++){c.getPointAt(i/N,ct);const r=r0+(r1-r0)*i/N;
    for(let j=0;j<row;j++){const k=i*row+j;v.fromBufferAttribute(pos,k).sub(ct).multiplyScalar(r).add(ct);pos.setXYZ(k,v.x,v.y,v.z)}}
  pos.needsUpdate=true;return g}
const ORG={taproot:'root',lateral:'root',rcap:'root',rhair:'root',internode:'stem',node:'stem',branch:'stem',abud:'stem',axbud:'stem',fbud:'stem',trich:'stem',blade:'leaf',vein:'leaf',petiole:'leaf',lbase:'leaf',stipule:'leaf',petal:'flower',sepal:'flower',stamen:'flower',carpel:'flower',pericarp:'fruit',flesh:'fruit',fseed:'fruit',calyx:'fruit',pedicel:'fruit',seed:'seed'};
const PNAME={taproot:'Primary root',lateral:'Lateral roots',rcap:'Root cap',rhair:'Root hairs',internode:'Main stem (internode)',node:'Node',branch:'Branch',abud:'Apical bud',axbud:'Axillary bud',fbud:'Flower bud',trich:'Trichomes',blade:'Leaf blade',vein:'Midrib / veins',petiole:'Petiole',lbase:'Leaf base',stipule:'Stipules',petal:'Petals',sepal:'Sepals',stamen:'Stamens',carpel:'Carpel',pericarp:'Fruit wall (pericarp)',flesh:'Flesh',fseed:'Seeds',calyx:'Calyx',pedicel:'Pedicel',seed:'Seed',bee:'Bee',sprout:'New plant'};
const NAMEH=id=>id==='soil'?'Soil':(PNAME[id]||(P[id]?P[id].name:id));
let H=null,labelsOn=true;
try{labelsOn=localStorage.getItem('pv_labels')!=='0'}catch(e){}
