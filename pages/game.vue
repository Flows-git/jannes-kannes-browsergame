<script setup lang="ts">
const { data, refresh, error } = await useFetch('/api/game')

if (error.value) {
  const router = useRouter()
  router.replace('/')
}

const answer = ref()
const answerResult = ref()

async function sendAnswer() {
  const { data: result } = await useFetch('/api/game', {
    method: 'POST',
    body: {
      answer: answer.value,
    },
  })
  answerResult.value = result.value
}

function nextQuestion() {
  answerResult.value = undefined
  answer.value = undefined
  refresh()
}

function endGame() {
  return useFetch('/api/game/end')
}

function startGame() {
  return useFetch('/api/game/start')
}

async function restartGame() {
  await endGame()
  await startGame()
  refresh()
}

function getAnswerClass(answer: string, isSelected?: boolean, selectedClass?: string) {
  if (answerResult.value) {
    if (isSelected) {
      if (answerResult.value.correct) {
        return ['border-success', 'bg-success']
      }
      else {
        return ['border-error', 'bg-error']
      }
    }
    else if (answer === answerResult.value.corretAnswer) {
      return ['border-success', 'bg-success']
    }
  }
  return [selectedClass]
}
</script>

<template>
  <v-container v-if="data" class="d-flex justify-center">
    <v-card width="600">
      <v-card-text>
        <div class="d-flex justify-space-between align-center">
          <div class="text-h2">
            <template v-if="data.meta.running">
              Frage {{ data.meta.currentQuestion }}
            </template>
            <template v-else>
              Spiel beendet
            </template>
          </div>

          <div class="text-h4 font-weight-bold text-center">
            <div class="wc3-color-gradient">
              JANNES
            </div>
            <div class="wc3-color-gradient">
              KANNES
            </div>
          </div>
        </div>
        <div class="text-h4">
          {{ data.question?.question }}
        </div>

        <v-item-group v-model="answer" selected-class="bg-primary" :disabled="!!answerResult">
          <v-row class="py-3">
            <v-col
              v-for="a of data.question?.answers"
              :key="a"
              cols="12"
              md="6"
            >
              <v-item v-slot="{ isSelected, selectedClass, toggle, disabled }" :value="a">
                <v-card
                  class="d-flex align-center border-primary border-sm border-opacity-100 pa-4 text-h5" :class="getAnswerClass(a, isSelected, selectedClass as any)"
                  dark
                  :disabled="disabled"
                  @click="toggle"
                >
                  <div
                    class="flex-grow-1 text-center "
                  >
                    {{ a }}
                  </div>
                </v-card>
              </v-item>
            </v-col>
          </v-row>
        </v-item-group>

        {{ answer }}

        <!-- endscreen -->
        <div v-if="!data.meta.running" class="text-center py-4">
          <div class="text-h1">
            {{ data.meta.correctAnswers }} / {{ data.meta.totalQuestions }}
          </div>
          <div class="text-h4">
            <template v-if="data.meta.correctAnswers === data.meta.totalQuestions">
              Super gemacht!
            </template>
            <template v-else>
              Das war wohl nix!
            </template>
          </div>
          <div class="d-flex justify-space-around">
            <v-btn color="primary" variant="outlined" class="mt-4" @click="restartGame">
              Spiel neustarten
            </v-btn>
            <v-btn color="primary" variant="outlined" class="mt-4" to="/">
              Zum Hauptmenü
            </v-btn>
          </div>
        </div>

        <div class="d-flex justify-end pt-4">
          <v-btn v-if="!answerResult && data.meta.running" :disabled="!answer && answer !== 0" color="primary" variant="outlined" @click="sendAnswer">
            Antworten absenden
          </v-btn>
          <v-btn v-if="data.meta.currentQuestion < data.meta.totalQuestions && answerResult" color="primary" variant="outlined" @click="nextQuestion">
            Nächste Frage
          </v-btn>
          <v-btn v-if="data.meta.currentQuestion === data.meta.totalQuestions && answerResult" color="primary" variant="outlined" @click="nextQuestion">
            Resultat anzeigen
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>
