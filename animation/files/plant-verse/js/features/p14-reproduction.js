(function(){
  const D=PV_REPRO_DATA,L=PV.L;
  let view='anatomy',part='stigma',step=0,prop='runner',timer=0;
  const el=PV.ui.addPanel('pv-reproduction','');
  const partName=id=>{const p=D.parts.find(x=>x.id===id);return p?L(p.en,p.hi):''};
  const nav=()=>`<div class="pv-repro-tabs" role="group" aria-label="${L('Reproduction views','जनन दृश्य')}">
    ${[['anatomy','Flower anatomy','पुष्प संरचना'],['sexual','Sexual reproduction','लैंगिक जनन'],['asexual','Vegetative propagation','कायिक प्रवर्धन']].map(([id,en,hi])=>`<button data-view="${id}" aria-pressed="${view===id}">${L(en,hi)}</button>`).join('')}</div>`;
  const anatomy=()=>`<svg class="pv-repro-svg pv-anatomy" viewBox="0 0 540 330" role="img" aria-label="${L('Interactive flower anatomy. Select a label to inspect the part.','पुष्प की संवादात्मक संरचना। किसी भाग को देखने के लिए उसका नाम चुनें।')}">
    <defs><linearGradient id="pv-petal-grad" x2="0" y2="1"><stop stop-color="#f2a4c4"/><stop offset="1" stop-color="#d95b91"/></linearGradient><linearGradient id="pv-ovary-grad" x2="0" y2="1"><stop stop-color="#c5e1b5"/><stop offset="1" stop-color="#78ad69"/></linearGradient></defs>
    <g class="pv-flower-drawing">
      <path class="pv-petal-shape" d="M259 110C190 83 165 49 184 31c18-17 58 11 86 55 29-45 68-72 86-55 20 19-8 54-76 80Z"/>
      <path class="pv-petal-shape pv-petal-back" d="M263 107c-23-61-20-99 4-102 23-3 31 39 15 101 49-43 88-56 100-37 12 20-20 47-80 62Z"/>
      <path class="pv-sepal-shape" d="M244 182c-43-13-61-5-67 13 27 3 48 10 66 25m45-38c43-13 61-5 67 13-27 3-48 10-66 25"/>
      <path class="pv-filament" d="M244 147l-12-52m28 52-2-63m20 63 13-59"/>
      <g class="pv-anther"><ellipse cx="231" cy="93" rx="8" ry="13"/><ellipse cx="270" cy="82" rx="8" ry="13"/><ellipse cx="293" cy="88" rx="8" ry="13"/></g>
      <path class="pv-style" d="M270 124v77"/><path class="pv-stigma" d="M252 121q18-17 36 0-18 17-36 0Z"/>
      <path class="pv-ovary" d="M243 198q27-18 54 0v51q-27 23-54 0Z"/>
      <path class="pv-ovule" d="M254 219q9-9 17 0v18q-8 8-17 0Zm17 0q9-9 17 0v18q-8 8-17 0Z"/>
      <path class="pv-receptacle" d="M230 258q40 17 80 0l-7 12q-33 12-66 0Z"/>
      <path class="pv-pedicel" d="M270 268v42"/>
      <g class="pv-anatomy-labels">
        <g class="pv-r-hotspot" data-part="stigma" aria-pressed="${part==='stigma'}" role="button" tabindex="0" aria-label="${L('Stigma','वर्तिकाग्र')}"><path d="M252 121h-85"/><text x="160" y="125">${L('Stigma','वर्तिकाग्र')}</text><circle cx="252" cy="121" r="4"/></g>
        <g class="pv-r-hotspot" data-part="style" aria-pressed="${part==='style'}" role="button" tabindex="0" aria-label="${L('Style','वर्तिका')}"><path d="M270 164h-99"/><text x="166" y="168">${L('Style','वर्तिका')}</text><circle cx="270" cy="164" r="4"/></g>
        <g class="pv-r-hotspot" data-part="ovary" aria-pressed="${part==='ovary'}" role="button" tabindex="0" aria-label="${L('Ovary','अंडाशय')}"><path d="M243 222h-77"/><text x="160" y="226">${L('Ovary','अंडाशय')}</text><circle cx="243" cy="222" r="4"/></g>
        <g class="pv-r-hotspot" data-part="ovule" aria-pressed="${part==='ovule'}" role="button" tabindex="0" aria-label="${L('Ovule','बीजांड')}"><path d="M280 229h90"/><text x="376" y="233">${L('Ovule','बीजांड')}</text><circle cx="280" cy="229" r="4"/></g>
        <g class="pv-r-hotspot" data-part="anther" aria-pressed="${part==='anther'}" role="button" tabindex="0" aria-label="${L('Anther','परागकोश')}"><path d="M293 88h82"/><text x="381" y="92">${L('Anther','परागकोश')}</text><circle cx="293" cy="88" r="4"/></g>
        <g class="pv-r-hotspot" data-part="filament" aria-pressed="${part==='filament'}" role="button" tabindex="0" aria-label="${L('Filament','पुंतंतु')}"><path d="M245 108h-76"/><text x="161" y="112">${L('Filament','पुंतंतु')}</text><circle cx="245" cy="108" r="4"/></g>
        <g class="pv-r-hotspot" data-part="petal" aria-pressed="${part==='petal'}" role="button" tabindex="0" aria-label="${L('Petal','पंखुड़ी')}"><path d="M350 51h60"/><text x="416" y="55">${L('Petal','पंखुड़ी')}</text><circle cx="350" cy="51" r="4"/></g>
        <g class="pv-r-hotspot" data-part="sepal" aria-pressed="${part==='sepal'}" role="button" tabindex="0" aria-label="${L('Sepal','बाह्यदल')}"><path d="M335 194h75"/><text x="416" y="198">${L('Sepal','बाह्यदल')}</text><circle cx="335" cy="194" r="4"/></g>
        <g class="pv-r-hotspot" data-part="receptacle" aria-pressed="${part==='receptacle'}" role="button" tabindex="0" aria-label="${L('Receptacle','पुष्पासन')}"><path d="M301 263h80"/><text x="387" y="267">${L('Receptacle','पुष्पासन')}</text><circle cx="301" cy="263" r="4"/></g>
        <g class="pv-r-hotspot" data-part="pedicel" aria-pressed="${part==='pedicel'}" role="button" tabindex="0" aria-label="${L('Pedicel','पुष्पवृंत')}"><path d="M270 294h92"/><text x="368" y="298">${L('Pedicel','पुष्पवृंत')}</text><circle cx="270" cy="294" r="4"/></g>
      </g>
    </g></svg><div class="pv-repro-partlist">${D.parts.map(p=>`<button data-part="${p.id}" aria-pressed="${part===p.id}">${L(p.en,p.hi)}</button>`).join('')}</div>
    <div class="pv-repro-description"><b>${partName(part)}</b><p>${L(...D.parts.find(p=>p.id===part).desc)}</p></div>`;
  const processSvg=()=>`<svg class="pv-repro-svg pv-process" data-stage="${step}" viewBox="0 0 520 255" role="img" aria-label="${L('Animated flower pollination and fertilisation sequence','पुष्प में परागण और निषेचन का क्रम')}">
    <path class="pv-proc-petal" d="M224 75q-70-48-79-18 3 32 79 42m72-24q70-48 79-18-3 32-79 42Z"/>
    <path class="pv-proc-stamen" d="M225 91l-25-38m43 38-2-49m21 49 27-38"/><g class="pv-proc-anther"><circle cx="199" cy="51" r="8"/><circle cx="241" cy="40" r="8"/><circle cx="294" cy="51" r="8"/></g>
    <path class="pv-proc-stigma" d="M250 72q17-14 34 0-17 14-34 0Z"/><path class="pv-proc-style" d="M267 82v84"/>
    <path class="pv-proc-ovary" d="M239 163q28-16 56 0v45q-28 18-56 0Z"/><ellipse class="pv-proc-sac" cx="267" cy="187" rx="17" ry="20"/>
    <circle class="pv-proc-egg" cx="267" cy="197" r="5"/><circle class="pv-proc-polar" cx="263" cy="179" r="3"/><circle class="pv-proc-polar" cx="271" cy="179" r="3"/>
    <circle class="pv-proc-gamete pv-gamete-egg" cx="267" cy="146" r="3.5"/><circle class="pv-proc-gamete pv-gamete-polar" cx="267" cy="138" r="3.5"/>
    <path class="pv-proc-tube" d="M267 76v107q0 11 0 18"/><circle class="pv-proc-pollen" r="6" cx="199" cy="51"/>
    <path class="pv-proc-fruit" d="M394 162q35-19 70 0l-5 50q-30 20-60 0Z"/><path class="pv-proc-seed" d="M414 177q8-10 15 0v21q-7 8-15 0Z"/>
    <text class="pv-proc-note" x="267" y="235" text-anchor="middle">${step===2?L('Syngamy (2n) · Triple fusion (3n)','युग्मक-संलयन (2n) · त्रिक-संलयन (3n)'):L('Stigma → style → micropyle → embryo sac','वर्तिकाग्र → वर्तिका → बीजांडद्वार → भ्रूणकोष')}</text>
  </svg><div class="pv-repro-step"><span>${step+1} / 4 · ${L(D.steps[step].en,D.steps[step].hi)}</span><p>${L(...D.steps[step].text)}</p></div>
  <div class="pv-repro-controls"><button data-step="prev" ${step===0?'disabled':''}>◀ ${L('Previous','पिछला')}</button><button data-step="play">${timer?L('❚❚ Pause','❚❚ रोकें'):L('▶ Play','▶ चलाएँ')}</button><button data-step="next" ${step===3?'disabled':''}>${L('Next','अगला')} ▶</button></div>`;
  const vegSvg=()=>`<svg class="pv-repro-svg pv-veg" viewBox="0 0 520 230" role="img" aria-label="${L('Vegetative propagation illustration','कायिक प्रवर्धन का चित्र')}">
    ${prop==='runner'?`<path class="pv-veg-soil" d="M0 160h520v70H0Z"/><path class="pv-veg-runner" d="M72 154q95-37 188 0t188 0"/><g class="pv-veg-plant" transform="translate(78 142)"><path d="M0 0v-70m0 12q-38-48-56-20 18 26 56 28m0 2q34-50 54-22-17 29-54 29"/><path class="pv-veg-roots" d="M0 0v28m0-16-18 23m18-17 19 18"/></g><g class="pv-veg-plant" transform="translate(258 142)"><path d="M0 0v-65m0 7q-32-43-50-19 14 24 50 27m0 0q30-42 48-18-15 25-48 26"/><path class="pv-veg-roots" d="M0 0v28m0-16-18 23m18-17 19 18"/></g><g class="pv-veg-plant" transform="translate(440 142)"><path d="M0 0v-75m0 15q-34-45-52-19 17 26 52 28m0 0q29-43 48-18-16 25-48 26"/></g><text x="260" y="215" text-anchor="middle">${L('New plants form at runner nodes','भूस्तारी की पर्वसंधियों पर नए पौधे')}</text>`:
    prop==='tuber'?`<path class="pv-veg-soil" d="M0 101h520v129H0Z"/><path class="pv-veg-stem" d="M260 102V35m0 40q-44-44-68-20m68 20q46-46 70-18"/><path class="pv-veg-tuber" d="M170 166q90-60 180 0-25 45-90 46-65-1-90-46Z"/><g class="pv-veg-eye"><circle cx="212" cy="162" r="5"/><circle cx="259" cy="149" r="5"/><circle cx="306" cy="163" r="5"/></g><path class="pv-veg-roots" d="M240 188v28m0-15-20 23m20-17 20 20"/><text x="260" y="222" text-anchor="middle">${L('Buds (“eyes”) sprout from the stem tuber','तना-कंद की कलियों (“आँखों”) से अंकुर')}</text>`:
    `<path class="pv-veg-stem" d="M260 196V57m0 71q-56-12-91-54"/><path class="pv-veg-scion" d="M169 117q29-45 64-47"/><path class="pv-veg-stock" d="M242 140h36m-18-17v35"/><path class="pv-veg-stem" d="M260 56q-30-43-62-23m62 23q29-43 61-23"/><path class="pv-veg-bud" d="M168 117q-19-20-7-35 22 2 17 26Z"/><text x="260" y="222" text-anchor="middle">${L('A bud or shoot is joined to a rooted stock','कली या प्ररोह को जड़ वाले आधार से जोड़ना')}</text>`}
  </svg><div class="pv-repro-partlist">${D.propagation.map(p=>`<button data-prop="${p.id}" aria-pressed="${prop===p.id}">${L(p.en,p.hi)}</button>`).join('')}</div>
  <div class="pv-repro-description"><b>${L(D.propagation.find(p=>p.id===prop).en,D.propagation.find(p=>p.id===prop).hi)}</b><p>${L(...D.propagation.find(p=>p.id===prop).text)}</p></div>`;
  function draw(){
    const body=view==='anatomy'?anatomy():view==='sexual'?processSvg():vegSvg();
    el.innerHTML=`<button class="pv-x" type="button" aria-label="${L('Close','बंद करें')}">×</button><b>${L('Plant reproduction','पौधों में जनन')}</b>${nav()}${body}`;
  }
  function stop(){clearInterval(timer);timer=0}
  function chooseStep(i){step=Math.max(0,Math.min(D.steps.length-1,i));if(step===D.steps.length-1)stop();draw()}
  el.addEventListener('click',e=>{
    const hotspot=e.target.closest('.pv-r-hotspot');
    if(hotspot){part=hotspot.dataset.part;draw();return}
    const b=e.target.closest('button');
    if(!b)return;
    if(b.classList.contains('pv-x')){stop();el.hidden=true;return}
    if(b.dataset.view){stop();view=b.dataset.view;draw();return}
    if(b.dataset.part){part=b.dataset.part;draw();return}
    if(b.dataset.prop){prop=b.dataset.prop;draw();return}
    if(b.dataset.step==='prev')chooseStep(step-1);
    if(b.dataset.step==='next')chooseStep(step+1);
    if(b.dataset.step==='play'){
      if(timer){stop();draw();return}
      if(step===D.steps.length-1)chooseStep(0);
      timer=setInterval(()=>{if(step>=D.steps.length-1){stop();draw();return}chooseStep(step+1)},2600);draw();
    }
  });
  el.addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;const g=e.target.closest('.pv-r-hotspot');if(g){e.preventDefault();part=g.dataset.part;draw()}});
  PV.sim.reg('plant-reproduction',el,draw);
  const launch=PV.ui.addTopButton('🌼 '+L('Repro Lab','जनन प्रयोगशाला'),()=>{stop();view='anatomy';part='stigma';PV.sim.open('plant-reproduction')});
  launch.classList.add('dock-action');
  launch.setAttribute('aria-label',L('Interactive plant reproduction','पौधों का संवादात्मक जनन'));
  PV.onLang&&PV.onLang(()=>{launch.textContent='🌼 '+L('Repro Lab','जनन प्रयोगशाला');if(!el.hidden)draw()});
  PV.before('homeChips',()=>document.querySelectorAll('#app-actions [data-id^="__"]').forEach(b=>b.remove()));
  PV.after('homeChips',()=>{
    ['__hmatch','__health','__num','__theory','__progress'].forEach(id=>{
      const b=document.querySelector(`#chips [data-id="${id}"]`);
      if(b){b.classList.add('dock-action');document.querySelector('#app-actions').appendChild(b)}
    });
    document.querySelector('#parts-menu summary').textContent='Explore · '+document.querySelectorAll('#chips .chip').length;
  });
  ['#pv-view','#pv-focus','.dock-action[aria-label="Plant Explorer"]','.dock-action[aria-label="Accessibility settings"]'].forEach(sel=>{
    const b=document.querySelector(sel);if(b)document.querySelector('#app-more').appendChild(b);
  });
  const more=document.querySelector('#tools-menu');
  more.addEventListener('click',e=>{if(e.target.closest('button'))more.open=false});
  document.addEventListener('click',e=>{if(more.open&&!more.contains(e.target))more.open=false});
})();
