<script setup lang="ts">
const gameModes = [{ value: 'classic', title: 'Klassisch' }, { value: 'endless', title: 'Endlos' }]
const gameMode = ref('classic')

const questionCounts = [{ value: 3, title: '3 Fragen' }, { value: 5, title: '5 Fragen' }, { value: 7, title: '7 Fragen' }, { value: 11, title: '11 Fragen' }]
const questionCount = ref(3)

const mistakeCounts = [{ value: 3, title: '3 Fehler' }, { value: 5, title: '5 Fehler' }, { value: 7, title: '7 Fehler' }, { value: 11, title: '11 Fehler' }, { value: -1, title: 'Ohne Fehler' }]
const mistakeCount = ref(3)
</script>

<template>
  <v-container class="d-flex justify-center">
    <v-card width="600">
      <v-card-title>Neues Spiel Jannes Kannes</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <div>
              Spielart
            </div>
            <v-btn-toggle
              v-model="gameMode"
              color="primary"
              group
              mandatory
            >
              <v-btn v-for="(mode, i) of gameModes" :key="`mode${i}`" :value="mode.value">
                {{ mode.title }}
              </v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col v-if="gameMode === 'classic'" cols="12">
            <v-select v-model="questionCount" label="Anzahl Fragen" :items="questionCounts" />
          </v-col>
          <v-col v-if="gameMode === 'endless'" cols="12">
            <v-select v-model="mistakeCount" label="Anzahl Fehler" :items="mistakeCounts" hint="" />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="primary">
          Spiel starten
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
