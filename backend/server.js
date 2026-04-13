import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';

dotenv.config();

import feedbackRoutes from './routes/feedbackRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

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

app.get('/api/health', (_req, res) => {
      res.json({ ok: true, service: 'canteen-feedback-backend' });
});

app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);

mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.log('MongoDB Connected'))
      .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
});
