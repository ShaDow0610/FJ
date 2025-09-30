<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { revealIn } from '@/utils/reveal'
import { formatPrice } from '@/utils/currency'

const props = defineProps({
    // { id, title, copy, priceFrom? }
    service: {
        type: Object,
        required: true
    }
})

const root = ref(null)

onMounted(() => {
    if (root.value) revealIn(root.value)
})
</script>

<template>
    <article ref="root" class="group relative overflow-hidden rounded-2xl border border-white/10
           bg-white/[.03] p-4 sm:p-5 text-white transition
           hover:border-[color:#caa45f]/70
           hover:shadow-[0_30px_90px_-40px_rgba(202,164,95,.35)]
           focus-within:ring-2 focus-within:ring-[#caa45f]" data-reveal>
        <header class="flex items-start gap-3">
            <!-- Icône optionnelle via slot -->
            <slot name="icon">
                <!-- Placeholder discret si besoin : -->
                <!-- <i class="fa-solid fa-wand-magic-sparkles text-white/60"></i> -->
            </slot>
            <h3 class="text-lg sm:text-xl font-semibold leading-snug">
                {{ service.title }}
            </h3>
        </header>

        <p class="mt-3 text-sm text-white/80">
            {{ service.copy }}
        </p>

        <div class="mt-3 text-sm text-white/70">
            <template v-if="service.priceFrom != null">
                À partir de
                <span class="text-white font-medium">
                    {{ formatPrice(service.priceFrom) }}
                </span>
            </template>
        </div>

        <div class="mt-5">
            <RouterLink to="/contact" class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
               border border-white/15 bg-white/[.08] text-white/90
               hover:bg-white/10 hover:text-white
               focus:outline-none focus-visible:ring-2 focus-visible:ring-[#caa45f]
               transition" aria-label="Contacter pour cette prestation">
                Contacter
                <i class="fa-solid fa-arrow-right-long" aria-hidden="true"></i>
            </RouterLink>
        </div>
    </article>
</template>

<style scoped>
article {
    will-change: transform, opacity, box-shadow;
}
</style>
