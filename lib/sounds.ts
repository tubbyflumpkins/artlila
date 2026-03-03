let audioCtx: AudioContext | null = null;

function getContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function initializeAudio() {
  // Lazy-create on first user gesture
  getContext();
}

/**
 * Soft pop sound for peg hits. Speed factor 0-1 controls pitch.
 * Short sine wave with fast attack + exponential decay, ~80ms total.
 */
export function playPegPop(speed: number = 0.5) {
  const ctx = getContext();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.value = 400 + speed * 400; // 400-800Hz based on speed

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.15, now + 0.005); // fast attack
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08); // quick decay

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.08);
}

/**
 * Rising triangle-wave arpeggio (C5->E5->G5->C6), ~0.5s total.
 */
export function playCelebration() {
  const ctx = getContext();
  const now = ctx.currentTime;

  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  const noteLength = 0.12;

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.value = freq;

    const start = now + i * noteLength;
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.exponentialRampToValueAtTime(0.2, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, start + noteLength - 0.01);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    osc.stop(start + noteLength);
  });
}

/**
 * Gentle descending three-note chime for timer end.
 */
export function playTimerEnd() {
  const ctx = getContext();
  const now = ctx.currentTime;

  const notes = [783.99, 659.25, 523.25]; // G5, E5, C5
  const noteLength = 0.25;

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = freq;

    const start = now + i * noteLength;
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.exponentialRampToValueAtTime(0.2, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + noteLength - 0.02);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    osc.stop(start + noteLength);
  });
}
