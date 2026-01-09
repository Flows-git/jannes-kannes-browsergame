<script setup lang="ts">
import type { DataTableHeader } from 'vuetify'
import { useDisplay } from 'vuetify'

const route = useRoute()
const router = useRouter()
const { xs } = useDisplay()

const id: number | undefined = route.query.id ? Number(route.query.id) : undefined
const perPage = ref(Number(route.query.perPage as string ?? 10))

const page = computed({
  get: () => Number(route.query.p as string ?? 1),
  set: async val => updateQueryParams(val),
})

watch(perPage, () => {
  updateQueryParams()
})

function updateQueryParams(_page?: number, _perPage?: number) {
  const p = _page ?? page.value
  const pp = _perPage ?? perPage.value
  router.replace({ query: { p: p !== 1 ? p : undefined, perPage: pp !== 10 ? pp : undefined, id: route.query.id } })
}

const { data, pending } = useFetch<{ items: Array<LeaderboardListEntry>, meta: { totalCount: number } }>(() => {
  return `/api/leaderboard?page=${page.value}&perPage=${perPage.value}`
})

const headers = computed<Array<DataTableHeader>>(() => {
  const i: Array<DataTableHeader> = [
    { title: 'Rang', key: 'rank', align: 'center', sortable: false, maxWidth: 100, width: 100 },
    { title: 'Name', key: 'name', sortable: false },
    { title: 'Punktzahl', key: 'score', align: 'center', sortable: false, maxWidth: 100, width: 100 },

  ]

  if (!xs.value) {
    i.push(
      { title: 'Spielzeit', key: 'gameTime', align: 'center', sortable: false, maxWidth: 150, width: 150 },
      { title: 'Durchschnittliche Antwortzeit', align: 'center', key: 'averageAnswerTime', sortable: false, maxWidth: 150, width: 150 },
    )
  }

  return i
})

const confettiDone = ref(false)
const confetti = useConfetti()

function isRowSelected(data: LeaderboardListEntry) {
  if (data.id === id) {
    if (data.rank < 4 && !confettiDone.value) {
      confetti.startConfetti(5)
      confettiDone.value = true
    }
    return { class: 'active-row', id: `id${id}` }
  }
  return { id: `id${data.id}` }
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
      <v-data-table-server
        v-model:items-per-page="perPage" v-model:page="page" :model-value="id ? [id] : []" :headers="headers" :items="data?.items"
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
        <template #no-data>
          <div class="pa-4">
            <v-icon icon="mdi-trophy-broken" color="primary" size="80" />
            <div class="text-h5 py-3">
              Keine Einträge
            </div>
            <div>Sei der erste und</div>
            <v-btn color="primary" variant="outlined">
              Starte ein Ranglistenspiel
            </v-btn>
          </div>
        </template>
      </v-data-table-server>
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
