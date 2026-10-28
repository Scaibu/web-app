terraform {
  backend "s3" {
    bucket         = "scaibu-terraform-state"
    key            = "web-app/terraform.tfstate"
    region         = "ap-south-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}
