# System Overview

Das MVP trennt Frontend und Backend strikt:

- `api/`: Hono API mit SQLite-Persistenz und externem Markt-Adapter
- `frontend/`: React/Vite-Oberflaeche fuer Dashboard und Watchlist
- `data/sqlite/`: persistente lokale Datenbankdatei
- `docker/compose/`: Compose-Setup fuer lokale Ausfuehrung

Die Live-Daten laufen in v0.1 ueber einen austauschbaren `TwelveData`-Adapter.
Ohne eigenen API-Key startet die App mit `demo`, was fuer die mitgelieferte AAPL-Demo reicht.

