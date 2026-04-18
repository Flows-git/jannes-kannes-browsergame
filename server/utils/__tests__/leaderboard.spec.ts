import { beforeEach, describe, expect, it } from 'vitest'
import { getLeaderboard, getLeaderboardPageById, getLeaderboardRanking, submitGameResultToLeaderboard } from '../leaderboard'
import { createSupabaseError, createSupabaseResponse, mockUseSupabaseServer } from './mocks/supabase'

const { mocks, resetMocks } = mockUseSupabaseServer()

describe('leaderboard', () => {
  beforeEach(() => {
    resetMocks()
  })

  describe('submitGameResultToLeaderboard', () => {
    const now = Date.now()
    const mockGameSession: GameSession = {
      running: false,
      gameMode: 'ranked',
      correctAnswers: 10,
      gameTime: '120',
      averageAnswerTime: '12s',
      questions: [],
      startTime: now - 30000,
      endTime: now,
      answeredQuestions: 10,
      currentQuestion: {} as QuestionDB,
      currentQuestionNr: 2,
      totalQuestions: 10,
    }

    it('should throw error when game is running', async () => {
      const runningGame: GameSession = {
        ...mockGameSession,
        running: true,
      }

      await expect(
        submitGameResultToLeaderboard('TestPlayer', runningGame),
      ).rejects.toThrow('game not ended')
    })

    it('should throw error when game is not a ranked game', async () => {
      const casualGame: GameSession = {
        ...mockGameSession,
        gameMode: 'classic',
      }

      await expect(
        submitGameResultToLeaderboard('TestPlayer', casualGame),
      ).rejects.toThrow('only ranked games permitted')

      casualGame.gameMode = 'endless'

      await expect(
        submitGameResultToLeaderboard('TestPlayer', casualGame),
      ).rejects.toThrow('only ranked games permitted')
    })

    it('should insert a new entry to \'leaderboard\' database table', async () => {
      const expectedEntry = {
        name: 'TestPlayer',
        score: 10,
        correctAnswers: 10,
        usedJoker: 0,
        gameTime: '120',
        averageAnswerTime: '12s',
      }

      mocks.single.mockResolvedValue(createSupabaseResponse({ id: 123 }))

      await submitGameResultToLeaderboard('TestPlayer', mockGameSession)

      expect(mocks.from).toHaveBeenCalledWith('leaderboard')
      expect(mocks.insert).toHaveBeenCalledWith(expectedEntry)
      expect(mocks.select).toHaveBeenCalledWith('id')
      expect(mocks.single).toHaveBeenCalled()
    })

    it('should return the id of the new created entry', async () => {
      const mockId = 456
      mocks.single.mockResolvedValue(createSupabaseResponse({ id: mockId }))

      const result = await submitGameResultToLeaderboard('TestPlayer', mockGameSession)

      expect(result).toBe(mockId)
    })
  })

  describe('getLeaderboard', () => {
    const mockLeaderboardData = [
      {
        id: 1,
        name: 'Player1',
        score: 100,
        position: 1,
        correctAnswers: 10,
        usedJoker: 0,
        gameTime: '120',
        averageAnswerTime: 12,
      },
      {
        id: 2,
        name: 'Player2',
        score: 90,
        position: 2,
        correctAnswers: 9,
        usedJoker: 0,
        gameTime: '130',
        averageAnswerTime: 14,
      },
    ]

    it('should fetch leaderboard from \'leaderboard_with_rank\' table with the expected from, to values', async () => {
      mocks.overrideTypes.mockResolvedValue(createSupabaseResponse(mockLeaderboardData))
      mocks.select.mockImplementation((query: string) => {
        if (query === '*') {
          return {
            order: mocks.order,
            range: mocks.range,
            overrideTypes: mocks.overrideTypes,
          }
        }
        return Promise.resolve({
          data: null,
          error: null,
          count: 10,
        })
      })

      await getLeaderboard({ page: 2, perPage: 10 })

      expect(mocks.from).toHaveBeenCalledWith('leaderboard_with_rank')
      expect(mocks.select).toHaveBeenCalledWith('*')
      expect(mocks.order).toHaveBeenCalledWith('position')
      expect(mocks.range).toHaveBeenCalledWith(10, 19)
    })

    it('should return leaderboard entry item list', async () => {
      mocks.overrideTypes.mockResolvedValue(createSupabaseResponse(mockLeaderboardData))
      mocks.select.mockImplementation((query: string) => {
        if (query === '*') {
          return {
            order: mocks.order,
            range: mocks.range,
            overrideTypes: mocks.overrideTypes,
          }
        }
        return Promise.resolve({
          data: null,
          error: null,
          count: 10,
        })
      })

      const result = await getLeaderboard()

      expect(result.items).toEqual(mockLeaderboardData)
    })

    it('should return totalCount of entries', async () => {
      const totalCount = 42
      mocks.overrideTypes.mockResolvedValue(createSupabaseResponse(mockLeaderboardData))
      mocks.select.mockImplementation((query: string) => {
        if (query === '*') {
          return {
            order: mocks.order,
            range: mocks.range,
            overrideTypes: mocks.overrideTypes,
          }
        }
        return Promise.resolve({
          data: null,
          error: null,
          count: totalCount,
        })
      })

      const result = await getLeaderboard()

      expect(result.meta.totalCount).toBe(totalCount)
      expect(mocks.from).toHaveBeenCalledWith('leaderboard')
      expect(mocks.select).toHaveBeenCalledWith('id', { count: 'exact', head: true })
    })

    it('should throw an error when database request fails', async () => {
      const error = createSupabaseError('Database connection failed')
      mocks.overrideTypes.mockResolvedValue(error)

      await expect(getLeaderboard()).rejects.toThrow()
    })
  })

  describe('getLeaderboardPageById', () => {
    it('should return the expected page numbers', async () => {
      // Test case 1: position 1 with perPage 10 should return page 1
      mocks.overrideTypes.mockResolvedValue(createSupabaseResponse({ position: 1 }))
      let result = await getLeaderboardPageById(1, 10)
      expect(result).toBe(1)

      // Test case 2: position 11 with perPage 10 should return page 2
      mocks.overrideTypes.mockResolvedValue(createSupabaseResponse({ position: 11 }))
      result = await getLeaderboardPageById(11, 10)
      expect(result).toBe(2)

      // Test case 3: position 25 with perPage 10 should return page 3
      mocks.overrideTypes.mockResolvedValue(createSupabaseResponse({ position: 25 }))
      result = await getLeaderboardPageById(25, 10)
      expect(result).toBe(3)

      // Test case 4: position 100 with perPage 20 should return page 5
      mocks.overrideTypes.mockResolvedValue(createSupabaseResponse({ position: 100 }))
      result = await getLeaderboardPageById(100, 20)
      expect(result).toBe(5)

      // Verify the correct calls were made
      expect(mocks.from).toHaveBeenCalledWith('leaderboard_with_rank')
      expect(mocks.select).toHaveBeenCalledWith('position')
      expect(mocks.eq).toHaveBeenCalled()
      expect(mocks.single).toHaveBeenCalled()
      expect(mocks.overrideTypes).toHaveBeenCalled()
    })

    it('should throw an error when database request fails', async () => {
      const error = createSupabaseError('Entry not found')
      mocks.overrideTypes.mockResolvedValue(error)

      await expect(getLeaderboardPageById(999, 10)).rejects.toThrow()
    })
  })

  describe('getLeaderboardRanking', () => {
    it('should call supabase rpc \'get_rank\' with score and tie-breakers', async () => {
      const testScore = 85
      const testAvg = 1500
      const testGame = 30000
      const mockRank = 15

      mocks.rpc.mockResolvedValue(createSupabaseResponse(mockRank))

      const result = await getLeaderboardRanking(testScore, testAvg, testGame)

      expect(mocks.rpc).toHaveBeenCalledWith('get_rank', {
        _score: testScore,
        _average_answer_time: testAvg,
        _game_time: testGame,
      })
      expect(result).toBe(mockRank)
    })

    it('should throw an error when rpc request fails', async () => {
      const error = createSupabaseError('RPC function failed')
      mocks.rpc.mockResolvedValue(error)

      await expect(getLeaderboardRanking(100, 1000, 30000)).rejects.toThrow()
    })
  })
})
