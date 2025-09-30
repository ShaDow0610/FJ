// src/composables/useLenis.js
// Utilitaires autour de l'instance Lenis : scrollTo / start / stop
// SSR-safe : protège l'accès si l'instance n'existe pas côté serveur.

import { computed } from "vue";
import lenis from "@/plugins/lenis";

/**
 * Options typiques Lenis.scrollTo :
 *  - offset: number (px)
 *  - duration: number (s)
 *  - easing: (t)=>t
 *  - immediate: boolean
 *  - lock: boolean
 */

/**
 * @returns {{ scrollTo: (target: Element|string|number, opts?:object)=>void, start: ()=>void, stop: ()=>void, available: import('vue').ComputedRef<boolean> }}
 */
export function useLenis() {
  const available = computed(() => !!lenis);

  function scrollTo(target, opts = {}) {
    if (!lenis) return;
    // API Lenis : element | selector | number
    lenis.scrollTo(target, {
      // Valeurs douces par défaut ; surchargeables via opts
      duration: opts.duration ?? 1.0,
      offset: opts.offset ?? 0,
      easing: opts.easing, // ex: (t)=>1-Math.pow(1-t, 3)
      immediate: opts.immediate ?? false,
      lock: opts.lock ?? false,
      ...opts,
    });
  }

  function start() {
    if (!lenis) return;
    lenis.start();
  }

  function stop() {
    if (!lenis) return;
    lenis.stop();
  }

  return { scrollTo, start, stop, available };
}

/* --- Exemples d'usage ---
import { useLenis } from '@/composables/useLenis'
const { scrollTo, stop, start } = useLenis()

// Scroll lissé vers un id
scrollTo('#gallery', { offset: -80 })

// Pause le scroll (ex: menu plein écran), puis reprise
stop()
start()

// Scroll vers un nombre (px) :
scrollTo(0, { duration: .6 })
*/
