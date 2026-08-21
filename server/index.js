import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import aiRoute from './routes/ai.js';
import { errorHandler } from './middleware/errorMiddleware.js';

connectDB();

const app = express();

// Allow multiple origins (local dev + deployed frontend) at once.
// Set CLIENT_URLS as a comma-separated list in .env, e.g.:
// CLIENT_URLS=http://localhost:5173,https://deep-focus-lyart.vercel.app
// Falls back to the older single CLIENT_URL var if CLIENT_URLS isn't set.
const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || '')
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, mobile apps, health checks)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',    authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/books',   bookRoutes);
app.use('/api/ai',      aiRoute);

app.get('/api/health', (req, res) => res.json({ status: 'OK ✅' }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));