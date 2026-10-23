/* mindmap.js: concept maps filled in by a helper (monkey / crane / stick figure).
   Lesson step:  {k:'map', carrier:'monkey', tree:{t:'Root', kids:[{t:'Child', kids:[...]}]}}  */
(function(){
'use strict';
const NS='http://www.w3.org/2000/svg',wrap=document.getElementById('wrap'),board=document.getElementById('board');
const spd=()=>typeof speed==='function'?speed():1;
const ez=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,lerp=(a,b,t)=>a+(b-a)*t;
const COL=['var(--yl)','var(--cy)','var(--gr)','var(--rd)','var(--ink)'];
const st=document.createElement('style');
st.textContent=`.mmhost{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:1}
.mmhost svg{width:100%;height:100%;display:block;font-family:"Baloo 2",system-ui,sans-serif}
.cn{transform-box:fill-box;transform-origin:center}
.mmpop .cn{animation:mmpop .4s ease-out}
@keyframes mmpop{0%{transform:scale(.85)}60%{transform:scale(1.12)}100%{transform:scale(1)}}
body.mm #ptr,body.mm #char,body.mm #arm{visibility:hidden}`;
document.head.appendChild(st);
const el=(t,a,p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e};
const sty=(e,o)=>{Object.assign(e.style,o);return e};
function flatten(tree){const out=[];let c=0;const walk=(t,p)=>{const id='m'+(c++);out.push({id,from:p,t:t.t,x:t.x,y:t.y});(t.kids||[]).forEach(k=>walk(k,id))};(Array.isArray(tree)?tree:[tree]).forEach(t=>walk(t,null));return out}
function wrapText(t,max){const out=[];String(t).split('\n').forEach(par=>{let line='';par.split(/\s+/).forEach(w=>{if(line&&(line+' '+w).length>max){out.push(line);line=w}else line=line?line+' '+w:w});out.push(line)});return out}

async function run(step){
  if(!step.tree)return document.createElement('div');
  const W=wrap.clientWidth,H=wrap.clientHeight;
  let type=(typeof store!=='undefined'&&store.get('carrier',''))||step.carrier||'monkey';
  if(!['monkey','crane','stick'].includes(type))type='monkey';
  const stick=type==='stick',hang=!stick;
  const host=document.createElement('div');host.className='mmhost';
  const svg=el('svg',{viewBox:`0 0 ${W} ${H}`,preserveAspectRatio:'xMidYMid meet'},host);
  board.appendChild(host);
  const U=Math.max(8,Math.min(H*.016,W*.016));

  /* ----- tree layout ----- */
  const nodes=flatten(step.tree),by={};
  nodes.forEach(n=>{by[n.id]=n;n.kids=[]});
  const roots=[];nodes.forEach(n=>{const p=n.from?by[n.from]:null;p?p.kids.push(n):roots.push(n)});
  let leaf=0,maxD=0;
  const walk=(n,d)=>{n.d=d;maxD=Math.max(maxD,d);if(n.kids.length){n.kids.forEach(k=>walk(k,d+1));n.lx=(n.kids[0].lx+n.kids[n.kids.length-1].lx)/2}else n.lx=leaf++};
  roots.forEach(r=>walk(r,0));
  const Z=stick?{x:W*.03,y:H*.04,w:W*.94,h:H*.68}:{x:W*.03,y:H*.36,w:W*.94,h:H*.6};
  const colW=Z.w/Math.max(leaf,1),rowH=Z.h/(maxD+1);
  let fs=Math.max(11,Math.min(28,colW/8,rowH/3.3));
  const lay=()=>{const mc=Math.max(8,Math.min(28,Math.floor((colW*.94-fs)/(fs*.64))));
    nodes.forEach(n=>{n.lines=wrapText(n.t,mc);n.bw=Math.max(...n.lines.map(l=>l.length))*fs*.64+fs*1.5;n.bh=n.lines.length*fs*1.22+fs*.9});
    return Math.max(...nodes.map(n=>n.bh))};
  for(let i=0;i<10&&lay()>rowH*.8&&fs>9;i++)fs*=.9;
  lay();
  nodes.forEach(n=>{n.cx=n.x!=null?n.x*W:Z.x+(n.lx+.5)*colW;n.cy=n.y!=null?n.y*H:Z.y+(n.d+.5)*rowH});

  /* ----- container (tray) with shuffled chips ----- */
  const T=stick?{x:W*.2,y:H*.76,w:W*.6,h:H*.16}:{x:W*.05,y:H*.15,w:W*.8,h:H*.17};
  const order=nodes.map((_,i)=>i);let seed=7;
  for(let i=order.length-1;i>0;i--){seed=(seed*9301+49297)%233280;const j=Math.floor(seed/233280*(i+1));[order[i],order[j]]=[order[j],order[i]]}
  const flow=k=>{const rows=[];let r={w:0,h:0,it:[]};
    order.forEach(i=>{const n=nodes[i],w=n.bw*k;if(r.it.length&&r.w+w+8>T.w-20){rows.push(r);r={w:0,h:0,it:[]}}r.w+=w+(r.it.length?8:0);r.it.push(n);r.h=Math.max(r.h,n.bh*k)});
    rows.push(r);return{rows,tot:rows.reduce((s,q)=>s+q.h,0)+(rows.length-1)*8}};
  let tk=.75,F=flow(tk);while(F.tot>T.h-14&&tk>.28){tk-=.04;F=flow(tk)}
  let yy=T.y+(T.h-F.tot)/2;
  F.rows.forEach(r=>{let xx=T.x+(T.w-r.w)/2;r.it.forEach(n=>{n.tx=xx+n.bw*tk/2;n.ty=yy+r.h/2;xx+=n.bw*tk+8});yy+=r.h+8});

  /* ----- drawing: connectors, slots, tray, chips, actor ----- */
  const gC=el('g',{},svg),gS=el('g',{},svg),gT=el('g',{},svg),gK=el('g',{},svg),gA=el('g',{},svg);
  const rail=H*.012;
  if(hang)sty(el('line',{x1:0,y1:rail,x2:W,y2:rail},gC),{stroke:'var(--edge)',strokeWidth:U*.4+'px'});
  else sty(el('line',{x1:0,y1:H*.975,x2:W,y2:H*.975},gC),{stroke:'var(--edge)',strokeWidth:U*.35+'px'});
  sty(el('rect',{x:T.x,y:T.y,width:T.w,height:T.h,rx:14},gT),{fill:'var(--panel)',fillOpacity:.6,stroke:'var(--edge)',strokeWidth:'4px'});
  const setChip=(n,x,y,s)=>n.g.setAttribute('transform',`translate(${x} ${y}) scale(${s})`);
  nodes.forEach(n=>{
    const col=COL[n.d%5],p=n.from?by[n.from]:null;
    if(p){
      const x1=p.cx,y1=p.cy+p.bh/2,x2=n.cx,y2=n.cy-n.bh/2,m=(y1+y2)/2,pc=COL[p.d%5];
      n.cn=sty(el('path',{d:`M${x1} ${y1}V${m}H${x2}V${y2-8}`,fill:'none'},gC),{stroke:pc,strokeWidth:Math.max(2,fs*.14)+'px',strokeDasharray:'7 7',opacity:.35,transition:'opacity .3s'});
      n.ar=sty(el('polygon',{points:`${x2-7} ${y2-12} ${x2+7} ${y2-12} ${x2} ${y2-1}`},gC),{fill:pc,opacity:0,transition:'opacity .3s'});
    }
    n.slot=sty(el('rect',{x:n.cx-n.bw/2,y:n.cy-n.bh/2,width:n.bw,height:n.bh,rx:fs*.5},gS),{fill:'none',stroke:col,strokeWidth:'2.5px',strokeDasharray:'8 6',opacity:.55});
    n.g=el('g',{},gK);const cn=el('g',{class:'cn'},n.g);
    sty(el('rect',{x:-n.bw/2,y:-n.bh/2,width:n.bw,height:n.bh,rx:fs*.5},cn),{fill:'var(--panel)',stroke:col,strokeWidth:'3px'});
    n.lines.forEach((l,i)=>{const t=el('text',{x:0,y:-n.bh/2+fs*.45+fs*1.22*(i+.5),'text-anchor':'middle'},cn);t.textContent=l;sty(t,{fill:'var(--ink)',fontSize:fs+'px',fontWeight:600,dominantBaseline:'central'})});
    setChip(n,n.tx,n.ty,tk);
  });

  /* ----- actor state ----- */
  const S={hx:W*.5,hy:-H*.15,open:1,lx:W*.5,th:0,up:0,fx:-W*.1,ph:0,follow:false};
  const rot=(x,y)=>{const r=S.th*Math.PI/180,c=Math.cos(r),s=Math.sin(r),dx=x-S.hx,dy=y-rail;return{x:S.hx+dx*c-dy*s,y:rail+dx*s+dy*c}};
  const hand=()=>hang?rot(S.hx,S.hy):{x:S.hx,y:S.hy};
  const off=(n,s)=>hang?{x:0,y:n.bh*s/2}:{x:0,y:-n.bh*s/2*S.up};
  let held=null,live=true,rush=false;
  const sk=()=>{rush=true};board.addEventListener('pointerup',sk);
  const tw=(ms,fn)=>new Promise(res=>{const t0=performance.now(),d=Math.max(1,ms/spd()/(rush?7:1));
    (function f(now){let t=Math.min(1,(now-t0)/d);if(!host.isConnected)t=1;fn(ez(t));t<1?requestAnimationFrame(f):res()})(t0)});
  const mv=(to,ms)=>{const f={};for(const k in to)f[k]=S[k];return tw(ms,e=>{for(const k in to)S[k]=lerp(f[k],to[k],e)})};
  const pause=ms=>new Promise(r=>setTimeout(r,ms/spd()/(rush?7:1)));

  const setL=(e,x1,y1,x2,y2)=>{e.setAttribute('x1',x1);e.setAttribute('y1',y1);e.setAttribute('x2',x2);e.setAttribute('y2',y2)};
  const setC=(e,x,y,r)=>{e.setAttribute('cx',x);e.setAttribute('cy',y);if(r!=null)e.setAttribute('r',r)};
  const swing=()=>{S.lx+=(S.hx-S.lx)*.1;S.th=Math.max(-12,Math.min(12,(S.hx-S.lx)*.18))};

  function mkMonkey(){
    const BR='#8d5a2b',TN='#f0cfa8',trol=sty(el('rect',{},gA),{fill:'#546e7a'}),mg=el('g',{},gA);
    const rope=sty(el('line',{},mg),{stroke:'#7cb342',strokeWidth:U*.4+'px'}),tail=sty(el('path',{fill:'none'},mg),{stroke:BR,strokeWidth:U*.55+'px',strokeLinecap:'round'});
    const legs=[0,1].map(()=>sty(el('line',{},mg),{stroke:BR,strokeWidth:U*.65+'px',strokeLinecap:'round'}));
    const body=sty(el('ellipse',{},mg),{fill:BR}),belly=sty(el('ellipse',{},mg),{fill:TN});
    const arms=[0,1].map(()=>sty(el('line',{},mg),{stroke:BR,strokeWidth:U*.65+'px',strokeLinecap:'round'}));
    const hands=[0,1].map(()=>sty(el('circle',{},mg),{fill:TN}));
    const ears=[0,1].map(()=>sty(el('circle',{},mg),{fill:BR})),head=sty(el('circle',{},mg),{fill:BR});
    const face=el('g',{},mg);
    sty(el('ellipse',{cx:0,cy:U*.2,rx:U*1.1,ry:U*.95},face),{fill:TN});
    [-1,1].forEach(s=>{sty(el('circle',{cx:s*U*.5,cy:-U*.25,r:U*.32},face),{fill:'#fff'});sty(el('circle',{cx:s*U*.5,cy:-U*.2,r:U*.16},face),{fill:'#222'})});
    sty(el('path',{d:`M${-U*.55} ${U*.4}Q0 ${U*.95} ${U*.55} ${U*.4}`,fill:'none'},face),{stroke:'#5a2d0c',strokeWidth:U*.2+'px',strokeLinecap:'round'});
    return t=>{
      const tx=S.hx,ry=Math.max(rail+.7*U,S.hy-9.3*U);swing();
      mg.setAttribute('transform',`rotate(${S.th} ${tx} ${rail})`);
      trol.setAttribute('x',tx-1.6*U);trol.setAttribute('y',rail-.8*U);trol.setAttribute('width',3.2*U);trol.setAttribute('height',1.6*U);
      setL(rope,tx,rail,tx,ry+.2*U);
      tail.setAttribute('d',`M${tx+.9*U} ${ry+2.6*U}q${2.2*U} ${.2*U+Math.sin(t/300)*U*.7} ${1.3*U} ${3.2*U}`);
      legs.forEach((l,i)=>{const s=i?1:-1;setL(l,tx+s*.7*U,ry+1.9*U,tx+s*.35*U,ry+.1*U)});
      body.setAttribute('cx',tx);body.setAttribute('cy',ry+3.4*U);body.setAttribute('rx',1.3*U);body.setAttribute('ry',2*U);
      belly.setAttribute('cx',tx);belly.setAttribute('cy',ry+3.6*U);belly.setAttribute('rx',.8*U);belly.setAttribute('ry',1.3*U);
      const hc=ry+6.4*U;setC(head,tx,hc,1.5*U);ears.forEach((e,i)=>setC(e,tx+(i?1:-1)*1.55*U,hc,.6*U));
      face.setAttribute('transform',`translate(${tx} ${hc}) rotate(180)`);
      const sp=U*(.45+.7*S.open);
      arms.forEach((a,i)=>{const s=i?1:-1;setL(a,tx+s*1.1*U,ry+4.7*U,tx+s*sp,S.hy);setC(hands[i],tx+s*sp,S.hy,.55*U)});
    };
  }
  function mkCrane(){
    const trol=sty(el('rect',{},gA),{fill:'#546e7a'}),mg=el('g',{},gA);
    const cable=sty(el('line',{},mg),{stroke:'#455a64',strokeWidth:U*.35+'px'}),hs=sty(el('rect',{},mg),{fill:'#ffb703',stroke:'#8a5a00',strokeWidth:'2px'});
    const pr=[0,1].map(()=>sty(el('polyline',{fill:'none'},mg),{stroke:'#37474f',strokeWidth:U*.45+'px',strokeLinejoin:'round',strokeLinecap:'round'}));
    const lamp=sty(el('circle',{},gA),{fill:'#e63946'});
    return t=>{
      const tx=S.hx,cy=Math.max(rail+1.4*U,S.hy-3.4*U);swing();
      mg.setAttribute('transform',`rotate(${S.th} ${tx} ${rail})`);
      trol.setAttribute('x',tx-2*U);trol.setAttribute('y',rail-1*U);trol.setAttribute('width',4*U);trol.setAttribute('height',1.8*U);
      setC(lamp,tx,rail-1.2*U,.4*U);lamp.style.opacity=Math.sin(t/200)>0?1:.25;
      setL(cable,tx,rail,tx,cy);
      hs.setAttribute('x',tx-1.5*U);hs.setAttribute('y',cy);hs.setAttribute('width',3*U);hs.setAttribute('height',1.4*U);hs.setAttribute('rx',U*.3);
      pr.forEach((p,i)=>{const s=i?1:-1,o=S.open;p.setAttribute('points',`${tx+s*1.2*U},${cy+1.4*U} ${tx+s*(1.1*U+1.0*U*o)},${cy+2.6*U} ${tx+s*(.5*U+1.1*U*o)},${S.hy}`)});
    };
  }
  function mkStick(){
    const fl=H*.975,hip=fl-5*U,sh=hip-4*U,k={stroke:'var(--ink)',strokeWidth:U*.55+'px',strokeLinecap:'round'};
    const legs=[0,1].map(()=>sty(el('line',{},gA),k)),torso=sty(el('line',{},gA),k),arms=[0,1].map(()=>sty(el('line',{},gA),k));
    const head=sty(el('circle',{},gA),{fill:'var(--bg)',stroke:'var(--ink)',strokeWidth:U*.55+'px'});
    const eyes=[0,1].map(()=>sty(el('circle',{},gA),{fill:'var(--ink)'})),smile=sty(el('path',{fill:'none'},gA),{stroke:'var(--ink)',strokeWidth:U*.3+'px',strokeLinecap:'round'});
    const hands=[0,1].map(()=>sty(el('circle',{},gA),{fill:'var(--ink)'}));
    return t=>{
      if(S.follow)S.hx=S.fx;
      const fx=S.fx,hc=sh-1.7*U;
      setL(torso,fx,sh,fx,hip);setC(head,fx,hc,1.5*U);
      eyes.forEach((e,i)=>setC(e,fx+(i?1:-1)*.5*U+.15*U,hc-.2*U,.2*U));
      smile.setAttribute('d',`M${fx-.6*U+.15*U} ${hc+.4*U}Q${fx+.15*U} ${hc+1*U} ${fx+.9*U} ${hc+.4*U}`);
      legs.forEach((l,i)=>{const a=Math.sin(S.ph)*.6*(i?1:-1)+(i?.12:-.12);setL(l,fx,hip,fx+Math.sin(a)*5*U,hip+Math.cos(a)*5*U)});
      const sp=.7*U;
      arms.forEach((a,i)=>{const s=i?1:-1;setL(a,fx,sh+.3*U,S.hx+s*sp,S.hy);setC(hands[i],S.hx+s*sp,S.hy,.4*U)});
    };
  }
  const draw=type==='monkey'?mkMonkey():type==='crane'?mkCrane():mkStick();
  const upd=()=>{if(!held)return;const n=held.n;if(held.free){setChip(n,held.x,held.y,held.s);return}const h=hand(),o=off(n,held.s);setChip(n,h.x+o.x,h.y+o.y,held.s)};
  (function loop(t){if(!live)return;draw(t);upd();requestAnimationFrame(loop)})(performance.now());

  const land=n=>{
    n.slot.style.opacity=0;setChip(n,n.cx,n.cy,1);n.g.classList.add('mmpop');
    if(n.cn){n.cn.style.strokeDasharray='none';n.cn.style.opacity=1;n.ar.style.opacity=1}
  };
  const floorW=x=>Math.max(W*.04,Math.min(W*.96,x));
  const walkTo=x=>{x=floorW(x);S.follow=true;const f0=S.fx,p0=S.ph;return tw(Math.max(250,Math.abs(x-f0)/W*1800),e=>{S.fx=lerp(f0,x,e);S.ph=p0+(S.fx-f0)*.05})};
  const restY=(H*.975-5*U)-.5*U,overY=(H*.975-9*U)-3.5*U;

  async function place(n){
    if(hang){
      await mv({hx:n.tx,hy:n.ty-n.bh*tk/2},650);
      await mv({open:0},180);held={n,s:tk};
      const x0=S.hx,y0=S.hy;
      await tw(850,e=>{S.hx=lerp(x0,n.cx,e);S.hy=lerp(y0,n.cy-n.bh/2,e);held.s=lerp(tk,1,e)});
      await pause(120);await mv({open:1},160);held=null;land(n);
    }else{
      S.follow=true;await mv({hy:restY},200);
      await walkTo(n.tx);S.follow=false;
      await mv({hx:S.fx,hy:n.ty},420);held={n,s:tk};S.up=0;
      S.follow=true;await mv({hy:overY,up:1},420);
      await walkTo(n.cx);
      const h=hand(),o=off(n,tk),x0=h.x+o.x,y0=h.y+o.y,arc=H*.12;held.free=true;held.x=x0;held.y=y0;
      await tw(750,e=>{held.x=lerp(x0,n.cx,e);held.y=lerp(y0,n.cy,e)-Math.sin(Math.PI*e)*arc;held.s=lerp(tk,1,e)});
      held=null;land(n);
    }
    await pause(150);
  }

  try{
    for(const n of nodes)await place(n);
    if(hang)await mv({hy:-H*.18},650);else{S.follow=true;await mv({hy:restY},200);await walkTo(-W*.1)}
    gT.style.transition='opacity .8s';gT.style.opacity=.12;
    await pause(400);
  }finally{live=false;board.removeEventListener('pointerup',sk)}
  return host;
}
window.MindMap={run};
})();
