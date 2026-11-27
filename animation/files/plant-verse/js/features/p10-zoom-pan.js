(function(){
  const cl=(x,a,b)=>Math.max(a,Math.min(b,x)),tfov=()=>Math.tan(H.camera.fov*Math.PI/360),
    dist=()=>Math.max(11.9/2/tfov(),9/2/(tfov()*H.camera.aspect))*1.1;
  window.setCamH=function(){
    const z=H.zoom,mx=Math.max(1.8,4.5-4.5/z),my=Math.max(2.2,6.6-6.6/z);
    H.panX=cl(H.panX||0,-mx,mx);H.panY=cl(H.panY||0,-my,my);
    H.camera.position.set(H.panX,H.panY,dist()/z);H.camera.lookAt(H.panX,H.panY,0);
  };
  PV.after('resetH',()=>{H.panX=0;H.panY=0;setCamH()});

  const F=[['Roots','जड़ें','↓',2,-3.2],['Shoot','तना व फूल','↑',2,2.6],['Whole','पूरा पौधा','⇅',1,0]];let k=-1,raf=0;
  const b=PV.ui.addTool({id:'pv-focus',label:'Focus: roots / shoot / whole',html:'⇅',onClick:()=>{
    if(!H||st.lv!==1)return;k=(k+1)%3;const f=F[k];b.textContent=f[2];b.title=PV.L(f[0],f[1]);go(f[3],f[4])}});
  function go(z,y){
    cancelAnimationFrame(raf);
    if(PV.rm&&PV.rm()){H.zoom=z;H.panX=0;H.panY=y;setCamH();return}
    const t0=performance.now(),z0=H.zoom,x0=H.panX||0,y0=H.panY||0;
    (function s(now){const t=Math.min(1,(now-t0)/450),e=t*t*(3-2*t);H.zoom=z0+(z-z0)*e;H.panX=x0*(1-e);H.panY=y0*(1-e)+y*e;setCamH();if(t<1)raf=requestAnimationFrame(s)})(t0);
  }
  PV.after('show',n=>{b.hidden=n!==1});
})();
