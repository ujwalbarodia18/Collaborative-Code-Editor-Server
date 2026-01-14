declare module 'y-websocket/bin/utils' {
  import { IncomingMessage } from 'http';
  import WebSocket from 'ws';

  export function setupWSConnection(
    conn: WebSocket,
    req: IncomingMessage,
    opts?: {
      docName?: string;
      gc?: boolean;
      doc?: any;
    }
  ): void;
}