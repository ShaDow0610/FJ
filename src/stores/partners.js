// src/stores/partners.js
// Store Partenaires : liste { id, name, category, logo, url }
// - Simple & prévisible : une action set(list)
// - Aucun side-effect (pas de fetch ici)

import { defineStore } from "pinia";
import { reactive } from "vue";

/**
 * @typedef {Object} Partner
 * @property {string} id
 * @property {string} name
 * @property {string} [category]  // ex: 'fashion', 'beauty', 'food'
 * @property {string} logo        // chemin image (svg/png)
 * @property {string} url         // lien externe
 */

export const usePartners = defineStore("partners", () => {
  /** @type {{ list: Partner[] }} */
  const state = reactive({
    list: /** @type {Partner[]} */ ([]),
  });

  /**
   * Remplace la liste de partenaires.
   * Aucune logique métier : on fait confiance aux données entrantes.
   * @param {Partner[]} list
   */
  function set(list) {
    state.list = Array.isArray(list) ? list : [];
  }

  return {
    // state
    list: state.list,

    // actions
    set,
  };
});
