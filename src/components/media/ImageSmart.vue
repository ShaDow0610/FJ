<script setup>
import { computed } from 'vue'
import { getImage, ratioBox } from '@/utils/images'

const props = defineProps({
    src: { type: String, required: true },
    alt: { type: String, required: true },
    w: { type: [Number, String], required: true },
    h: { type: [Number, String], required: true },
    /** classes utilitaires pour l’<img> (ex: "rounded-2xl object-cover") */
    imgClass: { type: String, default: '' },
    /** classes pour le wrapper */
    class: { type: String, default: '' }
})

const url = computed(() => getImage(props.src))
const ratioStyle = computed(() => ratioBox(Number(props.w), Number(props.h)))
</script>

<template>
    <figure class="relative block overflow-hidden" :class="props.class" :style="ratioStyle">
        <!-- Media en position absolue remplit le wrapper ratio -->
        <img :src="url" :alt="alt" loading="lazy" decoding="async"
            class="absolute inset-0 h-full w-full object-cover select-none" :class="imgClass" width="100%" height="100%"
            draggable="false" />
    </figure>
</template>
