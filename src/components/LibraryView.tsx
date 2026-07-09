import { useState } from 'react'
import type { WatchStatus } from '../types'
import { STATUS_LABELS } from '../types'
import { IMG } from '../api/tmdb'
import { useLibrary } from '../store/library'

const FILTERS: (WatchStatus | 'all')[] = ['all', 'watching', 'plan', 'completed']

export function LibraryView({ onOpen }: { onOpen: (id: number) => void }) {
  const { shows } = useLibrary()
  const [filter, setFilter] = useState<WatchStatus | 'all'>('all')

  const visible = shows.filter((s) => filter === 'all' || s.status === filter)

  if (shows.length === 0) {
    return (
      <p className="muted empty">
        Your library is empty. Head to <strong>Search</strong> to add some shows.
      </p>
    )
  }

  return (
    <section>
      <div className="filters">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`chip ${filter === f ? 'chip-active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : STATUS_LABELS[f]}
            <span className="chip-count">
              {f === 'all' ? shows.length : shows.filter((s) => s.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="muted">Nothing here yet.</p>
      ) : (
        <div className="grid">
          {visible.map((show) => {
            const poster = IMG.poster(show.poster_path)
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
                    {show.watched.length} episode{show.watched.length === 1 ? '' : 's'} watched
                  </p>
                  <span className={`badge status-${show.status}`}>
                    {STATUS_LABELS[show.status]}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
