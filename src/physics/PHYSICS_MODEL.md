# Flight and startup model

The solver is an educational 2D translation model. These sources establish the force and flow relationships, not the detailed characteristics of a particular engine:

- [NASA Glenn: thrust-to-weight ratio](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/thrust-to-weight-ratio/)
- [NASA Glenn: specific impulse](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/specific-impulse/)
- [NASA: engine startup and launch-pad aborts](https://www.nasa.gov/history/sts-41d-and-the-first-space-shuttle-launch-pad-abort/)

## Forces

After release, the vertical equation is `m * az = T * sin(pitch) - Dz - m * g`, with `g = mu / (R + h)^2`. Drag opposes velocity relative to the prescribed horizontal wind.

Before release, the pad supports the vehicle and constrains translation in both axes. Startup still burns propellant. The model releases the vehicle only when the configured startup is complete and vertical thrust exceeds its current weight. Release changes the constraint, not the velocity: there is no launch impulse or artificial position tween.

NASA documents main-engine starts before lift-off for the Shuttle; its exact timing must not be treated as universal. The model's editable default startup of **2.5 seconds** is a demonstration assumption, not a measured NASA engine curve or Shuttle timeline.

## Approximate startup curve and mass conservation

For a stage with local time `tau`, startup duration `tr`, nominal thrust `Tnom`, burn duration `tb` and propellant budget `mp`:

```text
u = clamp(tau / tr, 0, 1)
s = 3*u^2 - 2*u^3
T(tau) = Tnom * s
mdotMax = mp / (tb - tr/2)
mdot(tau) = mdotMax * s
IspEffective = Tnom / (g0 * mdotMax)
```

For `tr = 0`, `s = 1`. Each stage limits `tr` to at most half of its entered burn duration. That burn duration includes startup. Since the startup curve integrates to `tr/2`, normalizing the flow this way consumes the entered propellant budget rather than adding fuel or silently leaving fuel unused. The displayed Isp is derived from these input values, not independently asserted propellant performance.

RK4 steps end at startup completion and stage burnout boundaries. At separation, discarded dry mass is removed without an added velocity impulse. Later stages also ramp their thrust; they coast during startup rather than using a ground constraint.

## Limits

The startup curve, pad-release policy, wind field, generic drag curve and apportionment of shell mass are approximations. No engine-specific ignition transient, combustion stability, nozzle pressure correction, six-axis dynamics, post-separation aerodynamic recalculation or launch certification is provided. Visual plume shape and temperature colors are illustrative.
