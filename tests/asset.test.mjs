import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const data=readFileSync(new URL('../public/assets/cake/atelier-cake.glb',import.meta.url));
const gltf=JSON.parse(data.subarray(20,20+data.readUInt32LE(12)).toString());
test('compression retains independent intact, body and slice groups',()=>{
 for(const name of ['CakeWhole','CakeBody','CakeSlice']){
  const node=gltf.nodes.find(n=>n.name===name);assert(node,`${name} must survive compression`);assert(node.children?.length,`${name} needs its own mesh descendants`);
 }
 assert(gltf.extensionsUsed.includes('EXT_meshopt_compression'));
 assert(data.byteLength<5_000_000,'review asset should stay within its download budget');
});
test('crumb, cream and ganache have PBR surface detail',()=>{
 for(const prefix of ['Moist dark chocolate','Whipped dark chocolate','Belgian ganache']){
  const material=gltf.materials.find(m=>m.name?.startsWith(prefix));assert(material, prefix);assert(material.normalTexture,`${prefix} needs normal detail`);assert(material.pbrMetallicRoughness.metallicRoughnessTexture,`${prefix} needs roughness detail`);
 }
});
