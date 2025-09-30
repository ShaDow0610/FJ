// src/composables/useReducedMotion.js
// Détecte le réglage système "Réduire les animations" et l'expose en Ref.
// SSR-safe : n'accède à window qu'au montage.

import { ref, onMounted, onBeforeUnmount } from "vue";

const QUERY = "(prefers-reduced-motion: reduce)";

export function useReducedMotion(defaultValue = false) {
  const reduced = ref(defaultValue);
  let mql = null;
  let handler = null;

  onMounted(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    mql = window.matchMedia(QUERY);
    reduced.value = !!mql.matches;

    handler = (e) => {
      reduced.value = !!e.matches;
    };

    // Compatibilité anciens navigateurs
    if (mql.addEventListener) mql.addEventListener("change", handler);
    else if (mql.addListener) mql.addListener(handler);
  });

  onBeforeUnmount(() => {
    if (!mql || !handler) return;
    if (mql.removeEventListener) mql.removeEventListener("change", handler);
    else if (mql.removeListener) mql.removeListener(handler);
    handler = null;
    mql = null;
  });

  return { reduced };
}

// Option utilitaire (synchrone) si besoin ponctuel hors composable :
export function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
}
