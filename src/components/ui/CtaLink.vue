<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import { gsap } from '@/plugins/gsap'

const props = defineProps({
    to: { type: [String, Object], required: true },
    label: { type: String, required: true },
    /** Classe FA optionnelle, ex: 'fa-solid fa-camera' */
    icon: { type: String, default: '' }
})

const root = ref(null)
const rmm = typeof window !== 'undefined'
    ? window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
    : false

function pressIn() {
    if (!root.value || rmm) return
    gsap.to(root.value, { scale: 0.98, duration: 0.12, ease: 'power2.out' })
}
function pressOut() {
    if (!root.value || rmm) return
    gsap.to(root.value, { scale: 1, duration: 0.12, ease: 'power2.out' })
}

// Accessibilité : activer le press pour Espace/Entrée
function onKeyDown(e) {
    if (e.code === 'Space' || e.code === 'Enter') pressIn()
}
function onKeyUp(e) {
    if (e.code === 'Space' || e.code === 'Enter') pressOut()
}

onMounted(() => { })
onBeforeUnmount(() => gsap.killTweensOf(root.value))
</script>

<template>
    <RouterLink ref="root" :to="to" class="inline-flex items-center gap-2 px-5 py-3 rounded-full
           border border-white/15 bg-white/[.06] text-white/90
           hover:bg-white/10 hover:text-white
           transition-[background-color,color,box-shadow] duration-200
           shadow-[0_10px_30px_-20px_rgba(0,0,0,.6)]
           focus:outline-none focus-visible:ring-2 focus-visible:ring-[#caa45f] focus-visible:ring-offset-0
           will-change-transform select-none" @mousedown.left.prevent="pressIn" @mouseup="pressOut"
        @mouseleave="pressOut" @touchstart.passive="pressIn" @touchend.passive="pressOut" @keydown="onKeyDown"
        @keyup="onKeyUp">
        <i v-if="icon" :class="icon" aria-hidden="true"></i>
        <span class="font-medium tracking-wide">{{ label }}</span>
    </RouterLink>
</template>

<style scoped>
/* Lueur or très subtile au survol */
a:hover {
    box-shadow: 0 12px 40px -24px rgba(202, 164, 95, .55);
}
</style>
