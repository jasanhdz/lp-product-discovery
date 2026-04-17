import { configureStore } from '@reduxjs/toolkit'
import productsUiReducer from './slices/productsUiSlice'
import sessionReducer from './slices/sessionSlice'
import { rickAndMortyApi } from './api/rickAndMortyApi'
import { formApi } from './api/formApi'

import whitelistReducer from './slices/whitelistSlice'

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    productsUi: productsUiReducer,
    whitelist: whitelistReducer,
    [rickAndMortyApi.reducerPath]: rickAndMortyApi.reducer,
    [formApi.reducerPath]: formApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rickAndMortyApi.middleware).concat(formApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
