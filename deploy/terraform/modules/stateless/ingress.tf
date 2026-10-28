# Firebase Hosting Site and Cloud Run Rewrite Configuration
resource "google_firebase_hosting_site" "web_app_site" {
  provider = google-beta
  project  = var.project_id
  site_id  = var.project_id
}

# Firebase Hosting Custom Domain / Release Configuration placeholder
# Traffic rewriting to the Cloud Run backend is handled via firebase.json in deploy.sh
