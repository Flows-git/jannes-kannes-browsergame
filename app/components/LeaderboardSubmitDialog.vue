<script setup lang="ts">
const props = defineProps<{
  meta: GameResult

}>()
const ranking = computed(() => props.meta.ranking)

const showSubmitDialog = defineModel<boolean>({ default: false })

const rank = computed(() => ranking.value?.rank)

const medalColor = computed(() => {
  if (rank.value && rank.value >= 1 && rank.value <= 3) {
    const color = rank.value === 1 ? 'gold' : rank.value === 2 ? 'silver' : rank.value === 3 ? 'bronze' : null
    return color
  }
  return null
})
</script>

<template>
  <GameDialog v-model="showSubmitDialog" title="Ergebnis in Rangliste eintragen">
    <v-row class="pt-4">
      <v-col cols="12" sm="6" offset-sm="3">
        <v-card color="background" class="pa-3 text-center">
          <div class="rank text-h2 font-weight-medium text-primary slide-in-animation-container">
            <div>
              <Medal v-if="medalColor" :size="70" :type="medalColor" />{{ rank }}.
            </div>
          </div>
          <div class="opacity-70">
            Platz erreicht
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" sm="4" md="4">
        <v-card color="background" class="pa-3 text-center fill-height">
          <div class="text-h4 font-weight-medium">
            {{ meta.correctAnswers }}
          </div>
          <div class="opacity-70">
            Punktzahl
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4" md="4">
        <v-card color="background" class="pa-3 text-center fill-height">
          <div class="text-h4 font-weight-medium">
            {{ meta.averageAnswerTime }}
          </div>
          <div class="opacity-70">
            durchschnittliche Antwortzeit
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4" md="4">
        <v-card color="background" class="pa-3 text-center fill-height">
          <div class="text-h4 font-weight-medium">
            {{ meta.gameTime }}
          </div>
          <div class="opacity-70">
            gesamt Spielzeit
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="8" offset-sm="2" md="6" offset-md="3">
        <LeaderboardForm :name="ranking?.existingLeaderboardEntry?.name" />
      </v-col>
    </v-row>
  </GameDialog>
</template>
