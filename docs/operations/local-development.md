# Local Development

## Ohne Docker

1. `cp .env.example .env` bei Bedarf
2. `cd api && npm install && npm run dev`
3. `cd frontend && npm install && npm run dev`

## Mit Docker Compose

1. `docker compose -f docker/compose/docker-compose.yml up --build`
2. Frontend: `http://localhost:5173`
3. API: `http://localhost:3001/api/v1/health`
4. Code unter `api/` und `frontend/` ist per Bind-Mount eingebunden
5. API reloadet via `nodemon`, Frontend via Vite-HMR

## Live-Daten

Die App nutzt aktuell zwei Provider:

- `TWELVEDATA_API_KEY`
- `EODHD_API_KEY`

Wichtig:

- fuer deutsche / europaeische Werte wird aktuell bevorzugt `EODHD` genutzt
- Markt-Quotes und Serien koennen aus lokalem SQLite-Cache kommen
- bei Debugging von Provider-Problemen kann `MARKET_CACHE_ENABLED=false` hilfreich sein
