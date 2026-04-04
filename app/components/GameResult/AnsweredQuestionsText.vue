<script setup lang="ts">
defineProps<{
  meta: GameResult
}>()

const text1 = useTemplateRef('text1')
const text2 = useTemplateRef('text2')
const text3 = useTemplateRef('text3')
const text4 = useTemplateRef('text4')
const text5 = useTemplateRef('text5')

async function animate() {
  await text1.value?.animate()
  await text2.value?.animate()
  await text3.value?.animate()
  await text4.value?.animate()
  await text5.value?.animate()
}

defineExpose({
  animate,
})
</script>

<template>
  <span>
    <TypingText ref="text1" text="Du hast " />
    <TypingText ref="text2" :text="`${meta.answeredQuestionsTotalPercent.toLocaleString()}%`" class="text-h5 text-primary heartbeat" />
    <TypingText ref="text3" text=" aller erfassten Fragen (" />
    <TypingText ref="text4" class="text-primary" :text="meta.totalQuestions.toString()" />
    <TypingText ref="text5" text=") beantwortet" />
  </span>
</template>
