import { env } from 'node:process'
import { createClient } from '@supabase/supabase-js'

export function useSupabase() {
  return createClient(
    env.NUXT_SUPABASE_URL!,
    env.NUXT_SUPABASE_API_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  )
}
