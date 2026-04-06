<script setup lang="ts">
const { data, error } = await useFetch('/api/admin/tags', { deep: true })

const tags = computed<GameTag[]>(() => (data.value ?? []))

async function fetchTags(tag: GameTag) {
  await $fetch(`/api/admin/tags?tag=${tag.name}`)
    .then(res => tag.children = res)
    .catch(err => console.warn(err))
}

function getImage(tag: GameTag) {
  if (tag.name === 'Undead' || tag.name === 'Human' || tag.name === 'Orc' || tag.name === 'Night Elf') {
    return `/race_icons/${tag.icon}`
  }
  return `/warcraft3_icons/${tag.icon}`
}
</script>

<template>
  <v-container>
    <div class="pb-3">
      <v-btn color="primary" to="/admin">
        Zurück
      </v-btn>
    </div>
    <div class="text-h4 pa-4 bg-surface-variant d-flex justify-space-between align-center">
      Tags
    </div>
    {{ error }}
    <ClientOnly>
      <VTreeview
        :items="tags"
        :load-children="fetchTags as any"
        color="primary"
        item-title="name"
        item-value="name"
        activatable
        transition
      >
        <template #prepend="{ item }">
          <v-avatar v-if="item.icon" :image="getImage(item)" size="32" :rounded="0" />
        </template>
      </VTreeview>
    </ClientOnly>
  </v-container>
</template>
