import * as Y from 'yjs';
import { nanoid } from "nanoid"
import { RoomModel } from '../models/room.model';
import { RoomVisitModel } from '../models/room-visit.model';
import { ErrorFramework } from '../utils/error';
import mongoose, { PipelineStage, Types } from 'mongoose';
import { UserModel } from '../models/user.model';
import { DEFAULT_ROOM_NAME } from '../constants';

interface RoomDetails {
    roomName?: string;
    password?: string;
    roomId?: string;
}

export class roomService {
    static async createRoom(roomDetails : RoomDetails) {
        const { roomName, password } = roomDetails;
        const created = await RoomModel.create({
            roomId: nanoid(),
            name: roomName || DEFAULT_ROOM_NAME,
            ...(password ? {password} : {})
        });

        const room = await RoomModel.findById(created._id);
        if (!room) {
            throw new ErrorFramework('Room not found something went wrong', 500);
        }
        return room;
    }

    static async getRoom(roomDetails: RoomDetails) {
        const { roomId, password } = roomDetails;
        if (!roomId) {
            throw new ErrorFramework('Provide room id.', 400);
        }
        const room = await RoomModel.findOne({ roomId }).select('+password');
        if (!room) {
            throw new ErrorFramework('No such room exists.', 400);            
        }
        if (room?.password && room?.password !== password) {
            throw new ErrorFramework('Incorrect password.', 403);
        }
        return room;
    }

    static async updateRoomVisit(roomId: string | Types.ObjectId, userId: string | Types.ObjectId) {
        const room = roomId instanceof Types.ObjectId ? roomId : (await RoomModel.findOne({ roomId }).select('_id'))?.id;
        const user = userId instanceof Types.ObjectId ? userId : (await UserModel.findById(userId).select('_id'))?._id;
        if (!user || !room) {
            throw new ErrorFramework('Invalid room and user', 400);
        }

        await RoomVisitModel.updateOne(
            { user: user, room: room },
            {
                $set: { lastVisited: new Date() },
                $setOnInsert: {
                    user,
                    room
                }
            },
            { upsert: true }
        );
    }

    static async isRoomPasswordProtected(roomId: string) {
        if (!roomId) {
            throw new ErrorFramework('Please provide room id.', 400);
        }
        const room = await RoomModel.findOne({roomId: roomId, password: { $exists: true }});
        return !!room;
    }

    static async saveRoom(roomId: string, doc: Y.Doc) {
        if (!roomId || !doc) {
            throw new ErrorFramework('Provide roomId and doc.', 400);
        }
        const updatedDoc = Y.encodeStateAsUpdate(doc);
        const patch = {
            ydoc: Buffer.from(updatedDoc),
            lastUpdatedAt: new Date()
        }
        await RoomModel.updateOne(
            { roomId },
            { $set: patch },
            { upsert: true }
        );
    }

    static async getRecentlyVisitedRooms(userId: string) {
        const aggregateQuery = [
            {
                $match: { user: new mongoose.Types.ObjectId(userId) }
            },
            {
                $lookup: {
                    from: 'rooms',
                    localField: 'room',
                    foreignField: '_id',
                    as: 'room'
                }
            },
            {
                $unwind: '$room'
            },
            {
                $sort: { updatedAt: -1 }
            },
            { 
                $replaceRoot: { newRoot: '$room' } 
            },
            {
                $project: {
                    name: 1,
                    roomId: 1,
                    lastUpdatedAt: 1
                }
            }
        ] as PipelineStage[];

        const rooms = await RoomVisitModel.aggregate(aggregateQuery);
        return rooms;
    }

    static extractRoomIdFromReq(req: any) {
        if (!req.url) {
            throw new Error('Missing request URL');
        }

        // req.url looks like "/roomId" or "/roomId?token=xyz"
        const pathname = req.url.split('?')[0];

        // remove leading slash
        const roomId = pathname.replace('/', '');

        if (!roomId) {
            throw new Error('Invalid roomId');
        }

        return roomId;
    }
}