#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
PROJECT_NAME="${1:-skillunbound}"
if ! command -v node >/dev/null || ! command -v npm >/dev/null; then
  echo 'Please install Node.js and npm before continuing.' >&2
  exit 1
fi
echo 'Logging in to Cloudflare (browser authorization required)...'
npx wrangler login
echo 'Creating Pages project (if it already exists, creation may report an error).'
if ! npx wrangler pages project create "$PROJECT_NAME" --production-branch=main; then
  echo 'Project creation was unsuccessful or project already exists. Attempting deployment...'
fi
npx wrangler pages deploy . --project-name="$PROJECT_NAME" --branch=main
echo 'Done. Attach your purchased domain in Cloudflare Dashboard -> Workers & Pages -> project -> Custom domains.'
