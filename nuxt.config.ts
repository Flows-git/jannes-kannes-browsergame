// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  devtools: { enabled: true },
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
})
