import { createRouter, createWebHistory } from "vue-router";

const HomeView = () => import("../views/HomeView.vue");
const GalleryView = () => import("../views/GalleryView.vue");
const PartnersView = () => import("../views/PartnersView.vue");
const ShopView = () => import("../views/ShopView.vue");
const FuturePartnersView = () => import("../views/FuturePartnersView.vue");
const MasterclassView = () => import("../views/MasterclassView.vue");
const AboutView = () => import("../views/AboutView.vue");
const ContactView = () => import("../views/ContactView.vue");

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/gallery", name: "gallery", component: GalleryView },
    { path: "/partners", name: "partners", component: PartnersView },
    { path: "/shop", name: "shop", component: ShopView },
    { path: "/future-partners", name: "future", component: FuturePartnersView },
    { path: "/masterclass", name: "masterclass", component: MasterclassView },
    { path: "/about", name: "about", component: AboutView },
    { path: "/contact", name: "contact", component: ContactView },
  ],
  scrollBehavior() {
    return { top: 0 };
  }, // Lenis gère le lissage
});

export default router;
