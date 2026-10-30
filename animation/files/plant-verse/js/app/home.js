

function openHome(){show(1);st.part=null;st.scene=null;
  head('PLANT / WHOLE / DICOT EXAMPLE','Plantverse','');card('','');
  homeChips();
  if(initH()){fitH();startH()}
  else{$('#tools').hidden=true;if(!$v[1].querySelector('svg'))$v[1].insertAdjacentHTML('afterbegin',L1)}
  applyFilter()}
const FILT={all:null,shoot:['internode','node','branch','abud','axbud','fbud','trich','blade','vein','petiole','lbase','stipule'],root:['taproot','lateral','rcap','rhair'],repro:['petal','sepal','stamen','carpel','pericarp','flesh','fseed','calyx','pedicel']};
$('#seg').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  document.querySelectorAll('#seg button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  st.filt=b.dataset.f;applyFilter()});
function act(e,sel,fn){const g=e.target.closest(sel);if(!g)return;if(e.type==='keydown'){if(e.key!=='Enter'&&e.key!==' ')return;e.preventDefault()}fn(g)}
$v[1].innerHTML='<button id="hlbl" hidden><span></span><i>›</i></button><button id="hlbl2" hidden><span></span><i>›</i></button>';
['click','keydown'].forEach(ev=>$v[1].addEventListener(ev,e=>act(e,'.part',g=>openPart(g.dataset.part))));
