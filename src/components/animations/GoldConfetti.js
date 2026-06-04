import confetti from "canvas-confetti";

/**
 * Triggers a premium golden confetti burst.
 * Designed with a mix of light-catching gold, amber, and cream colors
 * simulating falling golden leaves or dust.
 */
export function triggerGoldConfetti() {
  const duration = 2.5 * 1000;
  const end = Date.now() + duration;

  // Curated color palette matching our Shamanic design system
  const colors = ["#E8C86B", "#FF9F43", "#FAF9F6", "#C5A85A", "#1A4B23"];

  (function frame() {
    // Left side burst
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
      colors: colors,
      scalar: 1.2,
      drift: 0.1,
    });

    // Right side burst
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
      colors: colors,
      scalar: 1.2,
      drift: -0.1,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

/**
 * Triggers a center explosion of fine gold dust.
 */
export function triggerGoldExplosion() {
  const colors = ["#E8C86B", "#C5A85A", "#FAF9F6"];
  confetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.6 },
    colors: colors,
    gravity: 0.8,
    scalar: 1.1,
    drift: 0,
    ticks: 200,
  });
}
