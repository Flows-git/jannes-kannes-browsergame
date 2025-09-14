<script setup lang="ts">
import questions from '@@/data/questions.json'

const headers = ref([
  { title: 'Frage', key: 'question', sortable: false },
  { title: 'Antwortmöglichkeiten', key: 'answers', sortable: false },
  { title: 'Meta', key: 'meta', sortable: false },
])
</script>

<template>
  <v-container fluid>
    <v-card>
      <v-card-text>
        <h1>Alle Fragen</h1>
      </v-card-text>
    </v-card>
    <v-data-table :items="questions" :headers="headers">
      <template #[`item.question`]="{ value }">
        <div class="text-h6 text-primary">
          {{ value }}
        </div>
      </template>

      <template #[`item.answers`]="{ value, item }">
        <div v-for="(answer, i) of value" :key="`answer-${i}`" :class="{ 'text-primary': answer === item.correctAnswer }">
          {{ answer }}
        </div>
      </template>

      <template #[`item.meta`]="{ value }">
        <div v-for="(val, key) of value" :key="`meta-${key}`">
          {{ key }}: {{ val }}
        </div>
      </template>
    </v-data-table>
  </v-container>
</template>
