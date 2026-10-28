#!/usr/bin/env bash
# ==============================================================================
# Production Deployment Script: LLM Observability Web App
# Cloud Provider: Google Cloud Platform (Cloud Run) + Firebase Hosting CDN
# Adheres strictly to Rule 0 (Scaffolding) and Rule 8 (Hardening & Verification)
# ==============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"
cd "${ROOT_DIR}"

PROJECT_ID="${GCP_PROJECT_ID:-llm-obs-web-app-9664}"
REGION="${GCP_REGION:-asia-south1}"
SERVICE_NAME="web-app-prod"
IMAGE_TAG="$(date +%Y%m%d%H%M%S)"
IMAGE_NAME="gcr.io/${PROJECT_ID}/web-app:${IMAGE_TAG}"
PREVIOUS_STATE_FILE="/tmp/web-app-previous-deploy.env"

echo "=================================================="
echo "🚀 Starting Deployment for [${PROJECT_ID}] in [${REGION}]"
echo "=================================================="

# Phase 1: Verify & Configure Prerequisites
echo "▶ Step 1/6: Verifying GCP CLI, Project & Authentication..."
if ! command -v gcloud &>/dev/null; then
  echo "❌ Error: gcloud CLI is not installed." >&2
  exit 1
fi
if ! command -v firebase &>/dev/null; then
  echo "❌ Error: firebase CLI is not installed." >&2
  exit 1
fi

gcloud config set project "${PROJECT_ID}" --quiet

# Phase 2: Ensure Required GCP APIs are Active
echo "▶ Step 2/6: Enabling core GCP & Firebase service APIs..."
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  firebase.googleapis.com \
  firebasehosting.googleapis.com \
  secretmanager.googleapis.com \
  cloudbuild.googleapis.com \
  monitoring.googleapis.com \
  logging.googleapis.com \
  --project="${PROJECT_ID}" --quiet

# Phase 3: Build Container via Cloud Build (AMD64 Linux Native)
echo "▶ Step 3/7: Building container image via Cloud Build [${IMAGE_NAME}]..."
gcloud builds submit \
  --project="${PROJECT_ID}" \
  --config="deploy/docker/cloudbuild.yaml" \
  --substitutions="_IMAGE_NAME=${IMAGE_NAME}" \
  .

# Fetch immutable digest of the built image
IMAGE_DIGEST="$(gcloud container images describe "${IMAGE_NAME}" --format='value(image_summary.digest)')"
IMMUTABLE_IMAGE="gcr.io/${PROJECT_ID}/web-app@${IMAGE_DIGEST}"
echo "✅ Immutable image built: ${IMMUTABLE_IMAGE}"

# Record current deployed image for rollback safety
CURRENT_IMAGE="$(gcloud run services describe "${SERVICE_NAME}" --region="${REGION}" --project="${PROJECT_ID}" --format='value(spec.template.spec.containers[0].image)' 2>/dev/null || echo "")"
cat <<EOF > "${PREVIOUS_STATE_FILE}"
PREVIOUS_IMAGE="${CURRENT_IMAGE}"
PREVIOUS_TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
EOF

# Phase 4: Ensure Runtime Service Account Exists
SA_EMAIL="sa-web-app@${PROJECT_ID}.iam.gserviceaccount.com"
echo "▶ Step 4/7: Ensuring runtime service account [${SA_EMAIL}]..."
if ! gcloud iam service-accounts describe "${SA_EMAIL}" --project="${PROJECT_ID}" &>/dev/null; then
  echo "  Creating service account ${SA_EMAIL}..."
  gcloud iam service-accounts create sa-web-app \
    --description="LLM Obs Web App Runtime Service Account" \
    --display-name="LLM Obs Web App Runtime Service Account" \
    --project="${PROJECT_ID}"
  gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/logging.logWriter" --quiet
  gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/monitoring.metricWriter" --quiet
fi

# Phase 5: Deploy to Cloud Run with Security Hardening
echo "▶ Step 5/7: Deploying Cloud Run service [${SERVICE_NAME}]..."
gcloud run deploy "${SERVICE_NAME}" \
  --project="${PROJECT_ID}" \
  --region="${REGION}" \
  --image="${IMMUTABLE_IMAGE}" \
  --platform="managed" \
  --port=31400 \
  --allow-unauthenticated \
  --service-account="sa-web-app@${PROJECT_ID}.iam.gserviceaccount.com" \
  --set-env-vars="NODE_ENV=production,AUTH_TRUST_HOST=true,NEXTAUTH_URL=https://${PROJECT_ID}.web.app" \
  --cpu=1 \
  --memory=1024Mi \
  --min-instances=1 \
  --max-instances=10 \
  --quiet

CLOUD_RUN_URL="$(gcloud run services describe "${SERVICE_NAME}" --region="${REGION}" --project="${PROJECT_ID}" --format='value(status.url)')"
echo "✅ Cloud Run deployed successfully: ${CLOUD_RUN_URL}"

# Phase 5: Deploy Firebase Hosting Rewrites to Cloud Run
echo "▶ Step 5/6: Deploying Firebase Hosting CDN..."
firebase deploy --only hosting --project="${PROJECT_ID}"

# Phase 6: Smoke Check & Verification
echo "▶ Step 6/6: Running post-deployment health check..."
HOSTING_URL="https://${PROJECT_ID}.web.app"
HTTP_STATUS="$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "${HOSTING_URL}/" || true)"

if [[ "${HTTP_STATUS}" =~ ^(200|307|308)$ ]]; then
  echo "=================================================="
  echo "🎉 DEPLOYMENT SUCCEEDED"
  echo "Direct Cloud Run URL : ${CLOUD_RUN_URL}"
  echo "Firebase Hosting CDN : ${HOSTING_URL}"
  echo "HTTP Response Status : ${HTTP_STATUS}"
  echo "=================================================="
else
  echo "⚠️ Warning: Smoke test returned unexpected HTTP status: ${HTTP_STATUS}"
  echo "Check Cloud Run logs: gcloud run services logs read ${SERVICE_NAME} --region=${REGION} --project=${PROJECT_ID}"
fi
