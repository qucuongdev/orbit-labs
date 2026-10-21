import React, { useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, GizmoHelper, GizmoViewport, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { StageAssembly, SeparatedStages } from './StageAssembly.jsx';
import { sampleFlight } from '../../physics/playback.js';
import { SpaceEnvironment } from './SpaceEnvironment.jsx';

import { altitudeToVisualY } from './visualScale.js';
import { Parachute } from './Parachute.jsx';
import { getRocketAttitude, isRecoveryStage } from '../../physics/flightVisuals.js';
import { getSeparationFocus } from './separationMotion.js';

function RocketFlightScene({ config, material, aeroData, flightState, cameraMode, playbackSpeed, cutaway, clockRef, audioRef }) {
  const rocketGroupRef = useRef(), bodyPivotRef = useRef(), bodyMountRef = useRef(), controlsRef = useRef();
  const cursorRef = useRef(0), previousTimeRef = useRef(0);
  const { camera } = useThree();
  const halfLength = (config.noseLength + config.bodyLength) / 2;
  const modelScale = Math.min(1, 3 / (halfLength * 2));
  const recovering = isRecoveryStage(flightState.flightStage);
  const vectors = React.useMemo(() => ({ position: new THREE.Vector3(), target: new THREE.Vector3(),
    forward: new THREE.Vector3(), up: new THREE.Vector3(), quaternion: new THREE.Quaternion() }), []);

  useEffect(() => {
    if (flightState.flightStage === 'READY') {
      cursorRef.current = 0; previousTimeRef.current = 0;
      camera.position.set(3.5, 2.5, 5); camera.up.set(0, 1, 0);
      controlsRef.current?.target.set(0, 1.5, 0);
    }
  }, [flightState.flightStage, camera]);
  useEffect(() => {
    camera.up.set(0, 1, 0);
    camera.fov = cameraMode === 'pov' ? 78 : 48;
    camera.updateProjectionMatrix();
    if (cameraMode !== 'pov' && rocketGroupRef.current) {
      const position = rocketGroupRef.current.position;
      camera.position.set(position.x + 3.5, position.y + 2.2, 5);
      controlsRef.current?.target.copy(position);
    }
  }, [cameraMode, camera]);

  useFrame((state, delta) => {
    if (!rocketGroupRef.current) return;
    const traj = flightState.trajectoryData;
    const sampleTime = clockRef.current;
    if (sampleTime < previousTimeRef.current) cursorRef.current = 0;
    previousTimeRef.current = sampleTime;
    const { telemetry, cursor } = sampleFlight(traj, sampleTime, config, cursorRef.current);
    cursorRef.current = cursor;
    const totalH = config.noseLength + config.bodyLength;
    if (telemetry) {
      rocketGroupRef.current.position.set(telemetry.downrange * 0.05, altitudeToVisualY(telemetry.altitude) + totalH * modelScale / 2 + 0.3, 0);
      if (!flightState.isPaused && bodyPivotRef.current) {
        const stage = flightState.flightStage === 'LANDED' ? 'LANDED' : telemetry.stage;
        const angle = getRocketAttitude(stage, sampleTime, telemetry.horizontalVelocity, telemetry.verticalVelocity, config.windSpeed ?? 0);
        bodyPivotRef.current.rotation.z = stage === 'POWERED_FLIGHT' ? angle : THREE.MathUtils.damp(bodyPivotRef.current.rotation.z, angle, 6, delta * playbackSpeed);
      }
    } else {
      rocketGroupRef.current.position.set(0, halfLength * modelScale + 0.3, 0);
      bodyPivotRef.current?.rotation.set(0, 0, 0);
    }
    rocketGroupRef.current.updateMatrixWorld(true);
    if (cameraMode === 'pov' && bodyMountRef.current) {
      const r = config.bodyDiameter / 2;
      vectors.position.set(r * 1.7 + 0.08, halfLength - config.noseLength * 0.8, 0.05);
      vectors.target.set(r * 0.8, -halfLength - 1, -0.2);
      bodyMountRef.current.localToWorld(vectors.position);
      bodyMountRef.current.localToWorld(vectors.target);
      bodyMountRef.current.getWorldQuaternion(vectors.quaternion);
      vectors.up.set(0, 0, 1).applyQuaternion(vectors.quaternion);
      camera.position.copy(vectors.position); camera.up.copy(vectors.up); camera.lookAt(vectors.target);
    } else if (cameraMode === 'follow' && controlsRef.current) {
      const target = rocketGroupRef.current.position;
      const focus = getSeparationFocus(config, flightState.events, sampleTime, target);
      const underChute = telemetry && isRecoveryStage(telemetry.stage);
      const targetY = focus.y + (underChute ? halfLength * modelScale * 0.6 : 0);
      controlsRef.current.target.x = THREE.MathUtils.damp(controlsRef.current.target.x, focus.x, 5, delta);
      controlsRef.current.target.y = THREE.MathUtils.damp(controlsRef.current.target.y, targetY, 5, delta);
      camera.position.x = THREE.MathUtils.damp(camera.position.x, focus.x + 3.5, 4, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY + 2.2, 4, delta);
      const fitDistance = focus.span * 1.2 / (2 * Math.tan(camera.fov * Math.PI / 360) * Math.min(1, camera.aspect));
      camera.position.z = THREE.MathUtils.damp(camera.position.z, Math.max(underChute ? 9 + (config.mainDiameter ?? 2.4) : 5, fitDistance), 4, delta);
    }
    camera.getWorldDirection(vectors.forward);
    vectors.up.copy(camera.up).normalize();
    audioRef.current?.position(rocketGroupRef.current.position, camera.position, vectors.forward, vectors.up);
  }, -0.5);

  return <>
    <OrbitControls ref={controlsRef} makeDefault enabled={cameraMode !== 'pov'} minDistance={0.7} maxDistance={200}
      enableDamping dampingFactor={0.05} />
    <group ref={rocketGroupRef} scale={modelScale}>
      <group ref={bodyPivotRef} position={[0, halfLength, 0]}>
        <group ref={bodyMountRef} position={[0, -halfLength, 0]}>
          <StageAssembly config={config} material={material} aeroData={aeroData}
            activeStage={flightState.currentTelemetry?.engineStage ?? 1} isEngineActive={flightState.isEngineActive}
            engineThrottle={flightState.currentTelemetry?.throttle ?? 0}
            events={flightState.events} clockRef={clockRef}
            isPaused={flightState.isPaused} playbackSpeed={playbackSpeed} cutaway={cutaway} showMarkers={flightState.flightStage === 'READY'} />
        </group>
      </group>
      {recovering && <Parachute key={flightState.flightStage}
        diameter={flightState.flightStage === 'MAIN_DESCENT' ? (config.mainDiameter ?? 2.4) : (config.drogueDiameter ?? 0.6)}
        attachmentHeight={halfLength} isMain={flightState.flightStage === 'MAIN_DESCENT'}
        isPaused={flightState.isPaused} playbackSpeed={playbackSpeed} />}
    </group>
    <SeparatedStages config={config} material={material} aeroData={aeroData} events={flightState.events} clockRef={clockRef} cutaway={cutaway} />
  </>;
}

export function RocketCanvas({
  config,
  material,
  aeroData,
  flightState,
  cameraMode,
  setCameraMode,
  clockRef,
  audioRef,
  cutaway,
  playbackSpeed,
}) {
  return (
    <div className="w-full h-full relative bg-slate-950">
      {cutaway && <aside aria-label="Chú giải mặt cắt" className="absolute top-3 left-3 z-10 max-w-[185px] rounded-xl border border-cyan-500/25 bg-slate-950/90 p-3 backdrop-blur text-[10px] shadow-lg pointer-events-none">
        <h3 className="text-cyan-200 tracking-wider font-mono font-bold mb-1">MẶT CẮT KỸ THUẬT</h3>
        <p className="text-slate-500 mb-3">Vỏ mở · Cấu tạo minh họa</p>
        {[['01', 'Tải trọng', '#a78bfa'], ['02', 'Điện tử điều khiển', '#10b981'], ['03', 'Khoang nhiên liệu', '#06b6d4'], ['04', 'Khoang cấp liệu', '#f59e0b'], ['05', 'Cụm động cơ', '#94a3b8']].map(([id, label, color]) => <div key={id} className="flex items-center gap-2 py-1">
          <span className="font-mono" style={{ color }}>{id}</span><span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} /><span className="text-slate-200">{label}</span>
        </div>)}
        <p className="text-slate-500 mt-3 leading-relaxed">Bề ngang chi tiết được phóng đại để dễ quan sát. Số liệu bay dùng kích thước đã nhập.</p>
      </aside>}
      {isRecoveryStage(flightState.flightStage) && <div className="absolute bottom-3 left-3 z-10 rounded-lg border border-cyan-500/30 bg-slate-950/90 px-3 py-2 text-xs text-cyan-200 font-mono pointer-events-none">
        <div>{flightState.flightStage === 'MAIN_DESCENT' ? 'Dù chính đang mở' : 'Dù con đang mở'} · Thân treo dưới dù</div>
        <div className="text-[10px] text-slate-400 mt-1">Gió {config.windSpeed ?? 0} m/s · Đung đưa minh họa</div>
      </div>}
      {/* Nút bật/tắt camera bám theo tên lửa */}
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        <label className="flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-slate-950/90 px-2 py-1.5 text-xs font-mono text-cyan-200">
          Camera
          <select aria-label="Chế độ camera" value={cameraMode} onChange={e => setCameraMode(e.target.value)} className="bg-slate-900 text-cyan-200 rounded p-1">
            <option value="follow">Bám tên lửa</option><option value="free">Tự do</option><option value="pov">POV gắn thân</option>
          </select>
        </label>
      </div>

      <Canvas
        camera={{ position: [3.5, 2.5, 5.0], fov: 48 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          {/* 1. ÁNH SÁNG ĐA HƯỚNG */}
          <ambientLight intensity={0.7} />
          <hemisphereLight skyColor="#0284c7" groundColor="#0f172a" intensity={0.7} />
          <directionalLight position={[12, 18, 10]} intensity={2.0} castShadow />
          <directionalLight position={[-12, 6, -10]} intensity={0.6} color="#38bdf8" />
          <directionalLight position={[0, -5, 5]} intensity={0.4} color="#f97316" />

          {/* 2. MÔI TRƯỜNG VŨ TRỤ, LỒNG KHÔNG GIAN 3D & VÒNG CAO ĐỘ */}
          <SpaceEnvironment />

          {/* 3. LA BÀN TRỤC TỌA ĐỘ CAD GÓC PHẢI DƯỚI */}
          <GizmoHelper alignment="bottom-right" margin={[70, 70]}>
            <GizmoViewport
              axisColors={['#ef4444', '#10b981', '#3b82f6']}
              labelColor="#ffffff"
            />
          </GizmoHelper>

          {/* 4. SÀN BỆ PHÓNG DẠNG LƯỚI KỸ THUẬT */}
          <Grid
            position={[0, 0, 0]}
            infiniteGrid
            cellSize={0.5}
            sectionSize={2.0}
            cellColor="#334155"
            sectionColor="#0284c7"
            fadeDistance={35}
            fadeStrength={1.5}
          />

          {/* 5. CẢNH VẬT BAY CHÍNH & TÊN LỬA NỘI SUY 60 FPS */}
          <RocketFlightScene
            config={config}
            material={material}
            aeroData={aeroData}
            flightState={flightState}
            cameraMode={cameraMode}
            clockRef={clockRef}
            audioRef={audioRef}
            cutaway={cutaway}
            playbackSpeed={playbackSpeed}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
