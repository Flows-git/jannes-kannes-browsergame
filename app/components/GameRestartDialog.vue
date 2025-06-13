<script setup lang="ts">
const emits = defineEmits<{
  restartGame: []
}>()

const showDialog = defineModel<boolean>()
</script>

<template>
  <game-confirm-dialog
    v-model="showDialog"
    text="Möchtest du das aktuelle Spiel wirklich neustarten?"
    accept-btn-text="Spiel Neustarten"
    @accept="emits('restartGame')"
  />
</template>
