# Implementation Status

Stand: 2026-06-04

## Bereits umgesetzt

### Lokaler Stack

- Monorepo-Struktur mit `api/` und `frontend/`
- Docker-Compose-Setup fuer lokale Entwicklung
- API und Frontend mit Live-Reload im Container

### Backend

- `Node.js` + `Hono`
- `SQLite` mit Migrationsbasis
- Health-Endpoint
- Watchlist-API
- Idea-API
- Markt-Overview-API
- modulare Market-Data-Adapter

### Datenquellen

- `TwelveData` als Adapter
- `EODHD` als Adapter
- Provider-Routing nach Instrument / Exchange
- deutsche Werte und ETF-Quotes laufen aktuell ueber `EODHD`

### Cache

- lokaler SQLite-Cache fuer Markt-Quotes und Kursserien
- konfigurierbare TTLs
- `forceRefresh`-Pfad fuer frische Daten
- Cache kann per Env komplett deaktiviert werden
- defensiver Fallback bei Cache-Fehlern

### Watchlist

- Watchlist-Eintraege mit:
  - `ticker`
  - `quoteSymbol`
  - `exchange`
  - `assetType`
  - `companyName`
  - `wkn`
  - `isin`
  - `thesis`
- persistierte Reihenfolge via `sort_order`
- `move-to-top`
- Archivierung statt direktem Entfernen
- endgueltiges Loeschen nur fuer archivierte Eintraege
- verknuepfte Idea-IDs als Hex-Links in der Tabelle

### Ideas

- persistente Ideas getrennt von der Watchlist
- mehrere Ideas pro Watchlist-Wert
- Felder:
  - `watchlistItemId`
  - `title`
  - `objective`
  - `status`
  - `startDate`
  - `endDate`
- Editieren vorhandener Ideas
- Statuswechsel direkt in der Idea-Liste
- Hex-ID pro Idea mit Anker-Sprung (`#IDEA_XX`)
- Outcome-Wert im UI als Platzhalter, aktuell Fallback `0$`

### Templates

- eigene `Templates`-Seite im Frontend
- statische Prompt-Vorlagen fuer neue Ideas
- Copy-Button pro Vorlage

### Dashboard

- kein hart codiertes `AAPL` mehr als Default
- Dashboard nimmt den obersten aktiven Watchlist-Eintrag
- wenn keine Watchlist aktiv ist, entfallen Live-Symbol und Trend
- Symbolsuche per Ticker
- Live-Symbol kann direkt per Checkbox in die Watchlist aufgenommen oder archiviert werden

### Frontend / UI

- reduzierte Schwarz-auf-Hellgrau-Oberflaeche
- Dashboard mit:
  - Live-Symbol
  - Preis / Tagesdaten
  - Trendchart
  - Cache-Zeit
  - Reload-Button
- Watchlist mit:
  - kleinerer Tabellenoptik
  - Provider-Anzeige
  - Exchange-Anzeige
  - Cache-Zeit je Statuszelle
  - Archiv-Box
- Idea-Liste mit:
  - Edit-Icon
  - Status-Icons fuer `active`, `paused`, `draft`
  - Firmenname direkt neben Ticker
  - gruenem Outcome-Wert
  - Font-Awesome-Icons
- neue `Templates`-Navigation neben `Dashboard` und `Watchlist`

## Noch nicht umgesetzt

### Truth Layer

- keine SEC- oder IR-Anbindung
- keine Quellenreferenzen fuer Investment-Aussagen

### Research Layer

- keine Research-Memos
- keine strukturierten Thesen, Risiken, Katalysatoren oder Szenarien

### Simulation Layer

- keine Paper-Trades
- kein PnL / Benchmark / Journal
- keine echte Outcome-Berechnung fuer Ideas
- keine historischen Idea-Runs

### Review Layer

- keine Reviews
- kein Scoreboard
- kein Mistake Log

## Aktuelle Einordnung

Der Ist-Zustand eignet sich bereits fuer:

- lokales Beobachten von Aktien und ETF
- geordnete Watchlist-Pflege
- Preis- und Trendbeobachtung
- erste disziplinierte Priorisierung von Positionen
- manuelles Erfassen und Verwalten mehrerer Ideas pro Instrument
- Wiederverwendung von Prompt-Templates

Der Ist-Zustand ist noch nicht bei:

- systematischer Research-Dokumentation
- Test-Investments
- Rueckkopplungs- und Lernschleife

## Naechste fachlich sinnvolle Schritte

1. echte Idea-Outcome-Berechnung
2. Idea-Run-Historie / Cron-Ausfuehrung
3. Paper-Trade-Modul
4. Review-/Scoreboard-Modul
5. spaeter Truth-Layer mit SEC / IR
