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
body.mm #ptr,body.mm #char,body.mm #arm{visibility:hidden}
.breath{animation:mmbr 3s ease-in-out infinite}@keyframes mmbr{50%{transform:translateY(-2px)}}
.smoke{animation:mmsm 2.4s ease-in infinite;transform-box:fill-box}.smoke.s2{animation-delay:.8s}.smoke.s3{animation-delay:1.6s}
@keyframes mmsm{0%{transform:translateY(4px);opacity:0}30%{opacity:.85}100%{transform:translateY(-16px);opacity:0}}
.mmnode{pointer-events:all;cursor:pointer}
.mmzoom{animation:mmz .35s ease-out}
@keyframes mmz{0%{transform:scale(.4);opacity:0}70%{transform:scale(1.07)}100%{transform:scale(1);opacity:1}}`;
document.head.appendChild(st);
const el=(t,a,p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e};
const sty=(e,o)=>{Object.assign(e.style,o);return e};
function flatten(tree){const out=[];let c=0;const walk=(t,p)=>{const id='m'+(c++);out.push({id,from:p,t:t.t,x:t.x,y:t.y});(t.kids||[]).forEach(k=>walk(k,id))};(Array.isArray(tree)?tree:[tree]).forEach(t=>walk(t,null));return out}
function wrapText(t,max){const out=[];String(t).split('\n').forEach(par=>{let line='';par.split(/\s+/).forEach(w=>{if(line&&(line+' '+w).length>max){out.push(line);line=w}else line=line?line+' '+w:w});out.push(line)});return out}

async function run(step){
  if(!step.tree)return document.createElement('div');
  const W0=wrap.clientWidth,H0=wrap.clientHeight;
  let type=(typeof store!=='undefined'&&store.get('carrier',''))||step.carrier||'monkey';
  if(!['monkey','crane','stick','snake','crow','murga'].includes(type))type='monkey';
  const ptrMode=['snake','crow','murga'].includes(type),stick=type==='stick'||ptrMode,hang=!stick;
  const t0=flatten(step.tree),ch0={},dp0={};let lf=0,md0=0;
  t0.forEach(n=>{if(n.from)ch0[n.from]=1});
  t0.forEach(n=>{dp0[n.id]=n.from?dp0[n.from]+1:0;md0=Math.max(md0,dp0[n.id]);if(!ch0[n.id])lf++});
  const kk=Math.max(1,lf*150/(W0*.94),(md0+1)*84/(H0*(ptrMode?.58:stick?.68:.6)));
  const W=W0*kk,H=H0*kk;
  const host=document.createElement('div');host.className='mmhost';
  const svg=el('svg',{viewBox:`0 0 ${W} ${H}`,preserveAspectRatio:'xMidYMid meet'},host);
  board.appendChild(host);
  const U=Math.max(8,Math.min(H*.016,W*.016));

  const nodes=flatten(step.tree),by={};
  nodes.forEach(n=>{by[n.id]=n;n.kids=[]});
  const roots=[];nodes.forEach(n=>{const p=n.from?by[n.from]:null;p?p.kids.push(n):roots.push(n)});
  let leaf=0,maxD=0;
  const walk=(n,d)=>{n.d=d;maxD=Math.max(maxD,d);if(n.kids.length){n.kids.forEach(k=>walk(k,d+1));n.lx=(n.kids[0].lx+n.kids[n.kids.length-1].lx)/2}else n.lx=leaf++};
  roots.forEach(r=>walk(r,0));
  const Z=stick?{x:W*.03,y:H*.04,w:W*.94,h:H*(ptrMode?.58:.68)}:{x:W*.03,y:H*.36,w:W*.94,h:H*.6};
  const colW=Z.w/Math.max(leaf,1),rowH=Z.h/(maxD+1);
  let fs=Math.max(11,Math.min(28,colW/8,rowH/3.3));
  const lay=()=>{const mc=Math.max(8,Math.min(28,Math.floor((colW*.94-fs)/(fs*.64))));
    nodes.forEach(n=>{n.lines=wrapText(n.t,mc);n.bw=Math.max(...n.lines.map(l=>l.length))*fs*.64+fs*1.5;n.bh=n.lines.length*fs*1.22+fs*.9});
    return Math.max(...nodes.map(n=>n.bh))};
  const placeN=()=>nodes.forEach(n=>{n.cx=n.x!=null?n.x*W:Z.x+(n.lx+.5)*colW;n.cy=n.y!=null?n.y*H:Z.y+(n.d+.5)*rowH});
  const overlaps=()=>{for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){const a=nodes[i],b=nodes[j];if(Math.abs(a.cx-b.cx)<(a.bw+b.bw)/2+4&&Math.abs(a.cy-b.cy)<(a.bh+b.bh)/2+2)return true}return false};
  for(let i=0;i<16&&fs>7&&(lay()>rowH*.8||(placeN(),overlaps()));i++)fs*=.92;
  lay();placeN();

  const T=stick?{x:W*.2,y:H*.76,w:W*.6,h:H*.16}:{x:W*.05,y:H*.15,w:W*.8,h:H*.17};
  const order=nodes.map((_,i)=>i);let seed=7;
  for(let i=order.length-1;i>0;i--){seed=(seed*9301+49297)%233280;const j=Math.floor(seed/233280*(i+1));[order[i],order[j]]=[order[j],order[i]]}
  const flow=k=>{const rows=[];let r={w:0,h:0,it:[]};
    order.forEach(i=>{const n=nodes[i],w=n.bw*k;if(r.it.length&&r.w+w+8>T.w-20){rows.push(r);r={w:0,h:0,it:[]}}r.w+=w+(r.it.length?8:0);r.it.push(n);r.h=Math.max(r.h,n.bh*k)});
    rows.push(r);return{rows,tot:rows.reduce((s,q)=>s+q.h,0)+(rows.length-1)*8}};
  let tk=.75,F=flow(tk);while(F.tot>T.h-14&&tk>.28){tk-=.04;F=flow(tk)}
  let yy=T.y+(T.h-F.tot)/2;
  F.rows.forEach(r=>{let xx=T.x+(T.w-r.w)/2;r.it.forEach(n=>{n.tx=xx+n.bw*tk/2;n.ty=yy+r.h/2;xx+=n.bw*tk+8});yy+=r.h+8});

  const gC=el('g',{},svg),gS=el('g',{},svg),gT=el('g',{},svg),gK=el('g',{},svg),gA=el('g',{},svg);
  const rail=H*.012;
  if(hang)sty(el('line',{x1:0,y1:rail,x2:W,y2:rail},gC),{stroke:'var(--edge)',strokeWidth:U*.4+'px'});
  else if(!ptrMode)sty(el('line',{x1:0,y1:H*.975,x2:W,y2:H*.975},gC),{stroke:'var(--edge)',strokeWidth:U*.35+'px'});
  if(!ptrMode)sty(el('rect',{x:T.x,y:T.y,width:T.w,height:T.h,rx:14},gT),{fill:'var(--panel)',fillOpacity:.6,stroke:'var(--edge)',strokeWidth:'4px'});
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
    n.g.addEventListener('pointerdown',e=>{if(n.g.classList.contains('mmnode'))e.stopPropagation()});
    n.g.addEventListener('pointerup',e=>{if(n.g.classList.contains('mmnode')){e.stopPropagation();zoomNode(n)}});
    sty(el('rect',{x:-n.bw/2,y:-n.bh/2,width:n.bw,height:n.bh,rx:fs*.5},cn),{fill:'var(--panel)',stroke:col,strokeWidth:'3px'});
    n.lines.forEach((l,i)=>{const t=el('text',{x:0,y:-n.bh/2+fs*.45+fs*1.22*(i+.5),'text-anchor':'middle'},cn);t.textContent=l;sty(t,{fill:'var(--ink)',fontSize:fs+'px',fontWeight:600,dominantBaseline:'central'})});
    if(ptrMode){n.g.style.opacity=0;setChip(n,n.cx,n.cy,1)}else setChip(n,n.tx,n.ty,tk);
  });

  const S={hx:W*.5,hy:-H*.15,open:1,lx:W*.5,th:0,up:0,fx:-W*.1,ph:0,follow:false};
  if(ptrMode){S.hx=W*.2;S.hy=H*.9}
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

  const stickDraw=(g,w,full)=>{
    const segs=[0,1,2].map(i=>sty(el('line',{},g),{stroke:i%2?'#8d5a2b':'#d4a017',strokeWidth:w+'px',strokeLinecap:'round'}));
    const joints=[0,1].map(()=>sty(el('circle',{r:w*.8},g),{fill:'#5d4037'}));
    const tip=sty(el('circle',{r:w*.95},g),{fill:'#e53935'});
    const Lmax=Math.hypot(W,H)*.98;
    return(x1,y1,x2,y2)=>{
      let dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy)||1;
      if(L>Lmax){x2=x1+dx/L*Lmax;y2=y1+dy/L*Lmax;dx=x2-x1;dy=y2-y1;L=Lmax}
      const ux=dx/L,uy=dy/L,z=Math.max(0,1-L/full)*w*4*Math.sin(Date.now()/170);
      const P=[[x1,y1],[x1+ux*L/3-uy*z,y1+uy*L/3+ux*z],[x1+ux*2*L/3+uy*z,y1+uy*2*L/3-ux*z],[x2,y2]];
      segs.forEach((s,i)=>setL(s,P[i][0],P[i][1],P[i+1][0],P[i+1][1]));
      joints.forEach((j,i)=>setC(j,P[i+1][0],P[i+1][1]));
      setC(tip,x2,y2);
    };
  };
  const svgHTML=(g,h)=>{const t=document.createElementNS(NS,'g');t.innerHTML=h;g.appendChild(t);return t};

  function mkSnake(){
    const N=34,base={x:W*.08,y:H*.94},dMax=Math.hypot(W,H)*1.05/(N-1);let d=dMax;
    const P=Array.from({length:N},(_,i)=>({x:base.x+i*d*.15,y:base.y-Math.sin(i)*U*.4}));
    const dark=P.slice(1).map(()=>sty(el('line',{},gA),{stroke:'#2e7d32',strokeLinecap:'round'}));
    const light=P.slice(1).map(()=>sty(el('line',{},gA),{stroke:'#a5d6a7',strokeLinecap:'round'}));
    const spots=[];for(let i=2;i<N-2;i+=3)spots.push([i,sty(el('circle',{},gA),{fill:'#1b5e20'})]);
    const head=sty(el('ellipse',{},gA),{fill:'#43a047',stroke:'#1b5e20',strokeWidth:'2px'});
    const eyes=[0,1].map(()=>sty(el('circle',{},gA),{fill:'#fff',stroke:'#1b5e20',strokeWidth:'1.5px'}));
    const pup=[0,1].map(()=>sty(el('circle',{},gA),{fill:'#111'}));
    const tongue=sty(el('path',{fill:'none'},gA),{stroke:'#e53935',strokeWidth:U*.35+'px',strokeLinecap:'round',strokeLinejoin:'round'});
    return t=>{
      let hx=S.hx,hy=S.hy;const dxb=hx-base.x,dyb=hy-base.y,dd=Math.hypot(dxb,dyb),L=dMax*(N-1)*.97;
      if(dd>L){hx=base.x+dxb/dd*L;hy=base.y+dyb/dd*L}
      d=Math.min(dMax,Math.max(U*.7,Math.min(dd,L)*1.06/(N-1)));
      for(let it=0;it<4;it++){
        P[0].x=hx;P[0].y=hy;
        for(let i=1;i<N;i++){const a=P[i-1],b=P[i],vx=b.x-a.x,vy=b.y-a.y,l=Math.hypot(vx,vy)||1;b.x=a.x+vx/l*d;b.y=a.y+vy/l*d}
        P[N-1].x=base.x;P[N-1].y=base.y;
        for(let i=N-2;i>=0;i--){const a=P[i+1],b=P[i],vx=b.x-a.x,vy=b.y-a.y,l=Math.hypot(vx,vy)||1;b.x=a.x+vx/l*d;b.y=a.y+vy/l*d}
      }
      const Q=P.map((p,i)=>{const n=P[Math.min(N-1,i+1)],m=P[Math.max(0,i-1)],vx=n.x-m.x,vy=n.y-m.y,l=Math.hypot(vx,vy)||1,
        o=Math.sin(t/260+i*.55)*U*.9*Math.sin(Math.PI*i/(N-1))*(.4+.6*i/N);return{x:p.x-vy/l*o,y:p.y+vx/l*o}});
      for(let i=0;i<N-1;i++){const w=U*(1.9*(1-i/N)+.55);
        setL(dark[i],Q[i].x,Q[i].y,Q[i+1].x,Q[i+1].y);dark[i].style.strokeWidth=w+'px';
        setL(light[i],Q[i].x,Q[i].y,Q[i+1].x,Q[i+1].y);light[i].style.strokeWidth=w*.4+'px'}
      spots.forEach(([i,c])=>setC(c,Q[i].x,Q[i].y,U*(.5*(1-i/N)+.15)));
      const a=Math.atan2(Q[0].y-Q[1].y,Q[0].x-Q[1].x),ca=Math.cos(a),sa=Math.sin(a),x0=Q[0].x+ca*U*.6,y0=Q[0].y+sa*U*.6;
      setC(head,x0,y0);head.setAttribute('rx',U*1.9);head.setAttribute('ry',U*1.35);head.setAttribute('transform',`rotate(${a*180/Math.PI} ${x0} ${y0})`);
      [-1,1].forEach((s,i)=>{const ex=x0+ca*U*.6-sa*s*U*.7,ey=y0+sa*U*.6+ca*s*U*.7;setC(eyes[i],ex,ey,U*.5);setC(pup[i],ex+ca*U*.15,ey+sa*U*.15,U*.25)});
      const tx=x0+ca*U*1.9,ty=y0+sa*U*1.9,f=Math.sin(t/110)*U*.5,e=tx+ca*U*1.6,e2=ty+sa*U*1.6;
      tongue.setAttribute('d',`M${tx} ${ty}L${e} ${e2}l${ca*U*.6-sa*(U*.5+f)} ${sa*U*.6+ca*(U*.5+f)}M${e} ${e2}l${ca*U*.6+sa*(U*.5+f)} ${sa*U*.6-ca*(U*.5+f)}`);
    };
  }

  function mkCrow(){
    const k=U*18/180,bx=W*.03,by=H*.985,HP={x:bx+152*k,y:by-68*k};
    const g=el('g',{transform:`translate(${bx} ${by}) scale(${k})`},gA);
    svgHTML(g,`<ellipse cx="90" cy="-4" rx="86" ry="6" fill="#0005"/>
      <g class="breath">
      <path d="M8 -28L-20 -22L2 -14L-14 -8L12 -10Z" fill="#1a1a1a"/>
      <ellipse cx="70" cy="-34" rx="58" ry="26" fill="#222" transform="rotate(-15 70 -34)"/>
      <ellipse cx="78" cy="-30" rx="40" ry="13" fill="#3a3a3a" transform="rotate(-15 78 -30)"/>
      <path d="M52 -14L40 -4M40 -4h-12M40 -4l-4 -6" stroke="#666" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M60 -16Q70 -44 100 -46M100 -46l10 -8M100 -46l12 2M100 -46l8 8" stroke="#666" stroke-width="5" fill="none" stroke-linecap="round"/>
      <ellipse cx="108" cy="-78" rx="22" ry="8" fill="#2c2c2c" transform="rotate(-28 108 -78)"/>
      <circle cx="128" cy="-62" r="17" fill="#222"/>
      <path d="M140 -66L174 -54L142 -50Z" fill="#7a7a7a"/><path d="M142 -56L172 -54" stroke="#444" stroke-width="2"/>
      <rect x="116" y="-72" width="17" height="12" rx="4" fill="#000"/><rect x="135" y="-70" width="17" height="12" rx="4" fill="#000"/>
      <path d="M133 -67L135 -65M116 -68L108 -63" stroke="#000" stroke-width="3"/>
      <path d="M119 -70l6 0M138 -68l6 0" stroke="#fff" stroke-width="2" opacity=".75" stroke-linecap="round"/>
      <path d="M96 -44Q130 -34 150 -66" stroke="#2a2a2a" stroke-width="12" fill="none" stroke-linecap="round"/>
      <circle cx="152" cy="-68" r="6.5" fill="#333"/></g>`);
    const upd=stickDraw(gA,U*.45,Math.hypot(W,H)*.35);
    return t=>upd(HP.x,HP.y,S.hx,S.hy);
  }

  function mkMurga(){
    const k=U*16/120,bx=W*.86,by=H*.985,HP={x:bx-64*k,y:by-82*k};
    const g=el('g',{transform:`translate(${bx} ${by}) scale(${k})`},gA);
    svgHTML(g,`<ellipse cx="0" cy="-3" rx="42" ry="6" fill="#0005"/>
      <g fill="none" stroke-linecap="round" stroke-width="10"><path d="M30 -70Q74 -100 62 -142" stroke="#2e7d32"/><path d="M34 -66Q86 -80 84 -122" stroke="#1565c0"/><path d="M30 -60Q76 -56 90 -92" stroke="#8e24aa"/><path d="M26 -78Q60 -118 40 -146" stroke="#ef6c00"/></g>
      <path d="M-14 -30L-16 -4M14 -30L16 -4M-16 -4h-12M-16 -4l-8 -7M16 -4h-12M16 -4l-8 -7" stroke="#f9a825" stroke-width="6" stroke-linecap="round" fill="none"/>
      <ellipse cx="0" cy="-62" rx="38" ry="34" fill="#c0392b"/><ellipse cx="-12" cy="-56" rx="24" ry="24" fill="#e67e22" opacity=".85"/>
      <circle cx="-22" cy="-104" r="21" fill="#c0392b"/>
      <circle cx="-31" cy="-126" r="7" fill="#e53935"/><circle cx="-21" cy="-130" r="8" fill="#e53935"/><circle cx="-11" cy="-126" r="7" fill="#e53935"/>
      <path d="M-42 -106L-64 -98L-42 -92Z" fill="#ffb300"/><ellipse cx="-40" cy="-88" rx="6" ry="9" fill="#e53935"/>
      <circle cx="-28" cy="-110" r="6.5" fill="#fff"/><circle cx="-30" cy="-110" r="3" fill="#111"/>
      <path d="M-36 -118l12 -3" stroke="#6d1d14" stroke-width="3" stroke-linecap="round"/>
      <path d="M-30 -62Q-52 -52 -64 -80" stroke="#b03a2e" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="-64" cy="-82" r="6.5" fill="#c0392b"/>
      <path d="M30 -62Q58 -66 60 -96" stroke="#b03a2e" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="60" cy="-98" r="6.5" fill="#c0392b"/>
      <g stroke="#8d5a2b" stroke-width="2.6" stroke-linecap="round"><path d="M60 -100L52 -130"/><path d="M60 -100L60 -134"/><path d="M60 -100L68 -130"/></g>
      <g fill="#ff3d00"><circle cx="52" cy="-131" r="2.8"/><circle cx="60" cy="-135" r="2.8"/><circle cx="68" cy="-131" r="2.8"/></g>
      <g fill="none" stroke="#cfd8dc" stroke-width="3" stroke-linecap="round">
        <path class="smoke" d="M52 -136q-6 -8 0 -16q6 -8 0 -16"/><path class="smoke s2" d="M60 -140q-6 -8 0 -16q6 -8 0 -16"/><path class="smoke s3" d="M68 -136q-6 -8 0 -16q6 -8 0 -16"/></g>`);
    const upd=stickDraw(gA,U*.45,Math.hypot(W,H)*.35);
    return t=>upd(HP.x,HP.y,S.hx,S.hy);
  }
  const draw=type==='monkey'?mkMonkey():type==='crane'?mkCrane():type==='snake'?mkSnake():type==='crow'?mkCrow():type==='murga'?mkMurga():mkStick();
  const upd=()=>{if(!held)return;const n=held.n;if(held.free){setChip(n,held.x,held.y,held.s);return}const h=hand(),o=off(n,held.s);setChip(n,h.x+o.x,h.y+o.y,held.s)};
  (function loop(t){if(!live)return;draw(t);upd();requestAnimationFrame(loop)})(performance.now());

  let zg=null;
  function zoomNode(n){
    if(zg){zg.remove();zg=null}
    zg=el('g',{},svg);
    sty(el('rect',{x:0,y:0,width:W,height:H},zg),{fill:'#000',opacity:.6});
    const s=Math.min(W*.7/n.bw,H*.45/n.bh,8),c=n.g.cloneNode(true);
    c.classList.remove('mmnode','mmpop');c.setAttribute('transform',`translate(${W/2} ${H/2}) scale(${s})`);
    c.firstChild.classList.add('mmzoom');zg.appendChild(c);
    zg.style.pointerEvents='all';
    zg.addEventListener('pointerdown',e=>e.stopPropagation());
    zg.addEventListener('pointerup',e=>{e.stopPropagation();if(zg){zg.remove();zg=null}});
  }
  const land=n=>{
    n.g.classList.add('mmnode');n.g.style.opacity=1;n.slot.style.opacity=0;setChip(n,n.cx,n.cy,1);n.g.classList.add('mmpop');
    if(n.cn){n.cn.style.strokeDasharray='none';n.cn.style.opacity=1;n.ar.style.opacity=1}
  };
  const floorW=x=>Math.max(W*.04,Math.min(W*.96,x));
  const walkTo=x=>{x=floorW(x);S.follow=true;const f0=S.fx,p0=S.ph;return tw(Math.max(250,Math.abs(x-f0)/W*1800),e=>{S.fx=lerp(f0,x,e);S.ph=p0+(S.fx-f0)*.05})};
  const restY=(H*.975-5*U)-.5*U,overY=(H*.975-9*U)-3.5*U;

  async function place(n){
    if(ptrMode){await mv({hx:n.cx,hy:n.cy+n.bh/2+4},800);await pause(250);land(n);await pause(500);return}
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
    if(ptrMode)await mv({hx:W*.2,hy:H*.9},700);
    else if(hang)await mv({hy:-H*.18},650);else{S.follow=true;await mv({hy:restY},200);await walkTo(-W*.1)}
    gT.style.transition='opacity .8s';gT.style.opacity=.12;
    await pause(400);
  }finally{live=false;board.removeEventListener('pointerup',sk)}
  return host;
}
window.MindMap={run};
})();
