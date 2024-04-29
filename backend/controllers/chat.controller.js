import { v2 as cloudinary } from 'cloudinary';

import { ctrlWrapper } from '../decorators/index.js';
import { HttpError } from '../helpers/index.js';

import Conversation from '../models/conversation.model.js';
import User from '../models/user.model.js';
import Message from '../models/message.model.js';

import { io, userSocketMap } from '../socket/socket.js';

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

  // SOCKET
  getDetailedGroupChat.participants.forEach((participant) => {
    if (participant._id.toString() === sender._id.toString()) {
      return;
    }
    const participantSocketId = userSocketMap[participant._id.toString()];

    if (participantSocketId) {
      io.to(participantSocketId).emit('groupCreated', getDetailedGroupChat);
    }
  });

  res.status(201).json(getDetailedGroupChat);
};

//  @description - update group chat
// @route        - PUT /api/chat/group-edit/:groupId
export const updateGroupChat = async (req, res) => {
  const { groupId } = req.params;
  const sender = req.user;

  const { chatname, users, chatAvatar } = req.body;

  if (users.length < 3) {
    // Find the user who sent the request
    const user = await User.findById({ _id: sender._id });

    if (!user) throw HttpError(404, 'User not found');

    // Remove the group from the user's groups, pinned groups, and admin groups lists
    user.groups = user.groups.filter((group) => group !== groupId);
    user.pinnedGroups = user.pinnedGroups.filter((group) => group !== groupId);
    user.adminGroups = user.adminGroups.filter((group) => group !== groupId);

    // Delete the group, delete all group messages and save the updated user
    await Promise.all([
      Conversation.findByIdAndDelete(groupId),
      Message.deleteMany({ conversationId: groupId }),
      user.save(),
    ]);

    // Remove the group from the lists of all group members
    await Promise.all(
      users.map(async ({ _id }) => {
        await User.findByIdAndUpdate(_id, {
          $pull: { groups: groupId, pinnedGroups: groupId, adminGroups: groupId },
        });
      })
    );
    return;
  }

  if (!chatname && !chatAvatar) {
    throw HttpError(400, 'Invalid data passed into request');
  }

  if (chatname) {
    const groupExists = await Conversation.findOne({ chatName: chatname, _id: { $ne: groupId } });
    if (groupExists) throw HttpError(400, 'Group name already exists');
  }

  // Add the ID of the newly edited group to the list of groups for each user
  // Update each user in the group
  await Promise.all(
    users.map(async (user) => {
      await User.findByIdAndUpdate(user._id, { $addToSet: { groups: groupId } });
    })
  );

  let avatarUrl;

  if (chatAvatar) {
    if (groupId) {
      await cloudinary.uploader.destroy(`group/group_${groupId}`);
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

  const pastGroupChat = await Conversation.findById(groupId).populate('participants', '-password');

  const updatedGroupChat = await Conversation.findOneAndUpdate({ _id: groupId }, updateData, {
    new: true,
  });

  if (!updatedGroupChat) throw HttpError(404, `Group with id=${groupId} not found`);

  const getDetailedGroupChat = await Conversation.findOne({ _id: updatedGroupChat._id })
    .populate('participants', '-password')
    .populate('groupAdmin', '-password');

  // SOCKET
  // Get the IDs of the past participants
  const pastParticipantIds = pastGroupChat.participants.map((participant) =>
    participant._id.toString()
  );

  // Find the new participants
  const updatedParticipants = getDetailedGroupChat.participants.filter(
    (participant) => !pastParticipantIds.includes(participant._id.toString())
  );

  // Find the old participants
  const oldParticipants = getDetailedGroupChat.participants.filter((participant) =>
    pastParticipantIds.includes(participant._id.toString())
  );

  // Emit 'groupUpdated' to old participants
  oldParticipants.forEach((participant) => {
    if (participant._id.toString() === sender._id.toString()) {
      return;
    }
    const participantSocketId = userSocketMap[participant._id.toString()];
    if (participantSocketId) {
      io.to(participantSocketId).emit('groupUpdated', getDetailedGroupChat);
    }
  });

  // Emit 'groupCreated' to new participants
  updatedParticipants.forEach((participant) => {
    if (participant._id.toString() === sender._id.toString()) {
      return;
    }
    const participantSocketId = userSocketMap[participant._id.toString()];
    if (participantSocketId) {
      io.to(participantSocketId).emit('groupCreated', getDetailedGroupChat);
    }
  });

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

// @description     DELETE USER FROM GROUP
// @route           DELETE /api/chat/group/:groupId/delete-user

export const deleteUserFromGroup = async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;
  const sender = req.user;

  const user = await User.findById({ _id: userId });

  if (!user) throw HttpError(404, 'User not found');

  const group = await Conversation.findById(groupId);

  // Remove the user from the group, remove the group from the user's lists, and save the updated user
  await Promise.all([
    User.findByIdAndUpdate(userId, {
      $pull: { groups: groupId, pinnedGroups: groupId, adminGroups: groupId },
    }),
    Conversation.findByIdAndUpdate(groupId, { $pull: { participants: userId } }, { multi: true }),
    user.save(),
  ]);

  // SOCKET
  if (user._id.toString() === sender._id.toString()) {
    return;
  }
  const participantSocketId = userSocketMap[user._id.toString()];

  if (participantSocketId) {
    io.to(participantSocketId).emit('groupDeleted', group);
  }
  res.status(200).json({ info: 'User successfully deleted' });
};

// @description     DELETE GROUP
// @route           DELETE /api/chat/group/:groupId

export const deleteGroup = async (req, res) => {
  const { groupId } = req.params;
  const { users } = req.body;

  const sender = req.user; // it`s me

  if (!users) throw HttpError(400, 'Please add users');

  let group;

  if (groupId) {
    group = await Conversation.findById(groupId);
    await cloudinary.uploader.destroy(`group/group_${groupId}`);
  }

  const user = await User.findById(sender);

  if (!user) throw HttpError(404, 'User not found');

  // Remove the group from the user's groups, pinned groups, and admin groups lists
  user.groups = user.groups.filter((group) => group !== groupId);
  user.pinnedGroups = user.pinnedGroups.filter((group) => group !== groupId);
  user.adminGroups = user.adminGroups.filter((group) => group !== groupId);

  // Delete the group, delete all group messages and save the updated user
  await Promise.all([
    Conversation.findByIdAndDelete(groupId),
    Message.deleteMany({ conversationId: groupId }),
    user.save(),
  ]);

  // Remove the group from the lists of all group members
  await Promise.all(
    users.map(async ({ _id }) => {
      await User.findByIdAndUpdate(_id, {
        $pull: { groups: groupId, pinnedGroups: groupId, adminGroups: groupId },
      });
    })
  );

  // SOCKET
  users.forEach((user) => {
    if (user._id.toString() === sender._id.toString()) {
      return;
    }
    const participantSocketId = userSocketMap[user._id.toString()];

    if (participantSocketId) {
      io.to(participantSocketId).emit('groupDeleted', group);
    }
  });

  res.status(200).json({ info: 'Group successfully deleted' });
};

export default {
  createGroupChat: ctrlWrapper(createGroupChat),
  updateGroupChat: ctrlWrapper(updateGroupChat),
  pinGroupChat: ctrlWrapper(pinGroupChat),
  deleteUserFromGroup: ctrlWrapper(deleteUserFromGroup),
  deleteGroup: ctrlWrapper(deleteGroup),
};
