<script setup lang="ts">
interface AnswerMetrics {
  total: number
  correct: number
  false: number
}

interface QuestionMetrics {
  totalQuestions: number
  answeredQuestions: number
  answers: AnswerMetrics
  answersPerMode: {
    ranked: AnswerMetrics
    classic: AnswerMetrics
    endless: AnswerMetrics
  }
  totalResults: number
  resultsPerGameMode: {
    ranked: number
    classic: number
    endless: number
  }
  averageAnswerTime: number
  averageGameTime: number
}

const { data, pending } = useFetch<QuestionMetrics>('/api/admin/metrics')

const pieOptions = computed(() => {
  if (!data.value)
    return null
  const { correct, false: wrong } = data.value.answers
  return {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { color: '#fff' } },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: [
        { value: correct, name: 'Richtig', itemStyle: { color: '#4CAF50' } },
        { value: wrong, name: 'Falsch', itemStyle: { color: '#B00020' } },
      ],
      label: { color: '#fff' },
    }],
  }
})

const resultsPieOptions = computed(() => {
  if (!data.value)
    return null
  const modes = data.value.resultsPerGameMode
  return {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { color: '#fff' } },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: [
        { value: modes.ranked, name: 'Ranked', itemStyle: { color: '#FBCF3B' } },
        { value: modes.classic, name: 'Classic', itemStyle: { color: '#03DAC6' } },
        { value: modes.endless, name: 'Endless', itemStyle: { color: '#2196F3' } },
      ],
      label: { color: '#fff' },
    }],
  }
})

const barOptions = computed(() => {
  if (!data.value)
    return null
  const modes = data.value.answersPerMode
  return {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, textStyle: { color: '#fff' } },
    xAxis: {
      type: 'category',
      data: ['Ranked', 'Classic', 'Endless'],
      axisLabel: { color: '#fff' },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#fff' },
      splitLine: { lineStyle: { color: '#424242' } },
    },
    series: [
      {
        name: 'Richtig',
        type: 'bar',
        stack: 'answers',
        data: [modes.ranked.correct, modes.classic.correct, modes.endless.correct],
        color: '#4CAF50',
      },
      {
        name: 'Falsch',
        type: 'bar',
        stack: 'answers',
        data: [modes.ranked.false, modes.classic.false, modes.endless.false],
        color: '#B00020',
      },
    ],
  }
})

const answersPerModePieOptions = computed(() => {
  if (!data.value)
    return null
  const modes = data.value.answersPerMode
  return {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { color: '#fff' } },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: [
        { value: modes.ranked.total, name: 'Ranked', itemStyle: { color: '#FBCF3B' } },
        { value: modes.classic.total, name: 'Classic', itemStyle: { color: '#03DAC6' } },
        { value: modes.endless.total, name: 'Endless', itemStyle: { color: '#2196F3' } },
      ],
      label: { color: '#fff' },
    }],
  }
})
</script>

<template>
  <v-container>
    <div class="pb-3">
      <v-btn color="primary" to="/admin">
        Zurück
      </v-btn>
    </div>

    <div class="text-h4 pb-4">
      Statistiken
    </div>

    <v-progress-linear v-if="pending" indeterminate color="primary" class="mb-4" />

    <template v-if="data">
      <v-row>
        <v-col cols="12" sm="4">
          <v-card class="pa-4 text-center fill-height">
            <v-icon icon="mdi-help-circle-outline" size="48" color="primary" />
            <div class="py-3">
              <v-progress-linear v-model="data.answeredQuestions" :max="data.totalQuestions" height="30px" color="success">
                <div class="font-weight-bold">
                  {{ data.answeredQuestions }} / {{ data.totalQuestions }} beantwortet
                </div>
              </v-progress-linear>
            </div>
            <div class="text-subtitle-1 text-medium-emphasis">
              Fragen
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card class="pa-4 text-center fill-height">
            <v-icon icon="mdi-forum-outline" size="48" color="primary" />
            <div class="text-h3 pt-3">
              {{ data.answers.total }}
            </div>
            <div class="text-subtitle-1 text-medium-emphasis">
              Antworten gesamt
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card class="pa-4 text-center fill-height">
            <v-icon icon="mdi-trophy-outline" size="48" color="primary" />
            <div class="text-h3 pt-3">
              {{ data.totalResults }}
            </div>
            <div class="text-subtitle-1 text-medium-emphasis">
              Gespielte Runden
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6">
          <v-card class="pa-4 text-center fill-height">
            <v-icon icon="mdi-timer-outline" size="48" color="primary" />
            <div class="text-h3">
              {{ data.averageAnswerTime }}s
            </div>
            <div class="text-subtitle-1 text-medium-emphasis">
              Ø Antwortzeit
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6">
          <v-card class="pa-4 text-center fill-height">
            <v-icon icon="mdi-clock-outline" size="48" color="primary" />
            <div class="text-h3">
              {{ data.averageGameTime }}s
            </div>
            <div class="text-subtitle-1 text-medium-emphasis">
              Ø Spielzeit
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-card class="pa-4">
            <div class="text-h5 pb-2">
              Antworten pro Spielmodus
            </div>
            <ClientOnly>
              <VChart :option="answersPerModePieOptions" autoresize style="height: 300px" />
            </ClientOnly>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card class="pa-4">
            <div class="text-h5 pb-2">
              Runden pro Spielmodus
            </div>
            <ClientOnly>
              <VChart :option="resultsPieOptions" autoresize style="height: 300px" />
            </ClientOnly>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-card class="pa-4">
            <div class="text-h5 pb-2">
              Richtig / Falsch
            </div>
            <ClientOnly>
              <VChart :option="pieOptions" autoresize style="height: 300px" />
            </ClientOnly>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card class="pa-4">
            <div class="text-h5 pb-2">
              Richtig / Falsch pro Spielmodus
            </div>
            <ClientOnly>
              <VChart :option="barOptions" autoresize style="height: 300px" />
            </ClientOnly>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>
