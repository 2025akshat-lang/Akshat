
SC['root-mono']=()=>{const S=new Sc();S.title='Monocot root section: polyarch, with pith';S.sub='';S.cam=5.4;
  radial(S,[
    {id:'epi',name:'Epidermis',desc:'',r0:.94,r1:1,color:0xc8a165},
    {id:'cortex',name:'Cortex',desc:'',r0:.45,r1:.94,color:0xe6d2a6},
    {id:'endo',name:'Endodermis',desc:'',r0:.4,r1:.45,color:0x8d6e63},
    {id:'peri',name:'Pericycle',desc:'',r0:.35,r1:.4,color:0xffcc80},
    {id:'conj',name:'Conjunctive tissue',desc:'',r0:.13,r1:.35,color:0xfff3d6},
    {id:'pith',name:'Pith',desc:'',r0:0,r1:.13,color:0xfffde7},
    {id:'xylem',name:'Xylem (many arms)',desc:'',virtual:1,color:0xe65100},
    {id:'phloem',name:'Phloem',desc:'',virtual:1,color:0x9575cd}],1.6);
  const n=8;
  for(let k=0;k<n;k++){const a=k*TAU/n+.1,b=a+TAU/n/2;let p;
    if(!S.inCut(a,.2)){p=pol(.22,a);rod2(S,'xylem',0,.06,p[0],p[1],0xe65100,.03);p=pol(.32,a);rod2(S,'xylem',0,.032,p[0],p[1],0xe65100,.03)}
    if(!S.inCut(b,.2)){p=pol(.28,b);rod2(S,'phloem',0,.05,p[0],p[1],0x9575cd,.03)}}
  const zf=S.len/2+.006,cg=new T.CircleGeometry(.06,12),cm=M(0xfffaf0);
  [[.55,12],[.68,16],[.82,20]].forEach(([r,c],ri)=>{for(let i=0;i<c;i++){const a=i*TAU/c+ri*.2;if(S.inCut(a,.12))continue;const q=pol(r,a);S.add('cortex',mesh(cg,cm,q[0],q[1],zf))}});
  S.part('hair','Root hairs','',[.9,-1.2,.3]);hairsOn(S,'hair',60,0xf1e6cf,1.5);
  S.byId.xylem.anchor=[-.3,.15,.8];S.byId.phloem.anchor=[.1,-.3,.8];
  return S};
