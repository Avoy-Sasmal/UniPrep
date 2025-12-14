import dotenv from 'dotenv';
// Load environment variables FIRST before any other imports
dotenv.config();

import express from 'express';
import cors from 'cors';
import axios from 'axios';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import subjectRoutes from './routes/subjects.js';
import contextRoutes from './routes/context.js';
import styleRoutes from './routes/styles.js';
import contentRoutes from './routes/content.js';
import examRoutes from './routes/exam.js';
import quizRoutes from './routes/quiz.js';
import sessionRoutes from './routes/sessions.js';
import communityRoutes from './routes/community.js';
import cloudinaryRoutes from './routes/cloudinary.js';
import connectDB from './config/db.js';

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "https://uni-prep-xi.vercel.app",
    "http://localhost:3000",
].filter(Boolean).map(url => url.replace(/\/$/, '')); // Remove trailing slashes

// CORS (credentials + strict origin)
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        // Normalize origin by removing trailing slash
        const normalizedOrigin = origin.replace(/\/$/, '');

        if (allowedOrigins.includes(normalizedOrigin) || /\.vercel\.app$/.test(normalizedOrigin)) {
            callback(null, true);
        } else {
            callback(new Error("CORS not allowed for origin: " + origin));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.error(' Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Please check your .env file in the backend directory.');
  process.exit(1);
}

// MongoDB Connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/context', contextRoutes);
app.use('/api/styles', styleRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/exam', examRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);

// Normal Route
app.get('/', (req, res) => {
  res.send('Welcome to the UniPrep Copilot API');
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'UniPrep Copilot API is running' });
});

// AI API key test endpoint with detailed diagnostics
app.get('/api/test-ai-key', async (req, res) => {
  try {
    const { testAPIKey } = await import('./services/aiOrchestrator.js');
    const result = await testAPIKey();

    // Log diagnostics for debugging
    if (!result.valid && result.diagnostics) {
      console.log('\n API Key Diagnostics:');
      console.log(`   Length: ${result.diagnostics.keyLength} characters`);
      console.log(`   Starts with: ${result.diagnostics.keyPrefix}...`);
      console.log(`   Ends with: ...${result.diagnostics.keySuffix}`);
      console.log(`   Has spaces: ${result.diagnostics.hasSpaces}`);
      console.log(`   Has quotes: ${result.diagnostics.hasQuotes}`);
      console.log(`   Valid prefix: ${result.diagnostics.startsWithCorrectPrefix}`);
      if (result.statusCode) {
        console.log(`   HTTP Status: ${result.statusCode}`);
      }
      if (result.detailedError) {
        console.log(`   API Error: ${result.detailedError}`);
      }
      console.log('');
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({
      valid: false,
      error: error.message,
      diagnostics: { error: 'Failed to test API key' }
    });
  }
});

// Pinging the server to keep it awake
// Endpoint to ping
app.get('/ping', (req, res) => {
  res.status(200).send('Pong!');
});

// Function to ping the server every 5 minutes
function pingServer() {
  const url = `${process.env.BACKEND_URL}/ping` || `http://localhost:${PORT}/ping`;
  axios.get(url)
    .then(() => console.log('Pinged server at', new Date().toLocaleString()))
    .catch(err => console.error('Error pinging server:', err.message));
}

// Ping every 12 minutes (720,000 milliseconds)
setInterval(pingServer, 60000);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

