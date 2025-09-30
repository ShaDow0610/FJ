<script setup>
const props = defineProps({
  partner: {
    type: Object,
    required: true, // { name:string, logo:string, url:string }
  }
})
</script>

<template>
  <a :href="partner.url" target="_blank" rel="noopener" :aria-label="partner.name" class="group relative overflow-hidden rounded-xl border border-white/10
           bg-white/[.03] transition
           focus:outline-none focus-visible:ring-2 focus-visible:ring-[#caa45f]
           grid place-items-center p-4 sm:p-6
           hover:-translate-y-[2px] hover:border-[color:#caa45f]/70">
    <img :src="partner.logo" :alt="partner.name" class="max-h-16 sm:max-h-20 w-auto object-contain
             opacity-90 group-hover:opacity-100
             transition duration-200
             brightness-100 group-hover:brightness-125" loading="lazy" decoding="async" />
    <div class="absolute inset-x-2 bottom-2 text-[10px] sm:text-xs text-white/60 truncate pointer-events-none">
      {{ partner.name }}
    </div>
  </a>
</template>
