<script setup lang="ts">
const emits = defineEmits<{
  cancelGame: []
}>()

const showDialog = defineModel<boolean>()
</script>

<template>
  <v-dialog v-model="showDialog" width="400">
    <template #default="{ isActive }">
      <v-card>
        <v-card-text class="text-h6 d-flex justify-space-between align-start">
          <div class="pr-2">
            Möchtest du das aktuelle Spiel wirklich beenden?
          </div>
          <v-btn icon="mdi-close" variant="text" class="mr-n3 mt-n3" @click="isActive.value = false" />
        </v-card-text>
        <v-card-actions>
          <v-btn @click="emits('cancelGame'), isActive.value = false">
            Spiel Beenden
          </v-btn>
          <v-btn color="primary" @click="isActive.value = false">
            Abbrechen
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
