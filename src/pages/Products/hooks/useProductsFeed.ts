import { useState, useEffect, useLayoutEffect, useCallback } from 'react'
import { useGetCharactersQuery } from '@/store/api/rickAndMortyApi'
import { Character } from '@/types/rickAndMorty'

export interface UseProductsFeedProps {
  species: string
  searchTerm: string
  statusFilter: string
}

export function useProductsFeed({ species, searchTerm, statusFilter }: UseProductsFeedProps) {
  const [page, setPage] = useState<number>(1)
  const [allCharacters, setAllCharacters] = useState<Character[]>([])
  const [totalEntities, setTotalEntities] = useState<number>(0)

  // Mantenemos un debounce local aislado que no satura el estado Global de Redux
  const [debouncedSearch, setDebouncedSearch] = useState<string>('')

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 500)
    return () => clearTimeout(handler)
  }, [searchTerm])

  // Reset del feed total cuando los filtros globales obligan a purgar la memoria acumulada
  useEffect(() => {
    setPage(1)
    setAllCharacters([])
    setTotalEntities(0)
  }, [species, debouncedSearch, statusFilter])

  const queryResponse = useGetCharactersQuery({
    species: species !== 'all' ? species : '',
    name: debouncedSearch,
    status: statusFilter,
    page
  })

  const { data: charactersRequest } = queryResponse

  useEffect(() => {
    if (charactersRequest?.info) {
      setTotalEntities(charactersRequest.info.count)
    }
  }, [charactersRequest])

  // Inyección Inmediata de Mutaciones (Evita Layout Shifts y Jumps al remover los esqueletos)
  useLayoutEffect(() => {
    if (charactersRequest?.results) {
      if (page === 1) {
        setAllCharacters(charactersRequest.results as Character[])
      } else {
        setAllCharacters((prev) => {
          const existingIds = new Set(prev.map((c) => c.id))
          const newItems = charactersRequest.results.filter(
            (c) => !existingIds.has(c.id)
          ) as Character[]
          return [...prev, ...newItems]
        })
      }
    }
  }, [charactersRequest, page])

  const loadNextPage = useCallback(() => {
    setPage((p) => p + 1)
  }, [])

  return {
    items: allCharacters,
    totalEntities,
    loadNextPage,
    hasNext: !!charactersRequest?.info?.next,
    ...queryResponse // Exponemos isFetching, isError y refetch con fluidez
  }
}
