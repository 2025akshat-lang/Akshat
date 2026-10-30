
const ann=(x1,y1,x2,y2,t,a='start')=>`<path class="lead" d="M${x1} ${y1}L${x2} ${y2}"/><text class="ann" x="${x2+(a==='start'?4:a==='end'?-4:0)}" y="${y2+3}" text-anchor="${a}">${t}</text>`;
const spot=(scene,x,y,label,lx,ly,a='start')=>`<g class="spot" data-scene="${scene}" tabindex="0" role="button" aria-label="${label} 3D"><circle class="hit" cx="${x}" cy="${y}" r="28"/><circle class="pulse" cx="${x}" cy="${y}" r="12"/><circle class="core" cx="${x}" cy="${y}" r="5"/><text class="spt" x="${lx}" y="${ly}" text-anchor="${a}">${label} ▸ 3D</text></g>`;
const mir=(d)=>d.replace(/(-?\d+(\.\d+)?)\s(-?\d+(\.\d+)?)/g,(m,x,_a,y)=>`${360-parseFloat(x)} ${y}`);
