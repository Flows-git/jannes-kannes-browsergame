import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockUseSession } from './mocks/session'

// Create mocks in hoisted scope
const {
  mockUseRuntimeConfig,
  getQuestionByIdMock,
  getRandomQuestionIdsMock,
  randomizeArrayOrderMock,
  getAnsweredQuestionsInPercentMock,
  getTimeDurationStringMock,
  getAverageAnswerTimeStringMock,
  submitGameResultToLeaderboardMock,
  getLeaderboardRankingMock,
  addAnswerMetricsMock,
} = vi.hoisted(() => {
  return {
    mockUseRuntimeConfig: vi.fn(() => ({
      sessionSecret: 'test-secret',
    })),
    getQuestionByIdMock: vi.fn(),
    getRandomQuestionIdsMock: vi.fn(),
    randomizeArrayOrderMock: vi.fn(arr => arr),
    getAnsweredQuestionsInPercentMock: vi.fn(),
    getTimeDurationStringMock: vi.fn(),
    getAverageAnswerTimeStringMock: vi.fn(),
    submitGameResultToLeaderboardMock: vi.fn(),
    getLeaderboardRankingMock: vi.fn(),
    addAnswerMetricsMock: vi.fn(),
  }
})

// Set up session mocks
const { mockGameSession, mockQuestionsSession, useSessionMock, resetMocks: resetSessionMocks } = mockUseSession()

// Mock Nuxt auto-imports
mockNuxtImport('useRuntimeConfig', () => mockUseRuntimeConfig)

// Mock utility functions as globals (Nuxt auto-imports them globally)
vi.stubGlobal('getQuestionById', getQuestionByIdMock)
vi.stubGlobal('getRandomQuestionIds', getRandomQuestionIdsMock)
vi.stubGlobal('randomizeArrayOrder', randomizeArrayOrderMock)
vi.stubGlobal('getAnsweredQuestionsInPercent', getAnsweredQuestionsInPercentMock)
vi.stubGlobal('getTimeDurationString', getTimeDurationStringMock)
vi.stubGlobal('getAverageAnswerTimeString', getAverageAnswerTimeStringMock)
vi.stubGlobal('submitGameResultToLeaderboard', submitGameResultToLeaderboardMock)
vi.stubGlobal('getLeaderboardRanking', getLeaderboardRankingMock)
vi.stubGlobal('addAnswerMetrics', addAnswerMetricsMock)

// Import after mocking
const { useGame } = await import('../game')

describe('game utilities', () => {
  // Mock event object
  const mockEvent = {} as any

  // Sample question data
  const mockQuestion: QuestionDB = {
    id: 1,
    question: 'What is Warcraft 3?',
    answers: ['A game', 'A movie', 'A book', 'A song'],
    correctAnswer: 'A game',
    author: 'Test Author',
    creepjackEpisode: 1,
    jkEpisode: 'EP1',
    questionNr: 1,
    jannesAnswer: 'A game',
    questionTimeOnStream: '12:34',
    answerTimeOnStream: '13:45',
  }

  const mockQuestion2: QuestionDB = {
    id: 2,
    question: 'Who is Arthas?',
    answers: ['A hero', 'A villain', 'Both', 'Neither'],
    correctAnswer: 'Both',
    author: 'Test Author 2',
    creepjackEpisode: 2,
    jkEpisode: 'EP2',
    questionNr: 2,
    jannesAnswer: 'Both',
    questionTimeOnStream: '15:20',
    answerTimeOnStream: '16:30',
  }

  beforeEach(() => {
    resetSessionMocks()
    vi.clearAllMocks()
  })

  // Helper to create default game session data with optional overrides
  const createGameSessionData = (overrides: Partial<GameSession> = {}): GameSession => {
    return {
      gameMode: 'classic',
      running: true,
      currentQuestionNr: 1,
      answeredQuestions: 0,
      totalQuestions: 5,
      correctAnswers: 0,
      totalLives: 3,
      remainingLives: 3,
      startTime: Date.now(),
      averageAnswerTime: '0s',
      gameTime: '0s',
      currentQuestion: mockQuestion,
      questions: ['1', '2', '3'],
      ...overrides,
    }
  }

  function setGameSessionData(overrides: Partial<GameSession> = {}): GameSession {
    const data = createGameSessionData(overrides)
    mockGameSession.setSessionData(data)
    return data
  }

  describe('useGame', () => {
    it('should create game and question session', async () => {
      await useGame(mockEvent)

      // Verify useSession was called twice (once for game, once for questions)
      expect(useSessionMock).toHaveBeenCalledTimes(2)

      // Verify game session was created with correct config
      expect(useSessionMock).toHaveBeenCalledWith(
        mockEvent,
        expect.objectContaining({
          name: 'jannes-kann-es-game',
          password: 'test-secret',
          maxAge: 60 * 60 * 24 * 1,
        }),
      )

      // Verify questions session was created with correct config
      expect(useSessionMock).toHaveBeenCalledWith(
        mockEvent,
        expect.objectContaining({
          name: 'jannes-kann-es-questions',
          password: 'test-secret',
          maxAge: 60 * 60 * 24 * 1,
        }),
      )

      // Verify sessionSecret from useRuntimeConfig was used
      expect(mockUseRuntimeConfig).toHaveBeenCalled()
    })
  })

  describe('isGameStarted', () => {
    it('should return true if a game session exists', async () => {
      setGameSessionData()

      const game = await useGame(mockEvent)
      const result = game.isGameStarted()

      expect(result).toBe(true)
    })

    it('should throw an error if no session is set', async () => {
      const game = await useGame(mockEvent)

      expect(() => game.isGameStarted()).toThrow('No game started')
    })
  })

  describe('isGameRunning', () => {
    it('should return true if a game is running (session set and running is true)', async () => {
      setGameSessionData()

      const game = await useGame(mockEvent)
      game.isGameRunning()

      // Should not throw
      expect(() => game.isGameRunning()).not.toThrow()
    })

    it('should throw an error if no session is set', async () => {
      const game = await useGame(mockEvent)

      expect(() => game.isGameRunning()).toThrow('No game started')
    })

    it('should throw an error if game is not running (running prop in session is false)', async () => {
      mockGameSession.setSessionData(createGameSessionData({
        running: false,
        answeredQuestions: 5,
        correctAnswers: 3,
        remainingLives: 0,
        startTime: Date.now() - 60000,
        endTime: Date.now(),
        averageAnswerTime: '12s',
        gameTime: '1m',
      }))

      const game = await useGame(mockEvent)

      expect(() => game.isGameRunning()).toThrow('game has ended')
    })
  })

  describe('getGameMeta', () => {
    it('should return expected data', async () => {
      const startTime = Date.now() - 60000
      setGameSessionData({
        gameMode: 'ranked',
        currentQuestionNr: 3,
        answeredQuestions: 2,
        totalQuestions: 10,
        correctAnswers: 1,
        totalLives: 5,
        remainingLives: 4,
        startTime,
        averageAnswerTime: '15s',
        gameTime: '1m',
      })

      getAnsweredQuestionsInPercentMock.mockResolvedValue(20)

      const game = await useGame(mockEvent)
      const meta = await game.getGameMeta()

      expect(meta).toEqual<GameMeta>({
        running: true,
        mode: 'ranked',
        totalQuestions: 10,
        currentQuestion: 3,
        answeredQuestions: 2,
        correctAnswers: 1,
        wrongAnswers: 1,
        totalLives: 5,
        remainingLives: 4,
        gameTime: '1m',
        averageAnswerTime: '15s',
        answeredQuestionsTotalPercent: 20,
      })

      expect(getAnsweredQuestionsInPercentMock).toHaveBeenCalledWith(2)
    })
  })

  describe('getGameSettings', () => {
    it('should return expected data', async () => {
      setGameSessionData({
        gameMode: 'endless',
        totalQuestions: 20,
        totalLives: 10,
        remainingLives: 10,
      })

      const game = await useGame(mockEvent)
      const settings = game.getGameSettings()

      expect(settings).toEqual<GameSettings>({
        mode: 'endless',
        liveCount: 10,
        questionCount: 20,
      })
    })
  })

  describe('getQuestionForPlayer', () => {
    it('should return the current question for the player', async () => {
      mockGameSession.setSessionData(createGameSessionData())

      const game = await useGame(mockEvent)
      const question = game.getQuestionForPlayer()

      expect(question).toEqual<GameQuestion>({
        id: mockQuestion.id,
        questionNr: 1,
        question: mockQuestion.question,
        answers: mockQuestion.answers,
        meta: {
          creepjackEpisode: mockQuestion.creepjackEpisode,
          episode: mockQuestion.jkEpisode,
          questionNr: mockQuestion.questionNr,
          questionTimeOnStream: mockQuestion.questionTimeOnStream,
          author: mockQuestion.author,
        },
      })
    })

    it('should not contain an answer', async () => {
      mockGameSession.setSessionData(createGameSessionData())

      const game = await useGame(mockEvent)
      const question = game.getQuestionForPlayer()

      expect(question).not.toHaveProperty('correctAnswer')
      expect(question).not.toHaveProperty('jannesAnswer')
    })
  })

  describe('updateCurrentQuestion', () => {
    it('should set next question to question session', async () => {
      mockGameSession.setSessionData(createGameSessionData({
        currentQuestionNr: 2,
        answeredQuestions: 1,
        correctAnswers: 1,
        averageAnswerTime: '10s',
        gameTime: '10s',
      }))

      mockQuestionsSession.setSessionData({
        questions: ['1', '2', '3'],
      })

      getQuestionByIdMock.mockResolvedValue(mockQuestion2)

      // Note: updateCurrentQuestion is not exposed, tested through startGame and answerCurrentQuestion
    })

    it('should randomize answer orders', async () => {
      setGameSessionData()
      mockQuestionsSession.setSessionData({
        questions: ['1', '2', '3'],
      })

      getQuestionByIdMock.mockResolvedValue(mockQuestion2)
      getRandomQuestionIdsMock.mockResolvedValue(['1', '2', '3'])

      const game = await useGame(mockEvent)
      await game.startGame({ mode: 'classic', questionCount: 3, liveCount: 3 })

      expect(randomizeArrayOrderMock).toHaveBeenCalled()
    })
  })

  describe('startGame', () => {
    it('should create a new game session according to the passed settings', async () => {
      getRandomQuestionIdsMock.mockResolvedValue(['1', '2', '3', '4', '5'])
      getQuestionByIdMock.mockResolvedValue(mockQuestion)

      const game = await useGame(mockEvent)
      await game.startGame({
        mode: 'classic',
        questionCount: 5,
        liveCount: 3,
      })

      expect(mockGameSession.mocks.update).toHaveBeenCalledWith(
        expect.objectContaining({
          gameMode: 'classic',
          running: true,
          answeredQuestions: 0,
          currentQuestionNr: 1,
          totalQuestions: 5,
          correctAnswers: 0,
          totalLives: 3,
          remainingLives: 3,
        }),
      )
    })

    it('should set random question ids to questions session', async () => {
      const questionIds = ['1', '2', '3']
      getRandomQuestionIdsMock.mockResolvedValue(questionIds)
      getQuestionByIdMock.mockResolvedValue(mockQuestion)

      const game = await useGame(mockEvent)
      await game.startGame({
        mode: 'ranked',
        questionCount: 3,
        liveCount: 5,
      })

      expect(getRandomQuestionIdsMock).toHaveBeenCalledWith(3)
      expect(mockQuestionsSession.mocks.update).toHaveBeenCalledWith({
        questions: questionIds,
      })
    })

    it('should set the first question as current question', async () => {
      mockQuestionsSession.setSessionData({
        questions: ['1', '2', '3'],
      })

      getRandomQuestionIdsMock.mockResolvedValue(['1', '2', '3'])
      getQuestionByIdMock.mockResolvedValue(mockQuestion)

      const game = await useGame(mockEvent)
      await game.startGame({
        mode: 'classic',
        questionCount: 3,
        liveCount: 3,
      })

      expect(getQuestionByIdMock).toHaveBeenCalledWith('1')
      expect(mockGameSession.mocks.update).toHaveBeenCalledWith(
        expect.objectContaining({
          currentQuestion: mockQuestion,
        }),
      )
    })
  })

  describe('answerCurrentQuestion', () => {
    it('should update game session answeredQuestions and currentQuestionNr data', async () => {
      setGameSessionData()
      mockQuestionsSession.setSessionData({
        questions: ['1', '2', '3', '4', '5'],
      })

      const game = await useGame(mockEvent)
      await game.answerCurrentQuestion('A game')

      expect(mockGameSession.mocks.update).toHaveBeenCalledWith(
        expect.objectContaining({
          answeredQuestions: 1,
          currentQuestionNr: 2,
        }),
      )
    })

    it('should decrement remainingLives and not increment correctAnswers when answer was not correct', async () => {
      setGameSessionData()
      mockQuestionsSession.setSessionData({
        questions: ['1', '2', '3', '4', '5'],
      })

      const game = await useGame(mockEvent)
      const result = await game.answerCurrentQuestion('Wrong answer')

      expect(result.correct).toBe(false)
      expect(mockGameSession.mocks.update).toHaveBeenCalledWith(
        expect.objectContaining({
          correctAnswers: 0,
          remainingLives: 2,
        }),
      )
    })

    it('should increment correctAnswers and not decrement remainingLives when answer was correct', async () => {
      setGameSessionData()
      mockQuestionsSession.setSessionData({
        questions: ['1', '2', '3', '4', '5'],
      })

      const game = await useGame(mockEvent)
      const result = await game.answerCurrentQuestion('A game')

      expect(result.correct).toBe(true)
      expect(mockGameSession.mocks.update).toHaveBeenCalledWith(
        expect.objectContaining({
          correctAnswers: 1,
          remainingLives: 3,
        }),
      )
    })

    it('should regenerate averageAnswerTime', async () => {
      setGameSessionData()
      mockQuestionsSession.setSessionData({
        questions: ['1', '2', '3', '4', '5'],
      })
      getAverageAnswerTimeStringMock.mockReturnValue('15s')

      const game = await useGame(mockEvent)
      await game.answerCurrentQuestion('A game')

      expect(getAverageAnswerTimeStringMock).toHaveBeenCalled()
      expect(mockGameSession.mocks.update).toHaveBeenCalledWith(
        expect.objectContaining({
          averageAnswerTime: '15s',
        }),
      )
    })

    it('should end the game when remainingLives is 0', async () => {
      setGameSessionData({ remainingLives: 1 })

      const game = await useGame(mockEvent)
      await game.answerCurrentQuestion('Wrong answer')

      // Should end the game
      expect(mockGameSession.mocks.update).toHaveBeenCalledWith(
        expect.objectContaining({
          running: false,
        }),
      )
    })

    it('should end the game when last question was answered', async () => {
      const endTime = Date.now() + 120000
      setGameSessionData({
        currentQuestionNr: 5,
        answeredQuestions: 4,
      })

      mockQuestionsSession.setSessionData({
        questions: ['1', '2', '3', '4', '5'],
      })

      getAverageAnswerTimeStringMock.mockReturnValue('24s')
      getTimeDurationStringMock.mockReturnValue('2m')

      // Mock Date.now() for consistent endTime
      const dateSpy = vi.spyOn(Date, 'now').mockReturnValue(endTime)

      const game = await useGame(mockEvent)
      await game.answerCurrentQuestion('A game')

      // Should end the game
      expect(mockGameSession.mocks.update).toHaveBeenCalledWith(
        expect.objectContaining({
          running: false,
        }),
      )

      dateSpy.mockRestore()
    })

    it('should update the current question when game is not ended', async () => {
      setGameSessionData({
        currentQuestionNr: 2,
        answeredQuestions: 1,
      })

      mockQuestionsSession.setSessionData({
        questions: ['1', '2', '3', '4', '5'],
      })

      getQuestionByIdMock.mockResolvedValue(mockQuestion2)
      getAverageAnswerTimeStringMock.mockReturnValue('12s')

      const game = await useGame(mockEvent)
      await game.answerCurrentQuestion('A game')

      // After answering question 2, currentQuestionNr becomes 3, so it fetches question at index 2 (which is '3')
      expect(getQuestionByIdMock).toHaveBeenCalledWith('3')
      expect(randomizeArrayOrderMock).toHaveBeenCalled()
    })

    it('should return if answer was correct and the correct Answer', async () => {
      setGameSessionData()

      mockQuestionsSession.setSessionData({
        questions: ['1', '2', '3', '4', '5'],
      })

      getQuestionByIdMock.mockResolvedValue(mockQuestion2)
      getAverageAnswerTimeStringMock.mockReturnValue('10s')

      const game = await useGame(mockEvent)
      const result = await game.answerCurrentQuestion('A game')

      expect(result).toEqual({
        correct: true,
        correctAnswer: 'A game',
      })
    })

    it('should add correct answer metrics', async () => {
      setGameSessionData({ gameMode: 'ranked' })

      mockQuestionsSession.setSessionData({
        questions: ['1', '2', '3', '4', '5'],
      })

      getQuestionByIdMock.mockResolvedValue(mockQuestion2)
      getAverageAnswerTimeStringMock.mockReturnValue('10s')

      const game = await useGame(mockEvent)
      await game.answerCurrentQuestion('A game')

      expect(addAnswerMetricsMock).toHaveBeenCalledWith(
        mockQuestion.id,
        'A game',
        true,
        'ranked',
      )
    })
  })

  describe('endGame', () => {
    it('should set running in GameSession to false', async () => {
      setGameSessionData({ running: true })
      getTimeDurationStringMock.mockReturnValue('45s')

      const game = await useGame(mockEvent)
      await game.endGame()

      expect(mockGameSession.mocks.update).toHaveBeenCalledWith(
        expect.objectContaining({
          running: false,
        }),
      )
    })

    it('should set endTime to current Timestamp and calculate gameTime', async () => {
      const startTime = 1000000
      setGameSessionData({ startTime })
      getTimeDurationStringMock.mockReturnValue('1m 30s')

      const game = await useGame(mockEvent)
      await game.endGame()

      // Check that game session update was called with the right structure
      const updateCall = mockGameSession.mocks.update.mock.calls[0][0]
      expect(updateCall.running).toBe(false)
      expect(updateCall.gameTime).toBe('1m 30s')
      expect(typeof updateCall.endTime).toBe('number')
      expect(updateCall.endTime).toBeGreaterThan(startTime)

      expect(getTimeDurationStringMock).toHaveBeenCalledWith(startTime, updateCall.endTime)
    })
  })

  describe('clearSession', () => {
    it('should clear game and question session', async () => {
      // Start with an empty session (length === 0), which triggers clearGameSession in startGame
      mockGameSession.setSessionData({} as any)
      mockQuestionsSession.setSessionData({} as any)

      getRandomQuestionIdsMock.mockResolvedValue(['1', '2', '3'])
      getQuestionByIdMock.mockResolvedValue(mockQuestion)

      const game = await useGame(mockEvent)
      await game.startGame({ mode: 'classic', questionCount: 3, liveCount: 3 })

      // clearGameSession is called inside startGame when session data is empty
      expect(mockGameSession.mocks.clear).toHaveBeenCalled()
      expect(mockQuestionsSession.mocks.clear).toHaveBeenCalled()
    })
  })

  describe('submitGameResult', () => {
    it('should submit gameResult from session to leaderboard', async () => {
      const gameSession = setGameSessionData()

      const game = await useGame(mockEvent)
      await game.submitGameResult('Test Player')

      expect(submitGameResultToLeaderboardMock).toHaveBeenCalledWith('Test Player', gameSession)
    })

    it('should clear session on success', async () => {
      const game = await useGame(mockEvent)
      await game.submitGameResult('Another Player')

      expect(mockGameSession.mocks.clear).toHaveBeenCalled()
      expect(mockQuestionsSession.mocks.clear).toHaveBeenCalled()
    })

    it('should return the id of the leaderboard entry', async () => {
      submitGameResultToLeaderboardMock.mockResolvedValue(789)

      const game = await useGame(mockEvent)
      const id = await game.submitGameResult('Pro Player')
      expect(id).toBe(789)
    })
  })

  describe('getRank', () => {
    it('should return the leaderboard ranking based on the correctAnswers from game session', async () => {
      setGameSessionData({ correctAnswers: 5 })
      getLeaderboardRankingMock.mockResolvedValue(42)

      const game = await useGame(mockEvent)
      const rank = await game.getRank()

      expect(getLeaderboardRankingMock).toHaveBeenCalledWith(5)
      expect(rank).toBe(42)
    })
  })
})
