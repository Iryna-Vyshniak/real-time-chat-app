import { Schema, model } from 'mongoose';

import { addUpdateSettings, handleMongooseError } from '../helpers/index.js';

const messageSchema = new Schema(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation' },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'onModel',
    },
    onModel: {
      type: String,
      enum: ['User', 'Conversation'],
      required: true,
    },
    text: {
      type: String,
      trim: true,
      default: '',
    },
    img: {
      type: String,
      default: '',
    },
    audio: String,
    video: String,
    emoji: {
      type: [
        {
          userId: { type: Schema.Types.ObjectId, ref: 'User' },
          value: String,
        },
      ],
      default: [],
    },
    read: {
      type: Boolean,
      default: false,
    },
    quote: { type: Boolean, default: false },
    repliedTo: { type: Schema.Types.ObjectId, ref: 'Message', default: null },
  },

  { versionKey: false, timestamps: true }
);

messageSchema.post('save', handleMongooseError);
messageSchema.pre('findOneAndUpdate', addUpdateSettings);
messageSchema.post('findOneAndUpdate', handleMongooseError);

const Message = model('Message', messageSchema);

export default Message;
