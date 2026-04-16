import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/store/hooks'
import { loginSuccess } from '@/store/slices/sessionSlice'
import { storage } from '@/utils/storage'
import { ENV } from '@/constants/environment'
import hmacSHA256 from 'crypto-js/hmac-sha256'
import Base64Url from 'crypto-js/enc-base64url'
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  ThemeProvider,
  createTheme,
  CircularProgress,
  MenuItem
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

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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
  }

  const handleRegister = (e) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      const codename = form.alias || `${form.firstName}_${form.lastName}`
      const fakeHeader = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
      const fakeUser = {
        id: `usr_${Date.now().toString(36)}`,
        email: form.email,
        name: codename
      }

      const payloadBase64 = btoa(JSON.stringify(fakeUser))
      const fakePayload = payloadBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

      const dataToSign = `${fakeHeader}.${fakePayload}`
      const secretSignature = Base64Url.stringify(hmacSHA256(dataToSign, ENV.DUMMY_JWT_SIGNATURE))

      const fakeToken = `${dataToSign}.${secretSignature}`
      storage.setToken(fakeToken)

      dispatch(loginSuccess({ user: fakeUser, token: fakeToken }))
      setIsLoading(false)
    }, 2000)
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
            {/* Mobile-only branding (hidden on desktop) */}
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
