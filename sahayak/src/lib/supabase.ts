import { createClient } from '@supabase/supabase-js'

/* SahayaK Supabase project — publishable (anon) key only; safe for client bundles.
 * Used for real email verification: Supabase Auth emails a 6-digit OTP to the
 * user's real inbox; the app confirms it server-side via auth.verifyOtp().
 * Demo accounts (seed users) keep the on-screen demo-inbox flow instead. */
export const SUPABASE_URL = 'https://cihviyogcfnwavqxckmk.supabase.co'
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_UiHtNEAcy6_LTDb1dB0AvA_A3OlZ8Nw'

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    /* The app's session lives in the zustand store, not Supabase —
       we only use Supabase for the OTP handshake. Keep it out of localStorage. */
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
})
