import { ctrlWrapper } from '../decorators/index.js';
import User from '../models/user.model.js';

const getUsersForSidebar = async (req, res) => {
  const loggedInUserId = req.user._id;

  // find all users but don`t find user who is logged in and can see all users (conversations) on sidebar because we don`t want to send message to us
  const allFilteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-password');

  res.status(200).json(allFilteredUsers);
};

export default {
  getUsersForSidebar: ctrlWrapper(getUsersForSidebar),
};
