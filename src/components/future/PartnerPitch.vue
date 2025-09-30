<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { gsap } from '@/plugins/gsap'
import { revealIn } from '@/utils/reveal'

const props = defineProps({
    title: { type: String, default: 'Collaborons et créons de la valeur' },
    bullets: {
        type: Array, default: () => ([
            'Visibilité premium et contenus sur-mesure',
            'Ciblage affûté & attribution claire',
            'Image de marque élevée par une direction artistique forte'
        ])
    },
    ctaLabel: { type: String, default: 'Nous contacter' }
})

const root = ref(null)
const cta = ref(null)

onMounted(() => {
    if (root.value) revealIn(root.value, { stagger: 0.08 })
})

function pressIn() { if (cta.value) gsap.to(cta.value, { scale: 0.98, duration: 0.12, ease: 'power2.out' }) }
function pressOut() { if (cta.value) gsap.to(cta.value, { scale: 1, duration: 0.12, ease: 'power2.out' }) }

onBeforeUnmount(() => gsap.killTweensOf(cta.value))

const top3 = computed(() => props.bullets.slice(0, 3))
</script>

<template>
    <section ref="root" class="py-12 sm:py-16 text-white">
        <div class="max-w-5xl mx-auto px-4 sm:px-6">
            <header class="mb-6 sm:mb-8">
                <h2 data-reveal class="text-2xl sm:text-3xl font-semibold tracking-tight">
                    {{ title }}
                </h2>
                <div data-reveal class="mt-2 h-px w-16 bg-[color:#caa45f]/80"></div>
            </header>

            <ul class="grid gap-4 sm:gap-6 sm:grid-cols-3">
                <li v-for="(b, i) in top3" :key="i" data-reveal class="rounded-2xl border border-white/10 bg-white/[.03] p-4 sm:p-5
                 shadow-[0_20px_60px_-40px_rgba(0,0,0,.8)]">
                    <div class="flex items-start gap-3">
                        <span class="mt-1 inline-flex h-2.5 w-2.5 rounded-full
                         bg-[color:#caa45f] shadow-[0_0_0_2px_rgba(202,164,95,.25)]" aria-hidden="true"></span>
                        <p class="text-sm sm:text-base text-white/85 leading-relaxed">{{ b }}</p>
                    </div>
                </li>
            </ul>

            <div class="mt-8 sm:mt-10">
                <RouterLink ref="cta" to="/contact" class="inline-flex items-center gap-2 px-5 py-3 rounded-full
                 border border-white/15 bg-white/[.08] text-white/90
                 hover:bg-white/10 hover:text-white
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#caa45f]
                 transition-[background-color,color,box-shadow,transform] duration-200
                 shadow-[0_12px_40px_-24px_rgba(202,164,95,.35)]"
                    aria-label="Aller au formulaire de contact pour un partenariat" @mousedown.left.prevent="pressIn"
                    @mouseup="pressOut" @mouseleave="pressOut" @touchstart.passive="pressIn"
                    @touchend.passive="pressOut">
                    {{ ctaLabel }}
                    <i class="fa-solid fa-arrow-right-long" aria-hidden="true"></i>
                </RouterLink>
            </div>
        </div>
    </section>
</template>

<style scoped>
section {
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(11, 11, 12, .25) 100%);
}

/* Perf hints */
[data-reveal],
a {
    will-change: transform, opacity, box-shadow;
}
</style>
