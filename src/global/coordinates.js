// WGS84 geodetic degrees / ECEF metres. No rendering dependencies.
export const WGS84_A = 6378137;
export const WGS84_F = 1 / 298.257223563;
export const MU = 3.986004418e14;
export const OMEGA = 7.292115e-5;
const E2 = WGS84_F * (2 - WGS84_F);
export const rad = d => d * Math.PI / 180;
export const deg = r => r * 180 / Math.PI;
export const add = (a, b) => a.map((x, i) => x + b[i]);
export const scale = (a, s) => a.map(x => x * s);
export const norm = a => Math.hypot(...a);
export const cross = (a, b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
export function geodeticToECEF(lat, lon, height = 0) {
  const p = rad(lat), l = rad(lon), n = WGS84_A / Math.sqrt(1 - E2 * Math.sin(p) ** 2);
  return [(n + height)*Math.cos(p)*Math.cos(l), (n + height)*Math.cos(p)*Math.sin(l), (n*(1-E2)+height)*Math.sin(p)];
}
export function ecefToGeodetic([x, y, z]) {
  const p = Math.hypot(x,y);
  if (p < 1e-6) return { lat: Math.sign(z)*90, lon: 0, height: Math.abs(z)-WGS84_A*(1-WGS84_F) };
  let lat = Math.atan2(z, p*(1-E2));
  for (let i=0; i<10; i++) {
    const n = WGS84_A / Math.sqrt(1-E2*Math.sin(lat)**2);
    lat = Math.atan2(z+E2*n*Math.sin(lat),p);
  }
  const n=WGS84_A/Math.sqrt(1-E2*Math.sin(lat)**2);
  return {lat:deg(lat),lon:deg(Math.atan2(y,x)),height:p/Math.cos(lat)-n};
}
export function rotateZ(v, angle) {
  const c=Math.cos(angle),s=Math.sin(angle);
  return [c*v[0]-s*v[1],s*v[0]+c*v[1],v[2]];
}
export function localFrame(lat,lon) {
  const p=rad(lat),l=rad(lon);
  return {up:[Math.cos(p)*Math.cos(l),Math.cos(p)*Math.sin(l),Math.sin(p)],east:[-Math.sin(l),Math.cos(l),0],north:[-Math.sin(p)*Math.cos(l),-Math.sin(p)*Math.sin(l),Math.cos(p)]};
}
export function greatCircle(a,b,u) {
  const va=scale(geodeticToECEF(a.lat,a.lon),1/norm(geodeticToECEF(a.lat,a.lon)));
  const vb=scale(geodeticToECEF(b.lat,b.lon),1/norm(geodeticToECEF(b.lat,b.lon)));
  const angle=Math.acos(Math.max(-1,Math.min(1,va.reduce((s,x,i)=>s+x*vb[i],0))));
  let v;
  if(angle<1e-7) v=va;
  else if(Math.PI-angle<1e-6) {
    const axis=localFrame(a.lat,a.lon).east;
    v=add(scale(va,Math.cos(Math.PI*u)),scale(axis,Math.sin(Math.PI*u)));
  } else v=add(scale(va,Math.sin((1-u)*angle)/Math.sin(angle)),scale(vb,Math.sin(u*angle)/Math.sin(angle)));
  return {lat:deg(Math.asin(v[2]/norm(v))),lon:deg(Math.atan2(v[1],v[0]))};
}
