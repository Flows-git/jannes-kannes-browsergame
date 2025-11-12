import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createSupabaseCountResponse, createSupabaseError, createSupabaseResponse, mockUseSupabaseServer } from '../helper/supabase'

// Set up Supabase mock before imports
const { mocks, resetMocks } = mockUseSupabaseServer()

// Import after mocking
const { getAllQuestionsCount, getQuestionById, getRandomQuestionIds, randomizeArrayOrder, getAnsweredQuestionsInPercent } = await import('../../server/utils/questions')

describe('questions utilities', () => {
  beforeEach(() => {
    resetMocks()
  })

  describe('getAllQuestionsCount', () => {
    it('should return the total count of questions', async () => {
      mocks.select.mockResolvedValue(createSupabaseCountResponse(42))

      const result = await getAllQuestionsCount()

      expect(mocks.from).toHaveBeenCalledWith('questions')
      expect(mocks.select).toHaveBeenCalledWith('id', { count: 'exact', head: true })
      expect(result).toBe(42)
    })

    it('should return 0 when count is null', async () => {
      mocks.select.mockResolvedValue(createSupabaseCountResponse(null))

      const result = await getAllQuestionsCount()

      expect(result).toBe(0)
    })

    it('should throw error when database query fails', async () => {
      mocks.select.mockResolvedValue(createSupabaseError('Query failed'))

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await expect(getAllQuestionsCount()).rejects.toThrow()

      expect(consoleErrorSpy).toHaveBeenCalled()
      consoleErrorSpy.mockRestore()
    })
  })

  describe('getQuestionById', () => {
    it('should return a question by string ID', async () => {
      const mockQuestion = {
        id: '123',
        question: 'What is Warcraft 3?',
        answers: ['A game', 'A movie', 'A book', 'A song'],
        correctAnswer: 'A game',
        creepjackEpisode: 1,
        jkEpisode: 'EP1',
        questionNr: 1,
      }

      mocks.single.mockResolvedValue(createSupabaseResponse(mockQuestion))

      const result = await getQuestionById('123')

      expect(mocks.from).toHaveBeenCalledWith('questions')
      expect(mocks.select).toHaveBeenCalledWith('*')
      expect(mocks.filter).toHaveBeenCalledWith('id', 'eq', '123')
      expect(result).toEqual(mockQuestion)
    })

    it('should return a question by numeric ID', async () => {
      const mockQuestion = {
        id: 456,
        question: 'Who is Arthas?',
        answers: ['A hero', 'A villain', 'Both', 'Neither'],
        correctAnswer: 'Both',
      }

      mocks.single.mockResolvedValue(createSupabaseResponse(mockQuestion))

      const result = await getQuestionById(456)

      expect(mocks.filter).toHaveBeenCalledWith('id', 'eq', 456)
      expect(result).toEqual(mockQuestion)
    })

    it('should throw error when question is not found', async () => {
      mocks.single.mockResolvedValue(createSupabaseError('Question not found', 'PGRST116'))

      await expect(getQuestionById('999')).rejects.toThrow('question not found')
    })
  })

  describe('randomizeArrayOrder', () => {
    it('should randomize array order', () => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      const original = [...array]

      const result = randomizeArrayOrder(array)

      // Should return the same array reference
      expect(result).toBe(array)
      // Should contain all original elements
      expect(result.sort()).toEqual(original.sort())
      // Should have same length
      expect(result).toHaveLength(original.length)
    })

    it('should modify the original array', () => {
      const array = [1, 2, 3, 4, 5]
      randomizeArrayOrder(array)

      // The array should still contain all elements
      expect(array).toHaveLength(5)
      expect(array.sort()).toEqual([1, 2, 3, 4, 5])
    })

    it('should handle empty array', () => {
      const array: any[] = []
      const result = randomizeArrayOrder(array)

      expect(result).toEqual([])
    })

    it('should handle single element array', () => {
      const array = [1]
      const result = randomizeArrayOrder(array)

      expect(result).toEqual([1])
    })

    it('should handle array with duplicate values', () => {
      const array = [1, 1, 2, 2, 3, 3]
      const result = randomizeArrayOrder(array)

      expect(result.sort()).toEqual([1, 1, 2, 2, 3, 3])
    })
  })

  describe('getRandomQuestionIds', () => {
    it('should return requested number of random question IDs', async () => {
      const mockData = [
        { id: '1' },
        { id: '2' },
        { id: '3' },
        { id: '4' },
        { id: '5' },
      ]

      mocks.select.mockResolvedValue(createSupabaseResponse(mockData))

      const result = await getRandomQuestionIds(3)

      expect(result).toHaveLength(3)
      // All returned IDs should be from the original set
      result.forEach((id) => {
        expect(['1', '2', '3', '4', '5']).toContain(id)
      })
    })

    it('should return all IDs when count exceeds available questions', async () => {
      const mockData = [
        { id: '1' },
        { id: '2' },
        { id: '3' },
      ]

      mocks.select.mockResolvedValue(createSupabaseResponse(mockData))

      const result = await getRandomQuestionIds(10)

      expect(result).toHaveLength(3)
    })

    it('should return empty array when count is 0', async () => {
      const mockData = [
        { id: '1' },
        { id: '2' },
        { id: '3' },
      ]

      mocks.select.mockResolvedValue(createSupabaseResponse(mockData))

      const result = await getRandomQuestionIds(0)

      expect(result).toEqual([])
    })
  })

  describe('getAnsweredQuestionsInPercent', () => {
    it('should calculate correct percentage', async () => {
      mocks.select.mockResolvedValue(createSupabaseCountResponse(100))

      const result = await getAnsweredQuestionsInPercent(25)

      expect(result).toBe(25)
    })

    it('should return 0 when no questions answered', async () => {
      mocks.select.mockResolvedValue(createSupabaseCountResponse(100))

      const result = await getAnsweredQuestionsInPercent(0)

      expect(result).toBe(0)
    })

    it('should return 100 when all questions answered', async () => {
      mocks.select.mockResolvedValue(createSupabaseCountResponse(50))

      const result = await getAnsweredQuestionsInPercent(50)

      expect(result).toBe(100)
    })

    it('should round to 2 decimal places', async () => {
      mocks.select.mockResolvedValue(createSupabaseCountResponse(3))

      const result = await getAnsweredQuestionsInPercent(1)

      expect(result).toBe(33.33)
    })

    it('should handle decimal results correctly', async () => {
      mocks.select.mockResolvedValue(createSupabaseCountResponse(7))

      const result = await getAnsweredQuestionsInPercent(3)

      expect(result).toBe(42.86)
    })
  })
})
