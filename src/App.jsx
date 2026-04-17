import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Router from '@/router'
import LoaderPage from './pages/Loader'
import AuthProvider from '@/providers/AuthProvider'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0a0b10',
      paper: '#11151c'
    },
    primary: {
      main: '#97ce4c'
    }
  },
  typography: {
    fontFamily: '"Space Grotesk", sans-serif'
  }
})

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<LoaderPage />}>
            <Router />
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
