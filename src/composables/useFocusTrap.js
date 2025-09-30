import { onMounted, onBeforeUnmount } from "vue";

/**
 * Piège le focus dans rootEl quand enable() est appelé.
 * Appelle onEscape() si l’utilisateur presse ESC.
 */
export function useFocusTrap(rootRef, { onEscape } = {}) {
  let lastFocused = null;
  let keydownHandler = null;

  function getFocusables() {
    const root = rootRef?.value;
    if (!root) return [];
    return Array.from(
      root.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(
      (el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden")
    );
  }

  function cycle(e) {
    if (e.key !== "Tab") return;
    const nodes = getFocusables();
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function handleKeydown(e) {
    if (e.key === "Escape" && typeof onEscape === "function") onEscape();
    cycle(e);
  }

  function enable() {
    lastFocused = document.activeElement;
    const nodes = getFocusables();
    nodes[0]?.focus();
    keydownHandler = (e) => handleKeydown(e);
    document.addEventListener("keydown", keydownHandler);
  }

  function disable() {
    document.removeEventListener("keydown", keydownHandler);
    keydownHandler = null;
    lastFocused?.focus?.();
  }

  onMounted(() => {});
  onBeforeUnmount(() => disable());

  return { enable, disable };
}
