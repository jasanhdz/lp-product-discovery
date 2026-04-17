import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/store/hooks'
import { loginSuccess } from '@/store/slices/sessionSlice'
import { loadWhitelistThunk } from '@/store/slices/whitelistSlice'
import { supabase } from '@/lib/supabase'
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  IconButton,
  CircularProgress,
  CircularProgress,
  Alert
} from '@mui/material'
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material'
import styles from './styles.module.scss'

export default function SignInPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Authentication failed')

      const userId = authData.user.id
      const sessionToken = authData.session?.access_token || ''
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single()

      const displayName = profile?.alias || profile?.first_name || email.split('@')[0]
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
            avatar_url: authData.user.user_metadata?.avatar_url || ''
          },
          token: sessionToken
        })
      )
      dispatch(loadWhitelistThunk(userId))
    } catch (err) {
      const message = err?.message || 'Fallo en la autenticación del portal'
      setError(
        message === 'Invalid login credentials'
          ? 'Credenciales inválidas. Verifica tu correo y código de acceso.'
          : message
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    localStorage.setItem('auth_intent', 'signin')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/products'
      }
    })
    if (error) setError(error.message)
  }

  return (
    <div className={styles.container}>
      <div className={styles.glassCard}>
        {}
        <div className={styles.logoArea}>
          <div className={styles.portalRing}>
            <span className={styles.portalIcon}>🛸</span>
          </div>
          <div className={styles.authTitle}>Bienvenido de Vuelta</div>
          <div className={styles.authSubtitle}>Portal de Autenticación de la Ciudadela</div>
        </div>

        {error && (
          <Alert
            severity='error'
            sx={{
              mb: 3,
              background: 'rgba(255, 77, 77, 0.1)',
              color: '#ff6b6b',
              border: '1px solid rgba(255, 77, 77, 0.2)',
              fontFamily: 'Space Mono, monospace',
              fontSize: '0.8rem',
              '& .MuiAlert-icon': { color: '#ff6b6b' }
            }}
          >
            {error}
          </Alert>
        )}

        {}
        <Box component='form' onSubmit={handleLogin} className={styles.formGroup}>
          <TextField
            fullWidth
            variant='outlined'
            label='Correo Interdimensional'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (error) setError('')
            }}
            required
            className={styles.inputField}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Email />
                </InputAdornment>
              )
            }}
          />

          <TextField
            fullWidth
            variant='outlined'
            type={showPassword ? 'text' : 'password'}
            label='Código de Acceso'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (error) setError('')
            }}
            required
            className={styles.inputField}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge='end'
                    sx={{ color: 'rgba(255,255,255,0.3)' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Button type='submit' variant='contained' size='large' disabled={isLoading} className={styles.submitBtn}>
            {isLoading ? (
              <span className={styles.loadingText}>
                <CircularProgress size={20} sx={{ color: '#0a0b10' }} />
                Autenticando...
              </span>
            ) : (
              'ABRIR PORTAL'
            )}
          </Button>
        </Box>

        {}
        <div className={styles.dividerRow}>
          <div className={styles.dividerLine} />
          <span className={styles.dividerText}>O</span>
          <div className={styles.dividerLine} />
        </div>

        {}
        <Button
          fullWidth
          variant='outlined'
          onClick={handleGoogleLogin}
          className={styles.googleBtn}
          startIcon={
            <svg width='18' height='18' viewBox='0 0 24 24'>
              <path
                fill='#4285F4'
                d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z'
              />
              <path
                fill='#34A853'
                d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
              />
              <path
                fill='#FBBC05'
                d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
              />
              <path
                fill='#EA4335'
                d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
              />
            </svg>
          }
        >
          Continuar con Google
        </Button>

        {}
        <div className={styles.footerLink}>
          <span>¿Nuevo en la Ciudadela?</span>
          <button type='button' onClick={() => navigate('/auth/sign-up')}>
            Regístrate Aquí
          </button>
        </div>
      </div>
    </div>
  )
}
