import { HttpError } from '../helpers/index.js';

export const uploadMiddleware = (req, res, next) => {
  // Check if the file has arrived and if its size exceeds 5MB
  if (req.files && req.files.img.size > 5 * 1024 * 1024) {
    throw HttpError(400, 'File size exceeds 5 MB');
  }
  next();
};
