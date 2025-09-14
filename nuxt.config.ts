// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2025-09-14',
  experimental: {
    viewTransition: true,
  },
  runtimeConfig: {
    supabaseUrl: '',
    supabaseApiKey: '',
  },
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    '@nuxt/test-utils/module',
  ],

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    plugins: [
      vuetify({ autoImport: true }),
    ],
  },
  typescript: {
    tsConfig: {
      include: [
        '../scripts/**/*',
        '../tests/**/*',
      ],
    },
  },
  $development: {
    extends: [
      './admin',
    ],
  },
})
