# Concrete Product Plan

Stand: 2026-06-04

## Status

Dieser Plan ersetzt die frueheren breiten Zielbilder als aktueller Arbeitsplan.

Die frueheren Dokumente bleiben als historische Referenz erhalten:

- `archiv/MVP_BUILD_PLAN.md`
- `archiv/OPENCLAW_STOCK_APP_BLUEPRINT.md`
- `archiv/SERIOUS_SOURCES_STACK.md`

## Aktuelles Produktkonzept

Die App ist aktuell kein allgemeines Research- oder Trading-System, sondern ein lokaler Workflow fuer:

1. Watchlist pflegen
2. pro Instrument mehrere `Ideas` erfassen
3. Ideas spaeter automatisch oder manuell auswerten
4. Ergebnisse als `Runs` und `Outcomes` sichtbar machen

Kurzform:

`Watchlist -> Ideas -> Runs -> Outcomes -> spaeter Reviews`

## Kernobjekte

### Watchlist

Ein beobachtetes Papier.

Relevante Felder:

- `ticker`
- `quoteSymbol`
- `exchange`
- `assetType`
- `companyName`
- `wkn`
- `isin`
- `sortOrder`
- `archivedAt`

### Idea

Eine konkrete, ausfuehrbare Beobachtungs- oder Investment-Idee fuer genau ein Watchlist-Papier.

Relevante Felder:

- `watchlistItemId`
- `title`
- `objective`
- `status`
- `startDate`
- `endDate`

Bedeutung:

- `objective` ist faktisch ein Prompt oder Arbeitsauftrag fuer spaetere Agenten
- `status` steuert, ob die Idea aktiv, pausiert oder nur als Entwurf vorhanden ist

### Template

Eine wiederverwendbare Prompt-Vorlage fuer neue Ideas.

Zweck:

- schnellere Erfassung
- konsistentere Qualitaet
- weniger freie Formulierungsarbeit

### Idea Run

Noch nicht umgesetzt.

Ein einzelner Ausfuehrungslauf einer Idea.

Spaetere Felder:

- `ideaId`
- `executedAt`
- `resultSummary`
- `outcomeValue`
- `status`
- `sourceSnapshot`

## Bereits umgesetzt

- lokale Watchlist mit Sortierung und Archiv
- Live-Marktdaten fuer Watchlist und Dashboard
- modulare Provider-Adapter (`TwelveData`, `EODHD`)
- lokaler SQLite-Cache fuer Markt-Quotes und Serien
- mehrere Ideas pro Watchlist-Instrument
- Editieren von Ideas
- Statussteuerung von Ideas im UI
- Templates-Seite mit kopierbaren Prompt-Vorlagen

## Noch nicht umgesetzt

- echte `Idea Runs`
- echte Outcome-Berechnung
- historische Bewertung auf Basis eines Startdatums
- Cron-/Agenten-Ausfuehrung
- Review-Schicht

## Produktregeln

- Watchlist ist die Ausgangsbasis fuer alle spaeteren Auswertungen.
- Eine Idea gehoert immer zu genau einem Watchlist-Instrument.
- Nur `active` Ideas duerfen spaeter automatisch laufen.
- `paused` Ideas bleiben sichtbar, laufen aber nicht.
- `draft` Ideas sind konzeptionell vorhanden, aber noch nicht operational.
- Outcome-Werte duerfen nie halluziniert werden.

## Naechste sinnvolle Schritte

### 1. Idea Runs

Als naechstes sollte eine echte `idea_runs`-Struktur gebaut werden.

Ziel:

- jede Ausfuehrung nachvollziehbar speichern
- nicht nur den letzten Zustand kennen

### 2. Outcome Engine

Erste einfache Logik:

- historischer Einstieg ueber `startDate`
- einfacher Buy-and-hold-Fall
- Vergleich mit aktuellem Wert

### 3. Historische Daten

Gezielte historische Preisabfrage pro Instrument und Datum.

Ziel:

- aus einer Idea mit Startdatum ein echtes Ergebnis machen

### 4. Cron fuer aktive Ideas

Nur aktive Ideas sollen spaeter regelmaessig laufen.

### 5. Reviews

Leichte Rueckkopplungsschicht pro Idea:

- worked
- not worked
- inconclusive

## Nicht mehr primaerer Fokus

Diese Themen bleiben moeglich, sind aber nicht mehr die erste Bauachse:

- vollstaendige Research-Memo-Architektur
- sofortiges Paper-Trading-Modul
- breiter Truth-Layer mit SEC/IR in v0.1
- Claw/OpenClaw-inspirierte Gesamtarchitektur als Hauptzielbild

## Arbeitsprioritaet

Wenn direkt weitergebaut wird, ist die beste Reihenfolge:

1. `idea_runs`
2. echte Outcome-Berechnung
3. historische Preislogik
4. Cron fuer aktive Ideas
5. spaeter Reviews
