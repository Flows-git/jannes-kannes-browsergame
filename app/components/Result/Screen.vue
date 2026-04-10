<script setup lang="ts">
const props = defineProps<{
  meta: GameResult
}>()

const answersSection = useTemplateRef('answers')
const gameTimeSection = useTemplateRef('game-time')
const rankedScreen = useTemplateRef('ranked')

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function animate() {
  if (props.meta.mode !== 'classic') {
    answersSection.value?.animate()
    await sleep(150)
    await gameTimeSection.value?.animate()
    await rankedScreen.value?.animate()
  }
}

onMounted(animate)
</script>

<template>
  <ResultScreenClassic v-if="meta.mode === 'classic'" :meta="meta" />
  <template v-else>
    <ResultSectionAnswers ref="answers" :meta="meta" />
    <v-divider class="my-3" />
    <ResultSectionGameTime ref="game-time" :meta="meta" />
    <template v-if="meta.mode === 'ranked'">
      <v-divider class="my-3" />
      <ResultSectionRank ref="ranked" :meta="meta" />
    </template>
  </template>
</template>
