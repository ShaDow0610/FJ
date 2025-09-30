// src/plugins/gsap.js
// Registre GSAP + plugins (ScrollTrigger, Flip)
// Safe SSR : aucun accès à `window` hors garde.
// Exporte { gsap, ScrollTrigger, Flip }

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Flip from "gsap/Flip";

// Enregistrement unique côté navigateur
if (typeof window !== "undefined") {
  // Évite double enregistrement si HMR
  const registered = gsap.core?.globals?.() || {};
  const hasST = !!registered.ScrollTrigger;
  const hasFlip = !!registered.Flip;

  if (!hasST || !hasFlip) {
    gsap.registerPlugin(ScrollTrigger, Flip);
  }

  // Option RMM : si l’utilisateur préfère réduire les animations,
  // on peut rendre ScrollTrigger un peu plus “calme”.
  // (Tu peux affiner au besoin dans tes composants)
  const rmm = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (rmm) {
    // Exemples de réglages prudents (facultatifs) :
    // - Pas de marqueurs
    // - Événements d'auto-refresh limités
    ScrollTrigger.defaults({ markers: false });
    // ScrollTrigger.config({ ignoreMobileResize: true }) // décommenter si utile
  }
}

export { gsap, ScrollTrigger, Flip };
