import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  ydoc: {
    type: Buffer,
    default: null
  },
  name: {
    type: String,
    default: 'Untitled'
  },
  password: {
    type: String,
    select: false
  },
  lastUpdatedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

export const RoomModel = mongoose.model('Room', roomSchema);