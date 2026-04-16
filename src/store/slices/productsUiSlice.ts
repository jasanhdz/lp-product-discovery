import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ProductsUiState {
  species: string
  searchTerm: string
  statusFilter: string
}

const initialState: ProductsUiState = {
  species: 'all',
  searchTerm: '',
  statusFilter: ''
}

export const productsSlice = createSlice({
  name: 'productsUi',
  initialState,
  reducers: {
    setSpecies: (state, action: PayloadAction<string>) => {
      state.species = action.payload
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      // Toggle logic inside reducers avoids having to pass specific 'prev' states across apps!
      state.statusFilter = state.statusFilter === action.payload ? '' : action.payload
    },
    resetFilters: (state) => {
      state.species = 'all'
      state.searchTerm = ''
      state.statusFilter = ''
    }
  }
})

export const { setSpecies, setSearchTerm, setStatusFilter, resetFilters } = productsSlice.actions
export default productsSlice.reducer
