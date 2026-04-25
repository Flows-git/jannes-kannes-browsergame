<script setup lang="ts">
const props = defineProps<{
  meta: GameResult

}>()

const config = useRuntimeConfig()
const ranking = computed(() => props.meta.ranking)
const rank = computed(() => ranking.value?.rank)

const medalColor = computed(() => {
  if (rank.value && rank.value >= 1 && rank.value <= 3) {
    const color = rank.value === 1 ? 'gold' : rank.value === 2 ? 'silver' : rank.value === 3 ? 'bronze' : null
    return color
  }
  return null
})

const leaderboardHeader = useTemplateRef('leaderboard-header')
const showResult = ref(false)
const notAuthorizedMsg = useTemplateRef('no-rank')

async function animate() {
  await leaderboardHeader.value?.animate()
  showResult.value = true
  notAuthorizedMsg.value?.animate()
}

defineExpose({ animate })

const showSubmitDialog = ref(false)
</script>

<template>
  <div class="text-h5 text-center opacity-70 pb-3">
    <TypingText ref="leaderboard-header" text="Bestenliste" />
  </div>
  <div v-if="rank" class="ranklist">
    <v-row>
      <v-col cols="12" sm="6" offset-sm="3" class="result-card" :class="{ 'result-card--visible': showResult }">
        <v-card color="background" class="pa-3 text-center">
          <div class="rank text-h1 font-weight-medium text-primary slide-in-animation-container">
            <div :class="{ 'slide-in-animation': showResult }">
              <Medal v-if="medalColor" :size="70" :type="medalColor" />{{ rank }}.
            </div>
          </div>
          <div class="opacity-70">
            Platz erreicht
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" class=" pt-0 pb-8 text-center">
        <v-btn class="submit-leaderboard-dialog-btn result-card" color="primary" :class="{ 'result-card--visible': showResult }" @click="showSubmitDialog = true">
          <v-icon icon="mdi-trophy-variant" />
          Ergebnis in Rangliste eintragen
        </v-btn>
        <LeaderboardSubmitDialog v-model="showSubmitDialog" :meta="meta" />
      </v-col>
    </v-row>
  </div>
  <div v-else class="text-center opacity-50 body-2">
    <div v-if="ranking?.existingIsBetter">
      Du hast bereits einen besseren Eintrag in der Bestenliste:
      <strong>{{ ranking.existingLeaderboardEntry?.score }} Punkte</strong> in
      <strong>{{ ranking.existingLeaderboardEntry?.gameTime }}</strong>.
    </div>
    <TypingText v-else ref="no-rank" :text="`Für einen Eintrag in die Bestenliste müssen mindestens ${config.public.leaderboardMinCorrectAnswers} Fragen richtig beantwortet worden sein`" :tick="10" />
  </div>
</template>

<style>
.result-card {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.result-card--visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
