declare module 'y-websocket/bin/utils' {
  import WebSocket from 'ws';
  import http from 'http';

  export function setupWSConnection(
    conn: WebSocket,
    req: http.IncomingMessage,
    options?: any
  ): void;
}
