
(function(){
  const ORGN={root:['Root','जड़'],stem:['Stem','तना'],leaf:['Leaf','पत्ती'],flower:['Flower','फूल'],fruit:['Fruit','फल'],seed:['Seed','बीज']};
  const LB={en:['Part of','Structure & location','Function'],hi:['किस अंग का भाग','संरचना व स्थान','कार्य']};
  const el=PV.ui.addPanel('pv-info','');el.classList.add('pv-r');
  el.onclick=e=>{if(e.target.classList.contains('pv-x'))el.hidden=true};
  function render(){
    const id=H&&H.sel,d=id&&PV_INFO[id];
    if(!d||st.lv!==1){el.hidden=true;return}
    const hi=PV.lang()==='hi',L=LB[PV.lang()],o=ORG[id]!==id&&ORGN[ORG[id]];
    el.innerHTML=`<span class="pv-x" role="button" aria-label="Close">×</span><b>${hi?d.hi:NAMEH(id)}</b><div class="pv-sci">${d.sci}</div>`
      +(o?`<p><u>${L[0]}</u> ${o[hi?1:0]}</p>`:'')+`<p><u>${L[1]}</u><br>${hi?d.ah:d.a}</p><p><u>${L[2]}</u><br>${hi?d.fh:d.f}</p>`;
    el.hidden=false}
  PV.after('selectH',render);PV.after('show',render);PV.onLang(render);
})();
