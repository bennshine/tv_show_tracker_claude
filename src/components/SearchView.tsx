import { useEffect, useState } from 'react'
import type { TmdbShow } from '../types'
import { searchShows, IMG } from '../api/tmdb'
import { useLibrary } from '../store/library'

export function SearchView({ onOpen }: { onOpen: (id: number) => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<TmdbShow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isTracked, addShow } = useLibrary()

  // Debounced search as the user types.
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setError(null)
      return
    }
    setLoading(true)
    const handle = setTimeout(async () => {
      try {
        setResults(await searchShows(query))
        setError(null)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Search failed')
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 350)
    return () => clearTimeout(handle)
  }, [query])

  return (
    <section>
      <input
        className="search-input"
        type="search"
        placeholder="Search for a TV show…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />

      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Searching…</p>}
      {!loading && query.trim() && results.length === 0 && !error && (
        <p className="muted">No shows found for “{query}”.</p>
      )}

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
    </section>
  )
}
