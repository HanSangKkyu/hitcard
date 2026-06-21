#!/bin/bash
set -euo pipefail

API_PID=""

cleanup() {
  if [[ -n "$API_PID" ]] && kill -0 "$API_PID" 2>/dev/null; then
    echo "[start-web] stopping api (pid $API_PID)"
    kill "$API_PID" 2>/dev/null || true
    wait "$API_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

cd "$(dirname "$0")"

echo "[start-web] build go api"
cd api-go
go build -o hitcard-api .

echo "[start-web] start go api on :8080"
nohup ./hitcard-api > /tmp/hitcard-api.log 2>&1 &
API_PID=$!
cd ..

echo "[start-web] wait for api ready"
for i in {1..30}; do
  if curl -s http://localhost:8080/problem-set >/dev/null 2>&1; then
    echo "[start-web] api ready"
    break
  fi
  sleep 1
done

echo "[start-web] build web"
cd app
npm install
npx expo build:web

echo "[start-web] serve web on http://0.0.0.0:9876"
PORT="${PORT:-9876}"
if command -v python3 &> /dev/null; then
  python3 -m http.server "$PORT" --bind 0.0.0.0 --directory web-build
else
  npx serve -l "tcp://0.0.0.0:$PORT" web-build
fi
