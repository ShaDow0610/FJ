// src/utils/currency.js
// Formateur de prix (XAF par défaut).
// Utilise Intl.NumberFormat si disponible, sinon fallback manuel.

export function formatPrice(value, currency = "XAF", locale = "fr-CM") {
  if (value == null || isNaN(value)) return "";

  try {
    if (typeof Intl !== "undefined" && Intl.NumberFormat) {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
  } catch (e) {
    // ignore et bascule sur fallback
  }

  // Fallback simple si Intl non dispo
  return `${value} ${currency}`;
}

/* --- Exemples d’usage ---
import { formatPrice } from '@/utils/currency'

formatPrice(15000)             // "15 000 FCFA" (fr-CM)
formatPrice(15000, 'USD')      // "$15,000" (locale fr-CM)
formatPrice(1999.99, 'EUR')    // "1 999 EUR"
*/
