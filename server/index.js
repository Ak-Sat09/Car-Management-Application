import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/UserRoutes.js';
import CarRoutes from './routes/CarRoutes.js';

dotenv.config(); // Load environment variables from .env file

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('DB connection error:', err));

  app.use('/api/v1', authRoutes);
  app.use('/api/v1' , CarRoutes);
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`);
});
