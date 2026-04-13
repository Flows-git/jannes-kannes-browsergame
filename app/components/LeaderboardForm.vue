<script setup lang="ts">
import type { ValidationRule } from 'vuetify/lib/types.mjs'

const props = defineProps<{
  name?: string
}>()

const router = useRouter()
const { leaderboardId } = useLeaderboard()

const loading = ref(false)
const error = ref()
const name = ref<string>(props.name ?? '')
const valid = ref(false)
const privacyConsent = ref(false)
const isReturningPlayer = computed(() => !!leaderboardId.value)
const leaderboardForm = useTemplateRef('leaderboardForm')
const rules: ValidationRule[] = [
  val => !!val || 'Name eingeben',
  val => val.length >= 3 || 'Name muss mindestens 3 Zeichen lang sein',
  val => val.length <= 30 || 'Name darf maximal 30 Zeichen lang sein',
]

const canSubmit = computed(() => isReturningPlayer.value || privacyConsent.value)

async function addResultToLeaderboard() {
  loading.value = true
  error.value = undefined
  try {
    await leaderboardForm.value?.validate()
    if (!valid.value) {
      return
    }
    const response = await $fetch<LeaderboardSubmitResponse>('/api/leaderboard/submit', {
      method: 'POST',
      body: { name: name.value },
    })
    if (response.ok) {
      if (response.leaderboardId) {
        leaderboardId.value = response.leaderboardId
      }
      if (response.redirect) {
        router.replace(response.redirect)
      }
      return
    }
    if (!response.ok && response.reason === 'not_better' && response.existing) {
      error.value = `Du hast bereits einen besseren Eintrag in der Bestenliste: ${response.existing.score} Punkte in ${response.existing.gameTime}.`
    }
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
        <v-checkbox
          v-if="!isReturningPlayer"
          v-model="privacyConsent"
          density="compact"
          color="primary"
          hide-details
        >
          <template #label>
            <span class="text-body-2 pl-2">
              Ich stimme zu, dass eine Kennung im lokalen Speicher meines Browsers abgelegt wird, um mein Ergebnis in der Bestenliste aktualisieren zu können.
            </span>
          </template>
        </v-checkbox>
        <v-alert
          v-if="error"
          type="error"
          class="mt-3"
          closable
          @click:close="error = undefined"
        >
          {{ error }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" type="submit" :loading="loading" :disabled="!canSubmit">
          Ergebnis eintragen
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>
