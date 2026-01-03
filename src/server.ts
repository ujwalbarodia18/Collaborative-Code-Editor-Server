import express from 'express';
import roomRoutes from './routes/room.route';
import authRoutes from './routes/auth.route';
import cors from 'cors';
import { connectMongo } from './db/mongo';
import { errorHandler } from './middlewares/error.middleware';
import commonRoutes from './routes/common.route';

connectMongo().then().catch();

const app = express();
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

app.use('/room', roomRoutes);
app.use('/auth', authRoutes);
app.use('/common', commonRoutes);

app.use(errorHandler);
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`REST server running on http://localhost:${PORT}`);
});