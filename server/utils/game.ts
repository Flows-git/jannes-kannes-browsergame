import type { H3Event } from 'h3'

/**
 * Composable to manage the game, made for simple usage in a event handler
 *
 * Example:
 * export default defineEventHandler(async (event) => {
 *    const { checkIfGameIsStarted, answerCurrentQuestion ... } = await useGame(event)
 * })
 */
export async function useGame(event: H3Event) {
  /**
   * Creates a new session or takes the existing
   * It's needed for basically all interactions with the game
   */
  const session = await useSession<GameSession>(event, {
    name: 'JANNES KANN ES',
    password: 'superSuperSecretSessionPassword!', // TODO: add password to .env
    cookie: {
      secure: false,
    },
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  const data = session.data

  /**
   * Checks if a game is started to make sure EPs which need a running game throws the same error
   */
  async function checkIfGameIsStarted() {
    // When data is empty no game is started
    if (Object.keys(data).length === 0) {
      throw createError({ status: 416, message: 'No game started' })
    }
    return data
  }

  function getGameMeta(): GameResponseMeta {
    return {
      running: data.running,
      currentQuestion: data.currentQuestionNr,
      totalQuestions: data.totalQuestions,
      correctAnswers: data.correctAnswers,
    }
  }

  /**
   * returns the question parsed for the player (without answer) and with the necessary meta for the frontend
   */
  function getQuestionForPlayer(): GameQuestionPlayer {
    const question = data.currentQuestion
    return {
      id: question.id,
      question: question.question,
      answers: question.answers,
      meta: {
        creepjackEpisode: question.meta.creepjackEpisode,
        episode: question.meta.episode,
        questionNr: question.meta.questionNr,
        questionTimeOnStream: question.meta.questionTimeOnStream,
      },
    }
  }

  /**
   * updates the current question in the question
   */
  async function updateCurrentQuestion() {
    const questionId = data.questions[data.currentQuestionNr - 1]
    const question = getQuestionById(questionId)
    randomizeArrayOrder(question.answers)
    await session.update({
      currentQuestion: question,
    })
  }

  /**
   * Inits a player session with game data to play a new game
   *
   */
  async function startGame(settings: GameSettings) {
    const questionCount = settings?.questionCount ?? 3
    const questionIds = getRandomQuestionIds(questionCount)
    await session.update({
      running: true,
      questions: questionIds,
      currentQuestionNr: 1,
      totalQuestions: questionCount,
      correctAnswers: 0,
    })
    await updateCurrentQuestion()
  }
  /**
   * Checks if the passed answer is correct for the current question
   * updates the session and generates a response for the player
   */
  async function answerCurrentQuestion(answer: string): Promise<AnswerQuestionResponse> {
    const question = data.currentQuestion

    // check if answer was correct and updates the session accordingly
    const answerCorrect = answer === question.correctAnswer
    await session.update({
      currentQuestionNr: session.data.currentQuestionNr + 1,
      correctAnswers: answerCorrect ? session.data.correctAnswers + 1 : session.data.correctAnswers,
    })

    // ends the game after the last question was answered
    if (session.data.currentQuestionNr > session.data.totalQuestions) {
      await session.update({
        currentQuestionNr: session.data.currentQuestionNr - 1,
        running: false,
      })
    }
    else {
      // updates the current question in the session
      await updateCurrentQuestion()
    }

    // returns if given answer was correct and the correct answer
    return {
      correct: answerCorrect,
      corretAnswer: question.correctAnswer,
    }
  }

  /**
   * Ends the game manually to enable to cancel a running game
   */
  function endGame() {
    session.clear()
  }

  return {
    checkIfGameIsStarted,
    getQuestionForPlayer,
    getGameMeta,
    startGame,
    answerCurrentQuestion,
    endGame,
  }
}
