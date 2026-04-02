<script setup lang="ts">
const props = withDefaults(defineProps<{
  text: string
  tick?: number
  autoAnimate?: boolean
}>(), {
  tick: 30,
  autoAnimate: false,
})
const visibleIndex = ref(0)
let animationCancelled = false

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function typeIndex(target: Ref<number>, length: number) {
  target.value = 0
  for (let i = 0; i < length; i++) {
    if (animationCancelled)
      return
    target.value = i + 1
    await sleep(props.tick ?? 30)
  }
}

async function animateIn() {
  // Cancel any running animation
  animationCancelled = true
  await sleep(10)
  animationCancelled = false

  visibleIndex.value = 0

  await typeIndex(visibleIndex, props.text.length)
}

watch(() => props.text, async () => {
  visibleIndex.value = 0
  if (props.autoAnimate) {
    await animateIn()
  }
}, { immediate: true })

defineExpose({
  animate: () => animateIn(),
})
</script>

<template>
  <span>
    <span>{{ text.slice(0, visibleIndex) }}</span>
    <span style="visibility: hidden;">{{ text.slice(visibleIndex) }}</span>
  </span>
</template>
