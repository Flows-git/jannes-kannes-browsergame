<script setup lang="ts">
withDefaults(defineProps<{
  text: string
  acceptBtnText: string
  abortBtnText?: string
}>(), {
  abortBtnText: 'Abbrechen',
})

const emits = defineEmits<{
  accept: []
  cancel: []
}>()

const showDialog = defineModel<boolean>()

function accept() {
  emits('accept')
  showDialog.value = false
}

function cancel() {
  emits('cancel')
  showDialog.value = false
}
</script>

<template>
  <v-dialog v-model="showDialog" width="400">
    <v-card>
      <v-card-text class="text-h6 d-flex justify-space-between align-start">
        <div class="pr-2">
          {{ text }}
        </div>
        <v-btn icon="mdi-close" variant="text" class="mr-n3 mt-n3" @click="cancel" />
      </v-card-text>
      <v-card-actions>
        <v-btn @click="accept">
          {{ acceptBtnText }}
        </v-btn>
        <v-btn color="primary" @click="cancel">
          {{ abortBtnText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
