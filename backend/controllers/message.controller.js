import { v2 as cloudinary } from 'cloudinary';

import { ctrlWrapper } from '../decorators/index.js';
import { HttpError } from '../helpers/index.js';
import { pagination } from '../utils/pagination.js';

import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';
import User from '../models/user.model.js';

import { getReceiverSocketId, io } from '../socket/socket.js';

export const sendMessage = async (req, res) => {
  const { id: receiver } = req.params; // receiver
  const { text, img, audio, video, quote, quotedId, emoji } = req.body;

  const sender = req.user._id; // its me

  if (!text && !img && !audio && !video) {
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

  // retrieve information about the quoted message if a quoted message ID is provided
  let repliedInfo = null;

  if (quotedId) {
    repliedInfo = await Message.findById(quotedId)
      .populate({
        path: 'sender',
        model: 'User',
        select: 'fullName',
      })
      .populate({
        path: 'receiver',
        model: 'User',
        select: 'fullName',
      })
      .select('_id text audio img');
  }

  let imgUrl = '';
  let audioUrl = '';
  let videoUrl = '';

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

  if (audio) {
    audioUrl = audio;

    const uploadResponse = await cloudinary.uploader.upload(audio, {
      folder: 'chat/audio',
      public_id: `chat-${sender}-${Date.now()}`,
      use_filename: true,
      resource_type: 'video',
    });

    audioUrl = uploadResponse.secure_url;
  }
  if (video) {
    videoUrl = video;

    const uploadResponse = await cloudinary.uploader.upload(video, {
      folder: 'chat/video',
      public_id: `chat-${sender}-${Date.now()}`,
      use_filename: true,
      resource_type: 'video',
    });

    videoUrl = uploadResponse.secure_url;
  }

  const newMessage = await Message.create({
    conversationId: conversation._id,
    sender: senderInfo,
    receiver: receiverInfo,
    text,
    img: imgUrl,
    audio: audioUrl,
    video: videoUrl,
    emoji,
    quote,
    repliedTo: repliedInfo,
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

// SEND EMOJI
export const sendEmoji = async (req, res) => {
  const { id: receiver, messageId } = req.params;
  const sender = req.user._id; // its me
  const { emoji } = req.body;

  if (!emoji && !messageId) {
    throw HttpError(400, 'Invalid data passed into request');
  }

  const updateMessage = await Message.findByIdAndUpdate(
    messageId,
    { emoji },
    { emoji: '' },
    { new: true }
  );

  if (!updateMessage) throw HttpError(404, 'Message not found');

  // socket io functionality
  const receiverSocketId = getReceiverSocketId(receiver);
  const senderSocketId = getReceiverSocketId(sender);

  if (receiverSocketId && senderSocketId) {
    // io.to(socket_id).emit() used to send events to one specific clients - only sender and receiver
    io.to(senderSocketId).emit('addEmoji', { messageId, emoji });
    io.to(receiverSocketId).emit('addEmoji', { messageId, emoji });
  }

  res.status(200).json(updateMessage);
};

// REMOVE EMOJI
export const removeEmoji = async (req, res) => {
  const { id: receiver, messageId } = req.params;
  const sender = req.user._id; // its me

  if (!messageId) {
    throw HttpError(400, 'Invalid data passed into request');
  }

  const updateMessage = await Message.findOneAndUpdate(
    { _id: messageId },
    { $set: { emoji: '' } },
    {
      new: true,
    }
  ).exec();

  if (!updateMessage) throw HttpError(404, 'Message not found');

  // socket io functionality
  const receiverSocketId = getReceiverSocketId(receiver);
  const senderSocketId = getReceiverSocketId(sender);

  if (receiverSocketId && senderSocketId) {
    // io.to(socket_id).emit() used to send events to one specific clients - only sender and receiver
    io.to(receiverSocketId).emit('removeEmoji', { messageId });
    io.to(senderSocketId).emit('removeEmoji', { messageId });
  }

  res.status(200).json(updateMessage);
};

// GET MESSAGES

export const getMessages = async (req, res) => {
  const { id: receiver } = req.params; // my receiver
  const sender = req.user._id; // it`s me
  const { page: currentPage, limit: currentLimit } = req.query;

  const { page, limit, skip } = pagination(currentPage, currentLimit);

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

  if (!conversation)
    return res
      .status(200)
      .json({ messages: [], totalMessages: 0, totalPages: 0, currentPage: page, limit });

  const messages = await Message.find({ _id: { $in: conversation.messages } })
    .sort({ createdAt: 1 })
    .skip(skip) // Skip previous messages
    .limit(limit) // Limit the number of messages per page
    .populate([
      { path: 'sender', model: 'User', select: '_id fullName username avatar' },
      { path: 'receiver', model: 'User', select: '_id fullName username avatar' },
    ]);
  const totalMessages = conversation.messages.length;

  res.status(200).json({
    messages,
    totalMessages,
    totalPages: Math.ceil(totalMessages / limit),
    currentPage: page,
    limit,
  });
};

// DELETE MESSAGE
export const deleteMessage = async (req, res) => {
  const { id } = req.params;
  const senderId = req.user._id; // it`s me

  const message = await Message.findById({ _id: id }).populate('receiver');
  if (!message) throw HttpError(400, 'Message not found');
  const receiverId = message.receiver._id;

  await Message.findByIdAndDelete({ _id: id });

  const deletedConversationMessage = await Conversation.updateMany(
    {},
    { $pull: { messages: id } },
    { multi: true }
  );

  if (!deletedConversationMessage) throw HttpError(400, 'Message in coversation not found');

  // socket io functionality
  const receiverSocketId = getReceiverSocketId(receiverId);
  console.log('receiverSocketId: ', receiverSocketId);
  const senderSocketId = getReceiverSocketId(senderId);
  console.log('senderSocketId: ', senderSocketId);

  if ((receiverSocketId && senderSocketId) || senderSocketId) {
    // io.to(socket_id).emit() used to send events to one specific clients - only sender and receiver
    io.to(receiverSocketId).emit('deleteMessage', { id });
    io.to(senderSocketId).emit('deleteMessage', { id });
  }

  res.status(200).json({ info: 'Message success deleted' });
};

export default {
  getMessages: ctrlWrapper(getMessages),
  sendMessage: ctrlWrapper(sendMessage),
  sendEmoji: ctrlWrapper(sendEmoji),
  removeEmoji: ctrlWrapper(removeEmoji),
  deleteMessage: ctrlWrapper(deleteMessage),
};
