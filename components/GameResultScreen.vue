<script setup lang="ts">
const props = defineProps<{
  totalQuestions: number
  correctAnswers: number
}>()

const emits = defineEmits<{
  (e: 'doRestart'): void
}>()

const { startConfetti } = useConfetti()

const results = [
  { percent: 100, icon: 'panda-3.png', text: 'Super gemacht!' },
  { percent: 66.6, icon: 'panda-2.png', text: 'Das war OK. Aber es geht noch besser!' },
  { percent: 33.3, icon: 'panda-1.png', text: 'Naja...' },
  { percent: 0, icon: 'panda-0.png', text: 'Das war wohl nix!' },
]

const resultPercentage = computed(() => (props.correctAnswers / props.totalQuestions) * 100)

const image = computed(() => results.find(r => resultPercentage.value >= r.percent)?.icon)
const text = computed(() => results.find(r => resultPercentage.value >= r.percent)?.text)

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
        {{ correctAnswers }} / {{ totalQuestions }}
      </div>
      <div class="text-h4">
        {{ text }}
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
