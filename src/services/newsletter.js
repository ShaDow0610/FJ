// src/services/newsletter.js
// P1: Stub d'inscription newsletter (waitlist Masterclass).
// P2: Brancher sur ton backend via `api.post('/newsletter/subscribe', { email })`.
//
// Exporte: subscribe(email) -> Promise<{ ok:boolean, message?:string }>

/// Option (décommente en P2):
// import { api } from '@/services/http'

/** Validation email simple (basique mais suffisante en front) */
function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Inscrit un email à la waitlist (MOCK en P1).
 * @param {string} email
 * @returns {Promise<{ ok: boolean, message?: string }>}
 */
export async function subscribe(email) {
  // Garde-fous front
  if (!isValidEmail(email)) {
    return Promise.resolve({ ok: false, message: "Adresse e-mail invalide." });
  }

  // --- P1: MOCK ---
  // Simule un petit délai réseau (perception UX)
  await new Promise((r) => setTimeout(r, 600));
  return { ok: true, message: "Inscription enregistrée (mock)." };

  // --- P2: Réel (décommenter) ---
  // try {
  //   const res = await api.post('/newsletter/subscribe', { email })
  //   return { ok: true, message: res?.message || 'Inscription confirmée.' }
  // } catch (e) {
  //   return { ok: false, message: e?.data?.message || 'Échec de l’inscription.' }
  // }
}
