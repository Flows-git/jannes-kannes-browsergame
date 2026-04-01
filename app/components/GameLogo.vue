<script setup lang="ts">
import type { VImg } from 'vuetify/components'

withDefaults(defineProps<{
  showSubtitle?: boolean
  width?: string | number

}>(), {
  showSubtitle: false,
  width: 120,
})

const mainImg = useTemplateRef<VImg>('mainImg')
</script>

<template>
  <div class="jk-game-logo--container d-flex justify-center">
    <div>
      <v-img ref="mainImg" class="jk-game-logo" :class="{ 'pb-4': showSubtitle }" src="/logo.png" alt="Bild erstellt mit: https://www.textstudio.com/" :width="width" aspect-ratio="1.81" />
      <div
        v-if="showSubtitle && mainImg?.state === 'loaded'" class="jk-game-logo--subtitle text-end text-h5 font-weight-bold mt-n7 mr-n3"
      >
        Das Spiel
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.jk-game-logo {
  &--container {
    view-transition-name: game-logo;

  }

  &--subtitle {
    text-shadow: -2px 2px #000; animation:text-focus-in 1s cubic-bezier(.55,.085,.68,.53) both
  }

}

.slide-out {
  animation: slide-out-fwd-center 2s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
}
.slide-in {
  animation: slide-in-fwd-center 2s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
}

.v-card:has(.slide-out), .v-card:has(.slide-in) {
  overflow: visible;
  z-index: 99999;
  position: relative;

  .v-card-text {
    overflow: visible;
    perspective: 1000px;
  }
}

::view-transition-group(game-logo) {
  animation-duration: 1s;
}

::view-transition-old(game-logo) {
  animation: vt-slide-out-fwd-center 1s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
  mix-blend-mode: normal;
}

::view-transition-new(game-logo) {
  animation: vt-slide-in-fwd-center 1s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
  mix-blend-mode: normal;
}

::view-transition-image-pair(game-logo) {
  isolation: auto;
}

@keyframes vt-slide-out-fwd-center {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(500);
    opacity: 1;
  }
}

@keyframes vt-slide-in-fwd-center {
  0% {
    transform: scale(500);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: no-preference) {
	@view-transition {
		navigation: auto;
	}
}

@keyframes text-focus-in{0%{filter:blur(12px);opacity:0}100%{filter:blur(0);opacity:1}}
</style>
