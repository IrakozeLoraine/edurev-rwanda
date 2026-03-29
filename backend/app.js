const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

// Trust proxy (required behind ALB for correct client IP in rate limiting)
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: 'Too many requests, please try again later' },
});
app.use(limiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { message: 'Too many auth attempts, please try again later' },
});

// CORS
if (!process.env.CORS_ORIGIN) {
    console.warn('WARNING: CORS_ORIGIN not set, defaulting to http://localhost:3000 and http://localhost:5173');
}
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:5173')
    .split(',')
    .map((s) => s.trim());

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    );
    res.header('Vary', 'Origin');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Body parsing with size limit
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
app.use("/api/auth", authLimiter, require("./routes/authRoutes"));
app.use("/api/subjects", require("./routes/subjectRoutes"));
app.use("/api/topics", require("./routes/topicRoutes"));
app.use("/api/questions", require("./routes/questionRoutes"));
app.use("/api/forum", require("./routes/forumRoutes"));

module.exports = app;
