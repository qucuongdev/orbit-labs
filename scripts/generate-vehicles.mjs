import * as T from 'three';
import { writeFileSync, mkdirSync } from 'node:fs';
import { VEHICLES } from '../src/global/vehicles.js';
import { modelProfile } from '../src/global/modelProfile.js';
mkdirSync('public/models',{recursive:true});
for(const vehicle of VEHICLES) {
 const h=vehicle.height||7.3,d=vehicle.modelDiameter||vehicle.diameter||0.92,r=d/2;
 const buffers=[],views=[],accessors=[],meshes=[],nodes=[],materials=[];
 let offset=0;
 function buffer(array,target) {
  const bytes=Buffer.from(array.buffer,array.byteOffset,array.byteLength),pad=(4-bytes.length%4)%4;
  views.push({buffer:0,byteOffset:offset,byteLength:bytes.length,target});buffers.push(bytes,Buffer.alloc(pad));offset+=bytes.length+pad;return views.length-1;
 }
 function mesh(geometry,color,name,parent,position=[0,0,0]) {
  const p=geometry.getAttribute('position'),normal=geometry.getAttribute('normal'),idx=geometry.index;
  const box=new T.Box3().setFromBufferAttribute(p);
  const pa=accessors.push({bufferView:buffer(p.array,34962),componentType:5126,count:p.count,type:'VEC3',min:box.min.toArray(),max:box.max.toArray()})-1;
  const na=accessors.push({bufferView:buffer(normal.array,34962),componentType:5126,count:normal.count,type:'VEC3'})-1;
  const ia=accessors.push({bufferView:buffer(idx.array,34963),componentType:idx.array instanceof Uint32Array?5125:5123,count:idx.count,type:'SCALAR'})-1;
  const col=new T.Color(color);const mi=materials.push({pbrMetallicRoughness:{baseColorFactor:[col.r,col.g,col.b,1],metallicFactor:vehicle.id==='starship'?0.75:0.25,roughnessFactor:0.5},doubleSided:true})-1;
  const m=meshes.push({primitives:[{attributes:{POSITION:pa,NORMAL:na},indices:ia,material:mi}]})-1;
  const ni=nodes.push({name,mesh:m,translation:position})-1;
  nodes[parent].children.push(ni);geometry.dispose();
 }
 const root=nodes.push({name:'vehicle',children:[]})-1;
 const profile=modelProfile(vehicle),stageCount=Math.max(1,vehicle.stages),body=profile.body;
 for(let s=0;s<stageCount;s++) {
  const {length:segment,offset:base,radiusScale}=profile.stages[s];
  const sr=r*radiusScale;
  const parent=nodes.push({name:`stage-${s+1}`,children:[]})-1;nodes[root].children.push(parent);
  mesh(new T.CylinderGeometry(sr,sr,segment*0.985,32),vehicle.id==='alpha'?'#18232c':vehicle.color||'#e8e8e3',`body-${s}`,parent,[0,base+segment*.5,0]);
  mesh(new T.CylinderGeometry(sr*1.012,sr*1.012,Math.min(segment*.09,d*.2),32),'#202b36',`interstage-${s}`,parent,[0,base+segment-d*.05,0]);
  const engines=vehicle.id==='saturnv'&&s===0?5:vehicle.id==='starship'&&s===0?19:vehicle.id.includes('falcon')&&s===0?9:1;
  for(let e=0;e<engines;e++) {
   const er=engines>1?sr*.22:sr*.6,a=e*Math.PI*2/engines,ring=engines>1?sr*.65:0;
   mesh(new T.CylinderGeometry(er*.45,er,Math.min(d*.45,segment*.12),12),'#4b5359',`engine-${s}-${e}`,parent,[Math.cos(a)*ring,base,Math.sin(a)*ring]);
  }
 }
 const top=nodes.push({name:'payload',children:[]})-1;nodes[root].children.push(top);
 if(vehicle.category==='spacecraft') {
  // Crew capsule with service module and visible heatshield.
  mesh(new T.CylinderGeometry(r*.46,r,h*.42,32),'#ecebe4','capsule',top,[0,h*.79,0]);
  mesh(new T.CylinderGeometry(r,r,d*.09,32),'#17232c','heatshield',top,[0,h*.56,0]);
  if(vehicle.id==='orion') for(let a=0;a<4;a++) {
   const panel=new T.BoxGeometry(d*1.2,d*.035,d*.4);panel.rotateY(a*Math.PI/2);
   mesh(panel,'#193b64',`solar-${a}`,top,[Math.cos(a*Math.PI/2)*d*1.1,h*.25,Math.sin(a*Math.PI/2)*d*1.1]);
  }
 } else {
  const fairing=vehicle.id.startsWith('falcon')?r*1.4:r;
  mesh(new T.CylinderGeometry(fairing*.7,fairing,h*.08,32),vehicle.id==='alpha'?'#ff7c27':'#e7e8e3','fairing',top,[0,h*.86,0]);
  mesh(new T.ConeGeometry(fairing*.7,h*.1,32),vehicle.id==='alpha'?'#ff7c27':'#e7e8e3','nose',top,[0,h*.95,0]);
 }
 if(vehicle.boosters) for(let b=0;b<vehicle.boosters;b++) {
  const angle=2*Math.PI*b/vehicle.boosters,br=r*(vehicle.id==='falconheavy'?1:0.62),bh=h*.65;
  const parent=nodes.push({name:`booster-${b}`,children:[]})-1;nodes[root].children.push(parent);
  const x=Math.cos(angle)*(r+br)*1.05,z=Math.sin(angle)*(r+br)*1.05;
  mesh(new T.CylinderGeometry(br,br,bh,24),vehicle.id==='sls'?'#efeee4':vehicle.color||'#e9e9e4','booster-body',parent,[x,bh/2,z]);
  mesh(new T.ConeGeometry(br,bh*.12,24),'#deded8','booster-nose',parent,[x,bh*1.06,z]);
 }
 if(['model','sounding','cruise','srbm'].includes(vehicle.category)||vehicle.id==='starship') for(let f=0;f<4;f++) {
  const angle=f*Math.PI/2;const g=new T.BoxGeometry(d*.85,h*.075,d*.08);g.rotateY(angle);
  mesh(g,vehicle.id==='alpha'?'#ff7c27':'#515d68',`fin-${f}`,root,[Math.cos(angle)*r,h*.1,Math.sin(angle)*r]);
 }
 const binary=Buffer.concat(buffers);
 const json={asset:{version:'2.0',generator:'Rocket Lab parametric educational models; dimensions in metres'},scene:0,scenes:[{nodes:[root]}],nodes,meshes,materials,accessors,bufferViews:views,buffers:[{byteLength:binary.length}]};
 let jb=Buffer.from(JSON.stringify(json));jb=Buffer.concat([jb,Buffer.alloc((4-jb.length%4)%4,32)]);
 const header=Buffer.alloc(12);header.writeUInt32LE(0x46546c67,0);header.writeUInt32LE(2,4);header.writeUInt32LE(12+8+jb.length+8+binary.length,8);
 const jh=Buffer.alloc(8);jh.writeUInt32LE(jb.length);jh.writeUInt32LE(0x4e4f534a,4);
 const bh=Buffer.alloc(8);bh.writeUInt32LE(binary.length);bh.writeUInt32LE(0x004e4942,4);
 writeFileSync(`public/models/${vehicle.id}.glb`,Buffer.concat([header,jh,jb,bh,binary]));
 for(let stage=1;stage<=stageCount;stage++) {
  const stageRoot=nodes.findIndex(node=>node.name===`stage-${stage}`);
  const variant={...json,scenes:[{nodes:[stageRoot]}]};
  let data=Buffer.from(JSON.stringify(variant));data=Buffer.concat([data,Buffer.alloc((4-data.length%4)%4,32)]);
  const vh=Buffer.from(header);vh.writeUInt32LE(12+8+data.length+8+binary.length,8);
  const vj=Buffer.from(jh);vj.writeUInt32LE(data.length);
  writeFileSync(`public/models/${vehicle.id}-stage-${stage}.glb`,Buffer.concat([vh,vj,data,bh,binary]));
 }
}
console.log(`Generated ${VEHICLES.length} scale models`);
