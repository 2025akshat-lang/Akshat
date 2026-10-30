
(function(){
'use strict';
const q=s=>document.querySelector(s),B=document.body,tools=q('#tools');
if(!tools||!window.ToolsAPI)return;


function direct(u){
  u=(u||'').trim();
  let m=u.match(/drive\.google\.com\/file\/d\/([\w-]+)/)||u.match(/drive\.google\.com\/(?:open|uc|thumbnail)\?(?:[^#]*&)?id=([\w-]+)/);
  if(m)return 'https://drive.google.com/thumbnail?id='+m[1]+'&sz=w2000';
  m=u.match(/^https?:\/\/(?:www\.)?imgur\.com\/(\w+)$/i);
  if(m&&!/^(a|gallery)$/i.test(m[1]))return 'https://i.imgur.com/'+m[1]+'.jpg';
  return u;
}

const sec=document.createElement('div');
sec.innerHTML=`<div class="hd">Meri image library (images.json se)</div>
<div class="rw"><select id="libSel" aria-label="Image library" style="flex:3 1 180px"><option value="">Loading…</option></select><button id="libAdd" class="go">Add</button><button id="libRef" aria-label="Reload list">&#8635;</button></div>
<div class="hd" id="libMsg"></div>`;
tools.insertBefore(sec,tools.children[1]||null);

const sel=q('#libSel'),msg=q('#libMsg');
let list=[];

function build(){
  sel.innerHTML='';
  if(!list.length){sel.innerHTML='<option value="">(images.json khaali hai)</option>';return}
  const ph=document.createElement('option');ph.value='';ph.textContent='Image chuno ('+list.length+')';sel.appendChild(ph);
  const groups={};
  list.forEach((it,i)=>{const g=it.group||'';(groups[g]=groups[g]||[]).push([it,i])});
  Object.keys(groups).forEach(g=>{
    const host=g?Object.assign(document.createElement('optgroup'),{label:g}):sel;
    groups[g].forEach(([it,i])=>{const o=document.createElement('option');o.value=i;o.textContent=it.title||('Image '+(i+1));host.appendChild(o)});
    if(g)sel.appendChild(host);
  });
}

async function loadList(){
  msg.textContent='';
  try{
    const r=await fetch('images.json?'+Date.now(),{cache:'no-store'});
    if(!r.ok)throw new Error(r.status);
    const d=await r.json();
    list=(Array.isArray(d)?d:(d.images||[])).filter(x=>x&&x.url);
    build();
  }catch(e){
    list=[];sel.innerHTML='<option value="">images.json nahi mili</option>';
    msg.textContent='images.json repo mein index.html ke saath rakho aur JSON format check karo.';
  }
}

q('#libAdd').onclick=()=>{
  const i=sel.value;if(i==='')return;
  const it=list[+i];if(!it)return;
  const el=ToolsAPI.add({k:'obj',src:direct(it.url),alt:it.title||'',keep:true,w:it.w});
  ToolsAPI.pick(el);
  B.classList.remove('tools');
};
sel.onchange=()=>{};
q('#libRef').onclick=loadList;
loadList();
})();
