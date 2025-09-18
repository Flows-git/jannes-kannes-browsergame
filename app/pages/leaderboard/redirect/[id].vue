<script setup lang="ts">
/**
 * This page redirects to the page of the leaderboard where the entry can be found
 */
const route = useRoute()
const router = useRouter()

const id = route.params.id

async function getStartPage() {
  if (id) {
    const result = Number(await $fetch(`/api/leaderboard/pageById?perPage=10&id=${id}`))
    return result
  }
  return 1
}

async function doRedirect() {
  const page = await getStartPage()
  router.replace(`/leaderboard?p=${page}&id=${id}`)
}

doRedirect()
</script>

<template>
  <v-container>Weiterleitung zur Bestenliste...</v-container>
</template>
