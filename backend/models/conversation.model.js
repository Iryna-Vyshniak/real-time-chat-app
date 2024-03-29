import { Schema, model } from 'mongoose';

import { addUpdateSettings, handleMongooseError } from '../helpers/index.js';

const conversationSchema = new Schema(
  {
    chatName: { type: String, trim: true, default: 'New group' },
    chatAvatar: { type: String, default: '' },
    isGroupChat: { type: Boolean, default: false },
    groupAdmin: { type: Schema.Types.ObjectId, ref: 'User' },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unreadMessages: {
          type: Number,
          default: 0,
        },
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Message',
        default: [],
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

conversationSchema.post('save', handleMongooseError);
conversationSchema.pre('findOneAndUpdate', addUpdateSettings);
conversationSchema.post('findOneAndUpdate', handleMongooseError);

const Conversation = model('Conversation', conversationSchema);

export default Conversation;
