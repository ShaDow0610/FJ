// src/i18n/index.js
// Bilingue FR/EN — prêt pour injection dynamique de nouvelles clés.
// SSR-safe. Legacy off. Fallback EN.

import { createI18n } from "vue-i18n";
import fr from "./fr.json";
import en from "./en.json";

export const SUPPORTED_LOCALES = ["fr", "en"];

const i18n = createI18n({
  legacy: false,
  locale: "fr",
  fallbackLocale: "en",
  messages: { fr, en },
  globalInjection: true, // permet d'appeler $t directement dans les templates
});

/**
 * Ajoute/merge dynamiquement des messages (lazy injection).
 * @param {'fr'|'en'|string} locale
 * @param {Record<string, any>} messages
 */
export function addI18nMessages(locale, messages) {
  if (!locale || !messages) return;
  const l = SUPPORTED_LOCALES.includes(locale)
    ? locale
    : i18n.global.locale.value;
  const current = i18n.global.getLocaleMessage(l) || {};
  i18n.global.setLocaleMessage(l, deepMerge(current, messages));
}

/**
 * Option utilitaire : changer proprement de langue.
 * @param {'fr'|'en'|string} locale
 */
export function setLocale(locale) {
  const l = SUPPORTED_LOCALES.includes(locale) ? locale : "fr";
  i18n.global.locale.value = l;
}

/** Merge profond minimal (objets simples) */
function deepMerge(target, source) {
  const out = { ...target };
  for (const k in source) {
    if (Object.prototype.hasOwnProperty.call(source, k)) {
      if (
        typeof source[k] === "object" &&
        source[k] !== null &&
        !Array.isArray(source[k])
      ) {
        out[k] = deepMerge(out[k] || {}, source[k]);
      } else {
        out[k] = source[k];
      }
    }
  }
  return out;
}

export default i18n;
