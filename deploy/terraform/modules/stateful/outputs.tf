output "auth_secret_id" {
  description = "Secret Manager secret ID for AUTH_SECRET"
  value       = google_secret_manager_secret.auth_secret.secret_id
}

output "assets_bucket_name" {
  description = "GCS bucket name for web-app static assets"
  value       = google_storage_bucket.web_app_assets.name
}
