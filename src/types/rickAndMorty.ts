/**
 * DTOs (Data Transfer Objects) and Common Interfaces
 * Core domain objects shared across the whole app.
 */

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

export interface CitadelPaginationInfo {
  count: number
  pages: number
  next: string | null
  prev: string | null
}

export interface CharactersResponse {
  info: CitadelPaginationInfo
  results: Character[]
}

export interface CharacterFilters {
  page?: number
  name?: string
  status?: string
  species?: string
}
