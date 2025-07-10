import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {

  getAverageAnswerTimeString,
  getTimeDurationString,
} from '../../server/utils/gameTime'

describe('gameTime utils', () => {
  describe('getTimeDurationString', () => {
    it('should return "0s" for zero duration', () => {
      const now = Date.now()
      expect(getTimeDurationString(now, now)).toBe('0s')
    })

    it('should return correct seconds', () => {
      const start = 1000
      const end = 4000
      expect(getTimeDurationString(start, end)).toBe('3s')
    })

    it('should return correct minutes and seconds', () => {
      const start = 0
      const end = 125000 // 2m 5s
      expect(getTimeDurationString(start, end)).toBe('2m 5s')
    })

    it('should return correct hours, minutes, and seconds', () => {
      const start = 0
      const end = 3723000 // 1h 2m 3s
      expect(getTimeDurationString(start, end)).toBe('1h 2m 3s')
    })
  })

  describe('getAverageAnswerTimeString', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })
    afterEach(() => {
      vi.useRealTimers()
    })

    it('should return "0s" if no time has passed', () => {
      const now = Date.now()
      vi.setSystemTime(now)
      expect(getAverageAnswerTimeString(now, 1)).toBe('0s')
    })

    it('should calculate average time per question', () => {
      const start = Date.now()
      vi.setSystemTime(start + 10000) // 10 seconds later
      expect(getAverageAnswerTimeString(start, 2)).toBe('5s')
    })

    it('rounds average correctly (up)', () => {
      const start = Date.now()
      vi.setSystemTime(start + 25000) // 25 seconds later
      expect(getAverageAnswerTimeString(start, 16)).toBe('2s') // = 1.5625 seconds per question
    })

    it('rounds average correctly (down)', () => {
      const start = Date.now()
      vi.setSystemTime(start + 25000) // 25 seconds later
      expect(getAverageAnswerTimeString(start, 17)).toBe('1s') // = 1,47058824 seconds per question
    })

    it('should handle zero answeredQuestions (avoid division by zero)', () => {
      const start = Date.now()
      vi.setSystemTime(start + 9000)
      expect(getAverageAnswerTimeString(start, 0)).toBe('9s')
    })

    it('should format average time with minutes and seconds', () => {
      const start = Date.now()
      vi.setSystemTime(start + 125000) // 2m 5s
      expect(getAverageAnswerTimeString(start, 1)).toBe('2m 5s')
    })

    it('should format average time with hours, minutes, and seconds', () => {
      const start = Date.now()
      vi.setSystemTime(start + 3723000) // 1h 2m 3s
      expect(getAverageAnswerTimeString(start, 1)).toBe('1h 2m 3s')
    })
  })
})
