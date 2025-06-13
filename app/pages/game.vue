<script setup lang="ts">
const gameMeta = ref<GameMeta>()
const gameRunning = computed(() => gameMeta.value?.running)
const showResult = ref(false)
const router = useRouter()

const { data, refresh } = useFetch<GetQuestionRespone>('/api/game', {
  server: false,
  onResponse: ({ response }) => {
    gameMeta.value = response._data.meta
    if (!response._data.meta.running) {
      showResult.value = true
    }
  },
  onResponseError: () => {
    router.replace('/')
  },
})

const answer = ref<string>()
const answerResult = ref()

const showAbortConfirm = ref(false)
const showRestartConfirm = ref(false)

async function sendAnswer() {
  const result = await $fetch<{ result: AnswerQuestionResponse, meta: GameMeta }>('/api/game', {
    method: 'POST',
    body: {
      answer: answer.value,
    },
  })
  answerResult.value = result.result
  gameMeta.value = result.meta
}

async function nextQuestion() {
  answerResult.value = undefined
  answer.value = undefined
  refresh()
}

async function getResult() {
  showResult.value = true
}
async function cancelGame() {
  showResult.value = true
  await endGame()
}

async function endGame() {
  const result = await $fetch<{ meta: GameMeta }>('/api/game', { method: 'DELETE' })
  gameMeta.value = result.meta
}

async function restartGame() {
  await $fetch('/api/game/restart')
  showResult.value = false
  nextQuestion()
}
</script>

<template>
  <!-- <div v-if="!data && pending" /> -->
  <v-container v-if="data && gameMeta" class="fill-height jk-game--container">
    <v-card width="800">
      <!-- Header -->
      <v-card-text class="jk-game--header d-flex justify-center bg-surface-variant">
        <v-menu v-if="gameRunning" icon="mdi-dots-vertical">
          <template #activator="{ props }">
            <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props" style="position: absolute; top: 50%; left: 16px; transform: translateY(-50%);" />
          </template>
          <v-list>
            <v-list-item @click="showRestartConfirm = true">
              <template #prepend>
                <warcraft-icon src="BTNPatrol.png" height="32px" width="32px" class="mr-1" />
              </template>
              Spiel Neustarten
            </v-list-item>

            <v-list-item @click="showAbortConfirm = true">
              <template #prepend>
                <warcraft-icon src="BTNCancel.png" height="32px" width="32px" class="mr-1" />
              </template>
              Spiel Beenden
            </v-list-item>
          </v-list>
        </v-menu>
        <GameLogo />
        <v-chip class="jk-game--questions-chip" size="x-large">
          {{ data?.question.questionNr }} / {{ gameMeta?.totalQuestions }}
        </v-chip>
      </v-card-text>
      <v-progress-linear color="primary" :model-value="gameMeta?.answeredQuestions" :buffer-value="gameMeta?.currentQuestion" :max="gameMeta?.totalQuestions" />

      <!-- Frage -->
      <v-card-text style="position: relative;">
        <template v-if="!showResult">
          <GameQuestion
            v-model="answer" :current-question-nr="data.question.questionNr" :question="data.question"
            :correct-answer="answerResult?.corretAnswer"
          />
          <HeroFallenOverlay v-if="gameMeta.remainingLives === 0" @show-results="getResult" />
        </template>
        <GameResultScreen v-else :meta="gameMeta" @do-restart="restartGame" />
      </v-card-text>

      <!-- Action Bar -->
      <v-card-actions v-if="gameRunning || !showResult" class="bg-surface-variant d-flex flex-column flex-sm-row justify-space-between">
        <div v-if="gameMeta.totalLives" style="width: 150px;">
          <HealthBar v-if="gameMeta.totalLives" :total-lives="gameMeta.totalLives" :remaining-lives="gameMeta.remainingLives as number" />
          <!-- <ManaBar :total-joker="3" :remaining-joker="2" /> -->
        </div>
        <v-spacer v-else />
        <div>
          <v-btn v-if="!answerResult && gameRunning" size="large" :disabled="!answer" color="primary" variant="outlined" @click="sendAnswer">
            Antworten absenden
          </v-btn>
          <v-btn
            v-if="gameRunning && answerResult && gameMeta.answeredQuestions < gameMeta.totalQuestions" size="large" color="primary" variant="outlined"
            @click="nextQuestion"
          >
            Nächste Frage
          </v-btn>
          <v-btn v-if="!gameRunning && gameMeta.remainingLives !== 0" size="large" color="primary" variant="outlined" @click="getResult">
            Resultat anzeigen
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
    <GameCancelDialog v-model="showAbortConfirm" @cancel-game="cancelGame()" />
    <GameRestartDialog v-model="showRestartConfirm" @restart-game="restartGame()" />
  </v-container>
</template>

<style lang="scss" scoped>
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

.health-bar {
  width: 100px;
  border: 1px solid #000;

  &,
  :deep(.v-progress-linear__determinate) {
    box-shadow: inset 1px -4px 3px -3px #000000, inset 1px 4px 3px -3px #FFFFFF;
  }
}
</style>
