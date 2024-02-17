import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRouter from './routes/api/auth.routes.js';
import messageRouter from './routes/api/message.routes.js';
import usersRouter from './routes/api/user.routes.js';

import connectToMongoDB from './db/connectToMongoDB.js';
import { app, server } from './socket/socket.js';

dotenv.config();

const __dirname = path.resolve();

const PORT = process.env.PORT || 5000;

app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/messages', messageRouter);
app.use('/api/users', usersRouter);

// Serve static files from the frontend/dist directory
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// Route fallback to index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

app.use((req, res) => {
  res.statusCode(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Internal Server Error' } = err;
  res.status(status).json({ message });
});

server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server running on port ${PORT}`);
});
