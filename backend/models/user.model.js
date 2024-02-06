import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female'],
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const User = model('User', userSchema);

export default User;
