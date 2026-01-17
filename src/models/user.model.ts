import mongoose from 'mongoose';
import { isEmail } from '../utils/helper';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: isEmail,
      message: "Please enter a valid email"
    }
  },
  password: {
    type: String,
    select: false
  },
  name: {
    type: String,
    required: true
  },
  googleId: {
    type: String,
    unique: true
  }
}, { timestamps: true });

export const UserModel = mongoose.model('User', userSchema);