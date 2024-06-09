<script setup lang="ts">
defineProps<{
  totalQuestions: number
  correctAnswers: number
}>()

const emits = defineEmits<{
  (e: 'doRestart'): void
}>()
</script>

<template>
  <div class="text-center py-4">
    <div class="text-h1">
      {{ correctAnswers }} / {{ totalQuestions }}
    </div>
    <div class="text-h4">
      <template v-if="correctAnswers === totalQuestions">
        Super gemacht!
      </template>
      <template v-else>
        Das war wohl nix!
      </template>
    </div>
    <div class="d-flex justify-space-around">
      <v-btn color="primary" variant="outlined" class="mt-4" @click="emits('doRestart')">
        Spiel neustarten
      </v-btn>
      <v-btn color="primary" variant="outlined" class="mt-4" to="/">
        Zum Hauptmenü
      </v-btn>
    </div>
  </div>
</template>
