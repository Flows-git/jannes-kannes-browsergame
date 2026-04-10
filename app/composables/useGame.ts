export function useGame() {
  const gameMeta = useState<GameMeta>('game-meta')
  const currentQuestion = useState<GameQuestion>('game-current-question')
  const doFetch = useRequestFetch()
  const { leaderboardId } = useLeaderboard()

  async function startGame(mode: GameMode, settings?: GameSettings) {
    await $fetch('/api/game/start', {
      method: 'POST',
      body: { mode, settings, leaderboardId: leaderboardId.value },
    })
  }

  async function fetchQuestion() {
    const data = await doFetch<GetQuestionRespone>('/api/game')
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
  }

  async function endGame() {
    await $fetch<{ meta: GameMeta }>('/api/game', { method: 'DELETE' })
  }

  function fetchGameResult(): Promise<GameResult> {
    return doFetch<GameResult>('/api/game/result')
  }

  return {
    gameMeta,
    currentQuestion,
    startGame,
    restartGame,
    endGame,
    fetchQuestion,
    answerQuestion,
    fetchGameResult,
  }
}
