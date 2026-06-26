import { useGameStore } from "../state/gameStore";

// Lazy-initialized audio context to comply with browser autoplay policies
let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
};

const sfxFiles = {
  correct: "/audio/sfx/correct-sort.wav",
  wrong: "/audio/sfx/wrong-sort.wav",
  missed: "/audio/sfx/missed-item.wav",
  dragStart: "/audio/sfx/drag-pickup.wav",
  levelComplete: "/audio/sfx/level-pass.wav",
  detectiveScan: "/audio/sfx/detective-scan.wav",
  detectiveFound: "/audio/sfx/detective-found.wav",
  detectiveClear: "/audio/sfx/detective-clear.wav",
  triviaReveal: "/audio/sfx/trivia-reveal.wav",
  triviaCorrect: "/audio/sfx/trivia-correct.wav",
  triviaWrong: "/audio/sfx/trivia-wrong.wav",
  huntInspect: "/audio/sfx/hunt-inspect.wav",
  huntImposterFound: "/audio/sfx/hunt-imposter-found.wav",
  huntRoundClear: "/audio/sfx/hunt-round-clear.wav",
} as const;

type SfxKey = keyof typeof sfxFiles;

const sfxCache = new Map<SfxKey, HTMLAudioElement>();

const playSfxFile = (key: SfxKey, volume = 0.75): boolean => {
  if (typeof Audio === "undefined") return false;

  try {
    let cached = sfxCache.get(key);
    if (!cached) {
      cached = new Audio(sfxFiles[key]);
      cached.preload = "auto";
      sfxCache.set(key, cached);
    }

    const audio = cached.cloneNode(true) as HTMLAudioElement;
    audio.volume = volume;
    audio.play().catch((error) => {
      console.warn(`Sound effect failed to play: ${key}`, error);
    });
    return true;
  } catch (e) {
    console.warn(`Sound effect failed to start: ${key}`, e);
    return false;
  }
};

export const playSound = {
  correct: () => {
    if (!useGameStore.getState().sfxEnabled) return;
    if (playSfxFile("correct", 0.78)) return;

    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      // Double-chime synth (pleasant high pitch)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.setValueAtTime(659.25, now + 0.08); // E5

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(783.99, now); // G5
      osc2.frequency.setValueAtTime(1046.50, now + 0.08); // C6

      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.3);
      osc2.stop(now + 0.3);
    } catch (e) {
      console.warn("Audio play failed:", e);
    }
  },

  wrong: () => {
    if (!useGameStore.getState().sfxEnabled) return;
    if (playSfxFile("wrong", 0.72)) return;

    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      // Low dull thud/buzz
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.25);

      // Simple low pass filter to remove harsh buzz
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(300, now);

      gainNode.gain.setValueAtTime(0.2, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      console.warn("Audio play failed:", e);
    }
  },

  missed: () => {
    if (!useGameStore.getState().sfxEnabled) return;
    if (playSfxFile("missed", 0.72)) return;
    playSound.wrong();
  },

  dragStart: () => {
    if (!useGameStore.getState().sfxEnabled) return;
    if (playSfxFile("dragStart", 0.5)) return;

    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      // Soft short sweep
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.08);

      gainNode.gain.setValueAtTime(0.05, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {
      // Ignored
    }
  },

  drop: () => {
    if (!useGameStore.getState().sfxEnabled) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      // Small pop sound
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.05);

      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      // Ignored
    }
  },

  levelComplete: () => {
    if (!useGameStore.getState().sfxEnabled) return;
    if (playSfxFile("levelComplete", 0.85)) return;

    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C Major scale

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.1, now + idx * 0.08);
        gainNode.gain.setValueAtTime(0.1, now + idx * 0.08 + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
    } catch (e) {
      console.warn("Audio play failed:", e);
    }
  },

  levelFail: () => {
    if (!useGameStore.getState().sfxEnabled) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const notes = [392.00, 349.23, 311.13, 261.63]; // Descending minor notes (sad sound)

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);

        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.12, now + idx * 0.15);
        gainNode.gain.setValueAtTime(0.12, now + idx * 0.15 + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.45);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 0.5);
      });
    } catch (e) {
      console.warn("Audio play failed:", e);
    }
  },

  detectiveScan: () => {
    if (!useGameStore.getState().sfxEnabled) return;
    if (playSfxFile("detectiveScan", 0.68)) return;
    playSound.dragStart();
  },

  detectiveFound: () => {
    if (!useGameStore.getState().sfxEnabled) return;
    if (playSfxFile("detectiveFound", 0.78)) return;
    playSound.correct();
  },

  detectiveClear: () => {
    if (!useGameStore.getState().sfxEnabled) return;
    if (playSfxFile("detectiveClear", 0.82)) return;
    playSound.levelComplete();
  },

  triviaReveal: () => {
    if (!useGameStore.getState().sfxEnabled) return;
    if (playSfxFile("triviaReveal", 0.65)) return;
    playSound.dragStart();
  },

  triviaCorrect: () => {
    if (!useGameStore.getState().sfxEnabled) return;
    if (playSfxFile("triviaCorrect", 0.78)) return;
    playSound.correct();
  },

  triviaWrong: () => {
    if (!useGameStore.getState().sfxEnabled) return;
    if (playSfxFile("triviaWrong", 0.72)) return;
    playSound.wrong();
  },

  huntInspect: () => {
    if (!useGameStore.getState().sfxEnabled) return;
    if (playSfxFile("huntInspect", 0.68)) return;
    playSound.dragStart();
  },

  huntImposterFound: () => {
    if (!useGameStore.getState().sfxEnabled) return;
    if (playSfxFile("huntImposterFound", 0.82)) return;
    playSound.correct();
  },

  huntRoundClear: () => {
    if (!useGameStore.getState().sfxEnabled) return;
    if (playSfxFile("huntRoundClear", 0.82)) return;
    playSound.levelComplete();
  },
};

let musicBuffer: AudioBuffer | null = null;
let musicLoadPromise: Promise<AudioBuffer> | null = null;
let musicGain: GainNode | null = null;
let musicSource: AudioBufferSourceNode | null = null;
let musicIsPlaying = false;

const MUSIC_VOLUME = 0.35;
const MUSIC_LOOP_START_SECONDS = 71078 / 48000;
const MUSIC_LOOP_END_SECONDS = 683009 / 48000;

const loadMusicBuffer = async (): Promise<AudioBuffer> => {
  if (musicBuffer) return musicBuffer;
  if (musicLoadPromise) return musicLoadPromise;

  musicLoadPromise = fetch("/audio/background-music.wav")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load background music: ${response.status}`);
      }
      return response.arrayBuffer();
    })
    .then((arrayBuffer) => getAudioContext().decodeAudioData(arrayBuffer))
    .then((decoded) => {
      musicBuffer = decoded;
      return decoded;
    });

  return musicLoadPromise;
};

const clearMusicSchedule = () => {
  if (musicSource) {
    try {
      musicSource.stop();
    } catch {
      // Source may already have ended.
    }
    musicSource = null;
  }
};

export const backgroundMusic = {
  start: async () => {
    if (!useGameStore.getState().musicEnabled) return;
    if (musicIsPlaying) return;

    try {
      const ctx = getAudioContext();
      const buffer = await loadMusicBuffer();

      if (!useGameStore.getState().musicEnabled || musicIsPlaying) return;

      if (!musicGain) {
        musicGain = ctx.createGain();
        musicGain.gain.value = MUSIC_VOLUME;
        musicGain.connect(ctx.destination);
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.loopStart = MUSIC_LOOP_START_SECONDS;
      source.loopEnd = Math.min(MUSIC_LOOP_END_SECONDS, buffer.duration);
      source.connect(musicGain);
      source.start();
      musicSource = source;
      musicIsPlaying = true;
    } catch (e) {
      console.warn("Background music failed to start:", e);
      musicIsPlaying = false;
    }
  },

  stop: () => {
    musicIsPlaying = false;
    clearMusicSchedule();
  },

  updateState: () => {
    const isEnabled = useGameStore.getState().musicEnabled;
    if (isEnabled) {
      backgroundMusic.start();
    } else {
      backgroundMusic.stop();
    }
  }
};
