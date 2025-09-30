<script setup>
import { onMounted, ref, computed } from 'vue'
import { useGallery } from '@/stores/gallery'
import { setMeta } from '@/utils/meta'

// Composants
import GalleryGrid from '@/components/gallery/GalleryGrid.vue'
import LookOverlay from '@/components/gallery/LookOverlay.vue'

// Store
const g = useGallery()

// Overlay piloté ici (Option: laisser à GalleryGrid via slot)
const current = ref(null)
function openOverlay(item) { current.value = item }
function closeOverlay() { current.value = null }

// Seed minimal si le store est vide (P0)
onMounted(() => {
    if (!g.items.length) {
        g.setItems([
            { id: 'lk-01', title: 'Night Studio', tags: ['studio'], cover: 'https://www.bing.com/images/search?view=detailV2&ccid=oWWnx5Pl&id=9FD74DC27744B9DE6ECBC5D7ADA80C5DD1C7944B&thid=OIP.oWWnx5Pl52R8m-7Xue6zvQHaDj&mediaurl=https%3a%2f%2fmedia.hagerty.com%2fmedia%2fwp-content%2fuploads%2fuscamediasite%2fimages%2fstory-images%2f2018%2f05%2fmazdarx734thumb20180508134921&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.a165a7c793e5e7647c9beed7b9eeb3bd%3frik%3dS5TH0V0MqK3XxQ%26pid%3dImgRaw%26r%3d0&exph=1199&expw=2500&q=fd&FORM=IRPRST&ck=A623D2A619C3164DBEE884A9B71C9E01&selectedIndex=0&itb=0' },
            { id: 'lk-02', title: 'Street Amber', tags: ['street'], cover: '../assets/2024_08_31_23_54_IMG_1932.WEBP' },
            { id: 'lk-03', title: 'Casual Ivory', tags: ['casual'], cover: '../assets/2024_08_31_23_54_IMG_1934.WEBP' },
            { id: 'lk-04', title: 'Runway Rouge', tags: ['street'], cover: '../assets/2024_08_31_23_54_IMG_1936.WEBP' },
            { id: 'lk-05', title: 'Studio Gold', tags: ['studio'], cover: '../assets/2024_08_31_23_54_IMG_1938.WEBP' },
            { id: 'lk-06', title: 'Daylight', tags: ['casual'], cover: '../assets/2024_08_31_23_54_IMG_1940.WEBP' },
            // …complète jusqu’à 12–18 images
        ])
    }
    setMeta({
        title: 'Galerie / Lookbook',
        description: 'Vitrine tactile : filtres élégants, tilt 3D, morphing FLIP.'
    })
})
</script>

<template>
    <main id="main" class="relative isolate text-white">
        <section class="pt-10 sm:pt-14">
            <div class="max-w-7xl mx-auto px-4 sm:px-6">
                <header class="mb-6 sm:mb-8">
                    <h1 class="text-3xl sm:text-4xl font-semibold tracking-tight">Galerie — Lookbook</h1>
                    <p class="mt-2 text-white/70 text-sm sm:text-base">
                        Filtrez par ambiance et ouvrez un look pour le découvrir.
                    </p>
                </header>
            </div>

            <!-- Grille + filtres + underline animé (déjà géré dans GalleryGrid) -->
            <GalleryGrid>
                <!-- On gère l’overlay au niveau de la vue -->
                <template #overlay="{ item, close }">
                    <LookOverlay v-if="item" :item="item" @close="close" />
                </template>
            </GalleryGrid>
        </section>
    </main>
</template>

<style scoped>
/* Fond luxe très léger */
main::before {
    content: '';
    position: absolute;
    inset: -10%;
    background:
        radial-gradient(35% 35% at 15% 20%, rgba(202, 164, 95, .10), transparent 60%),
        radial-gradient(45% 45% at 85% 30%, rgba(255, 255, 255, .06), transparent 65%),
        linear-gradient(to bottom, rgba(0, 0, 0, .15), transparent 40%, rgba(0, 0, 0, .25));
    filter: saturate(110%);
    z-index: -1;
}
</style>
