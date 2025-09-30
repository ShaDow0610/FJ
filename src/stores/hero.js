// src/stores/hero.js
// Store Runway (Accueil) : slides du hero + actes (sections)
// - Aucune logique d'animation ici : seulement les données
// - Actions : setSlides / setActs

import { defineStore } from "pinia";
import { reactive } from "vue";

/**
 * @typedef {'image'|'video'} MediaType
 */

/**
 * @typedef {Object} HeroSlide
 * @property {string} id
 * @property {MediaType} type   // 'image' | 'video'
 * @property {string} src       // chemin asset
 * @property {string} [caption] // légende courte
 */

/**
 * @typedef {Object} HeroAct
 * @property {string} id
 * @property {string} title
 * @property {string} copy
 * @property {string} [media]   // image éventuelle de l'acte
 */

export const useHero = defineStore("hero", () => {
  /** @type {{ slides: HeroSlide[]; acts: HeroAct[] }} */
  const state = reactive({
    slides: /** @type {HeroSlide[]} */ ([]),
    acts: /** @type {HeroAct[]} */ ([]),
  });

  /**
   * Remplace la liste des slides (hero).
   * @param {HeroSlide[]} slides
   */
  function setSlides(slides) {
    state.slides = Array.isArray(slides) ? slides : [];
  }

  /**
   * Remplace la liste des actes (sections).
   * @param {HeroAct[]} acts
   */
  function setActs(acts) {
    state.acts = Array.isArray(acts) ? acts : [];
  }

  return {
    // state
    slides: state.slides,
    acts: state.acts,

    // actions
    setSlides,
    setActs,
  };
});
