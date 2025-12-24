import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: ['@nuxt/fonts', '@vueuse/nuxt'],

    css: ['./app/assets/app.css'],

    vite: {
        plugins: [
            tailwindcss(),
        ],
    },

    compatibilityDate: '2025-07-15',
})
