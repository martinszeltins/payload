import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
    devtools: { enabled: true },
    
    app: {
        head: {
            title: 'Payload - Log Server',
            htmlAttrs: {
                lang: 'en'
            },
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { name: 'description', content: 'Payload - Simple and elegant log aggregation server' }
            ],
            link: [
                { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
            ]
        }
    },
    
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
