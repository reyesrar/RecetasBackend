import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectDatabase } from './config/database';
import { env } from './config/env';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Recipe App API is running',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDatabase();
    
    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
      console.log(`Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;