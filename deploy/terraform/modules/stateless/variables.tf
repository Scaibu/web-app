variable "project_id" {
  type = string
}

variable "region" {
  type = string
}

variable "environment" {
  type = string
}

variable "container_image" {
  type = string
}

variable "service_port" {
  type = number
}

variable "min_instances" {
  type = number
}

variable "max_instances" {
  type = number
}

variable "cpu_limit" {
  type = string
}

variable "memory_limit" {
  type = string
}

variable "service_account_email" {
  type = string
}

variable "auth_secret_id" {
  type = string
}
