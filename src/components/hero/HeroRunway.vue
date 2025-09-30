<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { gsap } from '@/plugins/gsap'
import { motion } from '@/utils/motion'
import { useReducedMotion } from '@/composables/useReducedMotion'

// Media helpers
import ImageSmart from '@/components/media/ImageSmart.vue'
import VideoAuto from '@/components/media/VideoAuto.vue'

// Swiper
import { Swiper, SwiperSlide } from 'swiper/vue'
import { EffectFade, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'

/**
 * Props
 * slides: [{ id, type:'image'|'video', src, caption }]
 * title:   Titre principal (option)
 * meta:    Petites lignes méta (option) → animées en stagger via [data-i]
 */
const props = defineProps({
    slides: {
        type: Array,
        required: true,
        default: () => /** @type {Array<{id:string,type:'image'|'video',src:string,caption?:string}>} */([]),
    },
    title: { type: String, default: 'Runway' },
    meta: { type: Array, default: () => ([]) }, // ex: ['Mode', 'Mouvement', 'Signature']
})

// RMM
const { reduced } = useReducedMotion()

// Refs
const root = ref(null)
const overlay = ref(null) // pour l’iris
const titleEl = ref(null)
const metaEl = ref(null)

// Swiper modules
const modules = [EffectFade, Autoplay]
const swiperOpts = computed(() => ({
    modules,
    effect: 'fade',
    fadeEffect: { crossFade: true },
    speed: 700,
    loop: true,
    autoplay: reduced.value ? false : { delay: 3500, disableOnInteraction: false },
    allowTouchMove: true,
}))

// Iris helpers
function maxRadiusFrom(x, y) {
    const w = window.innerWidth, h = window.innerHeight
    return Math.max(
        Math.hypot(x - 0, y - 0),
        Math.hypot(x - w, y - 0),
        Math.hypot(x - 0, y - h),
        Math.hypot(x - w, y - h)
    )
}

async function playIrisIn() {
    if (!overlay.value) return
    if (reduced.value) {
        // sans animation : contenu visible direct
        gsap.set(overlay.value, { autoAlpha: 0 })
        return
    }
    const x = window.innerWidth / 2
    const y = window.innerHeight / 2
    const r = maxRadiusFrom(x, y)

    gsap.set(overlay.value, { autoAlpha: 1 })
    gsap.set(overlay.value, { clipPath: `circle(${r}px at ${x}px ${y}px)` })

    await nextTick()
    return new Promise((resolve) => {
        gsap.to(overlay.value, {
            clipPath: `circle(0px at ${x}px ${y}px)`,
            duration: motion.dur.sm,
            ease: motion.ease.inOut,
            onComplete: () => {
                gsap.set(overlay.value, { autoAlpha: 0 })
                resolve()
            }
        })
    })
}

function playIntroTimeline() {
    if (!titleEl.value || !metaEl.value || reduced.value) return
    const items = metaEl.value.querySelectorAll('[data-i]')
    const tl = gsap.timeline()
    tl.from(titleEl.value, {
        y: 30, opacity: 0, duration: 0.6, ease: 'power2.out'
    })
    if (items.length) {
        tl.from(items, {
            y: 16, opacity: 0, duration: 0.45, ease: 'power2.out', stagger: 0.08
        }, '-=0.2')
    }
}

onMounted(async () => {
    // État initial : masque iris plein (sera animé vers 0)
    if (overlay.value) {
        const x = window.innerWidth / 2
        const y = window.innerHeight / 2
        const r = maxRadiusFrom(x, y)
        gsap.set(overlay.value, { clipPath: `circle(${r}px at ${x}px ${y}px)`, backgroundColor: 'rgb(11 11 12 / 1)', autoAlpha: 1 })
    }
    await playIrisIn()
    playIntroTimeline()
})
</script>

<template>
    <section ref="root" class="relative isolate">
        <!-- Slider (media plein écran) -->
        <Swiper v-bind="swiperOpts" class="h-[90vh] min-h-[520px]">
            <SwiperSlide v-for="s in slides" :key="s.id">
                <div class="absolute inset-0">
                    <!-- Image -->
                    <ImageSmart v-if="s.type === 'image'" :src="s.src" :alt="s.caption || 'Slide'" :w="1600" :h="900"
                        imgClass="brightness-95" />
                    <!-- Vidéo -->
                    <VideoAuto v-else :src="s.src" type="video/webm" :poster="undefined" preload="metadata"
                        videoClass="object-cover h-full w-full">
                        <!-- Fallback mp4 (optionnel) : 
            <source :src="s.src.replace('.webm','.mp4')" type="video/mp4" />
            -->
                    </VideoAuto>
                </div>

                <!-- Overlay titre + meta -->
                <div class="relative z-10 h-full grid place-items-center">
                    <div class="text-center px-6">
                        <h1 ref="titleEl"
                            class="title text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white drop-shadow">
                            {{ title }}
                        </h1>

                        <ul ref="metaEl" class="meta mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-white/80">
                            <!-- Si meta vide, on peut afficher la caption de la slide courante -->
                            <li v-if="!meta?.length && s.caption" data-i class="px-2 py-1 bg-black/30 rounded">
                                {{ s.caption }}
                            </li>
                            <li v-else v-for="(m, i) in meta" :key="i" data-i class="px-2 py-1 bg-black/30 rounded">
                                {{ m }}
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Voile dramatique léger pour lisibilité -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/40"></div>
            </SwiperSlide>
        </Swiper>

        <!-- Iris overlay (mask circulaire) -->
        <div ref="overlay" class="pointer-events-none absolute inset-0 z-20" />
    </section>
</template>

<style scoped>
/* Accélère la perf des animations & du slider */
section,
.title,
.meta,
.meta [data-i],
.swiper,
.swiper-slide,
[ref="overlay"] {
    will-change: transform, opacity, clip-path;
}
</style>
