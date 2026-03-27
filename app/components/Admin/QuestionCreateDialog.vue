<script setup lang="ts">
const emit = defineEmits<{
  save: [data: Omit<QuestionDB, 'id'>, addAnother: boolean]
}>()

const showDialog = defineModel<boolean>()

const form = ref<Omit<QuestionDB, 'id'>>(setupForm())
const formRef = useTemplateRef('formRef')
const addAnother = ref(false)

function setupForm(override?: Partial<QuestionDB>): Omit<QuestionDB, 'id'> {
  return {
    question: '',
    answers: ['Ja', 'Nein'],
    correctAnswer: '',
    author: '',
    creepjackEpisode: 0,
    jkEpisode: '',
    questionNr: 1,
    jannesAnswer: '',
    questionTimeOnStream: '',
    answerTimeOnStream: '',
    ...override,
  }
}

watch(showDialog, async (open) => {
  if (open) {
    const defaults = await $fetch('/api/admin/questions/defaults')
    form.value = setupForm({
      creepjackEpisode: defaults.creepjackEpisode,
      jkEpisode: defaults.jkEpisode,
    })
    formRef.value?.resetValidation()
  }
})

async function save() {
  await formRef.value?.validate()
  if (!formRef.value?.valid)
    return

  emit('save', { ...form.value, answers: [...form.value.answers] }, addAnother.value)

  if (addAnother.value) {
    form.value = setupForm({
      creepjackEpisode: form.value.creepjackEpisode,
      jkEpisode: form.value.jkEpisode,
      questionNr: form.value.questionNr + 1,

    })
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
