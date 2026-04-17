import { createClient } from '@supabase/supabase-js'
import { ENV } from '@/constants/environment'

export const supabase = createClient(
  ENV.SUPABASE_URL || 'https://fallback.supabase.co',
  ENV.SUPABASE_ANON_KEY || 'fallback_anon_key'
)
