<script setup>
import { ref } from 'vue'
import { setMeta } from '@/utils/meta'
import ContactForm from '@/components/contact/ContactForm.vue'

setMeta({
    title: 'Contact — Réservations',
    description: 'Salon discret : formulaire premium, focus rings doux, message de succès élégant.'
})

const sent = ref(false)
function onSubmit(payload) {
    // P1 : stub — marque la page comme “envoyé”
    sent.value = true
    // P2 : tracer / envoyer via api.post('/contact', payload)
}
</script>

<template>
    <main id="main" class="relative isolate text-white">
        <!-- Fond éditorial doux -->
        <div class="pointer-events-none absolute inset-0 -z-10">
            <div class="abs-grad" />
        </div>

        <section class="pt-10 sm:pt-14">
            <div class="max-w-7xl mx-auto px-4 sm:px-6">
                <header class="mb-6 sm:mb-10">
                    <h1 class="text-3xl sm:text-4xl font-semibold tracking-tight">Contact — Réservations</h1>
                    <p class="mt-2 text-white/70 max-w-2xl">
                        Un salon discret, un geste sûr. Dites-nous l’essentiel—nous revenons vers vous rapidement.
                    </p>
                </header>

                <div class="grid gap-8 lg:grid-cols-2 items-start">
                    <!-- Formulaire -->
                    <div class="rounded-2xl border border-white/10 bg-white/[.03] p-4 sm:p-6">
                        <ContactForm @submit="onSubmit" />

                        <!-- Slot message “merci” après succès (option visuelle locale) -->
                        <transition name="fade">
                            <div v-if="sent"
                                class="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-emerald-200 text-sm"
                                role="status" aria-live="polite">
                                Merci ✨ Votre message a bien été transmis. Nous revenons vers vous sous peu.
                            </div>
                        </transition>
                    </div>

                    <!-- Encadré infos (optionnel, modifiable) -->
                    <aside class="space-y-4">
                        <div class="rounded-2xl border border-white/10 bg-white/[.02] p-4 sm:p-6">
                            <h2 class="text-xl font-semibold">Informations</h2>
                            <p class="mt-2 text-white/70 text-sm">
                                Réponses sous 24–48h ouvrées. Pour les demandes urgentes, précisez la date souhaitée
                                dans le message.
                            </p>
                            <ul class="mt-3 text-sm text-white/75 space-y-1.5">
                                <li class="flex items-center gap-2">
                                    <i class="fa-regular fa-envelope text-white/60" aria-hidden="true"></i>
                                    contact@votre-domaine.com
                                </li>
                                <li class="flex items-center gap-2">
                                    <i class="fa-regular fa-clock text-white/60" aria-hidden="true"></i>
                                    Lun–Ven, 10:00–18:00
                                </li>
                            </ul>
                        </div>

                        <div class="rounded-2xl border border-white/10 bg-white/[.02] p-4 sm:p-6">
                            <h3 class="text-base font-medium">Types de demande</h3>
                            <ul class="mt-2 text-sm text-white/70 list-disc pl-5 space-y-1.5">
                                <li>Partenariat (marque, restaurant, cosmétique…)</li>
                                <li>Séance photo / éditorial</li>
                                <li>UGC / format court</li>
                                <li>Autre (précisez le contexte)</li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    </main>
</template>

<style scoped>
/* Dégradé luxueux discret */
.abs-grad {
    position: absolute;
    inset: -10%;
    background:
        radial-gradient(35% 35% at 15% 20%, rgba(202, 164, 95, .10), transparent 60%),
        radial-gradient(45% 45% at 85% 30%, rgba(255, 255, 255, .06), transparent 65%),
        linear-gradient(to bottom, rgba(0, 0, 0, .15), transparent 40%, rgba(0, 0, 0, .25));
    filter: saturate(110%);
}

/* Transition message succès */
.fade-enter-active,
.fade-leave-active {
    transition: opacity .25s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
