output "service_account_email" {
  description = "Cloud Run runtime service account email"
  value       = google_service_account.web_app_sa.email
}
