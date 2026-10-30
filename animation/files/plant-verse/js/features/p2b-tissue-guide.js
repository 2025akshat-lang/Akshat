
(function(){
  const L=PV.L,el=PV.ui.addPanel('pv-tissue','');let cur=null;
  const R=(x,y,w,h,o='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" ${o}/>`,C=(x,y,r,o='')=>`<circle cx="${x}" cy="${y}" r="${r}" ${o}/>`,Ln=(a,b,c,d,o='')=>`<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" ${o}/>`,rep=(n,f)=>Array.from({length:n},(_,i)=>f(i)).join('');
  
  const SK={
   meristem:()=>rep(6,i=>rep(3,j=>R(10+i*17,8+j*19,16,18)+C(18+i*17,17+j*19,4,'class="f"'))),
   protective:()=>`<path d="M8 20 H112" class="t"/>`+rep(5,i=>R(8+i*21,24,20,10))+rep(5,i=>C(18+i*21,52,10)),
   parenchyma:()=>rep(5,i=>rep(2,j=>C(18+i*21+(j?10:0),20+j*30,11)+C(18+i*21+(j?10:0),20+j*30,7,'class="g"')+C(15+i*21+(j?10:0),17+j*30,2,'class="f"'))),
   collenchyma:()=>rep(5,i=>rep(2,j=>{const x=8+i*21,y=6+j*31;return R(x,y,20,29)+[[0,0],[16,0],[0,25],[16,25]].map(p=>R(x+p[0],y+p[1],4,4,'class="f"')).join('')})),
   sclerenchyma:()=>rep(3,i=>R(12+i*16,6,10,58,'class="t"')+Ln(17+i*16,10,17+i*16,60))+C(86,35,16,'class="t"')+C(86,35,3,'class="f"')+Ln(86,19,86,10)+Ln(70,35,62,35)+Ln(102,35,110,35),
   xylem:()=>R(18,5,24,60)+rep(6,i=>Ln(18,12+i*9,42,12+i*9,'class="t"'))+R(56,5,14,60)+rep(5,i=>C(63,14+i*11,2))+R(82,5,24,60)+rep(6,i=>Ln(82,12+i*9,106,12+i*9,'class="t"')),
   phloem:()=>R(24,5,26,60)+Ln(24,25,50,25,'class="t"')+Ln(24,45,50,45,'class="t"')+rep(3,i=>C(31+i*7,25,1,'class="f"'))+R(58,5,12,60)+C(64,35,4,'class="f"')+R(78,5,26,60)+Ln(78,38,104,38,'class="t"'),
   secretory:()=>rep(8,i=>C(60+19*Math.cos(i*Math.PI/4),35+19*Math.sin(i*Math.PI/4),6))+C(60,35,11,'class="g"')};
  const F=[['where','Location','स्थान'],['cells','Cells and walls','कोशिकाएँ व भित्ति'],['life','Living or dead','जीवित या मृत'],['fn','Function','कार्य'],['note','Good to know','जानने योग्य']];
  function draw(){
    const hi=PV.lang&&PV.lang()==='hi',x=hi?1:0,head=`<span class="pv-x" role="button" aria-label="Close">×</span><b>${L('Tissue guide','ऊतक गाइड')}</b>`;
    if(!cur){el.innerHTML=head+Object.keys(PV_TISSUE).map(id=>`<button class="pv-opt" data-t="${id}">${PV_TISSUE[id].n[x]}</button>`).join('')+`<button class="pv-opt" data-t="__xp">${L('Compare: xylem vs phloem','तुलना: जाइलम बनाम फ्लोएम')}</button>`;return}
    const back=`<div class="pv-nav"><button data-t="">◀ ${L('All tissues','सभी ऊतक')}</button></div>`;
    if(cur==='__xp'){el.innerHTML=head+back+`<table class="pv-tb"><tr><th></th><th>${L('Xylem','जाइलम')}</th><th>${L('Phloem','फ्लोएम')}</th></tr>`+PV_XP.map(r=>`<tr><th>${r[0][x]}</th><td>${r[1][x]}</td><td>${r[2][x]}</td></tr>`).join('')+'</table>';return}
    const t=PV_TISSUE[cur];
    el.innerHTML=head+back+`<div class="pv-sk"><svg viewBox="0 0 120 70" role="img" aria-label="${t.n[x]}">${SK[cur.replace('__','')]?SK[cur]():''}</svg></div><b>${t.n[x]}</b>`
      +F.map(f=>`<p><u>${hi?f[2]:f[1]}</u><br>${t[f[0]][x]}</p>`).join('')
      +`<p class="pv-note">${L('Simplified sketch, not to scale.','सरल रेखाचित्र, पैमाने के अनुसार नहीं।')}</p>`
      +(t.scene?`<div class="pv-nav"><button data-s="${t.scene}">${L('See in 3D ▸','3D में देखें ▸')}</button></div>`:'')}
  el.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.s){openScene(b.dataset.s);return}
    if(b.dataset.t!==undefined){cur=b.dataset.t||null;draw()}});
  PV.sim.reg('tissue',el,draw);
  PV.after('homeChips',()=>{const b=document.createElement('button'),n=$('#chips');b.className='chip mode';b.dataset.id='__tissue';b.textContent=L('🔬 Tissues','🔬 ऊतक');b.onclick=()=>{cur=null;PV.sim.open('tissue')};n.insertBefore(b,n.firstChild)});
  PV.onLang&&PV.onLang(()=>{const b=document.querySelector('#chips [data-id="__tissue"]');if(b)b.textContent=L('🔬 Tissues','🔬 ऊतक')});
})();
