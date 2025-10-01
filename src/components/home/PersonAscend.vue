<!-- PortfolioHeroReveal.vue — Tailwind + FA + meilleure dispersion aléatoire -->
<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { gsap } from '@/plugins/gsap'
import { useReducedMotion } from '@/composables/useReducedMotion'

import project1 from '/imageOfProject1.png'
import project2 from '/imageOfProject2.png'
import project3 from '/imageOfProject3.png'
import project4 from '/imageOfProject4.png'
import project5 from '/imageOfProject5.png'
import imageOfProject1 from '/project11.png'
import imageOfProject2 from '/project2.png'
import imageOfProject3 from '/project3.png'
import imageOfProject4 from '/project4.png'
import imageOfProject5 from '/project5.png'

const props = defineProps({
    title: { type: String, default: 'PROJECTS LIST' },
    subtitle: { type: String, default: 'Here you can see the top projects we are working on ahave an idea of what it demandes to run such a projet. You ca also access directely to the platform on which the projet is been posted' },
    flavours: {
        type: Array,
        default: () => ([
            {
                id: 'project1', bg: '#86a8d8', blob: '#6f93cb', imgBowl: project1, thumb: imageOfProject1, alt: 'Blue smoothie bowl',
                title: 'Outfit Chalenge', desc: 'Antioxydants & fraîcheur éclatante pour bien démarrer.',
                socials: [{ label: 'Instagram', href: '#' }, { label: 'TikTok', href: '#' }, { label: 'Snapchat', href: '#' }, { label: 'YouTube', href: '#' }, { label: 'Facebook', href: '#' }]
            },
            {
                id: 'project2', bg: '#f6c24d', blob: '#edb23b', imgBowl: project2, thumb: imageOfProject2, alt: 'Mango smoothie bowl',
                title: 'Douala Fashion week', desc: 'Sucré–soleil, onctueux et joyeux comme l’été.',
                socials: [{ label: 'Instagram', href: '#' }, { label: 'TikTok', href: '#' }, { label: 'Snapchat', href: '#' }, { label: 'Facebook', href: '#' }]
            },
            {
                id: 'project3', bg: '#f08ab0', blob: '#e46c96', imgBowl: project3, thumb: imageOfProject3, alt: 'Berry smoothie bowl',
                title: 'Total Relooking', desc: 'Fruits rouges, peps et vitamines pour performer.',
                socials: [{ label: 'Instagram', href: '#' }, { label: 'TikTok', href: '#' }, { label: 'Snapchat', href: '#' }, { label: 'Facebook', href: '#' }]
            },
            {
                id: 'project4', bg: '#c5e07a', blob: '#b2cf63', imgBowl: project4, thumb: imageOfProject4, alt: 'Kiwi smoothie bowl',
                title: 'Dress Up Me', desc: 'Vert tonique, léger, vif — le coup de clean.',
                socials: [{ label: 'Instagram', href: '#' }, { label: 'TikTok', href: '#' }, { label: 'Snapchat', href: '#' }, { label: 'Facebook', href: '#' }]
            },
            {
                id: 'project5', bg: '#c5e07a', blob: '#b2cf63', imgBowl: project5, thumb: imageOfProject5, alt: 'Kiwi smoothie bowl',
                title: '10K Relooking', desc: 'Vert tonique, léger, vif — le coup de clean.',
                socials: [{ label: 'Instagram', href: '#' }, { label: 'TikTok', href: '#' }, { label: 'Snapchat', href: '#' }, { label: 'Facebook', href: '#' }]
            }
        ])
    },
    initialId: { type: String, default: 'project1' },
    withAutoplay: { type: Boolean, default: false },
    autoplayDelay: { type: Number, default: 5200 }
})

/* REFS */
const root = ref(null)
const bowlWrap = ref(null)
const bowlA = ref(null)
const bowlB = ref(null)
const titleEl = ref(null)
const subtitleEl = ref(null)
const thumbsWrap = ref(null)
const blobEl = ref(null)
const pager = ref(null)

/* STATE */
const { reduced } = useReducedMotion()
let ctx, hoverTween, autoplayTimer, currentImgKey = 'A', ro
const state = reactive({
    activeIndex: Math.max(0, props.flavours.findIndex(f => f.id === props.initialId)),
    bg: props.flavours[0]?.bg || '#86a8d8',
    blob: props.flavours[0]?.blob || '#6f93cb',
    showDetail: false,
    locked: false
})

/* ---------- FA icons mapping ---------- */
const brandIcon = (label) => {
    const key = (label || '').toLowerCase()
    if (key.includes('instagram')) return 'fa-brands fa-instagram'
    if (key.includes('tiktok')) return 'fa-brands fa-tiktok'
    if (key === 'x' || key.includes('twitter')) return 'fa-brands fa-x-twitter'
    if (key.includes('facebook')) return 'fa-brands fa-facebook'
    if (key.includes('youtube')) return 'fa-brands fa-youtube'
    if (key.includes('snap')) return 'fa-brands fa-snapchat'
    return 'fa-solid fa-link'
}

/* ---------- Positions “plus aléatoires & séparées” ---------- */
/* PRNG stable */
function seedRand(seedStr) {
    let h = 2166136261 >>> 0; for (let i = 0; i < seedStr.length; i++) { h ^= seedStr.charCodeAt(i); h = Math.imul(h, 16777619) }
    return () => { h += 0x6D2B79F5; let t = Math.imul(h ^ h >>> 15, 1 | h); t ^= t + Math.imul(t ^ t >>> 7, 61 | t); return ((t ^ t >>> 14) >>> 0) / 4294967296 }
}
/* Rejet angulaire + jitter radial pour mieux espacer; rayon un peu plus large */
function socialsPositions(flavour) {
    const r = seedRand(flavour.id), n = (flavour.socials?.length || 0)
    const used = []
    const minSep = 0.9 - Math.min(0.4, n * 0.06)  // sep angulaire (rad) plus généreuse
    return Array.from({ length: n }).map((_, i) => {
        let a, tries = 0
        do { a = r() * Math.PI * 2; tries++ } while (used.some(x => Math.abs(Math.atan2(Math.sin(a - x), Math.cos(a - x))) < minSep) && tries < 80)
        used.push(a)
        const jitter = (r() - 0.5) * 0.08
        const rad = 0.64 + r() * 0.28 + jitter     // 0.64–0.92R
        const x = Math.cos(a) * rad * 50
        const y = Math.sin(a) * rad * 50
        return { x, y, delay: .22 + i * .07 }
    })
}

/* Helpers */
const FLAV = () => props.flavours[state.activeIndex] || props.flavours[0]
function applyTheme({ bg, blob }, animate = true) {
    const vars = { '--bg': bg, '--blob': blob }
    if (!animate || reduced.value) Object.entries(vars).forEach(([k, v]) => root.value?.style.setProperty(k, v))
    else gsap.to(root.value, { duration: .45, ease: 'power1.out', ...Object.fromEntries(Object.entries(vars)) })
    state.bg = bg; state.blob = blob
}
function swapBowl(nextUrl) {
    const inEl = currentImgKey === 'A' ? bowlB.value : bowlA.value
    const outEl = currentImgKey === 'A' ? bowlA.value : bowlB.value
    inEl.src = nextUrl
    gsap.set(inEl, { autoAlpha: 0, rotate: -5, scale: 0.98 })
    gsap.timeline({ defaults: { ease: 'power2.out' } })
        .to(outEl, { autoAlpha: 0, rotate: 5, scale: 0.98, duration: .32 }, 0)
        .to(inEl, { autoAlpha: 1, rotate: 0, scale: 1, duration: .38 }, 0.08)
        .set(outEl, { visibility: 'hidden' })
    currentImgKey = currentImgKey === 'A' ? 'B' : 'A'
}

/* Autoplay */
function pauseAutoplay() { clearInterval(autoplayTimer); autoplayTimer = null }
function resumeAutoplay() {
    if (!props.withAutoplay || state.locked || reduced.value) return
    pauseAutoplay()
    autoplayTimer = setInterval(() => next(), Math.max(2500, props.autoplayDelay))
}
document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseAutoplay()
    else if (!state.locked) resumeAutoplay()
})

/* Navigation — bloquée si locked */
function goTo(index, userTriggered = false) {
    if (state.locked) return
    if (index === state.activeIndex || index < 0 || index >= props.flavours.length) return
    state.activeIndex = index
    const f = FLAV()
    applyTheme({ bg: f.bg, blob: f.blob }, true)
    if (!reduced.value) swapBowl(f.imgBowl)
    else (currentImgKey === 'A' ? bowlA.value : bowlB.value).src = f.imgBowl
    state.showDetail = false
    if (userTriggered) resumeAutoplay()
    animateSocialsIn()
}
function next() { goTo((state.activeIndex + 1) % props.flavours.length) }

/* Pager snap */
function snapToDetail(on) {
    state.showDetail = on
    const el = pager.value; if (!el) return
    el.scrollTo({ left: on ? el.clientWidth : 0, behavior: reduced.value ? 'auto' : 'smooth' })
}

/* Anim badges */
function animateSocialsIn() {
    const items = Array.from(document.querySelectorAll('.social-badge'))
    if (reduced.value || !items.length) return
    gsap.killTweensOf(items)
    gsap.fromTo(items, { autoAlpha: 0, y: 8, scale: .9 }, { autoAlpha: 1, y: 0, scale: 1, duration: .38, ease: 'power2.out', stagger: .06 })
}

/* Lifecycle */
onMounted(async () => {
    await nextTick()
    const f0 = FLAV()
    applyTheme({ bg: f0.bg, blob: f0.blob }, false)
    bowlA.value.src = f0.imgBowl; bowlB.value.src = f0.imgBowl

    if (!root.value) return
    ctx = gsap.context((self) => {
        gsap.set([titleEl.value, subtitleEl.value, thumbsWrap.value], { autoAlpha: 0, y: 18 })
        gsap.set(bowlWrap.value, { autoAlpha: 0, scale: 0.9, rotate: -2 })
        gsap.set(blobEl.value, { scale: 0.85, y: 20, transformOrigin: '50% 50%' })

        if (reduced.value) {
            gsap.set([titleEl.value, subtitleEl.value, thumbsWrap.value, bowlWrap.value, blobEl.value], { clearProps: 'all', autoAlpha: 1, y: 0, scale: 1, rotate: 0 })
        } else {
            gsap.timeline({ defaults: { ease: 'power3.out' } })
                .to(blobEl.value, { duration: .6, scale: 1, y: 0 }, 0.05)
                .to(bowlWrap.value, { duration: .6, autoAlpha: 1, scale: 1, rotate: 0 }, 0.2)
                .to(titleEl.value, { duration: .5, autoAlpha: 1, y: 0 }, 0.28)
                .to(subtitleEl.value, { duration: .5, autoAlpha: 1, y: 0 }, 0.36)
                .to(thumbsWrap.value, { duration: .5, autoAlpha: 1, y: 0 }, 0.44)

            const mql = window.matchMedia('(pointer:fine)')
            if (mql.matches) {
                const onMove = (e) => {
                    const r = bowlWrap.value.getBoundingClientRect()
                    const dx = (e.clientX - (r.left + r.width / 2)) / r.width
                    const dy = (e.clientY - (r.top + r.height / 2)) / r.height
                    hoverTween?.kill()
                    hoverTween = gsap.to(bowlWrap.value, { x: dx * 12, y: dy * 12, rotate: dx * 4, duration: .3, overwrite: 'auto' })
                }
                root.value.addEventListener('pointermove', onMove, { passive: true })
                root.value.addEventListener('pointerleave', () => gsap.to(bowlWrap.value, { x: 0, y: 0, rotate: 0, duration: .4 }), { passive: true })
                self.add(() => { root.value?.removeEventListener('pointermove', onMove) })
            }
        }

        // Re-snap au resize (rotation mobile)
        try {
            ro = new ResizeObserver(() => snapToDetail(state.showDetail))
            ro.observe(pager.value)
            self.add(() => ro?.disconnect?.())
        } catch { }
    }, root.value)

    resumeAutoplay()
    animateSocialsIn()
})

onBeforeUnmount(() => { try { pauseAutoplay(); ctx?.revert?.(); ro?.disconnect?.() } catch { } })

watch(() => state.showDetail, (open) => {
    state.locked = !!open
    root.value?.classList.toggle('is-locked', !!open)
    if (open) pauseAutoplay(); else resumeAutoplay()
})

function openDetail() { snapToDetail(true) }
function closeDetail() { snapToDetail(false) }
</script>

<template>
    <section ref="root" class="smoothie-hero min-h-svh text-white">
        <div
            class="container mx-auto grid grid-cols-1 gap-4 md:gap-8 items-center px-3 md:px-10 pt-safe pb-safe md:min-h-svh md:grid-cols-[1.05fr_1fr]">
            <!-- Colonne gauche -->
            <div class="col left">
                <div class="brand font-bold tracking-tight/5 opacity-90 mb-2">Projects</div>
                <h1 ref="titleEl"
                    class="title font-extrabold leading-tight tracking-wider text-[clamp(26px,6.2vw,56px)]">
                    {{ title }}
                </h1>
                <p ref="subtitleEl" class="subtitle mt-2 max-w-[52ch] leading-relaxed opacity-90">
                    {{ subtitle }}
                </p>

                <div ref="thumbsWrap"
                    class="thumbs flex gap-2 mt-4 overflow-x-auto pb-1 scroll-px-3 snap-x snap-proximity" role="tablist"
                    aria-label="Flavours" :inert="state.locked ? '' : null">
                    <button v-for="(f, i) in flavours" :key="f.id" :aria-pressed="state.activeIndex === i"
                        :aria-disabled="state.locked" :disabled="state.locked" :tabindex="state.locked ? -1 : 0"
                        @click="goTo(i, true)" class="thumb relative shrink-0 snap-start rounded-full p-[2px] border-2 transition
                   w-[clamp(44px,12vw,64px)] h-[clamp(44px,12vw,64px)]
                   bg-white/15 border-transparent hover:scale-105
                   data-[active=true]:border-white/90 data-[disabled=true]:opacity-55"
                        :data-active="state.activeIndex === i" :data-disabled="state.locked">
                        <img :src="f.thumb" :alt="f.alt" loading="lazy" decoding="async"
                            class="w-full h-full object-cover rounded-full block" />
                    </button>
                </div>
            </div>

            <!-- Colonne droite : pager -->
            <div class="col right relative">
                <div ref="blobEl" class="blob absolute md:inset-y-0 md:right-[6%] md:left-0 -z-0 hidden sm:block"></div>

                <div ref="pager" class="pager relative z-[1] w-full overflow-hidden grid grid-flow-col auto-cols-[100%]
                    overflow-x-auto snap-x snap-mandatory scrollbar-none touch-pan-x overscroll-contain md:mt-2">
                    <!-- SLIDE 1 — Image -->
                    <div class="slide image snap-start py-2">
                        <div ref="bowlWrap"
                            class="bowl-wrap relative  aspect-square w-[min(92vw,640px)] content-visibility-auto">
                            <img ref="bowlA" class="bowl absolute inset-0 w-full h-full object-cover rounded-full"
                                alt="" draggable="false" />
                            <img ref="bowlB"
                                class="bowl bowl-b absolute inset-0 w-full h-full object-cover rounded-full" alt=""
                                draggable="false" />
                            <div class="shadow absolute left-[8%] right-[8%] bottom-[2%] h-[12%] -z-10"></div>

                            <!-- Badges sociaux dispersés -->
                            <template v-for="(s, idx) in FLAV().socials" :key="s.label">
                                <a class="social-badge absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                         px-2 py-1 rounded-full text-[0.8rem] font-semibold text-neutral-900 bg-white
                         shadow-[0_6px_14px_rgba(0,0,0,0.18)] transition
                         hover:brightness-105" :href="s.href" target="_blank" rel="noopener" :style="{
                            '--sx': socialsPositions(FLAV())[idx]?.x + '%',
                            '--sy': socialsPositions(FLAV())[idx]?.y + '%',
                            '--delay': (socialsPositions(FLAV())[idx]?.delay || 0.3) + 's'
                        }" :aria-label="s.label">
                                    <i :class="brandIcon(s.label)" class="mr-1"></i>{{ s.label }}
                                </a>
                            </template>
                        </div>

                        <button @click="openDetail" class="toggle-detail mx-auto mt-3 inline-flex items-center justify-center rounded-full
                           font-bold text-neutral-900 bg-white border border-black/10
                           shadow-[0_6px_20px_-8px_rgba(0,0,0,0.25)] px-4 py-2">
                            <i class="fa-regular fa-circle-info mr-2"></i> Voir le détail
                        </button>
                    </div>

                    <!-- SLIDE 2 — Détail -->
                    <div class="slide detail snap-start py-2 grid place-items-center">
                        <div
                            class="detail-card w-[min(92vw,560px)] rounded-2xl text-white px-5 py-5 md:py-7 shadow-2xl backdrop-blur-sm content-visibility-auto">
                            <h2 class="detail-title text-[clamp(20px,4.4vw,28px)] font-extrabold tracking-tight"
                                :id="`h-${FLAV().id}`">
                                {{ FLAV().title }}
                            </h2>
                            <p class="detail-desc mt-2 leading-7 opacity-90">
                                {{ FLAV().desc }}
                            </p>

                            <div class="detail-socials flex flex-wrap gap-2 mt-3">
                                <a v-for="s in FLAV().socials" :key="s.label" :href="s.href" target="_blank"
                                    rel="noopener"
                                    class="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white text-neutral-900 font-bold">
                                    <i :class="brandIcon(s.label)"></i>{{ s.label }}
                                </a>
                            </div>

                            <div class="detail-actions mt-4 flex justify-end">
                                <button @click="closeDetail" class="toggle-detail ghost inline-flex items-center gap-2 rounded-full border px-4 py-2
                               bg-transparent text-white/95 border-white/40">
                                    <i class="fa-regular fa-image"></i> Voir l’image
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
</template>

<style scoped>
/* Thème dynamiques (depuis JS) */
.smoothie-hero {
    --bg: #86a8d8;
    --blob: #6f93cb;
    background: var(--bg);
    color: #fff
}

/* Blob organique */
.blob {
    width: clamp(240px, 58vw, 640px);
    height: clamp(240px, 58vw, 640px);
    filter: drop-shadow(0 30px 50px rgba(0, 0, 0, .20));
    background:
        radial-gradient(120% 100% at 70% 20%, color-mix(in oklab, var(--blob) 82%, transparent) 0 60%, transparent 61%) 0 0 / 100% 100% no-repeat,
        radial-gradient(100% 90% at 20% 80%, color-mix(in oklab, var(--blob) 72%, transparent) 0 62%, transparent 63%) 0 0 / 100% 100% no-repeat;
    border-radius: 42% 58% 60% 40% / 38% 44% 56% 62%;
}

@media (max-width:560px) {
    .blob {
        position: relative;
        inset: auto;
        width: min(92vw, 520px);
        height: min(92vw, 520px)
    }
}

/* Ombre du bol */
.shadow {
    background: radial-gradient(60% 70% at 50% 50%, rgba(0, 0, 0, .35), transparent 70%);
    filter: blur(6px);
}

/* Badges sociaux : animation & position */
.social-badge {
    transform: translate(calc(var(--sx)), calc(var(--sy)));
    animation: popIn .44s ease var(--delay, .3s) both;
}

@keyframes popIn {
    from {
        opacity: 0;
        transform: translate(calc(var(--sx)), calc(var(--sy))) scale(.9)
    }

    to {
        opacity: 1;
        transform: translate(calc(var(--sx)), calc(var(--sy))) scale(1)
    }
}

/* Détail card: fond teinté par le blob */
.detail-card {
    background: color-mix(in oklab, #000 10%, var(--blob));
}

/* Utilitaires “safe areas” si non présents dans ta config Tailwind */
.pt-safe {
    padding-top: max(12px, env(safe-area-inset-top))
}

.pb-safe {
    padding-bottom: max(12px, env(safe-area-inset-bottom))
}

/* Masquer scrollbar WebKit du pager */
.scrollbar-none::-webkit-scrollbar {
    display: none
}
</style>
