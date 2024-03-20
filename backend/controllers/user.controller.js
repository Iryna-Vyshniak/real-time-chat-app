import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';

import { ctrlWrapper } from '../decorators/index.js';
import { HttpError } from '../helpers/index.js';

import Message from '../models/message.model.js';
import User from '../models/user.model.js';

// get user for info
const getUserInfo = async (req, res) => {
  const { id } = req.params;

  const user = await User.findOne({ _id: id });

  if (!user) throw HttpError(404, 'User not found');

  res.status(200).json(user);
};

// get users for sidebar
const getUsersForSidebar = async (req, res) => {
  const loggedInUserId = req.user._id;

  // find all users but don`t find user who is logged in and can see all users (conversations) on sidebar because we don`t want to send message to us
  const allFilteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-password');

  // Get the last unread messages from each sender
  //   $match: Цей етап фільтрує записи, залишаючи лише ті, які відповідають вказаним умовам. У цьому випадку фільтрується колекція повідомлень, вибираючи ті, що мають отримувача (receiver) зі значенням, рівним loggedInUserId, і ще не були прочитані (read: false).

  // $sort: Цей етап сортує записи за значенням поля createdAt у зворотньому порядку (-1), щоб найновіші записи з'являлися першими.

  // $group: У цьому кроці записи групуються за значенням поля sender. Кожній групі присвоюється властивість lastMessages, яка містить масив об'єктів, представляючих кожен запис у цій групі.

  // $unwind: Цей етап "розгортає" масив lastMessages, розбиваючи його на окремі документи, щоб їх можна було подальше обробити.

  // $lookup: Виконує з'єднання з колекцією users, де значення поля _id у колекції Message (sender) збігається з значенням поля _id у колекції users. Результат з'єднання записується у поле senderInfo.

  // $unwind: Цей крок розгортає масив senderInfo, розбиваючи його на окремі документи.

  // Аналогічно до кроків 5-6, виконуються $lookup та $unwind для отримання даних про отримувача (receiverInfo).

  // $addFields: Додає до об'єкту lastMessages поля sender та receiver, які містять розгорнуті дані про відправника та отримувача.

  // $replaceRoot: Замінює корінь кожного документа на об'єкт lastMessages.

  // $project: Виключає поля senderInfo та receiverInfo з вихідних даних.
  const lastMessages = await Message.aggregate([
    {
      $match: {
        receiver: loggedInUserId,
        read: false,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: '$sender',
        lastMessages: { $addToSet: '$$ROOT' },
      },
    },
    {
      $unwind: '$lastMessages',
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'senderInfo',
      },
    },
    {
      $unwind: '$senderInfo',
    },
    {
      $lookup: {
        from: 'users',
        localField: 'lastMessages.receiver',
        foreignField: '_id',
        as: 'receiverInfo',
      },
    },
    {
      $unwind: '$receiverInfo',
    },
    {
      $addFields: {
        'lastMessages.sender': '$senderInfo',
        'lastMessages.receiver': '$receiverInfo',
      },
    },
    {
      $replaceRoot: { newRoot: '$lastMessages' },
    },
    {
      $project: {
        senderInfo: 0,
        receiverInfo: 0,
      },
    },
  ]);

  res.status(200).json({ allFilteredUsers, lastMessages });
};

// update unread messages
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

// update user profile
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
