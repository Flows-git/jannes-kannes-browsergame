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

const selectedGameMode = ref()
const gameModes = [
  {
    mode: 'classic',
    icon: 'mdi-controller-classic-outline',
    label: 'Schnelles Spiel',
    info: `Eine klassische Runde 'Jannes Kann es'. Es werden drei Fragen aus 'Jannes Kann es' gestellt und das Spiel ist gewonnen wenn alle Fragen richtig beantwortet wurden. \nEs gibt natürlich einen Preis!`,
  },
  {
    mode: 'endless',
    icon: 'mdi-infinity',
    label: 'Endlos Modus',
    info: `Casual Mode. \nEs werden alle "Jannes Kann es" Fragen gestellt`,
  },
  {
    mode: 'ranked',
    icon: 'mdi-trophy-variant-outline',
    label: 'Ranglistenspiel',
    info: `Es werden alle "Jannes Kann es" Fragen gestellt. Man hat drei Leben. \nDas Spiel ist vorbei wenn man keine Leben mehr hat. Das Ergebnis kann in eine Rangliste eingetragen werden.`,
  },
]
</script>

<template>
  <v-container max-width="1200px">
    <div>
      <GameLogo show-subtitle width="500" />
    </div>
    <v-item-group v-model="selectedGameMode" selected-class="border-primary border-opacity-100 selected-card">
      <v-row justify="center" class="pt-4">
        <v-col v-for="mode of gameModes" :key="mode.mode" cols="12" sm="6" md="4">
          <v-item v-slot="{ isSelected, selectedClass, select }" :value="mode">
            <v-card :class="selectedClass" class="pa-3 text-center border-md border-opacity-0" :color="isSelected ? 'surface-variant' : ''" @click="select">
              <v-btn
                v-tooltip="{
                  text: mode.info,
                  width: 300,
                  openOnClick: true,
                  contentClass: 'wrapped-text',
                }" icon="mdi-information-outline" variant="text"
                style="position: absolute; right: 4px; top: 4px;"
              />
              <v-avatar color="primary" size="94" :style="isSelected ? 'box-shadow: 0 0 16px rgb(var(--v-theme-primary));' : ''">
                <v-icon :icon="mode.icon" size="86" :class="{ 'rotate-once': isSelected }" style="text-shadow: 0px 2px 0 #fff;" />
              </v-avatar>
              <div class="text-h5 pt-2" :class="{ 'text-pop-up-top': isSelected }">
                {{ mode.label }}
              </div>
            </v-card>
          </v-item>
        </v-col>
      </v-row>
    </v-item-group>
    <div class="text-center pt-4">
      <v-btn size="x-large" color="primary" :loading="loading" :disabled="!selectedGameMode" :class="{ heartbeat: !!selectedGameMode && !loading }" @click="startNewGame(selectedGameMode.mode)">
        Spiel Starten
      </v-btn>

      <v-alert color="primary" type="info" variant="tonal" density="compact" icon="mdi-heart" class="mt-4">
        Das inoffizielle Spiel zum beliebten Format "Jannes Kann Es" aus der Sendung Creepjack.
        Alle Fragen stammen aus der Creepjack Community!
      </v-alert>
    </div>
    <v-row class="pt-4">
      <v-col cols="12">
        <v-card class="fill-height d-flex align-center pa-3" color="surface" :disabled="loading" to="/leaderboard">
          <v-icon icon="mdi-podium" color="primary" size="60" />
          <v-card-title>Bestenliste</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
.wrapped-text {
  white-space: pre-wrap;
}

.selected-card {
  box-shadow: 0px 0px 32px rgb(var(--v-theme-primary)) !important;
  transition: boxshadow 1s ease;
}
</style>
