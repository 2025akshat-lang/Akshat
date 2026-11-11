
(function(){
  const L=PV.L,el=PV.ui.addPanel('pv-quiz','');
  
  const Q=[['Which tissue carries water up from the roots to the leaves?','कौन-सा ऊतक जड़ों से पत्तियों तक पानी ऊपर पहुँचाता है?',['Phloem','Xylem','Epidermis','Cortex'],['फ्लोएम','जाइलम','अधिचर्म','वल्कुट'],1,'Xylem carries water and minerals upwards; phloem carries food.','जाइलम पानी व खनिज ऊपर ले जाता है; फ्लोएम भोजन ले जाता है।'],
   ['Where does water mainly enter a plant?','पौधे में पानी मुख्यतः कहाँ से प्रवेश करता है?',['Stomata','Petiole','Root hairs','Flower'],['रंध्र','पर्णवृंत','मूल रोम','फूल'],2,'Root hairs have a huge surface for absorbing water from the soil.','मूल रोम मिट्टी से पानी सोखने के लिए बहुत बड़ी सतह देते हैं।'],
   ['Water in the soil becomes very scarce. What do the stomata do?','मिट्टी में पानी बहुत कम हो जाए तो रंध्र क्या करते हैं?',['Open wider','Close','Make chlorophyll','Absorb water'],['और चौड़े खुलते हैं','बंद हो जाते हैं','क्लोरोफिल बनाते हैं','पानी सोखते हैं'],1,'Closing saves water, but less CO₂ enters, so photosynthesis also falls.','बंद होने से पानी बचता है, पर CO₂ भी कम आती है, इसलिए प्रकाश-संश्लेषण भी घटता है।'],
   ['Light increases while water, CO₂ and temperature are ideal. What happens to photosynthesis?','पानी, CO₂ और तापमान आदर्श हैं और प्रकाश बढ़ाया जाता है। प्रकाश-संश्लेषण का क्या होगा?',['It stops','It rises, then levels off','It falls at once','No change at all'],['रुक जाएगा','बढ़ेगा, फिर स्थिर हो जाएगा','तुरंत घटेगा','बिल्कुल नहीं बदलेगा'],1,'It rises until another factor (such as CO₂) becomes the limit.','यह तब तक बढ़ता है जब तक कोई और कारक (जैसे CO₂) सीमा नहीं बन जाता।'],
   ['Which structure is the pore for gas exchange in leaves?','पत्तियों में गैस-विनिमय का छिद्र कौन-सा है?',['Stigma','Stoma','Micropyle','Cuticle'],['वर्तिकाग्र','रंध्र (stoma)','बीजांडद्वार','क्यूटिकल'],1,'Each stoma is a pore between two guard cells.','हर रंध्र दो रक्षक कोशिकाओं के बीच का छिद्र है।'],
   ['After fertilisation, which part of the flower develops into the fruit?','निषेचन के बाद फूल का कौन-सा भाग फल बनता है?',['Ovary','Petal','Stamen','Sepal'],['अंडाशय','दल','पुंकेसर','बाह्यदल'],0,'The ovary becomes the fruit and the ovules become seeds.','अंडाशय फल बनता है और बीजांड बीज बनते हैं।']];
  let i=0,score=0,ans=-1,fin=false;
  function build(){const hi=PV.lang&&PV.lang()==='hi',x=hi?1:0,head=`<span class="pv-x" role="button" aria-label="Close">×</span><b>${L('Quiz','क्विज़')}</b>`;
    if(i>=Q.length){if(!fin){fin=true;PV.progress&&PV.progress.quiz(score,Q.length)}el.innerHTML=head+`<p>${L('Score','अंक')}: ${score}/${Q.length}</p><div class="pv-nav"><button data-r="1">${L('Try again','फिर से')}</button></div>`;return}
    const q=Q[i];
    el.innerHTML=head+` <span class="pv-sci">${i+1}/${Q.length}</span><p style="color:var(--fg)">${q[x]}</p>`+q[2+x].map((o,k)=>`<button class="pv-opt" data-o="${k}" ${ans>=0?'disabled':''}${ans>=0&&k===q[4]?' data-ok="1"':ans===k?' data-bad="1"':''}>${o}</button>`).join('')
      +(ans>=0?`<p>${ans===q[4]?'✓ ':'✗ '}${q[5+x]}</p><div class="pv-nav"><button data-n="1">${i<Q.length-1?L('Next ▶','अगला ▶'):L('Finish','समाप्त')}</button></div>`:'')}
  el.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.disabled)return;
    if(b.dataset.o!==undefined){ans=+b.dataset.o;if(ans===Q[i][4])score++}else if(b.dataset.n){i++;ans=-1}else if(b.dataset.r){i=0;score=0;ans=-1;fin=false}build()});
  PV.sim.reg('quiz',el,()=>{i=0;score=0;ans=-1;fin=false;build()});
})();
