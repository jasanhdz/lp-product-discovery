import { jwtDecode } from 'jwt-decode'
import hmacSHA256 from 'crypto-js/hmac-sha256'
import Base64Url from 'crypto-js/enc-base64url'
import { ENV } from '@/constants/environment'

export const TOKEN_KEY = '@lp_token'

export const storage = {
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY)
  },

  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token)
  },

  getUserFromToken: (): any | null => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) return null

    try {
      const chunks = token.split('.')
      if (chunks.length !== 3) throw new Error('Token corrupto')

      const [header, payload, signature] = chunks

      const validSignature = Base64Url.stringify(
        hmacSHA256(`${header}.${payload}`, ENV.DUMMY_JWT_SIGNATURE)
      )

      if (signature !== validSignature) {
        throw new Error('Alerta de Hackeo: Firma inválida detectada')
      }

      return jwtDecode(token)
    } catch (error) {
      console.warn('Protección de Integridad Activada:', error)
      localStorage.removeItem(TOKEN_KEY)
      return null
    }
  },

  clearSession: (): void => {
    localStorage.removeItem(TOKEN_KEY)
  }
}
