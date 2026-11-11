
(function(){
  const L=PV.L,S={light:70,water:80,co2:420,temp:25,hum:60,c4:false},cl=(x,a,b)=>Math.max(a,Math.min(b,x));
  const el=PV.ui.addPanel('pv-env','');
  
  function model(s){
    const K=s.c4?[60,80,33]:[35,300,25],fL=(s.light/(s.light+K[0]))/(100/(100+K[0])),fC=(s.co2/(s.co2+K[1]))/(1000/(1000+K[1])),fT=Math.exp(-Math.pow((s.temp-K[2])/12,2)),
      sw=cl((s.water-15)/45,0,1),sA=cl(s.light/50,0,1)*sw*(.65+.35*s.hum/100),sg=sA*(1-.35*cl((s.co2-420)/580,0,1)),
      es=.6108*Math.exp(17.27*s.temp/(s.temp+237.3)),vpd=es*(1-s.hum/100),E=sg*Math.min(1,vpd/4),A=fL*fC*fT*(.1+.9*sA),
      f={light:fL,co2:fC,temp:fT,water:sw};let lim='none',m=.85;for(const k in f)if(f[k]<m){m=f[k];lim=k}
    return{stomata:sg*100,E:E*100,A:A*100,lim,vpd}}
  PV.envModel=model;
  const NM={light:['Light','प्रकाश'],co2:['CO₂','CO₂'],temp:['Temperature','तापमान'],water:['Water','पानी'],none:['No single strong limit','कोई एक तेज़ सीमा नहीं']};
  const ROWS=[['light','Light','प्रकाश',0,100,1,'%'],['water','Water in soil','मिट्टी में पानी',0,100,1,'%'],['co2','CO₂','CO₂',150,1000,10,' ppm'],['temp','Temperature','तापमान',5,45,1,' °C'],['hum','Air humidity','हवा की नमी',10,100,1,'%']];
  function msgs(s,r){const o=[];
    if(s.water<25)o.push([ 'Little water: a hormone signal (ABA) closes the stomata. Less water is lost, but less CO₂ enters, so photosynthesis falls. Leaves may wilt.','कम पानी: हार्मोन संकेत (ABA) रंध्र बंद कर देता है। पानी कम उड़ता है, पर CO₂ भी कम आती है, इसलिए प्रकाश-संश्लेषण घटता है। पत्तियाँ मुरझा सकती हैं।']);
    if(s.light<10)o.push(['Almost dark: stomata stay mostly shut and there is no net photosynthesis. Respiration continues.','लगभग अँधेरा: रंध्र प्रायः बंद रहते हैं और शुद्ध प्रकाश-संश्लेषण नहीं होता। श्वसन चलता रहता है।']);
    if(s.temp>38||s.temp<10)o.push(['Temperature far from the optimum: enzymes work slowly (or get damaged when very hot), so photosynthesis drops.','तापमान अनुकूल से बहुत दूर: एंज़ाइम धीमे चलते हैं (बहुत गर्मी में नष्ट भी हो सकते हैं), इसलिए प्रकाश-संश्लेषण घटता है।']);
    if(s.hum<25&&s.temp>30)o.push(['Hot, dry air pulls water out of leaves quickly (high vapour-pressure deficit).','गर्म, सूखी हवा पत्तियों से पानी तेज़ी से खींचती है।']);
    if(!s.c4&&s.co2>700)o.push(['Extra CO₂ helps a C3 plant only until another factor becomes limiting.','अतिरिक्त CO₂ C3 पौधे को तभी तक लाभ देती है जब तक कोई और कारक सीमा न बन जाए।']);
    return o.slice(0,3)}
  function build(){
    el.innerHTML=`<span class="pv-x" role="button" aria-label="Close">×</span><b>${L('Environment lab','पर्यावरण प्रयोगशाला')}</b>
      <div class="pv-seg"><button data-t="c3" aria-pressed="${!S.c4}">C3</button><button data-t="c4" aria-pressed="${S.c4}">C4</button></div>
      <div class="pv-stick">`+['stomata','E','A'].map(k=>`<div class="pv-res">${L({stomata:'Stomata open',E:'Water loss (transpiration)',A:'Photosynthesis'}[k],{stomata:'रंध्र खुले',E:'जल-हानि (वाष्पोत्सर्जन)',A:'प्रकाश-संश्लेषण'}[k])}<div class="pv-bar"><i data-b="${k}"></i></div></div>`).join('')+`<p id="pv-lim"></p></div>`
      +ROWS.map(r=>`<label class="pv-row">${L(r[1],r[2])} <span data-v="${r[0]}"></span><input type="range" data-k="${r[0]}" min="${r[3]}" max="${r[4]}" step="${r[5]}" value="${S[r[0]]}"></label>`).join('')
      +`<div id="pv-msg"></div><p class="pv-note">${L('The 3D plant shows light, soil wetness, leaf droop and leaf colour. Humidity, CO₂ and the C3/C4 choice change only the bars. Simplified teaching model: relative values only; real responses depend on species and conditions.','3D पौधे में प्रकाश, मिट्टी की नमी, पत्तियों का झुकाव और रंग दिखते हैं। नमी, CO₂ और C3/C4 का असर केवल बार में दिखता है। सरलीकृत शिक्षण मॉडल: केवल सापेक्ष मान; असली प्रतिक्रिया प्रजाति और स्थितियों पर निर्भर करती है।')}</p>`;
    upd()}
  function upd(){const r=model(S),hi=PV.lang&&PV.lang()==='hi';
    ROWS.forEach(x=>{const v=el.querySelector(`[data-v="${x[0]}"]`);if(v)v.textContent=S[x[0]]+x[6]});
    ['stomata','E','A'].forEach(k=>{const b=el.querySelector(`[data-b="${k}"]`);if(b)b.style.width=Math.round(r[k])+'%'});
    el.querySelector('#pv-lim').innerHTML=`<u>${L('Limiting factor','सीमित करने वाला कारक')}</u> ${NM[r.lim][hi?1:0]}`;
    el.querySelector('#pv-msg').innerHTML=msgs(S,r).map(m=>`<p>${m[hi?1:0]}</p>`).join('');react(S,r)}

  
  const cu={w:0,y:0,b:0,l:1,m:80},tg={w:0,y:0,b:0,l:1,m:80},NEU={w:0,y:0,b:0,l:1,m:80};
  let hk=null,lv=null,lights=new Map(),orig=new Map(),active=false;
  const YEL=()=>new T.Color(0xd4d24a),BRN=()=>new T.Color(0x8a6a3a);
  function leaves(){if(lv)return lv;lv=[];H.group.updateMatrixWorld(true);
    H.parts.blade.meshes.forEach(m=>{const pa=m.geometry&&m.geometry.attributes&&m.geometry.attributes.position;if(!pa||pa.count!==207)return;
      const lg=m.parent&&m.parent.parent;if(!lg||lv.some(o=>o.lg===lg))return;
      m.geometry.computeBoundingBox();const c=H.pivot.worldToLocal(m.localToWorld(m.geometry.boundingBox.getCenter(new T.Vector3()))),b=H.pivot.worldToLocal(lg.getWorldPosition(new T.Vector3()));
      lv.push({lg,z0:lg.rotation.z,side:(c.x-b.x)>=0?1:-1})});return lv}
  function hook(){if(!H||hk===H)return !!H;hk=H;lv=null;lights=new Map();orig=new Map();const o=H.apply;H.apply=function(V,t){o.call(this,V,t);step()};return true}
  function step(){if(!active)return;try{
    let far=0;for(const k in cu){cu[k]+=(tg[k]-cu[k])*.12;far=Math.max(far,Math.abs(tg[k]-cu[k])*(k==='m'?.01:1))}
    const done=far<.004&&tg.w===0&&tg.y===0&&tg.b===0&&tg.l===1&&tg.m===80;if(done)for(const k in cu)cu[k]=NEU[k];
    leaves().forEach(o=>{o.lg.rotation.z=o.z0-o.side*cu.w*1.0});
    H.parts.blade.mats.forEach(m=>{if(!m.color)return;let o=orig.get(m);if(!o){o=m.color.clone();orig.set(m,o)}m.color.copy(o).lerp(YEL(),cu.y).lerp(BRN(),cu.b)});
    H.scene.traverse(o=>{if(!o.isLight)return;if(!lights.has(o))lights.set(o,o.intensity);o.intensity=lights.get(o)*cu.l});
    const wt=cu.m,k=wt<80?(80-wt)/80:-(wt-80)/20,r=k>=0?1+.35*k:1+.2*k,g=k>=0?1+.28*k:1+.24*k,b=k>=0?1+.1*k:1+.26*k;
    (H.soilHits||[]).forEach(m=>{if(m.material&&m.material.color)m.material.color.setRGB(r,g,b)});
    if(done)active=false}catch(e){console.error(e);active=false}}
  function react(s,r){if(!hook())return;const c4=s.c4,dev=Math.abs(s.temp-(c4?33:25));
    tg.w=Math.max(cl((40-s.water)/40,0,1),cl((r.vpd-3.5)/4,0,1)*.5);
    tg.y=cl(Math.max(cl((25-s.water)/25,0,1)*.6,cl((20-s.light)/20,0,1)*.5,cl((dev-14)/10,0,1)*.6),0,1);
    tg.b=cl(Math.max((12-s.water)/12,(s.temp-40)/5),0,1)*.7;
    tg.l=cl(.3+.7*s.light/70,.3,1.25);tg.m=s.water;active=true}
  function reset(){tg.w=0;tg.y=0;tg.b=0;tg.l=1;tg.m=80;active=true}
  new MutationObserver(()=>{if(el.hidden)reset()}).observe(el,{attributes:true,attributeFilter:['hidden']});
  el.oninput=e=>{const k=e.target.dataset.k;if(k){S[k]=+e.target.value;upd()}};
  el.addEventListener('click',e=>{const t=e.target.closest('[data-t]');if(t){S.c4=t.dataset.t==='c4';el.querySelectorAll('[data-t]').forEach(b=>b.setAttribute('aria-pressed',String(b===t)));upd()}});
  PV.sim.reg('env',el,build);
})();
