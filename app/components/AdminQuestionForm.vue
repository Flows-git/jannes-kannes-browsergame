<script setup lang="ts">
const props = defineProps<{
  question?: QuestionDB
}>()

const emit = defineEmits<{
  save: [data: Omit<QuestionDB, 'id'>, keepOpen: boolean]
}>()

const showDialog = defineModel<boolean>()

const defaultForm: Omit<QuestionDB, 'id'> = {
  question: '',
  answers: ['', ''],
  correctAnswer: '',
  author: '',
  creepjackEpisode: 0,
  jkEpisode: '',
  questionNr: 0,
  jannesAnswer: '',
  questionTimeOnStream: '',
  answerTimeOnStream: '',
}

const form = ref<Omit<QuestionDB, 'id'>>({ ...defaultForm, answers: [...defaultForm.answers] })
const valid = ref(false)
const formRef = useTemplateRef('formRef')

const requiredRule = [(v: string) => !!v || 'Pflichtfeld']

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

watch(showDialog, (open) => {
  if (open) {
    if (props.question) {
      const { id, ...rest } = props.question
      form.value = { ...rest, answers: [...rest.answers] }
    }
    else {
      form.value = { ...defaultForm, answers: [...defaultForm.answers] }
    }
  }
})

function addAnswer() {
  form.value.answers.push('')
}

const addAnother = ref(false)

async function save() {
  await formRef.value?.validate()
  if (!valid.value)
    return

  emit('save', { ...form.value, answers: [...form.value.answers] }, addAnother.value)

  if (addAnother.value) {
    form.value = { ...defaultForm, answers: [...defaultForm.answers] }
    formRef.value?.resetValidation()
  }
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="1000" scrollable>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center bg-surface-variant">
        <span>{{ question ? 'Frage bearbeiten' : 'Neue Frage' }}</span>
        <v-btn icon="mdi-close" variant="text" @click="showDialog = false" />
      </v-card-title>

      <v-card-text>
        <v-form ref="formRef" v-model="valid" @submit.prevent="save">
          <v-row>
            <v-col cols="4">
              <v-text-field
                v-model.number="form.creepjackEpisode"
                :rules="requiredRule"
                label="Creepjack Episode"
                type="number"
              />
            </v-col>
            <v-col cols="4">
              <v-text-field v-model="form.jkEpisode" label="Jannes Kann es Episode" :rules="requiredRule" />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model.number="form.questionNr"
                :rules="requiredRule"
                label="Frage Nr."
                type="number"
              />
            </v-col>
          </v-row>

          <v-text-field
            v-model="form.question"
            label="Frage"
            :rules="requiredRule"
          />

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
              :rules="requiredRule"
              @update:model-value="onAnswerUpdate(i, $event)"
              hide-details="auto"
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
          <v-btn
            variant="text"
            size="small"
            prepend-icon="mdi-plus"
            class="mb-2"
            @click="addAnswer"
          >
            Antwort hinzufügen
          </v-btn>
          <div class="d-flex ga-4 mb-4 text-caption text-medium-emphasis">
            <span><v-icon icon="mdi-check-circle" color="success" size="small" /> Korrekte Antwort: {{ form.correctAnswer || '–' }}</span>
            <span><v-icon icon="mdi-account-circle" color="primary" size="small" /> Jannes Antwort: {{ form.jannesAnswer || '–' }}</span>
          </div>

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
      </v-card-text>

      <v-card-actions>
        <v-checkbox
          v-if="!question"
          v-model="addAnother"
          label="Weitere anlegen"
          hide-details
          density="compact"
        />
        <v-spacer />
        <v-btn variant="text" @click="showDialog = false">
          Abbrechen
        </v-btn>
        <v-btn color="primary" @click="save">
          {{ question ? 'Speichern' : 'Anlegen' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
