
(function(){
  const L=PV.L,KEY='pv_progress';let D={seen:{},quiz:{best:0,total:0,attempts:0,last:0},bm:[]},scene=null;
  try{const j=JSON.parse(localStorage.getItem(KEY)||'null');if(j){D.seen=j.seen||{};D.quiz=Object.assign(D.quiz,j.quiz);D.bm=j.bm||[]}}catch(e){}
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(D))}catch(e){}},
    mark=k=>{if(!D.seen[k]){D.seen[k]=1;save()}},cnt=p=>Object.keys(D.seen).filter(k=>k.indexOf(p)===0).length;
  PV.progress={mark,quiz(score,total){const q=D.quiz;q.last=score;q.total=total;q.attempts++;q.best=Math.max(q.best,score);save()}};
  
  PV.after('selectH',()=>{if(H&&H.sel)mark('p:'+H.sel)});
  PV.after('openScene',id=>{scene=id;mark('sc:'+id)});
  PV.after('pick',()=>{if(sel&&scene)mark('sp:'+scene+':'+sel)});
  const on=(id,ev,f)=>{const e=document.getElementById(id);if(e)e.addEventListener(ev,f)};
  on('pv-tissue','click',e=>{const b=e.target.closest('[data-t]');if(b&&b.dataset.t)mark('t:'+b.dataset.t)});
  on('pv-health','click',e=>{const b=e.target.closest('[data-c]');if(b&&b.dataset.c)mark('h:'+b.dataset.c)});
  on('pv-seeddev','input',e=>{if(e.target.id==='pv-sds')mark('sd:'+e.target.value)});
  
  function star(){const el=document.getElementById('pv-info');if(!el||el.hidden||!H||!H.sel||el.querySelector('.pv-star'))return;
    const b=document.createElement('button');b.className='pv-star';b.dataset.bm=H.sel;b.setAttribute('aria-label','Bookmark');b.textContent=D.bm.indexOf(H.sel)<0?'☆':'★';el.insertBefore(b,el.firstChild)}
  on('pv-info','click',e=>{const b=e.target.closest('.pv-star');if(!b)return;const id=b.dataset.bm,k=D.bm.indexOf(id);if(k<0)D.bm.push(id);else D.bm.splice(k,1);save();b.textContent=k<0?'★':'☆'});
  ['selectH','show'].forEach(f=>PV.after(f,star));PV.onLang&&PV.onLang(star);
  
  const el=PV.ui.addPanel('pv-progress','');
  function build(){
    const hi=PV.lang&&PV.lang()==='hi',x=hi?1:0,pn=id=>PV.name?PV.name(id):id,q=D.quiz,
      R=[['3D plant parts','3D पौधे के भाग',cnt('p:'),Object.keys(PV_INFO).length],['Cross-section scenes','काट वाले दृश्य',cnt('sc:'),Object.keys(SC).length],
         ['Tissue cards','ऊतक कार्ड',cnt('t:'),Object.keys(PV_TISSUE).length+1],['Health cards','स्वास्थ्य कार्ड',cnt('h:'),Object.keys(PV_HEALTH).length],
         ['Water journey steps','पानी की यात्रा के चरण',cnt('tour:'),6],['Seed stages','बीज के चरण',cnt('sd:'),7],['Theory topics','सिद्धांत के विषय',cnt('th:'),PV.theory?PV.theory.count():0]].filter(r=>r[3]),
      all=Math.round(100*R.reduce((s,r)=>s+Math.min(1,r[2]/r[3]),0)/R.length),
      un=Object.keys(PV_INFO).filter(id=>!D.seen['p:'+id]&&H&&H.parts[id]),bm=D.bm.filter(id=>PV_INFO[id]);
    el.innerHTML=`<span class="pv-x" role="button" aria-label="Close">×</span><b>${L('My progress','मेरी प्रगति')}</b>
      <div class="pv-res">${L('Explored','अन्वेषित')}: ${all}%<div class="pv-bar"><i style="width:${all}%"></i></div></div>`
      +R.map(r=>`<div class="pv-res">${r[x]} <span class="pv-cnt">${Math.min(r[2],r[3])}/${r[3]}</span><div class="pv-bar"><i style="width:${Math.round(100*Math.min(1,r[2]/r[3]))}%"></i></div></div>`).join('')
      +`<div class="pv-res">${L('Quiz','क्विज़')}: ${q.attempts?`${L('best','सर्वश्रेष्ठ')} ${q.best}/${q.total} · ${L('last','पिछला')} ${q.last}/${q.total} · ${q.attempts}×`:L('not taken yet','अभी नहीं दिया')}</div>`
      +(un.length?`<p><u>${L('Not yet explored','अभी नहीं देखे')}</u></p><div class="pv-tags">${un.slice(0,12).map(id=>`<button data-p="${id}">${pn(id)}</button>`).join('')}</div>`:'')
      +(bm.length?`<p><u>★ ${L('Bookmarks','बुकमार्क')}</u></p><div class="pv-tags">${bm.map(id=>`<button data-p="${id}">${pn(id)}</button>`).join('')}</div>`:'')
      +`<p class="pv-note">${L('Seeing a part is not the same as understanding it. Use the Quiz to check. Progress is saved on this device only.','किसी भाग को देख लेना उसे समझ लेना नहीं है। जाँच के लिए क्विज़ दें। प्रगति केवल इसी उपकरण पर सहेजी जाती है।')}</p>
      <div class="pv-nav"><button data-reset="1">${L('Reset progress','प्रगति मिटाएँ')}</button></div>`}
  el.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.p){PV.sim.hideAll();PV.selectPart(b.dataset.p)}
    else if(b.dataset.reset&&window.confirm(L('Erase all progress and bookmarks?','सारी प्रगति और बुकमार्क मिटाएँ?'))){D={seen:{},quiz:{best:0,total:0,attempts:0,last:0},bm:[]};save();build()}});
  PV.sim.reg('progress',el,build);
  const name=()=>L('📊 My progress','📊 मेरी प्रगति');
  PV.after('homeChips',()=>{const b=document.createElement('button'),n=$('#chips');b.className='chip mode';b.dataset.id='__progress';b.textContent=name();b.onclick=()=>PV.sim.open('progress');n.insertBefore(b,n.firstChild)});
  PV.onLang&&PV.onLang(()=>{const b=document.querySelector('#chips [data-id="__progress"]');if(b)b.textContent=name()});
})();
