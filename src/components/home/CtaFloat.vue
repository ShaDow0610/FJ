<template>
    <button class="cta-float btn-round" v-tilt aria-label="Explore">
        ➜
    </button>
</template>

<script>
export default { name: 'CtaFloat' }
</script>

<style scoped>
.cta-float {
    position: fixed;
    right: 18px;
    bottom: 18px;
    z-index: 40;
    color: #0b0b0c;
    background: var(--accent);
    border-color: rgba(0, 0, 0, .15);
}

.cta-float:hover {
    filter: brightness(1.05);
}
</style>