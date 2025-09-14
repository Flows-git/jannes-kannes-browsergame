<script setup lang="ts">
const result = ref()
async function testStore() {
  result.value = await $fetch('/api/test')
}
</script>

<template>
  <v-container class="fill-height align-center justify-center jk-game--container">
    {{ result }}

    <v-btn @click="testStore">
      Do Test Store
    </v-btn>
  </v-container>
</template>
