<script setup lang="ts">
const props = defineProps<{
  modelValue?: string
  currentQuestionNr: number
  question?: GameQuestion
  correctAnswer?: string
  loading?: boolean
}>()

const emits = defineEmits<{
  (e: 'update:model-value', val?: string): void
}>()

const headingIndex = ref(0)
const questionIndex = ref(0)
const headingComplete = ref(false)
const typingDone = ref(true)
const visibleAnswers = ref<number>(0)

const fullHeading = computed(() => `Frage ${props.currentQuestionNr}`)
const fullQuestion = computed(() => props.question?.question ?? '')

let animationCancelled = false

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function typeIndex(target: Ref<number>, length: number, speed = 30) {
  target.value = 0
  for (let i = 0; i < length; i++) {
    if (animationCancelled)
      return
    target.value = i + 1
    await sleep(speed)
  }
}

async function animateIn() {
  const answerCount = props.question?.answers?.length ?? 0

  headingIndex.value = 0
  questionIndex.value = 0
  headingComplete.value = false
  visibleAnswers.value = 0
  typingDone.value = false

  await typeIndex(headingIndex, fullHeading.value.length, 40)
  if (animationCancelled)
    return
  headingComplete.value = true

  await typeIndex(questionIndex, fullQuestion.value.length, 20)
  if (animationCancelled)
    return

  typingDone.value = true

  for (let i = 0; i < answerCount; i++) {
    if (animationCancelled)
      return
    visibleAnswers.value = i + 1
    await sleep(300)
  }
}

const prevQuestionNr = ref<number>()

watch(() => props.question, async (newQ, _oldQ) => {
  if (!newQ)
    return

  // Cancel any running animation
  animationCancelled = true
  await sleep(10)
  animationCancelled = false

  await sleep(50)

  // Animate in new content
  await animateIn()
  prevQuestionNr.value = props.currentQuestionNr
}, { immediate: true })

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
          <span>{{ fullHeading.slice(0, headingIndex) }}</span><span style="visibility: hidden;">{{ fullHeading.slice(headingIndex) }}</span>
        </div>
        <span>{{ fullQuestion.slice(0, questionIndex) }}</span><span style="visibility: hidden;">{{ fullQuestion.slice(questionIndex) }}</span>
      </div>
    </div>
    <v-item-group

      :model-value="modelValue" selected-class="bg-primary" :disabled="loading || !!correctAnswer || !typingDone"
      @update:model-value="emits('update:model-value', $event)"
    >
      <v-row class="py-3">
        <v-col v-for="(a, index) of question?.answers" :key="a" cols="12" md="6">
          <v-item v-slot="{ isSelected, selectedClass, toggle, disabled }" :value="a">
            <v-card
              class="d-flex align-center border-primary border-sm border-opacity-100 pa-4 text-h5 fill-height game-question--answer"
              :class="[...getAnswerClass(a, isSelected, selectedClass as any), { 'game-question--answer-visible': index < visibleAnswers }]"
              dark :disabled="disabled" @click="toggle"
            >
              <div class="flex-grow-1 text-center">
                {{ a }}
              </div>
            </v-card>
          </v-item>
        </v-col>
      </v-row>
    </v-item-group>
    <div class="text-body-2 text-center">
      <span class="question-meta">
        <span class="pr-1 opacity-40 ">Creepjack Folge:</span>
        <span>{{ question?.meta.creepjackEpisode }}</span>
      </span>
      <span class="question-meta">
        <span class="px-1 opacity-40 ">|</span>
        <span class="pr-1 opacity-40 ">Frage Nr.:</span>
        <span>{{ question?.meta.questionNr }}</span>
      </span>
      <span class="question-meta">
        <span class="px-1 opacity-40 ">|</span>
        <span class="pr-1 opacity-40 ">Author:</span>
        <span>{{ question?.meta.author ?? 'Anonym' }}</span>
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.question-meta {
  white-space: nowrap;
}

.game-question--answer {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.game-question--answer-visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
