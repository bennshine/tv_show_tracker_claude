import { useState } from 'react'
import { LibraryProvider } from './store/library'
import { SearchView } from './components/SearchView'
import { LibraryView } from './components/LibraryView'
import { CalendarView } from './components/CalendarView'
import { ShowDetail } from './components/ShowDetail'
import './App.css'

type Tab = 'library' | 'search' | 'calendar'

export default function App() {
  const [tab, setTab] = useState<Tab>('library')
  const [openShowId, setOpenShowId] = useState<number | null>(null)

  return (
    <LibraryProvider>
      <div className="app">
        <header className="topbar">
          <h1 className="logo">
            twee<span className="logo-dot">•</span>
          </h1>
          <nav className="tabs">
            {(['library', 'search', 'calendar'] as Tab[]).map((t) => (
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

        <main className="content">
          {openShowId !== null ? (
            <ShowDetail id={openShowId} onBack={() => setOpenShowId(null)} />
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
