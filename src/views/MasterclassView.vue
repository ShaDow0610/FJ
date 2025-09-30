<script setup>
import { onMounted, ref } from 'vue'
import { gsap } from '@/plugins/gsap'
import { setMeta } from '@/utils/meta'
import { useReducedMotion } from '@/composables/useReducedMotion'
import Countdown from '@/components/masterclass/Countdown.vue'
import WaitlistForm from '@/components/masterclass/WaitlistForm.vue'
import ImageSmart from '@/components/media/ImageSmart.vue'

/** Données : date de lancement (ISO). Remplace par ta vraie date. */
const launchAt = '2025-12-01T18:00:00Z'

const overlay = ref(null)
const iris = ref(null)
const { reduced } = useReducedMotion()

onMounted(() => {
    setMeta({
        title: 'Masterclass — Soon',
        description: 'Teaser clair-obscur, compte à rebours élégant, waitlist e-mail.'
    })

    // Iris-in initial (désactivé si RMM)
    if (reduced.value) return
    const x = window.innerWidth / 2
    const y = window.innerHeight / 2
    gsap.set(overlay.value, { autoAlpha: 1 })
    gsap.set(iris.value, { clipPath: `circle(120vmax at ${x}px ${y}px)` })
    gsap.to(iris.value, {
        clipPath: `circle(0px at ${x}px ${y}px)`,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => gsap.set(overlay.value, { autoAlpha: 0 })
    })
})
</script>

<template>
    <main id="main" class="relative isolate text-white">
        <!-- Iris reveal -->
        <div ref="overlay" class="pointer-events-none fixed inset-0 z-[999]">
            <div ref="iris" class="absolute inset-0 bg-black" />
        </div>

        <!-- Teaser Hero -->
        <section class="relative min-h-[65vh] sm:min-h-[70vh] grid">
            <!-- Poster plein écran (P1) -->
            <div class="absolute inset-0 -z-10">
                <ImageSmart src="/assets/masterclass/poster.avif" alt="Teaser Masterclass" :w="1600" :h="900"
                    imgClass="object-cover" class="h-full w-full" />
                <!-- Voile sombre -->
                <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70"></div>
            </div>

            <!-- Texte + Soon -->
            <div class="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 my-auto">
                <h1 class="text-3xl sm:text-5xl font-semibold tracking-tight">
                    Masterclass <span class="text-white/60">—</span>
                    <span class="relative">
                        <span class="text-[color:#caa45f] drop-shadow-[0_0_12px_rgba(202,164,95,.35)]">Soon</span>
                        <span class="absolute -inset-1 rounded-md ring-2 ring-[color:#caa45f]/30 -z-10"></span>
                    </span>
                </h1>

                <p class="mt-3 max-w-xl text-white/80">
                    Un rendez-vous clair-obscur : direction artistique, scène, méthode. Rejoignez la première rangée.
                </p>

                <!-- Compte à rebours -->
                <div class="mt-6">
                    <Countdown :launchAt="launchAt" />
                </div>
            </div>
        </section>

        <!-- Waitlist -->
        <section class="py-10 sm:py-14">
            <div class="max-w-7xl mx-auto px-4 sm:px-6">
                <div class="grid gap-6 sm:grid-cols-2 items-start">
                    <div>
                        <h2 class="text-2xl sm:text-3xl font-semibold tracking-tight">Première rangée</h2>
                        <p class="mt-2 text-white/70">
                            Laissez votre e-mail — on vous prévient dès l’ouverture. Pas de spam, seulement l’essentiel.
                        </p>
                    </div>
                    <div class="sm:justify-self-end w-full">
                        <WaitlistForm @submit="(email) => { /* P2: subscribe(email) */ }" />
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>

<style scoped>
/* Fond ciné léger global */
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
