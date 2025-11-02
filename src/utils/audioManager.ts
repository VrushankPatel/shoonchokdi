class AudioManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private muted: boolean = false;

  constructor() {
    this.initSounds();
  }

  private initSounds() {
    const soundEffects = {
      move: this.generateMoveSound(),
      win: this.generateWinSound(),
      lose: this.generateLoseSound(),
      draw: this.generateDrawSound(),
      click: this.generateClickSound(),
    };

    Object.entries(soundEffects).forEach(([key, audio]) => {
      this.sounds.set(key, audio);
    });
  }

  private generateMoveSound(): HTMLAudioElement {
    const audio = new Audio();
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);

    return audio;
  }

  private generateWinSound(): HTMLAudioElement {
    return new Audio();
  }

  private generateLoseSound(): HTMLAudioElement {
    return new Audio();
  }

  private generateDrawSound(): HTMLAudioElement {
    return new Audio();
  }

  private generateClickSound(): HTMLAudioElement {
    return new Audio();
  }

  playSound(soundName: string) {
    if (this.muted) return;

    const audio = this.sounds.get(soundName);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }
}

export const audioManager = new AudioManager();
