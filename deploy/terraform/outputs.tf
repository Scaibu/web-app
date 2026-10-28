output "project_id" {
  description = "GCP Project ID"
  value       = var.project_id
}

output "cloud_run_url" {
  description = "Cloud Run service direct URL"
  value       = module.stateless.cloud_run_url
}

output "firebase_hosting_url" {
  description = "Firebase Hosting custom domain/default URL"
  value       = module.stateless.firebase_hosting_url
}

output "service_account_email" {
  description = "Dedicated runtime service account email"
  value       = module.security.service_account_email
}
