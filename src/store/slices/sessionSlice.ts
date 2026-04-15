import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// =========================================================================
// TODO 1: DEFINE TUS INTERFACES (Estructura de Datos)
// =========================================================================

// Estructura de tu usuario. Agrega aquí las propiedades que esperas del backend.
export interface User {
  id: string
  email: string
  name?: string
  // TODO: ¿Necesitas roles, foto de perfil, url de avatar? Agrégalo aquí.
}

// Estructura completa de este "Slice" de autenticación.
export interface SessionState {
  user: User | null
  token: string | null
  isLoggedIn: boolean
  // Bandera para saber si estamos verificando la sesión inicial (viendo si hay token en LocalStorage)
  isLoadingSession: boolean
}

const initialState: SessionState = {
  user: null,
  token: null,
  isLoggedIn: false,
  // Empieza en TRUE para que la aplicación muestre tu `LoaderPage` al arrancar en lo que validas.
  isLoadingSession: true
}

// =========================================================================
// TODO 2: IMPLEMENTA TUS ACTIONS (Lógica de Negocio)
// =========================================================================

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    // Método: Cuando el usuario mete sus credenciales y la API responde exitosamente
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      // TODO: Implementar lógica de login
      // 1. Asigna action.payload.user a state.user
      // 2. Asigna action.payload.token a state.token
      // 3. Cambia state.isLoggedIn a true
      // Sugerencia: Aquí NO deberías guardar en localStorage, es mejor hacerlo donde despachas la acción
      // o mediante un middleware personalizado de Redux.
      state.user = action.payload.user
      state.token = action.payload.token
      state.isLoggedIn = true
    },

    // Método: Cuando el usuario cierra sesión manualmente o el token expira
    logout: (state) => {
      // TODO PASO 4: Limpiamos la capa de persistencia (el LocalStorage/Cookie) para evitar fallos
      // storage.clearSession()

      // Y limpiamos la RAM de Redux
      state.user = null
      state.token = null
      state.isLoggedIn = false
      state.isLoadingSession = false
    },

    // Método: Cuando has terminado de revisar si el usuario estaba previamente logueado
    finishSessionLoading: (state) => {
      // TODO: Implementar bandera de arranque
      // 1. Solo cambia state.isLoadingSession = false
      state.isLoadingSession = false
      // Sugerencia: Llama esto en el useEffect principal de tu App cuando termines de verificar tokens guardados.
    },

    // Método (Opcional): Si actualizas el perfil del usuario en settings y necesitas reflejarlo sin reloguear
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      // TODO: Implementar seteo parcial
      // Sugerencia: Haz un merge rápido. Ejemplo: if (state.user) state.user = { ...state.user, ...action.payload }
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    }
  }
})

// =========================================================================
// TODO 3: NO OLVIDES EXPORTAR LOS MÉTODOS
// =========================================================================
export const { loginSuccess, logout, finishSessionLoading, updateProfile } = sessionSlice.actions

export default sessionSlice.reducer
