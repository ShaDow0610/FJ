// src/utils/flip.js
// Petit wrapper utilitaire pour GSAP Flip.
// - SSR-safe : n’accède pas au DOM hors exécution navigateur
// - API : captureState(nodes), playFrom(state, opts)

import { gsap, Flip } from "@/plugins/gsap";

// Normalise une collection de nœuds vers un Array<Element>
function toNodes(input) {
  if (!input) return [];
  if (Array.isArray(input)) return input.filter(Boolean);
  if (input instanceof NodeList) return Array.from(input);
  if (typeof input === "string") {
    if (typeof document === "undefined") return [];
    return Array.from(document.querySelectorAll(input));
  }
  if (input instanceof Element) return [input];
  return [];
}

/**
 * Capture l’état FLIP de la/les cible(s).
 * @param {Element|Element[]|NodeList|string} nodes
 * @returns {Flip.FlipState|null}
 */
export function captureState(nodes) {
  const list = toNodes(nodes);
  if (!list.length) return null;
  return Flip.getState(list);
}

/**
 * Joue une transition depuis un état FLIP capturé.
 * @param {Flip.FlipState|null} state
 * @param {Object} opts
 *  - duration:number = .6
 *  - ease:string = 'power2.inOut'
 *  - absolute:boolean = true
 *  - nested:boolean = true (souvent utile pour les grilles)
 *  - simple:boolean (si tu veux un anniv simple sans complexité)
 *  - onComplete:Function (callback)
 */
export function playFrom(state, opts = {}) {
  if (!state) return;
  const {
    duration = 0.6,
    ease = "power2.inOut",
    absolute = true,
    nested = true,
    simple = false,
    onComplete,
    ...rest
  } = opts;

  return Flip.from(state, {
    duration,
    ease,
    absolute,
    nested,
    simple,
    onComplete,
    ...rest,
  });
}

/* --- Exemples d’usage ---
// Grille → Overlay (GalleryGrid / LookOverlay)
const state = captureState(root.value.querySelectorAll('[data-card]'))
current.value = item // mutation de DOM/rendu
playFrom(state, { duration:.6, ease:'power2.inOut', absolute:true })

// Modal pièces (Shop)
const state = captureState(document.querySelectorAll('.card, .modal'))
openModal = true
playFrom(state, { nested:true })
*/
