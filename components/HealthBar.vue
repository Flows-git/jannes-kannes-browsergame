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

const barColor = computed(() => colors.find(r => livesPercentage.value >= r.percent)?.color)
</script>

<template>
  <div class="health-bar rounded">
    <v-progress-linear height="20" :color="barColor" :model-value="remainingLives" :max="totalLives" class="rounded" style="">
      <div style="text-shadow: 1px 1px 0px #000000;">
        {{ remainingLives }} / {{ totalLives }}
      </div>
    </v-progress-linear>
  </div>
</template>

<style lang="scss" scoped>
.health-bar {
  width: 100px;
  border: 1px solid #000;

  &,
  :deep(.v-progress-linear__determinate) {
    box-shadow: inset 1px -4px 3px -3px #000000, inset 1px 4px 3px -3px #FFFFFF;
  }
}
</style>
