/* smart.js: handwriting -> text (Google Input Tools, needs internet) and chapter-word spell check with a light red wavy underline + tap-to-fix. */
(function(){
'use strict';
const q=s=>document.querySelector(s),B=document.body;
const kv={get(k,d){try{const v=localStorage.getItem('bb_'+k);return v===null?d:v}catch(e){return d}},set(k,v){try{localStorage.setItem('bb_'+k,v)}catch(e){}}};

/* ---------- dictionary (lang/*.js files call registerWords) ---------- */
const W={set:new Set(),list:[],fixes:{},rules:[]};
window.WORDS=W;
window.registerWords=d=>{
  (d.words||[]).forEach(w=>{const l=w.toLowerCase();if(!W.set.has(l)){W.set.add(l);W.list.push(w)}});
  Object.keys(d.fixes||{}).forEach(k=>W.fixes[k.toLowerCase()]=d.fixes[k]);
  (d.rules||[]).forEach(r=>{try{W.rules.push([new RegExp(r[0],'gi'),r[1]])}catch(e){}});
  schedule();
};
window.loadWords=src=>{const s=document.createElement('script');s.src=src;s.onload=schedule;s.onerror=()=>{};document.head.appendChild(s)};
const dist=(a,b)=>{a=Array.from(a);b=Array.from(b);const m=a.length,n=b.length;let p=Array.from({length:n+1},(_,j)=>j);
  for(let i=1;i<=m;i++){const c=[i];for(let j=1;j<=n;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=c}return p[n]};
const TOK=/[\p{L}\p{M}\p{N}]+/gu;
function fixFor(w){
  const l=w.toLowerCase();
  if(W.set.has(l))return null;
  if(W.fixes[l])return W.fixes[l];
  const len=Array.from(w).length;if(len<3)return null;
  const lim=len<=4?1:len<=8?2:3;let best=null,bd=99;
  for(const c of W.list){if(Math.abs(Array.from(c).length-len)>lim)continue;const d=dist(l,c.toLowerCase());if(d>0&&d<=lim&&d<bd){bd=d;best=c}}
  return best;
}
function issues(text){
  const out=[];let m;TOK.lastIndex=0;
  while((m=TOK.exec(text))){const f=fixFor(m[0]);if(f)out.push({s:m.index,e:m.index+m[0].length,fix:f})}
  W.rules.forEach(([re,rep])=>{re.lastIndex=0;let r;while((r=re.exec(text))){if(!r[0])break;out.push({s:r.index,e:r.index+r[0].length,fix:r[0].replace(new RegExp(re.source,'i'),rep)})}});
  return out;
}
const autofix=t=>{issues(t).sort((a,b)=>b.s-a.s).forEach(i=>{t=t.slice(0,i.s)+i.fix+t.slice(i.e)});return t};

/* ---------- red wavy underline + tap to fix ---------- */
const st=document.createElement('style');
st.textContent=`::highlight(badw){text-decoration:underline wavy rgba(255,70,70,.45);text-decoration-thickness:2px}
#fixchip{position:fixed;z-index:45;display:none;min-height:34px;padding:2px 12px;font-size:15px;border-radius:999px;background:#fff;color:#b00020;border:2px solid #e57373;box-shadow:0 4px 12px #0006}`;
document.head.appendChild(st);
const chip=document.createElement('button');chip.id='fixchip';document.body.appendChild(chip);
let BAD=[],timer=0,pending=null;
function check(){
  BAD=[];
  document.querySelectorAll('#objs .tx').forEach(tx=>{
    const tw=document.createTreeWalker(tx,NodeFilter.SHOW_TEXT);let n;
    while((n=tw.nextNode())){issues(n.data).forEach(i=>{const r=document.createRange();r.setStart(n,i.s);r.setEnd(n,i.e);BAD.push({range:r,fix:i.fix})})}
  });
  if(window.CSS&&CSS.highlights&&window.Highlight){
    if(BAD.length)CSS.highlights.set('badw',new Highlight(...BAD.map(b=>b.range)));else CSS.highlights.delete('badw');
  }
}
function schedule(){clearTimeout(timer);timer=setTimeout(check,500)}
const layer=q('#objs');
if(layer)new MutationObserver(schedule).observe(layer,{subtree:true,childList:true,characterData:true});
document.addEventListener('pointerdown',e=>{if(e.target!==chip)chip.style.display='none'},true);
document.addEventListener('pointerup',e=>{
  if(!BAD.length||!(e.target.closest&&e.target.closest('.obj[data-k=txt]')))return;
  let node,off;
  if(document.caretPositionFromPoint){const p=document.caretPositionFromPoint(e.clientX,e.clientY);if(p){node=p.offsetNode;off=p.offset}}
  else if(document.caretRangeFromPoint){const r=document.caretRangeFromPoint(e.clientX,e.clientY);if(r){node=r.startContainer;off=r.startOffset}}
  if(!node)return;
  const hit=BAD.find(b=>{try{return b.range.isPointInRange(node,off)}catch(_){return false}});
  if(!hit)return;
  const r=hit.range.getBoundingClientRect();
  chip.textContent='Fix \u2192 '+hit.fix;chip.style.left=Math.max(6,Math.min(innerWidth-160,r.left))+'px';chip.style.top=Math.max(6,r.top-42)+'px';chip.style.display='block';
  chip.onclick=()=>{hit.range.deleteContents();hit.range.insertNode(document.createTextNode(hit.fix));chip.style.display='none';schedule()};
});
loadWords('lang/common.js');

/* ---------- handwriting -> text ---------- */
const pb=q('#penbar');
if(pb){
  const row=document.createElement('div');row.className='pr more';
  row.innerHTML='<button id="ocrBtn">\u270D \u2192 Text</button><button id="ocrLang">OCR: '+(kv.get('ocr','en')==='hi'?'HI':'EN')+'</button>';
  pb.insertBefore(row,pb.lastElementChild);
}
const EP={en:'en-t-i0-handwrit',hi:'hi-t-i0-handwrit'};
async function recognize(strokes,lang,w,h){
  const ink=strokes.map(s=>{const xs=[],ys=[],ts=[];s.forEach((p,i)=>{xs.push(Math.round(p[0]));ys.push(Math.round(p[1]));ts.push(i*20)});return[xs,ys,ts]});
  const url='https://inputtools.google.com/request?itc='+EP[lang]+'&app=demopage';
  const body=JSON.stringify({options:'enable_pre_space',requests:[{writing_guide:{writing_area_width:Math.round(w),writing_area_height:Math.round(h)},ink,language:lang}]});
  let r;
  try{r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body})}
  catch(e){r=await fetch(url,{method:'POST',headers:{'Content-Type':'text/plain;charset=UTF-8'},body})}  /* no CORS preflight */
  const j=await r.json();
  if(j[0]!=='SUCCESS')throw new Error('recognition failed');
  return j[1][0][1];
}
async function convert(){
  const I=ToolsAPI.ink,all=I.get(),IW=I.IW(),IH=I.IH(),lang=kv.get('ocr','en');
  const cand=all.map((s,i)=>({s,i})).filter(o=>o.s.k!=='h'&&!((o.s.t==='ell'||o.s.t==='line'||o.s.t==='poly')&&!o.s.o));
  if(!cand.length){alert('Pehle pen se kuch likho.');return}
  const bx=cand.map(o=>{const pp=o.s.o||o.s.p,xs=pp.map(p=>p[0]*IW),ys=pp.map(p=>p[1]*IH);return{o,x0:Math.min(...xs),x1:Math.max(...xs),y0:Math.min(...ys),y1:Math.max(...ys)}});
  const hs=bx.map(b=>b.y1-b.y0).sort((a,b)=>a-b),med=hs[hs.length>>1]||20,px=Math.max(24,Math.min(80,med*1.1)),py=Math.max(8,med*.25);
  const par=bx.map((_,i)=>i),f=i=>par[i]===i?i:(par[i]=f(par[i]));
  for(let i=0;i<bx.length;i++)for(let j=i+1;j<bx.length;j++){const A=bx[i],C=bx[j];
    if(A.x0-px<=C.x1&&C.x0-px<=A.x1&&A.y0-py<=C.y1&&C.y0-py<=A.y1)par[f(i)]=f(j)}
  const groups={};bx.forEach((b,i)=>(groups[f(i)]=groups[f(i)]||[]).push(b));
  const gone=new Set();let failed=0;
  for(const g of Object.values(groups)){
    g.sort((a,b)=>a.x0-b.x0);
    const x0=Math.min(...g.map(b=>b.x0)),x1=Math.max(...g.map(b=>b.x1)),y0=Math.min(...g.map(b=>b.y0)),y1=Math.max(...g.map(b=>b.y1));
    try{
      const pts=g.map(b=>{const pp=b.o.s.o||b.o.s.p;return(pp.length<2?[pp[0],pp[0]]:pp).map(p=>[p[0]*IW-x0,p[1]*IH-y0])});
      const cands=await recognize(pts,lang,x1-x0+1,y1-y0+1);
      const best=cands.find(c=>issues(c).length===0)||cands[0];
      const text=autofix(best);
      const el=ToolsAPI.add({k:'txt',txt:text,x:x0-12,y:y0-10,w:Math.max(140,(x1-x0)*1.3+30)});
      const t=el&&el.querySelector('.tx');if(t)t.style.fontSize=Math.max(20,Math.min(64,(y1-y0)*.75))+'px';
      g.forEach(b=>gone.add(b.o.i));
    }catch(err){failed++}
  }
  I.set(all.filter((_,i)=>!gone.has(i)));
  schedule();
  if(failed)alert('Kuch likha hua convert nahi ho paya (internet ya service ki dikkat). Wo ink waisi hi rakhi hai.');
}
if(pb)pb.addEventListener('click',async e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.id==='ocrLang'){const n=kv.get('ocr','en')==='en'?'hi':'en';kv.set('ocr',n);b.textContent='OCR: '+n.toUpperCase()}
  else if(b.id==='ocrBtn'){const t=b.textContent;b.textContent='\u2026';try{await convert()}finally{b.textContent=t}}
});
window.SmartText={issues,autofix,convert};
})();
