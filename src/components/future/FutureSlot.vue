<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from '@/plugins/gsap'
import { motion } from '@/utils/motion'
import { useReducedMotion } from '@/composables/useReducedMotion'

const props = defineProps({
    // { id, category, note? }
    slot: {
        type: Object,
        required: true
    }
})

const root = ref(null)
const { reduced } = useReducedMotion()
let io = null

function playReveal() {
    if (!root.value) return
    // Rideau horizontal via clip-path
    gsap.fromTo(root.value,
        { clipPath: 'inset(0 100% 0 0)', opacity: 0.001 },
        { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: motion.dur.sm, ease: motion.ease.out }
    )
}

onMounted(() => {
    if (reduced.value) return
    if (!('IntersectionObserver' in window)) {
        playReveal()
        return
    }
    io = new IntersectionObserver((entries) => {
        const e = entries[0]
        if (e.isIntersecting) {
            playReveal()
            io?.disconnect()
        }
    }, { threshold: 0.25 })
    io.observe(root.value)
})

onBeforeUnmount(() => io?.disconnect())
</script>

<template>
    <article ref="root" class="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[.03]
           px-4 py-5 sm:px-5 sm:py-6 text-white
           transition will-change-transform
           hover:-translate-y-[2px]
           hover:border-[color:#caa45f]/70
           hover:shadow-[0_30px_90px_-40px_rgba(202,164,95,.35)]"
        :aria-label="`À venir — ${slot.category}${slot.note ? ' : ' + slot.note : ''}`" role="group">
        <!-- Grain animé (doux) -->
        <span aria-hidden="true" class="pointer-events-none absolute inset-0 opacity-[.08] mix-blend-soft-light
             before:content-[''] before:absolute before:inset-0
             before:bg-[radial-gradient(circle_at_10%_10%,#fff_0,transparent_40%),radial-gradient(circle_at_90%_20%,#fff_0,transparent_35%),radial-gradient(circle_at_30%_80%,#fff_0,transparent_45%)]
             before:animate-grain" />

        <header class="flex items-center gap-2">
            <span class="text-xs uppercase tracking-wider text-white/60">Catégorie</span>
            <div class="h-px w-6 bg-white/15"></div>
            <span class="text-sm font-medium text-white/80 truncate">{{ slot.category }}</span>

            <span class="ml-auto inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] uppercase tracking-wide
               border border-[color:#caa45f]/60 text-[color:#caa45f] bg-[color:#caa45f]/10" aria-label="Bientôt">
                <i class="fa-solid fa-hourglass-start" aria-hidden="true"></i>
                Soon
            </span>
        </header>

        <div class="mt-3">
            <h3 class="text-lg sm:text-xl font-semibold tracking-tight">
                À venir
            </h3>
            <p v-if="slot.note" class="mt-1 text-sm text-white/70">
                {{ slot.note }}
            </p>
            <p v-else class="mt-1 text-sm text-white/60">
                Opportunité en préparation. Revenez bientôt.
            </p>
        </div>

        <!-- Liseré or discret en bas -->
        <div class="mt-5 h-px w-16 bg-[color:#caa45f]/80"></div>
    </article>
</template>

<style scoped>
/* Animation grain (déplacement subtil du motif) */
@keyframes grain {
    0% {
        transform: translate3d(0, 0, 0)
    }

    50% {
        transform: translate3d(-3%, 2%, 0)
    }

    100% {
        transform: translate3d(0, 0, 0)
    }
}

.before\:animate-grain::before {
    animation: grain 6s linear infinite;
}

/* Perf hints */
article {
    will-change: clip-path, transform, opacity, box-shadow;
}
</style>
