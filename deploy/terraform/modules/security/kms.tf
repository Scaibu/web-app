# KMS Key Ring & Cryptographic Key for application data protection
resource "google_kms_key_ring" "web_app_keyring" {
  project  = var.project_id
  name     = "web-app-keyring"
  location = "global"
}

resource "google_kms_crypto_key" "web_app_crypto_key" {
  name            = "web-app-key"
  key_ring        = google_kms_key_ring.web_app_keyring.id
  rotation_period = "7776000s" # 90 days

  lifecycle {
    prevent_destroy = false
  }
}
