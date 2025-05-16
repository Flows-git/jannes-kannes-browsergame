<script setup lang="ts">
const { data, refresh, error } = await useFetch('/api/game')

if (error.value) {
  const router = useRouter()
  router.replace('/')
}

const answer = ref<number>()
const answerResult = ref()

async function sendAnswer() {
  const result = await $fetch('/api/game', {
    method: 'POST',
    body: {
      answer: answer.value,
    },
  })
  answerResult.value = result
}

function nextQuestion() {
  answerResult.value = undefined
  answer.value = undefined
  refresh()
}

function endGame() {
  return $fetch('/api/game', { method: 'DELETE' })
}

function startGame() {
  return $fetch('/api/game/start', { method: 'POST' })
}

async function restartGame() {
  await endGame()
  await startGame()
  refresh()
}
</script>

<template>
  <v-container v-if="data" class="fill-height jk-game--container">
    <v-card width="800">
      <!-- Header -->
      <v-card-text class="jk-game--header d-flex justify-center bg-surface-variant">
        <GameLogo />
        <v-chip class="jk-game--questions-chip" size="x-large">
          {{ data.meta?.currentQuestion }} / {{ data.meta?.totalQuestions }}
        </v-chip>
      </v-card-text>
      <v-progress-linear
        color="primary" :model-value="data.meta?.running ? data.meta?.currentQuestion - 1 : data.meta?.currentQuestion"
        :buffer-value="data.meta?.currentQuestion" :max="data.meta.totalQuestions"
      />

      <!-- Frage -->
      <v-card-text>
        <GameQuestion
          v-if="data.meta?.running" v-model="answer" :current-question-nr="data.meta.currentQuestion" :question="data.question"
          :correct-answer="answerResult?.corretAnswer"
        />
        <GameResultScreen v-else :correct-answers="data.meta.correctAnswers" :total-questions="data.meta.totalQuestions" @do-restart="restartGame" />
      </v-card-text>

      <!-- Action Bar -->
      <v-card-actions v-if="data.meta?.running" class="bg-surface-variant d-flex justify-center justify-md-end">
        <v-btn v-if="!answerResult && data.meta.running" size="large" :disabled="!answer && answer !== 0" color="primary" variant="outlined" @click="sendAnswer">
          Antworten absenden
        </v-btn>
        <v-btn v-if="data.meta.currentQuestion < data.meta.totalQuestions && answerResult" size="large" color="primary" variant="outlined" @click="nextQuestion">
          Nächste Frage
        </v-btn>
        <v-btn
          v-if="data.meta.currentQuestion === data.meta.totalQuestions && answerResult" size="large" color="primary" variant="outlined"
          @click="nextQuestion"
        >
          Resultat anzeigen
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<style lang="scss">
.jk-game {
  &--container {
  max-width: 800px;
  }

  &--header {
    position: relative;
  }

  &--questions-chip {
    position: absolute !important;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
  }

}
</style>
