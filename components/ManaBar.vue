<script setup lang="ts">
defineProps<{
  totalJoker: number
  remainingJoker: number
}>()
</script>

<template>
  <StatsBar color="#4792d5" :remaining="remainingJoker" :total="totalJoker" suffix="Joker" :height="16" />
</template>
