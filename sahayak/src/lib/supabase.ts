import { createClient } from '@supabase/supabase-js'

/* SahayaK Supabase project — publishable (anon) key only; safe for client bundles.
 * Used for real email verification: Supabase Auth emails a 6-digit OTP to the
 * user's real inbox; the app confirms it server-side via auth.verifyOtp().
 * Demo accounts (seed users) keep the on-screen demo-inbox flow instead.
 *
 * Config comes from env vars so deployments (Vercel etc.) can point at their own
 * project without code changes. The literals below are the publishable demo
 * credentials — intentionally NOT secrets, and used as local fallbacks. */
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? 'https://cihviyogcfnwavqxckmk.supabase.co'
export const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'sb_publishable_UiHtNEAcy6_LTDb1dB0AvA_A3OlZ8Nw'

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    /* The app's session lives in the zustand store, not Supabase —
       we only use Supabase for the OTP handshake. Keep it out of localStorage. */
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
})

/* Where Supabase email links (confirm / magic-link) should land, on any host —
 * works unchanged on localhost, Vercel preview URLs and the production domain. */
export const emailRedirectTo = () => `${window.location.origin}/auth`
