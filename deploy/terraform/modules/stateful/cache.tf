# Memorystore Redis instance placeholder (standard tier / disabled in basic dev to avoid cost)
# Uncomment when dedicated VPC and caching tier are required:
# resource "google_redis_instance" "cache" {
#   project        = var.project_id
#   name           = "web-app-cache"
#   tier           = "BASIC"
#   memory_size_gb = 1
#   region         = var.region
# }
