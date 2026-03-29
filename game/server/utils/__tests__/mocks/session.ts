import { vi } from 'vitest'

/**
 * Creates a mock session for testing
 * Simulates H3 session behavior
 */
export function createMockSession<T extends Record<string, any>>() {
  let sessionData: T = {} as T

  const mockUpdate = vi.fn(async (updates: Partial<T>) => {
    sessionData = { ...sessionData, ...updates }
  })

  const mockClear = vi.fn(async () => {
    sessionData = {} as T
  })

  const session = {
    data: sessionData,
    update: mockUpdate,
    clear: mockClear,
  }

  // Create a proxy to always return the current sessionData
  const sessionProxy = new Proxy(session, {
    get(target, prop) {
      if (prop === 'data') {
        return sessionData
      }
      return target[prop as keyof typeof target]
    },
  })

  const resetSession = () => {
    sessionData = {} as T
    mockUpdate.mockClear()
    mockClear.mockClear()
  }

  const setSessionData = (data: T) => {
    sessionData = data
  }

  return {
    session: sessionProxy,
    mocks: {
      update: mockUpdate,
      clear: mockClear,
    },
    resetSession,
    setSessionData,
    getSessionData: () => sessionData,
  }
}

/**
 * Mock the useSession composable
 * Returns mock sessions for both game and questions
 *
 * @example
 * ```ts
 * const { mockGameSession, mockQuestionsSession, resetMocks } = mockUseSession()
 *
 * // In beforeEach to reset mocks between tests
 * beforeEach(() => {
 *   resetMocks()
 * })
 *
 * // Set initial session data
 * mockGameSession.setSessionData({
 *   running: true,
 *   gameMode: 'classic',
 *   // ... other properties
 * })
 *
 * // Your test code here
 *
 * // Assert the mock was called correctly
 * expect(mockGameSession.mocks.update).toHaveBeenCalledWith({ running: false })
 * ```
 */
export function mockUseSession() {
  const gameSession = createMockSession<GameSession>()
  const questionsSession = createMockSession<{ questions: Array<string | number> }>()

  const useSessionMock = vi.fn((event: any, options: any) => {
    // Return the appropriate session based on the name
    if (options.name === 'jannes-kann-es-game') {
      return gameSession.session
    }
    else if (options.name === 'jannes-kann-es-questions') {
      return questionsSession.session
    }
    // Default to game session
    return gameSession.session
  })

  // Use stubGlobal for Nuxt auto-imports
  vi.stubGlobal('useSession', useSessionMock)

  const resetMocks = () => {
    gameSession.resetSession()
    questionsSession.resetSession()
    useSessionMock.mockClear()
  }

  return {
    mockGameSession: gameSession,
    mockQuestionsSession: questionsSession,
    useSessionMock,
    resetMocks,
  }
}
