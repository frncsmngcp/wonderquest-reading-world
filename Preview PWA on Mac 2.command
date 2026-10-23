#!/bin/bash
set -e
cd "$(dirname "$0")"
PORT=8080
URL="http://localhost:${PORT}/"
( sleep 1; open "$URL" >/dev/null 2>&1 || true ) &
echo "Teacher Francis Reading World PWA preview"
echo "Open: $URL"
echo "Press Control-C to stop the preview server."
python3 -m http.server "$PORT"
