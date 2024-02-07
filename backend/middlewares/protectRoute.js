import jwt from 'jsonwebtoken';

import User from '../models/user.model.js';
import { HttpError } from '../helpers/index.js';

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      throw HttpError(401, 'Unauthorized - No Token Provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      throw HttpError(401, 'Unauthorized - Invalid Token');
    }

    //   userId from generateTokenAndSetCookie
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      throw HttpError(404, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    console.log('Error in protectRoute middleware: ', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default protectRoute;
