<script setup lang="ts">
import WarcraftIcon from '../WarcraftIcon.vue'

const selected = defineModel<GameTag[]>({ default: () => [] })

const { data: availableTags } = await useFetch<GameTag[]>('/api/admin/tags/selectable')
</script>

<template>
  <v-autocomplete
    v-model="selected"
    :items="availableTags ?? []"
    item-title="name"
    item-value="id"
    label="Tags"
    multiple
    chips
    closable-chips
    hide-details="auto"
    return-object
  >
    <template #chip="{ props: chipProps, item }">
      <v-chip v-bind="chipProps">
        <template v-if="item.raw.icon" #prepend>
          <div class="py-1">
            <WarcraftIcon :src="item.raw.icon" />
          </div>
        </template>
        {{ item.raw.name }}
      </v-chip>
    </template>
    <template #item="{ props: itemProps, item }">
      <v-list-item v-bind="itemProps" :title="item.raw.name">
        <template v-if="item.raw.icon" #prepend>
          <WarcraftIcon :src="item.raw.icon" />
        </template>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>
