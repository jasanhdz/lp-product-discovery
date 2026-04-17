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
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Badge,
  Public,
  Pets
} from '@mui/icons-material'
import styles from './styles.module.scss'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#97ce4c' }
  }
})

const DIMENSIONS = [
  'Dimension C-137',
  'Dimension C-500A',
  'Dimension D-99',
  'Dimension J19ζ7',
  'Cronenberg Dimension',
  'Replacement Dimension',
  'Giant Telepathic Spider Dimension',
  'Fascist Dimension',
  'Blender Dimension',
  'Pizza Dimension'
]

const SPECIES_LIST = ['Human', 'Alien', 'Humanoid', 'Robot', 'Mythological Creature', 'Poopybutthole', 'Cronenberg', 'Unknown']

export default function SignUpPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // If redirected from login with unregistered Google account
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
      // 1) Create auth user in Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Registration failed — no user returned')

      const userId = authData.user.id
      const codename = form.alias || `${form.firstName} ${form.lastName}`

      // 2) Upsert profile (trigger auto-creates a basic one, we overwrite with full data)
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

      // 3) Get the real JWT session token
      const sessionToken = authData.session?.access_token || ''

      // 4) Dispatch to Redux
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
      const message = err?.message || 'Interdimensional registration failed'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    // Flag so App.jsx knows this was a REGISTRATION (allow new users)
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
        {/* ─── LEFT: Immersive Branding Panel (Desktop only) ─── */}
        <div className={styles.brandPanel}>
          <div className={styles.brandContent}>
            <div className={styles.bigPortalRing}>🧬</div>
            <div className={styles.brandTitle}>Join the Citadel</div>
            <div className={styles.brandSubtitle}>
              Interdimensional Registration
              <br />
              Protocol v2.137
            </div>
            <div className={styles.brandDivider} />
            <div className={styles.brandQuote}>"Nobody exists on purpose. Nobody belongs anywhere. Everybody's gonna die. Come watch TV."</div>
          </div>
        </div>

        {/* ─── RIGHT: Compact Form Panel ─── */}
        <div className={styles.formPanel}>
          <div className={styles.formCard}>
            {/* Mobile-only branding */}
            <div className={styles.mobileHeader}>
              <div className={styles.portalRing}>🧬</div>
              <div className={styles.mobileTitle}>Join the Citadel</div>
              <div className={styles.mobileSubtitle}>Interdimensional Registration</div>
            </div>

            {/* Desktop-only small title */}
            <div className={styles.formHeader}>
              <div className={styles.formTitle}>Create your Portal Pass</div>
              <div className={styles.formSubtitle}>All fields required for dimensional clearance</div>
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
              {/* Row 1: First Name + Last Name */}
              <div className={styles.fieldRow}>
                <TextField
                  fullWidth
                  variant='outlined'
                  label='First Name'
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
                  label='Last Name'
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

              {/* Row 2: Alias + Email */}
              <div className={styles.fieldRow}>
                <TextField
                  fullWidth
                  variant='outlined'
                  label='Codename'
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
                  label='Email'
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

              {/* Row 3: Species + Dimension */}
              <div className={styles.fieldRow}>
                <TextField
                  fullWidth
                  select
                  variant='outlined'
                  label='Species'
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
                  label='Dimension'
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

              {/* Row 4: Password */}
              <TextField
                fullWidth
                variant='outlined'
                type={showPassword ? 'text' : 'password'}
                label='Access Code'
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
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge='end' sx={{ color: 'rgba(255,255,255,0.3)' }}>
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
                    Calibrating Portal Gun...
                  </span>
                ) : (
                  'CREATE PORTAL PASS'
                )}
              </Button>
            </Box>

            {/* Divider */}
            <div className={styles.dividerRow}>
              <div className={styles.dividerLine} />
              <span className={styles.dividerText}>OR</span>
              <div className={styles.dividerLine} />
            </div>

            {/* Google OAuth */}
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
              Continue with Google
            </Button>

            <div className={styles.footerLink}>
              <span>Already have a Portal Pass?</span>
              <button type='button' onClick={() => navigate('/auth/sign-in')}>
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
