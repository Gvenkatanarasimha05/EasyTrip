// server/server.js

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js'; // fixed relative path

// Import routes
import authRoutes from './routes/auth.js';
import tripRoutes from './routes/trips.js';
import integrationRoutes from './routes/integrations.js';
import suggestionRoutes from './routes/suggestions.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // production frontend URL
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
app.get('/api/health', (req, res) => {
  res.json({ message: 'EasyTrip API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// Connect to Database
connectDatabase();

// Export for Vercel
export default app;
