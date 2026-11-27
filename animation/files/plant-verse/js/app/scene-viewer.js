

let R=null,S=null,sel=null,rotX=0,rotY=0,zoom=1,panX=0,panY=0,auto=false;
function init3(){
  if(R)return true;
  try{
    const renderer=new T.WebGLRenderer({antialias:true,alpha:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,window.innerWidth<=800?1.5:2));
    $v[3].insertBefore(renderer.domElement,$('#lbl'));
    const scene=new T.Scene(),camera=new T.PerspectiveCamera(38,1,.1,100),pivot=new T.Group();
    pivot.rotation.order='YXZ';scene.add(pivot);
    scene.add(new T.AmbientLight(0xffffff,.75));
    const d1=new T.DirectionalLight(0xffffff,.95);d1.position.set(2,3,5);scene.add(d1);
    const d2=new T.DirectionalLight(0x9fd8ff,.35);d2.position.set(-4,-1,-3);scene.add(d2);
    R={renderer,scene,camera,pivot,clock:new T.Clock(),raf:0,ray:new T.Raycaster(),ptrs:new Map(),down:null};
    if(window.ResizeObserver)new ResizeObserver(fit).observe($v[3]);else window.addEventListener('resize',fit);
    bind3(renderer.domElement);
    renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();show(2);sceneFallback()});
    return true;
  }catch(err){console.warn('[Plantverse] Scene WebGL unavailable:',err);return false}
}
function sceneFallback(){
  let note=$('#pv-scene-fallback');
  if(!note){note=document.createElement('p');note.id='pv-scene-fallback';note.className='scene-fallback';note.setAttribute('role','status');$v[2].prepend(note)}
  note.textContent='3D is unavailable on this device. Use the labeled anatomical diagram and part buttons instead.';
}
function fit(){if(!R)return;const w=$v[3].clientWidth,h=$v[3].clientHeight;if(!w||!h)return;
  R.renderer.setSize(w,h,false);R.camera.aspect=w/h;R.camera.updateProjectionMatrix();setCam()}
function setCam(){if(!S)return;const a=R.camera.aspect,base=S.cam*(a<1?1.25/Math.max(a,.62)*.8+.2:1);panX=Math.max(-4.5,Math.min(4.5,panX));panY=Math.max(-4.5,Math.min(4.5,panY));R.camera.position.set(panX,panY,base/zoom);R.camera.lookAt(panX,panY,0)}
function resetView(){rotX=0;rotY=0;zoom=1;panX=0;panY=0;setCam()}
function openScene(id){
  const pid=SCENE_PART[id];st.part=pid;st.scene=id;show(3);
  if(!init3()){show(2);sceneFallback();return}
  if(S){R.pivot.remove(S.group);S.group.traverse(o=>{if(o.geometry)o.geometry.dispose()})}
  S=SC[id]();R.pivot.add(S.group);sel=null;resetView();
  const spot=DIA[pid].spots.find(s=>s[0]===id);
  head('PLANT / '+P[pid].name.toUpperCase()+' / '+(spot?spot[1]:'').toUpperCase(),S.title,S.sub);
  card('Tap a part','Drag to pan, shift-drag to rotate, pinch to zoom. Part names are in the chips below.');
  chips(S.parts.map(p=>[p.id,p.name]),pick,null);
  fit();stop3();R.clock.start();loop();
}
function stop3(){if(R&&R.raf){cancelAnimationFrame(R.raf);R.raf=0}}
function loop(){R.raf=requestAnimationFrame(loop);
  const t=R.clock.getElapsedTime(),dt=Math.min(R.clock.getDelta(),.05);
  if(auto)rotY+=.006;
  R.pivot.rotation.set(rotX,rotY,0);
  if(S.tick)S.tick(t);
  R.pivot.updateMatrixWorld(true);
  R.renderer.render(R.scene,R.camera);
  placeLabel();
}
function anchorOf(p){
  if(p.anchor)return new T.Vector3(p.anchor[0],p.anchor[1],p.anchor[2]);
  const b=new T.Box3();p.meshes.forEach(m=>b.expandByObject(m));const c=b.getCenter(new T.Vector3());return S.group.worldToLocal(c)}
function placeLabel(){const l=$('#lbl');if(!sel||!labelsOn){l.hidden=true;return}
  const p=S.byId[sel],v=anchorOf(p);S.group.localToWorld(v);v.project(R.camera);
  const w=$v[3].clientWidth,h=$v[3].clientHeight;
  l.hidden=false;l.textContent=p.name;
  const half=l.offsetWidth/2,x=Math.max(half+4,Math.min(w-half-4,(v.x*.5+.5)*w)),y=Math.max(l.offsetHeight*1.5+4,Math.min(h-4,(-v.y*.5+.5)*h));
  l.style.left=x+'px';l.style.top=y+'px'}
function pick(id){
  sel=sel===id?null:id;pressChip(sel);
  S.parts.forEach(p=>p.mats.forEach(m=>{if(m.emissive){const on=p.id===sel||(sel&&S.byId[sel].members&&S.byId[sel].members.indexOf(p.id)>=0);m.userData.e0=m.userData.e0||m.emissive.getHex();m.emissive.setHex(on?0x2f7d4a:m.userData.e0);m.emissiveIntensity=on?.9:(m.userData.i0===undefined?m.emissiveIntensity:m.userData.i0)}}));
  if(sel){const p=S.byId[sel];card(p.name,p.desc)}else card('Tap a part','Drag to pan, shift-drag to rotate, pinch to zoom.')}
function bind3(cv){
  cv.style.touchAction='none';
  cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);R.ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});R.down={x:e.clientX,y:e.clientY,t:performance.now(),moved:0}});
  cv.addEventListener('pointermove',e=>{const p=R.ptrs.get(e.pointerId);if(!p)return;
    const dx=e.clientX-p.x,dy=e.clientY-p.y;
    if(R.ptrs.size===2){const o=[...R.ptrs.entries()].find(([k])=>k!==e.pointerId)[1];
      const d0=Math.hypot(p.x-o.x,p.y-o.y),d1=Math.hypot(e.clientX-o.x,e.clientY-o.y),cx0=(p.x+o.x)/2,cy0=(p.y+o.y)/2,cx1=(e.clientX+o.x)/2,cy1=(e.clientY+o.y)/2;
      if(d0>0){const base=S.cam*(R.camera.aspect<1?1.25/Math.max(R.camera.aspect,.62)*.8+.2:1),u0=2*Math.tan(R.camera.fov*Math.PI/360)*base/zoom/cv.clientHeight;
        zoom=Math.max(.5,Math.min(3,zoom*d1/d0));const u1=2*Math.tan(R.camera.fov*Math.PI/360)*base/zoom/cv.clientHeight;
        panX-=(cx1-cx0)*u1;panY+=(cy1-cy0)*u1;panX+=(cx0-cv.clientWidth/2)*(u0-u1);panY-=(cy0-cv.clientHeight/2)*(u0-u1)}setCam()}
    else if(e.pointerType==='mouse'&&(e.shiftKey||e.buttons===2)){rotY+=dx*.008;rotX=Math.max(-1.5,Math.min(1.5,rotX+dy*.008))}
    else{const base=S.cam*(R.camera.aspect<1?1.25/Math.max(R.camera.aspect,.62)*.8+.2:1),u=2*Math.tan(R.camera.fov*Math.PI/360)*base/zoom/cv.clientHeight;panX-=dx*u;panY+=dy*u;setCam()}
    if(R.down)R.down.moved+=Math.abs(dx)+Math.abs(dy);p.x=e.clientX;p.y=e.clientY});
  const up=e=>{R.ptrs.delete(e.pointerId);const d=R.down;
    if(d&&e.type==='pointerup'&&d.moved<8&&performance.now()-d.t<400&&R.ptrs.size===0)tap(e);if(R.ptrs.size===0)R.down=null};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  cv.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(.5,Math.min(3,zoom*(e.deltaY<0?1.1:.9)));setCam()},{passive:false});
  cv.addEventListener('contextmenu',e=>e.preventDefault());
}
function tap(e){const r=R.renderer.domElement.getBoundingClientRect();
  R.ray.setFromCamera(new T.Vector2(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1),R.camera);
  const all=[];S.parts.forEach(p=>p.meshes.forEach(m=>all.push(m)));
  const hit=R.ray.intersectObjects(all,false)[0];
  if(hit&&hit.object.userData.pid)pick(hit.object.userData.pid)}
