/* tools.js: shapes, angle tool, movable objects, embedded animations and the upgraded pen. */
(function(){
'use strict';
const q=s=>document.querySelector(s),wrapEl=q('#wrap'),ink=q('#ink'),cx=ink.getContext('2d'),B=document.body;
const spd=()=>typeof speed==='function'?speed():1;
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const closeText=()=>{try{typeof closeTb==='function'&&closeTb()}catch(e){}};
const st=document.createElement('style');
st.textContent=`
#objs{position:absolute;inset:0;pointer-events:none}
.obj{position:absolute;pointer-events:auto;touch-action:none;color:var(--ink);--sw:clamp(4px,.5vw + .5vh,9px)}
.obj[data-k=prot],.obj[data-k=ang]{--sw:2px}
body.play .obj:not([data-k=emb]){outline:2px dotted var(--cy);outline-offset:3px;cursor:pointer}
.obj.sel{outline:3px dashed var(--yl)!important;outline-offset:4px}
.ob{width:100%;height:100%}
.ob svg,.ob img{width:100%;height:100%;display:block;overflow:visible}.ob img{object-fit:contain}
.s{fill:none;stroke:currentColor;stroke-width:var(--sw);stroke-linejoin:round;stroke-linecap:round;vector-effect:non-scaling-stroke}
.d{stroke-dasharray:8 7}.pbd{fill:currentColor;fill-opacity:.1}
.ob.fl .f{fill:currentColor;fill-opacity:.25}
.oc{position:absolute;left:50%;bottom:100%;transform:translate(-50%,-8px);display:none;gap:4px;background:var(--panel);border:2px solid var(--edge);border-radius:12px;padding:4px;white-space:nowrap;z-index:3}
.obj.sel .oc{display:flex}.obj.below .oc{bottom:auto;top:100%;transform:translate(-50%,8px)}
.oc button{min-height:38px;min-width:38px;padding:2px 8px;font-size:15px}
.rs{position:absolute;right:-16px;bottom:-16px;width:32px;height:32px;border-radius:50%;background:var(--ink);border:3px solid var(--bg);display:none;touch-action:none}
.obj.sel .rs{display:block}
.oh{height:34px;background:var(--panel);border:2px solid var(--edge);border-radius:8px 8px 0 0;display:flex;justify-content:space-between;align-items:center;padding:0 10px;cursor:move;touch-action:none;font-size:14px}
.obj[data-k=emb] .ob{height:calc(100% - 34px)}.obj iframe{width:100%;height:100%;border:0;background:#fff}
#tools{position:fixed;left:0;right:0;bottom:0;z-index:30;margin:0 auto;max-width:700px;max-height:86dvh;overflow:auto;background:var(--panel);border-top:3px solid var(--edge);border-radius:18px 18px 0 0;padding:14px 14px calc(16px + env(safe-area-inset-bottom));display:flex;flex-direction:column;gap:10px;transform:translateY(105%);transition:transform .28s ease;visibility:hidden}
body.tools #tools{transform:none;visibility:visible}
#toolsBg{position:fixed;inset:0;z-index:25;background:#0008;display:none}body.tools #toolsBg{display:block}
#toolfab{top:122px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(76px,1fr));gap:8px}
.shb{display:flex;flex-direction:column;align-items:center;gap:2px;padding:6px 2px;font-size:12px;min-height:76px}
.mini{width:42px;height:42px;color:var(--ink)}.mini .s{stroke-width:4px}
.hd{font-size:13px;color:var(--mute);margin:2px 0 -4px}
.rw{display:flex;gap:6px;flex-wrap:wrap;align-items:center}.rw>*{flex:1 1 auto}
#emb{flex:3 1 160px;font:inherit;font-size:16px;color:var(--ink);background:var(--bg);border:2px solid var(--edge);border-radius:10px;padding:6px 10px;min-height:44px;min-width:0}
body.pen #penbar{display:flex;flex-direction:column;right:auto;left:50%;transform:translateX(-50%);bottom:8px;width:min(94vw,600px);gap:6px}
.pr{display:flex;gap:6px;flex-wrap:wrap;align-items:center}.pr .gap{flex:1}
#penbar.min .more{display:none}
.csw{width:40px;height:40px;padding:0!important;border-radius:50%!important;font-size:26px;line-height:1;min-height:40px!important}
.csw[aria-pressed=true]{background:var(--panel);box-shadow:0 0 0 3px var(--cy)}
#penbar [data-t][aria-pressed=true],#penbar [data-z][aria-pressed=true]{box-shadow:0 0 0 3px var(--cy)}
#penbar select{min-height:44px}
body.pen.penhide #penbar{display:none}
#penopt{display:none;top:66px;right:66px}body.pen.penhide #penopt{display:block}
@media (prefers-reduced-motion:reduce){.obj{transition:none}}`;
document.head.appendChild(st);

/* ---------- shapes ---------- */
const SH=[
['line','Line','<line class="s" x1="4" y1="50" x2="96" y2="50"/>',0,.25],
['square','Square','<rect class="s f" x="8" y="8" width="84" height="84"/>',1,1],
['rect','Rectangle','<rect class="s f" x="4" y="18" width="92" height="64"/>',0,.7],
['tri','Triangle','<polygon class="s f" points="50,8 95,92 5,92"/>',0,.9],
['rtri','Right triangle','<polygon class="s f" points="8,8 8,92 92,92"/>',0,.9],
['trap','Trapezium','<polygon class="s f" points="28,16 72,16 96,84 4,84"/>',0,.7],
['rhom','Rhombus','<polygon class="s f" points="50,6 94,50 50,94 6,50"/>',0,1],
['quad','Quadrilateral','<polygon class="s f" points="10,22 88,8 94,80 20,92"/>',0,1],
['pent','Pentagon','<polygon class="s f" points="50,7 93,38 76,88 24,88 7,38"/>',0,1],
['hex','Hexagon','<polygon class="s f" points="50,5 89,27 89,73 50,95 11,73 11,27"/>',0,1],
['circ','Circle','<circle class="s f" cx="50" cy="50" r="44"/>',1,1],
['ell','Ellipse','<ellipse class="s f" cx="50" cy="50" rx="46" ry="30"/>',0,.65],
['sph','Sphere','<circle class="s f" cx="50" cy="50" r="44"/><path class="s" d="M6 50A44 12 0 0 0 94 50"/><path class="s d" d="M6 50A44 12 0 0 1 94 50"/>',1,1],
['hemi','Hemisphere','<path class="s f" d="M6 58A44 44 0 0 1 94 58Z"/><path class="s" d="M6 58A44 12 0 0 0 94 58"/><path class="s d" d="M6 58A44 12 0 0 1 94 58"/>',0,.75],
['cube','Cube','<polygon class="s f" points="10,38 34,14 88,14 64,38"/><polygon class="s f" points="64,38 88,14 88,68 64,92"/><rect class="s f" x="10" y="38" width="54" height="54"/><path class="s d" d="M34 14V68H88M34 68L10 92"/>',1,1],
['cuboid','Cuboid','<polygon class="s f" points="8,40 34,14 94,14 68,40"/><polygon class="s f" points="68,40 94,14 94,60 68,86"/><rect class="s f" x="8" y="40" width="60" height="46"/><path class="s d" d="M34 14V60H94M34 60L8 86"/>',0,.8],
['cyl','Cylinder','<ellipse class="s f" cx="50" cy="20" rx="36" ry="10"/><path class="s" d="M14 20V80A36 10 0 0 0 86 80V20"/><path class="s d" d="M14 80A36 10 0 0 1 86 80"/>',0,1],
['cone','Cone','<polygon class="s f" points="50,6 88,82 12,82"/><path class="s" d="M12 82A38 11 0 0 0 88 82"/><path class="s d" d="M12 82A38 11 0 0 1 88 82"/>',0,.95]
];
const ANIMS=['slide','bounce','spin','shake','grow'];
const COLS=['','#e53935','#1e88e5','#43a047','#fb8c00','#8e24aa'];
const layer=document.createElement('div');layer.id='objs';wrapEl.insertBefore(layer,ink);
let objs=[],selEl=null,mode='drag',prot=null,gseed=null,gc=0;

function hostURL(u){
  u=(u||'').trim();if(!u)return '';
  if(!/^https?:\/\//i.test(u))u='https://'+u;
  let m=u.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/[^/]+\/(.+)$/i)||u.match(/^https?:\/\/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/[^/]+\/(.+)$/i);
  if(m)return `https://${m[1].toLowerCase()}.github.io/${m[2]}/${m[3]}`;
  m=u.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/?$/i);
  if(m)return `https://${m[1].toLowerCase()}.github.io/${m[2]}/`;
  return u;
}
function pick(el){
  if(selEl)selEl.classList.remove('sel');
  selEl=el;
  if(el){el.classList.add('sel');el.classList.toggle('below',el.offsetTop<70)}
}
function track(el,e,mv,tap){
  const x0=e.clientX,y0=e.clientY;let moved=false;
  try{el.setPointerCapture(e.pointerId)}catch(_){}
  const m=ev=>{const dx=ev.clientX-x0,dy=ev.clientY-y0;if(!moved&&Math.hypot(dx,dy)<8)return;moved=true;mv(dx,dy)};
  const u=ev=>{el.removeEventListener('pointermove',m);el.removeEventListener('pointerup',u);el.removeEventListener('pointercancel',u);
    if(moved)el.classList.toggle('below',el.offsetTop<70);
    if(!moved&&tap&&ev.type==='pointerup')tap(ev)};
  el.addEventListener('pointermove',m);el.addEventListener('pointerup',u);el.addEventListener('pointercancel',u);
}
function mk(o){
  const W=wrapEl.clientWidth,H=wrapEl.clientHeight,base=Math.max(130,Math.min(380,Math.min(W,H)*.34));
  const w=o.w||base,h=o.h||w*(o.ar||1),emb=o.k==='emb';
  const el=document.createElement('div');el.className='obj';el.dataset.k=o.k||'shape';
  const n=(objs.length%5)*18;
  el.style.cssText=`width:${w}px;height:${h}px;left:${o.x!=null?o.x:(W-w)/2+n}px;top:${o.y!=null?o.y:(H-h)/2+n}px`;
  el._o={keep:!!o.keep,ar:h/w,rot:0,anim:o.anim||'slide',emb,ang:60};
  const ob=document.createElement('div');ob.className='ob';
  if(o.svg)ob.innerHTML=o.svg;
  else if(o.src){
    const im=new Image();im.alt=o.alt||'';im.referrerPolicy='no-referrer';
    im.onload=()=>{if(!o.h){const r=im.naturalHeight/im.naturalWidth;el._o.ar=r;el.style.height=el.offsetWidth*r+'px'}};
    im.onerror=()=>{ob.textContent='Image load nahi hui'};im.src=o.src;ob.appendChild(im);
  }else if(o.txt!==undefined){
    const tx=document.createElement('div');tx.className='tx '+(o.skin||'');tx.contentEditable='true';tx.spellcheck=false;tx.textContent=o.txt;ob.appendChild(tx);el.style.height='auto';
  }else if(emb){
    const f=document.createElement('iframe');f.src=o.embed;f.loading='lazy';
    f.setAttribute('sandbox','allow-scripts allow-same-origin allow-forms allow-popups');f.title='Animation';ob.appendChild(f);
    const hd=document.createElement('div');hd.className='oh';
    hd.innerHTML='<span>&#10303; Animation</span><span><a href="'+o.embed.replace(/"/g,'')+'" target="_blank" rel="noopener" style="color:var(--cy)">&#8599; new tab</a></span>';
    el.appendChild(hd);
  }
  el.appendChild(ob);
  el.insertAdjacentHTML('beforeend','<div class="rs"></div>');
  const oc=document.createElement('div');oc.className='oc';
  const chips=o.k==='txt'?[['x','&#10005;'],['fn','Aa'],['sz-','A&minus;'],['sz+','A+'],['col','&#127912;'],['rot','&#8635;'],['up','&#11014;'],['dn','&#11015;'],['grp','&#128279;']]:emb?[['x','&#10005;']]:o.k==='prot'?[['x','&#10005;'],['a-','&minus;1&deg;'],['a+','+1&deg;'],['stamp','&#128204;'],['rot','&#8635;']]:
    [['x','&#10005;'],['fl','&#9680;'],['col','&#127912;'],['rot','&#8635;'],['up','&#11014;'],['dn','&#11015;'],['grp','&#128279;'],['an','&#127916; '+el._o.anim]];
  oc.innerHTML=chips.map(c=>`<button data-c="${c[0]}">${c[1]}</button>`).join('');
  el.appendChild(oc);
  if(!emb)el.insertAdjacentHTML('beforeend','<button class="lk" aria-label="Lock">&#128275;</button>');
  layer.appendChild(el);objs.push(el);el._home=null;
  el.addEventListener('pointerdown',e=>{
    if(e.target.closest('.oc'))return;
    const lk=e.target.closest('.lk');
    if(lk){e.stopPropagation();const Lk=!el._o.lock;el._o.lock=Lk;el.classList.toggle('locked',Lk);lk.innerHTML=Lk?'&#128274;':'&#128275;';if(Lk)pick(null);return}
    if(gseed&&gseed!==el&&!e.target.closest('.rs')){e.stopPropagation();el._gid=gseed._gid;el.classList.add('grp');return}
    e.stopPropagation();pick(el);
    if(e.target.closest('.rs')){
      const w0=el.offsetWidth,h0=el.offsetHeight;
      track(el,e,(dx,dy)=>{const nw=Math.max(40,w0+dx);el.style.width=nw+'px';el.style.height=el.dataset.k==='txt'?'auto':(el._o.keep?nw*el._o.ar:Math.max(emb?120:24,h0+dy))+'px'});
      return;
    }
    if(emb&&!e.target.closest('.oh'))return;
    const L0=el.offsetLeft,T0=el.offsetTop;
    const gm=el._gid?objs.filter(o=>o._gid===el._gid).map(o=>[o,o.offsetLeft,o.offsetTop]):[[el,L0,T0]];
    track(el,e,(dx,dy)=>{if(mode==='drag'||emb)gm.forEach(m=>{m[0].style.left=m[1]+dx+'px';m[0].style.top=m[2]+dy+'px'})},
      ev=>{if(el.dataset.k==='prot')setAng(el,protAng(el,ev));else if(el.dataset.k==='txt'){const t=el.querySelector('.tx');t&&t.focus()}else if(mode==='play'&&!emb)play(el)});
  });
  oc.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;const c=b.dataset.c,f=el._o;
    if(c==='x'){el.remove();objs=objs.filter(x=>x!==el);if(prot===el)prot=null;pick(null)}
    else if(c==='fn'||c==='sz-'||c==='sz+'){
      const t=el.querySelector('.tx');if(!t)return;
      if(c==='fn'){f.fi=((f.fi||0)+1)%FONTS.length;t.style.fontFamily=FONTS[f.fi]||''}
      else t.style.fontSize=(parseFloat(getComputedStyle(t).fontSize)*(c==='sz+'?1.15:.87))+'px';
    }
    else if(c==='col'&&el.dataset.k==='txt'){f.ci=((f.ci||0)+1)%COLS.length;const t=el.querySelector('.tx');t&&(t.style.color=COLS[f.ci]||'')}
    else if(c==='fl')ob.classList.toggle('fl');
    else if(c==='col'){f.ci=((f.ci||0)+1)%COLS.length;el.style.color=COLS[f.ci]||''}
    else if(c==='rot'){f.rot=(f.rot+15)%360;el.style.transform=`rotate(${f.rot}deg)`}
    else if(c==='an'){f.anim=ANIMS[(ANIMS.indexOf(f.anim)+1)%ANIMS.length];b.innerHTML='&#127916; '+f.anim}
    else if(c==='up')layer.appendChild(el);
    else if(c==='dn')layer.insertBefore(el,layer.firstChild);
    else if(c==='grp'){
      if(el._gid&&gseed!==el)objs.filter(o=>o._gid===el._gid).forEach(o=>{o._gid=null;o.classList.remove('grp')});
      else if(gseed===el)gseed=null;
      else{gseed=el;el._gid='g'+(++gc);el.classList.add('grp')}
    }
    else if(c==='a-')setAng(el,el._o.ang-1);else if(c==='a+')setAng(el,el._o.ang+1);
    else if(c==='stamp')stamp(el._o.ang);
  });
  return el;
}
function addShape(id){
  const s=SH.find(x=>x[0]===id);if(!s)return;
  const el=mk({k:'shape',svg:`<svg viewBox="0 0 100 100" preserveAspectRatio="none">${s[2]}</svg>`,keep:s[3],ar:s[4]});
  pick(el);
}

/* ---------- play / reset ---------- */
function play(el){
  const a=el._o.anim,d=800/spd(),L=wrapEl.clientWidth;let kf,done;
  if(a==='slide'){const dx=Math.min(L*.3,Math.max(120,el.offsetWidth*1.3));kf=[{translate:'0 0'},{translate:dx+'px 0'}];done=()=>{el.style.left=Math.min(el.offsetLeft+dx,L-el.offsetWidth*.5)+'px'}}
  else if(a==='bounce')kf=[{translate:'0 0'},{translate:'0 -55px'},{translate:'0 0'},{translate:'0 -26px'},{translate:'0 0'}];
  else if(a==='spin')kf=[{rotate:'0deg'},{rotate:'360deg'}];
  else if(a==='shake')kf=[{translate:'0 0'},{translate:'-14px 0'},{translate:'14px 0'},{translate:'-14px 0'},{translate:'14px 0'},{translate:'0 0'}];
  else kf=[{scale:1},{scale:1.4},{scale:1}];
  try{const an=el.animate(kf,{duration:d,easing:'ease-in-out'});an.onfinish=()=>done&&done()}catch(e){done&&done()}
}
function home(){objs.forEach(el=>{el._home={l:el.style.left,t:el.style.top,w:el.style.width,h:el.style.height,r:el._o.rot}})}
function setMode(m){
  mode=m;B.classList.toggle('play',m==='play');
  q('#mDrag').setAttribute('aria-pressed',m==='drag');q('#mPlay').setAttribute('aria-pressed',m==='play');
  if(m==='play')home();
}
function resetObjs(){objs.forEach(el=>{const h=el._home;if(!h)return;el.style.left=h.l;el.style.top=h.t;el.style.width=h.w;el.style.height=h.h;el._o.rot=h.r;el.style.transform=`rotate(${h.r}deg)`})}
function clearObjs(){objs.forEach(e=>e.remove());objs=[];prot=null;selEl=null}

/* ---------- angle tool ---------- */
function protSvg(){
  let t='<svg viewBox="0 0 200 108" preserveAspectRatio="xMidYMid meet"><path class="s pbd" d="M5 100A95 95 0 0 1 195 100Z"/>';
  for(let a=0;a<=180;a+=5){
    const r=a*Math.PI/180,c=Math.cos(r),s=Math.sin(r),L=a%30===0?16:a%10===0?11:6;
    t+=`<line class="s" x1="${100+95*c}" y1="${100-95*s}" x2="${100+(95-L)*c}" y2="${100-(95-L)*s}"/>`;
    if(a%30===0||a===45||a===135)t+=`<text x="${100+72*c}" y="${100-72*s+3}" font-size="9" text-anchor="middle" fill="currentColor">${a}</text>`;
  }
  return t+'<line class="s ray" x1="100" y1="100" x2="190" y2="100" style="stroke:#e53935;stroke-width:3px"/><path class="s aa" d="" style="stroke:#e53935;stroke-width:2.5px"/><text class="rl" x="130" y="90" font-size="14" font-weight="700" text-anchor="middle" fill="#e53935"></text></svg>';
}
function setAng(el,a){
  a=Math.max(0,Math.min(180,Math.round(a)));el._o.ang=a;
  const r=a*Math.PI/180,c=Math.cos(r),s=Math.sin(r),ray=el.querySelector('.ray');
  ray.setAttribute('x2',100+90*c);ray.setAttribute('y2',100-90*s);
  el.querySelector('.aa').setAttribute('d',a?`M130 100A30 30 0 0 0 ${100+30*c} ${100-30*s}`:'');
  const m=el.querySelector('.rl'),h=r/2;m.setAttribute('x',100+52*Math.cos(h));m.setAttribute('y',100-52*Math.sin(h)+4);m.textContent=a+'°';
}
function protAng(el,ev){
  const svg=el.querySelector('svg'),pt=svg.createSVGPoint();pt.x=ev.clientX;pt.y=ev.clientY;
  const p=pt.matrixTransform(svg.getScreenCTM().inverse());
  let a=Math.atan2(100-p.y,p.x-100)*180/Math.PI;if(a<0)a=a<-90?180:0;
  return Math.round(a/5)*5;
}
function activeProt(){
  if(prot&&objs.includes(prot))return prot;
  const W=wrapEl.clientWidth;
  prot=mk({k:'prot',svg:protSvg(),w:Math.min(W*.8,520),ar:.54,keep:1});setAng(prot,60);pick(prot);return prot;
}
function stamp(a){
  const r=a*Math.PI/180,c=Math.cos(r),s=Math.sin(r),h=r/2;
  const svg=`<svg viewBox="0 0 160 90"><line class="s" x1="70" y1="80" x2="150" y2="80"/><line class="s" x1="70" y1="80" x2="${70+62*c}" y2="${80-62*s}" style="stroke:#e53935"/>${a?`<path class="s" style="stroke:#e53935;stroke-width:2px" d="M90 80A20 20 0 0 0 ${70+20*c} ${80-20*s}"/>`:''}<text x="${70+36*Math.cos(h)}" y="${80-36*Math.sin(h)+4}" font-size="13" font-weight="700" text-anchor="middle" fill="#e53935">${a}°</text></svg>`;
  pick(mk({k:'ang',svg,w:Math.min(wrapEl.clientWidth*.5,300),ar:.5625,keep:1}));
}

/* ---------- steps from lessons ---------- */
function fromStep(s){
  const W=wrapEl.clientWidth,H=wrapEl.clientHeight,m=Math.min(W,H);
  if(s.k==='embed'){return s.src?mk({k:'emb',embed:hostURL(s.src),w:W*.62,h:H*.55,x:W*.19,y:H*.2}):null}
  let ar=1;const vb=s.svg&&s.svg.match(/viewBox="\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/);
  if(vb)ar=vb[2]/vb[1];
  return mk({k:'obj',svg:s.svg,src:s.src,alt:s.alt,w:(s.w||.3)*m,ar,x:s.x!=null?s.x*W:undefined,y:s.y!=null?s.y*H:undefined,anim:s.anim,keep:1});
}

/* ---------- tools sheet ---------- */
const mkBtn=(cls,html,label)=>{const b=document.createElement('button');b.className=cls;b.innerHTML=html;b.setAttribute('aria-label',label);return b};
const toolfab=mkBtn('fab','&#9670;','Shapes and tools');toolfab.id='toolfab';
const penfab=mkBtn('fab','&#9998;','Pen');penfab.id='penfab';penfab.setAttribute('aria-pressed','false');
document.body.append(penfab,toolfab);
const tbg=document.createElement('div');tbg.id='toolsBg';
const tools=document.createElement('div');tools.id='tools';tools.setAttribute('role','dialog');tools.setAttribute('aria-label','Shapes and tools');
const CAR='<svg viewBox="0 0 160 70"><rect x="10" y="20" width="140" height="30" rx="8" fill="#1e5fd8"/><rect x="40" y="6" width="70" height="22" rx="8" fill="#6fb1ff"/><circle cx="42" cy="54" r="13" fill="#222"/><circle cx="118" cy="54" r="13" fill="#222"/><circle cx="42" cy="54" r="5" fill="#ccc"/><circle cx="118" cy="54" r="5" fill="#ccc"/></svg>';
tools.innerHTML=`<div class="grab"></div>
<div class="hd">Objects: Drag mode mein khiskao, Play mode mein tap karke chalao</div>
<div class="rw"><button id="mDrag" aria-pressed="true">&#9995; Drag</button><button id="mPlay" aria-pressed="false">&#127916; Play</button><button id="oReset">&#8634; Reset</button><button id="oCar">&#128663; Car</button></div>
<div class="hd">Shapes</div>
<div class="grid">${SH.map(s=>`<button class="shb" data-s="${s[0]}" aria-label="${s[1]}"><svg class="mini" viewBox="0 0 100 100">${s[2]}</svg><span>${s[1]}</span></button>`).join('')}</div>
<div class="hd">Angle (protractor)</div>
<div class="rw"><button id="pAdd">&#128208; Protractor</button>${[30,45,60,90,120,135,150,180].map(a=>`<button data-a="${a}">${a}&deg;</button>`).join('')}</div>
<div class="rw"><button id="pM">&minus;1&deg;</button><button id="pP">+1&deg;</button><button id="pS">&#128204; Stamp angle</button></div>
<div class="hd">Animation link (GitHub Pages)</div>
<div class="rw"><input id="emb" type="url" placeholder="https://username.github.io/repo/animation.html" aria-label="Animation link"><button id="eAdd" class="go">Add</button></div>`;
document.body.append(tbg,tools);
const setTools=o=>{B.classList.toggle('tools',o);if(o){B.classList.remove('open','pen');penfab.setAttribute('aria-pressed','false');closeText()}};
toolfab.onclick=()=>setTools(!B.classList.contains('tools'));
tbg.onclick=()=>setTools(false);
tools.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.s){addShape(b.dataset.s);setTools(false)}
  else if(b.dataset.a){setAng(activeProt(),+b.dataset.a)}
  else if(b.id==='pAdd'){activeProt();setTools(false)}
  else if(b.id==='pM'){const p=activeProt();setAng(p,p._o.ang-1)}
  else if(b.id==='pP'){const p=activeProt();setAng(p,p._o.ang+1)}
  else if(b.id==='pS'){stamp(activeProt()._o.ang);setTools(false)}
  else if(b.id==='mDrag')setMode('drag');else if(b.id==='mPlay')setMode('play');
  else if(b.id==='oReset')resetObjs();
  else if(b.id==='oCar'){pick(mk({k:'obj',svg:CAR,w:Math.min(wrapEl.clientWidth*.4,320),ar:70/160,keep:1,anim:'slide'}));setTools(false)}
  else if(b.id==='eAdd'){
    const u=hostURL(q('#emb').value);if(!u)return;
    const W=wrapEl.clientWidth,H=wrapEl.clientHeight;
    pick(mk({k:'emb',embed:u,w:W*.62,h:H*.55,x:W*.19,y:H*.2}));q('#emb').value='';setTools(false);
  }
});
document.addEventListener('pointerdown',e=>{if(!e.target.closest('.obj')){pick(null);gseed=null}},true);
addEventListener('keydown',e=>{if(e.key==='Delete'&&selEl&&!e.target.isContentEditable&&e.target.tagName!=='INPUT'){selEl.querySelector('[data-c=x]').click()}});

/* ---------- pen ---------- */
const PAL=['auto','#e53935','#1e88e5','#43a047','#fb8c00','#8e24aa','#fdd835','#00bcd4'];
const SZ=[.0028,.0055,.009,.015,.025],KS=[1,.55,.3,.15];
let efil=0,colP='auto',colH='#ffeb3b',tool='pen',sz=2,col='auto',stab=2,snap=true,dash=false,guard=true,strokes=[],hist=[],live=null,IW=1,IH=1,gradOn=false,gradI=0,trail=[],lraf=0;
const pb=document.createElement('div');pb.id='penbar';
pb.innerHTML=`<div class="pr"><button data-t="pen" aria-pressed="true" aria-label="Pen">&#9999;&#65039;</button><button data-t="hl" aria-pressed="false" aria-label="Highlighter">&#128397;</button><button data-t="line" aria-pressed="false" aria-label="Straight line">&#9585;</button><button data-t="erase" aria-pressed="false" aria-label="Eraser">&#9003;</button><button data-t="brush" aria-pressed="false" aria-label="Pressure brush">&#128396;</button><button data-t="laser" aria-pressed="false" aria-label="Laser pointer">&#128308;</button><span class="gap"></span><button data-p="min" aria-label="More options" id="pmin">&#9662;</button></div>
<div class="pr">${[4,8,12,18,26].map((n,i)=>`<button data-z="${i}" aria-pressed="${i===2}" aria-label="Thickness ${i+1}" style="flex:1"><i style="display:inline-block;border-radius:50%;background:currentColor;width:${n}px;height:${n}px"></i></button>`).join('')}</div>
<div class="pr more" id="pal">${PAL.map((c,i)=>`<button class="csw" data-c="${c}" aria-pressed="${i===0}" aria-label="Colour ${i+1}" style="color:${c==='auto'?'var(--ink)':c}">&#9679;</button>`).join('')}</div>
<div class="pr more"><select id="stab" aria-label="Stability"><option value="0">Stability: Off</option><option value="1">Stability: Low</option><option value="2" selected>Stability: High</option><option value="3">Stability: Max</option></select><button data-p="snap" aria-pressed="true">Auto-shape</button><button data-p="dash" aria-pressed="false">Dash</button><button data-p="guard" aria-pressed="true">Palm guard</button><button data-p="grad" aria-pressed="false">Gradient: off</button><button data-p="ef">Eraser: all</button></div>
<div class="pr more"><button data-p="sprev" aria-label="Previous slide">&#9664;</button><button data-p="snew">&#65291; New slide</button><button data-p="snext" aria-label="Next slide">&#9654;</button></div>
<div class="pr"><button data-p="undo">&#8630; Undo</button><button data-p="clear">&#128465; Clear</button><span class="gap"></span><button data-p="done" class="go">Hide</button><button data-p="off">&#10005; Pen off</button></div>`;
document.body.appendChild(pb);
const colr=c=>c==='auto'?(getComputedStyle(document.documentElement).getPropertyValue('--ink').trim()||'#fff'):c;
function sizeInk(){const d=devicePixelRatio||1;IW=wrapEl.clientWidth;IH=wrapEl.clientHeight;ink.width=IW*d;ink.height=IH*d;cx.setTransform(d,0,0,d,0,0);redrawInk()}
const GR=[['#ff5252','#ffd740','#69f0ae'],['#00e5ff','#2979ff','#d500f9'],['#ff4081','#ff9100','#ffee58'],['#76ff03','#00e5ff','#7c4dff']];
const mixc=(a,b,t)=>{const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),x=p(a),y=p(b);return'#'+x.map((v,i)=>Math.round(v+(y[i]-v)*t).toString(16).padStart(2,'0')).join('')};
const gcol=(g,t)=>{const c=GR[g],k=t*(c.length-1),i=Math.min(c.length-2,Math.floor(k));return mixc(c[i],c[i+1],k-i)};
function drawVar(s,P,lwid){
  let tot=0;const seg=[0];for(let i=1;i<P.length;i++){tot+=dist(P[i],P[i-1]);seg.push(tot)}
  for(let i=1;i<P.length;i++){
    cx.lineWidth=lwid*(s.ws?(s.ws[i]+s.ws[i-1])/2:1);
    cx.strokeStyle=s.gr!=null?gcol(s.gr,tot?seg[i]/tot:0):colr(s.c);
    cx.beginPath();cx.moveTo(P[i-1][0],P[i-1][1]);cx.lineTo(P[i][0],P[i][1]);cx.stroke();
  }
}
function drawTrail(){
  if(!trail.length)return;const now=performance.now();cx.save();cx.lineCap='round';
  for(let i=1;i<trail.length;i++){
    if(trail[i][3])continue;const a=1-(now-trail[i][2])/2000;if(a<=0)continue;
    cx.strokeStyle=`rgba(255,40,40,${a})`;cx.lineWidth=Math.max(4,IW/200)*(.4+.6*a);
    cx.beginPath();cx.moveTo(trail[i-1][0],trail[i-1][1]);cx.lineTo(trail[i][0],trail[i][1]);cx.stroke();
  }
  if(live&&live.t==='laser'){const l=trail[trail.length-1];cx.fillStyle='#ff2020';cx.shadowColor='#ff2020';cx.shadowBlur=18;cx.beginPath();cx.arc(l[0],l[1],Math.max(7,IW/130),0,7);cx.fill()}
  cx.restore();
}
function lloop(){const now=performance.now();trail=trail.filter(p=>now-p[2]<2000);redrawInk();lraf=trail.length?requestAnimationFrame(lloop):0}
function drawS(s){
  const P=s.p.map(p=>[p[0]*IW,p[1]*IH]),lwid=Math.max(2.5,s.w*IW)*(s.k==='h'?3.2:1);
  cx.save();cx.strokeStyle=cx.fillStyle=colr(s.c);cx.lineWidth=lwid;cx.lineCap=cx.lineJoin='round';
  if(s.t==='brush'||(s.t==='path'&&s.gr!=null)){if(s.k==='h')cx.globalAlpha=.38;drawVar(s,P,lwid);cx.restore();return}
  if(s.k==='h'){cx.globalAlpha=.38;cx.lineCap='butt'}if(s.k==='d')cx.setLineDash([lwid*2,lwid*2.2]);
  cx.beginPath();
  if(s.t==='dot'){cx.arc(P[0][0],P[0][1],lwid/2,0,7);cx.fill()}
  else{
    if(s.t==='ell')cx.ellipse(P[0][0],P[0][1],Math.abs(s.r[0]*IW),Math.abs(s.r[1]*IH),0,0,7);
    else{P.forEach((p,i)=>i?cx.lineTo(p[0],p[1]):cx.moveTo(p[0],p[1]));if(s.t==='poly')cx.closePath()}
    cx.stroke();
  }
  cx.restore();
}
const norm=s=>{s.p=s.p.map(p=>[p[0]/IW,p[1]/IH]);if(s.r)s.r=[s.r[0]/IW,s.r[1]/IH];return s};
function redrawInk(){cx.clearRect(0,0,IW,IH);strokes.forEach(drawS);if(live&&live.t!=='erase'&&live.t!=='laser')drawS(norm(liveS()));drawTrail()}
const kind=()=>tool==='hl'?'h':(dash?'d':'p');
function liveS(){const L=live;return{t:L.t==='brush'?'brush':'path',p:L.t==='line'?[L.pts[0],L.raw]:L.pts.slice(),ws:L.ws,gr:gradOn&&L.t!=='line'?gradI:null,c:col,w:SZ[sz],k:kind()}}
function rdp(p,e){
  if(p.length<3)return p;
  let d=0,k=0;const a=p[0],b=p[p.length-1],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1;
  for(let i=1;i<p.length-1;i++){const t=Math.abs((p[i][0]-a[0])*dy-(p[i][1]-a[1])*dx)/L;if(t>d){d=t;k=i}}
  return d>e?rdp(p.slice(0,k+1),e).slice(0,-1).concat(rdp(p.slice(k),e)):[a,b];
}
function smooth(p){let r=p;for(let k=0;k<3;k++)r=r.map((c,i)=>{if(i===0||i===r.length-1)return c;let x=0,y=0,m=0;for(let j=-2;j<=2;j++){const v=r[i+j];if(v){x+=v[0];y+=v[1];m++}}return[x/m,y/m]});return r}
function beautify(pts){
  const n=pts.length;if(n<3)return{t:'dot',p:[pts[0]]};
  const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);
  const x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),w=x1-x0,h=y1-y0,diag=Math.hypot(w,h);
  if(diag<12)return{t:'dot',p:[pts[0]]};
  let len=0;for(let i=1;i<n;i++)len+=dist(pts[i],pts[i-1]);
  const a=pts[0],b=pts[n-1],gap=dist(a,b);
  if(gap<.18*len&&len>diag*1.6){
    const c0=(x0+x1)/2,c1=(y0+y1)/2,rx=w/2||1,ry=h/2||1;let err=0;
    pts.forEach(p=>err+=Math.abs(((p[0]-c0)/rx)**2+((p[1]-c1)/ry)**2-1));err/=n;
    if(err<.16){const r=Math.abs(rx-ry)<.2*Math.max(rx,ry)?[(rx+ry)/2,(rx+ry)/2]:[rx,ry];return{t:'ell',p:[[c0,c1]],r}}
    let m=0,md=0;pts.forEach((p,i)=>{const d=dist(p,a);if(d>md){md=d;m=i}});
    const e=Math.max(6,diag*.06);let v=rdp(pts.slice(0,m+1),e).slice(0,-1).concat(rdp(pts.slice(m),e));
    if(v.length>3&&dist(v[0],v[v.length-1])<diag*.2)v.pop();
    if(v.length>=3&&v.length<=7)return{t:'poly',p:v};
  }
  const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1;let dev=0;
  pts.forEach(p=>dev=Math.max(dev,Math.abs((p[0]-a[0])*dy-(p[1]-a[1])*dx)/L));
  if(dev<.07*L&&L>diag*.8){const e=[b[0],b[1]],ang=Math.atan2(Math.abs(dy),Math.abs(dx))*57.3;if(ang<7)e[1]=a[1];else if(ang>83)e[0]=a[0];return{t:'line',p:[a,e]}}
  return{t:'path',p:smooth(pts)};
}
const efOK=s=>efil===0||(efil===1&&s.k!=='h')||(efil===2&&s.k==='h')||(efil===3&&colr(s.c)===colr(col));
function hit(s,x,y,r){
  let P=s.p.map(p=>[p[0]*IW,p[1]*IH]);
  if(s.t==='ell'){const rx=s.r[0]*IW,ry=s.r[1]*IH,c=P[0];P=[];for(let i=0;i<48;i++){const a=i/48*6.283;P.push([c[0]+rx*Math.cos(a),c[1]+ry*Math.sin(a)])}P.push(P[0])}
  else if(s.t==='poly')P=P.concat([P[0]]);
  for(let i=0;i<P.length;i++){
    const a=P[i],b=P[i+1]||a,dx=b[0]-a[0],dy=b[1]-a[1],l2=dx*dx+dy*dy;
    let t=l2?((x-a[0])*dx+(y-a[1])*dy)/l2:0;t=Math.max(0,Math.min(1,t));
    if(Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy)<r)return true;
  }
  return false;
}
const snapH=()=>{hist.push(JSON.stringify(strokes));if(hist.length>40)hist.shift()};
const penopt=mkBtn('fab','&#9881;','Pen options');penopt.id='penopt';document.body.appendChild(penopt);
function setPen(on){
  B.classList.toggle('pen',on);B.classList.remove('penhide');penfab.setAttribute('aria-pressed',on);
  if(on){B.classList.remove('open','tools');closeText();pick(null)}
}
penfab.onclick=()=>setPen(!B.classList.contains('pen'));
penopt.onclick=()=>B.classList.remove('penhide');
const mark=(sel,fn)=>pb.querySelectorAll(sel).forEach(b=>b.setAttribute('aria-pressed',fn(b)));
const HLP=['#ffeb3b','#ff80ab','#69f0ae','#40c4ff','#b388ff','#ffab40','#ff8a80','#e0e0e0'];
function rpal(){
  q('#pal').innerHTML=(tool==='hl'?HLP:PAL).map((c,i)=>`<button class="csw" data-c="${c}" aria-pressed="${c===col}" aria-label="Colour ${i+1}" style="color:${c==='auto'?'var(--ink)':c}">&#9679;</button>`).join('');
}
pb.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.t){
    const nt=b.dataset.t;
    if(tool==='hl'&&nt!=='hl'){colH=col;col=colP}else if(tool!=='hl'&&nt==='hl'){colP=col;col=colH}
    tool=nt;mark('[data-t]',x=>x===b);rpal();
  }
  else if(b.dataset.z){sz=+b.dataset.z;mark('[data-z]',x=>x===b)}
  else if(b.dataset.c!=null){col=b.dataset.c;mark('.csw',x=>x===b)}
  else{
    const p=b.dataset.p;
    if(p==='undo'){if(hist.length){strokes=JSON.parse(hist.pop());redrawInk()}}
    else if(p==='clear'){snapH();strokes=[];redrawInk()}
    else if(p==='done')B.classList.add('penhide');
    else if(p==='off')setPen(false);
    else if(p==='snew')window.newSlide&&newSlide();
    else if(p==='sprev')window.slideStep&&slideStep(-1);
    else if(p==='snext')window.slideStep&&slideStep(1);
    else if(p==='min'){pb.classList.toggle('min');b.innerHTML=pb.classList.contains('min')?'&#9652;':'&#9662;'}
    else if(p==='snap'){snap=!snap;b.setAttribute('aria-pressed',snap)}
    else if(p==='dash'){dash=!dash;b.setAttribute('aria-pressed',dash)}
    else if(p==='guard'){guard=!guard;b.setAttribute('aria-pressed',guard)}
    else if(p==='ef'){efil=(efil+1)%4;b.textContent='Eraser: '+['all','pen only','highlighter only','this colour'][efil]}
    else if(p==='grad'){if(!gradOn){gradOn=true;gradI=0}else if(gradI<GR.length-1)gradI++;else gradOn=false;b.setAttribute('aria-pressed',gradOn);b.textContent=gradOn?'Gradient '+(gradI+1):'Gradient: off'}
  }
});
q('#stab').onchange=e=>{stab=+e.target.value};
ink.addEventListener('pointerdown',e=>{
  if(!B.classList.contains('pen')||live)return;
  if(guard&&e.pointerType==='touch'&&Math.max(e.width||0,e.height||0)>34)return;
  e.preventDefault();try{ink.setPointerCapture(e.pointerId)}catch(_){}
  const p=[e.clientX,e.clientY];live={id:e.pointerId,t:tool,raw:p,pts:[p],sp:p.slice(),ch:false,ws:[1],wc:1,lp:p,lt:e.timeStamp};
  if(tool==='laser'){trail.push([p[0],p[1],performance.now(),true]);if(!lraf)lraf=requestAnimationFrame(lloop);return}
  if(tool==='erase')snapH();
});
ink.addEventListener('pointermove',e=>{
  if(!live||e.pointerId!==live.id)return;
  const p=[e.clientX,e.clientY];live.raw=p;
  if(live.t==='laser'){trail.push([p[0],p[1],performance.now()]);return}
  if(live.t==='brush'){
    const dt=Math.max(1,e.timeStamp-live.lt),v=dist(p,live.lp)/dt;let f;
    if(e.pointerType==='pen'&&e.pressure>0)f=.35+1.65*e.pressure;else f=Math.max(.45,Math.min(1.7,1.7-v*.9));
    live.wc+=(f-live.wc)*.3;live.lp=p;live.lt=e.timeStamp;
  }
  if(live.t==='erase'){
    const r=Math.max(16,IW/55),n=strokes.length;strokes=strokes.filter(s=>!(efOK(s)&&hit(s,p[0],p[1],r)));
    if(strokes.length!==n){live.ch=true;redrawInk()}
    return;
  }
  const k=KS[stab];live.sp=[live.sp[0]+(p[0]-live.sp[0])*k,live.sp[1]+(p[1]-live.sp[1])*k];
  if(dist(live.pts[live.pts.length-1],live.sp)>=1.5){live.pts.push(live.sp.slice());live.ws.push(live.wc)}
  redrawInk();
});
function endInk(e){
  if(!live||e.pointerId!==live.id)return;
  const L=live;live=null;
  if(L.t==='laser'){redrawInk();return}
  if(L.t==='erase'){if(!L.ch)hist.pop();redrawInk();return}
  const pts=L.pts.slice(),ws=L.ws.slice(),last=L.raw;if(dist(pts[pts.length-1],last)>1){pts.push(last);ws.push(L.wc)}
  let s;
  if(L.t==='brush'){
    const sw=smooth(ws.map(w=>[w,0])).map(a=>a[0]),tp=[.45,.7,.9];
    for(let i=0;i<3&&i<sw.length;i++){sw[i]*=tp[i];sw[sw.length-1-i]*=tp[i]}
    s=pts.length<3?{t:'dot',p:[pts[0]]}:{t:'brush',p:smooth(pts),ws:sw};
  }else if(L.t==='line'){
    const a=pts[0],b=last,dx=b[0]-a[0],dy=b[1]-a[1],ang=Math.atan2(Math.abs(dy),Math.abs(dx))*57.3,e2=[b[0],b[1]];
    if(ang<5)e2[1]=a[1];else if(ang>85)e2[0]=a[0];
    s={t:'line',p:[a,e2]};
  }else if(snap&&L.t==='pen')s=beautify(pts);
  else s=pts.length<3?{t:'dot',p:[pts[0]]}:{t:'path',p:smooth(pts)};
  if(L.t==='hl'&&s.t!=='line'&&s.t!=='dot')s={t:'path',p:smooth(pts)};
  if(L.t==='hl'&&pts.length>3){const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]),w=Math.max(...xs)-Math.min(...xs),h=Math.max(...ys)-Math.min(...ys);
    if(w>40&&h<w*.2){const y=ys.reduce((a,b)=>a+b)/ys.length;s={t:'line',p:[[Math.min(...xs),y],[Math.max(...xs),y]]}}}
  s.c=col;s.w=SZ[sz];s.k=L.t==='hl'?'h':(dash?'d':'p');
  if(gradOn&&(s.t==='path'||s.t==='brush'))s.gr=gradI;
  snapH();strokes.push(norm(s));redrawInk();
}
ink.addEventListener('pointerup',endInk);ink.addEventListener('pointercancel',endInk);

/* ---------- hooks used by index.html ---------- */
window.sizeInk=sizeInk;window.redrawInk=redrawInk;
window.inkClear=()=>{strokes=[];hist=[];live=null;clearObjs();redrawInk()};
window.ToolsAPI={step:fromStep,add:mk,pick,
  remove(el){el.remove();objs=objs.filter(x=>x!==el);if(prot===el)prot=null;if(selEl===el)selEl=null},
  save(){const t={strokes:JSON.stringify(strokes),objs:objs.slice(),prot};objs.forEach(e=>e.remove());objs=[];prot=null;selEl=null;strokes=[];hist=[];live=null;redrawInk();return t},
  load(t){strokes=t?JSON.parse(t.strokes):[];objs=t?t.objs:[];prot=t?t.prot:null;selEl=null;hist=[];objs.forEach(e=>{e.classList.remove('sel');layer.appendChild(e)});redrawInk()}};
sizeInk();
})();
