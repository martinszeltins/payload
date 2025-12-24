<script setup lang="ts">
    const props = withDefaults(defineProps<{
        variant?: 'default' | 'primary' | 'icon' | 'danger'
        disabled?: boolean
        type?: 'button' | 'submit' | 'reset'
        active?: boolean
    }>(), {
        variant: 'default',
        disabled: false,
        type: 'button',
        active: false
    })

    const buttonClass = computed(() => {
        const base = 'rounded-lg text-sm font-medium transition-all inline-flex items-center justify-center gap-2'
        
        if (props.variant === 'primary') {
            return `${base} px-6 h-[42px] bg-gray-600 hover:bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed`
        }
        
        if (props.variant === 'icon') {
            return `${base} p-2 hover:bg-panel border border-transparent hover:border-stroke`
        }
        
        if (props.variant === 'danger') {
            return `${base} px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400/90 border border-red-500/20`
        }
        
        // default variant (like Add Log button)
        if (props.active) {
            return `${base} px-3 py-1.5 bg-panel2 border border-gray-400 text-gray-300`
        }
        return `${base} px-3 py-1.5 bg-panel border border-stroke hover:bg-panel2 disabled:opacity-50 disabled:cursor-not-allowed`
    })
</script>

<template>
    <button
        :type="type"
        :disabled="disabled"
        :class="buttonClass"
    >
        <slot />
    </button>
</template>
