<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import VanillaTilt from 'vanilla-tilt'
import ImageSmart from '@/components/media/ImageSmart.vue'
import { useReducedMotion } from '@/composables/useReducedMotion'

const props = defineProps({
  item: {
    type: Object,
    required: true,
    // { id:string, title:string, tags:string[], cover:string }
  }
})

const emit = defineEmits(['open'])

const card = ref(null)
const { reduced } = useReducedMotion()

function open() {
  emit('open', props.item)
}

function onKey(e) {
  if (e.code === 'Enter' || e.code === 'Space') {
    e.preventDefault()
    open()
  }
}

onMounted(() => {
  if (!card.value || reduced.value) return
  // Init VanillaTilt — discret, mobile-friendly
  VanillaTilt.init(card.value, {
    max: 6,
    speed: 300,
    glare: false,
    perspective: 1000,
    gyroscope: true
  })
})

onBeforeUnmount(() => {
  card.value?.vanillaTilt?.destroy?.()
})
</script>

<template>
  <article ref="card" role="button" tabindex="0" class="group relative cursor-pointer overflow-hidden rounded-2xl
           border border-white/10 bg-white/[.03] outline-none
           focus-visible:ring-2 focus-visible:ring-[#caa45f]" @click="open" @keydown="onKey">
    <!-- Media -->
    <ImageSmart :src="item.cover" :alt="item.title" :w="1200" :h="800"
      imgClass="transition duration-300 group-hover:scale-[1.03]" />

    <!-- Légendes -->
    <div class="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
      <h3 class="text-sm sm:text-base text-white font-medium">
        {{ item.title }}
      </h3>
      <p class="mt-1 text-[11px] sm:text-xs text-white/70">
        {{ (item.tags || []).join(' · ') }}
      </p>
    </div>
  </article>
</template>
