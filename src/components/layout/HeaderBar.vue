<!-- NavBar.vue -->
<template>
    <header class="nav-wrap">
        <nav class="nav" role="navigation" aria-label="Navigation principale">
            <!-- Logo simple -->
            <a class="logo" href="/" aria-label="Accueil">
                <img :src="logo" class=" w-10 h-auto  pointer-events-none select-none object-cover filter" />
            </a>

            <!-- Liens de pages (toujours visibles sur desktop) -->
            <ul class="links" role="menubar">
                <li v-for="(p, i) in pages" :key="i" role="none">
                    <a :href="p.href" class="link" role="menuitem">{{ p.label }}</a>
                </li>

                <!-- Dropdown Réseaux (desktop) -->
                <li class="dropdown" role="none">
                    <button class="link dropbtn" :aria-expanded="open ? 'true' : 'false'" aria-haspopup="true"
                        @click="toggle()" @keydown.down.prevent="open = true; focusFirst()">
                        Réseaux
                        <i class="fa-solid fa-chevron-down caret" aria-hidden="true"></i>
                    </button>

                    <ul class="menu" v-show="open" role="menu" @keydown.esc.prevent="open = false" ref="menuRef">
                        <li v-for="(s, i) in socials" :key="'s' + i" role="none">
                            <a :href="s.href" target="_blank" rel="noopener" class="menu-item" role="menuitem"
                                ref="itemsRef">
                                <i :class="s.icon" aria-hidden="true"></i>
                                <span>{{ s.label }}</span>
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>

            <!-- Bouton mobile -->
            <button class="burger" @click="mobileOpen = !mobileOpen" :aria-expanded="mobileOpen ? 'true' : 'false'">
                <span class="bar"></span><span class="bar"></span><span class="bar"></span>
            </button>

            <!-- Menu mobile -->
            <transition name="fade">
                <div class="mobile" v-if="mobileOpen" @click.self="mobileOpen = false">
                    <div class="panel" role="dialog" aria-modal="true">
                        <ul class="m-links">
                            <li v-for="(p, i) in pages" :key="'m' + i">
                                <a :href="p.href" class="m-link" @click="mobileOpen = false">{{ p.label }}</a>
                            </li>
                        </ul>
                        <div class="m-title">Réseaux</div>
                        <div class="m-icons">
                            <a v-for="(s, i) in socials" :key="'mi' + i" :href="s.href" target="_blank" rel="noopener"
                                class="m-pill" @click="mobileOpen = false">
                                <i :class="s.icon" aria-hidden="true"></i>
                                <span class="sr-only">{{ s.label }}</span>
                            </a>
                        </div>
                    </div>
                </div>
            </transition>
        </nav>
    </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import ImageSmart from '@/components/media/ImageSmart.vue'
import logo from '@/assets/logo3.png'

const pages = ref([
    { label: 'Home', href: '/' },
    { label: 'Properties', href: '/properties' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
])

// Font Awesome Free (brands)
const socials = ref([
    { label: 'YouTube', icon: 'fa-brands fa-youtube', href: 'https://youtube.com/' },
    { label: 'Facebook', icon: 'fa-brands fa-facebook', href: 'https://facebook.com/' },
    { label: 'TikTok', icon: 'fa-brands fa-tiktok', href: 'https://tiktok.com/' },
    { label: 'Instagram', icon: 'fa-brands fa-instagram', href: 'https://instagram.com/' },
    { label: 'X', icon: 'fa-brands fa-x-twitter', href: 'https://x.com/' }
])

const open = ref(false)
const mobileOpen = ref(false)
const menuRef = ref(null)
const itemsRef = ref([])

function onDocClick(e) {
    if (!menuRef.value) return
    const btn = e.target.closest('.dropbtn')
    const inside = menuRef.value.contains(e.target)
    if (!btn && !inside) open.value = false
}
function toggle() { open.value = !open.value }
async function focusFirst() {
    await nextTick()
    const items = menuRef.value?.querySelectorAll('.menu-item')
    if (items && items.length) items[0].focus()
}

onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>

<style scoped>
/* Palette luxe */
:host,
.nav-wrap {
    --brand-black: #0b0b0c;
    --brand-ivory: #f5efe6;
    --brand-gold: #caa45f;
    --glass-bg: rgba(255, 255, 255, .08);
    --glass-bd: rgba(255, 255, 255, .16);
}

.nav-wrap {
    position: sticky;
    top: 12px;
    z-index: 50;
    display: flex;
    justify-content: center;
    padding-inline: 10px;
}

.nav {
    pointer-events: auto;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 14px;
    padding: 2px 10px;
    border-radius: 999px;
    background: var(--glass-bg);
    border: 1px solid var(--glass-bd);
    backdrop-filter: blur(10px) saturate(120%);
    -webkit-backdrop-filter: blur(10px) saturate(120%);
    color: var(--brand-ivory);
}

/* Logo */
.logo {
    text-decoration: none;
    color: var(--brand-ivory);
    font-weight: 700;
    font-size: 18px
}

/* Desktop links */
.links {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
    gap: 18px;
    align-items: center;
    justify-content: center
}

.link {
    color: rgba(255, 255, 255, .85);
    text-decoration: none;
    font-size: 14px;
    position: relative;
    padding: 6px 6px;
    border-radius: 6px;
}

.link:hover {
    color: #fff
}

.link:focus-visible {
    outline: 2px solid rgba(202, 164, 95, .55);
    outline-offset: 2px
}

/* Dropdown */
.dropdown {
    position: relative
}

.dropbtn {
    display: inline-flex;
    align-items: center;
    gap: .4rem
}

.caret {
    font-size: .8em;
    opacity: .8
}

.menu {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: calc(100% + 10px);
    min-width: 220px;
    padding: 8px;
    border-radius: 14px;
    background: rgba(20, 20, 22, .9);
    border: 1px solid var(--glass-bd);
    box-shadow: 0 24px 80px -30px rgba(0, 0, 0, .7);
}

.menu-item {
    display: flex;
    align-items: center;
    gap: .6rem;
    padding: 10px 12px;
    border-radius: 10px;
    color: rgba(255, 255, 255, .9);
    text-decoration: none;
    font-size: 14px;
}

.menu-item i {
    width: 18px;
    text-align: center
}

.menu-item:hover {
    background: rgba(255, 255, 255, .08);
    color: #fff
}

/* Burger (mobile) */
.burger {
    display: none;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    border: 1px solid var(--glass-bd);
    background: rgba(255, 255, 255, .06);
    color: var(--brand-ivory);
    cursor: pointer
}

.burger:focus-visible {
    outline: 2px solid rgba(202, 164, 95, .55);
    outline-offset: 2px
}

.bar {
    display: block;
    width: 18px;
    height: 2px;
    margin: 4px auto;
    background: #fff;
    border-radius: 2px;
    opacity: .9
}

/* Mobile panel */
.mobile {
    position: fixed;
    inset: 0;
    display: grid;
    place-items: start center;
    padding-top: 72px;
    z-index: 60
}

.panel {
    width: min(183%);
    background: rgba(20, 20, 22, .85);
    color: var(--brand-ivory);
    border: 1px solid var(--glass-bd);
    border-radius: 24px;
    backdrop-filter: blur(10px) saturate(120%);
    padding: 18px;
    box-shadow: 0 30px 120px -40px rgba(0, 0, 0, .75)
}

.m-links {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 8px
}

.m-link {
    display: block;
    padding: 12px 14px;
    border-radius: 12px;
    color: rgba(255, 255, 255, .9);
    text-decoration: none
}

.m-link:hover {
    background: rgba(255, 255, 255, .08);
    color: #fff
}

.m-title {
    margin-top: 10px;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: .08em;
    opacity: .7
}

.m-icons {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px
}

.m-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    width: 36px;
    border-radius: 12px;
    border: 1px solid var(--glass-bd);
    background: rgba(255, 255, 255, .06);
    color: #fff;
    text-decoration: none
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
    transition: opacity .18s ease, transform .18s ease
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-6px) scale(.98)
}

/* Responsive */
@media (max-width: 900px) {
    .links {
        display: none
    }

    .burger {
        display: inline-flex;
        align-items: center;
        justify-content: center
    }
}
</style>
