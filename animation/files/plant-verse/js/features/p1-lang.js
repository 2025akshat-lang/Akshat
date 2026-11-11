
(function(){
  let lang='en';try{lang=localStorage.getItem('pv_lang')||'en'}catch(e){}
  const cbs=[];
  PV.lang=()=>lang;PV.onLang=f=>cbs.push(f);
  PV.name=id=>{const d=PV_INFO[id];return lang==='hi'&&d?d.hi:NAMEH(id)};
  const b=PV.ui.addTopButton('',()=>{lang=lang==='en'?'hi':'en';try{localStorage.setItem('pv_lang',lang)}catch(e){}apply()});
  b.setAttribute('aria-label','Language: English / हिन्दी');
  function fixSel(){if(H&&H.sel&&H.sel!=='soil')H.selName=PV.name(H.sel)}
  function apply(){b.textContent=lang==='en'?'हिं':'EN';
    if(H&&H.labs){H.labs.forEach(l=>{l.el.textContent=lang==='hi'?(PV_LABHI[l.d.t]||l.d.t):l.d.t;l.w=0});fixSel()}
    cbs.forEach(f=>f(lang))}
  PV.after('openHome',apply);PV.after('selectH',fixSel);
})();
