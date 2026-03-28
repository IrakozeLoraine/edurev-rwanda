#!/bin/bash
set -e

# Bastion Host Setup Script
echo "Starting Bastion Host Setup..."

# Update system
yum update -y

# Install essential tools
yum install -y \
    curl \
    wget \
    git \
    htop \
    vim \
    unzip \
    aws-cli \
    amazon-cloudwatch-agent

# Install Docker
amazon-linux-extras install docker -y
systemctl start docker
systemctl enable docker
usermod -aG docker ec2-user

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install PostgreSQL client tools
yum install -y postgresql15-contrib

# Configure CloudWatch agent for monitoring
cat > /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json <<EOF
{
  "metrics": {
    "namespace": "${project_name}",
    "metrics_collected": {
      "cpu": {
        "measurement": [
          {
            "name": "cpu_usage_idle",
            "rename": "CPU_IDLE",
            "unit": "Percent"
          }
        ],
        "metrics_collection_interval": 60
      },
      "disk": {
        "measurement": [
          {
            "name": "used_percent",
            "rename": "DISK_USED",
            "unit": "Percent"
          }
        ],
        "metrics_collection_interval": 60,
        "resources": [
          "/"
        ]
      },
      "mem": {
        "measurement": [
          {
            "name": "mem_used_percent",
            "rename": "MEMORY_USED",
            "unit": "Percent"
          }
        ],
        "metrics_collection_interval": 60
      }
    }
  }
}
EOF

# Start CloudWatch agent
/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
    -a fetch-config \
    -m ec2 \
    -s \
    -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json

# Create a welcome message
cat > /etc/motd <<EOF
Welcome to ${project_name} Bastion Host

This is a jump box for accessing private resources.
All SSH sessions are monitored and logged.
EOF

# Log completion
echo "Bastion Host Setup Complete!" > /var/log/bastion-setup.log
echo "Setup completed at $(date)" >> /var/log/bastion-setup.log

echo "Bastion setup completed successfully!"
