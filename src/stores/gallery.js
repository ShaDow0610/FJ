// src/stores/gallery.js
// Store Lookbook : items + filtre par tag
// - Performant : getter "filtered" mémorisé par tag courant
// - Aucun side-effect (pas de fetch ici)

import { defineStore } from "pinia";
import { computed, reactive } from "vue";

/**
 * @typedef {Object} LookItem
 * @property {string} id
 * @property {string} title
 * @property {string[]} [tags]  // ex: ['casual','street']
 * @property {string} cover     // chemin image /assets/...
 */

export const useGallery = defineStore("gallery", () => {
  /** @type {LookItem[]} */
  const state = reactive({
    items: /** @type {LookItem[]} */ ([]),
    filters: { tag: "all" },
  });

  // Cache simple par tag courant pour éviter de re-filtrer
  let _lastTag = "all";
  /** @type {LookItem[]} */ let _lastResult = [];

  const filtered = computed(() => {
    const tag = state.filters.tag || "all";
    if (tag === _lastTag && _lastResult.length) return _lastResult;
    if (tag === "all") {
      _lastTag = "all";
      _lastResult = state.items;
      return _lastResult;
    }
    const res = state.items.filter((i) => (i.tags || []).includes(tag));
    _lastTag = tag;
    _lastResult = res;
    return res;
  });

  /**
   * Remplace la liste d'items (aucune mutation annexe)
   * @param {LookItem[]} items
   */
  function setItems(items) {
    state.items = Array.isArray(items) ? items : [];
    // reset cache pour cohérence
    _lastTag = state.filters.tag || "all";
    _lastResult = [];
  }

  /**
   * Définit le tag de filtre courant
   * @param {string} tag
   */
  function setTag(tag) {
    state.filters.tag = tag || "all";
    // invalide le cache pour refléter le nouveau tag
    _lastTag = "";
    _lastResult = [];
  }

  return {
    // state
    items: state.items,
    filters: state.filters,

    // getters
    filtered,

    // actions
    setItems,
    setTag,
  };
});
