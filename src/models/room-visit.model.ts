import mongoose from "mongoose";

const roomVisitSchema = new mongoose.Schema(
    {
        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room',
            require: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            require: true
        },
        lastVisited: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const RoomVisitModel = mongoose.model('RoomVisit', roomVisitSchema);