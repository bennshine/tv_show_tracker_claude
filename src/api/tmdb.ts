import type { TmdbShow, TmdbEpisode } from '../types'

const BASE = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string | undefined

export const IMG = {
  poster: (path: string | null, size: 'w185' | 'w342' | 'w500' = 'w342') =>
    path ? `https://image.tmdb.org/t/p/${size}${path}` : null,
  still: (path: string | null) =>
    path ? `https://image.tmdb.org/t/p/w300${path}` : null,
}

export class TmdbError extends Error {}

async function get<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  if (!API_KEY) {
    throw new TmdbError(
      'Missing TMDB API key. Copy .env.example to .env and set VITE_TMDB_API_KEY.',
    )
  }
  const url = new URL(BASE + path)
  url.searchParams.set('api_key', API_KEY)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)

  const res = await fetch(url)
  if (!res.ok) {
    throw new TmdbError(`TMDB request failed (${res.status}): ${res.statusText}`)
  }
  return res.json() as Promise<T>
}

export async function searchShows(query: string): Promise<TmdbShow[]> {
  if (!query.trim()) return []
  const data = await get<{ results: TmdbShow[] }>('/search/tv', { query })
  return data.results
}

export function getShow(id: number): Promise<TmdbShow> {
  return get<TmdbShow>(`/tv/${id}`)
}

export async function getSeasonEpisodes(
  showId: number,
  seasonNumber: number,
): Promise<TmdbEpisode[]> {
  const data = await get<{ episodes: TmdbEpisode[] }>(
    `/tv/${showId}/season/${seasonNumber}`,
  )
  return data.episodes
}
