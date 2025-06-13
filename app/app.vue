<template>
  <NuxtLayout>
    <v-app>
      <div class="fill-height">
        <NuxtPage />
      </div>
      <v-footer height="36px">
        <v-spacer />
        Made with <v-icon icon="mdi-heart" class="mx-1" color="error" /> by <NuxtLink class="pl-1" href="https://github.com/Flows-git" target="_blank">
          Florian Wagner
        </NuxtLink>
      </v-footer>
    </v-app>
  </NuxtLayout>
</template>

<style lang="scss">
#confetti canvas {
  pointer-events: none;
}
</style>
