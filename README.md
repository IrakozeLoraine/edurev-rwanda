# EduRev Rwanda

> A smart revision companion for Rwandan secondary students.

## African Context

Many secondary students in Rwanda preparing for national exams (REB curriculum) lack a simple, organized way to revise topics and practice questions. This leads to inefficient study habits and lower exam performance, which in turn affects future educational and career opportunities. By providing a smart revision companion, we aim to empower students with the tools they need to succeed academically and contribute to Rwanda's development.

## Team Members

- Loraine Mukezwa Irakoze - Team Lead - l.irakoze2@alustudent.com
- Ninette Irisa Agatesi - Backend Developer - n.agatesi@alustudent.com
- John Kwizera - DevOps Engineer - j.kwizera@alustudent.com
- Nicole Ange Umukundwa - Frontend Developer - n.mukundwa@alustudent.com

## Project Overview

EduRev Rwanda is a web application designed to help Rwandan secondary students efficiently revise for their national exams. The platform offers randomized practice questions based on the REB (Rwanda Education Board) curriculum, allowing students to test their knowledge and identify areas for improvement. Additionally, EduRev offers forums where students can discuss topics, share resources, and support each other in their revision journey. EduRev aims to create a collaborative learning environment that fosters academic success and builds a strong community of learners.

### Target Users

Rwandan O-Level and A-Level secondary students preparing for national exams.

### Core Features
- Feature 1: List key topics for a chosen subject.
- Feature 2: Serve multiple-choice questions for a topic and show correct answers after submission with scoring.
- Feature 3: Provide short notes and references per topic.
- Feature 4: Provide a forum for students to discuss topics and share resources.

## Technology Stack

- **Backend**: Node.js/Express
- **Frontend**: React
- **Database**: PostgreSQL (for structured data)
- **Other**: Tailwind CSS for styling, JWT for authentication

## Getting Started

You can run EduRev Rwanda in two ways:
- **Local Development** (without Docker): Run services directly on your machine
- **Docker Deployment** (production-ready): Use Docker Compose with secure secret management

### Prerequisites for Local Development
- Node.js 16+
- PostgreSQL 14+
- Create a PostgreSQL database and user with appropriate permissions

### Local Development Installation

1. Clone the repository
```bash
git clone https://github.com/IrakozeLoraine/edurev-rwanda.git
cd edurev-rwanda
```

2. Create a `.env` file in the backend directory with the following variables:
```
PGHOST=${PGHOST}
PGPORT=${PGPORT}
PGUSER=${PGUSER}
PGPASSWORD=${PGPASSWORD}
PGDATABASE=${PGDATABASE}

JWT_SECRET=${JWT_SECRET}
PORT=${PORT}
CORS_ORIGIN=${CORS_ORIGIN}
```

3. Create a `.env` file in the frontend directory with the following variable:
```
VITE_API_BASE_URL=${VITE_API_BASE_URL}
```

4. Install backend dependencies and start the server
```bash
cd backend
npm install
npm run dev
```

5. In a new terminal, install frontend dependencies and start the development server
```bash
cd frontend
npm install
npm run dev
```

6. Seed the database with initial subjects and topics (optional)
```bash
cd backend
node seed.js
```

## Running with Docker Compose

Run the application using Docker Compose for an isolated, containerized environment.

### Prerequisites
- Docker and Docker Compose installed on your system

### Setup

1. Clone the repository
```bash
git clone https://github.com/IrakozeLoraine/edurev-rwanda.git
cd edurev-rwanda
```

2. Copy .env.example to .env and modify the values as needed
```bash
cp .env.example .env
```

### Running the Application

1. Build and start the services
```bash
docker-compose up --build
```

2. The application will be available at:
   - **Frontend**: `http://localhost:3000`
   - **Backend API**: `http://localhost:4500/api`
   - **Database**: Internal only (not exposed externally)

3. Seed the database with initial subjects and topics (optional)
```bash
docker-compose exec backend node seed.js
```

To stop the services, press `Ctrl+C` or run:
```bash
docker-compose down
```

### Persistence

- **Database Data**: Stored in the `postgres_data` Docker volume persists across container restarts

To remove the database volume and reset data:
```bash
docker volume rm edurev-rwanda_postgres_data
```

## Terraform Deployment

Deploy EduRev Rwanda to AWS infrastructure using Terraform for a scalable, production-ready environment.

### Prerequisites for Terraform Deployment

- Terraform >= 1.0
- AWS CLI configured with appropriate credentials
- AWS Account with permissions to create VPC, EC2, RDS, and ECR resources
- SSH key pair for EC2 access

### Architecture Overview

The Terraform configuration deploys the following AWS resources:

- **VPC & Networking**: Custom VPC with public and private subnets across multiple availability zones
- **Bastion Host**: Jump server for secure access to private resources
- **Application Servers**: EC2 instances running the backend and frontend in private subnets
- **RDS Database**: Managed PostgreSQL database for data persistence
- **Container Registry**: Amazon ECR for Docker image storage
- **Security Groups**: Network security configured with least-privilege access

### Setup

1. Navigate to the terraform directory
```bash
cd terraform
```

2. Copy and customize the terraform variables
```bash
cp terraform.tfvars.example terraform.tfvars
```

3. Edit `terraform.tfvars` with your specific values:
```hcl
aws_region              = "us-east-1"          # Your preferred AWS region
environment             = "dev"                 # dev, staging, or prod
db_password             = "YourStrongPassword" # Create a strong password
allowed_ssh_cidrs       = ["YOUR_IP/32"]       # Restrict SSH access to your IP
```

### Deploying Infrastructure

1. Initialize Terraform (downloads providers and sets up the working directory)
```bash
terraform init
```

2. Validate the configuration
```bash
terraform validate
```

3. Review the planned changes
```bash
terraform plan
```

4. Import existing resources (if any) - If you have already created some AWS resources manually, you can import them into Terraform state to manage them going forward. For example:

```bash
terraform import aws_iam_role.bastion edurev-rwanda-bastion-role
terraform import aws_iam_role.app edurev-rwanda-app-role
terraform import aws_iam_role.rds_monitoring edurev-rwanda-rds-monitoring-role
```

5. Apply the configuration to create AWS resources
```bash
terraform apply
```

Review the proposed changes and type `yes` to confirm. This will:
- Create VPC and networking infrastructure
- Launch EC2 instances for bastion and application servers
- Provision RDS PostgreSQL database
- Create ECR repository for container images
- Configure security groups and access controls

### Post-Deployment

1. Obtain the outputs
```bash
terraform output
```

Notable outputs include:
- `bastion_public_ip` - IP address to SSH into the bastion host
- `rds_endpoint` - Database connection endpoint
- `ecr_repository_url` - Container registry URL for pushing Docker images

2. SSH into the bastion host
```bash
ssh -i /path/to/your/key.pem ec2-user@<bastion_public_ip>
```

3. From the bastion, access application servers and RDS

### Deploying Application to Infrastructure

1. Build and push Docker images to ECR
```bash
docker build -t edurev-backend ./backend
docker build -t edurev-frontend ./frontend
docker push <ecr_repository_url>/edurev-backend:latest
docker push <ecr_repository_url>/edurev-frontend:latest
```

2. Run deployment scripts on application servers (via bastion)
```bash
# Connect to bastion first
ssh -i /path/to/your/key.pem ec2-user@<bastion_public_ip>

# Execute app-setup.sh on the application server
# This sets up Docker, pulls images, and starts containers
```


## Ansible Deployment

Deploy EduRev Rwanda application to your AWS EC2 infrastructure using Ansible for automated provisioning and deployment.

### Prerequisites for Ansible Deployment

- AWS infrastructure (bastion host and app server) provisioned via Terraform (see below)
- Ansible installed on your local machine (`pip install ansible`)
- SSH private key for EC2 access (e.g., `edurev-rwanda.pem`)
- AWS credentials with access to ECR (for pulling Docker images)

### Ansible Directory Structure

```
ansible/
├── deploy.yml         # Main Ansible playbook
├── inventory.ini      # Inventory file with bastion and app server details
└── edurev-rwanda.pem  # SSH private key (not committed to git)
```

### Setup

1. Ensure your AWS infrastructure is running (see Terraform section below).
2. Place your SSH private key (e.g., `edurev-rwanda.pem`) in the `ansible/` directory and set permissions:
   ```bash
   chmod 600 ansible/edurev-rwanda.pem
   ```
3. Edit `ansible/inventory.ini` to match your bastion and app server IP addresses.
4. Export required environment variables for the deployment:
   ```bash
   export APP_IMAGE=<ecr_repository_url>/edurev-backend:latest
   export DATABASE_URL=<your_database_url>
   export AWS_ACCESS_KEY_ID=<your_aws_access_key_id>
   export AWS_SECRET_ACCESS_KEY=<your_aws_secret_access_key>
   export AWS_REGION=<your_aws_region>
   ```

### Running the Ansible Playbook

From the `ansible/` directory, run:
```bash
ansible-playbook -i inventory.ini deploy.yml
```

This will:
- Install Docker and Docker Compose on the app server
- Copy the Docker Compose file and environment variables
- Pull the latest Docker image from ECR
- Start the application using Docker Compose

If you encounter SSH issues, ensure your security groups and SSH key are correct, and that the bastion host is accessible.

### Managing Infrastructure

### Scaling

Update instance counts in `terraform.tfvars`:
```hcl
app_instance_count = 3  # Increase from 2 to 3
```

Then apply the changes:
```bash
terraform apply
```

### Destroying Infrastructure

To tear down all AWS resources:
```bash
terraform destroy
```

Type `yes` to confirm. This will delete all provisioned infrastructure.

**Warning**: This will permanently delete databases and other resources. Ensure backups exist before destroying.

### Troubleshooting

**Issue**: Terraform plan fails with authentication errors
- **Solution**: Verify AWS credentials are configured: `aws configure`

**Issue**: RDS creation times out
- **Solution**: Check security group rules allow database port access from app servers

**Issue**: EC2 instances can't reach RDS
- **Solution**: Verify all security group rules and subnet routing are correct: `terraform plan`

### Usage

1. **Open the application** in your browser at `http://localhost:3000`

2. **Create an account and Login** - Sign up or sign in with your email and password

3. **Select a subject** - Choose from available O-Level or A-Level subjects (Mathematics, English, Biology, etc.)

4. **Browse topics** - View all topics within your selected subject

5. **Practice questions** - Take randomized multiple-choice quizzes for any topic:
   - Answer all questions
   - Submit to see your score
   - Review correct answers and explanations

6. **Access notes** - View concise study notes and references for each topic

7. **Join the forum** - Participate in discussions, ask questions, and help fellow students

## Docker Deployment

The application uses Docker containers with Docker Compose orchestrating the full stack including PostgreSQL, backend API, and frontend.

### Prerequisites for Docker Deployment

- Docker installed on your system
- Docker Compose (usually included with Docker Desktop)

### Architecture Overview

- **Database Tier**: PostgreSQL 17 running on an internal `backend-db` network (not exposed externally)
- **Backend Tier**: Node.js/Express API on the `backend-db` and `frontend-backend` networks
- **Frontend Tier**: React SPA served by a static file server on the `frontend-backend` network

### Configuration

Copy the provided `.env.example` file in the root directory to `.env` and fill in the appropriate values for your environment.

The Docker Compose file reads these values from the `.env` file and passes them to the containers.

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token

#### Subjects & Topics
- `GET /api/subjects` - List all subjects
- `GET /api/subjects/:id` - Get a single subject
- `GET /api/topics/:subjectId` - Get topics for a subject

#### Questions (Coming Soon)
- `GET /api/topics/:id/questions` - Get questions for a topic

#### Forum (Coming Soon)
- `GET /api/forum` - List forum threads
- `POST /api/forum` - Create a new thread

## Project Structure

```
edurev-rwanda/
├── backend/                    # Node.js/Express server
│   ├── config/
│   │   └── db.js             # PostgreSQL connection setup
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT authentication middleware
│   ├── models/                # PostgreSQL schemas
│   │   ├── Forum.js
│   │   ├── Question.js
│   │   ├── Subject.js
│   │   ├── Topic.js
│   │   └── User.js
│   ├── routes/                # Express route handlers
│   │   ├── authRoutes.js
│   │   ├── subjectRoutes.js
│   │   └── topicRoutes.js
│   ├── server.js              # Express app entry point
│   └── package.json
│
├── frontend/                   # React + TypeScript application
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   ├── pages/             # Page components
│   │   ├── store/             # Redux store configuration
│   │   │   ├── reducers/      # Redux reducers
│   │   │   └── store.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── axios.ts           # Axios API client configuration
│   │   ├── types.ts           # TypeScript type definitions
│   │   └── index.css
│   ├── vite.config.ts         # Vite configuration
│   ├── tsconfig.json          # TypeScript configuration
│   ├── index.html
│   └── package.json
│
├── README.md
└── LICENSE
```

## Links

- [Project Board](https://github.com/users/IrakozeLoraine/projects/1)
- [GitHub Repository](https://github.com/IrakozeLoraine/edurev-rwanda)

## Contributing

To contribute submit pull requests or open issues for bugs and feature requests.

## License

[MIT License](LICENSE)