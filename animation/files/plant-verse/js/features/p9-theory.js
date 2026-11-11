
(function(){
  const L=PV.L,el=PV.ui.addPanel('pv-theory',''),mods=[];let mi=null,ti=null;
  PV.theory={add:m=>mods.push(m),count:()=>mods.reduce((s,m)=>s+m.t.length,0)};
  const LV=[['d','Definition','परिभाषा'],['s','Structure and identifying features','संरचना व पहचान'],['m','How it works','कार्यविधि'],['t','Types','प्रकार'],['e','Examples','उदाहरण'],['x','Experiment and use','प्रयोग व उपयोग'],['c','Compare and common mistakes','तुलना व आम भ्रांतियाँ']];
  const SCN={'root-cross':['Dicot root','द्विबीजपत्री जड़'],'root-mono':['Monocot root','एकबीजपत्री जड़'],'stem-dicot':['Dicot stem','द्विबीजपत्री तना'],'stem-mono':['Monocot stem','एकबीजपत्री तना'],'leaf-blade':['Dicot leaf','द्विबीजपत्री पत्ती'],'leaf-mono':['Monocot leaf','एकबीजपत्री पत्ती'],'flower-ovary':['Ovary','अंडाशय'],'seed':['Dicot seed','द्विबीजपत्री बीज'],'seed-mono':['Monocot seed','एकबीजपत्री बीज'],'fruit-cross':['Fruit','फल'],'stem-wood':['Woody stem','काष्ठीय तना'],'leaf-stomata':['Stomata','रंध्र'],'anther':['Anther','परागकोश'],'pollen':['Pollen grain','परागकण'],'ovule':['Ovule','बीजांड'],'embryo-sac':['Embryo sac','भ्रूणकोष'],'fertilisation':['Fertilisation','निषेचन'],'plant-cell':['Plant cell','पादप कोशिका']};
  el.innerHTML='<span class="pv-x" role="button" aria-label="Close">×</span><b></b><input id="pv-thq" type="search" autocomplete="off"><div id="pv-thb"></div>';
  const ttl=el.querySelector('b'),q=el.querySelector('#pv-thq'),body=el.querySelector('#pv-thb');
  const nav=a=>`<div class="pv-nav"><button data-a="${a}">◀ ${L('Back','वापस')}</button></div>`;
  function draw(){
    const hi=PV.lang&&PV.lang()==='hi',x=hi?1:0;ttl.textContent=L('Theory','सिद्धांत');q.placeholder=L('Search a topic…','विषय खोजें…');
    if(mi===null){q.hidden=false;const s=q.value.trim().toLowerCase();
      body.innerHTML=s?mods.map((m,a)=>m.t.map((t,b)=>({m,t,a,b}))).reduce((r,v)=>r.concat(v),[]).filter(o=>(o.t.n[0]+' '+o.t.n[1]).toLowerCase().indexOf(s)>=0).map(o=>`<button class="pv-opt" data-m="${o.a}" data-t="${o.b}">${o.t.n[x]} <span class="pv-sci">${o.m.n[x]}</span></button>`).join('')||'<p>—</p>'
        :mods.map((m,a)=>`<button class="pv-opt" data-m="${a}">${m.i} ${m.n[x]} <span class="pv-cnt">${m.t.length}</span></button>`).join('');return}
    q.hidden=true;const m=mods[mi];
    if(ti===null){body.innerHTML=nav('home')+`<b>${m.i} ${m.n[x]}</b>`+m.t.map((t,b)=>`<button class="pv-opt" data-t="${b}">${t.n[x]}</button>`).join('');return}
    const t=m.t[ti];
    body.innerHTML=nav('mod')+`<b>${t.n[x]}</b>`+(t.v?`<div class="pv-lf"><svg viewBox="${t.vb||'0 0 240 110'}" role="img" aria-label="${t.n[x]}">${t.v()}</svg></div>`:'')
      +(t.tb?`<table class="pv-tb"><tr>${t.tb.h.map(h=>`<th>${h[x]}</th>`).join('')}</tr>${t.tb.r.map(r=>`<tr>${r.map((c,k)=>k?`<td>${c[x]}</td>`:`<th>${c[x]}</th>`).join('')}</tr>`).join('')}</table>`:'')
      +LV.filter(l=>t.f&&t.f[l[0]]).map(l=>`<p><u>${hi?l[2]:l[1]}</u><br>${t.f[l[0]][x]}</p>`).join('')
      +(t.sc&&t.sc.length?`<div class="pv-nav">${t.sc.map(k=>`<button data-s="${k}">${L('3D: ','3D: ')}${(SCN[k]||[k,k])[x]} ▸</button>`).join('')}</div>`:'')}
  q.oninput=draw;
  el.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
    if(d.s){openScene(d.s);return}
    if(d.a){if(d.a==='home'){mi=null;ti=null}else ti=null;draw();return}
    if(d.m!==undefined)mi=+d.m;if(d.t!==undefined){ti=+d.t;PV.progress&&PV.progress.mark('th:'+mods[mi].id+':'+mods[mi].t[ti].id)}
    if(d.m!==undefined||d.t!==undefined)draw()});
  PV.sim.reg('theory',el,draw);
  const name=()=>L('📚 Theory','📚 सिद्धांत');
  PV.after('homeChips',()=>{const b=document.createElement('button'),n=$('#chips');b.className='chip mode';b.dataset.id='__theory';b.textContent=name();b.onclick=()=>{mi=null;ti=null;q.value='';PV.sim.open('theory')};n.insertBefore(b,n.firstChild)});
  PV.onLang&&PV.onLang(()=>{const b=document.querySelector('#chips [data-id="__theory"]');if(b)b.textContent=name()});
})();
