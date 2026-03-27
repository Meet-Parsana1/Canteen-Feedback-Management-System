import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from "helmet";
import compression from "compression";


dotenv.config();

import feedbackRoutes from './routes/feedbackRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

app.use(helmet());
app.use(compression());

app.use(
      cors({
            origin: [process.env.CLIENT_URL, "http://localhost:5173"],
            credentials: true,
      }),
);

app.use(express.json());

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
