export function useGame() {
  const gameMeta = ref<GameMeta>()
  const currentQuestion = ref<GameQuestionClient>()
  const showResult = ref<boolean>(false)

  async function startGame(mode: GameMode, settings?: GameSettings) {
    await $fetch('/api/game/start', { method: 'POST', body: { mode, settings } })
  }

  async function fetchQuestion() {
    const data = await $fetch<GetQuestionRespone>('/api/game')
    gameMeta.value = data.meta
    currentQuestion.value = data.question
  }

  async function answerQuestion(answer: string) {
    const result = await $fetch<{ result: AnswerQuestionResponse, meta: GameMeta }>('/api/game', {
      method: 'POST',
      body: {
        answer,
      },
    })
    gameMeta.value = result.meta
    return result.result
  }

  async function restartGame() {
    await $fetch('/api/game/restart')
    await fetchQuestion()
    showResult.value = false
  }

  async function endGame() {
    const result = await $fetch<{ meta: GameMeta }>('/api/game', { method: 'DELETE' })
    gameMeta.value = result.meta
    currentQuestion.value = undefined
  }

  return {
    gameMeta,
    currentQuestion,
    showResult,
    startGame,
    restartGame,
    endGame,
    fetchQuestion,
    answerQuestion,
  }
}
