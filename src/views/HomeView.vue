<!-- HomeView.vue -->
<script setup>
import { onMounted } from 'vue'
import { setMeta } from '@/utils/meta'

// Composants
import HeroShowcase from '@/components/home/HeroShowcase.vue'
import PersonAscend from '@/components/home/PersonAscend.vue'

// Médias (exemples)
import bgPoster from '/tou1.jpg'     // utilisé comme poster/fallback
import bgVideo from '/Tt.webm' // si tu as une vidéo de fond, décommente et passe-la en prop
import leftLogo from '/logo1.png'
import RightLogo from '/logo2.png'

// Données UI
const occupation = 'Créateur / Visionnaire'
const bio = `Un portrait qui avance au rythme du regard — la matière, la ville,
et la présence fusionnent pour une élégance en mouvement.`

/**
 * Font Awesome Free — marques
 * Icônes réseaux (labels + classes fa-brands) :
 *  - YouTube   : fa-brands fa-youtube
 *  - Facebook  : fa-brands fa-facebook
 *  - TikTok    : fa-brands fa-tiktok
 *  - Instagram : fa-brands fa-instagram
 *  - X (Twitter): fa-brands fa-x-twitter
 */
const socials = [
    { label: 'YouTube', icon: 'fa-brands fa-youtube', href: 'https://youtube.com/' },
    { label: 'Snapchat', icon: 'fa-brands fa-snapchat', href: 'https://x.com/' },
    { label: 'Facebook', icon: 'fa-brands fa-facebook', href: 'https://facebook.com/' },
    { label: 'TikTok', icon: 'fa-brands fa-tiktok', href: 'https://tiktok.com/' },
    { label: 'Instagram', icon: 'fa-brands fa-instagram', href: 'https://instagram.com/' },
    { label: 'X', icon: 'fa-brands fa-x-twitter', href: 'https://x.com/' }
]

/**
 * Sponsors en Font Awesome Free (brands)
 * (Exemples : Visa, Mastercard, PayPal, Spotify, Apple)
 * Remarque : ici on utilise des <i> FA au lieu d’images.
 * Le composant HeroShowcase accepte déjà des sponsors avec src (images),
 * mais on peut fournir des "fake src" et afficher via slot; pour rester simple,
 * on passe une liste d’objets et le composant affichera les <i> s.icon.
 */
const sponsors = [
    { label: 'Visa', icon: 'fa-brands fa-cc-visa', href: '#' },
    { label: 'Mastercard', icon: 'fa-brands fa-cc-mastercard', href: '#' },
    { label: 'PayPal', icon: 'fa-brands fa-cc-paypal', href: '#' },
    { label: 'Spotify', icon: 'fa-brands fa-spotify', href: '#' },
    { label: 'Apple', icon: 'fa-brands fa-apple', href: '#' }
]

// Lien site + CTA
const site = { label: 'Creativity by FJ', href: 'https://example.com' }
const ctaHref = 'https://t.me/ton_canal' // ou autre call-to-action

onMounted(() => {
    setMeta({
        title: 'L’élégance en mouvement — Portrait cinématographique',
        description: 'Une vitrine noire & or, un rideau ivoire, un portrait qui monte au scroll.'
    })
})
</script>

<template>
    <main id="main" class="relative isolate">
        <!-- HERO corrigé : passe les nouvelles props -->
        <HeroShowcase :bgPoster="bgPoster" :bgVideo="bgVideo" :leftLogo="leftLogo" :rightLogo="RightLogo"
            :occupation="occupation" :bio="bio" :site="site" :socials="socials" :sponsors="sponsors"
            :ctaHref="ctaHref" />

        <PersonAscend :withAutoplay="true" :autoplayDelay="5200" />

        <!-- PersonAscend : ok; conserve tes props actuelles -->
        <!-- <PersonAscend :leftLogo="leftRightLogo" :rightLogo="leftRightLogo" :virtualVH="600" :maxWidthPx="850" /> -->
    </main>
</template>

<style scoped>
main {
    background-color: var(--brand-black);
}

/* Petite aide de style pour les icônes sponsors si besoin d’un peu plus de présence */
:deep([data-sponsor-fa]) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 2.25rem;
    /* ~36px */
    width: 2.25rem;
    border-radius: .75rem;
    border: 1px solid rgba(255, 255, 255, .15);
    background: rgba(255, 255, 255, .06);
}
</style>
