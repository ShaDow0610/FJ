<!-- src/components/home/IvoryWipe.vue -->
<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { gsap, ScrollTrigger } from '@/plugins/gsap'
import { useReducedMotion } from '@/composables/useReducedMotion'

const props = defineProps({
    title: { type: String, default: 'Sculpté pour celles et ceux qui osent' },
    accentWord: { type: String, default: 'osent' },
    accent: { type: String, default: 'gold', validator: v => ['gold', 'red'].includes(v) },
    copy: { type: String, default: 'Lignes nettes, gestes sûrs. Une mise en scène noir / or / ivoire, ponctuée d’un rouge qui ne tremble pas.' },
    distance: { type: Number, default: 200 } // longueur de la séquence (en % de viewport)
})

const root = ref(null)     // section IvoryWipe (déclencheur)
const curtain = ref(null)  // calque ivoire (pinné)
const h2 = ref(null)
const p = ref(null)

const { reduced } = useReducedMotion()
let ctx

function splitAccent(text, word) {
    if (!text || !word) return { before: text, accent: '', after: '' }
    const i = text.toLowerCase().indexOf(word.toLowerCase())
    if (i < 0) return { before: text, accent: '', after: '' }
    return { before: text.slice(0, i), accent: text.slice(i, i + word.length), after: text.slice(i + word.length) }
}

onMounted(async () => {
    await nextTick()
    if (!root.value || !curtain.value) return

    ctx = gsap.context(() => {
        gsap.set(curtain.value, { yPercent: 100 })       // rideau sous l’écran
        gsap.set([h2.value, p.value], { autoAlpha: 0, y: 18 })

        if (reduced.value) {
            gsap.set(curtain.value, { yPercent: 0 })
            gsap.to(h2.value, { autoAlpha: 1, y: 0, duration: .5, ease: 'power2.out' })
            gsap.to(p.value, { autoAlpha: 1, y: 0, duration: .45, ease: 'power2.out', delay: .06 })
            return
        }

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: root.value,          // ✅ on déclenche sur la section IvoryWipe elle-même
                start: 'top top',             // ✅ dès qu’elle arrive après la fin du pin du Hero
                end: `+=${props.distance}%`,
                scrub: true,
                pin: curtain.value,           // ✅ on pin uniquement le calque rideau
                anticipatePin: 0.6,
                invalidateOnRefresh: true,
                // markers: true,              // décommenter pour debug
            },
            defaults: { ease: 'none' }
        })

        // A) le rideau MONTE et couvre la fenêtre
        tl.to(curtain.value, { yPercent: 0, duration: 0.4 }, 0)

        // B) apparition Titre → Paragraphe (au scroll)
        tl.add(() => {
            gsap.to(h2.value, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' })
            gsap.to(p.value, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.08 })
        }, 0.42)

        // (Facultatif) léger fade-out avant ouverture
        tl.add(() => {
            gsap.to([h2.value, p.value], { autoAlpha: 0, y: -6, duration: 0.3, ease: 'power1.out' })
        }, 0.58)

        // C) le rideau REDESCEND et dévoile la section suivante
        tl.to(curtain.value, { yPercent: 100, duration: 0.4 }, 0.6)
    }, root.value)

    requestAnimationFrame(() => ScrollTrigger.refresh())
})

onBeforeUnmount(() => { try { ctx?.revert?.() } catch { } })
</script>

<template>
    <!-- ⚠️ Section située juste APRÈS le Hero -->
    <section ref="root" class="ivory-section relative h-[1px] min-h-0" aria-label="Transition — Rideau ivoire">
        <div ref="curtain" class="curtain">
            <div class="curtain-inner">
                <h2 ref="h2" class="headline">
                    <span>{{ splitAccent(title, accentWord).before }}</span>
                    <span v-if="splitAccent(title, accentWord).accent" class="accent bg-clip-text text-transparent"
                        :class="accent === 'gold' ? 'accent-gold' : 'accent-red'">
                        {{ splitAccent(title, accentWord).accent }}
                    </span>
                    <span>{{ splitAccent(title, accentWord).after }}</span>
                </h2>
                <p ref="p" class="copy">{{ copy }}</p>
            </div>
        </div>
    </section>
</template>

<style scoped>
:root {
    --fg: #F6F5F1;
    --text: #0B0B0C;
    --gold: #C6A24A;
    --red: #B0142B;
}

.ivory-section {
    isolation: isolate;
}

/* ✅ évite les soucis de stacking */

.curtain {
    position: absolute;
    /* ✅ au repos; ScrollTrigger gère le fixed pendant pin */
    inset: 0;
    background: var(--fg);
    color: var(--text);
    display: grid;
    place-items: center;
    will-change: transform;
    z-index: 60;
    pointer-events: none;
}

.curtain-inner {
    max-width: min(92vw, 1000px);
    padding: 24px;
    text-align: center;
}

.headline {
    font-weight: 600;
    line-height: 1.05;
    letter-spacing: -0.01em;
    font-size: clamp(28px, 5vw, 56px);
    color: var(--text);
}

.copy {
    margin-top: .8rem;
    max-width: 46ch;
    margin-inline: auto;
    font-size: clamp(14px, 1.5vw, 18px);
    color: color-mix(in oklab, var(--text) 72%, transparent);
}

.accent-gold {
    background-image: linear-gradient(90deg, #B98C2E, var(--gold), #E0C879)
}

.accent-red {
    background-image: linear-gradient(90deg, #C0172F, var(--red), #F15A6B)
}
</style>
