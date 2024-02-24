import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';

import { ctrlWrapper } from '../decorators/index.js';
import { HttpError } from '../helpers/index.js';

import Message from '../models/message.model.js';
import User from '../models/user.model.js';

const getUsersForSidebar = async (req, res) => {
  const loggedInUserId = req.user._id;

  // find all users but don`t find user who is logged in and can see all users (conversations) on sidebar because we don`t want to send message to us
  const allFilteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-password');

  // Get the last unread messages from each sender
  //   $match: Це етап фільтрації. Записи, які відповідають критеріям, зазначеним у цьому об'єкті, залишаються. У цьому випадку, фільтрується колекція повідомлень, вибираючи лише ті, які мають отримувача (receiverId) рівного loggedInUserId і які ще не були прочитані (read: false).

  // $sort: Це етап сортування. Записи сортуються за значенням поля createdAt у зворотньому порядку (-1), що означає від найновіших до найдавніших.

  // $group: Групує записи на основі певного поля. В даному випадку, записи групуються за значенням поля senderId. Під час групування, кожній групі присвоюється властивість lastMessages, яка містить масив об'єктів, що представляють кожен запис у цій групі.

  // $unwind: Це етап "розгортання" масиву. Використовується для розгортання масиву в окремі документи, щоб його можна було подальше обробити.

  // $project: Визначає поля, які будуть включені у вихідні дані. У цьому випадку, вихідні дані будуть містити _id з значенням senderId (встановлене на попередньому етапі групування) і lastMessage, який містить повний запис останнього повідомлення.
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
        _id: '$senderId',
        lastMessages: { $addToSet: '$$ROOT' },
      },
    },
    {
      $unwind: '$lastMessages',
    },
    {
      $project: {
        _id: '$lastMessages.senderId',
        lastMessage: '$lastMessages',
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
};
