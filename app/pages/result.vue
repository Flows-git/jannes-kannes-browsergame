<script setup lang="ts">
import type { NuxtError } from '#app'

const { restartGame } = useGame()
const router = useRouter()

const loading = ref(false)
const result = ref<GameResult>()

async function fetchResult() {
  loading.value = true
  try {
    result.value = await $fetch<GameResult>('/api/game/result')
  }
  catch (e) {
    const err = e as NuxtError
    if (err.statusText === 'game_not_ended') {
      router.replace('/game')
    }
    if (err.statusText === 'no_game_started') {
      router.replace('/')
    }
  }
  loading.value = false
}
fetchResult()

async function doRestartGame() {
  await restartGame()
  router.replace('/game')
}

const gameModeLabel = computed(() => {
  let mode = ''
  if (result.value?.mode === 'classic') {
    mode = 'Klassisch'
  }
  else if (result.value?.mode === 'endless') {
    mode = 'Endlos'
  }
  else if (result.value?.mode === 'ranked') {
    mode = 'Ranglistenspiel'
  }
  return mode
})
</script>

<template>
  <v-container class="fill-height jk-game--container">
    <v-card width="800">
      <v-card-text class="jk-game--header text-center bg-surface-variant">
        <div>
          <GameLogo />
        </div>
        <div class="text-h6">
          {{ gameModeLabel }}
        </div>
      </v-card-text>
      <v-card-text>
        <div v-if="loading && !result" class="text-center d-flex align-center justify-center" style="min-height: 300px;">
          <div>
            <v-progress-circular indeterminate color="primary" size="100" />
            <div class="text-primary pt-3 text-h5">
              Spieldaten werden geladen...
            </div>
          </div>
        </div>
        <ResultScreen v-if="result" :meta="result" />
      </v-card-text>
      <v-card-actions class="bg-surface-variant d-flex justify-space-around ga-3 flex-wrap">
        <v-btn color="primary" variant="outlined" @click="doRestartGame">
          Spiel neustarten
        </v-btn>
        <v-btn color="primary" variant="outlined" to="/">
          Zum Hauptmenü
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<style lang="scss" scoped>
.jk-game {
  &--container {
    max-width: 800px;
  }

  &--header {
    position: relative;
  }
}
</style>
