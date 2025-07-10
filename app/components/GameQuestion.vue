<script setup lang="ts">
const props = defineProps<{
  modelValue?: string
  currentQuestionNr: number
  question?: GameQuestionClient
  correctAnswer?: string
  loading?: boolean
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
  <div>
    <div v-if="question" class="game-question--container text-h4 py-4 d-flex align-center justify-center text-center" style="min-height: 300px;">
      <div class="game-question">
        <div class="text-h2 pb-3 font-weight-thin">
          Frage {{ currentQuestionNr }}
        </div>
        {{ question.question }}
      </div>
    </div>
    <v-item-group
      :model-value="modelValue" selected-class="bg-primary" :disabled="loading || !!correctAnswer"
      @update:model-value="emits('update:model-value', $event)"
    >
      <v-row class="py-3">
        <v-col v-for="a of question?.answers" :key="a" cols="12" md="6">
          <v-item v-slot="{ isSelected, selectedClass, toggle, disabled }" :value="a">
            <v-card
              class="d-flex align-center border-primary border-sm border-opacity-100 pa-4 text-h5 fill-height"
              :class="getAnswerClass(a, isSelected, selectedClass as any)" dark :disabled="disabled" @click="toggle"
            >
              <div class="flex-grow-1 text-center ">
                {{ a }}
              </div>
            </v-card>
          </v-item>
        </v-col>
      </v-row>
    </v-item-group>
    <div class="text-body-2 text-center">
      <span class="pr-1 opacity-40 ">Creepjack Folge:</span>
      <span>{{ question?.meta.creepjackEpisode }}</span>
      <span class="px-1 opacity-40 ">|</span>
      <span class="pr-1 opacity-40 ">Frage Nr.:</span>
      <span>{{ question?.meta.questionNr }}</span>
      <span class="px-1 opacity-40 ">|</span>
      <span class="pr-1 opacity-40 ">Author:</span>
      <span>{{ question?.meta.author ?? 'Anonym' }}</span>
    </div>
  </div>
</template>
