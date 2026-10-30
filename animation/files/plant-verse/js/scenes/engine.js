

const T=THREE, TAU=Math.PI*2;
const M=(c,o)=>new T.MeshStandardMaterial(Object.assign({color:c,roughness:.65,metalness:0,side:T.DoubleSide},o||{}));
const rnd=(()=>{let s=7;return()=>{s=(s*16807)%2147483647;return(s-1)/2147483646}})();
class Sc{
  constructor(){this.group=new T.Group();this.parts=[];this.byId={};this.tick=null;this.cam=6;this.view=[.35,-.5];this.title='';this.sub=''}
  part(id,name,desc,anchor){if(!this.byId[id]){const p={id,name,desc,anchor:anchor||null,mats:[],meshes:[]};this.byId[id]=p;this.parts.push(p)}return this.byId[id]}
  add(id,mesh,parent){const p=this.byId[id];mesh.userData.pid=id;if(p.mats.indexOf(mesh.material)<0)p.mats.push(mesh.material);p.meshes.push(mesh);(parent||this.group).add(mesh);return mesh}
}
const mesh=(g,m,x,y,z)=>{const o=new T.Mesh(g,m);o.position.set(x||0,y||0,z||0);return o};
