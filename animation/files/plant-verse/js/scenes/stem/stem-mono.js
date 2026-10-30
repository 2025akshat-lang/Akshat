
SC['stem-mono']=()=>{const S=new Sc();S.title='Monocot stem (maize-type): scattered bundles';S.sub='';S.cam=5.4;
  radial(S,[
    {id:'epi',name:'Epidermis',desc:'',r0:.95,r1:1,color:0x4caf50},
    {id:'hypo',name:'Hypodermis (sclerenchyma)',desc:'',r0:.88,r1:.95,color:0x8d6e63},
    {id:'ground',name:'Ground tissue (parenchyma)',desc:'',r0:0,r1:.88,color:0xdcedc8},
    {id:'vb',name:'Vascular bundles',desc:'',virtual:1,color:0xf1e7c8},
    {id:'sheath',name:'Bundle sheath',desc:'',virtual:1,color:0x6d4c41},
    {id:'xylem',name:'Xylem',desc:'',virtual:1,color:0xe65100},
    {id:'phloem',name:'Phloem',desc:'',virtual:1,color:0x9575cd}],2.4);
  const bs=[];
  for(let t=0;t<160&&bs.length<26;t++){const rr=Math.sqrt(rnd())*.76,a=rnd()*TAU;if(S.inCut(a,.3))continue;
    const rad=.07+.06*(1-rr/.8),x=rr*Math.cos(a),y=rr*Math.sin(a);
    if(bs.some(b=>Math.hypot(b.x-x,b.y-y)<b.r+rad+.025))continue;bs.push({x,y,r:rad,a})}
  bs.forEach(b=>{const ux=Math.cos(b.a),uy=Math.sin(b.a);
    rod2(S,'sheath',0,b.r,b.x,b.y,0x6d4c41,.03);rod2(S,'vb',0,b.r*.8,b.x,b.y,0xf1e7c8,.045);
    rod2(S,'xylem',0,b.r*.4,b.x-ux*b.r*.28,b.y-uy*b.r*.28,0xe65100,.06);rod2(S,'phloem',0,b.r*.32,b.x+ux*b.r*.3,b.y+uy*b.r*.3,0x9575cd,.06)});
  const b0=bs[0]||{x:0,y:0};S.byId.vb.anchor=[b0.x,b0.y,1.2];S.byId.xylem.anchor=[b0.x,b0.y,1.2];S.byId.phloem.anchor=[b0.x,b0.y,1.2];S.byId.sheath.anchor=[b0.x,b0.y,1.2];
  return S};
