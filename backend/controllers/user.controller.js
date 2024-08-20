import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';

import { ctrlWrapper } from '../decorators/index.js';
import { HttpError } from '../helpers/index.js';
import { populateGroups } from '../utils/populateGroups.js';

import Message from '../models/message.model.js';
import User from '../models/user.model.js';
import Conversation from '../models/conversation.model.js';

// @description - get user for info
const getUserInfo = async (req, res) => {
  const { id } = req.params;

  const user = await User.findOne({ _id: id });

  if (!user) throw HttpError(404, 'User not found');

  // Get extended information about user groups and store it in the user object
  user.adminGroups = await populateGroups(user.adminGroups);
  user.groups = await populateGroups(user.groups);
  user.pinnedGroups = await populateGroups(user.pinnedGroups);

  res.status(200).json(user);
};

// @description - get users for sidebar
const getUsersForSidebar = async (req, res) => {
  const loggedInUserId = req.user._id;

  // find all users but don`t find user who is logged in and can see all users (conversations) on sidebar because we don`t want to send message to us
  const allFilteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-password');

  // Get extended information about groups for each user and store it in the user object
  const populateGroupsForUsers = async (users) => {
    const populatedUsers = await Promise.all(
      users.map(async (user) => {
        user.adminGroups = await populateGroups(user.adminGroups);
        user.groups = await populateGroups(user.groups);
        user.pinnedGroups = await populateGroups(user.pinnedGroups);
        return user;
      })
    );
    return populatedUsers;
  };

  const usersWithExtendedGroups = await populateGroupsForUsers(allFilteredUsers);

  // Get the last unread messages from each sender
  const unreadMessages = await Message.aggregate([
    {
      // Join with the 'conversations' collection using the 'conversationId' field
      $lookup: {
        from: 'conversations',
        localField: 'conversationId',
        foreignField: '_id',
        as: 'conversation',
      },
    },
    // Flatten the 'conversation' array into separate documents
    { $unwind: '$conversation' },
    // Flatten the 'participants' array in 'conversation' into separate documents
    { $unwind: '$conversation.participants' },
    {
      // Filter for unread messages where the logged in user is a participant and not the sender
      $match: {
        read: false,
        'conversation.participants': loggedInUserId,
        sender: { $ne: loggedInUserId },
      },
    },
    {
      // Join with the 'conversations' collection again to match conversations where the logged in user is a participant
      $lookup: {
        from: 'conversations',
        let: { conversationId: '$conversationId', userId: loggedInUserId },
        pipeline: [
          {
            //  match conversations where the logged in user is a participant
            // and the conversation ID matches the one in the message
            $match: {
              $expr: {
                $or: [
                  // For private conversations
                  {
                    $and: [
                      { $eq: ['$_id', '$$conversationId'] },
                      { $eq: ['$isGroupChat', false] },
                      { $in: [loggedInUserId, '$participants'] },
                    ],
                  },
                  // For group conversations
                  {
                    $and: [
                      { $eq: ['$_id', '$$conversationId'] },
                      { $eq: ['$isGroupChat', true] },
                      { $in: [loggedInUserId, '$participants'] },
                    ],
                  },
                ],
              },
            },
          },
        ],
        as: 'conversation',
      },
    },
    //  flatten the 'conversation' array into separate documents
    { $unwind: '$conversation' },
    {
      // Join with the 'users' collection to get receiver info
      $lookup: {
        from: 'users',
        localField: 'receiver',
        foreignField: '_id',
        as: 'receiverInfo',
      },
    },
    {
      // Replace the 'receiver' field with the first element of 'receiverInfo'
      $addFields: {
        receiver: { $arrayElemAt: ['$receiverInfo', 0] },
      },
    },
    {
      // Join with the 'users' collection to get sender info
      $lookup: {
        from: 'users',
        localField: 'sender',
        foreignField: '_id',
        as: 'senderInfo',
      },
    },
    {
      // Replace the 'sender' field with the first element of 'senderInfo'
      $addFields: {
        sender: { $arrayElemAt: ['$senderInfo', 0] },
      },
    },
    {
      // Join with the 'conversations' collection to get group details
      $lookup: {
        from: 'conversations',
        localField: 'sender.groups',
        foreignField: '_id',
        as: 'groupDetails',
      },
    },
    {
      // Join with the 'conversations' collection to get admin group details
      $lookup: {
        from: 'conversations',
        localField: 'sender.adminGroups',
        foreignField: '_id',
        as: 'adminGroupDetails',
      },
    },
    {
      // Replace the 'sender.groups' and 'sender.adminGroups' fields with 'groupDetails' and 'adminGroupDetails'
      $addFields: {
        'sender.groups': '$groupDetails',
        'sender.adminGroups': '$adminGroupDetails',
      },
    },
    // Remove the 'receiverInfo', 'senderInfo', 'groupDetails', and 'adminGroupDetails' fields as they're no longer needed
    { $unset: ['receiverInfo', 'senderInfo', 'groupDetails', 'adminGroupDetails'] },
    // add the 'onModel' field to the document
    { $addFields: { onModel: '$onModel' } },
    {
      // project (select) the fields we are interested in
      $project: {
        _id: 1,
        conversationId: '$conversation._id',
        receiver: {
          $cond: [{ $eq: ['$conversation.isGroupChat', true] }, '$conversation', '$receiver'],
        },
        sender: {
          $cond: [
            { $eq: ['$conversation.isGroupChat', false] },
            {
              _id: '$sender._id',
              avatar: '$sender.avatar',
              fullName: '$sender.fullName',
              gender: '$sender.gender',
              username: '$sender.username',
              adminGroups: '$sender.adminGroups',
              groups: '$sender.groups',
              createdAt: '$sender.createdAt',
            },
            {},
          ],
        },
      },
    },
  ]);

  // filter chats where user is a participant and add fields with participants and admin info
  const userGroupChats = await Conversation.find({
    isGroupChat: true,
    participants: loggedInUserId,
  })
    .populate('participants', '-password')
    .populate('groupAdmin', '-password');

  res.status(200).json({
    allFilteredUsers: usersWithExtendedGroups,
    unreadMessages,
    userGroupChats,
  });
};

// @description -  update unread messages
const updateMessageStatus = async (req, res) => {
  const { id } = req.body;
  const filter = { senderId: id };
  const update = { read: true };
  const options = { new: true };

  const message = await Message.updateMany(filter, update, options);

  if (!message) {
    throw HttpError(404, 'Message not found or does not belong to the user.');
  } else {
    res.status(200).json({ status: 'OK' });
  }
};

// @description - update user profile
const updateUser = async (req, res) => {
  const { fullName, username, password, gender, avatar } = req.body;

  const userId = req.user.id;

  const user = await User.findById(userId);

  if (!user) {
    throw HttpError(400, 'User not found');
  }

  if (req.params.id !== userId.toString()) {
    throw HttpError(400, 'You can`t change other user`s profile');
  }

  if (password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
  }

  if (avatar) {
    let avatarUrl = avatar;

    if (user.avatar && user._id) {
      await cloudinary.uploader.destroy(`avatar_${user._id}`);
    }

    if (avatar.startsWith('data:image')) {
      const uploadedResponse = await cloudinary.uploader.upload(avatar, {
        folder: 'chat',
        public_id: `avatar_${user._id}`,
        use_filename: true,
        transformation: [
          { gravity: 'face', height: 200, width: 200, crop: 'fill' },
          { radius: 'max' },
          { fetch_format: 'auto' },
        ],
      });
      avatarUrl = uploadedResponse.secure_url;
    }

    user.avatar = avatarUrl;
  }

  // Only update fields if they are provided
  user.fullName = fullName || user.fullName;
  user.username = username || user.username;
  user.gender = gender || user.gender;

  // Save user with updated data
  const updatedUser = await user.save();

  // Avoid sending password in response
  updatedUser.password = null;

  res.status(200).json(updatedUser);
};

export default {
  getUsersForSidebar: ctrlWrapper(getUsersForSidebar),
  updateMessageStatus: ctrlWrapper(updateMessageStatus),
  updateUser: ctrlWrapper(updateUser),
  getUserInfo: ctrlWrapper(getUserInfo),
};
