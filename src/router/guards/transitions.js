// src/router/guards/transitions.js
// Installe des hooks router pour déclencher la transition PageTransition.
// Usage : installRouteTransitions(router, pageTransitionRef, { getCoords })

/**
 * @typedef {{ x?: number, y?: number, color?: string, duration?: number, ease?: string }} TransitionOpts
 * @typedef {{ getCoords?: ()=>({x:number,y:number}|null), out?: TransitionOpts, in?: TransitionOpts }} InstallOpts
 */

/**
 * Installe les hooks router pour appeler playOut puis playIn.
 * @param {import('vue-router').Router} router
 * @param {{ value?: { playOut?: (o?:TransitionOpts)=>Promise<any>, playIn?: (o?:TransitionOpts)=>Promise<any> } }} pageTransitionRef
 * @param {InstallOpts} [options]
 */
export function installRouteTransitions(
  router,
  pageTransitionRef,
  options = {}
) {
  let busy = false; // évite double déclenchement
  let pendingTo = null; // mémorise la destination tant que playOut n'est pas fini

  // Hook beforeEach : on ferme (cover)
  router.beforeEach(async (to, from, next) => {
    // Navigation initiale (premier load) : ne joue pas de playOut
    if (!from || !from.name) {
      pendingTo = to;
      return next();
    }

    // Si une nav est déjà en cours, on laisse le router gérer
    if (busy) return next();

    busy = true;
    pendingTo = to;

    try {
      const api = pageTransitionRef?.value;
      if (api?.playOut) {
        // Coordonnées du clic (optionnelles)
        const coords =
          typeof options.getCoords === "function" ? options.getCoords() : null;
        const outOpts = { ...(options.out || {}), ...(coords || {}) };
        await api.playOut(outOpts);
      }
    } catch (e) {
      // En cas d'échec, on ne bloque pas la nav
      if (import.meta?.env?.DEV)
        console.warn("[transitions] playOut error:", e);
    } finally {
      next();
    }
  });

  // Hook afterEach : on ouvre (discover)
  router.afterEach(async () => {
    try {
      const api = pageTransitionRef?.value;
      if (api?.playIn) {
        const coords =
          typeof options.getCoords === "function" ? options.getCoords() : null;
        const inOpts = { ...(options.in || {}), ...(coords || {}) };
        await api.playIn(inOpts);
      }
    } catch (e) {
      if (import.meta?.env?.DEV) console.warn("[transitions] playIn error:", e);
    } finally {
      busy = false;
      pendingTo = null;
    }
  });
}

export default installRouteTransitions;
