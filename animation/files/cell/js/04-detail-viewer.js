/* Organelle detail viewer (nucleus, mitochondria, ER, Golgi...) - naya cell add karte waqt ise mat chhedna */
'use strict';
/* ================= ORGANELLE DETAIL VIEWS (core + builders 1) ================= */
(()=>{
const DVE=document.createElement('div');DVE.id='dv';
DVE.innerHTML='<canvas id="dc"></canvas><div id="dh"><div><b id="dtt"></b><small id="dsb"></small></div><div class="dbt"><button id="dbk" hidden>◂ Peeche</button><button id="dcut" class="on">Cut</button><button id="dx" aria-label="Band karo">✕</button></div></div><div id="dn" hidden></div><div id="dl"></div>';
document.body.appendChild(DVE);
window.DVOPEN=false;
let R2,S2,C2,G2,pk=[],parts=[],flows=[],ticks=[],tgs=[],extras=[],selP=null,loopOn=false,curKey='',stack=[];
let th=.3,e2=.2,r=6,tth=.3,te=.2,tr=6,tr0=6,showFlow=true,showLab=false;
const tg=new T.Vector3(),ttg=new T.Vector3(),home=new T.Vector3(),clip=new T.Plane(new T.Vector3(0,0,-1),0),dclock=new T.Clock(),vv2=new T.Vector3();
const B={};
const init=()=>{if(R2)return;R2=new T.WebGLRenderer({canvas:$('#dc'),antialias:true,alpha:true});R2.setPixelRatio(Math.min(devicePixelRatio||1,2));R2.localClippingEnabled=true;S2=new T.Scene();C2=new T.PerspectiveCamera(40,1,.02,200);S2.add(new T.HemisphereLight(0xffffff,0x667788,1));const a=new T.DirectionalLight(0xffffff,.85);a.position.set(3,5,6);S2.add(a);const b=new T.DirectionalLight(0xbcd8ff,.4);b.position.set(-4,2,-5);S2.add(b)};
const part=(n,i,chip,go)=>{const P={n,i,m:[],chip:chip==null?1:chip,go};parts.push(P);return P};
const add=(geo,col,x,y,z,o,P)=>{o=o||{};const m=new T.Mesh(geo,new T.MeshStandardMaterial({color:col,roughness:.45,transparent:true,opacity:o.op==null?.7:o.op,side:T.DoubleSide,depthWrite:false}));m.position.set(x,y,z);if(o.s)m.scale.set(o.s[0],o.s[1],o.s[2]);if(o.r)m.rotation.set(o.r[0],o.r[1],o.r[2]);if(o.cut)m.material.clippingPlanes=[clip];m.userData={p:P,bo:m.material.opacity};(o.g||G2).add(m);pk.push(m);P.m.push(m);return m};
const tube=(pts,rad,col,P,op,o)=>{o=o||{};const cv=new T.CatmullRomCurve3(pts.map(V3));if(o.cl)cv.closed=true;return add(new T.TubeGeometry(cv,Math.max(12,pts.length*8),rad,8,!!o.cl),col,0,0,0,Object.assign({op:op==null?.8:op},o),P)};
const bar=(a,b,rad,col,P,op,o)=>{a=V3(a);b=V3(b);const d=b.clone().sub(a),m=add(new T.CylinderGeometry(rad,rad,d.length(),8),col,0,0,0,Object.assign({op:op==null?.9:op},o||{}),P);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.clone().normalize());return m};
const inst=(geo,col,pts,P,op,g,cut)=>{const m=new T.InstancedMesh(geo,new T.MeshStandardMaterial({color:col,roughness:.5,transparent:true,opacity:op==null?.95:op,side:T.DoubleSide}),pts.length),d=new T.Object3D();pts.forEach((p,i)=>{d.position.set(p[0],p[1],p[2]);const s=p[3]||1;d.scale.set(s,s,s);d.updateMatrix();m.setMatrixAt(i,d.matrix)});m.instanceMatrix.needsUpdate=true;if(cut)m.material.clippingPlanes=[clip];m.userData={p:P,bo:m.material.opacity};(g||G2).add(m);pk.push(m);P.m.push(m);return m};
const flow=(pts,col,n,spd,rad,g)=>{n=n||8;const c=new T.CatmullRomCurve3(pts.map(V3)),ps=[];for(let i=0;i<n;i++){const m=new T.Mesh(new T.SphereGeometry(rad||.04,8,6),new T.MeshBasicMaterial({color:col}));(g||G2).add(m);ps.push({m,u:i/n})}flows.push({c,ps,sp:spd||.12})};
const lab=(t,p,col)=>{const e=document.createElement('div');e.className='tg';e.textContent=t;e.style.borderLeftColor=col||'#f2c35a';DVE.appendChild(e);tgs.push({e,p:V3(p)})};
const go=(t,k)=>extras.push([t,k]);
const ttl=(t,s)=>{$('#dtt').textContent=t.split(':')[0].split(' (')[0];$('#dsb').textContent=''};
const reset=()=>{if(G2)S2.remove(G2);G2=new T.Group();S2.add(G2);pk=[];parts=[];flows=[];ticks=[];extras=[];selP=null;tgs.forEach(g=>g.e.remove());tgs=[];$('#dn').hidden=true};
const chips=()=>{$('#dl').innerHTML='<button id="bfl" class="'+(showFlow?'on':'')+'">Flow</button><button id="blb" class="'+(showLab?'on':'')+'">Labels</button>'};
const fin=c=>{ttg.set(c[0],c[1],c[2]);home.copy(ttg);tg.copy(ttg);tr0=tr=r=innerWidth/innerHeight<.8?c[4]:c[3];tth=th=c[5];te=e2=c[6];chips();R2.setSize(innerWidth,innerHeight);C2.aspect=innerWidth/innerHeight;C2.updateProjectionMatrix();flows.forEach(f=>f.ps.forEach(p=>p.m.visible=showFlow));DVE.classList.toggle('nolab',!showLab);$('#dbk').hidden=!stack.length};
const openK=k=>{init();reset();curKey=k;B[k]();fin(B.cam)};
const selectP=P=>{if(selP===P&&P.go){push(P.go);return}selP=selP===P?null:P;const n=$('#dn');if(!selP){n.hidden=true}else{n.hidden=false;n.innerHTML='<b>'+selP.n+'</b><br>'+selP.i+(selP.go?'<br><button class="go" data-go="'+selP.go+'">Aur andar dekho ▸</button>':'')}
 pk.forEach(m=>{const on=!selP||m.userData.p===selP;m.material.opacity=on?(selP?Math.min(1,m.userData.bo+.25):m.userData.bo):Math.min(m.userData.bo,.1);m.material.emissive.setHex(selP&&on?0x5a1a2a:0)});
 if(selP){const bb=new T.Box3();selP.m.forEach(m=>{if(!m.isInstancedMesh)bb.expandByObject(m)});if(!bb.isEmpty()){bb.getCenter(ttg);tr=clamp(bb.getSize(new T.Vector3()).length()*2.2+1.2,1.2,tr0)}else{ttg.copy(home);tr=tr0}}else{ttg.copy(home);tr=tr0}};
const push=k=>{stack.push(curKey);openK(k)};
window.openDV=k=>{stack=[];openK(k);DVE.classList.add('open');window.DVOPEN=true;if(!loopOn){loopOn=true;dclock.getDelta();requestAnimationFrame(dloop)}};
$('#dbk').onclick=()=>{if(stack.length)openK(stack.pop())};
$('#dx').onclick=()=>{DVE.classList.remove('open');window.DVOPEN=false;stack=[]};
$('#dcut').onclick=e=>{const on=clip.constant<50;clip.constant=on?99:0;e.currentTarget.classList.toggle('on',!on)};
$('#dn').onclick=e=>{const b=e.target.closest('button');if(b&&b.dataset.go)push(b.dataset.go)};
$('#dl').onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.id==='bfl'){showFlow=!showFlow;b.classList.toggle('on',showFlow);flows.forEach(f=>f.ps.forEach(p=>p.m.visible=showFlow));return}if(b.id==='blb'){showLab=!showLab;b.classList.toggle('on',showLab);DVE.classList.toggle('nolab',!showLab);return}if(b.dataset.go){push(b.dataset.go);return}if(b.dataset.i!=null)selectP(parts[+b.dataset.i])};
/* orbit input */
const DP=new Map(),RC2=new T.Raycaster();let dmv=0,dt0=0,dpd=0;const cvs=$('#dc');
const dpinch=()=>{if(DP.size<2)return 0;const a=[...DP.values()];return Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1])};
const dzm=f=>{tr=clamp(tr*f,.35,60)};
cvs.addEventListener('pointerdown',e=>{cvs.setPointerCapture(e.pointerId);DP.set(e.pointerId,[e.clientX,e.clientY]);if(DP.size===1){dmv=0;dt0=Date.now()}dpd=dpinch()});
cvs.addEventListener('pointermove',e=>{const p=DP.get(e.pointerId);if(!p)return;const dx=e.clientX-p[0],dy=e.clientY-p[1];p[0]=e.clientX;p[1]=e.clientY;dmv+=Math.abs(dx)+Math.abs(dy);if(DP.size===1){tth-=dx*.008;te=clamp(te+dy*.008,-1.4,1.45)}else{const d=dpinch();if(dpd&&d)dzm(clamp(dpd/d,.9,1.1));dpd=d}});
const dup=e=>{if(e.type==='pointerup'&&DP.size===1&&dmv<8&&Date.now()-dt0<400){const rc=cvs.getBoundingClientRect();RC2.setFromCamera(new T.Vector2((e.clientX-rc.left)/rc.width*2-1,-(e.clientY-rc.top)/rc.height*2+1),C2);let h=RC2.intersectObjects(pk.filter(m=>m.visible),false);if(clip.constant<50)h=h.filter(x=>x.point.z<=clip.constant);if(h.length)selectP(h[0].object.userData.p);else if(selP)selectP(selP)}DP.delete(e.pointerId);dpd=0};
cvs.addEventListener('pointerup',dup);cvs.addEventListener('pointercancel',dup);
cvs.addEventListener('wheel',e=>{e.preventDefault();dzm(1+e.deltaY*.001)},{passive:false});
addEventListener('resize',()=>{if(R2&&window.DVOPEN){R2.setSize(innerWidth,innerHeight);C2.aspect=innerWidth/innerHeight;C2.updateProjectionMatrix()}});
function dloop(){if(!window.DVOPEN){loopOn=false;return}requestAnimationFrame(dloop);const dt=Math.min(dclock.getDelta(),.05),t=dclock.elapsedTime;
 th+=(tth-th)*.12;e2+=(te-e2)*.12;r+=(tr-r)*.12;tg.lerp(ttg,.12);
 C2.position.set(tg.x+r*Math.cos(e2)*Math.sin(th),tg.y+r*Math.sin(e2),tg.z+r*Math.cos(e2)*Math.cos(th));C2.lookAt(tg);
 if(showFlow)flows.forEach(f=>f.ps.forEach(p=>{p.u=(p.u+dt*f.sp)%1;p.m.position.copy(f.c.getPoint(p.u))}));
 ticks.forEach(f=>f(dt,t));
 if(showLab)tgs.forEach(g=>{vv2.copy(g.p).project(C2);const ok=vv2.z<1&&Math.abs(vv2.x)<1.1&&Math.abs(vv2.y)<1.1;g.e.style.display=ok?'block':'none';if(ok){g.e.style.left=((vv2.x+1)/2*innerWidth)+'px';g.e.style.top=((1-vv2.y)/2*innerHeight)+'px'}});
 R2.render(S2,C2)}
const BL=0x4f7fe0,RD=0xe8504a;
/* ---------- NUCLEUS ---------- */
B.nuc=()=>{ttl('Nucleus (kendra)','Double membrane + pores. Cut ON hai: andar nucleolus aur chromatin dikhte hain.');B.cam=[0,0,0,6,9,.3,.15];
 const PE=part('Nuclear envelope (double membrane)','Two lipid bilayers (outer + inner) separated by the perinuclear space (20-40 nm). The outer membrane is continuous with the rough ER and carries ribosomes. Lamins underneath give shape and anchor chromatin.');
 add(sp(1.5,48,36),0x8a7ae0,0,0,0,{op:.26,cut:1},PE);add(sp(1.43,48,36),0x6a5ac8,0,0,0,{op:.26,cut:1},PE);
 const PL=part('Nuclear lamina','Mesh of lamin intermediate filaments just inside the inner membrane. Supports the nucleus and organises chromatin. Lamin A mutations cause progeria.');
 add(new T.IcosahedronGeometry(1.38,2),0xb0b0ff,0,0,0,{op:.5,cut:1},PL).material.wireframe=true;
 const PP=part('Nuclear pore complexes','About 2000-5000 per nucleus; each ~125 MDa (30 nucleoporins) with 8-fold symmetry. Under ~40 kDa molecules diffuse; larger cargo uses importins/exportins and the Ran-GTP gradient. mRNA, tRNA and ribosomal subunits leave; histones and polymerases enter.');
 const dirs=[new T.Vector3(1,.17,-.25).normalize()];for(let i=0;i<24;i++){const y=1-2*(i+.5)/24,rr=Math.sqrt(1-y*y),ph=i*2.4;dirs.push(new T.Vector3(Math.cos(ph)*rr,y,Math.sin(ph)*rr))}
 dirs.forEach(d=>{const m=add(tor(.11,.03),0xf2d27a,d.x*1.465,d.y*1.465,d.z*1.465,{op:.95,cut:1},PP);m.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),d)});
 const NO=part('Nucleolus','Non-membranous body where rDNA loops are transcribed by RNA polymerase I. Fibrillar centre, dense fibrillar and granular zones mirror the steps of ribosomal subunit assembly. Cells with high protein synthesis have large nucleoli.');
 add(sp(.42,24,18),0x3a2a7a,.3,.2,-.45,{op:.95,cut:1},NO);for(let i=0;i<8;i++)add(sp(.08,10,8),0x6a5ab8,.3+(rnd()-.5)*.5,.2+(rnd()-.5)*.5,-.45+(rnd()-.5)*.5,{op:.95,cut:1},NO);
 const EC=part('Euchromatin','Loosely packed, transcriptionally active DNA (pale in electron micrographs). Genes here can be read by RNA polymerase II.',1,'dna');
 for(let i=0;i<10;i++){const pts=[];let a=rnd()*6.28,b=rnd()*3.14;for(let j=0;j<7;j++){a+=rnd()*1.4;b+=rnd();const rr=.3+rnd()*.7;pts.push([rr*Math.sin(b)*Math.cos(a),rr*Math.cos(b),rr*Math.sin(b)*Math.sin(a)])}tube(pts,.03,0xf0a0e0,EC,.85,{cut:1})}
 const HC=part('Heterochromatin','Densely packed, silent chromatin, mostly at the periphery next to the lamina; includes centromeres and telomeres and stains dark in EM. Barr body = inactivated X chromosome.',1,'dna');
 for(let i=0;i<14;i++){const a=rnd()*6.28,b=1+rnd()*1.3,d=new T.Vector3(Math.sin(b)*Math.cos(a),Math.cos(b),-Math.abs(Math.sin(b)*Math.sin(a))).normalize(),m=add(sp(.17,10,8),0x7a1a6a,d.x*1.25,d.y*1.25,d.z*1.25,{op:.9,cut:1,s:[1.4,.5,1.1]},HC);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d)}
 add(sp(1.4,24,18),0xc8c0ff,0,0,0,{op:.09,cut:1},part('Nucleoplasm','Gel inside the nucleus with nucleotides, transcription factors, enzymes, speckles and the nuclear matrix scaffold.'));
 const ER=part('Rough ER connection','The outer nuclear membrane is continuous with the rough ER, and the perinuclear space is continuous with the ER lumen.');
 add(new T.SphereGeometry(1.7,32,16,0,3.0,.4,1.0),0x5aa6c8,0,0,0,{op:.4,cut:1},ER);
 flow([[.3,.2,-.45],[.9,.22,-.4],[1.4,.24,-.35],[2.2,.3,-.35],[3,.4,-.3]],0xffe04a,6,.1,.05);
 lab('Nuclear envelope',[0,1.75,0]);lab('Nuclear pore',[1.9,.7,-.35]);lab('Nucleolus',[.3,.2,-1.0]);lab('Heterochromatin',[-1.6,-.8,-.5]);lab('mRNA bahar',[2.8,.8,-.3],'#ffe04a');
 go('DNA tak zoom ▸','dna')};
/* ---------- DNA ---------- */
B.dna=()=>{ttl('DNA: chromatin se double helix tak','Chromatin > nucleosome > double helix. Bacteria mein bhi yahi helix hai, bas circular aur bina histone.');B.cam=[-.6,0,0,11,15,.2,.1];
 const hx=new T.Group();hx.position.set(2.4,0,0);G2.add(hx);
 const BB=part('Sugar-phosphate backbone','Deoxyribose sugar and phosphate alternate, joined by phosphodiester bonds. The two strands are antiparallel (5 to 3 and 3 to 5). The negative phosphates make DNA wrap tightly around positive histones.');
 const BP=part('Base pairs (A-T, G-C)','Adenine pairs with thymine (2 hydrogen bonds), guanine with cytosine (3). Chargaff: A=T and G=C in amount. The base sequence is the genetic code. 10.5 base pairs per turn, 3.4 nm pitch, 2 nm diameter.');
 const S1=[],S2=[],N=96;for(let i=0;i<=N;i++){const a=i*.34,y=-2.6+i*.055;S1.push([Math.cos(a)*.5,y,Math.sin(a)*.5]);S2.push([Math.cos(a+Math.PI)*.5,y,Math.sin(a+Math.PI)*.5])}
 tube(S1,.07,BL,BB,.9,{g:hx});tube(S2,.07,0xe85a8a,BB,.9,{g:hx});
 const BC=[[0xff8a4a,0x4aa0ff],[0x4aa0ff,0xff8a4a],[0x6ad06a,0xf0d040],[0xf0d040,0x6ad06a]];
 for(let i=1;i<N;i+=3){const c=BC[((i-1)/3|0)%4],a=S1[i],b=S2[i],m=[(a[0]+b[0])/2,a[1],(a[2]+b[2])/2];bar(a,m,.04,c[0],BP,.95,{g:hx});bar(m,b,.04,c[1],BP,.95,{g:hx})}
 const HI=part('Histone octamer (H2A, H2B, H3, H4 x2)','Eight positively charged histone proteins form the core of each nucleosome. Their N-terminal tails are chemically modified (acetylation, methylation) to switch genes on or off: the histone code.');
 const WR=part('DNA wrapped on the core (147 bp)','147 base pairs coil 1.65 turns around the octamer. Each nucleosome is about 10 nm wide; a human cell has roughly 30 million of them.');
 const LK=part('Linker DNA + histone H1','Free DNA (20-80 bp) joins nucleosomes into the beads-on-a-string 11 nm fibre. Linker histone H1 clamps the DNA where it enters and leaves and helps fold the fibre to 30 nm.');
 const ends=[];
 [-4.6,-2.9,-1.2].forEach(cx=>{for(let j=0;j<8;j++){const a=j*Math.PI/2+(j>3?.8:0);add(sp(.17,12,10),0x3d63c8,cx+Math.cos(a)*.22,Math.sin(a)*.22,j<4?.13:-.13,{op:.95},HI)}
  const pts=[];for(let i=0;i<=40;i++){const a=i/40*1.65*6.2832;pts.push([cx+.5*Math.cos(a),.5*Math.sin(a),-.2+.4*i/40])}
  tube(pts,.06,0xe85aa0,WR,.9);ends.push([pts[0],pts[40]]);add(sp(.1,10,8),0xf0c040,cx+.5,-.05,-.28,{op:.95},LK)});
 for(let k=0;k<2;k++){const a=ends[k][1],b=ends[k+1][0];tube([a,[(a[0]+b[0])/2,(a[1]+b[1])/2+.2,0],b],.05,0xe85aa0,LK,.9)}
 tube([[-6.1,.15,-.2],[-5.6,.05,-.2],ends[0][0]],.05,0xe85aa0,LK,.9);
 flow(S1.map(p=>[p[0]+2.4,p[1],p[2]]).filter((p,i)=>i%6===0),0xffe04a,4,.05,.05);
 ticks.push(dt=>{hx.rotation.y+=dt*.5});
 lab('Nucleosome',[-2.9,.95,0]);lab('Linker DNA',[-3.75,.55,0]);lab('Histone H1',[-1.2,.8,0],'#f0c040');lab('Double helix (2 nm)',[2.4,3.0,0]);lab('A-T = 2 bonds, G-C = 3 bonds',[2.4,-3.0,0],'#6ad06a');lab('Chromatin fibre',[-5.8,.9,0])};
/* ---------- MITOCHONDRION ---------- */
B.mit=()=>{ttl('Mitochondrion: powerhouse','Outer + inner membrane, cristae, ATP synthase, proton flow. Cut ON hai.');B.cam=[0,0,0,8,11,.35,.2];
 const MG=new T.Group();MG.rotation.z=Math.PI/2;G2.add(MG);const A=(geo,col,x,y,z,op,P,ex)=>add(geo,col,x,y,z,Object.assign({op:op,cut:1,g:MG},ex||{}),P);
 const PO=part('Outer membrane','Smooth and permeable to molecules under ~5 kDa thanks to porin (VDAC). Also hosts enzymes for fatty-acid elongation and the TOM protein import machinery. The space between membranes is the intermembrane space (proton reservoir).');
 A(capGeo(4.7,1.28),0xe39a6a,0,0,0,.28,PO);
 const PI=part('Inner membrane (impermeable)','Rich in cardiolipin; impermeable to ions, which lets it hold a proton gradient (about 150-180 mV). Contains the electron transport chain, ATP synthase and carrier proteins.');
 A(capGeo(4.4,1.1),0xc4505a,0,0,0,.34,PI);
 const PX=part('Cristae','Inner-membrane folds that multiply the surface area. Active tissues (heart, muscle) have densely packed cristae. Shapes: lamellar in most, tubular in steroid-making cells.');
 for(let k=0;k<10;k++)A(cy(.7,.05,28),0xd0505a,(k%2?-1:1)*.4,-1.75+k*.39,0,.8,PX);
 const ps=[],hs=[];for(let k=0;k<10;k++)for(let a=-1.2;a<=1.2;a+=.6){const x=(k%2?-1:1)*.4+.62*Math.cos(a),z=.62*Math.sin(a),y=-1.75+k*.39;ps.push([x,y+.1,z]);hs.push([x,y+.2,z])}
 const PA=part('ATP synthase (Complex V)','Rotary enzyme: protons flowing through the F0 part spin the stalk, and F1 (the knob) joins ADP + Pi into ATP (about 100+ ATP per second per enzyme; 3 ATP per rotation). Discovered by Boyer and Walker.');
 inst(new T.CylinderGeometry(.022,.022,.2,6),0xc8a050,ps,PA,.95,MG,1);inst(sp(.07,10,8),0xf2d27a,hs,PA,.95,MG,1);
 const PE=part('Electron transport chain (I-IV)','Complex I (NADH dehydrogenase), II (succinate dehydrogenase), III (cytochrome bc1) and IV (cytochrome c oxidase) pass electrons down to O2 and pump H+ into the intermembrane space. Cyanide blocks complex IV.');
 [[0x6ad0f0,0],[0x70e0a0,.12],[0xf0a0f0,.24],[0xffa070,.36]].forEach(c=>{const pts=[];for(let y=-1.7+c[1];y<1.8;y+=.48)pts.push([(Math.round((y+1.7)/.39)%2?-1:1)*1.08,y,0]);inst(new T.BoxGeometry(.13,.2,.18),c[0],pts,PE,.95,MG,1)});
 const PM=part('Matrix','Gel-like interior (pH ~8): pyruvate dehydrogenase, Krebs (citric acid) cycle, beta-oxidation of fatty acids, urea-cycle steps, mtDNA, mitoribosomes and calcium granules.');
 A(capGeo(4.0,.92),0xf2e6a0,0,0,0,.08,PM);
 const PD=part('mtDNA (circular)','16.5 kb circular genome with 37 genes (13 proteins, 22 tRNA, 2 rRNA), inherited from the mother. Several copies per mitochondrion; supports the endosymbiotic origin of mitochondria.',1,'dna');
 A(tor(.22,.03),0xe070d0,.1,-1.0,.15,.95,PD,{r:[1.2,0,0]});A(tor(.17,.03),0xe070d0,-.2,.9,-.1,.95,PD,{r:[.3,1,0]});
 const PR2=part('Mitoribosomes (70S-like)','Bacteria-like ribosomes that make 13 inner-membrane proteins from mtDNA. Sensitive to some antibiotics such as chloramphenicol.',1,'rib');
 inst(sp(.06,8,6),0xe8a33a,[...Array(9)].map(()=>[(rnd()-.5)*.9,(rnd()-.5)*3.2,(rnd()-.5)*.9]),PR2,.95,MG,1);
 flow([[.25,-1.0,0],[1.02,-1.0,0],[1.2,-.45,0],[1.2,.6,0],[.9,.66,0],[.3,.66,0]],0x9fe8ff,12,.1,.045,MG);
 lab('Outer membrane',[0,1.55,0]);lab('Matrix',[-.15,.3,0],'#f2e6a0');lab('Inner membrane',[1.0,-1.45,0],'#c4505a');lab('Cristae',[-1.5,-.6,0],'#d0505a');lab('ATP synthase',[1.9,.15,0],'#f2d27a');lab('H+ gradient',[.1,1.3,0],'#9fe8ff');lab('Intermembrane space',[-1.9,1.0,0])};
/* ---------- RIBOSOME ---------- */
B.rib=()=>{ttl('Ribosome: protein factory','Large + small subunit, mRNA, tRNA, polypeptide. 80S (eukaryote) = 60S + 40S; 70S (bacteria) = 50S + 30S.');B.cam=[0,.7,0,6.5,9,.3,.15];
 const LS=part('Large subunit (60S / 50S)','Mostly rRNA with ~46 proteins (eukaryote). Contains the peptidyl transferase centre where the peptide bond forms: a ribozyme, rRNA does the catalysis. The exit tunnel (~10 nm) lets the new chain emerge.');
 add(bump(sp(1,32,24),.06,6),0xe8a33a,0,.8,0,{op:.6,s:[1.55,1,1.15]},LS);
 const SS=part('Small subunit (40S / 30S)','Reads the mRNA: its decoding centre checks codon-anticodon pairing. In bacteria 30S binds the Shine-Dalgarno sequence; in eukaryotes 40S scans from the 5-prime cap. Streptomycin and tetracycline hit 30S.');
 add(bump(sp(1,28,20),.06,7),0xf2c870,0,-.45,0,{op:.65,s:[1.3,.5,.9]},SS);
 const MR=part('mRNA','Messenger RNA: codons (3 bases each) are read 5 to 3. The ribosome advances one codon per step (translocation, EF-G / eEF2 + GTP): about 20 amino acids/s in bacteria, 2-5/s in eukaryotes.');
 tube([[-3.2,.05,0],[-1.5,-.05,.1],[0,0,0],[1.5,.05,-.1],[3.2,0,0]],.05,0xf2e060,MR,.95);
 const CG=new T.Group();G2.add(CG);inst(new T.BoxGeometry(.2,.2,.2),0xf2e060,[...Array(19)].map((_,i)=>[-3.15+i*.35,.0,0]),MR,.95,CG);ticks.push((dt,t)=>{CG.position.x=-((t*.25)%.35)});
 [['E',-.6,0xc87a7a,'tRNA in E site (exit)','Exit site: the empty tRNA leaves here after giving up its amino acid.'],['P',0,0x7ac87a,'tRNA in P site (peptidyl)','Peptidyl site: holds the tRNA carrying the growing polypeptide chain.'],['A',.6,0x7a9ac8,'tRNA in A site (aminoacyl)','Aminoacyl site: the incoming charged tRNA pairs its anticodon with the mRNA codon here (delivered by EF-Tu / eEF1A + GTP).']].forEach(a=>{const P=part(a[3],a[4]),x=a[1];
  tube([[x,.0,0],[x,.35,0],[x+.1,.7,0],[x+.1,1.05,0]],.06,a[2],P,.95);[-.1,0,.1].forEach(d=>add(sp(.045,8,6),0xffffff,x+d,-.03,0,{op:1},P));add(sp(.1,10,8),0x6ad0a0,x+.1,1.1,0,{op:.95},P)});
 const PP=part('Growing polypeptide chain','Amino acids joined by peptide bonds leave through the exit tunnel and begin folding (chaperones help). On the RER the chain is threaded into the ER lumen.');
 const pc=new T.CatmullRomCurve3([[0,1.1,0],[-.15,1.4,.1],[-.4,1.75,.3],[-.2,2.1,.5],[.2,2.4,.4]].map(V3));tube([[0,1.1,0],[-.15,1.4,.1],[-.4,1.75,.3],[-.2,2.1,.5],[.2,2.4,.4]],.04,0x6ad0a0,PP,.8);inst(sp(.09,10,8),0x6ad0a0,pc.getPoints(10).map(p=>[p.x,p.y,p.z]),PP,.95);
 flow([[1.7,2.1,0],[1.0,1.3,0],[.65,.4,0]],0x7a9ac8,3,.08,.07);
 lab('Large subunit',[1.9,1.3,0]);lab('Small subunit',[1.6,-.7,0]);lab('mRNA',[-2.8,-.35,0],'#f2e060');lab('E',[-.6,1.55,0]);lab('P',[0,1.65,0]);lab('A',[.6,1.55,0]);lab('Polypeptide',[.8,2.5,.4],'#6ad0a0');lab('tRNA aa-A aata hua',[1.9,2.3,0],'#7a9ac8')};
/*CONTINUES_IN_P3B*/
/* ---------- PLASMA MEMBRANE ---------- */
B.memb=()=>{ttl('Plasma membrane: fluid mosaic','Phospholipid bilayer + proteins + cholesterol. Tap karke har hissa dekho.');B.cam=[0,0,0,7.5,11,.3,.3];
 const hd=[],tl=[],tl2=[],hd2=[];
 for(let x=-3.2;x<=3.2;x+=.3)for(let z=-1.6;z<=1.6;z+=.3){if(Math.hypot(x,z)<.62||Math.hypot(x-1.9,z+.5)<.5)continue;hd.push([x,.6,z]);hd2.push([x,-.6,z]);tl.push([x,.3,z]);tl2.push([x,-.3,z])}
 const PH=part('Phospholipid heads (hydrophilic)','Phosphate-glycerol heads face the watery outside and the cytosol. Amphipathic lipids self-assemble into a bilayer in water. Lipids move sideways in the leaflet (fluidity) but rarely flip-flop without flippase enzymes.');
 inst(sp(.14,10,8),0xf0b8a0,hd,PH,.95);inst(sp(.14,10,8),0xf0b8a0,hd2,PH,.95);
 const PT=part('Fatty-acid tails (hydrophobic)','Two tails per lipid face each other inside the bilayer, hiding from water. Unsaturated kinks keep it fluid; the core is about 3-4 nm thick and blocks ions and polar molecules.');
 inst(new T.CylinderGeometry(.045,.045,.55,6),0xf2dc90,tl,PT,.9);inst(new T.CylinderGeometry(.045,.045,.55,6),0xf2dc90,tl2,PT,.9);
 const PC=part('Channel protein','Integral transmembrane protein with a water-filled pore for specific ions (K+, Na+, Ca2+, Cl-). Many are gated by voltage or ligand. Aquaporins pass water. Passive: down the concentration gradient.');
 add(new T.CylinderGeometry(.42,.42,1.9,20,1,true),0x6a8ae0,0,0,0,{op:.8},PC);add(tor(.42,.08),0x6a8ae0,0,.95,0,{op:.9,r:[Math.PI/2,0,0]},PC);add(tor(.42,.08),0x6a8ae0,0,-.95,0,{op:.9,r:[Math.PI/2,0,0]},PC);
 const PU=part('Carrier / pump (Na+-K+ ATPase)','Pumps 3 Na+ out and 2 K+ in per ATP, against gradients: active transport. Keeps cell volume and the resting potential. Uses about 20-30% of a cell\'s ATP.');
 add(sp(.5,20,14),0xe8504a,1.9,.1,-.5,{op:.85,s:[1,1.7,1]},PU);
 const PG=part('Glycoprotein / glycolipid (glycocalyx)','Protein or lipid with sugar chains on the outer face. Forms the glycocalyx: cell recognition, immune self-markers, ABO blood groups, adhesion.');
 [[-1.5,.2],[-2.4,-.6],[2.8,.8]].forEach(a=>{const x=a[0],z=a[1];tube([[x,.6,z],[x,1.0,z],[x+.1,1.4,z]],.05,0x4acfa0,PG,.95);[[0,1.5],[.2,1.7],[-.15,1.75]].forEach(o=>add(sp(.11,8,6),0xf0c040,x+o[0],o[1],z,{op:.95},PG))});
 const PX=part('Cholesterol','Fits between the phospholipids in animal membranes: stiffens the bilayer at body temperature and keeps it fluid in the cold. Absent in bacteria (except mycoplasma).');
 [[-.9,-.5],[.9,.6],[2.4,-1.0],[-2.2,1.0],[0,1.1],[-2.8,-1.1]].forEach(a=>{add(new T.CylinderGeometry(.07,.07,.5,6),0xf0d040,a[0],.3,a[1],{op:.95},PX);add(sp(.1,8,6),0xf0d040,a[0],.58,a[1],{op:.95},PX)});
 const PR=part('Receptor (signalling)','Transmembrane protein with an outer binding site: hormone or neurotransmitter binds and the shape change starts a signal inside (G-protein, kinase). Examples: insulin receptor, GPCRs.');
 add(new T.ConeGeometry(.3,.9,14),0xc87ae0,-1.0,.95,.5,{op:.95,r:[Math.PI,0,0]},PR);add(new T.CylinderGeometry(.12,.12,1.2,10),0xc87ae0,-1.0,.0,.5,{op:.95},PR);
 const PP=part('Peripheral protein / cytoskeleton anchor','Attached to the inner surface without crossing the bilayer: spectrin, ankyrin and actin link the membrane to the cytoskeleton and keep its shape.');
 add(sp(.3,12,10),0xf09a70,1.0,-1.1,.9,{op:.95,s:[1.4,.8,1]},PP);add(sp(.3,12,10),0xf09a70,-.6,-1.1,-.9,{op:.95,s:[1.4,.8,1]},PP);tube([[1.0,-1.1,.9],[0,-1.5,0],[-.6,-1.1,-.9]],.03,0xf09a70,PP,.9);
 flow([[0,2.2,0],[0,.4,0],[0,-.4,0],[0,-2.0,0]],0xffe04a,6,.14,.06);flow([[1.9,-1.8,-.5],[1.9,-.2,-.5],[1.9,1.9,-.5]],0x7aff9a,3,.07,.07);
 lab('Phospholipid head',[-3.0,.9,-1.2]);lab('Fatty-acid tails',[-3.0,0,-1.2],'#f2dc90');lab('Channel + ions',[0,2.5,0],'#ffe04a');lab('Na+-K+ pump',[2.1,1.6,-.5],'#e8504a');lab('Glycoprotein',[-1.5,1.9,.2],'#4acfa0');lab('Cholesterol',[-2.8,-.45,-1.1],'#f0d040');lab('Receptor',[-1.0,1.7,.5],'#c87ae0');lab('Cytosol (andar)',[0,-2.3,1.4],'#97adc6');lab('Bahar (ECF)',[0,2.9,1.4],'#97adc6')};
/* ---------- ER ---------- */
B.er=()=>{ttl('Endoplasmic reticulum: RER + SER','Ribosome-wali sheets (RER) aur chikni tubules (SER). Lumen ek hi connected space hai.');B.cam=[0,0,0,8,12,.4,.3];
 const PR=part('Rough ER cisternae','Stacked flat sacs whose lumen (~20-30 nm) is continuous with the nuclear envelope. Chaperones (BiP) and disulphide isomerase fold proteins; N-glycosylation starts here; misfolded proteins are exported for degradation (ERAD).');
 for(let i=0;i<4;i++)add(sp(1,28,16),0x5aa6c8,-1.2,-.9+i*.55,0,{op:.5,s:[2.4-.1*i,.2,1.5-.05*i],cut:1},PR);
 const PB=part('Bound ribosomes (80S)','Docked on the Sec61 translocon. The SRP recognises the signal peptide, stops translation and brings the ribosome to the ER; the chain then threads directly into the lumen.',1,'rib');
 const rp=[];for(let i=0;i<4;i++)for(let k=0;k<12;k++){const a=rnd()*6.28,r=Math.sqrt(rnd());rp.push([-1.2+Math.cos(a)*r*(2.1-.1*i),-.9+i*.55+.22,Math.sin(a)*r*(1.3-.05*i)]);}
 inst(sp(.09,8,6),0xe8a33a,rp,PB,.95,null,1);
 const PS=part('Smooth ER tubules','Branching tubular network without ribosomes. Makes phospholipids, cholesterol and steroid hormones; detoxifies drugs (cytochrome P450); stores Ca2+ (muscle SR); glycogen breakdown in the liver.');
 for(let i=0;i<5;i++){const a=[1.1,-.7+i*.4,(i%2?-1:1)*.4];tube([a,[a[0]+1,a[1]+.4*(i%2?-1:1),a[2]*-1],[a[0]+2,a[1]-.2,a[2]],[a[0]+2.8,a[1]+.3,a[2]*.5]],.1,0xe0b060,PS,.75,{cut:1})}
 const PV=part('Transport vesicle (COPII)','Buds from smooth ER exit sites carrying folded protein to the cis-Golgi. Coat protein COPII (Sar1, Sec23/24, Sec13/31) selects cargo and bends the membrane.');
 [[1.0,.9,.3],[.5,1.2,-.2]].forEach(a=>add(sp(.16,12,10),0xffd09a,a[0],a[1],a[2],{op:.95},PV));
 const PL=part('Lumen','Interior space where proteins fold and are modified. Rich in Ca2+. Disturbed folding triggers the unfolded protein response (UPR).');
 add(sp(1,12,8),0xc8e8ff,-1.2,-.1,0,{op:.0,s:[.01,.01,.01]},PL);
 flow([[-3.0,.9,0],[-1.8,.9,0],[-.5,.8,0],[.8,.7,.1],[1.2,1.0,.2],[2.0,1.4,.2]],0xffe04a,7,.08,.05);
 lab('RER sheets',[-2.9,1.5,0]);lab('Ribosomes',[-1.2,1.55,0],'#e8a33a');lab('SER tubules',[3.2,-.2,.4],'#e0b060');lab('Vesicle to Golgi',[.9,1.8,.2],'#ffd09a');lab('Lumen',[-1.2,-.3,.8],'#c8e8ff');lab('Protein andar jata hua',[-.4,1.1,0],'#ffe04a')};
/* ---------- GOLGI ---------- */
B.golgi=()=>{ttl('Golgi apparatus','Cis (ER se aane wala) se trans (bahar jane wala) tak: modify, sort, pack.');B.cam=[0,0,0,7.5,11,.4,.3];
 const CS=['cis','cis-medial','medial','medial','trans','TGN'],COL=[0xf0a860,0xe89a60,0xe08a62,0xd87a62,0xd0685a,0xc4505a],INF=['cis-Golgi: receives cargo from ER; phosphate on lysosomal enzymes added; KDEL receptors send escaped ER proteins back.','cis-medial: early trimming of mannose from N-glycans.','medial: adds GlcNAc and other sugars to build complex glycans.','medial: more glycosylation (fucose); proteoglycan chain build-up.','trans: galactose + sialic acid added; sulfation; tyrosine sulfate.','trans-Golgi network (TGN): sorts cargo into secretory, lysosomal or constitutive vesicles using clathrin and adaptors.'];
 CS.forEach((n,i)=>{const P=part('Cisterna '+n,INF[i],i===0||i===3||i===5?1:0);add(sp(1,32,10),COL[i],0,-1.2+i*.5,0,{op:.8,s:[2.4-.17*i,.17,1.6-.1*i]},P)});
 const PV=part('Incoming vesicles (ER to Golgi)','COPII vesicles fuse into ERGIC and then the cis face. Retrograde COPI vesicles return escaped ER proteins.');
 for(let i=0;i<6;i++)add(sp(.16,12,10),0xffd09a,-3.1+(i%2)*.3,-1.3+(i%3)*.2,(i-3)*.28,{op:.95},PV);
 const PO=part('Outgoing vesicles (secretory, lysosomal)','From the TGN: clathrin-coated vesicles with lysosomal enzymes (M6P receptors); secretory granules wait for a signal (insulin); constitutive vesicles go to the membrane all the time.');
 const out=[[2.5,1.7,.2],[2.9,1.4,-.4],[2.6,.9,.5],[3.1,2.0,.4],[2.2,2.1,-.3]];out.forEach((a,i)=>add(sp(.2,12,10),i%2?0x8fd06a:0xf0d060,a[0],a[1],a[2],{op:.95},PO));
 flow([[-3.2,-1.2,0],[-2.2,-1.2,0],[-1.0,-.4,0],[0,.4,0],[1.2,1.1,0],[2.6,1.5,0]],0xffe04a,8,.08,.055);
 lab('cis face (receiving)',[-1.9,-1.8,0],'#f0a860');lab('trans face (shipping)',[1.2,2.0,0],'#c4505a');lab('Secretory vesicle',[3.0,2.55,0],'#f0d060');lab('Lysosome vesicle',[3.0,.5,.5],'#8fd06a');lab('ER vesicles',[-3.2,-.6,.6],'#ffd09a')};
/* ---------- LYSOSOME ---------- */
B.lyso=()=>{ttl('Lysosome: digestion bag','Acidic hydrolases, proton pump, bhitar fasa hua bacterium. Cut ON hai.');B.cam=[0,0,0,5.5,8,.3,.2];
 const PM=part('Lysosomal membrane','Single membrane with heavily glycosylated LAMP proteins that protect it from its own enzymes. Holds a V-type H+ ATPase pump and transporters for the end-products.');
 add(sp(2,40,30),0x8fd06a,0,0,0,{op:.28,cut:1},PM);
 const PH=part('Acid hydrolases (~50 enzymes)','Proteases (cathepsins), lipases, nucleases, glycosidases, phosphatases and sulfatases working at pH ~4.5-5. They would be much less active at cytosolic pH 7.2, a second safety layer. Missing enzymes cause storage diseases (Tay-Sachs, Gaucher, Pompe).');
 inst(sp(.1,10,8),0xf0d040,[...Array(50)].map(()=>{let p;do{p=[(rnd()-.5)*3.6,(rnd()-.5)*3.6,(rnd()-.5)*3.6]}while(Math.hypot(...p)>1.7||Math.hypot(p[0]-.3,p[1]+.2,p[2])<.8);return p}),PH,.95,null,1);
 const PP=part('H+ pump (V-ATPase)','Uses ATP to pump protons into the lysosome and keep the pH near 4.8.');
 for(let i=0;i<10;i++){const a=i*.63,d=new T.Vector3(Math.cos(a),Math.sin(a*1.3),Math.sin(a)).normalize(),m=add(new T.CylinderGeometry(.06,.1,.3,8),0xe8504a,d.x*2.0,d.y*2.0,d.z*2.0,{op:.95,cut:1},PP);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d)}
 const PB=part('Engulfed bacterium (being digested)','Phagocytosis wraps a microbe in a phagosome, which fuses with a lysosome to form a phagolysosome. Enzymes and reactive oxygen species break the microbe into amino acids, sugars and fatty acids that are recycled.');
 add(capGeo(1.1,.34),0xf2e6a0,.3,-.2,0,{op:.95,r:[0,0,1.0],cut:1},PB);add(capGeo(1.1,.34),0xe0b060,.3,-.2,0,{op:.5,s:[1.15,1.05,1.15],r:[0,0,1.0],cut:1},PB);
 const PA=part('Autophagy cargo (old organelle)','Worn-out mitochondria and proteins are wrapped by an autophagosome (LC3-marked) and delivered here for recycling. Yoshinori Ohsumi won the 2016 Nobel for this.');
 add(cy(.25,.4,14),0xe39a6a,-.9,.8,.4,{op:.95,cut:1,r:[.6,0,.4]},PA);
 flow([[2.6,.6,.4],[1.9,.4,.3],[1.0,.1,.1],[.5,-.1,0]],0xffe04a,4,.06,.06);
 lab('Membrane (LAMP)',[0,2.3,0]);lab('Hydrolases',[-1.0,-.9,.9],'#f0d040');lab('Bacterium',[.8,.9,.2],'#f2e6a0');lab('V-ATPase pump',[2.3,-1.2,.4],'#e8504a');lab('pH ~4.8',[-.2,-2.2,0],'#8fd06a');lab('Autophagy cargo',[-1.6,1.5,.4],'#e39a6a')};
/* ---------- CENTRIOLE ---------- */
B.cen=()=>{ttl('Centrosome: 2 centrioles','9 triplets ka cylinder, perpendicular jodi, aur microtubule aster.');B.cam=[0,0,0,5.5,8,.4,.35];
 const mkCen=(g,len,nm)=>{const T1=part(nm+' (microtubule triplets)','Nine triplets (A tubule complete, B and C incomplete) arranged in a ring: 9 x 3 + 0 pattern, about 250 nm wide and 500 nm long. Made of tubulin; the cartwheel at the proximal end sets the 9-fold symmetry.');
  for(let i=0;i<9;i++){const a=i*Math.PI*2/9,cx=Math.cos(a)*.5,cz=Math.sin(a)*.5;[0,1,2].forEach(k=>{const aa=a+k*.17-.17,x=Math.cos(aa)*(.5+(k===1?.1:0)),z=Math.sin(aa)*(.5+(k===1?.1:0));add(new T.CylinderGeometry(.07,.07,len,8),k===0?0x70e0b0:0x40b080,x,0,z,{op:.95,g:g},T1)})}
  add(new T.CylinderGeometry(.13,.13,len*.25,10),0xf0d060,0,-len*.35,0,{op:.95,g:g},part(nm+' cartwheel','Central hub with 9 radial spokes at the base; the protein SAS-6 builds it and decides the 9-fold symmetry.',0));
  for(let i=0;i<9;i++){const a=i*Math.PI*2/9;add(new T.CylinderGeometry(.015,.015,.5,5),0xf0d060,Math.cos(a)*.25,-len*.35,Math.sin(a)*.25,{op:.95,g:g,r:[0,0,Math.PI/2],s:[1,1,1]},part(nm+' spoke','Radial spoke of the cartwheel.',0))}};
 const M=new T.Group(),D=new T.Group();D.position.set(1.3,-.4,0);D.rotation.z=Math.PI/2;G2.add(M);G2.add(D);mkCen(M,1.5,'Mother centriole');mkCen(D,1.3,'Daughter centriole');
 const PM=part('Pericentriolar material (PCM)','Dense protein cloud around the mother centriole (pericentrin, gamma-tubulin ring complexes) that nucleates microtubules. Expands in mitosis to form spindle poles.');
 add(sp(1.7,24,18),0xc8f0e0,.4,-.2,0,{op:.14},PM);
 const PT=part('Microtubule aster','Microtubules grow from gamma-TuRC caps at their minus ends embedded in the PCM, with plus ends pointing outward. In mitosis they form the spindle that pulls chromosomes apart.');
 for(let i=0;i<14;i++){const a=i*.9,b=.3+i*.2,d=new T.Vector3(Math.cos(a)*Math.sin(b),Math.cos(b),Math.sin(a)*Math.sin(b)).normalize();tube([[.4+d.x*.9,-.2+d.y*.9,d.z*.9],[.4+d.x*2,-.2+d.y*2,d.z*2],[.4+d.x*3.4,-.2+d.y*3.4+(rnd()-.5)*.4,d.z*3.4]],.03,0x70e0b0,PT,.85)}
 flow([[2.5,1.3,.4],[1.6,.6,.2],[.9,.2,0]],0xffe04a,4,.07,.05);
 lab('Mother centriole',[0,1.2,0]);lab('Daughter (90 degree)',[1.3,.6,0],'#40b080');lab('PCM',[1.9,-1.4,0],'#c8f0e0');lab('Microtubules',[3.2,1.5,.5],'#70e0b0');lab('Cartwheel',[-.3,-.8,.6],'#f0d060')};
/* ---------- BACTERIAL CELL WALL ---------- */
B.wall=()=>{ttl('Bacterial cell wall: Gram-negative','Outer membrane, peptidoglycan, periplasm, inner membrane. Cross-links hi antibiotic target hain.');B.cam=[0,.3,0,7,10,.45,.4];
 const OM=part('Outer membrane (LPS)','Unique to Gram-negative bacteria: outer leaflet is lipopolysaccharide (LPS, endotoxin), inner leaflet phospholipid. Porins let small molecules in. Makes them harder to treat with some antibiotics and dyes (they lose crystal violet).');
 const hdA=[];for(let x=-3;x<=3;x+=.35)for(let z=-1.5;z<=1.5;z+=.35)hdA.push([x,1.8,z]);inst(sp(.15,10,8),0xe0a060,hdA,OM,.95);inst(new T.CylinderGeometry(.04,.04,.7,6),0xf2dc90,hdA.map(p=>[p[0],p[1]+-.45,p[2]]),OM,.9);inst(sp(.15,10,8),0xe0a060,hdA.map(p=>[p[0],1.1,p[2]]),OM,.95);
 [[-1.8,.5],[1.6,-.7]].forEach(a=>{add(new T.CylinderGeometry(.3,.3,.9,16,1,true),0x8ab0f0,a[0],1.45,a[1],{op:.9},part('Porin','Beta-barrel channel in the outer membrane; passes hydrophilic molecules under ~600 Da.'))});
 tube([[-2.6,2.0,-1.0],[-2.4,2.3,-1.0],[-2.0,2.5,-1.0],[-1.6,2.7,-1.0]],.04,0x4acfa0,OM,.95);
 const PG=part('Peptidoglycan (murein) layer','Mesh of glycan strands (alternating NAG and NAM sugars) cross-linked by short peptides (D-Ala to meso-DAP in Gram-negative). Gram-negative: a thin 1-2 layer sheet; Gram-positive: 20-80 nm thick. Penicillin blocks the transpeptidases (PBPs) that make the cross-links, so the cell bursts. Lysozyme cuts the NAG-NAM bond.');
 for(let k=0;k<7;k++){const z=-1.5+k*.5;for(let i=0;i<14;i++)add(sp(.12,8,6),i%2?0xf0c040:0xe8706a,-2.9+i*.45,.45,z,{op:.95},PG);bar([-3,.45,z],[3,.45,z],.035,0xd0b060,PG,.95)}
 for(let k=0;k<6;k++)for(let x=-2.5;x<=2.6;x+=1.2)bar([x,.45,-1.5+k*.5],[x,.45,-1.0+k*.5],.025,0x6ad0a0,PG,.95);
 const PS=part('Periplasm','Gel-like space (about 15 nm) between the membranes with the peptidoglycan, binding proteins, beta-lactamase enzymes and chaperones. Gram-negative only; Gram-positives have just a periplasmic gap.');
 add(new T.BoxGeometry(6.4,.9,3.4),0xf6e0a0,0,.9,0,{op:.07},PS);
 const IM=part('Inner (plasma) membrane','Phospholipid bilayer with the ETC, ATP synthase, transporters and the machinery for wall synthesis. This membrane is the permeability barrier in all bacteria.');
 const hdI=[];for(let x=-3;x<=3;x+=.35)for(let z=-1.5;z<=1.5;z+=.35){hdI.push([x,0,z],[x,-.55,z])}inst(sp(.15,10,8),0xf0b0c0,hdI,IM,.95);inst(new T.CylinderGeometry(.04,.04,.42,6),0xf2dc90,hdI.filter((p,i)=>i%2===0).map(p=>[p[0],-.28,p[2]]),IM,.9);
 add(new T.CylinderGeometry(.35,.35,.9,16,1,true),0x6a8ae0,.5,-.28,.2,{op:.9},part('Transport protein','Moves nutrients in and waste out, driven by ATP or the proton gradient.'));
 flow([[-2,2.4,0],[-2,1.8,0],[-2,.9,0],[-2,.1,0],[-2,-.8,0]],0xffe04a,5,.1,.06);
 lab('LPS (endotoxin)',[-2.8,3.0,0],'#e0a060');lab('Outer membrane',[3.0,1.6,0]);lab('Peptidoglycan: penicillin yahin kaam karti hai',[2.4,.45,1.8],'#f0c040');lab('Periplasm',[-3.2,.9,1.8],'#f6e0a0');lab('Inner membrane',[3.1,-.3,0],'#f0b0c0');lab('Porin',[-1.8,2.2,.5],'#8ab0f0');lab('Cytoplasm',[0,-1.5,0],'#97adc6')};
/* ---------- FLAGELLAR MOTOR ---------- */
B.flag=()=>{ttl('Bacterial flagellar motor','Proton se chalne wala rotary motor. Rotor ghoomta hai, stator proton flow se torque deta hai.');B.cam=[0,.4,0,7,10,.35,.2];
 const OM=part('Outer membrane','Outer membrane through which the rod passes, held by the L ring.');add(new T.CylinderGeometry(2.4,2.4,.14,40,1,true),0xe0a060,0,1.5,0,{op:.3},OM);
 const PG=part('Peptidoglycan layer','The rod passes through the wall; the P ring acts as a bushing against the peptidoglycan.');add(new T.CylinderGeometry(2.4,2.4,.1,40,1,true),0xf0c040,0,.75,0,{op:.32},PG);
 const IM=part('Inner (plasma) membrane','The MS ring sits in the inner membrane; the proton motive force across it powers the motor.');add(new T.CylinderGeometry(2.4,2.4,.14,40,1,true),0xf0b0c0,0,0,0,{op:.32},IM);
 const rot=new T.Group(),sta=new T.Group();G2.add(rot);G2.add(sta);
 const LR=part('L and P rings (bushings)','L ring in the outer membrane/LPS and P ring in the peptidoglycan act as static bearings through which the rod spins.');
 add(tor(.34,.07),0x8ab0f0,0,1.5,0,{op:.95,r:[Math.PI/2,0,0]},LR);add(tor(.3,.07),0x8ab0f0,0,.75,0,{op:.95,r:[Math.PI/2,0,0]},LR);
 const RD=part('Rod (drive shaft)','About 25 nm long axle (FlgB, C, F, G proteins) that transmits torque from the MS ring up to the hook.');add(new T.CylinderGeometry(.1,.1,2.2,12),0xe8a33a,0,.55,0,{op:.95,g:rot},RD);
 const MS=part('MS ring (rotor)','Membrane/supramembrane ring of ~26 FliF subunits embedded in the inner membrane; the base of the rotor.');add(new T.CylinderGeometry(.55,.55,.28,26),0xe8504a,0,0,0,{op:.95,g:rot},MS);
 const CR=part('C ring (switch complex)','Cytoplasmic ring (FliG, FliM, FliN) that takes torque from the stator. Binding of the chemotaxis signal CheY-P flips rotation from anticlockwise to clockwise.');add(new T.CylinderGeometry(.8,.8,.55,26,1,true),0xc87ae0,0,-.5,0,{op:.9,g:rot},CR);add(new T.CylinderGeometry(.8,.8,.07,26),0xc87ae0,0,-.78,0,{op:.9,g:rot},CR);
 const ST=part('Stator (MotA/MotB)','Fixed ion channels around the rotor. Each lets protons flow in (down the proton motive force) and the shape change pushes on the C ring: torque. Up to ~11 stator units; some marine species use Na+ instead of H+.');
 for(let i=0;i<8;i++){const a=i*Math.PI/4;add(new T.CylinderGeometry(.13,.13,.7,10),0x4acfa0,Math.cos(a)*.95,-.1,Math.sin(a)*.95,{op:.95,g:sta},ST)}
 const HK=part('Hook (universal joint)','Flexible curved hook (FlgE, ~55 nm) that links rod and filament and lets the filament bend and bundle with its neighbours.');
 tube([[0,1.6,0],[0,2.1,0],[.3,2.55,0],[.6,2.7,0]],.12,0xe8a33a,HK,.95,{g:rot});
 const FL=part('Filament (flagellin helix)','Hollow helical tube of ~20,000 flagellin (FliC) units, up to 10-20 um long. It grows by adding units at the tip through the hollow centre. Anticlockwise rotation bundles filaments to make the cell run; clockwise makes it tumble.');
 const fp=[];for(let i=0;i<50;i++)fp.push([.6+i*.1,2.7+.5*Math.sin(i*.45)+i*.06,.4*Math.cos(i*.45)]);tube(fp,.09,0xf0e090,FL,.95,{g:rot});
 flow([[1.5,.9,.6],[1.3,.3,.3],[.95,-.1,.0],[1.1,-.7,0]],0x9fe8ff,4,.09,.07,sta);
 ticks.push((dt)=>{rot.rotation.y+=dt*2.6});
 lab('Filament',[3.4,3.7,0],'#f0e090');lab('Hook',[.9,2.5,0],'#e8a33a');lab('L ring',[-.9,1.5,0],'#8ab0f0');lab('P ring',[-.8,.75,0],'#8ab0f0');lab('Stator',[1.5,-.1,0],'#4acfa0');lab('MS ring',[-1.1,0,0],'#e8504a');lab('C ring',[-1.2,-.6,0],'#c87ae0');lab('H+ andar',[1.7,.9,.6],'#9fe8ff');lab('Rod',[.5,1.0,0],'#e8a33a')};
/* ---- extension API: naye cells apne detail views yahan se jodte hain (js/models/<cell>-detail.js) ---- */
const DVAPI={part,add,tube,bar,inst,flow,lab,ttl,go,tick:f=>ticks.push(f),cam:c=>{B.cam=c},root:()=>G2};
window.registerDetail=(k,fn)=>{B[k]=()=>fn(DVAPI)};
})();
