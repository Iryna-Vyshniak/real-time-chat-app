import { Server } from 'socket.io';
import http from 'http'; // it`s from node.js
import express from 'express';
import Message from '../models/message.model.js';

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: ['http://localhost:3000', 'https://chat-mern-ujj2.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'PATCH'],
  },
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

export const userSocketMap = {}; // {userId: socketId}
const onlineUsersByGroup = {};
export const userLocationMap = {};

io.on('connection', (socket) => {
  console.log('user connected', socket.id);

  const userId = socket.handshake.query.userId;
  const userLocation = socket.handshake.query.location;

  // io.emit() is used to send events to all the connected clients - for ex: who is online or offline
  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  if (userId !== 'undefined') {
    userSocketMap[userId] = socket.id;
    userLocationMap[userId] = userLocation;
  }

  // Emit the location right away if it exists
  if (userLocationMap[userId]) {
    io.emit('updateLocationResponse', userLocationMap[userId]);
  }
  // socket location
  socket.on('updateLocation', ({ position, userId }) => {
    userLocationMap[userId] = position; // Store the user's location in a separate map
    io.emit('updateLocationResponse', { position });
  });

  // Join group chat room
  socket.on('joinRoom', ({ room, username }) => {
    socket.currentRoom = room;

    if (!socket.rooms.has('group_' + socket.currentRoom)) {
      socket.join('group_' + socket.currentRoom);
      console.log(`${username} has entered the group: ${socket.currentRoom}`);
    }

    if (!onlineUsersByGroup[room]) {
      onlineUsersByGroup[room] = [];
    }

    if (!onlineUsersByGroup[room].includes(username)) {
      onlineUsersByGroup[room].push(username);

      // Emit event to inform existing participants about the new user
      io.to('group_' + socket.currentRoom).emit('newUserJoined', {
        room: socket.currentRoom,
        username,
        online: true,
      });
    }

    io.to('group_' + socket.currentRoom).emit('updateOnlineUsers', {
      room,
      onlineUsers: onlineUsersByGroup[room],
    });
  });

  // Leave group chat room
  socket.on('leaveRoom', ({ room, username }) => {
    if (room === socket.currentRoom) {
      console.log(`User ${username} has left the group: ${room}`);
      socket.leave('group_' + room);
      socket.currentRoom = null;
    } else {
      console.log(`${username} tried to leave the group: ${room}, but they are not in this group.`);
    }
    // Emit event to inform remaining participants about the leaving user
    io.to('group_' + room).emit('userLeftGroup', { room, username, online: false });

    if (onlineUsersByGroup[room]) {
      onlineUsersByGroup[room] = onlineUsersByGroup[room].filter((user) => user !== username);
      io.to('group_' + room).emit('updateOnlineUsers', {
        room,
        onlineUsers: onlineUsersByGroup[room],
      });
    }
  });

  socket.on('markMessagesAsRead', async ({ conversationId, userId }) => {
    try {
      await Message.updateMany({ conversationId, read: false }, { read: true }, { new: true });

      const senderSocketId = socket.id; // save the ID of the socket that sent the request

      if (Array.isArray(userId)) {
        userId.forEach((user) => {
          const userSocketId = userSocketMap[user._id];
          if (userSocketId !== senderSocketId) {
            io.to(userSocketId).emit('messagesRead', { conversationId });
          }
        });
      } else {
        const userSocketId = userSocketMap[userId];
        if (userSocketId !== senderSocketId) {
          io.to(userSocketId).emit('messagesRead', { conversationId });
        }
      }
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
    if (userLocationMap[userId]) {
      delete userLocationMap[userId];
    }
  });
});

export { app, io, server };
