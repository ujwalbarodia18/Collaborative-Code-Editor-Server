import { nanoid } from "nanoid"
import { RoomModel } from "../models/room.model";

// export function createRoom() {
//     const roomId = nanoid();
//     return { roomId, createdAt: Date.now() };
// }

interface RoomDetails {
    name?: string;
    password?: string;
}
export async function createRoom(roomDetails : RoomDetails) {
    const { name, password } = roomDetails;
    const created = await RoomModel.create({
        roomId: nanoid(),
        name,
        password
    });

    const room = await RoomModel.findById(created._id);
    return room;
}

export async function getRoom(roomId: string, password: string) {    
    const room = await RoomModel.findOne({roomId});
    return room;
}

export async function isRoomPasswordProtected(roomId: string) {
    const room = await RoomModel.findOne({roomId: roomId, password: { $exists: true }});
    return !!room;
}

