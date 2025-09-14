<template>
  <v-container class="fill-height align-center justify-center jk-game--container">
    <v-card width="800">
      <v-card-text>
        <GameResultScreenEndless
          :meta="{
            answeredQuestions: 245,
            correctAnswers: 122,
            wrongAnswers: 123,
            currentQuestion: 24,
            running: false,
            totalQuestions: 324,
            gameTime: '24m 3s',
            averageAnswerTime: '1m 2s',
            remainingLives: 1,
            totalLives: 3,
            answeredQuestionsTotalPercent: 42.3,
          }"
        />
      </v-card-text>
    </v-card>
  </v-container>
</template>
