import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RocketModel } from './RocketModel.jsx';
import { getEngineStages } from '../../physics/stages.js';
import { getSeparatedStagePose } from './separationMotion.js';

function StageSegment({ config, material, aeroData, index, isEngineActive = false, engineThrottle = 1, isPaused, playbackSpeed, cutaway, hideNozzle = false, showMarkers = false }) {
  const engines = getEngineStages(config);
  const segment = config.bodyLength / engines.length;
  return <RocketModel config={{ ...config, bodyLength: segment, noseLength: index === engines.length - 1 ? config.noseLength : 0.001,
    finCount: index === 0 ? config.finCount : 0, thrustVac: engines[index].thrust }} material={material} aeroData={aeroData}
    isEngineActive={isEngineActive} engineThrottle={engineThrottle} isPaused={isPaused} playbackSpeed={playbackSpeed} cutaway={cutaway}
    hideNose={index !== engines.length - 1} hideNozzle={hideNozzle} showMarkers={showMarkers} />;
}

export function StageAssembly({ config, material, aeroData, activeStage, isEngineActive, engineThrottle, isPaused, playbackSpeed, cutaway, showMarkers, events, clockRef }) {
  const refs = useRef([]);
  const engines = getEngineStages(config);
  const segment = config.bodyLength / engines.length;
  const base = -(config.bodyLength + config.noseLength) / 2;
  // Hide the attached segment on the same simulation frame that displays debris.
  useFrame(() => {
    refs.current.forEach((group, index) => {
      if (group) group.visible = !events.some(event => event.stageIndex === index && clockRef.current >= event.time);
    });
  });
  return <group scale={cutaway ? [2.2, 1, 2.2] : [1, 1, 1]}>
    {engines.map((engine, index) => <group key={index} name={`attached-stage-${index + 1}`} ref={node => { refs.current[index] = node; }}
      position={[0, base + index * segment + (segment + (index === engines.length - 1 ? config.noseLength : 0.001)) / 2, 0]}>
      <StageSegment config={config} material={material} aeroData={aeroData} index={index}
        isEngineActive={isEngineActive && index + 1 === activeStage} engineThrottle={engineThrottle} isPaused={isPaused} playbackSpeed={playbackSpeed} cutaway={cutaway}
        hideNozzle={index + 1 !== activeStage && !cutaway} showMarkers={engines.length === 1 && showMarkers} />
    </group>)}
  </group>;
}

export function SeparatedStages({ config, material, aeroData, events, clockRef, cutaway }) {
  const refs = useRef([]);
  useFrame(() => {
    events.forEach((event, index) => {
      const group = refs.current[index];
      if (!group) return;
      const pose = getSeparatedStagePose(config, event, clockRef.current);
      group.visible = pose.visible;
      if (!pose.visible) return;
      group.position.set(pose.x, pose.y, pose.z);
      group.rotation.z = pose.rotation;
      group.scale.set(pose.scale * (cutaway ? 2.2 : 1), pose.scale, pose.scale * (cutaway ? 2.2 : 1));
    });
  });
  return <group>{events.map((event, index) => <group key={event.stageIndex} name={`separated-stage-${event.stageIndex + 1}`} visible={false} ref={node => { refs.current[index] = node; }}>
    <StageSegment config={config} material={material} aeroData={aeroData} index={event.stageIndex}
      cutaway={cutaway} isPaused playbackSpeed={1} />
  </group>)}</group>;
}
