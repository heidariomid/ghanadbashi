#!/bin/bash
# shot.sh <url> <css-width> <css-height> <out.png>
# Headless Chrome screenshot helper. Chrome sometimes fails to exit after
# writing the file, so it is backgrounded and killed once the file appears.
set -u
URL="$1"; W="$2"; H="$3"; OUT="$4"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
mkdir -p "$(dirname "$OUT")"
rm -f "$OUT"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --no-first-run \
  --force-device-scale-factor=1 --virtual-time-budget=2500 \
  --window-size="$W,$H" --user-data-dir="${TMPDIR:-/tmp}/bakery-shot-profile" \
  --screenshot="$OUT" "$URL" >/dev/null 2>&1 &
PID=$!
for _ in $(seq 1 60); do
  if [ -s "$OUT" ]; then sleep 0.4; break; fi
  sleep 0.5
done
kill "$PID" >/dev/null 2>&1
wait "$PID" 2>/dev/null
if [ -s "$OUT" ]; then echo "ok $OUT"; else echo "failed $OUT"; exit 1; fi
