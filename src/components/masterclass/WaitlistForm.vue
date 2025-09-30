<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { gsap } from '@/plugins/gsap'

// Stub P1 — aucun envoi réel ici. (En P2, branche sur services/newsletter.subscribe)
const emit = defineEmits(['submit'])

const email = ref('')
const status = ref('idle') // 'idle' | 'loading' | 'success' | 'error'
const message = ref('')
const btnRef = ref(null)

function isValidEmail(v) {
    return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

function pressIn() { if (btnRef.value) gsap.to(btnRef.value, { scale: 0.98, duration: 0.12, ease: 'power2.out' }) }
function pressOut() { if (btnRef.value) gsap.to(btnRef.value, { scale: 1, duration: 0.12, ease: 'power2.out' }) }

async function onSubmit(e) {
    e?.preventDefault?.()
    if (!isValidEmail(email.value)) {
        status.value = 'error'
        message.value = 'Adresse e-mail invalide.'
        return
    }

    status.value = 'loading'
    message.value = ''

    // Stub: simule un délai ~600ms puis succès
    await new Promise(r => setTimeout(r, 600))
    status.value = 'success'
    message.value = 'Inscription enregistrée. À très vite ✨'
    emit('submit', email.value) // pour P2 : traçage/validation réelle
}

onBeforeUnmount(() => gsap.killTweensOf(btnRef.value))
</script>

<template>
    <form @submit="onSubmit" class="w-full max-w-md mx-auto text-white" novalidate>
        <label for="waitlist-email" class="block text-sm mb-2 text-white/80">
            Votre e-mail
        </label>

        <div class="flex items-stretch gap-2">
            <input id="waitlist-email" v-model.trim="email" type="email" inputmode="email" autocomplete="email" required
                :aria-invalid="status === 'error'" class="flex-1 rounded-xl bg-black/40 border border-white/15 px-3 py-2
               placeholder-white/40 text-white outline-none
               focus-visible:ring-2 focus-visible:ring-[#caa45f]" placeholder="vous@exemple.com" />

            <button ref="btnRef" type="submit" class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl
               border border-white/15 bg-white/[.08] text-white/90
               hover:bg-white/10 hover:text-white
               focus:outline-none focus-visible:ring-2 focus-visible:ring-[#caa45f]
               transition-[background-color,color,transform,box-shadow] duration-200" @mousedown.left.prevent="pressIn"
                @mouseup="pressOut" @mouseleave="pressOut" @touchstart.passive="pressIn" @touchend.passive="pressOut"
                :disabled="status === 'loading'" :class="{ 'opacity-60 cursor-not-allowed': status === 'loading' }"
                aria-label="S’inscrire à la waitlist">
                <span v-if="status !== 'loading'">S’inscrire</span>
                <span v-else class="inline-flex items-center gap-2">
                    <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"
                            fill="none" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v3A5 5 0 0 0 7 12H4z" />
                    </svg>
                    <span>Envoi…</span>
                </span>
            </button>
        </div>

        <!-- Messages -->
        <p v-if="message" class="mt-3 text-sm" :class="status === 'error' ? 'text-red-300' : 'text-emerald-300'"
            aria-live="polite">
            {{ message }}
        </p>
    </form>
</template>

<style scoped>
/* Lueur or très douce au focus sur le bouton */
button:hover {
    box-shadow: 0 12px 40px -24px rgba(202, 164, 95, .35);
}
</style>
