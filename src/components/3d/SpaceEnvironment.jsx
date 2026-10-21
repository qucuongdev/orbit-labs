import React from 'react';
import { Stars, Html } from '@react-three/drei';
import { altitudeToVisualY } from './visualScale.js';
import * as THREE from 'three';

// Danh sách các mốc cao độ không gian tham chiếu (Altitude reference rings)
const ALTITUDE_RINGS = [
  { altMeters: 50, label: '50m - Rời bệ phóng', visualY: 5.0, color: '#38bdf8' },
  { altMeters: 200, label: '200m - Pitch-Over', visualY: 15.0, color: '#38bdf8' },
  { altMeters: 500, label: '500m - Gravity Turn', visualY: 30.0, color: '#06b6d4' },
  { altMeters: 1000, label: '1,000m - Tầng đối lưu', visualY: 55.0, color: '#0ea5e9' },
  { altMeters: 3000, label: '3,000m - Vượt Mach 1', visualY: 85.0, color: '#6366f1' },
  { altMeters: 5000, label: '5,000m - Tầng bình lưu', visualY: 110.0, color: '#a855f7' }
];

export function SpaceEnvironment() {
  return (
    <group>
      {/* 1. BẦU TRỜI ĐẦY SAO VŨ TRỤ (STARRY SPACE DREI) */}
      <Stars
        radius={150}
        depth={60}
        count={3500}
        factor={5}
        saturation={0}
        fade
        speed={1.2}
      />

      {/* 2. KHUNG LỒNG LƯỚI KHÔNG GIAN 3D (3D SPATIAL GRID CAGE) */}
      <mesh position={[0, 60, 0]}>
        <cylinderGeometry args={[25, 25, 125, 16, 12, true]} />
        <meshBasicMaterial
          color="#0369a1"
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>

      {/* 4 Cột gióng đứng tạo khung lồng không gian */}
      {[-1, 1].map((x) =>
        [-1, 1].map((z) => (
          <mesh key={`post-${x}-${z}`} position={[x * 18, 60, z * 18]}>
            <cylinderGeometry args={[0.04, 0.04, 125, 8]} />
            <meshBasicMaterial color="#0284c7" transparent opacity={0.3} />
          </mesh>
        ))
      )}

      {/* 3. CÁC VÒNG TRÒN CAO ĐỘ PHÁT SÁNG (GLOWING ALTITUDE RINGS) */}
      {ALTITUDE_RINGS.map((ring, idx) => (
        <group key={`ring-${idx}`} position={[0, altitudeToVisualY(ring.altMeters), 0]}>
          {/* Vòng tròn định vị độ cao */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[18.0, 18.2, 48]} />
            <meshBasicMaterial color={ring.color} transparent opacity={0.4} side={THREE.DoubleSide} />
          </mesh>

          {/* Vạch ngang tham chiếu */}
          <mesh rotation={[0, 0, 0]}>
            <boxGeometry args={[36.0, 0.03, 0.03]} />
            <meshBasicMaterial color={ring.color} transparent opacity={0.2} />
          </mesh>

          {/* Nhãn chữ cao độ 3D bám trên vành lồng */}
          <Html position={[18.5, 0, 0]} distanceFactor={35} center>
            <div
              className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider whitespace-nowrap shadow-md pointer-events-none border backdrop-blur-md"
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                borderColor: ring.color,
                color: ring.color
              }}
            >
              ▲ {ring.label}
            </div>
          </Html>
        </group>
      ))}

      {/* 4. MẶT SÀN BỆ PHÓNG TRÒN VÀ MẶT ĐẤT CHI TIẾT */}
      <group position={[0, -0.02, 0]}>
        {/* Vòng tròn bệ phóng trung tâm */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 4.5, 32]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.4} />
        </mesh>
        {/* Vạch đánh dấu khu vực an toàn màu vàng */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[4.4, 4.6, 32]} />
          <meshBasicMaterial color="#eab308" />
        </mesh>
      </group>
    </group>
  );
}
