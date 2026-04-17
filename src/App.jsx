import { Suspense, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Router from '@/router'
import LoaderPage from './pages/Loader'
import { useAppDispatch } from '@/store/hooks'
import { finishSessionLoading, loginSuccess } from '@/store/slices/sessionSlice'
import { supabase } from '@/lib/supabase'
import { storage } from '@/utils/storage'
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

          // If user clicked Google on the LOGIN page but has no real profile
          // (trigger auto-created a skeleton with no species/alias), reject them
          const isNewUser = !profile?.species || profile.species === 'Human' && !profile?.alias && !profile?.last_name
          
          if (authIntent === 'signin' && isNewUser) {
            // This user hasn't registered properly — kick them out
            await supabase.auth.signOut()
            // Redirect to signup with error message via URL param
            window.location.href = '/auth/sign-up?error=unregistered'
            return
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
                home_dimension: profile?.home_dimension || ''
              },
              token: session.access_token
            })
          )

          // 5) Hydrate whitelist for this specific user
          const savedWhitelist = storage.getWhitelist(userId)
          if (savedWhitelist.length > 0) {
            import('@/store/slices/whitelistSlice').then(({ hydrateFavorites }) => {
              dispatch(hydrateFavorites(savedWhitelist))
            })
          }
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
