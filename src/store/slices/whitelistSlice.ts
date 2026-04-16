import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/store'
import { storage } from '@/utils/storage'

interface WhitelistState {
  favoriteIds: number[]
}

const initialState: WhitelistState = {
  favoriteIds: []
}

// Thunk to handle multi-tenancy LocalStorage persistence safely
export const toggleFavoriteThunk = createAsyncThunk(
  'whitelist/toggleFavoriteThunk',
  async (characterId: number, { getState, dispatch }) => {
    const state = getState() as RootState
    const user = state.session.user
    
    if (!user) return // No user, don't save to storage

    // Modify local state first (Optimistic update)
    dispatch(whitelistSlice.actions.toggleFavorite(characterId))
    
    // Save to LocalStorage scoped by User ID
    const newState = getState() as RootState
    storage.setWhitelist(user.id, newState.whitelist.favoriteIds)
  }
)

export const whitelistSlice = createSlice({
  name: 'whitelist',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const id = action.payload
      if (state.favoriteIds.includes(id)) {
        state.favoriteIds = state.favoriteIds.filter(fId => fId !== id)
      } else {
        state.favoriteIds.push(id)
      }
    },
    hydrateFavorites: (state, action: PayloadAction<number[]>) => {
      state.favoriteIds = action.payload
    }
  }
})

export const { toggleFavorite, hydrateFavorites } = whitelistSlice.actions
export default whitelistSlice.reducer
