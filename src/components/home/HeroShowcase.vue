<!-- HeroShowcase.vue -->
<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { gsap, ScrollTrigger } from '@/plugins/gsap' // assure-toi que ScrollTrigger est bien register dans ce plugin
import { useReducedMotion } from '@/composables/useReducedMotion'
import ImageSmart from '@/components/media/ImageSmart.vue'
import vid from '@/assets/Tt.webm'

/**
 * Props :
 * - bgVideo   : URL mp4/webm de la vidéo de fond
 * - bgPoster  : image fallback/poster
 * - leftLogo  : PNG/WEBP transparent (entre de gauche)
 * - rightLogo : PNG/WEBP transparent (entre de droite)
 * - occupation: Titre (gauche)
 * - bio       : Texte descriptif
 * - site      : { label, href } lien du site perso
 * - socials   : [{label, icon, href}]
 * - sponsors  : [{alt, src, href}]
 * - ctaHref   : Lien du bouton final
 */
const props = defineProps({
    bgVideo: { type: String, default: vid },
    bgPoster: { type: String, default: '' },
    leftLogo: { type: String, default: '' },
    rightLogo: { type: String, default: '' },
    occupation: { type: String, default: 'Créateur / Visionnaire' },
    bio: { type: String, default: 'Bio courte et percutante ici.' },
    site: { type: Object, default: () => ({ label: 'Mon site', href: '#' }) },
    socials: { type: Array, default: () => [] },
    sponsors: { type: Array, default: () => [] },
    ctaHref: { type: String, default: '#' }
})

const root = ref(null)

// ✅ Un seul wrapper de visuel (vidéo OU image) pour éviter les refs null
const bgVisualRef = ref(null)
const overlayRef = ref(null)

const { reduced } = useReducedMotion()
let ctx // gsap.context
let tl  // timeline principale

onMounted(async () => {
    await nextTick()
    if (!root.value) return

    ctx = gsap.context(() => {
        if (reduced.value) {
            // Mode réduit : pas de pin/scrub, tout visible, overlay stabilisé
            if (overlayRef.value) overlayRef.value.style.opacity = '0.55'
            gsap.set(root.value.querySelectorAll(
                '[data-occupation],[data-bio],[data-site],[data-logo-left],[data-logo-right],[data-social],[data-sponsor],[data-cta]'
            ), { autoAlpha: 1, y: 0, xPercent: 0 })
            return
        }

        // Sélecteurs sûrs
        const bgEl = bgVisualRef.value
        const occ = root.value.querySelector('[data-occupation]')
        const bio = root.value.querySelector('[data-bio]')
        const site = root.value.querySelector('[data-site]')
        const logoL = root.value.querySelector('[data-logo-left]')
        const logoR = root.value.querySelector('[data-logo-right]')
        const socials = root.value.querySelectorAll('[data-social]')
        const sponsors = root.value.querySelectorAll('[data-sponsor]')
        const cta = root.value.querySelector('[data-cta]')

        tl = gsap.timeline({
            scrollTrigger: {
                trigger: root.value,
                start: 'top top',
                end: '+=160%',
                pin: true,
                scrub: true,
                anticipatePin: 0.5
            },
            defaults: { ease: 'none' }
        })

        // Fond vidéo/image : zoom léger + translation ; overlay qui s’assombrit
        if (bgEl) tl.to(bgEl, { scale: 1.12, yPercent: 6 }, 0)
        if (overlayRef.value) tl.to(overlayRef.value, { opacity: 0.55 }, 0)

        // Phase 1 — Occupation
        if (occ) tl.from(occ, { autoAlpha: 0, y: 28 }, 0.05)

        // Phase 2 — Bio
        if (bio) tl.from(bio, { autoAlpha: 0, y: 24 }, 0.15)

        // Phase 3 — Lien site
        if (site) tl.from(site, { autoAlpha: 0, y: 18 }, 0.22)

        // Phase 4 — Logo composite
        if (logoL) tl.from(logoL, { xPercent: -40, autoAlpha: 0 }, 0.26)
        if (logoR) tl.from(logoR, { xPercent: 40, autoAlpha: 0 }, 0.26)
        if (logoL || logoR) tl.to([logoL, logoR].filter(Boolean), { xPercent: 0, autoAlpha: 1 }, 0.36)

        // Phase 5 — Réseaux (un à un)
        if (socials?.length) tl.from(socials, { autoAlpha: 0, y: 18, stagger: 0.08 }, 0.46)

        // Phase 6 — Sponsors (un à un)
        if (sponsors?.length) tl.from(sponsors, { autoAlpha: 0, y: 18, stagger: 0.08 }, 0.62)

        // Phase 7 — CTA + pulse au premier aperçu
        if (cta) {
            tl.from(cta, { autoAlpha: 0, y: 20 }, 0.8)
            ScrollTrigger.create({
                trigger: cta,
                start: 'top 85%',
                once: true,
                onEnter: () => cta.classList.add('cta-pulse')
            })
        }
    }, root.value)
})

onBeforeUnmount(() => {
    try { ctx?.revert?.() } catch { }
})
</script>

<template>
    <section ref="root" class="relative text-[color:var(--brand-ivory,#f5efe6)]">
        <!-- Fond : wrapper unique (vidéo OU image) -->
        <div class="absolute inset-0 -z-10 overflow-hidden">
            <div ref="bgVisualRef" class="h-full w-full will-change-transform">
                <video class="h-full w-full object-cover filter blur-[2px]" :poster="bgPoster || undefined"
                    preload="auto" autoplay muted playsinline loop>
                    <source :src="bgVideo" type="video/mp4" />
                    <source :src="vid" type="video/webm" />
                </video>
                <!-- <ImageSmart v-else :src="bgPoster" alt="Fond" :w="1600" :h="900"
                    imgClass="h-full w-full object-cover filter blur-[2px]" /> -->
            </div>
            <!-- Assombrissement -->
            <div ref="overlayRef" class="absolute inset-0 bg-[color:var(--brand-black,#0b0b0c)]/60"></div>
        </div>

        <!-- Carte / Contenu -->
        <div class="mx-auto my-6 sm:my-10 max-w-6xl rounded-[28px]
             border border-[color:var(--brand-gold,#caa45f)]/30
             bg-[color:var(--brand-black,#0b0b0c)]/70 backdrop-blur-[3px]
             shadow-[0_40px_120px_-50px_rgba(0,0,0,.85)] overflow-hidden">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
                <!-- Colonne gauche : occupation, bio, site, réseaux, sponsors -->
                <div class="p-6 sm:p-10 space-y-6 md:space-y-8">
                    <h1 data-occupation class="text-3xl sm:text-5xl font-semibold tracking-tight">
                        {{ occupation }}
                    </h1>

                    <p data-bio class="text-[color:var(--brand-ivory,#f5efe6)]/85 leading-relaxed">
                        {{ bio }}
                    </p>

                    <!-- Réseaux sociaux -->
                    <ul class="flex flex-wrap gap-3 sm:gap-4 pt-2">
                        <li v-for="(s, i) in socials" :key="i" data-social>
                            <a :href="s.href" target="_blank" rel="noopener" class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.06] px-3 py-2
                        hover:bg-white/10 focus:outline-none focus-visible:ring-2
                        focus-visible:ring-[color:var(--brand-gold,#caa45f)]/50 transition">
                                <i :class="s.icon" aria-hidden="true"></i>
                                <!-- <span class="text-sm">{{ s.label }}</span> -->
                            </a>
                        </li>
                    </ul>

                    <!-- Sponsors -->
                    <div class="pt-2">
                        <div class="text-xs uppercase tracking-wider text-white/60 mb-2">Sponsors</div>
                        <div class="flex flex-wrap items-center gap-4 sm:gap-6">
                            <a v-for="(sp, i) in sponsors" :key="i" :href="sp.href || '#'" target="_blank"
                                rel="noopener" class="opacity-90 hover:opacity-100 transition">
                                <img :src="sp.src" :alt="sp.alt || 'Sponsor'" data-sponsor
                                    class="h-8 sm:h-10 object-contain" />
                            </a>
                        </div>
                    </div>
                </div>
                <!-- Colonne droite : Logo composite (haut/bas empilés) -->
                <div class="relative min-h-[46svh] md:min-h-[60svh] grid place-items-center p-6 sm:p-10">
                    <div class="relative w-full max-w-md aspect-[1/1] [--seam:8%] [--partH:60%]">
                        <!-- Partie HAUTE -->
                        <img v-if="leftLogo" :src="leftLogo" alt="Logo (partie haute)" data-logo-left class="absolute  top-0 mt-2  -translate-x-1/2 -translate-y-[calc(50%+var(--seam))]
              object-contain pointer-events-none select-none" />

                        <!-- Partie BASSE -->
                        <img v-if="rightLogo" :src="rightLogo" alt="Logo (partie basse)" data-logo-right class="absolute top-36  -translate-x-1/2 translate-y-[calc(50%-var(--seam))]
             object-contain pointer-events-none select-none" />

                        <!-- Liseré doré discret -->
                        <div class="absolute inset-0 rounded-2xl ring-1 ring-[color:var(--brand-gold,#caa45f)]/25" />
                    </div>
                </div>

            </div>

            <!-- CTA global en bas -->
            <div class="px-6 pb-6 sm:px-10 sm:pb-10">
                <div class="flex justify-center">
                    <a :href="ctaHref" data-cta class="group relative inline-flex items-center gap-3 rounded-full
                    border border-[color:var(--brand-gold,#caa45f)]/40 bg-white/[.06]
                    px-6 py-3 text-base font-medium
                    hover:bg-white/10 focus:outline-none focus-visible:ring-2
                    focus-visible:ring-[color:var(--brand-gold,#caa45f)]/60">
                        <span>Rejoignez-moi&nbsp;!</span>
                        <i class="fa-solid fa-arrow-right-long" aria-hidden="true"></i>
                        <span
                            class="pointer-events-none absolute inset-0 rounded-full ring-2 ring-[color:var(--brand-gold,#caa45f)]/35 opacity-0 group-hover:opacity-100 transition"></span>
                    </a>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
/* Palette conforme — avec noms explicites (les variables incomplètes du brief sont normalisées ici) */
:host,
section {
    --brand-black: #0b0b0c;
    /* noir profond */
    --brand-ivory: #f5efe6;
    /* ivoire */
    --brand-gold: #caa45f;
    /* or */
    --brand-red: #b0142b;
    /* rouge couture (≈30% d’usage) */

    background-color: var(--brand-black);
    color: var(--brand-ivory);
}

/* Pulse CTA (ajouté au premier aperçu via ScrollTrigger) */
@keyframes pulseSoft {
    0% {
        box-shadow: 0 0 0 0 rgba(202, 164, 95, 0.30);
        transform: translateZ(0)
    }

    70% {
        box-shadow: 0 0 0 18px rgba(202, 164, 95, 0.00)
    }

    100% {
        box-shadow: 0 0 0 0 rgba(202, 164, 95, 0.00)
    }
}

.cta-pulse {
    animation: pulseSoft 2.2s ease-out infinite
}

/* Accessibilité motion */
@media (prefers-reduced-motion: reduce) {
    .cta-pulse {
        animation: none
    }
}
</style>
