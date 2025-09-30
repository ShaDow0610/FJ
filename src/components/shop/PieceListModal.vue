<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { gsap, Flip } from '@/plugins/gsap'
import { motion } from '@/utils/motion'
import { formatPrice } from '@/utils/currency'
import { useCart } from '@/stores/cart'

const props = defineProps({
    // outfit:{ id,title,cover,price,pieces:[{id,title,price}] }
    outfit: { type: Object, required: true },

    // Option : sélecteur CSS de la carte source pour un FLIP d'ouverture
    // ex: `[data-card-id="outfit-01"]`
    sourceSelector: { type: String, default: '' }
})

const emit = defineEmits(['close', 'added'])

const cart = useCart()

// ---- State local (sélection/quantités) ----
const lines = ref(
    (props.outfit?.pieces || []).map(p => ({
        id: p.id,
        title: p.title,
        price: Number(p.price) || 0,
        checked: true,
        qty: 1,
    }))
)

// Totaux dynamiques
const totalQty = computed(() =>
    lines.value.reduce((n, l) => n + (l.checked ? l.qty : 0), 0)
)
const totalPrice = computed(() =>
    lines.value.reduce((s, l) => s + (l.checked ? l.qty * l.price : 0), 0)
)

// Helpers qty
function inc(i) { lines.value[i].qty = Math.min(99, lines.value[i].qty + 1) }
function dec(i) { lines.value[i].qty = Math.max(1, lines.value[i].qty - 1) }

// Select/Deselect all
function toggleAll(val) {
    lines.value.forEach(l => (l.checked = val))
}
const allChecked = computed({
    get: () => lines.value.every(l => l.checked),
    set: v => toggleAll(v)
})

// ---- Modal/Anims ----
const backdrop = ref(null)
const panel = ref(null)
const headerImg = ref(null) // élément de tête pour FLIP (invisible par défaut)

let keyHandler = null

function onKey(e) {
    if (e.key === 'Escape') onClose()
}

async function animateIn() {
    // Overlay fade
    gsap.from(backdrop.value, { opacity: 0, duration: 0.18, ease: motion.ease.out })

    // Panel scale-in
    gsap.from(panel.value, { opacity: 0, scale: 0.96, duration: 0.18, ease: motion.ease.out })

    // FLIP (optionnel) depuis la carte source → image header
    if (props.sourceSelector && headerImg.value) {
        const src = document.querySelector(props.sourceSelector + ' img')
        if (src) {
            // Positionne l’image en absolu pendant l’anim
            const img = headerImg.value
            const r = img.getBoundingClientRect()
            gsap.set(img, { position: 'absolute', left: 0, top: 0, width: `${r.width}px`, height: `${r.height}px` })
            Flip.fit(img, src, { absolute: true })
            await nextTick()
            gsap.to(img, {
                x: 0, y: 0, width: '100%', height: '100%',
                duration: motion.dur.xs,
                ease: motion.ease.inOut,
                onComplete: () => gsap.set(img, { clearProps: 'all' })
            })
        }
    }
}

async function animateOut() {
    // Simple fade-out ; le parent peut retirer le composant ensuite
    await new Promise(res =>
        gsap.to(backdrop.value, { opacity: 0, duration: 0.14, ease: motion.ease.in, onComplete: res })
    )
}

function onClose() {
    animateOut().finally(() => emit('close'))
}

function onAdd() {
    // Ajoute chaque ligne cochée au panier
    lines.value.forEach(l => {
        if (l.checked && l.qty > 0) {
            cart.add({ id: l.id, title: l.title, price: l.price }, l.qty)
        }
    })
    emit('added', { count: totalQty.value, total: totalPrice.value, outfitId: props.outfit.id })
    onClose()
}

onMounted(() => {
    keyHandler = (e) => onKey(e)
    document.addEventListener('keydown', keyHandler)
    animateIn()
})

onBeforeUnmount(() => {
    document.removeEventListener('keydown', keyHandler)
    gsap.killTweensOf([backdrop.value, panel.value, headerImg.value])
})
</script>

<template>
    <!-- Overlay fixe -->
    <div ref="backdrop" class="fixed inset-0 z-[10010] bg-black/60 backdrop-blur-sm grid place-items-center p-4 sm:p-6"
        role="dialog" aria-modal="true" :aria-label="`Choisir les pièces pour ${outfit?.title ?? 'look'}`"
        @click.self="onClose">
        <!-- Panneau -->
        <div ref="panel"
            class="w-full max-w-3xl rounded-2xl overflow-hidden border border-white/10 bg-black/70 text-white">
            <!-- Head : visuel + titre -->
            <div class="relative">
                <!-- Image de tête (optionnelle) pour FLIP ; par défaut simple bande -->
                <div class="relative h-24 sm:h-28 md:h-32 bg-gradient-to-r from-white/10 to-white/5">
                    <img ref="headerImg" :src="outfit.cover" :alt="outfit.title" class="hidden" />
                </div>
                <div class="absolute inset-0 flex items-end p-4 sm:p-5">
                    <h3 class="text-lg sm:text-xl font-semibold drop-shadow">
                        {{ outfit.title }}
                    </h3>
                </div>
                <button type="button" class="absolute top-3 right-3 px-3 py-1.5 text-sm rounded
                 border border-white/15 text-white/90 hover:text-white hover:bg-white/10
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#caa45f]" @click="onClose">
                    Fermer
                </button>
            </div>

            <!-- Corps : liste des pièces -->
            <div class="p-4 sm:p-5">
                <!-- Sélecteur global -->
                <label class="inline-flex items-center gap-2 text-sm text-white/80 select-none">
                    <input type="checkbox" v-model="allChecked" class="accent-[#caa45f]" />
                    <span>Tout sélectionner</span>
                </label>

                <ul class="mt-3 divide-y divide-white/10 rounded-xl border border-white/10 overflow-hidden">
                    <li v-for="(p, i) in lines" :key="p.id" class="flex items-center gap-3 p-3 sm:p-4 bg-white/[.02]">
                        <input type="checkbox" v-model="p.checked" class="accent-[#caa45f]"
                            :aria-label="`Sélectionner ${p.title}`" />

                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2">
                                <h4 class="text-sm sm:text-base font-medium truncate">{{ p.title }}</h4>
                                <span class="text-xs text-white/60">{{ formatPrice(p.price) }}</span>
                            </div>
                        </div>

                        <!-- Qty -->
                        <div class="flex items-center gap-2">
                            <button type="button"
                                class="w-8 h-8 grid place-items-center rounded-full border border-white/15 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#caa45f]"
                                @click="dec(i)" :disabled="!p.checked || p.qty <= 1"
                                :class="{ 'opacity-50 cursor-not-allowed': !p.checked || p.qty <= 1 }"
                                aria-label="Diminuer">−</button>
                            <input type="number" min="1" max="99" v-model.number="p.qty" :disabled="!p.checked"
                                class="w-12 text-center bg-black/40 border border-white/10 rounded py-1"
                                aria-label="Quantité" />
                            <button type="button"
                                class="w-8 h-8 grid place-items-center rounded-full border border-white/15 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#caa45f]"
                                @click="inc(i)" :disabled="!p.checked || p.qty >= 99"
                                :class="{ 'opacity-50 cursor-not-allowed': !p.checked || p.qty >= 99 }"
                                aria-label="Augmenter">+</button>
                        </div>
                    </li>
                </ul>

                <!-- Footer : total + CTA -->
                <div class="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div class="text-sm sm:text-base text-white/80">
                        <span class="text-white">{{ totalQty }}</span>
                        pièce<span v-if="totalQty > 1">s</span> sélectionnée<span v-if="totalQty > 1">s</span> —
                        <span class="font-semibold text-white">{{ formatPrice(totalPrice) }}</span>
                    </div>

                    <div class="sm:ml-auto flex gap-2">
                        <button type="button"
                            class="px-4 py-2 rounded-full text-sm border border-white/15 text-white/80 hover:text-white hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#caa45f]"
                            @click="onClose">
                            Annuler
                        </button>
                        <button type="button" class="px-4 py-2 rounded-full text-sm font-medium
                     border border-white/15 bg-white/[.08] text-white/90
                     hover:bg-white/10 hover:text-white
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-[#caa45f]" :disabled="totalQty === 0"
                            :class="{ 'opacity-50 cursor-not-allowed': totalQty === 0 }" @click="onAdd">
                            Ajouter
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Légère mise au point perf */
.fixed,
.backdrop-blur-sm,
.rounded-2xl {
    will-change: opacity, transform;
}
</style>
