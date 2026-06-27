#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"

# load .env files
if [ -f api-go/.env ]; then
  export $(grep -v '^\s*#' api-go/.env | xargs)
fi
if [ -f app/.env ]; then
  export $(grep -v '^\s*#' app/.env | xargs)
fi

# detect local IP
LOCAL_IP=$(ip -4 addr show | grep -oP 'inet \K192\.168\.[\d.]+' | head -1) || true

# HTTPS config (self-signed certs for local dev)
TLS_PORT="${TLS_PORT:-8443}"
TLS_DIR="$PWD/certs"
TLS_CERT="${TLS_DIR}/cert.pem"
TLS_KEY="${TLS_DIR}/key.pem"

if [ ! -f "$TLS_CERT" ] || [ ! -f "$TLS_KEY" ]; then
  echo "[start-web] generating self-signed SSL certificates"
  mkdir -p "$TLS_DIR"
  openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
    -keyout "$TLS_KEY" -out "$TLS_CERT" \
    -subj "/CN=${LOCAL_IP:-localhost}" \
    -addext "subjectAltName=DNS:localhost,IP:${LOCAL_IP:-127.0.0.1},IP:127.0.0.1" 2>&1
fi

# API URL for web build: prefer nginx HTTPS production URL, fall back to local HTTPS
if curl -so /dev/null https://hitcard.jiyulsangkyu.pics/ 2>/dev/null; then
  EXPO_PUBLIC_API_URL="https://hitcard.jiyulsangkyu.pics"
else
  EXPO_PUBLIC_API_URL="https://${LOCAL_IP:-localhost}:${TLS_PORT}"
fi
export EXPO_PUBLIC_API_URL

echo "[start-web] using API URL: $EXPO_PUBLIC_API_URL"

echo "[start-web] kill existing processes"
pkill -f "./hitcard-api" 2>/dev/null || true
sleep 1

echo "[start-web] build go api"
cd api-go
go build -o hitcard-api .
cd ..

echo "[start-web] build web"
cd app
npm install --legacy-peer-deps
# @babel/core v8 breaks react-native-gesture-handler; ensure v7
npm ls @babel/core 2>/dev/null | grep -q '@babel/core@8' && npm install @babel/core@^7.0.0 --legacy-peer-deps || true
EXPO_PUBLIC_API_URL="$EXPO_PUBLIC_API_URL" npx expo export -p web --output-dir web-build

echo "[start-web] patch viewport meta"
sed -i 's|<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"|<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no"|' web-build/index.html
cd ..

echo "[start-web] start go api (HTTP :8080 + HTTPS :${TLS_PORT})"
cd api-go
TLS_CERT="$TLS_CERT" TLS_KEY="$TLS_KEY" TLS_PORT="$TLS_PORT" WEB_DIR="$PWD/../app/web-build" nohup ./hitcard-api > /tmp/hitcard-api.log 2>&1 &
cd ..

echo "[start-web] wait for api ready"
for i in {1..30}; do
  if curl -s http://localhost:8080/problem-set >/dev/null 2>&1; then
    echo "[start-web] ready"
    break
  fi
  sleep 1
done

echo "[start-web] all processes running in background"
echo "  API (HTTP)       : http://localhost:8080"
echo "  API (HTTPS)      : https://localhost:${TLS_PORT}"
echo "  Web              : http://localhost:8080  (served by Go API, SPA)"
echo "  HTTPS (via nginx): https://hitcard.jiyulsangkyu.pics"
echo "  Web API target   : $EXPO_PUBLIC_API_URL"
