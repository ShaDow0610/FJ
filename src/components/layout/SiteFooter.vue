<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { gsap } from '@/plugins/gsap'
import { SOCIAL_LINKS } from '@/config/social.config'
import { NAV_LINKS } from '@/config/nav.config'

const { t } = useI18n()
const root = ref(null)

onMounted(() => {
    // Reveal doux au scroll (respect RMM)
    const rmm = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    if (rmm || !root.value) return

    const nodes = root.value.querySelectorAll('[data-reveal]')
    // Observer simple pour déclencher une seule fois
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                gsap.from(nodes, {
                    opacity: 0,
                    y: 12,
                    duration: 0.5,
                    stagger: 0.06,
                    ease: 'power2.out'
                })
                io.disconnect()
            }
        })
    }, { threshold: 0.2 })
    io.observe(root.value)
})
</script>

<template>
    <footer ref="root" class="mt-16 border-t border-white/10" role="contentinfo">
        <!-- Contenu principal -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-3">
            <!-- Col 1 — Marque -->
            <section data-reveal aria-labelledby="footer-brand">
                <h2 id="footer-brand" class="text-sm uppercase tracking-wider text-white/60">Shadow</h2>
                <p class="mt-3 text-sm leading-relaxed text-white/70">
                    Un univers mode & influence,
                    sculpté par la lumière,
                    pensé pour le mouvement.
                </p>
            </section>

            <!-- Col 2 — Liens rapides -->
            <nav data-reveal aria-labelledby="footer-quicklinks">
                <h2 id="footer-quicklinks" class="text-sm uppercase tracking-wider text-white/60">
                    {{ t('nav.about') }} &amp; {{ t('nav.gallery') }}
                </h2>
                <ul class="mt-3 space-y-2">
                    <li v-for="l in NAV_LINKS" :key="l.to">
                        <RouterLink :to="l.to"
                            class="text-sm text-white/70 hover:text-white transition underline-offset-4 hover:underline focus-visible:underline"
                            :aria-label="t(l.key)">
                            {{ t(l.key) }}
                        </RouterLink>
                    </li>
                </ul>
            </nav>

            <!-- Col 3 — Réseaux sociaux -->
            <section data-reveal aria-labelledby="footer-social">
                <h2 id="footer-social" class="text-sm uppercase tracking-wider text-white/60">Social</h2>
                <ul class="mt-3 flex gap-3">
                    <li v-for="s in SOCIAL_LINKS" :key="s.name">
                        <a :href="s.url" target="_blank" rel="noopener" class="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/15
                            text-white/80 hover:text-white hover:bg-white/10 focus-visible:bg-white/10 transition
                            will-change-transform" :aria-label="s.name"
                            @mouseenter="$event.currentTarget.style.transform = 'scale(1.06)'"
                            @mouseleave="$event.currentTarget.style.transform = 'scale(1)'"
                            @focus="$event.currentTarget.style.transform = 'scale(1.06)'"
                            @blur="$event.currentTarget.style.transform = 'scale(1)'">
                            <i :class="s.icon" aria-hidden="true"></i>
                            <span class="sr-only">{{ s.name }}</span>
                        </a>
                    </li>
                </ul>
            </section>
        </div>

        <!-- Ligne finale -->
        <div class="border-t border-white/10">
            <div
                class="max-w-7xl mx-auto px-4 sm:px-6 py-6 text-xs text-white/60 flex flex-col sm:flex-row gap-2 sm:items-center">
                <p>© {{ new Date().getFullYear() }} Shadow — Tous droits réservés.</p>
                <p class="sm:ml-auto">Design & mouvement : noir / or / ivoire — hy-tech cinématographique.</p>
            </div>
        </div>
    </footer>
</template>
