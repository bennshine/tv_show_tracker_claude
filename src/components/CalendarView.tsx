import { useEffect, useState } from 'react'
import { getShow, IMG } from '../api/tmdb'
import { useLibrary } from '../store/library'

interface Upcoming {
  showId: number
  showName: string
  poster_path: string | null
  episodeName: string
  season: number
  episode: number
  airDate: string
}

export function CalendarView({ onOpen }: { onOpen: (id: number) => void }) {
  const { shows } = useLibrary()
  const [items, setItems] = useState<Upcoming[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    if (shows.length === 0) {
      setItems([])
      return
    }
    setItems(null)
    Promise.all(
      shows.map(async (s) => {
        try {
          const full = await getShow(s.id)
          const next = full.next_episode_to_air
          if (!next?.air_date) return null
          return {
            showId: s.id,
            showName: s.name,
            poster_path: s.poster_path,
            episodeName: next.name,
            season: next.season_number,
            episode: next.episode_number,
            airDate: next.air_date,
          } satisfies Upcoming
        } catch {
          return null
        }
      }),
    )
      .then((results) => {
        if (!active) return
        const upcoming = results
          .filter((r): r is Upcoming => r !== null)
          .sort((a, b) => a.airDate.localeCompare(b.airDate))
        setItems(upcoming)
      })
      .catch((e) => active && setError(e instanceof Error ? e.message : 'Failed to load'))
    return () => {
      active = false
    }
  }, [shows])

  if (shows.length === 0) {
    return <p className="muted empty">Add shows to see their upcoming episodes here.</p>
  }
  if (error) return <p className="error">{error}</p>
  if (!items) return <p className="muted">Loading schedule…</p>
  if (items.length === 0) {
    return <p className="muted empty">No upcoming episodes announced for your shows.</p>
  }

  return (
    <section className="calendar">
      {items.map((item) => (
        <button
          className="cal-row"
          key={item.showId}
          onClick={() => onOpen(item.showId)}
        >
          <span className="cal-date">{formatDate(item.airDate)}</span>
          {IMG.poster(item.poster_path, 'w185') && (
            <img className="cal-poster" src={IMG.poster(item.poster_path, 'w185')!} alt="" />
          )}
          <span className="cal-info">
            <strong>{item.showName}</strong>
            <span className="muted">
              S{item.season}E{item.episode} · {item.episodeName}
            </span>
          </span>
        </button>
      ))}
    </section>
  )
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}
