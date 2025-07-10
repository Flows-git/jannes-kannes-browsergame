<script setup lang="ts">
const { answerQuestion, currentQuestion, gameMeta, fetchQuestion, endGame, restartGame, showResult } = useGame()
const router = useRouter()

const loading = ref(false)
const error = ref()
const gameRunning = computed(() => gameMeta.value?.running)

const answer = ref<string>()
const answerResult = ref()

const showAbortConfirm = ref(false)
const showRestartConfirm = ref(false)

async function fetchCurrentQuestion() {
  loading.value = true
  try {
    await fetchQuestion()
  }
  catch (e) {
    error.value = e
  }
  loading.value = false
}

async function initalFetch() {
  await fetchCurrentQuestion()
  if (gameMeta.value && !gameMeta.value.running) {
    showResult.value = true
  }
  if (error.value) {
    router.replace('/')
  }
}
initalFetch()

async function sendAnswer() {
  if (answer.value) {
    loading.value = true
    const result = await answerQuestion(answer.value)
    answerResult.value = result
    loading.value = false
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function nextQuestion() {
  await fetchCurrentQuestion()
  scrollToTop()
  answerResult.value = undefined
  answer.value = undefined
}

async function showEndResult() {
  answerResult.value = undefined
  answer.value = undefined
  showResult.value = true
  scrollToTop()
}

async function cancelGame() {
  await endGame()
  showEndResult()
}

async function doRestartGame() {
  answerResult.value = undefined
  answer.value = undefined
  await restartGame()
}
</script>

<template>
  <v-container class="fill-height jk-game--container">
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
        <v-chip v-if="currentQuestion" class="jk-game--questions-chip" size="x-large">
          {{ currentQuestion.questionNr }} / {{ gameMeta?.totalQuestions }}
        </v-chip>
      </v-card-text>
      <v-progress-linear color="primary" :model-value="gameMeta?.answeredQuestions" :buffer-value="gameMeta?.currentQuestion" :max="gameMeta?.totalQuestions" />

      <!-- Frage -->
      <v-card-text>
        <div v-if="loading && !currentQuestion" class="text-center">
          <v-progress-circular indeterminate color="primary" size="100" />
          <div class="text-primary pt-3 text-h5">
            Spieldaten werden geladen...
          </div>
        </div>
        <template v-if="!showResult && currentQuestion">
          <GameQuestion v-model="answer" :current-question-nr="currentQuestion.questionNr" :question="currentQuestion" :loading="loading"
            :correct-answer="answerResult?.corretAnswer" />
          <!-- <HeroFallenOverlay v-if="gameMeta?.remainingLives === 0" @show-results="showEndResult" /> -->
        </template>
        <template v-if="gameMeta && showResult">
          <GameResultScreen v-if="gameMeta.totalQuestions === 3" :meta="gameMeta" @do-restart="doRestartGame" />
          <GameResultScreenEndless v-else :meta="gameMeta" @do-restart="doRestartGame" />

        </template>
      </v-card-text>

      <!-- Action Bar -->
      <v-card-actions v-if="gameMeta && (gameRunning || !showResult)" class="bg-surface-variant d-flex flex-column flex-sm-row justify-space-between">
        <div v-if="gameMeta.totalLives" class="jk-game--stats-container">
          <StatsBarHealth v-if="gameMeta.totalLives" :total="gameMeta.totalLives" :remaining="gameMeta.remainingLives as number" />
          <!-- <StatsBarMana :total="3" :remaining="2" /> -->
        </div>
        <v-spacer v-else />
        <div>
          <v-btn v-if="!answerResult && gameRunning" size="large" :disabled="!answer" color="primary" variant="outlined" :loading="loading" @click="sendAnswer">
            Antworten absenden
          </v-btn>
          <v-btn v-if="gameRunning && answerResult && gameMeta.answeredQuestions < gameMeta.totalQuestions" size="large" color="primary" variant="outlined"
            :loading="loading" @click="nextQuestion">
            Nächste Frage
          </v-btn>
          <v-btn v-if="!gameRunning" size="large" color="primary" variant="outlined" @click="showEndResult">
            Resultat anzeigen
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
    <GameCancelDialog v-model="showAbortConfirm" @cancel-game="cancelGame()" />
    <GameRestartDialog v-model="showRestartConfirm" @restart-game="doRestartGame()" />
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

  &--stats-container {
    width: 150px;
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
