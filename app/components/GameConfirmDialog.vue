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
  <GameDialog v-model="showDialog">
    <div class="d-flex align-center justify-center flex-column pt-4">
      <div class="text-h5 text-sm-h4 pa-3 text-white">
        {{ text }}
      </div>
      <div class="pt-3">
        <v-btn class="mx-2" size="large" @click="accept">
          {{ acceptBtnText }}
        </v-btn>
        <v-btn class="mx-2" size="large" color="primary" @click="cancel">
          {{ abortBtnText }}
        </v-btn>
      </div>
    </div>
  </GameDialog>
</template>
