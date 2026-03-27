#!/bin/bash
set -e

# Application Server Setup Script
echo "Starting Application Server Setup..."

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
    amazon-cloudwatch-agent \
    postgresql15-contrib

# Install Node.js
curl -sL https://rpm.nodesource.com/setup_20.x | bash -
yum install -y nodejs

# Install Docker
amazon-linux-extras install docker -y
systemctl start docker
systemctl enable docker
usermod -aG docker ec2-user

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create application directory
mkdir -p /opt/app
cd /opt/app

# Configure CloudWatch agent
cat > /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json <<EOF
{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/log/docker/*.log",
            "log_group_name": "/aws/${project_name}/application",
            "log_stream_name": "{instance_id}"
          }
        ]
      }
    }
  },
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
          "/",
          "/var"
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

# Create environment file for the application
cat > /opt/app/.env <<EOF
# Database Configuration
PGHOST=${db_host}
PGPORT=5432
PGUSER=${db_username}
PGPASSWORD=${db_password}
PGDATABASE=${db_name}

# Application Configuration
JWT_SECRET=${jwt_secret}
PORT=5000
CORS_ORIGIN=${backend_cors_origin}
NODE_ENV=production

# Docker Registry
ECR_REGISTRY=${ecr_registry}

# ALB DNS
ALB_DNS=${alb_dns_name}
EOF

chmod 600 /opt/app/.env

# Create a docker-compose file for the application
cat > /opt/app/docker-compose.yml <<'EOFCOMPOSE'
version: '3.8'
services:
  backend:
    image: $${ECR_REGISTRY}
    container_name: edurev-backend
    restart: always
    ports:
      - "5000:5000"
    environment:
      PGHOST: $${PGHOST}
      PGPORT: $${PGPORT}
      PGUSER: $${PGUSER}
      PGPASSWORD: $${PGPASSWORD}
      PGDATABASE: $${PGDATABASE}
      JWT_SECRET: $${JWT_SECRET}
      PORT: 5000
      CORS_ORIGIN: $${CORS_ORIGIN}
      NODE_ENV: production
    depends_on:
      - postgres-client
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    logging:
      driver: "awslogs"
      options:
        awslogs-group: "/aws/edurev-rwanda/application"
        awslogs-region: "eu-central-1"
        awslogs-stream-prefix: "ecs"

  postgres-client:
    image: postgres:17-alpine
    container_name: postgres-client
    command: /bin/sh -c "while true; do sleep 3600; done"
    environment:
      PGHOST: $${PGHOST}
      PGPORT: $${PGPORT}
      PGUSER: $${PGUSER}
      PGPASSWORD: $${PGPASSWORD}
      PGDATABASE: $${PGDATABASE}
EOFCOMPOSE

chmod 644 /opt/app/docker-compose.yml

# Create startup script
cat > /opt/app/start.sh <<'EOFSTART'
#!/bin/bash
set -e

echo "Starting application services..."

# Load environment variables
source /opt/app/.env

# Get ECR login token
aws ecr get-login-password --region $(aws ec2 describe-availability-zones --query 'AvailabilityZones[0].RegionName' --output text) | \
  docker login --username AWS --password-stdin $(echo $${ECR_REGISTRY} | sed 's|/.*||')

# Start services
cd /opt/app
docker-compose up -d

echo "Application started successfully!"
EOFSTART

chmod +x /opt/app/start.sh

# Create systemd service for application
cat > /etc/systemd/system/edurev-app.service <<'EOFSVC'
[Unit]
Description=EduRev Rwanda Application
After=docker.service
Requires=docker.service

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/opt/app
EnvironmentFile=/opt/app/.env
ExecStart=/opt/app/start.sh
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOFSVC

# Enable and start the service
systemctl daemon-reload
systemctl enable edurev-app.service
systemctl start edurev-app.service

# Log setup completion
echo "Application Server Setup Complete!" > /var/log/app-setup.log
echo "Setup completed at $(date)" >> /var/log/app-setup.log

echo "Application server setup completed successfully!"
