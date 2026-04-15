import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// TODO: Define la estructura (interfaz) correcta para tus productos según responda la API
interface Product {
  id: number
  title: string
  // TODO: Agrega el resto de propiedades (description, price, image, etc.)
}

interface ProductsState {
  items: Product[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null
}

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // TODO: Define tus acciones síncronas aquí. Por ejemplo, guardar los productos temporalmente.
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload
    }
  },
  extraReducers: (builder) => {
    // TODO: Puntos de extensión para peticiones asíncronas creadas con `createAsyncThunk`.
    // Aquí manejarás los casos "pending", "fulfilled" y "rejected" cuando llames a DummyJSON.
  }
})

export const { setProducts } = productsSlice.actions

export default productsSlice.reducer
