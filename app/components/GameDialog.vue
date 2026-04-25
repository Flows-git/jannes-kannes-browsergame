<script setup lang="ts">
defineProps<{
  title?: string
}>()
const showDialog = defineModel<boolean>()

watch(showDialog, () => {
  if (showDialog.value) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})
</script>

<template>
  <Transition name="dialog-fade">
    <div v-if="showDialog" class="game-dialog text-white pa-3 flex-column d-flex">
      <div class="d-flex align-center">
        <div class="flex-grow-1 text-center text-h6 text-sm-h4">
          {{ title }}
        </div>
        <div class="align-self-start">
          <v-btn icon="mdi-close" @click="showDialog = false" />
        </div>
      </div>
      <div class="w-100 text-center flex-grow-1">
        <slot />
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.5s ease, backdrop-filter 1s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
  backdrop-filter: blur(0);
}

.game-dialog {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(30, 27, 19, 0.8);
  color: #000;
  backdrop-filter: blur(12px);
  overflow: auto;
}
</style>
