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
    name: 'jannes-kann-es-game',
    password: 'superSuperSecretSessionPassword!', // TODO: add password to .env
    cookie: {
      secure: false,
    },
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  const questions = await useSession<{ questions: Array<string | number> }>(event, {
    name: 'jannes-kann-es-questions',
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
  function isGameStarted() {
    // When data is empty no game is started
    if (Object.keys(data).length === 0) {
      throw createError({ status: 416, message: 'No game started' })
    }
    return true
  }

  function isGameRunning() {
    isGameStarted()
    if (!data.running) {
      throw createError({ status: 416, message: 'game ended' })
    }
  }

  function getGameMeta(): GameMeta {
    return {
      running: data.running,
      totalQuestions: data.totalQuestions,
      currentQuestion: data.currentQuestionNr,
      answeredQuestions: data.answeredQuestions,
      correctAnswers: data.correctAnswers,
      totalLives: data.totalLives,
      remainingLives: data.remainingLives,
      gameTime: data.gameTime,
    }
  }

  /**
   * returns the question parsed for the player (without answer) and with the necessary meta for the frontend
   */
  function getQuestionForPlayer(): GameQuestionClient {
    const question = data.currentQuestion
    return {
      id: question.id,
      questionNr: data.currentQuestionNr,
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
    const questionId = questions.data.questions[data.currentQuestionNr - 1]
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
    await questions.update({ questions: questionIds })
    await session.update({
      running: true,
      answeredQuestions: 0,
      currentQuestionNr: 1,
      totalQuestions: questionCount,
      correctAnswers: 0,
      totalLives: settings?.liveCount,
      remainingLives: settings?.liveCount,
      startTime: new Date().getTime(),
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
      answeredQuestions: session.data.answeredQuestions + 1,
      currentQuestionNr: session.data.currentQuestionNr + 1,
      correctAnswers: answerCorrect ? session.data.correctAnswers + 1 : session.data.correctAnswers,
      remainingLives: (!answerCorrect && typeof session.data.remainingLives === 'number') ? session.data.remainingLives - 1 : session.data.remainingLives,
    })

    // ends the game after the last question was answered
    if (session.data.running && (session.data.remainingLives === 0 || session.data.currentQuestionNr > session.data.totalQuestions)) {
      await session.update({
        currentQuestionNr: session.data.currentQuestionNr - 1,
      })
      await endGame()
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
  async function endGame() {
    // session.clear()
    const endTime = new Date().getTime()
    await session.update({
      running: false,
      endTime,
      gameTime: getGameTime(endTime),
    })
  }

  function getGameTime(endTime: number) {
    const diffMs = endTime - data.startTime // Difference in ms
    const totalSeconds = Math.floor(diffMs / 1000)
    let time = ``

    const hours = Math.floor(totalSeconds / 3600)
    if (hours > 0) {
      time += `${hours}h `
    }
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    if (hours > 0) {
      time += `${minutes}m `
    }
    const seconds = totalSeconds % 60
    time += `${seconds}s `

    return time
  }

  return {
    isGameStarted,
    isGameRunning,
    getQuestionForPlayer,
    getGameMeta,
    startGame,
    answerCurrentQuestion,
    endGame,
  }
}
