# AGENTS.md

Korean flashcard app. Two-tier layout:

- `app/` — React Native (Expo SDK 40) frontend, now TypeScript + axios.
- `api-go/` — Go/Gin backend.
- `db/` — MariaDB DDL (`create_tables.sql`) and a Node bulk-insert script (`insert.js`).

## Frontend (`app/`)

Run everything from the `app/` directory.

```bash
npm install
npm start                 # Expo dev server (Metro)
npm run web               # Web dev server
npx expo build:web        # Production static build → web-build/
npx tsc --noEmit          # Type check
```

Web-only local shortcut at repo root:

```bash
./start-web.sh            # start Go api (HTTP :8080 + HTTPS :8443), build & serve web via Go API
```

Key facts:
- API base URL is set in `app/Common.tsx`: `http://192.168.0.3:8080` in dev mode (`__DEV__`), `http://api.hitcard.kr:8080` in production builds.
- `start-web.sh` generates self-signed SSL certs in `certs/` and runs the Go API on **HTTPS :8443** alongside HTTP :8080.
- When TLS is enabled, the web frontend is served by the Go API itself (not a separate Python server). Access the app at `https://localhost:8443`.
- For production, replace the self-signed certs with real certificates from Let's Encrypt or a CA.
- Axios client (`apiClient`) sets `transformResponse: [(data) => data]` because the backend returns escaped JSON strings that are run through `jsonEscape()` before `JSON.parse()`.
- TypeScript is pinned to `~4.0.0` and axios to `^0.27.2` for Expo SDK 40 compatibility. Do not upgrade either without checking type-check.
- `db/insert.js` is a plain Node script, not part of the RN bundle; leave it as `.js`.

## Backend (`api-go/`)

Run from the `api-go/` directory.

```bash
go build -o hitcard-api .
./hitcard-api
```

Connection is configured via environment variables (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `PORT`) with sensible local defaults. See `.env.example`.

Optionally, set `TLS_PORT`, `TLS_CERT`, `TLS_KEY` for HTTPS support and `WEB_DIR` to serve the web frontend alongside the API.

## CLI (`hitcard`)

Build from `cli/`:

```bash
cd cli && go build -o ../hitcard .
```

Usage: `hitcard <entity> <action> [args]`

Entities: `user`, `ps` (problem-set), `cat` (category), `prob` (problem).

```bash
hitcard -h              # full help
hitcard -h user         # entity help
hitcard user list       # user의 SN, PW, introduction 출력
hitcard user get 1
hitcard user create '{"id":"new","pw":"1234","introduction":"hi"}'
hitcard user update 1 '{"id":"changed","pw":"newpw","introduction":"hi"}'
hitcard user delete 1
```

API 주소는 `HITCARD_API` 환경변수로 변경 가능 (기본값: `http://192.168.0.3:8080`).

## Database

1. Start MariaDB.
2. Run `db/create_tables.sql` to create `USER`, `PROBLEM_SET`, `CATEGORY`, `PROBLEM` tables.
3. (Optional) `node db/insert.js` bulk-loads sample Korean history cards.
