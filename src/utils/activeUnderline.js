import { gsap } from "@/plugins/gsap";

/**
 * Barre soulignement animée pour nav desktop.
 * mount(containerEl): crée le span underline (absolute).
 * moveTo(linkEl): anime x/width sous le lien actif.
 * hide(): réduit width à 0.
 */
export function createActiveUnderline(containerEl, { disabled = false } = {}) {
  const bar = document.createElement("span");
  Object.assign(bar.style, {
    position: "absolute",
    height: "2px",
    left: "0px",
    bottom: "0px",
    width: "0px",
    background: "#caa45f", // or
    transition: "none",
    pointerEvents: "none",
  });
  containerEl.style.position = "relative";
  containerEl.appendChild(bar);

  const mm = window.matchMedia("(prefers-reduced-motion: reduce)");
  const rmm = !!mm.matches;

  function moveTo(linkEl) {
    if (disabled || rmm || !linkEl) return;
    const parentRect = containerEl.getBoundingClientRect();
    const rect = linkEl.getBoundingClientRect();
    const x = rect.left - parentRect.left + 8; // padding correction optionnelle
    const w = rect.width - 16;
    gsap.to(bar, {
      x,
      width: Math.max(0, w),
      duration: 0.25,
      ease: "power2.out",
    });
  }
  function hide() {
    gsap.to(bar, { width: 0, duration: 0.2 });
  }
  return { bar, moveTo, hide };
}
