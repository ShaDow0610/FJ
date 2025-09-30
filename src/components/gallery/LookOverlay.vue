<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { gsap, Flip } from '@/plugins/gsap'
import { motion } from '@/utils/motion'
import { useReducedMotion } from '@/composables/useReducedMotion'
import ImageSmart from '@/components/media/ImageSmart.vue'

const props = defineProps({
    item: {
        type: Object,
        required: true, // { id, title, cover, tags? }
    }
})
const emit = defineEmits(['close'])

const root = ref(null)     // overlay fond (click.self pour fermer)
const panel = ref(null)    // conteneur central
const imgWrap = ref(null)  // wrapper de l'image (pour placement absolu au début)
const imgEl = ref(null)    // img réelle (cible Flip.fit)

const { reduced } = useReducedMotion()
let keyHandler = null

function findSourceEl() {
    if (typeof document === 'undefined') return null
    // 1) Id dédié (recommandé) : <article data-card-id="item.id"> … <img …>
    let src = document.querySelector(`[data-card-id="${props.item.id}"] img`)
    // 2) Fallback : cherche l'image dont l'alt correspond au titre
    if (!src) src = Array.from(document.querySelectorAll('img')).find(el => el.getAttribute('alt') === props.item.title) || null
    return src || null
}

async function animateOpen() {
    if (reduced.value) return // pas d'animation
    const source = findSourceEl()
    if (!source || !imgEl.value || !imgWrap.value) return

    // Met l'image de l'overlay en position absolue initialement
    gsap.set(imgWrap.value, { position: 'relative' })
    gsap.set(imgEl.value, { position: 'absolute', inset: 0 })

    // Aligne l'image overlay sur la source (Flip.fit)
    Flip.fit(imgEl.value, source, { absolute: true })

    // Ensuite → anime vers sa place naturelle (clearProps)
    await nextTick()
    gsap.to(imgEl.value, {
        x: 0, y: 0, width: '100%', height: '100%',
        duration: motion.dur.sm, ease: motion.ease.inOut,
        onComplete: () => gsap.set(imgEl.value, { clearProps: 'all' })
    })
}

async function animateClose() {
    if (reduced.value) return
    const source = findSourceEl()
    if (!source || !imgEl.value) return
    // Replace l'image cible en absolu pour la faire “rentrer” dans la source
    const r = imgEl.value.getBoundingClientRect()
    gsap.set(imgEl.value, {
        position: 'absolute',
        left: 0, top: 0, width: `${r.width}px`, height: `${r.height}px`
    })
    // Utilise Flip.fit pour l’amener vers la source
    const tween = gsap.to({}, { duration: motion.dur.xs }) // stub pour coordonner
    Flip.fit(imgEl.value, source, { absolute: true })
    await new Promise(res => setTimeout(res, motion.dur.xs * 1000))
}

function onClose() {
    const finish = () => emit('close')
    if (reduced.value) return finish()
    animateClose().finally(finish)
}

function onKey(e) {
    if (e.key === 'Escape') onClose()
}

onMounted(async () => {
    // Hook ESC
    keyHandler = (e) => onKey(e)
    document.addEventListener('keydown', keyHandler)

    // Fade-in du panel
    gsap.from(panel.value, {
        opacity: 0,
        duration: 0.4,
        ease: motion.ease.out
    })

    // Transition image depuis la carte source
    await nextTick()
    await animateOpen()
})

onBeforeUnmount(() => {
    document.removeEventListener('keydown', keyHandler)
    gsap.killTweensOf(panel.value)
    gsap.killTweensOf(imgEl.value)
})
</script>

<template>
    <!-- Overlay fixe -->
    <div ref="root" class="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm
           grid place-items-center p-4 sm:p-6" @click.self="onClose" role="dialog" aria-modal="true"
        :aria-label="item?.title || 'Look'">
        <!-- Panneau -->
        <div ref="panel" class="relative w-full max-w-4xl rounded-2xl overflow-hidden
             border border-white/10 bg-black/60">
            <!-- Image large -->
            <div ref="imgWrap" class="relative">
                <ImageSmart ref="imgEl" :src="item.cover" :alt="item.title" :w="1200" :h="800"
                    imgClass="rounded-none" />
            </div>

            <!-- Légendes -->
            <div class="p-4 sm:p-5">
                <div class="flex items-start gap-3">
                    <h3 class="text-lg sm:text-xl font-semibold text-white">
                        {{ item.title }}
                    </h3>
                    <button type="button" class="ml-auto px-3 py-1.5 text-sm rounded border border-white/15
                   text-white/90 hover:text-white hover:bg-white/10
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-[#caa45f]" @click="onClose">
                        Fermer
                    </button>
                </div>
                <p v-if="item.tags?.length" class="mt-2 text-xs sm:text-sm text-white/70">
                    {{ item.tags.join(' · ') }}
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Améliore la perf des anims */
[role="dialog"],
.backdrop-blur-sm,
.rounded-2xl {
    will-change: opacity, transform;
}
</style>
