
(function(){
  const L=PV.L,el=PV.ui.addPanel('pv-num','');let q=null,res=null,score=0,tries=0,last=-1;
  const R=(a,b,s)=>{s=s||1;return a+Math.round(Math.random()*(b-a)/s)*s},r1=x=>Math.round(x*10)/10,r2=x=>Math.round(x*100)/100;
  const G=[
   ()=>{const s=-r1(R(5,15)/10),p=r1(R(1,Math.round(-s*10)+3)/10),a=r1(s+p);
     return{t:[`A cell has solute potential Ψs = ${s} MPa and pressure potential Ψp = +${p} MPa. Find its water potential Ψw (MPa).`,`एक कोशिका का विलेय विभव Ψs = ${s} MPa और दाब विभव Ψp = +${p} MPa है। इसका जल विभव Ψw (MPa) ज्ञात कीजिए।`],a,u:'MPa',
      s:[`Ψw = Ψs + Ψp = (${s}) + (+${p}) = ${a} MPa`,`Ψw = Ψs + Ψp = (${s}) + (+${p}) = ${a} MPa`]}},
   ()=>{const l0=R(2,8),t=R(2,5),d=t*R(1,4),l1=l0+d,a=r2(d/t);
     return{t:[`A seedling grows from ${l0} cm to ${l1} cm in ${t} days. What is the absolute growth rate (cm per day)?`,`एक अंकुर ${t} दिन में ${l0} सेमी से ${l1} सेमी हो जाता है। निरपेक्ष वृद्धि दर (सेमी प्रतिदिन) क्या है?`],a,u:'cm/day',
      s:[`AGR = (${l1} − ${l0}) ÷ ${t} = ${a} cm/day`,`AGR = (${l1} − ${l0}) ÷ ${t} = ${a} सेमी/दिन`]}},
   ()=>{const l0=R(10,40,5),inc=R(5,20,5),a=r1(inc/l0*100);
     return{t:[`A root is ${l0} mm long and grows ${inc} mm in one day. What is its relative growth rate (% per day)?`,`एक जड़ ${l0} मिमी लंबी है और एक दिन में ${inc} मिमी बढ़ती है। इसकी सापेक्ष वृद्धि दर (% प्रतिदिन) क्या है?`],a,u:'%/day',
      s:[`RGR = increase ÷ initial size × 100 = ${inc} ÷ ${l0} × 100 = ${a} % per day`,`RGR = वृद्धि ÷ प्रारंभिक आकार × 100 = ${inc} ÷ ${l0} × 100 = ${a} % प्रतिदिन`]}},
   ()=>{const n=R(3,12,3),atp=Math.random()<.5,a=atp?3*n:2*n,nm=atp?'ATP':'NADPH';
     return{t:[`In the Calvin cycle, how many ${nm} are needed to fix ${n} molecules of CO₂? (3 ATP and 2 NADPH per CO₂)`,`केल्विन चक्र में ${n} अणु CO₂ को स्थिर करने के लिए कितने ${nm} चाहिए? (प्रति CO₂ 3 ATP और 2 NADPH)`],a,u:nm,
      s:[`${nm} = ${atp?3:2} × ${n} = ${a}`,`${nm} = ${atp?3:2} × ${n} = ${a}`]}},
   ()=>{const N=[16,32,48,64,80,160][R(0,5)],k=R(0,2);
     const T=[[`Tt × Tt gives ${N} offspring. How many are expected to be tall (TT or Tt)?`,`Tt × Tt से ${N} संतानें मिलती हैं। कितनी लंबी (TT या Tt) होने की आशा है?`,N*3/4,`3/4 × ${N}`],
       [`Tt × Tt gives ${N} offspring. How many are expected to be dwarf (tt)?`,`Tt × Tt से ${N} संतानें मिलती हैं। कितनी बौनी (tt) होने की आशा है?`,N/4,`1/4 × ${N}`],
       [`A dihybrid cross (RrYy × RrYy) gives ${N} offspring. How many are expected to be double recessive (rryy)?`,`द्विसंकर संकरण (RrYy × RrYy) से ${N} संतानें मिलती हैं। कितनी द्विअप्रभावी (rryy) होने की आशा है?`,N/16,`1/16 × ${N}`]][k];
     return{t:[T[0],T[1]],a:T[2],u:'',s:[`${T[3]} = ${T[2]}`,`${T[3]} = ${T[2]}`]}},
   ()=>{const S=R(10,40),E=R(80,200,10),a=r1(S/(S+E)*100);
     return{t:[`A leaf field shows ${S} stomata and ${E} epidermal cells. Find the stomatal index.`,`पत्ती के एक क्षेत्र में ${S} रंध्र और ${E} अधिचर्म कोशिकाएँ हैं। रंध्र सूचकांक ज्ञात कीजिए।`],a,u:'',
      s:[`SI = S ÷ (S + E) × 100 = ${S} ÷ ${S+E} × 100 = ${a}`,`SI = S ÷ (S + E) × 100 = ${S} ÷ ${S+E} × 100 = ${a}`]}}];
  function next(){let k;do{k=R(0,G.length-1)}while(k===last&&G.length>1);last=k;q=G[k]();res=null}
  function build(){const hi=PV.lang&&PV.lang()==='hi',x=hi?1:0;if(!q)next();
    el.innerHTML=`<span class="pv-x" role="button" aria-label="Close">×</span><b>${L('Numericals','अंकगणित प्रयोगशाला')}</b> <span class="pv-cnt">${score}/${tries}</span>
      <p style="color:var(--fg)">${q.t[x]}</p>
      <input id="pv-numin" type="number" step="any" inputmode="decimal" ${res?'disabled':''} placeholder="${L('Your answer','आपका उत्तर')}${q.u?' ('+q.u+')':''}" style="width:100%;min-height:40px;border-radius:10px;border:1px solid var(--line);background:var(--bg);color:var(--fg);padding:0 10px;font:inherit">`
      +(res?`<p>${res.ok?'✓ ':'✗ '}${res.ok?L('Correct.','सही।'):L('Not quite.','ठीक नहीं।')}</p><p><u>${L('Worked solution','हल')}</u><br>${q.s[x]}${q.u?' '+q.u:''}</p><div class="pv-nav"><button data-n="1">${L('Next ▶','अगला ▶')}</button></div>`
        :`<div class="pv-nav"><button data-c="1">${L('Check','जाँचें')}</button></div>`)
      +`<p class="pv-note">${L('Random numbers each time. Answers within a small rounding margin count as correct.','हर बार अलग संख्याएँ। छोटे पूर्णांकन अंतर वाले उत्तर भी सही माने जाते हैं।')}</p>`}
  el.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.c){const i=el.querySelector('#pv-numin'),v=parseFloat(String(i.value).replace(',','.'));if(isNaN(v))return;
      const ok=Math.abs(v-q.a)<=Math.max(.06,Math.abs(q.a)*.01);res={ok};tries++;if(ok)score++;build()}
    else if(b.dataset.n){next();build()}});
  PV.sim.reg('numericals',el,build);
  const name=()=>L('🧮 Numericals','🧮 अंकगणित');
  PV.after('homeChips',()=>{const b=document.createElement('button'),n=$('#chips');b.className='chip mode';b.dataset.id='__num';b.textContent=name();b.onclick=()=>{q=null;PV.sim.open('numericals')};n.insertBefore(b,n.firstChild)});
  PV.onLang&&PV.onLang(()=>{const b=document.querySelector('#chips [data-id="__num"]');if(b)b.textContent=name()});
  PV.numericals={gen:G};
})();
