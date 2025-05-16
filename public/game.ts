import type { H3Event } from 'h3'

export function useGameSession(event: H3Event) {
  return useSession<GameSession>(event, {
    name: 'JANNES KANN ES',
    password: 'superSuperSecretSessionPassword!', // TODO: add password to .env
    cookie: {
      secure: false,
    },
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function useGameData(event: H3Event) {
  const session = await useGameSession(event)
  if (Object.keys(session.data).length === 0) {
    throw createError({ status: 416, message: 'No game started' })
  }
  return session.data
}

export async function getCurrentGameQuestion(event: H3Event) {
  const data = await useGameData(event)
  const questionId = data.questions[data.currentQuestion - 1]
  return getQuestionById(questionId)
}

/**
 * Starts a new "Jannes Kann es" game
 * - creates a classic game with 3 questions when settings are empty
 */
export async function startGame(event: H3Event) {
  const settings = await readBody<GameSettings>(event)

  const session = await useGameSession(event)
  await session.update(createGameSessionData(settings))
}

function createGameSessionData(settings: GameSettings): GameSession {
  const questionCount = settings?.questionCount ?? 3
  return {
    running: true,
    questions: getRandomQuestionIds(questionCount),
    currentQuestion: 1,
    totalQuestions: questionCount,
    correctAnswers: 0,
  }
}
