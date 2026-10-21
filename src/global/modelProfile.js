// Schematic component proportions, distinct from verified overall dimensions.
export function modelProfile(vehicle) {
  const height=vehicle.height||7.3;
  const fractions={falcon9:[.74,.26],falconheavy:[.74,.26],saturnv:[.46,.31,.23],sls:[.81,.19],starship:[72/(124*.82),1-72/(124*.82)],electron:[.66,.34],ariane6:[.78,.22],blackbrant:[.3,.7],soyuz:[.4,.37,.23]}[vehicle.id]||Array.from({length:Math.max(1,vehicle.stages)},()=>1/Math.max(1,vehicle.stages));
  const body=height*(vehicle.category==='spacecraft'?.56:.82);
  let offset=0;
  return {height,body,stages:fractions.map((fraction,index)=>{const stage={offset,length:body*fraction,radiusScale:vehicle.id==='saturnv'&&index===2?.66:1};offset+=stage.length;return stage;})};
}
