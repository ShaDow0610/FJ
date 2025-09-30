// src/utils/motion.js
// Échelles temporelles & easings — référence unique pour l’animation.

export const motion = {
  dur: { xs: 0.35, sm: 0.6, md: 0.9, lg: 1.2 },
  ease: {
    in: "power2.in",
    out: "power2.out",
    inOut: "power2.inOut",
    bounce: "bounce.out",
    expo: "expo.out",
  },
  stagger: { tight: 0.06, base: 0.1, wide: 0.15 },
};
