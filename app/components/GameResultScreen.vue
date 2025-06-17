<script setup lang="ts">
const props = defineProps<{
  meta: GameMeta
}>()

const emits = defineEmits<{
  (e: 'doRestart'): void
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
const text = computed(() => getRandomPhrase(results.find(r => resultPercentage.value >= r.percent)?.points as any))

onMounted(() => {
  if (resultPercentage.value === 100) {
    startConfetti(5)
  }
})
</script>

<template>
  <div class="py-4 d-flex align-center">
    <div>
      <v-img :src="image" width="300px" />
    </div>
    <div class="text-center flex-grow-1">
      <div class="text-h1">
        {{ meta.correctAnswers }} / {{ meta.totalQuestions }}
      </div>
      <div class="text-h4">
        {{ text }}
      </div>
      <div class="pt-3">
        Spielzeit: <span class="font-weight-bold">{{ meta.gameTime }}</span>
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
  </div>
</template>
