export type WatchStatus = 'watching' | 'completed' | 'plan'

/** A show as returned by TMDB search / details endpoints (fields we use). */
export interface TmdbShow {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  number_of_seasons?: number
  number_of_episodes?: number
  seasons?: TmdbSeasonSummary[]
  next_episode_to_air?: TmdbEpisode | null
}

export interface TmdbSeasonSummary {
  id: number
  season_number: number
  name: string
  episode_count: number
  air_date: string | null
}

export interface TmdbEpisode {
  id: number
  season_number: number
  episode_number: number
  name: string
  overview: string
  air_date: string | null
  still_path: string | null
}

/** A show the user has added to their library, persisted to localStorage. */
export interface TrackedShow {
  id: number
  name: string
  poster_path: string | null
  first_air_date: string
  status: WatchStatus
  addedAt: number
  /** Keys of watched episodes, formatted "season:episode" (e.g. "1:3"). */
  watched: string[]
}

export const STATUS_LABELS: Record<WatchStatus, string> = {
  watching: 'Watching',
  completed: 'Completed',
  plan: 'Plan to watch',
}

export const episodeKey = (season: number, episode: number) => `${season}:${episode}`
