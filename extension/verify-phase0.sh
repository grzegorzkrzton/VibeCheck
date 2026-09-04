#!/usr/bin/env sh
# Run from the extension/ folder before loading unpacked in Chrome.
set -e
cd "$(dirname "$0")"

missing=0
for file in manifest.json visbug.js toolbar/bundle.css toolbar/bundle.min.js toolbar/inject.js; do
  if [ ! -f "$file" ]; then
    echo "MISSING: $file"
    missing=1
  fi
done

if [ "$missing" -eq 1 ]; then
  echo ""
  echo "Fix: from the repo root run  npm install && npm run extension:build"
  echo "Then load unpacked using THIS extension/ folder in chrome://extensions"
  exit 1
fi

echo "OK — load this VibeCheck extension folder in Chrome: $(pwd)"
