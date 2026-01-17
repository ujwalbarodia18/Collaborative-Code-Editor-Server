import express from 'express';
import roomRoutes from './routes/room.route';
import authRoutes from './routes/auth.route';
import cors from 'cors';
import { connectMongo } from './db/mongo';
import { errorHandler } from './middlewares/error.middleware';
import commonRoutes from './routes/common.route';
import http, { IncomingMessage } from 'http';
import WebSocket from 'ws';
import { roomService } from './services/room.service';
import * as Y from 'yjs';
import { RoomModel } from './models/room.model';
import dotenv from 'dotenv';
dotenv.config();

const { setupWSConnection, setPersistence } = require('y-websocket/bin/utils') as {
  setupWSConnection: (
    conn: WebSocket,
    req: IncomingMessage,
    opts?: {
      docName?: string;
      gc?: boolean;
      doc?: any;
      persistence?: any;
    }
  ) => void,
  setPersistence: any
};

connectMongo().then().catch();

const app = express();
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(o => o.trim());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/room', roomRoutes);
app.use('/auth', authRoutes);
app.use('/common', commonRoutes);

app.use(errorHandler);

const server = http.createServer(app);
const wss = new WebSocket.Server({ 
  server,
  verifyClient: (info, done) => {
    const origin = info.origin;

    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      return done(true);
    }

    return done(false, 403, 'Forbidden');
  }
});

wss.on('connection', async (conn: WebSocket, req) => {
  const roomId = roomService.extractRoomIdFromReq(req);
  setupWSConnection(conn, req, {
    gc: true,
    // docName: roomId,
    // persistence,
  });
})

setPersistence({
  bindState: async (docName: string, ydoc: Y.Doc) => {
    const room = await RoomModel.findOne({ roomId: docName });

    if (room?.ydoc) {
      Y.applyUpdate(ydoc, new Uint8Array(room.ydoc));
    }

    ydoc.on('update', async () => {
      await roomService.saveRoom(docName, ydoc);
    });
  },

  writeState: async (docName: string, ydoc: Y.Doc) => {
    await roomService.saveRoom(docName, ydoc);
  }
});

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`WebSocket running on ws://localhost:${PORT}`);
});