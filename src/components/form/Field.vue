<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'
import { gsap } from '@/plugins/gsap'

const props = defineProps({
    id: { type: String, required: true },
    label: { type: String, required: true },
    modelValue: { type: [String, Number, null], default: '' },
    type: { type: String, default: 'text' },
    placeholder: { type: String, default: '' },
    error: { type: String, default: '' },
    help: { type: String, default: '' },
    textarea: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    rows: { type: Number, default: 4 },
})

const emit = defineEmits(['update:modelValue'])

const root = ref(null)
const labelEl = ref(null)
const inputEl = ref(null)
const focused = ref(false)

/** RMM simple */
const rmm = typeof window !== 'undefined'
    ? window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
    : false

/** label flottant si focus ou si valeur non vide */
const isFloated = computed(() =>
    focused.value || (props.modelValue !== null && String(props.modelValue).length > 0)
)

const helpId = computed(() => (props.help ? `${props.id}-help` : null))
const errorId = computed(() => (props.error ? `${props.id}-error` : null))

function animateLabelFloat(toFloat) {
    if (!labelEl.value) return
    if (rmm) {
        // Pas d'anim, on applique l'état directement via classes utilitaires
        return
    }
    // États : flotté → y: -12, scale: .88 ; normal → y: 0, scale: 1
    const y = toFloat ? -12 : 0
    const s = toFloat ? 0.88 : 1
    gsap.to(labelEl.value, { y, scale: s, duration: 0.18, ease: 'power2.out' })
}

watch(isFloated, (nv) => animateLabelFloat(nv))

onMounted(async () => {
    // État initial du label (sans animation)
    if (labelEl.value) {
        gsap.set(labelEl.value, { y: isFloated.value ? -12 : 0, scale: isFloated.value ? 0.88 : 1 })
    }
})

onBeforeUnmount(() => {
    gsap.killTweensOf(labelEl.value)
})

function onFocus() {
    focused.value = true
}
function onBlur() {
    focused.value = false
}
function onInput(e) {
    const v = e?.target?.value
    emit('update:modelValue', v)
}
</script>

<template>
    <div ref="root" class="w-full text-white">
        <div class="relative" :class="[
            'rounded-xl border bg-black/40',
            error ? 'border-red-400/50' : 'border-white/15',
            focused ? 'ring-2 ring-[#caa45f]' : 'ring-0'
        ]">
            <!-- Label flottant -->
            <label ref="labelEl" :for="id" class="absolute left-3 top-2 origin-left pointer-events-none
               text-[13px] text-white/70 select-none">
                {{ label }}<span v-if="required" aria-hidden="true"> *</span>
            </label>

            <!-- Input / Textarea -->
            <component :is="textarea ? 'textarea' : 'input'" ref="inputEl" :id="id" class="w-full bg-transparent outline-none text-white placeholder-white/30
               px-3 pt-7 pb-2 rounded-xl" :type="textarea ? undefined : type" :rows="textarea ? rows : undefined"
                :placeholder="placeholder" :value="modelValue" :disabled="disabled" :required="required"
                :aria-invalid="!!error" :aria-describedby="[helpId, errorId].filter(Boolean).join(' ') || null"
                @focus="onFocus" @blur="onBlur" @input="onInput" />
        </div>

        <!-- Help -->
        <p v-if="help" :id="helpId" class="mt-1 text-xs text-white/60">
            {{ help }}
        </p>

        <!-- Error (slot prioritaire) -->
        <slot name="error">
            <p v-if="error" :id="errorId" class="mt-1 text-xs text-red-300" aria-live="polite">
                {{ error }}
            </p>
        </slot>
    </div>
</template>

<style scoped>
/* Perf hints */
label,
input,
textarea {
    will-change: transform, opacity;
}

/* Empêche la sélection du label pendant l’anim */
label {
    user-select: none;
}
</style>
