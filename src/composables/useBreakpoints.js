// src/composables/useBreakpoints.js
// Détecte les breakpoints Tailwind via @vueuse/core.
// Exporte des booléens réactifs : isMobile, isTablet, isDesktop.
// - Mobile  : < 768px (avant md)
// - Tablet  : >= 768px et < 1024px (md..lg-1)
// - Desktop : >= 1024px (lg et +)

import { computed } from "vue";
import { useBreakpoints } from "@vueuse/core";

// Tailwind (défaut) : https://tailwindcss.com/docs/responsive-design
const bp = useBreakpoints({
  sm: 640, // ≥ 640px
  md: 768, // ≥ 768px
  lg: 1024, // ≥ 1024px
  xl: 1280, // ≥ 1280px
});

// Helpers @vueuse
const greaterOrEqual = bp.greaterOrEqual;
const smaller = bp.smaller;
const between = bp.between;

// Etats réactifs
const isMobile = smaller("md"); // <768px
const isTablet = between("md", "lg"); // [768..1023]
const isDesktop = greaterOrEqual("lg"); // ≥1024px

// Optionnel : expose aussi l’état XL si besoin
const isXL = greaterOrEqual("xl"); // ≥1280px

export function useBreakpointsShadow() {
  return {
    isMobile,
    isTablet,
    isDesktop,
    isXL, // optionnel
  };
}

// Export par défaut pratique si tu préfères l'import direct
export default useBreakpointsShadow;

/* --- Exemples d'usage ---
import { useBreakpointsShadow } from '@/composables/useBreakpoints'
const { isMobile, isTablet, isDesktop } = useBreakpointsShadow()

watchEffect(() => {
  if (isDesktop.value) {
    // Activer underline GSAP nav, activer tilt, etc.
  } else {
    // Désactiver effets trop lourds en mobile
  }
})
*/
