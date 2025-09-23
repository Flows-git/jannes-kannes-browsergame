<script setup lang="ts">
const { startGame } = useGame()
const router = useRouter()

const loading = ref(false)
const error = ref()
async function startNewGame(mode: GameMode) {
  loading.value = true
  try {
    await startGame(mode)
    router.push('/game')
  }
  catch (e) {
    console.error(e)
    error.value = e
    loading.value = false
  }
}
</script>

<template>
  <v-container max-width="800">
    <v-card color="surface-variant">
      <v-card-text class="text-center">
        <GameLogo show-subtitle width="300" />
        <v-alert color="primary" type="info" variant="tonal" density="compact" icon="mdi-heart" class="mt-4">
          Das inoffizielle Spiel zum beliebten Format "Jannes Kann Es" aus der Sendung Creepjack.
          Alle Fragen stammen aus der Creepjack Community!
        </v-alert>
      </v-card-text>
      <v-progress-linear color="primary" :indeterminate="loading" />
    </v-card>

    <v-row class="pt-4">
      <v-col cols="12">
        <v-card class="fill-height" :disabled="loading" data-testid="quick-game-btn" @click="startNewGame('classic')">
          <v-card-title>
            <v-icon icon="mdi-controller-classic-outline" color="primary" size="24" />

            Schnelles Spiel
          </v-card-title>
          <v-card-text>
            Eine klassische Runde "Jannes Kann es". Es werden drei Fragen aus "Jannes Kann es" gestellt und das Spiel ist gewonnen wenn alle Fragen
            richtig beantwortet wurden. Es gibt natürlich einen Preis!
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card class="fill-height" :disabled="loading" data-testid="endless-game-btn" @click="startNewGame('endless')">
          <v-card-title>
            <v-icon icon="mdi-infinity" color="primary" size="24" />
            Endlos Modus
          </v-card-title>
          <v-card-text>Es werden alle "Jannes Kann es" Fragen gestellt.</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card class="fill-height" :disabled="loading" data-testid="ranked-game-btn" @click="startNewGame('ranked')">
          <v-card-title>
            <v-icon icon="mdi-trophy-variant-outline" color="primary" size="24" />
            Ranked
          </v-card-title>
          <v-card-text>
            Es werden alle "Jannes Kann es" Fragen gestellt. Man hat drei Leben.
            Das Spiel ist vorbei wenn man keine Leben mehr hat. Das Ergebnis kann in eine Rangliste eingetragen werden.
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card class="fill-height d-flex align-center pa-3" color="surface-variant" :disabled="loading" to="/leaderboard">
          <v-icon icon="mdi-podium" color="primary" size="60" />
          <v-card-title>Bestenliste</v-card-title>
        </v-card>
      </v-col>
      <!-- <v-col cols="12" sm="6">
        <v-card class="fill-height" disabled>
          <v-card-title>Eigenes Spiel</v-card-title>
          <v-card-text>
            Erstelle ein "Jannes Kann es" Spiel nach deinen Wünschen. Spiele den klassischen oder endlos Modus, bestimme die Anzahl der Fragen oder
            Fehlversuche...
          </v-card-text>
        </v-card>
      </v-col> -->
    </v-row>

    <v-snackbar v-model="error" color="error" class="mb-12" timer="8000" variant="flat">
      Beim Starten des Spiels ist ein Fehler aufgetreten. Versuche es später erneut.
      <div class="text-center opacity-50">
        {{ error?.message }}
      </div>
      <template #actions="{ isActive }">
        <v-btn icon="mdi-close" @click="isActive.value = false" />
      </template>
    </v-snackbar>
  </v-container>
</template>
