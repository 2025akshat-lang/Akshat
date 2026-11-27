
SC['flower-ovary']=()=>{const S=new Sc();S.title='Ovary section: home of the seeds';S.sub='Ovules sit inside the locules. After fertilisation they become seeds.';S.cam=3.6;
  radial(S,[
    {id:'wall',name:'Ovary wall',desc:'Later becomes the fruit skin and flesh (pericarp).',r0:.8,r1:1,color:0x7cb342,mat:{roughness:.72}},
    {id:'tissue',name:'Placenta tissue',desc:'Ovules attach to this tissue and draw nutrition from it.',r0:0,r1:.18,color:0xe6ee9c,mat:{roughness:.88}},
    {id:'locule',name:'Locule',desc:'Hollow chamber where the ovules live.',virtual:1,color:0xfff8e1},
    {id:'ovule',name:'Ovules',desc:'Holds the egg cell. Once fertilised by pollen it becomes a seed.',virtual:1,color:0xffb74d}
  ],1.8,Math.PI/2);
  const shell=M(0xf4d584,{roughness:.52}),inner=M(0xffedb5,{roughness:.62}),nucleus=M(0xd88745,{roughness:.46}),
    funiculus=M(0xc69b53,{roughness:.76}),micropyle=M(0x9b6b32,{roughness:.5});
  for(let k=0;k<3;k++){const a=Math.PI*.75+k*TAU/3;if(S.inCut(a,.5))continue;
    const [x,y]=pol(.46,a);
    for(let i=0;i<5;i++){const b=a+Math.PI+(i-2)*.28,[ox,oy]=pol(.2,b),cx=x+ox*.9,cy=y+oy*.9,z=S.len/2-.04;
      const ovule=new T.Group();ovule.position.set(cx,cy,z);ovule.rotation.z=b+Math.PI/2;S.group.add(ovule);
      const coat=mesh(new T.SphereGeometry(1,20,16),shell);coat.scale.set(.13,.19,.09);S.add('ovule',coat,ovule);
      const body=mesh(new T.SphereGeometry(1,18,14),inner,0,0,.026);body.scale.set(.09,.13,.07);S.add('ovule',body,ovule);
      const embryo=mesh(new T.SphereGeometry(.023,12,10),nucleus,-.012,-.018,.067);S.add('ovule',embryo,ovule);
      const pore=mesh(new T.ConeGeometry(.018,.045,8),micropyle,0,.078,.013);pore.rotation.z=Math.PI;S.add('ovule',pore,ovule);
      S.add('ovule',mesh(new T.CylinderGeometry(.012,.018,.12,7).rotateX(Math.PI/2),funiculus,0,-.106,-.012),ovule)}}
  S.byId.locule.anchor=[...pol(.46,Math.PI*.75),.9];S.byId.ovule.anchor=[-.2,-.5,.9];S.byId.tissue.anchor=[-.1,.1,.9];
  return S};
