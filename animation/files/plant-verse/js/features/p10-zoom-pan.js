
(function(){
  const cl=(x,a,b)=>Math.max(a,Math.min(b,x)),tfov=()=>Math.tan(H.camera.fov*Math.PI/360),
    dist=()=>Math.max(11.9/2/tfov(),9/2/(tfov()*H.camera.aspect))*1.1,U=(z,h)=>2*tfov()*(dist()/z)/h; 
  
  window.setCamH=function(){const z=H.zoom,mx=Math.max(0,4.5-4.5/z),my=Math.max(0,6.6-6.6/z);
    H.panX=cl(H.panX||0,-mx,mx);H.panY=cl(H.panY||0,-my,my);
    H.camera.position.set(H.panX,H.panY,dist()/z);H.camera.lookAt(H.panX,H.panY,0)};
  PV.after('resetH',()=>{H.panX=0;H.panY=0;setCamH()});
  function attach(){if(!H||H._pz)return;H._pz=1;const cv=H.renderer.domElement,pts=new Map();let lz=H.zoom,lc=null;
    const comp=(cx,cy)=>{if(H.zoom===lz)return;const r=cv.getBoundingClientRect(),d=U(lz,r.height)-U(H.zoom,r.height);
      H.panX=(H.panX||0)+(cx-r.left-r.width/2)*d;H.panY=(H.panY||0)-(cy-r.top-r.height/2)*d;lz=H.zoom;setCamH()};
    cv.addEventListener('pointerdown',e=>{pts.set(e.pointerId,[e.clientX,e.clientY]);lz=H.zoom;lc=null},true);
    cv.addEventListener('pointermove',()=>{lz=H.zoom},true);               
    cv.addEventListener('pointermove',e=>{const p=pts.get(e.pointerId);if(!p)return;pts.set(e.pointerId,[e.clientX,e.clientY]);const r=cv.getBoundingClientRect();
      if(pts.size===2){const q=[...pts.values()],cx=(q[0][0]+q[1][0])/2,cy=(q[0][1]+q[1][1])/2;comp(cx,cy);
        if(lc){const u=U(H.zoom,r.height);H.panX-=(cx-lc[0])*u;H.panY+=(cy-lc[1])*u;setCamH()}lc=[cx,cy]}
      else if(e.pointerType==='mouse'&&((e.buttons&2)||e.shiftKey)){const dx=e.clientX-p[0],dy=e.clientY-p[1],u=U(H.zoom,r.height);
        H.rotY-=dx*.008;H.rotX-=dy*.008;H.panX-=dx*u;H.panY+=dy*u;setCamH()}});   
    const end=e=>{pts.delete(e.pointerId);lc=null;lz=H.zoom};cv.addEventListener('pointerup',end);cv.addEventListener('pointercancel',end);
    cv.addEventListener('wheel',()=>{lz=H.zoom},{capture:true,passive:true});cv.addEventListener('wheel',e=>comp(e.clientX,e.clientY),{passive:true});
    cv.addEventListener('contextmenu',e=>e.preventDefault())}
  PV.after('initH',attach);PV.after('openHome',attach);
  
  const F=[['Roots','जड़ें','↓',2,-3.2],['Shoot','तना व फूल','↑',2,2.6],['Whole','पूरा पौधा','⇅',1,0]];let k=-1,raf=0;
  const b=PV.ui.addTool({id:'pv-focus',label:'Focus: roots / shoot / whole',html:'⇅',onClick:()=>{if(!H||st.lv!==1)return;k=(k+1)%3;const f=F[k];b.textContent=f[2];b.title=PV.L(f[0],f[1]);go(f[3],f[4])}});
  function go(z,y){cancelAnimationFrame(raf);const t0=performance.now(),z0=H.zoom,x0=H.panX||0,y0=H.panY||0;
    (function s(now){const t=Math.min(1,(now-t0)/450),e=t*t*(3-2*t);H.zoom=z0+(z-z0)*e;H.panX=x0*(1-e);H.panY=y0+(y-y0)*e;setCamH();if(t<1)raf=requestAnimationFrame(s)})(t0)}
  PV.after('show',n=>{b.hidden=n!==1});
})();
