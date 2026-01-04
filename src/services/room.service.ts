import * as Y from 'yjs';
import { ROOM_AUTOSAVE_INTERVAL } from '../constants';
import { RoomModel } from '../models/room.model';
import { IncomingMessage } from 'http';

export class roomService {
    static docs = new Map<string, Y.Doc>();
    static connections = new Map<string, number>();
    static isSavingLock = false;

    static initializeAutoSave() {    
        setInterval(() => this.saveAllActiveRooms() , ROOM_AUTOSAVE_INTERVAL)
    }

    static async saveAllActiveRooms() {
        if (this.isSavingLock) return;
        this.isSavingLock = true;
        
        try {
            const saves = [];
            for (const [roomId, doc] of this.docs.entries()) {
                saves.push(this.saveRoom(roomId, doc));
            }
            await Promise.allSettled(saves);
        }
        finally {
            this.isSavingLock = false;
        }        
    }

    static async saveRoom(roomId: string, doc: Y.Doc) {
        try {
            const update = Y.encodeStateAsUpdate(doc);

            await RoomModel.updateOne(
                { roomId },
                {
                    ydoc: Buffer.from(update),
                    lastUpdatedAt: new Date()
                }
            );
        } catch (err) {
            console.error(`Failed to autosave room ${roomId}`, err);
        }
    }

    static extractRoomIdFromReq(req: IncomingMessage) {
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

    static setDocMapping(roomId: string, doc: Y.Doc) {
        this.docs.set(roomId, doc);
    }

    static getDoc(roomId: string) {
        return this.docs.get(roomId);
    }

    static incrementConnection(roomId: string) {
        this.connections.set(roomId, (this.connections.get(roomId) ?? 0) + 1);
    }

    static async loadDoc(roomId: string): Promise<Y.Doc> {
        const doc = new Y.Doc();

        const room = await RoomModel.findOne({ roomId });

        if (room?.ydoc) {
            Y.applyUpdate(doc, room.ydoc);
        }

        return doc;
    }

    static async handleDisconnect(roomId: string) {
        const count = (this.connections.get(roomId) ?? 1) - 1;

        if (count <= 0) {
            const doc = this.docs.get(roomId);
            if (doc) {
                this.saveRoom(roomId, doc);
                this.docs.delete(roomId);
                this.connections.delete(roomId);
            }
        } else {
            this.connections.set(roomId, count);
        }
    }
}