
(function(){
  const el=PV.ui.addPanel('pv-tl','<input id="pv-tls" type="range" min="0" max="50" step="1" value="0" aria-label="Time"><div id="pv-tln"></div>');el.classList.add('pv-b');
  const s=el.querySelector('#pv-tls'),nm=el.querySelector('#pv-tln'),
    HI={Seed:'बीज',Germination:'अंकुरण',Seedling:'पौध',Growth:'वृद्धि',Flowering:'पुष्पन',Fruiting:'फलन',Pollination:'परागण',Fertilisation:'निषेचन',Fruit:'फल',Dispersal:'प्रकीर्णन','New plant':'नया पौधा'};
  const label=i=>{const n=STAGES[st.mode][i][0];nm.textContent=PV.L(n,HI[n]||n)};
  s.oninput=()=>{if(!H||!st.mode)return;stopPlay();
    const n=STAGES[st.mode].length,v=+s.value/10,i=Math.min(Math.floor(v),n-2),f=v-i,a=STAGES[st.mode][i][1],b=STAGES[st.mode][i+1][1],o={};
    for(const k in DEF0){const x=a[k]===undefined?DEF0[k]:a[k],y=b[k]===undefined?DEF0[k]:b[k];o[k]=x+(y-x)*f}
    H.T=o;const r=Math.round(v);st.stage=r;selectH(null);pressChip('s'+r);label(r)};
  function sync(){el.hidden=!st.mode||st.lv!==1;if(el.hidden)return;s.max=(STAGES[st.mode].length-1)*10;s.value=st.stage*10;label(st.stage)}
  ['startMode','exitMode','setStage','show'].forEach(f=>PV.after(f,sync));
})();
