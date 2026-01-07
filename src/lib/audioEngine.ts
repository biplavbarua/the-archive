export class AudioEngine {
  private ctx: AudioContext | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  
  // Effect Nodes
  private bassNode: BiquadFilterNode | null = null;
  private vocalNode: BiquadFilterNode | null = null;
  private gainNode: GainNode | null = null;

  constructor() {
    // Lazy init to respect browser autoplay policies
  }

  init(audioElement: HTMLAudioElement) {
    if (this.ctx) return;

    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create Source
    this.sourceNode = this.ctx.createMediaElementSource(audioElement);

    // 1. Bass Control (LowShelf)
    this.bassNode = this.ctx.createBiquadFilter();
    this.bassNode.type = 'lowshelf';
    this.bassNode.frequency.value = 200; // Under 200Hz is bass
    this.bassNode.gain.value = 0; // Default flat

    // 2. Vocal Presence (Peaking)
    // Boosting 1kHz-3kHz highlights vocals, cutting it recedes them
    this.vocalNode = this.ctx.createBiquadFilter();
    this.vocalNode.type = 'peaking';
    this.vocalNode.frequency.value = 1500; // Center around human voice
    this.vocalNode.Q.value = 1; // Bandwidth
    this.vocalNode.gain.value = 0;

    // 3. Master Gain
    this.gainNode = this.ctx.createGain();

    // Connect Graph: Source -> Bass -> Vocal -> Gain -> Destination
    this.sourceNode
      .connect(this.bassNode)
      .connect(this.vocalNode)
      .connect(this.gainNode)
      .connect(this.ctx.destination);
  }

  resume() {
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --- Parameter Controls ---

  setBass(value: number) { 
    // Value 0-100. Map to -10dB to +15dB
    if (!this.bassNode) return;
    const gain = (value / 50 - 1) * 15; // 0 -> -15, 50 -> 0, 100 -> +15
    this.bassNode.gain.setTargetAtTime(gain, this.ctx!.currentTime, 0.1);
  }

  setVocals(value: number) {
    // Value 0-100. Map to -10dB to +10dB
    if (!this.vocalNode) return;
    const gain = (value / 50 - 1) * 10;
    this.vocalNode.gain.setTargetAtTime(gain, this.ctx!.currentTime, 0.1);
  }

  setTempo(value: number, audioElement: HTMLAudioElement) {
    // Value 0-100. Map to 0.8x to 1.5x speed
    // 50 = 1.0x
    const rate = 0.8 + (value / 100) * 0.7; // 0 -> 0.8, 100 -> 1.5
    audioElement.playbackRate = rate;
  }
}

export const audioEngine = new AudioEngine();
