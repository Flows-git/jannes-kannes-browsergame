<script setup lang="ts">
defineProps<{
  meta: GameMeta
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
    <GameResultScreenRank />
  </template>
</template>
