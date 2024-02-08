import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRouter from './routes/api/auth.routes.js';
import messageRouter from './routes/api/message.routes.js';

import connectToMongoDB from './db/connectToMongoDB.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/messages', messageRouter);

app.use((req, res) => {
  res.statusCode(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Internal Server Error' } = err;
  res.status(status).json({ message });
});

app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server running on port ${PORT}`);
});
