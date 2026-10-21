export const INITIAL_CONFIG = {
  noseLength: 0.65,
  noseShape: 'ogive',
  bodyDiameter: 0.16,
  bodyLength: 2.20,
  finCount: 4,
  finSpan: 0.15,
  finRootChord: 0.30,
  finTipChord: 0.12,
  finSweep: 0.18,
  wallThickness: 0.002, // 2mm
  propellantMass: 7.5,  // kg
  payloadMass: 1.5,     // kg
  engineDryMass: 2.5,   // kg
  thrustVac: 350,       // N; gentle educational preset, not a specific engine
  burnTime: 30.0,       // s; includes engine startup
  ignitionDuration: 2.5,// s; configurable approximate startup profile
  launchAngleDeg: 87.0,
  windSpeed: 3,
  drogueDiameter: 0.6,
  mainDiameter: 2.4,
  launchLatitude: 10.8231,
  launchLongitude: 106.6297,
  launchBearing: 90
};
