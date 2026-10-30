
SC['stem-wood']=()=>{const S=new Sc();S.title='Tree trunk: a diary of the years';S.sub='Each annual ring is one year of growth. Count the rings to find the age.';S.cam=5.2;
  const rings=[{id:'pith',name:'Pith',desc:'The oldest, soft centre.',r0:0,r1:.05,color:0x3e2723}];
  for(let i=0;i<6;i++)rings.push({id:'heart',name:'Heartwood',desc:'Old, hard wood (no longer alive). This is what timber comes from.',r0:.05+i*.075,r1:.125+i*.075,color:i%2?0x7a4a22:0x8d5a2b});
  for(let i=0;i<4;i++)rings.push({id:'sap',name:'Sapwood',desc:'Living xylem. Lifts water up from the roots.',r0:.5+i*.06,r1:.56+i*.06,color:i%2?0xc89655:0xd7a86e});
  rings.push({id:'cambium',name:'Cambium',desc:'A living layer just one cell thick. Makes xylem inward and phloem outward.',r0:.74,r1:.77,color:0x9ccc65});
  rings.push({id:'phloem',name:'Phloem (inner bark)',desc:'The sugar pathway. Cut it all the way round and the tree dies (girdling).',r0:.77,r1:.86,color:0xefe3c2});
  rings.push({id:'bark',name:'Bark',desc:'Outer armour: protects against fire, insects and dehydration.',r0:.86,r1:1,color:0x4e342e,mat:{roughness:1}});
  radial(S,rings,1.6);S.byId.heart.anchor=[-.3,.15,.8];S.byId.sap.anchor=[-.62,-.15,.8];return S};
