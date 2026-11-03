/* saved.js: save image / PDF / page links inside the app (stays in this browser, no GitHub deploy needed).
   The screen has no delete button on purpose: remove an item from saved-config.js (LIB_HIDE). */
(function(){
'use strict';
const q=s=>document.querySelector(s),B=document.body,tools=q('#tools'),KEY='bb_savedlib';
const st=document.createElement('style');
st.textContent=`.svin{flex:1 1 140px;font:inherit;font-size:16px;color:var(--ink);background:var(--bg);border:2px solid var(--edge);border-radius:10px;padding:6px 10px;min-height:44px;min-width:0}
#svList{display:flex;flex-wrap:wrap;gap:6px}#svList button{flex:0 1 auto;min-height:40px;font-size:14px;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.svnote{font-size:12px;color:var(--mute)}`;
document.head.appendChild(st);
tools.insertAdjacentHTML('beforeend',`<div class="hd">Saved library: save links, no GitHub deploy needed</div>
<div class="rw"><input id="svName" class="svin" placeholder="Name (optional)"><select id="svType" aria-label="Type"><option value="auto">Auto</option><option value="image">Image</option><option value="pdf">PDF</option><option value="page">Page / animation</option></select></div>
<div class="rw"><input id="svUrl" class="svin" type="url" placeholder="Direct link to image or PDF" aria-label="Link"><button id="svAdd" class="go">Save</button></div>
<div id="svList" aria-label="Saved items"></div>
<div class="svnote">Saved items stay in this browser. To remove, use LIB_HIDE in saved-config.js.</div>`);
const IMG=/\.(png|jpe?g|gif|webp|svg|avif|bmp)$/i;
const kind=u=>{const p=u.split('#')[0].split('?')[0].toLowerCase();return p.endsWith('.pdf')?'pdf':IMG.test(p)?'image':'page'};
function norm(u,type){
  u=(u||'').trim();if(!u)return null;
  if(!/^(https?:|data:|blob:)/i.test(u))u='https://'+u;
  let m=u.match(/drive\.google\.com\/file\/d\/([^/?#]+)/)||(/drive\.google\.com\/(open|uc)/.test(u)&&u.match(/[?&]id=([^&#]+)/));
  if(m)return type==='image'?`https://drive.google.com/uc?export=view&id=${m[1]}`:`https://drive.google.com/file/d/${m[1]}/preview`;
  if(/\/\/(www\.)?dropbox\.com/.test(u))return u.replace(/\/\/(www\.)?dropbox\.com/,'//dl.dropboxusercontent.com');
  m=u.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/i);
  if(m)return type==='image'?`https://raw.githubusercontent.com/${m[1]}/${m[2]}/${m[3]}/${m[4]}`:`https://${m[1].toLowerCase()}.github.io/${m[2]}/${m[4]}`;
  return u;
}
let saved=[];try{saved=JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){saved=[]}
const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(saved))}catch(e){alert('Could not save (browser storage is disabled).')}};
const hidden=it=>(window.LIB_HIDE||[]).some(h=>h===it.url||h===it.name);
const all=()=>[...(window.LIB_PRESET||[]),...saved].filter(it=>it&&it.url&&!hidden(it));
const icon=t=>t==='image'?'\uD83D\uDDBC':t==='pdf'?'\uD83D\uDCC4':'\uD83C\uDF10';
function render(){
  const L=q('#svList');if(!L)return;
  L.innerHTML='';
  all().forEach(it=>{const b=document.createElement('button');b.textContent=icon(it.type)+' '+(it.name||it.url);b.title=it.url;b.onclick=()=>place(it);L.appendChild(b)});
  if(!L.children.length)L.innerHTML='<span class="svnote">No saved items yet.</span>';
}
function place(it){
  if(!window.ToolsAPI)return;
  const W=innerWidth,H=innerHeight;
  if(it.type==='image')ToolsAPI.add({k:'img',src:it.url,w:Math.min(W*.4,420),keep:true});
  else{
    const u=it.type==='pdf'&&!/drive\.google|#/.test(it.url)?it.url+'#view=FitH':it.url;
    ToolsAPI.add({k:'emb',embed:u,w:W*.62,h:H*.55,x:W*.19,y:H*.2});
  }
  B.classList.remove('tools');
}
q('#svAdd').onclick=()=>{
  const sel=q('#svType').value,raw=q('#svUrl').value.trim();if(!raw)return;
  const type=sel==='auto'?kind(raw.replace(/^data:image\/.*/i,'x.png')):sel,url=norm(raw,type);
  if(!url)return;
  if(all().some(it=>it.url===url)){q('#svUrl').value='';return}
  const name=q('#svName').value.trim()||decodeURIComponent((url.split('#')[0].split('?')[0].split('/').pop()||'link')).slice(0,26);
  saved.push({name,url,type,t:Date.now()});persist();render();
  q('#svUrl').value='';q('#svName').value='';
};
window.SavedLib={norm,kind,all};
render();
})();
