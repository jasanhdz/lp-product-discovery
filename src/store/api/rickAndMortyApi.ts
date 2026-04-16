import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ENV } from '@/constants/environment'
import { CharactersResponse, CharacterFilters, Character } from '@/types/rickAndMorty'

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
        if (filters.species) params.append('species', filters.species)

        const queryString = params.toString()
        return queryString ? `character/?${queryString}` : 'character'
      }
    }),

    // Obtener un solo elemento (Actuará para nuestro Detalle de "Producto")
    getCharacterById: builder.query<Character, string | number>({
      query: (id) => `character/${id}`
    }),

    // Obtener varios especificamente por array de IDs (Para la Whitelist)
    getMultipleCharactersByIds: builder.query<Character[], number[]>({
      query: (ids) => `character/${ids.join(',')}`,
      transformResponse: (response: Character | Character[]) => {
        return Array.isArray(response) ? response : [response];
      }
    })
  })
})

export const { 
  useGetCharactersQuery, 
  useGetCharacterByIdQuery,
  useGetMultipleCharactersByIdsQuery
} = rickAndMortyApi
