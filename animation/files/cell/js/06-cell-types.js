/* Cell Types slider + registerCellModel() + per-cell Compare / Tracker / Layers dock */
'use strict';
/* ================= CELL-TYPE SLIDER =================
   Naya cell type jodne ke 3 hisse:
   1) CELLTYPES array mein ek line: {id,name,color}
   2) Model:   registerCellModel('neuron',(THREE,group,opt)=>{ ...; return {tick:(dt,t)=>{...}, parts:[{key,name,info,det,grp,objs}]} });
      parts (optional) = tap-able hisse. det = detail view ka key (registerDetail), grp = layer group.
   3) Info (optional): registerCellInfo('neuron',{name,fit,compare:{title,html},tracker:[[naam,detail],...],layers:[{id,name,color,parts:[key,...]}]})
      fit = camera: {r:[portrait,landscape], t:[[x,y,z] portrait,[x,y,z] landscape]}
   NOTE: CTid, CTP, CTF 05-app.js mein declare hain (yahan dobara let mat karna). */
const CT=new T.Group();S.add(CT);CT.visible=false;
let CTK=null;
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
const CTB={},CTI={},CTLV={};
window.CELLTYPES=CELLTYPES;
window.registerCellModel=(id,build)=>{CTB[id]=build;renderCT();if(CTid===id)showCT(id)};
window.registerCellInfo=(id,info)=>{CTI[id]=info;if(CTid===id){CTF=info.fit||null;W.t.copy(homeT());W.r=baseR()}};
function clearCT(){CTK=null;CTP=[];CTF=null;while(CT.children.length){const o=CT.children[0];CT.remove(o);o.traverse(n=>{if(n.geometry)n.geometry.dispose();if(n.material)[].concat(n.material).forEach(m=>m.dispose())})}}
function renderCT(){const r=$('#ctr'),x=r.scrollTop;
 r.innerHTML=CELLTYPES.map(c=>`<button data-c="${c.id}" class="${c.id===CTid?'on':''}"><i style="--c:${c.color}"></i>${c.name}${c.id!=='default'&&!CTB[c.id]?' <small>jald</small>':''}</button>`).join('');r.scrollTop=x}
/* model ke parts ko tap-able banao (paint() ke liye userData.op/em chahiye) */
function regParts(parts){CTP=[];const seen=new Set();
 (parts||[]).forEach(p=>{(p.objs||[]).forEach(ob=>ob.traverse(n=>{if(!n.isMesh||seen.has(n))return;seen.add(n);
  const ms=[].concat(n.material);ms.forEach(x=>{x.transparent=true});
  n.userData={k:p.key,name:p.name,info:p.info,det:p.det,grp:p.grp,out:!!(n.userData&&n.userData.out),op:ms[0].opacity,em:ms[0].emissive?ms[0].emissive.getHex():0};CTP.push(n)}))})}
function showCT(id){clr();closeDock();const d=CELLTYPES.find(c=>c.id===id)||CELLTYPES[0];id=d.id;
 if(mode!=='3D')setMode('3D');
 CTid=id;clearCT();const dflt=id==='default';
 document.body.classList.toggle('ct',!dflt);
 document.body.classList.toggle('dv',!!(window.CVDiv&&CVDiv.isLive(id)));if(window.dvSync)dvSync();
 EU.root.visible=PR.root.visible=dflt;CT.visible=!dflt;
 if(dflt){ban('');W.t.copy(homeT());W.r=baseR()}
 else{
  if(CTB[id]){const o=CTB[id](T,CT,{color:d.color,name:d.name});CTK=o&&o.tick||null;regParts(o&&o.parts);ban('');
   CTF=CTI[id]&&CTI[id].fit||null;CTLV[id]={}}
  else{const col=new T.Color(d.color),g=new T.Mesh(new T.IcosahedronGeometry(2.6,2),new T.MeshStandardMaterial({color:col,wireframe:true,transparent:true,opacity:.6})),
   c=new T.Mesh(sp(1.6,24,18),new T.MeshStandardMaterial({color:col,roughness:.5,transparent:true,opacity:.35}));
   CT.add(g,c);CTK=dt=>{g.rotation.y+=dt*.4;g.rotation.x+=dt*.15};ban(d.name+' | 3D model yahan embed hoga')}
  W.t.copy(homeT());W.r=baseR();W.th=0;W.el=.1}
 paint();
 renderCT();const b=$('#ctr').querySelector('.on'),r=$('#ctr');if(b)r.scrollTo({top:b.offsetTop-r.clientHeight/2+b.offsetHeight/2,behavior:'smooth'})}
const stepCT=n=>{const i=CELLTYPES.findIndex(c=>c.id===CTid);showCT(CELLTYPES[(i+n+CELLTYPES.length)%CELLTYPES.length].id)};
$('#ctr').onclick=e=>{const b=e.target.closest('button');if(b){showCT(b.dataset.c);if(innerWidth<700)$('#ctd').hidden=true}};
$('#ctl').onclick=()=>stepCT(-1);$('#ctn').onclick=()=>stepCT(1);
$('#ctb').onclick=e=>{const p=$('#ctd');p.hidden=!p.hidden;e.currentTarget.classList.toggle('on',!p.hidden)};
renderCT();

/* ================= BOTTOM DOCK: Compare / Tracker / Layers (har cell ka apna) ================= */
const DKL=$('#dkl');
function closeDock(){$('#lyp').hidden=true;DKL.classList.remove('on');['xo','cmp','ls'].forEach(i=>$('#'+i).classList.remove('open'))}
function openX(title,html){$('#xot').textContent=title;$('#xob').innerHTML=html;$('#xob').onchange=null;$('#xo').classList.add('open')}
$('#xox').onclick=()=>$('#xo').classList.remove('open');
$('#dkc').onclick=()=>{closeDock();
 if(CTid==='default'){$('#cmp').classList.add('open');return}
 const i=CTI[CTid];
 if(i&&i.compare)openX(i.compare.title,i.compare.html);else ban((CELLTYPES.find(c=>c.id===CTid)||{}).name+' ka Compare jald aayega')};
$('#dkt').onclick=()=>{closeDock();
 if(CTid==='default'){rl();$('#ls').classList.add('open');return}
 const i=CTI[CTid];if(!i||!i.tracker){ban('Is cell ka Tracker jald aayega');return}
 const key='cvt_'+CTid;let dn={};try{dn=JSON.parse(localStorage.getItem(key)||'{}')}catch(e){}
 const draw=()=>{const sc=$('#xob').scrollTop;let n=0;
  const rows=i.tracker.map((g,k)=>{if(dn[k])n++;return `<label class="row"><input type="checkbox" data-i="${k}" ${dn[k]?'checked':''}><span><b>${g[0]}</b><br><small>${g[1]}</small></span></label>`}).join('');
  $('#xot').textContent=(i.name||'Cell')+' | '+n+'/'+i.tracker.length+' yaad';$('#xob').innerHTML=rows;$('#xob').scrollTop=sc};
 draw();$('#xob').onchange=e=>{dn[e.target.dataset.i]=e.target.checked;try{localStorage.setItem(key,JSON.stringify(dn))}catch(x){}draw()};$('#xo').classList.add('open')};
const DEFLY=[['out','Membrane / Wall','#e0527a'],['org','Organelles','#f2c35a'],['cyto','Cytoskeleton','#7fd6c2'],['dna','DNA','#b58cff']];
function drawLy(){const p=$('#lyp'),i=CTI[CTid];let h='<div class="oh2"><span>LAYERS</span></div>';
 if(CTid==='default')h+=DEFLY.map(a=>`<button class="lyr ${L[a[0]]?'on':''}" data-k="${a[0]}"><i style="--c:${a[2]}"></i><span>${a[1]}</span><b></b></button>`).join('');
 else if(i&&i.layers)h+=i.layers.map(a=>`<button class="lyr ${CTLV[CTid][a.id]===false?'':'on'}" data-k="${a.id}"><i style="--c:${a.color}"></i><span>${a.name}</span><b></b></button>`).join('');
 else h+='<p class="mu">Is cell ki layers jald aayengi</p>';
 p.innerHTML=h}
DKL.onclick=()=>{const p=$('#lyp'),open=p.hidden;closeDock();if(open){drawLy();p.hidden=false;DKL.classList.add('on')}};
$('#lyp').onclick=e=>{const b=e.target.closest('.lyr');if(!b)return;const k=b.dataset.k;
 if(CTid==='default'){L[k]=!L[k];applyL()}
 else{const i=CTI[CTid],ly=i.layers.find(a=>a.id===k),on=CTLV[CTid][k]===false;CTLV[CTid][k]=on;
  CTP.forEach(m=>{if(ly.parts.indexOf(m.userData.k)>=0)m.visible=on})}
 drawLy()};
