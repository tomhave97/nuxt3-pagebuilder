import { defineNuxtConfig } from 'nuxt3'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
    css: [ '~/assets/tailwind.css'],
    typescript: {
        strict: true
    },
    build: {
        postcss: {
            postcssOptions: {
                plugins: {
                    tailwindcss: {},
                    autoprefixer: {},
                }
            }
        },
    },
    buildModules: [
        '@pinia/nuxt',
    ],
    baseUrl: 'localhost:3000',
})
