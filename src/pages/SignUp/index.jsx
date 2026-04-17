import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppDispatch } from '@/store/hooks'
import { loginSuccess } from '@/store/slices/sessionSlice'
import { supabase } from '@/lib/supabase'
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  ThemeProvider,
  createTheme,
  CircularProgress,
  MenuItem,
  Alert
} from '@mui/material'
import { Visibility, VisibilityOff, Email, Lock, Person, Badge, Public, Pets } from '@mui/icons-material'
import styles from './styles.module.scss'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#97ce4c' }
  }
})

import { DIMENSIONS, SPECIES_LIST } from '@/constants/citadel'

export default function SignUpPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    if (searchParams.get('error') === 'unregistered') {
      setError('You need to register first. Use Google or email below to create your Portal Pass.')
    }
  }, [searchParams])

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    alias: '',
    email: '',
    password: '',
    species: '',
    dimension: ''
  })

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (error) setError('')
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Registration failed — no user returned')

      const userId = authData.user.id
      const codename = form.alias || `${form.firstName} ${form.lastName}`
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: userId,
        first_name: form.firstName,
        last_name: form.lastName,
        alias: form.alias || null,
        species: form.species,
        home_dimension: form.dimension,
        email: form.email
      })

      if (profileError) {
        console.error('Profile upsert error:', profileError)
      }
      const sessionToken = authData.session?.access_token || ''
      dispatch(
        loginSuccess({
          user: {
            id: userId,
            email: form.email,
            name: codename,
            first_name: form.firstName,
            last_name: form.lastName,
            alias: form.alias,
            species: form.species,
            home_dimension: form.dimension
          },
          token: sessionToken
        })
      )
    } catch (err) {
      const message = err?.message || 'Fallo en el registro interdimensional'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    localStorage.setItem('auth_intent', 'signup')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/products'
      }
    })
    if (error) setError(error.message)
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={styles.container}>
        {}
        <div className={styles.brandPanel}>
          <div className={styles.brandContent}>
            <div className={styles.bigPortalRing}>🧬</div>
            <div className={styles.brandTitle}>Únete a la Ciudadela</div>
            <div className={styles.brandSubtitle}>
              Registro Interdimensional
              <br />
              Protocolo v2.137
            </div>
            <div className={styles.brandDivider} />
            <div className={styles.brandQuote}>
              "Nadie existe a propósito. Nadie pertenece a ninguna parte. Todos vamos a morir. Ven a ver la televisión."
            </div>
          </div>
        </div>

        {}
        <div className={styles.formPanel}>
          <div className={styles.formCard}>
            {}
            <div className={styles.mobileHeader}>
              <div className={styles.portalRing}>🧬</div>
              <div className={styles.mobileTitle}>Únete a la Ciudadela</div>
              <div className={styles.mobileSubtitle}>Registro Interdimensional</div>
            </div>

            {}
            <div className={styles.formHeader}>
              <div className={styles.formTitle}>Crea tu Pase de Portal</div>
              <div className={styles.formSubtitle}>Todos los campos son requeridos para autorización dimensional</div>
            </div>

            {error && (
              <Alert
                severity='error'
                sx={{
                  mb: 2,
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

            <Box component='form' onSubmit={handleRegister} className={styles.formGroup}>
              {}
              <div className={styles.fieldRow}>
                <TextField
                  fullWidth
                  variant='outlined'
                  label='Nombre'
                  value={form.firstName}
                  onChange={handleChange('firstName')}
                  required
                  className={styles.inputField}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Person />
                      </InputAdornment>
                    )
                  }}
                />
                <TextField
                  fullWidth
                  variant='outlined'
                  label='Apellido'
                  value={form.lastName}
                  onChange={handleChange('lastName')}
                  required
                  className={styles.inputField}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Person />
                      </InputAdornment>
                    )
                  }}
                />
              </div>

              {}
              <div className={styles.fieldRow}>
                <TextField
                  fullWidth
                  variant='outlined'
                  label='Nombre Clave'
                  placeholder='Pickle Rick...'
                  value={form.alias}
                  onChange={handleChange('alias')}
                  className={styles.inputField}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Badge />
                      </InputAdornment>
                    )
                  }}
                />
                <TextField
                  fullWidth
                  variant='outlined'
                  label='Correo'
                  value={form.email}
                  onChange={handleChange('email')}
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
              </div>

              {}
              <div className={styles.fieldRow}>
                <TextField
                  fullWidth
                  select
                  variant='outlined'
                  label='Especie'
                  value={form.species}
                  onChange={handleChange('species')}
                  required
                  className={styles.inputField}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Pets />
                      </InputAdornment>
                    )
                  }}
                >
                  {SPECIES_LIST.map((sp) => (
                    <MenuItem key={sp} value={sp}>
                      {sp}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  select
                  variant='outlined'
                  label='Dimensión'
                  value={form.dimension}
                  onChange={handleChange('dimension')}
                  required
                  className={styles.inputField}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Public />
                      </InputAdornment>
                    )
                  }}
                >
                  {DIMENSIONS.map((dim) => (
                    <MenuItem key={dim} value={dim}>
                      {dim}
                    </MenuItem>
                  ))}
                </TextField>
              </div>

              {}
              <TextField
                fullWidth
                variant='outlined'
                type={showPassword ? 'text' : 'password'}
                label='Código de Acceso'
                value={form.password}
                onChange={handleChange('password')}
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
                    Calibrando Pistola de Portales...
                  </span>
                ) : (
                  'CREAR PASE DE PORTAL'
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
              onClick={handleGoogleSignUp}
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

            <div className={styles.footerLink}>
              <span>¿Ya tienes un Pase de Portal?</span>
              <button type='button' onClick={() => navigate('/auth/sign-in')}>
                Iniciar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
