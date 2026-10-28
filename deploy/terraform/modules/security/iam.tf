resource "google_service_account" "web_app_sa" {
  project      = var.project_id
  account_id   = "sa-web-app"
  display_name = "LLM Obs Web App Runtime Service Account"
  description  = "Dedicated least-privilege service account for web-app Cloud Run workloads"
}

# Grant Secret Manager Access
resource "google_project_iam_member" "secret_accessor" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.web_app_sa.email}"
}

# Grant Cloud Logging Writer
resource "google_project_iam_member" "log_writer" {
  project = var.project_id
  role    = "roles/logging.logWriter"
  member  = "serviceAccount:${google_service_account.web_app_sa.email}"
}

# Grant Cloud Monitoring Metric Writer
resource "google_project_iam_member" "metric_writer" {
  project = var.project_id
  role    = "roles/monitoring.metricWriter"
  member  = "serviceAccount:${google_service_account.web_app_sa.email}"
}

# Grant Cloud Trace Agent
resource "google_project_iam_member" "trace_agent" {
  project = var.project_id
  role    = "roles/cloudtrace.agent"
  member  = "serviceAccount:${google_service_account.web_app_sa.email}"
}
