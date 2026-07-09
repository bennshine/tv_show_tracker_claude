import { useEffect, useState } from 'react'
import type { TmdbShow, TmdbEpisode, WatchStatus } from '../types'
import { STATUS_LABELS, episodeKey } from '../types'
import { getShow, getSeasonEpisodes, IMG } from '../api/tmdb'
import { useLibrary } from '../store/library'

export function ShowDetail({ id, onBack }: { id: number; onBack: () => void }) {
  const { isTracked, getShow: getTracked, addShow, removeShow, setStatus } = useLibrary()
  const [show, setShow] = useState<TmdbShow | null>(null)
  const [error, setError] = useState<string | null>(null)
  const tracked = getTracked(id)

  useEffect(() => {
    let active = true
    getShow(id)
      .then((s) => active && setShow(s))
      .catch((e) => active && setError(e instanceof Error ? e.message : 'Failed to load'))
    return () => {
      active = false
    }
  }, [id])

  if (error) return <BackShell onBack={onBack}><p className="error">{error}</p></BackShell>
  if (!show) return <BackShell onBack={onBack}><p className="muted">Loading…</p></BackShell>

  const backdrop = IMG.backdrop(show.backdrop_path)
  const poster = IMG.poster(show.poster_path, 'w342')
  const seasons = (show.seasons ?? []).filter((s) => s.season_number > 0)

  return (
    <BackShell onBack={onBack}>
      <div className="detail-hero">
        {backdrop && (
          <div
            className="detail-hero-bg"
            style={{ backgroundImage: `url(${backdrop})` }}
          />
        )}
        <div className="detail-hero-content">
          {poster ? (
            <img className="detail-poster" src={poster} alt={show.name} />
          ) : (
            <div className="detail-poster poster-fallback">{show.name}</div>
          )}
          <div className="detail-meta">
            <h2>{show.name}</h2>
            <p className="detail-facts">
              {show.first_air_date?.slice(0, 4)} · {show.number_of_seasons} season
              {show.number_of_seasons === 1 ? '' : 's'}
              {show.vote_average ? ` · ★ ${show.vote_average.toFixed(1)}` : ''}
            </p>
            {tracked ? (
              <div className="detail-actions">
                <label>
                  Status{' '}
                  <select
                    value={tracked.status}
                    onChange={(e) => setStatus(id, e.target.value as WatchStatus)}
                  >
                    {(Object.keys(STATUS_LABELS) as WatchStatus[]).map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </label>
                <button className="btn btn-danger" onClick={() => removeShow(id)}>
                  Remove
                </button>
              </div>
            ) : (
              <button className="btn" onClick={() => addShow(show)}>
                + Add to library
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="overview">{show.overview || 'No description available.'}</p>

      {isTracked(id) ? (
        <div className="seasons">
          {seasons.map((s) => (
            <Season key={s.id} showId={id} seasonNumber={s.season_number} title={s.name} />
          ))}
        </div>
      ) : (
        <p className="muted">Add this show to track watched episodes.</p>
      )}
    </BackShell>
  )
}

function Season({
  showId,
  seasonNumber,
  title,
}: {
  showId: number
  seasonNumber: number
  title: string
}) {
  const { getShow, toggleEpisode, setSeasonWatched } = useLibrary()
  const [open, setOpen] = useState(false)
  const [episodes, setEpisodes] = useState<TmdbEpisode[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const tracked = getShow(showId)

  useEffect(() => {
    if (!open || episodes) return
    getSeasonEpisodes(showId, seasonNumber)
      .then(setEpisodes)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load episodes'))
  }, [open, episodes, showId, seasonNumber])

  const keys = episodes?.map((e) => episodeKey(e.season_number, e.episode_number)) ?? []
  const watchedCount = keys.filter((k) => tracked?.watched.includes(k)).length
  const allWatched = keys.length > 0 && watchedCount === keys.length

  return (
    <div className="season">
      <button className="season-head" onClick={() => setOpen((o) => !o)}>
        <span>{open ? '▾' : '▸'} {title}</span>
        {episodes && (
          <span className="muted">
            {watchedCount}/{episodes.length}
          </span>
        )}
      </button>

      {open && (
        <div className="season-body">
          {error && <p className="error">{error}</p>}
          {!episodes && !error && <p className="muted">Loading episodes…</p>}
          {episodes && (
            <>
              <button
                className="btn btn-sm"
                onClick={() => setSeasonWatched(showId, keys, !allWatched)}
              >
                {allWatched ? 'Unmark all' : 'Mark all watched'}
              </button>
              <ul className="episodes">
                {episodes.map((ep) => {
                  const key = episodeKey(ep.season_number, ep.episode_number)
                  const watched = tracked?.watched.includes(key) ?? false
                  return (
                    <li key={ep.id}>
                      <label className={watched ? 'ep watched' : 'ep'}>
                        <input
                          type="checkbox"
                          checked={watched}
                          onChange={() =>
                            toggleEpisode(showId, ep.season_number, ep.episode_number)
                          }
                        />
                        <span className="ep-num">E{ep.episode_number}</span>
                        <span className="ep-name">{ep.name}</span>
                        {ep.air_date && <span className="muted ep-date">{ep.air_date}</span>}
                      </label>
                    </li>
                  )
                })}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function BackShell({ onBack, children }: { onBack: () => void; children: React.ReactNode }) {
  return (
    <section>
      <button className="btn btn-ghost" onClick={onBack}>
        ← Back
      </button>
      {children}
    </section>
  )
}
