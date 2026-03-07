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
- **Database**: MongoDB
- **Other**: Tailwind CSS for styling, JWT for authentication

## Getting Started

### Prerequisites
- Node.js 16+
- MongoDB instance

### Installation

1. Clone the repository
```bash
git clone https://github.com/IrakozeLoraine/edurev-rwanda.git
cd edurev-rwanda
```

2. Create a `.env` file in the backend directory with the following variables:
```
MONGO_URI=mongodb://localhost:27017/edurev-rwanda
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
```

3. Create a `.env` file in the frontend directory with the following variable:
```
VITE_API_BASE_URL=http://localhost:5000
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

The application will be available at `http://localhost:5173` (Vite default port) with the backend running on `http://localhost:5000`.

### Usage

1. **Open the application** in your browser at `http://localhost:5173`

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

The application can be run using Docker for easy deployment and development. There are two main approaches: running individual containers or using Docker Compose for a complete stack.

### Prerequisites for Docker Deployment

- Docker installed on your system
- Docker Compose (usually included with Docker Desktop)

### Environment Variables

Before running with Docker, ensure you have the required environment files:

#### Backend Environment Variables (`.env` in `/backend`)
```
MONGO_URI=mongodb://mongodb:27017/edurev-rwanda  # For docker-compose, use service name
JWT_SECRET=your_jwt_secret_key_here_change_in_production
PORT=5000
CORS_ORIGIN=http://localhost:5173  # For development, or http://localhost:3000 for production
```

#### Frontend Environment Variables (`.env` in `/frontend`)
```
VITE_API_BASE_URL=http://localhost:5000
```

**Note**: Copy `.env.example` files to `.env` in both backend and frontend directories and update the values as needed.

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
│   │   └── db.js             # MongoDB connection setup
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT authentication middleware
│   ├── models/                # Mongoose schemas
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