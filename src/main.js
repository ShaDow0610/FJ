// src/main.js
// Bootstrap de l’app : Vue, Pinia, Router, i18n, styles, plugins.
// + Boucle RAF pour Lenis (scroll fluide).

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import i18n from "./i18n";

// Styles globaux (Tailwind v4, variables, etc.)
import "./assets/tailwind.css";

// Plugins (imports passifs, SSR-safe côté build)
import "@/plugins/gsap"; // enregistre ScrollTrigger, Flip
import lenis from "@/plugins/lenis"; // instance Lenis (peut être null côté SSR)

// (Optionnel) FontAwesome Free via CSS (si utilisé)
import "@fortawesome/fontawesome-free/css/all.min.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);

app.mount("#app");

// ---- Boucle RAF Lenis ----
// Démarre uniquement si l’instance existe (navigateur) :
function raf(time) {
  // En cas de RMM, lenis peut rester actif mais lissé — à toi d’ajuster si besoin
  lenis?.raf(time);
  requestAnimationFrame(raf);
}
if (typeof window !== "undefined") {
  requestAnimationFrame(raf);
}
