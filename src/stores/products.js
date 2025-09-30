// src/stores/products.js
// Store Produits : outfits (avec pièces) + services d'influence.
// - Aucune logique business (totaux, taxes, etc.) ici : le panier gère.
// - Données remplaçables via setOutfits / setServices.

import { defineStore } from "pinia";
import { reactive } from "vue";

/**
 * @typedef {Object} Piece
 * @property {string} id
 * @property {string} title
 * @property {number} price
 */

/**
 * @typedef {Object} Outfit
 * @property {string} id
 * @property {string} title
 * @property {string} cover   // chemin image /assets/...
 * @property {number} price   // prix bundle (ensemble complet)
 * @property {Piece[]} pieces // pièces qui composent l'outfit
 */

/**
 * @typedef {Object} Service
 * @property {string} id
 * @property {string} title
 * @property {string} copy
 * @property {number} [priceFrom] // optionnel : prix "à partir de"
 */

export const useProducts = defineStore("products", () => {
  /** @type {{ outfits: Outfit[]; services: Service[] }} */
  const state = reactive({
    outfits: /** @type {Outfit[]} */ ([]),
    services: /** @type {Service[]} */ ([]),
  });

  /**
   * Remplace la liste des outfits.
   * @param {Outfit[]} outfits
   */
  function setOutfits(outfits) {
    state.outfits = Array.isArray(outfits) ? outfits : [];
  }

  /**
   * Remplace la liste des services.
   * @param {Service[]} services
   */
  function setServices(services) {
    state.services = Array.isArray(services) ? services : [];
  }

  return {
    // state
    outfits: state.outfits,
    services: state.services,

    // actions
    setOutfits,
    setServices,
  };
});
