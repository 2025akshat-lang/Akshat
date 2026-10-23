/* notes.js: iPad-style text boxes, label / fact-card / emoji stickers, washi tape. Loaded after extras.js. */
(function(){
'use strict';
const q=s=>document.querySelector(s),B=document.body,tools=q('#tools');
const st=document.createElement('style');
st.textContent=`
.obj[data-k=txt] .ob{height:auto}
.tx{outline:none;min-width:60px;padding:6px 14px;font-family:Gaegu,"Patrick Hand",Kalam,cursive;font-size:clamp(22px,2.6vw,40px);line-height:1.25;white-space:pre-wrap;word-break:break-word;color:var(--ink);user-select:text;-webkit-user-select:text;cursor:text}
.tx.pill-pink,.tx.pill-blue,.tx.pill-green,.tx.pill-yellow,.tx.pill-purple{border-radius:999px;font-weight:700;letter-spacing:.06em;text-align:center;box-shadow:0 2px 6px #0004}
.tx.pill-pink{background:#ffc9d9;color:#8a1c3c}.tx.pill-blue{background:#cfe3ff;color:#1c3f8a}.tx.pill-green{background:#cdf5da;color:#14663a}.tx.pill-yellow{background:#fff3b0;color:#6b5200}.tx.pill-purple{background:#e3d6ff;color:#4b2a8a}
.tx.fact{background:#fff8c8;color:#7a1c1c;border:2px solid #e8dc8a;border-radius:6px;box-shadow:0 4px 10px #0007;position:relative;padding-top:24px;text-align:center}
.tx.fact::before{content:'';position:absolute;top:-10px;left:50%;width:76px;height:20px;margin-left:-38px;background:#f7b6c8cc;transform:rotate(-2deg)}
.tx.bubble{background:#fff;color:#222;border:3px solid #222;border-radius:26px}
.tx.emoji{font-family:system-ui,"Apple Color Emoji","Noto Color Emoji",sans-serif;font-size:clamp(48px,7vw,110px);line-height:1;padding:0;min-width:0}
.stg{display:grid;grid-template-columns:repeat(auto-fill,minmax(88px,1fr));gap:8px}
.stg button{min-height:48px;padding:4px;display:flex;align-items:center;justify-content:center}
.stg .tx{font-size:13px;padding:2px 8px;min-width:0;cursor:pointer}.stg .emoji{font-size:26px}`;
document.head.appendChild(st);

const pill=(t,c)=>({txt:t,skin:'pill-'+c,w:190});
const TAPE=(c1,c2)=>`<svg viewBox="0 0 160 36" preserveAspectRatio="none"><rect x="2" y="3" width="156" height="30" fill="${c1}" opacity=".85"/><path d="M2 3l6 4-6 4 6 4-6 4 6 4-6 4M158 3l-6 4 6 4-6 4 6 4-6 4 6 4" fill="none" stroke="${c2}" stroke-width="2"/></svg>`;
const ARROW='<svg viewBox="0 0 160 110"><path d="M10 100C30 20 110 10 142 80" fill="none" stroke="#e53935" stroke-width="6" stroke-linecap="round"/><path d="M118 82l26 6 4-28" fill="none" stroke="#e53935" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const WAVE='<svg viewBox="0 0 160 30"><path d="M4 18q10-16 20 0t20 0 20 0 20 0 20 0 20 0 20 0" fill="none" stroke="#1e88e5" stroke-width="5" stroke-linecap="round"/></svg>';
const ITEMS=[
 ['FRONT',pill('FRONT','pink')],['SIDE',pill('SIDE','blue')],['TOP',pill('TOP','green')],['NOTE',pill('NOTE','yellow')],['KEY',pill('KEY','purple')],
 ['Fact card',{txt:'FACT 1\nIsme likho…',skin:'fact',w:300}],['Bubble',{txt:'Socho!',skin:'bubble',w:220}],['T  Text',{txt:'Yahan likho…',w:300}],
 ['\u2B50',{txt:'\u2B50',skin:'emoji',w:120}],['\u2705',{txt:'\u2705',skin:'emoji',w:120}],['\u2757',{txt:'\u2757',skin:'emoji',w:120}],['\u2753',{txt:'\u2753',skin:'emoji',w:120}],
 ['\uD83D\uDCA1',{txt:'\uD83D\uDCA1',skin:'emoji',w:120}],['\uD83D\uDCCC',{txt:'\uD83D\uDCCC',skin:'emoji',w:120}],['\uD83D\uDD25',{txt:'\uD83D\uDD25',skin:'emoji',w:120}],['\uD83D\uDC4D',{txt:'\uD83D\uDC4D',skin:'emoji',w:120}],
 ['\uD83E\uDDE0',{txt:'\uD83E\uDDE0',skin:'emoji',w:120}],['\uD83C\uDFAF',{txt:'\uD83C\uDFAF',skin:'emoji',w:120}],
 ['Tape',{svg:TAPE('#f7b6c8','#e58aa5'),w:200,ar:.225,keep:true,k:'stk2'}],['Tape',{svg:TAPE('#fff2a8','#e0c85a'),w:200,ar:.225,keep:true,k:'stk2'}],
 ['Arrow',{svg:ARROW,w:200,ar:.6875,keep:true,k:'stk2'}],['Wave',{svg:WAVE,w:200,ar:.19,keep:true,k:'stk2'}]
];
const label=(l,o)=>o.skin&&o.skin!=='emoji'?`<span class="tx ${o.skin}">${o.skin==='fact'?'FACT':l}</span>`:o.skin==='emoji'?`<span class="tx emoji">${l}</span>`:`<span>${l}</span>`;
const grid=document.createElement('div');
grid.innerHTML=`<div class="hd">Stickers aur text (iPad jaisa)</div><div class="stg">${ITEMS.map((it,i)=>`<button data-st="${i}">${label(it[0],it[1])}</button>`).join('')}</div>`;
const g0=tools.querySelector('.grid');g0.parentNode.insertBefore(grid,g0.previousElementSibling);
grid.addEventListener('click',e=>{
  const b=e.target.closest('[data-st]');if(!b)return;
  const o=Object.assign({k:'txt'},ITEMS[+b.dataset.st][1]);
  const el=window.ToolsAPI&&ToolsAPI.add(o);B.classList.remove('tools');
  if(el&&o.k==='txt'&&o.skin!=='emoji'){const t=el.querySelector('.tx');if(t){t.focus();try{document.getSelection().selectAllChildren(t)}catch(_){}}}
});
})();
