import React, { useMemo } from 'react';
import * as THREE from 'three';

function Tank({ radius, height, y, color }) {
  return <group position={[0, y, 0]}>
    <mesh><cylinderGeometry args={[radius, radius, height, 32]} /><meshStandardMaterial color={color} metalness={0.5} roughness={0.3} /></mesh>
    {[-1, 1].map(direction => <group key={direction} position={[0, direction * height / 2, 0]}>
      <mesh scale={[1, 0.45, 1]}><sphereGeometry args={[radius, 24, 12]} /><meshStandardMaterial color={color} metalness={0.55} roughness={0.3} /></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[radius * 1.02, radius * 0.055, 8, 32]} /><meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} /></mesh>
    </group>)}
  </group>;
}

export function RocketInternals({ radius: r, bodyLength, noseLength, halfLength, hideNose }) {
  const bodyCenter = -noseLength / 2;
  const base = -halfLength;
  const tankHeight = bodyLength * 0.25;
  const fuelY = bodyCenter + bodyLength * 0.16;
  const feedY = bodyCenter - bodyLength * 0.18;
  const engineY = base + bodyLength * 0.1;
  const pipe = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(r * 0.45, fuelY, r * 0.5),
    new THREE.Vector3(r * 0.76, fuelY - tankHeight * 0.3, r * 0.5),
    new THREE.Vector3(r * 0.76, engineY + tankHeight * 0.15, r * 0.5),
    new THREE.Vector3(r * 0.25, engineY, r * 0.5),
  ]), [r, fuelY, tankHeight, engineY]);
  return <group>
    <Tank radius={r * 0.65} height={tankHeight} y={fuelY} color="#0891b2" />
    <Tank radius={r * 0.65} height={tankHeight} y={feedY} color="#d97706" />
    {/* Structural bulkheads and longerons hold the compartments in the shell. */}
    {[0.03, 0.35, 0.67, 0.97].map(fraction => <mesh key={fraction} position={[0, base + bodyLength * fraction, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[r * 0.88, r * 0.055, 8, 32]} /><meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
    </mesh>)}
    {[-1, 1].map(side => <mesh key={side} position={[r * 0.78 * side, bodyCenter, -r * 0.3]}>
      <boxGeometry args={[r * 0.08, bodyLength * 0.94, r * 0.1]} /><meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
    </mesh>)}
    <mesh><tubeGeometry args={[pipe, 24, r * 0.045, 8, false]} /><meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.2} /></mesh>
    <group position={[0, engineY, 0]}>
      <mesh><cylinderGeometry args={[r * 0.46, r * 0.33, bodyLength * 0.13, 24]} /><meshStandardMaterial color="#475569" metalness={0.9} roughness={0.25} /></mesh>
      <mesh position={[0, -bodyLength * 0.025, 0]}><cylinderGeometry args={[r * 0.25, r * 0.25, bodyLength * 0.09, 20]} /><meshStandardMaterial color="#fb923c" emissive="#9a3412" emissiveIntensity={0.35} metalness={0.5} roughness={0.3} /></mesh>
      {[0, Math.PI / 2].map(angle => <mesh key={angle} rotation={[0, angle, 0]}><boxGeometry args={[r * 1.2, bodyLength * 0.025, r * 0.15]} /><meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} /></mesh>)}
    </group>
    {!hideNose && <group>
      <mesh position={[0, halfLength - noseLength * 0.55, 0]}>
        <cylinderGeometry args={[r * 0.45, r * 0.68, noseLength * 0.36, 24]} /><meshStandardMaterial color="#8b5cf6" metalness={0.45} roughness={0.3} />
      </mesh>
      <mesh position={[0, base + bodyLength * 0.88, r * 0.28]}><boxGeometry args={[r * 1.1, bodyLength * 0.08, r * 0.25]} /><meshStandardMaterial color="#059669" roughness={0.5} /></mesh>
      {[-1, 0, 1].map(offset => <mesh key={offset} position={[r * offset * 0.25, base + bodyLength * 0.88, r * 0.45]}><boxGeometry args={[r * 0.17, bodyLength * 0.035, r * 0.08]} /><meshStandardMaterial color="#0f172a" metalness={0.3} roughness={0.5} /></mesh>)}
    </group>}
  </group>;
}
