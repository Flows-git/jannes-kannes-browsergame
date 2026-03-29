import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createSupabaseError, createSupabaseResponse, mockUseSupabaseServer } from './mocks/supabase'

// Set up Supabase mock before imports
const { mocks, resetMocks } = mockUseSupabaseServer()

// Import after mocking
const { addAnswerMetrics } = await import('../metrics')

describe('addAnswerMetrics', () => {
  beforeEach(() => {
    resetMocks()
  })

  it('should insert answer metrics successfully', async () => {
    mocks.insert.mockResolvedValue(createSupabaseResponse(null))

    await addAnswerMetrics(123, 'Test Answer', true, 'classic')

    expect(mocks.from).toHaveBeenCalledWith('answerMetrics')
    expect(mocks.insert).toHaveBeenCalledWith({
      question: 123,
      answer: 'Test Answer',
      answerCorrect: true,
      gameMode: 'classic',
    })
  })

  it('should throw error when insert fails', async () => {
    const errorMessage = 'Database insert failed'
    mocks.insert.mockResolvedValue(createSupabaseError(errorMessage))

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    await expect(
      addAnswerMetrics(999, 'Test', true, 'classic'),
    ).rejects.toThrow()

    expect(consoleErrorSpy).toHaveBeenCalled()
    consoleErrorSpy.mockRestore()
  })
})
