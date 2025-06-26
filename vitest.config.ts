import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  // set root to root folder - otherwise it's the app folder
  root: './',
  test: {
    outputFile: '.test-results/vitest-result.json',
    include: ['tests/unit/**/*.{test,spec}.?(c|m)[jt]s?(x)', '**/*.unit.?(c|m)[jt]s?(x)'],
    environment: 'nuxt',
    coverage: {
      reporter: ['text', 'html'],
      all: true,
      reportsDirectory: '.test-results/vitest-coverage',

      // include: ['**'],
      include: ['app/**/*', 'server/**/*'],
    },
  },
})
