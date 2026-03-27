<script setup lang="ts">
const form = defineModel<Omit<QuestionDB, 'id'>>({ required: true })

const valid = ref(false)
const formRef = useTemplateRef('formRef')

const requiredStringRule = [(v: string) => !!v?.trim() || 'Pflichtfeld']
const positiveNumberRule = [(v: number) => v > 0 || 'Pflichtfeld']

function answerRules(index: number) {
  return [
    (v: string) => !!v?.trim() || 'Pflichtfeld',
    (v: string) => form.value.answers.filter((a, i) => i !== index && a.trim() === v.trim()).length === 0 || 'Antwort bereits vorhanden',
  ]
}

const showSelectionErrors = ref(false)

defineExpose({
  validate: async () => {
    showSelectionErrors.value = true
    const result = await formRef.value?.validate()
    const selectionsValid = !!form.value.correctAnswer && !!form.value.jannesAnswer
    if (!selectionsValid) valid.value = false
    return result?.valid && selectionsValid ? result : { valid: false }
  },
  resetValidation: () => {
    formRef.value?.resetValidation()
    showSelectionErrors.value = false
  },
  valid,
})

function addAnswer() {
  form.value.answers.push('')
}

function removeAnswer(index: number) {
  const removed = form.value.answers[index]
  if (removed === form.value.correctAnswer) form.value.correctAnswer = ''
  if (removed === form.value.jannesAnswer) form.value.jannesAnswer = ''
  form.value.answers.splice(index, 1)
}

function onAnswerUpdate(index: number, newVal: string) {
  const oldVal = form.value.answers[index]
  if (form.value.correctAnswer === oldVal) form.value.correctAnswer = newVal
  if (form.value.jannesAnswer === oldVal) form.value.jannesAnswer = newVal
  form.value.answers[index] = newVal
}

</script>

<template>
  <v-form ref="formRef" v-model="valid" @submit.prevent>
    <v-row>
      <v-col cols="4">
        <v-text-field
          v-model.number="form.creepjackEpisode"
          :rules="positiveNumberRule"
          label="Creepjack Episode"
          type="number"
        />
      </v-col>
      <v-col cols="4">
        <v-text-field v-model="form.jkEpisode" label="Jannes Kann es Episode" :rules="requiredStringRule" />
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model.number="form.questionNr"
          :rules="positiveNumberRule"
          label="Frage Nr."
          type="number"
        />
      </v-col>
    </v-row>

    <v-text-field v-model="form.question" label="Frage" :rules="requiredStringRule" />

    <div class="text-subtitle-2 mb-2">
      Antworten
    </div>
    <div v-for="(_, i) in form.answers" :key="i" class="d-flex align-center ga-2 mb-1">
      <v-tooltip text="Korrekte Antwort" location="top">
        <template #activator="{ props: tooltipProps }">
          <v-icon
            v-bind="tooltipProps"
            :icon="form.answers[i] && form.correctAnswer === form.answers[i] ? 'mdi-check-circle' : 'mdi-check-circle-outline'"
            :color="form.answers[i] && form.correctAnswer === form.answers[i] ? 'success' : 'default'"
            style="cursor: pointer"
            @click="form.answers[i] && (form.correctAnswer = form.answers[i])"
          />
        </template>
      </v-tooltip>
      <v-tooltip text="Jannes Antwort" location="top">
        <template #activator="{ props: tooltipProps }">
          <v-icon
            v-bind="tooltipProps"
            :icon="form.answers[i] && form.jannesAnswer === form.answers[i] ? 'mdi-account-circle' : 'mdi-account-circle-outline'"
            :color="form.answers[i] && form.jannesAnswer === form.answers[i] ? 'primary' : 'default'"
            style="cursor: pointer"
            @click="form.answers[i] && (form.jannesAnswer = form.answers[i])"
          />
        </template>
      </v-tooltip>
      <v-text-field
        :model-value="form.answers[i]"
        :label="`Antwort ${i + 1}`"
        :rules="answerRules(i)"
        hide-details="auto"
        @update:model-value="onAnswerUpdate(i, $event)"
      />
      <v-btn
        v-if="form.answers.length > 2"
        icon="mdi-close"
        size="small"
        variant="text"
        color="error"
        @click="removeAnswer(i)"
      />
    </div>
    <v-btn variant="text" size="small" prepend-icon="mdi-plus" class="mb-2" @click="addAnswer">
      Antwort hinzufügen
    </v-btn>
    <div class="mb-4">
      <div class="d-flex ga-4 text-caption text-medium-emphasis">
        <span><v-icon icon="mdi-check-circle" color="success" size="small" /> Korrekte Antwort: {{ form.correctAnswer || '–' }}</span>
        <span><v-icon icon="mdi-account-circle" color="primary" size="small" /> Jannes Antwort: {{ form.jannesAnswer || '–' }}</span>
      </div>
      <div v-if="showSelectionErrors" class="d-flex ga-4 mt-1">
        <span v-if="!form.correctAnswer" class="text-caption text-error">Korrekte Antwort auswählen</span>
        <span v-if="!form.jannesAnswer" class="text-caption text-error">Jannes Antwort auswählen</span>
      </div>
    </div>

    <AdminQuestionTagSelect v-model="form.tags" class="mb-4" />

    <v-row>
      <v-col cols="4">
        <v-text-field v-model="form.author" label="Autor" />
      </v-col>
      <v-col cols="4">
        <v-text-field v-model="form.questionTimeOnStream" label="Fragezeit im Stream" />
      </v-col>
      <v-col cols="4">
        <v-text-field v-model="form.answerTimeOnStream" label="Antwortzeit im Stream" />
      </v-col>
    </v-row>
  </v-form>
</template>
