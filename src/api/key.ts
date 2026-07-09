const KEY_STORAGE = 'twee-web.tmdb_key'

/**
 * The TMDB API key. Priority:
 *  1. a key the visitor saved in Settings (localStorage) — used on the public site
 *  2. VITE_TMDB_API_KEY from .env — convenient for local development
 */
export function getApiKey(): string {
  return localStorage.getItem(KEY_STORAGE) || import.meta.env.VITE_TMDB_API_KEY || ''
}

export function setApiKey(value: string): void {
  const trimmed = value.trim()
  if (trimmed) localStorage.setItem(KEY_STORAGE, trimmed)
  else localStorage.removeItem(KEY_STORAGE)
}

export function hasApiKey(): boolean {
  return getApiKey().length > 0
}
