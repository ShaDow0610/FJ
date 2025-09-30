<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { setMeta } from '@/utils/meta'
import StoryAct from '@/components/about/StoryAct.vue'

const { t } = useI18n()

/** Acts (titres/copies depuis i18n, médias locaux) */
const acts = computed(() => ([
    { id: 'ab-1', title: t('about.origins.title'), copy: t('about.origins.copy'), media: '/assets/about/origines.avif' },
    { id: 'ab-2', title: t('about.motion.title'), copy: t('about.motion.copy'), media: '/assets/about/mouvement.avif' },
    { id: 'ab-3', title: t('about.vision.title'), copy: t('about.vision.copy'), media: '/assets/about/vision.avif' },
]))

onMounted(() => {
    setMeta({
        title: t('about.meta.title'),
        description: t('about.meta.description')
    })
})
</script>

<template>
    <main id="main" class="relative isolate text-white">
        <!-- En-tête éditorial -->
        <section class="pt-10 sm:pt-14">
            <div class="max-w-7xl mx-auto px-4 sm:px-6">
                <header class="mb-6 sm:mb-10">
                    <h1 class="text-3xl sm:text-4xl font-semibold tracking-tight">
                        {{ t('about.title') }}
                    </h1>
                    <p class="mt-2 text-white/70 text-sm sm:text-base max-w-2xl">
                        {{ t('about.lede') }}
                    </p>
                </header>
            </div>
        </section>

        <!-- Triptyque — StoryAct x3 -->
        <Section aria-labelledby="story-acts">
            <h2 id="story-acts" class="sr-only">Manifeste en trois actes</h2>
            <div>
                <StoryAct v-for="(a, i) in acts" :key="a.id" :title="a.title" :copy="a.copy" :media="a.media"
                    :reverse="i % 2 === 1" />
            </div>
        </Section>
    </main>
</template>

<style scoped>
/* Fond éditorial luxe, discret */
main::before {
    content: '';
    position: absolute;
    inset: -10%;
    background:
        radial-gradient(35% 35% at 15% 20%, rgba(202, 164, 95, .10), transparent 60%),
        radial-gradient(45% 45% at 85% 30%, rgba(255, 255, 255, .06), transparent 65%),
        linear-gradient(to bottom, rgba(0, 0, 0, .15), transparent 40%, rgba(0, 0, 0, .25));
    filter: saturate(110%);
    z-index: -1;
}
</style>
