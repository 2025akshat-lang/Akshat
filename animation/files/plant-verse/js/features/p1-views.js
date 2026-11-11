
(function(){
  const V=[['Front',0,0,'F'],['Side',0,Math.PI/2,'S'],['Top',Math.PI/2-.05,0,'T']];let i=-1,raf=0;
  const b=PV.ui.addTool({id:'pv-view',label:'Camera view: front / side / top',html:'F',onClick:()=>{
    if(!H||st.lv!==1)return;i=(i+1)%3;const v=V[i];b.textContent=v[3];b.title=v[0];go(v[1],v[2])}});
  function go(x,y){cancelAnimationFrame(raf);if(PV.rm&&PV.rm()){H.rotX=x;H.rotY=y;return}const t0=performance.now(),x0=H.rotX,y0=H.rotY,dy=Math.atan2(Math.sin(y-y0),Math.cos(y-y0));
    (function s(now){const k=Math.min(1,(now-t0)/450),e=k*k*(3-2*k);H.rotX=x0+(x-x0)*e;H.rotY=y0+dy*e;if(k<1)raf=requestAnimationFrame(s)})(t0)}
  PV.after('show',n=>{b.hidden=n!==1});
})();
