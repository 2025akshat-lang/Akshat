
SC['flower-ovary']=()=>{const S=new Sc();S.title='Ovary section: home of the seeds';S.sub='Ovules sit inside the locules. After fertilisation they become seeds.';S.cam=5.2;
  radial(S,[
    {id:'wall',name:'Ovary wall',desc:'Later becomes the fruit skin and flesh (pericarp).',r0:.8,r1:1,color:0x7cb342},
    {id:'tissue',name:'Placenta tissue',desc:'Ovules attach to this tissue and draw nutrition from it.',r0:0,r1:.8,color:0xe6ee9c},
    {id:'locule',name:'Locule',desc:'Hollow chamber where the ovules live.',virtual:1,color:0xfff8e1},
    {id:'ovule',name:'Ovules',desc:'Holds the egg cell. Once fertilised by pollen it becomes a seed.',virtual:1,color:0xffb74d}
  ],1.8,Math.PI/2);
  for(let k=0;k<3;k++){const a=Math.PI*.75+k*TAU/3;if(S.inCut(a,.5))continue;
    const [x,y]=pol(.46,a);rod(S,'locule',0,.27,x,y);
    for(let i=0;i<5;i++){const b=a+Math.PI+(i-2)*.28;const [ox,oy]=pol(.2,b);
      S.add('ovule',mesh(new T.SphereGeometry(.07,12,10),S.byId.ovule.vm,x+ox*.9,y+oy*.9,S.len/2-.04))}}
  S.byId.locule.anchor=[...pol(.46,Math.PI*.75),.9];S.byId.ovule.anchor=[-.2,-.5,.9];S.byId.tissue.anchor=[-.1,.1,.9];
  return S};
