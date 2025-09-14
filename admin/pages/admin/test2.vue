<script setup>
import { ref } from 'vue'

const short = ref(true)
const wrapper = useTemplateRef('wrapper')
const content = useTemplateRef('content')
const isTransitioning = ref(false)

watch(short, async () => {
  // console.log('watch pre')
  const parent = wrapper.value
  parent.style.height = `${content.value.scrollHeight}px`
}, { flush: 'pre' })

watch(short, () => {
  // console.log('watch post')
  const parent = wrapper.value
  const newHeight = content.value.scrollHeight
  parent.style.transition = 'height 0.3s ease'
  parent.style.height = `${newHeight}px`
  // Nach Animation zurücksetzen

  if (!isTransitioning.value) {
    isTransitioning.value = true
    parent.addEventListener('transitionend', () => {
      isTransitioning.value = false
      parent.style.transition = 'none'
      parent.style.height = 'auto'
    }, { once: true })
  }
}, { flush: 'post' })

function toggle() {
  short.value = !short.value
}

/////////

// onMounted(() => {
//   // Select the node that will be observed for mutations
//   const targetNode = content.value

//   // Options for the observer (which mutations to observe)
//   const config = { attributes: true, childList: true, subtree: true }

//   // Callback function to execute when mutations are observed
//   const callback = (mutationList, observer) => {
//     console.log('Mutation observed:', mutationList)
//   }

//   // Create an observer instance linked to the callback function
//   const observer = new MutationObserver(callback)

//   // Start observing the target node for configured mutations
//   observer.observe(targetNode, { attributes: true, childList: true, subtree: true, attributeOldValue: true })
// })
</script>

<template>
  <button @click="toggle">
    Wechsle Inhalt
  </button>

  <div ref="wrapper" class="wrapper bg-primary">
    <div ref="content" class="content">
      <p v-if="short">
        Kurzer Text
      </p>
      <p v-else>
        Langer Text<br>mit mehreren<br>Zeilen<br>und Inhalt
      </p>
    </div>
  </div>
</template>
