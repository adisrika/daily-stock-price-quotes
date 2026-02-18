#!/usr/bin/env bash
# Push secrets from .env to GitHub Actions (repo secrets). Run from repo root.
# Requires: gh CLI installed and logged in (gh auth login).
set -e
cd "$(dirname "$0")/.."
if [[ ! -f .env ]]; then
  echo "No .env found. Create .env with ALPHA_VANTAGE_API_KEY, TWILIO_*, MY_PHONE_NUMBER, etc."
  exit 1
fi
echo "Setting GitHub Actions secrets from .env..."
export $(grep -v '^#' .env | xargs)
for name in ALPHA_VANTAGE_API_KEY TWILIO_ACCOUNT_SID TWILIO_AUTH_TOKEN TWILIO_PHONE_NUMBER MY_PHONE_NUMBER; do
  val="${!name}"
  if [[ -z "$val" ]]; then echo "Skip $name (empty)"; continue; fi
  echo "$val" | gh secret set "$name"
  echo "Set $name"
done
if [[ -n "$DELIVERY_MODE" ]]; then echo "$DELIVERY_MODE" | gh secret set DELIVERY_MODE; echo "Set DELIVERY_MODE"; fi
if [[ -n "$STOCK_SYMBOLS" ]]; then echo "$STOCK_SYMBOLS" | gh secret set STOCK_SYMBOLS; echo "Set STOCK_SYMBOLS"; fi
echo "Done. Trigger the workflow from Actions → Daily Stock Quotes → Run workflow."
