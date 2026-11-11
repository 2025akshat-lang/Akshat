

function openPart(id){show(2);st.part=id;st.scene=null;
  $v[2].innerHTML=DIA[id].svg;
  head('PLANT / '+P[id].name.toUpperCase(),P[id].title,P[id].sub);
  card('Tap a glowing circle','Opens the 3D cross-section. Labels are on the diagram.');
  chips(DIA[id].spots,openScene)}
['click','keydown'].forEach(ev=>$v[2].addEventListener(ev,e=>act(e,'.spot',g=>openScene(g.dataset.scene))));

$('#close').onclick=()=>{if(st.lv===3)openPart(st.part);else if(st.lv===2)openHome()};
