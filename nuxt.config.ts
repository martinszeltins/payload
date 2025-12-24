import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
    devtools: { enabled: true },
    
    modules: [
        '@nuxt/fonts',
        '@vueuse/nuxt',
        '@nuxt/eslint'
    ],

    css: ['./app/assets/app.css'],

    vite: {
        plugins: [
            tailwindcss()
        ]
    },

    fonts: {
        families: [
            { name: 'Inter', provider: 'google' }
        ]
    },

    nitro: {
        experimental: {
            websocket: true
        }
    },

    compatibilityDate: '2025-07-15'
})
