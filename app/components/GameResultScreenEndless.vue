<script setup lang="ts">
defineProps<{
  meta: GameMeta
}>()

const emits = defineEmits<{
  (e: 'doRestart'): void
}>()
</script>

<template>
  <div class="text-h5 text-center opacity-70 pb-3">
    Ergebnis
  </div>
  <v-row>
    <v-col cols="12" md="4">
      <v-card color="background" class="pa-3 text-center">
        <div class="text-h2 font-weight-medium text-primary">
          {{ meta.answeredQuestions }}
        </div>
        <div class="opacity-70">
          Fragen beantwortet
        </div>
      </v-card>
    </v-col>

    <v-col cols="12" sm="6" md="4">
      <v-card color="background" class="pa-3 text-center">
        <div class="text-h2 font-weight-medium text-success">
          {{ meta.correctAnswers }}
        </div>
        <div class="opacity-70">
          richtig beantwortet
        </div>
      </v-card>
    </v-col>

    <v-col cols="12" sm="6" md="4">
      <v-card color="background" class="pa-3 text-center">
        <div class="text-h2 font-weight-medium text-error">
          {{ meta.wrongAnswers }}
        </div>
        <div class="opacity-70">
          falsch beantwortet
        </div>
      </v-card>
    </v-col>
  </v-row>
  <div class="text-center py-3">
    Du hast <span class="text-h5 text-primary">{{ meta.answeredQuestionsTotalPercent.toLocaleString() }}%</span> aller erfassten Fragen (<span
      class="text-primary"
    >{{ meta.totalQuestions }}</span>) beantwortet
  </div>
  <v-divider />
  <div class="text-h5 text-center opacity-70 py-3">
    Spielzeit
  </div>

  <v-row>
    <v-col cols="12" sm="6">
      <v-card color="background" class="pa-3 text-center">
        <div class="text-h3 font-weight-medium text-primary">
          {{ meta.gameTime }}
        </div>
        <div class="opacity-70">
          gesamt Spielzeit
        </div>
      </v-card>
    </v-col>

    <v-col cols="12" sm="6">
      <v-card color="background" class="pa-3 text-center">
        <div class="text-h3 font-weight-medium text-primary">
          {{ meta.averageAnswerTime }}
        </div>
        <div class="opacity-70">
          durchschnittliche Antwortzeit
        </div>
      </v-card>
    </v-col>
  </v-row>
  <div class="d-flex justify-center ga-2 flex-wrap">
    <v-btn color="primary" variant="outlined" class="mt-4" @click="emits('doRestart')">
      Spiel neustarten
    </v-btn>
    <v-btn color="primary" variant="outlined" class="mt-4" to="/">
      Zum Hauptmenü
    </v-btn>
  </div>
</template>
