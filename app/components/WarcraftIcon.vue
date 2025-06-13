<script setup lang="ts">
defineProps<{
  src: string
}>()
</script>

<template>
  <v-img :src="`/warcraft3_icons/${src}`" height="32px" width="32px" class="mr-1" />
</template>
