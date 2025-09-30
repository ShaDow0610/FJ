// src/services/payment.js
// P2 — Intégration paiement (Flutterwave / Paystack) — STUB
// - Exporte deux fonctions asynchrones : initPayment(order, opts) et verify(statusRef, opts)
// - AUCUN side-effect au chargement (SSR-safe). Les SDKs seront chargés dynamiquement.
// - Mode test par défaut. À spécialiser en P2 réelle.
//
// NB: Ce fichier définit le CONTRAT d'appel côté UI (Checkout).
// L'UI peut déjà coder contre ces signatures et gérer les états (loading/success/failure).

/**
 * @typedef {'flutterwave'|'paystack'} PaymentProvider
 * @typedef {'test'|'live'} PaymentMode
 */

/**
 * @typedef {Object} OrderItem
 * @property {string} id
 * @property {string} title
 * @property {number} price // dans la devise de l'order (ex: XAF)
 * @property {number} qty
 */

/**
 * @typedef {Object} Order
 * @property {string} id               // identifiant panier/commande local
 * @property {string} currency         // ex: 'XAF' | 'NGN' | 'USD'
 * @property {number} amount           // total TTC
 * @property {string} customerEmail
 * @property {string} [customerName]
 * @property {OrderItem[]} items
 * @property {Record<string, any>} [meta] // champs libres (ex: cartHash, utm, etc.)
 */

/**
 * @typedef {Object} InitOpts
 * @property {PaymentProvider} [provider]   // 'flutterwave' | 'paystack' (default: env ou 'flutterwave')
 * @property {PaymentMode} [mode]           // 'test' | 'live' (default: 'test')
 * @property {string} [callbackUrl]         // URL de retour (success/cancel)
 * @property {string} [publicKey]           // Public key du provider (test)
 */

/**
 * Réponse d'initPayment — ce que l'UI doit savoir pour continuer le flow.
 * - redirectUrl : si le provider nécessite une redirection (web checkout)
 * - reference   : identifiant transaction côté PSP (à conserver pour verify)
 * - provider    : provider effectivement utilisé
 * - payload     : données additionnelles (ex: token du SDK)
 * - raw         : réponse brute du PSP (quand dispo)
 * @typedef {Object} InitResult
 * @property {string|undefined} redirectUrl
 * @property {string} reference
 * @property {PaymentProvider} provider
 * @property {Record<string, any>} [payload]
 * @property {any} [raw]
 */

/**
 * Réponse de verify — statut final interprétable par l'UI.
 * - status: 'success' | 'pending' | 'failed'
 * - amount, currency : rappels utiles
 * - raw : réponse brute du PSP (quand dispo)
 * @typedef {Object} VerifyResult
 * @property {'success'|'pending'|'failed'} status
 * @property {number|undefined} amount
 * @property {string|undefined} currency
 * @property {any} [raw]
 */

// --- Utils internes ---

/**
 * Charge dynamiquement un script externe (SDK) si nécessaire.
 * @param {string} src
 * @returns {Promise<void>}
 */
function loadScript(src) {
  if (typeof window === "undefined") return Promise.resolve();
  if (document.querySelector(`script[src="${src}"]`)) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

/**
 * Sélectionne le provider effectif.
 * @param {InitOpts|undefined} opts
 * @returns {PaymentProvider}
 */
function pickProvider(opts) {
  // Si tu veux piloter par env : import.meta.env.VITE_PSP || 'flutterwave'
  return opts?.provider === "paystack" ? "paystack" : "flutterwave";
}

/**
 * Normalise le mode (test/live).
 * @param {InitOpts|undefined} opts
 * @returns {PaymentMode}
 */
function pickMode(opts) {
  return opts?.mode === "live" ? "live" : "test";
}

// --- API publique ---

/**
 * Initialise un paiement chez le PSP choisi (STUB).
 * En P2 réelle, on :
 *  - charge le SDK (loadScript)
 *  - construit la requête
 *  - ouvre la modale/redirecte l’utilisateur
 *  - récupère une référence transactionnelle (reference)
 *
 * @param {Order} order
 * @param {InitOpts} [opts]
 * @returns {Promise<InitResult>}
 */
export async function initPayment(order, opts) {
  const provider = pickProvider(opts);
  const mode = pickMode(opts);
  const reference = `${provider}_${order.id}_${Date.now()}`;
  const callbackUrl =
    opts?.callbackUrl || `${location.origin}/checkout/callback`;

  // --- STUB d’initialisation ---
  // Ici, tu brancheras le vrai SDK :
  // - Flutterwave (ex: https://checkout.flutterwave.com/v3.js)
  // - Paystack   (ex: https://js.paystack.co/v1/inline.js)
  //
  // Ex Flutterwave (PSEUDO) :
  // await loadScript('https://checkout.flutterwave.com/v3.js')
  // const resp = await window.FlutterwaveCheckout({ ... })
  //
  // Ex Paystack (PSEUDO) :
  // await loadScript('https://js.paystack.co/v1/inline.js')
  // const handler = window.PaystackPop.setup({ ... })
  // handler.openIframe()

  // Pour P2 (test), on simule :
  /** @type {InitResult} */
  const result = {
    provider,
    reference,
    redirectUrl: undefined, // si flow redirigé : mets l'URL renvoyée par le PSP
    payload: {
      mode,
      callbackUrl,
      // Ex: token ou session_id renvoyé par le back quand tu crées la transaction
    },
    raw: { stub: true },
  };

  return result;
}

/**
 * Vérifie le statut d'une transaction via sa référence (STUB).
 * En P2 réelle, on appelle l'API du PSP (via ton back de préférence) :
 *  - GET /verify/:reference
 *  - interpréter 'success' / 'abandoned' / 'failed' / 'pending'
 *
 * @param {string} statusRef  // référence retournée par initPayment/callback
 * @param {{ provider?: PaymentProvider }} [opts]
 * @returns {Promise<VerifyResult>}
 */
export async function verify(statusRef, opts) {
  const provider = pickProvider(opts);

  // --- STUB de vérification ---
  // En réel :
  //  - Côté client : appelles ton back: await api.get(`/payments/${provider}/verify`, { params:{ ref: statusRef } })
  //  - Côté serveur : parles au PSP (secret key) et renvoies la réponse normalisée
  //
  // Ici on simule un succès si le timestamp est pair, sinon pending :
  const ts = Number(statusRef.split("_").pop()) || Date.now();
  const mockStatus = ts % 2 === 0 ? "success" : "pending";

  /** @type {VerifyResult} */
  const result = {
    status: /** @type {'success'|'pending'|'failed'} */ (mockStatus),
    amount: undefined, // remplis en réel depuis la réponse PSP
    currency: undefined, // idem
    raw: { stub: true, provider, ref: statusRef },
  };

  return result;
}
