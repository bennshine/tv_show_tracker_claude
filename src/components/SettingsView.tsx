import { useState } from 'react'
import { getApiKey, setApiKey } from '../api/key'

export function SettingsView({ onSaved }: { onSaved: () => void }) {
  const [value, setValue] = useState(getApiKey())
  const [saved, setSaved] = useState(false)

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    setApiKey(value)
    setSaved(true)
    onSaved()
  }

  return (
    <section className="settings">
      <h2>Settings</h2>
      <form onSubmit={save}>
        <label className="field">
          <span>TMDB API key</span>
          <input
            type="password"
            className="search-input"
            placeholder="Paste your TMDB v3 API key"
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              setSaved(false)
            }}
            autoComplete="off"
          />
        </label>
        <div className="settings-actions">
          <button className="btn" type="submit">
            Save key
          </button>
          {saved && <span className="muted">✓ Saved</span>}
        </div>
      </form>

      <p className="muted settings-note">
        This app needs a free TMDB API key to fetch show data. Create one at{' '}
        <a
          href="https://www.themoviedb.org/settings/api"
          target="_blank"
          rel="noreferrer"
        >
          themoviedb.org/settings/api
        </a>{' '}
        (use the v3 “API Key”). It's stored only in <strong>your</strong> browser and never
        sent anywhere except TMDB.
      </p>
    </section>
  )
}
