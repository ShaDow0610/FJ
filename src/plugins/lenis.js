// src/plugins/lenis.js
// Instance Lenis (scroll fluide global).
// SSR-safe : aucun side-effect hors navigateur, pas de boucle ici.
// Export par défaut : l'instance (ou null côté SSR).

import Lenis from "@studio-freight/lenis";

/** @type {import('@studio-freight/lenis').default | null} */
let lenis = null;

if (typeof window !== "undefined") {
  // Crée l'instance uniquement côté navigateur
  lenis = new Lenis({
    duration: 1.08, // vitesse (↑ = plus lent)
    smooth: true, // lissage desktop
    smoothTouch: false, // garde le scroll natif sur mobile (meilleur UX perf)
    // gestureDirection: 'vertical', // optionnel
    // wheelMultiplier: 1,          // optionnel : sensibilité molette
    // touchMultiplier: 1,          // optionnel : sensibilité tactile
    // normalizeWheel: true,        // optionnel
  });
}

export default lenis;

/**
 * Notes d'usage :
 * - Lance la boucle RAF dans `main.js`, par ex. :
 *   import lenis from '@/plugins/lenis'
 *   function raf(time){ lenis?.raf(time); requestAnimationFrame(raf) }
 *   requestAnimationFrame(raf)
 *
 * - Tu peux contrôler le scroll :
 *   lenis?.stop()  // désactiver (ex: menu plein écran)
 *   lenis?.start() // réactiver
 *   lenis?.scrollTo('#sectionId' || element || yNumber, { offset: 0 })
 *
 * - En mobile, `smoothTouch:false` préserve le ressenti natif. Passe à true
 *   uniquement si tu veux un rendu très “ciné” sur mobile (au prix de la vivacité).
 */
