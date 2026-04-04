<script setup lang="ts">
defineProps<{
  meta: GameResult
}>()

const rank = ref()

const loading = ref(true)
async function getRank() {
  loading.value = true
  try {
    const result = await $fetch<number>('/api/leaderboard/rank')
    rank.value = result
  }
  catch (error) {
    console.error(error)
  }
  loading.value = false
}

getRank()
</script>

<template>
  <GameResultScreenClassic v-if="meta.mode === 'classic'" :meta="meta" />
  <GameResultScreenEndless v-if="meta.mode === 'endless' || meta.mode === 'ranked'" :meta="meta" />
  <template v-if="meta.mode === 'ranked'">
    <v-divider class="my-3" />
    <div class="text-h5 text-center opacity-70 pb-3">
      Bestenliste
    </div>
    <GameResultScreenRank v-if="meta.rank" :rank="meta.rank" />
    <div v-else class="text-center opacity-50 body-2">
      Für einen Eintrag in die Bestenliste müssen mindestens 3 Fragen richtig beantwortet worden sein
    </div>
  </template>
</template>
