provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}

# Core Service APIs
locals {
  services = [
    "run.googleapis.com",
    "firebase.googleapis.com",
    "firebasehosting.googleapis.com",
    "artifactregistry.googleapis.com",
    "secretmanager.googleapis.com",
    "cloudbuild.googleapis.com",
    "monitoring.googleapis.com",
    "logging.googleapis.com",
  ]
}

resource "google_project_service" "enabled_services" {
  for_each                   = toset(local.services)
  project                    = var.project_id
  service                    = each.key
  disable_on_destroy         = false
  disable_dependent_services = false
}

# Security Module: IAM, KMS, Security Policies
module "security" {
  source     = "./modules/security"
  project_id = var.project_id
  depends_on = [google_project_service.enabled_services]
}

# Stateful Module: Secrets, Storage, Database, Cache
module "stateful" {
  source     = "./modules/stateful"
  project_id = var.project_id
  region     = var.region
  depends_on = [google_project_service.enabled_services]
}

# Stateless Module: Cloud Run Compute, Firebase Hosting Ingress, Autoscaling
module "stateless" {
  source                 = "./modules/stateless"
  project_id             = var.project_id
  region                 = var.region
  environment            = var.environment
  container_image        = var.container_image
  service_port           = var.service_port
  min_instances          = var.min_instances
  max_instances          = var.max_instances
  cpu_limit              = var.cpu_limit
  memory_limit           = var.memory_limit
  service_account_email  = module.security.service_account_email
  auth_secret_id         = module.stateful.auth_secret_id
  depends_on             = [google_project_service.enabled_services, module.security, module.stateful]
}
