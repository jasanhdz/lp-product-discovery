import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { ENV } from '@/constants/environment'

export interface Character {
  id: number
  name: string
  status: string
  species: string
  type: string
  gender: string
  image: string
  url: string
  created: string
}

export interface Info {
  count: number
  pages: number
  next: string | null
  prev: string | null
}

export interface CharactersResponse {
  info: Info
  results: Character[]
}

// Parámetros de búsqueda para nuestro listado
export interface CharacterFilters {
  page?: number
  name?: string
  status?: string
}

export const rickAndMortyApi = createApi({
  reducerPath: 'rickAndMortyApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: ENV.API_URL
  }),
  
  endpoints: (builder) => ({
    // Obtener lista completa (Actuará como nuestro buscador de "productos")
    getCharacters: builder.query<CharactersResponse, CharacterFilters | void>({
      query: (filters) => {
        if (!filters) return 'character'
        
        const params = new URLSearchParams()
        if (filters.page) params.append('page', filters.page.toString())
        if (filters.name) params.append('name', filters.name)
        if (filters.status) params.append('status', filters.status)
        
        const queryString = params.toString()
        return queryString ? `character/?${queryString}` : 'character'
      }
    }),
    
    // Obtener un solo elemento (Actuará para nuestro Detalle de "Producto")
    getCharacterById: builder.query<Character, string | number>({
      query: (id) => `character/${id}`
    })
  })
})

export const { 
  useGetCharactersQuery, 
  useGetCharacterByIdQuery 
} = rickAndMortyApi
