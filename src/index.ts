import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectDatabase } from './config/database';
import { env } from './config/env';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import { errorHandler, notFound } from './middleware/errorHandler';
import recipeRoutes from './routes/recipes';
import groupRoutes from './routes/groups';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/groups', groupRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'Recipe App API is running',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
      console.log(`Environment: ${env.NODE_ENV}`);
      console.log(`API: http://localhost:${env.PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;