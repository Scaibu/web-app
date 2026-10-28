output "cloud_run_url" {
  description = "Direct Cloud Run service URL"
  value       = google_cloud_run_v2_service.web_app.uri
}

output "firebase_hosting_url" {
  description = "Firebase Hosting canonical URL"
  value       = "https://${var.project_id}.web.app"
}
