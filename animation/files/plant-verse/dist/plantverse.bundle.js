



window.PV={
  
  after(name,fn){const o=window[name];if(typeof o!=='function')return console.warn('PV.after: '+name+' nahi mila');window[name]=function(){const r=o.apply(this,arguments);try{fn.apply(this,arguments)}catch(e){console.error(e)}return r}},
  before(name,fn){const o=window[name];if(typeof o!=='function')return console.warn('PV.before: '+name+' nahi mila');window[name]=function(){try{fn.apply(this,arguments)}catch(e){console.error(e)}return o.apply(this,arguments)}},
  ui:{
    
    addTool({id,label,html,onClick}){const b=document.createElement('button');b.id=id;b.setAttribute('aria-label',label);b.innerHTML=html||label;b.onclick=onClick;document.querySelector('#tools').appendChild(b);return b},
    
    addPanel(id,html){const d=document.createElement('div');d.className='pv-panel';d.id=id;d.hidden=true;if(html)d.innerHTML=html;document.querySelector('.stage').appendChild(d);return d},
    
    addTopButton(label,onClick){const b=document.createElement('button');b.className='x';b.style.width='auto';b.style.padding='0 12px';b.textContent=label;b.onclick=onClick;document.querySelector('.top').appendChild(b);return b}
  }
};




const $=s=>document.querySelector(s);




const P={
  flower:{name:'Flower',title:'Flower: where seeds begin',sub:'When pollen reaches the stigma, the ovule is fertilised.'},
  fruit:{name:'Fruit',title:'Fruit: protecting the seed',sub:'The fertilised ovary becomes the fruit and the ovule becomes the seed.'},
  leaf:{name:'Leaf',title:'Leaf: the food factory',sub:'Sunlight + CO₂ + water → glucose + O₂. The blade is only ~0.2 mm thick.'},
  stem:{name:'Stem',title:'Stem: the plant’s highway',sub:'Xylem carries water up, phloem carries food down.'},
  root:{name:'Roots',title:'Roots: the source of water and minerals',sub:'They anchor the plant and absorb through root hairs.'},
  seed:{name:'Seed',title:'Seed: a whole plant in a sealed box',sub:''},
  buds:{name:'Buds',title:'Buds: tomorrow’s shoots and flowers',sub:''},
  surface:{name:'Surface',title:'Surface: epidermis, cuticle, trichomes',sub:''},
  habit:{name:'Habit',title:'Plant habit: herb to tree',sub:''}
};




const ann=(x1,y1,x2,y2,t,a='start')=>`<path class="lead" d="M${x1} ${y1}L${x2} ${y2}"/><text class="ann" x="${x2+(a==='start'?4:a==='end'?-4:0)}" y="${y2+3}" text-anchor="${a}">${t}</text>`;
const spot=(scene,x,y,label,lx,ly,a='start')=>`<g class="spot" data-scene="${scene}" tabindex="0" role="button" aria-label="${label} 3D"><circle class="hit" cx="${x}" cy="${y}" r="28"/><circle class="pulse" cx="${x}" cy="${y}" r="12"/><circle class="core" cx="${x}" cy="${y}" r="5"/><text class="spt" x="${lx}" y="${ly}" text-anchor="${a}">${label} ▸ 3D</text></g>`;
const mir=(d)=>d.replace(/(-?\d+(\.\d+)?)\s(-?\d+(\.\d+)?)/g,(m,x,_a,y)=>`${360-parseFloat(x)} ${y}`);





const L1=`<svg viewBox="0 0 360 520" preserveAspectRatio="xMidYMid meet" role="group" aria-label="Whole plant">
<rect class="soil" x="0" y="318" width="360" height="202" opacity=".55"/><path class="soilline" d="M0 318H360"/>

<g class="part" data-part="root" tabindex="0" role="button" aria-label="Roots"><rect class="hit" x="80" y="320" width="200" height="170"/>
<path class="rootp" stroke-width="7" d="M180 318C176 360 184 410 178 474"/>
<path class="rootp" stroke-width="3.5" d="M180 346C152 354 130 374 112 410M180 376C210 386 232 400 248 436M179 410C158 420 146 440 140 466M180 334C204 340 226 352 246 350"/>
</g>
<g class="part" data-part="stem" tabindex="0" role="button" aria-label="Stem"><rect class="hit" x="160" y="120" width="40" height="198"/>
<path class="stemp" stroke-width="9" d="M180 318C184 260 176 190 180 112"/>
</g>
<g class="part" data-part="leaf" tabindex="0" role="button" aria-label="Leaf"><rect class="hit" x="70" y="120" width="220" height="116"/>
<path class="leafp" d="M180 226C160 192 124 174 84 172C100 204 138 226 180 226Z"/><path class="vein" d="M180 226Q130 200 90 176"/>
<path class="leafp" d="M180 176C204 148 238 130 276 128C262 162 224 184 180 176Z"/><path class="vein" d="M180 176Q230 150 270 130"/>
</g>
<g class="part" data-part="fruit" tabindex="0" role="button" aria-label="Fruit"><rect class="hit" x="190" y="248" width="110" height="64"/>
<path class="stemp" stroke-width="3.5" d="M181 262Q214 252 232 268"/>
<circle class="fruitp" cx="240" cy="284" r="21"/><path d="M228 266l12 6 12-6-6 10h-12z" fill="var(--leaf2)"/>
</g>
<g class="part" data-part="flower" tabindex="0" role="button" aria-label="Flower"><circle class="hit" cx="180" cy="92" r="52"/>
${[0,72,144,216,288].map(a=>`<ellipse class="petalp" cx="180" cy="68" rx="14" ry="27" transform="rotate(${a} 180 96)"/>`).join('')}
<circle class="pollen" cx="180" cy="96" r="12"/>
</g>
</svg>`;





const hairs=(()=>{let s='';for(let y=316;y<390;y+=7){const k=Math.sin(y*1.7)*3;s+=`<path class="rootp" stroke-width="1.4" d="M${172} ${y}l${-14-k} ${5}M${185} ${y+3}l${15+k} ${5}"/>`}return s})();
const DIA={};




DIA.leaf={spots:[['leaf-blade','Dicot leaf'],['leaf-mono','Monocot leaf'],['leaf-stomata','Stomata'],['surface','Surface']],svg:`<svg viewBox="0 0 360 440">
<path class="stemp" stroke-width="7" d="M180 428C180 400 183 372 180 346"/>
<path class="leafp" d="M180 346C86 330 52 206 180 36C308 206 274 330 180 346Z"/>
<path class="vein" stroke-width="4" d="M180 346L180 52"/>
<path class="vein" d="M180 300Q140 280 112 250M180 250Q136 228 100 190M180 200Q146 178 124 140M180 150Q158 130 146 100"/>
<path class="vein" d="M180 300Q220 280 248 250M180 250Q224 228 260 190M180 200Q214 178 236 140M180 150Q202 130 214 100"/>
<path class="cut" d="M104 214H256"/>
${spot('leaf-blade',232,214,'Dicot leaf',270,240,'middle')}
<g transform="translate(118 292)"><ellipse cx="-5" rx="5" ry="9" fill="var(--leaf2)"/><ellipse cx="5" rx="5" ry="9" fill="var(--leaf2)"/></g>
${spot('leaf-stomata',118,292,'Stomata',118,330,'middle')}
${ann(120,236,52,228,'Lamina','end')}${ann(182,120,238,84,'Midrib')}${ann(238,172,296,150,'Veins')}${ann(181,392,238,408,'Petiole')}${ann(182,38,238,26,'Apex')}
<path class="leafp" d="M300 424C292 380 296 340 308 296C320 340 326 380 316 424Z"/><path class="vein" d="M304 420V304M308 420V300M312 420V304"/>
${spot('leaf-mono',308,360,'Monocot leaf',308,434,'middle')}${spot('surface',236,318,'Surface',236,356,'middle')}
</svg>`};




DIA.stem={spots:[['stem-dicot','Dicot stem'],['stem-mono','Monocot stem'],['stem-wood','Tree trunk'],['bud-apical','Buds']],svg:`<svg viewBox="0 0 360 440">
<path class="stemp" stroke-width="16" d="M180 424L180 56"/>
<path class="stemp" stroke-width="22" d="M180 330h0M180 200h0M180 82h0" opacity=".55"/>
<path class="leafp" d="M172 330C150 316 120 316 96 300C120 292 156 304 172 330Z"/>
<path class="leafp" d="M188 200C210 186 240 186 264 170C240 162 204 174 188 200Z"/>
<path class="leafp" d="M172 82C150 68 120 68 96 52C120 44 156 56 172 82Z"/>
<ellipse cx="195" cy="322" rx="5" ry="9" fill="var(--pollen)"/><ellipse cx="180" cy="42" rx="7" ry="15" fill="var(--pollen)"/>
<ellipse class="cut" cx="180" cy="142" rx="22" ry="7"/>
${spot('stem-dicot',180,142,'Dicot section',146,132,'end')}
<g fill="none" stroke="var(--root)" stroke-width="2">${[40,32,24,16,8].map(r=>`<circle cx="276" cy="360" r="${r}"/>`).join('')}</g>
${spot('stem-wood',276,360,'Trunk rings',276,416,'middle')}
${ann(188,42,244,30,'Terminal bud')}${ann(188,206,252,236,'Node')}${ann(172,270,112,276,'Internode','end')}${ann(200,318,262,296,'Axillary bud')}
<rect x="44" y="290" width="12" height="130" rx="4" fill="var(--stem)"/><path d="M40 330h20M40 370h20" stroke="var(--leaf2)" stroke-width="3"/>
<path class="leafp" d="M56 330C84 322 108 322 124 304C104 336 80 342 56 340Z"/>
${spot('stem-mono',50,380,'Monocot stem',50,434,'middle')}${spot('bud-apical',180,48,'Buds',120,24,'end')}
</svg>`};




DIA.root={spots:[['root-cross','Dicot root'],['root-mono','Monocot root'],['root-tip','Root tip'],['root-hair','Root hair']],svg:`<svg viewBox="0 0 360 440">
<rect class="soil" x="0" y="60" width="360" height="380" opacity=".55"/><path class="soilline" d="M0 60H360"/>
<text class="ann" x="10" y="80">SOIL</text><path class="stemp" stroke-width="9" d="M180 8L180 62"/>
<path class="rootp" stroke-width="10" d="M180 60C176 160 184 280 178 392"/>
<path class="rootp" stroke-width="4" d="M180 130C150 140 124 160 100 200M179 200C150 214 126 246 112 290M178 270C148 288 134 318 128 350M180 110C210 122 236 140 262 176M181 190C212 204 238 228 254 270M180 260C210 278 228 300 238 340"/>
${hairs}
<ellipse cx="178" cy="402" rx="9" ry="13" fill="var(--root)" opacity=".6"/>
<path class="cut" d="M150 180H210"/>
${spot('root-cross',180,180,'Dicot root',206,164)}
${spot('root-hair',192,352,'Root hair',212,376)}
${ann(176,96,112,92,'Taproot','end')}${ann(250,168,350,126,'Lateral root','end')}${ann(184,408,236,424,'Root cap')}
<path class="rootp" stroke-width="2" d="M44 296V330M44 330C34 352 26 380 20 420M44 330C44 360 46 392 46 424M44 330C56 352 66 380 74 420"/>
${spot('root-mono',44,376,'Monocot root',44,436,'middle')}${spot('root-tip',178,396,'Root tip',140,430,'end')}
</svg>`};




DIA.flower={spots:[['flower-3d','Whole flower'],['flower-ovary','Ovary section']],svg:`<svg viewBox="0 0 360 440">
<path class="stemp" stroke-width="8" d="M180 340L180 432"/>
<path class="petalp" d="M172 306C112 296 66 232 80 156C128 172 168 232 172 306Z"/>
<path class="petalp" d="M188 306C248 296 294 232 280 156C232 172 192 232 188 306Z"/>
<path class="leafp" d="M180 330C150 336 128 322 112 300C140 304 164 312 180 322Z"/><path class="leafp" d="M180 330C210 336 232 322 248 300C220 304 196 312 180 322Z"/>
<ellipse cx="180" cy="334" rx="22" ry="11" fill="var(--stem)"/>
<path class="stemp" stroke-width="5" d="M180 300L180 126" style="stroke:var(--leaf2)"/>
<ellipse cx="180" cy="282" rx="20" ry="26" fill="var(--leaf)" stroke="var(--leaf2)" stroke-width="1.5"/>
<circle cx="180" cy="118" r="9" class="pollen"/>
<path class="stemp" stroke-width="3" d="M168 300Q150 220 138 172"/><ellipse class="pollen" cx="136" cy="164" rx="8" ry="12" transform="rotate(-14 136 164)"/>
<path class="stemp" stroke-width="3" d="M192 300Q210 220 222 172"/><ellipse class="pollen" cx="224" cy="164" rx="8" ry="12" transform="rotate(14 224 164)"/>
${spot('flower-ovary',180,282,'Ovary',206,286)}
${spot('flower-3d',268,206,'Whole flower',268,244,'middle')}
${ann(188,114,240,92,'Stigma')}${ann(181,190,236,170,'Style')}${ann(132,158,92,118,'Anther','end')}${ann(90,200,38,182,'Petal','end')}${ann(122,312,56,332,'Sepal','end')}${ann(198,336,254,356,'Receptacle')}
</svg>`};




DIA.fruit={spots:[['fruit-cross','Fruit section'],['seed','Seed']],svg:`<svg viewBox="0 0 360 440">
<path class="stemp" stroke-width="7" d="M180 112Q184 84 204 68"/>
<circle class="fruitp" cx="180" cy="250" r="132"/>
<circle class="fleshp" cx="180" cy="250" r="118"/>
<ellipse class="corep" cx="180" cy="254" rx="40" ry="58"/>
${[[166,226,-20],[196,226,20],[160,262,-10],[200,262,10],[180,286,0],[180,238,0]].map(s=>`<ellipse class="seedp" cx="${s[0]}" cy="${s[1]}" rx="6" ry="10" transform="rotate(${s[2]} ${s[0]} ${s[1]})"/>`).join('')}
<path d="M164 122l16 14 16-14-6 20h-20z" fill="var(--leaf2)"/>
${spot('fruit-cross',104,236,'Fruit section',104,282,'middle')}
${spot('seed',180,262,'Seed',232,306)}
${ann(268,152,312,120,'Skin')}${ann(262,222,322,214,'Flesh')}${ann(200,76,250,58,'Pedicel')}
</svg>`};




DIA.seed={spots:[['seed','Dicot seed'],['seed-mono','Monocot grain']],svg:`<svg viewBox="0 0 360 440">
<ellipse cx="180" cy="230" rx="112" ry="152" fill="var(--root)"/><ellipse cx="180" cy="230" rx="98" ry="138" fill="#fff3d6"/>
<ellipse cx="172" cy="236" rx="62" ry="88" fill="var(--leaf)" opacity=".85"/>
<path class="rootp" stroke-width="16" d="M150 306Q130 344 118 376"/><path class="stemp" stroke-width="12" d="M178 176Q180 144 192 122"/>
${spot('seed',180,230,'Seed',180,424,'middle')}
${ann(262,160,318,138,'Seed coat')}${ann(262,260,322,272,'Stored food')}${ann(126,214,56,196,'Cotyledon','end')}${ann(122,372,56,396,'Radicle','end')}${ann(194,126,248,104,'Plumule')}
<ellipse cx="304" cy="376" rx="22" ry="30" fill="#f2c14e" stroke="var(--root)" stroke-width="2"/>
${spot('seed-mono',304,376,'Monocot grain',304,432,'middle')}
</svg>`};




DIA.buds={spots:[['bud-apical','Bud section']],svg:`<svg viewBox="0 0 360 440">
<path class="stemp" stroke-width="14" d="M180 424L180 96"/>
<ellipse cx="180" cy="72" rx="18" ry="34" fill="var(--leaf)" stroke="var(--leaf2)" stroke-width="2"/>
<path class="leafp" d="M188 260C220 244 258 248 292 226C264 288 220 288 188 260Z"/><ellipse cx="198" cy="248" rx="7" ry="14" fill="var(--leaf2)"/>
<path class="stemp" stroke-width="5" d="M172 330Q142 312 120 300"/><ellipse cx="108" cy="290" rx="15" ry="22" fill="var(--petal)" stroke="var(--leaf2)" stroke-width="2"/>
${spot('bud-apical',180,74,'Bud section',226,70)}
${ann(198,50,252,30,'Apical bud')}${ann(204,246,262,300,'Axillary bud')}${ann(96,276,40,254,'Flower bud','end')}
</svg>`};




DIA.surface={spots:[['surface','Leaf surface']],svg:`<svg viewBox="0 0 360 440">
<path class="leafp" d="M180 410C60 366 50 200 180 36C310 200 300 366 180 410Z"/><path class="vein" stroke-width="4" d="M180 410L180 52"/>
<circle cx="180" cy="230" r="66" fill="var(--panel)" stroke="var(--accent)" stroke-width="2"/>
<g stroke="var(--leaf2)" stroke-width="2" fill="none"><path d="M150 250l-6-30M180 262l0-40M208 246l8-32M164 214l-8-26M196 208l10-22"/></g>
${spot('surface',180,230,'Leaf surface',180,324,'middle')}
${ann(230,190,296,166,'Trichome')}${ann(130,262,60,286,'Epidermis','end')}${ann(214,262,290,298,'Cuticle')}
</svg>`};




DIA.habit={spots:[['habit','Plant habits']],svg:`<svg viewBox="0 0 360 440">
<path d="M0 360H360" stroke="var(--root)" stroke-width="3"/>
<path class="stemp" stroke-width="3" d="M40 360V300"/><circle cx="40" cy="294" r="8" fill="var(--petal)"/>
<g class="stemp" stroke-width="3" fill="none"><path d="M90 360Q84 330 76 306M90 360L90 300M90 360Q98 330 108 308"/></g>
<circle cx="76" cy="302" r="14" fill="var(--leaf)"/><circle cx="90" cy="294" r="14" fill="var(--leaf)"/><circle cx="108" cy="304" r="14" fill="var(--leaf)"/>
<path d="M180 360V230" stroke="var(--root)" stroke-width="12"/><circle cx="180" cy="200" r="46" fill="var(--leaf)"/><circle cx="150" cy="226" r="30" fill="var(--leaf2)" opacity=".7"/><circle cx="212" cy="226" r="30" fill="var(--leaf2)" opacity=".7"/>
<path d="M262 360V210" stroke="#9e9e9e" stroke-width="4"/><path class="stemp" stroke-width="3" fill="none" d="M256 360Q270 340 256 320Q270 300 256 280Q270 260 256 240Q270 224 262 212"/>
<path class="stemp" stroke-width="3" fill="none" d="M300 356Q320 344 340 358Q352 350 358 356"/>
${spot('habit',180,300,'Plant habits',180,420,'middle')}
${ann(40,280,40,262,'Herb','middle')}${ann(90,280,90,258,'Shrub','middle')}${ann(180,150,180,130,'Tree','middle')}${ann(262,200,262,184,'Climber','middle')}${ann(330,340,330,324,'Creeper','middle')}
</svg>`};





const T=THREE, TAU=Math.PI*2;
const M=(c,o)=>new T.MeshStandardMaterial(Object.assign({color:c,roughness:.65,metalness:0,side:T.DoubleSide},o||{}));
const rnd=(()=>{let s=7;return()=>{s=(s*16807)%2147483647;return(s-1)/2147483646}})();
class Sc{
  constructor(){this.group=new T.Group();this.parts=[];this.byId={};this.tick=null;this.cam=6;this.view=[.35,-.5];this.title='';this.sub=''}
  part(id,name,desc,anchor){if(!this.byId[id]){const p={id,name,desc,anchor:anchor||null,mats:[],meshes:[]};this.byId[id]=p;this.parts.push(p)}return this.byId[id]}
  add(id,mesh,parent){const p=this.byId[id];mesh.userData.pid=id;if(p.mats.indexOf(mesh.material)<0)p.mats.push(mesh.material);p.meshes.push(mesh);(parent||this.group).add(mesh);return mesh}
}
const mesh=(g,m,x,y,z)=>{const o=new T.Mesh(g,m);o.position.set(x||0,y||0,z||0);return o};





function radial(S,rings,len,cut){
  cut=cut||Math.PI/2;const span=TAU-cut;
  rings.forEach((r,i)=>{
    S.part(r.id,r.name,r.desc);const p=S.byId[r.id];
    if(r.virtual){p.vm=M(r.color);return}
    if(!p.anchor){const a=Math.PI*.85+i*.22,rm=(r.r0+r.r1)/2;p.anchor=[rm*Math.cos(a),rm*Math.sin(a),len/2]}
    const mat=M(r.color,r.mat);const add=g=>S.add(r.id,new T.Mesh(g,mat));
    add(new T.RingGeometry(r.r0,r.r1,64,1,cut,span).translate(0,0,len/2));
    add(new T.CylinderGeometry(r.r1,r.r1,len,64,1,true,cut+Math.PI/2,span).rotateX(Math.PI/2));
    if(r.r0>0)add(new T.CylinderGeometry(r.r0,r.r0,len,64,1,true,cut+Math.PI/2,span).rotateX(Math.PI/2));
    const w=r.r1-r.r0,c=(r.r0+r.r1)/2;
    add(new T.PlaneGeometry(w,len).rotateX(Math.PI/2).translate(c,0,0));
    add(new T.PlaneGeometry(w,len).rotateX(Math.PI/2).translate(c,0,0).rotateZ(cut));
  });
  S.inCut=(a,m)=>{a=((a%TAU)+TAU)%TAU;return a<cut+m||a>TAU-m};
  S.len=len;
}

function rod(S,id,r,rad,x,y,color){
  const p=S.byId[id];if(!p.vm)p.vm=M(color);
  return S.add(id,mesh(new T.CylinderGeometry(rad,rad,S.len+.03,24).rotateX(Math.PI/2),p.vm,x,y,0));
}
const pol=(r,a)=>[r*Math.cos(a),r*Math.sin(a)];


function cutSphere(S,id,r,mat,parent){S.add(id,mesh(new T.SphereGeometry(r,48,32,Math.PI/2,Math.PI*1.5),mat),parent)}
function faces(S,id,r,mat,off,parent){
  S.add(id,mesh(new T.CircleGeometry(r,48,Math.PI/2,Math.PI).translate(0,0,off),mat),parent);
  S.add(id,mesh(new T.CircleGeometry(r,48,-Math.PI/2,Math.PI).rotateY(-Math.PI/2).translate(-off,0,0),mat),parent)}


function rod2(S,id,rad,x,y,color,extra){return S.add(id,mesh(new T.CylinderGeometry(rad,rad,S.len+extra,20).rotateX(Math.PI/2),M(color),x,y,0))}
function hairsOn(S,id,n,color,zrange){const hm=M(color),up=new T.Vector3(0,1,0);
  for(let i=0;i<n;i++){const a=Math.PI/2+.25+rnd()*(TAU-Math.PI/2-.5),z=(rnd()-.5)*zrange,l=.25+rnd()*.25,d=new T.Vector3(Math.cos(a),Math.sin(a),(rnd()-.5)*.5).normalize();
    const h=mesh(new T.CylinderGeometry(.01,.02,l,5).translate(0,l/2,0),hm,Math.cos(a),Math.sin(a),z);h.quaternion.setFromUnitVectors(up,d);S.add(id,h)}}

const SC={};




SC['stem-dicot']=()=>{const S=new Sc();S.title='Dicot stem: highway for water and food';S.sub='Vascular bundles sit in a ring. The cambium makes the stem thicker.';S.cam=5.4;
  radial(S,[
    {id:'epi',name:'Epidermis',desc:'',r0:.94,r1:1,color:0x4caf50},
    {id:'hypo',name:'Hypodermis (collenchyma)',desc:'',r0:.88,r1:.94,color:0x7cb342},
    {id:'cortex',name:'Cortex (ground tissue)',desc:'',r0:.5,r1:.88,color:0xa5d6a7},
    {id:'cambium',name:'Cambium',desc:'A thin ring of dividing cells. The stem thickens year after year from here.',r0:.43,r1:.5,color:0xffd54f},
    {id:'pith',name:'Pith (ground tissue)',desc:'',r0:0,r1:.43,color:0xfff3d6},
    {id:'vb',name:'Vascular bundles',desc:'',virtual:1,color:0xf1e7c8},
    {id:'xylem',name:'Xylem',desc:'',virtual:1,color:0xe65100},
    {id:'phloem',name:'Phloem',desc:'Delivers sugar made in the leaves to the whole plant.',virtual:1,color:0x9575cd}
  ],2.4);
  for(let k=0;k<8;k++){const a=k*TAU/8+.2;if(S.inCut(a,.25))continue;
    let [x,y]=pol(.48,a);rod2(S,'vb',0,.15,x,y,0xf1e7c8,.012);[x,y]=pol(.36,a);rod(S,'xylem',0,.075,x,y);[x,y]=pol(.6,a);rod(S,'phloem',0,.09,x,y)}
  S.byId.xylem.anchor=[...pol(.36,Math.PI*1.15),1.2];S.byId.phloem.anchor=[...pol(.6,Math.PI*1.4),1.2];
  return S};




SC['stem-wood']=()=>{const S=new Sc();S.title='Tree trunk: a diary of the years';S.sub='Each annual ring is one year of growth. Count the rings to find the age.';S.cam=5.2;
  const rings=[{id:'pith',name:'Pith',desc:'The oldest, soft centre.',r0:0,r1:.05,color:0x3e2723}];
  for(let i=0;i<6;i++)rings.push({id:'heart',name:'Heartwood',desc:'Old, hard wood (no longer alive). This is what timber comes from.',r0:.05+i*.075,r1:.125+i*.075,color:i%2?0x7a4a22:0x8d5a2b});
  for(let i=0;i<4;i++)rings.push({id:'sap',name:'Sapwood',desc:'Living xylem. Lifts water up from the roots.',r0:.5+i*.06,r1:.56+i*.06,color:i%2?0xc89655:0xd7a86e});
  rings.push({id:'cambium',name:'Cambium',desc:'A living layer just one cell thick. Makes xylem inward and phloem outward.',r0:.74,r1:.77,color:0x9ccc65});
  rings.push({id:'phloem',name:'Phloem (inner bark)',desc:'The sugar pathway. Cut it all the way round and the tree dies (girdling).',r0:.77,r1:.86,color:0xefe3c2});
  rings.push({id:'bark',name:'Bark',desc:'Outer armour: protects against fire, insects and dehydration.',r0:.86,r1:1,color:0x4e342e,mat:{roughness:1}});
  radial(S,rings,1.6);S.byId.heart.anchor=[-.3,.15,.8];S.byId.sap.anchor=[-.62,-.15,.8];return S};




SC['root-cross']=()=>{const S=new Sc();S.title='Root section: the water’s journey inwards';S.sub='From the epidermis through the cortex, then past the endodermis gate to the xylem.';S.cam=5.4;
  radial(S,[
    {id:'epi',name:'Epidermis',desc:'Outer layer. Root hairs grow from here.',r0:.93,r1:1,color:0xd7b98e},
    {id:'cortex',name:'Cortex',desc:'Large parenchyma zone. Starch is stored here and water passes between the cells.',r0:.56,r1:.93,color:0xe6d2a6},
    {id:'endo',name:'Endodermis',desc:'Layer with the Casparian strip: it decides what gets inside.',r0:.5,r1:.56,color:0xffd54f},
    {id:'peri',name:'Pericycle',desc:'Lateral roots start from here.',r0:.44,r1:.5,color:0xfffdf2},
    {id:'stele',name:'Stele',desc:'The vascular cylinder at the centre.',r0:0,r1:.44,color:0xe8dcc0},
    {id:'xylem',name:'Xylem (star)',desc:'Star-shaped. Water climbs up towards the stem.',virtual:1,color:0xe65100},
    {id:'phloem',name:'Phloem',desc:'Sugar arriving from the leaves down to the roots.',virtual:1,color:0x9575cd}
  ],1.6);
  for(let k=0;k<4;k++){const a=Math.PI/4+k*Math.PI/2;if(!S.inCut(a,.15)){const o=S.add('xylem',mesh(new T.BoxGeometry(.4,.09,S.len+.03).translate(.2,0,0),S.byId.xylem.vm));o.rotation.z=a}
    const b=k*Math.PI/2;if(!S.inCut(b,.2)){const [x,y]=pol(.3,b);rod(S,'phloem',0,.07,x,y)}}
  rod(S,'xylem',0,.09,0,0);
  
  {const zf=S.len/2+.006,cellG=new T.CircleGeometry(.055,14),grainG=new T.CircleGeometry(.014,6),cm=M(0xfffaf0),gm=M(0xc9a35a);
   [[.63,14],[.73,18],[.83,22]].forEach(([r,n],ri)=>{for(let i=0;i<n;i++){const a=i*TAU/n+ri*.18;if(S.inCut(a,.12))continue;const [x,y]=pol(r,a);
     S.add('cortex',mesh(cellG,cm,x,y,zf));S.add('cortex',mesh(grainG,gm,x+.012,y-.01,zf+.002))}});
   S.part('casp','Casparian strip','',[.1,-.53,.85]);const cp=M(0x6d4c41);
   for(let i=0;i<28;i++){const a=i*TAU/28+.05;if(S.inCut(a,.1))continue;const [x,y]=pol(.53,a);const o=S.add('casp',mesh(new T.BoxGeometry(.05,.022,.012),cp,x,y,zf));o.rotation.z=a}
   const vm=M(0xbf360c);
   for(let k=0;k<4;k++){const a=Math.PI/4+k*Math.PI/2;if(S.inCut(a,.15))continue;[.14,.24,.34].forEach((r,j)=>{const [x,y]=pol(r,a);S.add('xylem',mesh(new T.CircleGeometry(.032+.006*j,10),vm,x,y,S.len/2+.02))})}
   const aL=3.9,dx=Math.cos(aL),dy=Math.sin(aL),lm=M(0xd7b98e),L2=1.0;
   S.part('lat','Lateral root','',[dx*1.3,dy*1.3,-.2]);
   const lb=S.add('lat',new T.Mesh(new T.CylinderGeometry(.085,.12,L2,16).translate(0,L2/2,0),lm));lb.position.set(dx*.46,dy*.46,-.2);lb.rotation.z=aL-Math.PI/2;
   S.add('lat',mesh(new T.SphereGeometry(.085,14,10),lm,dx*(.46+L2),dy*(.46+L2),-.2));
   S.part('hair','Root hairs','',[.9,-1.2,.3]);const hm=M(0xf1e6cf),up=new T.Vector3(0,1,0);
   for(let i=0;i<70;i++){const a=Math.PI/2+.25+rnd()*(TAU-Math.PI/2-.5);if(Math.abs(a-aL)<.25)continue;const z=(rnd()-.5)*1.5,l=.25+rnd()*.25;
     const d=new T.Vector3(Math.cos(a),Math.sin(a),(rnd()-.5)*.5).normalize();
     const h=mesh(new T.CylinderGeometry(.01,.02,l,5).translate(0,l/2,0),hm,Math.cos(a),Math.sin(a),z);h.quaternion.setFromUnitVectors(up,d);S.add('hair',h)}}
  S.byId.xylem.anchor=[-.3,.3,.8];S.byId.phloem.anchor=[-.3,0,.8];return S};




SC['root-hair']=()=>{const S=new Sc();S.title='Root hair: one long cell, huge surface';S.sub='A root hair can be ~1 mm long. Water is drawn in from the soil.';S.cam=6.4;S.view=[.25,-.35];
  S.part('root','Root (epidermis)','The root surface. Each root hair is a single epidermal cell.',[0,.5,0]);
  S.part('hair','Root hairs','Thin, long cells: they multiply the surface area, so more water is absorbed.',[.5,1.0,.4]);
  S.part('soil','Soil particles','A thin film of water sits between the soil particles.',[-1.4,-1.5,.6]);
  S.part('water','Water + minerals','Water moves into the root hair by osmosis.',[1.1,-1.1,1.0]);
  S.add('root',mesh(new T.CylinderGeometry(.45,.45,3.4,32).rotateZ(Math.PI/2),M(0xd7b98e)));
  const hm=M(0xf1e6cf),up=new T.Vector3(0,1,0),dirs=[];
  for(let i=0;i<110;i++){const x=-1.5+rnd()*3,a=rnd()*TAU,d=new T.Vector3(0,Math.cos(a),Math.sin(a)),len=.45+rnd()*.5;
    const g=new T.CylinderGeometry(.012,.022,len,5).translate(0,len/2,0);
    const h=mesh(g,hm,x,d.y*.45,d.z*.45);h.quaternion.setFromUnitVectors(up,d.clone().add(new T.Vector3((rnd()-.5)*.4,0,0)).normalize());S.add('hair',h)}
  const sm=[M(0x6d4c41),M(0x8d6e63)];
  for(let i=0;i<46;i++){const a=rnd()*TAU,r=1.05+rnd()*1.1,x=-1.7+rnd()*3.4;
    const o=S.add('soil',mesh(new T.DodecahedronGeometry(.1+rnd()*.12),sm[i%2],x,Math.cos(a)*r,Math.sin(a)*r));o.rotation.set(rnd()*3,rnd()*3,0)}
  const wm=M(0x4fc3f7,{emissive:0x0277bd,emissiveIntensity:.5}),drops=[];
  for(let i=0;i<26;i++){const d={a:rnd()*TAU,x:-1.4+rnd()*2.8,o:rnd()};d.m=S.add('water',mesh(new T.SphereGeometry(.055,10,8),wm));drops.push(d)}
  S.tick=t=>drops.forEach(d=>{const p=(t*.22+d.o)%1,r=2.1-p*1.55;d.m.position.set(d.x,Math.cos(d.a)*r,Math.sin(d.a)*r)});
  return S};




SC['leaf-blade']=()=>{const S=new Sc();S.title='Leaf: what it looks like inside';S.sub='A leaf is ~0.1–0.3 mm thick. Every layer has its own job.';S.cam=6.6;S.view=[.28,-.42];
  const W=3.4,D=2,pr=(id,n,d,a)=>S.part(id,n,d,a);
  pr('cuticle','Cuticle','Waxy layer: stops water from evaporating.',[-1.4,.88,1]);
  pr('uepi','Upper epidermis','Clear, pale green: lets sunlight pass through.',[-1.4,.7,1]);
  pr('pal','Palisade mesophyll','Tall cells packed with chloroplasts. Most photosynthesis happens here.',[-1.2,.25,1]);
  pr('spo','Spongy mesophyll','Loose cells with air gaps between them: gases move through.',[1.2,-.5,1]);
  pr('vein','Vein (xylem + phloem)','Xylem on top brings water, phloem below carries sugar away.',[-.4,-.15,1]);
  pr('lepi','Lower epidermis','The bottom layer. It contains the stomata.',[-1.2,-.85,1]);
  pr('stomata','Stomata + guard cells','A tiny gap between two guard cells: CO₂ in, water vapour out.',[.9,-1,1]);
  pr('sun','Sunlight','Light energy that chloroplasts turn into glucose.',[-1.2,1.7,0]);
  const layers=[['cuticle',.05,0xdce775,{transparent:true,opacity:.9}],['uepi',.2,0xaed581],['pal',.6,0x1b5e20],['spo',.78,0xc5e1a5],['lepi',.2,0x9ccc65]];
  let y=.95,ys={};
  layers.forEach(l=>{ys[l[0]]=[y-l[1]/2,l[1]];
    if(l[0]==='lepi'){const m=M(l[2]),gw=.2,gx=.9;
      const lw=(gx-gw/2)+W/2,rw=W/2-(gx+gw/2);
      S.add('lepi',mesh(new T.BoxGeometry(lw,l[1],D),m,-W/2+lw/2,y-l[1]/2,0));S.add('lepi',mesh(new T.BoxGeometry(rw,l[1],D),m,W/2-rw/2,y-l[1]/2,0))}
    else S.add(l[0],mesh(new T.BoxGeometry(W,l[1],D),M(l[2],l[3]),0,y-l[1]/2,0));
    y-=l[1]});
  const [py,ph]=ys.pal,cm=M(0x43a047),chm=M(0x0d3b12);
  for(let k=0;k<11;k++)for(let j=0;j<3;j++){const x=-1.5+k*.3,z=.8-j*.5;
    S.add('pal',mesh(new T.CylinderGeometry(.11,.11,ph-.06,14),cm,x,py,z));
    if(j===0)for(let c=0;c<3;c++)S.add('pal',mesh(new T.SphereGeometry(.035,8,6),chm,x+(c-1)*.04,py+(c-1)*.14,z+.1))}
  const [sy,sh]=ys.spo,sm=M(0x81c784);
  for(let i=0;i<20;i++){const r=.15+rnd()*.1;S.add('spo',mesh(new T.SphereGeometry(r,14,10),sm,-1.45+rnd()*2.9,sy+(rnd()-.5)*(sh-.3),.1+rnd()*.85)).scale.y=.8}
  const vy=py-ph/2;
  S.add('vein',mesh(new T.CylinderGeometry(.27,.27,D+.02,24).rotateX(Math.PI/2),M(0xdce775),-.4,vy,0));
  S.add('vein',mesh(new T.CylinderGeometry(.1,.1,D+.04,18).rotateX(Math.PI/2),M(0xe65100),-.4,vy+.08,0));
  S.add('vein',mesh(new T.CylinderGeometry(.09,.09,D+.04,18).rotateX(Math.PI/2),M(0x9575cd),-.4,vy-.1,0));
  const gm=M(0x2e7d32),[ly]=ys.lepi;
  [-1,1].forEach(s=>{const g=mesh(new T.SphereGeometry(1,16,12),gm,.9+s*.17,ly,0);g.scale.set(.09,.1,.9);S.add('stomata',g)});
  const sun=M(0xffd54f,{emissive:0xffb300,emissiveIntensity:.8}),ag=[];
  [-1.2,-.4,.4].forEach(x=>{const a=new T.Group();a.position.set(x,1.7,0);
    const sh=mesh(new T.CylinderGeometry(.03,.03,.5,8),sun),hd=mesh(new T.ConeGeometry(.09,.2,12),sun,0,-.32,0);
    [sh,hd].forEach(o=>{S.add('sun',o,a)});S.group.add(a);ag.push(a)});
  S.tick=t=>ag.forEach((a,i)=>a.position.y=1.7+Math.sin(t*2+i)*.08);
  return S};




SC['leaf-stomata']=()=>{const S=new Sc();S.title='Stomata: the leaf’s doorway';S.sub='A ~20–30 µm opening. It opens when the guard cells swell and closes when they shrink.';S.cam=6.4;S.view=[.95,0];
  S.part('guard','Guard cells','Two bean-shaped cells. They bend as they fill with water, opening the pore between them.',[-.55,.15,0]);
  S.part('pore','Pore','Gas pathway: CO₂ in, O₂ and water vapour out.',[0,.1,.0]);
  S.part('epi','Epidermal cells','Ordinary surface cells, with the stomata in the middle.',[1.6,.1,.6]);
  S.part('vapor','Water vapour','Transpiration: water escapes here and pulls fresh water up from the roots.',[.3,1.1,0]);
  const em=M(0xaed581);
  for(let q=-2;q<=2;q++)for(let r=-2;r<=2;r++){if(Math.abs(q+r)>2||(q===0&&r===0))continue;
    S.add('epi',mesh(new T.CylinderGeometry(.56,.56,.12,6),em,.97*(q+r/2)*1.04*1.0,0,.9*r*1.04)).rotation.y=Math.PI/6}
  const gm=M(0x388e3c),gl=new T.Group(),gr=new T.Group();S.group.add(gl,gr);
  const arc=(s)=>new T.TorusGeometry(.42,.13,12,28,Math.PI).rotateZ(s*Math.PI/2).rotateX(Math.PI/2);
  S.add('guard',mesh(arc(1),gm),gl);S.add('guard',mesh(arc(-1),gm),gr);
  const pore=S.add('pore',mesh(new T.SphereGeometry(1,16,10),M(0x06150c),0,.0,0));
  const vm=M(0x81d4fa,{transparent:true,opacity:.8}),vs=[];
  for(let i=0;i<9;i++){const v={o:i/9,dx:(rnd()-.5)*.3,dz:(rnd()-.5)*.5};v.m=S.add('vapor',mesh(new T.SphereGeometry(.05,8,6),vm));vs.push(v)}
  S.tick=t=>{const o=(Math.sin(t*1.1)+1)/2,gap=.03+.15*o;gl.position.x=-gap;gr.position.x=gap;pore.scale.set(gap*1.1,.05,.36);
    vs.forEach(v=>{const p=(t*.35+v.o)%1;v.m.position.set(v.dx,.15+p*1.4,v.dz);v.m.scale.setScalar(.2+o*.9)})};
  return S};




SC['flower-3d']=()=>{const S=new Sc();S.title='Flower: inner parts (front petal removed)';S.sub='Petals and sepals outside, stamens inside, pistil in the middle.';S.cam=6.4;S.view=[.5,-.35];
  S.part('petal','Petals (corolla)','Attract insects with colour and scent.',[1.2,1.3,.2]);
  S.part('sepal','Sepals (calyx)','Leaf-like and green: cover and protect the bud.',[-1.1,-.15,.2]);
  S.part('stamen','Stamens','Filament + anther. Pollen is made in the anther (male part).',[.8,1.15,.1]);
  S.part('pistil','Pistil','Stigma, style and ovary: the female part, with ovules inside.',[0,1.7,0]);
  const pm=M(0xf06292),sm=M(0x66bb6a),am=M(0xffca28),fm=M(0xe0e0a0),om=M(0x7cb342);
  const front=a=>{a=((a+Math.PI)%TAU+TAU)%TAU-Math.PI;return Math.abs(a)<.7};
  for(let k=0;k<5;k++){const a=k*TAU/5;if(front(a))continue;
    const g=new T.Group();g.rotation.y=a;const p=mesh(new T.SphereGeometry(1,20,14),pm,0,0,.95);p.scale.set(.5,.07,1);const pv=new T.Group();pv.rotation.x=.75;pv.add(p);g.add(pv);S.add('petal',p,pv);S.group.add(g)}
  for(let k=0;k<5;k++){const a=k*TAU/5+TAU/10;if(front(a))continue;
    const g=new T.Group();g.rotation.y=a;const p=mesh(new T.SphereGeometry(1,16,10),sm,0,0,.6);p.scale.set(.2,.05,.6);const pv=new T.Group();pv.rotation.x=-.25;pv.position.y=-.1;pv.add(p);g.add(pv);S.add('sepal',p,pv);S.group.add(g)}
  for(let k=0;k<7;k++){const a=k*TAU/7+.2;if(front(a))continue;
    const g=new T.Group();g.rotation.y=a;const pv=new T.Group();pv.position.z=.35;pv.rotation.x=.18;g.add(pv);
    S.add('stamen',mesh(new T.CylinderGeometry(.017,.017,1.3,8),fm,0,.65,0),pv);S.add('stamen',mesh(new T.SphereGeometry(.09,12,10),am,0,1.32,0),pv);S.group.add(g)}
  S.add('pistil',mesh(new T.SphereGeometry(.3,18,14),om,0,.28,0));
  S.add('pistil',mesh(new T.CylinderGeometry(.04,.05,1.2,10),om,0,.9,0));
  S.add('pistil',mesh(new T.SphereGeometry(.1,12,10),M(0xffb74d),0,1.55,0));
  S.add('sepal',mesh(new T.ConeGeometry(.22,.3,14),M(0x558b2f),0,-.1,0));
  S.group.position.y=-.5;return S};




SC['flower-ovary']=()=>{const S=new Sc();S.title='Ovary section: home of the seeds';S.sub='Ovules sit inside the locules. After fertilisation they become seeds.';S.cam=5.2;
  radial(S,[
    {id:'wall',name:'Ovary wall',desc:'Later becomes the fruit skin and flesh (pericarp).',r0:.8,r1:1,color:0x7cb342},
    {id:'tissue',name:'Placenta tissue',desc:'Ovules attach to this tissue and draw nutrition from it.',r0:0,r1:.8,color:0xe6ee9c},
    {id:'locule',name:'Locule',desc:'Hollow chamber where the ovules live.',virtual:1,color:0xfff8e1},
    {id:'ovule',name:'Ovules',desc:'Holds the egg cell. Once fertilised by pollen it becomes a seed.',virtual:1,color:0xffb74d}
  ],1.8,Math.PI/2);
  for(let k=0;k<3;k++){const a=Math.PI*.75+k*TAU/3;if(S.inCut(a,.5))continue;
    const [x,y]=pol(.46,a);rod(S,'locule',0,.27,x,y);
    for(let i=0;i<5;i++){const b=a+Math.PI+(i-2)*.28;const [ox,oy]=pol(.2,b);
      S.add('ovule',mesh(new T.SphereGeometry(.07,12,10),S.byId.ovule.vm,x+ox*.9,y+oy*.9,S.len/2-.04))}}
  S.byId.locule.anchor=[...pol(.46,Math.PI*.75),.9];S.byId.ovule.anchor=[-.2,-.5,.9];S.byId.tissue.anchor=[-.1,.1,.9];
  return S};




SC['fruit-cross']=()=>{const S=new Sc();S.title='Fruit section: the seed’s safe carriage';S.sub='Skin, flesh and core, with the seeds in the middle.';S.cam=5.4;S.view=[.35,.55];
  S.part('skin','Skin (exocarp)','Outer peel: protects what is inside.',[.7,.85,.7]);
  S.part('flesh','Flesh (mesocarp)','Juicy flesh: animals eat it and the seeds get spread far away.',[-.3,-.7,.1]);
  S.part('core','Core (endocarp)','The chamber around the seeds.',[-.15,.25,.05]);
  S.part('seed','Seeds','Each seed holds a tiny plant (embryo).',[-.2,-.05,.05]);
  S.part('stalk','Pedicel (stalk)','The stalk that joins the fruit to the plant and feeds it.',[0,1.2,0]);
  const skin=M(0xd32f2f),fl=M(0xff7043),core=M(0xfff3c4),sd=M(0xfdd835);
  cutSphere(S,'skin',1,skin);cutSphere(S,'flesh',.985,fl);faces(S,'flesh',.985,fl,0);
  cutSphere(S,'core',.38,core);faces(S,'core',.38,core,.004);
  for(let i=0;i<7;i++){const a=1.75+i*.38,r=i%3?.22:.1;const s=S.add('seed',mesh(new T.SphereGeometry(1,12,10),sd,Math.cos(a)*r*1.1,Math.sin(a)*r*1.3,.008));s.scale.set(.06,.1,.03);s.rotation.z=a-Math.PI/2}
  S.add('stalk',mesh(new T.CylinderGeometry(.05,.06,.3,10),M(0x558b2f),0,1.1,0));
  for(let k=0;k<5;k++){const c=S.add('stalk',mesh(new T.ConeGeometry(.07,.22,8),M(0x2e7d32),Math.cos(k*TAU/5)*.14,.99,Math.sin(k*TAU/5)*.14));c.rotation.set(Math.sin(k*TAU/5)*.9,0,-Math.cos(k*TAU/5)*.9)}
  return S};




SC['seed']=()=>{const S=new Sc();S.title='Seed: a whole plant in a sealed box';S.sub='With the right water and warmth, the radicle becomes the root and the plumule the stem.';S.cam=5.6;S.view=[.3,.5];
  const A=(x,y,z)=>[x*1.25,y*.8,z*.8];
  S.part('coat','Seed coat (testa)','Hard layer: protects the embryo from drying, insects and injury.',A(-.2,.95,.3));
  S.part('endo','Endosperm','Packed food. Gives energy until the sprout emerges.',A(.45,-.3,.3));
  S.part('cot','Cotyledon','Seed leaf: stores food or becomes the first leaf.',A(-.2,.0,.3));
  S.part('rad','Radicle','The future root. It emerges first.',A(-.9,-.1,.2));
  S.part('plu','Plumule','The future stem and first leaves.',A(-.25,.5,.2));
  const G=new T.Group();G.scale.set(1.25,.8,.8);S.group.add(G);
  cutSphere(S,'coat',1,M(0x8d5a2b),G);cutSphere(S,'endo',.95,M(0xfff3d6),G);faces(S,'endo',.95,M(0xfff3d6),0,G);
  S.add('cot',mesh(new T.SphereGeometry(1,24,16),M(0xaed581),-.25,0,0),G).scale.set(.55,.34,.28);
  const r=S.add('rad',mesh(new T.ConeGeometry(.12,.4,12).rotateZ(Math.PI/2),M(0xffcc80),-.72,-.04,0),G);
  S.add('plu',mesh(new T.ConeGeometry(.07,.3,10),M(0x66bb6a),-.2,.38,0),G);
  return S};




SC['root-mono']=()=>{const S=new Sc();S.title='Monocot root section: polyarch, with pith';S.sub='';S.cam=5.4;
  radial(S,[
    {id:'epi',name:'Epidermis',desc:'',r0:.94,r1:1,color:0xc8a165},
    {id:'cortex',name:'Cortex',desc:'',r0:.45,r1:.94,color:0xe6d2a6},
    {id:'endo',name:'Endodermis',desc:'',r0:.4,r1:.45,color:0x8d6e63},
    {id:'peri',name:'Pericycle',desc:'',r0:.35,r1:.4,color:0xffcc80},
    {id:'conj',name:'Conjunctive tissue',desc:'',r0:.13,r1:.35,color:0xfff3d6},
    {id:'pith',name:'Pith',desc:'',r0:0,r1:.13,color:0xfffde7},
    {id:'xylem',name:'Xylem (many arms)',desc:'',virtual:1,color:0xe65100},
    {id:'phloem',name:'Phloem',desc:'',virtual:1,color:0x9575cd}],1.6);
  const n=8;
  for(let k=0;k<n;k++){const a=k*TAU/n+.1,b=a+TAU/n/2;let p;
    if(!S.inCut(a,.2)){p=pol(.22,a);rod2(S,'xylem',0,.06,p[0],p[1],0xe65100,.03);p=pol(.32,a);rod2(S,'xylem',0,.032,p[0],p[1],0xe65100,.03)}
    if(!S.inCut(b,.2)){p=pol(.28,b);rod2(S,'phloem',0,.05,p[0],p[1],0x9575cd,.03)}}
  const zf=S.len/2+.006,cg=new T.CircleGeometry(.06,12),cm=M(0xfffaf0);
  [[.55,12],[.68,16],[.82,20]].forEach(([r,c],ri)=>{for(let i=0;i<c;i++){const a=i*TAU/c+ri*.2;if(S.inCut(a,.12))continue;const q=pol(r,a);S.add('cortex',mesh(cg,cm,q[0],q[1],zf))}});
  S.part('hair','Root hairs','',[.9,-1.2,.3]);hairsOn(S,'hair',60,0xf1e6cf,1.5);
  S.byId.xylem.anchor=[-.3,.15,.8];S.byId.phloem.anchor=[.1,-.3,.8];
  return S};




SC['root-tip']=()=>{const S=new Sc();S.title='Root tip: cap, meristem, elongation, hairs';S.sub='';S.cam=6.6;
  const pr=(id,n,a)=>S.part(id,n,'',a);
  pr('rcap','Root cap',[0,-1.95,.1]);pr('mer','Apical meristem',[0,-1.3,.1]);pr('elong','Zone of elongation',[.5,-.4,.1]);pr('matur','Zone of maturation',[.5,1.0,.1]);
  pr('epi','Epidermis',[-.48,.6,.1]);pr('cortex','Cortex',[-.36,1.3,.1]);pr('endo','Endodermis',[-.24,0,.1]);pr('peri','Pericycle',[.2,1.7,.1]);
  pr('xylem','Xylem',[0,1.2,.1]);pr('phloem','Phloem',[.14,.5,.1]);pr('hair','Root hairs',[.8,1.4,0]);
  const pl=(id,x0,x1,y0,y1,col,z,o)=>S.add(id,mesh(new T.PlaneGeometry(x1-x0,y1-y0),M(col,o),(x0+x1)/2,(y0+y1)/2,z));
  const dome=(rx,ry,cy,top)=>{const sh=new T.Shape();sh.moveTo(-rx,top);sh.lineTo(-rx,cy);for(let i=1;i<=24;i++){const t=Math.PI+i*Math.PI/24;sh.lineTo(rx*Math.cos(t),cy+ry*Math.sin(t))}sh.lineTo(rx,top);sh.closePath();return new T.ShapeGeometry(sh)};
  S.add('rcap',mesh(dome(.62,.65,-1.3,-1.3),M(0xd9bf94),0,0,0));
  S.add('mer',mesh(dome(.5,.45,-1.25,-.95),M(0xffd54f),0,0,.002));
  const y0=-.95,y1=2;
  [['epi',.46,.5,0xc8a165],['cortex',.26,.46,0xe6d2a6],['endo',.22,.26,0x8d6e63],['peri',.18,.22,0xffcc80],['phloem',.1,.18,0x9575cd]].forEach(([id,a,b,c])=>{pl(id,a,b,y0,y1,c,.004);pl(id,-b,-a,y0,y1,c,.004)});
  pl('xylem',-.1,.1,y0,y1,0xe65100,.004);
  pl('elong',-.52,.52,y0,.25,0x80cbc4,.008,{transparent:true,opacity:.16});pl('matur',-.52,.52,.25,y1,0xaed581,.008,{transparent:true,opacity:.14});
  const cg=new T.CircleGeometry(1,10),dm=M(0xf9a825),cp=M(0xf1dfb8),cl=M(0xfff8e1);
  for(let i=0;i<70;i++){const x=(rnd()*2-1)*.44,y=-1.62+rnd()*.64;if(y<-1.25&&Math.abs(x)>.5*Math.sqrt(Math.max(0,1-Math.pow((y+1.25)/.45,2))))continue;S.add('mer',mesh(cg,dm,x,y,.006)).scale.set(.022,.022,1)}
  for(let i=0;i<22;i++){const a=Math.PI+rnd()*Math.PI,r=.54+rnd()*.07,x=r*Math.cos(a),y=-1.3+r*1.05*Math.sin(a);S.add('rcap',mesh(cg,cp,x,y,.004)).scale.set(.045,.045,1)}
  for(let y=-.9;y<.2;y+=.22)[-1,1].forEach(s=>S.add('cortex',mesh(cg,cl,s*.36,y,.006)).scale.set(.05,.11,1));
  for(let y=.3;y<1.95;y+=.2)[-1,1].forEach(s=>S.add('cortex',mesh(cg,cl,s*.36,y,.006)).scale.set(.06,.07,1));
  const up=new T.Vector3(0,1,0),hm=M(0xf1e6cf);
  for(let y=.4;y<1.9;y+=.13)[-1,1].forEach(s=>{const ph=.35+rnd()*.5,l=.3+rnd()*.15,d=new T.Vector3(s*Math.cos(ph),Math.sin(ph),0),h=mesh(new T.CylinderGeometry(.008,.018,l,5).translate(0,l/2,0),hm,s*.5,y,.01);h.quaternion.setFromUnitVectors(up,d);S.add('hair',h)});
  const lp=[];for(let i=0;i<=12;i++){const f=i/12*Math.PI/2;lp.push(new T.Vector2(.62*Math.sin(f),-1.3-.65*Math.cos(f)))}lp.push(new T.Vector2(.5,-1.25),new T.Vector2(.5,y1));
  S.add('epi',mesh(new T.LatheGeometry(lp,40,Math.PI/2,Math.PI),M(0xc8a165)));
  return S};




SC['stem-mono']=()=>{const S=new Sc();S.title='Monocot stem (maize-type): scattered bundles';S.sub='';S.cam=5.4;
  radial(S,[
    {id:'epi',name:'Epidermis',desc:'',r0:.95,r1:1,color:0x4caf50},
    {id:'hypo',name:'Hypodermis (sclerenchyma)',desc:'',r0:.88,r1:.95,color:0x8d6e63},
    {id:'ground',name:'Ground tissue (parenchyma)',desc:'',r0:0,r1:.88,color:0xdcedc8},
    {id:'vb',name:'Vascular bundles',desc:'',virtual:1,color:0xf1e7c8},
    {id:'sheath',name:'Bundle sheath',desc:'',virtual:1,color:0x6d4c41},
    {id:'xylem',name:'Xylem',desc:'',virtual:1,color:0xe65100},
    {id:'phloem',name:'Phloem',desc:'',virtual:1,color:0x9575cd}],2.4);
  const bs=[];
  for(let t=0;t<160&&bs.length<26;t++){const rr=Math.sqrt(rnd())*.76,a=rnd()*TAU;if(S.inCut(a,.3))continue;
    const rad=.07+.06*(1-rr/.8),x=rr*Math.cos(a),y=rr*Math.sin(a);
    if(bs.some(b=>Math.hypot(b.x-x,b.y-y)<b.r+rad+.025))continue;bs.push({x,y,r:rad,a})}
  bs.forEach(b=>{const ux=Math.cos(b.a),uy=Math.sin(b.a);
    rod2(S,'sheath',0,b.r,b.x,b.y,0x6d4c41,.03);rod2(S,'vb',0,b.r*.8,b.x,b.y,0xf1e7c8,.045);
    rod2(S,'xylem',0,b.r*.4,b.x-ux*b.r*.28,b.y-uy*b.r*.28,0xe65100,.06);rod2(S,'phloem',0,b.r*.32,b.x+ux*b.r*.3,b.y+uy*b.r*.3,0x9575cd,.06)});
  const b0=bs[0]||{x:0,y:0};S.byId.vb.anchor=[b0.x,b0.y,1.2];S.byId.xylem.anchor=[b0.x,b0.y,1.2];S.byId.phloem.anchor=[b0.x,b0.y,1.2];S.byId.sheath.anchor=[b0.x,b0.y,1.2];
  return S};




SC['leaf-mono']=()=>{const S=new Sc();S.title='Monocot leaf (grass-type): parallel veins';S.sub='';S.cam=6.6;
  const W=3.4,D=2,pr=(id,n,a)=>S.part(id,n,'',a);
  pr('cuticle','Cuticle',[-1.45,.76,1]);pr('uepi','Upper epidermis',[-1.45,.63,1]);pr('bull','Bulliform cells',[-.6,.6,1]);pr('meso','Mesophyll (not differentiated)',[1.2,.05,1]);
  pr('isp','Intercellular spaces',[.5,-.25,1]);pr('vb','Vascular bundle',[0,-.05,1]);pr('bsheath','Bundle sheath',[-1.2,.15,1]);pr('xylem','Xylem',[0,.02,1]);pr('phloem','Phloem',[0,-.12,1]);
  pr('scl','Sclerenchyma',[1.2,.45,1]);pr('lepi','Lower epidermis',[-1.45,-.72,1]);pr('stomata','Stomata + guard cells',[.9,.7,1]);
  let y=.8;const L=[['cuticle',.04,0xdce775,{transparent:true,opacity:.9}],['uepi',.18,0xaed581],['meso',.9,0xa5d6a7],['lepi',.18,0x9ccc65],['cuticle',.04,0xdce775,{transparent:true,opacity:.9}]],ys={};
  L.forEach((l,i)=>{ys[l[0]+(i===4?'2':'')]=y-l[1]/2;S.add(l[0],mesh(new T.BoxGeometry(W,l[1],D),M(l[2],l[3]),0,y-l[1]/2,0));y-=l[1]});
  const ym=ys.meso;
  const cm=M(0x66bb6a),am=M(0xe3f2fd,{transparent:true,opacity:.85});
  for(let i=0;i<22;i++)S.add('meso',mesh(new T.SphereGeometry(.12,12,8),cm,-1.5+rnd()*3,ym+(rnd()-.5)*.55,.15+rnd()*.8));
  for(let i=0;i<16;i++)S.add('isp',mesh(new T.SphereGeometry(.05,8,6),am,-1.5+rnd()*3,ym+(rnd()-.5)*.6,.1+rnd()*.85));
  [-1.2,0,1.2].forEach(x=>{
    S.add('bsheath',mesh(new T.CylinderGeometry(.26,.26,D+.02,24).rotateX(Math.PI/2),M(0x2e7d32),x,ym,0));
    S.add('vb',mesh(new T.CylinderGeometry(.19,.19,D+.04,24).rotateX(Math.PI/2),M(0xdce775),x,ym,0));
    S.add('xylem',mesh(new T.CylinderGeometry(.065,.065,D+.06,18).rotateX(Math.PI/2),M(0xe65100),x,ym+.07,0));
    S.add('phloem',mesh(new T.CylinderGeometry(.06,.06,D+.06,18).rotateX(Math.PI/2),M(0x9575cd),x,ym-.08,0));
    S.add('scl',mesh(new T.BoxGeometry(.3,.17,D+.02),M(0xa1887f),x,ym+.46,0));S.add('scl',mesh(new T.BoxGeometry(.3,.17,D+.02),M(0xa1887f),x,ym-.46,0))});
  [-.6,.6].forEach(x=>{const b=mesh(new T.SphereGeometry(1,16,12),M(0xe1f5fe,{transparent:true,opacity:.85}),x,ys.uepi-.02,0);b.scale.set(.2,.13,.9);S.add('bull',b)});
  const gm=M(0x2e7d32);
  [[.9,.8+.0],[-.4,ys.cuticle2-.1]].forEach(([x,yy],k)=>[-1,1].forEach(s=>{const g=mesh(new T.SphereGeometry(1,16,12),gm,x+s*.17,k?ys.lepi:ys.uepi+.02,0);g.scale.set(.09,.1,.9);S.add('stomata',g)}));
  return S};




SC['surface']=()=>{const S=new Sc();S.title='Leaf surface: epidermis, cuticle, trichomes';S.sub='';S.cam=6;
  const pr=(id,n,a)=>S.part(id,n,'',a);
  pr('cuticle','Cuticle',[-1.45,.0,1.15]);pr('epi','Epidermis',[-1.45,-.17,1.15]);pr('trich','Trichomes',[-1,.45,-.4]);pr('stomata','Stomata + guard cells',[.55,-.05,.2]);pr('meso','Mesophyll (below)',[-1.45,-.65,1.1]);
  S.add('meso',mesh(new T.BoxGeometry(3.2,.7,2.2),M(0xaed581),0,-.7,0));
  const em=M(0xc5e1a5);
  for(let i=0;i<7;i++)for(let j=0;j<5;j++){const x=-1.38+i*.46,z=-.92+j*.46;if(Math.abs(x-.55)<.3&&Math.abs(z-.15)<.3)continue;if(Math.abs(x+.5)<.3&&Math.abs(z+.3)<.3)continue;S.add('epi',mesh(new T.BoxGeometry(.43,.2,.43),em,x,-.15,z))}
  S.add('cuticle',mesh(new T.BoxGeometry(3.2,.05,2.2),M(0xfff59d,{transparent:true,opacity:.45,roughness:.15}),0,-.03,0));
  const gm=M(0x2e7d32);
  [[.55,.15],[-.5,-.3]].forEach(([x,z])=>[-1,1].forEach(s=>{const g=mesh(new T.SphereGeometry(1,16,12),gm,x+s*.1,-.1,z);g.scale.set(.075,.07,.19);S.add('stomata',g)}));
  const tm=M(0xf1f8e9),gl=M(0xffb300),by=-.05;
  [[-1,-.4,.9],[-.1,.6,.7]].forEach(([x,z,h])=>S.add('trich',mesh(new T.ConeGeometry(.05,h,8),tm,x,by+h/2,z)));
  S.add('trich',mesh(new T.CylinderGeometry(.03,.03,.55,8),tm,.9,by+.275,-.5));S.add('trich',mesh(new T.SphereGeometry(.1,12,10),gl,.9,by+.6,-.5));
  S.add('trich',mesh(new T.CylinderGeometry(.03,.03,.4,8),tm,1.2,by+.2,.5));
  [-1,1].forEach(s=>{const a=mesh(new T.CylinderGeometry(.025,.025,.4,6),tm,1.2+s*.12,by+.5,.5);a.rotation.z=-s*.5;S.add('trich',a)});
  return S};




SC['bud-apical']=()=>{const S=new Sc();S.title='Buds: apical, axillary and flower bud';S.sub='';S.cam=7;
  const pr=(id,n,a)=>S.part(id,n,'',a);
  pr('ameri','Apical meristem',[0,1.1,.2]);pr('prim','Leaf primordia',[.3,.85,.2]);pr('yleaf','Young leaves',[-.5,.9,.3]);pr('stem','Stem (nodes + internodes)',[-.25,-1.5,.2]);
  pr('leafp','Leaf at node',[1,.3,.1]);pr('axbud','Axillary bud',[.32,.05,.2]);pr('fbud','Flower bud',[-.8,-.45,.2]);
  const sm=M(0x7cb342);
  S.add('stem',mesh(new T.CylinderGeometry(.22,.22,3,24),sm,0,-.6,0));
  [-.1,-.95].forEach(y=>{const n=S.add('stem',mesh(new T.SphereGeometry(.3,18,12),sm,0,y,0));n.scale.y=.45});
  S.add('ameri',mesh(new T.SphereGeometry(.17,20,14),M(0xffd54f),0,.93,0));
  [[.22,.8,0],[-.2,.78,.12],[.05,.76,-.22],[.14,.9,.16]].forEach(p=>S.add('prim',mesh(new T.SphereGeometry(.1,12,10),M(0xaed581),p[0],p[1],p[2])));
  [[.6,0x66bb6a],[.46,0x81c784],[.33,0xa5d6a7]].forEach(([r,c])=>S.add('yleaf',mesh(new T.SphereGeometry(r,28,18,Math.PI/2,Math.PI*1.5,0,Math.PI/2),M(c),0,.8,0)));
  const lf=S.add('leafp',mesh(new T.SphereGeometry(1,18,12),M(0x43a047),1.05,.28,0));lf.scale.set(.75,.09,.34);lf.rotation.z=.35;
  S.add('leafp',mesh(new T.CylinderGeometry(.04,.05,.5,8),M(0x6aa04a),.45,-.02,0)).rotation.z=-1.2;
  const ab=S.add('axbud',mesh(new T.SphereGeometry(1,14,10),M(0x9ccc65),.3,.08,.05));ab.scale.set(.1,.2,.1);ab.rotation.z=-.45;
  const pd=S.add('fbud',mesh(new T.CylinderGeometry(.035,.04,.7,8),M(0x6aa04a),-.45,-.78,0));pd.rotation.z=1.1;
  S.add('fbud',mesh(new T.SphereGeometry(.2,18,14),M(0xf06292),-.82,-.55,0)).scale.y=1.25;
  [0,1,2].forEach(k=>{const c=S.add('fbud',mesh(new T.ConeGeometry(.07,.24,6),M(0x4caf50),-.82+Math.cos(k*2.1)*.12,-.78,Math.sin(k*2.1)*.12));c.rotation.z=Math.cos(k*2.1)*.5});
  return S};




SC['habit']=()=>{const S=new Sc();S.title='Plant habit: herb, shrub, tree, climber, creeper';S.sub='';S.cam=13.5;
  const pr=(id,n,a)=>S.part(id,n,'',a);
  pr('herb','Herb',[-4.2,1.5,0]);pr('shrub','Shrub',[-2.1,1.9,0]);pr('tree','Tree',[0,3.9,0]);pr('climber','Climber',[2.3,2.8,0]);pr('creeper','Creeper',[4.5,.6,0]);
  S.group.position.set(-.4,-1.7,0);
  S.group.add(mesh(new T.BoxGeometry(11.2,.14,2.6),M(0x6d8f3a),.2,-.07,0));
  const V=(x,y,z)=>new T.Vector3(x,y,z),tb=(pts,r0,r1,c)=>new T.Mesh(tube(pts,r0,r1,8),M(c));
  const lf=(id,g,x,y,z,sx,sy,sz,c,rz)=>{const m=S.add(id,mesh(new T.SphereGeometry(1,10,8),M(c),x,y,z),g);m.scale.set(sx,sy,sz);m.rotation.z=rz||0;return m};
  const grp=x=>{const g=new T.Group();g.position.x=x;S.group.add(g);return g};
  {const g=grp(-4.2);S.add('herb',tb([V(0,0,0),V(.03,.4,0),V(-.02,.8,0),V(0,1.1,0)],.04,.03,0x7cb342),g);
   for(let i=0;i<6;i++)lf('herb',g,(i%2?1:-1)*.2,.2+i*.15,0,.2,.04,.1,0x4caf50,(i%2?1:-1)*.3);
   lf('herb',g,0,1.15,0,.1,.1,.1,0xf06292)}
  {const g=grp(-2.1);for(let k=0;k<6;k++){const a=k*1.05,c=Math.cos(a),s=Math.sin(a);
     S.add('shrub',tb([V(0,0,0),V(c*.25,.5,s*.25),V(c*.5,1,s*.5),V(c*.6,1.45,s*.6)],.05,.03,0x8d6e63),g);
     lf('shrub',g,c*.6,1.5,s*.6,.26,.2,.26,0x388e3c);lf('shrub',g,c*.45,.95,s*.45,.2,.16,.2,0x43a047)}}
  {const g=grp(.1);S.add('tree',tb([V(0,0,0),V(.03,.8,0),V(0,1.7,0)],.22,.14,0x6d4c41),g);
   [[-1,1.3],[1,1.5],[0,1.6]].forEach(([s,y])=>{const b=tb([V(0,y,0),V(s*.35,y+.35,s*.1),V(s*.6,y+.8,0)],.07,.04,0x6d4c41);S.add('tree',b,g)});
   [[0,3.2,.8],[-.7,2.6,.6],[.7,2.7,.65],[-.4,3.0,.55],[.5,3.3,.5]].forEach(([x,y,r],i)=>lf('tree',g,x,y,0,r,r*.85,r,[0x2e7d32,0x388e3c,0x43a047][i%3]))}
  {const g=grp(2.3);S.add('climber',mesh(new T.CylinderGeometry(.04,.04,2.6,10),M(0x9e9e9e),0,1.3,0),g);
   const hp=[];for(let i=0;i<=40;i++){const t=i/40,a=t*TAU*3.2;hp.push(V(Math.cos(a)*.12,t*2.4,Math.sin(a)*.12))}
   S.add('climber',tb(hp,.035,.03,0x66bb6a),g);
   for(let i=3;i<40;i+=5){const p=hp[i];lf('climber',g,p.x*2.4,p.y,p.z*2.4,.2,.05,.12,0x4caf50,p.x>0?.3:-.3)}
   const tc=[];for(let i=0;i<=16;i++){const a=i/16*TAU*1.5;tc.push(V(.12+Math.cos(a)*.1*(1-i/20),2.4+i*.01+Math.sin(a)*.1,Math.sin(a*.5)*.1))}S.add('climber',tb(tc,.015,.01,0x66bb6a),g)}
  {const g=grp(4.5),cp=[];for(let i=0;i<=20;i++){const x=-1+i*.1;cp.push(V(x,.05,Math.sin(x*3)*.3))}
   S.add('creeper',tb(cp,.04,.035,0x7cb342),g);
   for(let i=1;i<20;i+=2){const p=cp[i],s=(i%4===1?1:-1);lf('creeper',g,p.x,.09,p.z+s*.14,.15,.03,.1,0x4caf50);S.add('creeper',mesh(new T.ConeGeometry(.02,.14,5),M(0x8d6e63),p.x,-.03,p.z),g)}
   lf('creeper',g,.4,.2,cp[14].z+.1,.07,.07,.07,0xf06292);lf('creeper',g,-.5,.2,cp[5].z-.1,.07,.07,.07,0xfff176)}
  return S};




SC['seed-mono']=()=>{const S=new Sc();S.title='Monocot grain (maize-type): one cotyledon';S.sub='';S.cam=5.6;
  const A=(x,y,z)=>[x*1.05,y*.9,z*.7];
  S.part('coat','Fruit wall + seed coat (fused)','',A(.9,.9,.3));S.part('aleu','Aleurone layer','',A(.95,.45,.3));
  S.part('endo','Stored food (endosperm)','',A(.4,-.2,.3));S.part('scut','Scutellum (single cotyledon)','',A(-.6,-.05,.3));
  S.part('plu','Plumule + coleoptile','',A(-.5,.7,.2));S.part('rad','Radicle + coleorhiza','',A(-.55,-.75,.2));
  const G=new T.Group();G.scale.set(1.05,.9,.7);S.group.add(G);
  cutSphere(S,'coat',1,M(0xf2c14e),G);cutSphere(S,'aleu',.97,M(0xb58a2c),G);faces(S,'aleu',.97,M(0xb58a2c),0,G);
  cutSphere(S,'endo',.93,M(0xfff3d6),G);faces(S,'endo',.93,M(0xfff3d6),.004,G);
  S.add('scut',mesh(new T.SphereGeometry(1,24,16),M(0xaed581),-.62,-.05,.06),G).scale.set(.3,.62,.2);
  S.add('plu',mesh(new T.ConeGeometry(.11,.5,12),M(0xe6ee9c),-.5,.55,.08),G);S.add('plu',mesh(new T.ConeGeometry(.05,.34,10),M(0x66bb6a),-.5,.5,.08),G);
  const r1=S.add('rad',mesh(new T.ConeGeometry(.1,.42,12).rotateX(Math.PI),M(0xd7ccc8),-.5,-.55,.08),G);
  S.add('rad',mesh(new T.ConeGeometry(.05,.34,10).rotateX(Math.PI),M(0xffcc80),-.5,-.57,.08),G);
  S.byId.embryo=null;S.part('embryo','Embryo','',A(-.7,.0,.3));S.byId.embryo.members=['scut','plu','rad'];
  return S};





{const _lb=SC['leaf-blade'];SC['leaf-blade']=()=>{const S=_lb();S.title='Dicot leaf: what it looks like inside';
  const v=S.byId.vein,m0=v.meshes.shift();v.mats.splice(v.mats.indexOf(m0.material),1);S.part('bsheath','Bundle sheath','',[-.4,-.15,1]);S.add('bsheath',m0);
  v.name='Veins (xylem + phloem)';S.part('isp','Intercellular spaces','',[1.2,-.3,1]);
  const am=M(0xe3f2fd,{transparent:true,opacity:.85});for(let i=0;i<18;i++)S.add('isp',mesh(new T.SphereGeometry(.05,8,6),am,-1.45+rnd()*2.9,-.29+(rnd()-.5)*.5,.1+rnd()*.85));
  return S}}
{const _rc=SC['root-cross'];SC['root-cross']=()=>{const S=_rc();S.title='Dicot root section: the water’s journey inwards';return S}}
{const _sd=SC['stem-dicot'];SC['stem-dicot']=()=>{const S=_sd();S.title='Dicot stem: bundles in a ring';return S}}
{const _sc=SC['seed'];SC['seed']=()=>{const S=_sc();S.title='Dicot seed (bean-type): two cotyledons';S.byId.endo.name='Stored food (endosperm)';S.byId.cot.name='Cotyledon (seed leaf)';
  S.part('embryo','Embryo (radicle + plumule + cotyledon)','',[-.6,.1,.3]);S.byId.embryo.members=['cot','rad','plu'];return S}}
{const _fc=SC['fruit-cross'];SC['fruit-cross']=()=>{const S=_fc();S.part('pericarp','Fruit wall (pericarp)','',S.byId.skin.anchor);S.byId.pericarp.members=['skin','flesh','core'];return S}}





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





const cssv=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const W3=(x,y)=>new T.Vector3((x-180)/40,(318-y)/40,0);
const cubic=(P,n)=>{const o=[];for(let i=0;i<=n;i++){const t=i/n,k=1-t,a=k*k*k,b=3*k*k*t,c=3*k*t*t,d=t*t*t;
  o.push(W3(a*P[0][0]+b*P[1][0]+c*P[2][0]+d*P[3][0],a*P[0][1]+b*P[1][1]+c*P[2][1]+d*P[3][1]))}return o};
const quad=(P,n)=>cubic([P[0],[(P[0][0]+2*P[1][0])/3,(P[0][1]+2*P[1][1])/3],[(P[2][0]+2*P[1][0])/3,(P[2][1]+2*P[1][1])/3],P[2]],n);
function tube(pts,r0,r1,rad){
  rad=rad||12;const c=new T.CatmullRomCurve3(pts),N=Math.max(24,pts.length*2);
  const g=new T.TubeGeometry(c,N,1,rad,false),pos=g.attributes.position,v=new T.Vector3(),ct=new T.Vector3(),row=rad+1;
  for(let i=0;i<=N;i++){c.getPointAt(i/N,ct);const r=r0+(r1-r0)*i/N;
    for(let j=0;j<row;j++){const k=i*row+j;v.fromBufferAttribute(pos,k).sub(ct).multiplyScalar(r).add(ct);pos.setXYZ(k,v.x,v.y,v.z)}}
  pos.needsUpdate=true;return g}
const ORG={taproot:'root',lateral:'root',rcap:'root',rhair:'root',internode:'stem',node:'stem',branch:'stem',abud:'stem',axbud:'stem',fbud:'stem',trich:'stem',blade:'leaf',vein:'leaf',petiole:'leaf',lbase:'leaf',stipule:'leaf',petal:'flower',sepal:'flower',stamen:'flower',carpel:'flower',pericarp:'fruit',flesh:'fruit',fseed:'fruit',calyx:'fruit',pedicel:'fruit',seed:'seed'};
const PNAME={taproot:'Primary root',lateral:'Lateral roots',rcap:'Root cap',rhair:'Root hairs',internode:'Main stem (internode)',node:'Node',branch:'Branch',abud:'Apical bud',axbud:'Axillary bud',fbud:'Flower bud',trich:'Trichomes',blade:'Leaf blade',vein:'Midrib / veins',petiole:'Petiole',lbase:'Leaf base',stipule:'Stipules',petal:'Petals',sepal:'Sepals',stamen:'Stamens',carpel:'Carpel',pericarp:'Fruit wall (pericarp)',flesh:'Flesh',fseed:'Seeds',calyx:'Calyx',pedicel:'Pedicel',seed:'Seed',bee:'Bee',sprout:'New plant'};
const NAMEH=id=>id==='soil'?'Soil':(PNAME[id]||(P[id]?P[id].name:id));
let H=null,labelsOn=true;
try{labelsOn=localStorage.getItem('pv_labels')!=='0'}catch(e){}





const FULL={seed:0,root:1,shoot:1,l1:1,l2:1,flower:1,bloom:1,fruit:1,ripe:1,bee:0,drop:0,seedsOut:0,sprout:0};
const DEF0={seed:0,root:0,shoot:0,l1:0,l2:0,flower:0,bloom:0,fruit:0,ripe:0,bee:0,drop:0,seedsOut:0,sprout:0};
const ADULT={root:1,shoot:1,l1:1,l2:1,flower:1,bloom:1};
const STAGES={
  life:[['Seed',{seed:1}],
    ['Germination',{seed:.75,root:.14,shoot:.05}],
    ['Seedling',{seed:.4,root:.3,shoot:.24,l1:.7}],
    ['Growth',{root:.65,shoot:.62,l1:.9,l2:.55}],
    ['Flowering',{root:.9,shoot:1,l1:1,l2:1,flower:1,bloom:1}],
    ['Fruiting',{root:1,shoot:1,l1:1,l2:1,flower:1,bloom:1,fruit:1,ripe:1}]],
  repro:[['Pollination',Object.assign({},ADULT,{bee:1})],
    ['Fertilisation',Object.assign({},ADULT,{bloom:.55,fruit:.3})],
    ['Fruit',Object.assign({},ADULT,{bloom:.3,fruit:1,ripe:1})],
    ['Dispersal',Object.assign({},ADULT,{bloom:.3,fruit:1,ripe:1,drop:1,seedsOut:1})],
    ['New plant',Object.assign({},ADULT,{bloom:.3,fruit:1,ripe:1,drop:1,seedsOut:1,sprout:1})]]
};




function buildPlant(){
  const group=new T.Group(),shoot=new T.Group(),roots=new T.Group(),parts={},hits=[],soilHits=[],reg=[],Y=new T.Vector3(0,1,0),V3=(x,y,z)=>new T.Vector3(x,y,z);
  group.add(roots);group.add(shoot);
  let sd0=11;const rng=()=>{sd0=(sd0*16807)%2147483647;return(sd0-1)/2147483646};
  const mat=(v,o)=>{const m=new T.MeshStandardMaterial(Object.assign({color:new T.Color(cssv(v)||'#888888'),roughness:.72,metalness:0,side:T.DoubleSide},o||{}));reg.push([m,v]);return m};
  const flat=c=>new T.MeshStandardMaterial({color:c,roughness:.7,side:T.DoubleSide});
  const part=id=>parts[id]||(parts[id]={id,mats:[],meshes:[]});
  const put=(id,m,parent)=>{const p=part(id);m.userData.pid=id;p.meshes.push(m);[].concat(m.material).forEach(x=>{if(p.mats.indexOf(x)<0)p.mats.push(x)});(parent||group).add(m);return m};
  const sph=(r,a,b)=>new T.SphereGeometry(r,a||24,b||16);
  const dirQ=v=>new T.Quaternion().setFromUnitVectors(Y,v.clone().normalize());
  const merge=list=>{const pos=[],nor=[];list.forEach(g=>{const p=g.attributes.position,n=g.attributes.normal,ix=g.index,cnt=ix?ix.count:p.count;
    for(let i=0;i<cnt;i++){const j=ix?ix.getX(i):i;pos.push(p.getX(j),p.getY(j),p.getZ(j));nor.push(n.getX(j),n.getY(j),n.getZ(j))}});
    const m=new T.BufferGeometry();m.setAttribute('position',new T.Float32BufferAttribute(pos,3));m.setAttribute('normal',new T.Float32BufferAttribute(nor,3));return m};

  
  const stemM=mat('--stem'),sp=cubic([[180,318],[184,260],[176,190],[180,112]],28);
  put('internode',new T.Mesh(tube(sp,.112,.1,14),stemM),shoot);
  put('internode',mesh(sph(.112),stemM,sp[0].x,sp[0].y,0),shoot);put('internode',mesh(sph(.1),stemM,sp[28].x,sp[28].y,0),shoot);
  const sh=mesh(new T.CylinderGeometry(.2,.2,5.15,12),stemM,0,2.575,0);sh.visible=false;sh.userData.pid='internode';hits.push(sh);shoot.add(sh);
  const stemAt=y=>{let b=sp[0];sp.forEach(q=>{if(Math.abs(q.y-y)<Math.abs(b.y-y))b=q});return b.clone()};
  const nodeM=flat(0x4e7d35);
  [.75,1.4,2.3,3.55].forEach(y=>{const c=stemAt(y),m=put('node',mesh(sph(1,16,10),nodeM,c.x,y,0),shoot);m.scale.set(.17,.1,.17)});
  {const hs=[];for(let i=0;i<90;i++){const y=.15+rng()*4.9,c=stemAt(y),a=rng()*TAU,d=new T.Vector3(Math.cos(a),.9,Math.sin(a)).normalize();
     const g=new T.ConeGeometry(.011,.14,4).translate(0,.07,0);g.applyMatrix4(new T.Matrix4().makeRotationFromQuaternion(dirQ(d)));g.translate(c.x+Math.cos(a)*.105,y,c.z+Math.sin(a)*.105);hs.push(g)}
   put('trich',new T.Mesh(merge(hs),flat(0xeaf6e4)),shoot)}

  
  {const bp=[V3(0,.75,0),V3(-.45,1.0,.1),V3(-.9,1.45,.12),V3(-1.2,1.95,.12)],tg=bp[3].clone().sub(bp[2]).normalize();
   put('branch',new T.Mesh(tube(bp,.075,.05,10),mat('--stem')),shoot);
   const ab=put('abud',mesh(sph(1,12,10),flat(0x9ccc65),bp[3].x+tg.x*.12,bp[3].y+tg.y*.12,bp[3].z),shoot);ab.scale.set(.09,.17,.09);ab.quaternion.copy(dirQ(tg));
   const bl=mat('--leaf');
   [[bp[2],-.22,.05,.3],[bp[1],.22,.12,-.3]].forEach(([p,dx,dy,rz])=>{const m=put('blade',mesh(sph(1,12,8),bl,p.x+dx,p.y+dy,p.z),shoot);m.scale.set(.28,.05,.14);m.rotation.z=rz});
   [[-.09,2.52,.05,.4],[.09,3.77,.05,-.4]].forEach(([x,y,z,rz])=>{const m=put('axbud',mesh(sph(1,10,8),flat(0x8bc34a),x,y,z),shoot);m.scale.set(.065,.12,.065);m.rotation.z=rz});
   const s0=stemAt(4.35);
   put('fbud',new T.Mesh(tube([V3(s0.x,4.35,0),V3(-.3,4.55,.05),V3(-.55,4.85,.1)],.035,.03,8),flat(0x6aa04a)),shoot);
   const fb=put('fbud',mesh(sph(1,16,12),mat('--petal'),-.58,4.98,.1),shoot);fb.scale.set(.14,.22,.14);
   [0,1,2].forEach(k=>{const c=put('fbud',mesh(new T.ConeGeometry(.07,.18,6),flat(0x4caf50),-.58+Math.cos(k*2.1)*.09,4.84,.1+Math.sin(k*2.1)*.09),shoot);c.rotation.z=Math.cos(k*2.1)*.4})}

  
  const rootM=mat('--root'),capM=new T.MeshStandardMaterial({color:0xd9bf94,roughness:.7});
  const tp=cubic([[180,318],[176,360],[184,410],[178,474]],30);
  put('taproot',new T.Mesh(tube(tp,.0875,.05,12),rootM),roots);put('rcap',mesh(sph(.06,12,8),capM,tp[30].x,tp[30].y,0),roots);
  const hairP=[];
  const hairs=(pts,from,step,n,rad,len)=>{for(let i=from;i<pts.length-1;i+=step){const q=pts[i],t=pts[i+1].clone().sub(pts[Math.max(i-1,0)]).normalize();
    for(let k=0;k<n;k++){const r=new T.Vector3(rng()-.5,rng()-.5,rng()-.5).normalize(),d=r.sub(t.clone().multiplyScalar(r.dot(t))).normalize(),l=len*(.6+rng()*.8);
      hairP.push(q.x+d.x*rad,q.y+d.y*rad,q.z+d.z*rad,q.x+d.x*(rad+l),q.y+d.y*(rad+l)-.03*rng(),q.z+d.z*(rad+l))}}};
  hairs(tp,5,2,3,.07,.2);
  const LAT={a:[[180,346],[152,354],[130,374],[112,410]],b:[[180,376],[210,386],[232,400],[248,436]],c:[[179,410],[158,420],[146,440],[140,466]],d:[[180,334],[204,340],[226,352],[246,350]]};
  [['a',0],['a',Math.PI/2],['b',0],['b',-Math.PI/2],['c',0],['c',-Math.PI/2],['d',0],['d',Math.PI/2]].forEach(([k,phi])=>{
    const pts=cubic(LAT[k],18).map(v=>v.applyAxisAngle(Y,phi)),e=pts[18];
    put('lateral',new T.Mesh(tube(pts,.044,.022,8),rootM),roots);put('rcap',mesh(sph(.03,10,8),capM,e.x,e.y,e.z),roots);
    hairs(pts,3,1,2,.035,.12);
    [8,13].forEach(ix=>{const s=pts[ix],t=pts[ix+1].clone().sub(pts[ix-1]).normalize(),side=new T.Vector3(rng()-.5,-.1+(rng()-.5)*.4,rng()-.5);
      side.sub(t.clone().multiplyScalar(side.dot(t))).normalize();
      const dir=t.clone().multiplyScalar(.7).add(side).normalize(),len=.5+rng()*.25,bp=[];
      for(let j=0;j<=6;j++){const u=j/6;bp.push(new T.Vector3(s.x+dir.x*len*u,s.y+dir.y*len*u-.18*u*u,s.z+dir.z*len*u))}
      put('lateral',new T.Mesh(tube(bp,.02,.007,6),rootM),roots);put('rcap',mesh(sph(.014,6,5),capM,bp[6].x,bp[6].y,bp[6].z),roots);hairs(bp,2,1,2,.015,.07)})});
  const hg=new T.BufferGeometry();hg.setAttribute('position',new T.Float32BufferAttribute(hairP,3));
  const hairM=new T.LineBasicMaterial({color:0xe9dcc3,transparent:true,opacity:.8});put('rhair',new T.LineSegments(hg,hairM),roots);
  const rh=mesh(new T.CylinderGeometry(.5,.5,4,12),rootM,0,-2,0);rh.visible=false;rh.userData.pid='taproot';hits.push(rh);roots.add(rh);

  
  const leafM=mat('--leaf'),edgeM=mat('--leaf2'),veinM=mat('--leaf2'),petM=flat(0x6aa04a),lbM=flat(0x4a8f3c),stipM=flat(0xa5d66b);
  function leaf(base,c1,c2,rotY,pet){
    const NU=22,NV=8,bw=W3(base[0],base[1]),A=cubic(c1,NU).map(v=>v.sub(bw)),B=cubic(c2,NU).map(v=>v.sub(bw));
    const pp=(i,j,off)=>{const t=j/NV,x=B[i].x+(A[i].x-B[i].x)*t,y=B[i].y+(A[i].y-B[i].y)*t,w=Math.hypot(A[i].x-B[i].x,A[i].y-B[i].y),u=i/NU;
      return [x,y,.28*Math.abs(2*t-1)*w+.16*u*u+off]};
    const grid=off=>{const q=[],ix=[];for(let i=0;i<=NU;i++)for(let j=0;j<=NV;j++)q.push(...pp(i,j,off));
      for(let i=0;i<NU;i++)for(let j=0;j<NV;j++){const a=i*(NV+1)+j;ix.push(a,a+1,a+NV+1,a+1,a+NV+2,a+NV+1)}
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(q,3));g.setIndex(ix);g.computeVertexNormals();return g};
    const strip=j=>{const q=[],ix=[];for(let i=0;i<=NU;i++){q.push(...pp(i,j,.02),...pp(i,j,-.02))}
      for(let i=0;i<NU;i++){const a=i*2;ix.push(a,a+1,a+2,a+1,a+3,a+2)}
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(q,3));g.setIndex(ix);g.computeVertexNormals();return g};
    const lg=new T.Group();lg.position.copy(bw);shoot.add(lg);
    const g=new T.Group();g.position.copy(pet);g.rotation.y=rotY;lg.add(g);
    put('blade',new T.Mesh(grid(.02),leafM),g);put('blade',new T.Mesh(grid(-.02),leafM),g);
    put('blade',new T.Mesh(strip(0),edgeM),g);put('blade',new T.Mesh(strip(NV),edgeM),g);
    const mid=[];for(let i=0;i<=NU-1;i++){const q=pp(i,NV/2,0);mid.push(new T.Vector3(q[0],q[1],q[2]))}
    put('vein',new T.Mesh(tube(mid,.035,.012,8),veinM),g);
    const pd=pet.clone().normalize();
    put('petiole',new T.Mesh(tube([V3(0,0,0),pet.clone().multiplyScalar(.5).add(V3(0,.05,0)),pet.clone()],.055,.042,8),petM),lg);
    const lb=put('lbase',new T.Mesh(new T.CylinderGeometry(.045,.12,.22,12),lbM),lg);lb.position.copy(pd.clone().multiplyScalar(.1));lb.quaternion.copy(dirQ(pd));
    [-1,1].forEach(s=>{const m=put('stipule',mesh(sph(1,8,6),stipM),lg);m.position.set(pd.x*.1,.15,s*.14);m.scale.set(.04,.18,.02);m.rotation.set(s*.5,0,-pd.x*.4)});
    return lg}
  const leaf1=leaf([180,226],[[180,226],[160,192],[124,174],[84,172]],[[180,226],[138,226],[100,204],[84,172]],.35,V3(-.5,.15,.02));
  const leaf2=leaf([180,176],[[180,176],[204,148],[238,130],[276,128]],[[180,176],[224,184],[262,162],[276,128]],-.35,V3(.5,.15,.02));

  
  const stemM2=mat('--stem'),cal=mat('--leaf2'),fr=new T.MeshStandardMaterial({color:0xd63a26,roughness:.45,side:T.DoubleSide});
  const ap=W3(181,262),fruitG=new T.Group();fruitG.position.copy(ap);shoot.add(fruitG);
  const fp=quad([[181,262],[214,252],[232,268]],14).map(v=>v.sub(ap));
  const stalk=put('pedicel',new T.Mesh(tube(fp,.044,.044,8),stemM2),fruitG);
  const fcL=W3(240,284).sub(ap),R=.525,n0=new T.Vector3(.35,-.15,.92).normalize();
  {const wall=sph(R,36,24),ix=wall.index.array,ps=wall.attributes.position,keep=[];
   for(let i=0;i<ix.length;i+=3){let cx=0,cy=0,cz=0;for(let k=0;k<3;k++){cx+=ps.getX(ix[i+k]);cy+=ps.getY(ix[i+k]);cz+=ps.getZ(ix[i+k])}
     const l=Math.hypot(cx,cy,cz)||1;if((cx*n0.x+cy*n0.y+cz*n0.z)/l<.86)keep.push(ix[i],ix[i+1],ix[i+2])}
   wall.setIndex(keep);put('pericarp',mesh(wall,fr,fcL.x,fcL.y,0),fruitG)}
  {const win=new T.Group();win.position.copy(fcL.clone().add(n0.clone().multiplyScalar(.447)));win.quaternion.setFromUnitVectors(V3(0,0,1),n0);fruitG.add(win);
   put('flesh',mesh(new T.CircleGeometry(.29,28),flat(0xe8685a)),win);put('flesh',mesh(new T.CircleGeometry(.13,20),flat(0xf3a58f),0,0,.004),win);
   const fs=flat(0xf7ecb5);for(let k=0;k<6;k++){const a=k*TAU/6+.3,m=put('fseed',mesh(sph(1,8,6),fs,Math.cos(a)*.09,Math.sin(a)*.09,.012),win);m.scale.set(.03,.045,.016);m.rotation.z=a}}
  for(let k=0;k<5;k++){const psi=k*TAU/5,al=.3,n=new T.Vector3(Math.sin(al)*Math.cos(psi),Math.cos(al),Math.sin(al)*Math.sin(psi)),
      t=new T.Vector3(Math.cos(al)*Math.cos(psi),-Math.sin(al),Math.cos(al)*Math.sin(psi));
    const c=put('calyx',new T.Mesh(new T.ConeGeometry(.085,.32,8),cal),fruitG);
    c.position.set(fcL.x+n.x*R*.99+t.x*.1,fcL.y+n.y*R*.99+t.y*.1,n.z*R*.99+t.z*.1);c.quaternion.setFromUnitVectors(Y,t)}
  put('calyx',mesh(sph(.085,12,8),cal,fcL.x,fcL.y+R*.995,0),fruitG);

  
  const fg=new T.Group();fg.position.set(0,W3(0,96).y,0);shoot.add(fg);
  const pm=mat('--petal'),sepM=mat('--leaf'),tilts=[];
  for(let k=0;k<5;k++){const piv=new T.Group();piv.rotation.z=-(k*TAU/5+TAU/10);const s2=put('sepal',new T.Mesh(sph(1,14,10),sepM),piv);s2.scale.set(.14,.42,.04);s2.position.set(0,.72,-.07);s2.rotation.x=-.25;fg.add(piv)}
  for(let k=0;k<5;k++){const piv=new T.Group(),tilt=new T.Group();piv.rotation.z=-k*TAU/5;tilt.rotation.x=.22;piv.add(tilt);tilts.push(tilt);
    const q=new T.Mesh(sph(1,28,18),pm);q.scale.set(.35,.675,.07);q.position.set(0,.7,.012*k);put('petal',q,tilt);fg.add(piv)}
  const filM=flat(0xf0e08a),antM=flat(0xf5a31a);
  for(let k=0;k<8;k++){const a=k*TAU/8+.2,b=V3(Math.cos(a)*.16,Math.sin(a)*.16,.1),tv=V3(Math.cos(a)*.3,Math.sin(a)*.3,.72),d=tv.clone().sub(b);
    const fl=put('stamen',new T.Mesh(new T.CylinderGeometry(.012,.012,d.length(),6),filM),fg);fl.position.copy(b.clone().add(tv).multiplyScalar(.5));fl.quaternion.copy(dirQ(d));
    const an=put('stamen',mesh(sph(1,10,8),antM),fg);an.position.copy(tv);an.scale.set(.045,.08,.045);an.quaternion.copy(dirQ(d))}
  const pc=mesh(sph(.3,28,18),mat('--pollen'),0,0,.05);pc.scale.z=.75;put('carpel',pc,fg);
  put('carpel',mesh(new T.CylinderGeometry(.03,.03,.85,8).rotateX(Math.PI/2),flat(0xb7d66b),0,0,.52),fg);put('carpel',mesh(sph(.075,12,10),flat(0x9ccc65),0,0,.95),fg);

  
  const seedM=mat('--seedc');
  const seed=put('seed',mesh(sph(1,16,12),seedM,0,-.3,0),group);
  const SEEDT=[[1.3,.07,.9],[2.9,.07,.8],[3.5,.07,-.6],[1.7,.07,-1.2],[2.5,.07,1.4]];
  const scat=SEEDT.map(()=>put('seed',mesh(sph(1,10,8),seedM),group));
  const sMat=mat('--stem'),lMat=mat('--leaf');
  const mkSprout=(x,z)=>{const g=new T.Group();g.position.set(x,0,z);
    put('sprout',new T.Mesh(tube(cubic([[180,318],[182,300],[178,280],[180,262]],12),.06,.045,8),sMat),g);
    [-1,1].forEach(s=>{const m=new T.Mesh(sph(1,12,8),lMat);m.scale.set(.38,.07,.2);m.position.set(s*.32,1.38,0);m.rotation.z=s*.35;put('sprout',m,g)});
    group.add(g);return g};
  const spA=mkSprout(SEEDT[1][0],SEEDT[1][2]),spB=mkSprout(SEEDT[3][0],SEEDT[3][2]);

  
  const bee=new T.Group(),bodyM=new T.MeshStandardMaterial({color:0xffc107,roughness:.6}),darkM=new T.MeshStandardMaterial({color:0x1b1b1b,roughness:.7}),wingM=new T.MeshStandardMaterial({color:0xffffff,transparent:true,opacity:.6,side:T.DoubleSide});
  const body=put('bee',mesh(sph(1,16,12),bodyM),bee);body.scale.set(.5,.32,.32);
  [-.12,.16].forEach(x=>{bee.add(mesh(new T.TorusGeometry(.31,.045,6,18).rotateY(Math.PI/2),darkM,x,0,0))});
  bee.add(mesh(sph(.2,12,10),darkM,.55,0,0));
  const wingL=mesh(sph(1,10,8),wingM,0,.3,.2),wingR=mesh(sph(1,10,8),wingM,0,.3,-.2);wingL.scale.set(.3,.04,.2);wingR.scale.set(.3,.04,.2);bee.add(wingL,wingR);
  group.add(bee);
  const PN=14,pa=new Float32Array(PN*3),pg=new T.BufferGeometry();pg.setAttribute('position',new T.BufferAttribute(pa,3));
  const pollenPts=new T.Points(pg,new T.PointsMaterial({color:0xf5b942,size:.11,sizeAttenuation:true}));group.add(pollenPts);
  const fy=W3(0,96).y;

  
  const sw=9,sd=4.4;
  const mkTex=(w,h,base,dots,cnt,o)=>{const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');
    x.fillStyle=base;x.fillRect(0,0,w,h);
    for(let i=0;i<cnt;i++){x.fillStyle=dots[Math.floor(rng()*dots.length)];x.globalAlpha=.35+rng()*.5;const r=o.min+rng()*(o.max-o.min),px=rng()*w,py=rng()*h;x.beginPath();
      if(o.chips){x.moveTo(px,py);for(let k=1;k<6;k++)x.lineTo(px+Math.cos(k*1.26+rng())*r*1.5,py+Math.sin(k*1.26+rng())*r);x.closePath()}else x.arc(px,py,r,0,TAU);x.fill()}
    x.globalAlpha=1;
    if(o.cracks){x.strokeStyle='rgba(25,25,30,.55)';x.lineWidth=2;for(let i=0;i<10;i++){let px=rng()*w,py=rng()*h;x.beginPath();x.moveTo(px,py);for(let k=0;k<5;k++){px+=(rng()-.5)*120;py+=(rng()-.5)*30;x.lineTo(px,py)}x.stroke()}}
    const gr=x.createLinearGradient(0,0,0,h);gr.addColorStop(0,'rgba(0,0,0,.16)');gr.addColorStop(.1,'rgba(0,0,0,0)');gr.addColorStop(.88,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,.3)');x.fillStyle=gr;x.fillRect(0,0,w,h);
    return new T.CanvasTexture(c)};
  const LAY=[['Topsoil',0,-1.3,'#4a3326',['#2c1d14','#6a4a33','#5a3f2c','#7b5a43'],1400,{min:1,max:3}],
    ['Subsoil',-1.3,-3,'#8c5b36',['#a8704a','#70472a','#c28a5c','#5e3b22'],1100,{min:1.5,max:4.5,chips:1}],
    ['Weathered rock',-3,-4.3,'#a39a86',['#cfc6b0','#7e7765','#b8ae96','#6b6554'],800,{min:3,max:9,chips:1}],
    ['Bedrock',-4.3,-5.1,'#6b6f75',['#868a90','#55585d','#7a7e84'],400,{min:4,max:12,chips:1,cracks:1}]];
  LAY.forEach(([name,top,bot,base,dots,cnt,o])=>{
    const tex=mkTex(1024,160,base,dots,cnt,o),back=new T.MeshBasicMaterial({map:tex,side:T.BackSide}),side=new T.MeshBasicMaterial({map:tex,side:T.BackSide,color:0xa8a8a8});
    const m=new T.Mesh(new T.BoxGeometry(sw,top-bot,sd).translate(0,(top+bot)/2,0),[side,side,side,side,back,back]);
    m.userData.pid='soil';m.userData.layer=name;group.add(m);soilHits.push(m)});
  {const tex=mkTex(512,256,'#4f6f2c',['#3e5a22','#6d8f3a','#2f4a1a','#7aa043'],900,{min:1,max:3});
   const top=mesh(new T.PlaneGeometry(sw,sd).rotateX(-Math.PI/2),new T.MeshBasicMaterial({map:tex,side:T.DoubleSide}));top.userData.pid='soil';top.userData.layer='Grass';group.add(top);soilHits.push(top)}

  
  {const NB=320,im=new T.InstancedMesh(new T.ConeGeometry(.04,1,3,1).translate(0,.5,0),new T.MeshStandardMaterial({color:0xffffff,roughness:.8}),NB),du=new T.Object3D(),gc=[0x4caf50,0x66bb6a,0x2e7d32,0x7cb342,0x388e3c],cl=new T.Color();
   let i=0;while(i<NB){const cx=(rng()*2-1)*4.2,cz=(rng()*2-1)*2,n=5+Math.floor(rng()*5);
     for(let k=0;k<n&&i<NB;k++,i++){const x=cx+(rng()-.5)*.35,z=cz+(rng()-.5)*.35;
       du.position.set(Math.abs(x)<.3&&Math.abs(z)<.3?x+.6:x,0,z);du.rotation.set((rng()-.5)*.6,rng()*TAU,(rng()-.5)*.6);du.scale.set(1,.22+rng()*.38,1);du.updateMatrix();
       im.setMatrixAt(i,du.matrix);im.setColorAt(i,cl.setHex(gc[Math.floor(rng()*gc.length)]))}}
   im.instanceMatrix.needsUpdate=true;im.frustumCulled=false;group.add(im)}

  
  let ripeCol=new T.Color(cssv('--fruit')||'#d63a26');
  const sc=(o,s)=>{o.visible=s>.004;o.scale.setScalar(Math.max(s,.001))};
  const dropX=.7,dropY=1.075;
  const apply=(V,t)=>{
    sc(roots,V.root);sc(shoot,V.shoot);sc(leaf1,V.l1);sc(leaf2,V.l2);sc(fg,V.flower);sc(fruitG,V.fruit);
    seed.visible=V.seed>.01;seed.scale.set(.2,.3,.2).multiplyScalar(Math.max(V.seed,.001));
    tilts.forEach(q=>q.rotation.x=.22+(1-V.bloom)*1.05);
    const d=V.drop;fruitG.position.set(ap.x+(dropX-ap.x)*d,ap.y+(dropY-ap.y)*d*d,0);fruitG.rotation.z=d*.35;stalk.visible=d<.02;
    fr.color.set(0x8bc34a).lerp(ripeCol,V.ripe);
    const so=V.seedsOut,cx=fruitG.position.x+fcL.x,cy=fruitG.position.y+fcL.y;
    scat.forEach((m,i)=>{const g=SEEDT[i],k=(i===1||i===3)?1-V.sprout:1;m.visible=so>.01&&k>.01;m.scale.set(.1,.14,.1).multiplyScalar(Math.max(k,.001));
      m.position.set(cx+(g[0]-cx)*so,cy+(g[1]-cy)*so+Math.sin(so*Math.PI)*.8,g[2]*so)});
    sc(spA,V.sprout);sc(spB,V.sprout*.85);
    bee.visible=V.bee>.02;if(bee.visible){const a=t*1.6;bee.scale.setScalar(Math.max(V.bee,.001)*.5);
      bee.position.set(.15+Math.cos(a)*.95,fy+.45+Math.sin(t*2.7)*.14,.3+Math.sin(a)*.7);bee.rotation.y=-a;
      const f=Math.sin(t*45)*.4;wingL.rotation.x=.5+f;wingR.rotation.x=-.5-f}
    pollenPts.visible=V.bee>.3;if(pollenPts.visible){for(let i=0;i<PN;i++){const a=i*2.4+t*.9;pa[i*3]=Math.cos(a)*(.12+.1*((i*7)%5)/5);pa[i*3+1]=fy+.1+Math.abs(Math.sin(a*1.3+i))*.55;pa[i*3+2]=.25+Math.sin(a)*.2}
      pg.attributes.position.needsUpdate=true}};
  const fruitAt=v=>fruitG.position.clone().add(v);
  return {group,parts,hits,soilHits,reg,anchors:{tap:tp[22].clone(),lat:cubic(LAT.a,18)[9],hair:tp[14].clone().add(V3(.18,0,0)),cap:tp[30].clone()},apply,hair:hairM,
    fruitAt,fcL,n0,R,beePt:()=>bee.position.clone(),sproutPt:()=>spA.position.clone().add(V3(0,.9,0)),refresh:()=>ripeCol.set(cssv('--fruit')||'#d63a26')}}




function pvFail(err){
  console.error('[Plantverse] 3D start nahi hua:',err);
  let b=document.getElementById('pvfail');
  if(!b){b=document.createElement('div');b.id='pvfail';b.style.cssText='position:absolute;left:8px;right:8px;top:8px;z-index:9;padding:8px 10px;border-radius:8px;background:#b00020;color:#fff;font:12px/1.4 monospace';$v[1].appendChild(b)}
  b.textContent='3D start nahi hua: '+(err&&err.message||err);
}
function initH(){
  if(H)return true;
  try{
    if(typeof THREE==='undefined')throw new Error('three.js load nahi hua (internet / ad-blocker check karo)');
    const renderer=new T.WebGLRenderer({antialias:true,alpha:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
    $v[1].insertBefore(renderer.domElement,$('#hlbl'));
    const scene=new T.Scene(),camera=new T.PerspectiveCamera(38,1,.1,200),pivot=new T.Group();
    pivot.rotation.order='YXZ';scene.add(pivot);
    scene.add(new T.AmbientLight(0xffffff,.78));
    const d1=new T.DirectionalLight(0xffffff,.38);d1.position.set(2,4,6);scene.add(d1);
    const d2=new T.DirectionalLight(0xffffff,.22);d2.position.set(-3,2,-5);scene.add(d2);
    const B=buildPlant();B.group.position.y=-.85;pivot.add(B.group);
    H=Object.assign(B,{renderer,scene,camera,pivot,ray:new T.Raycaster(),ptrs:new Map(),down:null,raf:0,rotX:0,rotY:0,zoom:1,auto:false,sel:null,lbls:[],ready:true,V:Object.assign({},FULL),T:Object.assign({},FULL),last:performance.now(),t0:performance.now()});
    H.apply(H.V,0);H.ray.params.Line.threshold=.05;
    const V3=(x,y,z)=>new T.Vector3(x,y,z),an=H.anchors,fc=H.fcL,sd=H.n0;
    const defs=[
      {t:'Petals',side:'r',k:'s',p:()=>V3(.67,5.77,.1),show:V=>V.flower>.5},
      {t:'Carpel',side:'l',k:'s',p:()=>V3(0,5.55,.95),show:V=>V.flower>.5},
      {t:'Stamens',side:'r',k:'s',p:()=>V3(.29,5.61,.72),show:V=>V.flower>.5},
      {t:'Sepals',side:'l',k:'s',p:()=>V3(-.67,5.33,-.04),show:V=>V.flower>.5},
      {t:'Leaf blade',side:'l',k:'s',p:()=>V3(-1.7,3.15,.25),show:V=>V.l1>.5},
      {t:'Petiole',side:'r',k:'s',p:()=>V3(.28,3.63,.02),show:V=>V.l2>.5},
      {t:'Leaf base',side:'l',k:'s',p:()=>V3(-.08,2.37,0),show:V=>V.l1>.5},
      {t:'Stipules',side:'l',k:'s',p:()=>V3(-.1,2.6,.14),show:V=>V.l1>.5},
      {t:'Node',side:'l',k:'s',p:()=>V3(-.14,1.4,0),show:V=>V.shoot>.35},
      {t:'Main stem',side:'r',k:'s',p:()=>V3(.11,.4,0),show:V=>V.shoot>.35},
      {t:'Branch',side:'l',k:'s',p:()=>V3(-.85,1.4,.12),show:V=>V.shoot>.6},
      {t:'Apical bud',side:'l',k:'s',p:()=>V3(-1.3,2.05,.12),show:V=>V.shoot>.6},
      {t:'Axillary bud',side:'r',k:'s',p:()=>V3(.13,3.78,.06),show:V=>V.shoot>.6},
      {t:'Flower bud',side:'l',k:'s',p:()=>V3(-.58,4.98,.1),show:V=>V.shoot>.6},
      {t:'Trichomes',side:'r',k:'s',p:()=>V3(.12,2.0,0),show:V=>V.shoot>.6},
      {t:'Fruit wall',side:'r',k:'s',p:()=>H.fruitAt(V3(fc.x+.36,fc.y+.38,0)),show:V=>V.fruit>.5},
      {t:'Seeds',side:'r',k:'s',p:()=>H.fruitAt(fc.clone().add(sd.clone().multiplyScalar(.45))),show:V=>V.fruit>.5},
      {t:'Primary root',side:'l',k:'r',p:()=>an.tap.clone(),show:V=>V.root>.5},
      {t:'Lateral roots',side:'l',k:'r',p:()=>an.lat.clone(),show:V=>V.root>.5},
      {t:'Root hairs',side:'r',k:'r',p:()=>an.hair.clone(),show:V=>V.root>.5},
      {t:'Root cap',side:'r',k:'r',p:()=>an.cap.clone(),show:V=>V.root>.5},
      {t:'Seed',side:'r',k:null,p:()=>V3(0,-.3,0),show:V=>V.seed>.3},
      {t:'New plant',side:'r',k:null,p:()=>H.sproutPt(),show:V=>V.sprout>.6},
      {t:'Bee',side:'r',k:null,p:()=>H.beePt(),show:V=>V.bee>.5},
      {t:'Grass',side:'r',k:null,p:()=>V3(-3.8,.1,0),show:V=>true},
      {t:'Topsoil',side:'l',k:null,p:()=>V3(3.9,-.65,-2.1),show:V=>true},
      {t:'Subsoil',side:'l',k:null,p:()=>V3(3.9,-2.15,-2.1),show:V=>true},
      {t:'Weathered rock',side:'l',k:null,p:()=>V3(3.9,-3.65,-2.1),show:V=>true},
      {t:'Bedrock',side:'l',k:null,p:()=>V3(3.9,-4.7,-2.1),show:V=>true}];
    H.labs=defs.map(d=>{const el=document.createElement('div');el.className='lab '+d.side;el.textContent=d.t;el.hidden=true;$v[1].appendChild(el);return {el,d}});
    new ResizeObserver(fitH).observe($v[1]);
    bindH(renderer.domElement);
    $('#hlbl').onclick=$('#hlbl2').onclick=()=>{if(H.sel&&P[H.sel])openPart(H.sel)};
    $('#lblt').setAttribute('aria-pressed',String(labelsOn));
    return true;
  }catch(err){H=null;pvFail(err);return false}
}
function fitH(){if(!H)return;const w=$v[1].clientWidth,h=$v[1].clientHeight;if(!w||!h)return;
  H.renderer.setSize(w,h,false);H.camera.aspect=w/h;H.camera.updateProjectionMatrix();setCamH()}
function setCamH(){const a=H.camera.aspect,tf=Math.tan(H.camera.fov*Math.PI/360),d=Math.max(11.9/2/tf,9/2/(tf*a))*1.1;
  H.camera.position.set(0,0,d/H.zoom);H.camera.lookAt(0,0,0)}
function resetH(){H.rotX=0;H.rotY=0;H.zoom=1;setCamH()}
function startH(){if(!H.raf)loopH()}
function stopH(){if(H&&H.raf){cancelAnimationFrame(H.raf);H.raf=0}['#hlbl','#hlbl2'].forEach(s=>{const l=$(s);if(l)l.hidden=true});if(H){H.labs.forEach(l=>l.el.hidden=true);selectH(null);leaveMode()}}
function loopH(){H.raf=requestAnimationFrame(loopH);
  const now=performance.now(),dt=Math.min((now-H.last)/1000,.05);H.last=now;
  for(const k in H.V){const d=H.T[k]-H.V[k];H.V[k]=Math.abs(d)<.002?H.T[k]:H.V[k]+d*Math.min(1,dt*3.2)}
  H.apply(H.V,(now-H.t0)/1000);
  H.pivot.rotation.set(H.rotX,H.rotY,0);H.pivot.updateMatrixWorld(true);
  H.renderer.render(H.scene,H.camera);placeH()}
function glowH(id){Object.keys(H.parts).forEach(k=>{const on=k===id;H.parts[k].mats.forEach(m=>{if(!m.emissive)return;m.emissive.setHex(on?0x2f7d4a:0);m.emissiveIntensity=on?.7:1})})}
function selectH(id,pt,layer){
  if(!id){H.sel=null;H.selPt=null;glowH(null);return}
  H.sel=id;H.selPt=pt;H.selName=(id==='soil'&&layer)?layer:NAMEH(id);glowH(id)}
function placeH(){const w=$v[1].clientWidth,h=$v[1].clientHeight,V=H.V,o=H.group.position,placed=[];
  H.labs.forEach(l=>{const d=l.d;
    if(!labelsOn||!d.show(V)){l.el.hidden=true;return}
    const s=d.k==='s'?Math.max(V.shoot,.05):d.k==='r'?Math.max(V.root,.05):1,q=d.p().multiplyScalar(s).add(o),v=H.pivot.localToWorld(q);v.project(H.camera);
    const x=(v.x*.5+.5)*w,y=(-v.y*.5+.5)*h;
    l.el.hidden=false;if(!l.w){l.w=l.el.offsetWidth;l.h=l.el.offsetHeight}
    const x0=d.side==='r'?x+22:x-22-l.w,r={x0:x0,x1:x0+l.w,y0:y-l.h/2,y1:y+l.h/2};
    if(r.x0<0||r.x1>w||r.y0<0||r.y1>h||placed.some(p=>r.x0<p.x1+3&&r.x1>p.x0-3&&r.y0<p.y1+2&&r.y1>p.y0-2)){l.el.hidden=true;return}
    placed.push(r);l.el.style.left=x+'px';l.el.style.top=y+'px'});
  const t=$('#hlbl');
  if(H.sel&&H.selPt&&labelsOn){const v=H.pivot.localToWorld(H.selPt.clone());v.project(H.camera);
    if(t._n!==H.selName){t._n=H.selName;t.firstChild.textContent=H.selName;t.lastChild.hidden=true}
    t.hidden=false;t.style.left=Math.max(50,Math.min(w-50,(v.x*.5+.5)*w))+'px';t.style.top=Math.max(40,Math.min(h-10,(-v.y*.5+.5)*h))+'px'}
  else t.hidden=true}
function tapH(e){const cv=H.renderer.domElement,r=cv.getBoundingClientRect();
  H.ray.setFromCamera(new T.Vector2(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1),H.camera);
  const vis=o=>{while(o){if(o.visible===false)return false;o=o.parent}return true},list=[];
  Object.keys(H.parts).forEach(k=>H.parts[k].meshes.forEach(m=>{if(vis(m))list.push(m)}));H.hits.forEach(m=>{if(vis(m.parent))list.push(m)});
  let hit=H.ray.intersectObjects(list,false)[0];
  if(!hit)hit=H.ray.intersectObjects(H.soilHits,false)[0];
  if(!hit){selectH(null);return}
  const pid=hit.object.userData.pid;
  selectH(pid,H.pivot.worldToLocal(hit.point.clone()),hit.object.userData.layer);
  const org=ORG[pid]||pid;if(t3dOn&&P[org])openPart(org)}
function bindH(cv){
  cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);H.ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});H.down={x:e.clientX,y:e.clientY,t:performance.now(),moved:0}});
  cv.addEventListener('pointermove',e=>{const p=H.ptrs.get(e.pointerId);if(!p)return;
    const dx=e.clientX-p.x,dy=e.clientY-p.y;
    if(H.ptrs.size===2){const o=[...H.ptrs.entries()].find(([k])=>k!==e.pointerId)[1];
      const d0=Math.hypot(p.x-o.x,p.y-o.y),d1=Math.hypot(e.clientX-o.x,e.clientY-o.y);if(d0>0)H.zoom=Math.max(.5,Math.min(3,H.zoom*d1/d0));setCamH()}
    else{H.rotY+=dx*.008;H.rotX=Math.max(-1.5,Math.min(1.5,H.rotX+dy*.008))}
    if(H.down)H.down.moved+=Math.abs(dx)+Math.abs(dy);p.x=e.clientX;p.y=e.clientY});
  const up=e=>{H.ptrs.delete(e.pointerId);const d=H.down;
    if(d&&e.type==='pointerup'&&d.moved<8&&performance.now()-d.t<400&&H.ptrs.size===0)tapH(e);if(H.ptrs.size===0)H.down=null};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  cv.addEventListener('wheel',e=>{e.preventDefault();H.zoom=Math.max(.5,Math.min(3,H.zoom*(e.deltaY<0?1.1:.9)));setCamH()},{passive:false});
}
function applyFilter(){const f=FILT[st.filt||'all'];
  if(H&&H.ready)Object.keys(H.parts).forEach(k=>{const dim=!!f&&f.indexOf(k)<0;H.parts[k].mats.forEach(m=>{m.transparent=dim;m.opacity=dim?.2:1;m.depthWrite=!dim;m.needsUpdate=true})});
  if(H&&H.hair)H.hair.opacity=(f&&f.indexOf('root')<0)?.1:.8;
  document.querySelectorAll('#v1 .part').forEach(g=>g.classList.toggle('dim',!!f&&f.indexOf(g.dataset.part)<0))}
function refreshH(){if(!H)return;H.reg.forEach(([m,v])=>{const c=cssv(v);if(c)m.color.set(c)});if(H.refresh)H.refresh()}
if(window.matchMedia)try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',refreshH)}catch(e){}
new MutationObserver(refreshH).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});




let t3dOn=false;try{t3dOn=localStorage.getItem('pv_3d')==='1'}catch(e){}
$('#t3d').setAttribute('aria-pressed',String(t3dOn));
$('#t3d').onclick=e=>{t3dOn=!t3dOn;e.currentTarget.setAttribute('aria-pressed',String(t3dOn));try{localStorage.setItem('pv_3d',t3dOn?'1':'0')}catch(_){}};
$('#lblt').onclick=e=>{labelsOn=!labelsOn;e.currentTarget.setAttribute('aria-pressed',String(labelsOn));try{localStorage.setItem('pv_labels',labelsOn?'1':'0')}catch(_){}
  if(H&&!labelsOn)selectH(null)};




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





function openPart(id){show(2);st.part=id;st.scene=null;
  $v[2].innerHTML=DIA[id].svg;
  head('PLANT / '+P[id].name.toUpperCase(),P[id].title,P[id].sub);
  card('Tap a glowing circle','Opens the 3D cross-section. Labels are on the diagram.');
  chips(DIA[id].spots,openScene)}
['click','keydown'].forEach(ev=>$v[2].addEventListener(ev,e=>act(e,'.spot',g=>openScene(g.dataset.scene))));

$('#close').onclick=()=>{if(st.lv===3)openPart(st.part);else if(st.lv===2)openHome()};





let R=null,S=null,sel=null,rotX=0,rotY=0,zoom=1,auto=false;
function init3(){
  if(R)return true;
  try{
    const renderer=new T.WebGLRenderer({antialias:true,alpha:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
    $v[3].insertBefore(renderer.domElement,$('#lbl'));
    const scene=new T.Scene(),camera=new T.PerspectiveCamera(38,1,.1,100),pivot=new T.Group();
    pivot.rotation.order='YXZ';scene.add(pivot);
    scene.add(new T.AmbientLight(0xffffff,.75));
    const d1=new T.DirectionalLight(0xffffff,.95);d1.position.set(2,3,5);scene.add(d1);
    const d2=new T.DirectionalLight(0x9fd8ff,.35);d2.position.set(-4,-1,-3);scene.add(d2);
    R={renderer,scene,camera,pivot,clock:new T.Clock(),raf:0,ray:new T.Raycaster(),ptrs:new Map(),down:null};
    new ResizeObserver(fit).observe($v[3]);
    bind3(renderer.domElement);
    return true;
  }catch(err){card('3D not available','WebGL is not available on this device.');return false}
}
function fit(){if(!R)return;const w=$v[3].clientWidth,h=$v[3].clientHeight;if(!w||!h)return;
  R.renderer.setSize(w,h,false);R.camera.aspect=w/h;R.camera.updateProjectionMatrix();setCam()}
function setCam(){if(!S)return;const a=R.camera.aspect,base=S.cam*(a<1?1.25/Math.max(a,.62)*.8+.2:1);R.camera.position.set(0,0,base/zoom);R.camera.lookAt(0,0,0)}
function resetView(){rotX=0;rotY=0;zoom=1;setCam()}
function openScene(id){
  const pid=SCENE_PART[id];st.part=pid;st.scene=id;show(3);
  if(!init3())return;
  if(S){R.pivot.remove(S.group);S.group.traverse(o=>{if(o.geometry)o.geometry.dispose()})}
  S=SC[id]();R.pivot.add(S.group);sel=null;resetView();
  const spot=DIA[pid].spots.find(s=>s[0]===id);
  head('PLANT / '+P[pid].name.toUpperCase()+' / '+(spot?spot[1]:'').toUpperCase(),S.title,S.sub);
  card('Tap a part','Drag to rotate, pinch to zoom. Part names are in the chips below.');
  chips(S.parts.map(p=>[p.id,p.name]),pick,null);
  fit();stop3();R.clock.start();loop();
}
function stop3(){if(R&&R.raf){cancelAnimationFrame(R.raf);R.raf=0}}
function loop(){R.raf=requestAnimationFrame(loop);
  const t=R.clock.getElapsedTime(),dt=Math.min(R.clock.getDelta(),.05);
  if(auto)rotY+=.006;
  R.pivot.rotation.set(rotX,rotY,0);
  if(S.tick)S.tick(t);
  R.pivot.updateMatrixWorld(true);
  R.renderer.render(R.scene,R.camera);
  placeLabel();
}
function anchorOf(p){
  if(p.anchor)return new T.Vector3(p.anchor[0],p.anchor[1],p.anchor[2]);
  const b=new T.Box3();p.meshes.forEach(m=>b.expandByObject(m));const c=b.getCenter(new T.Vector3());return S.group.worldToLocal(c)}
function placeLabel(){const l=$('#lbl');if(!sel||!labelsOn){l.hidden=true;return}
  const p=S.byId[sel],v=anchorOf(p);S.group.localToWorld(v);v.project(R.camera);
  const w=$v[3].clientWidth,h=$v[3].clientHeight;
  l.hidden=false;l.textContent=p.name;
  const x=Math.max(60,Math.min(w-60,(v.x*.5+.5)*w)),y=Math.max(40,Math.min(h-70,(-v.y*.5+.5)*h));
  l.style.left=x+'px';l.style.top=y+'px'}
function pick(id){
  sel=sel===id?null:id;pressChip(sel);
  S.parts.forEach(p=>p.mats.forEach(m=>{if(m.emissive){const on=p.id===sel||(sel&&S.byId[sel].members&&S.byId[sel].members.indexOf(p.id)>=0);m.userData.e0=m.userData.e0||m.emissive.getHex();m.emissive.setHex(on?0x2f7d4a:m.userData.e0);m.emissiveIntensity=on?.9:(m.userData.i0===undefined?m.emissiveIntensity:m.userData.i0)}}));
  if(sel){const p=S.byId[sel];card(p.name,p.desc)}else card('Tap a part','Drag to rotate, pinch to zoom.')}
function bind3(cv){
  cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);R.ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});R.down={x:e.clientX,y:e.clientY,t:performance.now(),moved:0}});
  cv.addEventListener('pointermove',e=>{const p=R.ptrs.get(e.pointerId);if(!p)return;
    const dx=e.clientX-p.x,dy=e.clientY-p.y;
    if(R.ptrs.size===2){const o=[...R.ptrs.entries()].find(([k])=>k!==e.pointerId)[1];
      const d0=Math.hypot(p.x-o.x,p.y-o.y),d1=Math.hypot(e.clientX-o.x,e.clientY-o.y);if(d0>0)zoom=Math.max(.5,Math.min(3,zoom*d1/d0));setCam()}
    else{rotY+=dx*.008;rotX=Math.max(-1.5,Math.min(1.5,rotX+dy*.008))}
    if(R.down)R.down.moved+=Math.abs(dx)+Math.abs(dy);p.x=e.clientX;p.y=e.clientY});
  const up=e=>{R.ptrs.delete(e.pointerId);const d=R.down;
    if(d&&e.type==='pointerup'&&d.moved<8&&performance.now()-d.t<400&&R.ptrs.size===0)tap(e);if(R.ptrs.size===0)R.down=null};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  cv.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(.5,Math.min(3,zoom*(e.deltaY<0?1.1:.9)));setCam()},{passive:false});
}
function tap(e){const r=R.renderer.domElement.getBoundingClientRect();
  R.ray.setFromCamera(new T.Vector2(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1),R.camera);
  const all=[];S.parts.forEach(p=>p.meshes.forEach(m=>all.push(m)));
  const hit=R.ray.intersectObjects(all,false)[0];
  if(hit&&hit.object.userData.pid)pick(hit.object.userData.pid)}




const zoomBy=f=>{if(st.lv===1&&H){H.zoom=Math.max(.5,Math.min(3,H.zoom*f));setCamH()}else if(S){zoom=Math.max(.5,Math.min(3,zoom*f));setCam()}};
$('#zin').onclick=()=>zoomBy(1.2);
$('#zout').onclick=()=>zoomBy(1/1.2);
$('#rst').onclick=()=>{if(st.lv===1&&H)resetH();else if(S)resetView()};




const PV_INFO={};

Object.entries({
taproot:['मूसला जड़','Primary (tap) root','Main root growing straight down from the radicle.','Anchors the plant; absorbs water and minerals.','मूलांकुर (radicle) से बनी मुख्य जड़, सीधी नीचे जाती है।','पौधे को जकड़ती है; पानी व खनिज सोखती है।'],
lateral:['पार्श्व जड़ें','Lateral roots','Branches arising from the primary root.','Spread out and widen the absorbing area.','मुख्य जड़ से निकलने वाली शाखाएँ।','फैलकर सोखने का क्षेत्र बढ़ाती हैं।'],
rcap:['मूल गोप','Root cap (calyptra)','Thimble-like cover over the root tip.','Protects the growing tip as it pushes through soil.','जड़ के सिरे पर टोपी जैसा आवरण।','मिट्टी में बढ़ते सिरे की रक्षा करता है।'],
rhair:['मूल रोम','Root hairs','Tiny outgrowths of epidermal cells near the root tip.','Greatly increase the surface for absorbing water and minerals.','सिरे के पास अधिचर्म की कोशिकाओं की बारीक वृद्धियाँ।','पानी व खनिज सोखने की सतह बहुत बढ़ाते हैं।'],
internode:['तना (पर्व)','Stem / internode','Stem portion between two nodes.','Holds the plant up; carries water, minerals and food.','दो पर्वसंधियों के बीच का तने का भाग।','पौधे को सीधा रखता है; पानी, खनिज और भोजन पहुँचाता है।'],
node:['पर्वसंधि','Node','Point on the stem where leaves and buds arise.','Attachment site for leaves and branches.','तने का वह स्थान जहाँ से पत्तियाँ और कलियाँ निकलती हैं।','पत्तियों और शाखाओं के जुड़ने का स्थान।'],
branch:['शाखा','Branch','Side shoot that grows from an axillary bud.','Lets the plant carry more leaves and flowers.','कक्षीय कली से निकला पार्श्व तना।','पौधे पर पत्तियाँ और फूल बढ़ाती है।'],
abud:['शीर्ष कली','Apical (terminal) bud','Bud at the tip of the main shoot.','Makes the shoot grow longer.','मुख्य तने के सिरे की कली।','तने की लंबाई बढ़ाती है।'],
axbud:['कक्षीय कली','Axillary bud','Bud in the angle between leaf stalk and stem.','Can grow into a branch or a flower.','पत्ती के डंठल और तने के कोण पर स्थित कली।','शाखा या फूल में विकसित हो सकती है।'],
fbud:['पुष्प कली','Flower bud','Young, unopened flower.','Opens into a flower for reproduction.','अभी न खिला हुआ नया फूल।','खिलकर प्रजनन के लिए फूल बनती है।'],
trich:['रोम (ट्राइकोम)','Trichomes','Hair-like outgrowths of the epidermis.','Reduce water loss; can deter small herbivores.','अधिचर्म की रोम-जैसी वृद्धियाँ।','जल-हानि घटाते हैं; छोटे कीटों से बचाव कर सकते हैं।'],
blade:['पत्ती फलक','Leaf blade (lamina)','Flat green part of the leaf.','Main site of photosynthesis and gas exchange.','पत्ती का चपटा हरा भाग।','प्रकाश-संश्लेषण और गैस-विनिमय का मुख्य स्थान।'],
vein:['मध्य शिरा व शिराएँ','Midrib and veins','Vascular strands running through the blade.','Bring water in (xylem), carry sugars out (phloem), give support.','फलक में फैली संवहन धाराएँ।','जाइलम से पानी लाती हैं, फ्लोएम से शर्करा ले जाती हैं; सहारा देती हैं।'],
petiole:['पर्णवृंत','Petiole','Stalk joining the blade to the stem.','Holds the blade towards light; conducts materials.','फलक को तने से जोड़ने वाला डंठल।','फलक को रोशनी की ओर रखता है; पदार्थ पहुँचाता है।'],
lbase:['पर्णाधार','Leaf base','Part where the leaf attaches to the stem.','Attaches the leaf; may bear stipules.','पत्ती के तने से जुड़ने का भाग।','पत्ती को जोड़ता है; इस पर अनुपर्ण हो सकते हैं।'],
stipule:['अनुपर्ण','Stipules','Small leaf-like outgrowths at the leaf base (not in all plants).','Protect the young leaf.','पर्णाधार पर छोटी पत्ती-जैसी वृद्धियाँ (सभी पौधों में नहीं)।','कोमल पत्ती की रक्षा करते हैं।'],
petal:['दल (पंखुड़ियाँ)','Petals (corolla)','Often brightly coloured inner whorl of the flower.','Attract pollinators.','फूल का प्रायः रंगीन भीतरी चक्र।','परागण करने वाले जीवों को आकर्षित करती हैं।'],
sepal:['बाह्यदल','Sepals (calyx)','Outer, usually green whorl of the flower.','Protect the flower bud.','फूल का बाहरी, प्रायः हरा चक्र।','कली अवस्था में फूल की रक्षा करते हैं।'],
stamen:['पुंकेसर','Stamen (male part)','A filament bearing an anther.','Anther makes pollen grains.','तंतु और उस पर परागकोश।','परागकोश में परागकण बनते हैं।'],
carpel:['अंडप (स्त्रीकेसर)','Carpel (female part)','Stigma, style and ovary.','Stigma receives pollen; ovules in the ovary become seeds.','वर्तिकाग्र, वर्तिका और अंडाशय।','वर्तिकाग्र परागकण ग्रहण करता है; अंडाशय के बीजांड बीज बनते हैं।'],
pericarp:['फलभित्ति','Fruit wall (pericarp)','Wall that develops from the ovary wall.','Protects the seeds and helps their dispersal.','अंडाशय की भित्ति से बनी फल की दीवार।','बीजों की रक्षा करती है; प्रकीर्णन में मदद करती है।'],
flesh:['गूदा','Flesh (fleshy pericarp)','Soft inner part of the fruit wall.','Stores food; attracts animals that spread seeds.','फलभित्ति का मुलायम भीतरी भाग।','भोजन जमा करता है; बीज फैलाने वाले जंतुओं को आकर्षित करता है।'],
fseed:['बीज','Seeds','Ovules that matured after fertilisation.','Each can grow into a new plant.','निषेचन के बाद परिपक्व हुए बीजांड।','हर बीज नया पौधा बन सकता है।'],
calyx:['बाह्यदलपुंज','Calyx on fruit','Sepals that stay at the stalk end of the fruit.','Protect the young fruit.','फल के डंठल की ओर बचे रहने वाले बाह्यदल।','छोटे फल की रक्षा करते हैं।'],
pedicel:['पुष्पवृंत','Pedicel','Stalk holding the flower or fruit.','Supports the fruit; supplies water and food.','फूल या फल को थामने वाला डंठल।','फल को सहारा देता है; पानी-भोजन पहुँचाता है।'],
seed:['बीज','Seed','Embryo with stored food inside a seed coat.','Grows into a new plant on germination.','बीजचोल के भीतर भ्रूण और संचित भोजन।','अंकुरण पर नया पौधा बनता है।'],
soil:['मिट्टी','Soil layers','Topsoil, subsoil, weathered rock and bedrock, top to bottom.','Gives anchorage, water and minerals to roots.','ऊपर से नीचे: ऊपरी मिट्टी, उप-मृदा, अपक्षयित चट्टान, आधारशिला।','जड़ों को सहारा, पानी और खनिज देती है।']
}).forEach(([k,v])=>PV_INFO[k]={hi:v[0],sci:v[1],a:v[2],f:v[3],ah:v[4],fh:v[5]});

const PV_LABHI={'Petals':'दल','Carpel':'अंडप','Stamens':'पुंकेसर','Sepals':'बाह्यदल','Leaf blade':'पत्ती फलक','Petiole':'पर्णवृंत','Leaf base':'पर्णाधार','Stipules':'अनुपर्ण','Node':'पर्वसंधि','Main stem':'मुख्य तना','Branch':'शाखा','Apical bud':'शीर्ष कली','Axillary bud':'कक्षीय कली','Flower bud':'पुष्प कली','Trichomes':'रोम','Fruit wall':'फलभित्ति','Seeds':'बीज','Primary root':'मूसला जड़','Lateral roots':'पार्श्व जड़ें','Root hairs':'मूल रोम','Root cap':'मूल गोप','Seed':'बीज','New plant':'नया पौधा','Bee':'मधुमक्खी','Grass':'घास','Topsoil':'ऊपरी मिट्टी','Subsoil':'उप-मृदा','Weathered rock':'अपक्षयित चट्टान','Bedrock':'आधारशिला'};




(function(){
  let lang='en';try{lang=localStorage.getItem('pv_lang')||'en'}catch(e){}
  const cbs=[];
  PV.lang=()=>lang;PV.onLang=f=>cbs.push(f);
  PV.name=id=>{const d=PV_INFO[id];return lang==='hi'&&d?d.hi:NAMEH(id)};
  const b=PV.ui.addTopButton('',()=>{lang=lang==='en'?'hi':'en';try{localStorage.setItem('pv_lang',lang)}catch(e){}apply()});
  b.setAttribute('aria-label','Language: English / हिन्दी');
  function fixSel(){if(H&&H.sel&&H.sel!=='soil')H.selName=PV.name(H.sel)}
  function apply(){b.textContent=lang==='en'?'हिं':'EN';
    if(H&&H.labs){H.labs.forEach(l=>{l.el.textContent=lang==='hi'?(PV_LABHI[l.d.t]||l.d.t):l.d.t;l.w=0});fixSel()}
    cbs.forEach(f=>f(lang))}
  PV.after('openHome',apply);PV.after('selectH',fixSel);
})();




(function(){
  const ORGN={root:['Root','जड़'],stem:['Stem','तना'],leaf:['Leaf','पत्ती'],flower:['Flower','फूल'],fruit:['Fruit','फल'],seed:['Seed','बीज']};
  const LB={en:['Part of','Structure & location','Function'],hi:['किस अंग का भाग','संरचना व स्थान','कार्य']};
  const el=PV.ui.addPanel('pv-info','');el.classList.add('pv-r');
  el.onclick=e=>{if(e.target.classList.contains('pv-x'))el.hidden=true};
  function render(){
    const id=H&&H.sel,d=id&&PV_INFO[id];
    if(!d||st.lv!==1){el.hidden=true;return}
    const hi=PV.lang()==='hi',L=LB[PV.lang()],o=ORG[id]!==id&&ORGN[ORG[id]];
    el.innerHTML=`<span class="pv-x" role="button" aria-label="Close">×</span><b>${hi?d.hi:NAMEH(id)}</b><div class="pv-sci">${d.sci}</div>`
      +(o?`<p><u>${L[0]}</u> ${o[hi?1:0]}</p>`:'')+`<p><u>${L[1]}</u><br>${hi?d.ah:d.a}</p><p><u>${L[2]}</u><br>${hi?d.fh:d.f}</p>`;
    el.hidden=false}
  PV.after('selectH',render);PV.after('show',render);PV.onLang(render);
})();




(function(){
  const G=[['Root','जड़',['taproot','lateral','rcap','rhair']],['Stem','तना',['internode','node','branch','abud','axbud','fbud','trich']],
    ['Leaf','पत्ती',['blade','vein','petiole','lbase','stipule']],['Flower','फूल',['petal','sepal','stamen','carpel']],
    ['Fruit & seed','फल व बीज',['pericarp','flesh','fseed','calyx','pedicel','seed']]];
  const el=PV.ui.addPanel('pv-explorer','<input id="pv-q" type="search" autocomplete="off"><div id="pv-list"></div>');
  const q=el.querySelector('#pv-q'),list=el.querySelector('#pv-list');
  const has=id=>H&&H.parts[id]&&H.parts[id].meshes.length;
  function draw(){const s=q.value.trim().toLowerCase(),hi=PV.lang()==='hi';q.placeholder=hi?'भाग खोजें…':'Search a part…';
    list.innerHTML=G.map(g=>{const it=g[2].filter(has).filter(id=>!s||(NAMEH(id)+' '+PV_INFO[id].hi+' '+PV_INFO[id].sci).toLowerCase().includes(s));
      return it.length?`<h4>${hi?g[1]:g[0]}</h4>`+it.map(id=>`<button data-id="${id}">${PV.name(id)}</button>`).join(''):''}).join('')||'<p>—</p>'}
  q.oninput=draw;PV.onLang(()=>{if(!el.hidden)draw()});
  list.onclick=e=>{const b=e.target.closest('button');if(!b||!H)return;const id=b.dataset.id;
    try{const bx=new T.Box3();H.parts[id].meshes.forEach(m=>bx.expandByObject(m));selectH(id,H.pivot.worldToLocal(bx.getCenter(new T.Vector3())))}catch(err){console.error(err)}
    el.hidden=true};
  const btn=PV.ui.addTopButton('☰',()=>{if(!H||st.lv!==1)return;el.hidden=!el.hidden;if(!el.hidden){q.value='';draw()}});
  btn.setAttribute('aria-label','Plant Explorer');
  PV.after('show',n=>{if(n!==1)el.hidden=true;btn.hidden=n!==1});
})();




(function(){
  const V=[['Front',0,0,'F'],['Side',0,Math.PI/2,'S'],['Top',Math.PI/2-.05,0,'T']];let i=-1,raf=0;
  const b=PV.ui.addTool({id:'pv-view',label:'Camera view: front / side / top',html:'F',onClick:()=>{
    if(!H||st.lv!==1)return;i=(i+1)%3;const v=V[i];b.textContent=v[3];b.title=v[0];go(v[1],v[2])}});
  function go(x,y){cancelAnimationFrame(raf);const t0=performance.now(),x0=H.rotX,y0=H.rotY,dy=Math.atan2(Math.sin(y-y0),Math.cos(y-y0));
    (function s(now){const k=Math.min(1,(now-t0)/450),e=k*k*(3-2*k);H.rotX=x0+(x-x0)*e;H.rotY=y0+dy*e;if(k<1)raf=requestAnimationFrame(s)})(t0)}
  PV.after('show',n=>{b.hidden=n!==1});
})();




(function(){
  PV.L=(e,h)=>(PV.lang&&PV.lang()==='hi')?h:e;
  const el=PV.ui.addPanel('pv-s3','');el.classList.add('pv-b');
  function render(){
    if(st.lv!==3||!S){el.hidden=true;return}
    const p=sel&&S.byId[sel];
    if(p&&p.desc)el.innerHTML=`<b>${p.name}</b><p>${p.desc}</p>`;
    else if(S.note)el.innerHTML=`<p>${S.note}</p>`;
    else{el.hidden=true;return}
    el.hidden=false}
  PV.after('pick',render);PV.after('openScene',render);PV.after('show',render);
  
  const D={'plant-cell':[['chloroplast','🔍 Chloroplast','🔍 हरितलवक'],['mitochondrion','🔍 Mitochondrion','🔍 माइटोकॉन्ड्रिया']],
           'chloroplast':[['plant-cell','◀ Plant cell','◀ पादप कोशिका']],'mitochondrion':[['plant-cell','◀ Plant cell','◀ पादप कोशिका']]};
  PV.after('openScene',id=>{const d=D[id];if(!d)return;const n=$('#chips');
    d.slice().reverse().forEach(([to,en,hi])=>{const b=document.createElement('button');b.className='chip mode';b.textContent=PV.L(en,hi);b.dataset.id='__'+to;b.onclick=()=>openScene(to);n.insertBefore(b,n.firstChild)})});
})();




SC['plant-cell']=()=>{
  const S=new Sc(),L=PV.L,W=4.2,H=2.7,D=2,add=(id,g,m,x,y,z)=>S.add(id,mesh(g,m,x,y,z)),
    pt=(id,en,hi,de,dh,a)=>S.part(id,L(en,hi),L(de,dh),a);
  S.title=L('Plant cell: cut-open 3D view','पादप कोशिका: कटा हुआ 3D दृश्य');S.cam=7.6;S.group.rotation.set(.2,-.3,0);
  S.note=L('Simplified generic cell. Not every plant cell looks like this: a mature xylem vessel, for example, has lost its nucleus and most organelles.','सरल सामान्य कोशिका। हर पादप कोशिका ऐसी नहीं होती: जैसे परिपक्व जाइलम वाहिका में केंद्रक और अधिकांश अंगक नहीं रहते।');
  pt('wall','Cell wall','कोशिका भित्ति','Rigid outer layer made mainly of cellulose. Gives shape and support; found in plant cells, not animal cells.','मुख्यतः सेलुलोज़ की बनी कठोर बाहरी परत। आकार और सहारा देती है; पादप कोशिका में होती है, जंतु कोशिका में नहीं।',[-2.05,.8,0]);
  pt('membrane','Plasma membrane','कोशिका झिल्ली','Thin layer just inside the wall. It decides what enters and leaves the cell (selectively permeable).','भित्ति के ठीक भीतर पतली परत। तय करती है कि क्या भीतर आए और बाहर जाए (वरणात्मक पारगम्य)।',[1.9,-.8,.3]);
  pt('cyto','Cytoplasm','कोशिकाद्रव्य','Jelly-like fluid that fills the cell around the organelles. Many chemical reactions happen here.','अंगकों के चारों ओर भरा जेली-जैसा द्रव। यहाँ कई रासायनिक अभिक्रियाएँ होती हैं।',[.9,-.95,-.78]);
  pt('nuc','Nucleus','केंद्रक','Enclosed by a double envelope with pores. Holds the DNA (as chromatin) and controls cell activities.','दोहरे आवरण (छिद्रों सहित) से घिरा। इसमें DNA (क्रोमैटिन रूप में) होता है और कोशिका की क्रियाओं को नियंत्रित करता है।');
  pt('nucleolus','Nucleolus','केंद्रिका','Dense spot inside the nucleus where parts of ribosomes are made.','केंद्रक के भीतर सघन बिंदु जहाँ राइबोसोम के भाग बनते हैं।');
  pt('vac','Central vacuole','केंद्रीय रिक्तिका','Large sac of cell sap, bounded by its own membrane (tonoplast). Stores water and substances, keeps the cell firm, and pushes other organelles to the edge.','कोशिका रस से भरी बड़ी थैली, जिसकी अपनी झिल्ली (टोनोप्लास्ट) होती है। पानी व पदार्थ जमा करती है, कोशिका को कड़ा रखती है और अन्य अंगकों को किनारे धकेलती है।');
  pt('chloro','Chloroplasts','हरितलवक','Green organelles with chlorophyll; the site of photosynthesis. Tap “Chloroplast” below to look inside.','क्लोरोफिल वाले हरे अंगक; प्रकाश-संश्लेषण का स्थान। भीतर देखने के लिए नीचे “हरितलवक” दबाएँ।');
  pt('mito','Mitochondria','माइटोकॉन्ड्रिया','Release energy from food by respiration (make ATP). They have their own DNA.','श्वसन द्वारा भोजन से ऊर्जा (ATP) मुक्त करते हैं। इनका अपना DNA होता है।');
  pt('er','Endoplasmic reticulum','अंतर्द्रव्यी जालिका','Network of membranes joined to the nuclear envelope. Rough ER (with ribosomes) makes proteins; smooth ER makes lipids.','केंद्रक आवरण से जुड़ा झिल्लियों का जाल। खुरदरी ER (राइबोसोम सहित) प्रोटीन और चिकनी ER लिपिड बनाती है।');
  pt('ribo','Ribosomes','राइबोसोम','Tiny granules that build proteins. Free in the cytoplasm or attached to rough ER.','प्रोटीन बनाने वाले सूक्ष्म कण। कोशिकाद्रव्य में मुक्त या खुरदरी ER से जुड़े होते हैं।');
  pt('golgi','Golgi apparatus','गॉल्जी उपकरण','Stack of flattened sacs that modifies, packs and sends out proteins and lipids. In plants it also makes cell-wall materials.','चपटी थैलियों का ढेर जो प्रोटीन व लिपिड को संशोधित, पैक और भेजता है। पादपों में भित्ति के पदार्थ भी बनाता है।');
  pt('pd','Plasmodesmata','प्लाज़्मोडेस्माटा','Narrow channels through the cell wall that connect the cytoplasm of neighbouring cells.','कोशिका भित्ति के आर-पार संकरी नलिकाएँ जो पड़ोसी कोशिकाओं के कोशिकाद्रव्य को जोड़ती हैं।');
  
  const box5=(id,i,t,m)=>{const w=W-2*i,h=H-2*i,dz=D-i,zc=i/2,ox=W/2-i-t/2,oy=H/2-i-t/2;
    add(id,new T.BoxGeometry(w,h,t),m,0,0,-D/2+i+t/2);
    [-1,1].forEach(s=>{add(id,new T.BoxGeometry(t,h,dz),m,s*ox,0,zc);add(id,new T.BoxGeometry(w,t,dz),m,0,s*oy,zc)})};
  box5('wall',0,.14,M(0x9ccc65));box5('membrane',.14,.03,M(0xffb74d));
  add('cyto',new T.BoxGeometry(W-.36,H-.36,.02),M(0xdcedc8,{transparent:true,opacity:.7}),0,0,-D/2+.2);
  add('vac',new T.SphereGeometry(1,32,20),M(0x81d4fa,{transparent:true,opacity:.5}),.1,0,-.2).scale.set(1.35,.85,.5);
  add('nuc',new T.SphereGeometry(.42,24,16),M(0xb39ddb,{transparent:true,opacity:.45}),-1.4,.62,.35);
  add('nucleolus',new T.SphereGeometry(.15,16,12),M(0x4a148c),-1.35,.62,.35);
  [[-.9,-.95,.4],[.6,.98,.35],[1.55,.5,.45],[1.5,-.5,.5],[-1.6,-.5,.45]].forEach(p=>add('chloro',new T.SphereGeometry(.2,16,12),M(0x43a047),p[0],p[1],p[2]).scale.set(1.5,.8,.8));
  [[-.95,-.1,.55],[.9,-1,.45],[1.1,.95,.5]].forEach(p=>add('mito',new T.SphereGeometry(.12,14,10),M(0xef6c00),p[0],p[1],p[2]).scale.set(1.8,.8,.8));
  const V=a=>a.map(p=>new T.Vector3(p[0],p[1],p[2])),erM=M(0x9575cd),dk=M(0x212121),
    cs=[new T.CatmullRomCurve3(V([[-1,.95,.3],[-.8,.65,.45],[-.9,.3,.4],[-1.1,.05,.45],[-1.35,-.1,.35]])),
        new T.CatmullRomCurve3(V([[-1.8,.9,.35],[-1.7,.5,.5],[-1.85,.1,.4],[-1.7,-.3,.5],[-1.5,-.6,.4]]))];
  cs.forEach(c=>{add('er',new T.TubeGeometry(c,24,.04,6),erM);for(let i=0;i<=6;i++){const p=c.getPoint(i/6);add('ribo',new T.SphereGeometry(.035,8,6),dk,p.x+.04,p.y+.04,p.z+.04)}});
  const gg=new T.Group();gg.position.set(1,-.55,.55);gg.rotation.set(.9,0,-.3);S.group.add(gg);
  for(let i=0;i<4;i++)S.add('golgi',mesh(new T.CylinderGeometry(.24-.02*i,.24-.02*i,.035,24),M(0xffd54f),0,i*.075,0),gg);
  [.5,.1,-.3].forEach(y=>add('pd',new T.CylinderGeometry(.05,.05,.3,10).rotateZ(Math.PI/2),M(0x263238),W/2-.07,y,0));
  return S};
DIA.leaf.spots.push(['plant-cell','Plant cell']);SCENE_PART['plant-cell']='leaf';




SC['chloroplast']=()=>{
  const S=new Sc(),L=PV.L,add=(id,g,m,x,y,z,par)=>S.add(id,mesh(g,m,x,y,z),par),pt=(id,en,hi,de,dh)=>S.part(id,L(en,hi),L(de,dh));
  S.title=L('Chloroplast: inside the solar panel','हरितलवक: भीतर की संरचना');S.cam=6.2;S.group.rotation.set(.3,.5,0);
  S.note=L('Simplified: real chloroplasts vary in shape and number of grana.','सरलीकृत: असली हरितलवकों का आकार और ग्रेना की संख्या अलग-अलग होती है।');
  pt('outer','Outer membrane','बाह्य झिल्ली','Smooth outer boundary of the chloroplast; freely lets small molecules pass.','हरितलवक की चिकनी बाहरी सीमा; छोटे अणुओं को आसानी से जाने देती है।');
  pt('ims','Intermembrane space','अंतरा-झिल्ली स्थान','Narrow gap between the outer and inner membranes.','बाह्य और आंतरिक झिल्ली के बीच संकरा स्थान।');
  pt('inner','Inner membrane','आंतरिक झिल्ली','Controls which substances enter or leave the stroma.','तय करती है कि कौन-से पदार्थ स्ट्रोमा में आएँ या जाएँ।');
  pt('stroma','Stroma','स्ट्रोमा','Fluid inside the inner membrane. Carbon fixation (Calvin cycle) happens here, making sugars.','आंतरिक झिल्ली के भीतर का द्रव। यहाँ कार्बन स्थिरीकरण (केल्विन चक्र) होता है और शर्करा बनती है।');
  pt('grana','Thylakoids and grana','थाइलेकॉइड व ग्रेना','Flattened sacs (thylakoids) stacked into grana. Their membranes hold chlorophyll and carry out the light reactions.','चपटी थैलियाँ (थाइलेकॉइड) जो ढेर बनाकर ग्रेना बनाती हैं। इनकी झिल्लियों में क्लोरोफिल होता है और प्रकाश अभिक्रियाएँ होती हैं।');
  pt('lamellae','Stroma lamellae','स्ट्रोमा लैमेली','Thin membrane plates that connect one granum to another.','पतली झिल्ली-पट्टियाँ जो एक ग्रेनम को दूसरे से जोड़ती हैं।');
  pt('dna','Chloroplast DNA','हरितलवक DNA','Small circular DNA. Chloroplasts make some of their own proteins.','छोटा गोलाकार DNA। हरितलवक अपने कुछ प्रोटीन खुद बनाते हैं।');
  pt('ribo','Ribosomes','राइबोसोम','Tiny protein-making granules in the stroma.','स्ट्रोमा में प्रोटीन बनाने वाले सूक्ष्म कण।');
  pt('starch','Starch grain','स्टार्च कण','Temporary store of the sugar made in photosynthesis.','प्रकाश-संश्लेषण में बनी शर्करा का अस्थायी भंडार।');
  const G=new T.Group();G.scale.set(1.7,.95,.95);S.group.add(G);
  [['outer',1,0x66bb6a,.35],['ims',.96,0xc8e6c9,.3],['inner',.92,0x2e7d32,.35],['stroma',.88,0xa5d6a7,.3]].forEach(a=>cutSphere(S,a[0],a[1],M(a[2],{transparent:true,opacity:a[3]}),G));
  const gp=[[-.95,.15,.1],[-.2,-.2,.2],[.5,.25,-.1],[1,-.1,.15]];
  gp.forEach(p=>{for(let i=0;i<6;i++)add('grana',new T.CylinderGeometry(.2,.2,.04,20),M(0x1b5e20),p[0],p[1]-.14+i*.056,p[2])});
  for(let i=0;i<3;i++){const a=gp[i],b=gp[i+1],dx=b[0]-a[0],dy=b[1]-a[1];
    add('lamellae',new T.BoxGeometry(Math.hypot(dx,dy),.02,.12),M(0x66bb6a),(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2).rotation.z=Math.atan2(dy,dx)}
  add('dna',new T.TorusGeometry(.12,.015,8,24),M(0xfdd835),0,.5,.3);
  for(let i=0;i<12;i++)add('ribo',new T.SphereGeometry(.03,8,6),M(0x212121),(rnd()-.5)*2,(rnd()-.5)*.8,(rnd()-.5)*.8);
  add('starch',new T.SphereGeometry(.13,12,10),M(0xfffde7),.15,-.5,.1);
  return S};
SCENE_PART['chloroplast']='leaf';




SC['mitochondrion']=()=>{
  const S=new Sc(),L=PV.L,add=(id,g,m,x,y,z)=>S.add(id,mesh(g,m,x,y,z)),pt=(id,en,hi,de,dh)=>S.part(id,L(en,hi),L(de,dh));
  S.title=L('Mitochondrion: the cell’s power house','माइटोकॉन्ड्रिया: कोशिका का ऊर्जा-घर');S.cam=6;S.group.rotation.set(.3,.5,0);
  S.note=L('Simplified: in living cells mitochondria change shape and can form networks.','सरलीकृत: जीवित कोशिकाओं में माइटोकॉन्ड्रिया का आकार बदलता रहता है और वे जाल भी बना सकते हैं।');
  pt('outer','Outer membrane','बाह्य झिल्ली','Smooth outer boundary of the mitochondrion.','माइटोकॉन्ड्रिया की चिकनी बाहरी सीमा।');
  pt('ims','Intermembrane space','अंतरा-झिल्ली स्थान','Narrow gap between the two membranes.','दोनों झिल्लियों के बीच संकरा स्थान।');
  pt('inner','Inner membrane','आंतरिक झिल्ली','Folded inner membrane; ATP is made on it.','मुड़ी हुई आंतरिक झिल्ली; इस पर ATP बनता है।');
  pt('cristae','Cristae','क्रिस्टी','Folds of the inner membrane. They increase the surface area for making ATP.','आंतरिक झिल्ली की तहें। ATP बनाने के लिए सतह क्षेत्र बढ़ाती हैं।');
  pt('matrix','Matrix','आधात्री (मैट्रिक्स)','Fluid inside the inner membrane. Many steps of respiration (Krebs cycle) happen here.','आंतरिक झिल्ली के भीतर का द्रव। श्वसन के कई चरण (क्रेब्स चक्र) यहाँ होते हैं।');
  pt('mdna','Mitochondrial DNA','माइटोकॉन्ड्रियल DNA','Small circular DNA. Mitochondria make some of their own proteins.','छोटा गोलाकार DNA। माइटोकॉन्ड्रिया अपने कुछ प्रोटीन खुद बनाते हैं।');
  const G=new T.Group();G.scale.set(1.7,.7,.7);S.group.add(G);
  [['outer',1,0xff7043,.35],['ims',.95,0xffccbc,.3],['inner',.9,0xe64a19,.4],['matrix',.82,0xffcc80,.35]].forEach(a=>cutSphere(S,a[0],a[1],M(a[2],{transparent:true,opacity:a[3]}),G));
  for(let i=0;i<6;i++)add('cristae',new T.BoxGeometry(.04,.55,.5),M(0xd84315),-.9+i*.36,i%2?.12:-.12,0);
  add('mdna',new T.TorusGeometry(.1,.012,8,20),M(0xfdd835),.3,-.05,.15);
  return S};
SCENE_PART['mitochondrion']='leaf';




(function(){
  PV.L=PV.L||((e,h)=>(PV.lang&&PV.lang()==='hi')?h:e);
  const panels={};
  PV.sim={panels,
    reg(name,el,build){el.classList.add('pv-sim');el.onclick=e=>{if(e.target.classList.contains('pv-x'))el.hidden=true};panels[name]={el,build}},
    open(name){Object.keys(panels).forEach(k=>panels[k].el.hidden=true);const p=panels[name];p.build();p.el.hidden=false},
    hideAll(){Object.keys(panels).forEach(k=>panels[k].el.hidden=true)}};
  
  PV.selectPart=id=>{if(!H||!H.parts[id]||!H.parts[id].meshes.length)return;
    try{const b=new T.Box3();H.parts[id].meshes.forEach(m=>b.expandByObject(m));selectH(id,H.pivot.worldToLocal(b.getCenter(new T.Vector3())))}catch(e){console.error(e)}};
  const items=[['env','🌦 Environment','🌦 पर्यावरण'],['tour','💧 Water journey','💧 पानी की यात्रा'],['quiz','❓ Quiz','❓ क्विज़']];
  function addChips(){const n=$('#chips');items.slice().reverse().forEach(([k,en,hi])=>{const b=document.createElement('button');b.className='chip mode';b.dataset.id='__'+k;b.textContent=PV.L(en,hi);b.onclick=()=>PV.sim.open(k);n.insertBefore(b,n.firstChild)})}
  PV.after('homeChips',addChips);
  PV.after('show',n=>{if(n!==1)PV.sim.hideAll()});
  PV.onLang&&PV.onLang(()=>{if(st.lv===1&&!st.mode){const n=$('#chips');n.querySelectorAll('.chip.mode').forEach(b=>{const it=items.find(i=>'__'+i[0]===b.dataset.id);if(it)b.textContent=PV.L(it[1],it[2])});
    Object.keys(panels).forEach(k=>{if(!panels[k].el.hidden)panels[k].build()})}});
})();




(function(){
  const el=PV.ui.addPanel('pv-tl','<input id="pv-tls" type="range" min="0" max="50" step="1" value="0" aria-label="Time"><div id="pv-tln"></div>');el.classList.add('pv-b');
  const s=el.querySelector('#pv-tls'),nm=el.querySelector('#pv-tln'),
    HI={Seed:'बीज',Germination:'अंकुरण',Seedling:'पौध',Growth:'वृद्धि',Flowering:'पुष्पन',Fruiting:'फलन',Pollination:'परागण',Fertilisation:'निषेचन',Fruit:'फल',Dispersal:'प्रकीर्णन','New plant':'नया पौधा'};
  const label=i=>{const n=STAGES[st.mode][i][0];nm.textContent=PV.L(n,HI[n]||n)};
  s.oninput=()=>{if(!H||!st.mode)return;stopPlay();
    const n=STAGES[st.mode].length,v=+s.value/10,i=Math.min(Math.floor(v),n-2),f=v-i,a=STAGES[st.mode][i][1],b=STAGES[st.mode][i+1][1],o={};
    for(const k in DEF0){const x=a[k]===undefined?DEF0[k]:a[k],y=b[k]===undefined?DEF0[k]:b[k];o[k]=x+(y-x)*f}
    H.T=o;const r=Math.round(v);st.stage=r;selectH(null);pressChip('s'+r);label(r)};
  function sync(){el.hidden=!st.mode||st.lv!==1;if(el.hidden)return;s.max=(STAGES[st.mode].length-1)*10;s.value=st.stage*10;label(st.stage)}
  ['startMode','exitMode','setStage','show'].forEach(f=>PV.after(f,sync));
})();




(function(){
  const L=PV.L,S={light:70,water:80,co2:420,temp:25,hum:60,c4:false},cl=(x,a,b)=>Math.max(a,Math.min(b,x));
  const el=PV.ui.addPanel('pv-env','');
  
  function model(s){
    const K=s.c4?[60,80,33]:[35,300,25],fL=(s.light/(s.light+K[0]))/(100/(100+K[0])),fC=(s.co2/(s.co2+K[1]))/(1000/(1000+K[1])),fT=Math.exp(-Math.pow((s.temp-K[2])/12,2)),
      sw=cl((s.water-15)/45,0,1),sA=cl(s.light/50,0,1)*sw*(.65+.35*s.hum/100),sg=sA*(1-.35*cl((s.co2-420)/580,0,1)),
      es=.6108*Math.exp(17.27*s.temp/(s.temp+237.3)),vpd=es*(1-s.hum/100),E=sg*Math.min(1,vpd/4),A=fL*fC*fT*(.1+.9*sA),
      f={light:fL,co2:fC,temp:fT,water:sw};let lim='none',m=.85;for(const k in f)if(f[k]<m){m=f[k];lim=k}
    return{stomata:sg*100,E:E*100,A:A*100,lim,vpd}}
  PV.envModel=model;
  const NM={light:['Light','प्रकाश'],co2:['CO₂','CO₂'],temp:['Temperature','तापमान'],water:['Water','पानी'],none:['No single strong limit','कोई एक तेज़ सीमा नहीं']};
  const ROWS=[['light','Light','प्रकाश',0,100,1,'%'],['water','Water in soil','मिट्टी में पानी',0,100,1,'%'],['co2','CO₂','CO₂',150,1000,10,' ppm'],['temp','Temperature','तापमान',5,45,1,' °C'],['hum','Air humidity','हवा की नमी',10,100,1,'%']];
  function msgs(s,r){const o=[];
    if(s.water<25)o.push([ 'Little water: a hormone signal (ABA) closes the stomata. Less water is lost, but less CO₂ enters, so photosynthesis falls. Leaves may wilt.','कम पानी: हार्मोन संकेत (ABA) रंध्र बंद कर देता है। पानी कम उड़ता है, पर CO₂ भी कम आती है, इसलिए प्रकाश-संश्लेषण घटता है। पत्तियाँ मुरझा सकती हैं।']);
    if(s.light<10)o.push(['Almost dark: stomata stay mostly shut and there is no net photosynthesis. Respiration continues.','लगभग अँधेरा: रंध्र प्रायः बंद रहते हैं और शुद्ध प्रकाश-संश्लेषण नहीं होता। श्वसन चलता रहता है।']);
    if(s.temp>38||s.temp<10)o.push(['Temperature far from the optimum: enzymes work slowly (or get damaged when very hot), so photosynthesis drops.','तापमान अनुकूल से बहुत दूर: एंज़ाइम धीमे चलते हैं (बहुत गर्मी में नष्ट भी हो सकते हैं), इसलिए प्रकाश-संश्लेषण घटता है।']);
    if(s.hum<25&&s.temp>30)o.push(['Hot, dry air pulls water out of leaves quickly (high vapour-pressure deficit).','गर्म, सूखी हवा पत्तियों से पानी तेज़ी से खींचती है।']);
    if(!s.c4&&s.co2>700)o.push(['Extra CO₂ helps a C3 plant only until another factor becomes limiting.','अतिरिक्त CO₂ C3 पौधे को तभी तक लाभ देती है जब तक कोई और कारक सीमा न बन जाए।']);
    return o.slice(0,3)}
  function build(){
    el.innerHTML=`<span class="pv-x" role="button" aria-label="Close">×</span><b>${L('Environment lab','पर्यावरण प्रयोगशाला')}</b>
      <div class="pv-seg"><button data-t="c3" aria-pressed="${!S.c4}">C3</button><button data-t="c4" aria-pressed="${S.c4}">C4</button></div>
      <div class="pv-stick">`+['stomata','E','A'].map(k=>`<div class="pv-res">${L({stomata:'Stomata open',E:'Water loss (transpiration)',A:'Photosynthesis'}[k],{stomata:'रंध्र खुले',E:'जल-हानि (वाष्पोत्सर्जन)',A:'प्रकाश-संश्लेषण'}[k])}<div class="pv-bar"><i data-b="${k}"></i></div></div>`).join('')+`<p id="pv-lim"></p></div>`
      +ROWS.map(r=>`<label class="pv-row">${L(r[1],r[2])} <span data-v="${r[0]}"></span><input type="range" data-k="${r[0]}" min="${r[3]}" max="${r[4]}" step="${r[5]}" value="${S[r[0]]}"></label>`).join('')
      +`<div id="pv-msg"></div><p class="pv-note">${L('The 3D plant shows light, soil wetness, leaf droop and leaf colour. Humidity, CO₂ and the C3/C4 choice change only the bars. Simplified teaching model: relative values only; real responses depend on species and conditions.','3D पौधे में प्रकाश, मिट्टी की नमी, पत्तियों का झुकाव और रंग दिखते हैं। नमी, CO₂ और C3/C4 का असर केवल बार में दिखता है। सरलीकृत शिक्षण मॉडल: केवल सापेक्ष मान; असली प्रतिक्रिया प्रजाति और स्थितियों पर निर्भर करती है।')}</p>`;
    upd()}
  function upd(){const r=model(S),hi=PV.lang&&PV.lang()==='hi';
    ROWS.forEach(x=>{const v=el.querySelector(`[data-v="${x[0]}"]`);if(v)v.textContent=S[x[0]]+x[6]});
    ['stomata','E','A'].forEach(k=>{const b=el.querySelector(`[data-b="${k}"]`);if(b)b.style.width=Math.round(r[k])+'%'});
    el.querySelector('#pv-lim').innerHTML=`<u>${L('Limiting factor','सीमित करने वाला कारक')}</u> ${NM[r.lim][hi?1:0]}`;
    el.querySelector('#pv-msg').innerHTML=msgs(S,r).map(m=>`<p>${m[hi?1:0]}</p>`).join('');react(S,r)}

  
  const cu={w:0,y:0,b:0,l:1,m:80},tg={w:0,y:0,b:0,l:1,m:80},NEU={w:0,y:0,b:0,l:1,m:80};
  let hk=null,lv=null,lights=new Map(),orig=new Map(),active=false;
  const YEL=()=>new T.Color(0xd4d24a),BRN=()=>new T.Color(0x8a6a3a);
  function leaves(){if(lv)return lv;lv=[];H.group.updateMatrixWorld(true);
    H.parts.blade.meshes.forEach(m=>{const pa=m.geometry&&m.geometry.attributes&&m.geometry.attributes.position;if(!pa||pa.count!==207)return;
      const lg=m.parent&&m.parent.parent;if(!lg||lv.some(o=>o.lg===lg))return;
      m.geometry.computeBoundingBox();const c=H.pivot.worldToLocal(m.localToWorld(m.geometry.boundingBox.getCenter(new T.Vector3()))),b=H.pivot.worldToLocal(lg.getWorldPosition(new T.Vector3()));
      lv.push({lg,z0:lg.rotation.z,side:(c.x-b.x)>=0?1:-1})});return lv}
  function hook(){if(!H||hk===H)return !!H;hk=H;lv=null;lights=new Map();orig=new Map();const o=H.apply;H.apply=function(V,t){o.call(this,V,t);step()};return true}
  function step(){if(!active)return;try{
    let far=0;for(const k in cu){cu[k]+=(tg[k]-cu[k])*.12;far=Math.max(far,Math.abs(tg[k]-cu[k])*(k==='m'?.01:1))}
    const done=far<.004&&tg.w===0&&tg.y===0&&tg.b===0&&tg.l===1&&tg.m===80;if(done)for(const k in cu)cu[k]=NEU[k];
    leaves().forEach(o=>{o.lg.rotation.z=o.z0-o.side*cu.w*1.0});
    H.parts.blade.mats.forEach(m=>{if(!m.color)return;let o=orig.get(m);if(!o){o=m.color.clone();orig.set(m,o)}m.color.copy(o).lerp(YEL(),cu.y).lerp(BRN(),cu.b)});
    H.scene.traverse(o=>{if(!o.isLight)return;if(!lights.has(o))lights.set(o,o.intensity);o.intensity=lights.get(o)*cu.l});
    const wt=cu.m,k=wt<80?(80-wt)/80:-(wt-80)/20,r=k>=0?1+.35*k:1+.2*k,g=k>=0?1+.28*k:1+.24*k,b=k>=0?1+.1*k:1+.26*k;
    (H.soilHits||[]).forEach(m=>{if(m.material&&m.material.color)m.material.color.setRGB(r,g,b)});
    if(done)active=false}catch(e){console.error(e);active=false}}
  function react(s,r){if(!hook())return;const c4=s.c4,dev=Math.abs(s.temp-(c4?33:25));
    tg.w=Math.max(cl((40-s.water)/40,0,1),cl((r.vpd-3.5)/4,0,1)*.5);
    tg.y=cl(Math.max(cl((25-s.water)/25,0,1)*.6,cl((20-s.light)/20,0,1)*.5,cl((dev-14)/10,0,1)*.6),0,1);
    tg.b=cl(Math.max((12-s.water)/12,(s.temp-40)/5),0,1)*.7;
    tg.l=cl(.3+.7*s.light/70,.3,1.25);tg.m=s.water;active=true}
  function reset(){tg.w=0;tg.y=0;tg.b=0;tg.l=1;tg.m=80;active=true}
  new MutationObserver(()=>{if(el.hidden)reset()}).observe(el,{attributes:true,attributeFilter:['hidden']});
  el.oninput=e=>{const k=e.target.dataset.k;if(k){S[k]=+e.target.value;upd()}};
  el.addEventListener('click',e=>{const t=e.target.closest('[data-t]');if(t){S.c4=t.dataset.t==='c4';el.querySelectorAll('[data-t]').forEach(b=>b.setAttribute('aria-pressed',String(b===t)));upd()}});
  PV.sim.reg('env',el,build);
})();




(function(){
  const L=PV.L,el=PV.ui.addPanel('pv-tour',''),
  
  ST=[['rhair','Root hairs','मूल रोम','Soil water enters the root hairs by osmosis, because the cell sap inside is more concentrated than the soil water.','मूल रोम के कोशिका रस की सांद्रता मिट्टी के पानी से अधिक होती है, इसलिए पानी परासरण (osmosis) से भीतर आता है।','root-hair'],
   ['taproot','Root cortex','जड़ का वल्कुट','Water crosses the cortex cells towards the centre, through cell walls and through the cytoplasm.','पानी वल्कुट (cortex) की कोशिकाओं में होकर, भित्तियों और कोशिकाद्रव्य दोनों रास्तों से, केंद्र की ओर बढ़ता है।','root-cross'],
   ['taproot','Endodermis','अंतःत्वचा','A waxy Casparian strip in the endodermis walls blocks the cell-wall route, so water must pass through cell membranes. This lets the root control which minerals enter the xylem.','अंतःत्वचा (endodermis) की भित्ति में मोमी कैस्पेरियन पट्टी दीवार वाला रास्ता रोक देती है, इसलिए पानी को कोशिका झिल्ली से गुज़रना पड़ता है। इससे जड़ तय करती है कि कौन-से खनिज जाइलम में जाएँ।','root-cross'],
   ['internode','Xylem in the stem','तने का जाइलम','Dead, hollow xylem vessels and tracheids form continuous tubes. Water rises as an unbroken column because water molecules stick together (cohesion) and to the walls (adhesion).','मृत, खोखली जाइलम वाहिकाएँ और वाहिनिकाएँ लगातार नलियाँ बनाती हैं। जल-अणु आपस में (संसंजन) और दीवारों से (आसंजन) चिपकते हैं, इसलिए पानी का स्तंभ टूटे बिना ऊपर चढ़ता है।','stem-dicot'],
   ['vein','Leaf veins','पत्ती की शिराएँ','Veins branch through the leaf and deliver water close to every mesophyll cell.','शिराएँ पत्ती में फैलकर हर पर्णमध्योतक (mesophyll) कोशिका के पास पानी पहुँचाती हैं।','leaf-blade'],
   ['blade','Stomata: transpiration','रंध्र: वाष्पोत्सर्जन','Water evaporates from mesophyll cell walls and leaves as vapour through the stomata. This transpiration pull draws more water up from the roots (cohesion–tension).','पर्णमध्योतक की भित्तियों से पानी वाष्प बनकर रंध्रों (stomata) से निकलता है। यह वाष्पोत्सर्जन-खिंचाव (संसंजन-तनाव) जड़ों से और पानी ऊपर खींचता है।','leaf-stomata']];
  let i=0;
  function build(){const s=ST[i],hi=PV.lang&&PV.lang()==='hi';PV.progress&&PV.progress.mark('tour:'+i);
    el.innerHTML=`<span class="pv-x" role="button" aria-label="Close">×</span><b>${L('Water journey','पानी की यात्रा')} ${i+1}/${ST.length}</b><div class="pv-sci">${hi?s[2]:s[1]}</div><p>${hi?s[4]:s[3]}</p>
      <div class="pv-nav"><button data-a="p" ${i?'':'disabled'}>◀</button><button data-a="s">${L('3D section ▸','3D काट ▸')}</button><button data-a="n" ${i<ST.length-1?'':'disabled'}>▶</button></div>`;
    PV.selectPart(s[0])}
  el.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b||b.disabled)return;const a=b.dataset.a;
    if(a==='s'){openScene(ST[i][5]);return}i+=a==='n'?1:-1;build()});
  PV.sim.reg('tour',el,()=>{i=0;build()});
})();




(function(){
  const L=PV.L,el=PV.ui.addPanel('pv-quiz','');
  
  const Q=[['Which tissue carries water up from the roots to the leaves?','कौन-सा ऊतक जड़ों से पत्तियों तक पानी ऊपर पहुँचाता है?',['Phloem','Xylem','Epidermis','Cortex'],['फ्लोएम','जाइलम','अधिचर्म','वल्कुट'],1,'Xylem carries water and minerals upwards; phloem carries food.','जाइलम पानी व खनिज ऊपर ले जाता है; फ्लोएम भोजन ले जाता है।'],
   ['Where does water mainly enter a plant?','पौधे में पानी मुख्यतः कहाँ से प्रवेश करता है?',['Stomata','Petiole','Root hairs','Flower'],['रंध्र','पर्णवृंत','मूल रोम','फूल'],2,'Root hairs have a huge surface for absorbing water from the soil.','मूल रोम मिट्टी से पानी सोखने के लिए बहुत बड़ी सतह देते हैं।'],
   ['Water in the soil becomes very scarce. What do the stomata do?','मिट्टी में पानी बहुत कम हो जाए तो रंध्र क्या करते हैं?',['Open wider','Close','Make chlorophyll','Absorb water'],['और चौड़े खुलते हैं','बंद हो जाते हैं','क्लोरोफिल बनाते हैं','पानी सोखते हैं'],1,'Closing saves water, but less CO₂ enters, so photosynthesis also falls.','बंद होने से पानी बचता है, पर CO₂ भी कम आती है, इसलिए प्रकाश-संश्लेषण भी घटता है।'],
   ['Light increases while water, CO₂ and temperature are ideal. What happens to photosynthesis?','पानी, CO₂ और तापमान आदर्श हैं और प्रकाश बढ़ाया जाता है। प्रकाश-संश्लेषण का क्या होगा?',['It stops','It rises, then levels off','It falls at once','No change at all'],['रुक जाएगा','बढ़ेगा, फिर स्थिर हो जाएगा','तुरंत घटेगा','बिल्कुल नहीं बदलेगा'],1,'It rises until another factor (such as CO₂) becomes the limit.','यह तब तक बढ़ता है जब तक कोई और कारक (जैसे CO₂) सीमा नहीं बन जाता।'],
   ['Which structure is the pore for gas exchange in leaves?','पत्तियों में गैस-विनिमय का छिद्र कौन-सा है?',['Stigma','Stoma','Micropyle','Cuticle'],['वर्तिकाग्र','रंध्र (stoma)','बीजांडद्वार','क्यूटिकल'],1,'Each stoma is a pore between two guard cells.','हर रंध्र दो रक्षक कोशिकाओं के बीच का छिद्र है।'],
   ['After fertilisation, which part of the flower develops into the fruit?','निषेचन के बाद फूल का कौन-सा भाग फल बनता है?',['Ovary','Petal','Stamen','Sepal'],['अंडाशय','दल','पुंकेसर','बाह्यदल'],0,'The ovary becomes the fruit and the ovules become seeds.','अंडाशय फल बनता है और बीजांड बीज बनते हैं।']];
  let i=0,score=0,ans=-1,fin=false;
  function build(){const hi=PV.lang&&PV.lang()==='hi',x=hi?1:0,head=`<span class="pv-x" role="button" aria-label="Close">×</span><b>${L('Quiz','क्विज़')}</b>`;
    if(i>=Q.length){if(!fin){fin=true;PV.progress&&PV.progress.quiz(score,Q.length)}el.innerHTML=head+`<p>${L('Score','अंक')}: ${score}/${Q.length}</p><div class="pv-nav"><button data-r="1">${L('Try again','फिर से')}</button></div>`;return}
    const q=Q[i];
    el.innerHTML=head+` <span class="pv-sci">${i+1}/${Q.length}</span><p style="color:var(--fg)">${q[x]}</p>`+q[2+x].map((o,k)=>`<button class="pv-opt" data-o="${k}" ${ans>=0?'disabled':''}${ans>=0&&k===q[4]?' data-ok="1"':ans===k?' data-bad="1"':''}>${o}</button>`).join('')
      +(ans>=0?`<p>${ans===q[4]?'✓ ':'✗ '}${q[5+x]}</p><div class="pv-nav"><button data-n="1">${i<Q.length-1?L('Next ▶','अगला ▶'):L('Finish','समाप्त')}</button></div>`:'')}
  el.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.disabled)return;
    if(b.dataset.o!==undefined){ans=+b.dataset.o;if(ans===Q[i][4])score++}else if(b.dataset.n){i++;ans=-1}else if(b.dataset.r){i=0;score=0;ans=-1;fin=false}build()});
  PV.sim.reg('quiz',el,()=>{i=0;score=0;ans=-1;fin=false;build()});
})();




const PV_TISSUE={
meristem:{n:['Meristematic tissue','विभज्योतक'],scene:'root-tip',
 where:['Growing tips of roots and shoots (apical), cambium in stems and roots (lateral), and the base of leaves or internodes, especially in grasses (intercalary).','जड़ों और तनों के वर्धी सिरे (शीर्षस्थ), तने व जड़ में कैम्बियम (पार्श्व), और पत्तियों या पर्वों का आधार, विशेषकर घासों में (अंतर्वेशी)।'],
 cells:['Small, roughly box-shaped cells with thin primary walls, dense cytoplasm, a large nucleus, tiny or no vacuoles, and no gaps between cells.','छोटी, लगभग डिब्बे-जैसी कोशिकाएँ; पतली प्राथमिक भित्ति, घना कोशिकाद्रव्य, बड़ा केंद्रक, बहुत छोटी या कोई रिक्तिका नहीं, और कोशिकाओं के बीच खाली जगह नहीं।'],
 life:['Living and actively dividing.','जीवित और लगातार विभाजित होती हैं।'],
 fn:['Makes new cells: growth in length (apical), in thickness (lateral), and regrowth after grazing or cutting (intercalary).','नई कोशिकाएँ बनाता है: लंबाई में वृद्धि (शीर्षस्थ), मोटाई में वृद्धि (पार्श्व), और चरने या कटने के बाद दोबारा बढ़ना (अंतर्वेशी)।'],
 note:['Intercalary meristem is typical of grasses (monocots). Lateral meristems are well developed in woody plants.','अंतर्वेशी विभज्योतक घासों (एकबीजपत्री) में विशिष्ट है। पार्श्व विभज्योतक काष्ठीय पौधों में अच्छी तरह विकसित होते हैं।']},
protective:{n:['Protective tissue: epidermis and cork','रक्षी ऊतक: अधिचर्म व कॉर्क'],scene:'surface',
 where:['Epidermis is the outermost layer of young roots, stems and leaves. In older woody stems and roots, periderm (cork) replaces it.','अधिचर्म युवा जड़, तने और पत्ती की सबसे बाहरी परत है। पुराने काष्ठीय तनों व जड़ों में पेरिडर्म (कॉर्क) इसकी जगह ले लेता है।'],
 cells:['Epidermis: one layer of flat, tightly packed cells, with a waxy cuticle on aerial parts, plus stomata and hairs. Cork cells: box-like with walls coated in suberin.','अधिचर्म: चपटी, सटी हुई कोशिकाओं की एक परत; वायवीय भागों पर मोमी क्यूटिकल, साथ में रंध्र और रोम। कॉर्क कोशिकाएँ: डिब्बे-जैसी, भित्ति पर सुबेरिन की परत।'],
 life:['Epidermal cells are living. Cork cells are dead at maturity.','अधिचर्म कोशिकाएँ जीवित होती हैं। कॉर्क कोशिकाएँ परिपक्व होने पर मृत होती हैं।'],
 fn:['Protects against water loss, injury and germs. Cork also waterproofs; root epidermis absorbs water.','जल-हानि, चोट और रोगाणुओं से बचाता है। कॉर्क जलरोधी भी है; जड़ की अधिचर्म पानी सोखती है।'],
 note:['Root epidermis has root hairs and no thick cuticle. Leaf epidermis has stomata.','जड़ की अधिचर्म में मूल रोम होते हैं और मोटा क्यूटिकल नहीं। पत्ती की अधिचर्म में रंध्र होते हैं।']},
parenchyma:{n:['Parenchyma','मृदूतक (पैरेंकाइमा)'],scene:'leaf-blade',
 where:['Cortex, pith, leaf mesophyll, fruit flesh and storage organs.','वल्कुट, मज्जा, पत्ती का पर्णमध्योतक, फल का गूदा और भंडारण अंग।'],
 cells:['Roughly round or many-sided cells with thin primary walls, a large vacuole and usually small gaps between cells.','लगभग गोल या बहुभुजी कोशिकाएँ; पतली प्राथमिक भित्ति, बड़ी रिक्तिका और प्रायः कोशिकाओं के बीच छोटी खाली जगह।'],
 life:['Living at maturity and able to divide again.','परिपक्व होने पर भी जीवित, और दोबारा विभाजित हो सकती हैं।'],
 fn:['Stores food and water, carries out photosynthesis (chlorenchyma), allows air movement (aerenchyma) and heals wounds.','भोजन व पानी जमा करता है, प्रकाश-संश्लेषण करता है (क्लोरेंकाइमा), हवा के आवागमन में मदद करता है (एरेंकाइमा) और घाव भरता है।'],
 note:['Aerenchyma has large air spaces and is common in water plants.','एरेंकाइमा में बड़ी वायु-गुहाएँ होती हैं और यह जलीय पौधों में आम है।']},
collenchyma:{n:['Collenchyma','स्थूलकोण ऊतक (कॉलेनकाइमा)'],scene:'stem-dicot',
 where:['Just under the epidermis of young stems and leaf stalks, and along leaf veins.','युवा तनों व पर्णवृंतों की अधिचर्म के ठीक नीचे और पत्ती की शिराओं के साथ।'],
 cells:['Elongated cells whose walls are unevenly thickened with cellulose and pectin, mostly at the corners. Very little gap between cells.','लंबी कोशिकाएँ; भित्ति सेलुलोज़ व पेक्टिन से असमान रूप से मोटी, मुख्यतः कोनों पर। कोशिकाओं के बीच बहुत कम खाली जगह।'],
 life:['Living.','जीवित।'],
 fn:['Gives flexible support to growing parts, so stems and leaves can bend without breaking.','बढ़ते भागों को लचीला सहारा देता है, जिससे तने और पत्तियाँ टूटे बिना मुड़ सकती हैं।'],
 note:['Usually absent from monocot stems and roots.','प्रायः एकबीजपत्री तनों व जड़ों में अनुपस्थित।']},
sclerenchyma:{n:['Sclerenchyma','दृढ़ोतक (स्क्लेरेनकाइमा)'],scene:'stem-dicot',
 where:['Around vascular bundles in stems, in leaf veins, seed coats, nut shells and fruit stones.','तनों में संवहन बंडलों के चारों ओर, पत्ती की शिराओं, बीजचोल, मेवों के छिलके और गुठली में।'],
 cells:['Long, narrow fibres or short, irregular sclereids. Walls are very thick and lignified, leaving a narrow cavity.','लंबे, पतले तंतु (फाइबर) या छोटी, अनियमित स्क्लेरीड। भित्ति बहुत मोटी और लिग्निन-युक्त, भीतर संकरी गुहा।'],
 life:['Usually dead at maturity.','परिपक्व होने पर प्रायः मृत।'],
 fn:['Gives strength and hardness.','मज़बूती और कठोरता देता है।'],
 note:['Jute and flax fibres are sclerenchyma. Sclereids make pear flesh gritty.','जूट और अलसी के रेशे दृढ़ोतक हैं। स्क्लेरीड नाशपाती के गूदे को किरकिरा बनाते हैं।']},
xylem:{n:['Xylem','जाइलम (दारु)'],scene:'stem-dicot',
 where:['In vascular bundles of roots, stems and leaf veins. In dicot stems it lies inside the cambium; in roots it is central.','जड़, तने और पत्ती की शिराओं के संवहन बंडलों में। द्विबीजपत्री तने में कैम्बियम के भीतर; जड़ में केंद्र में।'],
 cells:['Tracheids, vessel elements (mostly in flowering plants), fibres and xylem parenchyma. Walls are thick and lignified, with rings, spirals or pits.','वाहिनिकाएँ (ट्रैकीड), वाहिका तत्व (अधिकांशतः पुष्पीय पौधों में), तंतु और जाइलम मृदूतक। भित्ति मोटी, लिग्निन-युक्त; छल्ले, सर्पिल या गर्त वाली।'],
 life:['Tracheids, vessels and fibres are dead at maturity. Xylem parenchyma is living.','वाहिनिकाएँ, वाहिकाएँ और तंतु परिपक्व होने पर मृत। जाइलम मृदूतक जीवित।'],
 fn:['Carries water and minerals upwards and supports the plant.','पानी और खनिज ऊपर पहुँचाता है और पौधे को सहारा देता है।'],
 note:['Most gymnosperms have tracheids but no vessels. Dicot bundles are open (with cambium); monocot bundles are closed.','अधिकांश अनावृतबीजी पौधों में वाहिनिकाएँ होती हैं, वाहिकाएँ नहीं। द्विबीजपत्री बंडल खुले (कैम्बियम सहित) और एकबीजपत्री बंडल बंद होते हैं।']},
phloem:{n:['Phloem','फ्लोएम (पोषवाह)'],scene:'stem-dicot',
 where:['Beside xylem in the vascular bundles; in dicot stems it lies outside the cambium.','संवहन बंडलों में जाइलम के साथ; द्विबीजपत्री तने में कैम्बियम के बाहर।'],
 cells:['Sieve tube elements joined end to end by sieve plates, companion cells, phloem parenchyma and fibres. Walls are mostly thin, made of cellulose.','छलनी नलिका तत्व जो सिरों पर छलनी पट्टिकाओं से जुड़े होते हैं, सहचर कोशिकाएँ, फ्लोएम मृदूतक और तंतु। भित्ति प्रायः पतली, सेलुलोज़ की।'],
 life:['Sieve tube elements are living but have no nucleus at maturity. Companion cells are living with a nucleus. Fibres are dead.','छलनी नलिका तत्व जीवित पर परिपक्व होने पर केंद्रक-रहित। सहचर कोशिकाएँ केंद्रक सहित जीवित। तंतु मृत।'],
 fn:['Carries sugars (food) from where they are made or stored to where they are needed.','शर्करा (भोजन) को जहाँ बनती या जमा होती है वहाँ से जहाँ ज़रूरत है वहाँ पहुँचाता है।'],
 note:['Gymnosperms have sieve cells instead of sieve tubes and companion cells. Monocot phloem has no phloem parenchyma.','अनावृतबीजी में छलनी नलिका और सहचर कोशिकाओं की जगह छलनी कोशिकाएँ होती हैं। एकबीजपत्री फ्लोएम में फ्लोएम मृदूतक नहीं होता।']},
secretory:{n:['Secretory structures','स्रावी संरचनाएँ'],scene:'',
 where:['Only in some plants: glands, resin ducts (pine), laticifers (rubber plant, Calotropis), nectaries and oil glands (citrus peel).','केवल कुछ पौधों में: ग्रंथियाँ, रेज़िन नलिकाएँ (चीड़), क्षीरनलिकाएँ (रबर पौधा, आक), मकरंद ग्रंथियाँ और तेल ग्रंथियाँ (नींबू का छिलका)।'],
 cells:['Secretory cells, or ducts and canals lined by them. Laticifers are long tubes filled with latex.','स्रावी कोशिकाएँ, या उनसे घिरी नलिकाएँ। क्षीरनलिकाएँ लंबी नलियाँ होती हैं जिनमें दूधिया रस (लेटेक्स) भरा रहता है।'],
 life:['Secretory cells are living.','स्रावी कोशिकाएँ जीवित।'],
 fn:['Make and store latex, resin, oils, nectar and gums.','लेटेक्स, रेज़िन, तेल, मकरंद और गोंद बनाते व जमा करते हैं।'],
 note:['Resin and latex help defend against insects and wounds; nectar attracts pollinators.','रेज़िन और लेटेक्स कीटों व घावों से बचाव में मदद करते हैं; मकरंद परागणकारियों को आकर्षित करता है।']}};

const PV_XP=[[['Carries','ले जाता है'],['Water and minerals','पानी और खनिज'],['Sugars (food) and some hormones','शर्करा (भोजन) और कुछ हार्मोन']],
 [['Direction','दिशा'],['Mostly upward, roots to shoots','प्रायः ऊपर की ओर, जड़ से तने की ओर'],['Both ways, from source to sink','दोनों ओर, स्रोत से उपयोग-स्थल तक']],
 [['Main conducting cells','मुख्य संवाहक कोशिकाएँ'],['Tracheids, vessel elements','वाहिनिकाएँ, वाहिका तत्व'],['Sieve tube elements (with companion cells)','छलनी नलिका तत्व (सहचर कोशिकाओं सहित)']],
 [['Alive when mature?','परिपक्व होने पर जीवित?'],['No, conducting cells are dead','नहीं, संवाहक कोशिकाएँ मृत'],['Yes, but without a nucleus','हाँ, पर केंद्रक-रहित']],
 [['Walls','भित्ति'],['Thick and lignified','मोटी और लिग्निन-युक्त'],['Thin, cellulose (sieve plates at the ends)','पतली, सेलुलोज़ की (सिरों पर छलनी पट्टिकाएँ)']],
 [['Driving force','प्रेरक बल'],['Transpiration pull (cohesion–tension)','वाष्पोत्सर्जन-खिंचाव (संसंजन-तनाव)'],['Pressure flow','दाब-प्रवाह']]];




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




SC['anther']=()=>{
  const S=new Sc(),L=PV.L,add=(id,g,m,x,y,z)=>S.add(id,mesh(g,m,x,y,z)),pt=(id,en,hi,de,dh)=>S.part(id,L(en,hi),L(de,dh)),D={side:T.DoubleSide};
  S.title=L('Anther: cross-section (T.S.)','परागकोश: अनुप्रस्थ काट');S.cam=6.4;S.group.rotation.set(.45,.55,0);
  S.note=L('A typical anther has two lobes and four pollen sacs (microsporangia). Tap a part or use the chips.','विशिष्ट परागकोश में दो पालियाँ और चार पराग-कोष (लघुबीजाणुधानी) होते हैं। किसी भाग को छुएँ या चिप दबाएँ।');
  pt('epi','Epidermis','अधिचर्म','Outermost protective layer of the anther wall.','परागकोश भित्ति की सबसे बाहरी रक्षी परत।');
  pt('endo','Endothecium','अंतस्थीसियम','Layer below the epidermis. Its thickened cells help the anther wall split open (dehisce) and release pollen.','अधिचर्म के नीचे की परत। इसकी मोटी कोशिकाएँ परागकोश को फटने (स्फुटन) में मदद करती हैं जिससे पराग निकलते हैं।');
  pt('tap','Tapetum','टेपेटम','Innermost wall layer. It nourishes the developing pollen grains.','भित्ति की सबसे भीतरी परत। विकसित हो रहे परागकणों को पोषण देती है।');
  pt('sac','Pollen sac (microsporangium)','पराग-कोष (लघुबीजाणुधानी)','Chamber where pollen grains form and mature. Each anther lobe has two.','वह कक्ष जहाँ परागकण बनते और परिपक्व होते हैं। हर पाली में दो होते हैं।');
  pt('pollen','Pollen grains','परागकण','Male gametophytes made from microspores inside the pollen sac.','पराग-कोष के भीतर लघुबीजाणुओं से बने नर युग्मकोद्भिद।');
  pt('conn','Connective','योजी (कनेक्टिव)','Sterile tissue joining the two lobes and holding the vascular bundle.','दोनों पालियों को जोड़ने वाला बंध्य ऊतक, जिसमें संवहन बंडल होता है।');
  pt('vb','Vascular bundle','संवहन बंडल','Brings water and food to the anther through the filament.','तंतु (फिलामेंट) से होकर परागकोश तक पानी और भोजन पहुँचाता है।');
  add('conn',new T.BoxGeometry(.5,1.9,1.2),M(0xe8f5e9),0,0,0);
  add('vb',new T.CylinderGeometry(.09,.09,1.3,12).rotateX(Math.PI/2),M(0xc62828),0,0,0);
  const P=[[-.75,.55],[.75,.55],[-.75,-.55],[.75,-.55]];
  [['epi',.5,0xa5d6a7,{}],['endo',.43,0xffcc80,{}],['tap',.36,0xce93d8,{}],['sac',.3,0xfff9c4,{transparent:true,opacity:.4}]].forEach(a=>P.forEach(p=>add(a[0],new T.CylinderGeometry(a[1],a[1],1.2,32,1,true).rotateX(Math.PI/2),M(a[2],Object.assign({side:T.DoubleSide},a[3])),p[0],p[1],0)));
  P.forEach(p=>{for(let i=0;i<7;i++){const a=rnd()*6.28,r=rnd()*.22;add('pollen',new T.SphereGeometry(.06,10,8),M(0xfdd835),p[0]+Math.cos(a)*r,p[1]+Math.sin(a)*r,.05+rnd()*.5)}});
  return S};
SC['pollen']=()=>{
  const S=new Sc(),L=PV.L,add=(id,g,m,x,y,z)=>S.add(id,mesh(g,m,x,y,z)),pt=(id,en,hi,de,dh)=>S.part(id,L(en,hi),L(de,dh));
  S.title=L('Pollen grain: inside','परागकण: भीतर की संरचना');S.cam=5;S.group.rotation.set(.3,.5,0);
  S.note=L('Simplified: size, surface pattern and number of pores differ in every species. Many pollen grains shed with two cells; the generative cell divides into two male gametes in the grain or in the pollen tube.','सरलीकृत: हर प्रजाति में आकार, सतह का पैटर्न और छिद्रों की संख्या अलग होती है। कई परागकण दो कोशिकाओं के साथ झड़ते हैं; जनन कोशिका परागकण में या पराग नलिका में विभाजित होकर दो नर युग्मक बनाती है।');
  pt('exine','Exine','बाह्यचोल (एक्ज़ाइन)','Hard outer wall of sporopollenin, one of the toughest natural materials. It resists heat, acid and enzymes, so pollen fossils survive.','स्पोरोपोलेनिन की कठोर बाहरी भित्ति, जो अत्यंत टिकाऊ पदार्थों में से है। गर्मी, अम्ल और एंज़ाइम सहन करती है, इसलिए परागकणों के जीवाश्म बचे रहते हैं।');
  pt('pore','Germ pore','जनन छिद्र','Spot where the exine is missing. The pollen tube comes out through it.','वह स्थान जहाँ बाह्यचोल नहीं होता। पराग नलिका यहीं से बाहर निकलती है।');
  pt('intine','Intine','अंतःचोल (इंटाइन)','Thin inner wall of cellulose and pectin. It grows out as the pollen tube.','सेलुलोज़ और पेक्टिन की पतली भीतरी भित्ति। यही पराग नलिका के रूप में बढ़ती है।');
  pt('veg','Vegetative cell','कायिक कोशिका','Large cell with food reserves. It makes the pollen tube grow.','भोजन भंडार वाली बड़ी कोशिका। पराग नलिका को बढ़ाती है।');
  pt('vnuc','Vegetative nucleus','कायिक केंद्रक','Large nucleus that directs growth of the pollen tube.','बड़ा केंद्रक जो पराग नलिका की वृद्धि को निर्देशित करता है।');
  pt('gen','Generative cell','जनन कोशिका','Small spindle-shaped cell. It divides to form the two male gametes.','छोटी तर्कु-आकार कोशिका। विभाजित होकर दो नर युग्मक बनाती है।');
  const G=new T.Group();S.group.add(G);
  [['exine',1,0xffb300,.45],['intine',.92,0x81c784,.4],['veg',.86,0xfff59d,.35]].forEach(a=>cutSphere(S,a[0],a[1],M(a[2],{transparent:true,opacity:a[3]}),G));
  const Y=new T.Vector3(0,1,0);
  for(let i=0;i<45;i++){const y=1-2*(i+.5)/45,r=Math.sqrt(1-y*y),t=i*2.39996,x=Math.cos(t)*r,z=Math.sin(t)*r;if(x<0&&z>0)continue;
    const m=add('exine',new T.ConeGeometry(.05,.14,5),M(0xff8f00),x*1.03,y*1.03,z*1.03);m.quaternion.setFromUnitVectors(Y,new T.Vector3(x,y,z))}
  const n=new T.Vector3(.7,.3,.65).normalize(),pm=add('pore',new T.CylinderGeometry(.2,.2,.05,20),M(0x4e342e),n.x*.99,n.y*.99,n.z*.99);pm.quaternion.setFromUnitVectors(Y,n);
  add('vnuc',new T.SphereGeometry(.22,18,14),M(0x6a1b9a),-.25,-.15,-.1);
  add('gen',new T.SphereGeometry(.15,14,10),M(0xff7043),.3,.25,.1).scale.set(1.5,.8,.8);
  return S};




SC['ovule']=()=>{
  const S=new Sc(),L=PV.L,add=(id,g,m,x,y,z,par)=>S.add(id,mesh(g,m,x,y,z),par),pt=(id,en,hi,de,dh)=>S.part(id,L(en,hi),L(de,dh));
  S.title=L('Ovule: inside','बीजांड: भीतर की संरचना');S.cam=6.5;S.group.rotation.set(.2,.5,0);
  S.note=L('Simplified, straight (orthotropous) drawing. Many ovules curve so that the micropyle lies near the stalk (anatropous).','सरलीकृत, सीधा (ऑर्थोट्रोपस) चित्र। कई बीजांड मुड़े होते हैं जिससे बीजांडद्वार डंठल के पास आ जाता है (एनाट्रोपस)।');
  pt('funicle','Funicle','बीजांडवृंत','Stalk that attaches the ovule to the placenta.','वह डंठल जो बीजांड को अपरा (प्लेसेंटा) से जोड़ता है।');
  pt('hilum','Hilum','नाभिका (हाइलम)','Junction where the ovule joins the funicle.','वह जोड़ जहाँ बीजांड बीजांडवृंत से मिलता है।');
  pt('outer','Outer integument','बाह्य अध्यावरण','Outer protective covering. After fertilisation the integuments become the seed coat.','बाहरी रक्षी आवरण। निषेचन के बाद अध्यावरण बीजचोल बनते हैं।');
  pt('inner','Inner integument','आंतरिक अध्यावरण','Inner protective covering around the nucellus.','बीजांडकाय के चारों ओर भीतरी रक्षी आवरण।');
  pt('micropyle','Micropyle','बीजांडद्वार (माइक्रोपाइल)','Small opening in the integuments. The pollen tube usually enters through it; later water enters the seed here.','अध्यावरणों में छोटा छिद्र। पराग नलिका प्रायः यहीं से प्रवेश करती है; बाद में बीज में पानी भी यहीं से जाता है।');
  pt('nucellus','Nucellus','बीजांडकाय (न्यूसेलस)','Tissue inside the integuments that nourishes the embryo sac. It is the megasporangium.','अध्यावरणों के भीतर का ऊतक जो भ्रूणकोष को पोषण देता है। यह गुरुबीजाणुधानी है।');
  pt('es','Embryo sac','भ्रूणकोष','The female gametophyte, formed from a megaspore. It holds the egg cell.','गुरुबीजाणु से बना मादा युग्मकोद्भिद। इसमें अंड कोशिका होती है।');
  pt('chalaza','Chalaza','निभाग (कैलेज़ा)','Basal end of the ovule, opposite the micropyle, where integuments and nucellus join.','बीजांड का आधार-सिरा, बीजांडद्वार के विपरीत, जहाँ अध्यावरण और बीजांडकाय जुड़ते हैं।');
  const G=new T.Group();G.scale.set(1,1.4,.9);S.group.add(G);
  [['outer',1,0xa5d6a7,.35],['inner',.85,0x66bb6a,.4],['nucellus',.7,0xffe082,.4]].forEach(a=>cutSphere(S,a[0],a[1],M(a[2],{transparent:true,opacity:a[3]}),G));
  add('es',new T.SphereGeometry(.38,20,14),M(0xf48fb1,{transparent:true,opacity:.65}),0,.4,0).scale.set(.8,1.4,.8);
  add('micropyle',new T.TorusGeometry(.11,.035,8,20).rotateX(Math.PI/2),M(0x3e2723),0,1.4,0);
  add('chalaza',new T.SphereGeometry(.2,14,10),M(0x8d6e63),0,-1.15,0);
  add('hilum',new T.CylinderGeometry(.22,.22,.05,18),M(0x5d4037),0,-1.42,0);
  add('funicle',new T.CylinderGeometry(.12,.12,.6,12),M(0x7cb342),0,-1.72,0);
  return S};
function pvSac(fert){
  const S=new Sc(),L=PV.L,add=(id,g,m,x,y,z)=>S.add(id,mesh(g,m,x,y,z)),pt=(id,en,hi,de,dh)=>S.part(id,L(en,hi),L(de,dh));
  S.title=fert?L('Double fertilisation','दोहरा निषेचन'):L('Embryo sac (7 cells, 8 nuclei)','भ्रूणकोष (7 कोशिकाएँ, 8 केंद्रक)');S.cam=6.2;S.group.rotation.set(.2,.35,0);
  S.note=fert?L('Simplified. One male gamete fuses with the egg (zygote, 2n), the other with the two polar nuclei (triple fusion, 3n). The zygote becomes the embryo; the 3n cell becomes the endosperm.','सरलीकृत। एक नर युग्मक अंड से मिलता है (युग्मनज, 2n) और दूसरा दोनों ध्रुवीय केंद्रकों से (त्रिक संलयन, 3n)। युग्मनज भ्रूण बनता है; 3n कोशिका भ्रूणपोष बनती है।')
    :L('Typical (Polygonum-type) embryo sac. Micropylar end at the top, chalazal end at the bottom.','विशिष्ट (पॉलीगोनम-प्रकार) भ्रूणकोष। ऊपर बीजांडद्वार वाला सिरा, नीचे निभाग वाला सिरा।');
  pt('wall','Embryo sac wall','भ्रूणकोष की भित्ति','Boundary of the embryo sac inside the nucellus.','बीजांडकाय के भीतर भ्रूणकोष की सीमा।');
  pt('egg','Egg cell','अंड कोशिका','The female gamete, at the micropylar end. Fusion with a male gamete forms the zygote.','मादा युग्मक, बीजांडद्वार वाले सिरे पर। नर युग्मक से मिलकर युग्मनज बनाती है।');
  pt('syn','Synergids','सहायक कोशिकाएँ','Two cells beside the egg. They guide the pollen tube to the egg.','अंड के पास दो कोशिकाएँ। पराग नलिका को अंड तक पहुँचाने में मार्गदर्शन करती हैं।');
  pt('cc','Central cell','केंद्रीय कोशिका','Large cell that holds the two polar nuclei. It becomes the endosperm after fertilisation.','बड़ी कोशिका जिसमें दो ध्रुवीय केंद्रक होते हैं। निषेचन के बाद भ्रूणपोष बनती है।');
  pt('pn','Polar nuclei','ध्रुवीय केंद्रक','Two nuclei in the central cell. A male gamete fuses with them (triple fusion).','केंद्रीय कोशिका के दो केंद्रक। एक नर युग्मक इनसे मिलता है (त्रिक संलयन)।');
  pt('anti','Antipodal cells','प्रतिव्यासांत कोशिकाएँ','Three cells at the chalazal end. They are usually short-lived.','निभाग वाले सिरे पर तीन कोशिकाएँ। प्रायः अल्पजीवी होती हैं।');
  if(fert){pt('tube','Pollen tube','पराग नलिका','Tube that grows from the pollen grain through the micropyle and delivers two male gametes into the embryo sac.','परागकण से बीजांडद्वार होकर बढ़ने वाली नलिका जो दो नर युग्मकों को भ्रूणकोष में पहुँचाती है।');
    pt('sperm','Male gametes','नर युग्मक','Two male gametes: one fuses with the egg, the other with the polar nuclei.','दो नर युग्मक: एक अंड से और दूसरा ध्रुवीय केंद्रकों से मिलता है।')}
  const G=new T.Group();G.scale.set(1,1.6,.9);S.group.add(G);cutSphere(S,'wall',1,M(0xf8bbd0,{transparent:true,opacity:.3}),G);
  add('cc',new T.SphereGeometry(.6,20,14),M(0xfff59d,{transparent:true,opacity:.35}),0,-.05,0).scale.set(1,1.4,.9);
  [[-.1,.2,.1],[.12,.05,.1]].forEach(p=>add('pn',new T.SphereGeometry(.1,12,10),M(0x6a1b9a),p[0],p[1],p[2]));
  add('egg',new T.SphereGeometry(.2,16,12),M(0xffd54f),0,1.0,.1).scale.set(1,1.25,1);add('egg',new T.SphereGeometry(.07,10,8),M(0x6a1b9a),0,1.0,.28);
  [-.3,.3].forEach(x=>{add('syn',new T.SphereGeometry(.14,14,10),M(0x90caf9),x,1.15,0).scale.set(.8,1.4,.8);add('syn',new T.SphereGeometry(.05,8,6),M(0x6a1b9a),x,1.1,.12)});
  [[-.28,-1.15,0],[.28,-1.15,0],[0,-1.3,.2]].forEach(p=>{add('anti',new T.SphereGeometry(.15,14,10),M(0x66bb6a),p[0],p[1],p[2]);add('anti',new T.SphereGeometry(.05,8,6),M(0x6a1b9a),p[0],p[1],p[2]+.12)});
  if(fert){const c=new T.CatmullRomCurve3([new T.Vector3(.5,3,0),new T.Vector3(.35,2.2,0),new T.Vector3(.3,1.6,.05),new T.Vector3(.3,1.2,.05)]);
    add('tube',new T.TubeGeometry(c,24,.07,8),M(0x7cb342));
    add('sperm',new T.SphereGeometry(.06,10,8),M(0x1565c0),.12,.82,.2).scale.set(1.8,1,1);add('sperm',new T.SphereGeometry(.06,10,8),M(0x1565c0),.05,.45,.2).scale.set(1.8,1,1)}
  return S}
SC['embryo-sac']=()=>pvSac(false);SC['fertilisation']=()=>pvSac(true);




(function(){
  DIA.flower.spots.push(['anther','Anther (T.S.)'],['ovule','Ovule']);
  ['anther','pollen','ovule','embryo-sac','fertilisation'].forEach(k=>SCENE_PART[k]='flower');
  const D={'anther':[['pollen','🔍 Pollen grain','🔍 परागकण']],'pollen':[['anther','◀ Anther','◀ परागकोश']],
    'ovule':[['embryo-sac','🔍 Embryo sac','🔍 भ्रूणकोष']],'embryo-sac':[['fertilisation','▶ Fertilisation','▶ निषेचन'],['ovule','◀ Ovule','◀ बीजांड']],
    'fertilisation':[['embryo-sac','◀ Embryo sac','◀ भ्रूणकोष']]};
  PV.after('openScene',id=>{const d=D[id];if(!d)return;const n=$('#chips');
    d.slice().reverse().forEach(([to,en,hi])=>{const b=document.createElement('button');b.className='chip mode';b.textContent=PV.L(en,hi);b.dataset.id='__'+to;b.onclick=()=>openScene(to);n.insertBefore(b,n.firstChild)})});
})();




const PV_HEALTH={
n:{k:'s',v:'pale',n:['Nitrogen deficiency','नाइट्रोजन की कमी'],f:[['Too little nitrogen in the soil.','मिट्टी में नाइट्रोजन कम।'],['Older leaves turn pale first; the whole plant is stunted.','पहले पुरानी पत्तियाँ पीली पड़ती हैं; पूरा पौधा बौना रहता है।'],['Less chlorophyll and protein can be made. Nitrogen moves from old leaves to young growth.','क्लोरोफिल व प्रोटीन कम बनते हैं। नाइट्रोजन पुरानी पत्तियों से नई वृद्धि में चला जाता है।'],['Waterlogged roots and other deficiencies also cause pale leaves.','जलभराव वाली जड़ें और अन्य कमियाँ भी पत्तियाँ पीली करती हैं।']]},
fe:{k:'s',v:'interv',n:['Iron deficiency (interveinal chlorosis)','आयरन की कमी (शिराओं के बीच पीलापन)'],f:[['Alkaline or waterlogged soil makes iron unavailable.','क्षारीय या जलभराव वाली मिट्टी में आयरन उपलब्ध नहीं रहता।'],['Young leaves: yellow between green veins.','नई पत्तियाँ: हरी शिराओं के बीच पीला।'],['Iron is needed to make chlorophyll and does not move easily from old to new leaves.','क्लोरोफिल बनाने के लिए आयरन चाहिए और यह पुरानी से नई पत्तियों में आसानी से नहीं जाता।'],['Magnesium deficiency looks alike but starts on older leaves. Check which leaves are affected.','मैग्नीशियम की कमी भी ऐसी दिखती है पर पुरानी पत्तियों से शुरू होती है। देखें कौन-सी पत्तियाँ प्रभावित हैं।']]},
k:{k:'s',v:'edge',n:['Potassium deficiency','पोटैशियम की कमी'],f:[['Low potassium in the soil.','मिट्टी में पोटैशियम कम।'],['Older leaves: yellowing, then brown dead edges (necrosis).','पुरानी पत्तियाँ: पीलापन, फिर किनारे भूरे और मृत (ऊतकक्षय)।'],['Potassium helps guard cells and enzymes work. Without it, margin tissue dies.','पोटैशियम रक्षक कोशिकाओं और एंज़ाइमों के काम में मदद करता है। इसके बिना किनारों का ऊतक मर जाता है।'],['Salt injury and drought can also scorch leaf edges.','नमक की अधिकता और सूखा भी किनारे झुलसा सकते हैं।']]},
wilt:{k:'s',v:'wilt',n:['Wilting (water stress)','मुरझाना (जल-तनाव)'],f:[['Too little water, hot dry wind, or roots that cannot absorb.','पानी कम, गर्म सूखी हवा, या जड़ें पानी न सोख पाएँ।'],['Leaves and young stems droop.','पत्तियाँ और कोमल तने झुक जाते हैं।'],['Cells lose turgor when water loss is faster than uptake. Stomata close, so photosynthesis also falls.','पानी की हानि अवशोषण से तेज़ हो तो कोशिकाओं का स्फीति-दाब घटता है। रंध्र बंद होते हैं, इसलिए प्रकाश-संश्लेषण भी घटता है।'],['Overwatering and root rot also cause wilting. Check soil and roots before adding water.','अधिक पानी और जड़-सड़न से भी मुरझाना होता है। पानी देने से पहले मिट्टी और जड़ें देखें।']]},
root:{k:'s',v:'wilt',n:['Waterlogging and root rot','जलभराव और जड़-सड़न'],f:[['Soaked soil starves roots of oxygen; rot fungi may then invade.','भीगी मिट्टी में जड़ों को ऑक्सीजन नहीं मिलती; सड़न-कवक हमला कर सकते हैं।'],['Roots turn brown and mushy; leaves yellow and wilt.','जड़ें भूरी और गलने लगती हैं; पत्तियाँ पीली होकर मुरझाती हैं।'],['Roots need oxygen for respiration. Damaged roots cannot take up water, so the shoot wilts even in wet soil.','जड़ों को श्वसन के लिए ऑक्सीजन चाहिए। क्षतिग्रस्त जड़ें पानी नहीं सोखतीं, इसलिए गीली मिट्टी में भी पौधा मुरझाता है।'],['Leaf signs look like drought. Only looking at the roots confirms it.','पत्तियों के लक्षण सूखे जैसे दिखते हैं। जड़ें देखकर ही पुष्टि होती है।']]},
spot:{k:'d',v:'spots',n:['Fungal leaf spot','कवक जनित पत्ती-धब्बा'],f:[['A fungus; spores spread in wet, humid weather.','कवक; नम मौसम में बीजाणु फैलते हैं।'],['Leaves: brown spots, often with a yellow ring.','पत्तियाँ: भूरे धब्बे, प्रायः पीले घेरे सहित।'],['Fungal threads kill leaf cells and take nutrients from them. Spots join and cut photosynthesis.','कवक तंतु पत्ती की कोशिकाओं को मारकर उनसे पोषक लेते हैं। धब्बे जुड़कर प्रकाश-संश्लेषण घटाते हैं।'],['Bacterial spots and chemical burns look similar. Confirming needs a microscope or lab test.','जीवाणु-धब्बे और रासायनिक जलन भी ऐसे दिखते हैं। पुष्टि के लिए सूक्ष्मदर्शी या प्रयोगशाला जाँच चाहिए।']]},
mildew:{k:'d',v:'powder',n:['Powdery mildew','चूर्णिल आसिता (पाउडरी मिल्ड्यू)'],f:[['A fungus; likes warm days and humid air.','कवक; गर्म दिन और नम हवा पसंद है।'],['Leaf surface: white powdery coat; also stems and buds.','पत्ती की सतह पर सफ़ेद चूर्ण-सी परत; तने और कलियों पर भी।'],['It grows on the surface and feeds through tiny suckers in epidermal cells. It also blocks light.','यह सतह पर बढ़ता और अधिचर्म कोशिकाओं में चूषकों से भोजन लेता है। प्रकाश भी रोकता है।'],['Dust or spray residue can look the same. Try wiping it off.','धूल या छिड़काव के अवशेष भी ऐसे लगते हैं। पोंछकर देखें।']]},
mosaic:{k:'d',v:'mosaic',n:['Viral mosaic','विषाणु मोज़ेक'],f:[['A virus carried by insects such as aphids or whiteflies, or by infected seed and tools.','एफ़िड या सफ़ेद मक्खी जैसे कीटों, संक्रमित बीज या औज़ारों से फैलने वाला विषाणु।'],['Whole plant; leaves mottled light and dark green, may curl.','पूरा पौधा; पत्तियों पर हल्के-गहरे हरे चितकबरे निशान, मुड़ाव भी।'],['The virus makes the plant\'s own cells copy it, and spreads through plasmodesmata and phloem.','विषाणु पौधे की अपनी कोशिकाओं से अपनी प्रतियाँ बनवाता है और प्लाज़्मोडेस्माटा व फ्लोएम से फैलता है।'],['Nutrient shortage or herbicide can mimic it. There is no cure, so removing the plant and controlling insects matters.','पोषक-कमी या खरपतवारनाशी भी ऐसा दिखा सकते हैं। इलाज नहीं है, इसलिए पौधा हटाना और कीट-नियंत्रण ज़रूरी है।']]},
aphid:{k:'d',v:'curl',n:['Sap-sucking insects (aphids)','रस चूसने वाले कीट (एफ़िड)'],f:[['Small insects that feed in groups on phloem sap.','छोटे कीट जो समूह में फ्लोएम का रस चूसते हैं।'],['Young shoots and leaf undersides; leaves curl and sticky honeydew appears.','नई कोपलें और पत्तियों की निचली सतह; पत्तियाँ मुड़ती हैं और चिपचिपा हनीड्यू दिखता है।'],['They drink sugar-rich phloem sap, which weakens the plant, and they can pass on viruses.','वे शर्करा-युक्त फ्लोएम रस पीते हैं जिससे पौधा कमज़ोर होता है, और विषाणु भी फैला सकते हैं।'],['Curling can also come from heat or viruses. Look for the insects themselves.','मुड़ाव गर्मी या विषाणु से भी हो सकता है। कीटों को खुद देखें।']]},
xero:{k:'a',n:['Xerophytes','मरुद्भिद'],f:[['Dry places with little water.','सूखे स्थान जहाँ पानी कम होता है।'],['Thick cuticle, sunken stomata, reduced leaves or spines, fleshy stems, deep roots.','मोटा क्यूटिकल, धँसे रंध्र, छोटी पत्तियाँ या काँटे, मांसल तने, गहरी जड़ें।'],['Less water is lost and more is stored.','पानी कम उड़ता है और अधिक जमा रहता है।'],['Cactus: the green stem does photosynthesis and spines are modified leaves.','कैक्टस: हरा तना प्रकाश-संश्लेषण करता है और काँटे रूपांतरित पत्तियाँ हैं।']]},
hydro:{k:'a',n:['Hydrophytes','जलोद्भिद'],f:[['Ponds, lakes and slow water.','तालाब, झील और धीमा पानी।'],['Large air spaces (aerenchyma), thin cuticle, weak roots and xylem; floating leaves have stomata on top.','बड़ी वायु-गुहाएँ (एरेंकाइमा), पतला क्यूटिकल, कमज़ोर जड़ें व जाइलम; तैरती पत्तियों में रंध्र ऊपर।'],['Air spaces keep the plant afloat and carry oxygen to submerged parts.','वायु-गुहाएँ पौधे को तैराती हैं और डूबे भागों तक ऑक्सीजन पहुँचाती हैं।'],['Water lily, Hydrilla.','कमल/वॉटर लिली, हाइड्रिला।']]},
halo:{k:'a',n:['Halophytes (mangroves)','लवणोद्भिद (मैंग्रोव)'],f:[['Salty soil and muddy coasts.','खारी मिट्टी और कीचड़ वाले तट।'],['Salt-excreting glands, thick fleshy leaves, breathing roots (pneumatophores).','नमक निकालने वाली ग्रंथियाँ, मोटी मांसल पत्तियाँ, श्वसन-मूल (न्यूमेटोफोर)।'],['They cope with salt and with oxygen-poor mud.','वे नमक और ऑक्सीजन-रहित कीचड़ को सह पाते हैं।'],['Rhizophora, Avicennia.','राइज़ोफोरा, एविसेनिया।']]},
epi:{k:'a',n:['Epiphytes','अधिपादप'],f:[['Grow on trees for support (not parasites).','पेड़ों पर सहारे के लिए उगते हैं (परजीवी नहीं)।'],['Aerial roots with spongy velamen; some have tank-like leaf bases.','स्पंजी वेलामेन वाली हवाई जड़ें; कुछ में टंकी-जैसे पर्णाधार।'],['They absorb moisture from air and rain.','वे हवा और बारिश से नमी सोखते हैं।'],['Orchids, bromeliads.','ऑर्किड, ब्रोमेलियाड।']]},
carn:{k:'a',n:['Carnivorous plants','कीटभक्षी पौधे'],f:[['Bogs and soils poor in nitrogen.','दलदल और नाइट्रोजन-रहित मिट्टी।'],['Leaves modified into traps: pitchers, sticky hairs or bladders.','पत्तियाँ फंदों में रूपांतरित: घड़ा, चिपचिपे रोम या थैलियाँ।'],['Digesting insects gives nitrogen and minerals. They still photosynthesise.','कीट पचाने से नाइट्रोजन व खनिज मिलते हैं। वे प्रकाश-संश्लेषण भी करते हैं।'],['Nepenthes (pitcher plant), Drosera, Utricularia.','नेपेंथीज़ (घटपर्णी), ड्रॉसेरा, यूट्रिकुलेरिया।']]},
climb:{k:'a',n:['Climbing plants','आरोही पौधे'],f:[['Crowded places where light is high up.','भीड़-भरी जगहें जहाँ प्रकाश ऊँचाई पर है।'],['Tendrils, twining stems, hooks or clinging roots.','प्रतान (टेंड्रिल), लिपटने वाले तने, काँटे या चिपकने वाली जड़ें।'],['They reach light without building a thick stem.','वे मोटा तना बनाए बिना प्रकाश तक पहुँचते हैं।'],['Pea (tendrils), money plant (clinging roots).','मटर (प्रतान), मनी प्लांट (चिपकने वाली जड़ें)।']]}};




(function(){
  const L=PV.L,el=PV.ui.addPanel('pv-health','');let tab='s',cur=null,uid=0;
  const TABS=[['s','Symptoms','लक्षण'],['d','Diseases & pests','रोग व कीट'],['a','Adaptations','अनुकूलन']];
  const LBL={s:[['Possible cause','संभावित कारण'],['Organ affected','प्रभावित अंग'],['What happens inside','भीतर क्या होता है'],['Why diagnosis is hard','पहचान क्यों कठिन']],
    a:[['Habitat','आवास'],['Features','विशेषताएँ'],['How it helps','कैसे मदद करता है'],['Example','उदाहरण']]};LBL.d=LBL.s;
  const LEAF='M8 35 Q60 -8 112 35 Q60 78 8 35Z',ve=(c,w)=>`<g stroke="${c}" stroke-width="${w}" fill="none"><path d="M8 35 H112"/>${[28,50,72,94].map(x=>`<path d="M${x} 35 L${x+14} 14M${x} 35 L${x+14} 56"/>`).join('')}</g>`,
    dots=(a,r,c,o)=>a.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="${r}" fill="${c}" opacity="${o||1}"/>`).join('');
  function leaf(v,dx){const id='pvc'+(uid++),P=[[35,28],[60,45],[82,26],[95,40],[50,24]];let base='#43a047',ov='',tf='';
    if(v==='pale')base='#d4e157';
    else if(v==='interv'){base='#fdd835';ov=ve('#2e7d32',3)}
    else if(v==='edge'){base='#66bb6a';ov=`<path d="${LEAF}" fill="none" stroke="#6d4c41" stroke-width="9"/>`}
    else if(v==='wilt'){base='#9ccc65';tf=' translate(0 14) scale(1 .6)';ov=`<path d="M8 35 H112" stroke="#558b2f" stroke-width="2"/>`}
    else if(v==='spots')ov=dots(P,7,'#fdd835',.7)+dots(P,3.5,'#5d4037');
    else if(v==='powder')ov=`<ellipse cx="45" cy="30" rx="16" ry="8" fill="#fff" opacity=".8"/><ellipse cx="82" cy="42" rx="14" ry="7" fill="#fff" opacity=".8"/>`;
    else if(v==='mosaic')ov=dots([[30,32],[55,22],[70,44],[92,30],[48,46]],9,'#c5e1a5',.85);
    else if(v==='curl'){tf=' translate(0 9) scale(1 .7)';ov=dots([[40,35],[55,35],[70,35],[85,35]],2.2,'#212121')}
    return `<g transform="translate(${dx} 0)"><clipPath id="${id}"><path d="${LEAF}"/></clipPath><g transform="${tf}"><path d="${LEAF}" fill="${base}"/><g clip-path="url(#${id})">${ov}</g>${v==='healthy'||v==='edge'||v==='wilt'||v==='curl'||v==='spots'||v==='powder'||v==='mosaic'||v==='pale'?ve('#2e7d32',1.2):''}</g></g>`}
  function draw(){
    const hi=PV.lang&&PV.lang()==='hi',x=hi?1:0,head=`<span class="pv-x" role="button" aria-label="Close">×</span><b>${L('Plant health','पौधे का स्वास्थ्य')}</b>`,
      tabs=`<div class="pv-seg">${TABS.map(t=>`<button data-tab="${t[0]}" aria-pressed="${t[0]===tab}">${hi?t[2]:t[1]}</button>`).join('')}</div>`;
    if(!cur){el.innerHTML=head+tabs+Object.keys(PV_HEALTH).filter(k=>PV_HEALTH[k].k===tab).map(k=>`<button class="pv-opt" data-c="${k}">${PV_HEALTH[k].n[x]}</button>`).join('')
      +(tab==='a'?'':`<p class="pv-note">${L('Educational guide. For a real crop or garden problem, ask an agriculture expert or a lab.','शैक्षिक गाइड। असली फसल या बगीचे की समस्या के लिए कृषि विशेषज्ञ या प्रयोगशाला से पूछें।')}</p>`);return}
    const h=PV_HEALTH[cur],lb=LBL[h.k];
    el.innerHTML=head+`<div class="pv-nav"><button data-c="">◀ ${L('Back','वापस')}</button></div>`
      +(h.v?`<div class="pv-lf"><svg viewBox="0 0 240 70" role="img" aria-label="${h.n[x]}">${leaf('healthy',0)}${leaf(h.v,120)}</svg><div class="pv-cap"><span>${L('Healthy','स्वस्थ')}</span><span>${L('Affected','प्रभावित')}</span></div></div>`:'')
      +`<b>${h.n[x]}</b>`+h.f.map((f,i)=>`<p><u>${lb[i][x]}</u><br>${f[x]}</p>`).join('')+(h.v?`<p class="pv-note">${L('Simplified sketch. Real symptoms vary by plant and stage.','सरल रेखाचित्र। असली लक्षण पौधे और अवस्था के अनुसार बदलते हैं।')}</p>`:'')}
  el.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.tab){tab=b.dataset.tab;cur=null;draw()}else if(b.dataset.c!==undefined){cur=b.dataset.c||null;draw()}});
  PV.sim.reg('health',el,draw);
  const name=()=>L('🩺 Plant health','🩺 पौधे का स्वास्थ्य');
  PV.after('homeChips',()=>{const b=document.createElement('button'),n=$('#chips');b.className='chip mode';b.dataset.id='__health';b.textContent=name();b.onclick=()=>{cur=null;PV.sim.open('health')};n.insertBefore(b,n.firstChild)});
  PV.onLang&&PV.onLang(()=>{const b=document.querySelector('#chips [data-id="__health"]');if(b)b.textContent=name()});
})();




(function(){
  const L=PV.L,el=PV.ui.addPanel('pv-seeddev','');let i=0;
  const dots=(a,c)=>a.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="2.2" fill="#fff59d" stroke="${c||'#fbc02d'}" stroke-width=".6"/>`).join(''),
    C=(x,y,r,f)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${f}"/>`,E=(x,y,rx,ry,f,rot)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}"${rot?` transform="rotate(${rot} ${x} ${y})"`:''}/>`,
    LN=(a,b,c,d,w,col)=>`<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`,
    base=(coat,fill)=>`<ellipse cx="80" cy="62" rx="36" ry="44" fill="${fill||'#c8e6c9'}" stroke="${coat}" stroke-width="${coat==='#6d4c41'?4:2}"/>`+(fill?'':`<ellipse cx="80" cy="62" rx="26" ry="36" fill="#f8bbd0" opacity=".55"/>`),
    SC=[[62,50],[98,52],[70,78],[90,80],[80,92],[58,68],[102,68]];
  
  const ST=[
   {n:['Fertilised ovule','निषेचित बीजांड'],c:['Double fertilisation is complete. The zygote (2n) will become the embryo; the endosperm nucleus (3n) starts dividing.','दोहरा निषेचन पूर्ण। युग्मनज (2n) भ्रूण बनेगा; भ्रूणपोष केंद्रक (3n) विभाजित होने लगता है।'],
    d:()=>base('#66bb6a')+C(80,34,5,'#2e7d32')+C(80,66,6,'#6a1b9a'),lab:[[85,34,'Zygote (2n)','युग्मनज (2n)'],[86,66,'Endosperm nucleus (3n)','भ्रूणपोष केंद्रक (3n)']]},
   {n:['Globular embryo','गोलाकार भ्रूण'],c:['The zygote divides. A suspensor pushes a ball of cells into the embryo sac while endosperm nuclei divide freely.','युग्मनज विभाजित होता है। निलंबक कोशिकाओं की गेंद को भ्रूणकोष में धकेलता है और भ्रूणपोष के केंद्रक मुक्त रूप से विभाजित होते हैं।'],
    d:()=>base('#66bb6a')+LN(80,18,80,31,2,'#2e7d32')+C(80,39,8,'#7cb342')+C(77,37,2,'#c5e1a5')+C(83,41,2,'#c5e1a5')+dots(SC),lab:[[88,39,'Embryo','भ्रूण'],[82,24,'Suspensor','निलंबक'],[98,52,'Free endosperm nuclei','मुक्त भ्रूणपोष केंद्रक']]},
   {n:['Heart stage','हृदयाकार अवस्था'],c:['The two cotyledons begin to form, so the embryo looks heart-shaped.','दो बीजपत्र बनने लगते हैं, इसलिए भ्रूण दिल के आकार का दिखता है।'],
    d:()=>base('#66bb6a')+LN(80,18,80,34,2,'#2e7d32')+C(73,43,7,'#7cb342')+C(87,43,7,'#7cb342')+`<polygon points="66,46 94,46 80,64" fill="#7cb342"/>`+dots(SC.concat([[66,86],[94,88],[50,56],[110,58],[80,78]])),lab:[[92,46,'Heart-shaped embryo','हृदयाकार भ्रूण']]},
   {n:['Mature embryo','परिपक्व भ्रूण'],c:['Radicle, hypocotyl, plumule and cotyledons are formed. In many dicots (such as bean) the endosperm is used up and food is stored in the cotyledons.','मूलांकुर, अधोबीजपत्राक्ष, प्रांकुर और बीजपत्र बन जाते हैं। कई द्विबीजपत्रियों (जैसे सेम) में भ्रूणपोष खप जाता है और भोजन बीजपत्रों में जमा होता है।'],
    d:()=>base('#66bb6a')+`<rect x="77" y="26" width="6" height="34" rx="3" fill="#7cb342"/>`+C(80,25,4,'#ffe0b2')+E(66,76,8,24,'#aed581',12)+E(94,76,8,24,'#aed581',-12)+C(80,62,3,'#2e7d32')+dots([[50,50],[110,52],[58,92],[102,92]]),lab:[[84,25,'Radicle','मूलांकुर'],[102,80,'Cotyledons','बीजपत्र'],[84,62,'Plumule','प्रांकुर']]},
   {n:['Mature seed (dormant)','परिपक्व बीज (सुषुप्त)'],c:['The integuments harden into the seed coat and the seed dries. It can rest in dormancy until conditions suit germination. Meanwhile the ovary becomes the fruit.','अध्यावरण कठोर होकर बीजचोल बनते हैं और बीज सूख जाता है। अनुकूल स्थिति आने तक यह सुषुप्त रह सकता है। इस बीच अंडाशय फल बन जाता है।'],
    d:()=>base('#6d4c41','#d7ccc8')+E(68,66,13,34,'#aed581')+E(92,66,13,34,'#aed581')+`<rect x="76" y="20" width="8" height="16" rx="3" fill="#ffe0b2"/>`+C(80,48,3,'#2e7d32')+C(80,19,2,'#fff')+C(80,105,3,'#3e2723'),lab:[[115,62,'Seed coat','बीजचोल'],[80,66,'Embryo','भ्रूण'],[85,19,'Micropyle','बीजांडद्वार'],[85,105,'Hilum','नाभिका']]},
   {n:['Germination','अंकुरण'],c:['With water and warmth the seed swells and the radicle breaks through the seed coat first.','पानी और गर्मी मिलने पर बीज फूलता है और सबसे पहले मूलांकुर बीजचोल को चीरकर बाहर आता है।'],
    d:()=>base('#6d4c41','#d7ccc8')+E(68,66,13,34,'#aed581')+E(92,66,13,34,'#aed581')+LN(80,36,80,7,7,'#ffe0b2')+C(80,48,3,'#2e7d32'),lab:[[88,8,'Radicle comes out first','मूलांकुर पहले निकलता है'],[115,62,'Seed coat','बीजचोल']]},
   {n:['Seedling','पौध'],c:['The root grows down, then the plumule grows up into a shoot with the first leaves. The cotyledons feed the seedling until it can make its own food.','जड़ नीचे बढ़ती है, फिर प्रांकुर ऊपर बढ़कर पहली पत्तियों वाला प्ररोह बनता है। जब तक पौधा अपना भोजन नहीं बना पाता, बीजपत्र उसे भोजन देते हैं।'],
    d:()=>`<rect x="10" y="58" width="140" height="46" fill="#8d6e63" opacity=".45"/>`+LN(80,58,80,98,4,'#ffe0b2')+LN(80,72,66,84,2,'#ffe0b2')+LN(80,80,94,92,2,'#ffe0b2')+LN(80,58,80,22,3,'#7cb342')+E(68,57,12,5,'#aed581',-8)+E(92,57,12,5,'#aed581',8)+E(71,21,9,4.5,'#43a047',-20)+E(89,21,9,4.5,'#43a047',20),lab:[[98,21,'First leaves','पहली पत्तियाँ'],[104,56,'Cotyledons','बीजपत्र'],[84,92,'Primary root','प्राथमिक जड़']]}];
  function draw(){const hi=PV.lang&&PV.lang()==='hi',x=hi?1:0,s=ST[i];
    const lab=s.lab.map(l=>`<line x1="${l[0]}" y1="${l[1]}" x2="126" y2="${l[1]}" stroke="var(--muted)" stroke-width=".4"/><text x="128" y="${l[1]+2}" font-size="6" fill="var(--fg)">${l[2+x]}</text>`).join('');
    el.innerHTML=`<span class="pv-x" role="button" aria-label="Close">×</span><b>${L('Seed development','बीज का विकास')}</b>
      <input type="range" id="pv-sds" min="0" max="${ST.length-1}" step="1" value="${i}" aria-label="Stage">
      <div class="pv-cap" style="margin-top:4px"><span>${i+1} / ${ST.length}</span><span>${s.n[x]}</span></div>
      <div class="pv-lf"><svg viewBox="0 0 230 110" role="img" aria-label="${s.n[x]}"><g transform="translate(-14 0)">${s.d()}${lab}</g></svg></div>
      <p>${s.c[x]}</p><p class="pv-note">${L('Simplified dicot sketch, not to scale. Monocot seeds have one cotyledon and keep their endosperm.','सरल द्विबीजपत्री रेखाचित्र, पैमाने के अनुसार नहीं। एकबीजपत्री बीजों में एक बीजपत्र होता है और भ्रूणपोष बना रहता है।')}</p>`}
  el.addEventListener('input',e=>{if(e.target.id==='pv-sds'){i=+e.target.value;draw();const s=el.querySelector('#pv-sds');if(s)s.focus()}});
  PV.sim.reg('seeddev',el,draw);
  const name=()=>L('🌱 Seed development','🌱 बीज का विकास');
  PV.after('homeChips',()=>{const b=document.createElement('button'),n=$('#chips');b.className='chip mode';b.dataset.id='__seeddev';b.textContent=name();b.onclick=()=>{i=0;PV.sim.open('seeddev')};n.insertBefore(b,n.firstChild)});
  PV.onLang&&PV.onLang(()=>{const b=document.querySelector('#chips [data-id="__seeddev"]');if(b)b.textContent=name()});
})();




(function(){
  const L=PV.L,KEY='pv_progress';let D={seen:{},quiz:{best:0,total:0,attempts:0,last:0},bm:[]},scene=null;
  try{const j=JSON.parse(localStorage.getItem(KEY)||'null');if(j){D.seen=j.seen||{};D.quiz=Object.assign(D.quiz,j.quiz);D.bm=j.bm||[]}}catch(e){}
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(D))}catch(e){}},
    mark=k=>{if(!D.seen[k]){D.seen[k]=1;save()}},cnt=p=>Object.keys(D.seen).filter(k=>k.indexOf(p)===0).length;
  PV.progress={mark,quiz(score,total){const q=D.quiz;q.last=score;q.total=total;q.attempts++;q.best=Math.max(q.best,score);save()}};
  
  PV.after('selectH',()=>{if(H&&H.sel)mark('p:'+H.sel)});
  PV.after('openScene',id=>{scene=id;mark('sc:'+id)});
  PV.after('pick',()=>{if(sel&&scene)mark('sp:'+scene+':'+sel)});
  const on=(id,ev,f)=>{const e=document.getElementById(id);if(e)e.addEventListener(ev,f)};
  on('pv-tissue','click',e=>{const b=e.target.closest('[data-t]');if(b&&b.dataset.t)mark('t:'+b.dataset.t)});
  on('pv-health','click',e=>{const b=e.target.closest('[data-c]');if(b&&b.dataset.c)mark('h:'+b.dataset.c)});
  on('pv-seeddev','input',e=>{if(e.target.id==='pv-sds')mark('sd:'+e.target.value)});
  
  function star(){const el=document.getElementById('pv-info');if(!el||el.hidden||!H||!H.sel||el.querySelector('.pv-star'))return;
    const b=document.createElement('button');b.className='pv-star';b.dataset.bm=H.sel;b.setAttribute('aria-label','Bookmark');b.textContent=D.bm.indexOf(H.sel)<0?'☆':'★';el.insertBefore(b,el.firstChild)}
  on('pv-info','click',e=>{const b=e.target.closest('.pv-star');if(!b)return;const id=b.dataset.bm,k=D.bm.indexOf(id);if(k<0)D.bm.push(id);else D.bm.splice(k,1);save();b.textContent=k<0?'★':'☆'});
  ['selectH','show'].forEach(f=>PV.after(f,star));PV.onLang&&PV.onLang(star);
  
  const el=PV.ui.addPanel('pv-progress','');
  function build(){
    const hi=PV.lang&&PV.lang()==='hi',x=hi?1:0,pn=id=>PV.name?PV.name(id):id,q=D.quiz,
      R=[['3D plant parts','3D पौधे के भाग',cnt('p:'),Object.keys(PV_INFO).length],['Cross-section scenes','काट वाले दृश्य',cnt('sc:'),Object.keys(SC).length],
         ['Tissue cards','ऊतक कार्ड',cnt('t:'),Object.keys(PV_TISSUE).length+1],['Health cards','स्वास्थ्य कार्ड',cnt('h:'),Object.keys(PV_HEALTH).length],
         ['Water journey steps','पानी की यात्रा के चरण',cnt('tour:'),6],['Seed stages','बीज के चरण',cnt('sd:'),7],['Theory topics','सिद्धांत के विषय',cnt('th:'),PV.theory?PV.theory.count():0]].filter(r=>r[3]),
      all=Math.round(100*R.reduce((s,r)=>s+Math.min(1,r[2]/r[3]),0)/R.length),
      un=Object.keys(PV_INFO).filter(id=>!D.seen['p:'+id]&&H&&H.parts[id]),bm=D.bm.filter(id=>PV_INFO[id]);
    el.innerHTML=`<span class="pv-x" role="button" aria-label="Close">×</span><b>${L('My progress','मेरी प्रगति')}</b>
      <div class="pv-res">${L('Explored','अन्वेषित')}: ${all}%<div class="pv-bar"><i style="width:${all}%"></i></div></div>`
      +R.map(r=>`<div class="pv-res">${r[x]} <span class="pv-cnt">${Math.min(r[2],r[3])}/${r[3]}</span><div class="pv-bar"><i style="width:${Math.round(100*Math.min(1,r[2]/r[3]))}%"></i></div></div>`).join('')
      +`<div class="pv-res">${L('Quiz','क्विज़')}: ${q.attempts?`${L('best','सर्वश्रेष्ठ')} ${q.best}/${q.total} · ${L('last','पिछला')} ${q.last}/${q.total} · ${q.attempts}×`:L('not taken yet','अभी नहीं दिया')}</div>`
      +(un.length?`<p><u>${L('Not yet explored','अभी नहीं देखे')}</u></p><div class="pv-tags">${un.slice(0,12).map(id=>`<button data-p="${id}">${pn(id)}</button>`).join('')}</div>`:'')
      +(bm.length?`<p><u>★ ${L('Bookmarks','बुकमार्क')}</u></p><div class="pv-tags">${bm.map(id=>`<button data-p="${id}">${pn(id)}</button>`).join('')}</div>`:'')
      +`<p class="pv-note">${L('Seeing a part is not the same as understanding it. Use the Quiz to check. Progress is saved on this device only.','किसी भाग को देख लेना उसे समझ लेना नहीं है। जाँच के लिए क्विज़ दें। प्रगति केवल इसी उपकरण पर सहेजी जाती है।')}</p>
      <div class="pv-nav"><button data-reset="1">${L('Reset progress','प्रगति मिटाएँ')}</button></div>`}
  el.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.p){PV.sim.hideAll();PV.selectPart(b.dataset.p)}
    else if(b.dataset.reset&&window.confirm(L('Erase all progress and bookmarks?','सारी प्रगति और बुकमार्क मिटाएँ?'))){D={seen:{},quiz:{best:0,total:0,attempts:0,last:0},bm:[]};save();build()}});
  PV.sim.reg('progress',el,build);
  const name=()=>L('📊 My progress','📊 मेरी प्रगति');
  PV.after('homeChips',()=>{const b=document.createElement('button'),n=$('#chips');b.className='chip mode';b.dataset.id='__progress';b.textContent=name();b.onclick=()=>PV.sim.open('progress');n.insertBefore(b,n.firstChild)});
  PV.onLang&&PV.onLang(()=>{const b=document.querySelector('#chips [data-id="__progress"]');if(b)b.textContent=name()});
})();




(function(){
  const L=PV.L,el=PV.ui.addPanel('pv-theory',''),mods=[];let mi=null,ti=null;
  PV.theory={add:m=>mods.push(m),count:()=>mods.reduce((s,m)=>s+m.t.length,0)};
  const LV=[['d','Definition','परिभाषा'],['s','Structure and identifying features','संरचना व पहचान'],['m','How it works','कार्यविधि'],['t','Types','प्रकार'],['e','Examples','उदाहरण'],['x','Experiment and use','प्रयोग व उपयोग'],['c','Compare and common mistakes','तुलना व आम भ्रांतियाँ']];
  const SCN={'root-cross':['Dicot root','द्विबीजपत्री जड़'],'root-mono':['Monocot root','एकबीजपत्री जड़'],'stem-dicot':['Dicot stem','द्विबीजपत्री तना'],'stem-mono':['Monocot stem','एकबीजपत्री तना'],'leaf-blade':['Dicot leaf','द्विबीजपत्री पत्ती'],'leaf-mono':['Monocot leaf','एकबीजपत्री पत्ती'],'flower-ovary':['Ovary','अंडाशय'],'seed':['Dicot seed','द्विबीजपत्री बीज'],'seed-mono':['Monocot seed','एकबीजपत्री बीज'],'fruit-cross':['Fruit','फल'],'stem-wood':['Woody stem','काष्ठीय तना'],'leaf-stomata':['Stomata','रंध्र'],'anther':['Anther','परागकोश'],'pollen':['Pollen grain','परागकण'],'ovule':['Ovule','बीजांड'],'embryo-sac':['Embryo sac','भ्रूणकोष'],'fertilisation':['Fertilisation','निषेचन'],'plant-cell':['Plant cell','पादप कोशिका']};
  el.innerHTML='<span class="pv-x" role="button" aria-label="Close">×</span><b></b><input id="pv-thq" type="search" autocomplete="off"><div id="pv-thb"></div>';
  const ttl=el.querySelector('b'),q=el.querySelector('#pv-thq'),body=el.querySelector('#pv-thb');
  const nav=a=>`<div class="pv-nav"><button data-a="${a}">◀ ${L('Back','वापस')}</button></div>`;
  function draw(){
    const hi=PV.lang&&PV.lang()==='hi',x=hi?1:0;ttl.textContent=L('Theory','सिद्धांत');q.placeholder=L('Search a topic…','विषय खोजें…');
    if(mi===null){q.hidden=false;const s=q.value.trim().toLowerCase();
      body.innerHTML=s?mods.map((m,a)=>m.t.map((t,b)=>({m,t,a,b}))).reduce((r,v)=>r.concat(v),[]).filter(o=>(o.t.n[0]+' '+o.t.n[1]).toLowerCase().indexOf(s)>=0).map(o=>`<button class="pv-opt" data-m="${o.a}" data-t="${o.b}">${o.t.n[x]} <span class="pv-sci">${o.m.n[x]}</span></button>`).join('')||'<p>—</p>'
        :mods.map((m,a)=>`<button class="pv-opt" data-m="${a}">${m.i} ${m.n[x]} <span class="pv-cnt">${m.t.length}</span></button>`).join('');return}
    q.hidden=true;const m=mods[mi];
    if(ti===null){body.innerHTML=nav('home')+`<b>${m.i} ${m.n[x]}</b>`+m.t.map((t,b)=>`<button class="pv-opt" data-t="${b}">${t.n[x]}</button>`).join('');return}
    const t=m.t[ti];
    body.innerHTML=nav('mod')+`<b>${t.n[x]}</b>`+(t.v?`<div class="pv-lf"><svg viewBox="${t.vb||'0 0 240 110'}" role="img" aria-label="${t.n[x]}">${t.v()}</svg></div>`:'')
      +(t.tb?`<table class="pv-tb"><tr>${t.tb.h.map(h=>`<th>${h[x]}</th>`).join('')}</tr>${t.tb.r.map(r=>`<tr>${r.map((c,k)=>k?`<td>${c[x]}</td>`:`<th>${c[x]}</th>`).join('')}</tr>`).join('')}</table>`:'')
      +LV.filter(l=>t.f&&t.f[l[0]]).map(l=>`<p><u>${hi?l[2]:l[1]}</u><br>${t.f[l[0]][x]}</p>`).join('')
      +(t.sc&&t.sc.length?`<div class="pv-nav">${t.sc.map(k=>`<button data-s="${k}">${L('3D: ','3D: ')}${(SCN[k]||[k,k])[x]} ▸</button>`).join('')}</div>`:'')}
  q.oninput=draw;
  el.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
    if(d.s){openScene(d.s);return}
    if(d.a){if(d.a==='home'){mi=null;ti=null}else ti=null;draw();return}
    if(d.m!==undefined)mi=+d.m;if(d.t!==undefined){ti=+d.t;PV.progress&&PV.progress.mark('th:'+mods[mi].id+':'+mods[mi].t[ti].id)}
    if(d.m!==undefined||d.t!==undefined)draw()});
  PV.sim.reg('theory',el,draw);
  const name=()=>L('📚 Theory','📚 सिद्धांत');
  PV.after('homeChips',()=>{const b=document.createElement('button'),n=$('#chips');b.className='chip mode';b.dataset.id='__theory';b.textContent=name();b.onclick=()=>{mi=null;ti=null;q.value='';PV.sim.open('theory')};n.insertBefore(b,n.firstChild)});
  PV.onLang&&PV.onLang(()=>{const b=document.querySelector('#chips [data-id="__theory"]');if(b)b.textContent=name()});
})();




PV.theory.add({id:'kingdom',i:'🌿',n:['Plant kingdom','पादप जगत'],t:[
{id:'basis',n:['Basis of classification','वर्गीकरण का आधार'],f:{
 d:['Plants are grouped by body organisation, vascular tissue, seeds and the way they reproduce, to show how they are related.','पौधों को शरीर की बनावट, संवहन ऊतक, बीज और जनन के आधार पर समूहों में रखा जाता है ताकि उनके आपसी संबंध दिखें।'],
 t:['Artificial (a few features), natural (many features) and phylogenetic (evolutionary relationships, now often checked with DNA).','कृत्रिम (कुछ लक्षण), प्राकृतिक (अनेक लक्षण) और जातिवृत्तीय (विकासीय संबंध, अब प्रायः DNA से भी जाँचे जाते हैं)।'],
 c:['“Algae” is a convenient teaching group, not one evolutionary group: green algae are close relatives of land plants, while brown and red algae are separate lineages.','“शैवाल” पढ़ाने की सुविधा का समूह है, एक विकासीय समूह नहीं: हरी शैवाल स्थलीय पौधों के निकट संबंधी हैं, जबकि भूरी और लाल शैवाल अलग वंश हैं।']}},
{id:'algae',n:['Algae','शैवाल'],f:{
 d:['Simple, mostly aquatic, chlorophyll-bearing organisms without true roots, stems or leaves.','सरल, अधिकांशतः जलीय, क्लोरोफिल-युक्त जीव जिनमें वास्तविक जड़, तना या पत्ती नहीं होती।'],
 s:['Body is a thallus (single cell, colony, filament or large frond). No vascular tissue. Cell wall is mostly cellulose.','शरीर थैलस होता है (एक कोशिका, कॉलोनी, तंतु या बड़ा पर्ण-जैसा)। संवहन ऊतक नहीं होता। भित्ति प्रायः सेलुलोज़ की।'],
 m:['Reproduce by fragmentation, spores (such as zoospores) or gametes that are equal (isogamous), unequal (anisogamous) or egg and sperm (oogamous).','विखंडन, बीजाणु (जैसे चलबीजाणु) या युग्मकों से जनन; युग्मक समान (isogamous), असमान (anisogamous) या अंड-शुक्राणु (oogamous) हो सकते हैं।'],
 t:['Green (chlorophyll a, b; starch), brown (fucoxanthin; mannitol, laminarin) and red (phycoerythrin).','हरी (क्लोरोफिल a, b; स्टार्च), भूरी (फ्यूकोज़ैन्थिन; मैनिटॉल, लैमिनैरिन) और लाल (फाइकोएरिथ्रिन)।'],
 e:['Green: Chlamydomonas, Spirogyra. Brown: Laminaria, Fucus. Red: Polysiphonia, Porphyra.','हरी: क्लैमाइडोमोनास, स्पाइरोगायरा। भूरी: लैमिनेरिया, फ्यूकस। लाल: पॉलीसाइफ़ोनिया, पोरफ़ाइरा।'],
 x:['Agar comes from red algae (Gelidium, Gracilaria) and algin from brown algae. Chlorella is studied as a food and oxygen source.','अगर लाल शैवाल (जेलिडियम, ग्रेसिलेरिया) से और एल्गिन भूरी शैवाल से मिलता है। क्लोरेला को भोजन व ऑक्सीजन स्रोत के रूप में पढ़ा जाता है।']}},
{id:'bryo',n:['Bryophytes','ब्रायोफाइट'],f:{
 d:['Small non-vascular land plants that need moist places, called the “amphibians” of the plant kingdom.','छोटे असंवहनी स्थलीय पौधे जिन्हें नम स्थान चाहिए; इन्हें पादप जगत के “उभयचर” कहा जाता है।'],
 s:['Body is thallus-like or leafy with root-like rhizoids. The main plant is the haploid gametophyte. The sporophyte (foot, seta, capsule) grows on it and depends on it.','शरीर थैलस-जैसा या पर्णिल, मूलाभास (राइज़ॉइड) सहित। मुख्य पौधा अगुणित युग्मकोद्भिद है। बीजाणुउद्भिद (पाद, सीटा, संपुट) उसी पर उगता और उस पर निर्भर रहता है।'],
 m:['Sperm swim through a film of water to the egg, so fertilisation needs water.','शुक्राणु पानी की परत में तैरकर अंड तक पहुँचते हैं, इसलिए निषेचन के लिए पानी चाहिए।'],
 t:['Liverworts (Marchantia) and mosses (Funaria, Sphagnum).','लिवरवर्ट (मार्केंशिया) और मॉस (फ्यूनेरिया, स्फैग्नम)।'],
 x:['Sphagnum forms peat, used as fuel and in packing. Mosses help start soil formation on bare rock.','स्फैग्नम से पीट बनती है जो ईंधन और पैकिंग में काम आती है। मॉस नंगी चट्टान पर मिट्टी बनाना शुरू करती है।'],
 c:['The bryophyte sporophyte is not a separate plant: it stays attached to the gametophyte.','ब्रायोफाइट का बीजाणुउद्भिद अलग पौधा नहीं है: वह युग्मकोद्भिद से जुड़ा रहता है।']}},
{id:'ptero',n:['Pteridophytes','टेरिडोफाइट'],f:{
 d:['The first land plants with xylem and phloem, but no seeds.','पहले स्थलीय पौधे जिनमें जाइलम और फ्लोएम होते हैं, पर बीज नहीं।'],
 s:['The main plant is a sporophyte with true root, stem and leaves. Spores form in sporangia (often in strobili) and grow into a small, free-living, heart-shaped prothallus (gametophyte).','मुख्य पौधा बीजाणुउद्भिद है जिसमें वास्तविक जड़, तना और पत्तियाँ होती हैं। बीजाणु बीजाणुधानियों (प्रायः स्ट्रोबिलाई) में बनते और छोटे, स्वतंत्र, हृदयाकार प्रोथैलस (युग्मकोद्भिद) में उगते हैं।'],
 m:['Sperm need water to swim to the egg, so fertilisation depends on moisture.','शुक्राणुओं को अंड तक तैरने के लिए पानी चाहिए, इसलिए निषेचन नमी पर निर्भर है।'],
 t:['Homosporous (one kind of spore, as in ferns) and heterosporous (large and small spores, as in Selaginella and Salvinia).','समबीजाणुक (एक प्रकार के बीजाणु, जैसे फर्न) और विषमबीजाणुक (बड़े-छोटे बीजाणु, जैसे सेलाजिनेला, साल्वीनिया)।'],
 e:['Dryopteris, Pteris, Equisetum, Selaginella, Lycopodium.','ड्रायोप्टेरिस, टेरिस, इक्विसेटम, सेलाजिनेला, लाइकोपोडियम।'],
 c:['Unlike bryophytes, the sporophyte is the dominant, independent plant.','ब्रायोफाइट के विपरीत, यहाँ बीजाणुउद्भिद प्रमुख और स्वतंत्र पौधा है।']}},
{id:'gymno',n:['Gymnosperms','जिम्नोस्पर्म (अनावृतबीजी)'],f:{
 d:['Seed plants whose ovules are not enclosed in an ovary, so the seeds are “naked”.','बीजधारी पौधे जिनके बीजांड अंडाशय में बंद नहीं होते, इसलिए बीज “नग्न” होते हैं।'],
 s:['Woody trees or shrubs, often with needle-like leaves. They bear male and female cones, not flowers, and make no fruit. Roots may have fungi (Pinus) or cyanobacteria (Cycas coralloid roots).','काष्ठीय वृक्ष या झाड़ियाँ, प्रायः सुई-जैसी पत्तियाँ। इनमें फूल नहीं, नर व मादा शंकु होते हैं और फल नहीं बनता। जड़ों में कवक (पाइनस) या सायनोबैक्टीरिया (साइकस की प्रवाल-मूल) हो सकते हैं।'],
 m:['Pollen is carried by wind and grows a pollen tube to the ovule, so fertilisation does not need water.','पराग हवा से पहुँचता है और पराग नलिका बीजांड तक बढ़ती है, इसलिए निषेचन के लिए पानी नहीं चाहिए।'],
 e:['Pinus, Cycas, Cedrus, Ginkgo.','पाइनस, साइकस, सीड्रस, जिंगो।'],
 c:['Gymnosperms are heterosporous and the tiny gametophyte stays inside the sporophyte. They have seeds but no fruit.','ये विषमबीजाणुक हैं और छोटा युग्मकोद्भिद बीजाणुउद्भिद के भीतर रहता है। इनमें बीज होते हैं पर फल नहीं।']}},
{id:'angio',n:['Angiosperms','एंजियोस्पर्म (आवृतबीजी)'],f:{
 d:['Flowering plants whose seeds develop inside an ovary that becomes a fruit.','पुष्पीय पौधे जिनके बीज अंडाशय में बनते हैं और अंडाशय फल बन जाता है।'],
 s:['The most varied group, from tiny Wolffia to tall Eucalyptus. Ovules lie in the ovary of the carpel; pollen forms in the anthers.','सबसे विविध समूह, छोटे वुल्फ़िया से ऊँचे यूकेलिप्टस तक। बीजांड कार्पेल के अंडाशय में और पराग परागकोश में बनते हैं।'],
 m:['Double fertilisation: one male gamete fuses with the egg, the other with the polar nuclei, forming the zygote and the endosperm.','दोहरा निषेचन: एक नर युग्मक अंड से और दूसरा ध्रुवीय केंद्रकों से मिलता है; युग्मनज और भ्रूणपोष बनते हैं।'],
 t:['Monocots and eudicots (see the comparison).','एकबीजपत्री और यूडाइकॉट (तुलना देखें)।'],
 e:['Wheat, rice, mango, mustard, sunflower.','गेहूँ, चावल, आम, सरसों, सूरजमुखी।'],
 c:['A fruit is a ripened ovary and seeds come from ovules.','फल पका हुआ अंडाशय है और बीज बीजांड से बनते हैं।']}},
{id:'monodi',n:['Monocot vs eudicot','एकबीजपत्री बनाम द्विबीजपत्री'],sc:['stem-mono','stem-dicot'],
 tb:{h:[['Feature','लक्षण'],['Monocot','एकबीजपत्री'],['Eudicot (dicot)','द्विबीजपत्री']],r:[
  [['Cotyledons','बीजपत्र'],['One','एक'],['Two','दो']],[['Roots','जड़ें'],['Fibrous','झकड़ा'],['Tap root','मूसला']],
  [['Leaf veins','पत्ती की शिराएँ'],['Parallel','समानांतर'],['Net-like (reticulate)','जालिकारूप']],[['Flower parts','पुष्प-भाग'],['In threes','तीन के गुणज'],['In fours or fives','चार या पाँच के गुणज']],
  [['Stem bundles','तने के बंडल'],['Scattered, closed','बिखरे, बंद'],['In a ring, open','वलय में, खुले']],[['Pollen','पराग'],['One pore','एक छिद्र'],['Three pores','तीन छिद्र']]]},
 f:{c:['Exceptions exist: some monocots (such as Dioscorea) have net-like veins. Use several features together.','अपवाद हैं: कुछ एकबीजपत्री (जैसे डायोस्कोरिया) में जालिकारूप शिराएँ होती हैं। कई लक्षण साथ में देखें।']}},
{id:'groups',n:['Group-wise comparison','समूहों की तुलना'],
 tb:{h:[['Group','समूह'],['Vascular tissue','संवहन ऊतक'],['Dominant phase','प्रमुख अवस्था'],['Seeds','बीज']],r:[
  [['Algae','शैवाल'],['No','नहीं'],['Varies','अलग-अलग'],['No','नहीं']],[['Bryophytes','ब्रायोफाइट'],['No','नहीं'],['Gametophyte','युग्मकोद्भिद'],['No','नहीं']],
  [['Pteridophytes','टेरिडोफाइट'],['Yes','हाँ'],['Sporophyte','बीजाणुउद्भिद'],['No','नहीं']],[['Gymnosperms','जिम्नोस्पर्म'],['Yes','हाँ'],['Sporophyte','बीजाणुउद्भिद'],['Naked','नग्न']],
  [['Angiosperms','एंजियोस्पर्म'],['Yes','हाँ'],['Sporophyte','बीजाणुउद्भिद'],['In fruit','फल के भीतर']]]}}
]});




function pvCycle(nodes,edges){
  const L=PV.L,k=nodes.length,W=64,Hh=17,P=nodes.map((n,i)=>{const a=-Math.PI/2+i*2*Math.PI/k;return[120+80*Math.cos(a),55+36*Math.sin(a)]});
  let s='<defs><marker id="pvah" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6z" fill="var(--fg)"/></marker></defs>';
  edges.forEach((e,i)=>{const a=P[i],b=P[(i+1)%k],dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy),ux=dx/d,uy=dy/d,t=Math.min(ux?W/2/Math.abs(ux):1e9,uy?Hh/2/Math.abs(uy):1e9)+2,mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;
    s+=`<line x1="${a[0]+ux*t}" y1="${a[1]+uy*t}" x2="${b[0]-ux*t}" y2="${b[1]-uy*t}" stroke="var(--fg)" stroke-width="1" marker-end="url(#pvah)"/><text x="${mx-uy*9}" y="${my+ux*9+2}" font-size="5.5" text-anchor="middle" fill="var(--muted)" font-style="italic">${L(e[0],e[1])}</text>`});
  nodes.forEach((n,i)=>{s+=`<rect x="${P[i][0]-W/2}" y="${P[i][1]-Hh/2}" width="${W}" height="${Hh}" rx="5" fill="${n[2]==='n'?'#aed581':n[2]==='2n'?'#ce93d8':'#90caf9'}" stroke="var(--fg)" stroke-width=".6"/><text x="${P[i][0]}" y="${P[i][1]+2.2}" font-size="6.3" text-anchor="middle" fill="#1b1b1b">${L(n[0],n[1])}</text>`});
  return s+(nodes.some(n=>n[2]==='n'||n[2]==='2n')?`<text x="6" y="106" font-size="5.5" fill="var(--muted)">${L('green = haploid (n), purple = diploid (2n)','हरा = अगुणित (n), बैंगनी = द्विगुणित (2n)')}</text>`:'')}
PV.theory.add({id:'lifecycle',i:'♻️',n:['Life cycles','जीवन-चक्र'],t:[
{id:'altgen',n:['Alternation of generations','पीढ़ी-एकांतरण'],v:()=>pvCycle([['Sporophyte (2n)','बीजाणुउद्भिद (2n)','2n'],['Spores (n)','बीजाणु (n)','n'],['Gametophyte (n)','युग्मकोद्भिद (n)','n'],['Gametes (n)','युग्मक (n)','n'],['Zygote (2n)','युग्मनज (2n)','2n']],[['meiosis','अर्धसूत्रण'],['germination','अंकुरण'],['mitosis','समसूत्रण'],['fusion','संलयन'],['mitosis, growth','समसूत्रण, वृद्धि']]),f:{
 d:['Many plants have two multicellular phases: a haploid (n) gametophyte that makes gametes, and a diploid (2n) sporophyte that makes spores.','कई पौधों में दो बहुकोशिकीय अवस्थाएँ होती हैं: अगुणित (n) युग्मकोद्भिद जो युग्मक बनाता है और द्विगुणित (2n) बीजाणुउद्भिद जो बीजाणु बनाता है।'],
 m:['Gametes fuse to form a zygote (2n) that grows into the sporophyte. Meiosis in the sporangia gives spores (n) that grow into the gametophyte.','युग्मक मिलकर युग्मनज (2n) बनाते हैं जो बीजाणुउद्भिद में बढ़ता है। बीजाणुधानियों में अर्धसूत्रण से बीजाणु (n) बनते हैं जो युग्मकोद्भिद में बढ़ते हैं।'],
 c:['In plants meiosis makes spores, not gametes (unlike animals). Gametes come from mitosis of a cell that is already haploid.','पौधों में अर्धसूत्रण से बीजाणु बनते हैं, युग्मक नहीं (जंतुओं से अलग)। युग्मक पहले से अगुणित कोशिका के समसूत्रण से बनते हैं।']}},
{id:'haplontic',n:['Haplontic pattern','अगुणितक (हैप्लोन्टिक) चक्र'],v:()=>pvCycle([['Adult body (n)','वयस्क शरीर (n)','n'],['Gametes (n)','युग्मक (n)','n'],['Zygote (2n)','युग्मनज (2n)','2n'],['Spores (n)','बीजाणु (n)','n']],[['mitosis','समसूत्रण'],['fusion','संलयन'],['meiosis','अर्धसूत्रण'],['germination','अंकुरण']]),f:{
 d:['The main body is haploid. Only the zygote is diploid, and it undergoes meiosis at once (zygotic meiosis).','मुख्य शरीर अगुणित होता है। केवल युग्मनज द्विगुणित है और वह तुरंत अर्धसूत्रण करता है (युग्मनज अर्धसूत्रण)।'],
 e:['Volvox, Spirogyra, Chlamydomonas.','वॉल्वॉक्स, स्पाइरोगायरा, क्लैमाइडोमोनास।']}},
{id:'diplontic',n:['Diplontic pattern','द्विगुणितक (डिप्लोन्टिक) चक्र'],v:()=>pvCycle([['Adult body (2n)','वयस्क शरीर (2n)','2n'],['Gametes (n)','युग्मक (n)','n'],['Zygote (2n)','युग्मनज (2n)','2n']],[['meiosis','अर्धसूत्रण'],['fusion','संलयन'],['mitosis, growth','समसूत्रण, वृद्धि']]),f:{
 d:['The main body is diploid. Only the gametes are haploid, made by meiosis (gametic meiosis).','मुख्य शरीर द्विगुणित होता है। केवल युग्मक अगुणित हैं, जो अर्धसूत्रण से बनते हैं (युग्मक अर्धसूत्रण)।'],
 e:['The brown alga Fucus; in NCERT’s scheme, gymnosperms and angiosperms.','भूरी शैवाल फ्यूकस; NCERT की योजना में अनावृतबीजी और आवृतबीजी।'],
 c:['Seed plants still alternate generations, but the gametophyte is microscopic and lives inside the sporophyte, so they are treated as diplontic.','बीजधारी पौधों में भी पीढ़ी-एकांतरण होता है, पर युग्मकोद्भिद सूक्ष्म होकर बीजाणुउद्भिद के भीतर रहता है, इसलिए उन्हें द्विगुणितक माना जाता है।']}},
{id:'haplodiplontic',n:['Haplodiplontic pattern','अगुणित-द्विगुणितक चक्र'],v:()=>pvCycle([['Sporophyte (2n)','बीजाणुउद्भिद (2n)','2n'],['Spores (n)','बीजाणु (n)','n'],['Gametophyte (n)','युग्मकोद्भिद (n)','n'],['Gametes (n)','युग्मक (n)','n'],['Zygote (2n)','युग्मनज (2n)','2n']],[['meiosis','अर्धसूत्रण'],['germination','अंकुरण'],['mitosis','समसूत्रण'],['fusion','संलयन'],['mitosis, growth','समसूत्रण, वृद्धि']]),f:{
 d:['Both the haploid and the diploid phase are multicellular (sporic meiosis).','अगुणित और द्विगुणित दोनों अवस्थाएँ बहुकोशिकीय होती हैं (बीजाणु अर्धसूत्रण)।'],
 t:['Bryophytes: gametophyte dominant. Pteridophytes: sporophyte dominant.','ब्रायोफाइट: युग्मकोद्भिद प्रमुख। टेरिडोफाइट: बीजाणुउद्भिद प्रमुख।'],
 e:['Funaria (moss), ferns, and the kelp Laminaria.','फ्यूनेरिया (मॉस), फर्न और केल्प लैमिनेरिया।']}},
{id:'grp',n:['Gametophyte and sporophyte by group','समूह-वार युग्मकोद्भिद व बीजाणुउद्भिद'],
 tb:{h:[['Group','समूह'],['Gametophyte','युग्मकोद्भिद'],['Sporophyte','बीजाणुउद्भिद']],r:[
  [['Bryophytes','ब्रायोफाइट'],['Main, free-living, green','मुख्य, स्वतंत्र, हरा'],['Small, attached to gametophyte','छोटा, युग्मकोद्भिद से जुड़ा']],
  [['Pteridophytes','टेरिडोफाइट'],['Small, free-living prothallus','छोटा, स्वतंत्र प्रोथैलस'],['Main, independent','मुख्य, स्वतंत्र']],
  [['Gymnosperms','जिम्नोस्पर्म'],['Microscopic, inside cone and ovule','सूक्ष्म, शंकु व बीजांड के भीतर'],['Main, independent','मुख्य, स्वतंत्र']],
  [['Angiosperms','एंजियोस्पर्म'],['Pollen grain and embryo sac','परागकण व भ्रूणकोष'],['Main, independent','मुख्य, स्वतंत्र']]]}}
]});




PV.theory.add({id:'morph',i:'🌱',n:['Root, stem and leaf','जड़, तना और पत्ती'],t:[
{id:'roots',n:['Tap, fibrous and adventitious roots','मूसला, झकड़ा और अपस्थानिक जड़ें'],sc:['root-cross','root-mono'],f:{
 d:['Tap root: the primary root (from the radicle) stays and branches. Fibrous: the primary root dies early and many similar roots grow from the stem base. Adventitious: roots that arise from parts other than the radicle.','मूसला जड़: प्राथमिक जड़ (मूलांकुर से) बनी रहती और शाखित होती है। झकड़ा: प्राथमिक जड़ जल्दी नष्ट हो जाती है और तने के आधार से अनेक समान जड़ें निकलती हैं। अपस्थानिक: मूलांकुर के अलावा अन्य भागों से निकली जड़ें।'],
 e:['Tap: mustard, gram, mango. Fibrous: wheat, rice, grass. Adventitious: banyan prop roots, Monstera, maize stilt roots.','मूसला: सरसों, चना, आम। झकड़ा: गेहूँ, चावल, घास। अपस्थानिक: बरगद की प्रोप जड़ें, मॉन्सटेरा, मक्का की स्टिल्ट जड़ें।'],
 c:['In monocots the “fibrous” roots are really adventitious, because the radicle dies early.','एकबीजपत्री में “झकड़ा” जड़ें वास्तव में अपस्थानिक होती हैं, क्योंकि मूलांकुर जल्दी नष्ट हो जाता है।']}},
{id:'rstore',n:['Storage roots','भंडारण जड़ें'],f:{
 d:['Roots swollen with stored food.','भोजन जमा होने से फूली हुई जड़ें।'],
 t:['Tap-root types: conical (carrot), fusiform (radish), napiform (turnip). Adventitious: sweet potato.','मूसला प्रकार: शंक्वाकार (गाजर), तर्कुरूप (मूली), कुंभीरूप (शलजम)। अपस्थानिक: शकरकंद।'],
 c:['Sweet potato is a root, but potato is a stem (tuber).','शकरकंद जड़ है, पर आलू तना (कंद) है।']}},
{id:'rsupport',n:['Prop and stilt roots','प्रोप और स्टिल्ट जड़ें'],f:{
 d:['Adventitious roots that support the plant.','पौधे को सहारा देने वाली अपस्थानिक जड़ें।'],
 t:['Prop roots hang from branches and thicken into pillars (banyan). Stilt roots slant from the lower nodes of the stem (maize, sugarcane, screwpine).','प्रोप जड़ें शाखाओं से लटकती और खंभे जैसी मोटी हो जाती हैं (बरगद)। स्टिल्ट जड़ें तने के निचले पर्वों से तिरछी निकलती हैं (मक्का, गन्ना, केवड़ा)।'],
 c:['Prop roots come from branches; stilt roots come from the stem near the base.','प्रोप जड़ें शाखाओं से और स्टिल्ट जड़ें तने के आधार के पास से निकलती हैं।']}},
{id:'pneumato',n:['Pneumatophores','श्वसन मूल (न्यूमैटोफोर)'],f:{
 d:['Vertical roots that grow up out of waterlogged mud and help gas exchange.','जलभराव वाले कीचड़ से ऊपर निकलने वाली सीधी जड़ें जो गैस-विनिमय में मदद करती हैं।'],
 s:['They have pores that let air enter, since mud has little oxygen.','इनमें छिद्र होते हैं जिनसे हवा भीतर जाती है, क्योंकि कीचड़ में ऑक्सीजन कम होती है।'],
 e:['Mangroves such as Rhizophora and Avicennia.','मैंग्रोव जैसे राइज़ोफोरा और एविसेनिया।']}},
{id:'haustorial',n:['Haustorial roots','चूषक जड़ें (हॉस्टोरियम)'],f:{
 d:['Roots of parasitic plants that enter the host and absorb food and water.','परजीवी पौधों की जड़ें जो पोषक पौधे में घुसकर भोजन और पानी सोखती हैं।'],
 e:['Cuscuta (dodder) and Viscum (mistletoe).','कस्कुटा (अमरबेल) और विस्कम (बाँदा)।'],
 c:['Cuscuta has no chlorophyll, but Viscum does and takes mainly water and minerals.','कस्कुटा में क्लोरोफिल नहीं होता, पर विस्कम में होता है और वह मुख्यतः पानी व खनिज लेता है।']}},
{id:'nodules',n:['Root nodules','मूल ग्रंथियाँ (नॉड्यूल)'],f:{
 d:['Swellings on legume roots that house Rhizobium bacteria.','दलहनी पौधों की जड़ों पर गाँठें जिनमें राइज़ोबियम जीवाणु रहते हैं।'],
 m:['The bacterial enzyme nitrogenase turns atmospheric nitrogen into ammonia, in a low-oxygen setting kept by leghaemoglobin. The plant gives the bacteria sugars.','जीवाणु का एंज़ाइम नाइट्रोजिनेज़ वायुमंडलीय नाइट्रोजन को अमोनिया में बदलता है, लेगहीमोग्लोबिन से बने कम-ऑक्सीजन वातावरण में। पौधा जीवाणुओं को शर्करा देता है।'],
 e:['Pea, bean, gram, groundnut.','मटर, सेम, चना, मूँगफली।'],
 x:['Legumes in crop rotation add nitrogen to the soil.','फसल-चक्र में दलहन मिट्टी में नाइट्रोजन बढ़ाते हैं।'],
 c:['Plants cannot fix nitrogen themselves; the bacteria do it (mutualism).','पौधे स्वयं नाइट्रोजन स्थिर नहीं कर सकते; यह काम जीवाणु करते हैं (सहजीवन)।']}},
{id:'ustem',n:['Underground stems','भूमिगत तने'],
 tb:{h:[['Type','प्रकार'],['Examples','उदाहरण'],['Key feature','मुख्य लक्षण']],r:[
  [['Rhizome','प्रकंद'],['Ginger, turmeric','अदरक, हल्दी'],['Thick horizontal stem with nodes, scale leaves and buds','मोटा क्षैतिज तना; पर्व, शल्कपत्र और कलियाँ'],],
  [['Tuber','कंद'],['Potato','आलू'],['Swollen stem tip; “eyes” are axillary buds','फूला तना-सिरा; “आँखें” कक्षीय कलियाँ हैं']],
  [['Bulb','शल्क कंद'],['Onion, garlic','प्याज, लहसुन'],['Tiny disc-like stem with fleshy scale leaves','छोटा चक्रिका-जैसा तना; मांसल शल्कपत्र']],
  [['Corm','घनकंद'],['Colocasia, Gladiolus','अरबी, ग्लैडियोलस'],['Short, thick, upright stem with scale leaves','छोटा, मोटा, ऊर्ध्व तना; शल्कपत्र सहित']]]},
 f:{x:['They store food and let the plant spread by vegetative propagation from buds.','ये भोजन जमा करते हैं और कलियों से वानस्पतिक प्रवर्धन द्वारा पौधे को फैलाते हैं।'],
    c:['All four are stems, not roots, because they have nodes, buds and scale leaves.','चारों तने हैं, जड़ें नहीं, क्योंकि इनमें पर्व, कलियाँ और शल्कपत्र होते हैं।']}},
{id:'sstem',n:['Sub-aerial stems','अर्ध-वायवीय तने'],f:{
 d:['Weak stems that lie on or near the ground and give new plants at their nodes.','कमज़ोर तने जो भूमि पर या पास पड़े रहते हैं और पर्वों पर नए पौधे बनाते हैं।'],
 t:['Runner (grass, Oxalis), stolon (mint, jasmine), offset (water hyacinth, Pistia) and sucker (banana, pineapple, chrysanthemum).','धावक (घास, ऑक्सेलिस), भूस्तारी (पुदीना, चमेली), भूस्तारिका/ऑफसेट (जलकुंभी, पिस्टिया) और अंतःभूस्तारी (केला, अनानास, गुलदाउदी)।'],
 x:['Used in vegetative propagation.','वानस्पतिक प्रवर्धन में उपयोगी।']}},
{id:'astem',n:['Aerial stem modifications','वायवीय तनों के रूपांतरण'],f:{
 t:['Tendrils (cucumber, grape): coiled, for climbing. Thorns (Citrus, Bougainvillea): hard and pointed, for protection. Phylloclade (Opuntia, Euphorbia): flat or fleshy green stem that makes food and stores water.','प्रतान (खीरा, अंगूर): कुंडलित, चढ़ने के लिए। काँटे (नींबू, बोगनविलिया): कठोर, नुकीले, सुरक्षा के लिए। पर्णाभ स्तंभ (नागफनी, यूफॉर्बिया): चपटा या मांसल हरा तना जो भोजन बनाता और पानी जमा करता है।'],
 c:['Thorns are stems (from axillary buds). The prickles of a rose are only outgrowths of the surface.','काँटे तने हैं (कक्षीय कलियों से)। गुलाब के शूल केवल सतह की वृद्धियाँ हैं।']}},
{id:'tendril',n:['Stem tendril vs leaf tendril','तना प्रतान बनाम पर्ण प्रतान'],
 tb:{h:[['Feature','लक्षण'],['Stem tendril','तना प्रतान'],['Leaf tendril','पर्ण प्रतान']],r:[
  [['Arises from','उत्पत्ति'],['Axillary bud','कक्षीय कली'],['Leaf or leaflets','पत्ती या पर्णक']],[['Examples','उदाहरण'],['Cucumber, pumpkin, grape','खीरा, कद्दू, अंगूर'],['Pea, Lathyrus','मटर, लैथाइरस']]]},
 f:{c:['If the tendril sits in a leaf axil it is a stem tendril; if it replaces leaflets it is a leaf tendril.','यदि प्रतान पत्ती के कक्ष में है तो तना प्रतान; यदि वह पर्णकों की जगह है तो पर्ण प्रतान।']}},
{id:'leafsc',n:['Simple and compound leaves','सरल और संयुक्त पत्तियाँ'],sc:['leaf-blade'],f:{
 d:['A simple leaf has one undivided lamina. A compound leaf has a lamina cut into leaflets.','सरल पत्ती में एक अविभाजित फलक होता है। संयुक्त पत्ती का फलक पर्णकों में बँटा होता है।'],
 t:['Pinnately compound: leaflets along a rachis (neem, rose). Palmately compound: leaflets from one point (silk cotton).','पिच्छाकार संयुक्त: रेकिस पर पर्णक (नीम, गुलाब)। हस्ताकार संयुक्त: एक बिंदु से पर्णक (सेमल)।'],
 c:['A bud sits in the axil of the whole leaf, never at the base of a leaflet. This tells a leaflet from a leaf.','कली पूरी पत्ती के कक्ष में होती है, पर्णक के आधार पर कभी नहीं। इससे पर्णक और पत्ती का अंतर पता चलता है।']}},
{id:'phyllo',n:['Phyllotaxy','पर्णविन्यास'],f:{
 d:['The pattern in which leaves are arranged on the stem.','तने पर पत्तियों के लगने का क्रम।'],
 t:['Alternate: one leaf per node (China rose, mustard, sunflower). Opposite: two per node (Calotropis, guava). Whorled: more than two (Alstonia).','एकांतर: प्रति पर्व एक पत्ती (गुड़हल, सरसों, सूरजमुखी)। सम्मुख: दो पत्तियाँ (आक, अमरूद)। चक्रिक: दो से अधिक (सप्तपर्णी)।'],
 x:['Arrangement reduces shading so more leaves get light.','यह क्रम छाया घटाता है ताकि अधिक पत्तियों को प्रकाश मिले।']}},
{id:'venation',n:['Venation','शिराविन्यास'],sc:['leaf-blade','leaf-mono'],f:{
 d:['The pattern of veins in the lamina.','फलक में शिराओं का क्रम।'],
 t:['Reticulate (net-like, usually dicots) and parallel (usually monocots).','जालिकारूप (प्रायः द्विबीजपत्री) और समानांतर (प्रायः एकबीजपत्री)।'],
 e:['Reticulate: peepal, hibiscus. Parallel: wheat, banana, grass.','जालिकारूप: पीपल, गुड़हल। समानांतर: गेहूँ, केला, घास।'],
 c:['It is a good clue, not a rule: yam (Dioscorea) is a monocot with net-like veins.','यह अच्छा संकेत है, नियम नहीं: रतालू (डायोस्कोरिया) एकबीजपत्री है पर उसमें जालिकारूप शिराएँ हैं।']}},
{id:'leafmod',n:['Leaf modifications','पत्ती के रूपांतरण'],f:{
 t:['Tendrils (pea) for climbing. Spines (Opuntia) for protection and less water loss. Fleshy leaves (onion, garlic) for storage. Pitcher or bladder (Nepenthes, Utricularia) to trap insects.','प्रतान (मटर) चढ़ने के लिए। काँटे (नागफनी) सुरक्षा और कम जल-हानि के लिए। मांसल पत्तियाँ (प्याज, लहसुन) भंडारण के लिए। घट या थैली (नेपेंथीज़, यूट्रिकुलेरिया) कीट पकड़ने के लिए।'],
 c:['Leaf spines and stem thorns differ: a thorn has a bud at its base, a leaf spine does not.','पत्ती के काँटे और तने के काँटे अलग हैं: तने के काँटे के आधार पर कली होती है।']}},
{id:'phyllode',n:['Phyllode vs phylloclade','पर्णाभवृंत बनाम पर्णाभ स्तंभ'],
 tb:{h:[['Feature','लक्षण'],['Phyllode','पर्णाभवृंत'],['Phylloclade','पर्णाभ स्तंभ']],r:[
  [['Modified part','रूपांतरित भाग'],['Petiole or rachis','वृंत या रेकिस'],['Stem','तना']],[['Looks like','दिखता है'],['A flat leaf blade','चपटा पत्ती-फलक'],['Flat or fleshy green stem','चपटा या मांसल हरा तना']],[['Example','उदाहरण'],['Acacia auriculiformis','अकेशिया ऑरिकुलिफॉर्मिस'],['Opuntia, Ruscus','नागफनी, रस्कस']]]},
 f:{c:['Both do photosynthesis in place of normal leaves, but one is a leaf part and the other a stem.','दोनों सामान्य पत्तियों की जगह प्रकाश-संश्लेषण करते हैं, पर एक पत्ती का भाग है और दूसरा तना।']}},
{id:'heterophylly',n:['Heterophylly','विषमपर्णता'],f:{
 d:['Leaves of different shapes on the same plant.','एक ही पौधे पर अलग-अलग आकार की पत्तियाँ।'],
 e:['Coriander (broad lower leaves, finely cut upper leaves); buttercup Ranunculus aquatilis (cut submerged leaves, broad floating leaves).','धनिया (नीचे चौड़ी, ऊपर कटी पत्तियाँ); जलीय बटरकप (डूबी पत्तियाँ कटी, तैरती चौड़ी)।'],
 x:['Cut submerged leaves meet less water resistance and take in gases easily.','डूबी कटी पत्तियाँ पानी का कम प्रतिरोध झेलती हैं और गैसें आसानी से लेती हैं।']}}
]});




function pvPlac(){const L=PV.L,S='stroke="var(--fg)" stroke-width="1" fill="#f1f8e9"',D=(x,y)=>`<circle cx="${x}" cy="${y}" r="2.4" fill="#7cb342" stroke="#33691e" stroke-width=".5"/>`;let s='';
  const G=[
   x=>`<ellipse cx="${x}" cy="28" rx="13" ry="20" ${S}/>`+[14,24,34,44].map(y=>D(x+9,y-8)).join(''),
   x=>`<circle cx="${x}" cy="28" r="20" ${S}/>`+[90,210,330].map(a=>`<line x1="${x}" y1="28" x2="${x+20*Math.cos(a*Math.PI/180)}" y2="${28-20*Math.sin(a*Math.PI/180)}" stroke="var(--fg)" stroke-width=".8"/>`+D(x+8*Math.cos((a+60)*Math.PI/180),28-8*Math.sin((a+60)*Math.PI/180))).join(''),
   x=>`<circle cx="${x}" cy="28" r="20" ${S}/>`+[30,150,270].map(a=>D(x+16*Math.cos(a*Math.PI/180),28-16*Math.sin(a*Math.PI/180))).join(''),
   x=>`<circle cx="${x}" cy="28" r="20" ${S}/><circle cx="${x}" cy="28" r="5" fill="#dcedc8" stroke="var(--fg)" stroke-width=".6"/>`+[0,90,180,270].map(a=>D(x+5*Math.cos(a*Math.PI/180),28-5*Math.sin(a*Math.PI/180))).join(''),
   x=>`<ellipse cx="${x}" cy="28" rx="13" ry="20" ${S}/>`+D(x,44)];
  const N=[['Marginal','सीमांत'],['Axile','स्तंभीय'],['Parietal','भित्तीय'],['Free central','मुक्त स्तंभीय'],['Basal','आधारी']];
  G.forEach((f,i)=>{const x=25+i*48;s+=f(x)+`<text x="${x}" y="58" font-size="6" text-anchor="middle" fill="var(--fg)">${L(N[i][0],N[i][1])}</text>`});return s}
PV.theory.add({id:'flower',i:'🌸',n:['Flower, fruit and seed','पुष्प, फल और बीज'],t:[
{id:'complete',n:['Complete or incomplete, bisexual or unisexual','पूर्ण/अपूर्ण, उभयलिंगी/एकलिंगी'],f:{
 d:['A complete flower has all four whorls: sepals, petals, stamens and carpels. An incomplete flower lacks one or more. A bisexual flower has both stamens and carpels; a unisexual flower has only one kind.','पूर्ण पुष्प में चारों चक्र होते हैं: बाह्यदल, दल, पुंकेसर और अंडप। अपूर्ण में एक या अधिक नहीं होते। उभयलिंगी पुष्प में पुंकेसर और अंडप दोनों होते हैं; एकलिंगी में केवल एक।'],
 e:['Mustard and hibiscus: complete and bisexual. Cucumber, papaya, maize: unisexual.','सरसों और गुड़हल: पूर्ण व उभयलिंगी। खीरा, पपीता, मक्का: एकलिंगी।'],
 c:['“Complete” is about the four whorls; “bisexual” is about the reproductive parts. A flower can be bisexual yet incomplete.','“पूर्ण” चारों चक्रों की बात है; “उभयलिंगी” जनन-अंगों की। पुष्प उभयलिंगी होकर भी अपूर्ण हो सकता है।']}},
{id:'symmetry',n:['Symmetry of flowers','पुष्प की सममिति'],f:{
 t:['Actinomorphic: can be cut into equal halves in many planes (mustard, datura, chilli). Zygomorphic: only one plane (pea, gulmohar, bean). Asymmetric: no plane (canna).','त्रिज्यासममित: कई तलों में बराबर भागों में बँटता है (सरसों, धतूरा, मिर्च)। एकव्याससममित: केवल एक तल में (मटर, गुलमोहर, सेम)। असममित: किसी तल में नहीं (कैना)।']}},
{id:'ovarypos',n:['Position of the ovary','अंडाशय की स्थिति'],f:{
 t:['Hypogynous: ovary superior, other parts below it (mustard, China rose, brinjal). Perigynous: ovary at the same level as the other parts on the rim (plum, rose, peach). Epigynous: ovary inferior, other parts above it (guava, cucumber, sunflower ray florets).','अधोजायांगी: अंडाशय ऊपर, अन्य भाग नीचे (सरसों, गुड़हल, बैंगन)। परिजायांगी: अंडाशय और अन्य भाग एक ही स्तर पर किनारे पर (आलूबुखारा, गुलाब, आड़ू)। उपरिजायांगी: अंडाशय नीचे, अन्य भाग ऊपर (अमरूद, खीरा, सूरजमुखी के रे-पुष्प)।'],
 c:['Superior ovary goes with hypogynous flowers; inferior ovary goes with epigynous flowers.','ऊर्ध्वस्थ अंडाशय अधोजायांगी पुष्प में और अधःस्थ अंडाशय उपरिजायांगी पुष्प में होता है।']}},
{id:'aestiv',n:['Aestivation','पुष्पदल विन्यास'],f:{
 d:['The arrangement of sepals or petals in the bud.','कली में बाह्यदलों या दलों के लगने का क्रम।'],
 t:['Valvate: edges touch without overlap (Calotropis). Twisted: each overlaps the next (China rose, cotton). Imbricate: irregular overlap (Cassia, gulmohar). Vexillary: large standard petal over two wings, which cover the keel (pea).','कोरस्पर्शी: किनारे छूते हैं, ढकते नहीं (आक)। व्यावर्तित: प्रत्येक अगले को ढकता है (गुड़हल, कपास)। अधिच्छादी: अनियमित ढकाव (कैसिया, गुलमोहर)। ध्वजाकार: बड़ी ध्वज पंखुड़ी दो पक्षों को ढकती है, जो नौतल को ढकते हैं (मटर)।']}},
{id:'placent',n:['Placentation','बीजांडन्यास'],vb:'0 0 245 64',v:pvPlac,sc:['flower-ovary'],f:{
 d:['The arrangement of ovules inside the ovary.','अंडाशय के भीतर बीजांडों के लगने का क्रम।'],
 t:['Marginal (pea), axile (China rose, tomato, lemon), parietal (mustard, Argemone), free central (Dianthus, primrose) and basal (sunflower, marigold).','सीमांत (मटर), स्तंभीय (गुड़हल, टमाटर, नींबू), भित्तीय (सरसों, सत्यानाशी), मुक्त स्तंभीय (डायएन्थस, प्रिमरोज़) और आधारी (सूरजमुखी, गेंदा)।'],
 c:['Marginal needs a single carpel; axile has several chambers (locules) with ovules on a central axis.','सीमांत में एक अंडप होता है; स्तंभीय में कई कक्ष होते हैं और बीजांड केंद्रीय अक्ष पर लगते हैं।']}},
{id:'inflo',n:['Inflorescence','पुष्पक्रम'],f:{
 d:['The arrangement of flowers on the floral axis.','पुष्प-अक्ष पर फूलों के लगने का क्रम।'],
 t:['Racemose: the main axis keeps growing and the youngest flowers are near the tip (mustard, radish). Cymose: the main axis ends in a flower and the youngest flowers are near the base (jasmine, Calotropis, Bougainvillea). Special types: cyathium (Euphorbia), verticillaster (tulsi), hypanthodium (fig).','असीमाक्षी: मुख्य अक्ष बढ़ता रहता है और सबसे नए फूल सिरे के पास होते हैं (सरसों, मूली)। ससीमाक्षी: मुख्य अक्ष फूल में समाप्त होता है और सबसे नए फूल आधार के पास होते हैं (चमेली, आक, बोगनविलिया)। विशेष: साइएथियम (यूफॉर्बिया), कूटचक्रक (तुलसी), हाइपेन्थोडियम (अंजीर)।']}},
{id:'floralformula',n:['Floral formula','पुष्प सूत्र'],f:{
 d:['A short code that shows the parts and symmetry of a flower.','फूल के भागों और सममिति को दिखाने वाला संक्षिप्त संकेत।'],
 s:['⊕ actinomorphic, % zygomorphic, ⚥ bisexual. K calyx, C corolla, A androecium, G gynoecium. A number gives how many; brackets mean fused parts; “+” separates whorls. G with a line below means superior ovary, a line above means inferior.','⊕ त्रिज्यासममित, % एकव्याससममित, ⚥ उभयलिंगी। K बाह्यदलपुंज, C दलपुंज, A पुमंग, G जायांग। संख्या कितने भाग बताती है; कोष्ठक = जुड़े भाग; “+” चक्रों को अलग करता है। G के नीचे रेखा = ऊर्ध्वस्थ अंडाशय, ऊपर रेखा = अधःस्थ।'],
 e:['Mustard: ⊕ ⚥ K2+2 C4 A2+4 G(2). Pea: % ⚥ K(5) C1+2+(2) A(9)+1 G1.','सरसों: ⊕ ⚥ K2+2 C4 A2+4 G(2)। मटर: % ⚥ K(5) C1+2+(2) A(9)+1 G1।'],
 c:['The formula describes one typical flower of the species; individual flowers can vary.','सूत्र प्रजाति के एक सामान्य फूल का वर्णन है; अलग-अलग फूल थोड़े भिन्न हो सकते हैं।']}},
{id:'truefalse',n:['True and false fruits','सत्य और असत्य फल'],sc:['fruit-cross'],f:{
 d:['A true fruit develops only from the ovary. A false fruit also includes other parts of the flower.','सत्य फल केवल अंडाशय से बनता है। असत्य फल में फूल के अन्य भाग भी जुड़ जाते हैं।'],
 e:['True: mango, tomato, pea pod. False: apple and pear (thalamus), strawberry (thalamus).','सत्य: आम, टमाटर, मटर की फली। असत्य: सेब और नाशपाती (पुष्पासन), स्ट्रॉबेरी (पुष्पासन)।']}},
{id:'fruittypes',n:['Simple, aggregate and multiple fruits','सरल, पुंजित और संग्रथित फल'],f:{
 t:['Simple: from one ovary (mango, pea pod). Aggregate: from many free carpels of one flower (strawberry, custard apple). Multiple: from the whole inflorescence (pineapple, jackfruit, mulberry).','सरल: एक अंडाशय से (आम, मटर की फली)। पुंजित: एक फूल के कई मुक्त अंडपों से (स्ट्रॉबेरी, शरीफ़ा)। संग्रथित: पूरे पुष्पक्रम से (अनानास, कटहल, शहतूत)।'],
 c:['Count flowers and carpels: one flower with many carpels gives aggregate; many flowers give multiple.','फूलों और अंडपों को गिनें: एक फूल के कई अंडप = पुंजित; कई फूल = संग्रथित।']}},
{id:'partheno',n:['Parthenocarpy','अनिषेकफलन'],f:{
 d:['Fruit forms without fertilisation, so it is usually seedless.','निषेचन के बिना फल बनता है, इसलिए प्रायः बीज-रहित होता है।'],
 e:['Banana, seedless grapes.','केला, बीज-रहित अंगूर।'],
 x:['It can be induced by spraying auxins or gibberellins on flowers.','फूलों पर ऑक्सिन या जिबरेलिन छिड़ककर इसे प्रेरित किया जा सकता है।'],
 c:['Parthenocarpy gives a fruit without seeds; apomixis gives seeds without fertilisation.','अनिषेकफलन में बिना बीज का फल बनता है; अनिषेकबीजता (एपोमिक्सिस) में बिना निषेचन बीज बनते हैं।']}},
{id:'albumin',n:['Albuminous and exalbuminous seeds','भ्रूणपोषी और अभ्रूणपोषी बीज'],sc:['seed','seed-mono'],f:{
 d:['Albuminous seeds keep endosperm at maturity. In exalbuminous seeds the endosperm is used up and food is stored in the cotyledons.','भ्रूणपोषी बीजों में परिपक्व होने पर भ्रूणपोष बना रहता है। अभ्रूणपोषी बीजों में भ्रूणपोष खप जाता है और भोजन बीजपत्रों में जमा होता है।'],
 e:['Albuminous: wheat, maize, castor, coconut. Exalbuminous: pea, bean, groundnut.','भ्रूणपोषी: गेहूँ, मक्का, अरंडी, नारियल। अभ्रूणपोषी: मटर, सेम, मूँगफली।']}},
{id:'apomixis',n:['Apomixis and polyembryony','एपोमिक्सिस और बहुभ्रूणता'],f:{
 d:['Apomixis: seeds form without fertilisation (and often without meiosis), so seedlings are clones of the mother. Polyembryony: more than one embryo in a seed.','एपोमिक्सिस: बिना निषेचन (और प्रायः बिना अर्धसूत्रण) बीज बनते हैं, इसलिए पौध माँ के क्लोन होते हैं। बहुभ्रूणता: एक बीज में एक से अधिक भ्रूण।'],
 e:['Polyembryony: citrus, mango. Apomixis: some grasses and Asteraceae.','बहुभ्रूणता: नींबू-वर्ग, आम। एपोमिक्सिस: कुछ घासें और एस्टरेसी।'],
 x:['Apomictic hybrid seeds could keep hybrid vigour year after year, so farmers need not buy new seed.','एपोमिक्टिक संकर बीज हर साल संकर ओज बनाए रख सकते हैं, इसलिए किसानों को नया बीज नहीं खरीदना पड़ेगा।']}},
{id:'dormancy',n:['Seed dormancy','बीज की सुषुप्तावस्था'],f:{
 d:['A resting state in which a living seed does not germinate even when water, warmth and air are available.','वह विश्राम-अवस्था जिसमें जीवित बीज पानी, गर्मी और हवा मिलने पर भी अंकुरित नहीं होता।'],
 s:['Causes: hard seed coat, immature embryo, or germination inhibitors such as abscisic acid.','कारण: कठोर बीजचोल, अपरिपक्व भ्रूण, या अवरोधक जैसे एब्सिसिक अम्ल।'],
 x:['Broken by scratching the coat, soaking, cold treatment or washing out inhibitors.','बीजचोल खुरचने, भिगोने, ठंड के उपचार या अवरोधक धोने से टूटती है।'],
 c:['Dormancy helps seeds wait for a good season and spread germination over time. A dormant seed is alive, not dead.','सुषुप्तावस्था से बीज अच्छे मौसम की प्रतीक्षा करते हैं और अंकुरण समय में बिखर जाता है। सुषुप्त बीज जीवित है, मृत नहीं।']}}
]});




(function(){
  const cl=(x,a,b)=>Math.max(a,Math.min(b,x)),tfov=()=>Math.tan(H.camera.fov*Math.PI/360),
    dist=()=>Math.max(11.9/2/tfov(),9/2/(tfov()*H.camera.aspect))*1.1,U=(z,h)=>2*tfov()*(dist()/z)/h; 
  
  window.setCamH=function(){const z=H.zoom,mx=Math.max(0,4.5-4.5/z),my=Math.max(0,6.6-6.6/z);
    H.panX=cl(H.panX||0,-mx,mx);H.panY=cl(H.panY||0,-my,my);
    H.camera.position.set(H.panX,H.panY,dist()/z);H.camera.lookAt(H.panX,H.panY,0)};
  PV.after('resetH',()=>{H.panX=0;H.panY=0;setCamH()});
  function attach(){if(!H||H._pz)return;H._pz=1;const cv=H.renderer.domElement,pts=new Map();let lz=H.zoom,lc=null;
    const comp=(cx,cy)=>{if(H.zoom===lz)return;const r=cv.getBoundingClientRect(),d=U(lz,r.height)-U(H.zoom,r.height);
      H.panX=(H.panX||0)+(cx-r.left-r.width/2)*d;H.panY=(H.panY||0)-(cy-r.top-r.height/2)*d;lz=H.zoom;setCamH()};
    cv.addEventListener('pointerdown',e=>{pts.set(e.pointerId,[e.clientX,e.clientY]);lz=H.zoom;lc=null},true);
    cv.addEventListener('pointermove',()=>{lz=H.zoom},true);               
    cv.addEventListener('pointermove',e=>{const p=pts.get(e.pointerId);if(!p)return;pts.set(e.pointerId,[e.clientX,e.clientY]);const r=cv.getBoundingClientRect();
      if(pts.size===2){const q=[...pts.values()],cx=(q[0][0]+q[1][0])/2,cy=(q[0][1]+q[1][1])/2;comp(cx,cy);
        if(lc){const u=U(H.zoom,r.height);H.panX-=(cx-lc[0])*u;H.panY+=(cy-lc[1])*u;setCamH()}lc=[cx,cy]}
      else if(e.pointerType==='mouse'&&((e.buttons&2)||e.shiftKey)){const dx=e.clientX-p[0],dy=e.clientY-p[1],u=U(H.zoom,r.height);
        H.rotY-=dx*.008;H.rotX-=dy*.008;H.panX-=dx*u;H.panY+=dy*u;setCamH()}});   
    const end=e=>{pts.delete(e.pointerId);lc=null;lz=H.zoom};cv.addEventListener('pointerup',end);cv.addEventListener('pointercancel',end);
    cv.addEventListener('wheel',()=>{lz=H.zoom},{capture:true,passive:true});cv.addEventListener('wheel',e=>comp(e.clientX,e.clientY),{passive:true});
    cv.addEventListener('contextmenu',e=>e.preventDefault())}
  PV.after('initH',attach);PV.after('openHome',attach);
  
  const F=[['Roots','जड़ें','↓',2,-3.2],['Shoot','तना व फूल','↑',2,2.6],['Whole','पूरा पौधा','⇅',1,0]];let k=-1,raf=0;
  const b=PV.ui.addTool({id:'pv-focus',label:'Focus: roots / shoot / whole',html:'⇅',onClick:()=>{if(!H||st.lv!==1)return;k=(k+1)%3;const f=F[k];b.textContent=f[2];b.title=PV.L(f[0],f[1]);go(f[3],f[4])}});
  function go(z,y){cancelAnimationFrame(raf);const t0=performance.now(),z0=H.zoom,x0=H.panX||0,y0=H.panY||0;
    (function s(now){const t=Math.min(1,(now-t0)/450),e=t*t*(3-2*t);H.zoom=z0+(z-z0)*e;H.panX=x0*(1-e);H.panY=y0+(y-y0)*e;setCamH();if(t<1)raf=requestAnimationFrame(s)})(t0)}
  PV.after('show',n=>{b.hidden=n!==1});
})();




PV.theory.add({id:'anat',i:'🔬',n:['Plant anatomy','पादप शारीरिकी'],t:[
{id:'systems',n:['Tissue systems','ऊतक तंत्र'],f:{
 d:['Plant tissues form three systems: epidermal (epidermis, cuticle, stomata, hairs), ground (cortex, pericycle, pith, mesophyll) and vascular (xylem and phloem, with cambium in dicots).','पादप ऊतक तीन तंत्र बनाते हैं: बाह्यत्वचीय (अधिचर्म, क्यूटिकल, रंध्र, रोम), भरण (वल्कुट, परिरंभ, मज्जा, पर्णमध्योतक) और संवहन (जाइलम, फ्लोएम, द्विबीजपत्री में कैम्बियम)।'],
 t:['Simple tissues have one cell type (parenchyma, collenchyma, sclerenchyma). Complex tissues have several (xylem, phloem). Primary tissues come from apical meristems, secondary tissues from lateral meristems.','सरल ऊतक में एक प्रकार की कोशिका (मृदूतक, स्थूलकोणोतक, दृढ़ोतक)। जटिल ऊतक में कई (जाइलम, फ्लोएम)। प्राथमिक ऊतक शीर्षस्थ विभज्योतक से और द्वितीयक ऊतक पार्श्व विभज्योतक से बनते हैं।'],
 c:['Pith and pericycle belong to the ground tissue system, not the vascular system.','मज्जा और परिरंभ भरण ऊतक तंत्र के भाग हैं, संवहन तंत्र के नहीं।']}},
{id:'bundles',n:['Types of vascular bundles','संवहन बंडल के प्रकार'],sc:['stem-dicot','stem-mono'],
 tb:{h:[['Term','शब्द'],['Meaning','अर्थ'],['Where','कहाँ']],r:[
  [['Radial','अरीय'],['Xylem and phloem lie on different radii, alternating','जाइलम और फ्लोएम अलग-अलग त्रिज्याओं पर, एकांतर'],['Roots','जड़ें']],
  [['Conjoint','संयुक्त'],['Xylem and phloem on the same radius','जाइलम और फ्लोएम एक ही त्रिज्या पर'],['Stems, leaves','तने, पत्तियाँ']],
  [['Bicollateral','उभयपार्श्विक'],['Phloem on both sides of the xylem','फ्लोएम जाइलम के दोनों ओर'],['Pumpkin, potato family','कद्दू, आलू-कुल']],
  [['Open','खुला'],['Cambium lies between xylem and phloem','जाइलम-फ्लोएम के बीच कैम्बियम'],['Dicot stems','द्विबीजपत्री तने']],
  [['Closed','बंद'],['No cambium','कैम्बियम नहीं'],['Monocot stems','एकबीजपत्री तने']],
  [['Endarch / exarch','अंतःआदिदारुक / बाह्यआदिदारुक'],['Protoxylem toward centre / toward outside','आदि-जाइलम केंद्र की ओर / बाहर की ओर'],['Stems / roots','तने / जड़ें']]]},
 f:{c:['Open bundles can make secondary tissue; closed bundles cannot.','खुले बंडल द्वितीयक ऊतक बना सकते हैं; बंद बंडल नहीं।']}},
{id:'leaftypes',n:['Dorsiventral vs isobilateral leaf','पृष्ठाधारी बनाम समद्विपार्श्विक पत्ती'],sc:['leaf-blade','leaf-mono'],
 tb:{h:[['Feature','लक्षण'],['Dorsiventral (dicot)','पृष्ठाधारी (द्विबीजपत्री)'],['Isobilateral (monocot)','समद्विपार्श्विक (एकबीजपत्री)']],r:[
  [['Mesophyll','पर्णमध्योतक'],['Palisade and spongy','खंभ और स्पंजी'],['Not differentiated','विभेदित नहीं']],
  [['Stomata','रंध्र'],['Mostly on the lower surface','अधिकतर निचली सतह पर'],['On both surfaces','दोनों सतहों पर']],
  [['Special cells','विशेष कोशिकाएँ'],['—','—'],['Bulliform cells in upper epidermis','ऊपरी अधिचर्म में आवर्ध (बुलीफॉर्म) कोशिकाएँ']]]},
 f:{x:['Bulliform cells lose water first in dry weather, so the grass leaf rolls and loses less water.','सूखे में आवर्ध कोशिकाएँ पहले पानी खोती हैं, जिससे घास की पत्ती मुड़ जाती है और कम पानी खोती है।']}},
{id:'secgrowth',n:['Secondary growth','द्वितीयक वृद्धि'],sc:['stem-wood'],f:{
 d:['Increase in girth by two lateral meristems: the vascular cambium and the cork cambium.','दो पार्श्व विभज्योतकों से मोटाई बढ़ना: संवहन कैम्बियम और कॉर्क कैम्बियम।'],
 m:['In a dicot stem the bundle cambium and cambium formed from medullary-ray cells join into a ring. It cuts secondary xylem inward (more) and secondary phloem outward (less), so wood piles up.','द्विबीजपत्री तने में बंडल का कैम्बियम और मज्जा-किरण कोशिकाओं से बना कैम्बियम मिलकर वलय बनाते हैं। यह भीतर द्वितीयक जाइलम (अधिक) और बाहर द्वितीयक फ्लोएम (कम) काटता है, इसलिए काष्ठ जमा होती जाती है।'],
 c:['In the dicot root, cambium arises from tissue below the phloem and from the pericycle. Typical monocots lack secondary growth because their bundles are closed (exceptions: Dracaena, Yucca).','द्विबीजपत्री जड़ में कैम्बियम फ्लोएम के नीचे के ऊतक और परिरंभ से बनता है। प्रारूपिक एकबीजपत्री में बंडल बंद होने से द्वितीयक वृद्धि नहीं होती (अपवाद: ड्रेसीना, यक्का)।']}},
{id:'rings',n:['Annual rings, sapwood and heartwood','वार्षिक वलय, रसदारु और अंतःकाष्ठ'],f:{
 d:['Early wood (spring) has wide vessels and is light. Late wood (autumn) has narrow vessels and is dark. Together they make a ring.','वसंत काष्ठ में चौड़ी वाहिकाएँ होती हैं और वह हल्की होती है। शरद काष्ठ में संकरी वाहिकाएँ होती हैं और वह गहरी होती है। दोनों मिलकर एक वलय बनाते हैं।'],
 s:['Sapwood is the outer, living-and-conducting wood. Heartwood is the dark inner wood, dead, filled with tannins and resins; it gives strength and resists decay.','रसदारु बाहरी, कार्यशील काष्ठ है। अंतःकाष्ठ गहरी, भीतरी, मृत काष्ठ है जिसमें टैनिन और रेज़िन भरे होते हैं; यह मज़बूती देती है और सड़ने से बचाती है।'],
 x:['Counting rings (dendrochronology) tells a tree’s age and past climate.','वलय गिनकर (डेंड्रोक्रोनोलॉजी) पेड़ की आयु और पुराना मौसम पता चलता है।'],
 c:['Heartwood does not conduct water. In the tropics a ring is not always one year.','अंतःकाष्ठ पानी नहीं ले जाती। उष्णकटिबंध में एक वलय हमेशा एक वर्ष का नहीं होता।']}},
{id:'periderm',n:['Cork cambium, periderm and bark','कॉर्क कैम्बियम, परित्वक और छाल'],f:{
 d:['As the stem thickens the epidermis breaks. Cork cambium (phellogen) forms outward cork (phellem) and inward secondary cortex (phelloderm). The three layers form the periderm.','तना मोटा होने पर अधिचर्म फट जाती है। कॉर्क कैम्बियम बाहर कॉर्क (फेलम) और भीतर द्वितीयक वल्कुट (फेलोडर्म) बनाता है। तीनों परतें मिलकर परित्वक बनाती हैं।'],
 s:['Cork cells are dead with suberin walls, so they are waterproof. Lenticels are pores that let gases pass.','कॉर्क कोशिकाएँ मृत होती हैं और भित्ति पर सुबेरिन होने से जलरोधी हैं। वातरंध्र (लेंटिसेल) गैसों के आवागमन के छिद्र हैं।'],
 e:['Commercial cork comes from the bark of Quercus suber.','व्यावसायिक कॉर्क क्वेरकस सुबेर की छाल से मिलता है।'],
 c:['“Bark” means all tissues outside the vascular cambium, not only the outer layer.','“छाल” का अर्थ संवहन कैम्बियम के बाहर के सभी ऊतक हैं, केवल बाहरी परत नहीं।']}},
{id:'differ',n:['Differentiation and totipotency','विभेदन और पूर्णशक्तता'],f:{
 d:['Differentiation: cells from meristems become specialised. Dedifferentiation: mature cells start dividing again (as in cork cambium). Redifferentiation: the new cells specialise once more.','विभेदन: विभज्योतक की कोशिकाएँ विशिष्ट बनती हैं। विविभेदन: परिपक्व कोशिकाएँ फिर विभाजित होने लगती हैं (जैसे कॉर्क कैम्बियम)। पुनर्विभेदन: नई कोशिकाएँ फिर विशिष्ट बन जाती हैं।'],
 m:['Totipotency is the ability of a plant cell to grow into a whole plant. It is why wounds heal by callus and why cuttings root.','पूर्णशक्तता किसी पादप कोशिका की पूरे पौधे में विकसित होने की क्षमता है। इसी से घाव कैलस बनाकर भरते हैं और कलमें जड़ पकड़ती हैं।'],
 x:['Tissue culture and micropropagation use totipotency.','ऊतक संवर्धन और सूक्ष्मप्रवर्धन पूर्णशक्तता का उपयोग करते हैं।']}}
]});
PV.theory.add({id:'cell',i:'🧬',n:['Cell biology','कोशिका विज्ञान'],t:[
{id:'wall',n:['Cell wall layers','कोशिका भित्ति की परतें'],f:{
 d:['Middle lamella (pectin) glues neighbouring cells. The primary wall (cellulose, hemicellulose, pectin) is thin and flexible. The secondary wall (cellulose plus lignin) is thick and forms inside it in xylem and sclerenchyma.','मध्य पटलिका (पेक्टिन) पड़ोसी कोशिकाओं को जोड़ती है। प्राथमिक भित्ति (सेलुलोज़, हेमिसेलुलोज़, पेक्टिन) पतली और लचीली होती है। द्वितीयक भित्ति (सेलुलोज़ व लिग्निन) मोटी होती है और जाइलम व दृढ़ोतक में इसके भीतर बनती है।'],
 s:['Plasmodesmata cross the wall and link the cytoplasm of neighbours.','प्लाज़्मोडेस्माटा भित्ति को पार करके पड़ोसी कोशिकाओं के कोशिकाद्रव्य को जोड़ते हैं।'],
 c:['The wall is fully permeable. The plasma membrane is the selective barrier.','भित्ति पूर्णतः पारगम्य है। चयनात्मक अवरोध कोशिका झिल्ली है।']}},
{id:'memtrans',n:['Membrane transport','झिल्ली के आर-पार परिवहन'],
 tb:{h:[['Type','प्रकार'],['Energy?','ऊर्जा?'],['Direction','दिशा'],['Example','उदाहरण']],r:[
  [['Simple diffusion','सरल विसरण'],['No','नहीं'],['Down gradient','सांद्रता ढाल के अनुसार'],['O₂, CO₂','O₂, CO₂']],
  [['Facilitated diffusion','सुगमित विसरण'],['No','नहीं'],['Down gradient, through a protein','ढाल के अनुसार, प्रोटीन द्वारा'],['Water via aquaporins, ions via channels','एक्वापोरिन से पानी, चैनल से आयन']],
  [['Active transport','सक्रिय परिवहन'],['Yes (ATP)','हाँ (ATP)'],['Against gradient, carrier or pump','ढाल के विरुद्ध, वाहक या पंप'],['H⁺-ATPase, K⁺ uptake by root hairs','H⁺-ATPase, मूल रोम द्वारा K⁺ अवशोषण']]]},
 f:{c:['Channels form pores and are fast; carriers bind the substance and change shape, so they are slower and can saturate.','चैनल छिद्र बनाते हैं और तेज़ हैं; वाहक पदार्थ को पकड़कर आकार बदलते हैं, इसलिए धीमे हैं और संतृप्त हो सकते हैं।']}},
{id:'wpot',n:['Water potential','जल विभव'],f:{
 d:['Water potential (Ψw) measures the free energy of water. Pure water at standard conditions is 0. Water moves from higher (less negative) to lower (more negative) Ψw.','जल विभव (Ψw) जल की मुक्त ऊर्जा का माप है। मानक स्थितियों में शुद्ध जल का मान 0 है। पानी उच्च (कम ऋणात्मक) से निम्न (अधिक ऋणात्मक) Ψw की ओर जाता है।'],
 m:['Ψw = Ψs + Ψp. Solutes make Ψs negative. Turgor pressure makes Ψp positive. A flaccid cell has Ψp = 0, so Ψw = Ψs.','Ψw = Ψs + Ψp। विलेय Ψs को ऋणात्मक बनाते हैं। स्फीति दाब Ψp को धनात्मक बनाता है। शिथिल कोशिका में Ψp = 0, इसलिए Ψw = Ψs।'],
 e:['A root hair has lower Ψw than the soil water, so water enters it.','मूल रोम का Ψw मिट्टी के पानी से कम होता है, इसलिए पानी भीतर आता है।'],
 c:['More negative means lower potential, and water flows toward it.','अधिक ऋणात्मक का अर्थ कम विभव है और पानी उसी की ओर बहता है।']}},
{id:'osmosis',n:['Osmosis, plasmolysis and imbibition','परासरण, जीवद्रव्यकुंचन और अंतःशोषण'],f:{
 d:['Osmosis is the movement of water across a selectively permeable membrane from higher to lower Ψw.','परासरण चयनात्मक पारगम्य झिल्ली के आर-पार पानी का उच्च से निम्न Ψw की ओर जाना है।'],
 t:['In a hypertonic solution the protoplast shrinks from the wall (plasmolysis). In a hypotonic solution it swells and becomes turgid; a plasmolysed cell regains shape (deplasmolysis). Isotonic: no net movement.','अतिपरासरी विलयन में जीवद्रव्य भित्ति से सिकुड़ता है (जीवद्रव्यकुंचन)। अल्पपरासरी विलयन में फूलकर स्फीत होता है; कुंचित कोशिका फिर सामान्य होती है (विकुंचन)। समपरासरी: कोई शुद्ध गति नहीं।'],
 x:['Peel a Rhoeo leaf and mount it in sugar or salt solution under the microscope.','रियो पत्ती का छिलका लेकर शर्करा या नमक के विलयन में सूक्ष्मदर्शी से देखें।'],
 c:['Imbibition (swelling of seeds, wood, gums) needs no membrane, so it is not osmosis.','अंतःशोषण (बीज, लकड़ी, गोंद का फूलना) में झिल्ली नहीं चाहिए, इसलिए यह परासरण नहीं है।']}},
{id:'cellcycle',n:['Cell cycle','कोशिका चक्र'],v:()=>pvCycle([['G₁ (growth)','G₁ (वृद्धि)','x'],['S (DNA copied)','S (DNA प्रतिकृति)','x'],['G₂ (prepare)','G₂ (तैयारी)','x'],['M (divide)','M (विभाजन)','x']],[['','']
 ,['',''],['',''],['','']]),f:{
 d:['Interphase has G₁ (growth), S (DNA replication) and G₂ (preparation). M phase is mitosis plus cytokinesis. Cells that stop dividing sit in G₀.','अंतरावस्था में G₁ (वृद्धि), S (DNA प्रतिकृति) और G₂ (तैयारी) होते हैं। M अवस्था में समसूत्रण और कोशिकाद्रव्य विभाजन होता है। विभाजन रोकने वाली कोशिकाएँ G₀ में रहती हैं।'],
 c:['DNA is copied in S phase, not during mitosis. Uncontrolled cycling is the basis of cancer.','DNA की प्रतिकृति S अवस्था में होती है, समसूत्रण में नहीं। अनियंत्रित चक्र कैंसर का आधार है।']}},
{id:'mitosis',n:['Mitosis and plant cytokinesis','समसूत्रण और पादप कोशिकाद्रव्य विभाजन'],f:{
 d:['Prophase: chromosomes condense, spindle forms. Metaphase: chromosomes line up at the equator. Anaphase: sister chromatids move to opposite poles. Telophase: nuclei reform.','पूर्वावस्था: गुणसूत्र संघनित होते हैं, तर्कु बनता है। मध्यावस्था: गुणसूत्र मध्य रेखा पर आते हैं। पश्चावस्था: अर्धगुणसूत्र विपरीत ध्रुवों पर जाते हैं। अंत्यावस्था: केंद्रक फिर बनते हैं।'],
 m:['In plants, Golgi vesicles build a cell plate from the centre outward, which becomes the new wall. There is no pinching furrow as in animals.','पादपों में गॉल्जी पुटिकाएँ केंद्र से बाहर की ओर कोशिका पट्टिका बनाती हैं, जो नई भित्ति बन जाती है। जंतुओं की तरह खाँचा नहीं बनता।'],
 x:['Onion root tip squash shows all stages.','प्याज की जड़ के सिरे का स्क्वैश सभी अवस्थाएँ दिखाता है।'],
 c:['Mitosis keeps the chromosome number the same (2n → 2n); it gives growth and repair.','समसूत्रण में गुणसूत्र संख्या समान रहती है (2n → 2n); यह वृद्धि व मरम्मत देता है।']}},
{id:'meiosis',n:['Meiosis','अर्धसूत्रण'],f:{
 d:['Two divisions after one DNA replication make four haploid cells. Meiosis I separates homologous chromosomes (reductional). Meiosis II separates chromatids (equational).','एक DNA प्रतिकृति के बाद दो विभाजन चार अगुणित कोशिकाएँ बनाते हैं। अर्धसूत्रण I समजात गुणसूत्र अलग करता है (न्यूनकारी)। अर्धसूत्रण II अर्धगुणसूत्र अलग करता है (समसूत्री)।'],
 s:['Prophase I stages: leptotene, zygotene, pachytene (crossing over), diplotene, diakinesis.','पूर्वावस्था I की उपअवस्थाएँ: लेप्टोटीन, जाइगोटीन, पैकेटीन (जीन विनिमय), डिप्लोटीन, डायकाइनेसिस।'],
 x:['It keeps chromosome number constant over generations and creates variation through crossing over and independent assortment.','यह पीढ़ियों में गुणसूत्र संख्या स्थिर रखता है और जीन विनिमय व स्वतंत्र अपव्यूहन से विविधता लाता है।'],
 c:['In plants meiosis makes spores (microspores, megaspores), not gametes.','पौधों में अर्धसूत्रण से बीजाणु (लघु व गुरु बीजाणु) बनते हैं, युग्मक नहीं।']}}
]});




function pvSpec(){const L=PV.L,g=(x,m,s)=>Math.exp(-Math.pow((x-m)/s,2)),X=n=>20+(n-400)*.7,Y=v=>88-v*70,
  A=n=>.95*g(n,430,18)+.8*g(n,662,14)+.05,B=n=>.85*g(n,453,18)+.5*g(n,642,14)+.05,C=n=>.6*g(n,480,22)+.05,AC=n=>Math.min(1,.55*A(n)+.3*B(n)+.3*C(n)),
  pl=(f,col,dash)=>`<polyline fill="none" stroke="${col}" stroke-width="1.4"${dash?' stroke-dasharray="3 2"':''} points="${Array.from({length:31},(_,i)=>{const n=400+i*10;return X(n).toFixed(1)+','+Y(f(n)).toFixed(1)}).join(' ')}"/>`;
  return `<defs><linearGradient id="pvsp"><stop offset="0" stop-color="#7e57c2"/><stop offset=".25" stop-color="#1e88e5"/><stop offset=".45" stop-color="#43a047"/><stop offset=".65" stop-color="#fdd835"/><stop offset=".8" stop-color="#fb8c00"/><stop offset="1" stop-color="#e53935"/></linearGradient></defs>`
   +`<rect x="20" y="92" width="210" height="5" fill="url(#pvsp)"/><line x1="20" y1="88" x2="230" y2="88" stroke="var(--fg)" stroke-width=".6"/>`
   +[400,500,600,700].map(n=>`<text x="${X(n)}" y="106" font-size="6" text-anchor="middle" fill="var(--fg)">${n}</text>`).join('')
   +pl(A,'#2e7d32')+pl(B,'#1565c0')+pl(AC,'#e65100',1)
   +`<text x="128" y="14" font-size="5.8" fill="#2e7d32">${L('chlorophyll a','क्लोरोफिल a')}</text><text x="128" y="22" font-size="5.8" fill="#1565c0">${L('chlorophyll b','क्लोरोफिल b')}</text><text x="128" y="30" font-size="5.8" fill="#e65100">${L('action spectrum (dashed)','क्रिया स्पेक्ट्रम (बिंदीदार)')}</text><text x="230" y="106" font-size="5.5" text-anchor="end" fill="var(--muted)">nm</text>`}
function pvZ(){const L=PV.L;
  return `<polyline fill="none" stroke="#fbc02d" stroke-width="2.2" points="30,86 50,20"/><polyline fill="none" stroke="#fbc02d" stroke-width="2.2" points="105,64 125,10"/>`
   +`<polyline fill="none" stroke="var(--fg)" stroke-width="1" stroke-dasharray="3 2" points="50,20 78,36 105,64"/><polyline fill="none" stroke="var(--fg)" stroke-width="1" stroke-dasharray="3 2" points="125,10 160,22 195,38"/>`
   +[[30,86,'P680','',-4,10],[50,20,'P680*','',-2,-4],[105,64,'P700','',4,11],[125,10,'P700*','',4,-2],[195,38,'NADPH','',-2,-5]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="2.4" fill="#2e7d32"/><text x="${p[0]+p[4]}" y="${p[1]+p[5]}" font-size="6" fill="var(--fg)">${p[2]}</text>`).join('')
   +`<text x="66" y="22" font-size="5.5" fill="var(--muted)">${L('electron transport chain: ATP','इलेक्ट्रॉन परिवहन शृंखला: ATP')}</text><text x="4" y="102" font-size="5.8" fill="var(--fg)">${L('H₂O → O₂ + H⁺ + e⁻ (photolysis)','H₂O → O₂ + H⁺ + e⁻ (प्रकाश-अपघटन)')}</text><text x="100" y="86" font-size="5.5" fill="#f9a825">${L('light','प्रकाश')}</text><text x="226" y="6" font-size="5.5" text-anchor="end" fill="var(--muted)">${L('energy ↑','ऊर्जा ↑')}</text>`}
PV.theory.add({id:'transp',i:'💧',n:['Transport in plants','पादपों में परिवहन'],t:[
{id:'pathways',n:['Three water pathways','जल के तीन मार्ग'],sc:['root-cross'],f:{
 d:['Apoplast: through cell walls and spaces (fast, non-living path). Symplast: through cytoplasm linked by plasmodesmata. Transmembrane: crossing membranes cell to cell, using aquaporins.','एपोप्लास्ट: भित्तियों और अंतराकोशिकी स्थानों से (तेज़, निर्जीव मार्ग)। सिम्प्लास्ट: प्लाज़्मोडेस्माटा से जुड़े कोशिकाद्रव्य से। अंतःझिल्ली: एक्वापोरिन से होकर कोशिका-दर-कोशिका झिल्ली पार करना।'],
 m:['At the endodermis the waxy Casparian strip blocks the apoplast, so water must enter cells. This lets the root filter ions before they reach the xylem.','अंतःत्वचा में मोमी कैस्पेरियन पट्टी एपोप्लास्ट को रोक देती है, इसलिए पानी को कोशिकाओं में जाना पड़ता है। इससे जड़ जाइलम तक पहुँचने से पहले आयनों को छान लेती है।']}},
{id:'ascent',n:['Ascent of sap (cohesion–tension)','रसारोहण (संसंजन-तनाव)'],f:{
 d:['Transpiration at the leaf lowers pressure in the xylem, creating tension that pulls water up.','पत्ती में वाष्पोत्सर्जन से जाइलम में दाब घटता है, जिससे तनाव बनता है जो पानी को ऊपर खींचता है।'],
 m:['Water molecules stick to each other (cohesion) and to xylem walls (adhesion), so a continuous column rises without breaking.','जल-अणु आपस में (संसंजन) और जाइलम की दीवारों से (आसंजन) चिपकते हैं, इसलिए पानी का सतत स्तंभ टूटे बिना ऊपर चढ़ता है।'],
 c:['Living cells do not pump the sap up. The xylem tubes are dead and the pull comes from evaporation.','जीवित कोशिकाएँ रस को ऊपर पंप नहीं करतीं। जाइलम नलिकाएँ मृत हैं और खिंचाव वाष्पन से आता है।']}},
{id:'rootpress',n:['Root pressure and guttation','मूल दाब और बिंदुस्राव'],f:{
 d:['Root pressure is a positive pressure in the xylem built when roots actively take in ions and water follows by osmosis.','मूल दाब जाइलम में बना धनात्मक दाब है, जो तब बनता है जब जड़ें आयन सक्रिय रूप से लेती हैं और पानी परासरण से पीछे आता है।'],
 m:['At night or in humid air it pushes liquid water out through hydathodes at leaf edges (guttation).','रात में या नम हवा में यह तरल पानी को पत्ती के किनारों के जलरंध्रों (हाइडैथोड) से बाहर धकेलता है (बिंदुस्राव)।'],
 c:['Guttation is liquid water; transpiration is water vapour. Root pressure alone cannot lift water in tall trees.','बिंदुस्राव तरल पानी है; वाष्पोत्सर्जन जलवाष्प। केवल मूल दाब ऊँचे पेड़ों में पानी नहीं चढ़ा सकता।']}},
{id:'transp',n:['Transpiration and its factors','वाष्पोत्सर्जन और उसके कारक'],f:{
 d:['Loss of water vapour from aerial parts, mainly through stomata.','वायवीय भागों से, मुख्यतः रंध्रों से, जलवाष्प की हानि।'],
 t:['Faster with more light (stomata open), higher temperature, lower humidity, wind, more soil water, bigger leaf area and wider stomatal opening.','अधिक प्रकाश (रंध्र खुलते हैं), अधिक तापमान, कम आर्द्रता, हवा, अधिक मृदा-जल, बड़े पत्ती-क्षेत्र और चौड़े रंध्र-छिद्र से तेज़ होता है।'],
 x:['It pulls water and minerals up and cools the leaf. A potometer measures water uptake.','यह पानी और खनिज ऊपर खींचता है और पत्ती को ठंडा करता है। पोटोमीटर से जल-अवशोषण मापा जाता है।']}},
{id:'stomata',n:['How stomata open and close','रंध्र कैसे खुलते-बंद होते हैं'],sc:['leaf-stomata'],f:{
 m:['In light, guard cells take up K⁺ (and make malate), so water enters and they become turgid. Their thick inner walls make them bend apart and the pore opens. ABA in water stress makes K⁺ leave and the pore closes.','प्रकाश में रक्षक कोशिकाएँ K⁺ लेती हैं (और मैलेट बनाती हैं), इसलिए पानी भीतर आता है और वे स्फीत होती हैं। मोटी भीतरी दीवार के कारण वे मुड़कर अलग होती हैं और छिद्र खुलता है। जल-तनाव में ABA से K⁺ बाहर जाता है और छिद्र बंद होता है।'],
 c:['Guard cells are the only epidermal cells with chloroplasts in many plants, but the opening is driven by ion movement, not by sugar alone.','कई पौधों में अधिचर्म की केवल रक्षक कोशिकाओं में हरितलवक होते हैं, पर खुलना आयनों की गति से होता है, केवल शर्करा से नहीं।']}},
{id:'phloem',n:['Phloem transport (pressure flow)','फ्लोएम परिवहन (दाब-प्रवाह)'],f:{
 d:['Sugars move from a source (such as a leaf) to a sink (root, fruit, growing tip or storage organ).','शर्करा स्रोत (जैसे पत्ती) से उपयोग-स्थल (जड़, फल, वर्धी सिरा या भंडार अंग) की ओर जाती है।'],
 m:['At the source, sucrose is actively loaded into sieve tubes, water enters by osmosis and pressure rises. At the sink, sugar is unloaded, water leaves and pressure falls, so sap flows along the pressure gradient.','स्रोत पर सुक्रोज़ सक्रिय रूप से छलनी नलिकाओं में भरी जाती है, पानी परासरण से आता है और दाब बढ़ता है। उपयोग-स्थल पर शर्करा उतरती है, पानी निकलता है और दाब घटता है, इसलिए रस दाब-ढाल के अनुसार बहता है।'],
 x:['Girdling (ringing) a stem makes sugar pile up above the cut. Aphid stylets sample phloem sap.','तने पर छल्ला काटने से कट के ऊपर शर्करा जमा होती है। एफ़िड की सूँड़ फ्लोएम रस चूसती है।'],
 c:['A source can become a sink: a storage root is a sink in summer and a source in spring. Each sieve tube flows one way at a time.','स्रोत उपयोग-स्थल बन सकता है: भंडारण जड़ गर्मी में उपयोग-स्थल और वसंत में स्रोत होती है। हर छलनी नलिका एक समय में एक ही दिशा में बहती है।']}}
]});
PV.theory.add({id:'photo',i:'☀️',n:['Photosynthesis','प्रकाश-संश्लेषण'],t:[
{id:'pigments',n:['Pigments and spectra','वर्णक और स्पेक्ट्रम'],v:pvSpec,vb:'0 0 240 110',f:{
 d:['Chlorophyll a is the main pigment. Chlorophyll b, xanthophylls and carotenoids are accessory pigments that widen the light absorbed and protect against damage.','क्लोरोफिल a मुख्य वर्णक है। क्लोरोफिल b, ज़ैन्थोफिल और कैरोटीनॉइड सहायक वर्णक हैं जो अवशोषित प्रकाश बढ़ाते हैं और क्षति से बचाते हैं।'],
 m:['Absorption spectrum: light each pigment absorbs (peaks in blue and red). Action spectrum: photosynthesis rate at each wavelength, which follows absorption closely. Engelmann’s Cladophora experiment: bacteria gathered at blue and red light.','अवशोषण स्पेक्ट्रम: हर वर्णक द्वारा अवशोषित प्रकाश (नीले और लाल में शिखर)। क्रिया स्पेक्ट्रम: हर तरंगदैर्ध्य पर प्रकाश-संश्लेषण की दर, जो अवशोषण का लगभग अनुसरण करती है। एंगेलमान का क्लैडोफोरा प्रयोग: जीवाणु नीले और लाल प्रकाश में जमा हुए।'],
 s:['Pigments sit in light-harvesting antenna complexes that pass energy to a reaction centre: P680 in photosystem II, P700 in photosystem I.','वर्णक प्रकाश-संग्राही एंटीना समूहों में होते हैं जो ऊर्जा अभिक्रिया केंद्र को देते हैं: फोटोसिस्टम II में P680, फोटोसिस्टम I में P700।'],
 c:['The curves are schematic sketches, not measured data.','वक्र योजनाबद्ध रेखाचित्र हैं, मापे गए आँकड़े नहीं।']}},
{id:'light',n:['Light reactions','प्रकाश अभिक्रियाएँ'],v:pvZ,f:{
 d:['They occur in the thylakoid membranes and make ATP, NADPH and O₂.','ये थाइलेकॉइड झिल्लियों में होती हैं और ATP, NADPH तथा O₂ बनाती हैं।'],
 m:['Photosystem II (P680) is excited, splits water (photolysis: 2H₂O → 4H⁺ + 4e⁻ + O₂) and passes electrons down a chain to photosystem I (P700), which is excited again and reduces NADP⁺ to NADPH. Protons pile up in the thylakoid lumen and flow out through ATP synthase, making ATP (chemiosmosis).','फोटोसिस्टम II (P680) उत्तेजित होकर पानी तोड़ता है (प्रकाश-अपघटन: 2H₂O → 4H⁺ + 4e⁻ + O₂) और इलेक्ट्रॉन शृंखला से फोटोसिस्टम I (P700) तक पहुँचाता है, जो फिर उत्तेजित होकर NADP⁺ को NADPH में बदलता है। प्रोटॉन थाइलेकॉइड गुहा में जमा होकर ATP सिंथेज़ से बाहर बहते हैं और ATP बनता है (रसोपरासरण)।'],
 t:['Non-cyclic: both photosystems, gives ATP, NADPH and O₂. Cyclic: only photosystem I, gives ATP only, no NADPH and no O₂.','अचक्रीय: दोनों फोटोसिस्टम, ATP, NADPH और O₂ देता है। चक्रीय: केवल फोटोसिस्टम I, केवल ATP देता है; NADPH और O₂ नहीं।'],
 c:['The oxygen released comes from water, not from CO₂.','निकलने वाली ऑक्सीजन पानी से आती है, CO₂ से नहीं।']}},
{id:'calvin',n:['Calvin cycle','केल्विन चक्र'],v:()=>pvCycle([['RuBP (5C)','RuBP (5C)','x'],['2 × PGA (3C)','2 × PGA (3C)','x'],['G3P (3C)','G3P (3C)','x']],[['CO₂ + RuBisCO','CO₂ + रूबिस्को'],['ATP, NADPH','ATP, NADPH'],['ATP (regenerate)','ATP (पुनर्जनन)']]),f:{
 d:['It occurs in the stroma and builds sugar from CO₂ using ATP and NADPH.','यह स्ट्रोमा में होता है और ATP व NADPH से CO₂ द्वारा शर्करा बनाता है।'],
 m:['Carboxylation: RuBisCO attaches CO₂ to RuBP, giving PGA. Reduction: PGA becomes G3P using ATP and NADPH. Regeneration: RuBP is rebuilt using ATP.','कार्बोक्सिलन: रूबिस्को CO₂ को RuBP से जोड़ता है और PGA बनता है। अपचयन: ATP व NADPH से PGA, G3P बनता है। पुनर्जनन: ATP से RuBP फिर बनता है।'],
 x:['Per CO₂ fixed: 3 ATP and 2 NADPH. For one glucose (6 CO₂): 18 ATP and 12 NADPH. Overall: 6CO₂ + 12H₂O → C₆H₁₂O₆ + 6O₂ + 6H₂O.','प्रति CO₂: 3 ATP और 2 NADPH। एक ग्लूकोज़ (6 CO₂) के लिए: 18 ATP और 12 NADPH। कुल: 6CO₂ + 12H₂O → C₆H₁₂O₆ + 6O₂ + 6H₂O।'],
 c:['The “dark reactions” still need ATP and NADPH from the light reactions, so they stop in prolonged darkness.','“अँधेरी अभिक्रियाओं” को भी प्रकाश अभिक्रियाओं से ATP और NADPH चाहिए, इसलिए लंबे अँधेरे में वे रुक जाती हैं।']}},
{id:'c4',n:['C₄ pathway and Kranz anatomy','C₄ पथ और क्रांज़ शारीरिकी'],f:{
 d:['In C₄ plants the first stable product is oxaloacetic acid (4C). This is the Hatch–Slack pathway.','C₄ पौधों में पहला स्थायी उत्पाद ऑक्सैलोएसीटिक अम्ल (4C) है। यह हैच-स्लैक पथ है।'],
 s:['Kranz anatomy: large bundle sheath cells with chloroplasts form a wreath around each vein.','क्रांज़ शारीरिकी: शिरा के चारों ओर हरितलवक वाली बड़ी पूलाच्छद कोशिकाओं का घेरा।'],
 m:['In mesophyll cells PEP carboxylase fixes CO₂ into OAA and then malate. Malate moves to bundle sheath cells, releases CO₂, and RuBisCO runs the Calvin cycle in a CO₂-rich place.','पर्णमध्योतक में PEP कार्बोक्सिलेज़ CO₂ को OAA और फिर मैलेट में बाँधता है। मैलेट पूलाच्छद कोशिकाओं में जाकर CO₂ छोड़ता है और रूबिस्को CO₂-समृद्ध स्थान में केल्विन चक्र चलाता है।'],
 e:['Maize, sugarcane, sorghum.','मक्का, गन्ना, ज्वार।'],
 c:['C₄ costs more ATP (5 ATP and 2 NADPH per CO₂ against 3 and 2), but wins in hot, bright places.','C₄ में ATP अधिक लगता है (प्रति CO₂ 5 ATP व 2 NADPH, जबकि C₃ में 3 व 2), पर गर्म, तेज़ रोशनी में यह जीतता है।']}},
{id:'photoresp',n:['Photorespiration','प्रकाश-श्वसन'],f:{
 d:['RuBisCO can also use O₂ instead of CO₂ when O₂ is high and CO₂ is low, for example when stomata close in heat.','जब O₂ अधिक और CO₂ कम हो, जैसे गर्मी में रंध्र बंद होने पर, रूबिस्को CO₂ की जगह O₂ भी ले सकता है।'],
 m:['RuBP + O₂ gives one PGA and one phosphoglycolate. Rescuing the carbon needs chloroplast, peroxisome and mitochondrion, uses ATP and releases CO₂.','RuBP + O₂ से एक PGA और एक फॉस्फोग्लाइकोलेट बनता है। कार्बन बचाने में हरितलवक, परऑक्सीसोम और माइटोकॉन्ड्रिया लगते हैं, ATP खर्च होता है और CO₂ निकलती है।'],
 c:['It makes no sugar and no ATP, so it is a loss for C₃ plants. C₄ plants avoid most of it because CO₂ is concentrated. It is not the same as respiration.','इसमें शर्करा या ATP नहीं बनता, इसलिए C₃ पौधों के लिए हानि है। C₄ पौधे इससे अधिकांशतः बचते हैं क्योंकि CO₂ सांद्रित होती है। यह श्वसन नहीं है।']}},
{id:'cam',n:['CAM pathway','CAM पथ'],f:{
 m:['Stomata open at night: CO₂ is fixed into malic acid stored in the vacuole. By day the stomata stay shut, malic acid releases CO₂ and the Calvin cycle runs.','रात में रंध्र खुलते हैं: CO₂ मैलिक अम्ल में बँधकर रिक्तिका में जमा होती है। दिन में रंध्र बंद रहते हैं, मैलिक अम्ल से CO₂ निकलती है और केल्विन चक्र चलता है।'],
 e:['Opuntia, pineapple, Agave, Kalanchoe.','नागफनी, अनानास, एगेव, कलांचो।'],
 c:['CAM separates the two steps in time (night and day). C₄ separates them in space (two cell types).','CAM दोनों चरणों को समय में (रात-दिन) अलग करता है। C₄ उन्हें स्थान में (दो प्रकार की कोशिकाओं में) अलग करता है।']}},
{id:'c3c4cam',n:['C₃ vs C₄ vs CAM','C₃ बनाम C₄ बनाम CAM'],
 tb:{h:[['Feature','लक्षण'],['C₃','C₃'],['C₄','C₄'],['CAM','CAM']],r:[
  [['First product','पहला उत्पाद'],['PGA (3C)','PGA (3C)'],['OAA (4C)','OAA (4C)'],['Malic acid (night)','मैलिक अम्ल (रात)']],
  [['CO₂-fixing enzyme','CO₂ बाँधने वाला एंज़ाइम'],['RuBisCO','रूबिस्को'],['PEP carboxylase, then RuBisCO','PEP कार्बोक्सिलेज़, फिर रूबिस्को'],['PEP carboxylase at night, RuBisCO by day','रात में PEP कार्बोक्सिलेज़, दिन में रूबिस्को']],
  [['Anatomy','शारीरिकी'],['Normal','सामान्य'],['Kranz','क्रांज़'],['Succulent, big vacuoles','मांसल, बड़ी रिक्तिकाएँ']],
  [['Photorespiration','प्रकाश-श्वसन'],['High','अधिक'],['Very low','बहुत कम'],['Very low','बहुत कम']],
  [['Optimum temperature','अनुकूल तापमान'],['About 20–25 °C','लगभग 20–25 °C'],['About 30–45 °C','लगभग 30–45 °C'],['Warm, dry','गर्म, शुष्क']],
  [['Examples','उदाहरण'],['Wheat, rice, bean','गेहूँ, चावल, सेम'],['Maize, sugarcane','मक्का, गन्ना'],['Opuntia, pineapple','नागफनी, अनानास']]]},
 f:{x:['Try the C3/C4 switch in the Environment lab to see how the response changes.','पर्यावरण प्रयोगशाला में C3/C4 बदलकर देखें कि प्रतिक्रिया कैसे बदलती है।']}},
{id:'limiting',n:['Limiting factors (Blackman)','सीमाकारी कारक (ब्लैकमैन)'],f:{
 d:['Blackman’s law (1905): when several factors affect a process, its rate is set by the factor that is nearest its minimum.','ब्लैकमैन का नियम (1905): जब कई कारक किसी प्रक्रिया को प्रभावित करते हैं, तो उसकी दर उस कारक से तय होती है जो न्यूनतम के सबसे निकट है।'],
 t:['Light, CO₂, temperature and water. Light saturates at a low fraction of full sunlight in many C₃ plants; C₄ plants keep responding to temperature and light longer.','प्रकाश, CO₂, तापमान और पानी। कई C₃ पौधों में प्रकाश पूर्ण धूप के छोटे अंश पर संतृप्त हो जाता है; C₄ पौधे तापमान और प्रकाश पर अधिक देर तक प्रतिक्रिया करते हैं।'],
 x:['The Environment lab shows the current limiting factor.','पर्यावरण प्रयोगशाला वर्तमान सीमाकारी कारक दिखाती है।'],
 c:['Raising a factor that is not limiting changes nothing.','जो कारक सीमा नहीं है उसे बढ़ाने से कुछ नहीं बदलता।']}}
]});




PV.theory.add({id:'nutr',i:'🧪',n:['Mineral nutrition and nitrogen','खनिज पोषण और नाइट्रोजन'],t:[
{id:'essential',n:['Essential elements','आवश्यक तत्व'],f:{
 d:['An element is essential if the plant cannot complete its life cycle without it, its role cannot be taken over by another element, and it acts directly in metabolism.','कोई तत्व आवश्यक है यदि उसके बिना पौधा जीवन-चक्र पूरा नहीं कर सकता, उसका कार्य कोई अन्य तत्व नहीं ले सकता और वह सीधे उपापचय में भाग लेता है।'],
 t:['Macronutrients (large amounts): C, H, O, N, P, K, Ca, Mg, S. Micronutrients (traces): Fe, Mn, Cu, Mo, Zn, B, Cl, Ni. Beneficial elements such as Na, Si, Co, Se are needed only by some plants.','वृहत पोषक (अधिक मात्रा): C, H, O, N, P, K, Ca, Mg, S। सूक्ष्म पोषक (अल्प मात्रा): Fe, Mn, Cu, Mo, Zn, B, Cl, Ni। लाभदायक तत्व जैसे Na, Si, Co, Se केवल कुछ पौधों को चाहिए।'],
 x:['Hydroponics: grow plants in water with a known nutrient solution and leave out one element at a time to see what is essential.','जलकृषि (हाइड्रोपोनिक्स): ज्ञात पोषक विलयन वाले पानी में पौधे उगाएँ और एक-एक तत्व हटाकर देखें कि कौन-सा आवश्यक है।']}},
{id:'macro',n:['Macronutrients: roles and deficiency','वृहत पोषक: कार्य व कमी'],
 tb:{h:[['Element','तत्व'],['Main roles','मुख्य कार्य'],['Deficiency sign','कमी का लक्षण']],r:[
  [['Nitrogen','नाइट्रोजन'],['Proteins, nucleic acids, chlorophyll','प्रोटीन, न्यूक्लीक अम्ल, क्लोरोफिल'],['Pale older leaves, stunting','पुरानी पत्तियाँ पीली, बौनापन']],
  [['Phosphorus','फॉस्फोरस'],['ATP, nucleic acids, membranes','ATP, न्यूक्लीक अम्ल, झिल्लियाँ'],['Stunting, dark or purplish leaves','बौनापन, गहरी या बैंगनी पत्तियाँ']],
  [['Potassium','पोटैशियम'],['Stomata, osmotic balance, enzymes','रंध्र, परासरणी संतुलन, एंज़ाइम'],['Brown dead leaf edges, older leaves','पुरानी पत्तियों के किनारे भूरे व मृत']],
  [['Calcium','कैल्शियम'],['Middle lamella, spindle fibres','मध्य पटलिका, तर्कु तंतु'],['Distorted young leaves, dying tips','नई पत्तियाँ विकृत, सिरे सूखते']],
  [['Magnesium','मैग्नीशियम'],['Centre of chlorophyll, enzymes','क्लोरोफिल का केंद्र, एंज़ाइम'],['Yellow between veins, older leaves','शिराओं के बीच पीलापन, पुरानी पत्तियाँ']],
  [['Sulphur','सल्फर'],['Amino acids cysteine and methionine','अमीनो अम्ल सिस्टीन व मेथियोनीन'],['Pale young leaves','नई पत्तियाँ पीली']]]}},
{id:'micro',n:['Micronutrients: roles and deficiency','सूक्ष्म पोषक: कार्य व कमी'],
 tb:{h:[['Element','तत्व'],['Main roles','मुख्य कार्य'],['Deficiency sign','कमी का लक्षण']],r:[
  [['Iron','आयरन'],['Chlorophyll making, electron carriers','क्लोरोफिल निर्माण, इलेक्ट्रॉन वाहक'],['Yellow between veins, young leaves','शिराओं के बीच पीलापन, नई पत्तियाँ']],
  [['Manganese','मैंगनीज़'],['Water splitting, enzyme activator','जल-अपघटन, एंज़ाइम सक्रियक'],['Chlorotic and dead spots','पीले व मृत धब्बे']],
  [['Zinc','ज़िंक'],['Auxin synthesis','ऑक्सिन निर्माण'],['Small leaves, short internodes','छोटी पत्तियाँ, छोटे पर्व']],
  [['Copper','कॉपर'],['Enzymes, plastocyanin','एंज़ाइम, प्लास्टोसायनिन'],['Die-back of shoots','प्ररोह का ऊपर से सूखना']],
  [['Boron','बोरॉन'],['Pollen germination, cell elongation','परागण अंकुरण, कोशिका दीर्घन'],['Dead growing tips, poor flowering','वर्धी सिरे मृत, फूल कम']],
  [['Molybdenum','मोलिब्डेनम'],['Nitrate reductase, nitrogenase','नाइट्रेट रिडक्टेज़, नाइट्रोजिनेज़'],['Pale leaves, poor N use','पीली पत्तियाँ, N का कम उपयोग']],
  [['Chlorine','क्लोरीन'],['Water splitting, ion balance','जल-अपघटन, आयन संतुलन'],['Wilting, chlorosis','मुरझाना, पीलापन']],
  [['Nickel','निकल'],['Urease enzyme','यूरिएज़ एंज़ाइम'],['Leaf-tip necrosis (urea builds up)','पत्ती-सिरा मृत (यूरिया जमा)']]]}},
{id:'mobility',n:['Mobility and toxicity','गतिशीलता और विषाक्तता'],f:{
 d:['Mobile elements (N, P, K, Mg) are moved from old to young leaves, so their deficiency shows first on older leaves. Immobile elements (Ca, S, Fe, B) stay put, so deficiency shows on young leaves.','गतिशील तत्व (N, P, K, Mg) पुरानी से नई पत्तियों में चले जाते हैं, इसलिए कमी पहले पुरानी पत्तियों में दिखती है। अगतिशील तत्व (Ca, S, Fe, B) अपनी जगह रहते हैं, इसलिए कमी नई पत्तियों में दिखती है।'],
 m:['Too much of an element is toxic. Excess manganese, for example, can cause iron and magnesium deficiency symptoms.','किसी तत्व की अधिकता विषैली होती है। जैसे मैंगनीज़ की अधिकता से आयरन व मैग्नीशियम की कमी जैसे लक्षण आ सकते हैं।'],
 c:['Which leaves are affected is the best clue to the cause, but several deficiencies look alike, so a soil or tissue test is needed to be sure.','कौन-सी पत्तियाँ प्रभावित हैं यह कारण का सबसे अच्छा संकेत है, पर कई कमियाँ एक जैसी दिखती हैं, इसलिए पक्का करने के लिए मृदा या ऊतक जाँच चाहिए।']}},
{id:'ncycle',n:['Nitrogen cycle','नाइट्रोजन चक्र'],v:()=>pvCycle([['N₂ (air)','N₂ (वायु)','x'],['NH₄⁺','NH₄⁺','x'],['NO₃⁻','NO₃⁻','x']],[['fixation','स्थिरीकरण'],['nitrification','नाइट्रीकरण'],['denitrification','विनाइट्रीकरण']]),f:{
 d:['Fixation: N₂ becomes ammonia (by bacteria, lightning or industry). Ammonification: decomposers turn organic nitrogen into NH₄⁺. Nitrification: NH₄⁺ → NO₂⁻ (Nitrosomonas) → NO₃⁻ (Nitrobacter). Assimilation: plants take up NO₃⁻ or NH₄⁺ to make amino acids. Denitrification: NO₃⁻ → N₂ (Pseudomonas, Thiobacillus), common in waterlogged soil.','स्थिरीकरण: N₂ अमोनिया बनती है (जीवाणु, बिजली या उद्योग द्वारा)। अमोनीकरण: अपघटक कार्बनिक नाइट्रोजन को NH₄⁺ में बदलते हैं। नाइट्रीकरण: NH₄⁺ → NO₂⁻ (नाइट्रोसोमोनास) → NO₃⁻ (नाइट्रोबैक्टर)। स्वांगीकरण: पौधे NO₃⁻ या NH₄⁺ लेकर अमीनो अम्ल बनाते हैं। विनाइट्रीकरण: NO₃⁻ → N₂ (स्यूडोमोनास, थायोबैसिलस), जलमग्न मिट्टी में आम।'],
 c:['The diagram shows the main loop; assimilation and ammonification join it from the plant and decomposer side.','चित्र मुख्य चक्र दिखाता है; स्वांगीकरण और अमोनीकरण पौधों और अपघटकों की ओर से इससे जुड़ते हैं।']}},
{id:'bnf',n:['Biological nitrogen fixation','जैविक नाइट्रोजन स्थिरीकरण'],f:{
 d:['Only some prokaryotes can fix N₂, using the enzyme nitrogenase: N₂ + 8e⁻ + 8H⁺ + 16 ATP → 2NH₃ + H₂ + 16 ADP + 16 Pᵢ.','केवल कुछ प्रोकैरियोट नाइट्रोजिनेज़ एंज़ाइम से N₂ स्थिर कर सकते हैं: N₂ + 8e⁻ + 8H⁺ + 16 ATP → 2NH₃ + H₂ + 16 ADP + 16 Pᵢ।'],
 t:['Symbiotic: Rhizobium in legume nodules, which keep oxygen low with leghaemoglobin. Free-living: Azotobacter, Azospirillum, and cyanobacteria such as Nostoc and Anabaena (in Azolla).','सहजीवी: दलहन की ग्रंथियों में राइज़ोबियम, जो लेगहीमोग्लोबिन से ऑक्सीजन कम रखते हैं। स्वतंत्र: एज़ोटोबैक्टर, एज़ोस्पिरिलम और सायनोबैक्टीरिया जैसे नॉस्टॉक व एनाबीना (एज़ोला में)।'],
 m:['Ammonia is used to make glutamic acid, then other amino acids by transamination. Asparagine and glutamine carry nitrogen around the plant.','अमोनिया से ग्लूटैमिक अम्ल बनता है, फिर ट्रांसएमिनेशन से अन्य अमीनो अम्ल। एस्पैरेजिन और ग्लूटामिन पौधे में नाइट्रोजन ले जाते हैं।']}}
]});




function pvSig(){const L=PV.L,X=t=>20+t*210,Y=v=>90-v*70,pts=Array.from({length:41},(_,i)=>{const t=i/40;return X(t).toFixed(1)+','+Y(1/(1+Math.exp(-(t-.5)*10))).toFixed(1)}).join(' ');
  return [[0,.3,'#e1f5fe',L('Lag','मंद')],[.3,.7,'#c8e6c9',L('Log (exponential)','चरघातांकी')],[.7,1,'#fff9c4',L('Stationary','स्थिर')]].map(z=>`<rect x="${X(z[0])}" y="15" width="${X(z[1])-X(z[0])}" height="75" fill="${z[2]}"/><text x="${(X(z[0])+X(z[1]))/2}" y="25" font-size="6.5" text-anchor="middle" fill="#1b1b1b">${z[3]}</text>`).join('')
   +`<line x1="20" y1="90" x2="230" y2="90" stroke="var(--fg)" stroke-width=".7"/><line x1="20" y1="15" x2="20" y2="90" stroke="var(--fg)" stroke-width=".7"/><polyline fill="none" stroke="#2e7d32" stroke-width="1.8" points="${pts}"/>`
   +`<text x="125" y="104" font-size="6" text-anchor="middle" fill="var(--fg)">${L('Time','समय')}</text><text x="8" y="55" font-size="6" fill="var(--fg)" transform="rotate(-90 8 55)" text-anchor="middle">${L('Size','आकार')}</text>`}
PV.theory.add({id:'growth',i:'📈',n:['Growth and hormones','वृद्धि और हार्मोन'],t:[
{id:'gphases',n:['Growth phases and the growth curve','वृद्धि की अवस्थाएँ और वृद्धि वक्र'],v:pvSig,f:{
 d:['Growth is a permanent increase in size. In a root or shoot tip it has three zones: cell division (meristematic), elongation, and maturation.','वृद्धि आकार में स्थायी बढ़ोतरी है। जड़ या प्ररोह के सिरे पर तीन क्षेत्र होते हैं: कोशिका विभाजन (विभज्योतकी), दीर्घन और परिपक्वन।'],
 m:['A whole organism or organ follows an S-shaped (sigmoid) curve: slow lag phase, fast log phase, then a stationary phase as growth slows.','पूरा जीव या अंग S-आकार (सिग्मॉइड) वक्र पर चलता है: धीमी मंद अवस्था, तेज़ चरघातांकी अवस्था, फिर वृद्धि धीमी होकर स्थिर अवस्था।'],
 c:['Plants keep growing throughout life from meristems (open growth). Plasticity lets one plant take different forms, such as heterophylly.','पौधे जीवन भर विभज्योतकों से बढ़ते रहते हैं (अनिश्चित वृद्धि)। प्लास्टिसिटी से एक ही पौधा अलग रूप ले सकता है, जैसे विषमपर्णता।']}},
{id:'grates',n:['Growth rates and types','वृद्धि दर और प्रकार'],f:{
 d:['Absolute growth rate (AGR) = increase in size ÷ time. Relative growth rate (RGR) = increase ÷ initial size ÷ time, often as a percentage.','निरपेक्ष वृद्धि दर (AGR) = आकार में वृद्धि ÷ समय। सापेक्ष वृद्धि दर (RGR) = वृद्धि ÷ प्रारंभिक आकार ÷ समय, प्रायः प्रतिशत में।'],
 t:['Arithmetic growth: only one daughter cell keeps dividing, so length rises steadily (Lt = L₀ + rt), as in a root growing at constant rate. Geometric growth: both daughter cells divide, so growth is exponential (W₁ = W₀eʳᵗ).','अंकगणितीय वृद्धि: केवल एक पुत्री कोशिका विभाजित होती रहती है, इसलिए लंबाई एक-सी दर से बढ़ती है (Lt = L₀ + rt)। ज्यामितीय वृद्धि: दोनों पुत्री कोशिकाएँ विभाजित होती हैं, इसलिए वृद्धि चरघातांकी (W₁ = W₀eʳᵗ)।'],
 x:['Try the Numericals lab for AGR and RGR sums.','AGR और RGR के प्रश्नों के लिए अंकगणित प्रयोगशाला आज़माएँ।'],
 c:['A seedling that adds 2 cm to 4 cm and one that adds 2 cm to 40 cm have the same AGR but very different RGR.','जो अंकुर 4 सेमी में 2 सेमी जोड़ता है और जो 40 सेमी में 2 सेमी जोड़ता है, उनकी AGR समान पर RGR बहुत अलग होती है।']}},
{id:'auxin',n:['Auxins','ऑक्सिन'],f:{
 s:['Made in shoot tips and young leaves (IAA). Moves from tip to base (polar transport). Others: IBA, NAA, 2,4-D.','प्ररोह के सिरे और नई पत्तियों में बनता है (IAA)। सिरे से आधार की ओर जाता है (ध्रुवीय परिवहन)। अन्य: IBA, NAA, 2,4-D।'],
 m:['Cell elongation, apical dominance, roots on cuttings, flowering in pineapple, parthenocarpy, and delaying fall of young leaves and fruits.','कोशिका दीर्घन, शीर्ष प्रभाविता, कलम में जड़ें, अनानास में पुष्पन, अनिषेकफलन, और नई पत्तियों व फलों का झड़ना टालना।'],
 x:['2,4-D kills broad-leaved (dicot) weeds in cereal fields. Went’s Avena curvature test measured auxin.','2,4-D अनाज के खेत में चौड़ी पत्ती (द्विबीजपत्री) खरपतवार मारता है। वेंट के जई (एवेना) परीक्षण से ऑक्सिन मापा गया।']}},
{id:'gibb',n:['Gibberellins','जिबरेलिन'],f:{
 s:['Made in young leaves and embryos. First found from the fungus Gibberella (bakanae disease of rice).','नई पत्तियों और भ्रूण में बनता है। सबसे पहले कवक जिबरेला (धान का बकानी रोग) से मिला।'],
 m:['Stem elongation (bolting in rosette plants like cabbage), breaking seed dormancy, α-amylase in barley seeds for malting, and seedless fruit.','तने का दीर्घन (पत्तागोभी जैसे रोज़ेट पौधों में बोल्टिंग), बीज की सुषुप्ति तोड़ना, माल्टिंग के लिए जौ में α-एमाइलेज़, और बीज-रहित फल।'],
 x:['Sprayed on sugarcane to raise stem length and sugar yield, and on grapes to lengthen stalks.','गन्ने पर छिड़कने से तने की लंबाई और चीनी उपज बढ़ती है, अंगूर पर डंठल लंबे होते हैं।']}},
{id:'cytok',n:['Cytokinins','साइटोकाइनिन'],f:{
 s:['Made where cells divide fast: root tips, young fruits, shoot buds. Kinetin came from herring-sperm DNA; zeatin from maize.','जहाँ कोशिकाएँ तेज़ी से विभाजित होती हैं वहाँ बनते हैं: जड़ का सिरा, कच्चे फल, प्ररोह कलियाँ। काइनेटिन हेरिंग मछली के शुक्राणु DNA से मिला; ज़ीएटिन मक्के से।'],
 m:['Cell division, new shoots in tissue culture, release of side buds (against apical dominance) and slowing leaf ageing.','कोशिका विभाजन, ऊतक संवर्धन में नए प्ररोह, पार्श्व कलियों का खुलना (शीर्ष प्रभाविता के विरुद्ध) और पत्ती का बूढ़ा होना धीमा करना।'],
 c:['More auxin than cytokinin favours roots; more cytokinin favours shoots (Skoog and Miller).','कम साइटोकाइनिन और अधिक ऑक्सिन से जड़ें; अधिक साइटोकाइनिन से प्ररोह बनते हैं (स्कूग व मिलर)।']}},
{id:'aba',n:['Abscisic acid (ABA)','एब्सिसिक अम्ल (ABA)'],f:{
 s:['Made in leaves (in chloroplasts) and rises under stress, so it is called the stress hormone.','पत्तियों में (हरितलवकों में) बनता है और तनाव में बढ़ता है, इसलिए इसे तनाव हार्मोन कहते हैं।'],
 m:['Closes stomata in water stress, helps seeds mature and stay dormant, and slows growth.','जल-तनाव में रंध्र बंद करता है, बीजों को परिपक्व होने व सुषुप्त रहने में मदद करता है और वृद्धि धीमी करता है।'],
 c:['ABA works against gibberellins in seed dormancy and germination.','बीज की सुषुप्ति और अंकुरण में ABA, जिबरेलिन के विपरीत काम करता है।']}},
{id:'ethylene',n:['Ethylene','एथिलीन'],f:{
 s:['A gas made in ripening fruits and ageing tissues.','पके फलों और बूढ़े होते ऊतकों में बनने वाली गैस।'],
 m:['Fruit ripening, leaf and flower fall (abscission), ageing, breaking dormancy in potato tubers and peanut seeds, and flowering in mango and pineapple.','फल पकना, पत्ती-फूल झड़ना (विलगन), बुढ़ापा, आलू के कंद और मूँगफली के बीज की सुषुप्ति तोड़ना, और आम व अनानास में पुष्पन।'],
 x:['Ethephon, a liquid that releases ethylene, is sprayed on fruits to ripen them.','एथेफॉन, जो एथिलीन छोड़ता है, फलों को पकाने के लिए छिड़का जाता है।'],
 c:['One ripe fruit can ripen others nearby because ethylene is a gas.','एक पका फल पास के फलों को पका सकता है क्योंकि एथिलीन गैस है।']}},
{id:'hormsum',n:['Hormones at a glance','हार्मोन एक नज़र में'],
 tb:{h:[['Hormone','हार्मोन'],['Chief effect','मुख्य प्रभाव'],['Made in','कहाँ बनता है']],r:[
  [['Auxin','ऑक्सिन'],['Elongation, apical dominance','दीर्घन, शीर्ष प्रभाविता'],['Shoot tip','प्ररोह सिरा']],[['Gibberellin','जिबरेलिन'],['Stem growth, break dormancy','तना वृद्धि, सुषुप्ति भंग'],['Young leaves, embryo','नई पत्तियाँ, भ्रूण']],
  [['Cytokinin','साइटोकाइनिन'],['Cell division, delay ageing','कोशिका विभाजन, बुढ़ापा टालना'],['Root tip','जड़ का सिरा']],[['ABA','ABA'],['Stomatal closure, dormancy','रंध्र बंद, सुषुप्ति'],['Leaves','पत्तियाँ']],
  [['Ethylene','एथिलीन'],['Ripening, abscission','पकना, विलगन'],['Ripe fruit, old tissue','पका फल, पुराना ऊतक']]]}},
{id:'tropism',n:['Tropisms','अनुवर्तन'],f:{
 d:['Directional growth in response to a stimulus: phototropism (light), gravitropism (gravity), hydrotropism (water), thigmotropism (touch).','उद्दीपन के प्रति दिशात्मक वृद्धि: प्रकाशानुवर्तन (प्रकाश), गुरुत्वानुवर्तन (गुरुत्व), जलानुवर्तन (जल), स्पर्शानुवर्तन (स्पर्श)।'],
 m:['Auxin moves to the shaded side of a shoot, so cells there elongate more and the shoot bends toward light. Roots are the opposite: they bend away from light and toward gravity and water.','ऑक्सिन प्ररोह की छायादार ओर चला जाता है, वहाँ की कोशिकाएँ अधिक लंबी होती हैं और प्ररोह प्रकाश की ओर मुड़ता है। जड़ें उलटी हैं: वे प्रकाश से दूर और गुरुत्व व पानी की ओर मुड़ती हैं।'],
 e:['Tendrils coil by touch (thigmotropism). Darwin’s canary-grass coleoptile experiment showed that the tip senses light.','प्रतान स्पर्श से लिपटते हैं (स्पर्शानुवर्तन)। डार्विन के कैनरी-घास कोलियोप्टाइल प्रयोग ने दिखाया कि सिरा प्रकाश को महसूस करता है।']}},
{id:'photoper',n:['Photoperiodism and vernalisation','दीप्तिकालिता और बसंतीकरण'],f:{
 t:['Short-day plants flower when nights are long enough (rice, chrysanthemum, Xanthium). Long-day plants need short nights (wheat, spinach). Day-neutral plants flower regardless (tomato, maize, cotton).','लघु-दिवस पौधे तब फूलते हैं जब रातें पर्याप्त लंबी हों (धान, गुलदाउदी, ज़ैन्थियम)। दीर्घ-दिवस पौधों को छोटी रातें चाहिए (गेहूँ, पालक)। दिवस-उदासीन पौधे किसी भी स्थिति में फूलते हैं (टमाटर, मक्का, कपास)।'],
 m:['Leaves sense the night length with phytochrome. Vernalisation is a cold treatment that lets some plants flower, such as winter wheat and biennials like cabbage and carrot.','पत्तियाँ फाइटोक्रोम से रात की लंबाई जानती हैं। बसंतीकरण वह ठंडा उपचार है जिससे कुछ पौधे फूलते हैं, जैसे शीतकालीन गेहूँ और द्विवर्षी पौधे (पत्तागोभी, गाजर)।'],
 c:['It is the length of the uninterrupted dark period that matters. A flash of light in the night can stop a short-day plant from flowering.','मायने रखती है बिना रुकावट वाले अंधकार की अवधि। रात में प्रकाश की एक झलक लघु-दिवस पौधे को फूलने से रोक सकती है।']}},
{id:'senesc',n:['Senescence and abscission','जीर्णता और विलगन'],f:{
 d:['Senescence is programmed ageing. Chlorophyll breaks down, leaves turn yellow and nutrients move back into the plant.','जीर्णता योजनाबद्ध बुढ़ापा है। क्लोरोफिल टूटता है, पत्तियाँ पीली पड़ती हैं और पोषक तत्व पौधे में वापस चले जाते हैं।'],
 m:['Abscission: an abscission layer forms at the base of a leaf, flower or fruit stalk and the part falls. Ethylene and ABA promote this; auxin and cytokinin delay it.','विलगन: पत्ती, फूल या फल के डंठल के आधार पर विलगन परत बनती है और वह भाग गिर जाता है। एथिलीन व ABA इसे बढ़ाते हैं; ऑक्सिन व साइटोकाइनिन इसे टालते हैं।']}}
]});




function pvEs(){const L=PV.L,N=[1,2,4,8];let s='';
  N.forEach((n,i)=>{const cx=30+i*62;s+=`<ellipse cx="${cx}" cy="50" rx="15" ry="30" fill="#f8bbd0" stroke="var(--fg)" stroke-width=".8"/>`;
    const pos=n===1?[[0,0]]:n===2?[[0,-18],[0,18]]:n===4?[[-5,-20],[5,-20],[-5,20],[5,20]]:[[-5,-24],[5,-24],[-5,-15],[5,-15],[-5,15],[5,15],[-5,24],[5,24]];
    pos.forEach(p=>{s+=`<circle cx="${cx+p[0]}" cy="${50+p[1]}" r="2.6" fill="#6a1b9a"/>`});
    s+=`<text x="${cx}" y="92" font-size="6.5" text-anchor="middle" fill="var(--fg)">${n} ${L(n===1?'nucleus':'nuclei','केंद्रक')}</text>`;
    if(i<3)s+=`<text x="${cx+31}" y="44" font-size="6" text-anchor="middle" fill="var(--muted)">→</text><text x="${cx+31}" y="53" font-size="5" text-anchor="middle" fill="var(--muted)">${L('mitosis','समसूत्रण')}</text>`});
  return s+`<text x="120" y="104" font-size="6" text-anchor="middle" fill="var(--fg)">${L('8 nuclei become 7 cells: egg apparatus (3), central cell (1), antipodals (3)','8 केंद्रक → 7 कोशिकाएँ: अंड उपकरण (3), केंद्रीय कोशिका (1), प्रतिव्यासांत (3)')}</text>`}
PV.theory.add({id:'repro',i:'🌼',n:['Reproduction in detail','जनन विस्तार से'],t:[
{id:'microspor',n:['Microsporogenesis and pollen','लघुबीजाणुजनन और परागकण'],sc:['anther','pollen'],f:{
 d:['Inside each pollen sac, pollen mother cells (2n) divide by meiosis to form tetrads of four haploid microspores. The tetrad separates and each microspore grows into a pollen grain.','हर परागकोष में परागमातृ कोशिकाएँ (2n) अर्धसूत्रण से चार अगुणित लघुबीजाणुओं की चतुष्क बनाती हैं। चतुष्क अलग होता है और हर लघुबीजाणु परागकण बन जाता है।'],
 m:['The tapetum feeds the developing pollen. The microspore nucleus divides unequally (microgametogenesis) into a large vegetative cell and a small generative cell. This is the male gametophyte.','टेपेटम विकसित होते पराग को पोषण देता है। लघुबीजाणु का केंद्रक असमान रूप से विभाजित होता है (लघुयुग्मकजनन): बड़ी कायिक कोशिका और छोटी जनन कोशिका। यही नर युग्मकोद्भिद है।'],
 x:['Pollen can be stored in liquid nitrogen (–196 °C) in pollen banks for later breeding.','परागकणों को पराग बैंक में तरल नाइट्रोजन (–196 °C) में रखकर बाद में प्रजनन के काम में लिया जा सकता है।'],
 c:['A pollen grain is a gametophyte, not a gamete. Rice and wheat pollen lose viability within about 30 minutes.','परागकण युग्मकोद्भिद है, युग्मक नहीं। धान और गेहूँ का पराग लगभग 30 मिनट में अपनी जीवनक्षमता खो देता है।']}},
{id:'megaspor',n:['Megasporogenesis','गुरुबीजाणुजनन'],sc:['ovule'],f:{
 d:['One megaspore mother cell (2n) in the nucellus near the micropyle divides by meiosis into four haploid megaspores.','बीजांडकाय में बीजांडद्वार के पास एक गुरुबीजाणु मातृ कोशिका (2n) अर्धसूत्रण से चार अगुणित गुरुबीजाणु बनाती है।'],
 m:['Three megaspores (towards the micropyle) degenerate. One, at the chalazal end, stays functional and goes on to form the female gametophyte.','तीन गुरुबीजाणु (बीजांडद्वार की ओर वाले) नष्ट हो जाते हैं। निभाग की ओर वाला एक कार्यशील रहता है और मादा युग्मकोद्भिद बनाता है।'],
 c:['Only one of the four megaspores survives, unlike the four useful microspores.','चार गुरुबीजाणुओं में से केवल एक बचता है, जबकि चारों लघुबीजाणु उपयोगी होते हैं।']}},
{id:'esdev',n:['Embryo sac development','भ्रूणकोष का विकास'],v:pvEs,vb:'0 0 240 110',sc:['embryo-sac','fertilisation'],f:{
 m:['The functional megaspore nucleus divides by mitosis three times: 1 → 2 → 4 → 8 nuclei. Four go to each pole. One from each pole moves to the centre as the polar nuclei. Cell walls form, giving 7 cells.','कार्यशील गुरुबीजाणु का केंद्रक तीन बार समसूत्रण से विभाजित होता है: 1 → 2 → 4 → 8 केंद्रक। हर ध्रुव पर चार जाते हैं। हर ध्रुव से एक केंद्रक ध्रुवीय केंद्रक बनकर बीच में आता है। भित्तियाँ बनने पर 7 कोशिकाएँ मिलती हैं।'],
 e:['This is the Polygonum (monosporic) type, the most common. The embryo sac is the female gametophyte.','यह पॉलीगोनम (एकबीजाणुक) प्रकार है, जो सबसे आम है। भ्रूणकोष मादा युग्मकोद्भिद है।'],
 c:['7 cells but 8 nuclei: the central cell holds two nuclei.','7 कोशिकाएँ पर 8 केंद्रक: केंद्रीय कोशिका में दो केंद्रक होते हैं।']}},
{id:'pollination',n:['Pollination types and agents','परागण के प्रकार और कारक'],f:{
 t:['Autogamy: same flower (cleistogamous flowers never open: Viola, Oxalis, Commelina). Geitonogamy: another flower of the same plant. Xenogamy: a different plant, the only type that brings new genes.','स्वपरागण: उसी फूल में (अनुन्मीलिक पुष्प कभी नहीं खुलते: वायोला, ऑक्सेलिस, कमेलिना)। सजातपुष्पी परागण: उसी पौधे के दूसरे फूल में। परनिषेचन: दूसरे पौधे के फूल में, केवल यही नए जीन लाता है।'],
 m:['Wind: light dry pollen, feathery stigma (maize). Water: Vallisneria, Hydrilla. Insects: bright, scented flowers with nectar and sticky pollen. Birds and bats pollinate large flowers.','वायु: हल्का सूखा पराग, पंखदार वर्तिकाग्र (मक्का)। जल: वैलिसनेरिया, हाइड्रिला। कीट: चटक, सुगंधित फूल, मकरंद और चिपचिपा पराग। पक्षी और चमगादड़ बड़े फूलों में परागण करते हैं।'],
 c:['Geitonogamy is genetically like self-pollination, even though a pollinator is needed.','सजातपुष्पी परागण आनुवंशिक रूप से स्वपरागण जैसा है, भले ही परागणकर्ता चाहिए।']}},
{id:'outbreed',n:['Outbreeding devices','परनिषेचन के साधन'],f:{
 t:['Pollen and stigma ripen at different times (dichogamy). Anther and stigma sit at different places (herkogamy). Self-incompatibility blocks own pollen. Unisexual flowers: monoecious plants (castor, maize) avoid autogamy; dioecious plants (papaya) avoid both autogamy and geitonogamy.','पराग और वर्तिकाग्र अलग समय पर परिपक्व होते हैं (डाइकोगैमी)। परागकोश और वर्तिकाग्र अलग स्थान पर (हर्कोगैमी)। स्व-असंगति अपने परागकणों को रोकती है। एकलिंगी पुष्प: एकलिंगाश्रयी पौधे (अरंडी, मक्का) स्वपरागण से बचते हैं; द्विलिंगाश्रयी (पपीता) स्वपरागण और सजातपुष्पी परागण दोनों से बचते हैं।'],
 c:['Monoecious plants still allow geitonogamy; only dioecious plants prevent it.','एकलिंगाश्रयी पौधों में सजातपुष्पी परागण हो सकता है; इसे केवल द्विलिंगाश्रयी रोकते हैं।']}},
{id:'pollpistil',n:['Pollen–pistil interaction','पराग-स्त्रीकेसर अन्योन्यक्रिया'],f:{
 m:['The stigma recognises pollen by chemical signals. If compatible, the pollen germinates and the tube grows down the style, guided by chemicals, enters through the micropyle and bursts in a synergid. If incompatible, the pollen is stopped (self-incompatibility).','वर्तिकाग्र रासायनिक संकेतों से पराग को पहचानता है। संगत हो तो पराग अंकुरित होता है और नलिका रसायनों के निर्देश पर वर्तिका में नीचे बढ़ती, बीजांडद्वार से घुसती और सहायक कोशिका में फटती है। असंगत हो तो पराग रोक दिया जाता है (स्व-असंगति)।'],
 x:['Plant breeders emasculate (remove anthers), bag the flower, dust chosen pollen, and bag again to make controlled crosses.','प्रजनक पुंकेसर हटाते हैं (विपुंसन), फूल को थैली से ढकते हैं, चुना हुआ पराग डालते हैं और फिर ढक देते हैं, ताकि नियंत्रित संकरण हो।']}}
]});




PV.theory.add({id:'gen',i:'🧫',n:['Genetics and biotechnology','आनुवंशिकी और जैव-प्रौद्योगिकी'],t:[
{id:'dnarna',n:['DNA, RNA and gene expression','DNA, RNA और जीन अभिव्यक्ति'],f:{
 d:['DNA is a double helix of nucleotides (sugar, phosphate, base) with A–T and G–C pairing. A gene is a stretch of DNA that codes for a protein or RNA.','DNA न्यूक्लियोटाइडों (शर्करा, फॉस्फेट, क्षारक) की द्विकुंडली है जिसमें A–T और G–C जोड़े बनते हैं। जीन DNA का वह खंड है जो प्रोटीन या RNA को कोड करता है।'],
 m:['Transcription: RNA polymerase copies DNA into mRNA. Translation: ribosomes read mRNA codons (three bases each) and tRNA brings amino acids to build the protein. The code is nearly universal.','अनुलेखन: RNA पॉलीमरेज़ DNA से mRNA बनाता है। अनुवादन: राइबोसोम mRNA के कोडॉन (तीन क्षारक) पढ़ते हैं और tRNA अमीनो अम्ल लाकर प्रोटीन बनाता है। कोड लगभग सार्वत्रिक है।'],
 s:['Plant cells carry DNA in the nucleus, chloroplasts and mitochondria.','पादप कोशिका में DNA केंद्रक, हरितलवक और माइटोकॉन्ड्रिया में होता है।']}},
{id:'mendel',n:['Mendel’s laws','मेंडल के नियम'],f:{
 d:['Dominance: in a hybrid only the dominant trait shows. Segregation: the two alleles separate into different gametes. Independent assortment: genes for different traits are inherited independently.','प्रभाविता: संकर में केवल प्रभावी लक्षण दिखता है। पृथक्करण: दो युग्मविकल्पी अलग-अलग युग्मकों में जाते हैं। स्वतंत्र अपव्यूहन: अलग लक्षणों के जीन स्वतंत्र रूप से विरासत में मिलते हैं।'],
 t:['Monohybrid Tt × Tt: 3 tall : 1 dwarf (genotypes 1 TT : 2 Tt : 1 tt). Dihybrid: 9 : 3 : 3 : 1. A test cross with the recessive parent shows whether a tall plant is TT or Tt.','एकसंकर Tt × Tt: 3 लंबे : 1 बौना (जीनोटाइप 1 TT : 2 Tt : 1 tt)। द्विसंकर: 9 : 3 : 3 : 1। अप्रभावी जनक से परीक्षण संकरण बताता है कि लंबा पौधा TT है या Tt।'],
 e:['Mendel studied seven pairs of traits in garden pea (Pisum sativum), such as tall/dwarf and round/wrinkled seeds.','मेंडल ने उद्यान मटर (पाइसम सैटाइवम) में सात जोड़े लक्षण पढ़े, जैसे लंबा/बौना और गोल/झुर्रीदार बीज।'],
 x:['Try the ratio sums in the Numericals lab.','अनुपात के प्रश्न अंकगणित प्रयोगशाला में आज़माएँ।']}},
{id:'linkage',n:['Linkage and recombination','सहलग्नता और पुनर्संयोजन'],f:{
 d:['Genes on the same chromosome tend to be inherited together (linkage). Crossing over can separate them (recombination).','एक ही गुणसूत्र के जीन साथ-साथ विरासत में मिलते हैं (सहलग्नता)। जीन विनिमय उन्हें अलग कर सकता है (पुनर्संयोजन)।'],
 m:['The farther apart two genes are, the more often they recombine. Recombination frequency is used to draw genetic maps.','दो जीन जितनी दूर होंगे, उनका पुनर्संयोजन उतना अधिक होगा। पुनर्संयोजन आवृत्ति से आनुवंशिक मानचित्र बनते हैं।'],
 c:['Linked genes are not always inherited together; crossing over breaks some links.','सहलग्न जीन हमेशा साथ नहीं जाते; जीन विनिमय कुछ संबंध तोड़ता है।']}},
{id:'polyploid',n:['Polyploidy and mutation','बहुगुणिता और उत्परिवर्तन'],f:{
 d:['Euploidy is a change in whole chromosome sets (3n, 4n: polyploidy). Aneuploidy is a gain or loss of single chromosomes. A mutation is a sudden heritable change in DNA.','सुगुणिता पूरे गुणसूत्र समूहों में बदलाव है (3n, 4n: बहुगुणिता)। विषमगुणिता एक-एक गुणसूत्र का बढ़ना या घटना है। उत्परिवर्तन DNA में अचानक वंशागत बदलाव है।'],
 e:['Bread wheat is hexaploid (6n). Banana is triploid and so seedless. Colchicine doubles chromosome number.','डबलरोटी का गेहूँ षट्गुणित (6n) है। केला त्रिगुणित है, इसलिए बीज-रहित। कोल्चिसिन गुणसूत्र संख्या दोगुनी करता है।'],
 x:['Mutation breeding uses radiation or chemicals to make useful mutants.','उत्परिवर्तन प्रजनन में विकिरण या रसायनों से उपयोगी उत्परिवर्तक बनाए जाते हैं।']}},
{id:'breeding',n:['Plant breeding','पादप प्रजनन'],f:{
 m:['Steps: collect variability (germplasm), evaluate and select parents, cross-hybridise, select and test the best recombinants, then release and multiply the new variety.','चरण: विविधता (जननद्रव्य) संग्रह, जनकों का मूल्यांकन व चयन, संकरण, सर्वोत्तम पुनर्संयोजकों का चयन व परीक्षण, फिर नई किस्म को जारी करना और बढ़ाना।'],
 e:['Green Revolution: semi-dwarf wheat (Norman Borlaug; Sonalika, Kalyan Sona) and rice (IR8, Jaya). Short plants do not fall over under heavy grain.','हरित क्रांति: अर्ध-बौना गेहूँ (नॉर्मन बोरलॉग; सोनालिका, कल्याण सोना) और धान (IR8, जया)। छोटे पौधे भारी दानों में गिरते नहीं।'],
 x:['Biofortification breeds crops with more protein, vitamins or minerals. Disease-resistant varieties cut pesticide use.','जैव-संवर्धन से अधिक प्रोटीन, विटामिन या खनिज वाली फसलें बनती हैं। रोग-प्रतिरोधी किस्में कीटनाशक का उपयोग घटाती हैं।']}},
{id:'tissueculture',n:['Tissue culture and micropropagation','ऊतक संवर्धन और सूक्ष्मप्रवर्धन'],f:{
 m:['A small piece (explant) is grown on sterile medium with sugar, minerals, vitamins and hormones. It forms an undifferentiated callus, which is moved to a medium that makes it form shoots and roots. The plantlets are hardened and planted out.','एक छोटा टुकड़ा (एक्सप्लांट) शर्करा, खनिज, विटामिन और हार्मोन वाले निर्जर्म माध्यम पर उगाया जाता है। वह अविभेदित कैलस बनाता है, जिसे दूसरे माध्यम में शाखा और जड़ बनाने दिया जाता है। पौधों को सख्त करके खेत में लगाया जाता है।'],
 x:['Used for banana and orchids, for virus-free plants (shoot-tip meristem has no virus), somatic embryogenesis and protoplast fusion.','केला और ऑर्किड के लिए, विषाणु-मुक्त पौधों के लिए (प्ररोह-शीर्ष विभज्योतक में विषाणु नहीं होता), कायिक भ्रूणजनन और प्रोटोप्लास्ट संलयन के लिए।'],
 c:['It depends on totipotency: every living plant cell can in principle regenerate a plant.','यह पूर्णशक्तता पर निर्भर है: हर जीवित पादप कोशिका सिद्धांततः पौधा बना सकती है।']}},
{id:'ge',n:['Genetic engineering and genome editing','आनुवंशिक अभियांत्रिकी और जीनोम संपादन'],f:{
 m:['Agrobacterium tumefaciens moves a piece of its Ti plasmid (T-DNA) into plant DNA. Scientists remove the tumour genes and insert a useful gene. CRISPR-Cas9 uses a guide RNA to take the Cas9 enzyme to a chosen DNA spot, where it cuts so the gene can be switched off or changed.','एग्रोबैक्टीरियम ट्यूमिफेशियंस अपने Ti प्लाज़्मिड का एक भाग (T-DNA) पादप DNA में पहुँचाता है। वैज्ञानिक ट्यूमर वाले जीन हटाकर उपयोगी जीन डालते हैं। CRISPR-Cas9 में गाइड RNA, Cas9 एंज़ाइम को चुने हुए DNA स्थान पर ले जाता है जहाँ वह काटता है, जिससे जीन बंद या बदला जा सकता है।'],
 e:['Bt cotton carries a cry gene from Bacillus thuringiensis that makes a protein harmful to bollworms. Golden rice makes β-carotene.','बीटी कपास में बैसिलस थुरिंजिएंसिस का cry जीन होता है जो सुंडी के लिए हानिकारक प्रोटीन बनाता है। गोल्डन राइस β-कैरोटीन बनाता है।'],
 c:['Genome-edited plants may carry no foreign DNA, but rules differ by country and safety and ethics are still debated.','जीनोम-संपादित पौधों में बाहरी DNA नहीं भी हो सकता, पर नियम देश-देश में अलग हैं और सुरक्षा व नैतिकता पर बहस जारी है।']}}
]});




PV.theory.add({id:'eco',i:'🌍',n:['Ecology and plants','पारिस्थितिकी और पौधे'],t:[
{id:'biomes',n:['Biomes and their plants','बायोम और उनके पौधे'],
 tb:{h:[['Biome','बायोम'],['Climate','जलवायु'],['Typical plants','विशिष्ट पौधे']],r:[
  [['Tropical rainforest','उष्णकटिबंधीय वर्षावन'],['Hot, very wet','गर्म, बहुत नम'],['Tall layered trees, epiphytes, lianas','ऊँचे स्तरित वृक्ष, अधिपादप, लताएँ']],
  [['Savanna and grassland','सवाना व घास के मैदान'],['Warm, seasonal rain','गर्म, मौसमी वर्षा'],['Grasses, scattered trees','घासें, बिखरे वृक्ष']],
  [['Desert','मरुस्थल'],['Hot or cold, very dry','गर्म या ठंडा, बहुत शुष्क'],['Cacti, succulents, thorny shrubs','नागफनी, मांसल पौधे, काँटेदार झाड़ियाँ']],
  [['Temperate forest','शीतोष्ण वन'],['Four seasons','चार ऋतुएँ'],['Deciduous trees (oak, maple)','पर्णपाती वृक्ष (ओक, मेपल)']],
  [['Taiga','टैगा'],['Long cold winters','लंबी ठंडी सर्दियाँ'],['Conifers (pine, spruce)','कोनिफर (चीड़, स्प्रूस)']],
  [['Tundra','टुंड्रा'],['Very cold, frozen soil','बहुत ठंडा, जमी मिट्टी'],['Mosses, lichens, dwarf shrubs','मॉस, लाइकेन, बौनी झाड़ियाँ']]]}},
{id:'interact',n:['Plant interactions','पौधों की पारस्परिक क्रियाएँ'],f:{
 t:['Competition for light, water and nutrients. Mutualism: mycorrhiza (fungus and root), Rhizobium in legumes, lichens, pollinators. Parasitism: Cuscuta. Commensalism: an orchid on a mango branch gains support without harming the tree. Herbivory: plants defend with thorns and chemicals such as nicotine and cyanogenic compounds.','प्रतिस्पर्धा: प्रकाश, पानी और पोषक के लिए। सहोपकारिता: माइकोराइज़ा (कवक और जड़), दलहन में राइज़ोबियम, लाइकेन, परागणकर्ता। परजीविता: कस्कुटा। सहभोजिता: आम की शाखा पर ऑर्किड बिना पेड़ को हानि पहुँचाए सहारा पाता है। शाकाहारिता: पौधे काँटों और निकोटीन, सायनोजेनिक यौगिकों जैसे रसायनों से बचाव करते हैं।'],
 c:['An epiphyte is not a parasite: it takes no food from its host.','अधिपादप परजीवी नहीं है: वह पोषक पौधे से भोजन नहीं लेता।']}},
{id:'dispersal',n:['Seed dispersal','बीज प्रकीर्णन'],
 tb:{h:[['Agent','कारक'],['Seed or fruit feature','बीज या फल की विशेषता'],['Examples','उदाहरण']],r:[
  [['Wind','हवा'],['Wings, hairs, tiny seeds','पंख, रोम, बहुत छोटे बीज'],['Dandelion, Calotropis, Moringa','सिंहपर्णी, आक, सहजन']],
  [['Water','जल'],['Light, floating, waterproof','हल्के, तैरने वाले, जलरोधी'],['Coconut, lotus','नारियल, कमल']],
  [['Animals','जंतु'],['Hooks or sweet fleshy fruit','काँटे या मीठे गूदेदार फल'],['Xanthium, Tribulus, guava','ज़ैन्थियम, गोखरू, अमरूद']],
  [['Explosion','विस्फोट'],['Pods that burst open','फलियाँ जो फटती हैं'],['Balsam, castor, pea','बालसम, अरंडी, मटर']]]},
 f:{c:['Dispersal lowers competition between parent and seedlings and lets plants reach new places.','प्रकीर्णन से माँ-पौधे और अंकुरों में प्रतिस्पर्धा घटती है और पौधे नई जगह पहुँचते हैं।']}},
{id:'carbon',n:['Productivity and the carbon cycle','उत्पादकता और कार्बन चक्र'],f:{
 d:['Gross primary productivity (GPP) is the total organic matter plants make. Net primary productivity (NPP) = GPP – respiration. NPP is what is left to feed herbivores and decomposers.','सकल प्राथमिक उत्पादकता (GPP) पौधों द्वारा बनाया गया कुल कार्बनिक पदार्थ है। शुद्ध प्राथमिक उत्पादकता (NPP) = GPP – श्वसन। NPP ही शाकाहारियों व अपघटकों के लिए बचता है।'],
 m:['Photosynthesis takes CO₂ from the air; respiration, decay and burning return it. Growing forests store carbon in wood and soil.','प्रकाश-संश्लेषण वायु से CO₂ लेता है; श्वसन, सड़न और जलने से वह लौट आती है। बढ़ते वन लकड़ी और मिट्टी में कार्बन संचित करते हैं।']}},
{id:'succession',n:['Ecological succession','पारिस्थितिक अनुक्रमण'],f:{
 d:['Succession is the gradual replacement of one community by another until a stable climax community forms.','अनुक्रमण में एक समुदाय की जगह धीरे-धीरे दूसरा समुदाय लेता है, जब तक स्थिर चरम समुदाय न बन जाए।'],
 t:['Primary: starts on bare rock with no soil. Lichens, then mosses, herbs, shrubs and trees. Secondary: starts where soil remains (after fire or farming), so it is faster. Hydrarch: begins in water; xerarch: begins on dry land.','प्राथमिक: मिट्टी-रहित नंगी चट्टान से शुरू: लाइकेन, फिर मॉस, शाक, झाड़ियाँ, वृक्ष। द्वितीयक: जहाँ मिट्टी बची हो (आग या खेती के बाद), इसलिए तेज़। जलारंभी: जल से शुरू; मरुस्थलीय: सूखी भूमि से शुरू।']}},
{id:'conserve',n:['Conservation and invasive plants','संरक्षण और आक्रामक पौधे'],f:{
 m:['In situ: national parks, sanctuaries, biosphere reserves, sacred groves. Ex situ: botanical gardens, seed banks, cryopreservation. India’s plant hotspots include the Western Ghats, Himalaya and Indo-Burma.','स्वस्थाने: राष्ट्रीय उद्यान, अभयारण्य, जैवमंडल आरक्षित क्षेत्र, पवित्र उपवन। बाह्यस्थाने: वनस्पति उद्यान, बीज बैंक, क्रायोप्रिज़र्वेशन। भारत के जैव-विविधता हॉटस्पॉट में पश्चिमी घाट, हिमालय और इंडो-बर्मा हैं।'],
 e:['Invasive plants: water hyacinth (Eichhornia), Lantana, Parthenium, Prosopis juliflora. They crowd out native plants.','आक्रामक पौधे: जलकुंभी (आइकॉर्निया), लैंटाना, पार्थेनियम, प्रोसोपिस जूलीफ्लोरा। ये देशी पौधों को दबा देते हैं।']}}
]});
PV.theory.add({id:'econ',i:'🌾',n:['Economic botany','आर्थिक वनस्पति विज्ञान'],t:[
{id:'cereals',n:['Cereals, millets and pulses','अनाज, मोटे अनाज और दालें'],
 tb:{h:[['Plant','पौधा'],['Scientific name','वैज्ञानिक नाम'],['Family','कुल'],['Useful part','उपयोगी भाग']],r:[
  [['Wheat','गेहूँ'],['Triticum aestivum','Triticum aestivum'],['Poaceae','Poaceae'],['Grain','दाना']],[['Rice','धान'],['Oryza sativa','Oryza sativa'],['Poaceae','Poaceae'],['Grain','दाना']],
  [['Maize','मक्का'],['Zea mays','Zea mays'],['Poaceae','Poaceae'],['Grain','दाना']],[['Pearl millet (bajra)','बाजरा'],['Pennisetum glaucum','Pennisetum glaucum'],['Poaceae','Poaceae'],['Grain','दाना']],
  [['Gram','चना'],['Cicer arietinum','Cicer arietinum'],['Fabaceae','Fabaceae'],['Seed (dal)','बीज (दाल)']],[['Pigeon pea (arhar)','अरहर'],['Cajanus cajan','Cajanus cajan'],['Fabaceae','Fabaceae'],['Seed (dal)','बीज (दाल)']]]},
 f:{c:['Pulses add nitrogen to the soil through root nodules, so cereals and pulses are rotated.','दालें जड़-ग्रंथियों से मिट्टी में नाइट्रोजन बढ़ाती हैं, इसलिए अनाज और दालों का फसल-चक्र चलता है।']}},
{id:'oilfibre',n:['Oilseeds, fibres, rubber and timber','तिलहन, रेशे, रबर और इमारती लकड़ी'],
 tb:{h:[['Plant','पौधा'],['Scientific name','वैज्ञानिक नाम'],['Family','कुल'],['Product (part)','उत्पाद (भाग)']],r:[
  [['Groundnut','मूँगफली'],['Arachis hypogaea','Arachis hypogaea'],['Fabaceae','Fabaceae'],['Oil (seed)','तेल (बीज)']],[['Mustard','सरसों'],['Brassica juncea','Brassica juncea'],['Brassicaceae','Brassicaceae'],['Oil (seed)','तेल (बीज)']],
  [['Cotton','कपास'],['Gossypium hirsutum','Gossypium hirsutum'],['Malvaceae','Malvaceae'],['Fibre (seed hairs)','रेशा (बीज के रोम)']],[['Jute','जूट'],['Corchorus capsularis','Corchorus capsularis'],['Malvaceae','Malvaceae'],['Fibre (phloem fibres of stem)','रेशा (तने के फ्लोएम तंतु)']],
  [['Rubber','रबर'],['Hevea brasiliensis','Hevea brasiliensis'],['Euphorbiaceae','Euphorbiaceae'],['Latex (stem)','लेटेक्स (तना)']],[['Teak','सागौन'],['Tectona grandis','Tectona grandis'],['Lamiaceae','Lamiaceae'],['Timber (wood)','इमारती लकड़ी']]]}},
{id:'medic',n:['Medicinal plants','औषधीय पौधे'],
 tb:{h:[['Plant','पौधा'],['Scientific name','वैज्ञानिक नाम'],['Useful part and use','उपयोगी भाग व उपयोग']],r:[
  [['Neem','नीम'],['Azadirachta indica','Azadirachta indica'],['Leaves, oil: antiseptic, insect repellent','पत्ती, तेल: जीवाणुनाशक, कीट-विकर्षक']],
  [['Tulsi','तुलसी'],['Ocimum tenuiflorum','Ocimum tenuiflorum'],['Leaves: cough and cold remedies','पत्ती: खाँसी-ज़ुकाम की दवाएँ']],
  [['Sarpagandha','सर्पगंधा'],['Rauvolfia serpentina','Rauvolfia serpentina'],['Root: reserpine for high blood pressure','जड़: उच्च रक्तचाप के लिए रेसरपीन']],
  [['Cinchona','सिनकोना'],['Cinchona officinalis','Cinchona officinalis'],['Bark: quinine against malaria','छाल: मलेरिया के लिए कुनैन']],
  [['Periwinkle (sadabahar)','सदाबहार'],['Catharanthus roseus','Catharanthus roseus'],['Whole plant: vincristine and vinblastine for cancer','पूरा पौधा: कैंसर के लिए विन्क्रिस्टीन व विनब्लास्टीन']]]},
 f:{c:['A plant’s active chemical, not the plant itself, is what is tested and dosed. Do not self-medicate with plants.','परीक्षण और मात्रा पौधे के सक्रिय रसायन की होती है, पौधे की नहीं। पौधों से खुद दवा न लें।']}},
{id:'spices',n:['Spices and beverages','मसाले और पेय'],
 tb:{h:[['Plant','पौधा'],['Scientific name','वैज्ञानिक नाम'],['Family','कुल'],['Useful part','उपयोगी भाग']],r:[
  [['Turmeric','हल्दी'],['Curcuma longa','Curcuma longa'],['Zingiberaceae','Zingiberaceae'],['Rhizome','प्रकंद']],[['Black pepper','काली मिर्च'],['Piper nigrum','Piper nigrum'],['Piperaceae','Piperaceae'],['Dried fruit','सूखा फल']],
  [['Clove','लौंग'],['Syzygium aromaticum','Syzygium aromaticum'],['Myrtaceae','Myrtaceae'],['Flower buds','पुष्प कलियाँ']],[['Cumin','जीरा'],['Cuminum cyminum','Cuminum cyminum'],['Apiaceae','Apiaceae'],['Fruit (seed-like)','फल (बीज-जैसा)']],
  [['Tea','चाय'],['Camellia sinensis','Camellia sinensis'],['Theaceae','Theaceae'],['Young leaves','कोमल पत्तियाँ']],[['Coffee','कॉफ़ी'],['Coffea arabica','Coffea arabica'],['Rubiaceae','Rubiaceae'],['Seeds (beans)','बीज']]]}}
]});




PV.theory.add({id:'path',i:'🩺',n:['Plant pathology','पादप रोग विज्ञान'],t:[
{id:'triangle',n:['Disease triangle and disease cycle','रोग त्रिकोण और रोग चक्र'],f:{
 d:['A disease needs three things together: a susceptible host, a pathogen and a favourable environment (the disease triangle).','रोग के लिए तीन चीज़ें साथ चाहिए: अतिसंवेदनशील पोषक, रोगजनक और अनुकूल वातावरण (रोग त्रिकोण)।'],
 m:['Disease cycle: inoculum arrives, infects (through stomata, wounds or directly), colonises tissue, causes symptoms, makes new spores and spreads by wind, water, insects or seed, then survives in soil, debris or seed.','रोग चक्र: निवेश-द्रव्य (इनोकुलम) पहुँचता है, संक्रमण करता है (रंध्र, घाव या सीधे), ऊतक में फैलता है, लक्षण बनाता है, नए बीजाणु बनाकर हवा, पानी, कीट या बीज से फैलता है, फिर मिट्टी, कचरे या बीज में बचा रहता है।'],
 x:['Break one side of the triangle (resistant variety, drier field, clean seed) and the disease fails.','त्रिकोण की एक भुजा तोड़ दें (प्रतिरोधी किस्म, सूखा खेत, साफ बीज) तो रोग नहीं टिकता।']}},
{id:'pathogens',n:['Kinds of pathogens','रोगजनकों के प्रकार'],
 tb:{h:[['Group','समूह'],['Example disease','उदाहरण रोग'],['How it spreads','कैसे फैलता है']],r:[
  [['Fungi','कवक'],['Rusts, smuts, powdery mildew','रस्ट, स्मट, चूर्णिल आसिता'],['Spores by wind and water','हवा-पानी से बीजाणु']],
  [['Oomycetes','ऊमाइसीट'],['Late blight of potato (Phytophthora)','आलू का पिछेता झुलसा (फाइटोफ्थोरा)'],['Spores in wet weather','नम मौसम में बीजाणु']],
  [['Bacteria','जीवाणु'],['Bacterial blight of rice, citrus canker','धान का जीवाणु झुलसा, नींबू का कैंकर'],['Rain splash, tools, seed','बारिश की छींटें, औज़ार, बीज']],
  [['Viruses','विषाणु'],['Tobacco mosaic, leaf curl','तंबाकू मोज़ेक, पर्ण-कुंचन'],['Insect vectors, sap, seed','कीट वाहक, रस, बीज']],
  [['Nematodes','सूत्रकृमि'],['Root-knot','जड़-गाँठ'],['Soil, planting material','मिट्टी, रोपण सामग्री']]]}},
{id:'defence',n:['How plants defend themselves','पौधे अपना बचाव कैसे करते हैं'],f:{
 t:['Physical: cuticle, thick walls, bark, trichomes. Chemical: tannins, phenolics, phytoalexins and defence proteins. Induced: in the hypersensitive response, cells at the infection site die quickly and wall off the pathogen. Systemic acquired resistance: a signal such as salicylic acid prepares the whole plant for later attacks.','भौतिक: क्यूटिकल, मोटी भित्ति, छाल, रोम। रासायनिक: टैनिन, फीनॉलिक, फाइटोएलेक्सिन और रक्षा प्रोटीन। प्रेरित: अतिसंवेदनशील प्रतिक्रिया में संक्रमण-स्थल की कोशिकाएँ जल्दी मरकर रोगजनक को घेर लेती हैं। प्रणालीगत अर्जित प्रतिरोध: सैलिसिलिक अम्ल जैसा संकेत पूरे पौधे को आगे के हमलों के लिए तैयार करता है।'],
 c:['Plants have no antibodies; their immunity is built into each cell and its signals.','पौधों में प्रतिरक्षी (एंटीबॉडी) नहीं होते; उनकी प्रतिरक्षा हर कोशिका और उसके संकेतों में बनी होती है।']}},
{id:'abiotic',n:['Abiotic disorder or infection?','अजैविक विकार या संक्रमण?'],
 tb:{h:[['Clue','संकेत'],['Abiotic (soil, weather, chemicals)','अजैविक (मिट्टी, मौसम, रसायन)'],['Infectious','संक्रामक']],r:[
  [['Spread','फैलाव'],['Does not spread plant to plant','पौधे से पौधे में नहीं फैलता'],['Spreads over time','समय के साथ फैलता है']],
  [['Pattern','पैटर्न'],['Uniform, follows soil or sprayer lines','एक-सा, मिट्टी या छिड़काव की रेखा के अनुसार'],['Patchy, starts at a few plants','धब्बेदार, कुछ पौधों से शुरू']],
  [['Signs','चिह्न'],['No mould, spores or ooze','फफूँद, बीजाणु या रिसाव नहीं'],['Mould, spores, ooze may be seen','फफूँद, बीजाणु या रिसाव दिख सकता है']]]},
 f:{c:['One symptom rarely proves the cause. Good diagnosis lists possible causes, looks for evidence, and uses a lab test (Koch’s postulates) to prove an infection.','एक लक्षण से कारण शायद ही पक्का होता है। अच्छा निदान संभावित कारण गिनता है, प्रमाण खोजता है और संक्रमण सिद्ध करने के लिए प्रयोगशाला जाँच (कॉख के अभिगृहीत) लेता है।']}},
{id:'idm',n:['Integrated disease management','समेकित रोग प्रबंधन'],f:{
 t:['Cultural: crop rotation, clean seed, field hygiene, spacing. Resistant varieties. Biological: Trichoderma and Pseudomonas fluorescens against soil fungi. Chemical: fungicides such as Bordeaux mixture (copper sulphate and lime), used only when needed. Quarantine stops new diseases entering.','सस्य: फसल-चक्र, साफ बीज, खेत की स्वच्छता, दूरी। प्रतिरोधी किस्में। जैविक: मृदा कवकों के विरुद्ध ट्राइकोडर्मा व स्यूडोमोनास फ्लुरोसेंस। रासायनिक: बोर्डो मिश्रण (कॉपर सल्फेट और चूना) जैसे फफूँदनाशी, केवल आवश्यकता पर। संगरोध नए रोगों को आने से रोकता है।'],
 c:['IPM combines methods and uses chemicals last, to protect crops, soil and people.','IPM कई तरीकों को मिलाता है और रसायन सबसे अंत में प्रयोग करता है, ताकि फसल, मिट्टी और लोग सुरक्षित रहें।']}}
]});
PV.theory.add({id:'prac',i:'🔭',n:['Practical botany','प्रायोगिक वनस्पति विज्ञान'],t:[
{id:'stomprac',n:['Stomata: leaf peel mount','रंध्र: पत्ती का छिलका'],f:{
 m:['Peel the lower epidermis of a Rhoeo or Tradescantia leaf, place it in a drop of water on a slide, add a coverslip without bubbles, and view under 10× then 40×.','रियो या ट्रेडेस्केंशिया की पत्ती की निचली अधिचर्म छीलें, स्लाइड पर पानी की बूँद में रखें, बिना बुलबुले के कवर-स्लिप लगाएँ और 10× फिर 40× पर देखें।'],
 x:['Observe kidney-shaped guard cells around each pore. Stomatal index = stomata ÷ (stomata + epidermal cells) × 100.','हर छिद्र के चारों ओर वृक्क-आकार की रक्षक कोशिकाएँ देखें। रंध्र सूचकांक = रंध्र ÷ (रंध्र + अधिचर्म कोशिकाएँ) × 100।'],
 c:['Common errors: a peel that is too thick, folded, or dried out; counting from one field only.','आम गलतियाँ: छिलका बहुत मोटा, मुड़ा या सूखा; केवल एक क्षेत्र से गिनती।']}},
{id:'tissueprac',n:['Identifying tissues under the microscope','सूक्ष्मदर्शी से ऊतक पहचानना'],f:{
 m:['Cut thin sections of a stem, stain with safranin (lignin turns red) or phloroglucinol with HCl (lignin turns pink-red), and view.','तने की पतली काट लें, सैफ्रेनिन (लिग्निन लाल) या HCl सहित फ्लोरोग्लूसिनॉल (लिग्निन गुलाबी-लाल) से रंगें और देखें।'],
 x:['Parenchyma: thin walls, round. Collenchyma: corners thick. Sclerenchyma and xylem: thick, stained walls.','मृदूतक: पतली भित्ति, गोल। स्थूलकोणोतक: कोनों पर मोटी। दृढ़ोतक और जाइलम: मोटी, रंगी भित्ति।'],
 c:['Describe what you see first (observation), then say what it probably is (inference).','पहले जो दिखे वह लिखें (प्रेक्षण), फिर बताएँ कि वह संभवतः क्या है (निष्कर्ष)।']}},
{id:'plasmprac',n:['Plasmolysis experiment','जीवद्रव्यकुंचन प्रयोग'],f:{
 m:['Mount Rhoeo peels in water (control), then in 5% and 10% salt or sugar solution. Watch the coloured protoplast shrink from the wall. Return the peel to water to see deplasmolysis.','रियो के छिलके पहले पानी में (नियंत्रण), फिर 5% और 10% नमक या शर्करा विलयन में रखें। रंगीन जीवद्रव्य को भित्ति से सिकुड़ते देखें। छिलके को वापस पानी में रखकर विकुंचन देखें।'],
 c:['Stronger solution gives faster and stronger plasmolysis. The water mount is the control.','गाढ़ा विलयन तेज़ और अधिक कुंचन देता है। पानी वाली स्लाइड नियंत्रण है।']}},
{id:'photoprac',n:['Photosynthesis experiments','प्रकाश-संश्लेषण प्रयोग'],f:{
 m:['Light needed: destarch a plant in the dark, cover part of a leaf with black paper, expose to light, test with iodine. Chlorophyll needed: use a variegated leaf. CO₂ needed: keep a leaf in a flask with KOH. O₂ release: count bubbles from Hydrilla under a funnel at different lamp distances.','प्रकाश चाहिए: पौधे को अँधेरे में मंड-रहित करें, पत्ती का भाग काले कागज़ से ढकें, रोशनी दें, आयोडीन से जाँचें। क्लोरोफिल चाहिए: चितकबरी पत्ती लें। CO₂ चाहिए: पत्ती को KOH वाले फ्लास्क में रखें। O₂ निकलना: कीप के नीचे हाइड्रिला के बुलबुले अलग-अलग लैंप-दूरी पर गिनें।'],
 c:['Boil the leaf in alcohol (in a water bath) before the iodine test. Always keep a control leaf.','आयोडीन जाँच से पहले पत्ती को अल्कोहल में (जल-ऊष्मक में) उबालें। नियंत्रण पत्ती ज़रूर रखें।']}},
{id:'transprac',n:['Transpiration experiments','वाष्पोत्सर्जन प्रयोग'],f:{
 m:['Cobalt chloride paper turns from blue to pink on both leaf surfaces, faster on the surface with more stomata. A bell jar over a potted plant fogs up. A potometer measures water uptake under different conditions (light, wind, humidity).','कोबाल्ट क्लोराइड कागज़ पत्ती की दोनों सतहों पर नीले से गुलाबी होता है, अधिक रंध्र वाली सतह पर तेज़। गमले के पौधे पर बेल जार में भाप जमती है। पोटोमीटर अलग स्थितियों (प्रकाश, हवा, नमी) में जल-अवशोषण मापता है।'],
 c:['Cover the pot soil with plastic so only the plant loses water.','गमले की मिट्टी प्लास्टिक से ढकें ताकि पानी केवल पौधे से उड़े।']}},
{id:'germdef',n:['Germination and mineral deficiency','अंकुरण और खनिज कमी'],f:{
 m:['Germination: grow seeds on moist cotton and change one factor (water, air, temperature) at a time; measure radicle length daily. Deficiency: grow seedlings in complete nutrient solution and in solutions that miss one element.','अंकुरण: बीज को नम रूई पर उगाएँ और एक बार में एक कारक (पानी, हवा, तापमान) बदलें; रोज़ मूलांकुर की लंबाई मापें। कमी: पौध को पूरे पोषक विलयन और एक तत्व-रहित विलयनों में उगाएँ।'],
 c:['Keep one complete solution as control and use several seedlings per set. Symptoms take weeks and can look alike.','पूरा विलयन नियंत्रण रखें और हर समूह में कई पौध लें। लक्षण आने में हफ्ते लगते हैं और एक-जैसे दिख सकते हैं।']}},
{id:'flowerprac',n:['Flower dissection and pollen germination','पुष्प विच्छेदन और पराग अंकुरण'],f:{
 m:['Dissect a hibiscus or mustard flower and list sepals, petals, stamens and carpel; write the floral formula. For pollen: dust pollen on a cavity slide with 10% sugar solution and a trace of boric acid; look for pollen tubes after 30–60 minutes.','गुड़हल या सरसों का फूल काटकर बाह्यदल, दल, पुंकेसर और अंडप गिनें; पुष्प सूत्र लिखें। पराग के लिए गर्तिका स्लाइड पर 10% शर्करा विलयन और थोड़ा बोरिक अम्ल लेकर पराग छिड़कें; 30–60 मिनट बाद पराग नलिकाएँ देखें।'],
 c:['Use fresh pollen (for example Vinca or Impatiens); old pollen may not germinate.','ताज़ा पराग लें (जैसे सदाबहार या बालसम); पुराना पराग अंकुरित नहीं हो सकता।']}},
{id:'method',n:['Experimental design and data','प्रयोग की रूपरेखा और आँकड़े'],f:{
 d:['Independent variable: what you change. Dependent variable: what you measure. Controlled variables: everything kept the same. A control set shows what happens without the change.','स्वतंत्र चर: जो आप बदलते हैं। आश्रित चर: जो आप मापते हैं। नियंत्रित चर: जो समान रखे जाते हैं। नियंत्रण समूह दिखाता है कि बदलाव के बिना क्या होता है।'],
 m:['Repeat the test (replicates), record in a table, plot the independent variable on the x-axis and the dependent on the y-axis, and give units. Random errors scatter the readings; systematic errors (such as a wrong zero) shift them all.','परीक्षण दोहराएँ (प्रतिकृति), तालिका में लिखें, स्वतंत्र चर x-अक्ष पर और आश्रित चर y-अक्ष पर रखें, इकाइयाँ लिखें। यादृच्छिक त्रुटियाँ रीडिंग बिखेरती हैं; क्रमबद्ध त्रुटियाँ (जैसे गलत शून्य) सभी को खिसका देती हैं।'],
 c:['A graph shows a link, not always a cause. Say “the data suggest” unless other factors were controlled.','ग्राफ़ संबंध दिखाता है, हमेशा कारण नहीं। जब तक अन्य कारक नियंत्रित न हों, “आँकड़े संकेत देते हैं” कहें।']}}
]});
PV.theory.add({id:'sci',i:'👩‍🔬',n:['Scientists and classic experiments','वैज्ञानिक और प्रसिद्ध प्रयोग'],t:[
{id:'sciplant',n:['Cells, heredity and photosynthesis','कोशिका, आनुवंशिकता और प्रकाश-संश्लेषण'],
 tb:{h:[['Scientist','वैज्ञानिक'],['Year','वर्ष'],['Contribution','योगदान']],r:[
  [['Robert Hooke','रॉबर्ट हुक'],['1665','1665'],['Saw cells in cork','कॉर्क में कोशिकाएँ देखीं']],
  [['Schleiden and Schwann','श्लाइडेन व श्वान'],['1838–39','1838–39'],['Cell theory','कोशिका सिद्धांत']],
  [['Gregor Mendel','ग्रेगर मेंडल'],['1865','1865'],['Laws of inheritance in pea','मटर में वंशागति के नियम']],
  [['Joseph Priestley','जोसेफ प्रीस्टले'],['1771','1771'],['Plants restore air a candle used up','पौधे वह हवा लौटाते हैं जो मोमबत्ती ने खर्च की']],
  [['Jan Ingenhousz','यान इंगेनहौस'],['1779','1779'],['Light and green parts needed','प्रकाश और हरे भाग आवश्यक']],
  [['T. W. Engelmann','टी. डब्ल्यू. एंगेलमान'],['1883','1883'],['Action spectrum of photosynthesis','प्रकाश-संश्लेषण का क्रिया स्पेक्ट्रम']],
  [['F. F. Blackman','एफ. एफ. ब्लैकमैन'],['1905','1905'],['Law of limiting factors','सीमाकारी कारकों का नियम']],
  [['Melvin Calvin and team','मेल्विन केल्विन व दल'],['1950s','1950 का दशक'],['Carbon-fixation cycle (Nobel 1961)','कार्बन स्थिरीकरण चक्र (नोबेल 1961)']],
  [['Hatch and Slack','हैच व स्लैक'],['1966','1966'],['C₄ pathway','C₄ पथ']],
  [['Peter Mitchell','पीटर मिचेल'],['1961','1961'],['Chemiosmotic hypothesis for ATP making','ATP निर्माण की रसोपरासरण परिकल्पना']]]}},
{id:'scitrans',n:['Transport and growth','परिवहन और वृद्धि'],
 tb:{h:[['Scientist','वैज्ञानिक'],['Year','वर्ष'],['Contribution','योगदान']],r:[
  [['Stephen Hales','स्टीफन हेल्स'],['1727','1727'],['Transpiration and root pressure measured','वाष्पोत्सर्जन और मूल दाब मापे']],
  [['Dixon and Joly','डिक्सन व जोली'],['1894','1894'],['Cohesion–tension theory','संसंजन-तनाव सिद्धांत']],
  [['Ernst Münch','अर्न्स्ट मुंच'],['1930','1930'],['Pressure-flow hypothesis for phloem','फ्लोएम की दाब-प्रवाह परिकल्पना']],
  [['Charles and Francis Darwin','चार्ल्स व फ्रांसिस डार्विन'],['1880','1880'],['Coleoptile tip senses light','कोलियोप्टाइल का सिरा प्रकाश महसूस करता है']],
  [['F. W. Went','एफ. डब्ल्यू. वेंट'],['1928','1928'],['Auxin collected and tested (Avena test)','ऑक्सिन एकत्र व परखा (एवेना परीक्षण)']],
  [['E. Kurosawa','ई. कुरोसावा'],['1926','1926'],['Gibberellin effect from Gibberella fungus','जिबरेला कवक से जिबरेलिन का प्रभाव']],
  [['Skoog and Miller','स्कूग व मिलर'],['1955','1955'],['Kinetin, first cytokinin','काइनेटिन, पहला साइटोकाइनिन']],
  [['Garner and Allard','गार्नर व एलार्ड'],['1920','1920'],['Photoperiodism in tobacco','तंबाकू में दीप्तिकालिता']],
  [['Haberlandt','हैबरलैंड'],['1902','1902'],['Idea of totipotency of plant cells','पादप कोशिकाओं की पूर्णशक्तता का विचार']],
  [['F. C. Steward','एफ. सी. स्टीवर्ड'],['1958','1958'],['Whole carrot plants from single cells','एक कोशिका से पूरा गाजर का पौधा']],
  [['Barbara McClintock','बारबरा मैकक्लिंटॉक'],['1940s–50s','1940–50 का दशक'],['Jumping genes (transposons) in maize','मक्का में कूदने वाले जीन (ट्रांसपोज़ॉन)']]]}},
{id:'sciindia',n:['Indian botanists','भारतीय वनस्पतिशास्त्री'],
 tb:{h:[['Scientist','वैज्ञानिक'],['Known for','प्रसिद्धि का कारण']],r:[
  [['J. C. Bose','जे. सी. बोस'],['Crescograph to measure plant growth and response','पौधों की वृद्धि व प्रतिक्रिया मापने वाला क्रेस्कोग्राफ']],
  [['Birbal Sahni','बीरबल साहनी'],['Founder of Indian palaeobotany (fossil plants)','भारतीय पुरावनस्पति विज्ञान (जीवाश्म पौधे) के संस्थापक']],
  [['Panchanan Maheshwari','पंचानन माहेश्वरी'],['Plant embryology and tissue culture','पादप भ्रूणविज्ञान और ऊतक संवर्धन']],
  [['E. K. Janaki Ammal','ई. के. जानकी अम्माल'],['Cytogenetics, sugarcane and Magnolia work','कोशिकानुवंशिकी, गन्ना और मैग्नोलिया पर कार्य']],
  [['M. S. Swaminathan','एम. एस. स्वामीनाथन'],['Leader of India’s Green Revolution','भारत की हरित क्रांति के नेता']]]}}
]});




(function(){
  const L=PV.L,el=PV.ui.addPanel('pv-num','');let q=null,res=null,score=0,tries=0,last=-1;
  const R=(a,b,s)=>{s=s||1;return a+Math.round(Math.random()*(b-a)/s)*s},r1=x=>Math.round(x*10)/10,r2=x=>Math.round(x*100)/100;
  const G=[
   ()=>{const s=-r1(R(5,15)/10),p=r1(R(1,Math.round(-s*10)+3)/10),a=r1(s+p);
     return{t:[`A cell has solute potential Ψs = ${s} MPa and pressure potential Ψp = +${p} MPa. Find its water potential Ψw (MPa).`,`एक कोशिका का विलेय विभव Ψs = ${s} MPa और दाब विभव Ψp = +${p} MPa है। इसका जल विभव Ψw (MPa) ज्ञात कीजिए।`],a,u:'MPa',
      s:[`Ψw = Ψs + Ψp = (${s}) + (+${p}) = ${a} MPa`,`Ψw = Ψs + Ψp = (${s}) + (+${p}) = ${a} MPa`]}},
   ()=>{const l0=R(2,8),t=R(2,5),d=t*R(1,4),l1=l0+d,a=r2(d/t);
     return{t:[`A seedling grows from ${l0} cm to ${l1} cm in ${t} days. What is the absolute growth rate (cm per day)?`,`एक अंकुर ${t} दिन में ${l0} सेमी से ${l1} सेमी हो जाता है। निरपेक्ष वृद्धि दर (सेमी प्रतिदिन) क्या है?`],a,u:'cm/day',
      s:[`AGR = (${l1} − ${l0}) ÷ ${t} = ${a} cm/day`,`AGR = (${l1} − ${l0}) ÷ ${t} = ${a} सेमी/दिन`]}},
   ()=>{const l0=R(10,40,5),inc=R(5,20,5),a=r1(inc/l0*100);
     return{t:[`A root is ${l0} mm long and grows ${inc} mm in one day. What is its relative growth rate (% per day)?`,`एक जड़ ${l0} मिमी लंबी है और एक दिन में ${inc} मिमी बढ़ती है। इसकी सापेक्ष वृद्धि दर (% प्रतिदिन) क्या है?`],a,u:'%/day',
      s:[`RGR = increase ÷ initial size × 100 = ${inc} ÷ ${l0} × 100 = ${a} % per day`,`RGR = वृद्धि ÷ प्रारंभिक आकार × 100 = ${inc} ÷ ${l0} × 100 = ${a} % प्रतिदिन`]}},
   ()=>{const n=R(3,12,3),atp=Math.random()<.5,a=atp?3*n:2*n,nm=atp?'ATP':'NADPH';
     return{t:[`In the Calvin cycle, how many ${nm} are needed to fix ${n} molecules of CO₂? (3 ATP and 2 NADPH per CO₂)`,`केल्विन चक्र में ${n} अणु CO₂ को स्थिर करने के लिए कितने ${nm} चाहिए? (प्रति CO₂ 3 ATP और 2 NADPH)`],a,u:nm,
      s:[`${nm} = ${atp?3:2} × ${n} = ${a}`,`${nm} = ${atp?3:2} × ${n} = ${a}`]}},
   ()=>{const N=[16,32,48,64,80,160][R(0,5)],k=R(0,2);
     const T=[[`Tt × Tt gives ${N} offspring. How many are expected to be tall (TT or Tt)?`,`Tt × Tt से ${N} संतानें मिलती हैं। कितनी लंबी (TT या Tt) होने की आशा है?`,N*3/4,`3/4 × ${N}`],
       [`Tt × Tt gives ${N} offspring. How many are expected to be dwarf (tt)?`,`Tt × Tt से ${N} संतानें मिलती हैं। कितनी बौनी (tt) होने की आशा है?`,N/4,`1/4 × ${N}`],
       [`A dihybrid cross (RrYy × RrYy) gives ${N} offspring. How many are expected to be double recessive (rryy)?`,`द्विसंकर संकरण (RrYy × RrYy) से ${N} संतानें मिलती हैं। कितनी द्विअप्रभावी (rryy) होने की आशा है?`,N/16,`1/16 × ${N}`]][k];
     return{t:[T[0],T[1]],a:T[2],u:'',s:[`${T[3]} = ${T[2]}`,`${T[3]} = ${T[2]}`]}},
   ()=>{const S=R(10,40),E=R(80,200,10),a=r1(S/(S+E)*100);
     return{t:[`A leaf field shows ${S} stomata and ${E} epidermal cells. Find the stomatal index.`,`पत्ती के एक क्षेत्र में ${S} रंध्र और ${E} अधिचर्म कोशिकाएँ हैं। रंध्र सूचकांक ज्ञात कीजिए।`],a,u:'',
      s:[`SI = S ÷ (S + E) × 100 = ${S} ÷ ${S+E} × 100 = ${a}`,`SI = S ÷ (S + E) × 100 = ${S} ÷ ${S+E} × 100 = ${a}`]}}];
  function next(){let k;do{k=R(0,G.length-1)}while(k===last&&G.length>1);last=k;q=G[k]();res=null}
  function build(){const hi=PV.lang&&PV.lang()==='hi',x=hi?1:0;if(!q)next();
    el.innerHTML=`<span class="pv-x" role="button" aria-label="Close">×</span><b>${L('Numericals','अंकगणित प्रयोगशाला')}</b> <span class="pv-cnt">${score}/${tries}</span>
      <p style="color:var(--fg)">${q.t[x]}</p>
      <input id="pv-numin" type="number" step="any" inputmode="decimal" ${res?'disabled':''} placeholder="${L('Your answer','आपका उत्तर')}${q.u?' ('+q.u+')':''}" style="width:100%;min-height:40px;border-radius:10px;border:1px solid var(--line);background:var(--bg);color:var(--fg);padding:0 10px;font:inherit">`
      +(res?`<p>${res.ok?'✓ ':'✗ '}${res.ok?L('Correct.','सही।'):L('Not quite.','ठीक नहीं।')}</p><p><u>${L('Worked solution','हल')}</u><br>${q.s[x]}${q.u?' '+q.u:''}</p><div class="pv-nav"><button data-n="1">${L('Next ▶','अगला ▶')}</button></div>`
        :`<div class="pv-nav"><button data-c="1">${L('Check','जाँचें')}</button></div>`)
      +`<p class="pv-note">${L('Random numbers each time. Answers within a small rounding margin count as correct.','हर बार अलग संख्याएँ। छोटे पूर्णांकन अंतर वाले उत्तर भी सही माने जाते हैं।')}</p>`}
  el.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.c){const i=el.querySelector('#pv-numin'),v=parseFloat(String(i.value).replace(',','.'));if(isNaN(v))return;
      const ok=Math.abs(v-q.a)<=Math.max(.06,Math.abs(q.a)*.01);res={ok};tries++;if(ok)score++;build()}
    else if(b.dataset.n){next();build()}});
  PV.sim.reg('numericals',el,build);
  const name=()=>L('🧮 Numericals','🧮 अंकगणित');
  PV.after('homeChips',()=>{const b=document.createElement('button'),n=$('#chips');b.className='chip mode';b.dataset.id='__num';b.textContent=name();b.onclick=()=>{q=null;PV.sim.open('numericals')};n.insertBefore(b,n.firstChild)});
  PV.onLang&&PV.onLang(()=>{const b=document.querySelector('#chips [data-id="__num"]');if(b)b.textContent=name()});
  PV.numericals={gen:G};
})();




if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)auto=false;
openHome();
