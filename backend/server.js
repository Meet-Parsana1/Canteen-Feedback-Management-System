import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';

dotenv.config();

import canteenRoutes from './routes/canteenRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';

const app = express();

const configuredOrigins = (process.env.CLIENT_URL || '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);

const localhostOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const vercelPreviewPattern = /^https:\/\/.*\.vercel\.app$/;

app.use(helmet());
app.use(compression());
app.use(
      cors({
            origin(origin, callback) {
                  if (!origin) {
                        callback(null, true);
                        return;
                  }

                  const isAllowedOrigin =
                        configuredOrigins.includes(origin) ||
                        localhostOrigins.includes(origin) ||
                        vercelPreviewPattern.test(origin);

                  if (isAllowedOrigin) {
                        callback(null, true);
                        return;
                  }

                  callback(new Error(`CORS blocked for origin: ${origin}`));
            },
            credentials: true,
      }),
);

app.use(express.json());

// Health endpoint
app.get('/api/health', (_req, res) => {
      res.json({ ok: true, service: 'canteen-feedback-backend', timestamp: new Date().toISOString() });
});

// Mount Routes
app.use('/api/canteens', canteenRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feedback', feedbackRoutes);

mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.log('MongoDB Connected successfully'))
      .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
      console.log(`CanteenIQ Backend server running on port ${PORT}`);
});
