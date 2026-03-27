<script setup lang="ts">
const emit = defineEmits<{
  save: [data: Omit<QuestionDB, 'id'>]
}>()

const showDialog = defineModel<boolean>()

const defaultForm = (): Omit<QuestionDB, 'id'> => ({
  question: '',
  answers: ['Ja', 'Nein'],
  correctAnswer: '',
  author: '',
  creepjackEpisode: 0,
  jkEpisode: '',
  questionNr: 0,
  jannesAnswer: '',
  questionTimeOnStream: '',
  answerTimeOnStream: '',
})

const form = ref(defaultForm())
const formRef = useTemplateRef('formRef')
const addAnother = ref(false)

watch(showDialog, (open) => {
  if (open) {
    form.value = defaultForm()
    formRef.value?.resetValidation()
  }
})

async function save() {
  await formRef.value?.validate()
  if (!formRef.value?.valid) return

  emit('save', { ...form.value, answers: [...form.value.answers] })

  if (addAnother.value) {
    form.value = defaultForm()
    formRef.value?.resetValidation()
  }
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="1000" scrollable>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center bg-surface-variant">
        Neue Frage
        <v-btn icon="mdi-close" variant="text" @click="showDialog = false" />
      </v-card-title>
      <v-card-text>
        <AdminQuestionForm ref="formRef" v-model="form" />
      </v-card-text>
      <v-card-actions>
        <v-checkbox v-model="addAnother" label="Weitere anlegen" hide-details density="compact" />
        <v-spacer />
        <v-btn variant="text" @click="showDialog = false">
          Abbrechen
        </v-btn>
        <v-btn color="primary" @click="save">
          Anlegen
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
