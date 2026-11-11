
(function(){
  DIA.flower.spots.push(['anther','Anther (T.S.)'],['ovule','Ovule']);
  ['anther','pollen','ovule','embryo-sac','fertilisation'].forEach(k=>SCENE_PART[k]='flower');
  const D={'anther':[['pollen','🔍 Pollen grain','🔍 परागकण']],'pollen':[['anther','◀ Anther','◀ परागकोश']],
    'ovule':[['embryo-sac','🔍 Embryo sac','🔍 भ्रूणकोष']],'embryo-sac':[['fertilisation','▶ Fertilisation','▶ निषेचन'],['ovule','◀ Ovule','◀ बीजांड']],
    'fertilisation':[['embryo-sac','◀ Embryo sac','◀ भ्रूणकोष']]};
  PV.after('openScene',id=>{const d=D[id];if(!d)return;const n=$('#chips');
    d.slice().reverse().forEach(([to,en,hi])=>{const b=document.createElement('button');b.className='chip mode';b.textContent=PV.L(en,hi);b.dataset.id='__'+to;b.onclick=()=>openScene(to);n.insertBefore(b,n.firstChild)})});
})();
