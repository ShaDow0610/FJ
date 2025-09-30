<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from '@/plugins/gsap'

/**
 * Props — personnalisation légère
 */
const props = defineProps({
    color: { type: String, default: 'rgb(11 11 12 / 1)' }, // noir profond
    duration: { type: Number, default: 0.55 },
    ease: { type: String, default: 'power2.inOut' },
    enabled: { type: Boolean, default: true }
})

const overlay = ref(null) // conteneur full-screen
const iris = ref(null)    // calque masqué par clip-path

const router = useRouter()
let rmm = false
let isMounted = false

// --- Utils ---
function maxRadiusFrom(x, y) {
    const w = window.innerWidth
    const h = window.innerHeight
    return Math.max(
        Math.hypot(x - 0, y - 0),
        Math.hypot(x - w, y - 0),
        Math.hypot(x - 0, y - h),
        Math.hypot(x - w, y - h)
    )
}

function normalizeOpts(opts = {}) {
    const x = ('x' in opts) ? opts.x : window.innerWidth / 2
    const y = ('y' in opts) ? opts.y : window.innerHeight / 2
    const r = maxRadiusFrom(x, y)
    return { x, y, r }
}

async function playOut(opts = {}) {
    if (!isMounted || !overlay.value || !iris.value) return
    if (!props.enabled || rmm) {
        // Pas d'animation : couvrir instantanément
        const { x, y, r } = normalizeOpts(opts)
        gsap.set(overlay.value, { autoAlpha: 1 })
        gsap.set(iris.value, { clipPath: `circle(${r}px at ${x}px ${y}px)`, backgroundColor: props.color })
        return
    }
    const { x, y, r } = normalizeOpts(opts)
    await nextTick()
    gsap.set(overlay.value, { autoAlpha: 1 })
    gsap.set(iris.value, { backgroundColor: props.color })
    return new Promise((resolve) => {
        gsap.to(iris.value, {
            clipPath: `circle(${r}px at ${x}px ${y}px)`,
            duration: props.duration,
            ease: props.ease,
            onComplete: resolve
        })
    })
}

async function playIn(opts = {}) {
    if (!isMounted || !overlay.value || !iris.value) return
    if (!props.enabled || rmm) {
        const { x, y } = normalizeOpts(opts)
        gsap.set(iris.value, { clipPath: `circle(0px at ${x}px ${y}px)` })
        gsap.set(overlay.value, { autoAlpha: 0 })
        return
    }
    const { x, y } = normalizeOpts(opts)
    await nextTick()
    gsap.set(overlay.value, { autoAlpha: 1 })
    gsap.set(iris.value, { backgroundColor: props.color })
    return new Promise((resolve) => {
        gsap.to(iris.value, {
            clipPath: `circle(0px at ${x}px ${y}px)`,
            duration: props.duration,
            ease: props.ease,
            onComplete: () => {
                gsap.set(overlay.value, { autoAlpha: 0 })
                resolve()
            }
        })
    })
}

// Option : capter les coords du dernier clic pour centrer l’iris
let lastXY = null
function handleClick(e) {
    if (e.button === 0) lastXY = { x: e.clientX, y: e.clientY }
}

onMounted(() => {
    isMounted = true
    rmm = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

    // État initial : iris réduit, overlay invisible
    gsap.set(overlay.value, { autoAlpha: 0 })
    const x = window.innerWidth / 2
    const y = window.innerHeight / 2
    gsap.set(iris.value, { clipPath: `circle(0px at ${x}px ${y}px)`, backgroundColor: props.color })

    // Hooks router auto (composant “autonome”)
    router.beforeEach(async (_to, from, next) => {
        if (!from || !from.name) return next() // pas d’anim au premier load
        await playOut(lastXY || {})
        next()
    })
    router.afterEach(async () => {
        await playIn(lastXY || {})
        lastXY = null
    })

    window.addEventListener('click', handleClick, { passive: true })
})

onBeforeUnmount(() => {
    isMounted = false
    gsap.killTweensOf([overlay.value, iris.value])
    window.removeEventListener('click', handleClick)
})

// Expose facultatif (au cas où tu veux déclencher manuellement)
defineExpose({ playIn, playOut })
</script>

<template>
    <!-- Overlay plein écran, au-dessus de l’app -->
    <div ref="overlay" class="pointer-events-none fixed inset-0 z-[9999]" aria-hidden="true">
        <div ref="iris" class="absolute inset-0" />
    </div>
</template>

<style scoped>
/* Hints de perf */
[ref="iris"],
.inset-0 {
    will-change: clip-path, transform, opacity;
}
</style>
