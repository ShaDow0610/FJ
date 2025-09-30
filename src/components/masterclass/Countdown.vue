<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { gsap } from '@/plugins/gsap'
import { useReducedMotion } from '@/composables/useReducedMotion'

const props = defineProps({
    /** Date/heure de lancement au format ISO (ex: "2025-10-01T18:00:00Z") */
    launchAt: { type: String, required: true }
})

const { reduced } = useReducedMotion()

// ---- État ----
const days = ref('00')
const hours = ref('00')
const minutes = ref('00')
const seconds = ref('00')
const done = ref(false)

const root = ref(null)
let timer = null

function pad(n) {
    n = Math.max(0, Math.floor(n))
    return String(n).padStart(2, '0')
}

function compute() {
    const target = new Date(props.launchAt).getTime()
    const now = Date.now()
    let diff = Math.max(0, target - now)

    if (diff <= 0) {
        days.value = hours.value = minutes.value = seconds.value = '00'
        done.value = true
        return
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24)); diff -= d * 86400000
    const h = Math.floor(diff / (1000 * 60 * 60)); diff -= h * 3600000
    const m = Math.floor(diff / (1000 * 60)); diff -= m * 60000
    const s = Math.floor(diff / 1000)

    days.value = pad(d)
    hours.value = pad(h)
    minutes.value = pad(m)
    seconds.value = pad(s)
}

function pulse() {
    if (reduced.value || !root.value) return
    // micro-pulse global
    gsap.fromTo(root.value, { scale: 1 }, { scale: 1.06, duration: 0.18, ease: 'power2.out', yoyo: true, repeat: 1 })
    // petite lueur or
    const bars = root.value.querySelectorAll('[data-glow]')
    gsap.fromTo(bars, { opacity: 0.35 }, { opacity: 0.9, duration: 0.18, ease: 'power2.out', yoyo: true, repeat: 1 })
}

onMounted(() => {
    compute()
    pulse()
    timer = setInterval(() => {
        const was = `${days.value}${hours.value}${minutes.value}${seconds.value}`
        compute()
        const now = `${days.value}${hours.value}${minutes.value}${seconds.value}`
        if (was !== now) pulse()
        if (done.value && timer) { clearInterval(timer); timer = null }
    }, 1000)
})

onBeforeUnmount(() => { if (timer) clearInterval(timer) })
</script>

<template>
    <div ref="root" class="text-white select-none" aria-live="polite" aria-atomic="true">
        <div class="flex items-center justify-center gap-4 sm:gap-6">
            <!-- Bloc chiffre -->
            <div class="grid gap-1 text-center">
                <div class="relative">
                    <span class="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight">{{ days }}</span>
                    <span data-glow
                        class="pointer-events-none absolute inset-0 rounded-md ring-2 ring-[color:#caa45f]/30 -z-10"></span>
                </div>
                <span class="text-[11px] sm:text-xs uppercase tracking-wide text-white/70">Jours</span>
            </div>

            <span class="text-3xl sm:text-4xl text-white/50">:</span>

            <div class="grid gap-1 text-center">
                <div class="relative">
                    <span class="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight">{{ hours }}</span>
                    <span data-glow
                        class="pointer-events-none absolute inset-0 rounded-md ring-2 ring-[color:#caa45f]/30 -z-10"></span>
                </div>
                <span class="text-[11px] sm:text-xs uppercase tracking-wide text-white/70">Heures</span>
            </div>

            <span class="text-3xl sm:text-4xl text-white/50">:</span>

            <div class="grid gap-1 text-center">
                <div class="relative">
                    <span class="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight">{{ minutes }}</span>
                    <span data-glow
                        class="pointer-events-none absolute inset-0 rounded-md ring-2 ring-[color:#caa45f]/30 -z-10"></span>
                </div>
                <span class="text-[11px] sm:text-xs uppercase tracking-wide text-white/70">Minutes</span>
            </div>

            <span class="text-3xl sm:text-4xl text-white/50">:</span>

            <div class="grid gap-1 text-center">
                <div class="relative">
                    <span class="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight">{{ seconds }}</span>
                    <span data-glow
                        class="pointer-events-none absolute inset-0 rounded-md ring-2 ring-[color:#caa45f]/30 -z-10"></span>
                </div>
                <span class="text-[11px] sm:text-xs uppercase tracking-wide text-white/70">Secondes</span>
            </div>
        </div>

        <!-- Message final (optionnel) -->
        <p v-if="done" class="mt-3 text-center text-sm text-white/80">
            C’est l’heure ✨
        </p>
    </div>
</template>

<style scoped>
/* Glow or très doux autour des chiffres (fond discret) */
[data-glow]::after {
    content: '';
    position: absolute;
    inset: -6%;
    background: radial-gradient(40% 40% at 50% 50%, rgba(202, 164, 95, .25), transparent 60%);
    filter: blur(12px);
    opacity: .6;
    border-radius: inherit;
    pointer-events: none;
}
</style>
