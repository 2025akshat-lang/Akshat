/* Camera, touch input, 3D/4D/5D modes, controls, tracker, render loop */
'use strict';
/* ================= STATE, CAMERA, INPUT, UI ================= */
const L={out:true,org:true,cyto:true,dna:true};
let CTid='default',CTR=10,CTF=null,CTP=[],CAP=false,mode='3D',selm=null,selSet=[],q=null,score=0,tot=0,hl=new Set(),portrait=false,cut=false,st=0,stT=0;
const V={th:0,el:.1,r:21,t:new T.Vector3()},W={th:0,el:.1,r:21,t:new T.Vector3()};
/* CTF = custom cell ka fit: {r:[portrait,landscape], t:[[x,y,z],[x,y,z]]}; 06-cell-types.js model se bharta hai */
const baseR=()=>CTid!=='default'?(CTF?CTF.r[portrait?0:1]:CTR):(portrait?34:21),homeT=()=>CTid!=='default'?(CTF?V3(CTF.t[portrait?0:1]):new T.Vector3(0,0,0)):new T.Vector3(portrait?0:2,0,0);
function layout(){portrait=innerWidth/innerHeight<.8;if(portrait){EU.root.position.set(0,3.6,0);PR.root.position.set(-2,-3.4,0)}else{EU.root.position.set(-4.5,0,0);PR.root.position.set(4.3,0,0)}}
let lastW=0;   /* sirf width badle (phone rotate) tab camera reset; URL bar ke resize par zoom wapas nahi hota */
function resize(){R.setSize(innerWidth,innerHeight);C.aspect=innerWidth/innerHeight;C.updateProjectionMatrix();layout();const wc=Math.abs(innerWidth-lastW)>40;lastW=innerWidth;if(!selm&&wc){W.r=baseR();W.t.copy(homeT())}}
addEventListener('resize',resize);resize();V.r=W.r;V.t.copy(W.t);
ANI.ves.forEach(o=>o.m.position.copy(o.cv.getPoint(o.u)));
const cur=()=>CTid==='default'?pick:CTP;
const vis=m=>{for(let o=m;o;o=o.parent)if(!o.visible)return false;return true};
const ov=()=>window.DVOPEN||document.querySelector('.ov.open');
function paint(){const sset=new Set(selSet);cur().forEach(m=>{const d=m.userData,o=d.op,inS=sset.has(m);m.material.opacity=selm&&!inS?Math.min(o,.18):(inS&&o<.9?Math.min(1,o+.3):o);m.material.emissive.setHex(inS?0x8a1c3a:(hl.has(d.k)&&!selm?0x1d5a8a:(d.em||0)));m.material.depthWrite=m.material.opacity>.9})}
function applyL(){['out','org','cyto','dna'].forEach(k=>{EU[k].visible=PR[k].visible=L[k]});document.querySelectorAll('[data-l]').forEach(b=>b.classList.toggle('on',L[b.dataset.l]));paint()}
function ban(msg){const b=$('#ban');b.style.display=msg?'block':'none';b.textContent=msg||''}
function sel(m){selm=m;selSet=cur().filter(x=>x.userData.name===m.userData.name);const bb=new T.Box3().setFromObject(m);W.t.copy(bb.getCenter(new T.Vector3()));W.r=clamp(bb.getSize(new T.Vector3()).length()*2.4+1.4,1.6,26);
 $('#nm').textContent=m.userData.name;$('#in').textContent=m.userData.info;$('#card').classList.remove('open');$('#card').hidden=false;paint()}
function clr(){selm=null;selSet=[];$('#card').hidden=true;W.t.copy(homeT());W.r=baseR();paint()}
function view(v){if(v==='reset'){clr();W.th=V.th+wrap(0-V.th);W.el=.1;return}
 if(v==='top'){W.el=1.45;return}const th={front:0,side:Math.PI/2}[v];W.th=V.th+wrap(th-V.th);W.el=.1}
function focus(f){clr();document.querySelectorAll('[data-f]').forEach(b=>b.classList.toggle('on',b.dataset.f===f));
 if(f==='both')return;const g=f==='eu'?EU.root:PR.root;W.t.copy(g.position);if(f==='pr'&&!portrait)W.t.x+=2.4;if(f==='pr'&&portrait)W.t.x+=1.6;W.r=portrait?13:10}
const zm=f=>{W.r=clamp(W.r*f,.5,90)};
/* ---- picking ---- */
const P=new Map(),RC=new T.Raycaster();let mv=0,t0=0,pd=0,lastTap={x:-99,y:-99,t:0,i:0};
const pinch=()=>{if(P.size<2)return 0;const a=[...P.values()];return Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1])};
function hits(e){const r=el.getBoundingClientRect();RC.setFromCamera(new T.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),C);
 let h=RC.intersectObjects(cur().filter(vis),false);if(CUT.constant<50)h=h.filter(x=>x.point.z<=CUT.constant);
 return h.filter(x=>!x.object.userData.out).concat(h.filter(x=>x.object.userData.out))}
function tap(e){const h=hits(e);if(!h.length){if(CTid!=='default'&&!CTP.length){ban('Is cell ke parts register nahi hue: neuron.js (naya version) upload karo');return}if(selm&&mode!=='5D')clr();return}
 const now=Date.now(),same=Math.hypot(e.clientX-lastTap.x,e.clientY-lastTap.y)<14&&now-lastTap.t<3000,i=same?(lastTap.i+1)%h.length:0;lastTap={x:e.clientX,y:e.clientY,t:now,i:i};
 const m=h[i].object;
 if(mode==='5D'&&q){tot++;const ok=m.userData.name===q;if(ok)score++;sel(m);ban((ok?'Sahi! ':'Galat, ye '+m.userData.name+' hai. ')+'Score '+score+'/'+tot);q=null;setTimeout(()=>mode==='5D'&&nextQ(),1800);return}
 if(m.userData.det){clr();try{openDV(m.userData.det)}catch(err){window.DVOPEN=false;ban('Detail view "'+m.userData.det+'" nahi mila: neuron-detail.js upload karo ('+err.message+')')}return}
 sel(m)}
el.addEventListener('pointerdown',e=>{el.setPointerCapture(e.pointerId);P.set(e.pointerId,[e.clientX,e.clientY]);if(P.size===1){mv=0;t0=Date.now()}pd=pinch()});
const mid2=()=>{const a=[...P.values()];return[(a[0][0]+a[1][0])/2,(a[0][1]+a[1][1])/2]};
/* do ungli: pinch = zoom, saath mein khiskao = pan (left/right/up/down) */
function pan(dx,dy){const m=C.matrixWorld.elements,k=2*V.r*Math.tan(C.fov*Math.PI/360)/innerHeight;
 W.t.x-=(m[0]*dx-m[4]*dy)*k;W.t.y-=(m[1]*dx-m[5]*dy)*k;W.t.z-=(m[2]*dx-m[6]*dy)*k}
el.addEventListener('pointermove',e=>{const p=P.get(e.pointerId);if(!p)return;const m0=P.size>1?mid2():null,dx=e.clientX-p[0],dy=e.clientY-p[1];p[0]=e.clientX;p[1]=e.clientY;mv+=Math.abs(dx)+Math.abs(dy);
 if(P.size===1){W.th-=dx*.008;W.el=clamp(W.el+dy*.008,-1.3,1.45)}else{const d=pinch();if(pd&&d)zm(clamp(pd/d,.9,1.1));pd=d;if(m0){const m1=mid2();pan(m1[0]-m0[0],m1[1]-m0[1])}}});
const up=e=>{if(e.type==='pointerup'&&P.size===1&&mv<8&&Date.now()-t0<400)tap(e);P.delete(e.pointerId);pd=0};
el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);
el.addEventListener('wheel',e=>{e.preventDefault();zm(1+e.deltaY*.001)},{passive:false});
/* ---- modes ---- */
const STEPS=[['nuc,chr','nuo','1. Nucleus: gene ka DNA mRNA mein transcribe hota hai (bacteria mein nucleoid se, bina membrane ke)'],['por','nuo,pr70','2. mRNA nuclear pore se bahar jata hai; bacteria mein ribosome turant mRNA se jud jata hai'],['rib,rer','pr70','3. Ribosome mRNA padhkar protein banata hai (eukaryote: RER par, bacteria: free 70S)'],['rer','pr70','4. Protein RER lumen mein fold + glycosylate hota hai'],['gol,ves','','5. Vesicle protein ko Golgi le jata hai: modify, sort, pack'],['mem,ves','','6. Secretory vesicle membrane se milkar protein bahar nikalta hai (exocytosis)']];
const STP=()=>CTid==='default'?STEPS:((CTI[CTid]&&CTI[CTid].steps)||[]);
function setStep(){const A=STP();if(!A.length){hl=new Set();ban('4D | Is cell ke steps jald aayenge');paint();return}const s=A[st%A.length];
 if(CTid==='default'){hl=new Set((s[0]+','+s[1]).split(',').filter(Boolean));ban('4D | '+s[2])}else{hl=new Set(s.k);ban('4D | '+s.t);if(s.ph!=null){if(window.CVDiv&&(CTid==='mitosis'||CTid==='meiosis'||CTid==='cancer'))CVDiv.go(s.ph,true);else if(window.CVStage&&CVStage.id===CTid)CVStage.go(s.ph)}}paint()}
function rest(){ANI.mito.forEach(o=>{o.g.rotation.z=o.rz;o.g.position.y=o.y});ANI.free.forEach(o=>o.m.position.copy(o.b));ANI.pr70.forEach(o=>o.m.position.copy(o.b));ANI.pili.rotation.y=0;ANI.nu.rotation.y=0}
function nextQ(){const pool=[...new Set(cur().filter(m=>vis(m)&&!m.userData.out).map(m=>m.userData.name))];if(!pool.length){ban('5D | Is cell ke parts register nahi hue');return}clr();q=pool[Math.floor(Math.random()*pool.length)];ban('Dhundo: '+q+'  |  Score '+score+'/'+tot)}
function setMode(m){mode=m;if(m!=='4D'){if(window.CVDiv){CVDiv.hold=false;CVDiv.playing=true}if(window.CVStage&&CVStage.free)CVStage.free()}document.querySelectorAll('[data-m]').forEach(b=>b.classList.toggle('on',b.dataset.m===m));q=null;rest();hl=new Set();clr();ban('');
 if(m==='5D'){L.out=false;L.org=L.cyto=L.dna=true;score=0;tot=0;applyL();nextQ();return}
 L.out=true;if(m==='4D'){L.org=L.cyto=L.dna=true;st=0;stT=0;applyL();setStep();return}
 applyL()}
function anim(dt,t){if(CTid==='default')animDef(dt,t);
 stT+=dt;if(stT>3.6){stT=0;st=(st+1)%Math.max(1,STP().length);if(!selm)setStep()}}
function animDef(dt,t){ANI.mito.forEach(o=>{o.g.rotation.z=o.rz+.12*Math.sin(t*.8+o.ph);o.g.position.y=o.y+.05*Math.sin(t*1.1+o.ph)});
 const jt=o=>o.m.position.set(o.b.x+.05*Math.sin(t*1.3+o.ph),o.b.y+.05*Math.sin(t*1.7+o.ph*2),o.b.z+.05*Math.cos(t*1.5+o.ph));ANI.free.forEach(jt);ANI.pr70.forEach(jt);
 ANI.ves.forEach(o=>{o.u=(o.u+o.sp*dt+1)%1;o.m.position.copy(o.cv.getPoint(o.u))});
 ANI.fla.rotation.y+=dt*9;ANI.pili.rotation.y=.2*Math.sin(t*2);ANI.nu.rotation.y=t*.15}
/* ---- floating labels ---- */
const LB=[['Nucleus','Nucleus'],['Mitochondrion','Mitochondrion'],['Golgi apparatus','Golgi'],['Rough ER (RER)','RER'],['Smooth ER (SER)','SER'],['Lysosome','Lysosome'],['Peroxisome','Peroxisome'],['Centrosome (2 centrioles)','Centrosome'],['Free ribosomes (80S)','Ribosome 80S'],['Plasma membrane','Plasma membrane'],['Capsule','Capsule'],['Cell wall (peptidoglycan)','Cell wall'],['Nucleoid (circular DNA)','Nucleoid'],['Ribosomes (70S)','Ribosome 70S'],['Plasmid','Plasmid'],['Flagellum','Flagellum'],['Storage granules','Granule'],['Pili / fimbriae','Pili']].map(a=>{const m=pick.find(x=>x.userData.name===a[0]),e=document.createElement('div');e.className='lab';e.textContent=a[1];$('#lbl').appendChild(e);return{m,e}});
const bbx=new T.Box3(),vv=new T.Vector3();
function labels(){const on=CAP&&!selm&&mode!=='5D'&&!ov();LB.forEach(l=>{let ok=on&&l.m&&vis(l.m);if(ok){bbx.setFromObject(l.m);bbx.getCenter(vv);if(l.m.userData.top)vv.y=bbx.max.y;vv.project(C);ok=vv.z<1&&Math.abs(vv.x)<1.05&&Math.abs(vv.y)<1.05;if(ok){l.e.style.left=((vv.x+1)/2*innerWidth)+'px';l.e.style.top=((1-vv.y)/2*innerHeight)+'px'}}l.e.style.display=ok?'block':'none'})}
/* ---- UI wiring ---- */
$('#md').onclick=e=>{const m=e.target.dataset.m;if(!m)return;setMode(m)};
$('#sd').onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.v)view(b.dataset.v);if(b.dataset.f)focus(b.dataset.f)};
$('#nm').onclick=()=>$('#card').classList.toggle('open');
$('#ct').onclick=e=>{cut=!cut;CUT.constant=cut?0:99;e.currentTarget.classList.toggle('on',cut)};
$('#zi').onclick=()=>zm(.75);$('#zo').onclick=()=>zm(1.3);$('#zout').onclick=()=>clr();
$('#ch').onclick=e=>{const k=e.target.dataset.l;if(k){L[k]=!L[k];applyL()}};
$('#cmpb').onclick=()=>$('#cmp').classList.add('open');$('#cx').onclick=()=>$('#cmp').classList.remove('open');
const TR=[['Plasma membrane','Selective barrier; fluid mosaic of lipids + proteins','E+P'],['Cytoplasm / cytosol','Fluid where glycolysis and free-ribosome protein synthesis happen','E+P'],['Nucleus','Holds DNA; transcription; double envelope with pores','E'],['Nucleolus','rRNA synthesis, ribosomal subunit assembly','E'],['Rough ER','Ribosome-studded; secretory protein synthesis and folding','E'],['Smooth ER','Lipids, steroids, detox, Ca2+ storage','E'],['Golgi apparatus','Modify, sort, pack proteins; cis to trans','E'],['Mitochondrion','ATP by oxidative phosphorylation; own mtDNA','E'],['Lysosome','Acid hydrolases; digestion and autophagy','E'],['Peroxisome','Beta-oxidation, catalase breaks H2O2','E'],['Centrosome','Microtubule organiser; mitotic spindle','E'],['Microtubules','Tubulin tracks; spindle, cilia, transport','E'],['Actin filaments','Cell shape, movement, cytokinesis','E'],['Ribosome 80S / 70S','Protein synthesis (80S eukaryote, 70S bacteria)','E+P'],['Capsule','Protects bacteria; biofilm','P'],['Cell wall (peptidoglycan)','Prevents lysis; Gram + / Gram - difference','P'],['Nucleoid','Circular chromosome without membrane','P'],['Plasmid','Extra circular DNA; antibiotic resistance','P'],['Flagellum','Proton-driven rotary motor; chemotaxis','P'],['Pili / fimbriae','Attachment; conjugation (F-pilus)','P'],['Storage granules','Glycogen, PHB, volutin','P']];
let done={};try{done=JSON.parse(localStorage.getItem('cv1')||'{}')}catch(e){}
function rl(){let n=0;$('#lb').innerHTML=TR.map((g,i)=>{if(done[i])n++;return `<label class="row"><input type="checkbox" data-i="${i}" ${done[i]?'checked':''}><span><b>${g[0]}</b><i>${g[2]}</i><br><small>${g[1]}</small></span></label>`}).join('');$('#cnt').textContent=n+'/'+TR.length+' yaad'}
$('#lb').onchange=e=>{done[e.target.dataset.i]=e.target.checked;try{localStorage.setItem('cv1',JSON.stringify(done))}catch(x){}rl()};
$('#lst').onclick=()=>{rl();$('#ls').classList.add('open')};$('#lx').onclick=()=>$('#ls').classList.remove('open');
/* ---- loop ---- */
const clock=new T.Clock();
function loop(){requestAnimationFrame(loop);if(window.DVOPEN)return;const dt=Math.min(clock.getDelta(),.05),t=clock.elapsedTime;
 V.th+=(W.th-V.th)*.12;V.el+=(W.el-V.el)*.12;V.r+=(W.r-V.r)*.12;V.t.lerp(W.t,.12);
 C.position.set(V.t.x+V.r*Math.cos(V.el)*Math.sin(V.th),V.t.y+V.r*Math.sin(V.el),V.t.z+V.r*Math.cos(V.el)*Math.cos(V.th));C.lookAt(V.t);
 if(mode==='4D')anim(dt,t);if(CTK)CTK(dt,t);labels();R.render(S,C)}
applyL();
