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
  const [debouncedSearch, setDebouncedSearch] = useState<string>(searchTerm)

  useEffect(() => {
    if (searchTerm !== debouncedSearch) {
      const handler = setTimeout(() => setDebouncedSearch(searchTerm), 500)
      return () => clearTimeout(handler)
    }
  }, [searchTerm, debouncedSearch])
  const filterSignature = useRef<string>(`${species}-${debouncedSearch}-${statusFilter}`)
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
  useLayoutEffect(() => {
    if (charactersRequest?.results) {
      if (page === 1) {
        setAllCharacters(charactersRequest.results as Character[])
      } else {
        setAllCharacters((prev) => {
          const existingIds = new Set(prev.map((c) => c.id))
          const newItems = charactersRequest.results.filter((c) => !existingIds.has(c.id)) as Character[]
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
