resource "google_storage_bucket" "web_app_assets" {
  project                     = var.project_id
  name                        = "${var.project_id}-assets"
  location                    = var.region
  uniform_bucket_level_access = true
  force_destroy               = false

  versioning {
    enabled = true
  }

  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}
