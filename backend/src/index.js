import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: ['https://spending-dna.vercel.app', 'http://localhost:5173'],
  credentials: true
}))
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/recommendations', recommendationRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Spending DNA API running' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error(err));