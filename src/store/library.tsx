import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { TmdbShow, TrackedShow, WatchStatus } from '../types'
import { episodeKey } from '../types'

const STORAGE_KEY = 'twee-web.library.v1'

interface LibraryContextValue {
  shows: TrackedShow[]
  isTracked: (id: number) => boolean
  getShow: (id: number) => TrackedShow | undefined
  addShow: (show: TmdbShow, status?: WatchStatus) => void
  removeShow: (id: number) => void
  setStatus: (id: number, status: WatchStatus) => void
  toggleEpisode: (id: number, season: number, episode: number) => void
  setSeasonWatched: (id: number, keys: string[], watched: boolean) => void
}

const LibraryContext = createContext<LibraryContextValue | null>(null)

function load(): TrackedShow[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as TrackedShow[]) : []
  } catch {
    return []
  }
}

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [shows, setShows] = useState<TrackedShow[]>(load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shows))
  }, [shows])

  const value = useMemo<LibraryContextValue>(() => {
    const update = (id: number, fn: (s: TrackedShow) => TrackedShow) =>
      setShows((prev) => prev.map((s) => (s.id === id ? fn(s) : s)))

    return {
      shows,
      isTracked: (id) => shows.some((s) => s.id === id),
      getShow: (id) => shows.find((s) => s.id === id),
      addShow: (show, status = 'plan') =>
        setShows((prev) =>
          prev.some((s) => s.id === show.id)
            ? prev
            : [
                {
                  id: show.id,
                  name: show.name,
                  poster_path: show.poster_path,
                  first_air_date: show.first_air_date,
                  status,
                  addedAt: Date.now(),
                  watched: [],
                },
                ...prev,
              ],
        ),
      removeShow: (id) => setShows((prev) => prev.filter((s) => s.id !== id)),
      setStatus: (id, status) => update(id, (s) => ({ ...s, status })),
      toggleEpisode: (id, season, episode) =>
        update(id, (s) => {
          const key = episodeKey(season, episode)
          const watched = s.watched.includes(key)
            ? s.watched.filter((k) => k !== key)
            : [...s.watched, key]
          return { ...s, watched }
        }),
      setSeasonWatched: (id, keys, watched) =>
        update(id, (s) => {
          const set = new Set(s.watched)
          for (const k of keys) watched ? set.add(k) : set.delete(k)
          return { ...s, watched: [...set] }
        }),
    }
  }, [shows])

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}

export function useLibrary() {
  const ctx = useContext(LibraryContext)
  if (!ctx) throw new Error('useLibrary must be used within a LibraryProvider')
  return ctx
}
