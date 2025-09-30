<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useGallery } from '@/stores/gallery'
import ImageSmart from '@/components/media/ImageSmart.vue'
import { revealIn } from '@/utils/reveal'
import { createActiveUnderline } from '@/utils/activeUnderline'
import { useReducedMotion } from '@/composables/useReducedMotion'

/** Store lookbook */
const g = useGallery()

/** Déduire les tags existants (en gardant 'all' en tête) */
const tagList = computed(() => {
  const set = new Set()
  for (const it of g.items) (it.tags || []).forEach(t => set.add(t))
  return ['all', ...Array.from(set)]
})

/** État sélection overlay */
const current = ref(null)

/** Underline animé (filtres) */
const barRef = ref(null)
let underline
const { reduced } = useReducedMotion()

function moveUnderlineToActive() {
  if (!underline || !barRef.value) return
  const active = barRef.value.querySelector('[data-active="true"]')
  underline.moveTo(active || null)
}

watch(() => g.filters.tag, async () => {
  await nextTick()
  moveUnderlineToActive()
})

onMounted(() => {
  // Reveal de la section
  if (root.value) revealIn(root.value)

  // Init underline boutons filtres (desktop + mobile ok, RMM désactive l’anim)
  if (barRef.value) {
    underline = createActiveUnderline(barRef.value, { disabled: reduced.value })
    moveUnderlineToActive()
  }
})

/** Ouvre l’overlay avec l’item */
function openOverlay(item) {
  current.value = item
}

/** Ferme overlay */
function closeOverlay() {
  current.value = null
}

/** Racine pour reveal */
const root = ref(null)
</script>

<template>
  <section ref="root" class="py-10 sm:py-14">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <!-- Filtres -->
      <div class="mb-6">
        <div ref="barRef" class="relative flex flex-wrap gap-2">
          <button v-for="tag in tagList" :key="tag" type="button" :data-active="g.filters.tag === tag" class="px-3 py-1.5 rounded text-sm transition
                   text-white/80 hover:text-white hover:bg-white/5
                   data-[active=true]:text-white data-[active=true]:bg-white/10
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-[#caa45f]" @click="g.setTag(tag)">
            {{ tag === 'all' ? 'All' : tag }}
          </button>
        </div>
      </div>

      <!-- Grille -->
      <div class="grid gap-4 sm:gap-5 grid-cols-2 lg:grid-cols-3">
        <article v-for="it in g.filtered" :key="it.id"
          class="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[.03]"
          @click="openOverlay(it)" data-reveal>
          <ImageSmart :src="it.cover" :alt="it.title" :w="1200" :h="800"
            imgClass="group-hover:scale-[1.02] transition duration-300" />
          <div class="absolute inset-x-0 bottom-0 p-3 from-black/60 via-black/30 to-transparent
                      bg-gradient-to-t">
            <h3 class="text-sm sm:text-base text-white font-medium">
              {{ it.title }}
            </h3>
            <p class="mt-1 text-[11px] sm:text-xs text-white/70">
              {{ (it.tags || []).join(' · ') }}
            </p>
          </div>
        </article>
      </div>
    </div>

    <!-- Overlay : injecte ton composant si déjà codé -->
    <!-- Option 1 : slot (permet d’utiliser ton LookOverlay externe) -->
    <slot name="overlay" :item="current" :close="closeOverlay" />

    <!-- Option 2 (décommente quand LookOverlay est prêt) :
    <LookOverlay v-if="current" :item="current" @close="closeOverlay" />
    -->
  </section>
</template>

<style scoped>
section {
  color: #fff;
}
</style>
