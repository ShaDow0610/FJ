<template>
  <div class="min-h-screen text-white">
    <HeaderBar />
    <main class="min-h-[80vh]"><router-view /></main>
    <SiteFooter />
  </div>
</template>
<script setup>
import HeaderBar from '@/components/layout/HeaderBar.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
</script>
