
let playTimer=0;
function homeChips(){chips([['__life','Life cycle'],['__repro','Reproduction']].concat(Object.keys(P).map(k=>[k,P[k].name])),id=>{
  if(id==='__life')startMode('life');else if(id==='__repro')startMode('repro');else openPart(id)})}
function startMode(m){if(!H)return;st.mode=m;stopPlay();selectH(null);$('#seg').hidden=true;st.filt='all';applyFilter();
  chips([['__exit','✕'],['__play','▶ Play']].concat(STAGES[m].map((s,i)=>['s'+i,s[0]])),pickStage,'s0');setStage(0)}
function exitMode(){stopPlay();leaveMode();$('#seg').hidden=false;document.querySelectorAll('#seg button').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.f==='all')));homeChips()}
function leaveMode(){if(!st.mode)return;st.mode=null;stopPlay();Object.assign(H.T,FULL);if(st.lv!==1)Object.assign(H.V,FULL)}
function setStage(i){st.stage=i;H.T=Object.assign({},DEF0,STAGES[st.mode][i][1]);selectH(null);pressChip('s'+i);
  const n=$('#chips'),c=n.querySelector('[data-id="s'+i+'"]');if(c)n.scrollTo({left:c.offsetLeft-n.clientWidth/2+c.offsetWidth/2,behavior:'smooth'})}
function pickStage(id){if(id==='__exit'){exitMode();return}if(id==='__play'){togglePlay();return}stopPlay();setStage(+id.slice(1))}
function stopPlay(){clearInterval(playTimer);playTimer=0;const b=document.querySelector('#chips [data-id="__play"]');if(b)b.textContent='▶ Play'}
function togglePlay(){if(playTimer){stopPlay();return}const b=document.querySelector('#chips [data-id="__play"]');if(b)b.textContent='❚❚ Pause';
  if(st.stage>=STAGES[st.mode].length-1)setStage(0);
  playTimer=setInterval(()=>{if(st.stage>=STAGES[st.mode].length-1){stopPlay();return}setStage(st.stage+1)},2400)}
