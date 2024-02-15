import { Schema, model } from 'mongoose';

import { addUpdateSettings, handleMongooseError } from '../helpers/index.js';

const messageSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

messageSchema.post('save', handleMongooseError);
messageSchema.pre('findOneAndUpdate', addUpdateSettings);
messageSchema.post('findOneAndUpdate', handleMongooseError);

const Message = model('Message', messageSchema);

export default Message;
