import { v2 as cloudinary } from 'cloudinary';

import { ctrlWrapper } from '../decorators/index.js';
import { HttpError } from '../helpers/index.js';

import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';
import User from '../models/user.model.js';

import { getReceiverSocketId, io } from '../socket/socket.js';

export const sendMessage = async (req, res) => {
  const { id: receiver } = req.params; // receiver
  const { message, img } = req.body;
  const sender = req.user._id; // its me

  if (!message && !img) {
    throw HttpError(400, 'Invalid data passed into request');
  }

  let conversation = await Conversation.findOne({
    participants: { $all: [sender, receiver] },
  });

  if (!conversation) {
    conversation = await Conversation.create({ participants: [sender, receiver] });
  }

  const senderInfo = await User.findById({ _id: sender });
  const receiverInfo = await User.findById({ _id: receiver });

  let imgUrl = '';

  if (img) {
    imgUrl = img;

    const uploadResponse = await cloudinary.uploader.upload(img, {
      folder: `chat`,
      public_id: `chat-${sender}-${Date.now()}`,
      use_filename: true,
      fetch_format: 'auto',
      quality: 'auto',
      flags: 'lossy',
    });
    imgUrl = uploadResponse.secure_url;
  }

  const newMessage = await Message.create({
    conversationId: conversation._id,
    sender: senderInfo,
    receiver: receiverInfo,
    message,
    img: imgUrl,
  });

  if (newMessage) {
    conversation.messages.push(newMessage._id);
  }

  //   await conversation.save();
  //   await newMessage.save();

  // this will run in parallel
  await Promise.all([conversation.save(), newMessage.save()]);

  // socket io functionality
  const receiverSocketId = getReceiverSocketId(receiver);
  if (receiverSocketId) {
    // io.to(socket_id).emit() used to send events to one specific clients
    io.to(receiverSocketId).emit('newMessage', newMessage);
  }

  res.status(201).json(newMessage);
};

// GET MESSAGES

export const getMessages = async (req, res) => {
  const { id: receiver } = req.params; // my receiver
  const sender = req.user._id; // it`s me

  // get actual messages
  const conversation = await Conversation.findOne({
    participants: { $all: [sender, receiver] },
  }).populate({
    path: 'messages',
    populate: [
      { path: 'sender', model: 'User', select: ' _id fullName username avatar' },
      { path: 'receiver', model: 'User', select: ' _id fullName username avatar' },
    ],
  });

  if (!conversation) return res.status(200).json([]);

  const messages = conversation.messages;

  res.status(200).json(messages);
};

export default {
  getMessages: ctrlWrapper(getMessages),
  sendMessage: ctrlWrapper(sendMessage),
};
