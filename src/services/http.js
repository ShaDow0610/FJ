// src/services/http.js
// Client HTTP unifié (ofetch)
// - baseURL: '/api'
// - retry: 0 (on préfère gérer les erreurs explicitement)
// - Interceptors simples (request/response) prêts à étendre
//
// Exporte: { api } → api.get/post/put/patch/delete(...)

import { ofetch } from "ofetch";

/** @type {ReturnType<typeof ofetch.create>} */
export const api = ofetch.create({
  baseURL: "/api",
  retry: 0,
  // timeout: 10_000, // optionnel
  headers: {
    Accept: "application/json",
  },

  // ----- Interceptors -----
  async onRequest({ options }) {
    // Exemple: injecter un token si dispo (à adapter)
    // const token = useAuthStore()?.token
    // if (token) (options.headers ||= {})['Authorization'] = `Bearer ${token}`

    // En JSON par défaut si body objet
    if (
      options.body &&
      typeof options.body === "object" &&
      !(options.body instanceof FormData)
    ) {
      (options.headers ||= {})["Content-Type"] = "application/json";
    }
  },

  onRequestError({ error }) {
    // Log léger (évite d'inonder la console en prod)
    if (import.meta?.env?.DEV) console.warn("[api][request:error]", error);
  },

  onResponse({ response }) {
    // Exemple: lecture d'entêtes personnalisés
    // const traceId = response.headers.get('x-trace-id')
    return response;
  },

  onResponseError({ response }) {
    // Centralise la gestion d'erreurs HTTP
    if (import.meta?.env?.DEV) {
      console.error(
        "[api][response:error]",
        response?.status,
        response?._data || response?.statusText
      );
    }
    // Laisser remonter l’erreur côté appelant
  },
});

// --------- Exemples d’usage ---------
// import { api } from '@/services/http'
// const partners = await api('/partners')     // GET /api/partners
// const created  = await api('/contact', { method:'POST', body:{ name, email, message } })
// const product  = await api.get('/products/123')
// const updated  = await api.patch('/products/123', { price: 150000 })
