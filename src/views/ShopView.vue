<script setup>
import { ref, onMounted } from 'vue'
import { setMeta } from '@/utils/meta'
import { useProducts } from '@/stores/products'
import { useCart } from '@/stores/cart'
import OutfitCard from '@/components/shop/OutfitCard.vue'
import PieceListModal from '@/components/shop/PieceListModal.vue'
import ServiceCard from '@/components/shop/ServiceCard.vue'
import { formatPrice } from '@/utils/currency'

const products = useProducts()
const cart = useCart()

// Sélection courante (ouvre la modal "pièces")
const selectedOutfit = ref(null)

function addBundle(outfit) {
    cart.add({ id: outfit.id, title: outfit.title, price: outfit.price }, 1)
}

function choosePieces(outfit) {
    selectedOutfit.value = outfit
}

onMounted(() => {
    setMeta({
        title: 'Boutique — Outfits & Services',
        description: 'Achetez l’ensemble ou chaque pièce. Services premium d’influence : shooting, UGC, collaborations.'
    })

    // Seed P0 si le store est vide (remplace par ton fetch ofetch)
    if (!products.outfits.length) {
        products.setOutfits([
            {
                id: 'o-amber',
                title: 'Amber Street Set',
                cover: '/assets/shop/amber.avif',
                price: 120000,
                pieces: [
                    { id: 'p-amb-tee', title: 'T-shirt Amber', price: 25000 },
                    { id: 'p-amb-pants', title: 'Pantalon Street', price: 45000 },
                    { id: 'p-amb-shoes', title: 'Sneakers Ivory', price: 50000 },
                ]
            },
            {
                id: 'o-ivory',
                title: 'Ivory Studio Set',
                cover: '/assets/shop/ivory.avif',
                price: 150000,
                pieces: [
                    { id: 'p-ivo-top', title: 'Top Studio', price: 40000 },
                    { id: 'p-ivo-skirt', title: 'Jupe Plissée', price: 55000 },
                    { id: 'p-ivo-heel', title: 'Heels Or', price: 55000 },
                ]
            },
            // …ajoute 3–6 outfits pour une grille riche
        ])
    }

    if (!products.services.length) {
        products.setServices([
            { id: 'svc-shoot', title: 'Shooting éditorial', copy: 'Direction artistique + set styling.', priceFrom: 120000 },
            { id: 'svc-ugc', title: 'UGC Fashion', copy: 'Contenus courts (vertical), pack 3/5/10.', priceFrom: 80000 },
            { id: 'svc-collab', title: 'Collaboration marque', copy: 'Activation multi-plateformes & reporting.' }
        ])
    }
})
</script>

<template>
    <main id="main" class="relative isolate text-white">
        <section class="pt-10 sm:pt-14">
            <div class="max-w-7xl mx-auto px-4 sm:px-6">
                <header class="mb-6 sm:mb-8">
                    <h1 class="text-3xl sm:text-4xl font-semibold tracking-tight">Boutique</h1>
                    <p class="mt-2 text-white/70 text-sm sm:text-base">
                        Atelier-boutique : achetez l’ensemble ou composez votre look pièce par pièce.
                    </p>
                </header>

                <!-- Outfits -->
                <h2 class="sr-only">Outfits</h2>
                <div class="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    <OutfitCard v-for="o in products.outfits" :key="o.id" :outfit="o" @addBundle="addBundle"
                        @choosePieces="choosePieces" />
                </div>

                <!-- Panier mini-récap (optionnel) -->
                <div v-if="cart.count > 0" class="mt-6 rounded-2xl border border-white/10 bg-white/[.04] p-4">
                    <div class="flex items-center gap-3 text-sm">
                        <span class="text-white/80">
                            Panier : <strong class="text-white">{{ cart.count }}</strong> article<span
                                v-if="cart.count > 1">s</span>
                        </span>
                        <span class="ml-auto font-medium">
                            Total : {{ formatPrice(cart.total) }}
                        </span>
                    </div>
                </div>

                <!-- Services -->
                <div class="mt-10 sm:mt-14">
                    <h2 class="text-2xl sm:text-3xl font-semibold tracking-tight">Services d’influence</h2>
                    <div class="mt-4 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        <ServiceCard v-for="s in products.services" :key="s.id" :service="s">
                            <template #icon>
                                <i class="fa-solid fa-wand-magic-sparkles text-white/70"></i>
                            </template>
                        </ServiceCard>
                    </div>
                </div>
            </div>
        </section>

        <!-- Modal “Choisir les pièces” -->
        <PieceListModal v-if="selectedOutfit" :outfit="selectedOutfit"
            :sourceSelector="`[data-card-id='${selectedOutfit.id}']`" @close="selectedOutfit = null" @added="({ count, total }) => {
                // ici tu peux toaster, tracker, etc.
                selectedOutfit = null
            }" />
    </main>
</template>

<style scoped>
/* Fond luxe doux */
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
