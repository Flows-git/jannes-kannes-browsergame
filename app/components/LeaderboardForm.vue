<script setup lang="ts">
import type { ValidationRule } from 'vuetify/lib/types.mjs'

const router = useRouter()

const loading = ref(false)
const error = ref()
const name = ref()
const valid = ref(false)
const leaderboardForm = useTemplateRef('leaderboardForm')
const rules: ValidationRule[] = [
  val => !!val || 'Name eingeben',
  val => val.length >= 3 || 'Name muss mindestens 3 Zeichen lang sein',
  val => val.length <= 30 || 'Name darf maximal 30 Zeichen lang sein',
]

async function addResultToLeaderboard() {
  loading.value = true
  error.value = undefined
  try {
    await leaderboardForm.value?.validate()
    if (!valid.value) {
      return
    }
    const leaderboardUrl = await $fetch('/api/leaderboard', {
      method: 'POST',
      body: { name: name.value },
    })
    router.replace(leaderboardUrl)
  }
  catch (e) {
    error.value = e
  }
  loading.value = false
}
</script>

<template>
  <v-form
    ref="leaderboardForm"
    v-model="valid"
    @submit.prevent="addResultToLeaderboard"
  >
    <v-card>
      <v-card-title>Name eingeben</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="name"
          label="Name"
          name="name"
          class="name"
          :rules="rules"
          :disabled="loading"
        />
        <v-alert
          v-if="error"
          type="error"
          closable
          @click:close="error.value = undefined"
        >
          {{ error }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" type="submit" :loading="loading">
          Ergebnis eintragen
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>
