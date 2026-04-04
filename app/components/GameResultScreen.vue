<script setup lang="ts">
defineProps<{
  meta: GameResult
}>()
</script>

<template>
  <GameResultScreenClassic v-if="meta.mode === 'classic'" :meta="meta" />
  <GameResultScreenEndless v-if="meta.mode === 'endless' || meta.mode === 'ranked'" :meta="meta" />
  <template v-if="meta.mode === 'ranked'">
    <v-divider class="my-3" />
    <GameResultScreenRank :rank="meta.rank" />
  </template>
</template>
