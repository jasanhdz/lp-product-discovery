import { Suspense, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Router from '@/router'
import LoaderPage from './pages/Loader'
import { useAppDispatch } from '@/store/hooks'
import { finishSessionLoading, loginSuccess } from '@/store/slices/sessionSlice'
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
    const savedToken = storage.getToken()
    const savedUser = storage.getUserFromToken()

    if (savedToken && savedUser) {
      dispatch(loginSuccess({ user: savedUser, token: savedToken }))
      
      // Multi-tenancy: Cargar el whitelist único de este usuario
      const savedWhitelist = storage.getWhitelist(savedUser.id)
      if (savedWhitelist.length > 0) {
        import('@/store/slices/whitelistSlice').then(({ hydrateFavorites }) => {
          dispatch(hydrateFavorites(savedWhitelist))
        })
      }
    }

    dispatch(finishSessionLoading())
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
