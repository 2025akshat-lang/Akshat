/* canvas.js: infinite canvas (pan) + mini-map. */
(function(){
'use strict';
const q=s=>document.querySelector(s),B=document.body,wrap=q('#wrap');
const st=document.createElement('style');
st.textContent=`#panlay{position:fixed;inset:0;z-index:19;display:none;cursor:grab;touch-action:none}
body.panmode #panlay{display:block}
#panfab{top:234px}
#mmap{position:fixed;right:10px;bottom:10px;z-index:18;width:170px;height:108px;background:var(--panel);border:2px solid var(--edge);border-radius:10px;opacity:.92;touch-action:none}
#mmap canvas{width:100%;height:100%;display:block;border-radius:8px}
#mmap button{position:absolute;left:4px;top:4px;min-height:26px;min-width:26px;padding:0 6px;font-size:13px;border-radius:8px}
body.pen:not(.penhide) #mmap,body.tools #mmap,body.open #mmap{display:none}
@media (max-width:600px){#mmap{width:120px;height:78px}}`;
document.head.appendChild(st);
const lay=document.createElement('div');lay.id='panlay';document.body.appendChild(lay);
const fab=document.createElement('button');fab.id='panfab';fab.className='fab';fab.innerHTML='&#9995;';fab.setAttribute('aria-label','Pan the board');fab.setAttribute('aria-pressed','false');document.body.appendChild(fab);
const box=document.createElement('div');box.id='mmap';box.innerHTML='<canvas></canvas><button aria-label="Back to start">&#8962;</button>';document.body.appendChild(box);
const cv=box.querySelector('canvas'),cx=cv.getContext('2d');
const API=()=>window.ToolsAPI;
fab.onclick=()=>{const on=!B.classList.contains('panmode');B.classList.toggle('panmode',on);fab.setAttribute('aria-pressed',on)};
let drag=null;
lay.addEventListener('pointerdown',e=>{const w=API().world();drag={x:e.clientX,y:e.clientY,px:w.pan[0],py:w.pan[1]};lay.setPointerCapture(e.pointerId);lay.style.cursor='grabbing'});
lay.addEventListener('pointermove',e=>{if(drag)API().setPan(drag.px-(e.clientX-drag.x),drag.py-(e.clientY-drag.y))});
const end=()=>{drag=null;lay.style.cursor='grab'};lay.addEventListener('pointerup',end);lay.addEventListener('pointercancel',end);
box.querySelector('button').onclick=e=>{e.stopPropagation();API().setPan(0,0)};

let T=null,pend=false;
function size(){const r=box.getBoundingClientRect(),d=devicePixelRatio||1;cv.width=r.width*d;cv.height=r.height*d;cx.setTransform(d,0,0,d,0,0)}
function draw(){
  pend=false;if(!API())return;
  const w=API().world(),W=wrap.clientWidth,H=wrap.clientHeight,[px,py]=w.pan;
  const cs=getComputedStyle(document.documentElement),ink=cs.getPropertyValue('--ink').trim()||'#fff';
  let x0=Math.min(0,px),y0=Math.min(0,py),x1=Math.max(W,px+W),y1=Math.max(H,py+H);
  const IW=w.IW,IH=w.IH;
  w.strokes.forEach(s=>s.p.forEach(p=>{const x=p[0]*IW,y=p[1]*IH;x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y)}));
  w.objs.forEach(o=>{x0=Math.min(x0,o.offsetLeft);y0=Math.min(y0,o.offsetTop);x1=Math.max(x1,o.offsetLeft+o.offsetWidth);y1=Math.max(y1,o.offsetTop+o.offsetHeight)});
  const m=40;x0-=m;y0-=m;x1+=m;y1+=m;
  const cw=cv.clientWidth,ch=cv.clientHeight,k=Math.min(cw/(x1-x0),ch/(y1-y0)),ox=(cw-(x1-x0)*k)/2,oy=(ch-(y1-y0)*k)/2;
  T={x0,y0,k,ox,oy};
  const X=x=>ox+(x-x0)*k,Y=y=>oy+(y-y0)*k;
  cx.clearRect(0,0,cw,ch);
  cx.fillStyle=ink;cx.globalAlpha=.07;cx.fillRect(X(0),Y(0),W*k,H*k);cx.globalAlpha=1;
  cx.lineWidth=1;cx.strokeStyle=ink;cx.globalAlpha=.6;
  w.strokes.forEach(s=>{cx.strokeStyle=s.c==='auto'?ink:s.c;cx.beginPath();s.p.forEach((p,i)=>i?cx.lineTo(X(p[0]*IW),Y(p[1]*IH)):cx.moveTo(X(p[0]*IW),Y(p[1]*IH)));cx.stroke()});
  cx.globalAlpha=.45;cx.fillStyle='#4fc3f7';
  w.objs.forEach(o=>cx.fillRect(X(o.offsetLeft),Y(o.offsetTop),Math.max(2,o.offsetWidth*k),Math.max(2,o.offsetHeight*k)));
  cx.globalAlpha=1;cx.strokeStyle='#ff5252';cx.lineWidth=2;cx.strokeRect(X(px),Y(py),W*k,H*k);
}
window.mmUpdate=()=>{if(!pend){pend=true;requestAnimationFrame(draw)}};
function jump(e){
  if(!T)return;const r=cv.getBoundingClientRect(),wx=(e.clientX-r.left-T.ox)/T.k+T.x0,wy=(e.clientY-r.top-T.oy)/T.k+T.y0;
  API().setPan(wx-wrap.clientWidth/2,wy-wrap.clientHeight/2);
}
let md=false;
box.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;md=true;box.setPointerCapture(e.pointerId);jump(e)});
box.addEventListener('pointermove',e=>{if(md)jump(e)});
box.addEventListener('pointerup',()=>{md=false});
addEventListener('resize',()=>{size();mmUpdate()});
size();mmUpdate();
})();
