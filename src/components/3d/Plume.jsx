import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Axis-aligned billboard with a soft procedural volume; no visible cone caps.
const vertexShader = `
  uniform float uLength;
  uniform float uRadius;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    float travel = 1.0 - uv.y;
    vec3 center = (modelMatrix * vec4(0.0, -travel * uLength, 0.0, 1.0)).xyz;
    vec3 axis = normalize(mat3(modelMatrix) * vec3(0.0, 1.0, 0.0));
    vec3 view = normalize(cameraPosition - center);
    vec3 side = cross(axis, view);
    if (dot(side, side) < 0.0001) side = vec3(1.0, 0.0, 0.0);
    side = normalize(side);
    vec3 world = center + side * (uv.x - 0.5) * uRadius * 10.0;
    gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uIntensity;
  uniform float uThrottle;
  varying vec2 vUv;
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1,0)), f.x),
               mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y);
  }
  float turbulence(vec2 p) {
    return noise(p) * 0.57 + noise(p * 2.07) * 0.28 + noise(p * 4.13) * 0.15;
  }
  void main() {
    float t = 1.0 - vUv.y;
    float flow = uTime * 4.5;
    float bend = (noise(vec2(t * 8.0 - flow, 2.7)) - 0.5) * 0.55 * t;
    float x = (vUv.x - 0.5) * 10.0 - bend;
    float eddy = turbulence(vec2(x * 3.0, t * 13.0 - flow * 3.0));
    float width = (1.05 + 2.5 * sqrt(t)) * (1.0 - 0.85 * t);
    width *= mix(0.75, 1.2, eddy);
    float radial = x / max(width, 0.05);
    float tail = pow(1.0 - t, 0.65) * (1.0 - smoothstep(0.78, 1.0, t));
    float texture = mix(0.55, 1.2, eddy);
    float core = exp(-radial * radial * 5.5) * mix(1.0, texture, smoothstep(0.3, 0.9, t));
    float flame = exp(-radial * radial * 1.7);
    float halo = exp(-radial * radial * 0.48);
    float diamonds = pow(0.5 + 0.5 * cos(t * 58.0 - 0.4), 8.0)
      * exp(-t * 4.5) * core;
    vec3 hot = mix(vec3(0.65, 0.85, 1.0), vec3(1.0, 0.48, 0.09), smoothstep(0.12, 0.85, t));
    vec3 edge = mix(vec3(0.12, 0.38, 1.0), vec3(1.0, 0.19, 0.018), smoothstep(0.0, 0.25, t));
    vec3 color = hot * core * 2.5 + edge * flame * texture * 0.85;
    color += vec3(1.0, 0.16, 0.015) * halo * 0.12 + hot * diamonds * 0.35;
    float alpha = clamp((core + flame * 0.65 + halo * 0.12) * tail * texture, 0.0, 1.0);
    alpha *= smoothstep(0.0, 0.012, t);
    if (alpha < 0.003) discard;
    gl_FragColor = vec4(color * uIntensity, alpha * uThrottle);
  }
`;

export function Plume({ isBurning, engineThrottle = 1, isPaused = false, playbackSpeed = 1, length = 1.8, radius = 0.16, intensity = 1 }) {
  const lightRef = useRef();
  const uniforms = useMemo(() => ({
    uTime: { value: 0 }, uLength: { value: length }, uRadius: { value: radius }, uIntensity: { value: intensity },
    uThrottle: { value: engineThrottle },
  }), []);
  uniforms.uLength.value = length * (0.2 + 0.8 * engineThrottle);
  uniforms.uRadius.value = radius;
  uniforms.uIntensity.value = intensity;
  uniforms.uThrottle.value = engineThrottle;

  useFrame((_, delta) => {
    if (!isBurning || isPaused) return;
    uniforms.uTime.value += Math.min(delta, 0.1) * playbackSpeed;
    if (lightRef.current) lightRef.current.intensity = engineThrottle * intensity * (2.8 + Math.sin(uniforms.uTime.value * 23) * 0.3);
  });

  if (!isBurning) return null;
  return <group position={[0, -0.115, 0]}>
    <mesh frustumCulled={false} renderOrder={2}>
      <planeGeometry args={[1, 1, 1, 32]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
    <pointLight ref={lightRef} color="#ffad66" intensity={2.8 * intensity * engineThrottle} distance={6} decay={2} position={[0, -0.1, 0]} />
  </group>;
}
