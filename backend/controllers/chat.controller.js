// @description     Create New Group Chat
// @route           POST /api/chat/group

import { ctrlWrapper } from '../decorators/index.js';
import { HttpError } from '../helpers/index.js';
import Conversation from '../models/conversation.model.js';

export const createGroupChat = async (req, res) => {
  const { users, chatname } = req.body;
  const sender = req.user; // it`s me

  if (!users || !chatname) throw HttpError(400, 'Please fill all the fields');

  if (users.length < 2) throw HttpError(400, 'More than 2 users are required to form a group chat');

  const groupExists = await Conversation.findOne({ chatName: chatname });

  if (groupExists) throw HttpError(400, 'Group name already exists');

  users.push(sender);

  const chatAvatar =
    'https://res.cloudinary.com/dkqxaid79/image/upload/v1711736617/rewievs/_164725b1-a04a-4569-ad20-b93366fbd282_uu2kqo.jpg';

  const groupChat = await Conversation.create({
    chatName: chatname,
    chatAvatar,
    isGroupChat: true,
    participants: users,
    groupAdmin: sender,
    receiverType: 'group',
  });

  const getDetailedGroupChat = await Conversation.findOne({ _id: groupChat._id })
    .populate('participants', '-password')
    .populate('groupAdmin', '-password');

  res.status(201).json(getDetailedGroupChat);
};

export default {
  createGroupChat: ctrlWrapper(createGroupChat),
};
