<template>
  <NuxtLayout>
    <v-app>
      <div class="fill-height">
        <NuxtPage />
      </div>
      <v-footer height="36px">
        <NuxtLink href="/impressum">
          Impressum
        </NuxtLink>
        <NuxtLink href="/datenschutz" class="ml-2">
          Datenschutz
        </NuxtLink>
        <v-spacer />
        Made with <v-icon icon="mdi-heart" class="mx-1" color="error" /> by <NuxtLink class="pl-1" href="https://flowa.me" target="_blank">
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

.v-application{
  background: url(/bg.jpg) !important;
  background-attachment: fixed !important;
  background-size: cover !important;
  background-position-x: center !important;
  background-position-y: center !important;
}

.v-application__wrap {
  background: rgba(var(--v-theme-background), 0.8);
  // backdrop-filter: blur(8px)
}
</style>
