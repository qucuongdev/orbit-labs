const radians = value => value * Math.PI / 180;
const degrees = value => value * 180 / Math.PI;

// Map projection of the simplified flight plane, not a terrain/impact solver.
export function projectDownrange(latitude, longitude, bearing, distanceMeters) {
  const delta = distanceMeters / 6371000;
  const lat = radians(latitude), lon = radians(longitude), angle = radians(bearing);
  const endLat = Math.asin(Math.sin(lat) * Math.cos(delta) + Math.cos(lat) * Math.sin(delta) * Math.cos(angle));
  const endLon = lon + Math.atan2(Math.sin(angle) * Math.sin(delta) * Math.cos(lat), Math.cos(delta) - Math.sin(lat) * Math.sin(endLat));
  return [degrees(endLat), ((degrees(endLon) + 540) % 360) - 180];
}

export function projectWind(speed, fromDirection, bearing) {
  return -speed * Math.cos(radians(fromDirection - bearing));
}
