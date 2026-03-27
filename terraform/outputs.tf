# VPC Outputs
output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "vpc_cidr_block" {
  description = "CIDR block of the VPC"
  value       = aws_vpc.main.cidr_block
}

# Subnet Outputs
output "public_subnet_ids" {
  description = "IDs of public subnets"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "IDs of private subnets"
  value       = aws_subnet.private[*].id
}

# Bastion Host Outputs
output "bastion_public_ip" {
  description = "Public IP address of bastion host"
  value       = aws_eip.bastion.public_ip
}

output "bastion_instance_id" {
  description = "Instance ID of bastion host"
  value       = aws_instance.bastion.id
}

output "bastion_security_group_id" {
  description = "Security group ID of bastion host"
  value       = aws_security_group.bastion.id
}

# Application Outputs
output "app_security_group_id" {
  description = "Security group ID for application servers"
  value       = aws_security_group.app.id
}

output "app_target_group_backend_arn" {
  description = "ARN of backend target group"
  value       = aws_lb_target_group.backend.arn
}

output "app_target_group_frontend_arn" {
  description = "ARN of frontend target group"
  value       = aws_lb_target_group.frontend.arn
}

output "autoscaling_group_name" {
  description = "Name of the Auto Scaling Group"
  value       = aws_autoscaling_group.app.name
}

# Load Balancer Outputs
output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = aws_lb.main.dns_name
}

output "alb_arn" {
  description = "ARN of the Application Load Balancer"
  value       = aws_lb.main.arn
}

output "alb_security_group_id" {
  description = "Security group ID of the ALB"
  value       = aws_security_group.alb.id
}

# RDS Outputs
output "rds_endpoint" {
  description = "Connection endpoint for the RDS database"
  value       = aws_db_instance.main.endpoint
  sensitive   = true
}

output "rds_address" {
  description = "Address of the RDS database"
  value       = aws_db_instance.main.address
}

output "rds_port" {
  description = "Port of the RDS database"
  value       = aws_db_instance.main.port
}

output "rds_database_name" {
  description = "Name of the RDS database"
  value       = aws_db_instance.main.db_name
  sensitive   = true
}

output "rds_security_group_id" {
  description = "Security group ID for RDS"
  value       = aws_security_group.rds.id
}

# ECR Outputs
output "ecr_backend_repository_url" {
  description = "URL of the backend ECR repository"
  value       = aws_ecr_repository.backend.repository_url
}

output "ecr_backend_registry_id" {
  description = "Registry ID of the backend ECR repository"
  value       = aws_ecr_repository.backend.registry_id
}

output "ecr_frontend_repository_url" {
  description = "URL of the frontend ECR repository"
  value       = aws_ecr_repository.frontend.repository_url
}

output "ecr_frontend_registry_id" {
  description = "Registry ID of the frontend ECR repository"
  value       = aws_ecr_repository.frontend.registry_id
}

# CloudWatch Logs
output "cloudwatch_log_group_app" {
  description = "Name of CloudWatch log group for application"
  value       = aws_cloudwatch_log_group.app.name
}

output "cloudwatch_log_group_rds" {
  description = "Name of CloudWatch log group for RDS"
  value       = aws_cloudwatch_log_group.rds.name
}

# Summary Output
output "deployment_summary" {
  description = "Summary of deployment information"
  value = {
    vpc_id                = aws_vpc.main.id
    bastion_public_ip     = aws_eip.bastion.public_ip
    alb_dns_name          = aws_lb.main.dns_name
    rds_endpoint          = aws_db_instance.main.endpoint
    backend_repository    = aws_ecr_repository.backend.repository_url
    frontend_repository   = aws_ecr_repository.frontend.repository_url
    environment           = var.environment
    region                = var.aws_region
  }
  sensitive = true
}
