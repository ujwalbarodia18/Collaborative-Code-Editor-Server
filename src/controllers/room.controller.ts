import { nanoid } from "nanoid"
import { RoomModel } from "../models/room.model";
import { asyncHandler } from "../utils/helper";
import { Request, Response } from "express";
import { roomService } from "../services/room.service";
import { ObjectId } from "mongoose";

// export function createRoom() {
//     const roomId = nanoid();
//     return { roomId, createdAt: Date.now() };
// }

interface RoomDetails {
    name?: string;
    password?: string;
}
// export async function createRoom(roomDetails : RoomDetails) {
//     const { name, password } = roomDetails;
//     const created = await RoomModel.create({
//         roomId: nanoid(),
//         name,
//         password
//     });

//     const room = await RoomModel.findById(created._id);
//     return room;
// }

// export async function getRoom(roomId: string, password: string) {    
//     const room = await RoomModel.findOne({roomId});
//     return room;
// }

// export async function isRoomPasswordProtected(roomId: string) {
//     const room = await RoomModel.findOne({roomId: roomId, password: { $exists: true }});
//     return !!room;
// }

// export const getRoom = asyncHandler(
//     async (req: Request, res: Response) => {
//         const { roomId, password, userId } = req.body;
//         const room = await getRoom(roomId, password);
//         res.status(201).json({ status: 1, data: room });
//     }
// )

// export const 
// export const getRoomController = asyncHandler(
//     async () => {

//     }
// );

// export const isRoomPasswordProtectedController = asyncHandler(
//     async() => {}
// )

// export const getRecentVisitedRoomsController = asyncHandler(
//     async (req: Request, res: Response) => {
//         const { userId } = req.body;
//         const rooms = await roomService.getRecentlyVisitedRooms(userId);

//         return rooms;
//     }
// );

export class roomController {
    static createRoom = asyncHandler(
        async (req: Request, res: Response) => {
            const { roomName, password } = req.body;
            const room = await roomService.createRoom({roomName, password});
            res.status(201).json({ status: 1, data: room });
        }
    );

    static getRoom = asyncHandler(
        async (req: Request, res: Response) => {
            const { roomId, password, userId } = req.body;
            const room = await roomService.getRoom({ roomId, password });
            if (room) {
                const roomId = room._id;
                await roomService.updateRoomVisit(roomId, userId);
            }

            res.status(201).json({ status: 1, data: room });
        }
    );

    static isRoomPasswordProtected = asyncHandler(
        async(req: Request, res: Response) => {
            const { roomId } = req.body;
            const isPasswordProtected = await roomService.isRoomPasswordProtected(roomId);
            
            res.status(201).json({ status: 1, data: isPasswordProtected });
        }
    );

    static getRecentlyVisitedRooms = asyncHandler(
        async (req: Request, res: Response) => {
            const { userId } = req.body;
            const rooms = await roomService.getRecentlyVisitedRooms(userId);

            res.status(201).json({ status: 1, data: rooms });
        }
    );
}