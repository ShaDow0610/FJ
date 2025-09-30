<script setup>
import { onMounted } from 'vue'
import { usePartners } from '@/stores/partners'
import { setMeta } from '@/utils/meta'
import PartnersWall from '@/components/partners/PartnersWall.vue'

const partners = usePartners()

onMounted(() => {
    // SEO de base
    setMeta({
        title: 'Partenaires — Mur de blasons',
        description: 'Logos sur velours noir, glow doré au survol. Accès direct aux pages partenaires.'
    })

    // Seed léger si la liste n’est pas encore chargée (à remplacer par ton fetch)
    if (!partners.list.length) {
        partners.set([
            { id: 'p01', name: 'Amber Studio', category: 'Studio', logo: '/assets/partners/amber.svg', url: 'https://example.com/amber' },
            { id: 'p02', name: 'Ivory House', category: 'Mode', logo: '/assets/partners/ivory.svg', url: 'https://example.com/ivory' },
            { id: 'p03', name: 'Rouge Street', category: 'Street', logo: '/assets/partners/rouge.svg', url: 'https://example.com/rouge' },
            { id: 'p04', name: 'Gold Atelier', category: 'Luxe', logo: '/assets/partners/gold.svg', url: 'https://example.com/gold' },
            { id: 'p05', name: 'Velvet Café', category: 'Food', logo: '/assets/partners/velvet.svg', url: 'https://example.com/velvet' },
            // …complète librement (SVG si possible, sinon PNG ≤200KB)
        ])
    }
})
</script>

<template>
    <main id="main" class="relative isolate text-white">
        <section class="pt-10 sm:pt-14">
            <div class="max-w-7xl mx-auto px-4 sm:px-6">
                <header class="mb-6 sm:mb-8">
                    <h1 class="text-3xl sm:text-4xl font-semibold tracking-tight">Partenaires</h1>
                    <p class="mt-2 text-white/70 text-sm sm:text-base">
                        Mur de blasons — logos sur velours noir, glow doré au survol. Chaque carte ouvre la page du
                        partenaire.
                    </p>
                </header>
            </div>

            <!-- Grille responsive 2→5 cols + reveal en vague (stagger .05) -->
            <PartnersWall title="Ils nous font confiance">
                <!-- CTA personnalisé (facultatif) -->
                <template #more>
                    <RouterLink to="/partners/all" class="px-5 py-3 rounded-full border border-white/15 bg-white/[.06]
                   text-white/90 hover:bg-white/10 hover:text-white
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-[#caa45f]">
                        Tout afficher
                    </RouterLink>
                </template>
            </PartnersWall>
        </section>
    </main>
</template>

<style scoped>
/* Fond velours noir + lueurs très discrètes */
main::before {
    content: '';
    position: absolute;
    inset: -10%;
    background:
        radial-gradient(40% 40% at 20% 20%, rgba(202, 164, 95, .08), transparent 60%),
        radial-gradient(35% 35% at 80% 30%, rgba(255, 255, 255, .05), transparent 65%),
        linear-gradient(to bottom, rgba(0, 0, 0, .25), transparent 40%, rgba(0, 0, 0, .35));
    filter: saturate(110%);
    z-index: -1;
}
</style>
