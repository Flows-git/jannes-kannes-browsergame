import type { H3Event } from 'h3'
import { randomUUID } from 'node:crypto'
import { env } from 'node:process'

/**
 * Composable to manage the game, made for simple usage in a event handler
 *
 * Example:
 * export default defineEventHandler(async (event) => {
 *    const { checkIfGameIsStarted, answerCurrentQuestion ... } = await useGame(event)
 * })
 */
export async function useGame(event: H3Event) {
  const config = useRuntimeConfig()
  /**
   * Creates a new session or takes the existing
   * It's needed for basically all interactions with the game
   */
  const session = await useSession<GameSession>(event, {
    name: 'jannes-kann-es-game',
    password: config.sessionSecret,
    cookie: {
      secure: env.NODE_ENV !== 'development',
    },
    maxAge: 60 * 60 * 24 * 1, // 1 days
  })

  const questions = await useSession<{ questions: Array<string | number> }>(event, {
    name: 'jannes-kann-es-questions',
    password: config.sessionSecret,
    cookie: {
      secure: env.NODE_ENV !== 'development',
    },
    maxAge: 60 * 60 * 24 * 1, // 1 days
  })

  const data = session.data

  /**
   * Checks if a game is started to make sure EPs which need a running game throws the same error
   */
  function isGameStarted() {
    // When data is empty no game is started
    if (Object.keys(data).length === 0) {
      throw createError({ status: 416, statusMessage: 'no_game_started', message: 'No game started' })
    }
    return true
  }

  function isGameRunning() {
    isGameStarted()
    if (!data.running) {
      throw createError({ status: 416, statusMessage: 'game_has_ended', message: 'game has ended' })
    }
  }

  function isGameEnded() {
    isGameStarted()
    if (data.running) {
      throw createError({ status: 416, statusMessage: 'game_not_ended', message: 'game has not ended' })
    }
  }

  async function getGameMeta(): Promise<GameMeta> {
    return {
      running: data.running,
      mode: data.gameMode,
      totalQuestions: data.totalQuestions,
      currentQuestion: data.currentQuestionNr,
      answeredQuestions: data.answeredQuestions,
      correctAnswers: data.correctAnswers,
      wrongAnswers: data.answeredQuestions - data.correctAnswers,
      totalLives: data.totalLives,
      remainingLives: data.remainingLives,
    }
  }

  async function getGameResult(): Promise<GameResult> {
    isGameEnded()
    return {
      mode: data.gameMode,
      totalQuestions: data.totalQuestions,
      answeredQuestions: data.answeredQuestions,
      correctAnswers: data.correctAnswers,
      wrongAnswers: data.answeredQuestions - data.correctAnswers,
      gameTime: parseTimeToString(data.gameTime),
      averageAnswerTime: parseTimeToString(getAverageAnswerTimeDuration(data.totalAnswerTime, data.answeredQuestions)),
      answeredQuestionsTotalPercent: await getAnsweredQuestionsInPercent(data.answeredQuestions),
      ranking: await getGameRank(),
    }
  }

  async function getGameRank(): Promise<GameResultRank> {
    if (data.gameMode === 'ranked' && data.correctAnswers >= config.public.leaderboardMinCorrectAnswers) {
      const existingLeaderboardEntry = data.leaderboardId ? await getLeaderboardEntryById(data.leaderboardId) ?? undefined : undefined
      let existingIsBetter = false
      if (existingLeaderboardEntry) {
        existingIsBetter = !isNewResultBetter(existingLeaderboardEntry, { score: data.correctAnswers, gameTime: data.gameTime })
      }
      let rank: number | undefined
      if (!existingLeaderboardEntry || !existingIsBetter) {
        rank = await getLeaderboardRanking(data.correctAnswers)
      }

      return {
        canSubmit: !!rank && !existingIsBetter,
        existingLeaderboardEntry,
        existingIsBetter,
        rank,
      }
    }
    return {
      canSubmit: false,
    }
  }

  function getGameSettings(): GameSettings {
    return {
      mode: data.gameMode,
      liveCount: data.totalLives,
      questionCount: data.totalQuestions,
    }
  }

  /**
   * returns the question parsed for the player (without answer) and with the necessary meta for the frontend
   */
  async function getQuestionForPlayer(): Promise<GameQuestion> {
    const question = data.currentQuestion
    if (!data.currentQuestionFirstFetch) {
      await session.update({ currentQuestionFirstFetch: Date.now() })
    }
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
    const questionId = questions.data.questions[session.data.currentQuestionNr - 1] as string
    const question = await getQuestionById(questionId)
    randomizeArrayOrder(question.answers)
    await session.update({
      currentQuestion: question,
      currentQuestionFirstFetch: undefined,
    })
  }

  /**
   * Inits a player session with game data to play a new game
   *
   */
  async function startGame(settings: GameSettings, leaderboardIdClient?: string) {
    if (Object.keys(data).length === 0) {
      await clearGameSession()
    }
    const questionCount = settings?.questionCount ?? 3
    const questionIds = await getRandomQuestionIds(questionCount)
    await questions.update({ questions: questionIds })

    const leaderboardId = data.leaderboardId
      ?? (isValidLeaderboardId(leaderboardIdClient) ? leaderboardIdClient : undefined)

    await session.update({
      sessionId: randomUUID().toString(),
      leaderboardId,
      gameMode: settings.mode,
      running: true,
      answeredQuestions: 0,
      currentQuestionNr: 1,
      totalQuestions: questionCount,
      correctAnswers: 0,
      totalLives: settings?.liveCount,
      remainingLives: settings?.liveCount,
      startTime: Date.now(),
      gameTime: 0,
      endTime: undefined,
      submitted: false,
      totalAnswerTime: 0,
    })
    await updateCurrentQuestion()
  }
  /**
   * Checks if the passed answer is correct for the current question
   * updates the session and generates a response for the player
   */
  async function answerCurrentQuestion(answer: string): Promise<AnswerQuestionResponse> {
    if (!data.currentQuestionFirstFetch) {
      throw createError({ statusCode: 409, statusMessage: 'Cannot answer question before fetching it' })
    }
    const question = data.currentQuestion
    const now = Date.now()
    const answerTime = now - data.currentQuestionFirstFetch
    // check if answer was correct and updates the session accordingly
    const answerCorrect = answer === question.correctAnswer
    await session.update({
      answeredQuestions: data.answeredQuestions + 1,
      currentQuestionNr: data.currentQuestionNr + 1,
      correctAnswers: answerCorrect ? data.correctAnswers + 1 : data.correctAnswers,
      remainingLives: (!answerCorrect && typeof data.remainingLives === 'number') ? data.remainingLives - 1 : data.remainingLives,
      totalAnswerTime: data.totalAnswerTime + answerTime,
    })

    // ends the game after the last question was answered
    if (session.data.running && (session.data.remainingLives === 0 || session.data.currentQuestionNr > session.data.totalQuestions)) {
      await session.update({
        currentQuestionNr: session.data.currentQuestionNr - 1,
      })
      await endGame()
      addResultMetrics(session.data)
    }
    else {
      // updates the current question in the session
      await updateCurrentQuestion()
    }

    // add answer metrics entry
    addAnswerMetrics(session.data.sessionId, question.id, answer, answerCorrect, session.data.gameMode, answerTime)

    // returns if given answer was correct and the correct answer
    return {
      correct: answerCorrect,
      correctAnswer: question.correctAnswer,
    }
  }

  /**
   * Ends the game manually to enable to cancel a running game
   */
  async function endGame() {
    isGameStarted()
    // session.clear()
    const endTime = Date.now()
    await session.update({
      running: false,
      endTime,
      gameTime: getTimeDuration(data.startTime, endTime),
    })
  }

  async function restartGame() {
    isGameStarted()
    await startGame(getGameSettings())
  }

  async function clearGameSession() {
    await session.clear()
    await questions.clear()
  }

  async function submitGameResult(name: string) {
    if (data.submitted) {
      throw createError({ status: 409, statusMessage: 'Score already submitted' })
    }
    const ranking = await getGameRank()
    if (!ranking || !ranking.canSubmit) {
      throw createError({ status: 409, statusMessage: 'Not permitted for ranking' })
    }

    const id = await submitGameResultToLeaderboard(name, data)
    if (!data.leaderboardId) {
      await session.update({ leaderboardId: id })
    }

    await session.update({ submitted: true })
    await clearGameSession()
    return { id, rank: ranking.rank as number }
  }

  return {
    isGameStarted,
    isGameRunning,
    isGameEnded,
    getQuestionForPlayer,
    getGameMeta,
    getGameResult,
    restartGame,
    startGame,
    answerCurrentQuestion,
    endGame,
    submitGameResult,
  }
}
