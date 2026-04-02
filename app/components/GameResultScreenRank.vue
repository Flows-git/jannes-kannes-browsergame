<script setup lang="ts">
const rank = ref()

const loading = ref(true)
const error = ref<any>()
async function getRank() {
  loading.value = true
  try {
    const result = await $fetch<number>('/api/leaderboard/rank')
    rank.value = result
  }
  catch (e) {
    console.error(e)
    error.value = e
  }
  loading.value = false
}

const medalColor = computed(() => {
  if (rank.value >= 1 && rank.value <= 3) {
    const color = rank.value === 1 ? 'gold' : rank.value === 2 ? 'silver' : rank.value === 3 ? 'bronze' : null
    return color
  }
  return null
})

getRank()
</script>

<template>
  <div class="ranklist">
    <div class="text-h5 text-center opacity-70 pb-3">
      Bestenliste
    </div>
    <v-row>
      <v-col cols="12" sm="6" offset-sm="3">
        <v-card color="background" class="pa-3 text-center">
          <v-progress-circular v-if="loading" indeterminate color="primary" size="56" class="mb-1" />
          <div v-else class="rank text-h1 font-weight-medium text-primary slide-in-animation-container">
            <div class="slide-in-animation">
              <Medal v-if="medalColor" :size="70" :type="medalColor" />
              {{ rank }}.
            </div>
          </div>
          <v-alert v-if="error" class="rank-fetch-error" type="error">
            {{ error.message }}
          </v-alert>
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
</template>
