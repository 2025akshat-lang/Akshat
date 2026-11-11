
window.PV={
  
  after(name,fn){const o=window[name];if(typeof o!=='function')return console.warn('PV.after: '+name+' nahi mila');window[name]=function(){const r=o.apply(this,arguments);try{fn.apply(this,arguments)}catch(e){console.error(e)}return r}},
  before(name,fn){const o=window[name];if(typeof o!=='function')return console.warn('PV.before: '+name+' nahi mila');window[name]=function(){try{fn.apply(this,arguments)}catch(e){console.error(e)}return o.apply(this,arguments)}},
  ui:{
    
    addTool({id,label,html,onClick}){const b=document.createElement('button');b.id=id;b.setAttribute('aria-label',label);b.innerHTML=html||label;b.onclick=onClick;document.querySelector('#tools').appendChild(b);return b},
    
    addPanel(id,html){const d=document.createElement('div');d.className='pv-panel';d.id=id;d.hidden=true;if(html)d.innerHTML=html;document.querySelector('.stage').appendChild(d);return d},
    
    addTopButton(label,onClick){const b=document.createElement('button');b.className='x';b.style.width='auto';b.style.padding='0 12px';b.textContent=label;b.onclick=onClick;document.querySelector('.top').appendChild(b);return b}
  }
};
