
(function(){
  PV.L=(e,h)=>(PV.lang&&PV.lang()==='hi')?h:e;
  const el=PV.ui.addPanel('pv-s3','');el.classList.add('pv-b');
  function render(){
    if(st.lv!==3||!S){el.hidden=true;return}
    const p=sel&&S.byId[sel];
    if(p&&p.desc)el.innerHTML=`<b>${p.name}</b><p>${p.desc}</p>`;
    else if(S.note)el.innerHTML=`<p>${S.note}</p>`;
    else{el.hidden=true;return}
    el.hidden=false}
  PV.after('pick',render);PV.after('openScene',render);PV.after('show',render);
  
  const D={'plant-cell':[['chloroplast','🔍 Chloroplast','🔍 हरितलवक'],['mitochondrion','🔍 Mitochondrion','🔍 माइटोकॉन्ड्रिया']],
           'chloroplast':[['plant-cell','◀ Plant cell','◀ पादप कोशिका']],'mitochondrion':[['plant-cell','◀ Plant cell','◀ पादप कोशिका']]};
  PV.after('openScene',id=>{const d=D[id];if(!d)return;const n=$('#chips');
    d.slice().reverse().forEach(([to,en,hi])=>{const b=document.createElement('button');b.className='chip mode';b.textContent=PV.L(en,hi);b.dataset.id='__'+to;b.onclick=()=>openScene(to);n.insertBefore(b,n.firstChild)})});
})();
