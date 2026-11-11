

{const _lb=SC['leaf-blade'];SC['leaf-blade']=()=>{const S=_lb();S.title='Dicot leaf: what it looks like inside';
  const v=S.byId.vein,m0=v.meshes.shift();v.mats.splice(v.mats.indexOf(m0.material),1);S.part('bsheath','Bundle sheath','',[-.4,-.15,1]);S.add('bsheath',m0);
  v.name='Veins (xylem + phloem)';S.part('isp','Intercellular spaces','',[1.2,-.3,1]);
  const am=M(0xe3f2fd,{transparent:true,opacity:.85});for(let i=0;i<18;i++)S.add('isp',mesh(new T.SphereGeometry(.05,8,6),am,-1.45+rnd()*2.9,-.29+(rnd()-.5)*.5,.1+rnd()*.85));
  return S}}
{const _rc=SC['root-cross'];SC['root-cross']=()=>{const S=_rc();S.title='Dicot root section: the water’s journey inwards';return S}}
{const _sd=SC['stem-dicot'];SC['stem-dicot']=()=>{const S=_sd();S.title='Dicot stem: bundles in a ring';return S}}
{const _sc=SC['seed'];SC['seed']=()=>{const S=_sc();S.title='Dicot seed (bean-type): two cotyledons';S.byId.endo.name='Stored food (endosperm)';S.byId.cot.name='Cotyledon (seed leaf)';
  S.part('embryo','Embryo (radicle + plumule + cotyledon)','',[-.6,.1,.3]);S.byId.embryo.members=['cot','rad','plu'];return S}}
{const _fc=SC['fruit-cross'];SC['fruit-cross']=()=>{const S=_fc();S.part('pericarp','Fruit wall (pericarp)','',S.byId.skin.anchor);S.byId.pericarp.members=['skin','flesh','core'];return S}}
