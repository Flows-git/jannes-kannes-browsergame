<script setup lang="ts">
const props = defineProps<{
  question: QuestionDB
}>()

const emit = defineEmits<{
  save: [data: Omit<QuestionDB, 'id'>]
  delete: []
}>()

const showDialog = defineModel<boolean>()

const formRef = useTemplateRef('formRef')
const form = ref<Omit<QuestionDB, 'id'>>({ ...props.question, answers: [...props.question.answers] })

watch(showDialog, (open) => {
  if (open) {
    const { id, ...rest } = props.question
    form.value = { ...rest, answers: [...rest.answers] }
    formRef.value?.resetValidation()
  }
})

async function save() {
  await formRef.value?.validate()
  if (!formRef.value?.valid) return

  emit('save', { ...form.value, answers: [...form.value.answers] })
}

const showConfirmDelete = ref(false)

function confirmDelete() {
  emit('delete')
  showDialog.value = false
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="1000" scrollable>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center bg-surface-variant">
        Frage bearbeiten
        <v-btn icon="mdi-close" variant="text" @click="showDialog = false" />
      </v-card-title>
      <v-card-text>
        <AdminQuestionForm ref="formRef" v-model="form" />
      </v-card-text>
      <v-card-actions>
        <v-btn color="error" variant="text" prepend-icon="mdi-delete" @click="showConfirmDelete = true">
          Löschen
        </v-btn>
        <v-spacer />
        <v-btn variant="text" @click="showDialog = false">
          Abbrechen
        </v-btn>
        <v-btn color="primary" @click="save">
          Speichern
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <GameConfirmDialog
    v-model="showConfirmDelete"
    text="Soll diese Frage wirklich unwiderruflich gelöscht werden?"
    accept-btn-text="Löschen"
    @accept="confirmDelete"
  />
</template>
