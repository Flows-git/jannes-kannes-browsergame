// https://nuxt.com/docs/api/configuration/nuxt-config
import { env } from 'node:process'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2025-09-14',
  experimental: {
    viewTransition: true,
  },
  runtimeConfig: {
    sessionSecret: '',
    supabaseUrl: '',
    supabaseApiKey: '',
    metrics: env.NODE_ENV === 'production',
    public: {
      leaderboardMinCorrectAnswers: 3,
    },
  },
  build: {
    transpile: ['vuetify'],
  },
  modules: ['@nuxt/test-utils/module', '@nuxt/scripts'],

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    plugins: [
      vuetify({ autoImport: true }),
    ],
    optimizeDeps: {
      include: [
        '@tsparticles/confetti',
      ],
    },
  },
  typescript: {
    tsConfig: {
      include: [
        '../scripts/**/*',
        '../tests/**/*',
      ],
    },
  },
})