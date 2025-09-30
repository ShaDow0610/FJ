<script setup>
import { ref, reactive, computed, nextTick, onBeforeUnmount } from 'vue'
import { gsap } from '@/plugins/gsap'
import { useReducedMotion } from '@/composables/useReducedMotion'
import Field from '@/components/form/Field.vue'

/** Événement de sortie (P2: validation/HTTP réels) */
const emit = defineEmits(['submit'])

/** Modèle */
const form = reactive({
    name: '',
    email: '',
    type: 'Partenariat',
    message: ''
})

/** Types proposés (modifiable via prop si tu veux plus tard) */
const TYPES = ['Partenariat', 'Shooting', 'UGC', 'Autre']

/** États UI */
const status = ref('idle') // 'idle' | 'loading' | 'success' | 'error'
const message = ref('')
const errors = reactive({ name: '', email: '', message: '' })

/** A11y & anim */
const btnRef = ref(null)
const msgRef = ref(null)
const { reduced } = useReducedMotion()

function pressIn() { if (!reduced.value && btnRef.value) gsap.to(btnRef.value, { scale: .98, duration: .12, ease: 'power2.out' }) }
function pressOut() { if (!reduced.value && btnRef.value) gsap.to(btnRef.value, { scale: 1, duration: .12, ease: 'power2.out' }) }

/** Validations minimales côté front (P1) */
function isEmail(v) {
    return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}
function validate() {
    errors.name = form.name.trim() ? '' : 'Nom requis.'
    errors.email = isEmail(form.email) ? '' : 'E-mail invalide.'
    errors.message = form.message.trim().length >= 10 ? '' : 'Message trop court (≥ 10 caractères).'
    return !errors.name && !errors.email && !errors.message
}

async function onSubmit(e) {
    e?.preventDefault?.()
    if (status.value === 'loading' || status.value === 'success') return

    if (!validate()) {
        status.value = 'error'
        message.value = 'Veuillez corriger les champs en rouge.'
        await nextTick()
        if (msgRef.value && !reduced.value) gsap.fromTo(msgRef.value, { opacity: 0 }, { opacity: 1, duration: .18 })
        return
    }

    status.value = 'loading'
    message.value = ''

    // —— Stub d’envoi : simule ~800ms réseau ——
    await new Promise(r => setTimeout(r, 800))

    status.value = 'success'
    message.value = 'Merci ! Votre message a bien été envoyé (simulation).'
    emit('submit', { ...form })

    await nextTick()
    if (msgRef.value && !reduced.value) gsap.fromTo(msgRef.value, { opacity: 0 }, { opacity: 1, duration: .25 })
}

onBeforeUnmount(() => gsap.killTweensOf(btnRef.value))
</script>

<template>
    <form @submit="onSubmit" class="max-w-2xl mx-auto text-white" role="form"
        :aria-busy="status === 'loading' ? 'true' : 'false'" novalidate>
        <!-- Nom -->
        <Field id="contact-name" label="Votre nom" v-model="form.name" :error="errors.name" required
            placeholder="Ex. : Shadow" class="mb-4" />

        <!-- Email -->
        <Field id="contact-email" label="Votre e-mail" v-model="form.email" type="email" inputmode="email"
            autocomplete="email" :error="errors.email" required placeholder="vous@exemple.com" class="mb-4" />

        <!-- Type de demande -->
        <div class="mb-4">
            <label for="contact-type" class="block text-sm mb-2 text-white/80">Type de demande</label>
            <div class="relative">
                <select id="contact-type" v-model="form.type" class="w-full rounded-xl bg-black/40 border border-white/15 px-3 py-2 text-white
                 focus-visible:ring-2 focus-visible:ring-[#caa45f] appearance-none"
                    aria-label="Sélectionner le type de demande">
                    <option v-for="t in TYPES" :key="t" :value="t">{{ t }}</option>
                </select>
                <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/60">
                    ▾
                </span>
            </div>
        </div>

        <!-- Message -->
        <Field id="contact-message" label="Votre message" v-model="form.message" textarea :rows="6"
            :error="errors.message" required placeholder="Expliquez votre besoin en quelques lignes…" class="mb-5"
            :help="'Détaillez le contexte, les objectifs et les délais si possible.'" />

        <!-- Actions -->
        <div class="flex items-center gap-3">
            <button ref="btnRef" type="submit" class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full
               border border-white/15 bg-white/[.08] text-white/90
               hover:bg-white/10 hover:text-white
               focus:outline-none focus-visible:ring-2 focus-visible:ring-[#caa45f]
               transition-[background-color,color,transform,box-shadow] duration-200" @mousedown.left.prevent="pressIn"
                @mouseup="pressOut" @mouseleave="pressOut" @touchstart.passive="pressIn" @touchend.passive="pressOut"
                :disabled="status === 'loading' || status === 'success'" :class="{
                    'opacity-60 cursor-not-allowed': status === 'loading' || status === 'success'
                }" aria-label="Envoyer le message">
                <span v-if="status === 'idle' || status === 'error'">Envoyer</span>
                <span v-else-if="status === 'loading'" class="inline-flex items-center gap-2">
                    <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"
                            fill="none" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v3A5 5 0 0 0 7 12H4z" />
                    </svg>
                    <span>Envoi…</span>
                </span>
                <span v-else>Envoyé</span>
            </button>

            <!-- Message global -->
            <p v-if="message" ref="msgRef" class="text-sm"
                :class="status === 'success' ? 'text-emerald-300' : 'text-red-300'" aria-live="polite"
                aria-atomic="true">
                {{ message }}
            </p>
        </div>
    </form>
</template>

<style scoped>
button:hover {
    box-shadow: 0 12px 40px -24px rgba(202, 164, 95, .35);
}
</style>
