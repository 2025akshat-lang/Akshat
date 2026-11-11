
(function(){
  const L=PV.L,KEY='pv_a11y',root=document.documentElement;let o={rm:false,big:false,hc:false};
  try{const j=localStorage.getItem(KEY);if(j)Object.assign(o,JSON.parse(j));else if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)o.rm=true}catch(e){}
  PV.rm=()=>o.rm;
  const live=document.createElement('div');live.id='pv-live';live.className='pv-sr';live.setAttribute('aria-live','polite');document.body.appendChild(live);
  const say=t=>{live.textContent='';setTimeout(()=>{live.textContent=t},30)};
  function apply(){['rm','big','hc'].forEach(k=>root.classList.toggle('pv-'+k,!!o[k]));try{localStorage.setItem(KEY,JSON.stringify(o))}catch(e){}
    if(o.rm){try{auto=false}catch(e){}if(H&&H.auto)H.auto=false;if(typeof S!=='undefined'&&S)S.tick=null}}
  
  function freeze(){if(!H||H._a11y)return;H._a11y=1;const f=H.apply;H.apply=function(V,t){return f.call(this,V,o.rm?0:t)}}
  PV.after('initH',freeze);PV.after('openHome',freeze);
  
  const el=PV.ui.addPanel('pv-a11y',''),tx=PV.ui.addPanel('pv-textalt','');tx.classList.add('pv-sim');tx.setAttribute('role','region');
  PV.sim.reg('a11y',el,build);PV.sim.reg('textalt',tx,buildText);
  const hb=PV.ui.addTopButton('♿',()=>{el.hidden||tx.hidden?(PV.sim.open('a11y')):PV.sim.hideAll()});hb.setAttribute('aria-label','Accessibility settings');hb.title='Accessibility (?)';
  const SW=[['rm','Reduce motion','गति कम करें'],['big','Large buttons and text (smart board)','बड़े बटन व अक्षर (स्मार्ट बोर्ड)'],['hc','High contrast','उच्च कंट्रास्ट']];
  function build(){const hi=PV.lang&&PV.lang()==='hi';
    el.innerHTML=`<span class="pv-x" role="button" tabindex="0" aria-label="Close">×</span><b>${L('Accessibility','सुगम्यता')}</b>`
      +SW.map(s=>`<label class="pv-row"><input type="checkbox" data-o="${s[0]}" ${o[s[0]]?'checked':''}> ${hi?s[2]:s[1]}</label>`).join('')
      +`<div class="pv-nav"><button data-t="1">${L('Text version of this screen','इस स्क्रीन का पाठ संस्करण')}</button></div>
      <p><u>${L('Keyboard','कीबोर्ड')}</u><br>${L('Arrow keys rotate. + and − zoom. 0 resets. [ and ] step through plant parts. Esc closes panels or goes back. ? opens this panel. Tab moves between buttons.','तीर वाली कुंजियाँ घुमाती हैं। + और − ज़ूम करती हैं। 0 रीसेट करता है। [ और ] पौधे के भागों में आगे-पीछे ले जाती हैं। Esc पैनल बंद करता है या पीछे जाता है। ? यह पैनल खोलता है। Tab बटनों के बीच जाता है।')}</p>
      <p class="pv-note">${L('Names and descriptions never depend on colour alone. Settings are saved on this device.','नाम और विवरण केवल रंग पर निर्भर नहीं हैं। सेटिंग इसी उपकरण पर सहेजी जाती हैं।')}</p>`}
  el.addEventListener('change',e=>{const k=e.target.dataset.o;if(k){o[k]=e.target.checked;apply()}});
  el.addEventListener('click',e=>{if(e.target.closest('[data-t]'))PV.sim.open('textalt')});
  
  function buildText(){const hi=PV.lang&&PV.lang()==='hi',x=hi?1:0;let h='',t='';
    if(st.lv===1&&H){t=L('Whole plant: parts','पूरा पौधा: भाग');
      h=Object.keys(PV_INFO).filter(id=>H.parts[id]).map(id=>{const d=PV_INFO[id];return `<h4>${PV.name(id)}</h4><p>${d.sci}. ${x?d.ah:d.a} ${x?d.fh:d.f}</p>`}).join('')}
    else if(st.lv===3&&S){t=S.title;h=(S.note?`<p>${S.note}</p>`:'')+S.parts.map(p=>`<h4>${p.name}</h4><p>${p.desc||''}</p>`).join('')}
    else if(st.lv===2){const d=DIA[st.part];t=(P[st.part]&&P[st.part].name)||st.part;h=d?'<p>'+d.spots.map(s=>s[1]).join(', ')+'</p>':''}
    tx.innerHTML=`<span class="pv-x" role="button" tabindex="0" aria-label="Close">×</span><h3 style="margin:0">${t}</h3>${h||`<p>${L('Open a plant part first.','पहले पौधे का कोई भाग खोलें।')}</p>`}`}
  
  PV.after('selectH',()=>{if(H&&H.sel&&PV_INFO[H.sel]){const d=PV_INFO[H.sel],hi=PV.lang&&PV.lang()==='hi';say(PV.name(H.sel)+'. '+(hi?d.fh:d.f))}});
  PV.after('pick',()=>{if(S&&sel&&S.byId[sel])say(S.byId[sel].name+'. '+(S.byId[sel].desc||''))});
  PV.after('openScene',()=>{if(S)say(S.title);if(o.rm&&S)S.tick=null;focusable(R&&R.domElement,S&&S.title)});
  PV.after('openHome',()=>{focusable(H&&H.renderer&&H.renderer.domElement,L('3D plant','3D पौधा'))});
  function focusable(c,label){if(!c)return;c.tabIndex=0;c.setAttribute('role','application');c.setAttribute('aria-label',(label||'3D')+'. '+L('Arrow keys rotate, plus and minus zoom.','तीर कुंजियाँ घुमाती हैं, + और − ज़ूम करती हैं।'))}
  
  const parts=()=>Object.keys(PV_INFO).filter(id=>H&&H.parts[id]&&H.parts[id].meshes.length);
  document.addEventListener('keydown',e=>{
    if(e.ctrlKey||e.metaKey||e.altKey)return;const tg=e.target&&e.target.tagName;if(tg==='INPUT'||tg==='TEXTAREA'||tg==='SELECT')return;const k=e.key;
    if(k==='?'){PV.sim.panels.a11y.el.hidden?PV.sim.open('a11y'):PV.sim.hideAll();e.preventDefault();return}
    if(k==='Escape'){const open=Object.keys(PV.sim.panels).some(n=>!PV.sim.panels[n].el.hidden);if(open)PV.sim.hideAll();else if(st.lv>1){const c=document.getElementById('close');if(c&&!c.hidden)c.click()}return}
    if((tg==='BUTTON'||tg==='A')&&k!=='[' && k!==']')return;
    const l1=st.lv===1&&H,l3=st.lv===3&&S,d={ArrowLeft:[-.15,0],ArrowRight:[.15,0],ArrowUp:[0,-.1],ArrowDown:[0,.1]}[k];
    if(d&&(l1||l3)){if(l1){H.rotY+=d[0];H.rotX=Math.max(-1.2,Math.min(1.2,H.rotX+d[1]))}else{rotY+=d[0];rotX=Math.max(-1.2,Math.min(1.2,rotX+d[1]))}e.preventDefault();return}
    if(k==='+'||k==='='){zoomBy(1.2);return}if(k==='-'||k==='_'){zoomBy(1/1.2);return}
    if(k==='0'){if(l1)resetH();else if(l3)resetView();return}
    if(l1&&(k==='['||k===']')){const a=parts();if(!a.length)return;let i=a.indexOf(H.sel);i=k===']'?(i+1)%a.length:(i<=0?a.length-1:i-1);PV.selectPart(a[i]);e.preventDefault()}});
  apply();
})();
