#!/usr/bin/env bash
set -euo pipefail

PREVIOUS_ENV="/var/lib/deploy/web-app-previous.env"
if [ ! -f "$PREVIOUS_ENV" ]; then
  echo "Error: No previous environment record found at $PREVIOUS_ENV" >&2
  exit 1
fi

source "$PREVIOUS_ENV"
echo "Rolling back web-app to ${PREVIOUS_APP_DIGEST}..."
docker compose -f deploy/docker/compose/docker-compose.single.yml up -d --wait web-app
echo "Rollback completed."
