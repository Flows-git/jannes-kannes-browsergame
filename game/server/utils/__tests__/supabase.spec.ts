import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { createClient } from '@supabase/supabase-js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock Supabase createClient
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}))

// Create mocks in hoisted scope
const { mockConfig, mockUseRuntimeConfig } = vi.hoisted(() => {
  const config = {
    supabaseUrl: 'https://test.supabase.co',
    supabaseApiKey: 'test-api-key',
  }

  return {
    mockConfig: config,
    mockUseRuntimeConfig: vi.fn(() => config),
  }
})

// Mock useRuntimeConfig
mockNuxtImport('useRuntimeConfig', () => mockUseRuntimeConfig)

// Import after mocking
const { useSupabaseServer } = await import('../supabase')

describe('useSupabaseServer', () => {
  const mockClient = {
    from: vi.fn(),
    rpc: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset to default config
    mockConfig.supabaseUrl = 'https://test.supabase.co'
    mockConfig.supabaseApiKey = 'test-api-key'
    vi.mocked(createClient).mockReturnValue(mockClient as any)
  })

  it('should create Supabase client with config from runtime', () => {
    const result = useSupabaseServer()

    expect(mockUseRuntimeConfig).toHaveBeenCalledTimes(1)
    expect(createClient).toHaveBeenCalledTimes(1)
    expect(createClient).toHaveBeenCalledWith(
      mockConfig.supabaseUrl,
      mockConfig.supabaseApiKey,
      expect.any(Object),
    )
    expect(result).toBe(mockClient)
  })

  it('should disable auth', () => {
    useSupabaseServer()

    const callArgs = vi.mocked(createClient).mock.calls[0]
    const options = callArgs![2]

    expect(options).toHaveProperty('auth.persistSession', false)
    expect(options).toHaveProperty('auth.autoRefreshToken', false)
  })

  it('should use correct URL from runtime config', () => {
    // Update the mocked config
    mockConfig.supabaseUrl = 'https://custom.supabase.co'
    mockConfig.supabaseApiKey = 'custom-key'

    useSupabaseServer()

    expect(createClient).toHaveBeenCalledWith(
      'https://custom.supabase.co',
      'custom-key',
      expect.any(Object),
    )
  })
})
