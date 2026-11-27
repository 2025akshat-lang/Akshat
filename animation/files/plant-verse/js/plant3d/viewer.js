
function pvFail(err){
  console.error('[Plantverse] 3D start nahi hua:',err);
  let b=document.getElementById('pvfail');
  if(!b){b=document.createElement('div');b.id='pvfail';b.style.cssText='position:absolute;left:8px;right:8px;top:8px;z-index:9;padding:8px 10px;border-radius:8px;background:#b00020;color:#fff;font:12px/1.4 monospace';$v[1].appendChild(b)}
  b.textContent='3D start nahi hua: '+(err&&err.message||err);
}
function initH(){
  if(H)return true;
  try{
    if(typeof THREE==='undefined')throw new Error('three.js load nahi hua (internet / ad-blocker check karo)');
    const renderer=new T.WebGLRenderer({antialias:true,alpha:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
    $v[1].insertBefore(renderer.domElement,$('#hlbl'));
    const scene=new T.Scene(),camera=new T.PerspectiveCamera(38,1,.1,200),pivot=new T.Group();
    pivot.rotation.order='YXZ';scene.add(pivot);
    scene.add(new T.AmbientLight(0xffffff,.78));
    const d1=new T.DirectionalLight(0xffffff,.38);d1.position.set(2,4,6);scene.add(d1);
    const d2=new T.DirectionalLight(0xffffff,.22);d2.position.set(-3,2,-5);scene.add(d2);
    const B=buildPlant();B.group.position.y=-.85;pivot.add(B.group);
    H=Object.assign(B,{renderer,scene,camera,pivot,ray:new T.Raycaster(),ptrs:new Map(),down:null,raf:0,rotX:0,rotY:0,zoom:1,auto:false,sel:null,lbls:[],ready:true,V:Object.assign({},FULL),T:Object.assign({},FULL),last:performance.now(),t0:performance.now()});
    H.apply(H.V,0);H.ray.params.Line.threshold=.05;
    const V3=(x,y,z)=>new T.Vector3(x,y,z),an=H.anchors,fc=H.fcL,sd=H.n0;
    const defs=[
      {t:'Petals',side:'r',k:'s',p:()=>V3(.67,5.77,.1),show:V=>V.flower>.5},
      {t:'Carpel',side:'l',k:'s',p:()=>V3(0,5.55,.95),show:V=>V.flower>.5},
      {t:'Stamens',side:'r',k:'s',p:()=>V3(.29,5.61,.72),show:V=>V.flower>.5},
      {t:'Sepals',side:'l',k:'s',p:()=>V3(-.67,5.33,-.04),show:V=>V.flower>.5},
      {t:'Leaf blade',side:'l',k:'s',p:()=>V3(-1.7,3.15,.25),show:V=>V.l1>.5},
      {t:'Petiole',side:'r',k:'s',p:()=>V3(.28,3.63,.02),show:V=>V.l2>.5},
      {t:'Leaf base',side:'l',k:'s',p:()=>V3(-.08,2.37,0),show:V=>V.l1>.5},
      {t:'Stipules',side:'l',k:'s',p:()=>V3(-.1,2.6,.14),show:V=>V.l1>.5},
      {t:'Node',side:'l',k:'s',p:()=>V3(-.14,1.4,0),show:V=>V.shoot>.35},
      {t:'Main stem',side:'r',k:'s',p:()=>V3(.11,.4,0),show:V=>V.shoot>.35},
      {t:'Branch',side:'l',k:'s',p:()=>V3(-.85,1.4,.12),show:V=>V.shoot>.6},
      {t:'Apical bud',side:'l',k:'s',p:()=>V3(-1.3,2.05,.12),show:V=>V.shoot>.6},
      {t:'Axillary bud',side:'r',k:'s',p:()=>V3(.13,3.78,.06),show:V=>V.shoot>.6},
      {t:'Flower bud',side:'l',k:'s',p:()=>V3(-.58,4.98,.1),show:V=>V.shoot>.6},
      {t:'Trichomes',side:'r',k:'s',p:()=>V3(.12,2.0,0),show:V=>V.shoot>.6},
      {t:'Fruit wall',side:'r',k:'s',p:()=>H.fruitAt(V3(fc.x+.36,fc.y+.38,0)),show:V=>V.fruit>.5},
      {t:'Seeds',side:'r',k:'s',p:()=>H.fruitAt(fc.clone().add(sd.clone().multiplyScalar(.45))),show:V=>V.fruit>.5},
      {t:'Primary root',side:'l',k:'r',p:()=>an.tap.clone(),show:V=>V.root>.5},
      {t:'Lateral roots',side:'l',k:'r',p:()=>an.lat.clone(),show:V=>V.root>.5},
      {t:'Root hairs',side:'r',k:'r',p:()=>an.hair.clone(),show:V=>V.root>.5},
      {t:'Root cap',side:'r',k:'r',p:()=>an.cap.clone(),show:V=>V.root>.5},
      {t:'Seed',side:'r',k:null,p:()=>V3(0,-.3,0),show:V=>V.seed>.3},
      {t:'New plant',side:'r',k:null,p:()=>H.sproutPt(),show:V=>V.sprout>.6},
      {t:'Bee',side:'r',k:null,p:()=>H.beePt(),show:V=>V.bee>.5},
      {t:'Grass',side:'r',k:null,p:()=>V3(-3.8,.1,0),show:V=>true},
      {t:'Topsoil',side:'l',k:null,p:()=>V3(3.9,-.65,-2.1),show:V=>true},
      {t:'Subsoil',side:'l',k:null,p:()=>V3(3.9,-2.15,-2.1),show:V=>true},
      {t:'Weathered rock',side:'l',k:null,p:()=>V3(3.9,-3.65,-2.1),show:V=>true},
      {t:'Bedrock',side:'l',k:null,p:()=>V3(3.9,-4.7,-2.1),show:V=>true}];
    H.labs=defs.map(d=>{const el=document.createElement('div');el.className='lab '+d.side;el.textContent=d.t;el.hidden=true;$v[1].appendChild(el);return {el,d}});
    new ResizeObserver(fitH).observe($v[1]);
    bindH(renderer.domElement);
    $('#hlbl').onclick=$('#hlbl2').onclick=()=>{if(H.sel&&P[H.sel])openPart(H.sel)};
    $('#lblt').setAttribute('aria-pressed',String(labelsOn));
    return true;
  }catch(err){H=null;pvFail(err);return false}
}
function fitH(){if(!H)return;const w=$v[1].clientWidth,h=$v[1].clientHeight;if(!w||!h)return;
  H.renderer.setSize(w,h,false);H.camera.aspect=w/h;H.camera.updateProjectionMatrix();setCamH()}
function setCamH(){const a=H.camera.aspect,tf=Math.tan(H.camera.fov*Math.PI/360),d=Math.max(11.9/2/tf,9/2/(tf*a))*1.1;
  H.camera.position.set(0,0,d/H.zoom);H.camera.lookAt(0,0,0)}
function resetH(){H.rotX=0;H.rotY=0;H.zoom=1;setCamH()}
function startH(){if(!H.raf)loopH()}
function stopH(){if(H&&H.raf){cancelAnimationFrame(H.raf);H.raf=0}['#hlbl','#hlbl2'].forEach(s=>{const l=$(s);if(l)l.hidden=true});if(H){H.labs.forEach(l=>l.el.hidden=true);selectH(null);leaveMode()}}
function loopH(){H.raf=requestAnimationFrame(loopH);
  const now=performance.now(),dt=Math.min((now-H.last)/1000,.05);H.last=now;
  for(const k in H.V){const d=H.T[k]-H.V[k];H.V[k]=Math.abs(d)<.002?H.T[k]:H.V[k]+d*Math.min(1,dt*3.2)}
  H.apply(H.V,(now-H.t0)/1000);
  H.pivot.rotation.set(H.rotX,H.rotY,0);H.pivot.updateMatrixWorld(true);
  H.renderer.render(H.scene,H.camera);placeH()}
function glowH(id){Object.keys(H.parts).forEach(k=>{const on=k===id;H.parts[k].mats.forEach(m=>{if(!m.emissive)return;m.emissive.setHex(on?0x2f7d4a:0);m.emissiveIntensity=on?.7:1})})}
function selectH(id,pt,layer){
  if(!id){H.sel=null;H.selPt=null;glowH(null);return}
  H.sel=id;H.selPt=pt;H.selName=(id==='soil'&&layer)?layer:NAMEH(id);glowH(id)}
function placeH(){const w=$v[1].clientWidth,h=$v[1].clientHeight,V=H.V,o=H.group.position,placed=[];
  H.labs.forEach(l=>{const d=l.d;
    if(!labelsOn||!d.show(V)){l.el.hidden=true;return}
    const s=d.k==='s'?Math.max(V.shoot,.05):d.k==='r'?Math.max(V.root,.05):1,q=d.p().multiplyScalar(s).add(o),v=H.pivot.localToWorld(q);v.project(H.camera);
    const x=(v.x*.5+.5)*w,y=(-v.y*.5+.5)*h;
    l.el.hidden=false;l.w=l.el.offsetWidth;l.h=l.el.offsetHeight;
    const sides=[d.side,d.side==='r'?'l':'r'],offsets=[0,-18,18,-36,36,-54,54,-72,72,-90,90,-110,110];
    let best=null,score=Infinity;
    sides.forEach(side=>offsets.forEach(dy=>{
      const target=side==='r'?x+22:x-22-l.w,left=Math.max(4,Math.min(w-l.w-4,target));
      const cy=Math.max(l.h/2+4,Math.min(h-l.h/2-4,y+dy)),r={x0:left,x1:left+l.w,y0:cy-l.h/2,y1:cy+l.h/2};
      const overlaps=placed.filter(p=>r.x0<p.x1+3&&r.x1>p.x0-3&&r.y0<p.y1+2&&r.y1>p.y0-2).length;
      if(overlaps<score){score=overlaps;best={side,left,cy,r,edge:Math.abs(target-left)>1}}
      if(!overlaps){score=0;best={side,left,cy,r,edge:Math.abs(target-left)>1};return}
    }));
    if(score>0){l.el.hidden=true;return}
    const b=best;l.el.className='lab '+b.side+(b.edge?' edge':'');
    l.el.style.left=(b.edge?b.left:(b.side==='r'?b.left-22:b.left+l.w+22))+'px';l.el.style.top=b.cy+'px';
    placed.push(b.r)});
  const t=$('#hlbl');
  if(H.sel&&H.selPt&&labelsOn){const v=H.pivot.localToWorld(H.selPt.clone());v.project(H.camera);
    if(t._n!==H.selName){t._n=H.selName;t.firstChild.textContent=H.selName;t.lastChild.hidden=true}
    t.hidden=false;const half=t.offsetWidth/2;t.style.left=Math.max(half+4,Math.min(w-half-4,(v.x*.5+.5)*w))+'px';
    t.style.top=Math.max(t.offsetHeight*1.5+4,Math.min(h-4,(-v.y*.5+.5)*h))+'px'}
  else t.hidden=true}
function tapH(e){const cv=H.renderer.domElement,r=cv.getBoundingClientRect();
  H.ray.setFromCamera(new T.Vector2(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1),H.camera);
  const vis=o=>{while(o){if(o.visible===false)return false;o=o.parent}return true},list=[];
  Object.keys(H.parts).forEach(k=>H.parts[k].meshes.forEach(m=>{if(vis(m))list.push(m)}));H.hits.forEach(m=>{if(vis(m.parent))list.push(m)});
  let hit=H.ray.intersectObjects(list,false)[0];
  if(!hit)hit=H.ray.intersectObjects(H.soilHits,false)[0];
  if(!hit){selectH(null);return}
  const pid=hit.object.userData.pid;
  selectH(pid,H.pivot.worldToLocal(hit.point.clone()),hit.object.userData.layer);
  const org=ORG[pid]||pid;if(t3dOn&&P[org])openPart(org)}
function bindH(cv){
  cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);H.ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});H.down={x:e.clientX,y:e.clientY,t:performance.now(),moved:0}});
  cv.addEventListener('pointermove',e=>{const p=H.ptrs.get(e.pointerId);if(!p)return;
    const dx=e.clientX-p.x,dy=e.clientY-p.y;
    if(H.ptrs.size===2){const o=[...H.ptrs.entries()].find(([k])=>k!==e.pointerId)[1];
      const d0=Math.hypot(p.x-o.x,p.y-o.y),d1=Math.hypot(e.clientX-o.x,e.clientY-o.y),cx0=(p.x+o.x)/2,cy0=(p.y+o.y)/2,cx1=(e.clientX+o.x)/2,cy1=(e.clientY+o.y)/2;
      if(d0>0){const z0=H.zoom,u0=2*Math.tan(H.camera.fov*Math.PI/360)*H.camera.position.z/cv.clientHeight;H.zoom=Math.max(.5,Math.min(3,H.zoom*d1/d0));
        const u1=u0*z0/H.zoom;
        H.panX-=(cx1-cx0)*u1;H.panY+=(cy1-cy0)*u1;
        H.panX+=(cx0-cv.clientWidth/2)*(u0-u1);H.panY-=(cy0-cv.clientHeight/2)*(u0-u1)}setCamH()}
    else if(e.pointerType==='mouse'&&(e.shiftKey||e.buttons===2)){H.rotY+=dx*.008;H.rotX=Math.max(-1.5,Math.min(1.5,H.rotX+dy*.008))}
    else{const u=2*Math.tan(H.camera.fov*Math.PI/360)*H.camera.position.z/cv.clientHeight;H.panX-=dx*u;H.panY+=dy*u;setCamH()}
    if(H.down)H.down.moved+=Math.abs(dx)+Math.abs(dy);p.x=e.clientX;p.y=e.clientY});
  const up=e=>{H.ptrs.delete(e.pointerId);const d=H.down;
    if(d&&e.type==='pointerup'&&d.moved<8&&performance.now()-d.t<400&&H.ptrs.size===0)tapH(e);if(H.ptrs.size===0)H.down=null};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  cv.addEventListener('wheel',e=>{e.preventDefault();H.zoom=Math.max(.5,Math.min(3,H.zoom*(e.deltaY<0?1.1:.9)));setCamH()},{passive:false});
  cv.addEventListener('contextmenu',e=>e.preventDefault());
}
function applyFilter(){const f=FILT[st.filt||'all'];
  if(H&&H.ready)Object.keys(H.parts).forEach(k=>{const dim=!!f&&f.indexOf(k)<0;H.parts[k].mats.forEach(m=>{m.transparent=dim;m.opacity=dim?.2:1;m.depthWrite=!dim;m.needsUpdate=true})});
  if(H&&H.hair)H.hair.opacity=(f&&f.indexOf('root')<0)?.1:.8;
  document.querySelectorAll('#v1 .part').forEach(g=>g.classList.toggle('dim',!!f&&f.indexOf(g.dataset.part)<0))}
function refreshH(){if(!H)return;H.reg.forEach(([m,v])=>{const c=cssv(v);if(c)m.color.set(c)});if(H.refresh)H.refresh()}
if(window.matchMedia)try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',refreshH)}catch(e){}
new MutationObserver(refreshH).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
