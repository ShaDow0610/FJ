<script setup>
import { onMounted, ref } from 'vue'
import { setMeta } from '@/utils/meta'
import FutureSlot from '@/components/future/FutureSlot.vue'
import PartnerPitch from '@/components/future/PartnerPitch.vue'

/** Seed P0 (remplace par un fetch si tu as une API) */
const future = ref([
    { id: 'f-beauty', category: 'Cosmétique', note: 'Skincare / parfum' },
    { id: 'f-food', category: 'Restauration', note: 'Fine & street food' },
    { id: 'f-fashion', category: 'Mode', note: 'Capsule / co-brand' },
    { id: 'f-fitness', category: 'Fitness', note: 'Gym & sportwear' },
    { id: 'f-living', category: 'Logement & travel', note: 'Séjours / residencies' },
    { id: 'f-drinks', category: 'Boissons', note: 'Café / soft / premium' },
])

onMounted(() => {
    setMeta({
        title: 'Futurs Partenariats — Opportunités',
        description: 'Le salon des possibles : cartes “Soon”, argumentaire clair, CTA contact.'
    })
})
</script>

<template>
    <main id="main" class="relative isolate text-white">
        <!-- En-tête -->
        <section class="pt-10 sm:pt-14">
            <div class="max-w-7xl mx-auto px-4 sm:px-6">
                <header class="mb-6 sm:mb-8">
                    <h1 class="text-3xl sm:text-4xl font-semibold tracking-tight">
                        Futurs Partenariats
                    </h1>
                    <p class="mt-2 text-white/70 text-sm sm:text-base">
                        Le salon des possibles — proposez votre collaboration, découvrez nos axes d’activation.
                    </p>
                </header>

                <!-- Pitch (argumentaire + CTA /contact) -->
                <PartnerPitch class="mb-10 sm:mb-12" title="Votre marque, notre scène" :bullets="[
                    'Direction artistique & contenus premium',
                    'Formats performants (UGC, édito, live)',
                    'Amplification multi-plateformes & reporting'
                ]" ctaLabel="Proposer un partenariat" />
            </div>

            <!-- Grille de slots “Soon” -->
            <div class="max-w-7xl mx-auto px-4 sm:px-6">
                <h2 class="sr-only">Opportunités à venir</h2>
                <div class="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    <FutureSlot v-for="s in future" :key="s.id" :slot="s" />
                </div>

                <!-- CTA secondaire -->
                <div class="mt-10 sm:mt-12 flex justify-center">
                    <RouterLink to="/contact" class="inline-flex items-center gap-2 px-5 py-3 rounded-full
                   border border-white/15 bg-white/[.08] text-white/90
                   hover:bg-white/10 hover:text-white
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-[#caa45f]
                   transition-[background-color,color,box-shadow] duration-200"
                        aria-label="Aller au formulaire de contact">
                        Discuter d’une opportunité
                        <i class="fa-solid fa-arrow-right-long" aria-hidden="true"></i>
                    </RouterLink>
                </div>
            </div>
        </section>
    </main>
</template>

<style scoped>
/* Fond ciné léger (cohérent avec la palette luxe) */
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
