/* Cell Types slider + registerCellModel() - naye cell ke slots yahin hain */
'use strict';
/* ================= CELL-TYPE SLIDER =================
   Naya cell type jodne ke 2 tareeke:
   1) CELLTYPES array mein ek line add karo: {id,name,color}
   2) Model embed karne ke liye:
      registerCellModel('neuron',(THREE,group,opt)=>{ ...group.add(mesh)...; return {tick:(dt,t)=>{...}} });
   group ke andar jo bhi add karoge wahi 3D view mein dikhega. */
const CT=new T.Group();S.add(CT);CT.visible=false;
let CTK=null,CTid='default';
const CELLTYPES=[
 {id:'default',name:'Dono cells',color:'#e0527a'},
 {id:'plant',name:'Plant cell',color:'#6fcf6f'},
 {id:'neuron',name:'Neuron',color:'#b58cff'},
 {id:'rbc',name:'Red blood cell',color:'#e8504a'},
 {id:'muscle',name:'Muscle cell',color:'#ff9b5a'},
 {id:'sperm',name:'Sperm cell',color:'#7fd6c2'},
 {id:'egg',name:'Egg cell',color:'#f2c35a'},
 {id:'yeast',name:'Yeast',color:'#d9a05a'}
];
const CTB={};
window.CELLTYPES=CELLTYPES;
window.registerCellModel=(id,build)=>{CTB[id]=build;renderCT();if(CTid===id)showCT(id)};
function clearCT(){CTK=null;while(CT.children.length){const o=CT.children[0];CT.remove(o);o.traverse(n=>{if(n.geometry)n.geometry.dispose();if(n.material)[].concat(n.material).forEach(m=>m.dispose())})}}
function renderCT(){const r=$('#ctr'),x=r.scrollTop;
 r.innerHTML=CELLTYPES.map(c=>`<button data-c="${c.id}" class="${c.id===CTid?'on':''}"><i style="--c:${c.color}"></i>${c.name}${c.id!=='default'&&!CTB[c.id]?' <small>jald</small>':''}</button>`).join('');r.scrollTop=x}
function showCT(id){clr();const d=CELLTYPES.find(c=>c.id===id)||CELLTYPES[0];id=d.id;
 if(id!=='default'&&mode!=='3D')setMode('3D');
 CTid=id;clearCT();const dflt=id==='default';
 EU.root.visible=PR.root.visible=dflt;CT.visible=!dflt;
 if(dflt){ban('');W.t.copy(homeT());W.r=baseR()}
 else{
  if(CTB[id]){const o=CTB[id](T,CT,{color:d.color,name:d.name});CTK=o&&o.tick||null;ban(d.name)}
  else{const col=new T.Color(d.color),g=new T.Mesh(new T.IcosahedronGeometry(2.6,2),new T.MeshStandardMaterial({color:col,wireframe:true,transparent:true,opacity:.6})),
   c=new T.Mesh(sp(1.6,24,18),new T.MeshStandardMaterial({color:col,roughness:.5,transparent:true,opacity:.35}));
   CT.add(g,c);CTK=dt=>{g.rotation.y+=dt*.4;g.rotation.x+=dt*.15};ban(d.name+' | 3D model yahan embed hoga')}
  W.t.set(0,0,0);W.r=10}
 renderCT();const b=$('#ctr').querySelector('.on'),r=$('#ctr');if(b)r.scrollTo({top:b.offsetTop-r.clientHeight/2+b.offsetHeight/2,behavior:'smooth'})}
const stepCT=n=>{const i=CELLTYPES.findIndex(c=>c.id===CTid);showCT(CELLTYPES[(i+n+CELLTYPES.length)%CELLTYPES.length].id)};
$('#ctr').onclick=e=>{const b=e.target.closest('button');if(b){showCT(b.dataset.c);if(innerWidth<700)$('#ctd').hidden=true}};
$('#ctl').onclick=()=>stepCT(-1);$('#ctn').onclick=()=>stepCT(1);
$('#ctb').onclick=e=>{const p=$('#ctd');p.hidden=!p.hidden;e.currentTarget.classList.toggle('on',!p.hidden)};
renderCT();
