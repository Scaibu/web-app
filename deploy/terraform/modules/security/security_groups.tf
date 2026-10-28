# Cloud Armor / Network Security Ingress Policy placeholder
resource "google_compute_security_policy" "web_app_policy" {
  project     = var.project_id
  name        = "web-app-security-policy"
  description = "Basic WAF/DDoS rate limiting policy for web-app endpoints"

  rule {
    action   = "allow"
    priority = "2147483647"
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["*"]
      }
    }
    description = "Default allow"
  }
}
