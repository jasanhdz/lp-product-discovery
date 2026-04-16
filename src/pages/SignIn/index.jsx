import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/store/hooks'
import { loginSuccess } from '@/store/slices/sessionSlice'
import { storage } from '@/utils/storage'
import { ENV } from '@/constants/environment'
import hmacSHA256 from 'crypto-js/hmac-sha256'
import Base64Url from 'crypto-js/enc-base64url'
import { Box, TextField, Button, InputAdornment, IconButton, ThemeProvider, createTheme, CircularProgress } from '@mui/material'
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material'
import styles from './styles.module.scss'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#97ce4c' }
  }
})

export default function SignInPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      const fakeHeader = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
      const fakeUser = { id: 'usr_xyz123', email, name: email.split('@')[0] }

      const payloadBase64 = btoa(JSON.stringify(fakeUser))
      const fakePayload = payloadBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

      const dataToSign = `${fakeHeader}.${fakePayload}`
      const secretSignature = Base64Url.stringify(hmacSHA256(dataToSign, ENV.DUMMY_JWT_SIGNATURE))

      const fakeToken = `${dataToSign}.${secretSignature}`

      storage.setToken(fakeToken)

      dispatch(
        loginSuccess({
          user: fakeUser,
          token: fakeToken
        })
      )
      setIsLoading(false)
    }, 1500)
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={styles.container}>
        <div className={styles.glassCard}>
          {/* Portal Logo */}
          <div className={styles.logoArea}>
            <div className={styles.portalRing}>
              <span className={styles.portalIcon}>🛸</span>
            </div>
            <div className={styles.authTitle}>Welcome Back</div>
            <div className={styles.authSubtitle}>Citadel Authentication Portal</div>
          </div>

          {/* Login Form */}
          <Box component='form' onSubmit={handleLogin} className={styles.formGroup}>
            <TextField
              fullWidth
              variant='outlined'
              label='Interdimensional Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              label='Access Code'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                  Authenticating...
                </span>
              ) : (
                'OPEN PORTAL'
              )}
            </Button>
          </Box>

          {/* Footer Link to Sign Up */}
          <div className={styles.footerLink}>
            <span>New to the Citadel?</span>
            <button type='button' onClick={() => navigate('/auth/sign-up')}>
              Register Here
            </button>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
