import React, { useEffect, useRef } from 'react';
import * as C from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { sampleMission } from './engine.js';
import { modelProfile } from './modelProfile.js';
import { createDetachedStage } from './debris.js';

const cart = v => new C.Cartesian3(...v);
const cyan = C.Color.fromCssColorString('#52e4cf');
function softSprite() {
  const canvas=document.createElement('canvas');canvas.width=64;canvas.height=64;
  const context=canvas.getContext('2d'),gradient=context.createRadialGradient(32,32,0,32,32,32);
  gradient.addColorStop(0,'rgba(255,255,255,1)');gradient.addColorStop(.25,'rgba(255,255,255,.9)');gradient.addColorStop(.6,'rgba(255,255,255,.25)');gradient.addColorStop(1,'rgba(255,255,255,0)');
  context.fillStyle=gradient;context.fillRect(0,0,64,64);return canvas;
}

export default function GlobalScene({mission,vehicle,origin,observation,clockRef,cameraMode,cameraCommand,onPick,onStatus,realScale,clouds,daylight,audioRef,sound,onGroundHeight,onGroundSample}) {
  const container=useRef(null),viewerRef=useRef(null),current=useRef({});
  current.current={mission,vehicle,origin,observation,clockRef,cameraMode,onPick,onStatus,realScale,clouds,daylight,audioRef,sound,onGroundHeight,onGroundSample};
  useEffect(()=>{
    let disposed=false;
    const baseLayer=C.ImageryLayer.fromProviderAsync(C.TileMapServiceImageryProvider.fromUrl('/cesium/Assets/Textures/NaturalEarthII/'));
    let viewer;
    try {
      viewer=new C.Viewer(container.current,{
        baseLayer,baseLayerPicker:false,geocoder:false,homeButton:false,sceneModePicker:false,
        navigationHelpButton:false,animation:false,timeline:false,fullscreenButton:false,
        infoBox:false,selectionIndicator:false,shouldAnimate:false,
        contextOptions:{webgl:{alpha:false,antialias:true,powerPreference:'high-performance'}},
        requestRenderMode:true,maximumRenderTimeChange:Infinity,
      });
    } catch(error) {onStatus(`Không khởi tạo được WebGL: ${error.message}`);return;}
    viewerRef.current=viewer;
    if(import.meta.env.DEV)window.__orbitalViewer=viewer;
    viewer.resolutionScale=1;
    viewer.targetFrameRate=30;
    const {scene}=viewer;
    scene.globe.enableLighting=true;
    scene.globe.depthTestAgainstTerrain=true;
    scene.globe.maximumScreenSpaceError=2.5;
    scene.globe.tileCacheSize=150;
    scene.globe.showGroundAtmosphere=true;
    scene.screenSpaceCameraController.enableCollisionDetection=true;
    scene.screenSpaceCameraController.minimumZoomDistance=5;
    scene.screenSpaceCameraController.maximumZoomDistance=60000000;
    scene.screenSpaceCameraController.inertiaZoom=0.8;
    scene.fog.enabled=true;
    scene.backgroundColor=C.Color.fromCssColorString('#02060d');
    scene.skyBox.show=false;
    // One batched GPU collection: sparse stars, no per-star React updates.
    const stars=scene.primitives.add(new C.PointPrimitiveCollection());
    let seed=1739;
    const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
    for(let i=0;i<4000;i++){
      const z=random()*2-1,a=random()*Math.PI*2,r=Math.sqrt(1-z*z)*1e9;
      stars.add({position:new C.Cartesian3(r*Math.cos(a),r*Math.sin(a),z*1e9),pixelSize:random()>.97?2:1,color:C.Color.WHITE.withAlpha(.2+random()*.6)});
    }
    viewer.camera.setView({destination:C.Cartesian3.fromDegrees(-45,12,20500000)});
    viewer.clock.currentTime=C.JulianDate.fromIso8601('2026-03-20T12:00:00Z');
    onStatus('Natural Earth · bản đồ nền cục bộ');
    let onlineLayer;
    C.ArcGisMapServerImageryProvider.fromUrl('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer').then(provider=>{
      if(disposed)return;
      onlineLayer=viewer.imageryLayers.addImageryProvider(provider);
      let failures=0;
      provider.errorEvent.addEventListener(()=>{if(++failures>=3&&!disposed){onlineLayer.show=false;onStatus('Ảnh vệ tinh mất kết nối · dùng Natural Earth cục bộ');scene.requestRender();}});
      onStatus('Esri World Imagery · đang truyền tile địa hình');scene.requestRender();
    }).catch(()=>{if(!disposed)onStatus('Natural Earth · ảnh vệ tinh không khả dụng');});
    C.ArcGISTiledElevationTerrainProvider.fromUrl('https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer').then(provider=>{
      if(disposed)return;
      viewer.terrainProvider=provider;
      provider.errorEvent.addEventListener(()=>{if(!disposed)onStatus('Một số tile địa hình chưa tải được · độ cao có thể thiếu');});
      onStatus('Esri World Imagery + WorldElevation3D · WGS84');scene.requestRender();
    }).catch(()=>{if(!disposed)onStatus('Địa hình không khả dụng · mặt ellipsoid WGS84');});
    const handler=new C.ScreenSpaceEventHandler(scene.canvas);
    handler.setInputAction(event=>{
      const ray=viewer.camera.getPickRay(event.position);
      const picked=ray&&scene.globe.pick(ray,scene);
      if(!picked)return;
      const p=C.Cartographic.fromCartesian(picked);
      current.current.onPick({lat:C.Math.toDegrees(p.latitude),lon:C.Math.toDegrees(p.longitude),height:Math.max(0,p.height)});
    },C.ScreenSpaceEventType.LEFT_CLICK);
    const cloud=viewer.entities.add({name:'Mây minh họa · không phải thời tiết trực tiếp',position:C.Cartesian3.ZERO,ellipsoid:{radii:new C.Cartesian3(6386137,6386137,6364752),material:new C.ImageMaterialProperty({image:'/earth-clouds.png',transparent:true,color:C.Color.WHITE.withAlpha(0.45)}),slicePartitions:256,stackPartitions:128}});
    const tick=()=>{
      const state=current.current;
      if(!state.mission)return;
      const t=state.clockRef.current.time;
      viewer.clock.currentTime=C.JulianDate.addSeconds(C.JulianDate.fromIso8601(state.daylight?'2026-03-20T12:00:00Z':'2026-03-20T00:00:00Z'),t,new C.JulianDate());
      cloud.show=state.clouds&&C.Cartographic.fromCartesian(viewer.camera.positionWC).height>100000;
      if(state.clockRef.current.playing)scene.requestRender();
    };
    scene.preUpdate.addEventListener(tick);
    return ()=>{disposed=true;handler.destroy();if(!viewer.isDestroyed())viewer.destroy();viewerRef.current=null;if(import.meta.env.DEV)delete window.__orbitalViewer;};
  },[]);

  useEffect(()=>{
    const viewer=viewerRef.current;if(!viewer)return;
    let cancelled=false;
    const sample=()=>{
      const provider=viewer.terrainProvider;
      if(provider instanceof C.EllipsoidTerrainProvider)return;
      C.sampleTerrain(provider,12,[C.Cartographic.fromDegrees(origin.lon,origin.lat)]).then(points=>{
        if(!cancelled&&Number.isFinite(points[0].height))current.current.onGroundHeight?.(origin,Math.max(0,points[0].height));
      }).catch(()=>{});
    };
    sample();const remove=viewer.scene.terrainProviderChanged.addEventListener(sample);
    return()=>{cancelled=true;remove();};
  },[origin.lat,origin.lon]);

  useEffect(()=>{
    const viewer=viewerRef.current;if(!viewer||!mission)return;
    let disposed=false,model;
    const entities=[];
    const add=options=>{const entity=viewer.entities.add(options);entities.push(entity);return entity;};
    const line=mission.samples.filter((_,i)=>i%4===0).map(s=>cart(s.r));
    add({name:'Tuyến dự kiến',polyline:{positions:line,width:1.5,material:new C.PolylineDashMaterialProperty({color:cyan.withAlpha(0.38),dashLength:12}),arcType:C.ArcType.NONE}});
    add({name:'Vệt chuyến bay',polyline:{positions:new C.CallbackProperty(()=>{
      const t=clockRef.current.time,index=Math.floor(t/4);
      return [...line.slice(0,index+1),cart(sampleMission(mission,t).r)];
    },false),width:3,material:new C.PolylineGlowMaterialProperty({glowPower:0.15,color:cyan}),arcType:C.ArcType.NONE}});
    add({position:C.Cartesian3.fromDegrees(origin.lon,origin.lat,(origin.height||0)+8),point:{pixelSize:9,color:cyan,outlineColor:C.Color.BLACK,outlineWidth:2},label:{text:origin.name||'BỆ PHÓNG',font:'11px sans-serif',fillColor:cyan,pixelOffset:new C.Cartesian2(0,22),showBackground:true,backgroundColor:C.Color.BLACK.withAlpha(.6),distanceDisplayCondition:new C.DistanceDisplayCondition(0,40000000)}});
    if(observation) add({position:C.Cartesian3.fromDegrees(observation.lon,observation.lat,(observation.height||0)+8),point:{pixelSize:9,color:C.Color.ORANGE},label:{text:'VÙNG QUAN SÁT',font:'11px sans-serif',pixelOffset:new C.Cartesian2(0,20),showBackground:true}});
    const sample=()=>sampleMission(mission,clockRef.current.time);
    add({position:new C.CallbackProperty(()=>cart(sample().r),false),point:{pixelSize:7,color:C.Color.WHITE,disableDepthTestDistance:0},label:{text:vehicle.name,font:'12px sans-serif',fillColor:C.Color.WHITE,pixelOffset:new C.Cartesian2(20,-22),showBackground:true,backgroundColor:C.Color.BLACK.withAlpha(.55)}});
    const position=()=>cart(sample().r);
    function matrixAt(s) {
      const p=cart(s.r);
      if(s.t<3||mission.suborbital)return C.Transforms.eastNorthUpToFixedFrame(p);
      const next=sampleMission(mission,Math.min(mission.duration,s.t+0.2));
      const velocity=C.Cartesian3.subtract(cart(next.r),p,new C.Cartesian3());
      if(C.Cartesian3.magnitude(velocity)<1e-5)return C.Transforms.eastNorthUpToFixedFrame(p);
      const rotation=C.Transforms.rotationMatrixFromPositionVelocity(p,C.Cartesian3.normalize(velocity,velocity),C.Ellipsoid.WGS84,new C.Matrix3());
      const correction=C.Matrix3.fromRotationY(Math.PI/2);
      C.Matrix3.multiply(rotation,correction,rotation);
      return C.Matrix4.fromRotationTranslation(rotation,p);
    }
    C.Model.fromGltfAsync({url:`/models/${vehicle.id}.glb`,modelMatrix:matrixAt(sample()),minimumPixelSize:realScale?0:56,maximumScale:250000,allowPicking:false,incrementallyLoadTextures:true}).then(result=>{
      if(disposed){result.destroy();return;}
      model=viewer.scene.primitives.add(result);viewer.scene.requestRender();
    }).catch(error=>{if(!disposed)current.current.onStatus(`Lỗi mô hình: ${error.message}`);});
    const sprite=softSprite(),plume=viewer.scene.primitives.add(new C.BillboardCollection()),smoke=viewer.scene.primitives.add(new C.BillboardCollection());
    const flames=Array.from({length:28},()=>plume.add({image:sprite,sizeInMeters:true,show:false}));
    const puffs=Array.from({length:40},()=>smoke.add({image:sprite,sizeInMeters:true,show:false}));
    const debris=[],profile=modelProfile(vehicle);
    for(const event of mission.events.filter(e=>e.stage)) {
      const release=sampleMission(mission,event.t),r0=cart(release.r),next=cart(sampleMission(mission,event.t+1).r),v0=C.Cartesian3.subtract(next,r0,new C.Cartesian3());
      const detached=createDetachedStage(release);
      const releaseOrientation=C.Quaternion.fromRotationMatrix(C.Matrix4.getMatrix3(matrixAt(release),new C.Matrix3()));
      const piece=add({position:new C.CallbackProperty(()=>{
        return cart(detached(clockRef.current.time-event.t).position);
      },false),orientation:new C.CallbackProperty(()=>{
        const spin=detached(clockRef.current.time-event.t).age*.08;
        return C.Quaternion.multiply(releaseOrientation,C.Quaternion.fromHeadingPitchRoll(new C.HeadingPitchRoll(spin,spin*.7,0)),new C.Quaternion());
      },false),model:{uri:`/models/${vehicle.id}-stage-${event.stage}.glb`,minimumPixelSize:12,maximumScale:2500,scale:1,color:C.Color.fromCssColorString('#9cabb6')},label:{text:`Tầng ${event.stage} · minh họa`,font:'10px sans-serif',pixelOffset:new C.Cartesian2(15,15),showBackground:true}});
      debris.push({piece,event});
    }
    const recovery=mission.suborbital&&!mission.conceptual;
    const canopyRadius=(vehicle.diameter||.1)*6;
    const canopy=add({show:false,position:C.Cartesian3.fromDegrees(origin.lon,origin.lat),ellipsoid:{radii:new C.Cartesian3(canopyRadius,canopyRadius,canopyRadius*.5),minimumCone:0,maximumCone:Math.PI/2,material:C.Color.fromCssColorString('#f5a243')}});
    const ropes=Array.from({length:4},()=>add({show:false,polyline:{positions:[C.Cartesian3.ZERO,C.Cartesian3.UNIT_Z],width:1,material:C.Color.LIGHTGRAY,arcType:C.ArcType.NONE}}));
    let lastMode='',lastTime=-1,lastGroundUpdate=0;
    const update=()=>{
      const t=clockRef.current.time,s=sample(),mode=current.current.cameraMode;
      if(performance.now()-lastGroundUpdate>250){
        const ground=viewer.scene.globe.getHeight(C.Cartographic.fromCartesian(cart(s.r)));
        current.current.onGroundSample?.(Number.isFinite(ground)?ground:null);
        lastGroundUpdate=performance.now();
      }
      if(model){model.modelMatrix=matrixAt(s);model.minimumPixelSize=current.current.realScale?0:56;
        if(model.ready)for(let stage=1;stage<=Math.max(1,vehicle.stages);stage++){const node=model.getNode(`stage-${stage}`);if(node)node.show=stage>=s.stage;}
      }
      const burning=s.throttle>.01&&!vehicle.military&&vehicle.category!=='spacecraft';
      const diameter=vehicle.modelDiameter||vehicle.diameter||1,matrix=matrixAt(s),nozzle=profile.stages[Math.min(profile.stages.length-1,s.stage-1)].offset;
      canopy.show=recovery&&t>mission.duration*.5&&t<mission.duration-.5;
      const localRecovery=C.Transforms.eastNorthUpToFixedFrame(cart(s.r));
      if(canopy.show){
        const open=Math.max(.01,Math.min(1,(t-mission.duration*.5)/2)),radius=canopyRadius*open;
        canopy.position=C.Matrix4.multiplyByPoint(localRecovery,new C.Cartesian3(0,0,(vehicle.height||1)+canopyRadius*3),new C.Cartesian3());
        canopy.orientation=C.Quaternion.fromRotationMatrix(C.Matrix4.getMatrix3(localRecovery,new C.Matrix3()));
        canopy.ellipsoid.radii=new C.Cartesian3(radius,radius,radius*.5);
        ropes.forEach((rope,i)=>{rope.polyline.positions=[C.Matrix4.multiplyByPoint(localRecovery,new C.Cartesian3(0,0,vehicle.height||1),new C.Cartesian3()),C.Matrix4.multiplyByPoint(localRecovery,new C.Cartesian3(Math.cos(i*Math.PI/2)*radius,Math.sin(i*Math.PI/2)*radius,(vehicle.height||1)+canopyRadius*3),new C.Cartesian3())];});
      }
      ropes.forEach(rope=>{rope.show=canopy.show;});
      flames.forEach((flame,i)=>{
        flame.show=burning;
        if(!burning)return;
        const u=i/flames.length,noise=Math.sin(i*19.17+t*29)*.5+Math.sin(i*7.1+t*47)*.5;
        const length=diameter*(7+2*s.height/100000)*s.throttle;
        flame.position=C.Matrix4.multiplyByPoint(matrix,new C.Cartesian3(noise*diameter*u*.12,Math.cos(i*3+t*14)*diameter*u*.1,nozzle-length*u),new C.Cartesian3());
        flame.width=diameter*(.8-.6*u)*(1+noise*.12);flame.height=diameter*(1.2-.6*u);
        const blue=vehicle.id==='starship';
        flame.color=(u<.2?C.Color.fromCssColorString('#d9f5ff'):blue?C.Color.fromCssColorString('#68a5ff'):C.Color.fromCssColorString(u<.6?'#ffe3a1':'#ff762c')).withAlpha((1-u)*.8);
      });
      puffs.forEach((puff,i)=>{
        const age=i*.22,old=sampleMission(mission,Math.max(0,t-age));
        puff.show=burning&&t>age&&s.height<25000;
        if(!puff.show)return;
        const oldMatrix=matrixAt(old),spread=diameter*(1+age*1.5);
        puff.position=C.Matrix4.multiplyByPoint(oldMatrix,new C.Cartesian3(Math.sin(i*17)*spread,Math.cos(i*11)*spread,nozzle-diameter*5-age*diameter*4),new C.Cartesian3());
        puff.width=diameter*(2+age*4);puff.height=puff.width;
        puff.color=C.Color.fromCssColorString('#bac4cd').withAlpha(.17*(1-i/puffs.length));
      });
      for(const {piece,event} of debris)piece.show=t>=event.t;
      const audio=current.current.audioRef?.current;
      if(audio&&current.current.sound){
        const relative=C.Cartesian3.subtract(position(),viewer.camera.positionWC,new C.Cartesian3());
        audio.position(relative,C.Cartesian3.ZERO,viewer.camera.directionWC,viewer.camera.upWC);
      }
      if((mode==='follow' || mode==='onboard')&&(t!==lastTime||mode!==lastMode)) {
        if(mode==='follow') {
          const range=Math.max((vehicle.height||20)*5,120);
          viewer.camera.lookAt(position(),new C.HeadingPitchRange(-.7,-.35,range));
        } else {
          const transform=matrixAt(s),height=vehicle.height||15;
          viewer.camera.lookAtTransform(transform,new C.Cartesian3((vehicle.diameter||1)*.7,0,height*.65));
          viewer.camera.direction=new C.Cartesian3(0,0,-1);
          viewer.camera.up=new C.Cartesian3(0,1,0);
          viewer.camera.right=new C.Cartesian3(1,0,0);
          if(model)model.minimumPixelSize=0;
        }
      } else if(mode!=='follow'&&mode!=='onboard'&&(lastMode==='follow'||lastMode==='onboard')) viewer.camera.lookAtTransform(C.Matrix4.IDENTITY);
      if(lastTime!==t||lastMode!==mode)viewer.scene.requestRender();
      lastMode=mode;lastTime=t;
    };
    viewer.scene.preUpdate.addEventListener(update);
    viewer.scene.requestRender();
    return ()=>{disposed=true;if(viewer.isDestroyed())return;viewer.scene.preUpdate.removeEventListener(update);entities.forEach(e=>viewer.entities.remove(e));if(model)viewer.scene.primitives.remove(model);viewer.scene.primitives.remove(plume);viewer.scene.primitives.remove(smoke);};
  },[mission,vehicle,origin,observation]);

  useEffect(()=>{
    const viewer=viewerRef.current;if(!viewer)return;
    viewer.camera.lookAtTransform(C.Matrix4.IDENTITY);
    if(cameraMode==='global')viewer.camera.flyTo({destination:C.Cartesian3.fromDegrees(origin.lon,origin.lat,20500000),duration:1.6});
    if(cameraMode==='surface')viewer.camera.flyTo({destination:C.Cartesian3.fromDegrees(origin.lon,origin.lat-.008,Math.max(0,origin.height||0)+Math.max(500,(vehicle.height||20)*9)),orientation:{heading:0,pitch:C.Math.toRadians(-35),roll:0},duration:1.5});
    viewer.scene.requestRender();
  },[cameraMode,cameraCommand]);
  useEffect(()=>{viewerRef.current?.scene.requestRender();},[realScale,clouds,daylight]);
  return <div className="earth-scene" ref={container} aria-label="Trái Đất 3D WGS84" />;
}
