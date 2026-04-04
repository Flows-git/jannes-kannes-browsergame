<script setup lang="ts">
defineProps<{
  meta: GameResult
}>()

const endlessScreen = useTemplateRef('endless')
const rankedScreen = useTemplateRef('ranked')

async function animate() {
  await endlessScreen.value?.animate()
  await rankedScreen.value?.animate()
}

onMounted(animate)
</script>

<template>
  <GameResultScreenClassic v-if="meta.mode === 'classic'" :meta="meta" />
  <GameResultScreenEndless v-if="meta.mode === 'endless' || meta.mode === 'ranked'" ref="endless" :meta="meta" />
  <template v-if="meta.mode === 'ranked'">
    <v-divider class="my-3" />
    <GameResultScreenRank ref="ranked" :rank="meta.rank" />
  </template>
</template>
