// Synthesized locally after a user gesture. No microphone or audio download.
export class FlightAudio {
  async unlock() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!this.context) {
      const ctx = this.context = new AudioContext();
      const master = this.master = ctx.createGain();
      master.gain.value = 0.25;
      master.connect(ctx.destination);
      const engine = this.engine = ctx.createGain();
      engine.gain.value = 0;
      const panner = this.panner = ctx.createPanner();
      panner.panningModel = 'HRTF';
      panner.distanceModel = 'inverse';
      panner.refDistance = 3;
      panner.rolloffFactor = 0.3;
      engine.connect(panner).connect(master);
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const samples = buffer.getChannelData(0);
      for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
      const noise = this.noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;
      const filter = this.filter = ctx.createBiquadFilter();
      filter.type = 'lowpass'; filter.frequency.value = 500;
      noise.connect(filter).connect(engine); noise.start();
      const bass = this.bass = ctx.createOscillator();
      bass.type = 'sine'; bass.frequency.value = 42;
      const bassGain = ctx.createGain(); bassGain.gain.value = 0.22;
      bass.connect(bassGain).connect(engine); bass.start();
    }
    if (this.context.state === 'suspended') await this.context.resume();
  }

  beep(number) {
    if (!this.context) return;
    const ctx = this.context, oscillator = ctx.createOscillator(), gain = ctx.createGain();
    oscillator.frequency.value = number === 0 ? 880 : 440;
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    oscillator.connect(gain).connect(this.master);
    oscillator.start(); oscillator.stop(ctx.currentTime + 0.2);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  }

  update(telemetry, enabled, paused, pov) {
    if (!this.context) return;
    const ctx = this.context, now = ctx.currentTime;
    this.master.gain.setTargetAtTime(enabled ? 0.25 : 0, now, 0.05);
    const atmosphere = pov ? 1 : Math.max(0, 1 - (telemetry?.altitude ?? 0) / 80000);
    const power = Math.min(2, Math.sqrt((telemetry?.thrust ?? 0) / 2800));
    this.engine.gain.setTargetAtTime(enabled && !paused && telemetry?.isEngineActive ? 0.65 * power * atmosphere : 0, now, 0.08);
    this.filter.frequency.setTargetAtTime(pov ? 240 : 450 + power * 400, now, 0.15);
  }

  position(source, listener, forward, up) {
    if (!this.context) return;
    const now = this.context.currentTime;
    for (const [key, value] of Object.entries({ positionX: source.x, positionY: source.y, positionZ: source.z })) this.panner[key].setTargetAtTime(value, now, 0.05);
    const audioListener = this.context.listener;
    for (const [key, value] of Object.entries({ positionX: listener.x, positionY: listener.y, positionZ: listener.z,
      forwardX: forward.x, forwardY: forward.y, forwardZ: forward.z, upX: up.x, upY: up.y, upZ: up.z })) {
      audioListener[key]?.setTargetAtTime(value, now, 0.05);
    }
  }

  dispose() {
    this.noise?.stop(); this.bass?.stop();
    this.context?.close().catch(() => {});
    this.context = null;
  }
}
