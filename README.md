# AI Broker

Lokales MVP fuer Aktienbeobachtung, Watchlists, Idea-Prompts und spaetere Simulations-Workflows.

## Stack

- Backend: Node.js, Hono, Zod, SQLite
- Frontend: React, Vite, Bootstrap 5, Recharts
- Runtime: Docker Compose

## Was bereits laeuft

- Health-Endpoint
- SQLite-basierte Watchlist
- Live-Marktdatenansicht mit Tageschart
- Watchlist mit Reihenfolge, Archiv und Live-Status
- persistente Ideas pro Watchlist-Wert
- Templates-Seite mit kopierbaren Prompt-Vorlagen

## Schnellstart

### Lokal

```bash
cd api
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

### Docker

```bash
docker compose -f docker/compose/docker-compose.yml up --build
```

Der Docker-Compose-Stack ist auf lokale Entwicklung ausgelegt:

- `api` laeuft mit `npm run dev` und `nodemon`
- `frontend` laeuft mit Vite-HMR
- `api/` und `frontend/` sind als Bind-Mounts eingebunden

## Wichtiger Hinweis zu Live-Daten

Die App nutzt modulare Provider:

- `TwelveData` fuer US-/Standardpfade
- `EODHD` fuer deutsche / europaeische Werte

Fuer sinnvolle Nutzung echte Keys in `.env` setzen:

```bash
TWELVEDATA_API_KEY=...
EODHD_API_KEY=...
```

## Provider-Architektur

Die Marktdaten sind jetzt als modulare Adapter aufgebaut:

- `TwelveData` fuer den bestehenden US-/Standardpfad
- `EODHD` als naechster europaeischer/deutscher Fallback

## Cache

Marktdaten werden jetzt zuerst aus lokalem SQLite-Cache gelesen.
Nur bei Cache-Miss oder abgelaufenem Eintrag wird ein externer Provider angefragt.

Konfigurierbar:

```bash
MARKET_CACHE_ENABLED=false
QUOTE_CACHE_TTL_SECONDS=900
SERIES_CACHE_TTL_SECONDS=21600
```

## Frontend-Module

- `Dashboard`
  - Live-Symbol
  - Trendchart
  - Watchlist-Top-Item als Default
- `Watchlist`
  - aktive / archivierte Positionen
  - direkte Verknuepfung zu Ideas
  - Idea-Editor mit Prompt, Start- und Enddatum
- `Templates`
  - kopierbare Prompt-Vorlagen fuer neue Ideas
