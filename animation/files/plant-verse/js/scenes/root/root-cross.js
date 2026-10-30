
SC['root-cross']=()=>{const S=new Sc();S.title='Root section: the water’s journey inwards';S.sub='From the epidermis through the cortex, then past the endodermis gate to the xylem.';S.cam=5.4;
  radial(S,[
    {id:'epi',name:'Epidermis',desc:'Outer layer. Root hairs grow from here.',r0:.93,r1:1,color:0xd7b98e},
    {id:'cortex',name:'Cortex',desc:'Large parenchyma zone. Starch is stored here and water passes between the cells.',r0:.56,r1:.93,color:0xe6d2a6},
    {id:'endo',name:'Endodermis',desc:'Layer with the Casparian strip: it decides what gets inside.',r0:.5,r1:.56,color:0xffd54f},
    {id:'peri',name:'Pericycle',desc:'Lateral roots start from here.',r0:.44,r1:.5,color:0xfffdf2},
    {id:'stele',name:'Stele',desc:'The vascular cylinder at the centre.',r0:0,r1:.44,color:0xe8dcc0},
    {id:'xylem',name:'Xylem (star)',desc:'Star-shaped. Water climbs up towards the stem.',virtual:1,color:0xe65100},
    {id:'phloem',name:'Phloem',desc:'Sugar arriving from the leaves down to the roots.',virtual:1,color:0x9575cd}
  ],1.6);
  for(let k=0;k<4;k++){const a=Math.PI/4+k*Math.PI/2;if(!S.inCut(a,.15)){const o=S.add('xylem',mesh(new T.BoxGeometry(.4,.09,S.len+.03).translate(.2,0,0),S.byId.xylem.vm));o.rotation.z=a}
    const b=k*Math.PI/2;if(!S.inCut(b,.2)){const [x,y]=pol(.3,b);rod(S,'phloem',0,.07,x,y)}}
  rod(S,'xylem',0,.09,0,0);
  
  {const zf=S.len/2+.006,cellG=new T.CircleGeometry(.055,14),grainG=new T.CircleGeometry(.014,6),cm=M(0xfffaf0),gm=M(0xc9a35a);
   [[.63,14],[.73,18],[.83,22]].forEach(([r,n],ri)=>{for(let i=0;i<n;i++){const a=i*TAU/n+ri*.18;if(S.inCut(a,.12))continue;const [x,y]=pol(r,a);
     S.add('cortex',mesh(cellG,cm,x,y,zf));S.add('cortex',mesh(grainG,gm,x+.012,y-.01,zf+.002))}});
   S.part('casp','Casparian strip','',[.1,-.53,.85]);const cp=M(0x6d4c41);
   for(let i=0;i<28;i++){const a=i*TAU/28+.05;if(S.inCut(a,.1))continue;const [x,y]=pol(.53,a);const o=S.add('casp',mesh(new T.BoxGeometry(.05,.022,.012),cp,x,y,zf));o.rotation.z=a}
   const vm=M(0xbf360c);
   for(let k=0;k<4;k++){const a=Math.PI/4+k*Math.PI/2;if(S.inCut(a,.15))continue;[.14,.24,.34].forEach((r,j)=>{const [x,y]=pol(r,a);S.add('xylem',mesh(new T.CircleGeometry(.032+.006*j,10),vm,x,y,S.len/2+.02))})}
   const aL=3.9,dx=Math.cos(aL),dy=Math.sin(aL),lm=M(0xd7b98e),L2=1.0;
   S.part('lat','Lateral root','',[dx*1.3,dy*1.3,-.2]);
   const lb=S.add('lat',new T.Mesh(new T.CylinderGeometry(.085,.12,L2,16).translate(0,L2/2,0),lm));lb.position.set(dx*.46,dy*.46,-.2);lb.rotation.z=aL-Math.PI/2;
   S.add('lat',mesh(new T.SphereGeometry(.085,14,10),lm,dx*(.46+L2),dy*(.46+L2),-.2));
   S.part('hair','Root hairs','',[.9,-1.2,.3]);const hm=M(0xf1e6cf),up=new T.Vector3(0,1,0);
   for(let i=0;i<70;i++){const a=Math.PI/2+.25+rnd()*(TAU-Math.PI/2-.5);if(Math.abs(a-aL)<.25)continue;const z=(rnd()-.5)*1.5,l=.25+rnd()*.25;
     const d=new T.Vector3(Math.cos(a),Math.sin(a),(rnd()-.5)*.5).normalize();
     const h=mesh(new T.CylinderGeometry(.01,.02,l,5).translate(0,l/2,0),hm,Math.cos(a),Math.sin(a),z);h.quaternion.setFromUnitVectors(up,d);S.add('hair',h)}}
  S.byId.xylem.anchor=[-.3,.3,.8];S.byId.phloem.anchor=[-.3,0,.8];return S};
