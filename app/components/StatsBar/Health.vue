<script setup lang="ts">
const props = defineProps<{
  total: number
  remaining: number
}>()
const livesPercentage = computed(() => (props.remaining / props.total) * 100)

const colors = [
  { percent: 80, color: '#00d00c' },
  { percent: 35, color: 'warning' },
  { percent: 0, color: 'error' },
]

const barColor = computed(() => colors.find(r => livesPercentage.value >= r.percent)?.color as string)
</script>

<template>
  <StatsBar :color="barColor" :remaining="remaining" :total="total" suffix="HP" />
</template>
