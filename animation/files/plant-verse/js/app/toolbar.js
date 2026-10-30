
let t3dOn=false;try{t3dOn=localStorage.getItem('pv_3d')==='1'}catch(e){}
$('#t3d').setAttribute('aria-pressed',String(t3dOn));
$('#t3d').onclick=e=>{t3dOn=!t3dOn;e.currentTarget.setAttribute('aria-pressed',String(t3dOn));try{localStorage.setItem('pv_3d',t3dOn?'1':'0')}catch(_){}};
$('#lblt').onclick=e=>{labelsOn=!labelsOn;e.currentTarget.setAttribute('aria-pressed',String(labelsOn));try{localStorage.setItem('pv_labels',labelsOn?'1':'0')}catch(_){}
  if(H&&!labelsOn)selectH(null)};
