import { WGS84_A, MU, OMEGA, geodeticToECEF, ecefToGeodetic, localFrame, rotateZ, add, scale, norm, cross, rad, deg } from './coordinates.js';

export const smooth = u => u*u*u*(10+u*(-15+6*u));
const smoothD = u => 30*u*u*(u-1)*(u-1);
// Classical RK4 in an inertial frame; optional rotating exponential atmosphere.
export function propagate(state, dt, drag = false) {
  const derivative = s => {
    const r=s.slice(0,3),v=s.slice(3),length=norm(r);
    let a=scale(r,-MU/length**3);
    if(drag) {
      const relative=add(v,scale(cross([0,0,OMEGA],r),-1));
      const density=1.225*Math.exp(-Math.max(0,ecefToGeodetic(r).height)/7200);
      a=add(a,scale(relative,-density*norm(relative)/(2*200)));
    }
    return [...v,...a];
  };
  const a=derivative(state),b=derivative(add(state,scale(a,dt/2))),c=derivative(add(state,scale(b,dt/2))),d=derivative(add(state,scale(c,dt)));
  return state.map((x,i)=>x+dt*(a[i]+2*b[i]+2*c[i]+d[i])/6);
}

export function createMission({vehicle,origin,altitude=400000,heading=90,scenario='orbit'}) {
  if(!Number.isFinite(origin.lat)||!Number.isFinite(origin.lon)||Math.abs(origin.lat)>90||Math.abs(origin.lon)>180) throw new Error('Tọa độ WGS84 không hợp lệ.');
  altitude=Math.max(160000,Math.min(2000000,Number(altitude)||400000));
  const surface=geodeticToECEF(origin.lat,origin.lon,Math.max(0,origin.height||0));
  const hold=2.5,ascent=480;
  const axisOffset=vehicle.category==='spacecraft'||vehicle.military||['model','sounding'].includes(vehicle.category)?0:OMEGA*hold;
  const radius0=norm(surface),up=rotateZ(scale(surface,1/radius0),axisOffset),frame=localFrame(origin.lat,origin.lon);
  const tangent=rotateZ(add(scale(frame.north,Math.cos(rad(heading))),scale(frame.east,Math.sin(rad(heading)))),axisOffset);
  // Re-orthogonalize on the geocentric orbital plane (geodetic north differs).
  const normal=scale(cross(up,tangent),1/norm(cross(up,tangent)));
  const along=cross(normal,up);
  const radius=radius0+altitude,n=Math.sqrt(MU/radius**3),period=2*Math.PI/n;
  const conceptual=!!vehicle.military;
  const suborbital=conceptual||['model','sounding'].includes(vehicle.category);
  const spacecraft=vehicle.category==='spacecraft';
  const startOrbit=spacecraft?0:ascent+hold;
  const duration=suborbital?(vehicle.category==='model'?55:600):scenario==='reentry'?Math.ceil(period*0.6+2200):Math.ceil(startOrbit+period*1.1);
  const samples=[],events=[{t:0,label:spacecraft?'Khởi tạo trên quỹ đạo':'Đánh lửa · giữ bệ',kind:'illustration'}];
  if(!spacecraft&&!suborbital) {
    events.push({t:hold,label:'Rời bệ · tăng tốc liên tục',kind:'illustration'});
    for(let stage=1;stage<vehicle.stages;stage++) events.push({t:hold+ascent*stage/vehicle.stages,label:`Tách tầng ${stage} · kích hoạt tầng ${stage+1}`,kind:'illustration',stage});
    events.push({t:startOrbit,label:'Chèn vào quỹ đạo tròn',kind:'model'});
  }
  if(suborbital) {
    if(!conceptual)for(let stage=1;stage<vehicle.stages;stage++)events.push({t:duration*.2*stage/vehicle.stages,label:`Tách tầng ${stage} · minh họa`,kind:'illustration',stage});
    events.push({t:duration/2,label:conceptual?'Đỉnh cung minh họa':'Đỉnh cao · bung dù minh họa',kind:'illustration'});
  }
  const orbitAt = theta => ({r:add(scale(up,radius*Math.cos(theta)),scale(along,radius*Math.sin(theta))),v:add(scale(up,-radius*n*Math.sin(theta)),scale(along,radius*n*Math.cos(theta)))});
  let integrated,previousR,previousV,distance=0,landed=false;
  const deorbitAt=Math.floor(period*0.6),deorbitTheta=n*deorbitAt+(spacecraft?0:n*ascent/2);
  if(scenario==='reentry'&&!suborbital) events.push({t:deorbitAt+startOrbit,label:'Hạ cận điểm · mô hình lực cản BC = 200 kg/m²',kind:'model'});
  for(let t=0;t<=duration;t++) {
    let r,v,phase,basis,throttle=0;
    if(suborbital) {
      // Generic educational animation; deliberately independent of military performance.
      const u=t/duration,apogee=conceptual?180000:vehicle.category==='model'?300:200000;
      const theta=(conceptual?0.12:vehicle.category==='model'?0.000002:0.018)*smooth(u);
      const h=apogee*Math.sin(Math.PI*u)**2;
      r=add(scale(up,(radius0+h)*Math.cos(theta)),scale(along,(radius0+h)*Math.sin(theta)));
      v=previousR?add(r,scale(previousR,-1)):[0,0,0];
      phase=t<hold?'Đánh lửa':u<0.2?'Đẩy · minh họa':u<0.5?'Bay tự do':conceptual?'Cung khái niệm':u<0.9?'Hạ bằng dù · minh họa':'Thu hồi · minh họa';
      basis='illustration';throttle=u<0.2?smooth(Math.min(1,t/hold)):0;
    } else if(!spacecraft&&t<startOrbit) {
      const u=Math.max(0,(t-hold)/ascent),h=altitude*smooth(u),dh=altitude*smoothD(u)/ascent;
      const theta=n*ascent*(u**3-u**4/2),omega=n*(3*u*u-2*u**3);
      const radial=add(scale(up,Math.cos(theta)),scale(along,Math.sin(theta)));
      const transverse=add(scale(up,-Math.sin(theta)),scale(along,Math.cos(theta)));
      r=scale(radial,radius0+h);v=add(scale(radial,dh),scale(transverse,(radius0+h)*omega));
      // Blend the rotating launch platform's position AND velocity into the
      // prescribed ascent, so release cannot remove Earth's rotational speed.
      const rotating=rotateZ(surface,OMEGA*t),atRelease=rotateZ(surface,OMEGA*hold),delta=add(rotating,scale(atRelease,-1));
      r=add(r,scale(delta,1-smooth(u)));
      v=add(v,add(scale(cross([0,0,OMEGA],rotating),1-smooth(u)),scale(delta,-smoothD(u)/ascent)));
      // Keep initial platform fixed to rotating Earth until release.
      if(t<=hold) {r=rotateZ(surface,OMEGA*t);v=cross([0,0,OMEGA],r);}
      phase=t<=hold?'Đánh lửa · giữ bệ':`Tầng ${Math.min(vehicle.stages,Math.floor(u*vehicle.stages)+1)} · tăng tốc`;
      basis='illustration';throttle=smooth(Math.min(1,t/hold));
    } else {
      const elapsed=t-startOrbit,theta=n*elapsed+(spacecraft?0:n*ascent/2);
      if(scenario==='reentry'&&elapsed>=deorbitAt) {
        if(!integrated) {
          const initial=orbitAt(deorbitTheta),speed=Math.sqrt(MU*(2/radius-2/(radius+WGS84_A-50000)));
          integrated=[...initial.r,...scale(initial.v,speed/norm(initial.v))];
        } else if(!landed) integrated=propagate(integrated,1,true);
        r=integrated.slice(0,3);v=integrated.slice(3);
        const ground=ecefToGeodetic(r);
        if(ground.height<=0) {landed=true;r=geodeticToECEF(ground.lat,ground.lon,0);v=cross([0,0,OMEGA],r);integrated=[...r,...v];}
        phase=landed?'Kết thúc tái nhập':norm(r)-WGS84_A<120000?'Tái nhập · lực cản':'Quỹ đạo hạ cận điểm';
      } else {({r,v}=orbitAt(theta));phase='Chuyển động quỹ đạo';}
      basis='model';
    }
    const ecef=rotateZ(r,-OMEGA*t),geo=ecefToGeodetic(ecef);
    if(previousR) distance+=norm(add(r,scale(previousR,-1)));
    const acceleration=previousV?norm(add(v,scale(previousV,-1))):0;
    const stage=suborbital?(conceptual?1:Math.min(Math.max(1,vehicle.stages),Math.floor(t/(duration*.2)*Math.max(1,vehicle.stages))+1)):Math.min(Math.max(1,vehicle.stages),Math.floor(Math.max(0,t-hold)/ascent*Math.max(1,vehicle.stages))+1);
    samples.push({t,r:ecef,v:rotateZ(v,-OMEGA*t),lat:geo.lat,lon:geo.lon,height:Math.max(0,geo.height),speed:norm(v),acceleration,distance,phase,basis,throttle,stage,landed});
    previousR=r;previousV=v;
    if(landed) break;
  }
  return {samples,events,duration:samples.at(-1).t,period,inclination:deg(Math.acos(normal[2])),altitude,conceptual,suborbital,spacecraft,origin,vehicleId:vehicle.id,epoch:'2026-03-20T12:00:00Z'};
}

export function sampleMission(mission,time) {
  const samples=mission.samples,t=Math.max(0,Math.min(mission.duration,time)),i=Math.min(samples.length-1,Math.floor(t));
  const a=samples[i],b=samples[Math.min(i+1,samples.length-1)],u=t-i;
  const r=a.r.map((x,j)=>x+(b.r[j]-x)*u),geo=ecefToGeodetic(r);
  const result={...a,t,r,lat:geo.lat,lon:geo.lon,height:Math.max(0,geo.height)};
  for(const key of ['speed','acceleration','distance','throttle']) result[key]=a[key]+(b[key]-a[key])*u;
  return result;
}
