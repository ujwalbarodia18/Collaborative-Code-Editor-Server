import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    default: 'Untitled'
  },
  password: {
    type: String,
    select: false
  }
}, {
  timestamps: true
});

export const RoomModel = mongoose.model('Room', roomSchema);