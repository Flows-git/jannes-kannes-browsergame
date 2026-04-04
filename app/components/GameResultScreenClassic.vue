<script setup lang="ts">
const props = defineProps<{
  meta: GameResult
}>()

const { startConfetti } = useConfetti()

const results = [
  { percent: 100, points: 3, icon: 'panda-3.png' },
  { percent: 66.6, points: 2, icon: 'panda-2.png' },
  { percent: 33.3, points: 1, icon: 'panda-1.png' },
  { percent: 0, points: 0, icon: 'panda-0.png' },
]

const resultPercentage = computed(() => (props.meta.correctAnswers / props.meta.totalQuestions) * 100)

const image = computed(() => results.find(r => resultPercentage.value >= r.percent)?.icon)
const phrase = computed(() => getRandomPhrase(results.find(r => resultPercentage.value >= r.percent)?.points as any))

onMounted(() => {
  if (resultPercentage.value === 100) {
    startConfetti(5)
  }
})
</script>

<template>
  <v-row>
    <v-col cols="12" md="6" class="text-center slide-in-animation-container">
      <v-img class="slide-in-animation" :src="image" contain max-height="450px" :aspect-ratio="1024 / 1536" />
      <v-divider class="d-md-none" />
    </v-col>
    <v-col cols="12" md="6" class="text-center">
      <div class=" d-flex flex-column fill-height">
        <div class="flex-grow-1 d-flex flex-column justify-center align-center py-4">
          <div class="result-container">
            <div class="text-h5 opacity-50 pb-3">
              Ergebnis
            </div>
            <div class="text-h1 font-weight-bold text-primary">
              {{ meta.correctAnswers }} / {{ meta.totalQuestions }}
            </div>

            <div class="pt-3">
              Spielzeit: <span class="font-weight-bold">{{ meta.gameTime }}</span>
            </div>
          </div>
        </div>
        <div v-if="phrase">
          <div class="text-h5">
            <TypingText :text="phrase" auto-animate />
          </div>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">
.result-container {
  background: rgb(var(--v-theme-background));
  border-radius: 50%;
  height: 300px;
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
