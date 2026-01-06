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
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

app.use('/room', roomRoutes);
app.use('/auth', authRoutes);
app.use('/common', commonRoutes);

app.use(errorHandler);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', async (conn: WebSocket, req) => {
  setupWSConnection(conn, req, {
    gc: true
  });
})

setPersistence({
  bindState: async (docName: any, ydoc: any) => {
    const room = await RoomModel.findOne({ roomId: docName });

    if (room?.ydoc) {
      Y.applyUpdate(ydoc, new Uint8Array(room.ydoc));
    }

    ydoc.on('update', async () => {
      roomService.saveRoom(docName, ydoc);
    });
  },

  writeState: async (docName: any, ydoc: any) => {
    roomService.saveRoom(docName, ydoc);
  }
});
const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`WebSocket running on ws://localhost:${PORT}`);
});