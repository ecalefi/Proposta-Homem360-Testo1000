import confetti from 'canvas-confetti';

// Configurações de confete para diferentes ocasiões
export const fireConfetti = (options?: confetti.Options) => {
  const defaults = {
    origin: { y: 0.7 },
    spread: 360,
    ticks: 100,
    gravity: 0.8,
    decay: 0.94,
    startVelocity: 30,
    colors: ['#FFD700', '#FFA500', '#FF6347', '#4169E1', '#32CD32', '#FF69B4'],
  };

  confetti({
    ...defaults,
    ...options,
  });
};

// Confete especial para completar 3/3
export const fireCompletionConfetti = () => {
  const duration = 3000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#FFD700', '#FFA500', '#FF6347', '#32CD32', '#4169E1'],
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#FFD700', '#FFA500', '#FF6347', '#32CD32', '#4169E1'],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
};

// Confete de celebração de nível
export const fireLevelUpConfetti = () => {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#FFD700', '#FFA500'],
  });
  fire(0.2, {
    spread: 60,
    colors: ['#FF6347', '#FF69B4'],
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#4169E1', '#32CD32'],
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    colors: ['#FFD700', '#FFA500'],
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ['#FF6347', '#FF69B4'],
  });
};

// Confete para streak
export const fireStreakConfetti = (days: number) => {
  const intensity = Math.min(days / 30, 1); // 0 a 1 baseado nos dias
  
  confetti({
    particleCount: Math.floor(50 + intensity * 150),
    spread: 360,
    origin: { y: 0.6 },
    colors: ['#FF6347', '#FFD700', '#FFA500', '#FF4500'],
    ticks: 150,
    gravity: 0.8,
    decay: 0.94,
    startVelocity: 20 + intensity * 40,
    scalar: 0.8 + intensity * 0.5,
  });
};

// Confete discreto para missões individuais
export const fireMissionConfetti = () => {
  confetti({
    particleCount: 30,
    spread: 70,
    origin: { y: 0.8 },
    colors: ['#32CD32', '#4169E1', '#FFD700'],
    ticks: 80,
    gravity: 1,
    decay: 0.95,
    startVelocity: 15,
  });
};

export default {
  fireConfetti,
  fireCompletionConfetti,
  fireLevelUpConfetti,
  fireStreakConfetti,
  fireMissionConfetti,
};
