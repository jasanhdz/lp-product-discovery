import { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react'
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
  // INICIALIZADO con searchTerm para evitar que borre/parpadee al volver de otra vista
  const [debouncedSearch, setDebouncedSearch] = useState<string>(searchTerm)

  useEffect(() => {
    // Si searchTerm cambia, aplicamos debounce de 500ms
    if (searchTerm !== debouncedSearch) {
      const handler = setTimeout(() => setDebouncedSearch(searchTerm), 500)
      return () => clearTimeout(handler)
    }
  }, [searchTerm, debouncedSearch])

  // Generamos una firma para saber cuándo LOS FILTROS REALMENTE CAMBIARON (y no solo fue un re-render o regreso a la pestaña)
  const filterSignature = useRef<string>(`${species}-${debouncedSearch}-${statusFilter}`)

  // Reset del feed total SOLO si cambiamos de filtros de manera genuina
  useEffect(() => {
    const currentSignature = `${species}-${debouncedSearch}-${statusFilter}`
    if (filterSignature.current !== currentSignature) {
      filterSignature.current = currentSignature
      setPage(1)
      setAllCharacters([])
      setTotalEntities(0)
    }
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
