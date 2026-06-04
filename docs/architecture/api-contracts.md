# API Contracts

## Health

- `GET /api/v1/health`

## Market

- `GET /api/v1/market/overview?symbol=AAPL`
- `GET /api/v1/market/watchlist`

## Watchlist

- `GET /api/v1/watchlist`
- `POST /api/v1/watchlist`
- `POST /api/v1/watchlist/:id/move-to-top`
- `POST /api/v1/watchlist/:id/active`
- `DELETE /api/v1/watchlist/:id`

## Ideas

- `GET /api/v1/ideas`
- `POST /api/v1/ideas`
- `PUT /api/v1/ideas/:id`
