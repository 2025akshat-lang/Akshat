
(function(){
  const L=PV.L,el=PV.ui.addPanel('pv-health','');let tab='s',cur=null,uid=0;
  const TABS=[['s','Symptoms','लक्षण'],['d','Diseases & pests','रोग व कीट'],['a','Adaptations','अनुकूलन']];
  const LBL={s:[['Possible cause','संभावित कारण'],['Organ affected','प्रभावित अंग'],['What happens inside','भीतर क्या होता है'],['Why diagnosis is hard','पहचान क्यों कठिन']],
    a:[['Habitat','आवास'],['Features','विशेषताएँ'],['How it helps','कैसे मदद करता है'],['Example','उदाहरण']]};LBL.d=LBL.s;
  const LEAF='M8 35 Q60 -8 112 35 Q60 78 8 35Z',ve=(c,w)=>`<g stroke="${c}" stroke-width="${w}" fill="none"><path d="M8 35 H112"/>${[28,50,72,94].map(x=>`<path d="M${x} 35 L${x+14} 14M${x} 35 L${x+14} 56"/>`).join('')}</g>`,
    dots=(a,r,c,o)=>a.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="${r}" fill="${c}" opacity="${o||1}"/>`).join('');
  function leaf(v,dx){const id='pvc'+(uid++),P=[[35,28],[60,45],[82,26],[95,40],[50,24]];let base='#43a047',ov='',tf='';
    if(v==='pale')base='#d4e157';
    else if(v==='interv'){base='#fdd835';ov=ve('#2e7d32',3)}
    else if(v==='edge'){base='#66bb6a';ov=`<path d="${LEAF}" fill="none" stroke="#6d4c41" stroke-width="9"/>`}
    else if(v==='wilt'){base='#9ccc65';tf=' translate(0 14) scale(1 .6)';ov=`<path d="M8 35 H112" stroke="#558b2f" stroke-width="2"/>`}
    else if(v==='spots')ov=dots(P,7,'#fdd835',.7)+dots(P,3.5,'#5d4037');
    else if(v==='powder')ov=`<ellipse cx="45" cy="30" rx="16" ry="8" fill="#fff" opacity=".8"/><ellipse cx="82" cy="42" rx="14" ry="7" fill="#fff" opacity=".8"/>`;
    else if(v==='mosaic')ov=dots([[30,32],[55,22],[70,44],[92,30],[48,46]],9,'#c5e1a5',.85);
    else if(v==='purple'){base='#2e7d32';ov=`<rect x="0" y="0" width="120" height="70" fill="#6a1b9a" opacity=".38"/>`}
    else if(v==='tip'){base='#66bb6a';ov=`<ellipse cx="108" cy="35" rx="16" ry="13" fill="#6d4c41"/><path d="M96 24 Q108 35 96 46" fill="none" stroke="#6d4c41" stroke-width="5"/>`}
    else if(v==='bleach')ov=`<ellipse cx="50" cy="26" rx="14" ry="8" fill="#fff9c4" opacity=".9"/><ellipse cx="82" cy="45" rx="11" ry="7" fill="#fff9c4" opacity=".9"/>`;
    else if(v==='rust'){base='#66bb6a';ov=dots([[30,30],[38,40],[48,28],[58,44],[66,32],[76,40],[86,28],[94,38],[52,36],[72,24]],2.6,'#e65100')}
    else if(v==='blight')ov=`<ellipse cx="45" cy="30" rx="19" ry="11" fill="#4e342e" opacity=".85"/><ellipse cx="86" cy="42" rx="14" ry="9" fill="#4e342e" opacity=".85"/>`;
    else if(v==='holes')ov=dots([[35,30],[55,42],[72,28],[90,38],[62,34]],5,'var(--panel2)');
    else if(v==='angular')ov=`<polygon points="38,30 52,25 57,36 44,41" fill="#6d4c41" opacity=".85"/><polygon points="72,44 86,40 90,51 76,54" fill="#6d4c41" opacity=".85"/>`;
    else if(v==='curl'){tf=' translate(0 9) scale(1 .7)';ov=dots([[40,35],[55,35],[70,35],[85,35]],2.2,'#212121')}
    return `<g transform="translate(${dx} 0)"><clipPath id="${id}"><path d="${LEAF}"/></clipPath><g transform="${tf}"><path d="${LEAF}" fill="${base}"/><g clip-path="url(#${id})">${ov}</g>${v!=='interv'?ve('#2e7d32',1.2):''}</g></g>`}
  function draw(){
    const hi=PV.lang&&PV.lang()==='hi',x=hi?1:0,head=`<span class="pv-x" role="button" aria-label="Close">×</span><b>${L('Plant health','पौधे का स्वास्थ्य')}</b>`,
      tabs=`<div class="pv-seg">${TABS.map(t=>`<button data-tab="${t[0]}" aria-pressed="${t[0]===tab}">${hi?t[2]:t[1]}</button>`).join('')}</div>`;
    if(!cur){el.innerHTML=head+tabs+Object.keys(PV_HEALTH).filter(k=>PV_HEALTH[k].k===tab).map(k=>`<button class="pv-opt" data-c="${k}">${PV_HEALTH[k].n[x]}</button>`).join('')
      +(tab==='a'?'':`<p class="pv-note">${L('Educational guide. For a real crop or garden problem, ask an agriculture expert or a lab.','शैक्षिक गाइड। असली फसल या बगीचे की समस्या के लिए कृषि विशेषज्ञ या प्रयोगशाला से पूछें।')}</p>`);return}
    const h=PV_HEALTH[cur],lb=LBL[h.k];
    el.innerHTML=head+`<div class="pv-nav"><button data-c="">◀ ${L('Back','वापस')}</button></div>`
      +(h.v?`<div class="pv-lf"><svg viewBox="0 0 240 70" role="img" aria-label="${h.n[x]}">${leaf('healthy',0)}${leaf(h.v,120)}</svg><div class="pv-cap"><span>${L('Healthy','स्वस्थ')}</span><span>${L('Affected','प्रभावित')}</span></div></div>`:'')
      +`<b>${h.n[x]}</b>`+h.f.map((f,i)=>`<p><u>${lb[i][x]}</u><br>${f[x]}</p>`).join('')+(h.v?`<p class="pv-note">${L('Simplified sketch. Real symptoms vary by plant and stage.','सरल रेखाचित्र। असली लक्षण पौधे और अवस्था के अनुसार बदलते हैं।')}</p>`:'')}
  el.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.tab){tab=b.dataset.tab;cur=null;draw()}else if(b.dataset.c!==undefined){cur=b.dataset.c||null;draw()}});
  PV.sim.reg('health',el,draw);
  const name=()=>L('🩺 Plant health','🩺 पौधे का स्वास्थ्य');
  PV.after('homeChips',()=>{const b=document.createElement('button'),n=$('#chips');b.className='chip mode';b.dataset.id='__health';b.textContent=name();b.onclick=()=>{cur=null;PV.sim.open('health')};n.insertBefore(b,n.firstChild)});
  PV.onLang&&PV.onLang(()=>{const b=document.querySelector('#chips [data-id="__health"]');if(b)b.textContent=name()});
})();
