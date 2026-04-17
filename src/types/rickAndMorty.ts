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
  origin: {
    name: string
    url: string
  }
  location: {
    name: string
    url: string
  }
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
