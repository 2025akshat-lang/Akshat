

const st={lv:1,part:null,scene:null};
const SCENE_PART={};Object.keys(DIA).forEach(k=>DIA[k].spots.forEach(s=>{if(!SCENE_PART[s[0]])SCENE_PART[s[0]]=k}));
const $v=[null,$('#v1'),$('#v2'),$('#v3')];
function show(n){st.lv=n;[1,2,3].forEach(i=>$v[i].hidden=i!==n);
  $('#seg').hidden=n!==1;$('#brandbox').hidden=n===1;$('#close').hidden=n===1;$('#tools').hidden=n===2;$('#lblt').hidden=n===2;$('#t3d').hidden=n!==1;$('#lbl').hidden=true;
  if(n!==3)stop3();if(n!==1)stopH();}
function head(c,t,s){$('#crumb').textContent=c;$('#ttl').textContent=t;$('#sub').textContent=''}
function card(){$('#card').hidden=true}
function chips(list,onPick,active){const n=$('#chips');n.innerHTML='';n.scrollLeft=0;
  list.forEach(([id,label])=>{const b=document.createElement('button');b.className='chip'+(String(id).slice(0,2)==='__'?' mode':'');b.textContent=label;b.setAttribute('aria-pressed',String(id===active));b.dataset.id=id;b.onclick=()=>onPick(id);n.appendChild(b)})}
function pressChip(id){document.querySelectorAll('#chips .chip').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.id===id)))}
