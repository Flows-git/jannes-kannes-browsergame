<script setup lang="ts">
defineProps<{
  total: number
  remaining: number
}>()
</script>

<template>
  <StatsBar color="#4792d5" :remaining="remaining" :total="total" suffix="Mana" :height="16" />
</template>
