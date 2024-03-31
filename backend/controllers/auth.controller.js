import bcrypt from 'bcryptjs';

import User from '../models/user.model.js';

import { HttpError } from '../helpers/index.js';
import { ctrlWrapper } from '../decorators/index.js';
import generateTokenAndSetCookie from '../utils/generateToken.js';

// @description - SIGNUP
const signup = async (req, res) => {
  const { username, password, confirmPassword, gender } = req.body;

  if (password !== confirmPassword) {
    throw HttpError(400, 'Passwords don`t match');
  }

  const userExists = await User.findOne({ username });

  if (userExists) {
    throw HttpError(400, 'Username already exists');
  }

  //   hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  //   avatar
  const manAvatar =
    'https://res.cloudinary.com/dkqxaid79/image/upload/v1711450156/rewievs/man-emoji.png';
  const womanAvatar =
    'https://res.cloudinary.com/dkqxaid79/image/upload/v1711450156/rewievs/female-emoji.png';

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatar: gender === 'female' ? womanAvatar : manAvatar,
    isAdmin: false,
  });

  if (!newUser) {
    throw HttpError(400, 'Invalid user data');
  }

  // generate token and set cookies
  generateTokenAndSetCookie(newUser._id, res);

  res.status(201).json({
    _id: newUser._id,
    fullName: newUser.fullName,
    username: newUser.username,
    avatar: newUser.avatar,
    isAdmin: newUser.isAdmin,
  });
};

// @description - LOGIN
const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  const isCorrectPassword = await bcrypt.compare(password, user?.password || '');

  if (!user || !isCorrectPassword) {
    throw HttpError(400, 'Username or password incorrect');
  }

  generateTokenAndSetCookie(user._id, res);

  res.status(200).json({
    _id: user._id,
    fullName: user.fullName,
    username: user.username,
    avatar: user.avatar,
    isAdmin: user.isAdmin,
  });
};

// @description - LOGOUT
const logout = (req, res) => {
  res.cookie('jwt', '', { maxAge: 0 });
  res.status(200).json({ message: 'Successfully logged out' });
};

export default {
  signup: ctrlWrapper(signup),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
};
