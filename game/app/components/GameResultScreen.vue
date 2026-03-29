<script setup lang="ts">
defineProps<{
  meta: GameMeta
}>()

const emits = defineEmits<{
  (e: 'doRestart'): void
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
  <v-divider />
  <div class="d-flex justify-center ga-2 flex-wrap">
    <v-btn color="primary" variant="outlined" class="mt-4" @click="emits('doRestart')">
      Spiel neustarten
    </v-btn>
    <v-btn color="primary" variant="outlined" class="mt-4" to="/">
      Zum Hauptmenü
    </v-btn>
  </div>
</template>
