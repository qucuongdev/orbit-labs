import React from 'react';
import { Html } from '@react-three/drei';

export function Markers({ xCg, xCp, totalLength, showLabels = true }) {
  // Chuyển đổi tọa độ từ đầu mũi (0) đến đuôi (totalLength)
  // Trong Three.js, đặt gốc ở giữa thân hoặc đế
  // Giả sử đỉnh mũi ở y = totalLength / 2, đáy ở y = -totalLength / 2
  const halfLen = totalLength / 2.0;
  const yCg = halfLen - xCg;
  const yCp = halfLen - xCp;

  return (
    <group>
      {/* 1. ĐIỂM TRỌNG TÂM CG (XANH LÁ) */}
      <group position={[0, yCg, 0]}>
        <mesh>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.8} />
        </mesh>
        {/* Vòng hào quang quanh CG */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.06, 0.08, 32]} />
          <meshBasicMaterial color="#10b981" side={2} />
        </mesh>
        {showLabels && (
          <Html distanceFactor={6} position={[0.15, 0, 0]}>
            <div className="bg-emerald-950/90 border border-emerald-500 text-emerald-300 font-mono text-[11px] px-2 py-0.5 rounded shadow-lg backdrop-blur-sm whitespace-nowrap pointer-events-none">
              <span className="font-bold">● CG:</span> {xCg.toFixed(2)}m (Trọng tâm)
            </div>
          </Html>
        )}
      </group>

      {/* 2. ĐIỂM TÂM ÁP SUẤT CP (ĐỎ NEON) */}
      <group position={[0, yCp, 0]}>
        <mesh>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.8} />
        </mesh>
        {/* Vòng hào quang quanh CP */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.06, 0.08, 32]} />
          <meshBasicMaterial color="#ef4444" side={2} />
        </mesh>
        {showLabels && (
          <Html distanceFactor={6} position={[-0.15, 0, 0]}>
            <div className="bg-red-950/90 border border-red-500 text-red-300 font-mono text-[11px] px-2 py-0.5 rounded shadow-lg backdrop-blur-sm whitespace-nowrap pointer-events-none -translate-x-full">
              <span className="font-bold">▲ CP:</span> {xCp.toFixed(2)}m (Tâm áp suất)
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}
