// import WebSocket from "ws";

// export class WebsocketService {
//     wss = new WebSocket.Server({ server });
//     wss.on('connection', async (conn, req) => {
//     const roomId = extractRoomId(req);

//     let doc = docs.get(roomId);

//     if (!doc) {
//         doc = await loadDoc(roomId);
//         docs.set(roomId, doc);
//         connections.set(roomId, 0);
//     }

//     connections.set(roomId, (connections.get(roomId) ?? 0) + 1);

//     setupWSConnection(conn, req, {
//         docName: roomId,
//         gc: true,
//         doc
//     });

//     conn.on('close', () => {
//         handleDisconnect(roomId);
//     });
//     });
// }
