<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
    src: { type: String, required: true },
    type: { type: String, default: 'video/webm' }, // ex: 'video/mp4'
    poster: { type: String, default: '' },
    preload: { type: String, default: 'metadata' },   // 'none' | 'metadata' | 'auto'
    /** Classes appliquées à la balise <video> */
    videoClass: { type: String, default: 'object-cover w-full h-full' },

    /** IO options */
    rootMargin: { type: String, default: '0px' },
    threshold: { type: Number, default: 0.25 },

    /** Auto-play/pause behavior */
    autoplay: { type: Boolean, default: true },
    pauseOnHidden: { type: Boolean, default: true },
})

const videoRef = ref(null)
let io = null
let visibilityHandler = null

async function safePlay() {
    const el = videoRef.value
    if (!el) return
    try {
        // force muted for autoplay policies
        el.muted = true
        await el.play()
    } catch (_) {
        // ignore; user gesture may be required on some platforms
    }
}
function safePause() {
    const el = videoRef.value
    if (!el) return
    try { el.pause() } catch (_) { }
}

function onIntersect(entries) {
    const e = entries[0]
    if (!props.autoplay) return
    if (e.isIntersecting) safePlay()
    else safePause()
}

function onVisibility() {
    if (!props.pauseOnHidden) return
    if (document.hidden) safePause()
    else if (props.autoplay) safePlay()
}

onMounted(() => {
    const el = videoRef.value
    if (!el) return

    // Intersection observer
    if ('IntersectionObserver' in window) {
        io = new IntersectionObserver(onIntersect, {
            root: null,
            rootMargin: props.rootMargin,
            threshold: props.threshold
        })
        io.observe(el)
    } else {
        // Fallback : jouer au mount si autoplay, sinon rien
        if (props.autoplay) safePlay()
    }

    // Onglet visible/caché
    visibilityHandler = () => onVisibility()
    document.addEventListener('visibilitychange', visibilityHandler, { passive: true })

    // Si la vidéo est déjà prête et visible, démarre
    if (props.autoplay && el.readyState >= 2) {
        safePlay()
    } else {
        el.addEventListener('canplay', () => props.autoplay && safePlay(), { once: true })
    }
})

onBeforeUnmount(() => {
    io?.disconnect?.()
    document.removeEventListener('visibilitychange', visibilityHandler)
    safePause()
})
</script>

<template>
    <video ref="videoRef" :class="videoClass" :poster="poster || undefined" :preload="preload" muted loop playsinline
        webkit-playsinline disablepictureinpicture>
        <!-- Source principale -->
        <source :src="src" :type="type" />
        <!-- Slot optionnel pour fournir des <source> alternatifs (mp4/webm) -->
        <slot />
        Votre navigateur ne supporte pas la vidéo HTML5.
    </video>
</template>
