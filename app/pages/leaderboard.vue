<script setup lang="ts">
import type { DataTableHeader } from 'vuetify'

const { data, pending } = useFetch('/api/leaderboard')

const headers: Array<DataTableHeader> = [
  { title: 'Rang', key: 'rank', align: 'center', sortable: false },
  { title: 'Name', key: 'name', sortable: false },
  { title: 'Punktzahl', key: 'score', align: 'center', sortable: false },
  { title: 'Spielzeit', key: 'gameTime', sortable: false },
  { title: 'Durchschnittliche Antwortzeit', key: 'averageAnswerTime', sortable: false },
]
</script>

<template>
  <v-container>
    <div class="text-h3 text-center text-primary pb-3">
      Leaderboard
    </div>
    <v-data-table :headers="headers" :items="data" :loading="pending" :items-per-page="-1" hide-default-footer />
  </v-container>
</template>
