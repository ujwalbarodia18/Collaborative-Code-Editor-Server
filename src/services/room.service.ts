import * as Y from 'yjs';
import { RoomModel } from '../models/room.model';

export class roomService {
    static async saveRoom(roomId: string, doc: Y.Doc) {
        try {
            const update = Y.encodeStateAsUpdate(doc);
                await RoomModel.updateOne(
                  { roomId },
                  { ydoc: Buffer.from(update), lastUpdatedAt: new Date() },
                  { upsert: true }
                );
        } catch (err) {
            console.error(`Failed to autosave room ${roomId}`, err);
        }
    }
}