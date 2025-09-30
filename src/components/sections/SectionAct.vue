<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { gsap, ScrollTrigger } from '@/plugins/gsap'
import { motion } from '@/utils/motion'
import { useReducedMotion } from '@/composables/useReducedMotion'
import ImageSmart from '@/components/media/ImageSmart.vue'

const props = defineProps({
    title: { type: String, required: true },
    copy: { type: String, required: true },
    /** Chemin image optionnel (1200px recommandé). Le slot <template #media> a priorité. */
    media: { type: String, default: '' },
    /** Inverse le layout (image à gauche en ≥ md) */
    reverse: { type: Boolean, default: false },
    /** Dimensions source pour ratio anti-CLS si media fourni */
    w: { type: [Number, String], default: 1200 },
    h: { type: [Number, String], default: 800 }
})

const root = ref(null)
const { reduced } = useReducedMotion()
let trigger = null

onMounted(() => {
    if (reduced.value || !root.value) return

    const targets = root.value.querySelectorAll('[data-r]')
    const tl = gsap.timeline({
        defaults: { duration: motion.dur.xs, ease: motion.ease.out },
        scrollTrigger: {
            trigger: root.value,
            start: 'top 75%',
            once: true
        }
    })

    tl.from(targets, { y: 20, opacity: 0, stagger: 0.08 })
    trigger = tl.scrollTrigger
})

onBeforeUnmount(() => {
    trigger?.kill?.()
})
</script>

<template>
    <section ref="root" class="py-14 sm:py-20 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 grid gap-8 md:gap-12 md:grid-cols-2 items-center"
            :class="reverse ? 'md:[&>*:first-child]:order-2' : ''">
            <!-- Bloc texte -->
            <div>
                <h2 data-r class="text-3xl sm:text-4xl font-semibold tracking-tight"
                    style="text-shadow: 0 1px 0 rgba(0,0,0,.25)">
                    {{ title }}
                </h2>

                <div class="mt-4 space-y-4">
                    <p data-r class="text-base leading-relaxed text-white/80">
                        {{ copy }}
                    </p>

                    <!-- Liseré or (accent) -->
                    <div data-r class="h-px w-16 bg-[color:#caa45f]/80"></div>
                </div>
            </div>

            <!-- Bloc média -->
            <div data-r class="relative">
                <!-- Slot média prioritaire -->
                <slot name="media" />
                <!-- Sinon, image via prop -->
                <ImageSmart v-if="!$slots.media && media" :src="media" :alt="title" :w="Number(w)" :h="Number(h)"
                    imgClass="rounded-2xl shadow-[0_20px_60px_-30px_rgba(0,0,0,.6)]" />
                <!-- Si ni slot ni media : placeholder discret -->
                <div v-else-if="!$slots.media && !media"
                    class="aspect-[3/2] rounded-2xl bg-white/[.06] border border-white/10 grid place-items-center text-white/40">
                    media
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
section {
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(11, 11, 12, .35) 100%);
}

/* Accent or sur focus */
:focus-visible {
    outline: 2px solid #caa45f;
    outline-offset: 2px;
}
</style>
