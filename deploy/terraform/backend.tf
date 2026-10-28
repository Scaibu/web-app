terraform {
  backend "gcs" {
    bucket = "llm-obs-web-app-9664-tfstate"
    prefix = "web-app/state"
  }
}
