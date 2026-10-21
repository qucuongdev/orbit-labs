import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Parachute({ diameter, attachmentHeight, isMain, isPaused, playbackSpeed }) {
  const canopyRef = useRef();
  const inflationRef = useRef(isMain ? 0.22 : 0.02);
  const radius = diameter / 2;
  const lineLength = Math.max(0.65, diameter * 0.78);
  const ropes = useMemo(() => {
    const vertices = [];
    for (let i = 0; i < 12; i++) {
      const angle = i * Math.PI / 6;
      vertices.push(0, 0, 0, radius * Math.cos(angle), lineLength, radius * Math.sin(angle));
    }
    return new Float32Array(vertices);
  }, [radius, lineLength]);

  useFrame((_, delta) => {
    if (!canopyRef.current || isPaused) return;
    inflationRef.current = THREE.MathUtils.damp(inflationRef.current, 1, 5, Math.min(delta, 0.1) * playbackSpeed);
    canopyRef.current.scale.setScalar(inflationRef.current);
  });

  return <group position={[0, attachmentHeight, 0]} name={isMain ? 'main-parachute' : 'drogue-parachute'}>
    <group ref={canopyRef} scale={inflationRef.current}>
      <lineSegments>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[ropes, 3]} /></bufferGeometry>
        <lineBasicMaterial color="#dbeafe" transparent opacity={0.85} />
      </lineSegments>
      <group position={[0, lineLength, 0]} scale={[1, 0.6, 1]}>
        {Array.from({ length: 12 }, (_, i) => <mesh key={i}>
          <sphereGeometry args={[radius, 4, 12, i * Math.PI / 6, Math.PI / 6, 0, Math.PI / 2]} />
          <meshStandardMaterial color={i % 2 ? '#f8fafc' : isMain ? '#f97316' : '#38bdf8'} roughness={0.9} side={THREE.DoubleSide} />
        </mesh>)}
      </group>
    </group>
  </group>;
}
