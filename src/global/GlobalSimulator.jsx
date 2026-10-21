import React, { useEffect, useRef, useState } from 'react';
import { Globe2, Rocket, Search, Play, Pause, RotateCcw, Maximize2, PanelLeftClose, Crosshair, MapPin, Volume2, VolumeX, Layers, ExternalLink, X, ArrowUpRight } from 'lucide-react';
import GlobalScene from './GlobalScene.jsx';
import { VEHICLES, CATEGORIES, SITES } from './vehicles.js';
import { sampleMission } from './engine.js';
import { FlightAudio } from '../audio/FlightAudio.js';
import './global.css';

const format=(v,d=1)=>Number.isFinite(v)?v.toLocaleString('en-US',{maximumFractionDigits:d,minimumFractionDigits:d}):'—';
const timeLabel=t=>`${String(Math.floor(t/3600)).padStart(2,'0')}:${String(Math.floor(t/60)%60).padStart(2,'0')}:${String(Math.floor(t)%60).padStart(2,'0')}`;
const CAMERAS=[['global','Global View'],['surface','Surface View'],['follow','Follow Rocket'],['onboard','Onboard View'],['free','Free Camera']];
const Metric=({label,value,unit,wide})=><div className={`metric ${wide?'wide':''}`}><span>{label}</span><div>{value}<small>{unit}</small></div></div>;

export default function GlobalSimulator({onLab}) {
  const [vehicleId,setVehicleId]=useState('falcon9'),[query,setQuery]=useState(''),[category,setCategory]=useState('all');
  const [origin,setOrigin]=useState(SITES[0]),[observation,setObservation]=useState(null),[pickTarget,setPickTarget]=useState('origin'),[picked,setPicked]=useState(null);
  const [altitude,setAltitude]=useState(400),[heading,setHeading]=useState(90),[scenario,setScenario]=useState('orbit');
  const [mission,setMission]=useState(null),[error,setError]=useState(''),[status,setStatus]=useState('Khởi tạo Trái Đất…');
  const [telemetry,setTelemetry]=useState(null),[playing,setPlaying]=useState(false),[speed,setSpeed]=useState(1),[countdown,setCountdown]=useState(null);
  const [cameraMode,setCameraMode]=useState('global'),[cameraCommand,setCameraCommand]=useState(0),[hidden,setHidden]=useState(false),[mobilePanel,setMobilePanel]=useState('none');
  const [realScale,setRealScale]=useState(false),[clouds,setClouds]=useState(true),[daylight,setDaylight]=useState(true),[sound,setSound]=useState(false);
  const [compare,setCompare]=useState([]),[compareOpen,setCompareOpen]=useState(false),[weather,setWeather]=useState(null),[groundSample,setGroundSample]=useState(null);
  const clockRef=useRef({time:0,playing:false,speed:1}),audioRef=useRef(null),nameController=useRef(null),lookupTimer=useRef(null);
  const vehicle=VEHICLES.find(v=>v.id===vehicleId);
  clockRef.current.playing=playing;clockRef.current.speed=speed;
  useEffect(()=>{
    audioRef.current=new FlightAudio();
    return()=>{audioRef.current?.dispose();nameController.current?.abort();clearTimeout(lookupTimer.current);};
  },[]);
  useEffect(()=>{
    setError('');setMission(null);setPlaying(false);setCountdown(null);clockRef.current.time=0;
    const worker=new Worker(new URL('./mission.worker.js',import.meta.url),{type:'module'});
    worker.onmessage=({data})=>{if(data.error)setError(data.error);else{setMission(data.mission);setTelemetry(sampleMission(data.mission,0));}};
    worker.onerror=()=>setError('Không khởi tạo được engine chuyến bay. Hãy tải lại ứng dụng.');
    // Strip all non-serializable catalogue data before sending across the worker boundary.
    worker.postMessage({id:1,input:{vehicle:{id:vehicle.id,category:vehicle.category,stages:vehicle.stages,military:vehicle.military},origin,altitude:altitude*1000,heading,scenario}});
    return()=>worker.terminate();
  },[vehicleId,origin,altitude,heading,scenario]);
  useEffect(()=>{
    if(!mission)return;
    let frame,last=performance.now(),lastUI=0;
    const tick=now=>{
      const clock=clockRef.current,dt=Math.min(.1,(now-last)/1000);last=now;
      if(clock.playing)clock.time=Math.min(mission.duration,clock.time+dt*clock.speed);
      if(now-lastUI>80){
        const state=sampleMission(mission,clock.time);setTelemetry(state);lastUI=now;
        audioRef.current?.update({altitude:state.height,thrust:state.throttle*2800,isEngineActive:state.throttle>0},sound,!clock.playing,cameraMode==='onboard');
        if(clock.playing&&clock.time>=mission.duration)setPlaying(false);
      }
      frame=requestAnimationFrame(tick);
    };
    frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);
  },[mission,sound,cameraMode]);
  useEffect(()=>{
    if(countdown===null)return;
    if(countdown===0){setCountdown(null);setPlaying(true);audioRef.current?.beep(0);return;}
    if(sound)audioRef.current?.beep(countdown);
    const timer=setTimeout(()=>setCountdown(c=>c===null?null:c-1),1000);return()=>clearTimeout(timer);
  },[countdown,sound]);
  useEffect(()=>{
    setWeather(null);const controller=new AbortController();const timeout=setTimeout(()=>{setWeather({error:true});controller.abort();},12000);
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${origin.lat}&longitude=${origin.lon}&current=temperature_2m,wind_speed_10m,wind_direction_10m,surface_pressure&wind_speed_unit=ms`,{signal:controller.signal})
      .then(r=>{if(!r.ok)throw Error();return r.json();}).then(data=>setWeather(data.current?{...data.current,source:'Open-Meteo'}:{error:true})).catch(e=>{if(e.name!=='AbortError')setWeather({error:true});});
    return()=>{clearTimeout(timeout);controller.abort();};
  },[origin]);
  function groundHeight(point,height) {
    if(clockRef.current.playing||clockRef.current.time>0)return;
    setOrigin(old=>old.lat===point.lat&&old.lon===point.lon&&Math.abs((old.height||0)-height)>.5?{...old,height}:old);
  }
  function pick(point) {
    setPicked({...point,name:'Đang tra địa danh…'});
    if(pickTarget==='origin')setOrigin({...point,name:'Vị trí đã chọn'});else setObservation(point);
    nameController.current?.abort();clearTimeout(lookupTimer.current);
    lookupTimer.current=setTimeout(async()=>{
      const controller=new AbortController();nameController.current=controller;
      try {
        const response=await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${point.lat}&lon=${point.lon}&zoom=5&accept-language=vi`,{signal:controller.signal});
        if(!response.ok)throw Error();const data=await response.json();
        setPicked({...point,name:data.name||data.display_name||'Đại dương / chưa có địa danh'});
      }catch(e){if(e.name!=='AbortError')setPicked({...point,name:'Chưa tra được địa danh · tọa độ vẫn khả dụng'});}
    },1100);
  }
  function camera(mode){setCameraMode(mode);setCameraCommand(c=>c+1);}
  function reset(){setPlaying(false);setCountdown(null);clockRef.current.time=0;if(mission)setTelemetry(sampleMission(mission,0));}
  function launch(){if(!mission)return;if(clockRef.current.time>=mission.duration)clockRef.current.time=0;if(sound)audioRef.current?.unlock();if(clockRef.current.time>0)setPlaying(true);else setCountdown(3);}
  function changeVehicle(id){reset();setPickTarget('origin');if(!VEHICLES.find(v=>v.id===id).height)setRealScale(false);setVehicleId(id);setCompareOpen(false);}
  function toggleCompare(id){setCompare(old=>old.includes(id)?old.filter(v=>v!==id):[...old.slice(-2),id]);}
  const filtered=VEHICLES.filter(v=>(category==='all'||v.category===category)&&`${v.name} ${v.country}`.toLowerCase().includes(query.toLowerCase()));
  const s=telemetry;
  const isIllustration=vehicle.military||mission?.suborbital||s?.basis==='illustration';
  return <div className={`mission-app ${hidden?'panels-hidden':''} mobile-${mobilePanel}`}>
    <GlobalScene mission={mission} vehicle={vehicle} origin={origin} observation={observation} clockRef={clockRef} cameraMode={cameraMode} cameraCommand={cameraCommand} onPick={pick} onStatus={setStatus} realScale={realScale} clouds={clouds} daylight={daylight} audioRef={audioRef} sound={sound} onGroundHeight={groundHeight} onGroundSample={setGroundSample}/>
    <header className="mission-header">
      <div className="mission-brand"><Globe2 size={27}/><div>ORBITAL<span>GLOBAL FLIGHT SIMULATOR</span></div></div>
      <div className="header-center"><i/> MISSION CONTROL <span>/</span> EARTH · WGS84</div>
      <div className="header-actions"><button onClick={onLab}><Layers size={15}/><span>Lưới 3D / Phòng thí nghiệm</span></button><button aria-label="Ẩn hiện panel" title="Ẩn hiện panel" onClick={()=>setHidden(!hidden)}><PanelLeftClose size={17}/></button><button aria-label="Toàn màn hình" onClick={()=>document.fullscreenElement?document.exitFullscreen?.():document.documentElement.requestFullscreen?.().catch(()=>{})}><Maximize2 size={16}/></button></div>
    </header>
    <div className="scene-heading"><span className="eyebrow">EARTH EXPLORER / 01</span><h1>Không gian bắt đầu<br/>từ đây.</h1><p>Xoay để khám phá. Cuộn để đến gần hơn.</p></div>
    <aside className="mission-left glass-panel">
      <div className="panel-heading"><Rocket size={17}/><h2>Phương tiện</h2><span>{VEHICLES.length}</span></div>
      <div className="catalog-search"><Search size={14}/><input aria-label="Tìm phương tiện" placeholder="Tìm phương tiện, quốc gia…" value={query} onChange={e=>setQuery(e.target.value)}/></div>
      <select aria-label="Loại phương tiện" value={category} onChange={e=>setCategory(e.target.value)}>{Object.entries(CATEGORIES).map(([id,label])=><option key={id} value={id}>{label}</option>)}</select>
      <div className="vehicle-list">{filtered.map(v=><div key={v.id} className={`vehicle-row ${v.id===vehicleId?'selected':''}`}><button className="vehicle-select" onClick={()=>changeVehicle(v.id)}><span className={`rocket-icon ${v.category}`}><Rocket size={19}/></span><span><strong>{v.name}</strong><small>{CATEGORIES[v.category]} · {v.height?`${v.height} m`:'Chưa xác minh tỷ lệ'}</small></span>{v.id===vehicleId&&<i/>}</button><button className={`compare-check ${compare.includes(v.id)?'checked':''}`} aria-label={`So sánh ${v.name}`} title="Thêm so sánh" onClick={()=>toggleCompare(v.id)}>{compare.includes(v.id)?'✓':'+'}</button></div>)}{!filtered.length&&<p className="muted">Không có phương tiện phù hợp.</p>}</div>
      <button className="compare-button" disabled={compare.length<2} onClick={()=>setCompareOpen(true)}>So sánh phương tiện <span>{compare.length}/3</span></button>
      <div className="panel-heading section-break"><Crosshair size={16}/><h2>Kịch bản chuyến bay</h2></div>
      <label className="field-label">BỆ PHÓNG / ĐIỂM KHỞI TẠO</label>
      <select aria-label="Bệ phóng" value={SITES.findIndex(p=>p.lat===origin.lat&&p.lon===origin.lon)} onChange={e=>{if(SITES[e.target.value])setOrigin(SITES[e.target.value]);}}><option value="-1">Vị trí tùy chọn trên Trái Đất</option>{SITES.map((p,i)=><option key={p.name} value={i}>{p.name}</option>)}</select>
      <div className="coordinate-fields"><label>Latitude<input aria-label="Vĩ độ bệ phóng" type="number" min="-90" max="90" step="0.001" value={Number(origin.lat.toFixed(4))} onChange={e=>{const v=Number(e.target.value);if(v>=-90&&v<=90)setOrigin({...origin,lat:v,height:0,name:'Tọa độ tùy chọn'});}}/></label><label>Longitude<input aria-label="Kinh độ bệ phóng" type="number" min="-180" max="180" step="0.001" value={Number(origin.lon.toFixed(4))} onChange={e=>{const v=Number(e.target.value);if(v>=-180&&v<=180)setOrigin({...origin,lon:v,height:0,name:'Tọa độ tùy chọn'});}}/></label></div>
      <div className="segmented"><button className={pickTarget==='origin'?'active':''} onClick={()=>setPickTarget('origin')}><MapPin size={12}/> Đặt bệ</button><button disabled={vehicle.military} className={pickTarget==='observation'?'active':''} onClick={()=>setPickTarget('observation')}>Vùng quan sát</button></div>
      {observation&&!vehicle.military&&<p className="muted">Quan sát: {observation.lat.toFixed(2)}°, {observation.lon.toFixed(2)}° · không điều khiển tuyến bay <button onClick={()=>setObservation(null)}>×</button></p>}
      {vehicle.military?<p className="model-note">Hoạt ảnh khái niệm chung, độc lập với hiệu năng phương tiện. Không chọn mục tiêu hoặc tính điểm rơi.</p>:<>
        <label className="field-label">HÀNH TRÌNH</label><select aria-label="Kịch bản" value={scenario} onChange={e=>setScenario(e.target.value)} disabled={['model','sounding'].includes(vehicle.category)}><option value="orbit">{['model','sounding'].includes(vehicle.category)?'Nghiên cứu dưới quỹ đạo':'Quỹ đạo Trái Đất thấp'}</option><option value="reentry">Quỹ đạo → tái nhập khí quyển</option></select>
        {!['model','sounding'].includes(vehicle.category)&&<div className="coordinate-fields"><label>Độ cao quỹ đạo · km<input aria-label="Độ cao quỹ đạo km" type="number" min="160" max="2000" step="10" value={altitude} onChange={e=>setAltitude(Math.max(160,Math.min(2000,Number(e.target.value)||160)))}/></label><label>Hướng ban đầu · °<input aria-label="Hướng bay độ" type="number" min="0" max="360" value={heading} onChange={e=>setHeading(Math.max(0,Math.min(360,Number(e.target.value)||0)))}/></label></div>}
      </>}
      <button className="primary-button launch-button" disabled={!mission||countdown!==null} onClick={launch}><Play size={15} fill="currentColor"/>{playing?'ĐANG BAY':s?.t>0?'TIẾP TỤC CHUYẾN BAY':'KHỞI ĐỘNG CHUYẾN BAY'}<ArrowUpRight size={17}/></button>
      {error&&<p role="alert" className="error-note">{error}</p>}
    </aside>
    <aside className="mission-right glass-panel">
      <div className="panel-heading"><span className="live-dot"/><h2>Flight telemetry</h2><span className="live-tag">{playing?'LIVE':'STANDBY'}</span></div>
      <div className="mission-clock"><span>MISSION ELAPSED TIME</span><strong>T+ {timeLabel(s?.t||0)}</strong><small>{s?.phase||'Đang tính tuyến bay…'}</small></div>
      <div className={`data-badge ${isIllustration?'illustration':''}`}>{isIllustration?'MINH HỌA CHUYỂN ĐỘNG':'TÍNH TỪ MÔ HÌNH VẬT LÝ'}</div>
      <div className="metric-grid"><Metric label={groundSample!==null?'ĐỘ CAO · TRÊN ĐỊA HÌNH ≈':'ĐỘ CAO · WGS84'} value={format(Math.max(0,(s?.height||0)-(groundSample??0))/1000)} unit="km"/><Metric label="VẬN TỐC · QUÁN TÍNH" value={format((s?.speed||0)/1000,2)} unit="km/s"/><Metric label="GIA TỐC · |Δv|/Δt" value={format(s?.acceleration||0,2)} unit="m/s²"/><Metric label="QUÃNG ĐƯỜNG · QUÁN TÍNH" value={format((s?.distance||0)/1000,0)} unit="km"/></div>
      <div className="position-readout"><span>LAT <strong>{format(s?.lat??origin.lat,4)}°</strong></span><span>LON <strong>{format(s?.lon??origin.lon,4)}°</strong></span></div>
      {mission&&!mission.suborbital&&<div className="orbit-readout"><span>Quỹ đạo tròn khởi tạo</span><div><strong>{altitude} km</strong><span>i = {format(mission.inclination)}°</span><span>{format(mission.period/60)} min</span></div></div>}
      <div className="stage-indicators">{Array.from({length:Math.max(1,vehicle.stages)},(_,i)=><span key={i} className={s?.stage===i+1?'current':s?.stage>i+1?'spent':''}><i/>{vehicle.stages?`TẦNG ${i+1}`:'SPACECRAFT'}</span>)}</div>
      <div className="panel-heading section-break"><h2>{vehicle.name}</h2><span>SPECIFICATIONS</span></div>
      <p className="vehicle-description">{vehicle.description}</p>
      <dl className="spec-list"><div><dt>Quốc gia</dt><dd>{vehicle.country}</dd></div><div><dt>Chiều cao / dài</dt><dd>{format(vehicle.height,vehicle.height<1?3:1)} m</dd></div><div><dt>{vehicle.diameterLabel||'Đường kính thân'}</dt><dd>{format(vehicle.diameter,vehicle.diameter<1?3:2)} m</dd></div><div><dt>Khối lượng công bố</dt><dd>{vehicle.mass?`${format(vehicle.mass,0)} kg`:'Chưa nhập / tùy cấu hình'}</dd></div><div><dt>Trạng thái theo nguồn</dt><dd>{vehicle.status}</dd></div></dl>
      <p className="engine-spec">{vehicle.engines.join(' / ')}</p>
      <div className="source-links">{vehicle.sources.map(source=><a key={source.url} href={source.url} target="_blank" rel="noreferrer"><ExternalLink size={11}/>{source.title}</a>)}<span>Đối chiếu {vehicle.verified} · không phải dữ liệu chuyến bay lịch sử</span></div>
      <details className="assumptions"><summary>Mô hình & độ tin cậy</summary><p>Phóng, tách tầng và bung dù là hoạt ảnh giáo dục, không hiệu chỉnh theo đường cong lực đẩy thực. Quỹ đạo tròn dùng v = √(μ/r), μ = 3.986004418×10¹⁴ m³/s²; Trái Đất quay với ω = 7.292115×10⁻⁵ rad/s. Tái nhập dùng RK4, khí quyển mũ H = 7,2 km và hệ số đạn đạo giả định 200 kg/m². Chưa có J2, gió tầng cao hoặc điều khiển lực đẩy. Độ cao trừ địa hình tile hiện có khi tải được (dấu ≈); nếu chưa có tile, dùng ellipsoid WGS84.</p><p>Mô hình 3D dựng theo kích thước công khai, giản lược chi tiết. Chế độ dễ quan sát phóng lớn mô hình ở xa; bật 1:1 để giữ tỷ lệ. Mây là lớp ảnh minh họa, thời điểm chiếu sáng lấy ngày xuân phân để quan sát ngày/đêm.</p></details>
      <div className="weather-readout"><span>KHÍ TƯỢNG TẠI BỆ</span><strong>{!weather?'Đang lấy dữ liệu…':weather.error?'Chưa kết nối được thời tiết':`${format(weather.temperature_2m)} °C · ${format(weather.wind_speed_10m)} m/s`}</strong><small>{weather&&!weather.error?`${weather.time} UTC · ${format(weather.surface_pressure,0)} hPa · ${format(weather.wind_direction_10m,0)}°`:''}</small><a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo · dữ liệu mô hình thời tiết</a><small>Dùng để tham khảo; chưa tác động lên quỹ đạo toàn cầu.</small></div>
    </aside>
    <nav className="camera-toolbar" aria-label="Camera toàn cầu">{CAMERAS.map(([id,label])=><button key={id} className={cameraMode===id?'active':''} onClick={()=>camera(id)}>{label}</button>)}</nav>
    <div className="scene-options"><button disabled={!vehicle.height||!vehicle.diameter} className={realScale?'active':''} onClick={()=>setRealScale(!realScale)} title="Tỷ lệ mô hình">{realScale?'Tỷ lệ 1:1':'Dễ quan sát'}</button><button className={clouds?'active':''} onClick={()=>setClouds(!clouds)}>Mây</button><button onClick={()=>setDaylight(!daylight)}>{daylight?'☀ 12:00 UTC':'☾ 00:00 UTC'}</button><button aria-label="Âm thanh không gian" className={sound?'active':''} onClick={async()=>{if(!sound)await audioRef.current?.unlock();setSound(!sound);}}>{sound?<Volume2 size={15}/>:<VolumeX size={15}/>}</button></div>
    {picked&&<div className="picked-location glass-panel"><MapPin size={17}/><div><strong>{picked.name}</strong><span>{picked.lat.toFixed(5)}°, {picked.lon.toFixed(5)}° · {format(picked.height,0)} m</span><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">Địa danh © OpenStreetMap</a></div><button aria-label="Đóng địa danh" onClick={()=>setPicked(null)}><X size={14}/></button></div>}
    {countdown!==null&&<div role="status" aria-label="Đếm ngược toàn cầu" className="global-countdown"><span>LAUNCH SEQUENCE</span><strong>{countdown||'IGNITION'}</strong><button onClick={()=>setCountdown(null)}>Hủy đếm ngược</button></div>}
    <div className="map-status"><i/>{status}</div>
    <footer className="flight-timeline glass-panel">
      <div className="transport"><button className="play-toggle" aria-label={playing?'Tạm dừng chuyến bay':'Phát chuyến bay'} disabled={!mission||countdown!==null} onClick={()=>playing?setPlaying(false):launch()}>{playing?<Pause size={19} fill="currentColor"/>:<Play size={19} fill="currentColor"/>}</button><button aria-label="Đặt lại chuyến bay" onClick={reset}><RotateCcw size={16}/></button><div><strong>{timeLabel(s?.t||0)}</strong><span>/ {timeLabel(mission?.duration||0)}</span></div></div>
      <div className="timeline-track"><div className="timeline-labels"><span>FLIGHT SEQUENCE</span><span>{mission?.events.filter(e=>e.t<=(s?.t||0)).at(-1)?.label||'Chuẩn bị nhiệm vụ'}</span></div><input aria-label="Timeline chuyến bay" type="range" min="0" max={mission?.duration||1} step="0.1" value={s?.t||0} onChange={e=>{setCountdown(null);setPlaying(false);clockRef.current.time=Number(e.target.value);if(mission)setTelemetry(sampleMission(mission,clockRef.current.time));}}/><div className="event-ticks">{mission?.events.map((e,i)=><button key={i} style={{left:`${e.t/mission.duration*100}%`}} title={`${timeLabel(e.t)} · ${e.label}`} aria-label={e.label} onClick={()=>{setPlaying(false);setCountdown(null);clockRef.current.time=e.t;setTelemetry(sampleMission(mission,e.t));}}><i/></button>)}</div></div>
      <label className="speed-select">VẬN TỐC THỜI GIAN<select aria-label="Tốc độ mô phỏng" value={speed} onChange={e=>setSpeed(Number(e.target.value))}>{[.25,.5,.75,1,2,4,8,16,32,64,128].map(v=><option key={v} value={v}>{v}×</option>)}</select></label>
    </footer>
    <div className="mobile-nav"><button onClick={()=>setMobilePanel(mobilePanel==='vehicles'?'none':'vehicles')}>Phương tiện</button><button onClick={()=>setMobilePanel('none')}>Trái Đất</button><button onClick={()=>setMobilePanel(mobilePanel==='telemetry'?'none':'telemetry')}>Telemetry</button></div>
    {compareOpen&&<div className="compare-overlay" role="dialog" aria-label="So sánh phương tiện"><div className="compare-dialog glass-panel"><button className="close-dialog" aria-label="Đóng so sánh" onClick={()=>setCompareOpen(false)}><X/></button><span className="eyebrow">VEHICLE COMPARISON</span><h2>Cùng một hệ quy chiếu.</h2><p>Thông số công khai theo cấu hình từng nguồn. “—” là chưa xác minh hoặc chưa nhập.</p><div className="table-scroll"><table><thead><tr><th>Thông số</th>{compare.map(id=><th key={id}>{VEHICLES.find(v=>v.id===id).name}</th>)}</tr></thead><tbody>{[['Quốc gia','country'],['Chiều cao / dài (m)','height'],['Đường kính thân (m)','diameter'],['Khối lượng (kg)','mass'],['Số tầng chính','stages'],['Trạng thái theo nguồn','status']].map(([label,key])=><tr key={key}><th>{label}</th>{compare.map(id=><td key={id}>{VEHICLES.find(v=>v.id===id)[key]??'—'}</td>)}</tr>)}<tr><th>Nguồn</th>{compare.map(id=><td key={id}><a href={VEHICLES.find(v=>v.id===id).sources[0].url} target="_blank" rel="noreferrer">Mở tài liệu ↗</a></td>)}</tr></tbody></table></div></div></div>}
  </div>;
}
