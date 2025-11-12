import type { SupabaseClient } from '@supabase/supabase-js'
import { vi } from 'vitest'

/**
 * Creates a mock Supabase client for testing
 * Returns a chainable mock that supports common Supabase query patterns
 */
export function createMockSupabaseClient() {
  const mockSelect = vi.fn()
  const mockInsert = vi.fn()
  const mockUpdate = vi.fn()
  const mockDelete = vi.fn()
  const mockFilter = vi.fn()
  const mockEq = vi.fn()
  const mockOrder = vi.fn()
  const mockRange = vi.fn()
  const mockSingle = vi.fn()
  const mockFrom = vi.fn()
  const mockRpc = vi.fn()
  const mockOverrideTypes = vi.fn()

  // Create a chainable mock that returns itself for method chaining
  const chainableMock = {
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
    filter: mockFilter,
    eq: mockEq,
    order: mockOrder,
    range: mockRange,
    single: mockSingle,
    overrideTypes: mockOverrideTypes,
  }

  // Make all methods return the chainable mock by default
  mockSelect.mockReturnValue(chainableMock)
  mockInsert.mockReturnValue(chainableMock)
  mockUpdate.mockReturnValue(chainableMock)
  mockDelete.mockReturnValue(chainableMock)
  mockFilter.mockReturnValue(chainableMock)
  mockEq.mockReturnValue(chainableMock)
  mockOrder.mockReturnValue(chainableMock)
  mockRange.mockReturnValue(chainableMock)
  mockOverrideTypes.mockReturnValue(chainableMock)

  // single() returns a promise-like object
  mockSingle.mockResolvedValue({ data: null, error: null })

  // from() returns the chainable mock
  mockFrom.mockReturnValue(chainableMock)

  // rpc() returns a promise-like object
  mockRpc.mockResolvedValue({ data: null, error: null })

  const mockClient = {
    from: mockFrom,
    rpc: mockRpc,
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    },
  } as unknown as SupabaseClient

  return {
    client: mockClient,
    mocks: {
      from: mockFrom,
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
      filter: mockFilter,
      eq: mockEq,
      order: mockOrder,
      range: mockRange,
      single: mockSingle,
      rpc: mockRpc,
      overrideTypes: mockOverrideTypes,
    },
  }
}

/**
 * Mock the useSupabaseServer composable
 * Returns the mock client and all individual mocks for assertions
 *
 * @example
 * ```ts
 * const { mockClient, mocks, resetMocks } = mockUseSupabaseServer()
 *
 * // In beforeEach to reset mocks between tests
 * beforeEach(() => {
 *   resetMocks()
 * })
 *
 * // Configure the mock response
 * mocks.select.mockResolvedValue({
 *   data: [{ id: 1, question: 'Test?' }],
 *   error: null
 * })
 *
 * // Your test code here
 *
 * // Assert the mock was called correctly
 * expect(mocks.from).toHaveBeenCalledWith('questions')
 * expect(mocks.select).toHaveBeenCalledWith('*')
 * ```
 */
export function mockUseSupabaseServer() {
  const { client, mocks } = createMockSupabaseClient()

  const useSupabaseServerMock = vi.fn(() => client)

  // Use stubGlobal for Nuxt auto-imports
  vi.stubGlobal('useSupabaseServer', useSupabaseServerMock)

  /**
   * Resets all mock call history while preserving the chainable structure
   * Use this in beforeEach() to clean up between tests
   */
  const resetMocks = () => {
    // Create chainable mock reference
    const chainableMock = {
      select: mocks.select,
      insert: mocks.insert,
      update: mocks.update,
      delete: mocks.delete,
      filter: mocks.filter,
      eq: mocks.eq,
      order: mocks.order,
      range: mocks.range,
      single: mocks.single,
      overrideTypes: mocks.overrideTypes,
    }

    // Clear and restore chaining for each mock
    mocks.from.mockClear().mockReturnValue(chainableMock)
    mocks.select.mockClear().mockReturnValue(chainableMock)
    mocks.insert.mockClear().mockReturnValue(chainableMock)
    mocks.update.mockClear().mockReturnValue(chainableMock)
    mocks.delete.mockClear().mockReturnValue(chainableMock)
    mocks.filter.mockClear().mockReturnValue(chainableMock)
    mocks.eq.mockClear().mockReturnValue(chainableMock)
    mocks.order.mockClear().mockReturnValue(chainableMock)
    mocks.range.mockClear().mockReturnValue(chainableMock)
    mocks.overrideTypes.mockClear().mockReturnValue(chainableMock)
    mocks.single.mockClear().mockResolvedValue({ data: null, error: null })
    mocks.rpc.mockClear().mockResolvedValue({ data: null, error: null })
    useSupabaseServerMock.mockClear()
  }

  return {
    mockClient: client,
    mocks,
    useSupabaseServerMock,
    resetMocks,
  }
}

/**
 * Helper to create a mock response for Supabase queries
 */
export function createSupabaseResponse<T>(data: T, error: any = null) {
  return { data, error }
}

/**
 * Helper to create a mock count response for Supabase queries
 */
export function createSupabaseCountResponse(count: number | null) {
  return { ...createSupabaseResponse(null), count }
}

/**
 * Helper to create a mock error response for Supabase queries
 */
export function createSupabaseError(message: string, code?: string) {
  return createSupabaseResponse(null, {
    message,
    code: code || 'PGRST116',
    details: null,
    hint: null,
  })
}
