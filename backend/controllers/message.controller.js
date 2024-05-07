import { v2 as cloudinary } from 'cloudinary';

import { ctrlWrapper } from '../decorators/index.js';
import { HttpError } from '../helpers/index.js';
import { pagination } from '../utils/pagination.js';

import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';
import User from '../models/user.model.js';

import { getReceiverSocketId, io, userSocketMap } from '../socket/socket.js';
import { populateGroups } from '../utils/populateGroups.js';

//  @description - ADD MESSAGE
//  @route - POST /api/messages/send/:id

export const sendMessage = async (req, res) => {
  const { id: receiver } = req.params; // receiver
  const { type } = req.query;

  const { text, img, audio, video, quote, quotedId, emoji } = req.body;

  const sender = req.user._id; // its me

  if (!text && !img && !audio && !video) {
    throw HttpError(400, 'Invalid data passed into request');
  }

  let conversation;
  let receiverInfo;

  // check type
  if (type === 'private') {
    // If so, the recipient is a user
    receiverInfo = await User.findById(receiver);
    if (receiverInfo) {
      // If the user exists, we are looking for a conversation with this user
      conversation = await Conversation.findOne({
        participants: { $all: [sender, receiver] },
        isGroupChat: false,
      });
    }
  } else {
    // it's a group and look for the conversation by ID
    conversation = await Conversation.findById(receiver);
    // receiverInfo = receiver;
  }

  if (!conversation) {
    conversation = await Conversation.create({
      groupAdmin: null,
      participants: [sender, receiver],
      receiverType: type,
    });
  }

  const senderInfo = await User.findById({ _id: sender });

  // Get extended information about user groups and store it in the user object
  senderInfo.adminGroups = await populateGroups(senderInfo.adminGroups);
  senderInfo.groups = await populateGroups(senderInfo.groups);
  senderInfo.pinnedGroups = await populateGroups(senderInfo.pinnedGroups);

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
    const uploadResponse = await cloudinary.uploader.upload(audio, {
      folder: 'chat/audio',
      public_id: `chat-${sender}-${Date.now()}`,
      use_filename: true,
      resource_type: 'video',
    });

    audioUrl = uploadResponse.secure_url;
  }
  if (video) {
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
    receiver: conversation.receiverType === 'private' ? receiverInfo : conversation,
    onModel: conversation.receiverType === 'private' ? 'User' : 'Conversation',
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
  if (type === 'group') {
    conversation.participants.forEach((participant) => {
      if (participant._id.toString() === sender._id.toString()) {
        return;
      }
      const participantSocketId = userSocketMap[participant._id.toString()];

      if (participantSocketId) {
        io.to(participantSocketId).emit('newMessage', newMessage);
      }
    });
  } else {
    const receiverSocketId = getReceiverSocketId(receiver);

    if (receiverSocketId) {
      // io.to(socket_id).emit() used to send events to one specific clients
      io.to(receiverSocketId).emit('newMessage', newMessage);
    }
  }

  res.status(201).json(newMessage);
};

// ----------------------------------------

//  @description - SEND EMOJI
//  @route - PATCH /:id/emoji/:messageId

export const sendEmoji = async (req, res) => {
  const { id: receiver, messageId } = req.params;
  const sender = req.user._id; // it`s me
  const { emoji } = req.body;
  const { type } = req.query;

  if (!emoji && !messageId) {
    throw HttpError(400, 'Invalid data passed into request');
  }

  const message = await Message.findById(messageId);
  const existingEmoji = message.emoji.findIndex(
    ({ userId, value }) => userId.toString() === sender.toString()
  );

  let updateMessage;
  if (existingEmoji >= 0) {
    // If the emoji is already added, update it using the map method
    const updatedEmojis = message.emoji.map((emojiItem) =>
      emojiItem.userId.toString() === sender.toString() ? emoji : emojiItem
    );
    updateMessage = await Message.findByIdAndUpdate(
      messageId,
      { emoji: updatedEmojis },
      { new: true }
    );
  } else {
    // If the emoji has not yet been added, add it using the $push operator
    updateMessage = await Message.findByIdAndUpdate(messageId, { $push: { emoji } }, { new: true });
  }

  if (!updateMessage) throw HttpError(404, 'Message not found');

  let conversation;

  if (type === 'group') {
    conversation = await Conversation.findById(receiver);
  }

  // socket io functionality
  const receiverSocketId = getReceiverSocketId(receiver);
  const senderSocketId = getReceiverSocketId(sender);

  if (type === 'group') {
    conversation.participants.forEach((participant) => {
      const participantSocketId = userSocketMap[participant._id.toString()];

      if (participantSocketId) {
        io.to(participantSocketId).emit('addEmoji', { messageId, emoji });
      }
    });
  } else {
    if ((receiverSocketId && senderSocketId) || senderSocketId) {
      // io.to(socket_id).emit() used to send events to one specific clients - only sender and receiver
      io.to(senderSocketId).emit('addEmoji', { messageId, emoji });
      io.to(receiverSocketId).emit('addEmoji', { messageId, emoji });
    }
  }

  res.status(200).json(updateMessage);
};

// ----------------------------------------

//  @description - REMOVE EMOJI
//  @route - PATCH /:id/emoji-remove/:messageId

export const removeEmoji = async (req, res) => {
  const { id: receiver, messageId } = req.params;
  const sender = req.user._id; // its me
  const { type } = req.query;
  const { emoji } = req.body;

  if (!messageId) {
    throw HttpError(400, 'Invalid data passed into request');
  }

  const message = await Message.findById(messageId);

  const existingEmoji = message.emoji.find(
    ({ userId, value }) => userId.toString() === sender.toString() && value === emoji.value
  );

  let updateMessage;

  if (existingEmoji) {
    updateMessage = await Message.findOneAndUpdate(
      { _id: messageId },
      { $pull: { emoji: existingEmoji } },
      {
        new: true,
      }
    ).exec();
  } else {
    throw HttpError(404, 'Sorry, you are not allowed to delete emojis added by other users.');
  }

  if (!updateMessage) throw HttpError(404, 'Not found message');

  let conversation;

  if (type === 'group') {
    conversation = await Conversation.findById(receiver);
  }

  // socket io functionality
  const receiverSocketId = getReceiverSocketId(receiver);
  const senderSocketId = getReceiverSocketId(sender);

  if (type === 'group') {
    conversation.participants.forEach((participant) => {
      const participantSocketId = userSocketMap[participant._id.toString()];

      if (participantSocketId) {
        io.to(participantSocketId).emit('removeEmoji', { messageId, emoji });
      }
    });
  } else {
    if ((receiverSocketId && senderSocketId) || senderSocketId) {
      // io.to(socket_id).emit() used to send events to one specific clients - only sender and receiver
      io.to(receiverSocketId).emit('removeEmoji', { messageId, emoji });
      io.to(senderSocketId).emit('removeEmoji', { messageId, emoji });
    }
  }

  res.status(200).json(updateMessage);
};

// ----------------------------------------

//  @description - GET ALL MESSAGES
//  @route - GET /:id

export const getMessages = async (req, res) => {
  const { id: receiver } = req.params; // my receiver

  const sender = req.user._id; // it`s me
  const { page: currentPage, limit: currentLimit, type } = req.query;

  const { page, limit, skip } = pagination(currentPage, currentLimit);

  if (!receiver) throw HttpError(400, 'Receiver ID is required');

  let conversation;

  if (type === 'private') {
    // If type === 'private', assume it is a user
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
    }
  } else {
    // assume it's a group and look for the conversation by ID
    conversation = await Conversation.findById(receiver);
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
        model: type === 'private' ? 'User' : 'Conversation',
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

// ----------------------------------------

//  @description - DELETE MESSAGE
//  @route - DELETE /delete/:id

export const deleteMessage = async (req, res) => {
  const { id } = req.params;
  const senderId = req.user._id; // it`s me
  const { type } = req.query;

  const message = await Message.findById({ _id: id }).populate('receiver');
  if (!message) throw HttpError(400, 'Message not found');
  const receiverId = message.receiver._id;

  let conversation;

  if (type === 'group') {
    conversation = await Conversation.findOne({ messages: { $in: id } });
  }

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

  if (type === 'group') {
    io.to('group_' + conversation.chatName).emit('deleteMessage', { id });
  } else {
    if ((receiverSocketId && senderSocketId) || senderSocketId) {
      // io.to(socket_id).emit() used to send events to one specific clients - only sender and receiver
      io.to(receiverSocketId).emit('deleteMessage', { id });
      io.to(senderSocketId).emit('deleteMessage', { id });
    }
  }

  res.status(200).json({ info: 'Message successfully deleted' });
};

// ----------------------------------------

//  @description - EDIT MESSAGE
//  @route - PUT /edit/:id/:messageId

export const editMessage = async (req, res) => {
  const { text } = req.body;
  const { id: receiverId, messageId } = req.params;
  const { type } = req.query;

  const senderId = req.user.id;

  let conversation;

  if (type === 'group') {
    conversation = await Conversation.findById(receiverId);
  }

  const updatedMessage = await Message.findByIdAndUpdate(messageId, { text }, { new: true });

  if (!updatedMessage) throw HttpError(404, `Message with id=${messageId} not found`);

  // socket io functionality
  const receiverSocketId = getReceiverSocketId(receiverId);
  const senderSocketId = getReceiverSocketId(senderId);

  if (type === 'group') {
    io.to('group_' + conversation.chatName).emit('editMessageReceiver', { messageId, text });
  } else {
    if ((receiverSocketId && senderSocketId) || senderSocketId) {
      // io.to(socket_id).emit() used to send events to one specific clients - only sender and receiver
      io.to(receiverSocketId).emit('editMessageReceiver', { messageId, text });
      io.to(senderSocketId).emit('editMessageSender', { messageId, text });
    }
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
