import { useState } from 'react'
import { LibraryProvider } from './store/library'
import { SearchView } from './components/SearchView'
import { LibraryView } from './components/LibraryView'
import { CalendarView } from './components/CalendarView'
import { ShowDetail } from './components/ShowDetail'
import { SettingsView } from './components/SettingsView'
import { hasApiKey } from './api/key'
import './App.css'

type Tab = 'library' | 'search' | 'calendar' | 'settings'

export default function App() {
  const [tab, setTab] = useState<Tab>(hasApiKey() ? 'library' : 'settings')
  const [openShowId, setOpenShowId] = useState<number | null>(null)
  // Bumped when the API key is saved, to remount data views so they refetch.
  const [keyVersion, setKeyVersion] = useState(0)

  return (
    <LibraryProvider>
      <div className="app">
        <header className="topbar">
          <h1 className="logo">
            twee<span className="logo-dot">•</span>
          </h1>
          <nav className="tabs">
            {(['library', 'search', 'calendar', 'settings'] as Tab[]).map((t) => (
              <button
                key={t}
                className={`tab ${tab === t && openShowId === null ? 'tab-active' : ''}`}
                onClick={() => {
                  setTab(t)
                  setOpenShowId(null)
                }}
              >
                {t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
          </nav>
        </header>

        {!hasApiKey() && tab !== 'settings' && (
          <div className="banner">
            No TMDB API key set.{' '}
            <button className="link-btn" onClick={() => setTab('settings')}>
              Add your key in Settings
            </button>{' '}
            to start tracking shows.
          </div>
        )}

        <main className="content" key={keyVersion}>
          {openShowId !== null ? (
            <ShowDetail id={openShowId} onBack={() => setOpenShowId(null)} />
          ) : tab === 'settings' ? (
            <SettingsView onSaved={() => setKeyVersion((v) => v + 1)} />
          ) : tab === 'library' ? (
            <LibraryView onOpen={setOpenShowId} />
          ) : tab === 'search' ? (
            <SearchView onOpen={setOpenShowId} />
          ) : (
            <CalendarView onOpen={setOpenShowId} />
          )}
        </main>

        <footer className="footer muted">
          Data from{' '}
          <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">
            The Movie Database (TMDB)
          </a>
        </footer>
      </div>
    </LibraryProvider>
  )
}
