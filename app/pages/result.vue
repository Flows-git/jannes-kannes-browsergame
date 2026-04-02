<script setup lang="ts">
const { gameMeta, fetchQuestion, restartGame } = useGame()
const router = useRouter()

const loading = ref(false)
const error = ref()

async function fetchCurrentQuestion() {
  loading.value = true
  try {
    await fetchQuestion()
  }
  catch (e) {
    error.value = e
  }
  loading.value = false
}

async function initalFetch() {
  await fetchCurrentQuestion()
  if (gameMeta.value) {
    gameMeta.value.correctAnswers = 0
  }
  if (gameMeta.value && gameMeta.value.running) {
    router.replace('/game')
  }
  if (!gameMeta.value || error.value) {
    router.replace('/')
  }
}
initalFetch()

async function doRestartGame() {
  await restartGame()
  router.push('/game')
}
</script>

<template>
  <v-container class="fill-height jk-game--container">
    <v-card width="800">
      <v-card-text class="jk-game--header d-flex justify-center bg-surface-variant">
        <GameLogo />
      </v-card-text>
      <v-card-text>
        <div v-if="loading && !gameMeta" class="text-center d-flex align-center justify-center" style="min-height: 300px;">
          <div>
            <v-progress-circular indeterminate color="primary" size="100" />
            <div class="text-primary pt-3 text-h5">
              Spieldaten werden geladen...
            </div>
          </div>
        </div>
        <GameResultScreen v-if="gameMeta" :meta="gameMeta" />
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
