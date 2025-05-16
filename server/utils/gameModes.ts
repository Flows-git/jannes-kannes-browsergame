// const gameModeClassic: GameMode = {
//   createGameSessionData(settings) {
//     const questionCount = settings?.questionCount ?? 3
//     return {
//       running: true,
//       questions: getRandomQuestions(questionCount),
//       currentQuestion: 1,
//       totalQuestions: questionCount,
//       correctAnswers: 0,
//     }
//   },

//   validateGameSettings() {
//     return true
//   },
// }

// const gameModeEndless: GameMode = {
//   createGameSessionData() {
//     const questionCount = getAllQuestionsCount()
//     return {
//       running: true,
//       questions: getRandomQuestions(questionCount),
//       currentQuestion: 1,
//       totalQuestions: questionCount,
//       correctAnswers: 0,
//     }
//   },

//   validateGameSettings() {
//     return true
//   },
// }

// export const gameModes: Record<string, GameMode> = {
//   classic: gameModeClassic,
//   endless: gameModeEndless,
// }

// export function getGameMode(settings: GameSettings): GameMode {
//   const mode = settings?.mode ? settings.mode : 'classic'

//   const gameMode = gameModes[mode]
//   if (!gameMode) {
//     throw createError('No valid game mode passed')
//   }
//   return gameMode
// }
