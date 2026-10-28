resource "random_password" "auth_secret" {
  length  = 32
  special = false
}

resource "google_secret_manager_secret" "auth_secret" {
  project   = var.project_id
  secret_id = "web-app-auth-secret"

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "auth_secret_v1" {
  secret      = google_secret_manager_secret.auth_secret.id
  secret_data = random_password.auth_secret.result
}
