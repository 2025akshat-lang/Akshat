
(function(){
  const L=PV.L,el=PV.ui.addPanel('pv-seeddev','');let i=0;
  const dots=(a,c)=>a.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="2.2" fill="#fff59d" stroke="${c||'#fbc02d'}" stroke-width=".6"/>`).join(''),
    C=(x,y,r,f)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${f}"/>`,E=(x,y,rx,ry,f,rot)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}"${rot?` transform="rotate(${rot} ${x} ${y})"`:''}/>`,
    LN=(a,b,c,d,w,col)=>`<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`,
    base=(coat,fill)=>`<ellipse cx="80" cy="62" rx="36" ry="44" fill="${fill||'#c8e6c9'}" stroke="${coat}" stroke-width="${coat==='#6d4c41'?4:2}"/>`+(fill?'':`<ellipse cx="80" cy="62" rx="26" ry="36" fill="#f8bbd0" opacity=".55"/>`),
    SC=[[62,50],[98,52],[70,78],[90,80],[80,92],[58,68],[102,68]];
  
  const ST=[
   {n:['Fertilised ovule','निषेचित बीजांड'],c:['Double fertilisation is complete. The zygote (2n) will become the embryo; the endosperm nucleus (3n) starts dividing.','दोहरा निषेचन पूर्ण। युग्मनज (2n) भ्रूण बनेगा; भ्रूणपोष केंद्रक (3n) विभाजित होने लगता है।'],
    d:()=>base('#66bb6a')+C(80,34,5,'#2e7d32')+C(80,66,6,'#6a1b9a'),lab:[[85,34,'Zygote (2n)','युग्मनज (2n)'],[86,66,'Endosperm nucleus (3n)','भ्रूणपोष केंद्रक (3n)']]},
   {n:['Globular embryo','गोलाकार भ्रूण'],c:['The zygote divides. A suspensor pushes a ball of cells into the embryo sac while endosperm nuclei divide freely.','युग्मनज विभाजित होता है। निलंबक कोशिकाओं की गेंद को भ्रूणकोष में धकेलता है और भ्रूणपोष के केंद्रक मुक्त रूप से विभाजित होते हैं।'],
    d:()=>base('#66bb6a')+LN(80,18,80,31,2,'#2e7d32')+C(80,39,8,'#7cb342')+C(77,37,2,'#c5e1a5')+C(83,41,2,'#c5e1a5')+dots(SC),lab:[[88,39,'Embryo','भ्रूण'],[82,24,'Suspensor','निलंबक'],[98,52,'Free endosperm nuclei','मुक्त भ्रूणपोष केंद्रक']]},
   {n:['Heart stage','हृदयाकार अवस्था'],c:['The two cotyledons begin to form, so the embryo looks heart-shaped.','दो बीजपत्र बनने लगते हैं, इसलिए भ्रूण दिल के आकार का दिखता है।'],
    d:()=>base('#66bb6a')+LN(80,18,80,34,2,'#2e7d32')+C(73,43,7,'#7cb342')+C(87,43,7,'#7cb342')+`<polygon points="66,46 94,46 80,64" fill="#7cb342"/>`+dots(SC.concat([[66,86],[94,88],[50,56],[110,58],[80,78]])),lab:[[92,46,'Heart-shaped embryo','हृदयाकार भ्रूण']]},
   {n:['Mature embryo','परिपक्व भ्रूण'],c:['Radicle, hypocotyl, plumule and cotyledons are formed. In many dicots (such as bean) the endosperm is used up and food is stored in the cotyledons.','मूलांकुर, अधोबीजपत्राक्ष, प्रांकुर और बीजपत्र बन जाते हैं। कई द्विबीजपत्रियों (जैसे सेम) में भ्रूणपोष खप जाता है और भोजन बीजपत्रों में जमा होता है।'],
    d:()=>base('#66bb6a')+`<rect x="77" y="26" width="6" height="34" rx="3" fill="#7cb342"/>`+C(80,25,4,'#ffe0b2')+E(66,76,8,24,'#aed581',12)+E(94,76,8,24,'#aed581',-12)+C(80,62,3,'#2e7d32')+dots([[50,50],[110,52],[58,92],[102,92]]),lab:[[84,25,'Radicle','मूलांकुर'],[102,80,'Cotyledons','बीजपत्र'],[84,62,'Plumule','प्रांकुर']]},
   {n:['Mature seed (dormant)','परिपक्व बीज (सुषुप्त)'],c:['The integuments harden into the seed coat and the seed dries. It can rest in dormancy until conditions suit germination. Meanwhile the ovary becomes the fruit.','अध्यावरण कठोर होकर बीजचोल बनते हैं और बीज सूख जाता है। अनुकूल स्थिति आने तक यह सुषुप्त रह सकता है। इस बीच अंडाशय फल बन जाता है।'],
    d:()=>base('#6d4c41','#d7ccc8')+E(68,66,13,34,'#aed581')+E(92,66,13,34,'#aed581')+`<rect x="76" y="20" width="8" height="16" rx="3" fill="#ffe0b2"/>`+C(80,48,3,'#2e7d32')+C(80,19,2,'#fff')+C(80,105,3,'#3e2723'),lab:[[115,62,'Seed coat','बीजचोल'],[80,66,'Embryo','भ्रूण'],[85,19,'Micropyle','बीजांडद्वार'],[85,105,'Hilum','नाभिका']]},
   {n:['Germination','अंकुरण'],c:['With water and warmth the seed swells and the radicle breaks through the seed coat first.','पानी और गर्मी मिलने पर बीज फूलता है और सबसे पहले मूलांकुर बीजचोल को चीरकर बाहर आता है।'],
    d:()=>base('#6d4c41','#d7ccc8')+E(68,66,13,34,'#aed581')+E(92,66,13,34,'#aed581')+LN(80,36,80,7,7,'#ffe0b2')+C(80,48,3,'#2e7d32'),lab:[[88,8,'Radicle comes out first','मूलांकुर पहले निकलता है'],[115,62,'Seed coat','बीजचोल']]},
   {n:['Seedling','पौध'],c:['The root grows down, then the plumule grows up into a shoot with the first leaves. The cotyledons feed the seedling until it can make its own food.','जड़ नीचे बढ़ती है, फिर प्रांकुर ऊपर बढ़कर पहली पत्तियों वाला प्ररोह बनता है। जब तक पौधा अपना भोजन नहीं बना पाता, बीजपत्र उसे भोजन देते हैं।'],
    d:()=>`<rect x="10" y="58" width="140" height="46" fill="#8d6e63" opacity=".45"/>`+LN(80,58,80,98,4,'#ffe0b2')+LN(80,72,66,84,2,'#ffe0b2')+LN(80,80,94,92,2,'#ffe0b2')+LN(80,58,80,22,3,'#7cb342')+E(68,57,12,5,'#aed581',-8)+E(92,57,12,5,'#aed581',8)+E(71,21,9,4.5,'#43a047',-20)+E(89,21,9,4.5,'#43a047',20),lab:[[98,21,'First leaves','पहली पत्तियाँ'],[104,56,'Cotyledons','बीजपत्र'],[84,92,'Primary root','प्राथमिक जड़']]}];
  function draw(){const hi=PV.lang&&PV.lang()==='hi',x=hi?1:0,s=ST[i];
    const lab=s.lab.map(l=>`<line x1="${l[0]}" y1="${l[1]}" x2="126" y2="${l[1]}" stroke="var(--muted)" stroke-width=".4"/><text x="128" y="${l[1]+2}" font-size="6" fill="var(--fg)">${l[2+x]}</text>`).join('');
    el.innerHTML=`<span class="pv-x" role="button" aria-label="Close">×</span><b>${L('Seed development','बीज का विकास')}</b>
      <input type="range" id="pv-sds" min="0" max="${ST.length-1}" step="1" value="${i}" aria-label="Stage">
      <div class="pv-cap" style="margin-top:4px"><span>${i+1} / ${ST.length}</span><span>${s.n[x]}</span></div>
      <div class="pv-lf"><svg viewBox="0 0 230 110" role="img" aria-label="${s.n[x]}"><g transform="translate(-14 0)">${s.d()}${lab}</g></svg></div>
      <p>${s.c[x]}</p><p class="pv-note">${L('Simplified dicot sketch, not to scale. Monocot seeds have one cotyledon and keep their endosperm.','सरल द्विबीजपत्री रेखाचित्र, पैमाने के अनुसार नहीं। एकबीजपत्री बीजों में एक बीजपत्र होता है और भ्रूणपोष बना रहता है।')}</p>`}
  el.addEventListener('input',e=>{if(e.target.id==='pv-sds'){i=+e.target.value;draw();const s=el.querySelector('#pv-sds');if(s)s.focus()}});
  PV.sim.reg('seeddev',el,draw);
  const name=()=>L('🌱 Seed development','🌱 बीज का विकास');
  PV.after('homeChips',()=>{const b=document.createElement('button'),n=$('#chips');b.className='chip mode';b.dataset.id='__seeddev';b.textContent=name();b.onclick=()=>{i=0;PV.sim.open('seeddev')};n.insertBefore(b,n.firstChild)});
  PV.onLang&&PV.onLang(()=>{const b=document.querySelector('#chips [data-id="__seeddev"]');if(b)b.textContent=name()});
})();
