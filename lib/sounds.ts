import { Howl } from 'howler';

let tickSound: Howl | null = null;
let celebrationSound: Howl | null = null;
let drumrollSound: Howl | null = null;

export const initializeSounds = () => {
  try {
    tickSound = new Howl({
      src: ['/sounds/tick.mp3'],
      volume: 0.3,
      rate: 1.0,
      onloaderror: () => console.log('Tick sound not found - add tick.mp3 to public/sounds/')
    });

    celebrationSound = new Howl({
      src: ['/sounds/celebration.mp3'],
      volume: 0.5,
      onloaderror: () => console.log('Celebration sound not found - add celebration.mp3 to public/sounds/')
    });

    drumrollSound = new Howl({
      src: ['/sounds/drumroll.mp3'],
      volume: 0.4,
      loop: true,
      onloaderror: () => console.log('Drumroll sound not found - add drumroll.mp3 to public/sounds/')
    });
  } catch (error) {
    console.log('Sound initialization failed - sounds will be disabled');
  }
};

export const playTick = (rate: number = 1.0) => {
  if (tickSound && tickSound.state() === 'loaded') {
    tickSound.rate(rate);
    tickSound.play();
  }
};

export const playCelebration = () => {
  if (celebrationSound && celebrationSound.state() === 'loaded') {
    celebrationSound.play();
  }
};

export const startDrumroll = () => {
  if (drumrollSound && drumrollSound.state() === 'loaded') {
    drumrollSound.play();
  }
};

export const stopDrumroll = () => {
  if (drumrollSound && drumrollSound.state() === 'loaded') {
    drumrollSound.stop();
  }
};