import { v2 as cloudinary } from 'cloudinary';
import { Types } from 'mongoose';

import { ctrlWrapper } from '../decorators/index.js';
import { HttpError } from '../helpers/index.js';
import { pagination } from '../utils/pagination.js';

import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';
import User from '../models/user.model.js';

import { getReceiverSocketId, io } from '../socket/socket.js';

//  @description - ADD MESSAGE
export const sendMessage = async (req, res) => {
  const { id: receiver } = req.params; // receiver

  const { text, img, audio, video, quote, quotedId, emoji } = req.body;

  const sender = req.user._id; // its me

  if (!text && !img && !audio && !video) {
    throw HttpError(400, 'Invalid data passed into request');
  }

  let receiverType;
  let conversation;
  let receiverInfo;
  let hasGroupChat = false;

  // check whether the recipient ID is a valid ObjectId
  if (Types.ObjectId.isValid(receiver)) {
    // If so, assume the recipient is a user
    receiverType = 'user';
    receiverInfo = await User.findById(receiver);
    if (receiverInfo) {
      // If the user exists, we are looking for a conversation with this user
      conversation = await Conversation.findOne({
        participants: { $all: [sender, receiver] },
        isGroupChat: false,
      });
      hasGroupChat = false;
    } else {
      // If the user doesn't exist, we assume it's a group and look for the conversation by ID
      receiverType = 'group';
      conversation = await Conversation.findById(receiver);
      receiverInfo = receiver;
      hasGroupChat = true;
    }
  }

  if (!conversation) {
    conversation = await Conversation.create({
      groupAdmin: null,
      participants: [sender, receiver],
      receiverType,
    });
  }

  const senderInfo = await User.findById({ _id: sender });

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
    receiver: conversation.receiverType === 'user' ? receiverInfo : conversation._id,
    onModel: conversation.receiverType === 'user' ? 'User' : 'Conversation',
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
  if (hasGroupChat) {
    io.to('group_' + conversation.chatName).emit('newMessage', newMessage);
  } else {
    const receiverSocketId = getReceiverSocketId(receiver);

    if (receiverSocketId) {
      // io.to(socket_id).emit() used to send events to one specific clients
      io.to(receiverSocketId).emit('newMessage', newMessage);
    }
  }

  res.status(201).json(newMessage);
};

//  @description - SEND EMOJI
export const sendEmoji = async (req, res) => {
  const { id: receiver, messageId } = req.params;
  const sender = req.user._id; // it`s me
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

  if ((receiverSocketId && senderSocketId) || senderSocketId) {
    // io.to(socket_id).emit() used to send events to one specific clients - only sender and receiver
    io.to(senderSocketId).emit('addEmoji', { messageId, emoji });
    io.to(receiverSocketId).emit('addEmoji', { messageId, emoji });
  }

  res.status(200).json(updateMessage);
};

//  @description - REMOVE EMOJI
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

  if ((receiverSocketId && senderSocketId) || senderSocketId) {
    // io.to(socket_id).emit() used to send events to one specific clients - only sender and receiver
    io.to(receiverSocketId).emit('removeEmoji', { messageId });
    io.to(senderSocketId).emit('removeEmoji', { messageId });
  }

  res.status(200).json(updateMessage);
};

//  @description - GET ALL MESSAGES
export const getMessages = async (req, res) => {
  const { id: receiver } = req.params; // my receiver

  const sender = req.user._id; // it`s me
  const { page: currentPage, limit: currentLimit } = req.query;

  const { page, limit, skip } = pagination(currentPage, currentLimit);
  console.log('page: ', page);

  if (!receiver) throw HttpError(400, 'Receiver ID is required');

  let receiverType;
  let conversation;

  if (Types.ObjectId.isValid(receiver)) {
    // If receiver is a valid ObjectId, assume it is a user
    receiverType = 'user';
    const user = await User.findById(receiver);
    if (user) {
      // If the user exists, we are looking for a conversation with this user
      conversation = await Conversation.findOne({
        participants: { $all: [sender, receiver] },
        isGroupChat: false,
      }).populate({
        path: 'messages',
        populate: [
          { path: 'sender', model: 'User', select: '-password' },
          { path: 'receiver', model: 'User', select: '-password' },
        ],
      });
    } else {
      // If the user doesn't exist, we assume it's a group and look for the conversation by ID
      receiverType = 'group';
      conversation = await Conversation.findById(receiver);
    }
  }

  if (!conversation)
    return res
      .status(200)
      .json({ messages: [], totalMessages: 0, totalPages: 0, currentPage: page, limit });

  const messages = await Message.find({ _id: { $in: conversation.messages } })
    .sort({ createdAt: 1 })
    .skip(skip) // Skip previous messages
    .limit(limit) // Limit the number of messages per page
    .populate([
      { path: 'sender', model: 'User', select: '-password' },
      {
        path: 'receiver',
        model: receiverType === 'user' ? 'User' : 'Conversation',
        select: '-password',
      },
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

//  @description - DELETE MESSAGE
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
  const senderSocketId = getReceiverSocketId(senderId);

  if ((receiverSocketId && senderSocketId) || senderSocketId) {
    // io.to(socket_id).emit() used to send events to one specific clients - only sender and receiver
    io.to(receiverSocketId).emit('deleteMessage', { id });
    io.to(senderSocketId).emit('deleteMessage', { id });
  }

  res.status(200).json({ info: 'Message success deleted' });
};

//  @description - EDIT MESSAGE
export const editMessage = async (req, res) => {
  const { text } = req.body;
  const { id: receiverId, messageId } = req.params;

  const senderId = req.user.id;

  const updatedMessage = await Message.findByIdAndUpdate(messageId, { text }, { new: true });

  if (!updatedMessage) throw HttpError(404, `Message with id=${messageId} not found`);

  // socket io functionality
  const receiverSocketId = getReceiverSocketId(receiverId);
  const senderSocketId = getReceiverSocketId(senderId);

  if ((receiverSocketId && senderSocketId) || senderSocketId) {
    // io.to(socket_id).emit() used to send events to one specific clients - only sender and receiver
    io.to(receiverSocketId).emit('editMessageReceiver', { messageId, text });
    io.to(senderSocketId).emit('editMessageSender', { messageId, text });
  }

  res.status(200).json(updatedMessage);
};

export default {
  getMessages: ctrlWrapper(getMessages),
  sendMessage: ctrlWrapper(sendMessage),
  sendEmoji: ctrlWrapper(sendEmoji),
  removeEmoji: ctrlWrapper(removeEmoji),
  deleteMessage: ctrlWrapper(deleteMessage),
  editMessage: ctrlWrapper(editMessage),
};
