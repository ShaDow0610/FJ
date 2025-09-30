// src/utils/reveal.js
// Helpers de reveals/entrées en scène, prêts à l’emploi.
// Dépendances : { gsap } via plugins, { motion } via utils.
// - SSR-safe (aucun accès non gardé à window)
// - Respecte prefers-reduced-motion (RMM)
// - Déclenchement "once" via IntersectionObserver par défaut

import { gsap } from "@/plugins/gsap";
import { motion } from "@/utils/motion";

// Petit utilitaire RMM
function isReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Normalise une collection de nœuds
function toNodes(input) {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  if (input instanceof NodeList) return Array.from(input);
  if (typeof input === "string")
    return Array.from(document.querySelectorAll(input));
  if (input instanceof Element) return [input];
  return [];
}

/**
 * Révèle tous les descendants [data-reveal] de `el`.
 * @param {Element} el - Conteneur racine du bloc à révéler
 * @param {Object} opts
 *  - y, opacity, duration, ease, stagger : options GSAP
 *  - rootMargin (string) : marge de l'IO ('0px 0px -10% 0px' par ex.)
 *  - threshold (number|number[]) : seuil IO (par défaut .2)
 *  - once (boolean) : anime une seule fois (true par défaut)
 *  - immediate (boolean) : démarre sans IO (false par défaut)
 */
export function revealIn(el, opts = {}) {
  if (!el) return;
  const nodes = el.querySelectorAll("[data-reveal]");
  if (!nodes.length) return;

  const {
    y = 24,
    opacity = 0,
    duration = motion.dur.sm,
    ease = motion.ease.out,
    stagger = motion.stagger.tight,
    rootMargin = "0px 0px -10% 0px",
    threshold = 0.2,
    once = true,
    immediate = false,
  } = opts;

  // Si RMM : pas d’animation, on s’assure que tout est visible
  if (isReducedMotion()) {
    toNodes(nodes).forEach((n) => {
      n.style.opacity = "";
    });
    return;
  }

  const play = () => {
    gsap.from(nodes, {
      y,
      opacity,
      duration,
      ease,
      stagger,
      overwrite: "auto",
    });
  };

  if (
    immediate ||
    typeof window === "undefined" ||
    !("IntersectionObserver" in window)
  ) {
    play();
    return;
  }

  // IO : déclenchement à l’entrée dans le viewport
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          play();
          if (once) io.disconnect();
        }
      });
    },
    { root: null, rootMargin, threshold }
  );

  io.observe(el);
}

/**
 * Révèle une liste de nœuds (NodeList / Array / selector / Element) en décalé.
 * @param {Element[]|NodeList|string|Element} targets
 * @param {Object} opts - mêmes options GSAP que revealIn (durations/ease/stagger)
 */
export function staggerFadeIn(targets, opts = {}) {
  const nodes = toNodes(targets);
  if (!nodes.length) return;

  const {
    y = 16,
    opacity = 0,
    duration = motion.dur.xs,
    ease = motion.ease.out,
    stagger = motion.stagger.base,
    immediate = true,
  } = opts;

  if (isReducedMotion()) {
    nodes.forEach((n) => {
      n.style.opacity = "";
    });
    return;
  }

  const play = () =>
    gsap.from(nodes, {
      y,
      opacity,
      duration,
      ease,
      stagger,
      overwrite: "auto",
    });
  if (immediate) play();
}
