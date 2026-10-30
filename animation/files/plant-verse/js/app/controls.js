
const zoomBy=f=>{if(st.lv===1&&H){H.zoom=Math.max(.5,Math.min(3,H.zoom*f));setCamH()}else if(S){zoom=Math.max(.5,Math.min(3,zoom*f));setCam()}};
$('#zin').onclick=()=>zoomBy(1.2);
$('#zout').onclick=()=>zoomBy(1/1.2);
$('#rst').onclick=()=>{if(st.lv===1&&H)resetH();else if(S)resetView()};
