<script setup lang="ts">
const emits = defineEmits<{
  cancelGame: []
}>()

const showDialog = defineModel<boolean>()
</script>

<template>
  <game-confirm-dialog
    v-model="showDialog"
    text="Möchtest du das aktuelle Spiel wirklich beenden?"
    accept-btn-text="Spiel Beenden"
    @accept="emits('cancelGame')"
  />
</template>
