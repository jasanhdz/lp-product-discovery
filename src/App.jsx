import { Suspense, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Router from '@/router'
import LoaderPage from './pages/Loader'
import { useAppDispatch } from '@/store/hooks'
import { finishSessionLoading, loginSuccess } from '@/store/slices/sessionSlice'
import { supabase } from '@/lib/supabase'
import { loadWhitelistThunk } from '@/store/slices/whitelistSlice'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'

const darkTheme = createTheme({
  palette: {
    mode: 'dark', // Fuerza MUI a dibujar todo oscuro garantizado
    background: {
      default: '#0a0b10', // El mismo negro espacial que tu global.scss para evitar el fondo blanco!
      paper: '#11151c'
    },
    primary: {
      main: '#97ce4c' // Portal Green
    }
  },
  typography: {
    fontFamily: '"Space Grotesk", sans-serif'
  }
})

export default function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const recoverSession = async () => {
      try {
        // 1) Check if Supabase has an active session (persisted in localStorage by the SDK)
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          const userId = session.user.id
          const email = session.user.email || ''

          // 2) Fetch the full profile from our profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()

          // 3) Enforce registration-first policy for Google OAuth
          const authIntent = localStorage.getItem('auth_intent')
          localStorage.removeItem('auth_intent') // Clean up flag

          if (authIntent === 'signin') {
            // Check if this user JUST got created by the trigger (within last 15 seconds)
            // If so, they're brand new and haven't registered via SignUp
            const profileAge = profile?.created_at
              ? (Date.now() - new Date(profile.created_at).getTime()) / 1000
              : 0

            if (profileAge < 15) {
              // This user hasn't registered properly — kick them out
              await supabase.auth.signOut()
              window.location.href = '/auth/sign-up?error=unregistered'
              return
            }
            // If profile is older than 15 seconds, they registered before → allow login
          }

          const displayName = profile?.alias || profile?.first_name || email.split('@')[0]

          // 4) Dispatch to Redux
          dispatch(
            loginSuccess({
              user: {
                id: userId,
                email,
                name: displayName,
                first_name: profile?.first_name || '',
                last_name: profile?.last_name || '',
                alias: profile?.alias || '',
                species: profile?.species || '',
                home_dimension: profile?.home_dimension || '',
                avatar_url: session.user.user_metadata?.avatar_url || ''
              },
              token: session.access_token
            })
          )

          // 5) Hydrate whitelist from Supabase
          dispatch(loadWhitelistThunk(userId))
        }
      } catch (err) {
        console.warn('Session recovery failed:', err)
      } finally {
        dispatch(finishSessionLoading())
      }
    }

    recoverSession()
  }, [])

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
      <Suspense fallback={<LoaderPage />}>
        <Router />
      </Suspense>
    </BrowserRouter>
  </ThemeProvider>
  )
}
