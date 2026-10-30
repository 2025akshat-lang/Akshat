
SC['stem-dicot']=()=>{const S=new Sc();S.title='Dicot stem: highway for water and food';S.sub='Vascular bundles sit in a ring. The cambium makes the stem thicker.';S.cam=5.4;
  radial(S,[
    {id:'epi',name:'Epidermis',desc:'',r0:.94,r1:1,color:0x4caf50},
    {id:'hypo',name:'Hypodermis (collenchyma)',desc:'',r0:.88,r1:.94,color:0x7cb342},
    {id:'cortex',name:'Cortex (ground tissue)',desc:'',r0:.5,r1:.88,color:0xa5d6a7},
    {id:'cambium',name:'Cambium',desc:'A thin ring of dividing cells. The stem thickens year after year from here.',r0:.43,r1:.5,color:0xffd54f},
    {id:'pith',name:'Pith (ground tissue)',desc:'',r0:0,r1:.43,color:0xfff3d6},
    {id:'vb',name:'Vascular bundles',desc:'',virtual:1,color:0xf1e7c8},
    {id:'xylem',name:'Xylem',desc:'',virtual:1,color:0xe65100},
    {id:'phloem',name:'Phloem',desc:'Delivers sugar made in the leaves to the whole plant.',virtual:1,color:0x9575cd}
  ],2.4);
  for(let k=0;k<8;k++){const a=k*TAU/8+.2;if(S.inCut(a,.25))continue;
    let [x,y]=pol(.48,a);rod2(S,'vb',0,.15,x,y,0xf1e7c8,.012);[x,y]=pol(.36,a);rod(S,'xylem',0,.075,x,y);[x,y]=pol(.6,a);rod(S,'phloem',0,.09,x,y)}
  S.byId.xylem.anchor=[...pol(.36,Math.PI*1.15),1.2];S.byId.phloem.anchor=[...pol(.6,Math.PI*1.4),1.2];
  return S};
