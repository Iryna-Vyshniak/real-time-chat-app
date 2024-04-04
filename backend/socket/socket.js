import { Server } from 'socket.io';
import http from 'http'; // it`s from node.js
import express from 'express';
import Message from '../models/message.model.js';

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH'],
  },
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on('connection', (socket) => {
  console.log('user connected', socket.id);

  const userId = socket.handshake.query.userId;
  if (userId !== 'undefined') userSocketMap[userId] = socket.id;

  // Join group chat room
  socket.on('joinRoom', ({ room, username }) => {
    socket.currentRoom = room;

    if (!socket.rooms.has('group_' + socket.currentRoom)) {
      socket.join('group_' + socket.currentRoom);
      console.log(`${username} has entered the group: ${socket.currentRoom}`);
      io.to('group_' + socket.currentRoom).emit('newUserJoined', username);
    }
  });

  // Leave group chat room
  socket.on('leaveRoom', ({ room, username }) => {
    if (room === socket.currentRoom) {
      console.log(`User ${username} has left the group: ${room}`);
      socket.leave('group_' + room);
      socket.currentRoom = null;
      io.to('group_' + room).emit('userLeftGroup', username);
    } else {
      console.log(`${username} tried to leave the group: ${room}, but they are not in this group.`);
    }
  });

  // io.emit() is used to send events to all the connected clients - for ex: who is online or offline
  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  socket.on('markMessagesAsRead', async ({ conversationId, userId }) => {
    try {
      await Message.updateMany({ conversationId, read: false }, { read: true }, { new: true });

      io.to(userSocketMap[userId]).emit('messagesRead', { conversationId });
    } catch (error) {
      console.log(error);
    }
  });

  // socket.on() is used to listen to the events; can be used both on client and server side
  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);

    if (userSocketMap[socket.id]) {
      delete userSocketMap[userId];
      io.emit('getOnlineUsers', Object.keys(userSocketMap));
    }
  });
});

export { app, io, server };
