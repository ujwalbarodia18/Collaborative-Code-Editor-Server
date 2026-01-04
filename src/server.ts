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

const { setupWSConnection } = require('y-websocket/bin/utils') as {
  setupWSConnection: (
    conn: WebSocket,
    req: IncomingMessage,
    opts?: {
      docName?: string;
      gc?: boolean;
      doc?: any;
    }
  ) => void;
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

roomService.initializeAutoSave();

wss.on('connection', async (conn: WebSocket, req) => {  
  const roomId = roomService.extractRoomIdFromReq(req);

  const doc = roomService.getDoc(roomId) ?? await roomService.loadDoc(roomId);
  roomService.setDocMapping(roomId, doc);
  roomService.incrementConnection(roomId);

  setupWSConnection(conn, req, {
    docName: roomId,
    gc: true,
    doc
  });

  conn.on('close', () => {
    roomService.handleDisconnect(roomId);
  });
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`WebSocket running on ws://localhost:${PORT}`);
});