<script setup lang="ts">
withDefaults(defineProps<{
  total: number
  remaining: number
  color: string
  suffix?: string
  height?: number
}>(), {
  height: 20,
})
</script>

<template>
  <div class="stats-bar rounded">
    <v-progress-linear :height="height" :color="color" :model-value="remaining" :max="total" class="rounded">
      <div style="text-shadow: 1px 1px 0px #000000;">
        {{ remaining }} / {{ total }} {{ suffix ?? '' }}
      </div>
    </v-progress-linear>
  </div>
</template>

<style lang="scss" scoped>
.stats-bar {
  border: 1px solid #000;

  &,
  :deep(.v-progress-linear__determinate) {
    box-shadow: inset 1px -4px 3px -3px #000000, inset 1px 4px 3px -3px #FFFFFF;
  }
}
</style>
