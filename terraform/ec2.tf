# Data source to get the latest Amazon Linux 2 AMI
data "aws_ami" "amazon_linux_2" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = [var.bastion_ami_name]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Bastion Host (SSH Jump Box)
resource "aws_instance" "bastion" {
  ami                    = data.aws_ami.amazon_linux_2.id
  instance_type          = var.bastion_instance_type
  subnet_id              = aws_subnet.public[0].id
  vpc_security_group_ids = [aws_security_group.bastion.id]
  iam_instance_profile   = aws_iam_instance_profile.bastion.name

  user_data = base64encode(templatefile("${path.module}/bastion-setup.sh", {
    project_name = var.project_name
  }))

  associate_public_ip_address = true

  tags = merge(local.default_tags, {
    Name = "${var.project_name}-bastion"
  })

  depends_on = [aws_internet_gateway.main]
}

# IAM Role for Bastion Host
resource "aws_iam_role" "bastion" {
  name = "${var.project_name}-bastion-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = merge(local.default_tags, {
    Name = "${var.project_name}-bastion-role"
  })
}

# IAM Policy for Bastion Host (CloudWatch, SSM)
resource "aws_iam_role_policy" "bastion" {
  name = "${var.project_name}-bastion-policy"
  role = aws_iam_role.bastion.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ec2messages:AcknowledgeMessage",
          "ec2messages:DeleteMessage",
          "ec2messages:FailMessage",
          "ec2messages:GetEndpoint",
          "ec2messages:GetMessages",
          "ec2messages:SendReply",
          "ssm:UpdateInstanceInformation",
          "ssm:ListAssociations",
          "ssm:ListInstanceAssociations",
          "ssm:GetDocument",
          "ssm:DescribeDocument"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogStreams"
        ]
        Resource = "*"
      }
    ]
  })
}

# IAM Instance Profile for Bastion
resource "aws_iam_instance_profile" "bastion" {
  name = "${var.project_name}-bastion-profile"
  role = aws_iam_role.bastion.name
}

# Elastic IP for Bastion Host
resource "aws_eip" "bastion" {
  instance = aws_instance.bastion.id
  domain   = "vpc"

  tags = merge(local.default_tags, {
    Name = "${var.project_name}-bastion-eip"
  })

  depends_on = [aws_internet_gateway.main]
}

# Launch Template for Application Servers
resource "aws_launch_template" "app" {
  name_prefix   = "${var.project_name}-app-"
  image_id      = data.aws_ami.amazon_linux_2.id
  instance_type = var.app_instance_type
  iam_instance_profile {
    name = aws_iam_instance_profile.app.name
  }

  vpc_security_group_ids = [aws_security_group.app.id]

  user_data = base64encode(templatefile("${path.module}/app-setup.sh", {
    project_name       = var.project_name
    db_host            = aws_db_instance.main.endpoint
    db_name            = var.db_name
    db_username        = var.db_username
    db_password        = var.db_password
    jwt_secret         = var.jwt_secret
    backend_cors_origin = var.backend_cors_origin
    alb_dns_name       = aws_lb.main.dns_name
    ecr_registry      = "${aws_ecr_repository.backend.repository_url}:latest"
    ECR_REGISTRY      = "${aws_ecr_repository.backend.repository_url}:latest"
  }))

  monitoring {
    enabled = true
  }

  tag_specifications {
    resource_type = "instance"
    tags = merge(local.default_tags, {
      Name = "${var.project_name}-app-instance"
    })
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Auto Scaling Group for Application Servers
resource "aws_autoscaling_group" "app" {
  name                = "${var.project_name}-app-asg"
  vpc_zone_identifier = aws_subnet.private[*].id
  target_group_arns   = [aws_lb_target_group.backend.arn, aws_lb_target_group.frontend.arn]
  health_check_type   = "ELB"
  health_check_grace_period = 300

  min_size         = var.app_instance_count
  max_size         = var.app_instance_count * 2
  desired_capacity = var.app_instance_count

  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "${var.project_name}-app-asg-instance"
    propagate_at_launch = true
  }

  lifecycle {
    create_before_destroy = true
  }
}

# IAM Role for Application Servers
resource "aws_iam_role" "app" {
  name = "${var.project_name}-app-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = merge(local.default_tags, {
    Name = "${var.project_name}-app-role"
  })
}

# IAM Policy for Application Servers (CloudWatch, ECR access)
resource "aws_iam_role_policy" "app" {
  name = "${var.project_name}-app-policy"
  role = aws_iam_role.app.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogStreams"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:DescribeImages"
        ]
        Resource = [
          aws_ecr_repository.backend.arn,
          aws_ecr_repository.frontend.arn
        ]
      }
    ]
  })
}

# IAM Instance Profile for Application Servers
resource "aws_iam_instance_profile" "app" {
  name = "${var.project_name}-app-profile"
  role = aws_iam_role.app.name
}

# CloudWatch Log Group for Application
resource "aws_cloudwatch_log_group" "app" {
  name              = "/aws/${var.project_name}/application"
  retention_in_days = var.environment == "prod" ? 30 : 7

  tags = merge(local.default_tags, {
    Name = "${var.project_name}-app-logs"
  })
}
