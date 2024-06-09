<script setup lang="ts">
async function startClassicGame() {
  await useFetch('/api/game/start')
  const router = useRouter()
  router.push('/game')
}
</script>

<template>
  <v-container style="max-width: 800px;">
    <v-card>
      <v-card-text class="text-center py-8">
        <GameLogo show-subtitle width="350" />
        <!-- <div class="pt-8">
          <v-btn color="primary" @click="startClassicGame">
            Spiel starten
          </v-btn>
        </div> -->
      </v-card-text>
    </v-card>
    <v-row class="pt-6">
      <v-col cols="12" md="6">
        <v-card class="fill-height" @click="startClassicGame">
          <v-card-title>Schnelles Spiel</v-card-title>
          <v-card-text>Eine klassische Runde "Jannes Kann es". Es werden drei Fragen aus "Jannes Kann es" gestellt und das Spiel ist gewonnen wenn alle Fragen richtig beantwortet wurden. Es gibt natürlich einen Preis! </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="fill-height" disabled>
          <v-card-title>Endlos</v-card-title>
          <v-card-text>Es werden alle "Jannes Kann es" Fragen gestellt. Man hat drei Leben und drei Jannes-Joker mit dem man sehen kann was Jannes getippt hat. Das Spiel ist vorbei wenn man keine Leben mehr hat. Das Ergebnis kann in eine Rangliste eingetragen werden.</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="fill-height" disabled>
          <v-card-title>Eigenes Spiel</v-card-title>
          <v-card-text>
            Erstelle ein "Jannes Kann es" Spiel nach deinen Wünschen. Spiele den klassischen oder endlos Modus, bestimme die Anzahl der Fragen oder Fehlversuche...
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
