import type { ThemeDefinition } from 'vuetify'
import { createVuetify } from 'vuetify'
import { de } from 'vuetify/locale'

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

const b2wTheme: ThemeDefinition = {
  dark: true,
  colors: {
    'background': '#090909',
    'surface': '#212121',
    'surface-variant': '#424242',
    'on-surface-variant': '#FFFFFF',
    'primary': '#FBCF3B',
    'secondary': '#03DAC6',
    'error': '#B00020',
    'info': '#2196F3',
    'success': '#4CAF50',
    'warning': '#FB8C00',
    'undead': '#722F90',
    'orc': '#C51C28',
    'human': '#21A4EB',
    'nightelf': '#05953B',
  },
}

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    locale: {
      locale: 'de',
      messages: { de },

    },
    theme: {
      defaultTheme: 'b2wTheme',
      themes: {
        b2wTheme,
      },
    },
  })
  app.vueApp.use(vuetify)
})
