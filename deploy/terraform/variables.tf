variable "project_id" {
  description = "The GCP Project ID"
  type        = string
  default     = "llm-obs-web-app-9664"
}

variable "region" {
  description = "Primary GCP region for deployments"
  type        = string
  default     = "asia-south1"
}

variable "environment" {
  description = "Deployment environment name (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "container_image" {
  description = "Container image reference with immutable digest"
  type        = string
  default     = "gcr.io/llm-obs-web-app-9664/web-app:latest"
}

variable "service_port" {
  description = "Container service listening port"
  type        = number
  default     = 31400
}

variable "min_instances" {
  description = "Minimum Cloud Run instance count"
  type        = number
  default     = 0
}

variable "max_instances" {
  description = "Maximum Cloud Run instance count"
  type        = number
  default     = 10
}

variable "cpu_limit" {
  description = "CPU allocation for Cloud Run instance"
  type        = string
  default     = "1000m"
}

variable "memory_limit" {
  description = "Memory allocation for Cloud Run instance"
  type        = string
  default     = "1024Mi"
}
