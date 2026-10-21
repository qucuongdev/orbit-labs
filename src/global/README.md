# Global flight simulator

The default route is the Cesium global explorer. `?mode=lab` mounts the original
Three.js simulator, including its configurable RK4 physics, grid, cutaway,
multi-stage editor, parachutes, audio and Leaflet map. Switching modes unmounts
the previous renderer and disposes its resources. There are never two active
world renderers or synchronized-camera approximations.

## Modules and units

- `coordinates.js`: WGS84 geodetic degrees/metres ↔ ECEF metres, local ENU axes.
- `engine.js`: independent deterministic mission generation and interpolation.
  SI throughout. The inertial axes coincide with ECEF at the scenario epoch;
  Earth rotates at 7.292115e-5 rad/s. This is a simplified inertial frame, not
  full IAU precession/nutation, UTC/UT1 or polar-motion modelling.
- `mission.worker.js`: generates sampled missions off the UI thread. Each
  scenario change terminates the previous worker to avoid stale results.
- `vehicles.js`: extensible public catalogue. Dimensions/mass belong to the
  cited configuration. Missing values are `null`; they are never solver inputs.
- `GlobalScene.jsx`: the sole global renderer, terrain/imagery LOD, ECEF models,
  paths, markers, audio position and camera. Model units are metres. The default
  minimum pixel size enlarges vehicles at planetary distances; `Tỷ lệ 1:1`
  disables enlargement. Geometry is parametric and schematic, not surveyed CAD.
- `GlobalSimulator.jsx`: catalogue/search/filter/compare, scenario, playback,
  data provenance, weather and telemetry UI.
- `modelProfile.js`: explicitly schematic component proportions, separate from
  the catalogue's verified overall dimensions.
- `debris.js`: detached civilian stages inherit the release state and integrate
  gravity/drag, then settle at the first ellipsoid contact. Drag uses the same
  assumed generic BC as reentry; these are not vehicle-specific impact results.
- `scripts/generate-vehicles.mjs`: builds local glTF 2.0 models and individual
  stage assets. Run `pnpm models:generate` after editing model geometry/dimensions.

## What is and is not calculated

**Calculated orbital motion:** analytic circular two-body motion using
μ = 3.986004418e14 m³/s²; radius from the launch geocentric radius plus selected
height. Inclination comes from the initial position and tangent direction.
The displayed period is the initial circular-orbit period. Geodetic altitude
can vary slightly along this geocentric circle because WGS84 is an ellipsoid.
Inertial velocity includes Earth's rotation at launch; it is not airspeed.
Acceleration is the magnitude of the inertial velocity change per second;
it includes gravity and is not accelerometer proper acceleration / g loading.

**Calculated generic reentry:** an explicit deorbit impulse followed by RK4
two-body gravity plus drag relative to a co-rotating exponential atmosphere
(ρ₀ = 1.225 kg/m³, H = 7200 m, assumed ballistic coefficient 200 kg/m²).
The coefficient is an educational assumption, not Dragon/Orion certification
data. J2, weather-driven density, lift, heating, attitude control, guidance and
parachute dynamics are not part of this global model. Ground termination uses
the WGS84 ellipsoid; terrain is not a collision model for the reentry solver.

**Illustrations:** civilian ascent uses a continuous smooth prescribed transfer
to circular orbit, with a 2.5 s ignition/hold and 480 s ascent. Separation times,
falling stages, sounding/model rocket flights and parachutes are illustrative.
They are not reconstructions of the named vehicle's thrust curve or mass flow.
No vehicle-specific propellant consumption or mass telemetry is fabricated.
Use the original lab for configurable thrust, mass depletion and RK4 launch
dynamics. There is no claim of historical flight replay or certified prediction.

**Military vehicles:** one generic 600-second educational arc, independent of
real propulsion, mass, range, cruise altitude or speed. Public identity, shape,
country and stage count may be displayed. There is no target selection,
intercept/strike trajectory solver or guidance system. Observation markers
are contextual markers for civilian scenes and never steer the path.

Telemetry badges distinguish calculated states from illustrations. Public
vehicle specifications are separately labelled and linked. The source's own
date/configuration takes precedence over the catalogue's verification date.
Iskander-M lacks verified primary-source dimensions in this catalogue and is
explicitly marked unverified; its visual envelope is schematic, not 1:1 data.
Soyuz dimensions describe Soyuz-FG with a 10.3 m overall span; its 2.95 m core
envelope and component proportions are approximate geometry.

## Globe, services, attribution and failure modes

No Cesium ion token is needed for the configured public Esri endpoints:

- [World Imagery](https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer)
- [WorldElevation3D](https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer)
- [Cesium terrain provider documentation](https://cesium.com/learn/cesiumjs/ref-doc/ArcGISTiledElevationTerrainProvider.html)

Tiles stream on demand; availability, licensing, coverage and service quotas
are controlled by their providers. Cesium's credits remain visible. A local
Cesium Natural Earth II tiled image remains underneath as offline fallback.
If terrain fails, use the ellipsoid and show that status. Launch points can
sample terrain; telemetry subtracts currently loaded terrain when available
and labels that altitude approximate. Otherwise altitude is WGS84 ellipsoid
height. A global camera cannot guarantee survey-level ground elevation.

The static cloud mask comes from the
[Three.js example texture](https://threejs.org/examples/textures/planets/earth_clouds_1024.png)
and is an illustration, not live meteorology. It fades out near the ground.
Stars are a seeded batched visual background, not an astronomical catalogue.
Sun/atmosphere use Cesium's time-based lighting. A fixed equinox epoch and
12:00 / 00:00 UTC comparison make the day/night terminator easy to inspect.

[Nominatim reverse geocoding](https://nominatim.org/release-docs/latest/api/Reverse/)
is requested only after map clicks, debounced and cancelled on subsequent picks.
Coordinates remain available if place lookup fails. Place names © OSM
contributors; the nearest named object can differ from the selected point.

[Open-Meteo](https://open-meteo.com/en/docs) current model weather is fetched for
the launch site with explicit timestamp and units. It is contextual only in
the global simulator, and is not silently fed into orbital/reentry physics.
The original lab's weather-aware atmosphere remains available in lab mode.

## Performance and verification

Cesium manages quadtree LOD, terrain tile streaming, camera collision and
camera-relative GPU precision. One PointPrimitiveCollection batches stars;
one model cache supplies main vehicle and detached stage assets. Device pixel
ratio is bounded, frame rate capped at 30, render-on-demand enabled. Follow/POV
camera transforms are changed only when time or camera mode changes. Timeline
scrubbing recomputes the same state instead of integrating render frame time.

`pnpm test` checks both legacy physics and global WGS84/orbital/reentry cases.
`pnpm test:e2e` covers both renderers, global catalogue, comparison, timeline,
POV, conceptual military mode, mobile layout and legacy regression workflows.
`pnpm build` bundles assets/workers and copies Cesium runtime resources into
`dist/cesium`. This is a JavaScript project, with no TypeScript compile stage.
