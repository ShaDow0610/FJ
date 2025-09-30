// src/stores/cart.js
// Panier minimal : items [{ id, title, price, qty }]
// Getters : total (somme), count (nb total d’articles)
// Actions : add (fusionne qty si id existe), remove, clear

import { defineStore } from "pinia";
import { reactive, computed } from "vue";

/**
 * @typedef {Object} CartItem
 * @property {string} id
 * @property {string} title
 * @property {number} price
 * @property {number} qty
 */

export const useCart = defineStore("cart", () => {
  /** @type {{ items: CartItem[] }} */
  const state = reactive({
    items: /** @type {CartItem[]} */ ([]),
  });

  // ----- GETTERS -----
  const total = computed(() =>
    state.items.reduce(
      (sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 0),
      0
    )
  );

  const count = computed(() =>
    state.items.reduce((sum, it) => sum + (Number(it.qty) || 0), 0)
  );

  // ----- ACTIONS -----
  /**
   * Ajoute un item au panier ; fusionne la quantité si l'id existe déjà.
   * @param {{ id:string; title:string; price:number }} item
   * @param {number} qty
   */
  function add(item, qty = 1) {
    if (!item || !item.id) return;
    const q = Math.max(1, Number(qty) || 1);
    const idx = state.items.findIndex((x) => x.id === item.id);
    if (idx >= 0) {
      state.items[idx].qty = Math.min(
        999,
        (Number(state.items[idx].qty) || 0) + q
      );
      // Option : mettre à jour le title/price si on veut suivre la dernière version
      state.items[idx].title = item.title ?? state.items[idx].title;
      state.items[idx].price =
        Number(item.price ?? state.items[idx].price) || 0;
    } else {
      state.items.push({
        id: String(item.id),
        title: item.title ?? "",
        price: Number(item.price) || 0,
        qty: q,
      });
    }
  }

  /**
   * Retire l’item par id (retire toutes ses quantités).
   * @param {string} id
   */
  function remove(id) {
    const i = state.items.findIndex((x) => x.id === id);
    if (i >= 0) state.items.splice(i, 1);
  }

  /** Vide entièrement le panier. */
  function clear() {
    state.items = [];
  }

  return {
    // state
    items: state.items,

    // getters
    total,
    count,

    // actions
    add,
    remove,
    clear,
  };
});
