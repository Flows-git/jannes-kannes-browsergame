export function useGame() {
  const gameMeta = ref<GameMeta>()
  const currentQuestion = ref<GameQuestionClient>()

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

  return {
    gameMeta,
    currentQuestion,
    startGame,
    fetchQuestion,
    answerQuestion,
  }
}
