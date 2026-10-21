import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { Markers } from './Markers.jsx';
import { Plume } from './Plume.jsx';
import { getPlumeAppearance } from '../../physics/flightVisuals.js';
import { RocketInternals } from './RocketInternals.jsx';

export function RocketModel({ config, material, aeroData, isEngineActive = false, engineThrottle = 1, isPaused = false, playbackSpeed = 1, showMarkers = true, cutaway = false, hideNose = false, hideNozzle = false }) {
  const {
    noseLength,
    noseShape,
    bodyDiameter,
    bodyLength,
    finCount,
    finSpan,
    finRootChord,
    finTipChord,
    finSweep,
    wallThickness
  } = config;

  const r = bodyDiameter / 2.0;
  const totalLength = noseLength + bodyLength;
  const halfLen = totalLength / 2.0;
  const plume = getPlumeAppearance(bodyDiameter, config.thrustVac * engineThrottle);

  // Tính vị trí Y của từng bộ phận (Gốc tọa độ tại tâm giữa toàn bộ tên lửa)
  const yNoseBase = halfLen - noseLength;
  const yNoseCenter = halfLen - noseLength / 2.0;
  const yBodyCenter = yNoseBase - bodyLength / 2.0;
  const yBase = -halfLen;

  // 1. Tạo hình học cánh đơn (Fin Geometry dạng hình thang quét mép trước)
  const finGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const cr = finRootChord;
    const ct = finTipChord;
    const s = finSpan;
    const gamma = finSweep;

    // Vẽ hình thang cánh trên mặt phẳng XY
    // (0, 0) là mép trước gốc cánh
    shape.moveTo(0, 0);
    shape.lineTo(gamma, s);             // Đi ra mép trước mút cánh
    shape.lineTo(gamma + ct, s);        // Mép sau mút cánh
    shape.lineTo(cr, 0);                // Mép sau gốc cánh
    shape.closePath();

    const extrudeSettings = {
      depth: Math.max(0.003, wallThickness * 1.5),
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.001,
      bevelThickness: 0.001
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [finSpan, finRootChord, finTipChord, finSweep, wallThickness]);
  useEffect(() => () => finGeometry.dispose(), [finGeometry]);

  // Vị trí gắn gốc cánh ở đáy thân
  const yFinAttach = yBase + finRootChord;

  return (
    <group>
      {/* ================= 1. MŨI TÊN LỬA (NOSE CONE) ================= */}
      {!hideNose && <mesh position={[0, yNoseCenter, 0]}>
        <coneGeometry args={[r, noseLength, 48, 1, cutaway, cutaway ? 1.9 : 0, cutaway ? 4.1 : Math.PI * 2]} />
        <meshStandardMaterial
          color={material.color}
          metalness={material.metalness}
          roughness={material.roughness}
          side={cutaway ? THREE.DoubleSide : THREE.FrontSide}
        />
      </mesh>}

      {/* Chóp nhọn khí động học đỉnh mũi */}
      {!hideNose && <mesh position={[0, halfLen + 0.03, 0]}>
        <cylinderGeometry args={[0.005, 0.015, 0.06, 16]} />
        <meshStandardMaterial color="#ff3333" metalness={0.9} roughness={0.1} />
      </mesh>}

      {/* ================= 2. THÂN TÊN LỬA (BODY TUBE) ================= */}
      <mesh position={[0, yBodyCenter, 0]}>
        <cylinderGeometry args={[r, r, bodyLength, 48, 1, cutaway, cutaway ? 1.9 : 0, cutaway ? 4.1 : Math.PI * 2]} />
        <meshStandardMaterial
          color={material.color}
          metalness={material.metalness}
          roughness={material.roughness}
          side={cutaway ? THREE.DoubleSide : THREE.FrontSide}
        />
      </mesh>

      {/* Khớp nối chuyển tiếp chóp mũi - thân */}
      <mesh position={[0, yNoseBase, 0]}>
        <cylinderGeometry args={[r * 1.01, r * 1.01, 0.02, 32]} />
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* ================= 3. CỤM CÁNH ĐUÔI (FIN SET) ================= */}
      {finCount > 0 && Array.from({ length: finCount }).map((_, index) => {
        const angle = (index * 2 * Math.PI) / finCount;
        return (
          <group
            key={`fin-${index}`}
            position={[0, yFinAttach, 0]}
            rotation={[0, angle, 0]}
          >
            {/* Cánh vươn ra theo trục X */}
            <mesh
              geometry={finGeometry}
              position={[r, 0, 0]}
              rotation={[0, 0, -Math.PI / 2]} // Xoay cánh phẳng vuông góc thân
            >
              <meshStandardMaterial
                color="#e11d48"
                metalness={0.5}
                roughness={0.3}
              />
            </mesh>
          </group>
        );
      })}

      {/* ================= 4. LOA PHỤT ĐỘNG CƠ (DE LAVAL NOZZLE) ================= */}
      {!hideNozzle && <group position={[0, yBase - 0.12, 0]}>
        {/* Vỏ loa phụt dạng nón cụt ngược */}
        <mesh>
          <cylinderGeometry args={[r * 0.45, r * 0.85, 0.24, 32, 1, true]} />
          <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} side={2} />
        </mesh>
        {/* Lõi họng xả bên trong */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[r * 0.4, r * 0.4, 0.05, 32]} />
          <meshStandardMaterial color="#f97316" emissive="#ea580c" emissiveIntensity={0.5} />
        </mesh>

        {/* Khói lửa khi kích hoạt động cơ */}
        <Plume isBurning={isEngineActive} engineThrottle={engineThrottle} isPaused={isPaused} playbackSpeed={playbackSpeed} {...plume} />
      </group>}

      {cutaway && <RocketInternals radius={r} bodyLength={bodyLength} noseLength={noseLength} halfLength={halfLen} hideNose={hideNose} />}

      {/* ================= 5. CHỈ THỊ TRỌNG TÂM CG & TÂM ÁP SUẤT CP ================= */}
      {showMarkers && aeroData && (
        <Markers
          xCg={aeroData.xCgInitial}
          xCp={aeroData.xCp}
          totalLength={totalLength}
        />
      )}
    </group>
  );
}
