<script setup lang="ts">
import type { ValidationRule } from 'vuetify/lib/types.mjs'

const router = useRouter()

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

getRank()

const leaderboardLoading = ref(false)
const leaderboardError = ref()
const name = ref()
const valid = ref(false)
const leaderboardForm = useTemplateRef('leaderboardForm')
const rules: ValidationRule[] = [
  val => !!val || 'Name eingeben',
  val => val.length >= 3 || 'Name muss mindestens 3 Zeichen lang sein',
  val => val.length <= 30 || 'Name darf maximal 30 Zeichen lang sein',
]

async function addResultToLeaderboard() {
  leaderboardLoading.value = true
  leaderboardError.value = undefined
  try {
    await leaderboardForm.value?.validate()
    if (!valid.value) {
      return
    }
    const leaderboardUrl = await $fetch('/api/leaderboard', { method: 'POST', body: { name: name.value } })
    router.replace(leaderboardUrl)
  }
  catch (error) {
    leaderboardError.value = error
  }
  leaderboardLoading.value = false
}
</script>

<template>
  <div>
    <div class="text-h5 text-center opacity-70 pb-3">
      Bestenliste
    </div>
    <v-row>
      <v-col cols="12" sm="6" offset-sm="3">
        <v-card color="background" class="pa-3 text-center">
          <v-progress-circular v-if="loading" indeterminate color="primary" size="56" class="mb-1" />
          <div v-else class="text-h2 font-weight-medium text-primary">
            {{ rank }}.
          </div>
          <v-alert v-if="error" type="error">
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
            <v-btn color="primary" v-bind="props">
              <v-icon icon="mdi-trophy-variant" />
              Ergebnis in Rangliste eintragen
            </v-btn>
          </template>
          <v-form ref="leaderboardForm" v-model="valid" @submit.prevent="addResultToLeaderboard">
            <v-card>
              <v-card-title>Name eingeben</v-card-title>
              <div>{{ name }}</div>
              <v-card-text>
                <v-text-field v-model="name" label="Name" :rules="rules" />
                <v-alert v-if="leaderboardError" type="error" closable @click:close="leaderboardError.value = undefined">
                  {{ leaderboardError }}
                </v-alert>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" type="submit">
                  Ergebnis eintragen
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
      </v-col>
    </v-row>
  </div>
</template>
