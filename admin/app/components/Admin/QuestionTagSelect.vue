<script setup lang="ts">
type TagOption = GameTag | { name: string, icon?: string, reforgedIcon?: string }

const selected = defineModel<TagOption[]>({ default: () => [] })

const { data: availableTags } = await useFetch<GameTag[]>('/api/admin/tags/selectable')

const searchText = ref('')

function onEnterKey() {
  const text = searchText.value?.trim()
  if (!text)
    return

  const filteredItems = (availableTags.value ?? []).filter(t =>
    t.name.toLowerCase() === text.toLowerCase(),
  )

  // Don't add duplicates
  if (selected.value.some(t => t.name.toLowerCase() === text.toLowerCase()))
    return

  if (filteredItems.length > 0) {
    selected.value.push(...filteredItems)
  }
  else {
    selected.value = [...selected.value, { name: text }]
  }
  searchText.value = ''
}

function isNewTag(tag: TagOption): boolean {
  return !('id' in tag) || !tag.id
}
</script>

<template>
  <v-autocomplete
    v-model="selected"
    v-model:search="searchText"
    :items="availableTags ?? []"
    item-title="name"
    item-value="id"
    label="Tags"
    multiple
    chips
    closable-chips
    hide-details="auto"
    return-object
    @keydown.enter="onEnterKey"
  >
    <template #no-data>
      <div class="px-4 py-2 text-caption text-medium-emphasis">
        ENTER drücken um "{{ searchText }}" als neues Tag hinzuzufügen
      </div>
    </template>
    <template #chip="{ props: chipProps, item }">
      <v-chip v-bind="chipProps">
        <template v-if="item.raw.icon" #prepend>
          <div class="py-1">
            <WarcraftIcon :src="item.raw.icon" />
          </div>
        </template>
        {{ item.raw.name }}
        <v-chip
          v-if="isNewTag(item.raw)"
          size="x-small"
          color="primary"
          class="ml-1"
          :closable="false"
        >
          neu
        </v-chip>
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
