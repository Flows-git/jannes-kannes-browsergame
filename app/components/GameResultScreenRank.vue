<script setup lang="ts">
const props = defineProps<{
  rank?: number
}>()

const config = useRuntimeConfig()

const medalColor = computed(() => {
  if (props.rank && props.rank >= 1 && props.rank <= 3) {
    const color = props.rank === 1 ? 'gold' : props.rank === 2 ? 'silver' : props.rank === 3 ? 'bronze' : null
    return color
  }
  return null
})
</script>

<template>
  <div class="text-h5 text-center opacity-70 pb-3">
    Bestenliste
  </div>
  <div v-if="rank" class="ranklist">
    <v-row>
      <v-col cols="12" sm="6" offset-sm="3">
        <v-card color="background" class="pa-3 text-center">
          <div class="rank text-h1 font-weight-medium text-primary slide-in-animation-container">
            <div class="slide-in-animation">
              <Medal v-if="medalColor" :size="70" :type="medalColor" />
              {{ rank }}.
            </div>
          </div>
          <div class="opacity-70">
            Platz erreicht
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" class=" pt-0 pb-8 text-center">
        <v-dialog width="500">
          <template #activator="{ props }">
            <v-btn class="submit-leaderboard-dialog-btn" color="primary" v-bind="props">
              <v-icon icon="mdi-trophy-variant" />
              Ergebnis in Rangliste eintragen
            </v-btn>
          </template>
          <LeaderboardForm />
        </v-dialog>
      </v-col>
    </v-row>
  </div>
  <div v-else class="text-center opacity-50 body-2">
    Für einen Eintrag in die Bestenliste müssen mindestens {{ config.public.leaderboardMinCorrectAnswers }} Fragen richtig beantwortet worden sein
  </div>
</template>
