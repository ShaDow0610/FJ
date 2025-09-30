<script setup>
import { ref, onMounted } from 'vue'
import ImageSmart from '@/components/media/ImageSmart.vue'
import { formatPrice } from '@/utils/currency'
import { revealIn } from '@/utils/reveal'

const props = defineProps({
  outfit: {
    type: Object,
    required: true, // { id,title,cover,price,pieces:[{id,title,price}] }
  }
})

const emit = defineEmits(['addBundle', 'choosePieces'])

const root = ref(null)

function onAddBundle() {
  emit('addBundle', props.outfit)
}
function onChoosePieces() {
  emit('choosePieces', props.outfit)
}

onMounted(() => {
  // Reveal doux de la carte (y:20, opacity 0 → 1)
  if (root.value) revealIn(root.value)
})
</script>

<template>
  <article ref="root" class="group relative overflow-hidden rounded-2xl border border-white/10
           bg-white/[.03] shadow-[0_20px_60px_-40px_rgba(0,0,0,.8)]
           transition-transform duration-300 will-change-transform
           hover:scale-[1.02] hover:shadow-[0_28px_90px_-50px_rgba(0,0,0,.8)]" data-reveal>
    <!-- Media -->
    <ImageSmart :src="outfit.cover" :alt="outfit.title" :w="1200" :h="800"
      imgClass="transition duration-300 group-hover:scale-[1.02]" />

    <!-- Infos -->
    <div class="p-4 sm:p-5">
      <h3 class="text-base sm:text-lg font-semibold text-white">{{ outfit.title }}</h3>
      <p class="mt-1 text-sm text-white/70">
        {{ formatPrice(outfit.price) }}
      </p>

      <!-- Actions -->
      <div class="mt-4 flex flex-wrap gap-2">
        <button type="button" @click="onAddBundle" class="px-4 py-2 rounded-full text-sm font-medium
                 border border-white/15 bg-white/[.08] text-white/90
                 hover:bg-white/10 hover:text-white
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#caa45f]">
          Ajouter l’ensemble
        </button>

        <button type="button" @click="onChoosePieces" class="px-4 py-2 rounded-full text-sm
                 border border-white/15 text-white/80 hover:text-white
                 hover:bg-white/5
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#caa45f]">
          Choisir pièces
        </button>
      </div>
    </div>
  </article>
</template>
