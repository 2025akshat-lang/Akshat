
(function(){
  PV.L=PV.L||((e,h)=>(PV.lang&&PV.lang()==='hi')?h:e);
  const panels={};
  PV.sim={panels,
    reg(name,el,build){el.classList.add('pv-sim');el.onclick=e=>{if(e.target.classList.contains('pv-x'))el.hidden=true};panels[name]={el,build}},
    open(name){Object.keys(panels).forEach(k=>panels[k].el.hidden=true);const p=panels[name];p.build();p.el.hidden=false},
    hideAll(){Object.keys(panels).forEach(k=>panels[k].el.hidden=true)}};
  
  PV.selectPart=id=>{if(!H||!H.parts[id]||!H.parts[id].meshes.length)return;
    try{const b=new T.Box3();H.parts[id].meshes.forEach(m=>b.expandByObject(m));selectH(id,H.pivot.worldToLocal(b.getCenter(new T.Vector3())))}catch(e){console.error(e)}};
  const items=[['env','🌦 Environment','🌦 पर्यावरण'],['tour','💧 Water journey','💧 पानी की यात्रा'],['quiz','❓ Quiz','❓ क्विज़']];
  function addChips(){const n=$('#chips');items.slice().reverse().forEach(([k,en,hi])=>{const b=document.createElement('button');b.className='chip mode';b.dataset.id='__'+k;b.textContent=PV.L(en,hi);b.onclick=()=>PV.sim.open(k);n.insertBefore(b,n.firstChild)})}
  PV.after('homeChips',addChips);
  PV.after('show',n=>{if(n!==1)PV.sim.hideAll()});
  PV.onLang&&PV.onLang(()=>{if(st.lv===1&&!st.mode){const n=$('#chips');n.querySelectorAll('.chip.mode').forEach(b=>{const it=items.find(i=>'__'+i[0]===b.dataset.id);if(it)b.textContent=PV.L(it[1],it[2])});
    Object.keys(panels).forEach(k=>{if(!panels[k].el.hidden)panels[k].build()})}});
})();
