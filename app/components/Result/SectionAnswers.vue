<script setup lang="ts">
defineProps<{
  meta: GameResult
}>()

const resultHeader = useTemplateRef('result-header')
const answeredQuestionPercentageText = useTemplateRef('percentage-text')
const visibleCards = ref(0)

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function showCards(count: number) {
  for (let i = 0; i < count; i++) {
    visibleCards.value = visibleCards.value + 1
    await sleep(300)
  }
}
async function animate() {
  await sleep(200)
  resultHeader.value?.animate()
  showCards(3)
  answeredQuestionPercentageText.value?.animate()
}

defineExpose({ animate })
</script>

<template>
  <div class="text-h5 text-center opacity-70 pb-3">
    <TypingText ref="result-header" text="Ergebnis" />
  </div>
  <v-row>
    <v-col cols="12" md="4" class="result-card" :class="{ 'result-card--visible': visibleCards >= 1 }">
      <v-card color="background" class="pa-3 text-center">
        <div class="text-h2 font-weight-medium text-primary">
          {{ meta.answeredQuestions }}
        </div>
        <div class="opacity-70">
          Fragen beantwortet
        </div>
      </v-card>
    </v-col>

    <v-col cols="12" sm="6" md="4" class="result-card" :class="{ 'result-card--visible': visibleCards >= 2 }">
      <v-card color="background" class="pa-3 text-center">
        <div class="text-h2 font-weight-medium text-success">
          {{ meta.correctAnswers }}
        </div>
        <div class="opacity-70">
          richtig beantwortet
        </div>
      </v-card>
    </v-col>

    <v-col cols="12" sm="6" md="4" class="result-card" :class="{ 'result-card--visible': visibleCards >= 3 }">
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
  <div class="text-center pt-3">
    <ResultAnswersText ref="percentage-text" :meta="meta" />
  </div>
</template>

<style>
.result-card {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.result-card--visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
