<script setup lang="ts">
const props = defineProps<{
  totalLives: number
  remainingLives: number
}>()
const livesPercentage = computed(() => (props.remainingLives / props.totalLives) * 100)

const colors = [
  { percent: 80, color: '#00d00c' },
  { percent: 35, color: 'warning' },
  { percent: 0, color: 'error' },
]

const barColor = computed(() => colors.find(r => livesPercentage.value >= r.percent)?.color as string)
</script>

<template>
  <StatsBar :color="barColor" :remaining="remainingLives" :total="totalLives" suffix="HP" />
</template>
