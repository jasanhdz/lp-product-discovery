import { configureStore } from '@reduxjs/toolkit'
import productsUiReducer from './slices/productsUiSlice'
import sessionReducer from './slices/sessionSlice'
import { rickAndMortyApi } from './api/rickAndMortyApi'

import whitelistReducer from './slices/whitelistSlice'

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    productsUi: productsUiReducer,
    whitelist: whitelistReducer,
    // Conectamos el reducer que maneja todo el caché interno de peticiones
    [rickAndMortyApi.reducerPath]: rickAndMortyApi.reducer
  },
  // Inyectamos el middleware de RTK Query.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rickAndMortyApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
