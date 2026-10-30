/* Manifest ki files ko PARALLEL download karta hai par ORDER mein chalata hai (async=false). file:// par bhi chalta hai.
   PV_MANIFEST.useBundle=true -> sirf ek bundle file load hogi (GitHub par sabse tez). */
(function(){
  const M=window.PV_MANIFEST,v=M.v?'?v='+M.v:'',list=M.useBundle?[M.bundle]:[].concat(M.core,M.features,M.boot).map(f=>'js/'+f);
  const msg=document.createElement('div');msg.textContent='Loading Plantverse…';msg.style.cssText='position:fixed;left:0;right:0;top:46%;text-align:center;font:600 14px system-ui,sans-serif;color:#2e7d32;z-index:50;pointer-events:none';document.body.appendChild(msg);
  function fail(src){const d=document.createElement('div');d.style.cssText='position:fixed;left:8px;right:8px;top:8px;z-index:99;padding:10px;border-radius:8px;background:#b00020;color:#fff;font:13px monospace';d.textContent='Load nahi hui: '+src+' (manifest.js mein naam/path check karo)';document.body.appendChild(d)}
  list.forEach((src,i)=>{const s=document.createElement('script');s.async=false;s.src=src+v;s.onerror=()=>fail(src);if(i===list.length-1)s.onload=()=>msg.remove();document.body.appendChild(s)});
})();
