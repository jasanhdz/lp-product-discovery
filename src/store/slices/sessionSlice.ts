import { createSlice, PayloadAction } from '@reduxjs/toolkit'
export interface User {
  id: string
  email: string
  name?: string
  first_name?: string
  last_name?: string
  alias?: string
  species?: string
  home_dimension?: string
  avatar_url?: string
}
export interface SessionState {
  user: User | null
  token: string | null
  isLoggedIn: boolean
  isLoadingSession: boolean
}

const initialState: SessionState = {
  user: null,
  token: null,
  isLoggedIn: false,
  isLoadingSession: true
}

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isLoggedIn = true
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isLoggedIn = false
      state.isLoadingSession = false
    },
    finishSessionLoading: (state) => {
      state.isLoadingSession = false
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    }
  }
})
export const { loginSuccess, logout, finishSessionLoading, updateProfile } = sessionSlice.actions

export default sessionSlice.reducer
