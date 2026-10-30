
(function(){
'use strict';
const q=s=>document.querySelector(s),B=document.body;
const kv={get(k,d){try{const v=localStorage.getItem('bb_'+k);return v===null?d:v}catch(e){return d}},set(k,v){try{localStorage.setItem('bb_'+k,v)}catch(e){}}};
const st=document.createElement('style');
st.textContent=`
:root{--gl:color-mix(in srgb,var(--ink) 20%,transparent);--gs:clamp(32px,5vh,60px)}
#wrap::before{content:'';position:absolute;inset:0;pointer-events:none}
body[data-grid=notebook] #wrap::before{background:linear-gradient(to right,transparent calc(var(--gs)*1.6),#e5393566 calc(var(--gs)*1.6),#e5393566 calc(var(--gs)*1.6 + 2px),transparent calc(var(--gs)*1.6 + 2px)),repeating-linear-gradient(to bottom,transparent 0,transparent calc(var(--gs) - 1px),var(--gl) calc(var(--gs) - 1px),var(--gl) var(--gs))}
body[data-grid=graph] #wrap::before{background:linear-gradient(to right,var(--gl) 1px,transparent 1px) 0 0/var(--gs) var(--gs),linear-gradient(to bottom,var(--gl) 1px,transparent 1px) 0 0/var(--gs) var(--gs)}
body[data-grid=iso] #wrap::before{background:repeating-linear-gradient(30deg,var(--gl) 0 1px,transparent 1px var(--gs)),repeating-linear-gradient(150deg,var(--gl) 0 1px,transparent 1px var(--gs)),repeating-linear-gradient(90deg,var(--gl) 0 1px,transparent 1px var(--gs))}
body[data-grid=staff] #wrap::before{background:linear-gradient(to bottom,var(--gl) 0 2px,transparent 2px 14px,var(--gl) 14px 16px,transparent 16px 28px,var(--gl) 28px 30px,transparent 30px 42px,var(--gl) 42px 44px,transparent 44px 56px,var(--gl) 56px 58px,transparent 58px 170px) 0 0/100% 170px repeat-y}
.obj .lk{position:absolute;left:-12px;top:-12px;width:30px;height:30px;min-height:0;padding:0;border-radius:50%;font-size:14px;opacity:.8;z-index:4;line-height:1}
.obj.locked{pointer-events:none}.obj.locked .lk{pointer-events:auto;opacity:1}
.obj.grp{outline:2px dotted var(--yl);outline-offset:3px}
.obj[data-k=stk] .ob img{border:6px solid #fff;border-radius:16px;box-shadow:0 5px 16px #0009;background:#fff}
#clk{position:fixed;z-index:21;left:12px;top:70px;width:230px;background:var(--panel);border:3px solid var(--edge);border-radius:16px;padding:8px 10px;display:none;box-shadow:0 8px 24px #0008}
#clk.on{display:block}
#clk .ch{display:flex;justify-content:space-between;align-items:center;cursor:move;font-size:14px;touch-action:none;padding-bottom:4px}
#clk button{min-height:38px;min-width:38px;padding:2px 8px;font-size:15px}
#ct{font-size:44px;font-weight:700;text-align:center;font-variant-numeric:tabular-nums;line-height:1.1}
#clk .cb{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}#clk .cb>*{flex:1}
#clk.warn #ct{color:var(--yl)}#clk.end #ct{color:var(--rd)}
#clk.pulse,#clkfab.pulse{animation:cpulse .6s 5}@keyframes cpulse{50%{box-shadow:0 0 0 10px #ffd54a88}}
#ccfg{display:none;margin-top:6px;gap:6px;flex-direction:column;font-size:13px}#clk.cfg #ccfg{display:flex}
#ccfg input,#ccfg select{font:inherit;font-size:15px;color:var(--ink);background:var(--bg);border:2px solid var(--edge);border-radius:8px;padding:4px 6px;min-height:38px;width:100%}
#clkfab{top:178px;font-size:12px;font-weight:700}
@media (prefers-reduced-motion:reduce){#clk.pulse,#clkfab.pulse{animation:none}}`;
document.head.appendChild(st);


const tools=q('#tools');
tools.insertAdjacentHTML('beforeend',`<div class="hd">Sticker / image (Google se copy karke paste karo)</div>
<div class="rw"><button id="xPaste">&#128203; Paste image</button><button id="xFile">&#128444; Image file</button><input id="xIn" type="file" accept="image/*" hidden></div>
<div class="hd">Sticky note and background</div>
<div class="rw"><button id="xNote">&#128221; Sticky note</button><select id="xGrid" aria-label="Background grid"><option value="">Grid: none</option><option value="notebook">Notebook lines</option><option value="graph">Graph paper</option><option value="iso">Isometric</option><option value="staff">Music staff</option></select></div>`);
const setGrid=g=>{if(g)B.dataset.grid=g;else delete B.dataset.grid;kv.set('grid',g||'');q('#xGrid').value=g||''};
setGrid(kv.get('grid',''));
q('#xGrid').onchange=e=>{setGrid(e.target.value);B.classList.remove('tools')};
const closeTools=()=>B.classList.remove('tools');
q('#xNote').onclick=()=>{closeTools();window.addNoteFree&&addNoteFree()};


function addImg(blob){
  const mk=url=>window.ToolsAPI&&ToolsAPI.add({k:'stk',src:url,w:Math.min(innerWidth*.4,420),keep:true});
  const raw=()=>{const r=new FileReader();r.onload=()=>mk(r.result);r.readAsDataURL(blob)};
  if(!window.createImageBitmap)return raw();
  createImageBitmap(blob).then(bm=>{
    const k=Math.min(1,1000/Math.max(bm.width,bm.height)),c=document.createElement('canvas');
    c.width=Math.round(bm.width*k);c.height=Math.round(bm.height*k);c.getContext('2d').drawImage(bm,0,0,c.width,c.height);
    mk(c.toDataURL('image/png'));
  }).catch(raw);
}
document.addEventListener('paste',e=>{
  const it=[...((e.clipboardData&&e.clipboardData.items)||[])].find(i=>i.type.startsWith('image/'));
  if(it){e.preventDefault();addImg(it.getAsFile())}
});
document.addEventListener('dragover',e=>e.preventDefault());
document.addEventListener('drop',e=>{
  const f=[...((e.dataTransfer&&e.dataTransfer.files)||[])].find(f=>f.type.startsWith('image/'));
  if(f){e.preventDefault();addImg(f)}
});
q('#xFile').onclick=()=>q('#xIn').click();
q('#xIn').onchange=e=>{const f=e.target.files[0];if(f){addImg(f);closeTools()}e.target.value=''};
q('#xPaste').onclick=async()=>{
  try{
    const items=await navigator.clipboard.read();
    for(const it of items){const t=it.types.find(t=>t.startsWith('image/'));if(t){addImg(await it.getType(t));closeTools();return}}
    alert('Clipboard mein koi image nahi mili.');
  }catch(err){alert('Browser ne paste ki ijazat nahi di. Image ko board par drop karo, ya "Image file" chuno.')}
};


const clk=document.createElement('div');clk.id='clk';
clk.innerHTML=`<div class="ch"><span>&#9201; Timer</span><span><button data-k="cfg" aria-label="Settings">&#9881;</button><button data-k="x" aria-label="Hide timer (keeps running)">&#10005;</button></span></div>
<div id="ct">00:00</div>
<div class="cb"><button data-k="go" class="go">&#9654;</button><button data-k="rs">&#8634;</button><button data-k="stop">&#9632;</button></div>
<div class="cb"><button data-s="10">10s</button><button data-s="30">30s</button><button data-s="60">1m</button><button data-s="120">2m</button><button data-s="300">5m</button></div>
<div id="ccfg"><select id="cmode"><option value="sw">Stopwatch</option><option value="cd">Countdown (minutes)</option><option value="at">Class ends at (clock time)</option></select>
<label>Minutes<input id="cmin" type="number" min="0" step="0.5" value="40"></label>
<label>Class end time<input id="cat" type="time" value="13:30"></label>
<label>Soft alert before end (min)<input id="cwarn" type="number" min="0" step="1" value="5"></label>
<div class="cb" id="cpre"></div><button data-k="save">&#128190; Save as preset</button></div>`;
document.body.appendChild(clk);
const fab=document.createElement('button');fab.id='clkfab';fab.className='fab';fab.innerHTML='&#9201;';fab.setAttribute('aria-label','Timer');document.body.appendChild(fab);
const T={mode:'sw',run:false,t0:0,acc:0,dur:0,warn:0,w1:false};
let ac=null,pre=[];
try{pre=JSON.parse(kv.get('clkpre','null'))||[{m:40,w:5},{m:35,w:5},{m:45,w:10}]}catch(e){pre=[{m:40,w:5}]}
const audio=()=>{try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume()}catch(e){}};
const beep=(f,ms,v)=>{try{audio();const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=f;o.type='sine';g.gain.value=v;o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+ms/1000)}catch(e){}};
const vib=p=>{try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
const pulse=()=>{[clk,fab].forEach(e=>{e.classList.remove('pulse');void e.offsetWidth;e.classList.add('pulse')})};
const gentle=()=>{beep(523,160,.03);setTimeout(()=>beep(659,200,.03),240);vib([120,80,120]);pulse();clk.classList.add('warn')};
const final=()=>{[0,350,700].forEach(t=>setTimeout(()=>beep(784,250,.07),t));vib([300,150,300,150,300]);pulse();clk.classList.remove('warn');clk.classList.add('end')};
const el_=()=>T.acc+(T.run?Date.now()-T.t0:0),rem=()=>T.dur-el_();
const fmt=ms=>{const s=Math.max(0,Math.round(ms/1000)),h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60,p=n=>String(n).padStart(2,'0');return h?`${h}:${p(m)}:${p(x)}`:`${p(m)}:${p(x)}`};
function draw(){
  const ms=T.mode==='sw'?el_():Math.max(0,rem());
  q('#ct').textContent=fmt(T.mode==='sw'?ms:Math.ceil(ms/1000)*1000);
  q('[data-k=go]').innerHTML=T.run?'&#10074;&#10074;':'&#9654;';
  fab.textContent=(T.run||T.acc)?fmt(ms).replace(/^00:/,''):'\u23F1';
}
function init(){
  T.mode=q('#cmode').value;T.warn=Math.max(0,parseFloat(q('#cwarn').value)||0);T.w1=false;T.acc=0;
  clk.classList.remove('warn','end');
  if(T.mode==='cd')T.dur=Math.round((parseFloat(q('#cmin').value)||0)*60000);
  else if(T.mode==='at'){const [h,m]=q('#cat').value.split(':').map(Number),d=new Date();d.setHours(h||0,m||0,0,0);let ms=d-Date.now();if(ms<=0)ms+=864e5;T.dur=ms}
}
function go(){audio();if(T.run){T.acc+=Date.now()-T.t0;T.run=false}else{if(!T.acc)init();T.t0=Date.now();T.run=true}draw()}
function stop(){T.run=false;T.acc=0;T.w1=false;clk.classList.remove('warn','end','pulse');fab.classList.remove('pulse');draw()}
function quick(s){audio();q('#cmode').value='cd';q('#cmin').value=s/60;q('#cwarn').value=0;T.run=false;T.acc=0;init();T.t0=Date.now();T.run=true;draw()}
setInterval(()=>{
  if(T.mode!=='sw'&&T.run){
    const r=rem();
    if(T.warn>0&&!T.w1&&r>0&&r<=T.warn*60000&&T.dur>T.warn*60000){T.w1=true;gentle()}
    if(r<=0){T.run=false;T.acc=T.dur;final()}
  }
  draw();
},250);
function renderPre(){
  q('#cpre').innerHTML=pre.map((p,i)=>`<button data-i="${i}">${p.m}m / ${p.w}m <span data-del="${i}" style="opacity:.6">&#10005;</span></button>`).join('');
}
renderPre();
clk.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(e.target.dataset.del!=null){pre.splice(+e.target.dataset.del,1);kv.set('clkpre',JSON.stringify(pre));renderPre();return}
  if(b.dataset.i!=null){const p=pre[+b.dataset.i];q('#cmode').value='cd';q('#cmin').value=p.m;q('#cwarn').value=p.w;stop();init();T.t0=Date.now();T.run=true;audio();draw();return}
  if(b.dataset.s)return quick(+b.dataset.s);
  const k=b.dataset.k;
  if(k==='x')clk.classList.remove('on');
  else if(k==='cfg')clk.classList.toggle('cfg');
  else if(k==='go')go();
  else if(k==='rs'){const was=T.run;stop();if(was){init();T.t0=Date.now();T.run=true}draw()}
  else if(k==='stop')stop();
  else if(k==='save'){pre.push({m:parseFloat(q('#cmin').value)||0,w:parseFloat(q('#cwarn').value)||0});kv.set('clkpre',JSON.stringify(pre));renderPre()}
});
q('#cmode').onchange=()=>{if(!T.run)stop()};
fab.onclick=()=>clk.classList.toggle('on');
const head=clk.querySelector('.ch');
head.addEventListener('pointerdown',e=>{
  if(e.target.closest('button'))return;
  const r=clk.getBoundingClientRect(),dx=e.clientX-r.left,dy=e.clientY-r.top;head.setPointerCapture(e.pointerId);
  const mv=ev=>{clk.style.left=Math.max(0,Math.min(innerWidth-80,ev.clientX-dx))+'px';clk.style.top=Math.max(0,Math.min(innerHeight-60,ev.clientY-dy))+'px'};
  const up=()=>{head.removeEventListener('pointermove',mv);head.removeEventListener('pointerup',up)};
  head.addEventListener('pointermove',mv);head.addEventListener('pointerup',up);
});
draw();
})();
