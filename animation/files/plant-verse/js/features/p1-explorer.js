
(function(){
  const G=[['Root','जड़',['taproot','lateral','rcap','rhair']],['Stem','तना',['internode','node','branch','abud','axbud','fbud','trich']],
    ['Leaf','पत्ती',['blade','vein','petiole','lbase','stipule']],['Flower','फूल',['petal','sepal','stamen','carpel']],
    ['Fruit & seed','फल व बीज',['pericarp','flesh','fseed','calyx','pedicel','seed']]];
  const el=PV.ui.addPanel('pv-explorer','<input id="pv-q" type="search" autocomplete="off"><div id="pv-list"></div>');
  const q=el.querySelector('#pv-q'),list=el.querySelector('#pv-list');
  const has=id=>H&&H.parts[id]&&H.parts[id].meshes.length;
  function draw(){const s=q.value.trim().toLowerCase(),hi=PV.lang()==='hi';q.placeholder=hi?'भाग खोजें…':'Search a part…';
    list.innerHTML=G.map(g=>{const it=g[2].filter(has).filter(id=>!s||(NAMEH(id)+' '+PV_INFO[id].hi+' '+PV_INFO[id].sci).toLowerCase().includes(s));
      return it.length?`<h4>${hi?g[1]:g[0]}</h4>`+it.map(id=>`<button data-id="${id}">${PV.name(id)}</button>`).join(''):''}).join('')||'<p>—</p>'}
  q.oninput=draw;PV.onLang(()=>{if(!el.hidden)draw()});
  list.onclick=e=>{const b=e.target.closest('button');if(!b||!H)return;const id=b.dataset.id;
    try{const bx=new T.Box3();H.parts[id].meshes.forEach(m=>bx.expandByObject(m));selectH(id,H.pivot.worldToLocal(bx.getCenter(new T.Vector3())))}catch(err){console.error(err)}
    el.hidden=true};
  const btn=PV.ui.addTopButton('☰',()=>{if(!H||st.lv!==1)return;el.hidden=!el.hidden;if(!el.hidden){q.value='';draw()}});
  btn.setAttribute('aria-label','Plant Explorer');
  PV.after('show',n=>{if(n!==1)el.hidden=true;btn.hidden=n!==1});
})();
