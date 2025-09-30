<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'

/**
 * Base modale accessible.
 * Affichez-la via v-if dans le parent. Émet 'close' pour la fermeture.
 */
const props = defineProps({
    /** Titre (fallback si pas de slot #title) */
    title: { type: String, default: '' },
    /** Fermer en cliquant sur l’arrière-plan */
    closeOnBackdrop: { type: Boolean, default: true },
    /** Cible initiale du focus (sélecteur CSS) ; sinon, premier focusable */
    initialFocus: { type: String, default: '' },
    /** ID personnalisé pour aria-labelledby (sinon généré) */
    labelledby: { type: String, default: '' }
})

const emit = defineEmits(['close'])

const backdrop = ref(null)
const panel = ref(null)
const titleEl = ref(null)

let lastActive = null
let keyHandler = null
let prevBodyOverflow = ''

const titleId = computed(() => props.labelledby || `modal-title-${Math.random().toString(36).slice(2, 8)}`)

/** Focus utils */
function getFocusable(container) {
    if (!container) return []
    const selectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex^="-"])'
    ]
    const nodes = Array.from(container.querySelectorAll(selectors.join(',')))
    return nodes.filter(el => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length))
}

async function focusInitial() {
    await nextTick()
    // 1) cible via prop
    if (props.initialFocus) {
        const el = panel.value?.querySelector(props.initialFocus)
        if (el) { el.focus(); return }
    }
    // 2) data-autofocus
    const auto = panel.value?.querySelector('[data-autofocus]')
    if (auto) { auto.focus(); return }
    // 3) premier focusable
    const [first] = getFocusable(panel.value)
    if (first) { first.focus(); return }
    // 4) fallback : le panel
    panel.value?.focus?.()
}

/** Trap focus (Tab/Shift+Tab) + ESC */
function onKeydown(e) {
    if (e.key === 'Escape') {
        e.stopPropagation()
        emit('close')
        return
    }
    if (e.key !== 'Tab') return

    const focusables = getFocusable(panel.value)
    if (!focusables.length) return

    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    const active = document.activeElement

    if (e.shiftKey) {
        if (active === first || !panel.value.contains(active)) {
            e.preventDefault()
            last.focus()
        }
    } else {
        if (active === last || !panel.value.contains(active)) {
            e.preventDefault()
            first.focus()
        }
    }
}

/** Backdrop click-to-close */
function onBackdrop(e) {
    if (!props.closeOnBackdrop) return
    if (e.target === backdrop.value) emit('close')
}

onMounted(async () => {
    // Scroll lock
    prevBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Mémorise l’élément actif
    lastActive = document.activeElement

    // Focus initial
    await focusInitial()

    // Listeners
    keyHandler = (e) => onKeydown(e)
    document.addEventListener('keydown', keyHandler)
})

onBeforeUnmount(() => {
    // Restore scroll & focus
    document.body.style.overflow = prevBodyOverflow || ''
    document.removeEventListener('keydown', keyHandler)
    lastActive?.focus?.()
})
</script>

<template>
    <!-- Backdrop -->
    <div ref="backdrop" class="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm
           grid place-items-center p-4 sm:p-6
           transition-opacity" role="dialog" aria-modal="true" :aria-labelledby="title ? titleId : null"
        @mousedown.self="onBackdrop">
        <!-- Panel -->
        <div ref="panel" class="w-full max-w-2xl rounded-2xl border border-white/10 bg-black/70 text-white
             shadow-[0_30px_100px_-40px_rgba(0,0,0,.8)]
             outline-none focus:outline-none
             transition-transform duration-200" tabindex="-1">
            <!-- Header -->
            <header class="flex items-start gap-3 p-4 sm:p-5">
                <h3 v-if="$slots.title || title" :id="titleId" class="text-lg sm:text-xl font-semibold">
                    <slot name="title">{{ title }}</slot>
                </h3>
                <button type="button" class="ml-auto inline-flex items-center justify-center h-9 w-9 rounded-full
                 border border-white/15 text-white/90 hover:text-white hover:bg-white/10
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#caa45f]" aria-label="Fermer la fenêtre"
                    data-autofocus @click="$emit('close')">
                    ✕
                </button>
            </header>

            <!-- Body -->
            <div class="px-4 pb-4 sm:px-5 sm:pb-5">
                <slot />
            </div>

            <!-- Actions -->
            <div v-if="$slots.actions" class="px-4 pb-4 sm:px-5 sm:pb-5">
                <div class="flex flex-wrap gap-2 justify-end">
                    <slot name="actions" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Micro-anim d’entrée : fade + scale (CSS-only, rapide) */
[ref="backdrop"] {
    animation: modal-fade .18s ease-out;
}

[ref="panel"] {
    animation: modal-scale .18s ease-out;
}

@keyframes modal-fade {
    from {
        opacity: 0
    }

    to {
        opacity: 1
    }
}

@keyframes modal-scale {
    from {
        transform: scale(.96)
    }

    to {
        transform: scale(1)
    }
}

/* Perf hints */
.backdrop-blur-sm,
.rounded-2xl {
    will-change: opacity, transform;
}
</style>
