import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDatabase } from '../server/config/database.js'; // adjust path if needed

// Import routes
import authRoutes from '../server/routes/auth.js';
import tripRoutes from '../server/routes/trips.js';
import integrationRoutes from '../server/routes/integrations.js';
import suggestionRoutes from '../server/routes/suggestions.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/integrations', integrationRoutes);
app.use('/api/suggestions', suggestionRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ message: 'EasyTrip API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Connect to DB
connectDatabase();

// ✅ Export for Vercel (no app.listen)
export default app;
