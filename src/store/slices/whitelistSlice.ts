import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/store'
import { supabase } from '@/lib/supabase'

interface WhitelistState {
  favoriteIds: number[]
}

const initialState: WhitelistState = {
  favoriteIds: []
}
export const toggleFavoriteThunk = createAsyncThunk(
  'whitelist/toggleFavoriteThunk',
  async (characterId: number, { getState, dispatch }) => {
    const state = getState() as RootState
    const user = state.session.user

    if (!user) return

    const isFavorite = state.whitelist.favoriteIds.includes(characterId)
    dispatch(whitelistSlice.actions.toggleFavorite(characterId))

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('whitelist')
          .delete()
          .eq('user_id', user.id)
          .eq('character_id', characterId)

        if (error) throw error
      } else {
        const { error } = await supabase.from('whitelist').insert({ user_id: user.id, character_id: characterId })

        if (error) throw error
      }
    } catch (err) {
      console.error('Whitelist sync failed, rolling back:', err)
      dispatch(whitelistSlice.actions.toggleFavorite(characterId))
    }
  }
)
export const loadWhitelistThunk = createAsyncThunk(
  'whitelist/loadWhitelistThunk',
  async (userId: string, { dispatch }) => {
    try {
      const { data, error } = await supabase
        .from('whitelist')
        .select('character_id')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })

      if (error) throw error

      const ids = (data || []).map((row: { character_id: number }) => row.character_id)
      dispatch(whitelistSlice.actions.hydrateFavorites(ids))
    } catch (err) {
      console.error('Failed to load whitelist from Supabase:', err)
    }
  }
)

export const whitelistSlice = createSlice({
  name: 'whitelist',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const id = action.payload
      if (state.favoriteIds.includes(id)) {
        state.favoriteIds = state.favoriteIds.filter((fId) => fId !== id)
      } else {
        state.favoriteIds.push(id)
      }
    },
    hydrateFavorites: (state, action: PayloadAction<number[]>) => {
      state.favoriteIds = action.payload
    },
    clearFavorites: (state) => {
      state.favoriteIds = []
    }
  }
})

export const { toggleFavorite, hydrateFavorites, clearFavorites } = whitelistSlice.actions
export default whitelistSlice.reducer
