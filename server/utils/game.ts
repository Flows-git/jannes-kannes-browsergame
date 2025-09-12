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

  async function getGameMeta(): Promise<GameMeta> {
    return {
      running: data.running,
      totalQuestions: data.totalQuestions,
      currentQuestion: data.currentQuestionNr,
      answeredQuestions: data.answeredQuestions,
      correctAnswers: data.correctAnswers,
      wrongAnswers: data.answeredQuestions - data.correctAnswers,
      totalLives: data.totalLives,
      remainingLives: data.remainingLives,
      gameTime: data.gameTime,
      averageAnswerTime: data.averageAnswerTime,
      answeredQuestionsTotalPercent: await getAnsweredQuestionsInPercent(data.answeredQuestions),
    }
  }

  /**
   * returns the question parsed for the player (without answer) and with the necessary meta for the frontend
   */
  function getQuestionForPlayer(): GameQuestion {
    const question = data.currentQuestion
    return {
      id: question.id,
      questionNr: data.currentQuestionNr,
      question: question.question,
      answers: question.answers,
      meta: {
        creepjackEpisode: question.creepjackEpisode,
        episode: question.jkEpisode,
        questionNr: question.questionNr,
        questionTimeOnStream: question.questionTimeOnStream,
        author: question.author,
      },
    }
  }

  /**
   * updates the current question in the question
   */
  async function updateCurrentQuestion() {
    const questionId = questions.data.questions[session.data.currentQuestionNr - 1]
    const question = await getQuestionById(questionId)
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
    if (Object.keys(data).length === 0) {
      await session.clear()
      await questions.clear()
    }
    const questionCount = settings?.questionCount ?? 3
    const questionIds = await getRandomQuestionIds(questionCount)
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
      averageAnswerTime: '0s',
      gameTime: '0s',
      endTime: undefined,
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
      averageAnswerTime: getAverageAnswerTimeString(session.data.startTime, session.data.answeredQuestions + 1),
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
      gameTime: getTimeDurationString(data.startTime, endTime),
    })
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
