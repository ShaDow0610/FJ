<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePartners } from '@/stores/partners'
import { revealIn } from '@/utils/reveal'

const props = defineProps({
    /** Nombre d’éléments visibles avant “Voir tous” */
    pageSize: { type: Number, default: 20 },
    /** Titre optionnel au-dessus du mur */
    title: { type: String, default: '' }
})

const p = usePartners()

const showAll = ref(false)
const hasMore = computed(() => (p.list?.length || 0) > props.pageSize)

const visible = computed(() => {
    if (showAll.value) return p.list
    return (p.list || []).slice(0, props.pageSize)
})

const root = ref(null)

onMounted(() => {
    // Reveal en vague (les items portent data-reveal via le template)
    revealIn(root.value, { stagger: 0.05 })
})

function onShowAll() {
    showAll.value = true
}
</script>

<template>
    <section ref="root" class="py-12 sm:py-16 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6">
            <header v-if="title" class="mb-6 sm:mb-8">
                <h2 data-reveal class="text-2xl sm:text-3xl font-semibold tracking-tight">
                    {{ title }}
                </h2>
                <div data-reveal class="mt-2 h-px w-16 bg-[color:#caa45f]/80"></div>
            </header>

            <!-- Mur de blasons -->
            <div class="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 items-stretch">
                <a v-for="partner in visible" :key="partner.id" :href="partner.url" target="_blank" rel="noopener"
                    class="group relative overflow-hidden rounded-xl border border-white/10
                 bg-white/[.03] hover:bg-white/[.06] transition
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#caa45f]
                 grid place-items-center p-4 sm:p-6" data-reveal :aria-label="partner.name" :title="partner.name">
                    <!-- Logo -->
                    <img :src="partner.logo" :alt="partner.name" class="max-h-16 sm:max-h-20 w-auto object-contain
                   opacity-90 group-hover:opacity-100 transition duration-200
                   scale-100 group-hover:scale-[1.03]" loading="lazy" decoding="async" />
                    <!-- Légende discrète -->
                    <div
                        class="absolute inset-x-2 bottom-2 text-[10px] sm:text-xs text-white/60 truncate pointer-events-none">
                        {{ partner.name }}
                    </div>
                </a>
            </div>

            <!-- CTA “Voir tous” -->
            <div v-if="hasMore && !showAll" class="mt-8 flex justify-center">
                <!-- Slot personnalisable -->
                <slot name="more">
                    <button type="button" @click="onShowAll" class="px-5 py-3 rounded-full border border-white/15 bg-white/[.06]
                   text-white/90 hover:text-white hover:bg-white/10
                   transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#caa45f]">
                        Voir tous
                    </button>
                </slot>
            </div>
        </div>
    </section>
</template>

<style scoped>
section {
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(11, 11, 12, .25) 100%);
}
</style>
