<script setup lang="ts">
defineProps<{
  val: string | number
  type: 'gold' | 'silver' | 'bronze'
}>()
</script>

<template>
  <div class="medal" :class="type">
    <div class="content d-flex align-center justify-center">
      {{ val }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.medal {
  --medal-size: 40px;
  --medal-border-size: calc(var(--medal-size) / 10);

  display: inline-block;
  height: var(--medal-size);
  width: var(--medal-size);
  border-radius: calc(var(--medal-size) / 2);
  font-size: calc(var(--medal-size) / 2);
  color: #000;
  padding: var(--medal-border-size);
  font-weight: bold;

  .content {
    height: calc(var(--medal-size) - 2 * var(--medal-border-size));
    width: calc(var(--medal-size) - 2 * var(--medal-border-size));
    border-radius: calc(var(--medal-size) - 2 * var(--medal-border-size) / 2);
  }

  &.gold {
    background:
        linear-gradient(90deg, #ffe233 0%, #c7801d 25%, #844414 50%, #c7801d 75%, #ffe233 100%) !important;
    color: #844414;
    .content {
      background:
        // linear-gradient(90deg, #844414, #c7801d, #ffe233, #c7801d, #844414) !important;
        linear-gradient(90deg, #844414 0%, #ffe233 25%, #c7801d 50%, #ffe233 75%, #844414 100%) !important;
    }
  }

  &.silver {
    background:
      linear-gradient(90deg, #e3e3e3 0%, #7e7e7e 25%, #e3e3e3 50%, #7e7e7e 75%, #e3e3e3 100%) !important;
    color: #555;

    .content {
      background:
        linear-gradient(90deg, #7e7e7e 0%, #e3e3e3 25%, #787878 50%, #e3e3e3 75%, #7e7e7e 100%) !important;
    }
  }

  &.bronze {
    background:
        linear-gradient(90deg, #cf7d52 0%, #fcd5be 25%, #844414 50%, #fcd5be 75%, #cf7d52 100%) !important;
    color: #844414;

    .content {
      background:
        linear-gradient(90deg, #844414 0%, #fcd5be 25%, #cf7d52 50%, #fcd5be 75%, #844414 100%) !important;
    }
  }
}
</style>
