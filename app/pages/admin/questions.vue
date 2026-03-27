<script setup lang="ts">
import type { DataTableHeader } from 'vuetify'

const search = ref('')
const sortBy = ref<Array<{ key: string, order: 'asc' | 'desc' }>>([])

function fetchUrl() {
  const params = new URLSearchParams()
  if (search.value)
    params.set('search', search.value)
  if (sortBy.value.length && sortBy.value[0]) {
    params.set('sortBy', sortBy.value[0].key)
    params.set('sortOrder', sortBy.value[0].order)
  }
  const qs = params.toString()
  return `/api/admin/questions${qs ? `?${qs}` : ''}`
}

const { data, pending, refresh } = useFetch<QuestionDB[]>(fetchUrl)

const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const editQuestion = ref<QuestionDB>()

function openEdit(question: QuestionDB) {
  editQuestion.value = question
  showEditDialog.value = true
}

async function onCreate(formData: Omit<QuestionDB, 'id'>) {
  await $fetch('/api/admin/questions', { method: 'POST', body: formData })
  refresh()
}

async function onEdit(formData: Omit<QuestionDB, 'id'>) {
  await $fetch('/api/admin/questions', { method: 'PUT', body: { id: editQuestion.value!.id, ...formData } })
  showEditDialog.value = false
  refresh()
}

async function onDelete() {
  await $fetch('/api/admin/questions', { method: 'DELETE', query: { id: editQuestion.value!.id } })
  showEditDialog.value = false
  refresh()
}

const headers: Array<DataTableHeader> = [
  { title: 'Episode', key: 'id', width: 120 },
  { title: 'Frage', key: 'question' },
  { title: 'Antworten', key: 'answers', sortable: false },
  { title: 'Jannes Antwort', key: 'jannesAnswer' },
  { title: 'questionTimeOnStream', key: 'questionTimeOnStream' },
  { title: 'answerTimeOnStream', key: 'answerTimeOnStream' },
  { title: '', key: 'actions', sortable: false, width: 60 },
]
</script>

<template>
  <v-container fluid>
    <div class="pb-3" />
    <v-card>
      <div class="text-h4 pa-4 bg-surface-variant d-flex justify-space-between align-center">
        Fragen verwalten
        <v-btn color="primary" prepend-icon="mdi-plus" @click="showCreateDialog = true">
          Neue Frage
        </v-btn>
      </div>
      <div class="pa-4">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Suche"
          hide-details
          clearable
          variant="outlined"
          density="compact"
        />
      </div>
      <v-data-table
        v-model:sort-by="sortBy"
        :headers="headers"
        :items="data"
        :loading="pending"
        :search="search"
        items-per-page="25"
        :items-per-page-options="[10, 25, 50, 100]"
      >
        <template #[`item.id`]="{ item }">
          {{ item.creepjackEpisode }} / {{ item.jkEpisode }} / {{ item.questionNr }}
        </template>

        <template #[`item.question`]="{ value, item }">
          {{ value }} - <b class="text-primary">{{ item.author ?? 'Unbekannt' }}</b>
        </template>

        <template #[`item.answers`]="{ value, item }">
          <v-chip v-for="answer in value" :key="answer" size="small" class="mr-1 mb-1" :color="answer === item.correctAnswer ? 'success' : undefined">
            {{ answer }}
          </v-chip>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-btn icon="mdi-pencil" size="small" variant="text" @click="openEdit(item)" />
        </template>
        <template #no-data>
          <div class="pa-4 text-center">
            <v-icon icon="mdi-help-circle-outline" color="primary" size="80" />
            <div class="text-h5 py-3">
              Keine Fragen gefunden
            </div>
          </div>
        </template>

        <template #[`item.jannesAnswer`]="{ value, item }">
          <v-icon v-if="value === item.correctAnswer" icon="mdi-check-bold" color="success" />
          <v-icon v-else icon="mdi-close-thick" color="error" />
          {{ value }}
        </template>
      </v-data-table>
    </v-card>

    <AdminQuestionCreateDialog v-model="showCreateDialog" @save="onCreate" />
    <AdminQuestionEditDialog v-if="editQuestion" v-model="showEditDialog" :question="editQuestion" @save="onEdit" @delete="onDelete" />
  </v-container>
</template>
