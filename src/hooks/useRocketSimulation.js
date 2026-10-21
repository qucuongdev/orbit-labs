import { useState, useMemo, useRef, useEffect } from 'react';
import { DEFAULT_MATERIAL } from '../physics/materials.js';
import { calculateAerodynamicsAndCG } from '../physics/barrowman.js';
import { G0 } from '../physics/constants.js';
import { getEngineStages } from '../physics/stages.js';
import { sampleFlight } from '../physics/playback.js';
import { FlightAudio } from '../audio/FlightAudio.js';
import { INITIAL_CONFIG } from '../physics/defaultConfig.js';
export { INITIAL_CONFIG } from '../physics/defaultConfig.js';

const readyState = () => ({ isFlying: false, isPaused: false, isEngineActive: false, flightStage: 'READY',
  currentTelemetry: null, trajectoryData: [], flightSummary: null, events: [], stagePlan: [] });

export function useRocketSimulation() {
  const [config, setConfig] = useState(INITIAL_CONFIG);
  const [material, setMaterial] = useState(DEFAULT_MATERIAL);
  const [flightState, setFlightState] = useState(readyState);
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [launchError, setLaunchError] = useState('');
  const [countdown, setCountdown] = useState(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [cameraMode, setCameraMode] = useState('follow');
  const [environmentMode, setEnvironmentMode] = useState('grid');
  const [cutaway, setCutaway] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const workerRef = useRef(null), timerRef = useRef(null), resultRef = useRef(null);
  const clockRef = useRef(0), playbackCursorRef = useRef(0), pendingRef = useRef(false);
  const countdownRef = useRef(null), speedRef = useRef(playbackSpeed);
  const audioRef = useRef(null);
  const aeroData = useMemo(() => calculateAerodynamicsAndCG(config, material), [config, material]);
  const hasLiftOffThrust = getEngineStages(config)[0].thrust * Math.sin(config.launchAngleDeg * Math.PI / 180) > aeroData.initialMass * G0;
  const isStableForLaunch = aeroData.staticMarginInitial >= 1 && hasLiftOffThrust;
  const isLaunchPending = countdown !== null || isCalculating;
  const busy = flightState.isFlying || isLaunchPending;

  useEffect(() => { speedRef.current = playbackSpeed; }, [playbackSpeed]);
  useEffect(() => () => {
    workerRef.current?.terminate(); clearInterval(timerRef.current); audioRef.current?.dispose();
  }, []);

  const unlockAudio = () => {
    if (!soundEnabled) return;
    audioRef.current ??= new FlightAudio();
    audioRef.current.unlock().catch(() => setLaunchError('Trình duyệt chưa cho phép âm thanh. Bạn có thể tiếp tục mô phỏng.'));
  };

  const startWhenReady = () => {
    if (!pendingRef.current || countdownRef.current !== null || !resultRef.current) return;
    const result = resultRef.current;
    pendingRef.current = false; resultRef.current = null;
    clockRef.current = 0; playbackCursorRef.current = 0;
    audioRef.current?.beep(0);
    setFlightState({ isFlying: true, isPaused: false, isEngineActive: true, flightStage: result.trajectory[0].stage,
      currentTelemetry: result.trajectory[0], trajectoryData: result.trajectory,
      flightSummary: result.summary, events: result.events, stagePlan: result.stagePlan });
  };

  const handleLaunch = () => {
    if (pendingRef.current || flightState.isFlying || !isStableForLaunch) return;
    unlockAudio();
    pendingRef.current = true; resultRef.current = null;
    setLaunchError(''); setSummaryModalOpen(false); setIsCalculating(true);
    countdownRef.current = 3; setCountdown(3);
    // Unlock has already been requested in the click gesture.
    setTimeout(() => { if (pendingRef.current && soundEnabled) audioRef.current?.beep(3); }, 80);
    timerRef.current = setInterval(() => {
      if (countdownRef.current > 1) {
        countdownRef.current--; setCountdown(countdownRef.current);
        if (soundEnabled) audioRef.current?.beep(countdownRef.current);
      } else {
        clearInterval(timerRef.current); countdownRef.current = null; setCountdown(null); startWhenReady();
      }
    }, 1000);
    const fail = message => {
      workerRef.current?.terminate(); workerRef.current = null;
      clearInterval(timerRef.current); pendingRef.current = false; resultRef.current = null;
      countdownRef.current = null; setCountdown(null); setIsCalculating(false); setLaunchError(message);
    };
    try {
      const worker = new Worker(new URL('../physics/simulation.worker.js', import.meta.url), { type: 'module' });
      workerRef.current = worker;
      worker.onerror = () => fail('Không thể tính quỹ đạo. Vui lòng thử lại.');
      worker.onmessage = ({ data }) => {
        worker.terminate(); workerRef.current = null; setIsCalculating(false);
        if (data.error) { fail(data.error); return; }
        resultRef.current = data.result; startWhenReady();
      };
      worker.postMessage({ config, aeroData });
    } catch { fail('Không thể khởi tạo bộ tính quỹ đạo.'); }
  };

  useEffect(() => {
    if (!flightState.isFlying || flightState.isPaused) return;
    let raf, last = performance.now(), lastHud = 0, previousStage = 0;
    const trajectory = flightState.trajectoryData;
    const tick = now => {
      clockRef.current += Math.max(0, Math.min((now - last) / 1000, 0.1)) * speedRef.current;
      last = now;
      const end = trajectory.at(-1);
      const { telemetry, cursor } = sampleFlight(trajectory, Math.min(clockRef.current, end.time), config, playbackCursorRef.current);
      playbackCursorRef.current = cursor;
      if (telemetry.engineStage !== previousStage && previousStage > 0 && soundEnabled) audioRef.current?.beep(0);
      previousStage = telemetry.engineStage;
      audioRef.current?.update(telemetry, soundEnabled, false, cameraMode === 'pov');
      if (clockRef.current >= end.time) {
        audioRef.current?.update(null, false, false, false);
        setFlightState(prev => ({ ...prev, isFlying: false, isPaused: false, isEngineActive: false,
          flightStage: prev.flightSummary.landed ? 'LANDED' : 'TIME_LIMIT', currentTelemetry: { ...end, isEngineActive: false } }));
        setSummaryModalOpen(true); return;
      }
      if (now - lastHud >= 66) {
        lastHud = now;
        setFlightState(prev => ({ ...prev, currentTelemetry: telemetry, flightStage: telemetry.stage, isEngineActive: telemetry.isEngineActive }));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [flightState.isFlying, flightState.isPaused, flightState.trajectoryData, config, soundEnabled, cameraMode]);

  useEffect(() => {
    audioRef.current?.update(flightState.currentTelemetry, soundEnabled, flightState.isPaused || !flightState.isFlying, cameraMode === 'pov');
  }, [soundEnabled, flightState.isPaused, flightState.isFlying, cameraMode]);

  const handleReset = () => {
    workerRef.current?.terminate(); workerRef.current = null;
    clearInterval(timerRef.current); pendingRef.current = false; resultRef.current = null;
    countdownRef.current = null; setCountdown(null); setIsCalculating(false); setLaunchError('');
    clockRef.current = 0; playbackCursorRef.current = 0;
    speedRef.current = 1; setPlaybackSpeed(1);
    audioRef.current?.update(null, false, false, false);
    setFlightState(readyState()); setSummaryModalOpen(false);
  };
  const toggleSound = () => {
    if (!soundEnabled) {
      audioRef.current ??= new FlightAudio();
      audioRef.current.unlock().catch(() => {});
    }
    setSoundEnabled(value => !value);
  };

  return { config, setConfig, material, setMaterial, aeroData, flightState,
    summaryModalOpen, setSummaryModalOpen, playbackSpeed, setPlaybackSpeed,
    cameraMode, setCameraMode, environmentMode, setEnvironmentMode, cutaway, setCutaway,
    soundEnabled, toggleSound, audioRef, clockRef, countdown, busy,
    isCalculating, isLaunchPending, launchError, hasLiftOffThrust, isStableForLaunch,
    handleLaunch, handleReset, handlePauseResume: () => setFlightState(prev => ({ ...prev, isPaused: !prev.isPaused })) };
}
