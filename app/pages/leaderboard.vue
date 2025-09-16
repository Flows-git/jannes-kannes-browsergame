<script setup lang="ts">
import type { DataTableHeader } from 'vuetify'

const route = useRoute()

const page = ref(1)
const perPage = ref(10)
const { data, pending } = useFetch<{ items: Array<LeaderboardEntry>, meta: { totalCount: number } }>(() => `/api/leaderboard?page=${page.value}&perPage=${perPage.value}`)

const headers: Array<DataTableHeader> = [
  { title: 'Rang', key: 'rank', align: 'center', sortable: false, maxWidth: 100, width: 100 },
  { title: 'Name', key: 'name', sortable: false },
  { title: 'Punktzahl', key: 'score', align: 'center', sortable: false, maxWidth: 100, width: 100 },
  { title: 'Spielzeit', key: 'gameTime', align: 'center', sortable: false, maxWidth: 150, width: 150 },
  { title: 'Durchschnittliche Antwortzeit', align: 'center', key: 'averageAnswerTime', sortable: false, maxWidth: 150, width: 150 },
]

const selected = computed(() => Number.parseInt(route.hash.replaceAll('#id', '')))
// const selected2 = computed(() => Number.parseInt(route.query.id as string))

function isRowSelected(data: LeaderboardEntry) {
  if (data.id === selected.value) {
    return { class: 'active-row', id: `id${selected.value}` }
  }
  return {}
}
</script>

<template>
  <v-container class="leaderboard" max-width="800">
    <div class="pb-3">
      <v-btn color="primary" to="/">
        <v-icon icon="mdi-chevron-left" />
        Zurück zum Hauptmenü
      </v-btn>
    </div>
    <v-card>
      <div class="text-h4 text-center pa-3 bg-surface-variant d-flex  align-center justify-space-between">
        Bestenliste
        <GameLogo />
      </div>
      <client-only>
        <v-data-table-server
          v-model:items-per-page="perPage" v-model:page="page" :model-value="selected ? [selected] : []" :headers="headers" :items="data?.items"
          :loading="pending" :row-props="(e) => isRowSelected(e.item)" :items-length="data?.meta.totalCount ?? 0" item-value="id"
          :items-per-page-options="[10, 25, 50, 100]"
        >
          <template #[`item.rank`]="{ value }">
            <Medal v-if="value === 1" :val="value" type="gold" />
            <Medal v-else-if="value === 2" :val="value" type="silver" />
            <Medal v-else-if="value === 3" :val="value" type="bronze" />
            <div v-else class="text-h6">
              {{ value }}
            </div>
          </template>
          <template #[`item.score`]="{ value }">
            <span class="font-weight-bold text-h6">
              {{ value }}
            </span>
          </template>
        </v-data-table-server>
      </client-only>
    </v-card>
  </v-container>
</template>

<style lang="scss" scoped>
.leaderboard {

  :deep(.v-data-table__tr.active-row) {
    background-color: rgb(var(--v-theme-primary));
    color: rgb(var(--v-theme-on-primary));
  }

  :deep(.v-data-table__tr:not(.active-row):hover) {
    background: rgba(var(--v-theme-primary), 0.5);
  }
}
</style>
