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
    <v-card>
      <v-card-text class="text-center">
        <GameLogo show-subtitle width="300" />
      </v-card-text>
      <v-progress-linear color="primary" :indeterminate="loading" />
    </v-card>
    <v-row class="pt-6">
      <v-col cols="12">
        <v-card class="fill-height" :disabled="loading" @click="startNewGame('classic')">
          <v-card-title>Schnelles Spiel</v-card-title>
          <v-card-text>
            Eine klassische Runde "Jannes Kann es". Es werden drei Fragen aus "Jannes Kann es" gestellt und das Spiel ist gewonnen wenn alle Fragen
            richtig beantwortet wurden. Es gibt natürlich einen Preis!
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card class="fill-height" :disabled="loading" @click="startNewGame('endless')">
          <v-card-title>Endlos Casual</v-card-title>
          <v-card-text>Es werden alle "Jannes Kann es" Fragen gestellt.</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card class="fill-height" :disabled="loading" @click="startNewGame('ranked')">
          <v-card-title>Endlos Ranked</v-card-title>
          <v-card-text>
            Es werden alle "Jannes Kann es" Fragen gestellt. Man hat drei Leben.
            Das Spiel ist vorbei wenn man keine Leben mehr hat. Das Ergebnis kann in eine Rangliste eingetragen werden.
          </v-card-text>
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
