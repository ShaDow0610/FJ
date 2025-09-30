<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap, ScrollTrigger } from '@/plugins/gsap'
import { motion } from '@/utils/motion'
import { useReducedMotion } from '@/composables/useReducedMotion'
import ImageSmart from '@/components/media/ImageSmart.vue'

const props = defineProps({
  title: { type: String, required: true },
  copy: { type: String, required: true },
  media: { type: String, required: true }, // 1200px recommandé
  reverse: { type: Boolean, default: false }, // inverse l’ordre texte/image en ≥ md
  w: { type: [Number, String], default: 1200 },
  h: { type: [Number, String], default: 800 }
})

const root = ref(null)
const textCol = ref(null)
const imgWrap = ref(null)
const { reduced } = useReducedMotion()

let stParallax = null
let stReveal = null

onMounted(() => {
  if (!root.value) return

  // Reveal du texte
  if (!reduced.value) {
    const tl = gsap.timeline({
      defaults: { duration: motion.dur.xs, ease: motion.ease.out },
      scrollTrigger: {
        trigger: root.value,
        start: 'top 80%',
        once: true
      }
    })
    tl.from(textCol.value?.querySelectorAll('[data-r]') || textCol.value, {
      y: 20,
      opacity: 0,
      stagger: 0.08
    })
    stReveal = tl.scrollTrigger
  }

  // Parallax image (désactivé si RMM)
  if (!reduced.value && imgWrap.value) {
    stParallax = ScrollTrigger.create({
      trigger: root.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: self => {
        // map progress (0→1) à yPercent [-12 → 12] pour un léger drift
        const y = (self.progress * 24) - 12
        gsap.to(imgWrap.value, { yPercent: y, overwrite: true, duration: 0.1 })
      }
    })
  }
})

onBeforeUnmount(() => {
  stParallax?.kill?.()
  stReveal?.kill?.()
  gsap.killTweensOf([textCol.value, imgWrap.value])
})
</script>

<template>
  <section class="py-14 sm:py-20 text-white">
    <div ref="root" class="max-w-7xl mx-auto px-4 sm:px-6 grid gap-8 md:gap-12 md:grid-cols-2 items-center"
      :class="reverse ? 'md:[&>*:first-child]:order-2' : ''">
      <!-- Colonne texte -->
      <div ref="textCol">
        <h2 data-r class="text-3xl sm:text-4xl font-semibold tracking-tight"
          style="text-shadow: 0 1px 0 rgba(0,0,0,.25)">
          {{ title }}
        </h2>
        <p data-r class="mt-4 text-base leading-relaxed text-white/80">
          {{ copy }}
        </p>
        <div data-r class="mt-4 h-px w-16 bg-[color:#caa45f]/80"></div>
      </div>

      <!-- Colonne image (parallax) -->
      <div class="relative">
        <div ref="imgWrap" class="will-change-transform">
          <ImageSmart :src="media" :alt="title" :w="Number(w)" :h="Number(h)"
            imgClass="rounded-2xl shadow-[0_20px_60px_-30px_rgba(0,0,0,.6)]" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
section {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(11, 11, 12, .35) 100%);
}

/* Accent or focus */
:focus-visible {
  outline: 2px solid #caa45f;
  outline-offset: 2px;
}
</style>
