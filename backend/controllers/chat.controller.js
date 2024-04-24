import { v2 as cloudinary } from 'cloudinary';

import { ctrlWrapper } from '../decorators/index.js';
import { HttpError } from '../helpers/index.js';
import Conversation from '../models/conversation.model.js';
import User from '../models/user.model.js';

// @description     Create New Group Chat
// @route           POST /api/chat/group

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

  // Add the ID of the newly created group to the list of groups for each user
  // Update each user in the group
  await Promise.all(
    users.map(async (user) => {
      await User.findByIdAndUpdate(user._id, { $addToSet: { groups: groupChat._id } });
      // If the user is an admin, add a new group to his adminGroups list
      if (user === sender) {
        await User.findByIdAndUpdate(user._id, { $addToSet: { adminGroups: groupChat._id } });
      }
    })
  );

  const getDetailedGroupChat = await Conversation.findOne({ _id: groupChat._id })
    .populate('participants', '-password')
    .populate('groupAdmin', '-password');

  res.status(201).json(getDetailedGroupChat);
};

//  @description - update group chat
// @route        - PUT /api/chat/group-edit/:groupId
export const updateGroupChat = async (req, res) => {
  const { groupId } = req.params;

  const { chatname, users, chatAvatar } = req.body;

  if (!users && !chatname && !chatAvatar) {
    throw HttpError(400, 'Invalid data passed into request');
  }

  if (users && users.length < 2)
    throw HttpError(400, 'More than 2 users are required to form a group chat');

  if (chatname) {
    const groupExists = await Conversation.findOne({ chatName: chatname, _id: { $ne: groupId } });
    if (groupExists) throw HttpError(400, 'Group name already exists');
  }

  let avatarUrl;

  if (chatAvatar) {
    if (groupId) {
      await cloudinary.uploader.destroy(`group_${groupId}`);
    }

    if (chatAvatar.startsWith('data:image')) {
      const uploadedResponse = await cloudinary.uploader.upload(chatAvatar, {
        folder: 'group',
        public_id: `group_${groupId}`,
        use_filename: true,
        transformation: [
          { gravity: 'face', height: 200, width: 200, crop: 'fill' },
          { radius: 'max' },
          { fetch_format: 'auto' },
        ],
      });
      avatarUrl = uploadedResponse.secure_url;
    }
  }

  const updateData = {
    ...(chatname && { chatName: chatname }),
    ...(avatarUrl && { chatAvatar: avatarUrl }),
    ...(users && { participants: users }),
  };

  const updatedGroupChat = await Conversation.findOneAndUpdate({ _id: groupId }, updateData, {
    new: true,
  });

  if (!updatedGroupChat) throw HttpError(404, `Group with id=${groupId} not found`);

  const getDetailedGroupChat = await Conversation.findOne({ _id: updatedGroupChat._id })
    .populate('participants', '-password')
    .populate('groupAdmin', '-password');

  res.status(200).json(getDetailedGroupChat);
};

// @description     Create PINNED GROUP
// @route           POST /api/chat/group/:id/pin-group

export const pinGroupChat = async (req, res) => {
  const { groupId } = req.params;
  const sender = req.user; // it`s me

  const user = await User.findById({ _id: sender._id });

  if (!user) throw HttpError(404, 'User not found');

  const index = user.pinnedGroups.indexOf(groupId);

  if (index !== -1) {
    user.pinnedGroups.splice(index, 1);
  } else {
    user.pinnedGroups.push(groupId);
  }
  await user.save();

  res.status(201).json(user.pinnedGroups);
};

export default {
  createGroupChat: ctrlWrapper(createGroupChat),
  updateGroupChat: ctrlWrapper(updateGroupChat),
  pinGroupChat: ctrlWrapper(pinGroupChat),
};
