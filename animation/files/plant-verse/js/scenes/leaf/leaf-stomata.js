
SC['leaf-stomata']=()=>{const S=new Sc();S.title='Stomata: the leaf’s doorway';S.sub='A ~20–30 µm opening. It opens when the guard cells swell and closes when they shrink.';S.cam=6.4;S.view=[.95,0];
  S.part('guard','Guard cells','Two bean-shaped cells. They bend as they fill with water, opening the pore between them.',[-.55,.15,0]);
  S.part('pore','Pore','Gas pathway: CO₂ in, O₂ and water vapour out.',[0,.1,.0]);
  S.part('epi','Epidermal cells','Ordinary surface cells, with the stomata in the middle.',[1.6,.1,.6]);
  S.part('vapor','Water vapour','Transpiration: water escapes here and pulls fresh water up from the roots.',[.3,1.1,0]);
  const em=M(0xaed581);
  for(let q=-2;q<=2;q++)for(let r=-2;r<=2;r++){if(Math.abs(q+r)>2||(q===0&&r===0))continue;
    S.add('epi',mesh(new T.CylinderGeometry(.56,.56,.12,6),em,.97*(q+r/2)*1.04*1.0,0,.9*r*1.04)).rotation.y=Math.PI/6}
  const gm=M(0x388e3c),gl=new T.Group(),gr=new T.Group();S.group.add(gl,gr);
  const arc=(s)=>new T.TorusGeometry(.42,.13,12,28,Math.PI).rotateZ(s*Math.PI/2).rotateX(Math.PI/2);
  S.add('guard',mesh(arc(1),gm),gl);S.add('guard',mesh(arc(-1),gm),gr);
  const pore=S.add('pore',mesh(new T.SphereGeometry(1,16,10),M(0x06150c),0,.0,0));
  const vm=M(0x81d4fa,{transparent:true,opacity:.8}),vs=[];
  for(let i=0;i<9;i++){const v={o:i/9,dx:(rnd()-.5)*.3,dz:(rnd()-.5)*.5};v.m=S.add('vapor',mesh(new T.SphereGeometry(.05,8,6),vm));vs.push(v)}
  S.tick=t=>{const o=(Math.sin(t*1.1)+1)/2,gap=.03+.15*o;gl.position.x=-gap;gr.position.x=gap;pore.scale.set(gap*1.1,.05,.36);
    vs.forEach(v=>{const p=(t*.35+v.o)%1;v.m.position.set(v.dx,.15+p*1.4,v.dz);v.m.scale.setScalar(.2+o*.9)})};
  return S};
