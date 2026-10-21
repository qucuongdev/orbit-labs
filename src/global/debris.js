import { ecefToGeodetic, geodeticToECEF, rotateZ, OMEGA } from './coordinates.js';
import { propagate } from './engine.js';

// Educational detached-stage dynamics. Same gravity/rotating atmosphere as
// generic reentry, with an explicitly assumed BC; not an impact predictor.
export function createDetachedStage(release) {
  let state=[...release.r,...release.v];
  const positions=[release.r];
  let landed=false;
  for(let t=1;t<=7200;t++) {
    state=propagate(state,1,true);
    let position=rotateZ(state.slice(0,3),-OMEGA*t);
    const geo=ecefToGeodetic(position);
    if(geo.height<=0){position=geodeticToECEF(geo.lat,geo.lon,0);landed=true;}
    positions.push(position);
    if(landed)break;
  }
  const duration=positions.length-1;
  return elapsed=>{
    const age=Math.max(0,Math.min(duration,elapsed)),i=Math.floor(age),a=positions[i],b=positions[Math.min(i+1,duration)],u=age-i;
    return {position:a.map((x,j)=>x+(b[j]-x)*u),age,landed:landed&&elapsed>=duration};
  };
}
