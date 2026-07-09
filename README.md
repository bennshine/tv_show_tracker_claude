# twee-web

A TV show tracker for the web — search shows, track watched episodes, organize a
watchlist, and see upcoming air dates. A web port of the TWEE Android app concept.

Built with **React + Vite + TypeScript**, powered by the **TMDB API**. Your library is
stored locally in the browser (`localStorage`), so no account or backend is required.

## Features

- 🔍 **Search & add shows** — live search against The Movie Database
- ✅ **Track watched episodes** — per-episode checkboxes, mark whole seasons at once
- 🗂️ **Watchlist & status** — categorize shows as _Watching_, _Plan to watch_, or _Completed_
- 📅 **Airing calendar** — upcoming episodes for the shows you follow

## Getting started

```bash
npm install
cp .env.example .env   # then paste your TMDB API key
npm run dev
```

Get a free TMDB API key at <https://www.themoviedb.org/settings/api> (use the v3 "API Key").

### Scripts

| Command           | Description                    |
| ----------------- | ----------------------------- |
| `npm run dev`     | Start the dev server          |
| `npm run build`   | Type-check and build for prod |
| `npm run preview` | Preview the production build  |
| `npm run lint`    | Lint the source               |

## Data & privacy

All tracking data lives in your browser's `localStorage` under `twee-web.library.v1`.
Clearing site data resets your library.

## Attribution

This product uses the TMDB API but is not endorsed or certified by
[TMDB](https://www.themoviedb.org/).

## License

MIT
