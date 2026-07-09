import { useEffect, useState } from 'react'
import type { TmdbShow } from '../types'
import { getTrending, IMG } from '../api/tmdb'
import { useLibrary } from '../store/library'

export function TrendingView({ onOpen }: { onOpen: (id: number) => void }) {
  const [window, setWindow] = useState<'day' | 'week'>('week')
  const [results, setResults] = useState<TmdbShow[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { isTracked, addShow } = useLibrary()

  useEffect(() => {
    let active = true
    setResults(null)
    setError(null)
    getTrending(window)
      .then((r) => active && setResults(r))
      .catch((e) => active && setError(e instanceof Error ? e.message : 'Failed to load'))
    return () => {
      active = false
    }
  }, [window])

  return (
    <section>
      <div className="filters">
        <button
          className={`chip ${window === 'day' ? 'chip-active' : ''}`}
          onClick={() => setWindow('day')}
        >
          Today
        </button>
        <button
          className={`chip ${window === 'week' ? 'chip-active' : ''}`}
          onClick={() => setWindow('week')}
        >
          This week
        </button>
      </div>

      {error && <p className="error">{error}</p>}
      {!results && !error && <p className="muted">Loading trending shows…</p>}

      {results && (
        <div className="grid">
          {results.map((show) => {
            const poster = IMG.poster(show.poster_path)
            const year = show.first_air_date?.slice(0, 4)
            return (
              <div className="card" key={show.id}>
                <button className="card-poster" onClick={() => onOpen(show.id)}>
                  {poster ? (
                    <img src={poster} alt={show.name} loading="lazy" />
                  ) : (
                    <div className="poster-fallback">{show.name}</div>
                  )}
                </button>
                <div className="card-body">
                  <h3 title={show.name}>{show.name}</h3>
                  <p className="muted">
                    {year || '—'}
                    {show.vote_average ? ` · ★ ${show.vote_average.toFixed(1)}` : ''}
                  </p>
                  {isTracked(show.id) ? (
                    <span className="badge">In library</span>
                  ) : (
                    <button className="btn" onClick={() => addShow(show)}>
                      + Add
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
