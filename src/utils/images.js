// src/utils/images.js
// Helpers d’import & ratios anti-CLS (layout stable).

/**
 * getImage — pour Vite, l’URL statique suffit (gestion par l’importeur).
 * @param {string} url
 * @returns {string}
 */
export function getImage(url) {
  return url || "";
}

/**
 * ratioBox — style inline pour un wrapper à ratio fixe (anti-CLS).
 * Ex. pour 1200x800 => paddingTop: (800/1200*100)% = 66.666%
 * @param {number} w - largeur source
 * @param {number} h - hauteur source
 * @returns {{paddingTop: string}}
 */
export function ratioBox(w, h) {
  const W = Number(w);
  const H = Number(h);
  if (!W || !H) {
    // Fallback 16:9 si dimensions inconnues
    return { paddingTop: `${(9 / 16) * 100}%` };
  }
  return { paddingTop: `${(H / W) * 100}%` };
}

/* --- Exemple d’usage (ImageSmart.vue) ---
<template>
  <div class="relative w-full overflow-hidden rounded-xl" :style="ratioBox(w, h)">
    <img
      :src="getImage(src)"
      :alt="alt"
      class="absolute inset-0 w-full h-full object-cover"
      loading="lazy"
      decoding="async"
    />
  </div>
</template>

<script setup>
import { ratioBox, getImage } from '@/utils/images'
defineProps({ src:String, alt:{type:String,default:''}, w:Number, h:Number })
</script>
*/
