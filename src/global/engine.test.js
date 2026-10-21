import { test } from 'node:test';
import assert from 'node:assert/strict';
import { geodeticToECEF,ecefToGeodetic,WGS84_A,MU,norm,greatCircle } from './coordinates.js';
import { createMission,sampleMission,propagate } from './engine.js';
import { VEHICLES } from './vehicles.js';
import { createDetachedStage } from './debris.js';
const origin={lat:28.6084,lon:-80.6043};
const civil=VEHICLES.find(v=>v.id==='falcon9');
test('WGS84 roundtrip remains accurate at equator, dateline, mountains and poles',()=>{
  for(const [lat,lon,h] of [[0,0,0],[89.999,179.999,200],[-90,0,1000],[-45,-179.9,8848],[28.6,-80.6,400000]]){
    const p=ecefToGeodetic(geodeticToECEF(lat,lon,h));
    assert.ok(Math.abs(p.lat-lat)<1e-7);assert.ok(Math.abs(p.height-h)<.01);
    if(Math.abs(lat)<90)assert.ok(Math.abs(p.lon-lon)<1e-7);
  }
});
test('RK4 conserves orbital energy over one revolution',()=>{
  const r=WGS84_A+400000,speed=Math.sqrt(MU/r),period=2*Math.PI*Math.sqrt(r**3/MU);
  let state=[r,0,0,0,speed,0];const energy=s=>norm(s.slice(3))**2/2-MU/norm(s.slice(0,3));
  const initial=energy(state);for(let t=0;t<period;t+=5)state=propagate(state,5);
  assert.ok(Math.abs((energy(state)-initial)/initial)<1e-8);
  assert.ok(Math.abs(norm(state.slice(0,3))-r)<.1);
});
test('civil mission is finite, continuous, stable on orbit and deterministic when scrubbing',()=>{
  const mission=createMission({vehicle:civil,origin});
  assert.ok(mission.events.some(e=>e.stage===1));
  for(const s of mission.samples){for(const key of ['height','speed','acceleration','distance'])assert.ok(Number.isFinite(s[key]));assert.ok(s.r.every(Number.isFinite));}
  const a=sampleMission(mission,482.4),b=sampleMission(mission,482.6);
  assert.ok(norm(a.r.map((x,i)=>x-b.r[i]))<2000);
  assert.ok(Math.abs(sampleMission(mission,3000).speed-Math.sqrt(MU/(norm(geodeticToECEF(origin.lat,origin.lon))+400000)))<1e-6);
  const orbit=mission.samples.filter(s=>s.basis==='model');
  assert.ok(Math.max(...orbit.map(s=>s.speed))-Math.min(...orbit.map(s=>s.speed))<1e-6);
  assert.deepEqual(sampleMission(mission,700.25),sampleMission(mission,700.25));
  assert.ok(Math.abs(mission.samples[0].lat-origin.lat)<1e-6);
  assert.ok(Math.abs(mission.samples[3].speed-mission.samples[2].speed)<1);
});
test('military conceptual path is independent of real vehicle performance',()=>{
  const a=createMission({vehicle:{id:'a',military:true,category:'icbm',stages:3,mass:10000},origin});
  const b=createMission({vehicle:{id:'b',military:true,category:'srbm',stages:1,mass:100},origin});
  assert.deepEqual(a.samples.map(s=>s.r),b.samples.map(s=>s.r));
  assert.ok(a.samples.every(s=>s.basis==='illustration'));
});
test('reentry slows under an explicit generic atmosphere and stops on surface',()=>{
  const mission=createMission({vehicle:VEHICLES.find(v=>v.id==='dragon'),origin,scenario:'reentry'});
  assert.ok(mission.events.some(e=>e.label.includes('BC = 200')));
  assert.ok(mission.samples.some(s=>s.phase.includes('Tái nhập')));
  assert.ok(mission.samples.at(-1).landed);
  assert.ok(mission.samples.at(-1).height<.01);
});
test('antipodal and equal great-circle endpoints do not produce NaN',()=>{
  for(const end of [{lat:0,lon:180},{lat:0,lon:0}])assert.ok(Object.values(greatCircle({lat:0,lon:0},end,.5)).every(Number.isFinite));
});
test('separated stage inherits its position, remains finite and settles without disappearing',()=>{
  const release={r:geodeticToECEF(0,0,20000),v:[50,100,0]};
  const sample=createDetachedStage(release);
  assert.deepEqual(sample(0).position,release.r);
  let previous=sample(0).position;
  for(let t=1;t<=600;t++){
    const state=sample(t);assert.ok(state.position.every(Number.isFinite));
    assert.ok(norm(state.position.map((x,i)=>x-previous[i]))<2000);previous=state.position;
  }
  assert.ok(sample(7200).landed);
  assert.deepEqual(sample(7200).position,sample(14400).position);
});
