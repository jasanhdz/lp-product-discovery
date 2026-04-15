import { useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { loginSuccess } from '@/store/slices/sessionSlice'
import { storage } from '@/utils/storage'
import { ENV } from '@/constants/environment'
import hmacSHA256 from 'crypto-js/hmac-sha256'
import Base64Url from 'crypto-js/enc-base64url'
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  ThemeProvider,
  createTheme
} from '@mui/material'
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material'
import styles from './styles.module.scss'

// Creamos un tema oscuro temporal específico para que los inputs
// de Material UI hagan buen contraste con el fondo espacial
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#60a5fa' // Un azul claro e invitante
    }
  }
})

export default function SignInPage() {
  const dispatch = useAppDispatch()

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      // Creamos un JWT estructurado matemáticamente válido para que 
      // `jwt-decode` no se rompa al recargar la página mañana.
      const fakeHeader = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
      const fakeUser = { id: 'usr_xyz123', email, name: 'Super Piloto' }
      
      // Encriptación ultra realista (HMAC-SHA256)
      const payloadBase64 = btoa(JSON.stringify(fakeUser))
      const fakePayload = payloadBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
      
      // Generamos la firma criptográfica exacta basada en tu ENV
      const dataToSign = `${fakeHeader}.${fakePayload}`
      const secretSignature = Base64Url.stringify(hmacSHA256(dataToSign, ENV.DUMMY_JWT_SIGNATURE))
      
      const fakeToken = `${dataToSign}.${secretSignature}`

      // GRABAMOS en persistencia ÚNICAMENTE el token.
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
          {/* Encabezado */}
          <Box display='flex' flexDirection='column' alignItems='center' mb={2}>
            <Typography variant='h4' fontWeight='800' color='primary.main' gutterBottom>
              Bienvenido
            </Typography>
            <Typography variant='body2' color='text.secondary' textAlign='center'>
              A la base de misiones intergalácticas. Inicia sesión para descubrir el universo.
            </Typography>
          </Box>

          {/* Formulario usando el Box de MUI en lugar de flex-col genérico */}
          <Box
            component='form'
            onSubmit={handleLogin}
            display='flex'
            flexDirection='column'
            gap={3}
          >
            <TextField
              fullWidth
              variant='outlined'
              label='Correo Electrónico'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              label='Contraseña'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge='end'>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button
              type='submit'
              variant='contained'
              size='large'
              disabled={isLoading}
              className={styles.submitBtn}
            >
              {isLoading ? 'Autenticando cápsula...' : 'Iniciar Sesión'}
            </Button>
          </Box>
        </div>
      </div>
    </ThemeProvider>
  )
}
