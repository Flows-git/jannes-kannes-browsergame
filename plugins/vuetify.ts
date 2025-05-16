// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { type ThemeDefinition, createVuetify } from 'vuetify'

const b2wTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#090909',
    surface: '#212121',
    primary: '#FBCF3B',
    secondary: '#03DAC6',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
    undead: '#722F90',
    orc: '#C51C28',
    human: '#21A4EB',
    nightelf: '#05953B',
  },
}

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    // ... your configuration
    theme: {
      defaultTheme: 'b2wTheme',
      themes: {
        b2wTheme,
      },
    },
  })
  app.vueApp.use(vuetify)
})
