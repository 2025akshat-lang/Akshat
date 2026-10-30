
(function(){
  const L=PV.L,el=PV.ui.addPanel('pv-tour',''),
  
  ST=[['rhair','Root hairs','मूल रोम','Soil water enters the root hairs by osmosis, because the cell sap inside is more concentrated than the soil water.','मूल रोम के कोशिका रस की सांद्रता मिट्टी के पानी से अधिक होती है, इसलिए पानी परासरण (osmosis) से भीतर आता है।','root-hair'],
   ['taproot','Root cortex','जड़ का वल्कुट','Water crosses the cortex cells towards the centre, through cell walls and through the cytoplasm.','पानी वल्कुट (cortex) की कोशिकाओं में होकर, भित्तियों और कोशिकाद्रव्य दोनों रास्तों से, केंद्र की ओर बढ़ता है।','root-cross'],
   ['taproot','Endodermis','अंतःत्वचा','A waxy Casparian strip in the endodermis walls blocks the cell-wall route, so water must pass through cell membranes. This lets the root control which minerals enter the xylem.','अंतःत्वचा (endodermis) की भित्ति में मोमी कैस्पेरियन पट्टी दीवार वाला रास्ता रोक देती है, इसलिए पानी को कोशिका झिल्ली से गुज़रना पड़ता है। इससे जड़ तय करती है कि कौन-से खनिज जाइलम में जाएँ।','root-cross'],
   ['internode','Xylem in the stem','तने का जाइलम','Dead, hollow xylem vessels and tracheids form continuous tubes. Water rises as an unbroken column because water molecules stick together (cohesion) and to the walls (adhesion).','मृत, खोखली जाइलम वाहिकाएँ और वाहिनिकाएँ लगातार नलियाँ बनाती हैं। जल-अणु आपस में (संसंजन) और दीवारों से (आसंजन) चिपकते हैं, इसलिए पानी का स्तंभ टूटे बिना ऊपर चढ़ता है।','stem-dicot'],
   ['vein','Leaf veins','पत्ती की शिराएँ','Veins branch through the leaf and deliver water close to every mesophyll cell.','शिराएँ पत्ती में फैलकर हर पर्णमध्योतक (mesophyll) कोशिका के पास पानी पहुँचाती हैं।','leaf-blade'],
   ['blade','Stomata: transpiration','रंध्र: वाष्पोत्सर्जन','Water evaporates from mesophyll cell walls and leaves as vapour through the stomata. This transpiration pull draws more water up from the roots (cohesion–tension).','पर्णमध्योतक की भित्तियों से पानी वाष्प बनकर रंध्रों (stomata) से निकलता है। यह वाष्पोत्सर्जन-खिंचाव (संसंजन-तनाव) जड़ों से और पानी ऊपर खींचता है।','leaf-stomata']];
  let i=0;
  function build(){const s=ST[i],hi=PV.lang&&PV.lang()==='hi';PV.progress&&PV.progress.mark('tour:'+i);
    el.innerHTML=`<span class="pv-x" role="button" aria-label="Close">×</span><b>${L('Water journey','पानी की यात्रा')} ${i+1}/${ST.length}</b><div class="pv-sci">${hi?s[2]:s[1]}</div><p>${hi?s[4]:s[3]}</p>
      <div class="pv-nav"><button data-a="p" ${i?'':'disabled'}>◀</button><button data-a="s">${L('3D section ▸','3D काट ▸')}</button><button data-a="n" ${i<ST.length-1?'':'disabled'}>▶</button></div>`;
    PV.selectPart(s[0])}
  el.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b||b.disabled)return;const a=b.dataset.a;
    if(a==='s'){openScene(ST[i][5]);return}i+=a==='n'?1:-1;build()});
  PV.sim.reg('tour',el,()=>{i=0;build()});
})();
