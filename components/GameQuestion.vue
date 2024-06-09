<script setup lang="ts">
const props = defineProps<{
  modelValue?: string
  currentQuestionNr: number
  question?: GameQuestionPlayer
  correctAnswer?: string
}>()

const emits = defineEmits<{
  (e: 'update:model-value', val?: string): void
}>()

function getAnswerClass(answer: string, isSelected?: boolean, selectedClass?: string) {
  if (props.correctAnswer) {
    if (isSelected) {
      if (props.correctAnswer === props.modelValue) {
        return ['border-success', 'bg-success']
      }
      else {
        return ['border-error', 'bg-error']
      }
    }
    else if (answer === props.correctAnswer) {
      return ['border-success', 'bg-success']
    }
  }
  return [selectedClass]
}
</script>

<template>
  <div v-if="question" class="text-h4 py-4 d-flex align-center justify-center text-center" style="height: 300px;">
    <div>
      <div class="text-h2 pb-3">
        Frage {{ currentQuestionNr }}
      </div>
      {{ question?.question }}
    </div>
  </div>
  <v-item-group :model-value="modelValue" selected-class="bg-primary" :disabled="!!correctAnswer" @update:model-value="emits('update:model-value', $event)">
    <v-row class="py-3">
      <v-col
        v-for="a of question?.answers"
        :key="a"
        cols="12"
        md="6"
      >
        <v-item v-slot="{ isSelected, selectedClass, toggle, disabled }" :value="a">
          <v-card
            class="d-flex align-center border-primary border-sm border-opacity-100 pa-4 text-h5 fill-height" :class="getAnswerClass(a, isSelected, selectedClass as any)"
            dark
            :disabled="disabled"
            @click="toggle"
          >
            <div
              class="flex-grow-1 text-center "
            >
              {{ a }}
            </div>
          </v-card>
        </v-item>
      </v-col>
    </v-row>
  </v-item-group>
</template>
