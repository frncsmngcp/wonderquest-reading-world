#!/bin/sh
set -eu
cd "$(dirname "$0")"
for f in index.html manifest.webmanifest service-worker.js offline.html shared/pwa-compat.js shared/pwa-register.js \
 modules/awad.html modules/basa-tayo.html modules/kuwento-tayo.html modules/fluency-pyramid.html modules/basa-bata-basa.html modules/letter-slide.html \
 icons/icon-192.png icons/icon-512.png icons/apple-touch-icon.png; do
  test -s "$f" || { echo "MISSING: $f"; exit 1; }
done
! grep -q "const APP_PAYLOADS" index.html || { echo "FAIL: giant embedded payloads remain"; exit 1; }
! grep -q 'doc.write("<!doctype html><html><body>' index.html || { echo "FAIL: malformed nested script remains"; exit 1; }
grep -q "manifest.webmanifest" index.html
grep -q "./shared/pwa-register.js" index.html
grep -q "serviceWorker.register" shared/pwa-register.js
grep -q "iPad/iPhone gesture bridge" shared/pwa-compat.js
grep -q "./modules/awad.html" index.html
grep -q "teacher-francis-suite-home" modules/awad.html
grep -q "teacher-francis-suite-home" modules/basa-tayo.html
echo "Reading World PWA v1.1 structure + iPad touch fix verified."
