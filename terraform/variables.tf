variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-central-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "edurev-rwanda"
}

# VPC and Network Configuration
variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.11.0/24"]
}

variable "availability_zones" {
  description = "Availability zones to use"
  type        = list(string)
  default     = ["eu-central-1a", "eu-central-1b"]
}

# Bastion Host Configuration
variable "bastion_instance_type" {
  description = "Instance type for bastion host"
  type        = string
  default     = "t3.micro"
}

variable "bastion_ami_name" {
  description = "AMI name filter for bastion (Amazon Linux 2)"
  type        = string
  default     = "amzn2-ami-hvm-*-x86_64-gp2"
}

variable "allowed_ssh_cidrs" {
  description = "CIDR blocks allowed for SSH to bastion"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

# Application EC2 Configuration
variable "app_instance_type" {
  description = "Instance type for application server"
  type        = string
  default     = "t3.medium"
}

variable "app_instance_count" {
  description = "Number of application instances"
  type        = number
  default     = 2
}

# RDS Database Configuration
variable "db_instance_class" {
  description = "Database instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "Allocated storage for database in GB"
  type        = number
  default     = 20
}

variable "db_engine_version" {
  description = "PostgreSQL version"
  type        = string
  default     = "17.1"
}

variable "db_name" {
  description = "Initial database name"
  type        = string
  default     = "edurev_rwanda"
  sensitive   = true
}

variable "db_username" {
  description = "Database master username"
  type        = string
  default     = "edurev"
  sensitive   = true
}

variable "db_password" {
  description = "Database master password"
  type        = string
  sensitive   = true
  validation {
    condition     = length(var.db_password) >= 8
    error_message = "Database password must be at least 8 characters long."
  }
}

variable "db_backup_retention_days" {
  description = "Number of days to retain backups"
  type        = number
  default     = 7
}

variable "db_multi_az" {
  description = "Enable Multi-AZ deployment for RDS"
  type        = bool
  default     = true
}

# ECR Configuration
variable "ecr_image_tag_mutability" {
  description = "Mutability setting for ECR images"
  type        = string
  default     = "MUTABLE"
}

variable "ecr_scan_on_push" {
  description = "Enable image scanning on push"
  type        = bool
  default     = true
}

# Application Configuration
variable "jwt_secret" {
  description = "JWT secret for application"
  type        = string
  sensitive   = true
  validation {
    condition     = length(var.jwt_secret) >= 16
    error_message = "JWT secret must be at least 16 characters long."
  }
}

variable "backend_cors_origin" {
  description = "CORS origin for backend"
  type        = string
  default     = "*"
}

variable "enable_https" {
  description = "Enable HTTPS with ACM certificate"
  type        = bool
  default     = false
}

variable "certificate_arn" {
  description = "ARN of ACM certificate for HTTPS"
  type        = string
  default     = ""
}

# Tagging
variable "tags" {
  description = "Additional tags for resources"
  type        = map(string)
  default     = {}
}
